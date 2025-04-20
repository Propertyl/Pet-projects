import { ReactElement, Ref, useEffect, useRef, useState } from "react";
import { chatData, DefaultRef, statusInfo } from "./types/global";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../types/global";
import { io, Socket } from "socket.io-client";
import { setData } from "../store/user";
import parseToDeleteGroup from "./functions/parseChatGroups";
import getLastMessage from "./functions/getLastChatMessage";
import chatAfterRefresh from "./functions/getChatAfterRefresh";
import useFormatter from "./functions/dateFormatter";
import triggerEffect from "./functions/bubbleEffect";
import useObserver from "./functions/groupObserver";
import parseDate from "./functions/parseDate";
import parseMessageTime from "./functions/parseMessageTime";
import './styles/chat.css';
import serv from "./functions/interceptors";
import MessageEyes from "./messageSeen";

const Chat = ({room}:{room:string}) => {

  const [chatData,setChatData] = useState<chatData | any>(null);
  const [groups,setGroups] = useState<ReactElement[]>([])
  const messagesRef:DefaultRef = useRef(null);
  const userData = useSelector((state:Store) => state.user);
  const userName = userData.additionalData.name;
  const [currentMessage,setCurrentMessage] = useState<string>("");
  const [downButton,setDownButton] = useState<boolean>(false);
  const downButtonRef = useRef(downButton);
  const socket:Ref<Socket | null> = useRef(null);
  const dispatch = useDispatch();
  const setObserver:Ref<any> = useRef(null);

  const searchScroll = (event:Event) => {
    if(event.target) {
      const chat = event.target as HTMLDivElement;
      const currentHeight = chat.scrollTop;
      const chatRect = chat.getBoundingClientRect();
      const scrollHeight = chat.scrollHeight - chatRect.height;

      if(scrollHeight - currentHeight > 80 && !downButtonRef.current) {
         setDownButton(true);
      } else if(scrollHeight - currentHeight < 80 && downButtonRef.current) {
         setDownButton(false);
      }
    }
  };


useEffect(() => {
   downButtonRef.current = downButton;
},[downButton]);

useEffect(() => {
  socket.current = io('http://localhost:3000/app',{
    withCredentials:true
  });

},[])

useEffect(() => {
  const setupPage = async () => {  
      if(socket.current) {

        setObserver.current = useObserver({threshold:1},socket.current);

        socket.current.on('userUpdates',(info:statusInfo) => {
          dispatch(setData({field:'changedUser',value:info}));
        });
      
        socket.current.on('updateChat',(currentChat:any) => {
          setChatData(parseToDeleteGroup(currentChat['all']));
          const newChats = userData.allChats.map(chat => {
            if(chat.id === room) {
              const currentLast = getLastMessage(currentChat);
              chat = {id:chat.id,...currentLast};
            }
      
            return chat;
          });
      
          dispatch(setData({field:'allChats',value:newChats}));
          connectObservers();
           
        });
      }
  }

  setupPage();
  if(messagesRef.current) {
    messagesRef.current.addEventListener('scroll',searchScroll);
  }

  return () => {
    if(messagesRef.current) {
      messagesRef.current.removeEventListener('scroll',searchScroll);
    }

    socket.current?.off();
  }

},[socket.current,userData.allChats]);

useEffect(() => {
  if(messagesRef.current) {
    scrollDown();
  }
},[messagesRef.current])


useEffect(() => {
  const tryGetChat = async () => {  
    if(window.location.href.includes('@') && !chatData) {
      await chatAfterRefresh(dispatch);
    }
  }

  tryGetChat ();
},[chatData]);

useEffect(() => {
   const spawnGroups = () => {
      if(chatData) {
        const groups = [];

        for(const [index,date] of Object.entries(chatData)) {
          groups.push(
            <div className="container container-reverse group-container" key={`group-${index}`}>
              <span className="date-container">
                  <p className="group-date">{parseDate(Object.keys(date as any).pop(),userData.locale,userData.allMonth)}
                  </p>
              </span>
              {/* @ts-ignore */}
              {Object.values(date).pop()!.groups.map((groupData:any,groupIdx:number) => {
                 const groups:any = [];
                 
                 for(const [groupName,group] of Object.entries(groupData) as [string,any]) {
                    groups.push(
                        <div className={`message-group ${group.sender === userName ? 'group-right' : 'group-left'}`} key={`group-${groupIdx}`} data-group-name={groupName}>
                        {group.messages.map((message: any, index: number) => (
                          <div
                            className={`message ${group.sender !== userName ? 'not-user-message' : ''}`}
                            key={`message-${groupIdx}-${index}`}>
                              {index === group.messages.length - 1 && (
                                <svg viewBox="0 0 30 30" width="30" height="30" className="message-tail chat-message-tail">
                                  <path xmlns="http://www.w3.org/2000/svg" id="Vector 1" d="M1 1C4.68182 6.06135 15.8364 16 31 15.2638C20.1818 17.5474 1 27.0736 2.96364 31" />
                                </svg>
                              )}
                            <p className="message-body">{message.body}</p>
                            <div className="message-additional-info">
                              <p className="message-time">{parseMessageTime(message.time)}</p>
                              {group.sender === userName && <MessageEyes seen={group.seen}/>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                 }

                 return groups;
              })}
            </div>
          );
        }

        setGroups(groups);
      }
   }

   spawnGroups();
},[chatData]);

const scrollDown = (behavior:'smooth' | 'instant' = 'instant') => {
  if(messagesRef.current) {
    messagesRef.current.scrollTo({top:messagesRef.current.scrollHeight,behavior:behavior});
    setDownButton(false);
  }
}

const sendMessageToChat = () => {
  if(currentMessage.length) {
    const date = new Date();
    const formatter = useFormatter(userData.locale);
    socket.current!.emit('sendMessage',{room:room,
      message:{user:userName,body:currentMessage,time:formatter.format(date),seen:false}});
    setCurrentMessage('');
    setTimeout(() => scrollDown('smooth'),100);
  }
}

const startSending = (event:any,type:"input" | "button") => {
    if(type === "input" && event.key === "Enter") {
      triggerEffect(event);
      sendMessageToChat();
      return;
    } else if(type === "button") {
      triggerEffect(event);
      sendMessageToChat();
    }
}

const connectObservers = () => {
  const groups = document.querySelectorAll('.group-left');
  setObserver.current(groups);
}

useEffect(() => {
    if(userData.allChats.length) {
      userData.allChats.forEach(room => {
        socket.current?.emit('joinRoom',room.id);
      });
    }
},[userData.allChats]);

useEffect(() => {
   const getChat = async () => {
      if(room) {
        const roomChat:{messages:any} = await serv.get(`/chat/chatID/${room}`);
        setChatData(parseToDeleteGroup(roomChat.messages['all']));
        setTimeout(connectObservers,100);
      }
   }

   getChat();
},[room]);

  return (
      <>
      <div className="chat">
        { chatData && 
          <>
            <div className="messages-container">
            {downButton && 
              <button className="classic-button down-button" onClick={() => scrollDown()}>
                <i className="arrow-icon icon"></i>
              </button>
            }
            <div ref={messagesRef} className="messages">
              <div className="messages-group-container">
                { chatData && groups}
              </div>
            </div>
            <div className="messages-input">
              <div className="type-message-container">
                <input value={currentMessage} onChange={(event) => setCurrentMessage(event.target.value)} onKeyDown={(event) => startSending(event,'input')} placeholder="Message" className="message-input" type="text" />
                <svg viewBox="0 0 30 30" width="30" height="30" className="message-tail">
                  <path xmlns="http://www.w3.org/2000/svg" id="Vector 1" d="M1 1C4.68182 6.06135 15.8364 16 31 15.2638C20.1818 17.5474 1 27.0736 2.96364 31" />
                </svg>
              </div>
            {/* <button onClick={(event) => startSending(event,'button')} className="classic-button messages-button">
              <svg className="send-icon" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" fill="none" stroke="#000000">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
            <g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> </g>
              </svg>
            </button> */}
          </div>
        </div>
      </>
      }
    </div>
  </>
  )
}

export default Chat;
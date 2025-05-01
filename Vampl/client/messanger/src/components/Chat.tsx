import { ReactElement, Ref, useEffect, useRef, useState } from "react";
import { chatData, DefaultRef, statusInfo } from "./types/global";
import { useDispatch, useSelector } from "react-redux";
import { MessagesData, Store } from "../types/global";
import {Socket } from "socket.io-client";
import { setData } from "../store/user";
import parseToDeleteGroup from "./functions/parseChatGroups";
import useFormatter from "./functions/dateFormatter";
import useObserver from "./functions/groupObserver";
import './styles/chat.css';
import serv from "./functions/interceptors";
import spawnGroups from "./functions/spawnMessageGroups";
import ContextMenu from "./ContextMenu";
import { setDeleteChat } from "../store/chat";

const Chat = ({room,socket}:{room:string,socket:Socket | null}) => {
  const [chatData,setChatData] = useState<chatData | any>(null);
  const [groups,setGroups] = useState<ReactElement[]>([])
  const messagesRef:DefaultRef = useRef(null);
  const deleteArgs = useSelector((state:Store) => state.chat.deleteArgs);
  const deleteChat = useSelector((state:Store) => state.chat.deleteChat);
  const userData = useSelector((state:Store) => state.user);
  const userName = userData.additionalData.name;
  const [currentMessage,setCurrentMessage] = useState<string>("");
  const [downButton,setDownButton] = useState<boolean>(false);
  const downButtonRef = useRef(downButton);
  const dispatch = useDispatch();
  const setObserver:Ref<any> = useRef(null);
  const [placeholder,setPlaceholder] = useState<boolean>(true);
  const [contextMenu,setContextMenu] = useState<boolean>(false);
  const [contextMenuPos,setContextMenuPos] = useState<{x:number,y:number}>({x:0,y:0});

  const setUnreadMessage = (date:string,groupName:string,room:string,body:string) => (el:HTMLDivElement) => {
      if(el) {
        setObserver.current(el,date,groupName,room,body);
      }
  }

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
  }

useEffect(() => {
   downButtonRef.current = downButton;
},[downButton]);

useEffect(() => {
  if(deleteChat) {
    socket!.emit('delete-chat',deleteChat);
    dispatch(setDeleteChat(""));
  }
},[deleteChat])

useEffect(() => {
  const setupPage = async () => {  
    console.log('socket:',socket?.connected);
        setObserver.current = useObserver({threshold:1},socket);

        socket!.on('userUpdates',(info:statusInfo) => {
          dispatch(setData({field:'changedUser',value:info}));
        });
      
        socket!.on('updateChat',(currentChat) => {
          console.log('current:',currentChat);
          setChatData(parseToDeleteGroup(currentChat['all']));
        });

        socket!.on('joinedRoom',(room) => {
           console.log('sucefull:',room);
        });
  }

  setupPage();

  if(messagesRef.current) {
    messagesRef.current.addEventListener('scroll',searchScroll);
  }

  return () => {
    if(messagesRef.current) {
      messagesRef.current.removeEventListener('scroll',searchScroll);
    }
  }

},[socket]);

// useEffect(() => {
//   if(userData.allChats) {
//     userData.allChats.map(chat => {
//       console.log('join to room:',chat.id);
//       socket?.emit('joinRoom',chat.id);
//     });
//   }
// },[userData.allChats])

useEffect(() => {
  if(messagesRef.current) {
    scrollDown();
  }
},[messagesRef.current])

useEffect(() => {
  spawnGroups(chatData,userData,userName,room,setUnreadMessage,setGroups,
  setContextMenu,
  setContextMenuPos,
  dispatch
  );
},[chatData]);

const scrollDown = (behavior:'smooth' | 'instant' = 'instant') => {
  if(messagesRef.current) {
    messagesRef.current.scrollTo({top:messagesRef.current.scrollHeight,behavior:behavior});
    setDownButton(false);
  }
}

const sendMessageToChat = () => {
  if(currentMessage.length && socket) {
    const date = new Date();
    const formatter = useFormatter(userData.locale);
    console.log('so:',socket.connected);
    socket!.emit('sendMessage',{room:room,
      message:{user:userName,body:currentMessage,time:formatter.format(date),seen:false}});
    setCurrentMessage('');
    setTimeout(() => scrollDown('smooth'),100);
  }
}

const startSending = (event:React.KeyboardEvent<HTMLElement>) => {
  const input = event.target as HTMLDivElement;
    if( event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      sendMessageToChat();

      input.innerText = "";
      messageWriting(event);

      setTimeout(() => {
        input.focus();
  
        const range = document.createRange();
        const sel = window.getSelection();
  
        range.setStart(input, 0);
        range.collapse(true); 
  
        sel?.removeAllRanges();
        sel?.addRange(range);
      },0);
    }
    
    if(event.shiftKey && event.key === "Enter" && !input.innerText.trim().length) {
      event.preventDefault();
    }
}

const messageWriting = (event:any) => {
  if(event.target.innerText.trim().length) {
      setPlaceholder(false);
  } else {
      setPlaceholder(true);
  }

  setCurrentMessage(event.target.innerText);
}

const blurInput = (event:any) => {
    if(!event.target.innerText.trim().length) {
        setPlaceholder(true);
    }
}

const messagePaste = (event:ClipboardEvent | any) => {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text/plain');

    const selection = window.getSelection();
    if(!selection?.rangeCount) return;


    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(pasted));
    
    setPlaceholder(false);
    setCurrentMessage(pasted);
    return;
}

const setDeletedMessage = (deleteArgs:MessagesData) => () => {
  socket!.emit('message-delete',deleteArgs);
}

useEffect(() => {
   if(messagesRef.current) {
    if(contextMenu) {
      messagesRef.current.classList.add('hidden');
    } else if(messagesRef.current.classList.contains('hidden')) {
      messagesRef.current.classList.remove('hidden');
    }
   }
},[contextMenu,messagesRef])

useEffect(() => {
   const getChat = async () => {
      if(room) {
        const roomChat:{messages:any} = await serv.get(`/chat/chatID/${room}`);
        setChatData(parseToDeleteGroup(roomChat.messages['all']));
      }
   }

   getChat();
},[room]);

  return (
    <>
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
              {
                contextMenu && <ContextMenu phrase="Delete" switchState={setContextMenu} pos={contextMenuPos} func={() => setDeletedMessage(deleteArgs)}/>
              }
            </div>
            <div className="messages-input">
              <div className="type-message-container">
                <div className="message-input">
                    <div onPaste={messagePaste} autoFocus contentEditable={true} onInput={messageWriting} onBlur={blurInput} onKeyDown={(event) => startSending(event)}  className="chat-input-area">
                    </div>
                    <span style={{display:placeholder ? "flex" : "none"}} contentEditable={false}className="chat-input-area-placeholder">
                        Message
                    </span>
                    <svg viewBox="0 0 30 30" width="30" height="30" className="message-tail">
                      <path xmlns="http://www.w3.org/2000/svg" id="Vector 1" d="M1 1C4.68182 6.06135 15.8364 16 31 15.2638C20.1818 17.5474 1 27.0736 2.96364 31" />
                    </svg>
                </div>
              </div>
          </div>
        </div>
      </>
      }
    </>
  )
}

export default Chat;
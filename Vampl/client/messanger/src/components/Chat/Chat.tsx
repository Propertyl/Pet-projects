import {RefObject,useEffect, useRef, useState} from "react";
import {ChatStructure, ChatText, DateGroup, defaultCoords, DefaultRef,MessageJSXGroups,ObserverProps, RefFunc} from "../types/global";
import { useDispatch, useSelector } from "react-redux";
import { MessagesData, Store, UserData } from "../types/global";
import {Socket } from "socket.io-client";
import parseToDeleteGroup from "./functions/parseChatGroups";
import useFormatter from "../global-functions/dateFormatter";
import './chat.css';
import ContextMenu from "../subComponents/ContextMenu";
import { ChatProcess } from "./functions/spawnMessageGroups";
import { chatApi } from "../../store/api/chatApi";
import useObserver from "./functions/groupObserver";
import waitTick from "./functions/waitTick";
import updateChatContent from "./functions/updateChatContent";
import queryRequest from "../global-functions/queryRequest";
import useGetPageText from "../global-functions/getPageText";

const Chat = ({room,socket}:{room:string,socket:React.RefObject<Socket | null>}) => {
  const [roomChat,setRoomChat] = useState<ChatStructure | null>(null);
  const [chatData,setChatData] = useState<DateGroup[] | null>(null);
  const [groups,setGroups] = useState<MessageJSXGroups>([])
  const messagesRef:DefaultRef = useRef(null);
  const deleteArgs = useSelector((state:Store) => state.chat.deleteArgs);
  const userData:UserData = useSelector((state:Store) => state.user);
  const userName = userData.userName;
  const [currentMessage,setCurrentMessage] = useState<string>("");
  const [downButton,setDownButton] = useState<boolean>(false);
  const downButtonRef = useRef(false);
  const chatEndedRef:RefObject<boolean> = useRef(false);
  const cantUpdateRef:RefObject<boolean> = useRef(false);
  const groupsSpawner:RefObject<RefFunc<[]>> = useRef(null);
  const dispatch = useDispatch();
  const setObserver:RefObject<RefFunc<[HTMLDivElement,ObserverProps]>> = useRef(null);
  const [placeholder,setPlaceholder] = useState<boolean>(true);
  const [contextMenu,setContextMenu] = useState<boolean>(false);
  const [contextMenuPos,setContextMenuPos] = useState<defaultCoords>({x:0,y:0});
  const [pageText,setPageText] = useState<ChatText | null>(null);
  const chatProcess:RefObject<ChatProcess | null> = useRef(null);

  const setUnreadMessage = (props:ObserverProps) => (el:HTMLDivElement) => {
    if(el && setObserver.current) {
      setObserver.current(el,props);
    }
  }

  const searchScroll = (event:Event) => {
    if (event.target) {
      const chat = event.target as HTMLDivElement;
      const currentScrollTop = chat.scrollTop;

      const chatRect = chat.getBoundingClientRect();
      const scrollHeight = chat.scrollHeight - chatRect.height;
      if (scrollHeight - currentScrollTop > 80 && !downButtonRef.current) {
        setDownButton(true);
      } else if (scrollHeight - currentScrollTop < 80 && downButtonRef.current) {
        setDownButton(false);
      }
      if (currentScrollTop < 50 && !chatEndedRef.current && !cantUpdateRef.current) {
        cantUpdateRef.current = true;
        updateChatContent(chat,groupsSpawner,cantUpdateRef);
      }
    }
  }

  const handleUpdatingChat = ({currentChat,currentTime}:{currentChat:ChatStructure,currentTime:string,currentGroup?:string}) => {
    if(chatData) {
      const [groupDate] = currentTime.split(',');
      const findGroup = <T,>(group:T) => {
        if(group) {
          const [currentDate] = Object.keys(group);
          return currentDate === groupDate;
        }
      }
      setGroups(groups => {
        const newGroups = [...groups];
        const all:DateGroup[] = currentChat['all'];
        const allGroup = all.find(findGroup);
        const parsed = parseToDeleteGroup(allGroup);
        const pushGroup = () => newGroups.push({
          [groupDate]:chatProcess.current!.spawnGroup(all.length + 1,parsed)
        });
        if(groups.length) {
          const groupToUpdate = newGroups.findIndex(findGroup);

          if(groupToUpdate >= 0 && allGroup) {
            newGroups[groupToUpdate] = {
              [groupDate]:chatProcess.current!.spawnGroup(all.length,parsed)
            }
          } else if(groupToUpdate >= 0 && allGroup === undefined) {
            newGroups.splice(groupToUpdate,1);
          } else {
            pushGroup();
          }
          setChatData(currentChat.all);
          return newGroups;
        }

        pushGroup();
        return newGroups;
      });
    }
  }

  useGetPageText<ChatText>(setPageText,'chat',dispatch);

  useEffect(() => {
    const getRoomChat = async () => {
      if(room) {
        await queryRequest(chatApi,'getChatData',{url:'chatID',param:room},dispatch,true);
        const chid = await queryRequest(chatApi,'getChatData',{url:'chatID',param:room},dispatch,true);
        setRoomChat(chid);
      }

      chatProcess.current = null;
      setGroups([]);
      groupsSpawner.current = null;
      setChatData(null);
    }

    getRoomChat();
  },[room]);

  // useEffect(() => {
  //   if(roomChat) {
  //     chatProcess.current = null;
  //     setGroups([]);
  //     groupsSpawner.current = null;
  //     setChatData(null);
  //   }
  // },[roomChat]);

  useEffect(() => {
    if(messagesRef.current && roomChat) {
      messagesRef.current.classList.add('messages-hidden');
    }
  },[messagesRef,roomChat]);

  useEffect(() => {
    if(roomChat) {
      setChatData(roomChat.all);
    }
  },[roomChat]);

  useEffect(() => {
    downButtonRef.current = downButton;
  },[downButton]);

  useEffect(() => {
    const setupPage = async () => {  
        if(socket.current) {
          setObserver.current = useObserver({threshold:1},socket.current,dispatch);
        
          socket.current.on('updateChat',handleUpdatingChat);
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

      socket.current?.off('updateChat',handleUpdatingChat);
    }

  },[messagesRef.current]);

  const revealMessages = () => {
    if(messagesRef.current && messagesRef.current.classList.contains('messages-hidden')) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      messagesRef.current.classList.remove('messages-hidden');
    }
  }

  const spawnUntilScroll = async () => {
    const chat = messagesRef.current;
    await waitTick();
    if(chat.scrollHeight === chat.clientHeight && !chatEndedRef.current) {
      if(groupsSpawner.current) {
        groupsSpawner.current();
      }

      await waitTick();
      scrollDown('instant');
      return spawnUntilScroll();
    }

    revealMessages();
  }

  useEffect(() => {
    if(chatData && !chatProcess.current) {
      chatProcess.current = new ChatProcess(chatData,userData,userName,room,setUnreadMessage,setGroups,setContextMenu,setContextMenuPos,chatEndedRef,dispatch);
    }
  },[chatData,chatProcess]);

  useEffect(() => {
    const initiateGroups = async () => {
      if(chatData && !groups.length && chatProcess.current) {
        await chatProcess.current.getUserPhone();
        groupsSpawner.current = chatProcess.current.spawnGroups();

        groupsSpawner.current();
        await waitTick();
        scrollDown();
        await spawnUntilScroll();
      }
    }

    initiateGroups();
  },[chatData,chatProcess]);

  const scrollDown = (behavior:'smooth' | 'instant' = 'instant') => {
    if(messagesRef.current) {
      messagesRef.current.scrollTo({top:messagesRef.current.scrollHeight,behavior:behavior});
      setDownButton(false);
    }
  }

  const sendMessageToChat = () => {
    if(currentMessage.length && socket) {
      const date = new Date();
      const formatter = useFormatter();
      socket.current!.emit('sendMessage',{room:room,
        message:{body:currentMessage,time:formatter.format(date),seen:false}});
      setCurrentMessage('');
      setTimeout(() => scrollDown('smooth'),200);
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
        
          range.setStart(input,0);
          range.collapse(true); 
        
          sel?.removeAllRanges();
          sel?.addRange(range);
        },0);
      }

      if(event.shiftKey && event.key === "Enter" && !input.innerText.trim().length) {
        event.preventDefault();
      }
  }

  const messageWriting = (event:React.FormEvent) => {
    const target = event.target as HTMLDivElement;
    if(target.innerText.trim().length) {
      setPlaceholder(false);
    } else {
      setPlaceholder(true);
    }

    setCurrentMessage(target.innerText);
  }

  const blurInput = (event:React.FocusEvent) => {
    const target = event.target as HTMLDivElement;
      if(!target.innerText.trim().length) {
        setPlaceholder(true);
      }
  }

  const messagePaste = (event:React.ClipboardEvent) => {
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
    socket.current!.emit('message-delete',deleteArgs);
  }

  // useEffect(() => {
  //    if(messagesRef.current) {
  //     if(contextMenu) {
  //       messagesRef.current.classList.add('hidden');
  //     } else if(messagesRef.current.classList.contains('hidden')) {
  //       messagesRef.current.classList.remove('hidden');
  //     }
  //    }
  // },[contextMenu,messagesRef,roomChat]);

  return (
    <>
        {chatData && 
          <>
            <div className="messages-container container">
            <div ref={messagesRef} className="messages messages-hidden">
              <div className="messages-group-container">
                {chatData && groups.map((group) => {
                  const [jsx] = Object.values(group);
                  return jsx;
                })}
              </div>
              {
                contextMenu && <ContextMenu phrase={pageText?.context_menu.delete ?? '...'} switchState={setContextMenu} pos={contextMenuPos} func={() => setDeletedMessage(deleteArgs)}/>
              }
            </div>
            <div className="messages-input">
              {downButton && 
                <button className="classic-button down-button" onClick={() => scrollDown()}>
                  <i className="arrow-icon button-icon"></i>
                </button>
              }
              <div className="type-message-container">
                <div className="message-input">
                    <div onPaste={messagePaste} autoFocus contentEditable={true} onInput={messageWriting} onBlur={blurInput} onKeyDown={(event) => startSending(event)}  className="chat-input-area">
                    </div>
                    <span style={{display:placeholder ? "flex" : "none"}} contentEditable={false} className="chat-input-area-placeholder">
                      {pageText?.message_input ?? '...'}
                    </span>
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
import {ReactElement ,ReactNode,RefObject, useCallback, useEffect, useRef, useState} from "react";
import {ChatStructure, DefaultRef} from "./types/global";
import { useDispatch, useSelector } from "react-redux";
import { MessagesData, Store, UserData } from "../types/global";
import {Socket } from "socket.io-client";
import parseToDeleteGroup from "./functions/parseChatGroups";
import useFormatter from "./functions/dateFormatter";
import useObserver from "./functions/groupObserver";
import './styles/chat.css';
import ContextMenu from "./subComponents/ContextMenu";
import { ChatProcess } from "./functions/spawnMessageGroups";
import findLastGroup from "./functions/findLastGroup";
import { useGetChatDataQuery } from "../store/api/chatApi";
import datePastCompare from "./functions/dateCompare";

const updateChatContent = (chat:HTMLDivElement,groupsSpawner:RefObject<any>,cantUpdateRef:RefObject<boolean>) => {
    const beforePos = chat.scrollHeight - chat.scrollTop;

    groupsSpawner.current();
    setTimeout(() => {
      chat.scrollTo({top:chat.scrollHeight - beforePos,behavior: "instant"});
      cantUpdateRef.current = false;
    },10);
}

const Chat = ({room,socket}:{room:string,socket:React.RefObject<Socket | null>}) => {
  const {data:roomChat} = useGetChatDataQuery({url:'chatID',param:room},{
    skip:!room
  });
  const parsedChat = roomChat?.all ? parseToDeleteGroup(roomChat['all']) : null;
  const [groups,setGroups] = useState<ReactElement[]>([])
  const messagesRef:DefaultRef = useRef(null);
  const deleteArgs = useSelector((state:Store) => state.chat.deleteArgs);
  const userData:UserData = useSelector((state:Store) => state.user);
  const userName = userData.userName;
  const [currentMessage,setCurrentMessage] = useState<string>("");
  const [downButton,setDownButton] = useState<boolean>(false);
  const downButtonRef = useRef(downButton);
  const chatEndedRef:RefObject<boolean> = useRef(false);
  const cantUpdateRef:RefObject<boolean> = useRef(false);
  const groupsSpawner:RefObject<any> = useRef(null);
  const dispatch = useDispatch();
  const setObserver:RefObject<any> = useRef(null);
  const [placeholder,setPlaceholder] = useState<boolean>(true);
  const [contextMenu,setContextMenu] = useState<boolean>(false);
  const [contextMenuPos,setContextMenuPos] = useState<{x:number,y:number}>({x:0,y:0});
  const chatProcess:RefObject<ChatProcess | null> = useRef(null);

const setUnreadMessage = (date:string,groupName:string,room:string,body:string) => (el:HTMLDivElement) => {
    if(el) {
      setObserver.current(el,date,groupName,room,body);
    }
}

const searchScroll = (event: Event) => {
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

const handleUpdatingChat = () => {
  let previousChat = roomChat;

  return (currentChat:ChatStructure) => {
    if(parsedChat) {
      setGroups(groups => {
        const newGroups:any[] = [...groups];
        const all:any = currentChat['all'];
        const parsed = parseToDeleteGroup(all[all.length - 1]);
        const pushGroup = () => newGroups.push([chatProcess.current!.spawnGroup(all.length + 1,parsed)]);
        if(groups.length) {
          const [groupDate] = Object.keys(parsed);
          const [previousGroupDate] = Object.keys(previousChat.all[findLastGroup(previousChat.all)]);
          if(groupDate === previousGroupDate) {
            const lastGroup:any[] = newGroups[newGroups.length - 1];
            const newLastGroup = [...lastGroup];
            newLastGroup[lastGroup.length - 1] = chatProcess.current!.spawnGroup(all.length,parsed);
            newGroups[newGroups.length - 1] = newLastGroup;
          } else if(datePastCompare(groupDate,previousGroupDate)) {
            pushGroup();
          } else if(currentChat.all.length < previousChat.all.length) {
            newGroups.pop();
          }

          previousChat = currentChat;
          return newGroups;
        }

        previousChat = currentChat;
        pushGroup();
        return newGroups;
      });
    }
  }
} 

useEffect(() => {
   downButtonRef.current = downButton;
},[downButton]);

useEffect(() => {
  const setupPage = async () => {  
      if(socket.current) {
        setObserver.current = useObserver({threshold:1},socket.current);
      
        socket.current.on('updateChat',handleUpdatingChat());
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

    socket.current?.off('updateChat',handleUpdatingChat());
  }

},[messagesRef.current])

const revealMessages = () => {
  if(messagesRef.current && messagesRef.current.classList.contains('messages-hidden')) {
      console.log('reveal');
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      messagesRef.current.classList.remove('messages-hidden');
  }
}

const spawnUntilScroll = useCallback(async () => {
  const chat = messagesRef.current;
  await new Promise((r) => requestAnimationFrame(r));
  if(chat.scrollHeight === chat.clientHeight && !chatEndedRef.current) {
    groupsSpawner.current();

    await new Promise((r) => requestAnimationFrame(r));
    scrollDown('instant');
    spawnUntilScroll();
  } else {
    revealMessages();
  }
},[messagesRef,chatEndedRef])

useEffect(() => {
  if(parsedChat && !chatProcess.current) {
    chatProcess.current = new ChatProcess(parsedChat,userData as any,userName,room,setUnreadMessage,setGroups,setContextMenu,setContextMenuPos,chatEndedRef,dispatch);
    chatProcess.current.getUserPhone();
  }
},[parsedChat,chatProcess.current])

useEffect(() => {
  const initiateGroups = async () => {
    if(parsedChat && !groups.length && chatProcess.current) {
      await chatProcess.current.getUserPhone();
      groupsSpawner.current = chatProcess.current.spawnGroups();

      groupsSpawner.current();
      await new Promise((r) => requestAnimationFrame(r));
      await spawnUntilScroll();
    }
  }

  initiateGroups();
},[parsedChat,chatProcess.current]);

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
  socket.current!.emit('message-delete',deleteArgs);
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

// useEffect(() => {
//    const getChat = async () => {
//       if(room) {
//         const roomChat:ChatStructure = await serv.get(`/chat/chatID/${room}`);
//         setChatData(parseToDeleteGroup(roomChat['all']));
//       }
//    }

//    getChat();
// },[room]);

  return (
    <>
        { parsedChat && 
          <>
            <div className="messages-container">
            <div ref={messagesRef} className="messages messages-hidden">
              <div className="messages-group-container">
                {parsedChat && groups}
              </div>
              {
                contextMenu && <ContextMenu phrase="Delete" switchState={setContextMenu} pos={contextMenuPos} func={() => setDeletedMessage(deleteArgs)}/>
              }
            </div>
            <div className="messages-input">
              {downButton && 
                <button className="classic-button down-button" onClick={() => scrollDown()}>
                  <i className="arrow-icon icon"></i>
                </button>
              }
              <div className="type-message-container">
                <div className="message-input">
                    <div onPaste={messagePaste} autoFocus contentEditable={true} onInput={messageWriting} onBlur={blurInput} onKeyDown={(event) => startSending(event)}  className="chat-input-area">
                    </div>
                    <span style={{display:placeholder ? "flex" : "none"}} contentEditable={false} className="chat-input-area-placeholder">
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
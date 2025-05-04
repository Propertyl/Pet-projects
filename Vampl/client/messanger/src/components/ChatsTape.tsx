import { useEffect, useState } from "react";
import { Chat, statusInfo, UserContact } from "./types/global";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../types/global";
import { convertStatus } from "./functions/convertStatus";
import getUserChats from "./functions/getUserChats";
import { setData } from "../store/user";
import triggerEffect from "./functions/bubbleEffect";
import checkActiveChat from "./functions/checkActiveChat";
import parseMessageTime from "./functions/parseMessageTime";
import './styles/chatsmenu.css';
import { changeRoom, switchBurger, switchUser } from "../store/useFullStaff";
import UserBurger from "./subComponents/UserBurger";
import ContextMenu from "./subComponents/ContextMenu";
import { setDeleteChat } from "../store/chat";
import { useNavigate } from "react-router";
import { Socket } from "socket.io-client";
import getLastMessage from "./functions/getLastChatMessage";
import not from '/notification.mp3';

const ChatsTape = ({socket}:{socket:React.RefObject<Socket | null>}) => {
  const router = useNavigate();
  const [chats,setChats] = useState<UserContact[]>([]);
  const [contactDefault,_] = useState<Boolean>(true);
  const [contextMenu,setContextMenu] = useState<boolean>(false);
  const [contextPos,setContextPos] = useState<{x:number,y:number}>({x:0,y:0});
  const [connectedToRooms,setConnectedToRooms] = useState<boolean>(false);
  const [deleteId,setDeleteId] = useState<string>("");
  const currentRoom = useSelector((state:Store) => state.stuff.currentRoom);
  const userData = useSelector((state:Store) => state.user);
  const dispatch = useDispatch();
  const notification:HTMLAudioElement = new Audio(not);
  
  const handleChangeStatus = (changedUser:statusInfo) => {
    setChats(chats => chats.map(chat => {
      if(chat.user.phone === changedUser.phone) {
        const updateUser = {...chat,user:{...chat.user,status:convertStatus(changedUser.status)}};
        return updateUser;
      }
      
      return chat;
    }))
  }

  const handleUpdateContacts = (currentChat:any,room:string) => {
    if(document.visibilityState === 'hidden') {
      notification.play();
    }
    
    setChats(chats => {
       const newChats = [...chats];
       
       for(let i:number = 0; i < newChats.length; i++) {
          if(newChats[i].id === room) {
            newChats[i] = {...newChats[i],message:getLastMessage({...currentChat})};
            break;
          }
       }

       return newChats;
    });

  }

  useEffect(() => {
    const setupPage = async () => {
      if(socket.current) {
        console.log('on');
        socket.current.on('updateContactChat',handleUpdateContacts);

        socket.current.on('userUpdates',handleChangeStatus);
      }
    }
    
    setupPage();

    return () => {
      console.log('off');
      socket.current!.off('userUpdates',handleChangeStatus);
      socket.current!.off('updateContactChat',handleUpdateContacts);
    }
  },[])

  useEffect(() => {
    if(userData.allChats.length && !connectedToRooms) {
      setConnectedToRooms(true);
      userData.allChats.map(chat => {
        socket.current?.emit('joinRoom',chat.id);
      });
    }
  },[userData.allChats,connectedToRooms])
  
  useEffect(() => {
    const checkChats = async () => {
      if(!chats.length) {
        const currentChats:UserContact[] = await getUserChats();
        setChats(currentChats);

        dispatch(setData({field:'allChats',value:currentChats}));
      }
    }

    checkChats();
  },[userData]);
    
  const openChat = (contact:UserContact) => {
    dispatch(changeRoom(contact.id));
  }

  const deleteChat = async (chatId:string) => {
    dispatch(setDeleteChat(chatId));
    setChats(chats.filter(contact => contact.id != chatId));
    if(currentRoom === chatId) {
        router('/');
        dispatch(changeRoom(''));
    }
  }

  const openContextMenu = (id:string) => (event:any) => {
    event.preventDefault();
    setContextMenu(true);
    setContextPos({x:event.clientX,y:event.clientY});
    setDeleteId(id);
  }

  return (
    <>
      <section className={`contact-tape ${!contactDefault ? "default" : ""}`}>
        <UserBurger/>
        <div style={{paddingTop:'.2rem'}} className="container flex-reverse">
        {contextMenu && <ContextMenu phrase="Delete Chat" func={(() => () => deleteChat(deleteId))} pos={contextPos} switchState={setContextMenu}/>}
          { chats.length ? chats.map((contact,index) => (
                <a draggable="false" onContextMenu={openContextMenu(contact.id)} className={`contact-container ${!contactDefault ? 'shortContact' : ''} ${currentRoom === contact.id && 'contact-chat-active'}`} href={`#@${contact.user.name}`} key={`contact-${index}`}>
                  <div onClick={(event:any) => {
                      triggerEffect(event);
                      checkActiveChat(window.location.href,contact.user.name) && openChat(contact);
                  }} className="container with-padding hidden-container">
                  <div className="status-picture-container">
                    { 
                    contact.user.image ?
                    <img onClick={() => {
                      dispatch(switchBurger());
                      dispatch(switchUser(contact.user.name))
                    }} className="contact-image" src={`${contact.user.image}`} alt="avatar" />
                    :
                    <div onClick={() => {
                      dispatch(switchBurger());
                      dispatch(switchUser(contact.user.name));
                    }} className="contact-image unknown-image" data-unknown-name={contact.user.name.split('').shift()}/> 
                    }
                  <span className={`contact-status ${contact.user.status === 'Online' ? 'online' : 'offline'}`}></span>
                </div>
                <div className="contact-info-container">
                <p  className="contact-name">{contact.user.name}</p>
                <p className="contact-chat-last-message">{contact.message.last}</p>
                <p className="contact-chat-message-time">{parseMessageTime(contact.message.time) }</p>
                </div>
              </div>
            </a>
        ))
        :
        <div className="contact-loading-container flex-center">
            <svg className="contact-line-loading" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none">
            <path d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612"  strokeWidth="3.55556" strokeLinecap="round"/>
            </svg>
        </div>
      }
          
      </div>
    </section>
    </>
  )
}


export default ChatsTape;
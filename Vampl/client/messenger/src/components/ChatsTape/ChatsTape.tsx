import { useEffect, useRef, useState } from "react";
import {ChatStructure, SetDispatch, statusInfo, UserContact,Store, DefaultRef, defaultCoords} from "../types/global";
import { useDispatch, useSelector } from "react-redux";
import getUserChats from "./functions/getUserChats";
import { setData } from "../../store/user";
import triggerEffect from "../global-functions/bubbleEffect";
import parseMessageTime from "../Chat/functions/parseMessageTime";
import './chatstape.css';
import { changeRoom, switchBurger, switchUser } from "../../store/useFullStaff";
import UserBurger from "../UserBurger/UserBurger";
import ContextMenu from "../subComponents/ContextMenu";
import { useNavigate } from "react-router";
import { Socket } from "socket.io-client";
import getLastMessage from "../global-functions/getLastChatMessage";
import not from '/notification.mp3';
import { titleSwapper } from "./functions/titleSwapper";
import { incrementMessages, switchRefreshChatsTape } from "../../store/chat";
import getUserPhone from "../global-functions/getUserPhone";
import textChanger from "../Navigation/functions/textChanger";

const makeShortVersion = (setContactDefault:SetDispatch<boolean>) => () => {
  const size = window.innerWidth;

  if(size < 1440 && size > 800) {
    setContactDefault(false);
  } else {
    setContactDefault(true);
  }
}

const ChatsTape = ({socket}:{socket:React.RefObject<Socket | null>}) => {
  const bubbleSpawner:DefaultRef = useRef(triggerEffect());
  const [chats,setChats] = useState<UserContact[]>([]);
  const [contactDefault,setContactDefault] = useState<boolean | null>(null);
  const [contextMenu,setContextMenu] = useState<boolean>(false);
  const [contextPos,setContextPos] = useState<defaultCoords>({x:0,y:0});
  const [connectedToRooms,setConnectedToRooms] = useState<boolean>(false);
  const [deleteId,setDeleteId] = useState<string>("");
  const currentRoom = useSelector((state:Store) => state.stuff.currentRoom);
  const userData = useSelector((state:Store) => state.user);
  const burgerUser = useSelector((state:Store) => state.stuff.userInBurger);
  const unReadMessage = useSelector((state:Store) => state.chat.unReadMessages);
  const refreshChatsTape = useSelector((state:Store) => state.chat.refreshChatsTape);
  const dispatch = useDispatch();
  const notification:HTMLAudioElement = new Audio(not);
  const handleTitleNotification = titleSwapper;
  const contactChanger = makeShortVersion(setContactDefault);
  const navigate = useNavigate();
  
  const handleChangeStatus = (changedUser:statusInfo) => {
    setChats(chats => chats.map(chat => {
      if(chat.user.phone === changedUser.phone) {
        const updateUser = {...chat,user:{...chat.user,status:changedUser.status}};
        return updateUser;
      }
      
      return chat;
    }));
  }

  const handleUpdateContacts = async (currentChat:ChatStructure,room:string,sendFromPhone:string) => {
    if(document.visibilityState === 'hidden') {
      notification.currentTime = 0;
      notification.play();
      handleTitleNotification();
    }

    const userPhone = await getUserPhone(dispatch);
    
    if(sendFromPhone !== userPhone) {
      dispatch(incrementMessages(room));
    }
    
    setChats(chats => {
       const newChats = [...chats];
       
       for(let i = 0; i < newChats.length; i++) {
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
        socket.current.on('updateContactChat',handleUpdateContacts);

        socket.current.on('userUpdates',handleChangeStatus);
      }

      contactChanger();

      window.addEventListener('resize',contactChanger);
    }
    
    setupPage();

    return () => {
      socket.current!.off('userUpdates',handleChangeStatus);
      socket.current!.off('updateContactChat',handleUpdateContacts);
      window.removeEventListener('resize',contactChanger);
    }
  },[]);

  useEffect(() => {
    if(userData.allChats.length && !connectedToRooms) {
      setConnectedToRooms(true);
      socket.current?.emit('joinRooms',userData.allChats);
    }
  },[userData.allChats,connectedToRooms]);
  
  useEffect(() => {
    const checkChats = async () => {
      if(!chats.length || refreshChatsTape) {
        const currentChats:UserContact[] = await getUserChats(dispatch);
        if(currentChats.length) {
          const rooms = currentChats.map(chat => chat.id);
          setChats(currentChats);
          dispatch(
            setData({field:'allChats',value:rooms})
          );
          dispatch(switchRefreshChatsTape(false));
        }
      }
    }

    checkChats();
  },[refreshChatsTape]);
    
  const openChat = (contact:UserContact) => (event:React.MouseEvent) => {
    navigate(`#@${contact.user.name}`);
    dispatch(changeRoom(contact.id));
    bubbleSpawner.current(event,true);
  }

  const deleteChat = async (chatId:string) => {
    socket.current!.emit('delete-chat',chatId);
    setChats(chats => {
      return chats.filter(chat => chat.id !== chatId);
    });
    if(currentRoom === chatId) {
      navigate('/');
      dispatch(changeRoom(''));
    }
  }

  const openContextMenu = (id:string) => (event:React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(true);
    setContextPos({x:event.clientX,y:event.clientY});
    setDeleteId(id);
  }

  return (
    <>
      <section className={`contact-tape ${contactDefault ? "contact-tape-full" : "contact-tape-short"} ${burgerUser ? 'contact-hidden' : 'contact-scrollable'}`}>
        {burgerUser && <UserBurger/>}
        <div className="contact-tape-container  flex-reverse">
          { contextMenu && 
            <ContextMenu phrase={textChanger('Видалити Чат','Delete Chat')} func={(() => () => deleteChat(deleteId))} 
            pos={contextPos} switchState={setContextMenu}/>
          }
          {chats.length ? chats.map((contact,index) => (
            <div draggable="false" onContextMenu={openContextMenu(contact.id)} className={`contact-container container ${contactDefault ? 'contact-container-fullContact' : 'contact-container-shortContact'} ${currentRoom === contact.id ? 'contact-chat-active' : 'contact-chat-inactive'}`} onClick={!contactDefault ? openChat(contact) : undefined} key={`contact-${index}`}>
              <div className="container hidden-container">
                  <div onClick={() => {
                        dispatch(switchBurger());
                        dispatch(switchUser(contact.user.name));
                      }} className="contact-user-container flex-center">
                      <div className="status-picture-container flex-center">
                        { contact.user.image 
                          ?
                          <img className="contact-image" src={`${contact.user.image}`} alt="avatar" />
                          :
                          <div className="contact-image unknown-image" data-unknown-name={contact.user.name.split('')[0]}></div> 
                        }
                        <span className={`contact-status ${contact.user.status ? 'online' : 'offline'}`}></span>
                      </div>
                  </div>
                  <div onClick={openChat(contact)} className="contact-info-container">
                      <p className="contact-name">{contact.user.name}</p>
                      <p className="contact-chat-last-message">{contact.message.last}</p>
                      <p className="contact-chat-message-time">{parseMessageTime(navigator.language.split('-')[0],contact.message.time)}</p>
                  </div>
                </div>
                  {unReadMessage[contact.id] > 0 &&
                    <span className="contact-unread-messages-container">
                      <p className="contact-unread-messages-count">   {unReadMessage[contact.id]}</p>
                    </span>
                  }
            </div>
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
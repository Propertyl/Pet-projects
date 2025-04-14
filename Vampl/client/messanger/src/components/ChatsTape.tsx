import {useCallback, useEffect, useState } from "react";
import { ParsedChat } from "./types/global";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../types/global";
import { convertStatus } from "./functions/convertStatus";
import getUserChats from "./functions/getUserChats";
import { setData } from "../store/user";
import serv from "./functions/interceptors";
import triggerEffect from "./functions/bubbleEffect";
import checkActiveChat from "./functions/checkActiveChat";
import parseMessageTime from "./functions/parseMessageTime";
import './styles/chatsmenu.css';

const ChatsTape = () => {
  const [chats,setChats] = useState<ParsedChat[]>([]);
  const [contactDefault,setContactDefault] = useState<Boolean>(true);
  const [activeChat,setActiveChat] = useState<string>("");
  const [currentHref,setCurrentHref] = useState<string>("");
  const currentChat = useSelector((state:Store) => state.user.currentChat);
  const changedUser = useSelector((state:Store) => state.user.changedUser);
  const userData = useSelector((state:Store) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if(currentChat && Object.keys(currentChat).length) {
      console.log("changed:",currentChat);
      setCurrentHref(window.location.href);
      setActiveChat(currentChat.user.name);
    }
  },[currentChat]);
  
  useEffect(() => {
     if(chats) {
        const {ip,status} = changedUser;
  
        for(let chat of chats) {
          if(chat.user.ip === ip) {
            chat.user.status = convertStatus(status);
          }
        }
     }
  },[changedUser]);
  
  useEffect(() => {
    const checkChats = async () => {
      if(userData.ip && !chats.length) {
        const currentChats = await getUserChats(userData,dispatch);
        setChats(currentChats);
      }
    }

    checkChats();
  },[userData]);
  
  const parseLast = useCallback((id:string) => {
    return userData.allChats.find(chat => chat.id === id);
  },[currentChat]);
  
  const openChat = async (contact:ParsedChat) => {
    const contactChat:any = await serv.get(`/chat/chatID/${contact.id}`);
  
    contact.messages = contactChat.messages;
    dispatch(setData({field:'currentChat',value:contact}));
  }

  return (
    <>
      <section className={`contact-tape ${!contactDefault ? "default" : ""}`}>
      {/* <UserBurger v-if="usefulStuff.burgerOpen" :isOpen="usefulStuff.burgerOpen"/> */}
        <div style={{paddingTop:'.2rem'}} className="container flex-reverse">
        { chats.length ? chats.map((contact,index) => (
              <a draggable="false" className={`contact-container ${!contactDefault ? 'shortContact' : ''} ${activeChat === contact.user.name && 'contact-chat-active'}`} href={`#@${contact.user.name}`} key={`contact-${index}`}>
                <div onClick={(event:any) => {
                    triggerEffect(event);
                    checkActiveChat(currentHref,contact.user.name) && openChat(contact);
                }} className="container with-padding hidden-container">
                <div className="status-picture-container">
                  <img className="contact-image" src={`${contact.user.image}`} alt="avatar" />
                  <span className={`contact-status ${contact.user.status === 'Online' ? 'online' : 'offline'}`}></span>
                </div>
                <div className="contact-info-container">
                <p  className="contact-name">{contact.user.name}</p>
                <p className="contact-chat-last-message">{parseLast(contact.id)?.last}</p>
                <p className="contact-chat-message-time">{parseMessageTime(parseLast(contact.id)?.time ?? "") }</p>
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
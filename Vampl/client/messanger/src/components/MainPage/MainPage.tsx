import { useDispatch, useSelector } from "react-redux";
import Chat from "../Chat/Chat";
import ChatsTape from "../ChatsTape/ChatsTape";
import Navigation from "../Navigation/Navigation";
import './home.css';
import '../Chat/chat.css';
import LoadingScreen from "../subComponents/LoadingScreen";
import { useEffect, useRef, useState } from "react";
import chatAfterRefresh from "../global-functions/getChatAfterRefresh";
import { io, Socket } from "socket.io-client";
import { SetDispatch, Store } from "../types/global";
import useCheckUserAuthorization from "../global-functions/checkUserAuthorization";
import { useNavigate } from "react-router";

const checkMobileSizing= (setIsMobile:SetDispatch<boolean>) => () => {
  if(window.innerWidth < 800) {
    setIsMobile(true);
  } else {
    setIsMobile(false);
  }
}

const chatMobileIsActive = (isMobile:boolean):boolean => {
  const currentChat = window.location.href.split('@')[1];
  return currentChat?.length > 0 && isMobile;
}

const MainPage = () => {
 const room = useSelector((state:Store) => state.stuff.currentRoom);
 const access = useSelector((state:Store) => state.stuff.approve);
 const dispatch = useDispatch();
 const socketConnection:React.RefObject<Socket | null> = useRef(null);
 const [connection,setConnection] = useState(false);
 const [isMobile,setIsMobile] = useState<boolean>(false);
 const navigate = useNavigate();
 const checkForMobile = checkMobileSizing(setIsMobile);

  useCheckUserAuthorization(dispatch,navigate);
 
  useEffect(() => {
   if(access) {
     const socket = io('http://localhost:3000/app',{
      withCredentials:true
      });

      socket.on('connect',() => {
          setConnection(true);
          socketConnection.current = socket;
      });

   }
  },[access]);

  useEffect(() => {
    document.title = "Vampl";
    checkForMobile();

    window.addEventListener('resize',checkForMobile);

    return () => {
      window.removeEventListener('resize',checkForMobile);
    }
    
  },[]);

  useEffect(() => {
    const tryGetChat = async () => {  
      if(window.location.href.includes('@') && access && !room) {
        await chatAfterRefresh(dispatch);
      }
    }

    tryGetChat();
  },[access]);

  return (
    <>
      { access ? 
        <>
            <header>
              <Navigation/>
            </header>
            {connection &&
              <main className={`chat-main ${isMobile ? 'chat-main-mobile' : ''}`}>
                <div className={`chats-tape ${isMobile ? 'chats-tape-mobile' : ''}`}>
                  <ChatsTape socket={socketConnection}/>
                </div>
                <div className={`chat ${isMobile ? 'chat-mobile' : ''} ${chatMobileIsActive(isMobile) ? 'chat-mobile-active' : ''}`}>
                  {isMobile && 
                    <button className="chat-hide-button flex-center" onClick={() => navigate('/')}>
                      <svg className="random-icon button-icon" width="64px" height="64px" viewBox="0 -6.5 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg"  fill="#da5050">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>left-arrow</title> <desc>Created with Sketch.</desc> <g id="icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="ui-gambling-website-lined-icnos-casinoshunter" transform="translate(-342.000000, -159.000000)" fill="#000000"  fillRule="nonzero"> <g id="square-filled" transform="translate(50.000000, 120.000000)"> <path d="M317.108012,39.2902857 L327.649804,49.7417043 L327.708994,49.7959169 C327.889141,49.9745543 327.986143,50.2044182 328,50.4382227 L328,50.5617773 C327.986143,50.7955818 327.889141,51.0254457 327.708994,51.2040831 L327.6571,51.2479803 L317.108012,61.7097143 C316.717694,62.0967619 316.084865,62.0967619 315.694547,61.7097143 C315.30423,61.3226668 315.30423,60.6951387 315.694547,60.3080911 L324.702666,51.3738496 L292.99947,51.3746291 C292.447478,51.3746291 292,50.9308997 292,50.3835318 C292,49.8361639 292.447478,49.3924345 292.99947,49.3924345 L324.46779,49.3916551 L315.694547,40.6919089 C315.30423,40.3048613 315.30423,39.6773332 315.694547,39.2902857 C316.084865,38.9032381 316.717694,38.9032381 317.108012,39.2902857 Z M327.115357,50.382693 L316.401279,61.0089027 L327.002151,50.5002046 L327.002252,50.4963719 L326.943142,50.442585 L326.882737,50.382693 L327.115357,50.382693 Z" id="left-arrow" transform="translate(310.000000, 50.500000) scale(-1, 1) translate(-310.000000, -50.500000) "> </  path> </g> </g> </g> </g>
                      </svg>
                    </button>
                  }
                  {room && <Chat socket={socketConnection} room={room}/>}
                </div>
              </main>
            }
        </>
        : <LoadingScreen/>
      }
    </>
  )
}

export default MainPage;
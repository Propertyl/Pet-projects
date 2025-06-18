import { useDispatch, useSelector } from "react-redux";
import Chat from "../Chat/Chat";
import ChatsTape from "../ChatsTape/ChatsTape";
import Navigation from "../Navigation/Navigation";
import './home.css';
import '../Chat/chat.css';
import { Store } from "../../types/global";
import LoadingScreen from "../subComponents/LoadingScreen";
import { useEffect, useRef, useState } from "react";
import chatAfterRefresh from "../global-functions/getChatAfterRefresh";
import { io, Socket } from "socket.io-client";

const MainPage = () => {
 const room = useSelector((state:Store) => state.stuff.currentRoom);
 const access = useSelector((state:Store) => state.stuff.approve);
 const dispatch = useDispatch();
 const socketConnection:React.RefObject<Socket | null> = useRef(null);
 const [connection,setConnection] = useState(false);
 
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
  },[access])

  useEffect(() => {
    document.title = "Vampl";
  },[])


  useEffect(() => {
    const tryGetChat = async () => {  
      if(window.location.href.includes('@') && access && !room) {
        await chatAfterRefresh(dispatch);
      }
    }

    tryGetChat();
  },[access])

  return (
    <>
      { access ? 
        <>
            <header>
              <Navigation/>
            </header>
            {connection &&
              <main className="chat-main">
                <ChatsTape socket={socketConnection}/>
                <div className="chat">
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
import { useDispatch, useSelector } from "react-redux";
import Chat from "../components/Chat";
import ChatsTape from "../components/ChatsTape";
import Navigation from "../components/Navigation";
import '../components/styles/home.css';
import '../components/styles/chat.css';
import { Store } from "../types/global";
import LoadingScreen from "../components/LoadingScreen";
import { Ref, useEffect, useRef, useState } from "react";
import chatAfterRefresh from "../components/functions/getChatAfterRefresh";
import { io, Socket } from "socket.io-client";

const MainPage = () => {
 const room = useSelector((state:Store) => state.stuff.currentRoom);
 const access = useSelector((state:Store) => state.stuff.approve);
 const dispatch = useDispatch();
 const socketConnection:Ref<Socket | null> = useRef(null);
 const [connection,setConnection] = useState(false);
 const userData = useSelector((state:Store) => state.user);

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
    const tryGetChat = async () => {  
      if(window.location.href.includes('@') && access && !room) {
        await chatAfterRefresh(dispatch);
      }
    }

    tryGetChat ();
  },[room,access])

  return (
    <>
      { access ? 
        <>
            <header>
              <Navigation/>
            </header>
            {connection &&
              <main className="chat-main">
                <ChatsTape socket={socketConnection.current}/>
                <div className="chat">
                  {room && <Chat socket={socketConnection.current} room={room}/>}
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
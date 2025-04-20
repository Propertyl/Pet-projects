import { useSelector } from "react-redux";
import Chat from "../components/Chat";
import ChatsTape from "../components/ChatsTape";
import Navigation from "../components/Navigation";
import '../components/styles/home.css';
import { Store } from "../types/global";
import { useEffect } from "react";

const MainPage = () => {
 const room = useSelector((state:Store) => state.stuff.currentRoom);
 const access = useSelector((state:Store) => state.stuff.approve);

 useEffect(() => {
    console.log("AAA:",access);
 },[access])
  return (
    <>
      { access && 
        <>
          <header>
            <Navigation/>
          </header>
          <main className="chat-main">
              <ChatsTape/>
              <Chat room={room}/>
          </main>
        </>
      }
    </>
  )
}

export default MainPage;
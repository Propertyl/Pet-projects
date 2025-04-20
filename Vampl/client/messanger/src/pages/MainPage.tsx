import { useSelector } from "react-redux";
import Chat from "../components/Chat";
import ChatsTape from "../components/ChatsTape";
import Navigation from "../components/Navigation";
import '../components/styles/home.css';
import { Store } from "../types/global";
import LoadingScreen from "../components/LoadingScreen";

const MainPage = () => {
 const room = useSelector((state:Store) => state.stuff.currentRoom);
 const access = useSelector((state:Store) => state.stuff.approve);

  return (
    <>
      { access ? 
        <>
          <header>
            <Navigation/>
          </header>
          <main className="chat-main">
              <ChatsTape/>
              <Chat room={room}/>
          </main>
        </>
        : <LoadingScreen/>
      }
    </>
  )
}

export default MainPage;
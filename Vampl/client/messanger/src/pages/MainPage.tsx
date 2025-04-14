import Chat from "../components/Chat";
import ChatsTape from "../components/ChatsTape";
import Navigation from "../components/Navigation";
import '../components/styles/home.css';

const MainPage = () => {
  return (
    <>
      <header>
        <Navigation/>
      </header>
      <main className="chat-main">
          <ChatsTape/>
          <Chat/>
      </main>
    </>
  )
}

export default MainPage;
import getLastMessage from "./getLastChatMessage";
import parsingChats from "./parsingChats";

const getUserChats = async (userData:any) => {
  const userChats = await fetch(`http://localhost:3000/user/chats/${userData.ip}`)
  .then(res => {
    return res.json();
  })
  .then(data => {
    return parsingChats(data,userData)
  });

  console.log('parsed chats:',userChats);

  userData.setAllChatsIp(userChats.map((chat:any) => {
    const currentLast = getLastMessage(chat.messages);
    return {id:chat.id,...currentLast};
  }));

  return userChats;
}

export default getUserChats;
import getLastMessage from "./getLastChatMessage";
import parsingChats from "./parsingChats";
import serv from "./interceptors";

const getUserChats = async (userData:any) => {
  const userChats = await serv.get(`/user/chats/${userData.ip}`)
  .then(data => parsingChats(data,userData));

  userData.setAllChatsIp(userChats.map((chat:any) => {
    const currentLast = getLastMessage(chat.messages);
    return {id:chat.id,...currentLast};
  }));

  return userChats;
}

export default getUserChats;
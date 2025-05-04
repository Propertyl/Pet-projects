import getLastMessage from "./getLastChatMessage";
import parsingChats from "./parsingChats";
import serv from "./interceptors";
import {UserContact } from "../types/global";

const getUserChats = async () => {
  const userChats:UserContact[] = await serv.get(`/chat/chats`)
  .then(({data,phone}:any) => parsingChats(data,phone))
  .then(chats => {
     const parsed = chats.map((chat:any) => {
        const currentLast = getLastMessage(chat.messages);
        delete chat.messages;
        chat.message = currentLast;
        return chat;
     });

     return parsed;
  });

  // const contacts = userChats.map((chat:any) => {
  //   const currentLast = getLastMessage(chat.messages);
  //   return {id:chat.id,...currentLast};
  // });

  // dispatch(setData({field:'allChats',value:contacts}));

  return userChats;
}

export default getUserChats;
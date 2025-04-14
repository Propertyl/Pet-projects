import getLastMessage from "./getLastChatMessage";
import parsingChats from "./parsingChats";
import serv from "./interceptors";
import { Dispatch } from "@reduxjs/toolkit";
import { setData } from "../../store/user";

const getUserChats = async (userData:any,dispatch:Dispatch) => {
  const userChats = await serv.get(`/user/chats/${userData.ip}`)
  .then(data => parsingChats(data,userData));

  const contacts = userChats.map((chat:any) => {
    const currentLast = getLastMessage(chat.messages);
    return {id:chat.id,...currentLast};
  });

  dispatch(setData({field:'allChats',value:contacts}));

  return userChats;
}

export default getUserChats;
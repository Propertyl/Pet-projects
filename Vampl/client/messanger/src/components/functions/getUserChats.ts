import getLastMessage from "./getLastChatMessage";
import parsingChats from "./parsingChats";
import serv from "./interceptors";
import { Dispatch } from "@reduxjs/toolkit";
import { setData } from "../../store/user";
import { ParsedChat } from "../types/global";

const getUserChats = async (phone:string,dispatch:Dispatch) => {
  const userChats:ParsedChat[] = await serv.get(`/chat/chats`)
  .then(data => parsingChats(data,phone));

  const contacts = userChats.map((chat:any) => {
    const currentLast = getLastMessage(chat.messages);
    return {id:chat.id,...currentLast};
  });

  dispatch(setData({field:'allChats',value:contacts}));

  return userChats.map((chat:any) => {
    delete chat.messages;
    return chat;
  });
}

export default getUserChats;
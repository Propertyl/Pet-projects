import getLastMessage from "./getLastChatMessage";
import parsingChats from "./parsingChats";
import serv from "./interceptors";
import {UserContact } from "../types/global";
import { Dispatch } from "@reduxjs/toolkit";
import unReadMessagesCounter from "./countUnReadMessages";
import { AxiosResponse } from "axios";

const getUserChats = async (dispatch:Dispatch) => {
  const userChats:UserContact[] = await serv.get(`/chat/chats`)
  .then(({data,phone}:any) => parsingChats(data,phone))
  .then(async (chats) => {
     const [userName] = await serv.get('/user/name')
     .then((res:AxiosResponse<{name:string}>) => Object.values(res));
     const parsed = chats.map((chat:any) => {
        unReadMessagesCounter(dispatch,chat.messages,userName);
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
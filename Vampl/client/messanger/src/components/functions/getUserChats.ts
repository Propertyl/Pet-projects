import getLastMessage from "./getLastChatMessage";
import parsingChats from "./parsingChats";
import {MessageGroup, UserContact } from "../types/global";
import unReadMessagesCounter from "./countUnReadMessages";
import { chatApi } from "../../store/api/chatApi";
import { AppDispatch } from "../../store/store";

const getUserChats = async (dispatch:AppDispatch) => {
  const userChats:UserContact[] = await dispatch(chatApi.endpoints.getChatData.initiate({url:'chats'})).unwrap()
  .then(async ({data,phone}:any) => ({
      chats:await parsingChats(data,phone,dispatch),
      phone
   }))
  .then(async ({chats,phone}:{chats:MessageGroup[] | undefined,phone:string}) => {
     if(chats) {
         const parsed = chats.map((chat:any) => {
            unReadMessagesCounter(dispatch,chat.messages,phone);
            const currentLast = getLastMessage(chat.messages);
            delete chat.messages;
            chat.message = currentLast;
            return chat;
         });

         return parsed;
      }

      return chats ?? [];
   });

  return userChats;
}

export default getUserChats;
import getLastMessage from "../../global-functions/getLastChatMessage";
import parsingChats from "../../Chat/functions/parsingChats";
import {MessageGroup, UserContact } from "../../types/global";
import unReadMessagesCounter from "./countUnReadMessages";
import { chatApi } from "../../../store/api/chatApi";
import { AppDispatch } from "../../../store/store";
import queryRequest from "../../global-functions/queryRequest";

const getUserChats = async (dispatch:AppDispatch) => {
  const userChats:UserContact[] = await queryRequest(chatApi,'getChatData',{url:'chats'},dispatch)
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
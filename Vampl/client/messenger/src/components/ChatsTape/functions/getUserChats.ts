import getLastMessage from "../../global-functions/getLastChatMessage";
import parsingChats from "../../Chat/functions/parsingChats";
import {ChatStructure, ParsedChat, UserContact } from "../../types/global";
import unReadMessagesCounter from "./countUnReadMessages";
import { chatApi } from "../../../store/api/chatApi";
import { AppDispatch } from "../../../store/store";
import queryRequest from "../../global-functions/queryRequest";

const getUserChats = async (dispatch:AppDispatch) => {
  const userChats:UserContact[] = await queryRequest(chatApi,'getChatData',{url:'chats'},dispatch,true)
  .then(async ({data,phone}:{data:ChatStructure[],phone:string}) => ({
      chats:await parsingChats(data,phone,dispatch) as (ParsedChat | null)[],
      phone
   }))
  .then(async ({chats,phone}:{chats:(ParsedChat | null)[] | undefined,phone:string}) => {
     if(chats) {
         const parsed:UserContact[] = chats
         .filter((chat):chat is ParsedChat => chat !== null)
         .map((chat:ParsedChat) => {
            const {messages,...newContactChat}:any = chat;
            unReadMessagesCounter(dispatch,chat.messages,phone,chat.id);
            const currentLast = getLastMessage(chat.messages);
            newContactChat.message = currentLast;
            return newContactChat;
         });

         return parsed;
      }

      return chats ?? [];
   });

  return userChats;
}

export default getUserChats;
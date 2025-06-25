import { Dispatch } from "@reduxjs/toolkit";
import { ChatStructure, Message} from "../../types/global";
import { incrementMessages } from "../../../store/chat";

const unReadMessagesCounter = (dispatch:Dispatch,chatMessages:ChatStructure,userPhone:string,chatId:string) => {
  const chat = chatMessages.all;
  let needToStop:boolean = false;

  for(let i:number = chat.length - 1; i >= 0; i--) {
    const [{groups}] = Object.values(chat[i]);
    if(needToStop) {
      break;
    }
    for(let j:number = groups.length - 1; j >= 0; j--) {
      const [{sender,messages}] = Object.values<{sender:string,messages:Message[]}>(groups[j]);
      for(let d:number = messages.length - 1; d >= 0; d--) {
        const message = messages[d];
        if(!message.seen && sender != userPhone) {
          console.log('sender:',sender);
          dispatch(incrementMessages(chatId));
        } else {
          needToStop = true;
          break;
        }
      }
    }
  }
}

export default unReadMessagesCounter;

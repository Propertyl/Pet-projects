import { Dispatch } from "@reduxjs/toolkit";
import { ChatStructure, Message} from "../../types/global";
import { incrementMessages } from "../../../store/chat";

const unReadMessagesCounter = (dispatch:Dispatch,chatMessages:ChatStructure,userPhone:string,chatId:string) => {
  const chat = chatMessages.all;

  done:for(let i = chat.length - 1; i >= 0; i--) {
    const [{groups}] = Object.values(chat[i]);
    
    for(let j = groups.length - 1; j >= 0; j--) {
      const [{sender,messages}] = Object.values<{sender:string,messages:Message[]}>(groups[j]);

      for(let d = messages.length - 1; d >= 0; d--) {
        const message = messages[d];

        if(!message.seen && sender != userPhone) {
          dispatch(incrementMessages(chatId));
          continue;
        }
        
        break done;
      }
    }
  }
}

export default unReadMessagesCounter;

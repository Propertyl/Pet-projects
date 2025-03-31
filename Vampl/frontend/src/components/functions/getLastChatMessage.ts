import { toRaw } from "vue";
import type { lastMessage } from "../../types/global";

const getLastMessage:lastMessage = (chat:any) => {
  if(!Object.keys(chat).length) {
    return {last:"Чат порожній",time:""};
  } 
  const currentDate:string = Object.keys(chat).pop() ?? "";
  const {groups} = chat[currentDate]; 
  console.log('oups:',toRaw(groups));
  if(groups.length) {
    const lastGroup = groups[groups.length - 1];
    let lastMessage = {body:"",time:""};
    if(lastGroup.messages) {
      const messages = lastGroup.messages;
      lastMessage = messages[messages.length - 1];
    } else {
      const {messages} = lastGroup[Object.keys(lastGroup).pop() ?? ""];
      lastMessage = messages[messages.length - 1];    
    }

    return {last:lastMessage.body,time:lastMessage.time};
  }
  
  return {last:"Чат порожній",time:""};
  
}

export default getLastMessage;
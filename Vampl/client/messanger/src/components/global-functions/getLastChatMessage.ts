import textChanger from "../Navigation/functions/textChanger";
import type { ChatStructure,lastMessage } from "../types/global";

const getLastMessage:lastMessage = (chat:ChatStructure) => {
  const currentChat = chat['all'];
  if(!currentChat.length) {
    return {last:textChanger("Чат порожній","Chat is Empty"),time:""};
  }
  
  const lastDateGroup:any = currentChat[currentChat.length - 1];
  const currentDate = Object.keys(lastDateGroup).pop() ?? '';
  const {groups} = lastDateGroup[currentDate]; 


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
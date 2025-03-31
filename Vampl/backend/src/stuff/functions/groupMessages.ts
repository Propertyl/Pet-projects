import {Chat, DateGroup, Message, messageChat, MessageGroup } from "../types";

const createGroup = ({user,body,time}:Message):MessageGroup => {
  return {
    sender:user,
    messages:[{body,time}]
  }
}

const createDataGroup = ():DateGroup => {
  return {
    groups:[]
  }
}

const groupSubMessages = (message:Message,chat:messageChat[]) => {
  if(!chat) return [];

  if(!chat.length) {
     chat.push(
      {[`${message.user}-0`]:createGroup(message)}
    );
     return chat;
  }

  const lastGroup:any = chat.map(chat => chat).pop();
  const [lastSender,number] = Object.keys(lastGroup).pop()!.split('-');
  console.log('current chat:',chat,'last:',lastSender,"number:",number);
  
  if(lastSender != message.user) {
    chat.push({[`${message.user}-${Number(number) + 1}`]:createGroup(message)});
    return chat;
  }

  chat[chat.length - 1]
  [`${lastSender}-${number}`]
  .messages.push({body:message.body,time:message.time});
  return chat;
}

const groupMessages = (message:Message,chat:Chat | undefined) => {
  if(!chat) return

  const date:string = message.time.split(',')[0];
  if(!Object.keys(chat).length) {
    chat[date as any] = createDataGroup();
  } 

  if(date != Object.keys(chat).pop()) {
    chat[date as any] = createDataGroup();
  }

  chat[date].groups = groupSubMessages(message,chat[date as any].groups);

  return chat;
}

export default groupMessages;


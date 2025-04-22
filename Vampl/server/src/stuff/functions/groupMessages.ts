import {Chat, DateGroup, Message, messageChat, MessageGroup } from "../types";

const createGroup = ({user,body,time,seen}:Message):MessageGroup => {
  return {
    sender:user,
    messages:[{body,time,seen}]
  }
}

const createDataGroup = ():DateGroup => {
  return {
    groups:[],
  }
}

const inSimpleView = (time:string) => {
 let [day,month,year] = time.split(/[.,\/]/);
  if(time.includes('/')) {
      const temp = day;
      day = month;
      month = temp;
  }

  return [day,month,year].join('.');
}; 

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
  
  if(lastSender != message.user) {
    chat.push({[`${message.user}-${Number(number) + 1}`]:createGroup(message)});
    return chat;
  }

  chat[chat.length - 1]
  [`${lastSender}-${number}`]
  .messages.push({body:message.body,time:message.time,seen:message.seen});
  return chat;
}

const groupMessages = (message:Message,chat:Chat | undefined) => {
  if(!chat) return

  const date:string = message.time.split(',')[0];
  const currentGroups = chat['all'];
  if(!currentGroups.length) {
    chat['all'].push({
      [date]:createDataGroup(),
    });
  }
  
  const lastDateGroup:any = currentGroups.map(item => item).pop();
  let lastDate = Object.keys(lastDateGroup).pop() ?? "";


  if(inSimpleView(date) != inSimpleView(lastDate)) {
    chat['all'].push({
      [date]:createDataGroup(),
    });

    lastDate = date;
  }

  const lastGroup = chat['all'][currentGroups.length - 1];

  lastGroup[lastDate].groups = groupSubMessages(message,lastGroup[lastDate].groups);

  return chat;
}

export default groupMessages;


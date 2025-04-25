interface Message {
  user:string,
  body:string,
  time:string,
  seen:boolean
};



interface DBChat {
  id:number,
  chatId:string,
  chatUsers:any,
  messages:any
};

type condition = 'view' | 'delete';

type Chat = {"all":Record<string,DateGroup>[]};

type updateChatData = {id:string,messages:MessageGroup};

type messageChat = Record<string,MessageGroup>;

interface DateGroup {
  groups:messageChat[]
}

interface MessageGroup {
  sender:string  
  messages:{body:string,time:string,seen:boolean}[]
};

interface chatData {
  chatId:string,
  chatUsers:{users:string[]},
  messages:any
}

interface updateMessagesData {
  date:string,
  group:string,
  room:string,
  body:string,
  time?:string
}

export {Message,MessageGroup,DBChat,Chat,DateGroup,messageChat,updateChatData,chatData,condition,updateMessagesData};
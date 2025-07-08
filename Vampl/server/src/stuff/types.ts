interface Message {
  user:string,
  body:string,
  time:string,
  seen:boolean
};

interface ChatStructure {
  all:DateGroup[]
}

interface DBChat {
  id:number;
  chatId:string;
  chatUsers:{users:string[]};
  messages:any;
};

type infoForUpdate = {name?:string,birthday?:string,image?:string,password?:string};

type condition = 'view' | 'delete';

type Chat = {all:Record<string,DateGroup>[]};

type updateChatData = {id:string,messages:MessageGroup};

type messageChat = Record<string,MessageGroup>;

interface DateGroup {
  groups:messageChat[];
}

interface MessageGroup {
  sender:string  ;
  messages:{body:string,time:string,seen:boolean}[];
}

interface User {
  name:string;
  phone:string;
  birthdate?:string;
  password:string;
  image?:string;
}

interface chatData {
  chatId:string;
  chatUsers:{users:string[]};
  messages:object;
}

interface updateMessagesData {
  date:string;
  group:string;
  room:string;
  body:string;
  time?:string;
}

export {ChatStructure,Message,MessageGroup,DBChat,Chat,DateGroup,messageChat,updateChatData,chatData,condition,updateMessagesData,infoForUpdate,User};
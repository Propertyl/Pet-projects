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

type Chat = {"all":Record<string,DateGroup>[]};

type updateChatData = {id:string,messages:MessageGroup};

type messageChat = Record<string,MessageGroup>;

interface DateGroup {
  groups:messageChat[]
}

interface MessageGroup {
  sender:string  
  messages:{body:string,time:string}[],
  seen:boolean
};

interface chatData {
  chatId:string,
  chatUsers:{users:string[]},
  messages:any
}

export {Message,MessageGroup,DBChat,Chat,DateGroup,messageChat,updateChatData,chatData};
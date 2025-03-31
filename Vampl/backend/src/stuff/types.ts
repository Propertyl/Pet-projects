interface Message {
  user:string,
  body:string,
  time:string
};



interface DBChat {
  id:number,
  chatId:string,
  chatUsers:any,
  messages:any
};

type Chat = Record<string,DateGroup>;

type messageChat = Record<string,MessageGroup>;

interface DateGroup {
  groups:messageChat[]
}

interface MessageGroup {
  sender:string  
  messages:{body:string,time:string}[]
};

export {Message,MessageGroup,DBChat,Chat,DateGroup,messageChat};
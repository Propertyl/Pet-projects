interface Chat {
  name:string,
  image:string,
  chat:any,
  id:string
}

interface UserData {
  ip:string,
  currentChat:any,
  additionalData:any,
  allChats:{id:string,last:string,time:string}[],
  allMonth:any
}

type lastMessage = (chat:any) => {last:string,time:string};

interface UserInfo {
  id:number,
  ip:string,
  name:string,
  email:string,
  phone:string,
  age:number,
  image:string,
  authorized:boolean
}

interface ParsedChat {
  user:{name:string,image:string},
  messages:{chat:any},
  id:string
}

interface MessageGroup {
  sender:string  
  messages:{body:string,time:string}[]
};

interface SignData {'phone':string,'name'?:string,'password:':string}

type AuthInputs = 'phone' | 'name' | 'password';



export {Chat,UserData,ParsedChat,MessageGroup,UserInfo,AuthInputs,SignData,lastMessage};
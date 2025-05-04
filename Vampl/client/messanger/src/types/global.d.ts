import type { Ref } from "vue";

interface Chat {
  name:string,
  image:string,
  chat:any,
  id:string
}

interface MessagesData {
  date:string,
  group:string,
  room:string,
  body:string,
  time:string
}

interface Store {
  user:UserData,
  stuff:{burgerOpen:Boolean,title:string,currentRoom:string,userInBurger:string,approve:boolean},
  chat:{deleteArgs:MessagesData,deleteChat:string}
}

interface UserData {
  ip:string,
  locale:string,
  currentChat:any,
  userName:string
  allChats:{id:string,last:string,time:string}[],
  allMonth:any,
  changedUser:any
}

type statusInfo = {ip:string,status:Boolean};

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

type chatData = Record<number,Record<string,DateGroup>>

interface DateGroup {
  groups:any
}

interface ParsedChat {
  user:{name:string,image:string,ip:string,status:string},
  messages:{all:any},
  id:string
}

interface MessageGroup {
  sender:string  
  messages:{body:string,time:string}[]
};

interface SignData {'phone':string,'name'?:string,'password':string,'ip':string}

type AuthInputs = 'phone' | 'name' | 'password' | 'incorrect';

type DefaultRef = Ref<HTMLDivElement | null>;


export {Chat,UserData,ParsedChat,MessageGroup,UserInfo,AuthInputs,SignData,lastMessage,statusInfo,DefaultRef,chatData,Store,MessagesData};
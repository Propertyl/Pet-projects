import { RefObject } from "react";

interface Chat {
  name:string,
  image:string,
  chat:ChatStructure,
  id:string
}

interface ChatStructure {
  all:DateGroup[]
}

interface UserData {
  locale:string,
  phone:string,
  userName:string,
  allChats:{id:string,last:string,time:string}[],
  allMonths:Record<number,string>,
}

interface ObserverProps {
  date:string,
  group:string,
  room:string,
  body:string,
  time:string
}

type statusInfo = {phone:string,status:boolean};

type lastMessage = (chat:ChatStructure) => {last:string,time:string};

interface UserInfo {
  id:number,
  name:string,
  phone:string,
  birthData:number,
  image:string,
}

interface BurgerInfo extends UserInfo {
  status:string
}

type chatData = Record<number,Record<string,DateGroup>>

interface DateGroup {
  groups:MessageGroup[]
}

interface ParsedChat {
  user:{name:string,image:string,ip:string,status:string,phone:string},
  messages:ChatStructure,
  id:string
}


interface UserContact {
  user:ParsedChat.user,
  message:{last:string,time:string},
  id:string
}



interface MessageGroup {
  sender:string  
  messages:Message[]
}

type SetDispatch<T> = Dispatch<SetStateAction<T>>;

type ElementRef<T> = RefObject<T | null>;

type Message = {body:string,time:string,seen:boolean};

interface SignData {'phone':string,'name'?:string,'password:':string}

type AuthInputs = 'phone' | 'name' | 'password' | 'incorrect';

type DefaultRef = Ref<HTMLDivElement | null>;

type DateValues = {day:number,month:number,year:number};

type queryArgs = {url:string,param?:any};

export {Chat,UserData,ParsedChat,MessageGroup,UserInfo,AuthInputs,SignData,lastMessage,statusInfo,DefaultRef,chatData,UserContact,BurgerInfo,ChatStructure,ElementRef,ObserverProps,DateGroup,DateValues,SetDispatch,queryArgs};
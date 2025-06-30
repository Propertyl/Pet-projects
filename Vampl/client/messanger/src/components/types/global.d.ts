import { ReactElement, RefObject } from "react";

interface Chat {
  name:string;
  image:string;
  chat:ChatStructure;
  id:string
}

interface ChatStructure {
  all:DateGroup[]
}

interface UserData {
  locale:string;
  phone:string;
  userName:string;
  allChats:{id:string,last:string,time:string}[];
  allMonths:{id:number,month:string}[];
  changedUser:Record<string,string>
}

interface ObserverProps {
  date:string;
  group:string;
  room:string;
  body:string;
  time:string
}

interface MessagesData {
  date:string;
  group:string;
  room:string;
  body:string;
  time:string
}

type EventType = 'touchstart' | 'touchend' | 'mousedown' | 'mouseup' | 'touchmove' | 'mousemove';

type statusInfo = {phone:string,status:boolean};

type lastMessage = (chat:ChatStructure) => {last:string,time:string};

interface UserInfo {
  id:number,
  name:string,
  phone:string,
  birthData:number,
  image:string,
}

interface dialogText {
  header:string,
  points:string[]
}

interface AuthText {
  inputs:{
    phone:string,
    name:string,
    password:string,
  },
  button:{
    move:string,
    end:string
  },
  title:string,
  dialog:{
    name:dialogText,
    password:dialogText
  },
  greetings:{
    start:string,
    newbie:string,
    old:string
  }
}

interface BurgerText {
  user_status:{
    online:string,
    offline:string
  },
  titles:{
    edit:string,
    confirm:string
  },
  inputs:{
    phone:string,
    birthday:string,
    name:string
  },
  additional_menu:string
}

interface ChatText {
  context_menu:{
    delete:string,
    delete_chat:string
  },
  message_input:string
}

interface BurgerInfo extends UserInfo {
  status:{
    text:string,
    class:string
  }
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

interface UserChats {
  chatId:string,
  chatUsers:{users:string[]},
  messages:ChatStructure
}

interface MessageGroup {
  sender:string  
  messages:Message[]
}

interface chatStates {
  deleteArgs:MessagesData,
  unReadMessages:Record<string,number>,
  refreshChatsTape:Boolean
}

interface Store {
  user:UserData,
  stuff:{burgerOpen:Boolean,title:string,currentRoom:string,userInBurger:string,approve:boolean},
  chat:chatStates
}

type SetDispatch<T> = Dispatch<SetStateAction<T>>;

type ElementRef<T> = RefObject<T | null>;

type Message = {
  body:string,
  time:string,
  seen:boolean
};

interface SignData {
  'phone':string,
  'name'?:string,
  'password':string
}

type RefFunc<Args> = null | ((...args:Args) => void);

type AuthInputs = 'phone' | 'name' | 'password' | 'incorrect';

type DefaultRef = Ref<HTMLDivElement | null>;

type DateValues = {day:number,month:number,year:number};

type queryArgs = {url:string,param?:any};

type defaultCoords = {x:number,y:number};

type GeneralThemes = 'light' | 'night' | '';

type MessageJSXGroups = Record<string,ReactElement>[];

export {
  Chat,UserData,ParsedChat,MessageGroup,UserInfo,AuthInputs,SignData,lastMessage,statusInfo,DefaultRef,chatData,UserContact,BurgerInfo,ChatStructure,ElementRef,ObserverProps,DateGroup,DateValues,SetDispatch,queryArgs,UserChats,AuthText,dialogText,BurgerText,ChatText,MessagesData,Store,RefFunc,Message,chatStates,EventType,defaultCoords,GeneralThemes,MessageJSXGroups
};
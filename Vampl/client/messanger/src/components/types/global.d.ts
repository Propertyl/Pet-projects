interface Chat {
  name:string,
  image:string,
  chat:ChatStructure,
  id:string
}

interface ChatStructure {
  all:DateGroup
}

interface UserData {
  locale:string,
  phone:string,
  currentChat:ChatStructure | null,
  userName:string,
  allChats:{id:string,last:string,time:string}[],
  allMonth:Record<number,string>,
  changedUser:Record<string,string>,
}

type statusInfo = {phone:string,status:boolean};

type lastMessage = (chat:ChatStructure) => {last:string,time:string};

interface UserInfo {
  id:number,
  name:string,
  phone:string,
  birthDate:number,
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

type Message = {body:string,time:string,seen:boolean};

interface SignData {'phone':string,'name'?:string,'password:':string}

type AuthInputs = 'phone' | 'name' | 'password' | 'incorrect';

type DefaultRef = Ref<HTMLDivElement | null>;


export {Chat,UserData,ParsedChat,MessageGroup,UserInfo,AuthInputs,SignData,lastMessage,statusInfo,DefaultRef,chatData,UserContact,BurgerInfo,ChatStructure}
import { Dispatch } from "@reduxjs/toolkit";
import { userApi } from "../../../store/api/baseApi";
import { dataApi } from "../../../store/api/dataApi";
import { UserInfo } from "../../types/global";
import queryRequest from "../../global-functions/queryRequest";

async function getUserInfo(phone:string,dispatch:Dispatch) {
  const data:UserInfo = await queryRequest(userApi,'getUserConvenientData',{url:'getInfoByPhone',param:phone},dispatch);
  const {status}:{status:boolean} = await queryRequest(dataApi,'getBurgerData',{url:'status',param:phone},dispatch);

  return {name:data.name,image:data.image,status:status,phone:data.phone};
}

const parsingChats = async (res:any,userPhone:string,dispatch:Dispatch) => {
  if(res.length) {
    const chats = await Promise.all(res.map(async (chat:any) => {
      const users = chat?.chatUsers?.users || [];
      const otherUserPhone = users.find((user:string) => user != userPhone);
      
      if(!otherUserPhone) return null;
      
      const chatUser = await getUserInfo(otherUserPhone,dispatch);
      
      return {
       user:chatUser,
       messages:chat.messages,
       id:chat.chatId
      }
    }));
 
   return chats.filter(Boolean);
  }  
}

 export default parsingChats;
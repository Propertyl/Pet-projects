import parsingChats from "./parsingChats";
import serv from "./interceptors";
import { Dispatch } from "@reduxjs/toolkit";
import { setData } from "../../store/user";

const chatAfterRefresh = async (userData:any,dispatch:Dispatch) => {
  const currentHref = window.location.href;
  if(currentHref.includes('@') && userData.currentChat && !Object.keys(userData.currentChat).length) {
    const openChat = currentHref.split('@')[1];
    const getOpenChat= await serv.get(`/user/chat/${openChat}`)
    .then(chat => parsingChats([chat],userData));     
    dispatch(setData({field:'currentChat',value:getOpenChat[0]}));
  }
}

export default chatAfterRefresh;
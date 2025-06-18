import { changeRoom } from "../../store/useFullStaff";
import { chatApi } from "../../store/api/chatApi";
import queryRequest from "./queryRequest";
import { Dispatch } from "@reduxjs/toolkit";

const chatAfterRefresh = async (dispatch:Dispatch) => {
  const currentHref = window.location.href;
    const openChat = currentHref.split('@')[1];
    const room = await queryRequest(chatApi,'getChatData',{url:'openChat',param:openChat},dispatch)
    .then((chat:{chatId:string}) => chat.chatId);   
    dispatch(changeRoom(room));
}

export default chatAfterRefresh;
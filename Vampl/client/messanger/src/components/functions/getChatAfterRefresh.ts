import serv from "./interceptors";
import { Dispatch } from "@reduxjs/toolkit";
import { changeRoom } from "../../store/useFullStaff";

const chatAfterRefresh = async (dispatch:Dispatch) => {
  const currentHref = window.location.href;
    const openChat = currentHref.split('@')[1];
    const room:{chatId:string} = await serv.get(`/chat/openChat/${openChat}`)
    .then((chat:any) => chat.chatId);   
    dispatch(changeRoom(room));
}

export default chatAfterRefresh;
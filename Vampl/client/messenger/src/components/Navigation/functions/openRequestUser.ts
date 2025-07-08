import { Dispatch } from "@reduxjs/toolkit";
import { UserChats } from "../../types/global";
import { chatApi } from "../../../store/api/chatApi";
import { changeRoom } from "../../../store/useFullStaff";
import queryRequest from "../../global-functions/queryRequest";
import { switchRefreshChatsTape } from "../../../store/chat";

const openRequestUser = async (userName:string,phone:string,dispatch:Dispatch) => {
  const {data:chats}:{data:UserChats[],phone:string} = await dispatch(chatApi.endpoints.getChatData.initiate({url:'chats'},{
    forceRefetch:true
  })).unwrap();
  const roomWithUser = chats.find(chat => chat.chatUsers.users.find(someUser => someUser === phone));
  if(roomWithUser) {
    window.location.href = `#@${userName}`;
    dispatch(changeRoom(roomWithUser.chatId));
  } else {
    console.log('created chat!');
    await queryRequest(chatApi,'setNewChat',{url:'',param:{chatUsers:{users:[phone]},messages:{'all':[]}}},dispatch);
    dispatch(switchRefreshChatsTape(true));
  }
}

export default openRequestUser;
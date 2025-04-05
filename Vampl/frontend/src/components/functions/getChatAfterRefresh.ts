import parsingChats from "./parsingChats";
import serv from "./interceptors";

const chatAfterRefresh = async (userData:any) => {
  const currentHref = window.location.href;
  if(currentHref.includes('@') && !Object.keys(userData.currentChat).length) {
    const openChat = currentHref.split('@')[1];
    const getOpenChat= await serv.get(`/user/chat/${openChat}`)
    .then(chat => parsingChats([chat],userData));     
    userData.setChat(getOpenChat[0]);
  }
}

export default chatAfterRefresh;
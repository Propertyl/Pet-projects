import parsingChats from "./parsingChats";

const chatAfterRefresh = async (userData:any) => {
  const currentHref = window.location.href;
  if(currentHref.includes('@') && !Object.keys(userData.currentChat).length) {
    const openChat = currentHref.split('@')[1];
    const getOpenChat = await fetch(`http://localhost:3000/user/chat/${openChat}`)
    .then(res => res.json())
    .then(chat => parsingChats([chat],userData));     
    userData.setChat(getOpenChat[0]);
  }
}

export default chatAfterRefresh;
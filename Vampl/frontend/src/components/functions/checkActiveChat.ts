
function checkActiveChat(link:string,linkUser:string) {
  const currentChat = link.split('@')[1]; 

  return currentChat != linkUser;
}

export default checkActiveChat
import { convertStatus } from "./convertStatus";

async function getUserInfo(id:string) {
  const data = await fetch(`http://localhost:3000/user/infoByIp/${id}`).then(user => user.json());
  const userStatus = await fetch(`http://localhost:3000/getData/status/${id}`)
  .then(data => data.json())
  .then(table => table.status);

  return {name:data.name,image:data.image,ip:id,status:convertStatus(userStatus)};
}

const parsingChats = async (res:any,userData:any) => {
  const chats = await Promise.all(res.map(async (chat:any) => {
    const users = chat?.chatUsers?.users || [];
    const otherUserIp = users.find((user:string) => user != userData.ip);
 
    if(!otherUserIp) return null;
 
    const chatUser = await getUserInfo(otherUserIp);
 
    return {
     user:chatUser,
     messages:chat.messages,
     id:chat.chatId
    }
   }));
 
   return chats.filter(Boolean);
 }

 export default parsingChats;
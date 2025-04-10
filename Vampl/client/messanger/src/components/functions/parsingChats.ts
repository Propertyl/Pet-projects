import { convertStatus } from "./convertStatus";
import serv from "./interceptors";

async function getUserInfo(id:string) {
  const data:{name:string,image:string} = await serv.get(`/user/infoByIp/${id}`);
  const userStatus:any = await serv.get(`/getData/status/${id}`)
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
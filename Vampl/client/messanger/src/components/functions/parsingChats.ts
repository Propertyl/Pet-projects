import { convertStatus } from "./convertStatus";
import serv from "./interceptors";

async function getUserInfo(phone:string) {
  const data:any = await serv.get(`/user/getInfoByPhone/${phone}`);
  const userStatus:any = await serv.get(`/getData/status/${phone}`)
  .then((table:any) => table.status);

  return {name:data.name,image:data.image,status:convertStatus(userStatus),phone:data.phone};
}

const parsingChats = async (res:any,userPhone:string) => {
  const chats = await Promise.all(res.map(async (chat:any) => {
    const users = chat?.chatUsers?.users || [];
    const otherUserPhone = users.find((user:string) => user != userPhone);
 
    if(!otherUserPhone) return null;
 
    const chatUser = await getUserInfo(otherUserPhone);
 
    return {
     user:chatUser,
     messages:chat.messages,
     id:chat.chatId
    }
   }));
 
   return chats.filter(Boolean);
 }

 export default parsingChats;
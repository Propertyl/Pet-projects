import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { chatData, infoForUpdate } from "src/stuff/types";

@Injectable()
export class UserService {
  constructor(private prisma:PrismaService) {}

  getUserByPhone(phone:string) {
    return this.prisma.user.findFirst({
      where: {
        phone:phone
      }
    })
  }

  getUserByName(userName:string) {
    return this.prisma.user.findFirst({
      where: {
        name:userName
      }
    })
  }

  getUserName(phone:string) {
    return this.prisma.user.findFirst({
      where:{
        phone:phone
      },
      select:{
        name:true
      }
    })
  }

  updateInfo(info:infoForUpdate,phone:string) {
    const data:infoForUpdate = {};

    console.log('info:',info);

    Object.keys(info).forEach(key => {
      const fieldValue = info[key as keyof infoForUpdate];
      if(fieldValue) {
        data[key as keyof infoForUpdate] = fieldValue
      }
    });
    
    return this.prisma.user.update({
      where:{
        phone:phone
      },
      data
    })
  }

  updateAvatar(phone:string,imageURL:string) {
   console.log('govno',imageURL);
   return this.prisma.user.update({
      where:{
        phone:phone
      },
      data:{
        image:imageURL
      }
    })
  }

  getChatById(id:string) {
    return this.prisma.chats.findFirst({
      where: {
        chatId:id
      },
      select: {
        messages:true
      }
    });
  }

  getMonthUA() {
    return this.prisma.monthUA.findMany();
  }

  getMonthEN() {
    return this.prisma.monthEN.findMany();
  }

  getChatByLink(users:string[]) {
     return this.prisma.chats.findFirst({
        where: {
          chatUsers: {
            path:"$.users",
            array_contains:users
          }
        },
        select:{
          chatId:true
        }
     })
  }

  updateChat({id,messages}:{id:string,messages:any}) {
    return this.prisma.chats.update({
      where: {
        chatId:id
      },
      data: {
        messages: messages
      }
    })
  }

  deleteChat(id:string) {
    return this.prisma.chats.delete({
      where:{
        chatId:id
      }
    })
  }
  
  getChatData(userPhone:string) {
    return this.prisma.chats.findMany({
      where: {
        chatUsers: {
          path:"$.users",
          array_contains:[userPhone]
        }
      }
    });
  }

  genChatID() {
    let id = "";
    for(let i:number = 0; i < 6; i++) {
      const symbol = String.fromCharCode(Math.floor(Math.random() * (91 - 65)) + 65);
      id += symbol;
    }

    return `chat-${id}`;
  }

  async createUserChat(userChats:chatData) {
     return this.prisma.chats.create({data:userChats})
  }


  async checkUser(data:{phone:string,password:string}) {
    console.log('data:',data);
    return this.prisma.user.findFirst({
      where: {
        phone:data.phone,
        password:data.password
      }
    })
  }

  async createUser(user:{name:string,phone:string,birthdate?:string,password:string,image?:string}) {
    user['image'] = '';
    await this.prisma.user.create({data:user as any})
    await this.prisma.onlineStatuses.create({data:{
      phone:user.phone,
      status:false
    }});
  }

  async updateStatus({phone,status}:{phone:string,status:boolean}) {
    return this.prisma.onlineStatuses.update({
      where: {
        phone:phone
      },
      data: {
        status:status
      }
    })
  }

  async getStatus(phone:string) {
     return this.prisma.onlineStatuses.findFirst({
        where:{
          phone:phone
        },
        select: {
          status:true
        }
     })
  }

  async getAllUserRooms(phone:string) {
    return this.prisma.chats.findMany({
      where: {
        chatUsers: {
          path:"$.users",
          array_contains:[phone]
        }
      }, 
      select: {
        chatId:true
      }
    })
  }

  async getUserTheme(phone:string) {
    console.log("THEME PHONE:",phone);
    return this.prisma.userTheme.findFirst({
      where:{
        phone:phone
      },
      select:{
        theme:true
      }
    })
  }

  async createUserTheme(data:{phone:string,theme:string}) {
    return this.prisma.userTheme.create({
      data:data
    })
  }

  async updateUserTheme({phone,theme}:{phone:string,theme:string}) {
    return this.prisma.userTheme.update({
      where:{
        phone:phone
      },
      data:{
        theme:theme
      }
    })
  }

}
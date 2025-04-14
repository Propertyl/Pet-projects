import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { chatData } from "src/stuff/types";

@Injectable()
export class UserService {
  constructor(private prisma:PrismaService) {}

  getAuthByIp(ip:string) {
    return this.prisma.auth.findFirst({
      where:{
        ip:ip
      },
      select: {
        authorized:true
      }
    });
  }

  getUserByIp(ip:string) {
    return this.prisma.user.findFirst({
      where: {
        ip:ip
      }
    })
  }

  getInfoByIP(ip:string) {
    return this.prisma.user.findFirst({
      where: {
        ip:ip
      },
      select: {
        phone:true
      }
    })
  }

  addAuthData(data:{ip:string,phone:string,authorized:boolean}) {
    return this.prisma.auth.create({
      data:data
    })
  }

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
  
  getChatData(userIp:string) {
    return this.prisma.chats.findMany({
      where: {
        chatUsers: {
          path:"$.users",
          array_contains:[userIp]
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

  async updateUserAuth(phone:string) {
    return this.prisma.auth.update({
       where: {
         phone:phone
       },
       data: {
         authorized:true
       }
    })
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

  async createUser(user:{ip:string,name:string,phone:string,birthdate?:string,password:string,image?:string}) {
    console.log("ti voobshe rabotaesh:",user);
    await this.prisma.user.create({data:user as any})
    await this.prisma.onlineStatuses.create({data:{
      phone:user.phone,
      status:false
    }});
  }

  async updateStatus(phone:string,currentStatus:boolean) {
   console.log('ip to update:',phone);
    return this.prisma.onlineStatuses.update({
      where: {
        phone:phone
      },
      data: {
        status:currentStatus
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

  async getAllUserRooms(ip:string) {
    return this.prisma.chats.findMany({
      where: {
        chatUsers: {
          path:"$.users",
          array_contains:[ip]
        }
      }, 
      select: {
        chatId:true
      }
    })
  }

  async getUserTheme(phone:string) {
    return this.prisma.userTheme.findFirst({
      where:{
        phone:phone
      },
      select:{
        theme:true
      }
    })
  }

  async createUserTheme(data:{phone:string}) {
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
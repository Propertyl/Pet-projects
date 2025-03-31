import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma:PrismaService) {}

  getAuthByIp(ip:string) {
    return this.prisma.auth.findFirst({
      where: {ip:ip}
    });
  }

  getUserByIp(ip:string) {
    return this.prisma.user.findFirst({
      where: {
        ip:ip
      }
    })
  }

  addAuthData(ip:string) {
    return this.prisma.auth.create({
      data:{
        ip:ip,
        authorized:false
      }
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

  async createUserChats(userChats:{chatId:string,chatUsers:{users:string[]},messages:any}) {
     return this.prisma.chats.create({data:userChats})
  }

  async updateUserAuth(ip:string) {
    return this.prisma.auth.update({
       where: {
         ip:ip
       },
       data: {
         authorized: true
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
    this.prisma.user.create({data:user as any});
    this.prisma.onlineStatuses.create({data:{
      ip:user.ip,
      status:false
    }})
  }

  async updateStatus(ip:string,currentStatus:boolean) {
   console.log('ip to update:',ip);
    return this.prisma.onlineStatuses.update({
      where: {
        ip:ip
      },
      data: {
        status:currentStatus
      }
    })
  }

  async getStatus(ip:string) {
     return this.prisma.onlineStatuses.findFirst({
        where:{
          ip:ip
        },
        select: {
          status:true
        }
     })
  }

}
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { chatData, ChatStructure, infoForUpdate, User } from "src/stuff/types";

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

  getMonths() {
    return this.prisma.months.findMany();
  }

  getPageText(page:string,lang:string) {
    return this.prisma.locales.findFirst({
      where:{
        page:page,
        language:['uk','ru'].includes(lang) ? 'ua' : lang
      },
      select:{
        text:true
      }
    });
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

  async createUserChat(userChats:chatData) {
     return this.prisma.chats.create({data:userChats});
  }

  async checkUser(data:{phone:string,password:string}) {
    console.log('data:',data);
    return this.prisma.user.findFirst({
      where: {
        phone:data.phone,
        password:data.password
      }
    });
  }

  async createUser(user:User) {
    user['image'] = '';
    await this.prisma.user.create({data:user});
    await this.prisma.onlinestatuses.create({data:{
      phone:user.phone,
      status:false
    }});
  }

  async updateStatus({phone,status}:{phone:string,status:boolean}) {
    return this.prisma.onlinestatuses.update({
      where: {
        phone:phone
      },
      data: {
        status:status
      }
    });
  }

  async getStatus(phone:string) {
     return this.prisma.onlinestatuses.findFirst({
        where:{
          phone:phone
        },
        select: {
          status:true
        }
     });
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
    });
  }

  async getUserTheme(phone:string) {
    return this.prisma.usertheme.findFirst({
      where:{
        phone:phone
      },
      select:{
        theme:true
      }
    });
  }

  async createUserTheme(data:{phone:string,theme:string}) {
    return this.prisma.usertheme.create({
      data:data
    });
  }

  async updateUserTheme({phone,theme}:{phone:string,theme:string}) {
    return this.prisma.usertheme.update({
      where:{
        phone:phone
      },
      data:{
        theme:theme
      }
    });
  }

  async searchOtherUsers(userPhone:string,request:string) {
    return this.prisma.user.findMany({
      where:{
        phone:{
          not:userPhone,
        },
        OR:[
          {
            name:{
              contains:request,
            }
          },
          {
            phone:{
              contains:request
            }
          }
        ]
      },
      select:{
        name:true,
        image:true,
        phone:true
      }
    });
  }
}
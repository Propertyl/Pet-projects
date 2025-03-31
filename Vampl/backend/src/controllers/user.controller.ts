import { Body, Controller, Get,Param, Post, Put, Res } from "@nestjs/common";
import { Response } from "express";
import { UserService } from "src/services/user.service";
import getCryptedIP from "src/stuff/functions/cryptoIp";
import cryptoIp from "src/stuff/functions/cryptoIp";

@Controller('user')
export class UserController {
  constructor(private readonly userServices:UserService) {}


  @Get('infoByIp/:ip')
  getUserInfoIP(@Param('ip') ip:string) {
    return this.userServices.getUserByIp(ip);
  }

  @Get('infoByName/:name') 
  getUserInfo(@Param('name') name:string) {
     return this.userServices.getUserByName(name);
  }

  @Get('phone/:userPhone')
  async getUserPhone(@Param('userPhone') userPhone:string, @Res() res:Response) {
    const data = await this.userServices.getUserByPhone(userPhone);

    console.log('phone data:',data);

    if(!data) {
      return res.status(200).json({register:false});
    }

    return res.status(200).json({register:true});
  }

  @Get('chats/:ip')
  async getUserChats(@Param('ip') ip:string) {
     const userChatData = await this.userServices.getChatData(ip);

     if(!userChatData.length) {
        await this.userServices.createUserChats({
          chatId:this.userServices.genChatID(),
          chatUsers:{users:[ip,'host']},
          messages:{}
        });
        return this.userServices.getChatData(ip);
     }

     return userChatData;
  }

  @Get('chat/:user')
  async getUserChat(@Param('user') user:string) {
    const currentUser = await getCryptedIP()
    const chatter = await fetch(`http://localhost:3000/user/infoByName/${user}`).then(async res => {
      try {
        const userData = await res.json();
        return userData.ip
      } catch {
        console.error("TI SHLUHA");
      }
    });

    return this.userServices.getChatByLink([currentUser,chatter]);
  }

  @Post('createAccount')
  createUser(@Body() user:{ip:string,name:string,phone:string,birthdate:string,password:string,image:string}) {
     return this.userServices.createUser(user);
  }

  @Get('verifyAccount/:phone')
  async signIn(@Param('phone') phone:string, @Res() response:Response) {
    const user = await this.userServices.getUserByPhone(phone);
     
    return response.status(200).json({password:user?.password ?? ''});
  }

  @Put('setAuthorized')
  updateUserAuth(@Body() data:{ip:string}) {
     return this.userServices.updateUserAuth(data.ip);
  }


  @Get('getAuthData/:manual')
  async getUserData(@Param('manual') manual:string) {
    console.log('start manual:',manual);
    if(manual == 'true') {
      let getRes = await this.userServices.getAuthByIp('host');

      if(!getRes) {
        await this.userServices.addAuthData('host');
        getRes = await this.userServices.getAuthByIp('host');
      }

      return getRes;
    }

    const ident:string = await getCryptedIP();
    let getRes = await this.userServices.getAuthByIp(ident);

    if(!getRes) {
      await this.userServices.addAuthData(ident);
      getRes = await this.userServices.getAuthByIp(ident);
    }

    return getRes;
  }

  @Put('update-status')
  async updateUserStatus(@Body() data:{ip:string,status:boolean}) {
     return this.userServices.updateStatus(data.ip,data.status);
  }

}


// const getData = await this.userServices.getUserByIp(ident);

//     if(!getData) {
//       await this.userServices.createUser({ip:ident,image:"http://localhost:3000/images/icon.png"});
//       return this.userServices.getUserByIp(ident);
//     }
    
//     return getData;
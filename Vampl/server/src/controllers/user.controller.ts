import { Body, Controller, Get,Param, Post, Put, Res } from "@nestjs/common";
import { Response } from "express";
import { UserService } from "src/services/user.service";
import getCryptedIP from "src/stuff/functions/cryptoIp";
import serv from "src/stuff/functions/interceptor";

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

    if(!data) {
      return res.status(200).json({register:false});
    }

    return res.status(200).json({register:true});
  }

  @Get('chats/:ip')
  async getUserChats(@Param('ip') ip:string) {
     const userChatData:any = await this.userServices.getChatData(ip);
     
     if(!userChatData.length) {
        await serv.post('/chat/create-chat',{
          chatId:this.userServices.genChatID(),
          chatUsers:{users:[ip,'host']},
          messages:{"all":[]}
        });
        return this.userServices.getChatData(ip);
     }

     return userChatData;
  }

  @Get('chat/:user')
  async getUserChat(@Param('user') user:string) {
    const currentUser = await getCryptedIP()
    const chatter:any = await serv.get(`/user/infoByName/${user}`)
    .then((res:any) => res.ip);

    return this.userServices.getChatByLink([currentUser,chatter]);
  }

  @Post('createAccount')
  createUser(@Body() user:{ip:string,name:string,phone:string,birthdate:string,password:string,image:string}) {
     return this.userServices.createUser(user);
  }

  @Get('verifyAccount/:phone')
  async signIn(@Param('phone') phone:string, @Res() response:Response) {
    const user = await this.userServices.getUserByPhone(phone);

    console.log('qw:',user);
     
    return user?.password;
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

  @Post('create-theme')
  async createUserTheme(@Body() data:{ip:string}) {
    await this.userServices.createUserTheme(data.ip);
  }

  @Put('update-theme')
  async updateUserTheme(@Body() data:{ip:string,theme:string}) {
    await this.userServices.updateUserTheme(data);
    return this.userServices.getUserTheme(data.ip);
  }

  @Get(`get-theme/:ip`)
  async getUserTheme(@Param('ip') ip:string) {
     let userTheme = await this.userServices.getUserTheme(ip)
     
     if(!userTheme) {
      await serv.post('/user/create-theme',{
        headers: {
          'Content-Type':'application/json'
        },
        ip:ip
       });
       return this.userServices.getUserTheme(ip);
     }

     return userTheme;
  }

}

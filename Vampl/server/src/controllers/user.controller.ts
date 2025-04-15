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

  @Get('getPhone/:ip')
  getUserInfoPhone(@Param('ip') ip:string) {
    console.log("we started!!");
    return this.userServices.getInfoByIP(ip);
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

  @Post('createAccount')
  createUser(@Body() user:{ip:string,name:string,phone:string,birthdate:string,password:string,image:string}) {
     return this.userServices.createUser(user);
  }

  @Post('createAuthData')
  createAuthData(@Body() data:{ip:string,phone:string,authorized:boolean}) {
      return this.userServices.addAuthData(data);
  }

  @Get('verifyAccount/:phone')
  async signIn(@Param('phone') phone:string, @Res() response:Response) {
    const user = await this.userServices.getUserByPhone(phone);
     
    return response.status(200).json({password:user!.password});
  }

  @Put('setAuthorized')
  updateUserAuth(@Body() data:{phone:string}) {
     return this.userServices.updateUserAuth(data.phone);
  }


  @Get('getAuthData/:manual')
  async getUserData(@Param('manual') manual:string) {
    console.log('start manual:',manual);
    if(manual == 'true') {
      let getRes = await this.userServices.getAuthByIp('host');

      return getRes;
    }

    const ident:string = await getCryptedIP();
    let getRes = await this.userServices.getAuthByIp(ident);

    return getRes;
  }

  @Get('getUserIp')
  async getUserIP() {
    return await getCryptedIP();
  }

  @Put('update-status')
  async updateUserStatus(@Body() data:any) {
     await this.userServices.updateStatus(data);
  }

  @Post('create-theme')
  async createUserTheme(@Body() data:{phone:string}) {
    return this.userServices.createUserTheme(data);
  }

  @Put('update-theme')
  async updateUserTheme(@Body() data:{phone:string,theme:string}) {
    await this.userServices.updateUserTheme(data);
    return this.userServices.getUserTheme(data.phone);
  }

  @Get(`get-theme/:ip`)
  async getUserTheme(@Param('ip') ip:string) {
     let userTheme = await this.userServices.getUserTheme(ip)
     
     return userTheme;
  }

}

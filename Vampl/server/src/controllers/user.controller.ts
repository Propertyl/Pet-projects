import { Body, Controller, Get,Param, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { UserService } from '../services/user.service';
import { infoForUpdate, User } from "src/stuff/types";
import throwServerError from "../stuff/functions/throwError";

@Controller('user')
export class UserController {
  constructor(private readonly userServices:UserService) {}


  @Get('info')
  getUserInfoIP(@Req() req:Request) {
    const phone = req.cookies['token'];

    const res:any = this.userServices.getUserByPhone(phone);

    return res;
  }

  @Get('name')
  getUserName(@Req() req:Request) {
    const phone = req.cookies['token'];

    return this.userServices.getUserName(phone);
  }


  @Get('getInfoByPhone/:phone')
  getUserInfoPhone(@Param('phone') phone:string) {
    return this.userServices.getUserByPhone(phone);
  }

  @Get('check-name-existing/:name')
  async checkNameExisting(@Param('name') name:string) {
    const coincidences = await this.userServices.getUserByName(name);
    let existing = false;

    if(coincidences) existing = true;

    return {existing};
  }

  @Get('infoByName/:name') 
  getUserInfo(@Param('name') name:string) {
     return this.userServices.getUserByName(name);
  }

  @Get('phone/:userPhone')
  async getUserPhone(@Param('userPhone') userPhone:string) {
    const data = await this.userServices.getUserByPhone(userPhone);
    let register = true;

    if(!data) register = false;

    return {register};
  }

  @Put('update-info')
  updateUserInfo(@Body() info:infoForUpdate,@Req() req:Request) {
    const phone = req.cookies['token'];

    return this.userServices.updateInfo(info,phone);
  }

  @Post('createAccount')
  createUser(@Body() user:User) {
    return this.userServices.createUser(user);
  }

  @Get('verifyAccount/:phone')
  async signIn(@Param('phone') phone:string) {
    const user = await this.userServices.getUserByPhone(phone);
     
    if(user?.password) {
      return {password:user!.password};
    }

    return throwServerError();
  }

  @Get('authorization')
  checkAuthorization(@Req() req:Request) {
    const token = req.cookies['token'];
    let approve = false;

    if(token) approve = true;

    return {approve};
  }

  @Put('setAuthorized')
  updateUserAuth(@Res({passthrough:true}) res:Response,@Body() phone:{phone:string}) {
    const life = 7 * 24 * 60 * 3600;

    res.cookie('token',phone.phone, {
      maxAge:life,
      httpOnly:true,
      secure:true,
      sameSite:'lax',
      path:'/'
    });
  }

  @Put('log-out')
  accLogOut(@Res({passthrough:true}) res:Response) {
    res.clearCookie('token',{path:'/'});
    return {message:'Logged out!'};
  }
  
  @Put('update-status')
  async updateUserStatus(@Body() data:any) {
    await this.userServices.updateStatus(data);
  }

  @Post('create-theme')
  async createUserTheme(@Body() data:{phone:string,theme:string}) {
    return this.userServices.createUserTheme(data);
  }

  @Put('update-theme')
  async updateUserTheme(@Req() req:Request,@Body() data:{theme:string}) {
    const phone = req.cookies['token'];
    await this.userServices.updateUserTheme({phone,theme:data.theme});
    return this.userServices.getUserTheme(phone);
  }

  @Get(`get-theme`)
  async getUserTheme(@Req() req:Request) {
     const phone = req.cookies['token'];
      
     return this.userServices.getUserTheme(phone);
  }

}

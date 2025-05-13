import { Body, Controller, Get,Param, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { UserService } from "src/services/user.service";

@Controller('user')
export class UserController {
  constructor(private readonly userServices:UserService) {}


  @Get('info')
  getUserInfoIP(@Req() req:Request) {
    const phone = req.cookies['token'];

    const res:any = this.userServices.getUserByPhone(phone);

    return res;
  }


  @Get('getInfoByPhone/:phone')
  getUserInfoPhone(@Param('phone') phone:string) {
    return this.userServices.getUserByPhone(phone);
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

  @Get('verifyAccount/:phone')
  async signIn(@Param('phone') phone:string, @Res() response:Response) {
    const user = await this.userServices.getUserByPhone(phone);
     
    return response.status(200).json({password:user!.password});
  }

  @Get('authorization')
    checkAuthorization(@Req() req:Request,@Res() res:Response) {
      const token = req.cookies['token'];

      console.log('token:',token);

      if(token) {
        return res.status(200).json({approve:true});
      }

        return res.status(200).json({approve:false});
    }

  @Put('setAuthorized')
  updateUserAuth(@Res({passthrough:true}) res:Response,@Body() phone:{phone:string}) {
    const life:number = 7 * 24 * 60 * 600;
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

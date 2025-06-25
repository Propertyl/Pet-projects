import { Controller,Get, Param, Post, Put, Req, Res, UploadedFile, UseInterceptors} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { UserService } from "src/services/user.service";
import { diskStorage } from 'multer';
import { extname, join } from "path";

@Controller('getData')
export class DataController {
   constructor(private readonly user:UserService) {}


   @Put('user-avatar')
   @UseInterceptors(FileInterceptor('file',{
      storage:diskStorage({
         destination:join(__dirname, '..', '..', 'src', 'uploads'),
         filename: (req:Request, file:Express.Multer.File, callback:any) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname); 
            callback(null, `${uniqueSuffix}${ext}`);
         },
      }),
   }))
   uploadAvatar(@UploadedFile() file:Express.Multer.File,@Req() req:Request) {
      const phone = req.cookies['token'];
      console.log('file recieved',phone,file.path);
      return this.user.updateAvatar(phone,`http://localhost:3000/images/${file.filename}`);
   }

   @Get('phoneCodes')
   getAllPhones() {
    const phones = require('../../src/uploads/data/phones.json');
    return phones;
   }

   @Get('month/:lang')
   async getCurrentMonth(@Param('lang') lang:string) {
      const months = await this.user.getMonths()
      .then((value:{id:bigint,month_en:string,month_uk:string}[]) => {
         return value.map(month => {
          const newMonth:{id:number,month:string} = {id:Number(month.id),month:''}
            if(['uk','ru'].includes(lang)) {
               newMonth['month'] = month.month_uk;
            } else {
               newMonth['month'] = month.month_en;
            }
          
            return newMonth;
         })
      });
      
      return months;
   }

   @Get('getText/:page/:lang')
   getAuthText(@Param('page') page:string,@Param('lang') lang:string) {
      return this.user.getPageText(page,lang);
   }

   @Get('status/:phone')
   getUserStatus(@Param('phone') phone:string) {
      return this.user.getStatus(phone);
   }

   @Get('user/rooms/:phone')
   getUserRooms(@Param('phone') phone:string) {      
      if(phone) {
         return this.user.getAllUserRooms(phone);
      }
   }

   @Get('burger/:phone')
   isUserBurger(@Param('phone') phone:string,@Req() req:Request) {
     const tokenPhone = req.cookies['token'];

     if(tokenPhone === phone) {
       return {isOwn:true};
     }

     return {isOwn:false}
   }

   @Get('search-users/:request')
   searchUsers(@Param('request') request:string,@Req() req:Request) {
      const phone = req.cookies['token'];

      return this.user.searchOtherUsers(phone,request)
   }
}
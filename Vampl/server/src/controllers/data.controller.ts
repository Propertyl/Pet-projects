import { Controller,Get, Param, Req} from "@nestjs/common";
import { Request } from "express";
import { UserService } from "src/services/user.service";

@Controller('getData')
export class DataController {
   constructor(private readonly user:UserService) {}

   @Get('phoneCodes')
   getAllPhones() {
    const phones = require('../../src/uploads/data/phones.json');
    return phones;
   }

   @Get('month/:lang')
   getCurrentMonth(@Param('lang') lang:string) {
      if(lang === 'en') {
         return this.user.getMonthEN();
      }
      if(lang === 'ua') {
         return this.user.getMonthUA();
      }
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
}
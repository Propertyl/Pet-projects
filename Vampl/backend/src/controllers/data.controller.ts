import { Controller,Get, Param} from "@nestjs/common";
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

   @Get('status/:ip')
   getUserStatus(@Param('ip') ip:string) {
      return this.user.getStatus(ip);
   }

   @Get('user/rooms/:ip')
   getUserRooms(@Param('ip') ip:string) {
      return this.user.getAllUserRooms(ip);
   }
}
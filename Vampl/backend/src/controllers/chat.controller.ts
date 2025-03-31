import { Controller, Get, Param, Put,Body } from "@nestjs/common";
import { UserService } from "src/services/user.service";
import { MessageGroup } from "src/stuff/types";

@Controller('chat')
export class ChatController {
  constructor(private readonly userServices:UserService) {}

  @Get('chatID/:id')
  getChatByID(@Param('id') id:string) {
     return this.userServices.getChatById(id);
  }

  @Put('updateChat')
  updateChatByID(@Body() {id,messages}:{id:string,messages:MessageGroup}) {
     return this.userServices.updateChat({id,messages});
  }
}
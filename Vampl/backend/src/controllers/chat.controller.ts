import { Controller, Get, Param, Put,Body, Post } from "@nestjs/common";
import { UserService } from "src/services/user.service";
import { chatData, MessageGroup, updateChatData } from "src/stuff/types";

@Controller('chat')
export class ChatController {
  constructor(private readonly userServices:UserService) {}

  @Get('chatID/:id')
  getChatByID(@Param('id') id:string) {
     return this.userServices.getChatById(id);
  }

  @Post('create-chat')
  createUserChat(@Body() data:chatData) {
    return this.userServices.createUserChat(data);
  }

  @Put('updateChat')
  updateChatByID(@Body() {id,messages}:updateChatData) {
     return this.userServices.updateChat({id,messages});
  }
}
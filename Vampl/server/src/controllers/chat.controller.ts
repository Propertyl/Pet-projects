import { Controller, Get, Param, Put,Body, Post } from "@nestjs/common";
import { UserService } from "src/services/user.service";
import serv from "src/stuff/functions/interceptor";
import { chatData, MessageGroup, updateChatData } from "src/stuff/types";

@Controller('chat')
export class ChatController {
  constructor(private readonly userServices:UserService) {}

  @Get('chatID/:id')
  getChatByID(@Param('id') id:string) {
     return this.userServices.getChatById(id);
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

  @Get('openChat/:user/:ip')
  async getUserChat(@Param('user') user:string,@Param('ip') ip:string) {
    const chatter:any = await serv.get(`/user/infoByName/${user}`)
    .then((res:any) => res.ip);

    return this.userServices.getChatByLink([ip,chatter]);
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
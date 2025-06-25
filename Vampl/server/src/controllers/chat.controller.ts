import { Controller, Get, Param, Put,Body, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { UserService } from "src/services/user.service";
import serv from "src/stuff/functions/interceptor";
import { chatData, ChatStructure, MessageGroup ,updateChatData } from "src/stuff/types";


@Controller('chat')
export class ChatController {
  constructor(private readonly userServices:UserService) {}

  @Get('chatID/:id')
  async getChatByID(@Param('id') id:string) {
    const {messages}:{messages:ChatStructure} = await this.userServices.getChatById(id) as any;
   
    return messages;
  }

  @Get('chats')
  async getUserChats(@Req() req:Request) {
     const phone = req.cookies['token'];
     const userChatData:any = await this.userServices.getChatData(phone);
     
     if(!userChatData.length) {
        await serv.post('/chat/create-chat',{
          chatId:this.userServices.genChatID(),
          chatUsers:{users:[phone,'+380000000000']},
          messages:{"all":[]}
        });
        
        return {data:await this.userServices.getChatData(phone),phone};
     }

     return {data:userChatData,phone};
  }

  @Put('update-messages')
  async updateMessageView(@Body() data:{id:string,messages:any}) {
      return this.userServices.updateChat(data);
  }

  @Get('openChat/:user')
  async getUserChat(@Req() req:Request,@Param('user') user:string) {
    const chatter:any = await serv.get(`/user/infoByName/${user}`)
    .then((res:any) => res.phone);

    const phone = req.cookies['token'];

    return this.userServices.getChatByLink([phone,chatter]);
  }

  @Post('create-chat')
  async createUserChat(@Body() data:chatData,@Req() req:Request) {
    if(!data.chatId) {
      data.chatId = this.userServices.genChatID();
    }

    if(data.chatUsers.users.length === 1) {
      const phone = req.cookies['token'];
      data.chatUsers.users.push(phone);
    }

    return await this.userServices.createUserChat(data);
  }

  @Put('updateChat')
  updateChatByID(@Body() {id,messages}:updateChatData) {
     return this.userServices.updateChat({id,messages});
  }

  @Put('delete-chat')
  async deleteUserChat(@Body() {id}:{id:string}) {
    console.log('volna:',id);
    return this.userServices.deleteChat(id);
  }
}
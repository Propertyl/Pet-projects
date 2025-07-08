import { Controller, Get, Param, Put,Body, Post, Req, Delete } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Request } from "express";
import { UserService } from "src/services/user.service";
import genChatID from "src/stuff/functions/generateChatID";
import server from "src/stuff/functions/interceptor";
import throwServerError from "src/stuff/functions/throwError";
import { chatData, ChatStructure,Message,updateChatData, User } from "src/stuff/types";


@Controller('chat')
export class ChatController {
  constructor(private readonly userServices:UserService) {}

  @Get('chatID/:id')
  async getChatByID(@Param('id') id:string) {
    const chat = await this.userServices.getChatById(id) as {messages:ChatStructure} | null;
   
    if(chat) {
      return chat.messages;
    } else {
      return throwServerError();
    }
  }

  @Get('chats')
  async getUserChats(@Req() req:Request) {
     const phone = req.cookies['token'];
     const userChatData = await this.userServices.getChatData(phone);
     
     if(!userChatData.length) {
        await this.createUserChat({
          chatId:genChatID(),
          chatUsers:{users:[phone,'+380000000000']},
          messages:{"all":[]}
        },req);
        
        return {data:await this.userServices.getChatData(phone),phone};
     }

     return {data:userChatData,phone};
  }

  @Put('update-messages')
  async updateMessageView(@Body() data:{id:string,messages:Message[]}) {
    return this.userServices.updateChat(data);
  }

  @Get('openChat/:user')
  async getUserChat(@Req() req:Request,@Param('user') user:string) {
    const {phone}:User = await server.get(`/user/infoByName/${user}`);

    const userPhone = req.cookies['token'];

    return this.userServices.getChatByLink([userPhone,phone]);
  }

  @Post('create-chat')
  async createUserChat(@Body() data:chatData,@Req() req:Request) {
    if(!data.chatId) {
      data.chatId = genChatID();
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

  @Delete('delete-chat/:id')
  async deleteUserChat(@Param('id') id:string) {
    return this.userServices.deleteChat(id);
  }
}
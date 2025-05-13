import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway,WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { Chat,condition,Message, updateMessagesData } from "./stuff/types";
import groupMessages from "./stuff/functions/groupMessages";
import serv from "./stuff/functions/interceptor";
import parseCookies from "./stuff/functions/parseCookie";
import updateGroup from "./stuff/functions/updateGroup";

@WebSocketGateway({cors:true,namespace:'app'})

export class ChatGetAway implements OnGatewayConnection, OnGatewayDisconnect {
   @WebSocketServer() 
   server:Server;

   private clients = new Map<string,string>();

   async updateUserStatus(phone:string,status:Boolean) {
      const rooms = await serv.get(`/getData/user/rooms/${phone}`)
      .then((rooms:any) => rooms.map(({chatId}:{chatId:string}) => chatId));
      await serv.put('/user/update-status',{
        phone:phone,
        status:status
      });

      this.server.to(rooms).emit('userUpdates',{phone:phone,status:status});
    }

   async handleConnection(client:Socket, ...args: any[]) {
     const cookies:string = client.handshake.headers.cookie ?? '';
     const parsed = parseCookies(decodeURIComponent(cookies));
     await this.updateUserStatus(parsed['token'],true);
     this.clients.set(client.id,parsed['token']);
   }

   async messageAction(client:Socket,{date,group,room,body,time}:updateMessagesData,condition:condition) {
      let currentChat:any = await serv.get(`/chat/chatID/${room}`);
      currentChat = updateGroup(currentChat,date,group,body,time,condition);
      await serv.put('/chat/update-messages',{
         id:room,
         messages:currentChat
      });
      this.server.to(room).emit('updateChat',currentChat);
   }

   async handleDisconnect(client:Socket) {
     const phone:string = this.clients.get(client.id) ?? "";
     await this.updateUserStatus(phone,false);
     this.clients.delete(client.id);
   }

   @SubscribeMessage('delete-chat')
   async chatDelete(client:Socket,chatID:string) {
      await serv.put('/chat/delete-chat',{
         headers:{
            'Content-Type':'application/json'
         },
         id:chatID
      });
   }

   @SubscribeMessage('message-delete')
   async messageDelete(client:Socket,data:updateMessagesData) {
      await this.messageAction(client,data,'delete');
   }

   @SubscribeMessage('messages-watch')
   async messageWatch(client:Socket,data:updateMessagesData) {
      await this.messageAction(client,data,'view');
   }

   @SubscribeMessage('joinRoom')
   addToRoom(client:Socket,room:string) {
      console.log('roooooM:',room);
      client.join(room);
      client.emit('joinedRoom',room);
   }

   @SubscribeMessage('sendMessage')
   async sendMessageToChat(client:Socket,data:{room:string,message:Message}) {
      this.server.to(data.room).emit('message',data.message.body);
      let currentChat:any = undefined;

      const chat = await serv.get(`/chat/chatID/${data.room}`);

      currentChat = chat;
      currentChat = groupMessages(data.message,currentChat);
      console.log('data:room:',data.room)
      this.server.to(data.room).emit('updateChat',currentChat,
      data.room);
      this.server.to(data.room).emit('updateContactChat',currentChat,data.room);
      
      await serv.put('/chat/updateChat',{
         headers: {
            'Content-Type':'application/json'
         },
         id:data.room,
         messages:currentChat
      });
   }
   
}
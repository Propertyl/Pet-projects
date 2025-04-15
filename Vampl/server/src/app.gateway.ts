import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway,WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { Chat,Message } from "./stuff/types";
import groupMessages from "./stuff/functions/groupMessages";
import getCryptedIP from "./stuff/functions/cryptoIp";
import serv from "./stuff/functions/interceptor";

@WebSocketGateway({cors:true,namespace:'app'})

export class ChatGetAway implements OnGatewayConnection, OnGatewayDisconnect {
   @WebSocketServer() 
   server:Server;

   private clients = new Map<string,string>();

   async updateUserStatus(phone:string,status:Boolean,ip:string) {
      const rooms = await serv.get(`/getData/user/rooms/${ip}`)
      .then((rooms:any) => rooms.map(({chatId}:{chatId:string}) => chatId));
      console.log('vse norm:',phone,status,ip,rooms);
      await serv.put('/user/update-status',{
        phone:phone,
        status:status
      });

      this.server.to(rooms).emit('userUpdates',{phone:phone,status:status});
    }

   async handleConnection(client:Socket, ...args: any[]) {
     const ip = await getCryptedIP();
     const phone:string = await serv.get(`/user/getPhone/${ip}`).then((res:any) => res.phone);
     await this.updateUserStatus(phone,true,ip);
     await this.updateUserStatus('+380000000000',true,'host');
     this.clients.set(client.id,phone);
   }

   async handleDisconnect(client:Socket) {
     const phone:string = this.clients.get(client.id) ?? "";
   //   await this.updateUserStatus(phone,false);
     await this.updateUserStatus('+380000000000',false,'host');
     this.clients.delete(client.id);
   }

   @SubscribeMessage('joinRoom')
   addToRoom(client:Socket,room:string) {
      client.join(room);
      client.emit('joinedRoom',room);
   }

   @SubscribeMessage('sendMessage')
   async sendMessageToChat(client:Socket,data:{room:string,message:Message}) {
      this.server.to(data.room).emit('message',data.message.body);
      let currentChat:any = undefined;

      const chat = await serv.get(`/chat/chatID/${data.room}`)
      .then((data:any) => data.messages);

      currentChat = chat;
      currentChat = groupMessages(data.message,currentChat);
      this.server.to(data.room).emit('updateChat',currentChat);
      await serv.put('/chat/updateChat',{
         headers: {
            'Content-Type':'application/json'
         },
         id:data.room,
         messages:currentChat
      });
   }
   
}
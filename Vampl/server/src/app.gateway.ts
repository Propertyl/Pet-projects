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

   async updateUserStatus(ip:string,status:Boolean) {
      const rooms = await serv.get(`http://localhost:3000/getData/user/rooms/${ip}`)
      .then((rooms:any) => rooms.map(({chatId}:{chatId:string}) => chatId));
      await serv.put('http://localhost:3000/user/update-status',{
        headers: {
        'Content-Type':'application/json',
        },
        ip:ip,
        status:status
      });

      this.server.to(rooms).emit('user-updates',{ip:ip,status:status});
    }

   async handleConnection(client:Socket, ...args: any[]) {
     const ip = await getCryptedIP();
     await this.updateUserStatus(ip,true);
     await this.updateUserStatus('host',true);
     this.clients.set(client.id,ip);
   }

   async handleDisconnect(client:Socket) {
     const ip:string = this.clients.get(client.id) ?? "";
   //   await this.updateUserStatus(ip,false);
     await this.updateUserStatus('host',false);
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

      const chat = await serv.get(`http://localhost:3000/chat/chatID/${data.room}`)
      .then((data:any) => data.messages);

      currentChat = chat;
      currentChat = groupMessages(data.message,currentChat);
      this.server.to(data.room).emit('updateChat',currentChat);
      await serv.put('http://localhost:3000/chat/updateChat',{
         headers: {
            'Content-Type':'application/json'
         },
         id:data.room,
         messages:currentChat
      });
   }
   
}
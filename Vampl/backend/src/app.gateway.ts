import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway,WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { Chat,Message } from "./stuff/types";
import groupMessages from "./stuff/functions/groupMessages";
import cryptoIp from "./stuff/functions/cryptoIp";
import getCryptedIP from "./stuff/functions/cryptoIp";

@WebSocketGateway({cors:true,namespace:'app'})

export class ChatGetAway implements OnGatewayConnection, OnGatewayDisconnect {
   @WebSocketServer() 
   server:Server;

   private clients = new Set<string>();
   private chats = new Map<string,Chat>();

   async handleConnection(client:Socket, ...args: any[]) {
     const ip = await getCryptedIP();
     this.clients.add(ip); 
   }

   async handleDisconnect(client:Socket) {
     this.clients.delete(client.id);
     const ip = await getCryptedIP();
     await fetch('http://localhost:3000/user/update-status',{
      method:'PUT',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({ip:ip,status:false})
    });
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

      if(!this.chats.has(data.room)) {
         console.log('start caching chat!!');
         const getChat = await fetch(`http://localhost:3000/chat/chatID/${data.room}`)
         .then(res => res.json());
         console.log('whats we extract:',getChat);
         this.chats.set(data.room,getChat.messages);
         console.log('current storage:',this.chats);
      }

      currentChat = this.chats.get(data.room);
      currentChat = groupMessages(data.message,currentChat);
      console.log("updated!",currentChat);
      this.server.to(data.room).emit('updateChat',currentChat);
      await fetch('http://localhost:3000/chat/updateChat',{
         method:'PUT',
         headers: {
            'Content-Type':'application/json'
         },
         body:JSON.stringify({
            id:data.room,
            messages:currentChat
         })
      });
   }
   
}
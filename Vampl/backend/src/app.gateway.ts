import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway,WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { Chat,Message } from "./stuff/types";
import groupMessages from "./stuff/functions/groupMessages";
import getCryptedIP from "./stuff/functions/cryptoIp";

@WebSocketGateway({cors:true,namespace:'app'})

export class ChatGetAway implements OnGatewayConnection, OnGatewayDisconnect {
   @WebSocketServer() 
   server:Server;

   private clients = new Map<string,string>();

   async updateUserStatus(ip:string,status:Boolean) {
      const rooms = await fetch(`http://localhost:3000/getData/user/rooms/${ip}`)
      .then(res => res.json())
      .then(rooms => rooms.map(({chatId}:{chatId:string}) => chatId));
      await fetch('http://localhost:3000/user/update-status',{
        method:'PUT',
        headers: {
        'Content-Type':'application/json',
        },
        body: JSON.stringify({ip:ip,status:status})
      });

      console.log('rooms:',rooms);
      console.log('otpravlyaem!!!');
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

      // if(!this.chats.has(data.room)) {
      //    const getChat = await fetch(`http://localhost:3000/chat/chatID/${data.room}`)
      //    .then(res => res.json());
      //    this.chats.set(data.room,getChat.messages);
      // }

      const chat = await fetch(`http://localhost:3000/chat/chatID/${data.room}`)
      .then(res => res.json())
      .then(data => data.messages);

      currentChat = chat;
      currentChat = groupMessages(data.message,currentChat);
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
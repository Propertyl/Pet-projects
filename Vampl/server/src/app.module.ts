import { Module } from '@nestjs/common';
import { ChatGetAway } from './app.gateway';
import { UserService } from './services/user.service';
import { PrismaService } from './services/prisma.service';
import { UserController } from './controllers/user.controller';
import {ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
import { ChatController } from './controllers/chat.controller';
import {HttpModule} from '@nestjs/axios';
import { DataController } from './controllers/data.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath:join(__dirname, '..', 'src', 'uploads'),
      serveRoot:'/images'
    })
  ,HttpModule],
  controllers: [UserController,ChatController,DataController],
  providers: [ChatGetAway,UserService,PrismaService],
  exports: [UserService]
})
export class AppModule {}

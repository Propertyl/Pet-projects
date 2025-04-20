import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

class MyIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
      },
    });
    return server;
  }
}


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin:'http://localhost:5173',
    credentials:true
  });
  
  app.use(cookieParser());
  app.useWebSocketAdapter(new MyIoAdapter(app));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

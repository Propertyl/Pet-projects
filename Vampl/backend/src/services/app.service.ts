import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getMangasData():string {
    return "MANGA DATAS!";
  }
}

// .?schema=public

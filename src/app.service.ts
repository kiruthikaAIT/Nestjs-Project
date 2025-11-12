import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  myname(): string {
    return 'kiruthikaT';
  }
}

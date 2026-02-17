import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(): string {
    return '1ére test api pour pfe nest js ';
  }
}

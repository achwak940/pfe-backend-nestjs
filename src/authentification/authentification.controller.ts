import { Body, Controller, Post } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';

@Controller('authentification')
export class AuthentificationController {
  constructor(private readonly authentificationService: AuthentificationService) {
 
  }
     @Post('/login')
    async authentificationEmail(@Body() body){
      return this.authentificationService.authentificationEmail(body)
    }
}

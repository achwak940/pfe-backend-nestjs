import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';

// Définir les DTOs avant de les utiliser
class LoginDto {
    email: string;
    mot_de_passe: string;
}

class GoogleAuthDto {
    token: string;
}

@Controller('authentification')
export class AuthentificationController {
    constructor(private readonly authentificationService: AuthentificationService) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async authentificationEmail(@Body() body: LoginDto) {
        return this.authentificationService.authentificationEmail(body);
    }

    @Post('/google')
    @HttpCode(HttpStatus.OK)
    async authentificationGoogle(@Body() body: GoogleAuthDto) {
        return this.authentificationService.authentificationGoogle(body.token);
    }
} 
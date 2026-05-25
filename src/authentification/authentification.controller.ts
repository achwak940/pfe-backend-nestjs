import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// ─── DTOs avec validation class-validator ────────────────────────────────────

export class LoginDto {
  @IsEmail({}, { message: "Format d'email invalide" })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  mot_de_passe: string;
}

export class GoogleAuthDto {
  @IsNotEmpty({ message: 'Le token Google est obligatoire' })
  token: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: "Format d'email invalide" })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Le token est obligatoire' })
  token: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nouveau mot de passe est obligatoire' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  newPassword: string;
}

// ─── Controller ──────────────────────────────────────────────────────────────

@Controller('authentification')
export class AuthentificationController {
  constructor(
    private readonly authentificationService: AuthentificationService,
  ) {}

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

  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authentificationService.forgotPassword(body.email);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authentificationService.resetPassword(
      body.token,
      body.newPassword,
    );
  }
}
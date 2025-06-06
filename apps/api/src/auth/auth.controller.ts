import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  loginGoogle(@Body('token') token: string) {
    return this.authService.oidcLogin('google', token);
  }

  @Post('microsoft')
  loginMicrosoft(@Body('token') token: string) {
    return this.authService.oidcLogin('microsoft', token);
  }
}

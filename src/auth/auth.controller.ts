import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Signup
  @Post('signup')
  async signUp(@Body() body: { userName: string; email: string; password: string }) {
    const { userName, email, password } = body;    
    return this.authService.signUp(userName, email, password);
  }

  // Sign in
  @Post('signin')
  async signIn(@Body() body: { email: string; password: string }) {
    const { email, password } = body;    
    return this.authService.signIn(email, password);
  }
}

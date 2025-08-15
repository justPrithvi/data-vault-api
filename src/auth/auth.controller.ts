import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1. Signup
  @Post('signup')
  async signUp(@Body() body: { userName: string; email: string; password: string }) {
    const { userName, email, password } = body;    
    return this.authService.signUp(userName, email, password);
  }

  // 2. Confirm signup (code verification)
  @Post('confirm')
  async confirmSignUp(@Body() body: { email: string; code: string }) {
    const { email, code } = body;
    return this.authService.confirmSignUp(email, code);
  }

  // 3. Set permanent password (optional)
  @Post('set-password')
  async setPermanentPassword(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.authService.setPermanentPassword(username, password);
  }

  // 4. Sign in
  @Post('signin')
  async signIn(@Body() body: { email: string; password: string }) {
    const { email, password } = body;    
    return this.authService.signIn(email, password);
  }
}

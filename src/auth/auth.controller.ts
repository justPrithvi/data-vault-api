import { Body, Controller, Post, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
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

  // Validate token - for Python service to call
  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Request() req) {
    // Log every token validation request
    this.logger.log(`Token validation triggered for user: ${req.user?.email || 'unknown'} (ID: ${req.user?.sub || 'unknown'})`);
    
    // If we reach here, the token is valid (JwtAuthGuard passed)
    // req.user is populated by JwtStrategy.validate()
    return {
      valid: true,
      user: req.user,
    };
  }
}

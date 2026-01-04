import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    console.log('🛡️ JwtAuthGuard triggered');
    console.log('📨 Authorization header:', authHeader ? `${authHeader.substring(0, 20)}...` : 'MISSING');
    
    if (!authHeader) {
      console.log('❌ No Authorization header found');
      throw new UnauthorizedException('No token provided');
    }
    
    return super.canActivate(context);
  }
  
  handleRequest(err, user, info) {
    console.log('🔍 handleRequest called');
    console.log('   err:', err);
    console.log('   user:', user);
    console.log('   info:', info);
    
    if (err || !user) {
      console.log('❌ Authentication failed');
      throw err || new UnauthorizedException();
    }
    
    console.log('✅ Guard passed, user authenticated');
    return user;
  }
}

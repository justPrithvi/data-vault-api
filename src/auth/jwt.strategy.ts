import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    console.log('🚀 JwtStrategy initialized with secret:', secret);
  }

  async validate(payload: any) {
    console.log('🔍 JWT Strategy - Validating payload:', payload);
    console.log('🔑 JWT Secret being used:', process.env.JWT_SECRET || 'default-secret');
    
    const user = await this.userRepository.findByEmail(payload.email);
    console.log('👤 User found:', user ? `${user.email} (ID: ${user.id})` : 'null');
    
    if (!user) {
      console.log('❌ User not found in database');
      throw new UnauthorizedException();
    }
    
    console.log('✅ JWT validation successful');
    return { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin || false };
  }
}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repository/user.repository';
import { AwsModule } from 'src/aws/aws.module';
import { CognitoAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AwsModule
  ], // AwsModule is global, no need to import
  providers: [AuthService, UserRepository, CognitoAuthGuard],
  controllers: [AuthController],
  exports: [CognitoAuthGuard]
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repository/user.repository';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AwsModule
  ], // AwsModule is global, no need to import
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}

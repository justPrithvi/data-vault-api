import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from './aws/aws.module';
import { AuthModule } from './auth/auth.module';
import CommonModule from './common/common.module';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [
     // Loads environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // makes the config accessible globally
      envFilePath: '.env',
    }),

    DataBaseModule,
    AwsModule,
    AuthModule,
    CommonModule,
    DocumentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

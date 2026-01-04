import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule, // <-- make ConfigService available
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // <-- needed so useFactory sees ConfigService
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: false
      }),
    }),
  ],
})
export class DataBaseModule{}
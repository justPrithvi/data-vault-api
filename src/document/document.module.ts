import { Module } from "@nestjs/common";
import { DocumentController } from "./document.controller";
import { DocumentService } from "./document.service";
import { AwsModule } from "src/aws/aws.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AwsModule, AuthModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}

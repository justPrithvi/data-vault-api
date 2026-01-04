import { Module } from "@nestjs/common";
import { DocumentController } from "./document.controller";
import { DocumentService } from "./document.service";
import { AuthModule } from "src/auth/auth.module";
import { DocumentsRepository } from "src/repository/document.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Documents } from "src/entities/documents.entity";
import { Tags } from "src/entities/tags.entities";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Documents, Tags])],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentsRepository],
})
export class DocumentModule {}

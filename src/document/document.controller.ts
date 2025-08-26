import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { DocumentService } from "./document.service";
import { CognitoAuthGuard } from "src/auth/jwt-auth.guard";

@UseGuards(CognitoAuthGuard)
@Controller("documents")
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // GET /documents/presigned-url?fileName=resume.pdf&fileType=application/pdf
  @Get("presigned-url")
  async getPresignedUrl(
    @Query("fileName") fileName: string,
    @Query("fileType") fileType: string
  ) {
    return this.documentService.getPresignedUrl(fileName, fileType);
  }
}

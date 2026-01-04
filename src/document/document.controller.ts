import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Post, 
  Query,
  UseGuards, 
  UseInterceptors, 
  UploadedFile,
  Request,
  Res,
  NotFoundException
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { DocumentService } from "./document.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Response } from "express";
import * as fs from "fs";

@UseGuards(JwtAuthGuard)
@Controller("documents")
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // Upload document with Multer
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('tags') tags: string,
    @Request() req,
  ) {
    const tagArray = tags ? JSON.parse(tags) : [];
    const userId = req.user.id;
    
    return this.documentService.uploadDocument(file, tagArray, userId);
  }

  // Get user documents with pagination and search
  @Get(':userInfo')
  async getDocuments(
    @Param('userInfo') user: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.documentService.getDocumentMetadata(user, pageNum, limitNum, search);
  }

  // Download document
  @Get('download/:id')
  async downloadDocument(@Param('id') id: string, @Res() res: Response) {
    const document = await this.documentService.getDocumentById(parseInt(id));
    
    if (!document || !document.localPath) {
      throw new NotFoundException('Document not found');
    }

    if (!fs.existsSync(document.localPath)) {
      throw new NotFoundException('File not found on server');
    }

    res.download(document.localPath, document.fileName);
  }
}

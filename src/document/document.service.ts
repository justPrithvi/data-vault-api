import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DocumentsRepository } from "src/repository/document.repository";
import { Documents } from "src/entities/documents.entity";
import { Tags } from "src/entities/tags.entities";

@Injectable()
export class DocumentService {
  constructor(
    private readonly documentRepo: DocumentsRepository,
    @InjectRepository(Tags)
    private readonly tagsRepo: Repository<Tags>,
  ) {}

  async uploadDocument(file: Express.Multer.File, tagIds: number[], userId: number) {
    if (!tagIds || tagIds.length === 0) {
      throw new BadRequestException('At least one tag is required');
    }

    // Fetch the actual tag entities
    const tags = await this.tagsRepo.findByIds(tagIds);
    
    if (tags.length === 0) {
      throw new BadRequestException('Invalid tag IDs provided');
    }

    // Create document with tags relation
    const document = new Documents();
    document.fileName = file.originalname;
    document.fileType = file.mimetype;
    document.size = file.size;
    document.localPath = file.path;
    document.s3Key = null;
    document.s3Url = null;
    document.user_id = userId;
    document.tags = tags;

    return this.documentRepo.save(document);
  }

  async getDocumentMetadata(user: string | null, page: number = 1, limit: number = 10, search?: string) {
    const response = await this.documentRepo.getDocumentMetaData(user, page, limit, search);
    return response;
  }

  async getDocumentById(id: number) {
    return this.documentRepo.findById(id);
  }
}

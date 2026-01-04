import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Documents } from "src/entities/documents.entity";

@Injectable()
export class DocumentsRepository {
  constructor(
    @InjectRepository(Documents)
    private readonly repo: Repository<Documents>,
  ) {}

  async createDocument(data: Partial<Documents>): Promise<Documents> {
    const doc = this.repo.create(data);
    return this.repo.save(doc);
  }

  async findById(id: number): Promise<Documents | null> {
    return this.repo.findOne({ 
      where: { id },
      relations: ["tags", "user"]
    });
  }

  async save(document: Documents) {
    return this.repo.save(document);
  }

  async getDocumentMetaData(userEmail: string | null, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    // Build query options
    const queryOptions: any = {
      relations: ["user", "tags"],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    };

    // Build where clause
    const whereClause: any = {};

    // Only filter by user email if provided (not for admin viewing all)
    if (userEmail && userEmail !== 'all') {
      whereClause.user = {
        email: userEmail
      };
    }

    // Add search filter if provided
    if (search && search.trim()) {
      whereClause.fileName = Like(`%${search}%`);
    }

    if (Object.keys(whereClause).length > 0) {
      queryOptions.where = whereClause;
    }
    
    const [documents, total] = await this.repo.findAndCount(queryOptions);

    return {
      data: documents,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }
}

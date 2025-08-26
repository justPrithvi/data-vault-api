import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
    return this.repo.findOne({ where: { id } });
  }

}

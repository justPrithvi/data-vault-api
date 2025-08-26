import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tags } from "src/entities/tags.entities";
import { Repository } from "typeorm";

@Injectable()
export class TagsRepository {
    constructor(
        @InjectRepository(Tags)
        private readonly repo: Repository<Tags>
    ) {}

    async createTag(data: Partial<Tags>) {
        const saveData = this.repo.create(data)
        return this.repo.save(saveData)
    }

    async getTags() {
        return this.repo.find()
    }

    async updateTag(id: number, tag: string) {
        await this.repo.update(id, { tag });
        return this.repo.findOneBy({ id }); // return the updated entity
    }

    async deleteTag(id: number) {
        return this.repo.delete(id); // returns DeleteResult
    }
}
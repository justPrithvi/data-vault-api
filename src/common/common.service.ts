import { Injectable } from "@nestjs/common";
import { TagsRepository } from "src/repository/tags.repository";

@Injectable()
export default class CommonService {
    constructor(
        private readonly tagsRepo: TagsRepository
    ) {}

    async postTags(data: {tag:string}) {
        return await this.tagsRepo.createTag(data)
    }

    async getTags() {
        return await this.tagsRepo.getTags()
    }

    async updateTag(id: number, body: { tag: string }) {
        return this.tagsRepo.updateTag(id, body.tag);
    }

    async deleteTag(id: number) {
        return this.tagsRepo.deleteTag(id);
    }
}
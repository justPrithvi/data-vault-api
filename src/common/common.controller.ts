import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import CommonService from "./common.service";
import { CognitoAuthGuard } from "src/auth/jwt-auth.guard";

@UseGuards(CognitoAuthGuard)
@Controller('internal')
export default class CommonController {
    constructor(
        private readonly commonService: CommonService
    ) {}

    @Post('/tags')
    async postTags(@Body() body: {tag:string}) {
        return this.commonService.postTags(body)
    }

    @Get('/tags')
    async getTags() {
        return this.commonService.getTags()
    }

    @Patch('/tags/:id')
    async updateTag(@Param('id') id: number, @Body() body: { tag: string }) {
        return this.commonService.updateTag(id, body);
    }

    @Delete('/tags/:id')
    async deleteTag(@Param('id') id: number) {
        return this.commonService.deleteTag(id);
    }
}
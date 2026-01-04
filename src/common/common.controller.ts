import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import CommonService from "./common.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AdminGuard } from "src/auth/admin.guard";

@UseGuards(JwtAuthGuard)
@Controller('internal')
export default class CommonController {
    constructor(
        private readonly commonService: CommonService
    ) {}

    @Post('/tags')
    @UseGuards(AdminGuard)
    async postTags(@Body() body: {tag:string}) {
        return this.commonService.postTags(body)
    }

    @Get('/tags')
    async getTags() {
        return this.commonService.getTags()
    }

    @Patch('/tags/:id')
    @UseGuards(AdminGuard)
    async updateTag(@Param('id') id: number, @Body() body: { tag: string }) {
        return this.commonService.updateTag(id, body.tag);
    }

    @Delete('/tags/:id')
    @UseGuards(AdminGuard)
    async deleteTag(@Param('id') id: number) {
        return this.commonService.deleteTag(id);
    }
}
import { Module } from "@nestjs/common";
import CommonController from "./common.controller";
import CommonService from "./common.service";
import { TagsRepository } from "src/repository/tags.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tags } from "src/entities/tags.entities";

@Module({
    imports:[
        TypeOrmModule.forFeature([Tags])
    ],
    controllers:[CommonController],
    providers:[CommonService, TagsRepository]
})
export default class CommonModule {}
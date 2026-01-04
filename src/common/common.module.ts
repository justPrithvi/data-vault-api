import { Module } from "@nestjs/common";
import CommonController from "./common.controller";
import CommonService from "./common.service";
import { TagsRepository } from "src/repository/tags.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tags } from "src/entities/tags.entities";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([Tags]),
        AuthModule
    ],
    controllers:[CommonController],
    providers:[CommonService, TagsRepository]
})
export default class CommonModule {}
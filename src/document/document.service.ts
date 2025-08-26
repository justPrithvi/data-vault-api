import { Injectable } from "@nestjs/common";
import { AwsService } from "src/aws/aws.service";

@Injectable()
export class DocumentService {
  constructor(private readonly awsService: AwsService) {}

  async getPresignedUrl(fileName: string, fileType: string) {
    // delegate to AWS service
    return this.awsService.getPresignedUploadUrl(fileName, fileType);
  }
}

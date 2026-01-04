import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AwsService {
  public s3: S3Client;
  public cognito: CognitoIdentityProviderClient;
  public lambda: LambdaClient;

  constructor(private config: ConfigService) {
    const credentials = {
      accessKeyId: this.config.get("AWS_ACCESS_KEY_ID"),
      secretAccessKey: this.config.get("AWS_SECRET_ACCESS_KEY"),
    };

    this.s3 = new S3Client({ region: this.config.get("AWS_REGION"), credentials });
    this.cognito = new CognitoIdentityProviderClient({ region: this.config.get("AWS_REGION"), credentials });
    this.lambda = new LambdaClient({ region: this.config.get("AWS_REGION"), credentials });
  }

  /** Generate presigned URL for uploading */
  async getPresignedUploadUrl(fileName: string, fileType: string, userName: string) {
    const bucket = this.config.get("AWS_S3_BUCKET_NAME");

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: `Documents/${userName}/${Date.now()}-${fileName}`, // add timestamp to avoid collisions
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 60 * 5 });
        
    return {
      uploadUrl,
      fileUrl: `https://${bucket}.s3.${this.config.get("AWS_REGION")}.amazonaws.com/Documents/${userName}/${Date.now()}-${fileName}`,
      key: `Documents/${userName}/${Date.now()}-${fileName}`,
    };
  }

  /** Generate presigned URL for downloading */
  async getPresignedDownloadUrl(key: string) {
    const bucket = this.config.get("AWS_S3_BUCKET_NAME");

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 60 * 5 });
  }
}

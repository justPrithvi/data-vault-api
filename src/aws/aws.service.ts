import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AwsService {
  public s3: S3Client;
  public cognito: CognitoIdentityProviderClient;
  public lambda: LambdaClient;

  constructor(private config: ConfigService) {
    const credentials = {
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
    };

    this.s3 = new S3Client({ region: this.config.get('AWS_REGION'), credentials });
    this.cognito = new CognitoIdentityProviderClient({ region: this.config.get('AWS_REGION'), credentials });
    this.lambda = new LambdaClient({ region: this.config.get('AWS_REGION'), credentials });
  }
}
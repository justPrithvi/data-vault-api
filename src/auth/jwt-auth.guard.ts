import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  constructor(private readonly awsService: AwsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException('No token found');
    const token = authHeader.replace('Bearer ', '');

    try {
      const result = await this.awsService.cognito.send(
        new GetUserCommand({
          AccessToken: token,
        }),
      );

      // Attach user info to request
      
      req.user = result;
      return true;
    } catch (err) {
      
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

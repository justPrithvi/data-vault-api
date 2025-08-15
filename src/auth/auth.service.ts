import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { AwsService } from '../aws/aws.service';
import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminInitiateAuthCommand,
  AdminConfirmSignUpCommand,
  AuthFlowType,
  SignUpCommand,
  ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private awsService: AwsService,
  ) {}

  // Step 1: Signup user
  async signUp(username: string, email: string, password: string) {
    
    // 1a. Create user in Cognito with temporary password
    const cognitoResponse = await this.awsService.cognito.send(
      new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'name', Value: username },
          { Name: 'email', Value: email },
        ],
      }),
    );

    
    // 1b. Save user in your DB
    const dbUser = await this.userRepository.createAndSave({
      email,
      name: username,
    });
  }

  // Step 2: Confirm signup code (from email/SMS)
  async confirmSignUp(email: string, code: string) {
    await this.awsService.cognito.send(
      new ConfirmSignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID ,
        ConfirmationCode: code,
        Username: email,
      }),
    );
    // now user is confirmed in Cognito
  }

  // Step 3: Set permanent password (optional)
  async setPermanentPassword(username: string, password: string) {
    await this.awsService.cognito.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
        Password: password,
        Permanent: true,
      }),
    );
  }

  // Step 4: Sign in
  async signIn(email: string, password: string) {
    const result = await this.awsService.cognito.send(
      new AdminInitiateAuthCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
        AuthParameters: { USERNAME: email, PASSWORD: password },
      }),
    );

    console.log(result);
    
    return {
      accessToken: result.AuthenticationResult?.AccessToken,
      idToken: result.AuthenticationResult?.IdToken,
      refreshToken: result.AuthenticationResult?.RefreshToken,
    };
  }
}

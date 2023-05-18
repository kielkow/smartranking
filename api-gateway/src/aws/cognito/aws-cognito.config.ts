import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsCognitoConfig {
  constructor(private configService: ConfigService) {}

  public userPoolId: string = this.configService.get<string>(
    'COGNITO_USER_POOL_ID',
  );
  public clientId: string = this.configService.get<string>('COGNITO_CLIENT_ID');

  public region: string = this.configService.get<string>('AWS_REGION_VIRGINIA');

  public awsAccessKeyID: string =
    this.configService.get<string>('AWS_ACCESS_KEY_ID');

  public awsSecretAccessKey: string = this.configService.get<string>(
    'AWS_SECRET_ACCESS_KEY',
  );

  public authority = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;
}

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Config {
  constructor(private configService: ConfigService) {}

  public awsRegion: string = this.configService.get<string>('AWS_REGION');

  public awsAccessKeyID: string =
    this.configService.get<string>('AWS_ACCESS_KEY_ID');

  public awsBucket: string =
    this.configService.get<string>('AWS_S3_BUCKET_NAME');

  public awsSecretAccessKey: string = this.configService.get<string>(
    'AWS_SECRET_ACCESS_KEY',
  );
}

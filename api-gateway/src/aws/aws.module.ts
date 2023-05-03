import { Module } from '@nestjs/common';

import { AwsS3Service } from './s3/aws-s3.service';
import { AwsCognitoService } from './cognito/aws-cognito.service';

import { AwsS3Config } from './s3/aws-s3.config';
import { AwsCognitoConfig } from './cognito/aws-cognito.config';

@Module({
  imports: [],
  controllers: [],
  providers: [AwsS3Service, AwsS3Config, AwsCognitoService, AwsCognitoConfig],
  exports: [AwsS3Service, AwsS3Config, AwsCognitoService, AwsCognitoConfig],
})
export class AwsModule {}

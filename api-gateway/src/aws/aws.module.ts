import { Module } from '@nestjs/common';

import { AwsS3Service } from './aws-s3.service';
import { AwsCognitoService } from './aws-cognito.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AwsS3Service, AwsCognitoService],
  exports: [AwsS3Service, AwsCognitoService],
})
export class AwsModule {}

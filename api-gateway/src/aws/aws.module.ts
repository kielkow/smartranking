import { Module } from '@nestjs/common';

import { AwsService } from './aws.service';
import { AwsCognitoService } from './aws-cognito.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AwsService, AwsCognitoService],
  exports: [AwsService, AwsCognitoService],
})
export class AwsModule {}

import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

import { AwsS3Config } from './aws-s3.config';

@Injectable()
export class AwsS3Service {
  private logger = new Logger(AwsS3Service.name);

  constructor(private awsS3Config: AwsS3Config) {}

  public async uploadArquivo(file: any, id: string) {
    const { awsRegion, awsBucket, awsAccessKeyID, awsSecretAccessKey } =
      this.awsS3Config;

    const s3 = new AWS.S3({
      region: awsRegion,
      accessKeyId: awsAccessKeyID,
      secretAccessKey: awsSecretAccessKey,
    });

    const fileExtension = file.originalname.split('.')[1];

    const urlKey = `${id}.${fileExtension}`;

    this.logger.log(urlKey);

    const data = s3
      .putObject({
        Body: file.buffer,
        Bucket: this.awsS3Config.awsBucket,
        Key: urlKey,
      })
      .promise()
      .then(
        () => {
          return {
            url: `https://${awsBucket}.s3-${awsRegion}.amazonaws.com/${urlKey}`,
          };
        },
        (error) => {
          this.logger.error(error);
          return error;
        },
      );

    return data;
  }
}

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import * as momentTimezone from 'moment-timezone';

import { AppModule } from './app.module';

const logger = new Logger('Main');

const configService = new ConfigService();
const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL');
const RABBITMQ_USER = configService.get<string>('RABBITMQ_USER');
const RABBITMQ_PASSWORD = configService.get<string>('RABBITMQ_PASSWORD');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_URL}`],
      noAck: false,
      queue: 'admin-backend-rankings',
    },
  });

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen().then(() => logger.log('microservice is listening'));
}
bootstrap();

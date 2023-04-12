import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxyFactoryProvider {
  constructor(private configService: ConfigService) {}

  getClientProxyInstance(): ClientProxy {
    const RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');
    const RABBITMQ_USER = this.configService.get<string>('RABBITMQ_USER');
    const RABBITMQ_PASSWORD =
      this.configService.get<string>('RABBITMQ_PASSWORD');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_URL}`],
        queue: 'admin-backend',
      },
    });
  }

  getClientProxyInstanceDesafios(): ClientProxy {
    const RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');
    const RABBITMQ_USER = this.configService.get<string>('RABBITMQ_USER');
    const RABBITMQ_PASSWORD =
      this.configService.get<string>('RABBITMQ_PASSWORD');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_URL}`],
        queue: 'admin-backend-desafios',
      },
    });
  }

  getClientProxyInstanceRankings(): ClientProxy {
    const RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');
    const RABBITMQ_USER = this.configService.get<string>('RABBITMQ_USER');
    const RABBITMQ_PASSWORD =
      this.configService.get<string>('RABBITMQ_PASSWORD');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_URL}`],
        queue: 'admin-backend-rankings',
      },
    });
  }
}

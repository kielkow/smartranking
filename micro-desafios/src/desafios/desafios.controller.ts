import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

import { DesafiosService } from './desafios.service';
import { Desafio } from './interfaces/desafio.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  logger = new Logger(DesafiosController.name);

  @EventPattern('criar-desafio')
  async criarDesafio(@Payload() desafio: Desafio, @Ctx() context: RmqContext) {
    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.desafiosService.criarDesafio(desafio);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) await channel.ack(originalMessage);
    }
  }
}

import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  MessagePattern,
} from '@nestjs/microservices';

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

  @MessagePattern('consultar-desafios')
  async consultarDesafios(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<Desafio[] | Desafio> {
    this.logger.log(`desafioID: ${id}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (id) return await this.desafiosService.consultarDesafioPorID(id);

      return await this.desafiosService.consultarDesafios();
    } finally {
      await channel.ack(originalMessage);
    }
  }
}

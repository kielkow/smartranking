import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

import { Partida } from './interfaces/partida.interface';

import { PartidasService } from './partidas.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class PartidasController {
  constructor(private readonly partidasService: PartidasService) {}

  logger = new Logger(PartidasController.name);

  @EventPattern('criar-partida')
  async criarPartida(@Payload() partida: Partida, @Ctx() context: RmqContext) {
    this.logger.log(`partida: ${JSON.stringify(partida)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.partidasService.criarPartida(partida);

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

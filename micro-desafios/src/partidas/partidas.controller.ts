import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  MessagePattern,
} from '@nestjs/microservices';

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

  @EventPattern('atualizar-partida')
  async atualizarPartida(
    @Payload() atualizarPartida: any,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`atualizar-partida: ${JSON.stringify(atualizarPartida)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const id: string = atualizarPartida.id;
      const partida = atualizarPartida.partida;

      await this.partidasService.atualizarPartida(id, partida);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) await channel.ack(originalMessage);
    }
  }

  @MessagePattern('consultar-partida-por-desafioID')
  async consultarPartidaPorDesafioID(
    @Payload() desafioID: string,
    @Ctx() context: RmqContext,
  ): Promise<Partida> {
    this.logger.log(`desafioID: ${desafioID}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      return await this.partidasService.consultarPartidaPorDesafioID(desafioID);
    } finally {
      await channel.ack(originalMessage);
    }
  }
}

import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { RankingResponse } from './interfaces/ranking-response.interface';

import { RankingsService } from './rankings.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  private readonly logger = new Logger(RankingsController.name);

  @EventPattern('processar-partida')
  async processarPartida(
    @Payload() partidaId: string,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`processar-partida: ${JSON.stringify(partidaId)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.rankingsService.processarPartida(partidaId);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) await channel.ack(originalMessage);
    }
  }

  @MessagePattern('consultar-rankings')
  async consultarDesafios(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<RankingResponse[] | RankingResponse> {
    this.logger.log(`consultar-rankings: ${JSON.stringify(data)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { categoriaId, dataRef } = data;

      return await this.rankingsService.consultarRankings(categoriaId, dataRef);
    } finally {
      await channel.ack(originalMessage);
    }
  }
}

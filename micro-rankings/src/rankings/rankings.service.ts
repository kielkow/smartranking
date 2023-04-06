import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';

import { ClientProxyFactoryProvider } from 'src/proxyrmq/client-proxy';
import { Ranking } from './interfaces/ranking.schema';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('Ranking') private readonly rankingModel: Model<Ranking>,
    private clientProxyFactoryProvider: ClientProxyFactoryProvider,
  ) {}

  private readonly logger = new Logger(RankingsService.name);

  private clientProxyDesafios =
    this.clientProxyFactoryProvider.getClientProxyInstanceDesafios();

  async processarPartida(partidaId: string): Promise<void> {
    try {
      this.logger.log(`partidaID: ${partidaId}`);

      // CONSULTA A PARTIDA
      const partida = await lastValueFrom(
        this.clientProxyDesafios.send('consultar-partidas', partidaId),
      );

      this.logger.log(`partida: ${JSON.stringify(partida)}`);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }
}

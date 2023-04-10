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

      // CRIA OS RANKINGS PARA CADA JOGADOR
      await Promise.all(
        partida.jogadores.map(async (jogador) => {
          const ranking = new this.rankingModel();

          ranking.categoria = partida.categoria;
          ranking.desafio = partida.desafio;
          ranking.partida = partidaId;
          ranking.jogador = jogador;

          if (jogador === partida.def) {
            ranking.evento = 'VITORIA';
            ranking.pontos = 30;
            ranking.operacao = '+';
          } else {
            ranking.evento = 'DERROTA';
            ranking.pontos = 0;
            ranking.operacao = '+';
          }

          this.logger.log(`ranking: ${JSON.stringify(ranking)}`);

          await ranking.save();
        }),
      );
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }
}

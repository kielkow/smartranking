import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import * as momentTimezone from 'moment-timezone';
import * as _ from 'lodash';

import { ClientProxyFactoryProvider } from 'src/proxyrmq/client-proxy';
import { Categoria } from './interfaces/categoria.interface';
import { EventoNome } from './interfaces/evento-nome.enum';
import { Partida } from './interfaces/partida.interface';
import { RankingResponse } from './interfaces/ranking-response.interface';
import { Ranking } from './interfaces/ranking.schema';
import { Desafio } from './interfaces/desafio.interface';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('Ranking') private readonly rankingModel: Model<Ranking>,
    private clientProxyFactoryProvider: ClientProxyFactoryProvider,
  ) {}

  private readonly logger = new Logger(RankingsService.name);

  private clientProxyDesafios =
    this.clientProxyFactoryProvider.getClientProxyInstanceDesafios();

  private clientProxyAdminBackend =
    this.clientProxyFactoryProvider.getClientProxyInstance();

  async processarPartida(partidaId: string): Promise<void> {
    try {
      this.logger.log(`partidaID: ${partidaId}`);

      // CONSULTA A PARTIDA
      const partida: Partida = await lastValueFrom(
        this.clientProxyDesafios.send('consultar-partidas', partidaId),
      );
      this.logger.log(`partida: ${JSON.stringify(partida)}`);

      // CONSULTA A CATEGORIA
      const categoria: Categoria = await lastValueFrom(
        this.clientProxyAdminBackend.send(
          'consultar-categorias',
          partida.categoria,
        ),
      );
      this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

      // CRIA OS RANKINGS PARA CADA JOGADOR
      await Promise.all(
        partida.jogadores.map(async (jogador) => {
          const ranking = new this.rankingModel();

          ranking.categoria = partida.categoria;
          ranking.desafio = partida.desafio;
          ranking.partida = partidaId;
          ranking.jogador = jogador;

          if (jogador === partida.def) {
            const eventoFilter = categoria.eventos.find(
              (evento) => evento.nome === EventoNome.VITORIA,
            );

            ranking.evento = EventoNome.VITORIA;
            ranking.pontos = eventoFilter.valor;
            ranking.operacao = eventoFilter.operacao;
          } else {
            const eventoFilter = categoria.eventos.find(
              (evento) => evento.nome === EventoNome.DERROTA,
            );

            ranking.evento = EventoNome.DERROTA;
            ranking.pontos = eventoFilter.valor;
            ranking.operacao = eventoFilter.operacao;
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

  async consultarRankings(
    categoriaId: string,
    dataRef: string,
  ): Promise<RankingResponse[] | RankingResponse> {
    try {
      this.logger.log(JSON.stringify({ categoriaId, dataRef }));

      // CASO NÃO SEJA INFORMADO UMA DATA BASE, É CALCULADO UMA DATA
      if (!dataRef) {
        dataRef = momentTimezone().tz('America/Sao_Paulo').format('YYYY-MM-DD');
      }

      // BUSCA OS RANKINGS PELA CATEGORIA ID
      const rankings = await this.rankingModel
        .find()
        .where('categoria')
        .equals(categoriaId)
        .exec();
      this.logger.log(JSON.stringify(rankings));

      // BUSCA OS DESAFIOS POR UMA DATA MENOR OU IGUAL A INFORMADA
      const desafios: Desafio[] = await lastValueFrom(
        this.clientProxyDesafios.send('consultar-desafios-realizados', {
          categoriaId,
          dataRef,
        }),
      );
      this.logger.log(JSON.stringify(desafios));

      // REMOVE OS RANKINGS QUE NÃO POSSUI DESAFIO RELACIONADO
      _.remove(rankings, (ranking) => {
        return (
          desafios.filter((desafio) => desafio._id === ranking.desafio)
            .length === 0
        );
      });
      this.logger.log(JSON.stringify(rankings));

      return;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }
}

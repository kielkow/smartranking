import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Ranking } from './interfaces/ranking.interface';

import { DesafiosService } from 'src/desafios/desafios.service';
import { PartidasService } from 'src/partidas/partidas.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriasService } from 'src/categorias/categorias.service';

import { RankingDTO } from './dtos/ranking.dto';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('Ranking') private readonly rankingModel: Model<Ranking>,
    private readonly desafiosService: DesafiosService,
    private readonly partidasService: PartidasService,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  private readonly logger = new Logger(RankingsService.name);

  async consultarRankings(): Promise<Ranking[]> {
    return await this.rankingModel
      .find()
      .populate({
        path: 'desafio',
        select: [
          '_id',
          'dataHoraDesafio',
          'status',
          'dataHoraSolicitacao',
          'solicitante',
          'jogadores',
          'createdAt',
          'updatedAt',
        ],
      })
      .populate({
        path: 'partida',
        select: ['_id', 'def', 'resultado', 'createdAt', 'updatedAt'],
      })
      .populate({
        path: 'categoria',
        select: [
          '_id',
          'categoria',
          'descricao',
          'eventos',
          'createdAt',
          'updatedAt',
        ],
      })
      .populate({
        path: 'jogador',
        select: [
          '_id',
          'nome',
          'email',
          'telefoneCelular',
          'urlFotoJogador',
          'posicaoRanking',
          'ranking',
          'createdAt',
          'updatedAt',
        ],
      })
      .exec();
  }

  async criarRanking(rankingDTO: RankingDTO): Promise<Ranking> {
    this.logger.log(`criarRanking: ${JSON.stringify(rankingDTO)}`);

    const desafio = await this.desafiosService.consultarDesafioPorId(
      rankingDTO.desafio,
    );

    const partida = await this.partidasService.consultarPartidaPorId(
      desafio.partida._id,
    );

    const categoria = await this.categoriasService.consultarCategoriaPorId(
      desafio.categoria._id,
    );

    const jogador = await this.jogadoresService.consultarJogadorPorId(
      partida.def,
    );

    const ranking = new this.rankingModel({
      desafio,
      partida,
      categoria,
      jogador,
      evento: categoria.eventos[0].nome,
      operacao: categoria.eventos[0].operacao,
      pontos: String(categoria.eventos[0].valor),
    });

    return await ranking.save();
  }

  async consultarRankingPorId(id: string): Promise<Ranking> {
    const ranking = await this.rankingModel
      .findOne({ _id: id })
      .populate({
        path: 'desafio',
        select: [
          '_id',
          'dataHoraDesafio',
          'status',
          'dataHoraSolicitacao',
          'solicitante',
          'jogadores',
          'createdAt',
          'updatedAt',
        ],
      })
      .populate({
        path: 'partida',
        select: ['_id', 'def', 'resultado', 'createdAt', 'updatedAt'],
      })
      .populate({
        path: 'categoria',
        select: [
          '_id',
          'categoria',
          'descricao',
          'eventos',
          'createdAt',
          'updatedAt',
        ],
      })
      .populate({
        path: 'jogador',
        select: [
          '_id',
          'nome',
          'email',
          'telefoneCelular',
          'urlFotoJogador',
          'posicaoRanking',
          'ranking',
          'createdAt',
          'updatedAt',
        ],
      })
      .exec();

    if (!ranking) {
      throw new NotFoundException(`Ranking com ID ${id} não encontrado`);
    }

    return ranking;
  }
}

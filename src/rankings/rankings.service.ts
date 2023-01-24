import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Ranking } from './interfaces/ranking.interface';

import { DesafiosService } from 'src/desafios/desafios.service';
import { PartidasService } from 'src/partidas/partidas.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriasService } from 'src/categorias/categorias.service';

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
      .populate('desafio')
      .populate('partida')
      .populate('categoria')
      .populate('jogador')
      .exec();
  }
}

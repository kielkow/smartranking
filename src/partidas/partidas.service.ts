import { Injectable, Logger } from '@nestjs/common';
import { Partida } from './interfaces/partida.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PartidaDTO } from './dtos/partida.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriasService } from 'src/categorias/categorias.service';

@Injectable()
export class PartidasService {
  constructor(
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  private readonly logger = new Logger(PartidasService.name);

  async consultarPartidas(): Promise<Partida[]> {
    return await this.partidaModel
      .find()
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
      .populate('jogadores')
      .exec();
  }

  async criarPartida(partidaDTO: PartidaDTO): Promise<Partida> {
    this.logger.log(`criarPartida: ${JSON.stringify(partidaDTO)}`);

    const { categoria: categoriaID } = partidaDTO;
    await this.categoriasService.consultarCategoriaPorId(categoriaID);

    const [jogadorID1, jogadorID2] = partidaDTO.jogadores;
    await this.jogadoresService.consultarJogadorPorId(jogadorID1);
    await this.jogadoresService.consultarJogadorPorId(jogadorID2);

    const partida = new this.partidaModel({
      ...partidaDTO,
      def: null,
    });

    return await partida.save();
  }
}

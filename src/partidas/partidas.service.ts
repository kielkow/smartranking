import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Partida } from './interfaces/partida.interface';

import { PartidaDTO } from './dtos/partida.dto';
import { AtualizarPartidaDTO } from './dtos/atualizar-partida.dto';

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

  async consultarPartidaPorId(id: string): Promise<Partida> {
    const partida = await this.partidaModel
      .findOne({ _id: id })
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

    if (!partida) {
      throw new NotFoundException(`Partida com ID ${id} não encontrada`);
    }

    return partida;
  }

  async atualizarPartida(
    id: string,
    atualizarPartidaDTO: AtualizarPartidaDTO,
  ): Promise<Partida> {
    this.logger.log(`atualizarPartida: ${JSON.stringify(atualizarPartidaDTO)}`);

    const partidaExistente = await this.partidaModel
      .findOne({ _id: id })
      .exec();

    if (!partidaExistente) {
      throw new NotFoundException(
        `Partida de ID ${partidaExistente._id} não encontrada`,
      );
    }

    await this.jogadoresService.consultarJogadorPorId(atualizarPartidaDTO.def);

    if (!String(partidaExistente.jogadores).includes(atualizarPartidaDTO.def)) {
      throw new BadRequestException(
        `Jogador de ID ${atualizarPartidaDTO.def} não faz parte da partida`,
      );
    }

    const partidaAtualizada = await this.partidaModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          def: atualizarPartidaDTO.def,
          resultado: atualizarPartidaDTO.resultado,
        },
      },
    );

    return partidaAtualizada;
  }

  async deletarPartida(id: string): Promise<void> {
    await this.partidaModel.deleteOne({ _id: id }).exec();
  }
}

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { DesafioDTO } from './dtos/desafio.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  private readonly logger = new Logger(DesafiosService.name);

  async consultarDesafios(): Promise<Desafio[]> {
    return await this.desafioModel
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

  async consultarDesafioPorJogadorId(jogadorId: string): Promise<Desafio> {
    const desafio = await this.desafioModel
      .findOne({ 'jogadores._id': jogadorId })
      .exec();

    return desafio;
  }

  async criarDesafio(desafioDTO: DesafioDTO): Promise<Desafio> {
    this.logger.log(`criarDesafio: ${JSON.stringify(desafioDTO)}`);

    const { solicitante: solicitanteID } = desafioDTO;
    const [jogadorID1, jogadorID2] = desafioDTO.jogadores;

    await this.jogadoresService.consultarJogadorPorId(jogadorID1);

    await this.jogadoresService.consultarJogadorPorId(jogadorID2);

    if (solicitanteID !== jogadorID1 && solicitanteID !== jogadorID2) {
      throw new BadRequestException(
        'O jogador solicitante não é um dos jogadores informados no desafio',
      );
    }

    const categoria =
      await this.categoriasService.consultarCategoriaPorJogadorId(
        solicitanteID,
      );

    const desafio = new this.desafioModel({
      ...desafioDTO,
      categoria,
      dataHoraSolicitacao: new Date(),
      status: DesafioStatus.PENDENTE,
    });

    return await desafio.save();
  }

  async atualizarDesafio(id: string, desafioDTO: DesafioDTO): Promise<Desafio> {
    this.logger.log(`atualizarDesafio: ${JSON.stringify(desafioDTO)}`);

    const desafioExistente = await this.desafioModel
      .findOne({ _id: id })
      .exec();

    if (!desafioExistente) {
      throw new NotFoundException('Desafio não encontrado');
    }

    const statusExistente:
      | DesafioStatus.ACEITO
      | DesafioStatus.NEGADO
      | DesafioStatus.CANCELADO =
      DesafioStatus[desafioDTO.status.toUpperCase()];

    if (!statusExistente) {
      throw new BadRequestException('Status inválido');
    }

    const jogadorAtualizado = await this.desafioModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          ...desafioExistente,
          dataHoraDesafio:
            desafioDTO.dataHoraDesafio || desafioExistente.dataHoraDesafio,
          status: desafioDTO.status || desafioExistente.status,
        },
      },
    );

    return jogadorAtualizado;
  }

  async deletarDesafio(id: string): Promise<void> {
    await this.desafioModel.deleteOne({ _id: id }).exec();
  }
}

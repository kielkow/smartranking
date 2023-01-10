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
    return await this.desafioModel.find().exec();
  }

  async consultarDesafioPorJogadorId(jogadorId: string): Promise<Desafio> {
    const desafio = await this.desafioModel
      .findOne({ 'jogadores._id': jogadorId })
      .exec();

    return desafio;
  }

  async criarDesafio(desafioDTO: DesafioDTO): Promise<Desafio> {
    this.logger.log(`criarDesafio: ${JSON.stringify(desafioDTO)}`);

    const { solicitante } = desafioDTO;
    const [jogador1, jogador2] = desafioDTO.jogadores;

    const jogador1Exist = await this.jogadoresService.consultarJogadorPorId(
      jogador1._id,
    );
    if (!jogador1Exist) {
      throw new NotFoundException(
        `Jogador de ID ${jogador1._id} não foi encontrado`,
      );
    }

    const jogador2Exist = await this.jogadoresService.consultarJogadorPorId(
      jogador2._id,
    );
    if (!jogador2Exist) {
      throw new NotFoundException(
        `Jogador de ID ${jogador2._id} não foi encontrado`,
      );
    }

    if (
      String(solicitante._id) !== String(jogador1._id) &&
      String(solicitante._id) !== String(jogador2._id)
    ) {
      throw new BadRequestException(
        'O jogador solicitante não é um dos jogadores informados no desafio',
      );
    }

    const solicitanteCategoria =
      await this.categoriasService.consultarCategoriaPorJogadorId(
        solicitante._id,
      );
    if (!solicitanteCategoria) {
      throw new BadRequestException(
        'Jogador solicitante não está em atribuido em nenhuma categoria',
      );
    }

    const { categoria } = solicitanteCategoria;

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
}

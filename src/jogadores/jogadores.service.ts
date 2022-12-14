import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JogadorDTO } from './dtos/jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(jogadorDTO: JogadorDTO): Promise<Jogador> {
    this.logger.log(`criarJogador: ${JSON.stringify(jogadorDTO)}`);

    const jogador = new this.jogadorModel(jogadorDTO);

    const jogadorExisteEmail = await this.jogadorModel
      .findOne({ email: jogadorDTO.email })
      .exec();

    const jogadorExisteTelefone = await this.jogadorModel
      .findOne({ telefoneCelular: jogadorDTO.telefoneCelular })
      .exec();

    if (jogadorExisteEmail || jogadorExisteTelefone) {
      throw new BadRequestException(
        'Jogador com este e-mail ou telefone já existe',
      );
    }

    return await jogador.save();
  }

  async atualizarJogador(id: string, jogadorDTO: JogadorDTO): Promise<Jogador> {
    this.logger.log(`atualizarJogador: ${JSON.stringify(jogadorDTO)}`);

    const jogadorExisteId = await this.jogadorModel.findOne({ _id: id }).exec();

    if (!jogadorExisteId) throw new NotFoundException('Jogador não encontrado');

    const jogadorExisteEmail = await this.jogadorModel
      .findOne({ email: jogadorDTO.email })
      .exec();

    const jogadorExisteTelefone = await this.jogadorModel
      .findOne({ telefoneCelular: jogadorDTO.telefoneCelular })
      .exec();

    if (
      String(jogadorExisteEmail._id) !== id ||
      String(jogadorExisteTelefone._id) !== id
    ) {
      throw new BadRequestException(
        'Jogador com este e-mail ou telefone já existe',
      );
    }

    const jogadorAtualizado = await this.jogadorModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: jogadorDTO,
      },
    );

    return jogadorAtualizado;
  }

  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPorId(
    id: string,
  ): Promise<Jogador | NotFoundException> {
    const jogador = await this.jogadorModel.findOne({ _id: id }).exec();

    if (!jogador) throw new NotFoundException('Jogador não encontrado');

    return jogador;
  }

  async deletarJogador(id: string): Promise<void> {
    await this.jogadorModel.deleteOne({ _id: id }).exec();
  }
}

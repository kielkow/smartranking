import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<void> {
    const { email } = criarJogadorDTO;

    const jogador = await this.jogadorModel.findOne({ email }).exec();

    if (!jogador) {
      await this.criar(criarJogadorDTO);
    } else {
      await this.atualizar(criarJogadorDTO);
    }
  }

  private async criar(criarJogadorDTO: CriarJogadorDTO): Promise<Jogador> {
    const jogador = new this.jogadorModel(criarJogadorDTO);

    this.logger.log(`criarJogador: ${JSON.stringify(jogador)}`);

    return await jogador.save();
  }

  private async atualizar(criarJogadorDTO: CriarJogadorDTO): Promise<Jogador> {
    const jogador = await this.jogadorModel
      .findOneAndUpdate(
        { email: criarJogadorDTO.email },
        { $set: criarJogadorDTO },
      )
      .exec();

    this.logger.log(`atualizarJogador: ${JSON.stringify(jogador)}`);

    return jogador;
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

  async deletarJogador(email: string): Promise<void> {
    await this.jogadorModel.deleteOne({ email }).exec();
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoriasService } from 'src/categorias/categorias.service';

import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
    private readonly categoriasService: CategoriasService,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(jogador: any): Promise<Jogador> {
    try {
      this.logger.log(JSON.stringify(jogador));

      const categoria = await this.categoriasService.consultarCategoriaPorID(
        jogador.categoria,
      );
      if (!categoria) throw 'Categoria informada não encontrada';

      const jogadorCriada = new this.jogadorModel(jogador);

      return await jogadorCriada.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async consultarJogadores(): Promise<Jogador[]> {
    try {
      return await this.jogadorModel.find().populate('categoria').exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async consultarJogadorPorID(id: string): Promise<Jogador> {
    try {
      return await this.jogadorModel.findById(id).populate('categoria').exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async atualizarJogador(id: string, jogador: any): Promise<void> {
    try {
      this.logger.log(JSON.stringify({ id, jogador }));

      if (jogador.categoria) {
        const categoria = await this.categoriasService.consultarCategoriaPorID(
          jogador.categoria,
        );
        if (!categoria) throw 'Categoria informada não encontrada';
      }

      await this.jogadorModel
        .findOneAndUpdate({ _id: id }, { $set: jogador })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async deletarJogador(id: string): Promise<void> {
    try {
      this.logger.log(id);

      await this.jogadorModel.findByIdAndDelete({ _id: id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }
}

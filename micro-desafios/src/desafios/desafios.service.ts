import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatus } from './interfaces/desafio-status.enum';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
  ) {}

  private readonly logger = new Logger(DesafiosService.name);

  async criarDesafio(desafio: Desafio): Promise<Desafio> {
    try {
      this.logger.log(JSON.stringify(desafio));

      const desafioCriado = new this.desafioModel(desafio);

      desafioCriado.status = DesafioStatus.PENDENTE;

      return await desafioCriado.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async consultarDesafios(): Promise<Desafio[]> {
    try {
      return await this.desafioModel.find().exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async consultarDesafioPorID(id: string): Promise<Desafio> {
    try {
      return await this.desafioModel.findById(id).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async consultarDesafiosPorJogadorID(jogadorId: string): Promise<Desafio[]> {
    return await this.desafioModel
      .find({ where: { 'jogadores._id': jogadorId } })
      .exec();
  }

  async atualizarDesafio(id: string, desafio: Desafio): Promise<void> {
    try {
      this.logger.log(JSON.stringify({ id, desafio }));

      desafio.dataHoraResposta = new Date();

      await this.desafioModel
        .findOneAndUpdate({ _id: id }, { $set: desafio })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async deletarDesafio(id: string): Promise<void> {
    try {
      this.logger.log(id);

      await this.desafioModel.findByIdAndDelete({ _id: id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async atribuirDesafioPartida(id: string, partidaId: string): Promise<void> {
    try {
      this.logger.log(JSON.stringify({ partidaId }));

      await this.desafioModel
        .findOneAndUpdate({ _id: id }, { $set: { partida: partidaId } })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }
}

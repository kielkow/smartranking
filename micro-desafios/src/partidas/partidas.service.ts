import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Partida } from './interfaces/partida.interface';

@Injectable()
export class PartidasService {
  constructor(
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
  ) {}

  private readonly logger = new Logger(PartidasService.name);

  async criarPartida(partida: Partida): Promise<Partida> {
    try {
      this.logger.log(JSON.stringify(partida));

      const partidaCriada = new this.partidaModel(partida);

      return await partidaCriada.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async atualizarPartida(id: string, partida: any): Promise<void> {
    try {
      this.logger.log(JSON.stringify({ id, partida }));

      await this.partidaModel
        .findOneAndUpdate({ _id: id }, { $set: partida })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async consultarPartidaPorDesafioID(desafioID: string): Promise<Partida> {
    return await this.partidaModel
      .findOne({ where: { desafio: desafioID } })
      .exec();
  }
}

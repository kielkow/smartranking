import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as momentTimezone from 'moment-timezone';

import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatus } from './interfaces/desafio-status.enum';

import { ClientProxyFactoryProvider } from 'src/proxyrmq/client-proxy';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    private clientProxyFactoryProvider: ClientProxyFactoryProvider,
  ) {}

  private readonly logger = new Logger(DesafiosService.name);

  private clientProxyRankings =
    this.clientProxyFactoryProvider.getClientProxyInstanceRankings();

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

      await this.desafioModel
        .findOneAndUpdate(
          { _id: id },
          { $set: { status: DesafioStatus.CANCELADO } },
        )
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async atribuirDesafioPartida(id: string, partidaId: string): Promise<void> {
    try {
      this.logger.log(JSON.stringify({ partidaId }));

      await this.desafioModel
        .findOneAndUpdate(
          { _id: id },
          { $set: { status: DesafioStatus.REALIZADO, partida: partidaId } },
        )
        .exec();

      this.clientProxyRankings.emit('processar-partida', partidaId);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async consultarDesafiosRealizados(categoriaId: string): Promise<Desafio[]> {
    try {
      return await this.desafioModel
        .find()
        .where('categoria')
        .equals(categoriaId)
        .where('status')
        .equals(DesafioStatus.REALIZADO)
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async consultarDesafiosRealizadosPelaData(
    categoriaId: string,
    dataRef: string,
  ): Promise<Desafio[]> {
    try {
      const dataRefNew = momentTimezone(`${dataRef} 23:59:59.999`)
        .tz('UTC')
        .format('YYYY-MM-DD HH:mm:ss.SSS+00:00');

      return await this.desafioModel
        .find()
        .where('categoria')
        .equals(categoriaId)
        .where('status')
        .equals(DesafioStatus.REALIZADO)
        .where('dataHoraDesafio')
        .lte(Date.parse(dataRefNew))
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }
}

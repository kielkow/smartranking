import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
  ) {}

  private readonly logger = new Logger(CategoriasService.name);

  async criarCategoria(categoria: Categoria): Promise<Categoria> {
    try {
      this.logger.log(JSON.stringify(categoria));

      const categoriaCriada = new this.categoriaModel(categoria);

      return await categoriaCriada.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async consultarCategorias(): Promise<Categoria[]> {
    try {
      return await this.categoriaModel.find().exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async consultarCategoriaPorID(id: string): Promise<Categoria> {
    try {
      return await this.categoriaModel.findById(id).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async atualizarCategoria(id: string, categoria: any): Promise<void> {
    try {
      this.logger.log(JSON.stringify({ id, categoria }));

      await this.categoriaModel
        .findOneAndUpdate({ _id: id }, { $set: categoria })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }

  async deletarCategoria(id: string): Promise<void> {
    try {
      this.logger.log(id);

      await this.categoriaModel.findByIdAndDelete({ _id: id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }
}

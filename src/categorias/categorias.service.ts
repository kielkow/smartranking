import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriaDTO } from './dtos/categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
  ) {}

  private readonly logger = new Logger(CategoriasService.name);

  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriaModel.find().exec();
  }

  async criarCategoria(categoriaDTO: CategoriaDTO): Promise<Categoria> {
    this.logger.log(`criarCategoria: ${JSON.stringify(categoriaDTO)}`);

    const categoria = new this.categoriaModel(categoriaDTO);

    const categoriaExiste = await this.categoriaModel
      .findOne({ categoria: categoriaDTO.categoria })
      .exec();

    if (categoriaExiste) {
      throw new BadRequestException('Categoria já existe');
    }

    return await categoria.save();
  }
}

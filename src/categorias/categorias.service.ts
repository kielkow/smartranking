import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { CategoriaDTO } from './dtos/categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(CategoriasService.name);

  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriaModel.find().populate('jogadores').exec();
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

  async consultarCategoriaPorId(
    id: string,
  ): Promise<Categoria | NotFoundException> {
    const categoria = await this.categoriaModel.findOne({ _id: id }).exec();

    if (!categoria) throw new NotFoundException('Categoria não encontrada');

    return categoria;
  }

  async atualizarCategoria(
    id: string,
    categoriaDTO: CategoriaDTO,
  ): Promise<Categoria> {
    this.logger.log(`atualizarCategoria: ${JSON.stringify(categoriaDTO)}`);

    const categoriaExisteId = await this.categoriaModel
      .findOne({ _id: id })
      .exec();

    if (!categoriaExisteId) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const categoriaExiste = await this.categoriaModel
      .findOne({ categoria: categoriaDTO.categoria })
      .exec();

    if (String(categoriaExiste._id) !== id) {
      throw new BadRequestException('Categoria com este nome já existe');
    }

    const categoriaAtualizada = await this.categoriaModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: categoriaDTO,
      },
    );

    return categoriaAtualizada;
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const categoriaId = params['categoriaId'];
    const jogadorId = params['jogadorId'];

    const categoria = await this.categoriaModel
      .findOne({
        _id: categoriaId,
      })
      .exec();

    if (!categoria) throw new NotFoundException('Categoria não encontrada');

    const jogador = await this.jogadorModel
      .findOne({
        _id: jogadorId,
      })
      .exec();

    if (!jogador) throw new NotFoundException('Jogador não encontrado');

    if (!categoria.jogadores.includes(jogador._id)) {
      categoria.jogadores.push(jogador._id);
    }

    await this.categoriaModel
      .findOneAndUpdate({ _id: categoria._id }, { $set: categoria })
      .exec();
  }
}

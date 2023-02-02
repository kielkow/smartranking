import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriaDTO } from './dtos/categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
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

  async consultarCategoriaPorId(id: string): Promise<Categoria> {
    const categoria = await this.categoriaModel.findById(id).exec();

    if (!categoria) throw new NotFoundException('Categoria não encontrada');

    return categoria;
  }

  async consultarCategoriaPorJogadorId(jogadorId: string): Promise<Categoria> {
    const categoria = await this.categoriaModel
      .findOne({ where: { 'jogadores._id': jogadorId } })
      .exec();

    if (!categoria) {
      throw new BadRequestException(
        `Jogador ${jogadorId} não está em atribuido em nenhuma categoria`,
      );
    }

    return categoria;
  }

  async atualizarCategoria(
    id: string,
    categoriaDTO: CategoriaDTO,
  ): Promise<Categoria> {
    this.logger.log(`atualizarCategoria: ${JSON.stringify(categoriaDTO)}`);

    const categoriaExisteId = await this.categoriaModel.findById(id).exec();

    if (!categoriaExisteId) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const categoriaExiste = await this.categoriaModel
      .findOne({ categoria: categoriaDTO.categoria })
      .exec();

    if (categoriaExiste && String(categoriaExiste._id) !== id) {
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

    await this.jogadoresService.consultarJogadorPorId(jogadorId);

    if (!categoria.jogadores.includes(jogadorId)) {
      categoria.jogadores.push(jogadorId);
    }

    await this.categoriaModel
      .findOneAndUpdate({ _id: categoria._id }, { $set: categoria })
      .exec();
  }

  async deletarCategoria(id: string): Promise<void> {
    await this.categoriaModel.deleteOne({ _id: id }).exec();
  }
}

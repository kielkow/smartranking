import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriaDTO } from './dtos/categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() categoriaDTO: CategoriaDTO): Promise<Categoria> {
    return await this.categoriasService.criarCategoria(categoriaDTO);
  }
}

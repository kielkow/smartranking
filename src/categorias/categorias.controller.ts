import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriaDTO } from './dtos/categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { CategoriasValidacaoParametrosPipe } from './pipes/categorias-validacao-parametros.pipe';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() categoriaDTO: CategoriaDTO): Promise<Categoria> {
    return await this.categoriasService.criarCategoria(categoriaDTO);
  }

  @Get()
  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriasService.consultarCategorias();
  }

  @Get('/:id')
  async consultarCategoria(
    @Param('id', CategoriasValidacaoParametrosPipe) id: string,
  ): Promise<Categoria | NotFoundException> {
    return await this.categoriasService.consultarCategoriaPorId(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() categoriaDTO: CategoriaDTO,
    @Param('id', CategoriasValidacaoParametrosPipe) id: string,
  ) {
    await this.categoriasService.atualizarCategoria(id, categoriaDTO);
  }
}

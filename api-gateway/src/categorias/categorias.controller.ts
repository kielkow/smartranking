import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CategoriaDTO } from './dtos/categoria.dto';
import { AtualizarCategoriaDTO } from './dtos/atualizar-categoria.dto';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { CategoriasService } from './categorias.service';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() categoriaDTO: CategoriaDTO) {
    this.categoriasService.criarCategoria(categoriaDTO);
  }

  @Get()
  async consultarCategorias(@Query('id') id: string) {
    return await this.categoriasService.consultarCategorias(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body() atualizarCategoriaDTO: AtualizarCategoriaDTO,
  ) {
    await this.categoriasService.verificarCategoriaExiste(id);

    this.categoriasService.atualizarCategoria(id, atualizarCategoriaDTO);
  }

  @Delete('/:id')
  async deletarCategoria(@Param('id', ValidacaoParametrosPipe) id: string) {
    await this.categoriasService.verificarCategoriaExiste(id);

    this.categoriasService.deletarCategoria(id);
  }
}

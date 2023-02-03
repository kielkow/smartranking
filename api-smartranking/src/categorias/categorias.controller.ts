import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriaDTO } from './dtos/categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() categoriaDTO: CategoriaDTO): Promise<Categoria> {
    return await this.categoriasService.criarCategoria(categoriaDTO);
  }

  @Get()
  async consultarCategorias(
    @Query('id') id: string,
  ): Promise<Categoria[] | Categoria> {
    if (id) {
      return await this.categoriasService.consultarCategoriaPorId(id);
    }

    return await this.categoriasService.consultarCategorias();
  }

  @Get('/:id')
  async consultarCategoriaPorId(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<Categoria | NotFoundException> {
    return await this.categoriasService.consultarCategoriaPorId(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() categoriaDTO: CategoriaDTO,
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.categoriasService.atualizarCategoria(id, categoriaDTO);
  }

  @Post('/:categoriaId/jogadores/:jogadorId')
  async atribuirCategoriaJogador(@Param() params: string[]): Promise<void> {
    await this.categoriasService.atribuirCategoriaJogador(params);
  }

  @Delete('/:id')
  async deletarCategoria(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.categoriasService.deletarCategoria(id);
  }
}

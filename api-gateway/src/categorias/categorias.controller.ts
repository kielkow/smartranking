import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { CategoriaDTO } from './dtos/categoria.dto';
import { AtualizarCategoriaDTO } from './dtos/atualizar-categoria.dto';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';
import { CategoriasService } from './categorias.service';

@Controller('api/v1/categorias')
export class CategoriasController {
  private logger = new Logger(CategoriasController.name);

  constructor(
    private clientProxyFactoryProvider: ClientProxyFactoryProvider,
    private categoriasService: CategoriasService,
  ) {}

  private clientAdminBackend =
    this.clientProxyFactoryProvider.getClientProxyInstance();

  @Post()
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() categoriaDTO: CategoriaDTO) {
    this.logger.log(`criar-categoria: ${JSON.stringify(categoriaDTO)}`);

    this.clientAdminBackend.emit('criar-categoria', categoriaDTO);
  }

  @Get()
  consultarCategorias(@Query('id') id: string): Observable<any> {
    this.logger.log(`consultar-categorias: ${id}`);

    return this.clientAdminBackend.send('consultar-categorias', id || '');
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body() atualizarCategoriaDTO: AtualizarCategoriaDTO,
  ) {
    this.logger.log(
      `atualizar-categoria: ${JSON.stringify(atualizarCategoriaDTO)}`,
    );

    await this.categoriasService.verificarCategoriaExiste(id);

    this.clientAdminBackend.emit('atualizar-categoria', {
      id,
      categoria: atualizarCategoriaDTO,
    });
  }

  @Delete('/:id')
  async deletarCategoria(@Param('id', ValidacaoParametrosPipe) id: string) {
    this.logger.log(`deletar-categoria: ${id}`);

    await this.categoriasService.verificarCategoriaExiste(id);

    this.clientAdminBackend.emit('deletar-categoria', id);
  }
}

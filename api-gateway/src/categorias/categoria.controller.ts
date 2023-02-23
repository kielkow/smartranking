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
import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy-factory-provider';

@Controller('api/v1')
export class CategoriaController {
  private logger = new Logger(CategoriaController.name);

  constructor(
    private readonly clientProxyFactoryProvider: ClientProxyFactoryProvider,
  ) {}

  @Post('categorias')
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() categoriaDTO: CategoriaDTO) {
    this.logger.log(`criar-categoria: ${JSON.stringify(categoriaDTO)}`);

    this.clientProxyFactoryProvider.clientProxy.emit(
      'criar-categoria',
      categoriaDTO,
    );
  }

  @Get('categorias')
  consultarCategorias(@Query('id') id: string): Observable<any> {
    this.logger.log(`consultar-categorias: ${id}`);

    return this.clientProxyFactoryProvider.clientProxy.send(
      'consultar-categorias',
      id || '',
    );
  }

  @Put('categorias/:id')
  @UsePipes(ValidationPipe)
  atualizarCategoria(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body() atualizarCategoriaDTO: AtualizarCategoriaDTO,
  ) {
    this.logger.log(
      `atualizar-categoria: ${JSON.stringify(atualizarCategoriaDTO)}`,
    );

    this.clientProxyFactoryProvider.clientProxy.emit('atualizar-categoria', {
      id,
      categoria: atualizarCategoriaDTO,
    });
  }

  @Delete('categorias/:id')
  deletarCategoria(@Param('id', ValidacaoParametrosPipe) id: string) {
    this.logger.log(`deletar-categoria: ${id}`);

    this.clientProxyFactoryProvider.clientProxy.emit('deletar-categoria', id);
  }
}

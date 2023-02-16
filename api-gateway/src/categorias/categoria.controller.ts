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
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { CategoriaDTO } from './dtos/categoria.dto';
import { AtualizarCategoriaDTO } from './dtos/atualizar-categoria.dto';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';

@Controller('api/v1')
export class CategoriaController {
  private logger = new Logger(CategoriaController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() categoriaDTO: CategoriaDTO) {
    this.logger.log(`criar-categoria: ${JSON.stringify(categoriaDTO)}`);

    this.clientAdminBackend.emit('criar-categoria', categoriaDTO);
  }

  @Get('categorias')
  consultarCategorias(@Query('id') id: string): Observable<any> {
    this.logger.log(`consultar-categorias: ${id}`);

    return this.clientAdminBackend.send('consultar-categorias', id || '');
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

    this.clientAdminBackend.emit('atualizar-categoria', {
      id,
      categoria: atualizarCategoriaDTO,
    });
  }

  @Delete('categorias/:id')
  deletarCategoria(@Param('id', ValidacaoParametrosPipe) id: string) {
    this.logger.log(`deletar-categoria: ${id}`);

    this.clientAdminBackend.emit('deletar-categoria', id);
  }
}

import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
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

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

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
}

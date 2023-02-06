import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { CategoriaDTO } from './dtos/categoria.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['http://guest:guest@localhost:15672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() categoriaDTO: CategoriaDTO): Promise<any> {
    this.logger.log(`criar-categoria: ${JSON.stringify(categoriaDTO)}`);

    return this.clientAdminBackend.emit('criar-categoria', categoriaDTO);
  }
}

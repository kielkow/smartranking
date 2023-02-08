import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { Categoria } from './interfaces/categorias/categoria.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(@Payload() categoria: Categoria) {
    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    await this.appService.criarCategoria(categoria);
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() id: string,
  ): Promise<Categoria[] | Categoria> {
    this.logger.log(`categoriaID: ${id}`);

    if (id) return await this.appService.consultarCategoriaPorID(id);

    return await this.appService.consultarCategorias();
  }
}

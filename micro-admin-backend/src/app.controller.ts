import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { AppService } from './app.service';
import { Categoria } from './interfaces/categorias/categoria.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    try {
      await this.appService.criarCategoria(categoria);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) await channel.ack(originalMessage);
    }
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

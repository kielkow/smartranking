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
    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

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
    @Ctx() context: RmqContext,
  ): Promise<Categoria[] | Categoria> {
    this.logger.log(`categoriaID: ${id}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (id) return await this.appService.consultarCategoriaPorID(id);

      return await this.appService.consultarCategorias();
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(
    @Payload() atualizarCategoria: any,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `atualizar-categoria: ${JSON.stringify(atualizarCategoria)}`,
    );

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const id: string = atualizarCategoria.id;
      const categoria = atualizarCategoria.categoria;

      await this.appService.atualizarCategoria(id, categoria);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) await channel.ack(originalMessage);
    }
  }
}

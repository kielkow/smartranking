import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { CategoriasService } from './categorias.service';
import { Categoria } from './interfaces/categoria.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  logger = new Logger(CategoriasController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.categoriasService.criarCategoria(categoria);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
        return;
      }

      await channel.nack(originalMessage);
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
      if (id) return await this.categoriasService.consultarCategoriaPorID(id);

      return await this.categoriasService.consultarCategorias();
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

      await this.categoriasService.atualizarCategoria(id, categoria);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
        return;
      }

      await channel.nack(originalMessage);
    }
  }

  @EventPattern('deletar-categoria')
  async deletarCategoria(@Payload() id: string, @Ctx() context: RmqContext) {
    this.logger.log(`deletar-categoria: ${id}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.categoriasService.deletarCategoria(id);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
        return;
      }

      await channel.nack(originalMessage);
    }
  }
}

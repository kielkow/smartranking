import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  MessagePattern,
} from '@nestjs/microservices';

import { Desafio } from './interfaces/desafio.interface';

import { DesafiosService } from './desafios.service';
import { PartidasService } from 'src/partidas/partidas.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class DesafiosController {
  constructor(
    private readonly desafiosService: DesafiosService,
    private readonly partidasService: PartidasService,
  ) {}

  logger = new Logger(DesafiosController.name);

  @EventPattern('criar-desafio')
  async criarDesafio(@Payload() desafio: Desafio, @Ctx() context: RmqContext) {
    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.desafiosService.criarDesafio(desafio);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) await channel.ack(originalMessage);
    }
  }

  @MessagePattern('consultar-desafios')
  async consultarDesafios(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<Desafio[] | Desafio> {
    this.logger.log(`desafioID: ${id}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (id) return await this.desafiosService.consultarDesafioPorID(id);

      return await this.desafiosService.consultarDesafios();
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('consultar-desafios-por-jogadorID')
  async consultarDesafiosPorJogadorID(
    @Payload() jogadorID: string,
    @Ctx() context: RmqContext,
  ): Promise<Desafio[]> {
    this.logger.log(`jogadorID: ${jogadorID}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      return await this.desafiosService.consultarDesafiosPorJogadorID(
        jogadorID,
      );
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('atualizar-desafio')
  async atualizarDesafio(
    @Payload() atualizarDesafio: any,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`atualizar-desafio: ${JSON.stringify(atualizarDesafio)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const id: string = atualizarDesafio.id;
      const desafio = atualizarDesafio.desafio;

      await this.desafiosService.atualizarDesafio(id, desafio);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) await channel.ack(originalMessage);
    }
  }

  @EventPattern('deletar-desafio')
  async deletarDesafio(@Payload() id: string, @Ctx() context: RmqContext) {
    this.logger.log(`deletar-desafio: ${id}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.desafiosService.deletarDesafio(id);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) await channel.ack(originalMessage);
    }
  }

  @EventPattern('atribuir-desafio-partida')
  async atribuirDesafioPartida(
    @Payload() atribuirDesafioPartida: any,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `atribuir-desafio-partida: ${JSON.stringify(atribuirDesafioPartida)}`,
    );

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const id: string = atribuirDesafioPartida.id;
      const desafio = atribuirDesafioPartida.desafio;

      await this.partidasService.atribuirDesafioPartida(id, desafio);

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

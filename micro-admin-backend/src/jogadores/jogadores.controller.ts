import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  logger = new Logger(JogadoresController.name);

  @EventPattern('criar-jogador')
  async criarJogador(@Payload() jogador: Jogador, @Ctx() context: RmqContext) {
    this.logger.log(`jogador: ${JSON.stringify(jogador)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.jogadoresService.criarJogador(jogador);

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

  @MessagePattern('consultar-jogadores')
  async consultarJogadores(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<Jogador[] | Jogador> {
    this.logger.log(`jogadorID: ${id}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (id) return await this.jogadoresService.consultarJogadorPorID(id);

      return await this.jogadoresService.consultarJogadores();
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('atualizar-jogador')
  async atualizarJogador(
    @Payload() atualizarJogador: any,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`atualizar-jogador: ${JSON.stringify(atualizarJogador)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const id: string = atualizarJogador.id;
      const jogador = atualizarJogador.jogador;

      await this.jogadoresService.atualizarJogador(id, jogador);

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

  @EventPattern('deletar-jogador')
  async deletarJogador(@Payload() id: string, @Ctx() context: RmqContext) {
    this.logger.log(`deletar-jogador: ${id}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.jogadoresService.deletarJogador(id);

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

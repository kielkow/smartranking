import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

import { AppService } from './app.service';
import { Desafio } from './interfaces/desafio.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @EventPattern('notificacao-novo-desafio')
  async enviarEmailAdversario(
    @Payload() desafio: Desafio,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.logger.log(`notificacao-novo-desafio: ${JSON.stringify(desafio)}`);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.appService.enviarEmailParaAdversario(desafio);

      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
        return;
      }

      await channel.nack(originalMsg);
    }
  }
}

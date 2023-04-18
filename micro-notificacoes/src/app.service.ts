import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { lastValueFrom } from 'rxjs';

import { Desafio } from './interfaces/desafio.interface';
import { ClientProxyFactoryProvider } from './proxyrmq/client-proxy';
import { Jogador } from './interfaces/jogador.interface';
import HTML_NOTIFICACAO_ADVERSARIO from './static/html-notificacao-adversario';

@Injectable()
export class AppService {
  constructor(
    private clientProxySmartRanking: ClientProxyFactoryProvider,
    private readonly mailService: MailerService,
  ) {}

  private readonly logger = new Logger(AppService.name);

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyInstance();

  async enviarEmailParaAdversario(desafio: Desafio): Promise<void> {
    try {
      /*
        Identificar o ID do adversario
      */

      let idAdversario = '';

      desafio.jogadores.map((jogador) => {
        if (jogador != desafio.solicitante) {
          idAdversario = jogador;
        }
      });

      //Consultar as informações adicionais dos jogadores
      const adversario: Jogador = await lastValueFrom(
        this.clientAdminBackend.send('consultar-jogadores', idAdversario),
      );

      const solicitante: Jogador = await lastValueFrom(
        this.clientAdminBackend.send(
          'consultar-jogadores',
          desafio.solicitante,
        ),
      );

      let markup = '';

      markup = HTML_NOTIFICACAO_ADVERSARIO;
      markup = markup.replace(/#NOME_ADVERSARIO/g, adversario.nome);
      markup = markup.replace(/#NOME_SOLICITANTE/g, solicitante.nome);

      this.mailService
        .sendMail({
          to: adversario.email,
          from: `"SMART RANKING" <api.smartranking@gmail.com>`,
          subject: 'Notificação de Desafio',
          html: markup,
        })
        .then((success) => {
          this.logger.log(success);
        })
        .catch((err) => {
          this.logger.error(err);
        });
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}

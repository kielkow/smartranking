import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';

import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  constructor(private clientProxyFactoryProvider: ClientProxyFactoryProvider) {}

  private clientAdminBackendJogadores =
    this.clientProxyFactoryProvider.getClientProxyInstance();

  private readonly logger = new Logger(JogadoresService.name);

  async verificarJogadorExiste(id: string): Promise<Jogador> {
    this.logger.log(`verificar-jogador-existe: ${id}`);

    const jogador: Jogador = await lastValueFrom(
      this.clientAdminBackendJogadores.send('consultar-jogadores', id),
    );
    if (!jogador) {
      throw new BadRequestException(`Jogador ${id} não encontrado`);
    }

    return jogador;
  }
}

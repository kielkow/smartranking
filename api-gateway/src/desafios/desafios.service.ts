import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';

import { Desafio } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {
  constructor(private clientProxyFactoryProvider: ClientProxyFactoryProvider) {}

  private clientAdminBackendDesafios =
    this.clientProxyFactoryProvider.getClientProxyInstanceDesafios();

  private readonly logger = new Logger(DesafiosService.name);

  async verificarDesafioExiste(id: string): Promise<Desafio> {
    this.logger.log(`verificar-desafio-existe: ${id}`);

    const desafio: Desafio = await lastValueFrom(
      this.clientAdminBackendDesafios.send('consultar-desafios', id),
    );
    if (!desafio) {
      throw new BadRequestException(`Desafio ${id} não encontrado`);
    }

    return desafio;
  }
}

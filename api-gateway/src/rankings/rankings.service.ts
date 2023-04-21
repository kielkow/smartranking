import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';

@Injectable()
export class RankingsService {
  private logger = new Logger(RankingsService.name);

  constructor(private clientProxyFactoryProvider: ClientProxyFactoryProvider) {}

  private clientProxyRankings =
    this.clientProxyFactoryProvider.getClientProxyInstanceRankings();

  consultarRankings(categoriaId: string, dataRef: string): Observable<any> {
    this.logger.log(
      `consultar-rankings: ${JSON.stringify({
        categoriaId,
        dataRef,
      })}`,
    );

    if (!categoriaId) {
      throw new BadRequestException('O ID da categoria deve ser informado');
    }

    return this.clientProxyRankings.send('consultar-rankings', {
      categoriaId,
      dataRef,
    });
  }
}

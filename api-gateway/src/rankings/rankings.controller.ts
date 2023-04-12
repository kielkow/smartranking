import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';

import { RankingsService } from './rankings.service';

@Controller('api/v1/rankings')
export class RankingsController {
  private logger = new Logger(RankingsController.name);

  constructor(
    private clientProxyFactoryProvider: ClientProxyFactoryProvider,
    private rankingsService: RankingsService,
  ) {}

  private clientProxyRankings =
    this.clientProxyFactoryProvider.getClientProxyInstanceRankings();

  @Get()
  consultarCategorias(
    @Query('categoriaId') categoriaId: string,
    @Query('dataRef') dataRef: string,
  ): Observable<any> {
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

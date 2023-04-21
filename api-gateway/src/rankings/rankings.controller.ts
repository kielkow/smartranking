import { Controller, Get, Query } from '@nestjs/common';

import { RankingsService } from './rankings.service';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private rankingsService: RankingsService) {}

  @Get()
  consultarRankings(
    @Query('categoriaId') categoriaId: string,
    @Query('dataRef') dataRef: string,
  ) {
    return this.rankingsService.consultarRankings(categoriaId, dataRef);
  }
}

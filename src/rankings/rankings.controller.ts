import { Controller, Get } from '@nestjs/common';

import { Ranking } from './interfaces/ranking.interface';

import { RankingsService } from './rankings.service';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  async consultarRankings(): Promise<Ranking[]> {
    return await this.rankingsService.consultarRankings();
  }
}

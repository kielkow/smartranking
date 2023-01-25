import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RankingDTO } from './dtos/ranking.dto';

import { Ranking } from './interfaces/ranking.interface';

import { RankingsService } from './rankings.service';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  async consultarRankings(): Promise<Ranking[]> {
    return await this.rankingsService.consultarRankings();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarRanking(@Body() rankingDTO: RankingDTO): Promise<void> {
    await this.rankingsService.criarRanking(rankingDTO);
  }
}

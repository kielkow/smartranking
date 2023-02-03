import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { RankingDTO } from './dtos/ranking.dto';

import { Ranking } from './interfaces/ranking.interface';

import { RankingsService } from './rankings.service';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  async consultarRankings(
    @Query('id') id: string,
  ): Promise<Ranking[] | Ranking> {
    if (id) {
      return await this.rankingsService.consultarRankingPorId(id);
    }

    return await this.rankingsService.consultarRankings();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarRanking(@Body() rankingDTO: RankingDTO): Promise<void> {
    await this.rankingsService.criarRanking(rankingDTO);
  }

  @Get('/:id')
  async consultarRankingPorId(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<Ranking> {
    return await this.rankingsService.consultarRankingPorId(id);
  }

  @Delete('/:id')
  async deletarRanking(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.rankingsService.deletarRanking(id);
  }
}

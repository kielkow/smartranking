import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriasModule } from 'src/categorias/categorias.module';
import { JogadoresModule } from 'src/jogadores/jogadores.module';
import { PartidasModule } from 'src/partidas/partidas.module';

import { RankingSchema } from './interfaces/ranking.schema';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Ranking',
        schema: RankingSchema,
      },
    ]),
    PartidasModule,
    JogadoresModule,
    CategoriasModule,
  ],
  controllers: [RankingsController],
  providers: [RankingsService],
})
export class RankingsModule {}

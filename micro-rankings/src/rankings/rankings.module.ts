import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RankingSchema } from './interfaces/ranking.schema';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';
import { ClientProxyModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ranking', schema: RankingSchema }]),
    ClientProxyModule,
  ],
  controllers: [RankingsController],
  providers: [RankingsService],
  exports: [RankingsService],
})
export class RankingsModule {}

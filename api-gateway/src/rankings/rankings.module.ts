import { Module } from '@nestjs/common';

import { ClientProxyModule } from 'src/common/providers/client-proxy/client-proxy.module';

import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

@Module({
  imports: [ClientProxyModule],
  controllers: [RankingsController],
  providers: [RankingsService],
  exports: [RankingsService],
})
export class RankingsModule {}

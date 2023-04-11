import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { RankingsModule } from './rankings/rankings.module';
import { ClientProxyModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/srrankings'),
    RankingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ClientProxyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

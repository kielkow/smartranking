import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/srrankings'),
    RankingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

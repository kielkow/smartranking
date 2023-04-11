import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { DesafiosModule } from './desafios/desafios.module';
import { PartidasModule } from './partidas/partidas.module';
import { ClientProxyModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/srdesafios'),
    DesafiosModule,
    PartidasModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ClientProxyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

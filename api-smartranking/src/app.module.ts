import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DesafiosModule } from './desafios/desafios.module';
import { PartidasModule } from './partidas/partidas.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/smartranking'),
    JogadoresModule,
    CategoriasModule,
    DesafiosModule,
    PartidasModule,
    RankingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

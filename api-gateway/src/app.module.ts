import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { DesafiosModule } from './desafios/desafios.module';

import { ClientProxyFactoryProvider } from './common/providers/client-proxy/client-proxy-provider-factory';
import { ClientProxyModule } from './common/providers/client-proxy/client-proxy.module';
import { AwsModule } from './aws/aws.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    CategoriasModule,
    JogadoresModule,
    DesafiosModule,
    RankingsModule,
    ClientProxyModule,
    AwsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [ClientProxyFactoryProvider],
})
export class AppModule {}

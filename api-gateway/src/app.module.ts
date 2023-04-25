import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AwsModule } from './aws/aws.module';
import { AuthModule } from './auth/auth.module';
import { RankingsModule } from './rankings/rankings.module';
import { DesafiosModule } from './desafios/desafios.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';

import { ClientProxyModule } from './common/providers/client-proxy/client-proxy.module';
import { ClientProxyFactoryProvider } from './common/providers/client-proxy/client-proxy-provider-factory';

@Module({
  imports: [
    CategoriasModule,
    JogadoresModule,
    DesafiosModule,
    RankingsModule,
    ClientProxyModule,
    AwsModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [ClientProxyFactoryProvider],
})
export class AppModule {}

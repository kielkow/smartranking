import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';

import { ClientProxyFactoryProvider } from './common/providers/client-proxy/client-proxy-provider-factory';
import { ClientProxyModule } from './common/providers/client-proxy/client-proxy.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    CategoriasModule,
    JogadoresModule,
    ClientProxyModule,
    AwsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [ClientProxyFactoryProvider],
})
export class AppModule {}

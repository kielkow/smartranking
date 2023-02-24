import { Module } from '@nestjs/common';

import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';

import { ClientProxyFactoryProvider } from './common/providers/client-proxy/client-proxy-provider-factory';
import { ClientProxyModule } from './common/providers/client-proxy/client-proxy.module';

@Module({
  imports: [CategoriasModule, JogadoresModule, ClientProxyModule],
  controllers: [],
  providers: [ClientProxyFactoryProvider],
})
export class AppModule {}

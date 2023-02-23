import { Module } from '@nestjs/common';

import { CategoriaController } from './categorias/categoria.controller';
import { ClientProxyFactoryProvider } from './common/providers/client-proxy-factory-provider';
import { JogadorController } from './jogadores/jogadores.controller';

@Module({
  imports: [],
  controllers: [CategoriaController, JogadorController],
  providers: [ClientProxyFactoryProvider],
})
export class AppModule {}

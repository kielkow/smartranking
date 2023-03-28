import { Module } from '@nestjs/common';

import { DesafiosController } from './desafios.controller';
import { ClientProxyModule } from '../common/providers/client-proxy/client-proxy.module';
import { DesafiosService } from './desafios.service';
import { JogadoresModule } from 'src/jogadores/jogadores.module';
import { CategoriasModule } from 'src/categorias/categorias.module';

@Module({
  imports: [ClientProxyModule, JogadoresModule, CategoriasModule],
  providers: [DesafiosService],
  controllers: [DesafiosController],
  exports: [DesafiosService],
})
export class DesafiosModule {}

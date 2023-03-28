import { Module } from '@nestjs/common';

import { CategoriasController } from './categorias.controller';
import { ClientProxyModule } from '../common/providers/client-proxy/client-proxy.module';
import { CategoriasService } from './categorias.service';

@Module({
  imports: [ClientProxyModule],
  providers: [CategoriasService],
  controllers: [CategoriasController],
  exports: [CategoriasService],
})
export class CategoriasModule {}

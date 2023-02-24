import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { ClientProxyModule } from '../common/providers/client-proxy/client-proxy.module';

@Module({
  imports: [ClientProxyModule],
  controllers: [CategoriasController],
})
export class CategoriasModule {}

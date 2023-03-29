import { Module } from '@nestjs/common';

import { AwsModule } from 'src/aws/aws.module';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { ClientProxyModule } from '../common/providers/client-proxy/client-proxy.module';
import { JogadoresController } from './jogadores.controller';
import { JogadoresService } from './jogadores.service';

@Module({
  imports: [ClientProxyModule, AwsModule, CategoriasModule],
  providers: [JogadoresService],
  controllers: [JogadoresController],
  exports: [JogadoresService],
})
export class JogadoresModule {}

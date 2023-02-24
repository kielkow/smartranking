import { Module } from '@nestjs/common';
import { ClientProxyModule } from '../common/providers/client-proxy/client-proxy.module';
import { JogadoresController } from './jogadores.controller';

@Module({
  imports: [ClientProxyModule],
  controllers: [JogadoresController],
})
export class JogadoresModule {}

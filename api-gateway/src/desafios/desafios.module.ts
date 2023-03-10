import { Module } from '@nestjs/common';
import { DesafiosController } from './desafios.controller';
import { ClientProxyModule } from '../common/providers/client-proxy/client-proxy.module';

@Module({
  imports: [ClientProxyModule],
  controllers: [DesafiosController],
})
export class DesafiosModule {}

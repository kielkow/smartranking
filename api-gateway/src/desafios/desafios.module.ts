import { Module } from '@nestjs/common';

import { DesafiosController } from './desafios.controller';
import { ClientProxyModule } from '../common/providers/client-proxy/client-proxy.module';
import { DesafiosService } from './desafios.service';

@Module({
  imports: [ClientProxyModule],
  providers: [DesafiosService],
  controllers: [DesafiosController],
})
export class DesafiosModule {}

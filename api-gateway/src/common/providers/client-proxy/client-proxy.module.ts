import { Module } from '@nestjs/common';
import { ClientProxyFactoryProvider } from './client-proxy-provider-factory';

@Module({
  providers: [ClientProxyFactoryProvider],
  exports: [ClientProxyFactoryProvider],
})
export class ClientProxyModule {}

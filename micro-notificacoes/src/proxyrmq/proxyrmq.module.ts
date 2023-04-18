import { Module } from '@nestjs/common';
import { ClientProxyFactoryProvider } from './client-proxy';

@Module({
  providers: [ClientProxyFactoryProvider],
  exports: [ClientProxyFactoryProvider],
})
export class ClientProxyModule {}

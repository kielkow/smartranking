import { Controller, Logger } from '@nestjs/common';

import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';

@Controller('api/v1/desafios')
export class DesafiosController {
  private logger = new Logger(DesafiosController.name);

  constructor(private clientProxyFactoryProvider: ClientProxyFactoryProvider) {}

  private clientAdminBackend =
    this.clientProxyFactoryProvider.getClientProxyInstance();
}

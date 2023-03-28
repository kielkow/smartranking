import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';

import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(private clientProxyFactoryProvider: ClientProxyFactoryProvider) {}

  private clientAdminBackendCategorias =
    this.clientProxyFactoryProvider.getClientProxyInstance();

  private readonly logger = new Logger(CategoriasService.name);

  async verificarCategoriaExiste(id: string): Promise<Categoria> {
    this.logger.log(`verificar-categoria-existe: ${id}`);

    const categoria: Categoria = await lastValueFrom(
      this.clientAdminBackendCategorias.send('consultar-categorias', id),
    );
    if (!categoria) {
      throw new BadRequestException(`Categoria ${id} não encontrado`);
    }

    return categoria;
  }
}

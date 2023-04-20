import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';

import { Categoria } from './interfaces/categoria.interface';
import { CategoriaDTO } from './dtos/categoria.dto';
import { AtualizarCategoriaDTO } from './dtos/atualizar-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private clientProxyFactoryProvider: ClientProxyFactoryProvider) {}

  private clientAdminBackend =
    this.clientProxyFactoryProvider.getClientProxyInstance();

  private readonly logger = new Logger(CategoriasService.name);

  async verificarCategoriaExiste(id: string): Promise<Categoria> {
    this.logger.log(`verificar-categoria-existe: ${id}`);

    const categoria: Categoria = await lastValueFrom(
      this.clientAdminBackend.send('consultar-categorias', id),
    );
    if (!categoria) {
      throw new BadRequestException(`Categoria ${id} não encontrado`);
    }

    return categoria;
  }

  async criarCategoria(categoriaDTO: CategoriaDTO) {
    this.logger.log(`criar-categoria: ${JSON.stringify(categoriaDTO)}`);

    this.clientAdminBackend.emit('criar-categoria', categoriaDTO);
  }

  async consultarCategorias(id: string): Promise<any> {
    this.logger.log(`consultar-categorias: ${id}`);

    return this.clientAdminBackend.send('consultar-categorias', id || '');
  }

  async atualizarCategoria(
    id: string,
    atualizarCategoriaDTO: AtualizarCategoriaDTO,
  ) {
    this.logger.log(
      `atualizar-categoria: ${JSON.stringify(atualizarCategoriaDTO)}`,
    );

    this.clientAdminBackend.emit('atualizar-categoria', {
      id,
      categoria: atualizarCategoriaDTO,
    });
  }

  async deletarCategoria(id: string) {
    this.logger.log(`deletar-categoria: ${id}`);

    this.clientAdminBackend.emit('deletar-categoria', id);
  }
}

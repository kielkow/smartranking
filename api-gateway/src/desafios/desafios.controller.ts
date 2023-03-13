import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';
import { DesafioDTO } from './dtos/desafio.dto';

@Controller('api/v1/desafios')
export class DesafiosController {
  private logger = new Logger(DesafiosController.name);

  constructor(private clientProxyFactoryProvider: ClientProxyFactoryProvider) {}

  private clientAdminBackend =
    this.clientProxyFactoryProvider.getClientProxyInstance();

  private clientAdminBackendDesafios =
    this.clientProxyFactoryProvider.getClientProxyInstanceDesafios();

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() desafioDTO: DesafioDTO) {
    this.logger.log(`criar-desafio: ${JSON.stringify(desafioDTO)}`);

    // VERIFICAR SE A CATEGORIA EXISTE
    const categoria: Categoria = await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-categorias',
        desafioDTO.categoria,
      ),
    );
    if (!categoria) throw new BadRequestException(`Categoria não encontrada`);

    // VERIFICAR SE OS JOGADORES EXISTEM
    const jogadorID1 = desafioDTO.jogadores[0];
    const jogadorID2 = desafioDTO.jogadores[1];

    const jogador1: Jogador = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', jogadorID1),
    );
    if (!jogador1) {
      throw new BadRequestException(`Jogador ${jogadorID1} não encontrado`);
    }

    const jogador2: Jogador = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', jogadorID2),
    );
    if (!jogador2) {
      throw new BadRequestException(`Jogador ${jogadorID2} não encontrado`);
    }

    // VERIFICAR SE A CATEGORIA É A MESMA DOS JOGADORES
    if (
      categoria._id !== jogador1.categoria ||
      categoria._id !== jogador2.categoria
    ) {
      throw new BadRequestException(
        'A categoria informada não é a mesma dos jogadores',
      );
    }

    // VERIFICAR SE O SOLICITANTE É UM DOS JOGADORES INFORMADOS
    if (
      desafioDTO.solicitante !== jogadorID1 &&
      desafioDTO.solicitante !== jogadorID2
    ) {
      throw new BadRequestException(
        'O jogador solicitante não é um dos jogadores informados no desafio',
      );
    }

    // CRIAR DESAFIO
    this.clientAdminBackendDesafios.emit('criar-desafio', desafioDTO);
  }
}

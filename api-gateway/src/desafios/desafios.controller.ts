import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';

import { DesafioDTO } from './dtos/desafio.dto';
import { AtualizarDesafioDTO } from './dtos/atualizar-desafio.dto';

import { Desafio } from './interfaces/desafio.interface';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';

import { DesafioStatusPipe } from './pipes/desafio-status.pipe';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';

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

  @Get()
  async consultarDesafios(
    @Query('id') id: string,
    @Query('idJogador') idJogador: string,
  ): Promise<Observable<any>> {
    this.logger.log(
      `consultar-desafios: idDesafio(${id})-idJogador(${idJogador})`,
    );

    if (idJogador) {
      const jogador: Jogador = await lastValueFrom(
        this.clientAdminBackend.send('consultar-jogadores', idJogador),
      );
      if (!jogador) {
        throw new BadRequestException(`Jogador ${idJogador} não encontrado`);
      }

      return this.clientAdminBackendDesafios.send(
        'consultar-desafios',
        idJogador,
      );
    }

    return this.clientAdminBackendDesafios.send('consultar-desafios', id || '');
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body(DesafioStatusPipe) atualizarDesafioDTO: AtualizarDesafioDTO,
  ) {
    this.logger.log(
      `atualizar-desafio: ${JSON.stringify(atualizarDesafioDTO)}`,
    );

    const desafio: Desafio = await lastValueFrom(
      this.clientAdminBackendDesafios.send('consultar-desafios', id),
    );
    if (!desafio) {
      throw new BadRequestException(`Desafio ${id} não encontrado`);
    }

    this.clientAdminBackendDesafios.emit('atualizar-desafio', {
      id,
      desafio: atualizarDesafioDTO,
    });
  }

  @Delete('/:id')
  async deletarDesafio(@Param('id', ValidacaoParametrosPipe) id: string) {
    this.logger.log(`deletar-desafio: ${id}`);

    const desafio: Desafio = await lastValueFrom(
      this.clientAdminBackendDesafios.send('consultar-desafios', id),
    );
    if (!desafio) {
      throw new BadRequestException(`Desafio ${id} não encontrado`);
    }

    this.clientAdminBackendDesafios.emit('deletar-desafio', id);
  }
}

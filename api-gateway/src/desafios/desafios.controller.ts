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
import { AtribuirDesafioPartidaDTO } from './dtos/atribuir-desafio-partida.dto';

import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';

import { DesafioStatusPipe } from './pipes/desafio-status.pipe';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { DesafiosService } from './desafios.service';

@Controller('api/v1/desafios')
export class DesafiosController {
  private logger = new Logger(DesafiosController.name);

  constructor(
    private clientProxyFactoryProvider: ClientProxyFactoryProvider,
    private readonly desafiosService: DesafiosService,
  ) {}

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
        'consultar-desafios-por-jogadorID',
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

    await this.desafiosService.verificarDesafioExiste(id);

    this.clientAdminBackendDesafios.emit('atualizar-desafio', {
      id,
      desafio: atualizarDesafioDTO,
    });
  }

  @Delete('/:id')
  async deletarDesafio(@Param('id', ValidacaoParametrosPipe) id: string) {
    this.logger.log(`deletar-desafio: ${id}`);

    await this.desafiosService.verificarDesafioExiste(id);

    this.clientAdminBackendDesafios.emit('deletar-desafio', id);
  }

  @Put('/:id/atribuirpartida')
  @UsePipes(ValidationPipe)
  async atribuirDesafioPartida(
    @Body() atribuirDesafioPartidaDTO: AtribuirDesafioPartidaDTO,
    @Param('id', ValidacaoParametrosPipe) id: string,
  ) {
    this.logger.log(
      `atribuir-desafio-partida: ${JSON.stringify(atribuirDesafioPartidaDTO)}`,
    );

    // VERIFICA SE O DESAFIO EXISTE
    const desafio = await this.desafiosService.verificarDesafioExiste(id);

    // VERIFICA STATUS DO DESAFIO
    if (desafio.status != DesafioStatus.ACEITO) {
      throw new BadRequestException(
        'Apenas é possível atribuir partida para desafios com status ACEITO',
      );
    }

    // VERIFICA SE O JOGADOR INFORMADO FAZ PARTE DO DESAFIO
    if (
      !desafio.jogadores.find(
        (jogador) => jogador._id === atribuirDesafioPartidaDTO.def,
      )
    ) {
      throw new BadRequestException(
        'Jogador informado não faz parte do desafio',
      );
    }

    this.clientAdminBackendDesafios.emit('atribuir-desafio-partida', {
      id,
      desafio: atribuirDesafioPartidaDTO,
    });
  }
}

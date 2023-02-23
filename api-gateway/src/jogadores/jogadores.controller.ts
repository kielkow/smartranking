import {
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

import { Observable } from 'rxjs';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy-factory-provider';
import { AtualizarJogadorDTO } from './dtos/atualizarJogador.dto';
import { JogadorDTO } from './dtos/jogador.dto';

@Controller('api/v1')
export class JogadorController {
  private logger = new Logger(JogadorController.name);

  constructor(
    private readonly clientProxyFactoryProvider: ClientProxyFactoryProvider,
  ) {}

  @Post('jogadores')
  @UsePipes(ValidationPipe)
  criarJogador(@Body() jogadorDTO: JogadorDTO) {
    this.logger.log(`criar-jogador: ${JSON.stringify(jogadorDTO)}`);

    this.clientProxyFactoryProvider.clientProxy.emit(
      'criar-jogador',
      jogadorDTO,
    );
  }

  @Get('jogadores')
  consultarJogadores(@Query('id') id: string): Observable<any> {
    this.logger.log(`consultar-jogadores: ${id}`);

    return this.clientProxyFactoryProvider.clientProxy.send(
      'consultar-jogadores',
      id || '',
    );
  }

  @Put('jogadores/:id')
  @UsePipes(ValidationPipe)
  atualizarJogador(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body() atualizarJogadorDTO: AtualizarJogadorDTO,
  ) {
    this.logger.log(
      `atualizar-jogador: ${JSON.stringify(atualizarJogadorDTO)}`,
    );

    this.clientProxyFactoryProvider.clientProxy.emit('atualizar-jogador', {
      id,
      jogador: atualizarJogadorDTO,
    });
  }

  @Delete('jogadores/:id')
  deletarJogador(@Param('id', ValidacaoParametrosPipe) id: string) {
    this.logger.log(`deletar-jogador: ${id}`);

    this.clientProxyFactoryProvider.clientProxy.emit('deletar-jogador', id);
  }
}

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

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';

import { AtualizarJogadorDTO } from './dtos/atualizarJogador.dto';
import { JogadorDTO } from './dtos/jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  private logger = new Logger(JogadoresController.name);

  constructor(private clientProxyFactoryProvider: ClientProxyFactoryProvider) {}

  private clientAdminBackend =
    this.clientProxyFactoryProvider.getClientProxyInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() jogadorDTO: JogadorDTO) {
    this.logger.log(`criar-jogador: ${JSON.stringify(jogadorDTO)}`);

    const categoria = await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-categorias',
        jogadorDTO.categoria,
      ),
    );

    if (!categoria) throw new BadRequestException(`Categoria não encontrada`);

    this.clientAdminBackend.emit('criar-jogador', jogadorDTO);
  }

  @Get()
  consultarJogadores(@Query('id') id: string): Observable<any> {
    this.logger.log(`consultar-jogadores: ${id}`);

    return this.clientAdminBackend.send('consultar-jogadores', id || '');
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body() atualizarJogadorDTO: AtualizarJogadorDTO,
  ) {
    this.logger.log(
      `atualizar-jogador: ${JSON.stringify(atualizarJogadorDTO)}`,
    );

    if (atualizarJogadorDTO.categoria) {
      const categoria = await lastValueFrom(
        this.clientAdminBackend.send(
          'consultar-categorias',
          atualizarJogadorDTO.categoria,
        ),
      );

      if (!categoria) throw new BadRequestException(`Categoria não encontrada`);
    }

    this.clientAdminBackend.emit('atualizar-jogador', {
      id,
      jogador: atualizarJogadorDTO,
    });
  }

  @Delete('/:id')
  deletarJogador(@Param('id', ValidacaoParametrosPipe) id: string) {
    this.logger.log(`deletar-jogador: ${id}`);

    this.clientAdminBackend.emit('deletar-jogador', id);
  }
}

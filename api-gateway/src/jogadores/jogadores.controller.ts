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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { lastValueFrom, Observable } from 'rxjs';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';
import { AwsService } from 'src/aws/aws.service';

import { AtualizarJogadorDTO } from './dtos/atualizarJogador.dto';
import { JogadorDTO } from './dtos/jogador.dto';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  private logger = new Logger(JogadoresController.name);

  constructor(
    private clientProxyFactoryProvider: ClientProxyFactoryProvider,
    private jogadoresService: JogadoresService,
    private awsService: AwsService,
  ) {}

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

    await this.jogadoresService.verificarJogadorExiste(id);

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
  async deletarJogador(@Param('id', ValidacaoParametrosPipe) id: string) {
    this.logger.log(`deletar-jogador: ${id}`);

    await this.jogadoresService.verificarJogadorExiste(id);

    this.clientAdminBackend.emit('deletar-jogador', id);
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(@UploadedFile() file, @Param('id') id: string) {
    this.logger.log(`upload-arquivo-jogador: id(${id})-file(${file})`);

    await this.jogadoresService.verificarJogadorExiste(id);

    const { url: urlFotoJogador } = await this.awsService.uploadArquivo(
      file,
      id,
    );

    await lastValueFrom(
      this.clientAdminBackend.emit('atualizar-jogador', {
        id,
        jogador: { urlFotoJogador },
      }),
    );

    return this.clientAdminBackend.send('consultar-jogadores', id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
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

import { Observable } from 'rxjs';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';

import { AtualizarJogadorDTO } from './dtos/atualizarJogador.dto';
import { JogadorDTO } from './dtos/jogador.dto';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() jogadorDTO: JogadorDTO) {
    await this.jogadoresService.criarJogador(jogadorDTO);
  }

  @Get()
  consultarJogadores(@Query('id') id: string): Observable<any> {
    return this.jogadoresService.consultarJogadores(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body() atualizarJogadorDTO: AtualizarJogadorDTO,
  ) {
    await this.jogadoresService.verificarJogadorExiste(id);

    await this.jogadoresService.atualizarJogador(id, atualizarJogadorDTO);
  }

  @Delete('/:id')
  async deletarJogador(@Param('id', ValidacaoParametrosPipe) id: string) {
    await this.jogadoresService.verificarJogadorExiste(id);

    this.jogadoresService.deletarJogador(id);
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(@UploadedFile() file: any, @Param('id') id: string) {
    await this.jogadoresService.verificarJogadorExiste(id);

    return await this.jogadoresService.uploadArquivo(file, id);
  }
}

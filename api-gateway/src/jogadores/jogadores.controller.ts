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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { Observable } from 'rxjs';
import { Request } from 'express';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';

import { AtualizarJogadorDTO } from './dtos/atualizarJogador.dto';
import { JogadorDTO } from './dtos/jogador.dto';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  private logger = new Logger(JogadoresController.name);

  constructor(private jogadoresService: JogadoresService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() jogadorDTO: JogadorDTO) {
    await this.jogadoresService.criarJogador(jogadorDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  consultarJogadores(
    @Req() req: Request,
    @Query('id') id: string,
  ): Observable<any> {
    this.logger.log(`req: ${JSON.stringify(req.user)}`);

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

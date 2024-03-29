import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { DesafiosService } from './desafios.service';
import { AtribuirDesafioPartidaDTO } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDTO } from './dtos/atualizar-desafio.dto';
import { DesafioDTO } from './dtos/desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusPipe } from './pipes/desafio-status.pipe';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Get()
  async consultarDesafios(
    @Query('id') id: string,
  ): Promise<Desafio[] | Desafio> {
    if (id) {
      return await this.desafiosService.consultarDesafioPorId(id);
    }

    return await this.desafiosService.consultarDesafios();
  }

  @Get('/:id')
  async consultarDesafioPorId(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<Desafio> {
    return await this.desafiosService.consultarDesafioPorId(id);
  }

  @Get('/jogador/:jogadorId')
  async consultarDesafiosPorJogadorId(
    @Param('jogadorId', ValidacaoParametrosPipe) jogadorId: string,
  ): Promise<Desafio[]> {
    return await this.desafiosService.consultarDesafiosPorJogadorId(jogadorId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() desafioDTO: DesafioDTO): Promise<void> {
    await this.desafiosService.criarDesafio(desafioDTO);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Body(DesafioStatusPipe) atualizarDesafioDTO: AtualizarDesafioDTO,
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.desafiosService.atualizarDesafio(id, atualizarDesafioDTO);
  }

  @Delete('/:id')
  async deletarDesafio(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.desafiosService.deletarDesafio(id);
  }

  @Put('/:id/atribuirpartida')
  @UsePipes(ValidationPipe)
  async atribuirDesafioPartida(
    @Body() atribuirDesafioPartidaDTO: AtribuirDesafioPartidaDTO,
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.desafiosService.atribuirDesafioPartida(
      id,
      atribuirDesafioPartidaDTO,
    );
  }
}

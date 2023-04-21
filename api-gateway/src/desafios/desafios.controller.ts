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

import { DesafioDTO } from './dtos/desafio.dto';
import { AtualizarDesafioDTO } from './dtos/atualizar-desafio.dto';
import { AtribuirDesafioPartidaDTO } from './dtos/atribuir-desafio-partida.dto';

import { DesafioStatusPipe } from './pipes/desafio-status.pipe';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';

import { DesafiosService } from './desafios.service';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() desafioDTO: DesafioDTO) {
    await this.desafiosService.criarDesafio(desafioDTO);
  }

  @Get()
  async consultarDesafios(
    @Query('id') id: string,
    @Query('idJogador') idJogador: string,
  ) {
    return await this.desafiosService.consultarDesafios(id, idJogador);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body(DesafioStatusPipe) atualizarDesafioDTO: AtualizarDesafioDTO,
  ) {
    await this.desafiosService.atualizarDesafio(id, atualizarDesafioDTO);
  }

  @Delete('/:id')
  async deletarDesafio(@Param('id', ValidacaoParametrosPipe) id: string) {
    await this.desafiosService.deletarDesafio(id);
  }

  @Put('/:id/atribuirpartida')
  @UsePipes(ValidationPipe)
  async atribuirDesafioPartida(
    @Body() atribuirDesafioPartidaDTO: AtribuirDesafioPartidaDTO,
    @Param('id', ValidacaoParametrosPipe) id: string,
  ) {
    await this.desafiosService.atribuirDesafioPartida(
      atribuirDesafioPartidaDTO,
      id,
    );
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { Partida } from './interfaces/partida.interface';
import { PartidaDTO } from './dtos/partida.dto';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';

@Controller('api/v1/partidas')
export class PartidasController {
  constructor(private readonly partidasService: PartidasService) {}

  @Get()
  async consultarPartidas(): Promise<Partida[]> {
    return await this.partidasService.consultarPartidas();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarPartida(@Body() partidaDTO: PartidaDTO): Promise<void> {
    await this.partidasService.criarPartida(partidaDTO);
  }

  @Get('/:id')
  async consultarPartida(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<Partida> {
    return await this.partidasService.consultarPartidaPorId(id);
  }

  @Delete('/:id')
  async deletarPartida(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.partidasService.deletarPartida(id);
  }
}

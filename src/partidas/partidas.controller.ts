import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { Partida } from './interfaces/partida.interface';
import { PartidaDTO } from './dtos/partida.dto';

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
}

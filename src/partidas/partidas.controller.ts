import { Controller, Get } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { Partida } from './interfaces/partida.interface';

@Controller('api/v1/partidas')
export class PartidasController {
  constructor(private readonly partidasService: PartidasService) {}

  @Get()
  async consultarPartidas(): Promise<Partida[]> {
    return await this.partidasService.consultarPartidas();
  }
}

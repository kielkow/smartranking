import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  async criarAtualizarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    await this.jogadoresService.criarAtualizarJogador(criarJogadorDTO);
  }

  @Get()
  async consultarJogadores(
    @Query('email') email: string,
  ): Promise<Jogador | Jogador[] | NotFoundException> {
    if (email) {
      return this.jogadoresService.consultarJogadorPorEmail(email);
    }

    return this.jogadoresService.consultarJogadores();
  }
}

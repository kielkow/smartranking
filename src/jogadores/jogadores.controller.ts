import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarAtualizarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    await this.jogadoresService.criarAtualizarJogador(criarJogadorDTO);
  }

  @Get()
  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadoresService.consultarJogadores();
  }

  @Get()
  async consultarJogador(
    @Query('email', JogadoresValidacaoParametrosPipe) email: string,
  ): Promise<Jogador | NotFoundException> {
    return await this.jogadoresService.consultarJogadorPorEmail(email);
  }

  @Delete()
  async deletarJogador(
    @Query('email', JogadoresValidacaoParametrosPipe) email: string,
  ): Promise<void> {
    await this.jogadoresService.deletarJogador(email);
  }
}

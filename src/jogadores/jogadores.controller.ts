import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JogadorDTO } from './dtos/jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Get()
  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadoresService.consultarJogadores();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() jogadorDTO: JogadorDTO): Promise<void> {
    await this.jogadoresService.criarJogador(jogadorDTO);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() jogadorDTO: JogadorDTO,
    @Param('id', JogadoresValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(id, jogadorDTO);
  }

  @Get('/:id')
  async consultarJogador(
    @Param('id', JogadoresValidacaoParametrosPipe) id: string,
  ): Promise<Jogador> {
    return await this.jogadoresService.consultarJogadorPorId(id);
  }

  @Delete('/:id')
  async deletarJogador(
    @Param('id', JogadoresValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.jogadoresService.deletarJogador(id);
  }
}

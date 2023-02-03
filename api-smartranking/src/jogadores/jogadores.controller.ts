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
import { JogadorDTO } from './dtos/jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Get()
  async consultarJogadores(
    @Query('id') id: string,
  ): Promise<Jogador[] | Jogador> {
    if (id) {
      return await this.jogadoresService.consultarJogadorPorId(id);
    }

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
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(id, jogadorDTO);
  }

  @Get('/:id')
  async consultarJogadorPorId(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<Jogador> {
    return await this.jogadoresService.consultarJogadorPorId(id);
  }

  @Delete('/:id')
  async deletarJogador(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.jogadoresService.deletarJogador(id);
  }
}

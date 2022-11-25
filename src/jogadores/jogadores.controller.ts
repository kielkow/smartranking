import { Body, Controller, Post } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  @Post()
  async criarAtualizarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    const { nome, email, telefoneCelular } = criarJogadorDTO;

    return JSON.stringify({
      nome,
      email,
      telefoneCelular,
    });
  }
}

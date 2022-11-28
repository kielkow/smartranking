import { Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<void> {
    this.criar(criarJogadorDTO);
  }

  private criar(criarJogadorDTO: CriarJogadorDTO): void {
    const { nome, email, telefoneCelular } = criarJogadorDTO;

    const jogador: Jogador = {
      _id: uuidv4(),
      nome,
      email,
      telefoneCelular,
      ranking: 'A',
      posicaoRanking: '1',
      urlFotoJogador: '',
    };

    this.logger.log(`criarJogadorDTO: ${JSON.stringify(jogador)}`);

    this.jogadores.push(jogador);
  }
}

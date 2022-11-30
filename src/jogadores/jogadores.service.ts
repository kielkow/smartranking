import { Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<void> {
    const { email } = criarJogadorDTO;

    const jogador = this.jogadores.find((jogador) => jogador.email === email);

    if (!jogador) {
      this.criar(criarJogadorDTO);
    } else {
      this.atualizar(jogador, criarJogadorDTO);
    }
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

    this.logger.log(`criarJogador: ${JSON.stringify(jogador)}`);

    this.jogadores.push(jogador);
  }

  private atualizar(jogador: Jogador, criarJogadorDTO: CriarJogadorDTO): void {
    const { nome } = criarJogadorDTO;

    jogador.nome = nome;

    this.logger.log(`atualizarJogador: ${JSON.stringify(jogador)}`);
  }

  async consultarJogadores(): Promise<Jogador[]> {
    return this.jogadores;
  }
}

import { Categoria } from 'src/categorias/interfaces/categoria.interface';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { Desafio } from './desafio.interface';

export interface Partida {
  desafio: Desafio;

  categoria: Categoria;

  jogadores: Array<Jogador>;

  def?: string;

  resultado?: Array<Resultado>;
}

export interface Resultado {
  set: string;
}

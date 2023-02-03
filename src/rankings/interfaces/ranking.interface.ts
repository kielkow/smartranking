import { Document } from 'mongoose';

import { Categoria } from 'src/categorias/interfaces/categoria.interface';
import { Desafio } from 'src/desafios/interfaces/desafio.interface';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { Partida } from 'src/partidas/interfaces/partida.interface';

export interface Ranking extends Document {
  desafio: Desafio;

  partida: Partida;

  categoria: Categoria;

  jogador: Jogador;

  evento: string;

  operacao: string;

  pontos: string;
}

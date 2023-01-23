import { Document } from 'mongoose';

import { Categoria } from 'src/categorias/interfaces/categoria.interface';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { Partida } from 'src/partidas/interfaces/partida.interface';

export interface Ranking extends Document {
  desafio: string;

  partida: Partida;

  categoria: Categoria;

  jogador: Jogador;

  evento: string;

  operacao: string;

  pontos: string;
}

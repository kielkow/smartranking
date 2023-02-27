import { Document } from 'mongoose';

import { Categoria } from 'src/categorias/interfaces/categoria.interface';

export interface Jogador extends Document {
  readonly telefoneCelular: string;

  readonly email: string;

  nome: string;

  ranking: string;

  posicaoRanking: string;

  urlFotoJogador: string;

  categoria: Categoria;
}

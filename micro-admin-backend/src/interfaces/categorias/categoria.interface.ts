import { Document } from 'mongoose';

import { Jogador } from '../jogadores/jogador.interface';

export interface Categoria extends Document {
  readonly categoria: string;

  descricao: string;

  eventos: Array<Evento>;

  jogadores: Array<Jogador>;
}

export interface Evento extends Document {
  nome: string;

  operacao: string;

  valor: number;
}
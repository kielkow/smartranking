import { Document } from 'mongoose';

export interface Partida extends Document {
  categoria: string;

  jogadores: Array<string>;

  def: string;

  resultado: Array<Resultado>;
}

export interface Resultado {
  set: string;
}

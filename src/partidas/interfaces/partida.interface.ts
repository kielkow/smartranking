import { Document } from 'mongoose';

import { Categoria } from 'src/categorias/interfaces/categoria.interface';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

export interface Partida extends Document {
  categoria: Categoria;

  jogadores: Array<Jogador>;

  def: Jogador;

  resultado: Array<Resultado>;
}

export interface Resultado {
  set: string;
}

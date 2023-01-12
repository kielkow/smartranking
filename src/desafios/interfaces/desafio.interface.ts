import { Document } from 'mongoose';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';

import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { DesafioStatus } from './desafio-status.enum';
import { Partida } from './partida.interface';

export interface Desafio extends Document {
  dataHoraDesafio: Date;

  status: DesafioStatus;

  dataHoraSolicitacao: Date;

  dataHoraResposta: Date;

  solicitante: Jogador;

  categoria: Categoria;

  jogadores: Array<Jogador>;

  partida: Partida;
}

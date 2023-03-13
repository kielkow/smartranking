import { DesafioStatus } from './desafio-status.enum';

import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';
import { Partida } from './partida.interface';

export interface Desafio {
  dataHoraDesafio: Date;

  status: DesafioStatus;

  dataHoraSolicitacao: Date;

  dataHoraResposta: Date;

  solicitante: Jogador;

  categoria: Categoria;

  jogadores: Array<Jogador>;

  partida: Partida;
}

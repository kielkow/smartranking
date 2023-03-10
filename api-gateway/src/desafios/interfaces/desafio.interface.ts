import { DesafioStatus } from './desafio-status.enum';

import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
// import { Partida } from '../../partidas/interfaces/partida.interface';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';

export interface Desafio {
  dataHoraDesafio: Date;

  status: DesafioStatus;

  dataHoraSolicitacao: Date;

  dataHoraResposta: Date;

  solicitante: Jogador;

  categoria: Categoria;

  jogadores: Array<Jogador>;

  // partida: Partida;
}

import { Document } from 'mongoose';

import { DesafioStatus } from './desafio-status.enum';

export interface Desafio extends Document {
  _id: string;

  dataHoraDesafio: Date;

  status: DesafioStatus;

  dataHoraSolicitacao: Date;

  dataHoraResposta?: Date;

  solicitante: string;

  categoria: string;

  jogadores: Array<string>;

  partida?: string;
}

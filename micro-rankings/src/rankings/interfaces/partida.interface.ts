export interface Partida {
  categoria: string;

  desafio: string;

  jogadores: Array<string>;

  def: string;

  resultado: Array<Resultado>;
}

export interface Resultado {
  set: string;
}

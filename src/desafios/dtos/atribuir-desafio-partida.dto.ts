import { IsNotEmpty } from 'class-validator';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { Resultado } from 'src/partidas/interfaces/partida.interface';

export class AtribuirDesafioPartidaDTO {
  @IsNotEmpty()
  def: Jogador;

  @IsNotEmpty()
  resultado: Array<Resultado>;
}

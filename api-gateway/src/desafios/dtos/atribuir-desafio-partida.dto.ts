import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
// import { Resultado } from 'src/partidas/interfaces/partida.interface';

export class AtribuirDesafioPartidaDTO {
  @IsNotEmpty()
  @IsString()
  def: string;

  // @IsNotEmpty()
  // @IsArray()
  // @ArrayMinSize(1)
  // resultado: Array<Resultado>;
}

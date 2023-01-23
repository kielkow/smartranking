import { IsNotEmpty, IsString } from 'class-validator';

export class RankingDTO {
  @IsNotEmpty()
  @IsString()
  desafio: string;

  @IsNotEmpty()
  @IsString()
  partida: string;
}

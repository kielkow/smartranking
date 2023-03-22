import { IsDateString, IsOptional, IsString } from 'class-validator';

export class AtualizarDesafioDTO {
  @IsOptional()
  @IsDateString()
  dataHoraDesafio: Date;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  partida: string;
}

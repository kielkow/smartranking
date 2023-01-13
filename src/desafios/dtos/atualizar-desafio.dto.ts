import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class AtualizarDesafioDTO {
  @IsNotEmpty()
  @IsDateString()
  dataHoraDesafio: Date;

  @IsNotEmpty()
  @IsString()
  status: string;
}

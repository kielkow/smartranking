import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AtualizarJogadorDTO {
  @IsOptional()
  @IsString()
  readonly nome: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly telefoneCelular: string;
}

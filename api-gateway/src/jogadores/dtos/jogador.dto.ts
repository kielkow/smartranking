import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JogadorDTO {
  @IsNotEmpty()
  @IsString()
  readonly nome: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly telefoneCelular: string;

  @IsNotEmpty()
  @IsString()
  readonly categoria: string;
}

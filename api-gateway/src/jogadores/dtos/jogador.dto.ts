import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JogadorDTO {
  @IsNotEmpty()
  @IsString()
  readonly nome: string;

  @IsEmail()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly telefoneCelular: string;
}

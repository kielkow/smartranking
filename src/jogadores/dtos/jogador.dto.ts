import { IsEmail, IsNotEmpty } from 'class-validator';

export class JogadorDTO {
  @IsNotEmpty()
  readonly nome: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly telefoneCelular: string;
}

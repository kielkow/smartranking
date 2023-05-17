import { IsEmail } from 'class-validator';

export class AuthEsquecerSenhaUsuarioDTO {
  @IsEmail()
  email: string;
}

import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class AuthConfirmarSenhaUsuarioDTO {
  @IsEmail()
  email: string;

  @IsString()
  codigoConfirmacao: string;

  /*
      - Minimo 8 caracteres
      - Uma letra maiuscula
      - Uma letra minuscula
      - Um numero
    */
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'senha inválida',
  })
  novaSenha: string;
}

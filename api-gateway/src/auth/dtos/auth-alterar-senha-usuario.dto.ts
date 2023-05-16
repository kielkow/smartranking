import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator';

export class AuthAlterarSenhaUsuarioDTO {
  @IsEmail()
  email: string;

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
  senhaAtual: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'senha inválida',
  })
  senhaNova: string;
}

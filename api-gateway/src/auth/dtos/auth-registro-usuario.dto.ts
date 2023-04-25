import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Matches,
  IsMobilePhone,
} from 'class-validator';

export class AuthRegistroUsuarioDTO {
  @IsNotEmpty()
  @IsString()
  nome: string;

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
  senha: string;

  @IsNotEmpty()
  @IsMobilePhone('pt-BR')
  telefoneCelular: string;
}

import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthRegistroUsuarioDTO } from './dtos/auth-registro-usuario.dto';
import { AuthLoginUsuarioDTO } from './dtos/auth-login-usuario.dto';
import { AuthAlterarSenhaUsuarioDTO } from './dtos/auth-alterar-senha-usuario.dto';

import {
  AlterarSenhaResponse,
  LoginResponse,
} from './interfaces/auth.interfaces';

import { AwsCognitoService } from 'src/aws/cognito/aws-cognito.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService) {}

  @Post('/registro')
  @UsePipes(ValidationPipe)
  async registro(@Body() registroDTO: AuthRegistroUsuarioDTO) {
    await this.awsCognitoService.registrarUsuario(registroDTO);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(
    @Body() loginDTO: AuthLoginUsuarioDTO,
  ): Promise<LoginResponse | Error> {
    return await this.awsCognitoService.loginUsuario(loginDTO);
  }

  @Post('/alterarsenha')
  @UsePipes(ValidationPipe)
  async alterarSenha(
    @Body() alterarSenhaDTO: AuthAlterarSenhaUsuarioDTO,
  ): Promise<AlterarSenhaResponse | Error> {
    return await this.awsCognitoService.alterarSenhaUsuario(alterarSenhaDTO);
  }
}

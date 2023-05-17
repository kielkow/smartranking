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
import { AuthEsquecerSenhaUsuarioDTO } from './dtos/auth-esquecer-senha-usuario.dto';
import { AuthConfirmarSenhaUsuarioDTO } from './dtos/auth-confirmar-senha-usuario.dto';

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
  async login(@Body() loginDTO: AuthLoginUsuarioDTO) {
    return await this.awsCognitoService.loginUsuario(loginDTO);
  }

  @Post('/alterarsenha')
  @UsePipes(ValidationPipe)
  async alterarSenha(@Body() alterarSenhaDTO: AuthAlterarSenhaUsuarioDTO) {
    return await this.awsCognitoService.alterarSenhaUsuario(alterarSenhaDTO);
  }

  @Post('/esquecersenha')
  @UsePipes(ValidationPipe)
  async esquecerSenha(@Body() esquecerSenhaDTO: AuthEsquecerSenhaUsuarioDTO) {
    return await this.awsCognitoService.esquecerSenhaUsuario(esquecerSenhaDTO);
  }

  @Post('/confirmarsenha')
  @UsePipes(ValidationPipe)
  async confirmarSenha(
    @Body() confirmarSenhaDTO: AuthConfirmarSenhaUsuarioDTO,
  ) {
    return await this.awsCognitoService.confirmarSenhaUsuario(
      confirmarSenhaDTO,
    );
  }
}

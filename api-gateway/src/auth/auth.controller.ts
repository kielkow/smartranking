import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CognitoUserSession } from 'amazon-cognito-identity-js';

import { AuthRegistroUsuarioDTO } from './dtos/auth-registro-usuario.dto';
import { AuthLoginUsuarioDTO } from './dtos/auth-login-usuario.dto';

import { AwsCognitoService } from 'src/aws/aws-cognito.service';

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
  ): Promise<CognitoUserSession | Error> {
    return await this.awsCognitoService.loginUsuario(loginDTO);
  }
}

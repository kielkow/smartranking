import { Body, Controller, Post } from '@nestjs/common';

import { AuthRegistroUsuarioDTO } from './dtos/auth-registro-usuario.dto';
import { AuthLoginUsuarioDTO } from './dtos/auth-login-usuario.dto';

import { AwsCognitoService } from 'src/aws/aws-cognito.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService) {}

  @Post('/registro')
  async registro(@Body() registroDTO: AuthRegistroUsuarioDTO) {
    await this.awsCognitoService.registrarUsuario(registroDTO);
  }

  @Post('/login')
  async login(@Body() loginDTO: AuthLoginUsuarioDTO) {
    console.log(loginDTO);
    return;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

import { AuthRegistroUsuarioDTO } from 'src/auth/dtos/auth-registro-usuario.dto';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  private logger = new Logger(AwsCognitoService.name);

  constructor(private configService: ConfigService) {
    const COGNITO_USER_POOL_ID = this.configService.get<string>(
      'COGNITO_USER_POOL_ID',
    );
    const COGNITO_CLIENT_ID =
      this.configService.get<string>('COGNITO_CLIENT_ID');

    this.userPool = new CognitoUserPool({
      UserPoolId: COGNITO_USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID,
    });
  }

  public async registrarUsuario(
    registroDTO: AuthRegistroUsuarioDTO,
  ): Promise<CognitoUser | Error> {
    this.logger.log(`registroUsuario: ${JSON.stringify(registroDTO)}`);

    const { nome, email, senha, telefoneCelular } = registroDTO;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        senha,
        [
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: telefoneCelular,
          }),
          new CognitoUserAttribute({
            Name: 'name',
            Value: nome,
          }),
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }
}

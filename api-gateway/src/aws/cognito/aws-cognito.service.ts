import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

import { AuthLoginUsuarioDTO } from 'src/auth/dtos/auth-login-usuario.dto';
import { AuthRegistroUsuarioDTO } from 'src/auth/dtos/auth-registro-usuario.dto';
import { AuthAlterarSenhaUsuarioDTO } from 'src/auth/dtos/auth-alterar-senha-usuario.dto';
import { AuthEsquecerSenhaUsuarioDTO } from 'src/auth/dtos/auth-esquecer-senha-usuario.dto';
import { AuthConfirmarSenhaUsuarioDTO } from 'src/auth/dtos/auth-confirmar-senha-usuario.dto';

import {
  AlterarSenhaResponse,
  ConfirmarSenhaResponse,
  EsquecerSenhaResponse,
  LoginResponse,
} from 'src/auth/interfaces/auth.interfaces';

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

  public async loginUsuario(
    loginDTO: AuthLoginUsuarioDTO,
  ): Promise<LoginResponse | Error> {
    this.logger.log(`loginUsuario: ${JSON.stringify(loginDTO)}`);

    const { email, senha } = loginDTO;

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: senha,
    });

    const userCognito = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  public async alterarSenhaUsuario(
    alterarSenhaDTO: AuthAlterarSenhaUsuarioDTO,
  ): Promise<AlterarSenhaResponse | Error> {
    this.logger.log(`alterarSenhaUsuario: ${JSON.stringify(alterarSenhaDTO)}`);

    const { email, senhaAtual, senhaNova } = alterarSenhaDTO;

    const userCognito = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: senhaAtual,
    });

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authDetails, {
        onSuccess: () => {
          userCognito.changePassword(senhaAtual, senhaNova, (err, result) => {
            if (err) {
              reject(err);
              return;
            }

            resolve({ message: `${result}` });
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  public async esquecerSenhaUsuario(
    esquecerSenhaDTO: AuthEsquecerSenhaUsuarioDTO,
  ): Promise<EsquecerSenhaResponse | Error> {
    this.logger.log(
      `esquecerSenhaUsuario: ${JSON.stringify(esquecerSenhaDTO)}`,
    );

    const { email } = esquecerSenhaDTO;

    const userCognito = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      userCognito.forgotPassword({
        onSuccess: (result) => {
          resolve({ message: `${result}` });
        },
        onFailure: (error) => {
          reject(error);
        },
      });
    });
  }

  public async confirmarSenhaUsuario(
    confirmarSenhaDTO: AuthConfirmarSenhaUsuarioDTO,
  ): Promise<ConfirmarSenhaResponse | Error> {
    this.logger.log(
      `confirmarSenhaUsuario: ${JSON.stringify(confirmarSenhaDTO)}`,
    );

    const { email, codigoConfirmacao, novaSenha } = confirmarSenhaDTO;

    const userCognito = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      userCognito.confirmPassword(codigoConfirmacao, novaSenha, {
        onSuccess: (result) => {
          resolve({ message: `${result}` });
        },
        onFailure: (error) => {
          reject(error);
        },
      });
    });
  }
}

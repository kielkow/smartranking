export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AlterarSenhaResponse {
  message: string;
}

export interface EsquecerSenhaResponse {
  message: string;
}

export interface ConfirmarSenhaResponse {
  message: string;
}

export interface Login {
  email: string;
  password: string;
  clientID?: string;
  scope?: string;
}

export enum TOKEN_TYPE {
  bearer = 'Bearer',
  refresh = 'Refresh',
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  not_before_policy?: number;
  session_state?: string;
  scope?: string;
}

export interface RegistrationResponse extends TokenResponse {
  id: string;
}

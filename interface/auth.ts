export enum TOKEN_TYPE {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export interface IgoogleLoginProps {
  token: string;
}

export interface IgoogleLoginResult {
  sub: string;
  name: string;
  email: string;
  profileImg: string;
}

export interface IkakaoLoginProps {
  token: string;
}

/* export interface IkakaoLoginResult {

} */

export interface Payload {
  email: string;
}

export interface Itoken {
  email: string;
  iat: number;
  exp: number;
}

export interface IgoogleAuth {
  iss: string;
  sub: string;
  azp: string;
  aud: string;
  iat: string;
  exp: string;

  email?: string;
  email_verified?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
}

export interface Ipassword {
  password: string;
}

export interface ItwitterLoginProps {
  token: string;
}

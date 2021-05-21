// NOTE : sample interface
export interface iGoogleLoginProps {
  token: string;
}

export interface iGoogleLoginResult {
  userName: string;
  profileUrl: string;
  error?: string;
}

export interface payload {
  email: string;
}

export interface tokenInterface {
  email: string;
  iat: number;
  exp: number;
}

export interface iGoogleAuth {
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

export interface iPassword {
  password: string;
}

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

// NOTE : sample interface

export interface iGoogleLoginProps {
  token: string;
}

export interface iGoogleLoginResult {
  userName: string;
  profileUrl: string;
  error?: string;
}

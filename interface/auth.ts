import { USER_TYPE } from './user';

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
  profileImage: string;
}

export interface IkakaoLoginProps {
  token: string;
}

export interface IkakaoLoginResult {
  id: string;
  name: string;
  email: string;
  profileImage: string;
}

export interface ItwitterLoginProps {
  token: string;
}

export interface ItwitterLoginResult {
  id: string;
  name: string;
  twitterName: string;
  profile_image_url: string;
}

export interface Ipayload {
  id: string;
}

export interface Itoken {
  email: string;
  iat: number;
  exp: number;
}

export interface Ipassword {
  password: string;
}

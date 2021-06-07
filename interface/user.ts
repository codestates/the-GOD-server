export enum USER_TYPE {
  Email = 'mail',
  Google = 'google',
  Kakao = 'kakao',
  Twitter = 'twitter',
}

export interface Iuser {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  password: string;
  type: USER_TYPE;
  follow: string[];
  bookmark: string[];
  passwordUpdate: string | null;
}

export interface Iauthor {
  id: string;
  name: string;
  profileImage: string;
}

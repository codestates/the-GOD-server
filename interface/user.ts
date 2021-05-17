export enum USER_TYPE {
  Email = 'mail',
  Google = 'google',
  Kakao = 'kakao',
  Twitter = 'twitter',
}

export interface Iuser {
  id: string;
  userName: string;
  email: string;
  profileImg: string;
  password: string;
  type: USER_TYPE;
}

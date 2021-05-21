import axios from 'axios';
import {
  IgoogleLoginProps,
  IgoogleLoginResult,
  IkakaoLoginResult,
} from '@interface';
import { Request, Response } from 'express';

// NOTE : example for creating Axios instance
const api = axios.create({
  baseURL: 'https://localhost:4000',
});

// NOTE: example API this function is not work
export const googleToken = async (req: Request, res: Response) => {
  const { token }: IgoogleLoginProps = req.body;
  const { data } = await api.post('https://oauth2.googleapis.com/tokeninfo', {
    id_token: {
      token,
    },
  });
  if (!data.sub) {
    res.status(403).send('AUTO ERROR');
  }

  return {
    sub: data.sub,
    name: data.name,
    email: data.email,
    profileImg: data.picture,
  };
};

export const kakaoLogin = (req: Request, res: Response): IkakaoLoginResult => {
  return {
    userName: 'username',
    profileUrl: 'url',
  };
};
// 컨트롤러 안에서만 req,res 처리를 할 수 있게

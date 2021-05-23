import axios from 'axios';
import {
  IgoogleLoginProps,
  IgoogleLoginResult,
  IkakaoLoginProps,
  ItwitterLoginProps,
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
    res.status(403).send('invalid token');
  }

  return {
    sub: data.sub,
    name: data.name,
    email: data.email,
    profileImg: data.picture,
  };
};

export const kakaoToken = async (req: Request, res: Response) => {
  const { token }: IkakaoLoginProps = req.body; //accessToken 받음
  const { data } = await api.get('https://kapi.kakao.com/v2/user/me', {
    // 클라이언트에서 받은 토큰을 kapi.kakao에 보내서 해당 토큰을 가진 유저에 대한 정보 얻기
    headers: token,
  });
  if (!data) {
    res.status(403).send('invalid token');
  }

  const { id, kakao_account } = data;

  return {
    id: id,
    userName: kakao_account.profile.nickname,
    email: kakao_account.email,
    profileImg: kakao_account.profile.profile_image_url,
  };
};
// 컨트롤러 안에서만 req,res 처리를 할 수 있게

export const twitterToken = async (req: Request, res: Response) => {
  const { token }: ItwitterLoginProps = req.body;
  const { data } = await api.get('https://api.twitter.com/2/users', {
    headers: token,
  });
  if (!data) {
    res.status(403).send('invalid token');
  }
  const { id, name, username, profile_image_url } = data;
  return {
    id: id,
    name: name,
    userName: username,
    profile_image_url: profile_image_url ?? '',
  };
};

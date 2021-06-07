import axios from 'axios';
import {
  IgoogleLoginProps,
  IgoogleLoginResult,
  IkakaoLoginProps,
  IkakaoLoginResult,
  ItwitterLoginProps,
  ItwitterLoginResult,
} from '@interface';
import { Request, Response } from 'express';

// NOTE : example for creating Axios instance

export const googleToken = async (
  token: string
): Promise<IgoogleLoginResult | null> => {
  const { data } = await axios.post('https://oauth2.googleapis.com/tokeninfo', {
    id_token: token,
  });
  const { sub, name, email, picture } = data;
  return {
    sub,
    name,
    email,
    profileImage: picture,
  };
};

export const kakaoToken = async (
  token: string
): Promise<IkakaoLoginResult | null> => {
  const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
    // 클라이언트에서 받은 토큰을 kapi.kakao에 보내서 해당 토큰을 가진 유저에 대한 정보 얻기
    headers: {
      authorization: `BEARER ${token}`,
    },
  });

  const { id, kakao_account } = data;

  return {
    id: id,
    name: kakao_account.profile.nickname,
    email: kakao_account.email,
    profileImage: kakao_account.profile.profile_image_url,
  };
};
// 컨트롤러 안에서만 req,res 처리를 할 수 있게

export const twitterToken = async (
  token: string
): Promise<ItwitterLoginResult | null> => {
  const { data } = await axios.get('https://api.twitter.com/2/users', {
    headers: {
      authorization: `BEARER ${token}`,
    },
  });

  const { id, name, username, profile_image_url } = data;
  return {
    id: id,
    name: name,
    twitterName: username,
    profile_image_url: profile_image_url ?? '',
  };
};

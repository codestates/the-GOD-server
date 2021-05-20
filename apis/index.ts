import axios from 'axios';
import { iGoogleLoginProps, iGoogleLoginResult, USER_TYPE } from '@interface';
import { Request, Response } from 'express';
import { createUser, findUserByEmail, findUserById } from '../database/users';
import jwt, { Secret } from 'jsonwebtoken';
import { ENV } from '../config/index';
import { createPWD } from '../controller/pwFunctions';
import qs from 'qs';
import {
  createAccessToken,
  createRefreshToken,
} from '@controller/jwtFunctions';

// NOTE : example for creating Axios instance
const api = axios.create({
  baseURL: 'https://localhost:4000',
});

// NOTE: example API this function is not work
export const googleLogin = async (
  req: Request,
  res: Response
): Promise<iGoogleLoginResult> => {
  const { token }: iGoogleLoginProps = req.body;
  const { data } = await api.post('https://oauth2.googleapis.com/tokeninfo', {
    id_token: {
      token,
    },
  });
  if (!data.sub) {
    res.status(403).send('AUTO ERROR');
  }
  const checkUser = await findUserByEmail(data.email);
  if (checkUser) {
    const accessToken = await createAccessToken(data.email);
    const refreshToken = await createRefreshToken(data.email);
    res
      .cookie('Refresh Token : ', refreshToken, {
        httpOnly: true,
      })
      .send({ accessToken });
  } else {
    const googlePWD = createPWD(data.email, data.name); // 구글 서비스로 회원정보 등록 시 패스워드가 아닌, 유저네임으로 패스워드를 만들어 저장한다
    createUser({
      id: data.sub,
      userName: data.name,
      email: data.email,
      profileImg: data.picture,
      password: googlePWD,
      type: 'google' as USER_TYPE,
      follow: [],
      bookmark: [],
    });
    const accessToken = await createAccessToken(data.email);
    const refreshToken = await createRefreshToken(data.email);
    res
      .cookie('Refresh Token : ', refreshToken, {
        httpOnly: true,
      })
      .send({ accessToken });
  }

  return {
    userName: 'tester',
    profileUrl: 'imageURL',
  };
};

import { ENV } from '@config';
import { Request, Response } from 'express';
import jwt, { Secret, verify } from 'jsonwebtoken';
import { Payload, TOKEN_TYPE } from '@interface';
import { findUserByEmail } from '@database/users';

export const createAccessToken = (payload: Payload) => {
  const token = jwt.sign(
    { email: payload.email, type: payload.type },
    ENV.ACCESS_KEY as Secret,
    {
      algorithm: 'HS256',
      expiresIn: '2h',
    }
  );
  return token;
};

export const createRefreshToken = (payload: Payload) => {
  const token = jwt.sign(
    { email: payload.email, type: payload.type },
    ENV.REFRESH_KEY as Secret,
    {
      algorithm: 'HS256',
      expiresIn: '15d',
    }
  );
  return token;
};

export const verifyToken = (type: TOKEN_TYPE, token: string | null) => {
  const secret = type === TOKEN_TYPE.ACCESS ? ENV.ACCESS_KEY : ENV.REFRESH_KEY;

  if (!secret) {
    console.warn('Not setting secret !');
    return null;
  }
  if (!token) {
    console.warn('invalid token');
    return null;
  }

  try {
    const { email } = verify(token, secret) as Payload;
    return email;
  } catch (err) {
    console.error('verify token error : ', err.message);
    return null;
  }
};

export const refreshToAccess = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.error('no refreshToken');
    return null;
  } //쿠키에 리프레시 토큰 유무 확인
  const refreshTokenData = verifyToken(TOKEN_TYPE.REFRESH, refreshToken);
  if (!refreshTokenData) {
    console.error('refreshToken invalid. log in again');
  } //리프레시토큰데이터는 현재 할당 받은 리프레시 토큰유저 이메일
  const email = refreshTokenData as string;
  const user = findUserByEmail(email);
};

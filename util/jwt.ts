import { ENV } from '@config';
import jwt, { Secret, verify } from 'jsonwebtoken';
import { Payload, TOKEN_TYPE } from '@interface';

export const createAccessToken = (payload: Payload | string) => {
  const token = jwt.sign(
    { email: payload.toString() },
    ENV.ACCESS_KEY as Secret,
    {
      algorithm: 'HS256',
      expiresIn: '2h',
    }
  );
  return token;
};

export const createRefreshToken = (payload: Payload | string) => {
  const token = jwt.sign(
    { email: payload.toString() },
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

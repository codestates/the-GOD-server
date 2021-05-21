import { ENV } from '@config';
import jwt, { Secret } from 'jsonwebtoken';
import { Payload } from '@interface';

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

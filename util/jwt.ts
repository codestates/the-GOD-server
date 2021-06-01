import { ENV } from '@config';
import jwt, { Secret, verify } from 'jsonwebtoken';
import { TOKEN_TYPE, Ipayload } from '@interface';

export const createAccessToken = (id: string) => {
  const token = jwt.sign({ id }, ENV.ACCESS_KEY as Secret, {
    algorithm: 'HS256',
    expiresIn: '2h',
  });
  return token;
};

export const createRefreshToken = (id: string) => {
  const token = jwt.sign({ id }, ENV.REFRESH_KEY as Secret, {
    algorithm: 'HS256',
    expiresIn: '15d',
  });
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
    const { id } = verify(token, secret) as Ipayload;
    return id;
  } catch (err) {
    console.error('verify token error : ', err.message);
    return null;
  }
};

import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { ENV } from '@config';

enum TOKEN_TYPE {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

interface Ipayload {
  email: string;
}

const parseaAuthorization = (header: string) => {
  const splitHeader = header.split(' ');

  if (splitHeader.length < 2) {
    console.log('invalid header');
    return [null, null];
  }

  const type = splitHeader[0].toUpperCase();
  const token = splitHeader[1];
  return [type, token];
};

const verifyToken = (type: TOKEN_TYPE, token: string | null) => {
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
    const { email } = verify(token, secret) as Ipayload;
    return email;
  } catch (err) {
    console.error('verify token error : ', err.message);
    return null;
  }
};

export default (req: Request, res: Response, next: NextFunction) => {
  // 헤더에 인증 데이터가 있는지 확인한다
  const authorization = req.headers.authorization;

  if (!authorization) {
    next();
    return;
  }

  const [type, token] = parseaAuthorization(authorization);

  if (type === 'BEARER') {
    const email = verifyToken(TOKEN_TYPE.ACCESS, token);

    if (!email) {
      res.status(401).send({ message: 'unauthorized' });
    } else {
      req.parsedToken = email;
      next();
    }
  } else {
    console.log(`token type Error: ${type}`);
    res.status(400).send({ message: 'invlaid request' });
  }
};

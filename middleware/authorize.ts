import { Request, Response, NextFunction } from 'express';
import { TOKEN_TYPE } from '@interface';
import { verifyToken } from '@util/jwt';

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

import { Request, response, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Payload, Itoken } from '../interface/auth';
import { Iuser, USER_TYPE } from '@interface';
import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import { createAccessToken, createRefreshToken } from '../util/jwt';
import { ENV } from '@config';
import { createPWD } from '../util/pwFunctions';
import { googleToken, kakaoToken, twitterToken } from '../apis';
import {
  IgoogleLoginResult,
  IkakaoLoginResult,
  ItwitterLoginResult,
} from '@interface';
import {
  createUser,
  findUserById,
  findUserByUserName,
  updateUserName,
  updateUserProfileImage,
  updateUserPassword,
  deleteUser,
  findUserByEmail,
  findValidUser,
} from '../database/users';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const encodedPWD = createPWD(email, password);
  const type = USER_TYPE.Email;

  try {
    let checkUser = await findValidUser(email, encodedPWD);
    //console.log(checkUser);

    if (checkUser) {
      const accessToken = createAccessToken({ email, type });
      //console.log('access Token : ', accessToken);
      const refreshToken = createRefreshToken({ email, type });

      //console.log('refreshToken', refreshToken);
      res.cookie('Refresh Token : ', refreshToken, {
        httpOnly: true,
      });
      //console.log(accessToken);
      res.status(201).send({
        result: {
          accessToken: accessToken,
        },
        message: 'ok',
      });
    } else {
      res.status(400).send({ message: 'invalid request' });
    }
  } catch (err) {
    console.error('User login error');
    res.status(404).send({
      message: 'invalid request',
    });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { userName, email, password } = req.body;
  try {
    const hashedPWD = await createPWD(email, password);

    /* const validName = await findUserByUserName(userName);
    if (!validName) {
      res.status(401).send({ message: '' });
    } */
    console.log('here');
    const uniqueID = uuidv4();
    const createId = await createUser({
      id: uniqueID,
      name: userName,
      email: email,
      profileImage: req.body.profileImage || 'https://bit.ly/3euIgJj',
      password: hashedPWD,
      type: USER_TYPE.Email,
      follow: [],
      bookmark: [],
      passwordUpdate: null,
    });

    if (createId) {
      res.status(201).send({ message: 'ok' });
    } else {
      res.status(400).send('invalid input');
    }
  } catch (err) {
    console.error('User save error by server');
    res.status(401).send({
      message: 'fail signup',
    });
  }
};

export const googleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.body;
  const type = USER_TYPE.Google;
  const userData = await googleToken(token);
  const { sub, name, email, profileImage } = userData as IgoogleLoginResult;
  try {
    const checkUser = await findUserByEmail(email);
    if (checkUser) {
      const accessToken = createAccessToken({ email, type });
      const refreshToken = createRefreshToken({ email, type });
      res
        .cookie('Refresh Token : ', refreshToken, {
          httpOnly: true,
        })
        .send({ accessToken });
    } else {
      const googlePWD = createPWD(email, name);
      const googleSignup = await createUser({
        id: uuidv4(),
        name: name,
        email: email,
        profileImage: profileImage,
        password: googlePWD,
        type: type,
        follow: [],
        bookmark: [],
        passwordUpdate: null,
      });
      if (googleSignup) {
        const accessToken = await createAccessToken({ email, type });
        const refreshToken = await createRefreshToken({ email, type });
        res
          .cookie('Refresh Token : ', refreshToken, {
            httpOnly: true,
          })
          .send({ result: accessToken, message: 'ok' });
      } else {
        res.status(400).send({
          message: 'invalid request',
        });
      }
    }
  } catch (err) {
    console.error('google login error');
    res.status(401).send({
      message: 'unauthorized',
    });
  }
};

export const kakaoLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.body;
  const type = USER_TYPE.Kakao;
  const userData = await kakaoToken(token);
  const { id, name, email, profileImage } = userData as IkakaoLoginResult;
  try {
    const checkUser = await findUserByEmail(email);
    if (checkUser) {
      const accessToken = createAccessToken({ email, type });
      const refreshToken = createRefreshToken({ email, type });
      res
        .cookie('Refresh Token : ', refreshToken, {
          httpOnly: true,
        })
        .send({ accessToken });
    } else {
      const googlePWD = createPWD(email, name);
      const kakaoSignup = await createUser({
        id: uuidv4(),
        name: name,
        email: email,
        profileImage: profileImage,
        password: googlePWD,
        type: type,
        follow: [],
        bookmark: [],
        passwordUpdate: null,
      });
      if (kakaoSignup) {
        const accessToken = await createAccessToken({ email, type });
        const refreshToken = await createRefreshToken({ email, type });
        res
          .cookie('Refresh Token : ', refreshToken, {
            httpOnly: true,
          })
          .send({ result: accessToken, message: 'ok' });
      } else {
        res.status(400).send({
          message: 'invalid input',
        });
      }
    }
  } catch (err) {
    console.error('kakao login error');
    res.status(401).send({
      message: 'invalid data',
    });
  }
};
//TODO : 간단한 클라이언트 코드 작성 후 확인
//TODO : API문서에 의거하여 res 수정

export const twitterLogin = async (req: Request, res: Response) => {
  const token = req.body;
  const type = USER_TYPE.Twitter;
  const userData = (await twitterToken(token)) as ItwitterLoginResult;
  const { name, twitterName, profile_image_url } = userData;
  const email = twitterName + '@twitter.com';
  try {
    const checkUser = await findUserByEmail(email);
    if (checkUser) {
      const accessToken = createAccessToken({ email, type });
      const refreshToken = createRefreshToken({ email, type });
      res
        .cookie('Refresh Token : ', refreshToken, {
          httpOnly: true,
        })
        .send({ accessToken });
    } else {
      const twitterPWD = createPWD(name, email);
      const twitterSignup = await createUser({
        id: uuidv4(),
        name: twitterName,
        email: email,
        profileImage: profile_image_url,
        password: twitterPWD,
        type: type,
        follow: [],
        bookmark: [],
        passwordUpdate: null,
      });
      if (twitterSignup) {
        const accessToken = await createAccessToken({ email, type });
        const refreshToken = await createRefreshToken({ email, type });
        res
          .cookie('Refresh Token : ', refreshToken, {
            httpOnly: true,
          })
          .send({ result: accessToken, message: 'ok' });
      } else {
        res.status(400).send({
          message: 'invalid request',
        });
      }
    }
  } catch (err) {
    console.error('twitter login error');
    res.status(401).send({
      message: 'invalid data',
    });
  }
};

//TODO : 회원탈퇴 , 비밀번호 변경

export const checkPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req;
    const { password } = req.body;
    const user = await findUserByEmail(parsedToken as string);

    if (!password || !user) {
      res
        .status(401)
        .send({
          message: 'invlaid request',
        })
        .end();
    } else {
      const hashedPWD = createPWD(user.email, password);
      if (user.password === hashedPWD) {
        res.status(201).send({
          message: 'ok',
        });
      } else {
        res.status(401).send({
          message: 'unauthorized',
        });
      }
    }
  } catch (err) {
    console.error('checkPassword error');
    res.status(400).send({
      message: 'invlaid request',
    });
  }
};

export const setPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req;
    const { password } = req.body;
    const user = await findUserByEmail(parsedToken as string);

    if (!password || !user) {
      res
        .status(400)
        .send({
          message: 'invlaid request',
        })
        .end();
    } else {
      const hashedPWD = createPWD(user.email, password);
      const result = await updateUserPassword(user.id, hashedPWD);
      if (result) {
        res.status(201).send({
          message: 'ok',
        });
      } else {
        res.status(400).send({
          message: 'invlaid request',
        });
      }
    }
  } catch (err) {
    console.error('setPassword error');
    res.status(400).send({
      message: 'invlaid request',
    });
  }
};

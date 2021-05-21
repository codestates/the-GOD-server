import { Request, Response } from 'express';
import { v5 as uuidv5 } from 'uuid';
import { Payload, Itoken } from '../interface/auth';
import { Iuser, USER_TYPE } from '@interface';
import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import { createAccessToken, createRefreshToken } from '../util/jwt';
import { ENV } from '@config';
import { createPWD } from '../util/pwFunctions';
import { googleToken, kakaoToken } from '../apis';

import {
  createUser,
  findUserById,
  updateUserName,
  updateUserProfileImg,
  deleteUser,
  findUserByEmail,
  findValidUser,
} from '../database/users';

export const login = async (req: Request, res: Response): Promise<void> => {
  const encodedPWD = createPWD(req.body.email, req.body.password);
  try {
    let checkUser = await findValidUser(req.body.email, encodedPWD);

    if (checkUser) {
      const accessToken = createAccessToken(req.body.email);
      const refreshToken = createRefreshToken(req.body.email);
      console.log('refreshToken', refreshToken);
      res.cookie('Refresh Token : ', refreshToken, {
        httpOnly: true,
      });
      console.log(accessToken);
      res.status(200).send(accessToken);
    }
  } catch (err) {
    console.error('User login error');
    console.log(err.message);
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const hashedPWD: string = crypto
      .createHash('sha512')
      .update(req.body.password)
      .digest('base64'); // 사용자가 입력한 비밀번호 해싱(크립토)
    crypto.pbkdf2(
      req.body.password,
      req.body.email,
      100000,
      64,
      'sha512',
      (err: Error | null, key: Buffer) => {
        console.log(key.toString('base64'));
        return key.toString('base64');
      }
    );

    const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
    const uniqueID = uuidv5(req.body.email, MY_NAMESPACE);
    const createId = await createUser({
      id: uniqueID,
      userName: req.body.userName,
      email: req.body.email,
      profileImg: req.body.profileImg || 'https://bit.ly/3euIgJj',
      password: req.body.password + hashedPWD,
      type: USER_TYPE.Email,
      follow: [],
      bookmark: [],
    });

    if (createId) {
      res.status(201).send('ok');
    }
  } catch (err) {
    console.error('User save error by server');
  }
};

export const accessTokenRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.get('auth') ?? '';
    const userData = jwt.verify(token, ENV.ACCESS_KEY as Secret) as Itoken; // 토큰의 주인 이메일이 userData
    const checkToken = await findUserByEmail(userData.email);
    if (!checkToken) {
      res.json({
        data: null,
        message: 'invalid accessToken',
      });
    }
    res.status(200).send(userData);
  } catch (err) {
    console.error('Token something wrong');
  }
};

export const refreshTokenRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.json({
      data: null,
      message: 'Token null',
    });
  }
  const userData = jwt.verify(
    refreshToken,
    process.env.REFRESH_KEY as Secret
  ) as Itoken; //userData는 발급 받은 refresh 토큰으로 확인한 유저의 데이터
  const checkToken = await findUserByEmail(userData.email).then((data) => {
    console.log(data);
    if (!data) {
      return res.json({
        data: null,
        message: 'refresh token tempered',
      });
    }
    res.status(200).send(userData);
    const forNewToken = { email: data.email };
    const newAccessToken = createAccessToken(forNewToken);
    res.json({
      data: newAccessToken,
      userInfo: data,
      message: 'resend Access Token',
    });
  });
};

export const googleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userData = await googleToken(req, res);
  const { sub, name, email, profileImg } = userData;
  const checkUser = await findUserByEmail(email);
  if (checkUser) {
    const accessToken = createAccessToken(email);
    const refreshToken = createRefreshToken(email);
    res
      .cookie('Refresh Token : ', refreshToken, {
        httpOnly: true,
      })
      .send({ accessToken });
  } else {
    const googlePWD = createPWD(email, name);
    createUser({
      id: sub,
      userName: name,
      email: email,
      profileImg: profileImg,
      password: googlePWD,
      type: 'google' as USER_TYPE,
      follow: [],
      bookmark: [],
    });
    const accessToken = await createAccessToken(email);
    const refreshToken = await createRefreshToken(email);
    res
      .cookie('Refresh Token : ', refreshToken, {
        httpOnly: true,
      })
      .send({ accessToken });
  }
};

export const kakaoLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userData = await kakaoToken(req, res);
  const { id, userName, email, profileImg } = userData;
  const checkUser = await findUserByEmail(email);
  if (checkUser) {
    const accessToken = createAccessToken(email);
    const refreshToken = createRefreshToken(email);
    res
      .cookie('Refresh Token : ', refreshToken, {
        httpOnly: true,
      })
      .send({ accessToken });
  } else {
    const googlePWD = createPWD(email, userName);
    createUser({
      id: id,
      userName: userName,
      email: email,
      profileImg: profileImg,
      password: googlePWD,
      type: 'kakao' as USER_TYPE,
      follow: [],
      bookmark: [],
    });
    const accessToken = await createAccessToken(email);
    const refreshToken = await createRefreshToken(email);
    res
      .cookie('Refresh Token : ', refreshToken, {
        httpOnly: true,
      })
      .send({ accessToken });
  }
};
//TODO : 간단한 클라이언트 코드 작성 후 확인
//TODO : API문서에 의거하여 res 수정

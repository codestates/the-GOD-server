import { Request, Response } from 'express';
import { v5 as uuidv5 } from 'uuid';
import { payload, tokenInterface } from '../interface/auth';
import { Iuser, USER_TYPE } from '../interface/user';
import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import { createAccessToken, createRefreshToken } from './jwtFunctions';
import { ENV } from '@config';
import { createPWD } from './pwFunctions';

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
  /* const hashedPWD: string = crypto
    .createHash('sha512')
    .update(req.body.password)
    .digest('base64'); // 사용자가 입력한 비밀번호 해싱(크립토)               // 사용자가 입력한 이메일 솔팅
  crypto.pbkdf2(
    req.body.password,
    req.body.email,
    100000,
    64,
    'sha512',
    (err: Error | null, key: Buffer) => {
      console.log(key.toString('base64'));
      key.toString('base64');
    }
  ); */
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

export const accessTokenRequest = async (req: Request, res: Response) => {
  try {
    const token = req.get('auth') ?? '';
    const userData = jwt.verify(
      token,
      ENV.ACCESS_KEY as Secret
    ) as tokenInterface; // 토큰의 주인 이메일이 userData
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

export const refreshTokenRequest = async (req: Request, res: Response) => {
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
  ) as tokenInterface; //userData는 발급 받은 refresh 토큰으로 확인한 유저의 데이터
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
  /* if (!checkToken) {
    res.json({
      data: null,
      message: 'invalid refreshToken',
    }); */
};

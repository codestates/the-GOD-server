import { Request, Response } from 'express';
import { v5 as uuidv5 } from 'uuid';
import { Payload, Itoken } from '../interface/auth';
import { Iuser, USER_TYPE } from '@interface';
import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import { createAccessToken, createRefreshToken } from '../util/jwt';
import { ENV } from '@config';
import { createPWD } from '../util/pwFunctions';
import { googleToken, kakaoToken, twitterToken } from '../apis';

import {
  createUser,
  findUserById,
  findUserByUserName,
  updateUserName,
  updateUserProfileImg,
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

    if (checkUser) {

      const accessToken = createAccessToken({ email, type });
      const refreshToken = createRefreshToken({ email, type });

      console.log('refreshToken', refreshToken);
      res.cookie('Refresh Token : ', refreshToken, {
        httpOnly: true,
      });
      console.log(accessToken);
      res.status(201).send({
        result: {
          accessToken: accessToken,
        },
        message: 'ok',
      });
    } else {
      res.status(404).send('invalid input');
    }
  } catch (err) {
    console.error('User login error');
    console.log(err.message);
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { userName, email, password } = req.body;
  try {

    const hashedPWD = await createPWD(email, password);

    const validName = await findUserByUserName(userName);
    if (validName) {
      res.status;
    }

    const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
    const uniqueID = uuidv5(email, MY_NAMESPACE);
    const createId = await createUser({
      id: uniqueID,
      userName: userName,
      email: email,
      profileImg: req.body.profileImg || 'https://bit.ly/3euIgJj',

      password: hashedPWD,

      type: USER_TYPE.Email,
      follow: [],
      bookmark: [],
    });

    if (createId) {
      res.status(201).send('ok');
    } else {
      res.status(400).send('invalid input');
    }
  } catch (err) {
    console.error('User save error by server');
  }
};


/* export const accessTokenRequest = async (req: Request) => {

  try {
    const token = req.get('auth') ?? '';
    const userData = jwt.verify(token, ENV.ACCESS_KEY as Secret) as Itoken; // 토큰의 주인 이메일이 userData
    const checkToken = await findUserByEmail(userData.email);
    if (!checkToken) {

       res.json({
        data: null,
        message: 'invalid accessToken',
      }); 

      console.error('invalid token');
    }
    return userData;
  } catch (err) {
    console.error('invalid token');
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
    //res.status(200).send(userData);
    const forNewToken = { email: data.email };
    const newAccessToken = createAccessToken(forNewToken);
    res.json({
      data: newAccessToken,
      userInfo: data,
      message: 'resend Access Token',
    });
  });
}; */

export const googleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.body;
  const type = 'google' as USER_TYPE;
  const userData = await googleToken(token);
  const { sub, name, email, profileImg } = userData;
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
      createUser({
        id: sub + type,
        userName: name,
        email: email,
        profileImg: profileImg,
        password: googlePWD,
        type: 'google' as USER_TYPE,
        follow: [],
        bookmark: [],
      });
      const accessToken = await createAccessToken({ email, type });
      const refreshToken = await createRefreshToken({ email, type });
      res
        .cookie('Refresh Token : ', refreshToken, {
          httpOnly: true,
        })
        .send({ accessToken });
    }
  } catch (err) {
    console.error('google login error');
    console.log(err.message);
  }
};

export const kakaoLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.body;
  const type = 'kakao' as USER_TYPE;
  const userData = await kakaoToken(token);
  const { id, userName, email, profileImg } = userData;
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
      const googlePWD = createPWD(email, userName);
      createUser({
        id: id + type,
        userName: userName,
        email: email,
        profileImg: profileImg,
        password: googlePWD,
        type: 'kakao' as USER_TYPE,
        follow: [],
        bookmark: [],
      });
      const accessToken = await createAccessToken({ email, type });
      const refreshToken = await createRefreshToken({ email, type });
      res
        .cookie('Refresh Token : ', refreshToken, {
          httpOnly: true,
        })
        .send({ accessToken });
    }
  } catch (err) {
    console.error('kakao login error');
    console.log(err.message);
  }
};
//TODO : 간단한 클라이언트 코드 작성 후 확인
//TODO : API문서에 의거하여 res 수정

export const twitterLogin = async (req: Request, res: Response) => {

  const token = req.body;
  const type = 'twitter' as USER_TYPE;
  const userData = await twitterToken(token);
  const { id, name, userName, profile_image_url } = userData;
  const email = userName + '@twitter.com';
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
      createUser({
        id: id,
        userName: userName,
        email: email,
        profileImg: profile_image_url,
        password: twitterPWD,
        type: USER_TYPE.Twitter,
        follow: [],
        bookmark: [],
      });
    }
  } catch (err) {
    console.error('twitter login error');
    console.log(err.message);
  }
};

//TODO : 회원탈퇴 , 비밀번호 변경, 로그아웃


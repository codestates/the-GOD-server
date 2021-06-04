import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Iuser, TOKEN_TYPE, USER_TYPE } from '@interface';
import {
  createAccessToken,
  createRefreshToken,
  verifyToken,
} from '../util/jwt';
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
  updateUserPassword,
  deleteUser,
  findUserByEmail,
  findValidUser,
} from '../database/users';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const encodedPWD = createPWD(email, password);

  try {
    let user = (await findValidUser(email, encodedPWD)) as Iuser;
    if (!user) {
      res.status(400).send({
        message: 'invalid request',
      });
      return;
    }
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    res.cookie('Refresh Token : ', refreshToken, {
      httpOnly: true,
    });
    res.status(201).send({
      result: {
        accessToken: accessToken,
      },
      message: 'ok',
    });
  } catch (err) {
    console.error('User login error');
    res.status(404).send({
      message: 'invalid request',
    });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const duplicated = await findUserByEmail(email);
    if (duplicated) {
      res.status(403).send({
        message: 'already exist',
      });
      return;
    }
    const hashedPWD = await createPWD(email, password);
    const id = uuidv4();
    const createId = await createUser({
      id: id,
      name: name,
      email: email,
      profileImage: req.body.profileImage || 'https://bit.ly/3euIgJj',
      password: hashedPWD,
      type: USER_TYPE.Email,
      follow: [],
      bookmark: [],
      passwordUpdate: null,
    });
    if (createId) {
      res.status(201).send({
        message: 'ok',
      });
    }
  } catch (err) {
    console.error('User save error by server', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const signout = async (req: Request, res: Response) => {
  try {
    const { tokenUser } = req;
    const { password } = req.body;
    const { id, email } = tokenUser as Iuser;
    const encodedPWD = createPWD(email, password);
    const isUser = await findValidUser(email, encodedPWD);
    if (isUser) {
      const isDeleted = await deleteUser(id);
      if (!isDeleted) {
        res.status(404).send({ message: 'password error' });
      }
      res.status(201).send({ message: 'ok' });
    }
  } catch (err) {
    console.error('signout error', err.message);
    res.status(400).send({ message: 'invalid request' });
  }
};

export const googleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.body;
  const userData = await googleToken(token);
  const { name, email, profileImage } = userData as IgoogleLoginResult;
  try {
    const user = await findUserByEmail(email);
    if (user && user.type === 'google') {
      const accessToken = createAccessToken(user.id);
      const refreshToken = createRefreshToken(user.id);
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
        type: USER_TYPE.Google,
        follow: [],
        bookmark: [],
        passwordUpdate: null,
      });
      if (googleSignup) {
        const user = (await findUserByEmail(email)) as Iuser;
        const accessToken = await createAccessToken(user.id);
        const refreshToken = await createRefreshToken(user.id);
        res
          .cookie('Refresh Token : ', refreshToken, {
            httpOnly: true,
          })
          .send({
            result: {
              accessToken: accessToken,
            },
            message: 'ok',
          });
      } else {
        res.status(400).send({
          message: 'invalid request',
        });
      }
    }
  } catch (err) {
    console.error('google login error', err.message);
    res.status(400).send({
      message: 'invalid request',
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
    const user = await findUserByEmail(email);
    if (user && user.type === 'kakao') {
      const accessToken = createAccessToken(user.id);
      const refreshToken = createRefreshToken(user.id);
      res
        .cookie('Refresh Token : ', refreshToken, {
          httpOnly: true,
        })
        .send({ accessToken });
    } else {
      if (findUserById(id)) {
        const id = uuidv4();
      }
      const googlePWD = createPWD(email, name);
      const kakaoSignup = await createUser({
        id: id,
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
        const user = (await findUserByEmail(email)) as Iuser;
        const accessToken = await createAccessToken(user.id);
        const refreshToken = await createRefreshToken(user.id);
        res
          .cookie('Refresh Token : ', refreshToken, {
            httpOnly: true,
          })
          .send({
            result: {
              accessToken: accessToken,
            },
            message: 'ok',
          });
      } else {
        res.status(400).send({
          message: 'invalid input',
        });
      }
    }
  } catch (err) {
    console.error('kakao login error', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const twitterLogin = async (req: Request, res: Response) => {
  const token = req.body;
  const type = USER_TYPE.Twitter;
  const userData = (await twitterToken(token)) as ItwitterLoginResult;
  const { name, twitterName, profile_image_url } = userData;
  const email = twitterName + '@twitter.com';
  try {
    const user = await findUserByEmail(email);
    if (user) {
      const accessToken = createAccessToken(user.id);
      const refreshToken = createRefreshToken(user.id);
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
        const user = (await findUserByEmail(email)) as Iuser;
        const accessToken = await createAccessToken(user.id);
        const refreshToken = await createRefreshToken(user.id);
        res
          .cookie('Refresh Token : ', refreshToken, {
            httpOnly: true,
          })
          .send({ result: accessToken, message: 'ok' });
      } else {
        res.status(404).send({
          message: 'invalid request',
        });
      }
    }
  } catch (err) {
    console.error('twitter login error', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const checkPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser } = req;
    const { password } = req.body;
    if (!password || !tokenUser) {
      res
        .status(401)
        .send({
          message: 'invlaid request',
        })
        .end();
    } else {
      const hashedPWD = createPWD(tokenUser.email as string, password);
      if (tokenUser.password === hashedPWD) {
        res.status(201).send({
          message: 'ok',
        });
      } else {
        res.status(404).send({
          message: 'password error',
        });
      }
    }
  } catch (err) {
    console.error('checkPassword error', err.message);
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
    const { tokenUser } = req;
    const { password } = req.body;
    if (!password || !tokenUser) {
      res
        .status(400)
        .send({
          message: 'invlaid request',
        })
        .end();
    } else {
      const hashedPWD = createPWD(tokenUser.email, password);
      const result = await updateUserPassword(tokenUser.id, hashedPWD);
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

export const refreshToAccess = (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400).send({
        message: 'invalid request',
      });
      return;
    }

    const refreshTokenData = verifyToken(TOKEN_TYPE.REFRESH, refreshToken);
    if (!refreshTokenData) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }

    const id = refreshTokenData as string;
    const newToken = createAccessToken(id);
    res.status(200).send({
      result: {
        accessToken: newToken,
      },
      message: 'ok',
    });
  } catch (err) {
    console.error('refreshToken error : ', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

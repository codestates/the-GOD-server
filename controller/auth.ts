import { Request, Response } from 'express';
import {v5 as uuidv5} from 'uuid';
import { Iuser, USER_TYPE } from '../interface/user'
import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto'
import { createAccessToken, createRefreshToken } from './jwtFunctions';
import { ENV } from '@config';

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

  const hashedPWD : string = crypto.createHash('sha512').update(req.body.password).digest('base64'); // 사용자가 입력한 비밀번호 해싱(크립토)               // 사용자가 입력한 이메일 솔팅
    crypto.pbkdf2(req.body.password, req.body.email , 100000, 64, 'sha512', (err : Error | null, key : Buffer) => {
      console.log(key.toString('base64'));
      return key.toString('base64');
    });
  try{
    let checkUser = await findValidUser( req.body.email, req.body.password + hashedPWD );
    
    if(checkUser){
      const accessToken = createAccessToken(req.body.email);
      const refrershToken = createRefreshToken(req.body.email);
      res.cookie("refreshToken",refrershToken);
      console.log('Refresh Token : ',refrershToken,{
        httpOnly:true
      });
      console.log(accessToken);
      res.status(200).send(accessToken);
  }
}catch(err){
    console.error('User login error');
    console.log(err.message);
  }
}


export const signup = async (req : Request, res : Response): Promise<void> => {
  try{
    const hashedPWD : string = crypto.createHash('sha512').update(req.body.password).digest('base64'); // 사용자가 입력한 비밀번호 해싱(크립토)
    crypto.pbkdf2(req.body.password, req.body.email, 100000, 64, 'sha512', (err : Error | null, key : Buffer) => {
        console.log(key.toString('base64'));
        return key.toString('base64');
      });
    
    const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
    const uniqueID = uuidv5(req.body.email, MY_NAMESPACE);
    const createId = await createUser({
      id : uniqueID,
      userName : req.body.userName,
      email : req.body.email,
      profileImg : req.body.profileImg || 'https://bit.ly/3euIgJj',
      password : req.body.password + hashedPWD ,
      type: USER_TYPE.Email
    });

    if(createId){ 
      res.status(201).send("ok");
    }
  }catch(err){
    console.error('User save error by server');
  }
}

export const sendAccessToken = (res : Response, accessToken : string) => {
  res.json({ data: { accessToken }, message: "ok" });
}

export const resendAccessToken = (res : Response, accessToken : string, email : string) => {
  res.json({ data: { accessToken, userInfo: email }, message: "ok" });
}

export const authLogic = async ( req : Request, res : Response) => {
  {
    const token = req.get('auth') ?? '';
    const decoded = jwt.verify(token,ENV.ACCESS_KEY as Secret);
    const email = decoded;
    res.send(email);
  }
}
export const checkRefeshToken = (refreshToken : string) => {
  try {
    return jwt.verify(refreshToken, process.env.REFRESH_SECRET as Secret);
  } catch (err) {
    // return null if refresh token is not valid
    return null;
  }
}
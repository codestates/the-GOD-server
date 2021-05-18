
import { Request, Response } from 'express';
import env from 'dotenv';
import { Iuser, USER_TYPE } from '../interface/user'
import { access } from 'fs';
import { userInfo } from 'os';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
import { createToken } from './jwtFunctions';
env.config();

const ENV = process.env;
const envkey = ENV.JWT_KEY;
import {
  createUser,
  findUserById,
  updateUserName,
  updateUserProfileImg,
  deleteUser,
  findUserByEmail,
} from '../database/users';

export const login = async (req: Request, res: Response): Promise<void> => {

  const hashedPWD : string = crypto.createHash('sha512').update(req.body.password).digest('base64'); // 사용자가 입력한 비밀번호 해싱(크립토)               // 사용자가 입력한 이메일 솔팅
      crypto.pbkdf2(req.body.password, req.body.email , 100000, 64, 'sha512', (err : string, key : Buffer) => {
        console.log(key.toString('base64'));
        return key.toString('base64');
      });

  try{
    let checkUser = await findUserByEmail( req.body.email, req.body.password + hashedPWD );
    
    if(checkUser){
      const token = createToken(req.body.email);
      console.log(token);
      res.status(200).send(token);
  }
}catch(err){
    console.error('User login error');
    console.log(err.message);
  }
}


export const signup = async (req : Request, res : Response): Promise<void> => {
  try{
    const hashedPWD : string = crypto.createHash('sha512').update(req.body.password).digest('base64'); // 사용자가 입력한 비밀번호 해싱(크립토)
    crypto.pbkdf2(req.body.password, req.body.email, 100000, 64, 'sha512', (err : string, key : Buffer) => {
        console.log(key.toString('base64'));
        return key.toString('base64');
      });

    const createId = await createUser({
      id : req.body.id,
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


export const authLogic = async ( req : Request, res : Response) => {
  {
      const token = req.get('auth') ?? '';
      const decoded = jwt.verify(token,envkey);
      const email = decoded;
      res.send(email);
  }
}
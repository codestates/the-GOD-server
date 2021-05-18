import { Request, Response } from 'express';
import { access } from 'fs';
import { userInfo } from 'os';
const jwt = require('jsonwebtoken');
//import { payload } from '../interface/auth'
//import {generateAccessToken,generateRefreshToken,sendAccessToken,sendRefreshToken} from './tokenFunctions'
import {
  createUser,
  findUserById,
  updateUserName,
  updateUserProfileImg,
  deleteUser,
  findUserByEmail,
} from '../database/users';

export const login = async (req: Request, res: Response): Promise<void> => {
  //TODO : make login function
    const { email, password } = req.body;
    console.log(req.body);
  try{
    let checkUser = await findUserByEmail(email,password);
    console.log(checkUser)
    if(checkUser){
      res.status(200).send(checkUser);
      //res.status(200).send('hello login :)');
    }
  }catch(err){
    console.error('User login error');
    console.log(err.message);
  }
}
  

export const signup = async (req : Request, res : Response): Promise<void> => {
  try{
    //const { email, password, username } = req.body;
    const createId = await createUser(req.body);
    if(createId){
      res.status(201).send("ok");
    }
  }catch(err){
    console.error('User save error');
  }
}

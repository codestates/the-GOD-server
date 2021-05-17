//import {User} from 'database/users/user'
import { Request, Response } from 'express';
//import { Iuser } from '@interface';
import { access } from 'fs';
import { userInfo } from 'os';
//import {generateAccessToken,generateRefreshToken,sendAccessToken,sendRefreshToken} from './tokenFunctions'
import {
  createUser,
  findUserById,
  updateUserName,
  updateUserProfileImg,
  deleteUser,
} from '../database/users';

export const login = async (req: Request, res: Response): Promise<void> => {
  //TODO : make login function
    //const { email, password } = req.body;
    const checkUser = await findUserById(req.body);
    /* console.log(req.body);
    if(!checkUser){
      res.status(400).send('invalid request')
    res.status(200).send(checkUser); */
    res.status(200).send('hello login :)');
  /* }catch(err){
    console.error('User login error');
  } */
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
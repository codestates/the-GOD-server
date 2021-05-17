//import {User} from 'database/users/user'
import { Request, Response } from 'express';
import { access } from 'fs';
import { userInfo } from 'os';
import {generateAccessToken,generateRefreshToken,sendAccessToken,sendRefreshToken} from './tokenFunctions'


export const login = async (req: Request, res: Response): Promise<void> => {
  //TODO : make login function
  const {email,password} = req.body;
  User.findOne({ email : email},console.log(("error")))
  .then((data : any) => {
    if(!data){
      return res.json({data:null});
    }
  ;
    const accessToken = generateAccessToken(req)
    console.log(accessToken);
  //console.log(email,password)
    res.status(200).send('hello login :)');

    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken);
  })
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  userInfo.findOrCreate({
    email : email,
    password : password
  })
}
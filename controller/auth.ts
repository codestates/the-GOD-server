import { Request, Response } from 'express';

export const login = async (req: Request, res: Response): Promise<void> => {
  //TODO : make login function

  res.status(200).send('hello login :)');
};

import express from 'express';

const logger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  console.log('Request URL : ', req.originalUrl);
  console.log('Request Method : ', req.method);
  next();
};

export default logger;

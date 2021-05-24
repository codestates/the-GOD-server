import cors from './cors';
import express from 'express';
import session from './session';
import authorize from './authorize';

export const defaultMiddleware = [cors, session, express.json(), authorize];

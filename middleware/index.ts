import cors from './cors';
import express from 'express';
import session from './session';

export const defaultMiddleware = [cors, session, express.json()];

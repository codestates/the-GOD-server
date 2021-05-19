import express from 'express';
import { login, signup, accessTokenRequest } from '@controller/auth';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/accesstoken', accessTokenRequest);

export default router;

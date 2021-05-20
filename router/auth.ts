import express from 'express';
import {
  login,
  signup,
  accessTokenRequest,
  refreshTokenRequest,
} from '@controller/auth';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/accesstoken', accessTokenRequest);
router.get('/refreshtoken', refreshTokenRequest);

export default router;

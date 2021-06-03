import express from 'express';
import {
  login,
  signup,
  checkPassword,
  setPassword,
  signout,
  googleLogin,
  kakaoLogin,
} from '@controller/auth';
import { twitterToken } from '@apis';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/password', checkPassword);
router.put('/password', setPassword);
router.delete('/signout', signout);
router.post('google', googleLogin);
router.post('kakao', kakaoLogin);
router.post('twitter', twitterToken);

export default router;

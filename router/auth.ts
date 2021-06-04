import express from 'express';
import {
  login,
  signup,
  checkPassword,
  setPassword,
  signout,
  googleLogin,
  kakaoLogin,
  refreshToAccess,
  twitterLogin,
} from '@controller/auth';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/password', checkPassword);
router.put('/password', setPassword);
router.delete('/signout', signout);
router.post('/google', googleLogin);
router.post('/kakao', kakaoLogin);
router.post('/twitter', twitterLogin);
router.get('/accesstoken', refreshToAccess);

export default router;

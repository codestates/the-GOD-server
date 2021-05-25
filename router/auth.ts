import express from 'express';
import { login, signup, checkPassword, setPassword } from '@controller/auth';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/password', checkPassword);
router.put('/password', setPassword);

export default router;

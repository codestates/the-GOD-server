import express from 'express';
import { login, signup, authLogic } from '@controller/auth';

const router = express.Router();

router.post('/login', login);
router.post('/signup',signup);
router.get('/check',authLogic)

export default router;

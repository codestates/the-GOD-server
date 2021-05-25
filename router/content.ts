import express from 'express';
import { createContent } from '@database/contents';

const router = express.Router();

router.post('/contents', createContent);

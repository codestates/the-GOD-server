import express from 'express';
import {
  createContents,
  deleteContents,
  readContent,
  updateContents,
} from '@controller/content';

const router = express.Router();

router.post('/content', createContents);
router.get('/content', readContent);
router.put('/content', updateContents);
router.delete('/content', deleteContents);

export default router;

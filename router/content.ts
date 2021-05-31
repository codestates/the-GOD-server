import express from 'express';
import {
  createContents,
  deleteContents,
  listOfContents,
  readContent,
  updateContents,
} from '@controller/content';

const router = express.Router();

router.post('/', createContents);
router.get('/', readContent);
router.put('/', updateContents);
router.delete('/', deleteContents);
router.get('/query', listOfContents);

export default router;

import express from 'express';
import {
  createComments,
  deleteComments,
  updateComments,
  pageComments,
} from '@controller/comment';
const router = express.Router();

router.get('/', pageComments);
router.post('/', createComments);
router.put('/', updateComments);
router.delete('/', deleteComments);

export default router;

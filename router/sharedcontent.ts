import express from 'express';
import {
  createSharedContents,
  deleteSharedContents,
  updateSharedContents,
  getSharedContents,
} from '@controller/sharedcontent';
const router = express.Router();

router.get('/',getSharedContents);
router.post('/',createSharedContents);
router.put('/',updateSharedContents);
router.delete('/',deleteSharedContents)

export default router;
import express from 'express';
import {
  getUser,
  followArtist,
  bookmarkContent,
  updateUserInfo,
} from '@controller/user';

const router = express.Router();

router.get('/', getUser);
router.put('/follow', followArtist);
router.put('/bookmark', bookmarkContent);

export default router;

import express from 'express';
import {
  getUser,
  followArtist,
  bookmarkContent,
  updateUserProfile,
  updateName,
  getFollowList,
  getBookmarkList,
  getUserContents,
  getUserSharedContents,
} from '@controller/user';
import multer from 'multer';

const fileUpload = multer({ storage: multer.memoryStorage() });
const uplaodProfileImage = fileUpload.single('profileImage');

const router = express.Router();

router.get('/', getUser);
router.get('/content', getUserContents);
router.get('/sharedcontent', getUserSharedContents);
router.get('/follow', getFollowList);
router.put('/follow', followArtist);
router.get('/bookmark', getBookmarkList);
router.put('/bookmark', bookmarkContent);
router.put('/profile', uplaodProfileImage, updateUserProfile);
router.put('/username', updateName);

export default router;

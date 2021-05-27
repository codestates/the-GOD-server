import express from 'express';
import {
  getArtist,
  makeArtist,
  updateArtist,
  deleteArtist,
  updateArtistProfile,
} from '@controller/artist';
import multer from 'multer';

const fileUpload = multer({ storage: multer.memoryStorage() });
const uplaodProfileImage = fileUpload.single('profileImage');

const router = express.Router();

router.get('/', getArtist);
router.post('/', makeArtist);
router.put('/', updateArtist);
router.delete('/', deleteArtist);
router.put('/profile', uplaodProfileImage, updateArtistProfile);

export default router;

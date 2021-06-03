import express, { Request, Response } from 'express';
import {
  createContents,
  createContentsTesting,
  deleteContents,
  listOfContents,
  readContent,
  updateContents,
} from '@controller/content';
import multer from 'multer';

const fileUpload = multer({ storage: multer.memoryStorage() });
//const uploadContentImage = fileUpload.array('images', 5);
const uploadContentImage = fileUpload.fields([{ name: 'images' }]);

const router = express.Router();

router.post('/', function (req: Request, res: Response, next) {
  uploadContentImage(req, res, (err: any) => {
    if (err) {
      console.error('multer errer');
    } else {
      next();
    }
  });
});

router.post('/', createContents, uploadContentImage);
router.get('/', readContent);
router.put('/', updateContents, uploadContentImage);
router.delete('/', deleteContents);
router.get('/query', listOfContents);
router.post('/test', createContentsTesting, uploadContentImage);

export default router;

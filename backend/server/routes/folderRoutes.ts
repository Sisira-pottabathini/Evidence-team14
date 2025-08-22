import express from 'express';
import {
  createFolder,
  getFolders,
  verifyFolderPassword,
  deleteFolder
} from '../controllers/folderController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getFolders)
  .post(createFolder);

router.post('/:id/verify', verifyFolderPassword);
router.delete('/:id', deleteFolder);

export default router;
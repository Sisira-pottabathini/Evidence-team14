import express from 'express';
import {
  createEvidence,
  getFolderEvidence,
  getEvidenceFile,
  deleteEvidence
} from '../controllers/evidenceController';
import { protect } from '../middleware/auth';
import { upload } from '../utils/gridfs';

const router = express.Router();

router.use(protect);

router.post('/', upload.array('files'), createEvidence);
router.get('/folder/:folderId', getFolderEvidence);
router.get('/file/:fileId', getEvidenceFile);
router.delete('/:id', deleteEvidence);

export default router;
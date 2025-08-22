"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const evidenceController_1 = require("../controllers/evidenceController");
const auth_1 = require("../middleware/auth");
const gridfs_1 = require("../utils/gridfs");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.post('/', gridfs_1.upload.array('files'), evidenceController_1.createEvidence);
router.get('/folder/:folderId', evidenceController_1.getFolderEvidence);
router.get('/file/:fileId', evidenceController_1.getEvidenceFile);
router.delete('/:id', evidenceController_1.deleteEvidence);
exports.default = router;

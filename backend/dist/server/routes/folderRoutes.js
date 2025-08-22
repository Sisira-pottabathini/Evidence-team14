"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const folderController_1 = require("../controllers/folderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.route('/')
    .get(folderController_1.getFolders)
    .post(folderController_1.createFolder);
router.post('/:id/verify', folderController_1.verifyFolderPassword);
router.delete('/:id', folderController_1.deleteFolder);
exports.default = router;

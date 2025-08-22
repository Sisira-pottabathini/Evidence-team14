"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFileStream = exports.upload = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const multer_gridfs_storage_1 = require("multer-gridfs-storage");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
let bucket;
// Initialize GridFS bucket
mongoose_1.default.connection.once('open', () => {
    if (!mongoose_1.default.connection.db) {
        throw new Error('Database connection is not established.');
    }
    bucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db, {
        bucketName: 'uploads'
    });
});
// Create storage engine
const storage = new multer_gridfs_storage_1.GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto_1.default.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path_1.default.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
// File filter function
const fileFilter = (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type'), false);
    }
};
// Initialize upload middleware
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE)
    }
});
// Get file stream
const getFileStream = (fileId) => {
    return bucket.openDownloadStream(new mongoose_1.default.Types.ObjectId(fileId));
};
exports.getFileStream = getFileStream;
// Delete file
const deleteFile = async (fileId) => {
    await bucket.delete(new mongoose_1.default.Types.ObjectId(fileId));
};
exports.deleteFile = deleteFile;

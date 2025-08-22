import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';

let bucket: GridFSBucket;

// Initialize GridFS bucket
mongoose.connection.once('open', () => {
  if (!mongoose.connection.db) {
    throw new Error('Database connection is not established.');
  }
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI!,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        
        const filename = buf.toString('hex') + path.extname(file.originalname);
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
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES!.split(',');
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Initialize upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE!)
  }
});

// Get file stream
export const getFileStream = (fileId: string) => {
  return bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
};

// Delete file
export const deleteFile = async (fileId: string) => {
  await bucket.delete(new mongoose.Types.ObjectId(fileId));
};
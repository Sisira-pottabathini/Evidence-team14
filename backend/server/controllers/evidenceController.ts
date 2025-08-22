import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Evidence from '../models/Evidence';
import Folder from '../models/Folder';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../middleware/auth';
import { upload, getFileStream, deleteFile } from '../utils/gridfs';

// @desc    Create new evidence
// @route   POST /api/evidence
// @access  Private
export const createEvidence = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, folderId, secretKey } = req.body;
    const files = req.files as Express.Multer.File[];

    // Check if folder exists and user has access
    const folder = await Folder.findById(folderId);
    if (!folder || folder.userId.toString() !== req.user.id) {
      throw new ApiError('Folder not found or access denied', 404);
    }

    // Process uploaded files
    const videos = files.filter(f => f.mimetype.startsWith('video/')).map(f => ({
      filename: f.filename,
      contentType: f.mimetype,
      size: f.size,
      gridFSId: f.filename
    }));

    const images = files.filter(f => f.mimetype.startsWith('image/')).map(f => ({
      filename: f.filename,
      contentType: f.mimetype,
      size: f.size,
      gridFSId: f.filename
    }));

    const audios = files.filter(f => f.mimetype.startsWith('audio/')).map(f => ({
      filename: f.filename,
      contentType: f.mimetype,
      size: f.size,
      gridFSId: f.filename
    }));

    const evidence = await Evidence.create({
      name,
      description,
      folderId,
      secretKey,
      videos,
      images,
      audios
    });

    res.status(201).json({
      success: true,
      evidence: {
        id: evidence._id,
        name: evidence.name,
        description: evidence.description,
        createdAt: evidence.createdAt,
        fileCount: {
          videos: videos.length,
          images: images.length,
          audios: audios.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get folder evidence items
// @route   GET /api/evidence/folder/:folderId
// @access  Private
export const getFolderEvidence = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.findById(req.params.folderId);
    if (!folder || folder.userId.toString() !== req.user.id) {
      throw new ApiError('Folder not found or access denied', 404);
    }

    const evidence = await Evidence.find({ folderId: req.params.folderId })
      .select('name description createdAt videos images audios');

    res.status(200).json({
      success: true,
      count: evidence.length,
      evidence
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get evidence file
// @route   GET /api/evidence/file/:fileId
// @access  Private
export const getEvidenceFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fileStream = getFileStream(req.params.fileId);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete evidence
// @route   DELETE /api/evidence/:id
// @access  Private
export const deleteEvidence = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) {
      throw new ApiError('Evidence not found', 404);
    }

    // Check if user has access to the folder
    const folder = await Folder.findById(evidence.folderId);
    if (!folder || folder.userId.toString() !== req.user.id) {
      throw new ApiError('Not authorized to delete this evidence', 401);
    }

    // Delete all associated files
    const allFiles = [...evidence.videos, ...evidence.images, ...evidence.audios];
    for (const file of allFiles) {
      await deleteFile(file.gridFSId.toString());
    }

    // Delete evidence document
    await evidence.deleteOne({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Evidence deleted successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
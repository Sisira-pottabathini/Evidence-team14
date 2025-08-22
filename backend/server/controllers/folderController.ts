import { Request, Response, NextFunction } from 'express';
import Folder from '../models/Folder';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../middleware/auth';

// @desc    Create new folder
// @route   POST /api/folders
// @access  Private
export const createFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, password } = req.body;

    const folder = await Folder.create({
      name,
      password,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      folder: {
        id: folder._id,
        name: folder.name,
        createdAt: folder.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's folders
// @route   GET /api/folders
// @access  Private
export const getFolders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const folders = await Folder.find({ userId: req.user.id })
      .select('name createdAt');

    res.status(200).json({
      success: true,
      count: folders.length,
      folders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify folder password
// @route   POST /api/folders/:id/verify
// @access  Private
export const verifyFolderPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.findById(req.params.id).select('+password');

    if (!folder) {
      throw new ApiError('Folder not found', 404);
    }

    // Check if user owns the folder
    if (folder.userId.toString() !== req.user.id) {
      throw new ApiError('Not authorized to access this folder', 401);
    }

    const isMatch = await folder.comparePassword(req.body.password);

    if (!isMatch) {
      throw new ApiError('Invalid password', 401);
    }

    res.status(200).json({
      success: true,
      message: 'Password verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete folder
// @route   DELETE /api/folders/:id
// @access  Private
export const deleteFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      throw new ApiError('Folder not found', 404);
    }

    // Check if user owns the folder
    if (folder.userId.toString() !== req.user.id) {
      throw new ApiError('Not authorized to delete this folder', 401);
    }

    await folder.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Folder deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
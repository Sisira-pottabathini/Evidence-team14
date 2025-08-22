"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.verifyFolderPassword = exports.getFolders = exports.createFolder = void 0;
const Folder_1 = __importDefault(require("../models/Folder"));
const ApiError_1 = require("../utils/ApiError");
// @desc    Create new folder
// @route   POST /api/folders
// @access  Private
const createFolder = async (req, res, next) => {
    try {
        const { name, password } = req.body;
        const folder = await Folder_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createFolder = createFolder;
// @desc    Get user's folders
// @route   GET /api/folders
// @access  Private
const getFolders = async (req, res, next) => {
    try {
        const folders = await Folder_1.default.find({ userId: req.user.id })
            .select('name createdAt');
        res.status(200).json({
            success: true,
            count: folders.length,
            folders
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getFolders = getFolders;
// @desc    Verify folder password
// @route   POST /api/folders/:id/verify
// @access  Private
const verifyFolderPassword = async (req, res, next) => {
    try {
        const folder = await Folder_1.default.findById(req.params.id).select('+password');
        if (!folder) {
            throw new ApiError_1.ApiError('Folder not found', 404);
        }
        // Check if user owns the folder
        if (folder.userId.toString() !== req.user.id) {
            throw new ApiError_1.ApiError('Not authorized to access this folder', 401);
        }
        const isMatch = await folder.comparePassword(req.body.password);
        if (!isMatch) {
            throw new ApiError_1.ApiError('Invalid password', 401);
        }
        res.status(200).json({
            success: true,
            message: 'Password verified successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyFolderPassword = verifyFolderPassword;
// @desc    Delete folder
// @route   DELETE /api/folders/:id
// @access  Private
const deleteFolder = async (req, res, next) => {
    try {
        const folder = await Folder_1.default.findById(req.params.id);
        if (!folder) {
            throw new ApiError_1.ApiError('Folder not found', 404);
        }
        // Check if user owns the folder
        if (folder.userId.toString() !== req.user.id) {
            throw new ApiError_1.ApiError('Not authorized to delete this folder', 401);
        }
        await folder.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Folder deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteFolder = deleteFolder;

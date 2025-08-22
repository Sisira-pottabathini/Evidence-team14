"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvidence = exports.getEvidenceFile = exports.getFolderEvidence = exports.createEvidence = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Evidence_1 = __importDefault(require("../models/Evidence"));
const Folder_1 = __importDefault(require("../models/Folder"));
const ApiError_1 = require("../utils/ApiError");
const gridfs_1 = require("../utils/gridfs");
// @desc    Create new evidence
// @route   POST /api/evidence
// @access  Private
const createEvidence = async (req, res, next) => {
    try {
        const { name, description, folderId, secretKey } = req.body;
        const files = req.files;
        // Check if folder exists and user has access
        const folder = await Folder_1.default.findById(folderId);
        if (!folder || folder.userId.toString() !== req.user.id) {
            throw new ApiError_1.ApiError('Folder not found or access denied', 404);
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
        const evidence = await Evidence_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createEvidence = createEvidence;
// @desc    Get folder evidence items
// @route   GET /api/evidence/folder/:folderId
// @access  Private
const getFolderEvidence = async (req, res, next) => {
    try {
        const folder = await Folder_1.default.findById(req.params.folderId);
        if (!folder || folder.userId.toString() !== req.user.id) {
            throw new ApiError_1.ApiError('Folder not found or access denied', 404);
        }
        const evidence = await Evidence_1.default.find({ folderId: req.params.folderId })
            .select('name description createdAt videos images audios');
        res.status(200).json({
            success: true,
            count: evidence.length,
            evidence
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getFolderEvidence = getFolderEvidence;
// @desc    Get evidence file
// @route   GET /api/evidence/file/:fileId
// @access  Private
const getEvidenceFile = async (req, res, next) => {
    try {
        const fileStream = (0, gridfs_1.getFileStream)(req.params.fileId);
        fileStream.pipe(res);
    }
    catch (error) {
        next(error);
    }
};
exports.getEvidenceFile = getEvidenceFile;
// @desc    Delete evidence
// @route   DELETE /api/evidence/:id
// @access  Private
const deleteEvidence = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const evidence = await Evidence_1.default.findById(req.params.id);
        if (!evidence) {
            throw new ApiError_1.ApiError('Evidence not found', 404);
        }
        // Check if user has access to the folder
        const folder = await Folder_1.default.findById(evidence.folderId);
        if (!folder || folder.userId.toString() !== req.user.id) {
            throw new ApiError_1.ApiError('Not authorized to delete this evidence', 401);
        }
        // Delete all associated files
        const allFiles = [...evidence.videos, ...evidence.images, ...evidence.audios];
        for (const file of allFiles) {
            await (0, gridfs_1.deleteFile)(file.gridFSId.toString());
        }
        // Delete evidence document
        await evidence.deleteOne({ session });
        await session.commitTransaction();
        res.status(200).json({
            success: true,
            message: 'Evidence deleted successfully'
        });
    }
    catch (error) {
        await session.abortTransaction();
        next(error);
    }
    finally {
        session.endSession();
    }
};
exports.deleteEvidence = deleteEvidence;

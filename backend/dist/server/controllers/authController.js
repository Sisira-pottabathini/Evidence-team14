"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = require("../utils/ApiError");
// Generate JWT Token
const generateToken = (id) => {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw new Error('JWT_SECRET or JWT_EXPIRES_IN is not defined in .env');
    }
};
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new ApiError_1.ApiError('Please provide name, email, and password', 400);
        }
        // Check if user exists
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            throw new ApiError_1.ApiError('User already exists', 400);
        }
        // Create user
        const user = await User_1.default.create({ name, email, password });
        // Generate token
        const token = generateToken(user.id.toString());
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError_1.ApiError('Please provide email and password', 400);
        }
        // Find user with password
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            throw new ApiError_1.ApiError('Invalid credentials', 401);
        }
        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ApiError_1.ApiError('Invalid credentials', 401);
        }
        // Generate token
        const token = generateToken(user.id.toString());
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            throw new ApiError_1.ApiError('User not authenticated', 401);
        }
        const user = await User_1.default.findById(req.user.id);
        res.status(200).json({
            success: true,
            user: {
                id: user?._id,
                name: user?.name,
                email: user?.email
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;

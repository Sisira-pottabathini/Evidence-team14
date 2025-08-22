// server/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { ApiError } from '../utils/ApiError';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: { id: string } | IUser;
}

// Generate JWT Token
const generateToken = (id: string): void => {
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    throw new Error('JWT_SECRET or JWT_EXPIRES_IN is not defined in .env');
  }

  
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError('Please provide name, email, and password', 400);
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError('User already exists', 400);
    }

    // Create user
    const user: IUser = await User.create({ name, email, password });

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
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError('Please provide email and password', 400);
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError('Invalid credentials', 401);
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
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      throw new ApiError('User not authenticated', 401);
    }

    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email
      }
    });
  } catch (error) {
    next(error);
  }
};

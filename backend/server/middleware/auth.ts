import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      throw new ApiError('Not authorized to access this route', 401);
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      
      // Attach user to request object
      req.user = await User.findById((decoded as any).id);
      next();
    } catch (error) {
      throw new ApiError('Not authorized to access this route', 401);
    }
  } catch (error) {
    next(error);
  }
};
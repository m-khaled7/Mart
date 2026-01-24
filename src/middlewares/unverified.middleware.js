import AsyncHandler from "../utils/AsyncHandler.js"
import AppError from "../utils/AppError.js"
import User from "../modules/User/user.model.js";
import { verfiyVerifyToken } from "../modules/Auth/JWT.js";

export default AsyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Unauthorized - Token is required', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new AppError('Unauthorized - Token is required', 401);
    }

    try {
        const payload = verfiyVerifyToken(token);
        
        if (!payload) {
            throw new AppError('Invalid token', 401);
        }

        const user = await User.findById(payload.sub).select('-password');
        
        if (!user) {
            throw new AppError('Unauthorized - User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid token', 401);
        }
        if (error.name === 'TokenExpiredError') {
            throw new AppError('Token expired', 401);
        }
        if (error.name === 'NotBeforeError') {
            throw new AppError('Token not active yet', 401);
        }
        
        // Re-throw if it's already an AppError
        if (error instanceof AppError) {
            throw error;
        }
        
        // Generic token verification error
        throw new AppError('Token verification failed', 401);
    }
});


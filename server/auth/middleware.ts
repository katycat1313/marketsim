import { Request, Response, NextFunction } from 'express';

// Check if user is authenticated
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Temporary mock authentication for development
// This should be replaced with a proper authentication system
export const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Set a mock user ID for development purposes
  req.user = { id: 1 }; // Using user ID 1 for all requests during development
  next();
};
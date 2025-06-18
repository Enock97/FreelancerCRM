import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: number;
}

interface AuthRequest extends Request {
  user?: AuthPayload | null;
}

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  req.user = null; // Default til ikke-innlogget
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
      req.user = decoded; 
    } catch {
      req.user = null;
    }
  }
  next(); 
};



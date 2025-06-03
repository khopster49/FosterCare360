import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export async function hashPassword(password: string): Promise<string> {
  // Validate password strength
  const result = zxcvbn(password);
  if (result.score < 3) {
    throw new Error('Password is too weak. Please use a stronger password.');
  }
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Token refresh function
export async function refreshToken(token: string): Promise<string | null> {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return null;
    
    // Check if token is close to expiry (within 1 hour)
    const expiryTime = decoded.exp * 1000;
    if (Date.now() > expiryTime - 3600000) {
      // Generate new token
      return generateToken({
        id: decoded.id,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role
      });
    }
    return token;
  } catch (error) {
    return null;
  }
}
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: { id: number; email: string; firstName: string; lastName: string; role: string }): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  // Get user from database to ensure they still exist
  const user = await storage.getUserById(decoded.id);
  if (!user) {
    return res.status(403).json({ message: 'User not found' });
  }

  req.user = { 
    id: user.id, 
    email: user.email, 
    firstName: user.firstName || '', 
    lastName: user.lastName || '', 
    role: user.role 
  };
  next();
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}
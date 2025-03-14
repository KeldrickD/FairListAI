import { Request, Response, NextFunction } from 'express';
import { db } from '../index';
import { rateLimits } from './schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken, getUserById } from './auth';
import csrf from 'csurf';

// Authentication middleware
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const { userId } = verifyToken(token);
    
    // Get user from database
    const user = await getUserById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }
    
    // Add user to request object for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
};

// Check if user has admin role
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

// Check if user is premium
export const isPremium = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ message: 'Premium subscription required' });
  }
  
  next();
};

// Rate limiting middleware
export const rateLimit = (
  options: {
    windowMs: number; // Time window in milliseconds
    max: number; // Maximum requests per window
    message?: string; // Error message
  }
) => {
  const { windowMs, max, message = 'Too many requests, please try again later.' } = options;
  
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const endpoint = req.originalUrl || req.url;
    
    try {
      // Check if this IP+endpoint combination exists
      const rateLimit = await db.query.rateLimits.findFirst({
        where: and(
          eq(rateLimits.ip, ip as string),
          eq(rateLimits.endpoint, endpoint)
        ),
      });
      
      const now = new Date();
      
      if (rateLimit) {
        // If the reset time has passed, reset the count
        if (rateLimit.resetAt < now) {
          await db.update(rateLimits)
            .set({
              count: 1,
              resetAt: new Date(now.getTime() + windowMs)
            })
            .where(eq(rateLimits.id, rateLimit.id));
            
          next();
          return;
        }
        
        // If we're under the limit, increment the count
        if (rateLimit.count < max) {
          await db.update(rateLimits)
            .set({ count: rateLimit.count + 1 })
            .where(eq(rateLimits.id, rateLimit.id));
            
          next();
          return;
        }
        
        // We're over the limit
        return res.status(429).json({ message });
      } else {
        // First time this IP is hitting this endpoint, create a new record
        await db.insert(rateLimits).values({
          ip: ip as string,
          endpoint,
          count: 1,
          resetAt: new Date(now.getTime() + windowMs)
        });
        
        next();
      }
    } catch (error) {
      console.error('Rate limit error:', error);
      // If there's an error with rate limiting, let the request proceed
      next();
    }
  };
};

// CSRF protection middleware
export const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
});

// Error handler for CSRF errors
export const handleCsrfError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }
  
  // Handle CSRF token errors
  res.status(403).json({ message: 'CSRF token validation failed' });
};

// Add CSRF token to response for client
export const setCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

// Add security headers to all responses
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
  );
  
  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
}; 
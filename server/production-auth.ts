import { Request, Response, NextFunction } from 'express';

// Production auth configuration without passport dependencies
export const configurePassport = () => {
  console.log('Production mode: Passport-free authentication configured');
  // No passport configuration needed in production
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Production deployment with bypassed authentication for ESM compatibility
  if (process.env.BYPASS_AUTH === 'true') {
    return next();
  }
  
  // Basic session check without passport dependency
  if (req.session && (req.session as any).user) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Bypass admin check in production
  if (process.env.BYPASS_AUTH === 'true') {
    return next();
  }
  
  if (req.user && (req.user as any).role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Admin access required' });
};

export const canWriteAssets = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.BYPASS_AUTH === 'true') {
    return next();
  }
  
  if (req.user && ['admin', 'analyst'].includes((req.user as any).role)) {
    return next();
  }
  res.status(403).json({ error: 'Asset write permission required' });
};

export const canWriteOtherResources = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.BYPASS_AUTH === 'true') {
    return next();
  }
  
  if (req.user && (req.user as any).role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Admin permission required' });
};
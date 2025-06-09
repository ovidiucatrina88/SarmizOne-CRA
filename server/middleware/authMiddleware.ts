import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as OpenIDConnectStrategy } from 'passport-openidconnect';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { authService } from '../services/authService';
import { pool } from '../db';
import type { UserWithoutPassword } from '@shared/schema';

// Extend Express User type
declare global {
  namespace Express {
    interface User extends UserWithoutPassword {}
  }
}

export class AuthMiddleware {
  private static oidcConfigured = false;

  // Initialize session configuration
  static initializeSession() {
    const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
    const pgStore = connectPgSimple(session);
    const sessionStore = new pgStore({
      pool: pool,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: 'sessions',
    });

    return session({
      secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: sessionTtl,
      },
    });
  }

  // Initialize passport with local strategy
  static async initializePassport() {
    // Initialize auth service
    await authService.initializeAuth();

    // Local Strategy
    passport.use(new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          const user = await authService.authenticateLocal({ username, password });
          if (user) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid username or password' });
          }
        } catch (error: any) {
          return done(null, false, { message: error.message });
        }
      }
    ));

    // Serialize/deserialize user for session
    passport.serializeUser((user: Express.User, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
      try {
        const user = await authService.getUserById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });

    console.log('Local authentication strategy initialized');
  }

  // Dynamically configure OIDC strategy
  static async configureOIDC() {
    const config = await authService.getAuthConfig();
    
    if (!config.oidcEnabled || !config.oidcIssuer || !config.oidcClientId || !config.oidcClientSecret) {
      console.log('OIDC not configured or disabled');
      return;
    }

    if (AuthMiddleware.oidcConfigured) {
      // Remove existing OIDC strategy
      passport.unuse('openidconnect');
    }

    // Configure OIDC Strategy
    passport.use(new OpenIDConnectStrategy({
      issuer: config.oidcIssuer,
      authorizationURL: `${config.oidcIssuer}/v1/authorize`,
      tokenURL: `${config.oidcIssuer}/v1/token`,
      userInfoURL: `${config.oidcIssuer}/v1/userinfo`,
      clientID: config.oidcClientId,
      clientSecret: config.oidcClientSecret,
      callbackURL: config.oidcCallbackUrl,
      scope: config.oidcScopes.join(' '),
    }, async (issuer: string, profile: any, done: any) => {
      try {
        const user = await authService.upsertOidcUser(profile._json);
        return done(null, user);
      } catch (error) {
        console.error('OIDC authentication error:', error);
        return done(error, null);
      }
    }));

    AuthMiddleware.oidcConfigured = true;
    console.log('OIDC authentication strategy configured for:', config.oidcIssuer);
  }

  // Check if user is authenticated
  static isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    
    // For API routes, return JSON error
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required',
        redirectToLogin: true 
      });
    }
    
    // For web routes, redirect to login
    res.redirect('/login');
  };

  // Check if user has admin role
  static isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    if (req.user && req.user.role === 'admin') {
      return next();
    }

    res.status(403).json({ 
      success: false, 
      error: 'Admin access required' 
    });
  };

  // Check if user can write assets (admin or analyst)
  static canWriteAssets = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    if (req.user && ['admin', 'analyst'].includes(req.user.role)) {
      return next();
    }

    res.status(403).json({ 
      success: false, 
      error: 'Asset write permission required' 
    });
  };

  // Check if user can write other resources (admin only)
  static canWriteOtherResources = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    if (req.user && req.user.role === 'admin') {
      return next();
    }

    res.status(403).json({ 
      success: false, 
      error: 'Admin permission required' 
    });
  };

  // Check if system needs initial setup
  static async checkInitialSetup(req: Request, res: Response, next: NextFunction) {
    try {
      const hasAdmin = await authService.hasAdminUsers();
      if (!hasAdmin && req.path !== '/api/auth/setup' && req.path !== '/setup') {
        return res.status(503).json({ 
          success: false, 
          error: 'System requires initial setup',
          needsSetup: true 
        });
      }
      next();
    } catch (error) {
      console.error('Error checking initial setup:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }
}
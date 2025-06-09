import passport from 'passport';
import { Strategy as OpenIDConnectStrategy } from 'passport-openidconnect';
import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Configure OpenID Connect strategy
export const configurePassport = () => {
  // Only configure if all required environment variables are set
  if (
    !process.env.OIDC_ISSUER ||
    !process.env.OIDC_CLIENT_ID ||
    !process.env.OIDC_CLIENT_SECRET ||
    !process.env.OIDC_CALLBACK_URL
  ) {
    console.warn('OpenID Connect not configured. Some environment variables are missing.');
    return;
  }

  passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: process.env.OIDC_ISSUER,
        authorizationURL: process.env.OIDC_AUTHORIZATION_URL || `${process.env.OIDC_ISSUER}/authorize`, 
        tokenURL: process.env.OIDC_TOKEN_URL || `${process.env.OIDC_ISSUER}/token`,
        userInfoURL: process.env.OIDC_USER_INFO_URL || `${process.env.OIDC_ISSUER}/userinfo`,
        clientID: process.env.OIDC_CLIENT_ID,
        clientSecret: process.env.OIDC_CLIENT_SECRET,
        callbackURL: process.env.OIDC_CALLBACK_URL,
        scope: ['openid', 'profile', 'email']
      },
      async (
        issuer,
        profile,
        context,
        idToken,
        accessToken,
        refreshToken,
        done
      ) => {
        try {
          // Check if user exists with this sub ID
          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.sub, profile.id));

          if (existingUser) {
            // Update last login
            await db
              .update(users)
              .set({ lastLogin: new Date() })
              .where(eq(users.id, existingUser.id));
            
            return done(null, existingUser);
          }

          // Create a new user
          const [newUser] = await db
            .insert(users)
            .values({
              sub: profile.id,
              email: profile.emails?.[0]?.value || '',
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              displayName: profile.displayName,
              role: 'standard', // Default role for new users
            })
            .returning();

          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
      
      done(null, user || null);
    } catch (err) {
      done(err);
    }
  });
};

// Middleware to check if the user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    // In development mode with BYPASS_AUTH, skip authentication
    return next();
  }

  if (req.isAuthenticated()) {
    return next();
  }
  
  // For API requests, return 401
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // For other requests, redirect to login
  res.redirect('/login');
};

// Middleware to check if the user has admin role
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    // In development mode with BYPASS_AUTH, skip admin check
    return next();
  }

  if (req.isAuthenticated() && (req.user as any)?.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({ error: 'Forbidden' });
};

// Middleware to check if user has asset write permissions
export const canWriteAssets = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    // In development mode with BYPASS_AUTH, skip permission check
    return next();
  }

  if (req.isAuthenticated()) {
    // Both admin and standard users can write to assets
    return next();
  }
  
  return res.status(403).json({ error: 'Forbidden' });
};

// Middleware to check if user has write permissions on resources other than assets
export const canWriteOtherResources = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    // In development mode with BYPASS_AUTH, skip permission check
    return next();
  }

  if (req.isAuthenticated() && (req.user as any)?.role === 'admin') {
    // Only admin users can write to other resources
    return next();
  }
  
  return res.status(403).json({ error: 'Forbidden' });
};
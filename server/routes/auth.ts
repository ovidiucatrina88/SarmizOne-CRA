import { Router } from 'express';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const router = Router();

// Login endpoint
router.post('/auth/login/local', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password required' 
      });
    }

    const [user] = await db.select().from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Set user data directly in session
    (req as any).session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName || user.username,
      role: user.role,
      authType: 'local'
    };

    console.log('Session before save:', {
      sessionId: (req as any).session.id,
      userId: (req as any).session.user?.id,
      username: (req as any).session.user?.username
    });

    // Ensure session is created before saving
    (req as any).session.regenerate((regenerateErr: any) => {
      if (regenerateErr) {
        console.error('Session regenerate error:', regenerateErr);
        return res.status(500).json({ 
          success: false, 
          error: 'Session creation failed' 
        });
      }

      // Set user data after regeneration
      (req as any).session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName || user.username,
        role: user.role,
        authType: 'local'
      };

      // Force save session immediately
      (req as any).session.save((saveErr: any) => {
        if (saveErr) {
          console.error('Session save error:', saveErr);
          return res.status(500).json({ 
            success: false, 
            error: 'Session save failed' 
          });
        }

        console.log('Session saved successfully:', {
          sessionId: (req as any).session.id,
          userId: (req as any).session.user?.id,
          username: (req as any).session.user?.username
        });
        
        res.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName || user.username,
            role: user.role,
            authType: 'local'
          }
        });
      });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
});

// Get current user with production debugging
router.get('/auth/user', async (req, res) => {
  try {
    const session = (req as any).session;
    
    // Production debugging - log session details
    console.log('Production /auth/user check:', {
      sessionExists: !!session,
      sessionId: session?.id,
      hasUser: !!session?.user,
      cookies: req.headers.cookie ? 'present' : 'missing',
      host: req.headers.host,
      protocol: req.protocol,
      forwardedProto: req.get('x-forwarded-proto'),
      isSecure: req.secure
    });
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    res.json({
      id: session.user.id,
      username: session.user.username,
      email: session.user.email,
      displayName: session.user.displayName,
      role: session.user.role,
      authType: session.user.authType
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user'
    });
  }
});

// Logout
router.post('/auth/logout', (req, res) => {
  (req as any).session.destroy((err: any) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Logout failed' 
      });
    }
    res.json({ success: true });
  });
});

export default router;
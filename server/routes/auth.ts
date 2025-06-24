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

    console.log('PRODUCTION LOGIN DEBUG - Before session creation:', {
      hasSession: !!(req as any).session,
      sessionId: (req as any).session?.id,
      nodeEnv: process.env.NODE_ENV,
      secure: req.secure,
      protocol: req.protocol,
      headers: {
        host: req.headers.host,
        'x-forwarded-proto': req.headers['x-forwarded-proto']
      }
    });

    // Set user data directly in session without regeneration for production
    (req as any).session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName || user.username,
      role: user.role,
      authType: 'local'
    };

    // Save session explicitly
    (req as any).session.save((saveErr: any) => {
      if (saveErr) {
        console.error('Session save error:', saveErr);
        return res.status(500).json({ 
          success: false, 
          error: 'Session save failed' 
        });
      }

      console.log('PRODUCTION LOGIN SUCCESS - Session saved:', {
        sessionId: (req as any).session.id,
        userId: (req as any).session.user?.id,
        username: (req as any).session.user?.username,
        cookieConfig: {
          secure: req.secure,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        }
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

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
});

// Get all users for admin management
router.get('/auth/users', async (req, res) => {
  try {
    const session = (req as any).session;
    
    console.log('AUTH REQUEST DEBUG:', {
      method: req.method,
      path: req.path,
      hasSession: !!session,
      sessionId: session?.id,
      cookies: req.headers.cookie ? 'present' : 'missing',
      host: req.headers.host,
      userAgent: req.headers['user-agent']?.substring(0, 50),
      protocol: req.protocol,
      secure: req.secure,
      forwardedProto: req.get('x-forwarded-proto'),
      nodeEnv: process.env.NODE_ENV
    });
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    // Get all users from database
    const allUsers = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      authType: users.authType,
      isActive: users.isActive,
      lastLogin: users.lastLogin,
      createdAt: users.createdAt
    }).from(users);

    // Transform users to match frontend interface
    const transformedUsers = allUsers.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`.trim()
        : user.username || user.email,
      role: user.role,
      authType: user.authType || 'local',
      isActive: user.isActive,
      lastLogin: user.lastLogin?.toISOString(),
      createdAt: user.createdAt.toISOString()
    }));

    res.json({
      success: true,
      users: transformedUsers
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users'
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

// Create user endpoint
router.post('/auth/users', async (req, res) => {
  try {
    const session = (req as any).session;
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    const { username, email, password, firstName, lastName, role } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email and password are required'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    const [newUser] = await db.insert(users).values({
      username,
      email,
      displayName: firstName && lastName 
        ? `${firstName} ${lastName}`.trim()
        : firstName || username,
      firstName: firstName || null,
      lastName: lastName || null,
      passwordHash,
      role: role || 'user',
      authType: 'local',
      isActive: true
    }).returning();

    res.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        displayName: newUser.firstName && newUser.lastName 
          ? `${newUser.firstName} ${newUser.lastName}`.trim()
          : newUser.username || newUser.email,
        role: newUser.role,
        authType: newUser.authType,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

// Delete user endpoint
router.delete('/auth/users/:userId', async (req, res) => {
  try {
    const session = (req as any).session;
    const userId = parseInt(req.params.userId);
    
    console.log('AUTH REQUEST DEBUG:', {
      method: req.method,
      path: req.path,
      hasSession: !!session,
      sessionId: session?.id,
      cookies: req.headers.cookie ? 'present' : 'missing',
      host: req.headers.host,
      userAgent: req.headers['user-agent']?.substring(0, 50),
      protocol: req.protocol,
      secure: req.secure,
      forwardedProto: req.get('x-forwarded-proto'),
      nodeEnv: process.env.NODE_ENV
    });
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    // Prevent users from deleting themselves
    if (userId === session.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }

    // Delete the user
    const result = await db.delete(users).where(eq(users.id, userId)).returning();
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('AUTH RESPONSE COMPLETE:', {
      path: req.path,
      statusCode: 200,
      hasSetCookie: 'yes'
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

// Update user role endpoint
router.patch('/auth/users/:userId/role', async (req, res) => {
  try {
    const session = (req as any).session;
    const userId = parseInt(req.params.userId);
    const { role } = req.body;
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Valid role is required'
      });
    }

    // Update user role
    const result = await db.update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user role'
    });
  }
});

// Deactivate user endpoint
router.patch('/auth/users/:userId/deactivate', async (req, res) => {
  try {
    const session = (req as any).session;
    const userId = parseInt(req.params.userId);
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    // Prevent users from deactivating themselves
    if (userId === session.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot deactivate your own account'
      });
    }

    // Deactivate user
    const result = await db.update(users)
      .set({ isActive: false })
      .where(eq(users.id, userId))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate user'
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
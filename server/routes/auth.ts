import { Router } from 'express';
import { authService } from '../services/authService';
import { validatePasswordStrength } from '@shared/utils/passwordUtils';
import { z } from 'zod';
import { db } from '../db';
import { authConfig } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Validation schemas
const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
});

/**
 * Local Authentication Routes
 */

// Login with username/password
router.post('/auth/login/local', async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    
    const user = await authService.authenticateLocal({ username, password });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Set user session
    (req as any).session.user = {
      id: user.id,
      authType: 'local',
      role: user.role,
      username: user.username,
      email: user.email,
      displayName: user.displayName
    };

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        authType: 'local'
      }
    });
  } catch (error) {
    console.error('Local login error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid login request'
    });
  }
});

// Get current user (works for both local and SSO)
router.get('/auth/user', async (req, res) => {
  try {
    const session = (req as any).session;
    
    // Check for local session
    if (session?.user) {
      const user = await authService.getUserById(session.user.id);
      if (user && user.isActive) {
        return res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          authType: user.authType,
          profileImageUrl: user.profileImageUrl
        });
      }
    }

    // Check for SSO session (existing implementation)
    if ((req as any).isAuthenticated && (req as any).isAuthenticated()) {
      const ssoUser = (req as any).user;
      if (ssoUser?.claims?.sub) {
        const user = await authService.getUserById(ssoUser.claims.sub);
        if (user && user.isActive) {
          return res.json({
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            authType: user.authType,
            profileImageUrl: user.profileImageUrl
          });
        }
      }
    }

    res.status(401).json({ success: false, error: 'Not authenticated' });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
});

// Change password (authenticated users only)
router.post('/auth/change-password', async (req, res) => {
  try {
    const session = (req as any).session;
    
    // Check if user is authenticated
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'New password does not meet requirements',
        details: passwordValidation.feedback
      });
    }

    // Verify current password
    const user = await authService.authenticateLocal({ username: session.user.username, password: currentPassword });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Change password
    try {
      await authService.changePassword(session.user.id, newPassword);
      
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to change password'
      });
    }
  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid request'
    });
  }
});

// Logout (works for both local and SSO)
router.post('/auth/logout', (req, res) => {
  const session = (req as any).session;
  
  if (session) {
    session.destroy((err: any) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ success: false, error: 'Logout failed' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
    });
  } else {
    res.json({ success: true, message: 'No active session' });
  }
});

/**
 * User Management Routes (Admin only)
 */

// Middleware to check admin role
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    const session = req.session;
    let userRole = null;

    // Check local session
    if (session?.user) {
      const user = await authService.getUserById(session.user.id);
      userRole = user?.role;
    }
    // Check SSO session
    else if (req.isAuthenticated && req.isAuthenticated()) {
      const ssoUser = req.user;
      if (ssoUser?.claims?.sub) {
        const user = await authService.getUserById(ssoUser.claims.sub);
        userRole = user?.role;
      }
    }

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ success: false, error: 'Authorization check failed' });
  }
};

// Create new local user (admin only)
router.post('/auth/users', requireAdmin, async (req, res) => {
  try {
    const userData = createUserSchema.parse(req.body);
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(userData.password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Password does not meet requirements',
        details: passwordValidation.feedback
      });
    }

    // Get admin user ID for tracking
    let createdBy = null;
    const session = (req as any).session;
    if (session?.user) {
      createdBy = session.user.id;
    } else if ((req as any).isAuthenticated && (req as any).isAuthenticated()) {
      const ssoUser = (req as any).user;
      if (ssoUser?.claims?.sub) {
        createdBy = ssoUser.claims.sub;
      }
    }

    const result = await authService.createUser({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role
    }, createdBy);

    res.status(201).json({
      success: true,
      user: result
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid user data'
    });
  }
});

// Get all users (admin only)
router.get('/auth/users', requireAdmin, async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    
    res.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        authType: user.authType,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Update user role (admin only)
router.patch('/auth/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = z.object({ role: z.enum(['user', 'admin']) }).parse(req.body);
    
    const success = await authService.updateUserRole(userId, role);
    
    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update user role'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid request'
    });
  }
});

// Deactivate user (admin only)
router.patch('/auth/users/:id/deactivate', requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const success = await authService.deactivateUser(userId);
    
    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to deactivate user'
      });
    }

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid request'
    });
  }
});

// Activate user (admin only)
router.patch('/auth/users/:id/activate', requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const success = await authService.activateUser(userId);
    
    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to activate user'
      });
    }

    res.json({
      success: true,
      message: 'User activated successfully'
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid request'
    });
  }
});

// Reset user password (admin only, local users only)
router.patch('/auth/users/:id/reset-password', requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { newPassword } = z.object({ newPassword: z.string().min(8) }).parse(req.body);
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Password does not meet requirements',
        details: passwordValidation.feedback
      });
    }
    
    const success = await authService.resetUserPassword(userId, newPassword);
    
    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to reset password'
      });
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid request'
    });
  }
});

// Delete user permanently (admin only)
router.delete('/auth/users/:id', requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Prevent deleting the current admin user
    const session = (req as any).session;
    let currentUserId = null;
    
    if (session?.user) {
      currentUserId = session.user.id;
    } else if ((req as any).isAuthenticated && (req as any).isAuthenticated()) {
      const ssoUser = (req as any).user;
      if (ssoUser?.claims?.sub) {
        currentUserId = ssoUser.claims.sub;
      }
    }
    
    if (currentUserId === userId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }
    
    const success = await authService.permanentlyDeleteUser(userId);
    
    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to delete user'
      });
    }

    res.json({
      success: true,
      message: 'User deleted permanently'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid request'
    });
  }
});

/**
 * OIDC Configuration Routes (Admin only)
 */

const oidcConfigSchema = z.object({
  oidcEnabled: z.boolean().optional(),
  oidcIssuer: z.string().url().optional().or(z.literal('')),
  oidcClientId: z.string().optional(),
  oidcClientSecret: z.string().optional(),
  oidcCallbackUrl: z.string().url().optional().or(z.literal('')),
  oidcScopes: z.array(z.string()).optional(),
  authType: z.enum(['local', 'oidc', 'hybrid']).optional(),
});

// Get current OIDC configuration
router.get('/auth/oidc/config', requireAdmin, async (req, res) => {
  try {
    const [config] = await db.select().from(authConfig).limit(1);
    
    if (!config) {
      return res.json({
        success: true,
        config: {
          oidcEnabled: false,
          oidcIssuer: '',
          oidcClientId: '',
          oidcClientSecret: '',
          oidcCallbackUrl: '',
          oidcScopes: ['openid', 'profile', 'email'],
          authType: 'local'
        }
      });
    }

    // Don't expose sensitive data
    res.json({
      success: true,
      config: {
        oidcEnabled: config.oidcEnabled,
        oidcIssuer: config.oidcIssuer || '',
        oidcClientId: config.oidcClientId || '',
        oidcClientSecret: config.oidcClientSecret ? '***' : '',
        oidcCallbackUrl: config.oidcCallbackUrl || '',
        oidcScopes: config.oidcScopes || ['openid', 'profile', 'email'],
        authType: config.authType
      }
    });
  } catch (error) {
    console.error('Get OIDC config error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get OIDC configuration'
    });
  }
});

// Update OIDC configuration
router.put('/auth/oidc/config', requireAdmin, async (req, res) => {
  try {
    const updates = oidcConfigSchema.parse(req.body);
    
    // Handle client secret - only update if provided and not masked
    if (updates.oidcClientSecret === '***') {
      delete updates.oidcClientSecret;
    }
    
    // Get existing config or create default
    let [config] = await db.select().from(authConfig).limit(1);
    
    if (!config) {
      [config] = await db.insert(authConfig).values({
        authType: 'local',
        oidcEnabled: false,
        sessionTimeout: 3600,
        maxLoginAttempts: 5,
        lockoutDuration: 300,
        passwordMinLength: 8,
        ...updates
      }).returning();
    } else {
      [config] = await db.update(authConfig)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(authConfig.id, config.id))
        .returning();
    }
    
    // Dynamically reconfigure OIDC without restart
    if (updates.oidcEnabled !== undefined || updates.oidcIssuer || updates.oidcClientId) {
      try {
        const { configurePassport } = await import('../auth');
        configurePassport();
        console.log('OIDC configuration updated dynamically');
      } catch (error) {
        console.error('Failed to reconfigure OIDC:', error);
      }
    }
    
    // Don't expose sensitive data
    res.json({
      success: true,
      message: 'OIDC configuration updated successfully',
      config: {
        oidcEnabled: config.oidcEnabled,
        oidcIssuer: config.oidcIssuer || '',
        oidcClientId: config.oidcClientId || '',
        oidcClientSecret: config.oidcClientSecret ? '***' : '',
        oidcCallbackUrl: config.oidcCallbackUrl || '',
        oidcScopes: config.oidcScopes || ['openid', 'profile', 'email'],
        authType: config.authType
      }
    });
  } catch (error) {
    console.error('Update OIDC config error:', error);
    res.status(400).json({
      success: false,
      error: error.errors?.[0]?.message || error.message || 'Failed to update OIDC configuration'
    });
  }
});

// Test OIDC connection
router.post('/auth/oidc/test', requireAdmin, async (req, res) => {
  try {
    const [config] = await db.select().from(authConfig).limit(1);
    
    if (!config || !config.oidcEnabled || !config.oidcIssuer) {
      return res.status(400).json({
        success: false,
        error: 'OIDC not configured'
      });
    }

    // Test OIDC discovery endpoint
    const response = await fetch(`${config.oidcIssuer}/.well-known/openid_configuration`);
    
    if (!response.ok) {
      return res.status(400).json({
        success: false,
        error: 'Failed to connect to OIDC provider'
      });
    }

    const discovery = await response.json();
    
    res.json({
      success: true,
      message: 'OIDC connection successful',
      provider: {
        issuer: discovery.issuer,
        authorizationEndpoint: discovery.authorization_endpoint,
        tokenEndpoint: discovery.token_endpoint,
        userInfoEndpoint: discovery.userinfo_endpoint
      }
    });
  } catch (error) {
    console.error('OIDC test error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test OIDC connection'
    });
  }
});

export default router;
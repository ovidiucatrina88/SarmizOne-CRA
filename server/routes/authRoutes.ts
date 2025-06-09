import { Router } from 'express';
import passport from 'passport';
import { authService } from '../services/authService';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { z } from 'zod';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const createUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['admin', 'analyst', 'viewer']),
});

const updateUserSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['admin', 'analyst', 'viewer']).optional(),
  isActive: z.boolean().optional(),
});

const changePasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

const authConfigSchema = z.object({
  authType: z.enum(['local', 'oidc', 'hybrid']).optional(),
  oidcEnabled: z.boolean().optional(),
  oidcIssuer: z.string().url().optional().or(z.literal('')),
  oidcClientId: z.string().optional(),
  oidcClientSecret: z.string().optional(),
  oidcCallbackUrl: z.string().url().optional().or(z.literal('')),
  oidcScopes: z.array(z.string()).optional(),
  sessionTimeout: z.number().min(300).max(86400).optional(),
  maxLoginAttempts: z.number().min(3).max(20).optional(),
  lockoutDuration: z.number().min(60).max(3600).optional(),
  passwordMinLength: z.number().min(6).max(128).optional(),
});

// Initial setup - create first admin user
router.post('/setup', async (req, res) => {
  try {
    const hasAdmin = await authService.hasAdminUsers();
    if (hasAdmin) {
      return res.status(400).json({
        success: false,
        error: 'System already has admin users'
      });
    }

    const userData = createUserSchema.parse(req.body);
    const user = await authService.createInitialAdmin(userData);

    res.json({
      success: true,
      message: 'Initial admin user created successfully',
      user
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create initial admin user'
    });
  }
});

// Check if system needs setup
router.get('/setup-status', async (req, res) => {
  try {
    const hasAdmin = await authService.hasAdminUsers();
    res.json({
      success: true,
      needsSetup: !hasAdmin
    });
  } catch (error) {
    console.error('Setup status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check setup status'
    });
  }
});

// Local login
router.post('/login', (req, res, next) => {
  try {
    loginSchema.parse(req.body);
    
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Authentication error'
        });
      }
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: info?.message || 'Invalid credentials'
        });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: 'Login error'
          });
        }
        
        res.json({
          success: true,
          message: 'Logged in successfully',
          user
        });
      });
    })(req, res, next);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.errors?.[0]?.message || 'Invalid request data'
    });
  }
});

// OIDC login initiation
router.get('/oidc/login', async (req, res, next) => {
  try {
    const config = await authService.getAuthConfig();
    if (!config.oidcEnabled) {
      return res.status(400).json({
        success: false,
        error: 'OIDC authentication is not enabled'
      });
    }

    // Reconfigure OIDC if needed
    await AuthMiddleware.configureOIDC();
    
    passport.authenticate('openidconnect')(req, res, next);
  } catch (error) {
    console.error('OIDC login error:', error);
    res.status(500).json({
      success: false,
      error: 'OIDC authentication failed'
    });
  }
});

// OIDC callback
router.get('/oidc/callback', 
  passport.authenticate('openidconnect', { 
    successRedirect: '/',
    failureRedirect: '/login?error=oidc_failed'
  })
);

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Logout error'
      });
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Get current user
router.get('/me', AuthMiddleware.isAuthenticated, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Get authentication configuration (admin only)
router.get('/config', AuthMiddleware.isAdmin, async (req, res) => {
  try {
    const config = await authService.getAuthConfig();
    // Don't expose sensitive data
    const { oidcClientSecret, ...safeConfig } = config;
    
    res.json({
      success: true,
      config: {
        ...safeConfig,
        oidcClientSecret: config.oidcClientSecret ? '***' : undefined
      }
    });
  } catch (error) {
    console.error('Get auth config error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get authentication configuration'
    });
  }
});

// Update authentication configuration (admin only)
router.put('/config', AuthMiddleware.isAdmin, async (req, res) => {
  try {
    const updates = authConfigSchema.parse(req.body);
    
    // Handle client secret - only update if provided and not masked
    if (updates.oidcClientSecret === '***') {
      delete updates.oidcClientSecret;
    }
    
    const config = await authService.updateAuthConfig(updates);
    
    // Reconfigure OIDC if settings changed
    if (updates.oidcEnabled !== undefined || updates.oidcIssuer || updates.oidcClientId) {
      await AuthMiddleware.configureOIDC();
    }
    
    // Don't expose sensitive data
    const { oidcClientSecret, ...safeConfig } = config;
    
    res.json({
      success: true,
      message: 'Authentication configuration updated',
      config: {
        ...safeConfig,
        oidcClientSecret: config.oidcClientSecret ? '***' : undefined
      }
    });
  } catch (error: any) {
    console.error('Update auth config error:', error);
    res.status(400).json({
      success: false,
      error: error.errors?.[0]?.message || error.message || 'Failed to update configuration'
    });
  }
});

// User Management Routes (Admin only)

// Get all users
router.get('/users', AuthMiddleware.isAdmin, async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users'
    });
  }
});

// Create user
router.post('/users', AuthMiddleware.isAdmin, async (req, res) => {
  try {
    const userData = createUserSchema.parse(req.body);
    const user = await authService.createUser(userData, req.user?.id);
    
    res.json({
      success: true,
      message: 'User created successfully',
      user
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create user'
    });
  }
});

// Update user
router.put('/users/:id', AuthMiddleware.isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = updateUserSchema.parse(req.body);
    
    const user = await authService.updateUser(id, updates);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update user'
    });
  }
});

// Change user password
router.put('/users/:id/password', AuthMiddleware.isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { newPassword } = changePasswordSchema.parse(req.body);
    
    await authService.changePassword(id, newPassword);
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to change password'
    });
  }
});

// Delete user (deactivate)
router.delete('/users/:id', AuthMiddleware.isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Prevent admin from deleting themselves
    if (req.user?.id === id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }
    
    await authService.deleteUser(id);
    
    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete user'
    });
  }
});

export default router;
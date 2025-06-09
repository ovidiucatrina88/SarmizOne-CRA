import { Router } from 'express';
import { authService } from '../services/authService';
import { validatePasswordStrength } from '@shared/utils/passwordUtils';
import { z } from 'zod';

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
    
    const result = await authService.authenticateLocal(username, password);
    
    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error
      });
    }

    // Set user session
    (req as any).session.user = {
      id: result.user!.id,
      authType: 'local',
      role: result.user!.role,
      username: result.user!.username,
      email: result.user!.email,
      displayName: result.user!.displayName
    };

    res.json({
      success: true,
      user: {
        id: result.user!.id,
        username: result.user!.username,
        email: result.user!.email,
        displayName: result.user!.displayName,
        role: result.user!.role,
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
    const loginResult = await authService.authenticateLocal(session.user.username, currentPassword);
    if (!loginResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Change password
    const success = await authService.resetUserPassword(session.user.id, newPassword);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to change password'
      });
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
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

    const result = await authService.createLocalUser({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      createdBy
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(201).json({
      success: true,
      user: {
        id: result.user!.id,
        username: result.user!.username,
        email: result.user!.email,
        displayName: result.user!.displayName,
        role: result.user!.role,
        authType: result.user!.authType,
        isActive: result.user!.isActive,
        createdAt: result.user!.createdAt
      }
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

export default router;
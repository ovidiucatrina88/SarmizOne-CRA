import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users, authConfig, type User, type UserWithoutPassword, type CreateUserRequest, type LoginRequest, type AuthConfig } from '@shared/schema';
import { eq, and, lt } from 'drizzle-orm';

export class AuthService {
  private static instance: AuthService;
  private currentAuthConfig: AuthConfig | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize authentication configuration
  async initializeAuth(): Promise<void> {
    try {
      const [config] = await db.select().from(authConfig).limit(1);
      
      if (!config) {
        // Create default configuration
        const [defaultConfig] = await db.insert(authConfig).values({
          authType: 'local',
          oidcEnabled: false,
          sessionTimeout: 3600,
          maxLoginAttempts: 5,
          lockoutDuration: 300,
          passwordMinLength: 8,
        }).returning();
        
        this.currentAuthConfig = defaultConfig;
        console.log('Created default authentication configuration');
      } else {
        this.currentAuthConfig = config;
      }
    } catch (error) {
      console.error('Failed to initialize auth configuration:', error);
      throw error;
    }
  }

  // Get current authentication configuration
  async getAuthConfig(): Promise<AuthConfig> {
    if (!this.currentAuthConfig) {
      await this.initializeAuth();
    }
    return this.currentAuthConfig!;
  }

  // Update authentication configuration (for OIDC setup via UI)
  async updateAuthConfig(updates: Partial<AuthConfig>): Promise<AuthConfig> {
    const [updated] = await db.update(authConfig)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(authConfig.id, this.currentAuthConfig!.id))
      .returning();
    
    this.currentAuthConfig = updated;
    console.log('Authentication configuration updated:', { 
      authType: updated.authType, 
      oidcEnabled: updated.oidcEnabled 
    });
    
    return updated;
  }

  // Local Authentication Methods
  async createUser(userData: CreateUserRequest, createdBy?: number): Promise<UserWithoutPassword> {
    const config = await this.getAuthConfig();
    
    // Validate password length
    if (userData.password.length < (config.passwordMinLength || 8)) {
      throw new Error(`Password must be at least ${config.passwordMinLength || 8} characters long`);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12);

    // Check if username already exists
    const existingUser = await db.select().from(users).where(eq(users.username, userData.username)).limit(1);
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      throw new Error('Username already exists');
    }

    // Check if email already exists (if provided)
    if (userData.email) {
      const existingEmail = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
      if (Array.isArray(existingEmail) && existingEmail.length > 0) {
        throw new Error('Email already exists');
      }
    }

    const [newUser] = await db.insert(users).values({
      username: userData.username,
      email: userData.email,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      authType: 'local',
      isActive: true,
      emailVerified: true, // Auto-verify for admin-created users
      createdBy,
    }).returning();

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async authenticateLocal(credentials: LoginRequest): Promise<UserWithoutPassword | null> {
    const config = await this.getAuthConfig();
    
    // Find user by username
    const [user] = await db.select().from(users)
      .where(and(
        eq(users.username, credentials.username),
        eq(users.authType, 'local'),
        eq(users.isActive, true)
      ))
      .limit(1);

    if (!user) {
      return null;
    }

    // Check if account is locked
    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      throw new Error('Account is temporarily locked due to too many failed login attempts');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash!);
    
    if (!isValidPassword) {
      // Increment failed login attempts
      const failedAttempts = (user.failedLoginAttempts || 0) + 1;
      const updates: any = {
        failedLoginAttempts: failedAttempts,
        lastFailedLogin: new Date(),
      };

      // Lock account if max attempts reached
      if (failedAttempts >= config.maxLoginAttempts) {
        updates.accountLockedUntil = new Date(Date.now() + config.lockoutDuration * 1000);
      }

      await db.update(users)
        .set(updates)
        .where(eq(users.id, user.id));

      return null;
    }

    // Successful login - reset failed attempts and update last login
    await db.update(users)
      .set({
        failedLoginAttempts: 0,
        lastFailedLogin: null,
        accountLockedUntil: null,
        lastLogin: new Date(),
        loginCount: (user.loginCount || 0) + 1,
      })
      .where(eq(users.id, user.id));

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // User Management Methods
  async getAllUsers(): Promise<UserWithoutPassword[]> {
    const allUsers = await db.select().from(users);
    return allUsers.map(user => {
      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async getUserById(id: number): Promise<UserWithoutPassword | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) return null;
    
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<UserWithoutPassword> {
    // Remove sensitive fields that shouldn't be updated directly
    const { passwordHash, ...safeUpdates } = updates;
    
    const [updated] = await db.update(users)
      .set({ ...safeUpdates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    const { passwordHash: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  async changePassword(id: number, newPassword: string): Promise<void> {
    const config = await this.getAuthConfig();
    
    if (newPassword.length < (config.passwordMinLength || 8)) {
      throw new Error(`Password must be at least ${config.passwordMinLength || 8} characters long`);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    await db.update(users)
      .set({
        passwordHash,
        mustChangePassword: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async resetUserPassword(id: number, newPassword: string): Promise<boolean> {
    try {
      await this.changePassword(id, newPassword);
      return true;
    } catch (error) {
      console.error('Error resetting user password:', error);
      return false;
    }
  }

  async deleteUser(id: number): Promise<void> {
    await db.update(users)
      .set({ 
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async deactivateUser(id: number): Promise<boolean> {
    try {
      await db.update(users)
        .set({ 
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error('Error deactivating user:', error);
      return false;
    }
  }

  async activateUser(id: number): Promise<boolean> {
    try {
      await db.update(users)
        .set({ 
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error('Error activating user:', error);
      return false;
    }
  }

  // OIDC Support Methods (for future implementation)
  async upsertOidcUser(oidcProfile: any): Promise<UserWithoutPassword> {
    // Check if user exists with OIDC sub
    const [existingUser] = await db.select().from(users)
      .where(eq(users.oidcSub, oidcProfile.sub))
      .limit(1);

    if (existingUser) {
      // Update existing user
      const [updated] = await db.update(users)
        .set({
          email: oidcProfile.email,
          firstName: oidcProfile.given_name || oidcProfile.first_name,
          lastName: oidcProfile.family_name || oidcProfile.last_name,
          lastLogin: new Date(),
          loginCount: (existingUser.loginCount || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning();

      const { passwordHash: _, ...userWithoutPassword } = updated;
      return userWithoutPassword;
    }

    // Create new OIDC user
    const [newUser] = await db.insert(users).values({
      username: oidcProfile.preferred_username || oidcProfile.email || `oidc_${oidcProfile.sub}`,
      email: oidcProfile.email,
      firstName: oidcProfile.given_name || oidcProfile.first_name,
      lastName: oidcProfile.family_name || oidcProfile.last_name,
      authType: 'oidc',
      oidcSub: oidcProfile.sub,
      role: 'viewer', // Default role for OIDC users
      isActive: true,
      emailVerified: true,
      lastLogin: new Date(),
      loginCount: 1,
    }).returning();

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Check if system has any admin users
  async hasAdminUsers(): Promise<boolean> {
    const [adminUser] = await db.select().from(users)
      .where(and(
        eq(users.role, 'admin'),
        eq(users.isActive, true)
      ))
      .limit(1);
    
    return !!adminUser;
  }

  // Create initial admin user
  async createInitialAdmin(userData: CreateUserRequest): Promise<UserWithoutPassword> {
    const hasAdmin = await this.hasAdminUsers();
    if (hasAdmin) {
      throw new Error('Admin user already exists');
    }

    return this.createUser({ ...userData, role: 'admin' });
  }

  // Update user role
  async updateUserRole(id: number, role: 'user' | 'admin'): Promise<boolean> {
    try {
      await db.update(users)
        .set({ 
          role,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }
}

export const authService = AuthService.getInstance();
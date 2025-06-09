import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "../db";
import { eq, and, sql } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@shared/utils/passwordUtils";

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface CreateUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Authentication Service for dual Local/SSO authentication
 */
export class AuthService {
  
  /**
   * Create a new local user account
   */
  async createLocalUser(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: 'user' | 'admin';
    createdBy?: number;
  }): Promise<CreateUserResult> {
    try {
      // Check if username or email already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.authType, 'local'),
            eq(users.username, userData.username)
          )
        )
        .limit(1);

      if (existingUser.length > 0) {
        return { success: false, error: "Username already exists" };
      }

      const existingEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);

      if (existingEmail.length > 0) {
        return { success: false, error: "Email already exists" };
      }

      // Hash the password
      const { hash, salt, iterations } = await hashPassword(userData.password);

      // Create the user
      const [newUser] = await db
        .insert(users)
        .values({
          authType: 'local',
          username: userData.username,
          email: userData.email,
          passwordHash: hash,
          passwordSalt: salt,
          passwordIterations: iterations,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          displayName: userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : userData.username,
          role: userData.role,
          isActive: true,
          isEmailVerified: false,
          createdBy: userData.createdBy || null
        })
        .returning();

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error creating local user:', error);
      return { success: false, error: "Failed to create user account" };
    }
  }

  /**
   * Authenticate local user with username/password
   */
  async authenticateLocal(username: string, password: string): Promise<LoginResult> {
    try {
      // Find user by username
      const [user] = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.authType, 'local'),
            eq(users.username, username),
            eq(users.isActive, true)
          )
        )
        .limit(1);

      if (!user) {
        return { success: false, error: "Invalid username or password" };
      }

      // Check if account is locked
      if (user.accountLockedUntil && new Date() < user.accountLockedUntil) {
        return { success: false, error: "Account is temporarily locked. Try again later." };
      }

      // Verify password
      if (!user.passwordHash) {
        return { success: false, error: "Invalid account configuration" };
      }

      const isPasswordValid = await verifyPassword(password, user.passwordHash);

      if (!isPasswordValid) {
        // Increment failed login attempts
        await this.incrementFailedLoginAttempts(user.id);
        return { success: false, error: "Invalid username or password" };
      }

      // Reset failed login attempts and update last login
      await this.updateLoginSuccess(user.id);

      return { success: true, user };
    } catch (error) {
      console.error('Error authenticating local user:', error);
      return { success: false, error: "Authentication failed" };
    }
  }

  /**
   * Create or update SSO user (for existing SSO integration)
   */
  async upsertSsoUser(ssoData: {
    ssoSubject: string;
    ssoProvider: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        authType: 'sso',
        ssoSubject: ssoData.ssoSubject,
        ssoProvider: ssoData.ssoProvider,
        email: ssoData.email,
        firstName: ssoData.firstName || null,
        lastName: ssoData.lastName || null,
        displayName: ssoData.firstName ? `${ssoData.firstName} ${ssoData.lastName || ''}`.trim() : ssoData.email,
        profileImageUrl: ssoData.profileImageUrl || null,
        role: 'user', // Default role for SSO users
        isActive: true,
        isEmailVerified: true, // Assume SSO emails are verified
      })
      .onConflictDoUpdate({
        target: [users.ssoSubject, users.ssoProvider],
        set: {
          email: ssoData.email,
          firstName: ssoData.firstName || null,
          lastName: ssoData.lastName || null,
          displayName: ssoData.firstName ? `${ssoData.firstName} ${ssoData.lastName || ''}`.trim() : ssoData.email,
          profileImageUrl: ssoData.profileImageUrl || null,
          updatedAt: new Date(),
        },
      })
      .returning();

    await this.updateLoginSuccess(user.id);
    return user;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user || null;
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(users.createdAt);
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: number, role: 'user' | 'admin'): Promise<boolean> {
    try {
      const result = await db
        .update(users)
        .set({ role, updatedAt: new Date() })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }

  /**
   * Deactivate user account (admin only)
   */
  async deactivateUser(userId: number): Promise<boolean> {
    try {
      await db
        .update(users)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error('Error deactivating user:', error);
      return false;
    }
  }

  /**
   * Reset user password (admin only for local users)
   */
  async resetUserPassword(userId: number, newPassword: string): Promise<boolean> {
    try {
      const { hash, salt, iterations } = await hashPassword(newPassword);
      
      await db
        .update(users)
        .set({
          passwordHash: hash,
          passwordSalt: salt,
          passwordIterations: iterations,
          failedLoginAttempts: 0,
          accountLockedUntil: null,
          updatedAt: new Date()
        })
        .where(and(
          eq(users.id, userId),
          eq(users.authType, 'local')
        ));

      return true;
    } catch (error) {
      console.error('Error resetting user password:', error);
      return false;
    }
  }

  /**
   * Private helper: Increment failed login attempts
   */
  private async incrementFailedLoginAttempts(userId: number): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) return;

    const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
    const updateData: any = {
      failedLoginAttempts: newFailedAttempts,
      lastFailedLogin: new Date(),
      updatedAt: new Date()
    };

    // Lock account after 5 failed attempts for 15 minutes
    if (newFailedAttempts >= 5) {
      updateData.accountLockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));
  }

  /**
   * Private helper: Update successful login
   */
  private async updateLoginSuccess(userId: number): Promise<void> {
    await db
      .update(users)
      .set({
        lastLogin: new Date(),
        failedLoginAttempts: 0,
        accountLockedUntil: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }
}

export const authService = new AuthService();
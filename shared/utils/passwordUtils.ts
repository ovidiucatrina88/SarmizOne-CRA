import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Secure password hashing utilities using bcrypt with additional SHA256 preprocessing
 * Implements industry-standard security practices for password storage
 */

const SALT_ROUNDS = 12; // bcrypt cost factor (2^12 iterations)
const PEPPER = process.env.PASSWORD_PEPPER || 'default-pepper-change-in-production';

/**
 * Hash a password using SHA256 preprocessing + bcrypt
 * @param password - Plain text password
 * @returns Promise containing salt and hash
 */
export async function hashPassword(password: string): Promise<{
  hash: string;
  salt: string;
  iterations: number;
}> {
  // Generate a unique salt
  const salt = crypto.randomBytes(32).toString('hex');
  
  // Pre-process with SHA256 + salt + pepper
  const preprocessed = crypto
    .createHash('sha256')
    .update(password + salt + PEPPER)
    .digest('hex');
  
  // Use bcrypt for final hashing (provides built-in salt and iterations)
  const hash = await bcrypt.hash(preprocessed, SALT_ROUNDS);
  
  return {
    hash,
    salt,
    iterations: Math.pow(2, SALT_ROUNDS) // bcrypt iterations
  };
}

/**
 * Verify a password against stored hash
 * @param password - Plain text password to verify
 * @param storedHash - Stored password hash
 * @param storedSalt - Stored salt (optional for bcrypt-only verification)
 * @returns Promise<boolean> - True if password matches
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt?: string
): Promise<boolean> {
  try {
    if (storedSalt) {
      // Use SHA256 + bcrypt method if salt is provided
      const preprocessed = crypto
        .createHash('sha256')
        .update(password + storedSalt + PEPPER)
        .digest('hex');
      
      return await bcrypt.compare(preprocessed, storedHash);
    } else {
      // Direct bcrypt comparison for simple hashed passwords
      return await bcrypt.compare(password, storedHash);
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate a secure random password
 * @param length - Password length (default: 16)
 * @returns Random password string
 */
export function generateSecurePassword(length: number = 16): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Validation result with strength score and requirements
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
  feedback: string[];
} {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };
  
  const metRequirements = Object.values(requirements).filter(Boolean).length;
  const score = metRequirements * 20; // 0-100 scale
  
  const feedback: string[] = [];
  if (!requirements.length) feedback.push('Password must be at least 8 characters long');
  if (!requirements.uppercase) feedback.push('Add at least one uppercase letter');
  if (!requirements.lowercase) feedback.push('Add at least one lowercase letter');
  if (!requirements.numbers) feedback.push('Add at least one number');
  if (!requirements.symbols) feedback.push('Add at least one symbol');
  
  return {
    isValid: metRequirements >= 4, // At least 4 of 5 requirements
    score,
    requirements,
    feedback
  };
}
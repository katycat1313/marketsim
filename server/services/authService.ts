import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { db } from '../db';
import { eq } from "drizzle-orm";
import { users } from '../../user';

/**
 * Authentication service for user registration, login, and session management
 */
export class AuthService {
  /**
   * Register a new user
   * @param email User's email
   * @param password User's password (will be hashed)
   * @param firstName User's first name
   * @param lastName User's last name
   * @param marketingExperience User's marketing experience level
   * @returns The created user object (without password)
   */
  async registerUser(email: string, password: string, firstName: string, lastName: string, marketingExperience: string) {
    try {
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (existingUser.length > 0) {
        throw new Error('User with this email already exists');
      }
      
      // Hash the password using Node.js built-in crypto
      const salt = randomBytes(16).toString('hex');
      const hashedPassword = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
      
      // Determine user level based on marketing experience
      let level = 'Beginner';
      switch(marketingExperience) {
        case 'intermediate':
          level = 'Intermediate';
          break;
        case 'advanced':
          level = 'Advanced';
          break;
        case 'expert':
          level = 'Expert';
          break;
        default:
          level = 'Beginner';
      }
      
      // Create the new user
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase().substring(0, 2)}${Math.floor(Math.random() * 1000)}`;
      
      const result = await db.insert(users).values({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        level,
        createdAt: new Date(),
      }).returning({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        level: users.level,
        createdAt: users.createdAt
      });
      
      return result[0];
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
  
  /**
   * Authenticate a user login
   * @param email User's email
   * @param password User's password (plain text for comparison)
   * @returns The user object if authentication is successful, null otherwise
   */
  async loginUser(email: string, password: string) {
    try {
      // Find the user by email
      const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (userResult.length === 0) {
        return null;
      }
      
      const user = userResult[0];
      
      // Check if the password matches using Node.js crypto
      const [salt, storedHash] = user.password.split(':');
      const hashedBuffer = scryptSync(password, salt, 64);
      
      // Use timing-safe comparison to prevent timing attacks
      const keyBuffer = Buffer.from(storedHash, 'hex');
      const isMatch = timingSafeEqual(hashedBuffer, keyBuffer);
      
      if (!isMatch) {
        return null;
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }
  
  /**
   * Get user by ID
   * @param userId User's ID
   * @returns The user object (without password)
   */
  async getUserById(userId: number) {
    try {
      const result = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        level: users.level,
        xp: users.xp,
        specializations: users.specializations,
        achievements: users.achievements,
        createdAt: users.createdAt
      }).from(users).where(eq(users.id, userId)).limit(1);
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const authService = new AuthService();
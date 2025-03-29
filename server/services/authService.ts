import bcrypt from 'bcryptjs';
import { db } from '../db';
import { eq } from "drizzle-orm";
import { users } from '../../shared/schema';

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
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
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
      const result = await db.insert(users).values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        level,
        createdAt: new Date(),
      }).returning({
        id: users.id,
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
      
      // Check if the password matches
      const isMatch = await bcrypt.compare(password, user.password);
      
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
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        level: users.level,
        xp: users.xp,
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
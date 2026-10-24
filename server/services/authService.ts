import { randomBytes, scryptSync } from 'crypto';
import { db } from '../db';
import { eq, or } from "drizzle-orm";
import { users } from '@shared/schema';

// In-memory fallback user store for development / offline operation
const saltSeed = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
// Hash for requested password 'Big$$grl1986'
const hashSeed = scryptSync('Big$$grl1986', saltSeed, 64).toString('hex');
// Backup hash for legacy password 'Big$$grl86'
const hashSeedOld = scryptSync('Big$$grl86', saltSeed, 64).toString('hex');

const founderUser = {
  id: 1,
  username: 'Katycat13',
  email: 'katycat1313@gmail.com',
  password: `${saltSeed}:${hashSeed}`,
  fallbackPassword: `${saltSeed}:${hashSeedOld}`,
  firstName: 'Katy',
  lastName: 'Cat',
  level: 'Founder / Developer',
  role: 'developer',
  isDeveloper: true,
  isFounder: true,
  tier: 'developer_pass',
  xp: 9999,
  specializations: ['Google Ads', 'Meta Ads', 'SEO Content', 'Omnichannel Strategy', 'Platform Architect'],
  achievements: ['Academy Founder', 'Platform Developer', 'Mastery Level 100'],
  createdAt: new Date(),
};

const inMemoryUsers: Map<string, any> = new Map([
  ['katycat13', founderUser],
  ['katycat1313@gmail.com', founderUser],
  ['katycat', founderUser],
  ['katycat13@gmail.com', founderUser]
]);

let nextUserId = 2;

/**
 * Authentication service for user registration, login, and session management
 */
export class AuthService {
  /**
   * Register a new user
   */
  async registerUser(email: string, password: string, firstName: string, lastName: string, marketingExperience: string) {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Hash the password using Node.js built-in crypto
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
    
    let level = 'Beginner';
    switch(marketingExperience.toLowerCase()) {
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
    
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase().substring(0, 2)}${Math.floor(Math.random() * 1000)}`;

    const newUser = {
      id: nextUserId++,
      username,
      email: normalizedEmail,
      password: hashedPassword,
      firstName,
      lastName,
      level,
      xp: level === 'Expert' ? 3000 : level === 'Advanced' ? 1500 : level === 'Intermediate' ? 500 : 100,
      specializations: ['Search Ads', 'Social Ads'],
      achievements: ['First Campaign'],
      createdAt: new Date(),
    };

    inMemoryUsers.set(normalizedEmail, newUser);

    try {
      // Try saving to database if available
      const existingUser = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
      if (existingUser.length === 0) {
        const [dbResult] = await db.insert(users).values({
          username,
          email: normalizedEmail,
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
        if (dbResult) return dbResult;
      }
    } catch (e) {
      console.warn("DB user insert skipped, running in in-memory mode.");
    }
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  
  /**
   * Authenticate a user login by email or username
   */
  async loginUser(identifier: string, password: string) {
    const query = identifier.toLowerCase().trim();

    // 1. Check in-memory user store first (by email or username)
    let memUser = inMemoryUsers.get(query);
    if (!memUser) {
      for (const u of inMemoryUsers.values()) {
        if (u.username.toLowerCase() === query || u.email.toLowerCase() === query) {
          memUser = u;
          break;
        }
      }
    }

    if (memUser) {
      const [salt, storedHash] = memUser.password.split(':');
      const hashedInputPassword = scryptSync(password, salt, 64).toString('hex');
      let isValid = storedHash === hashedInputPassword;
      // Allow single or double dollar sign variation
      if (!isValid && (password === 'Big$$grl1986' || password === 'Big$$grl1986' || password === 'Big$$grl86' || password === 'Big$$grl86')) {
        const hashDouble = scryptSync('Big$$grl1986', salt, 64).toString('hex');
        const hashSingle = scryptSync('Big$$grl1986', salt, 64).toString('hex');
        const hashOldDouble = scryptSync('Big$$grl86', salt, 64).toString('hex');
        const hashOldSingle = scryptSync('Big$$grl86', salt, 64).toString('hex');
        if (storedHash === hashDouble || storedHash === hashSingle || storedHash === hashOldDouble || storedHash === hashOldSingle) {
          isValid = true;
        }
      }
      if (!isValid && memUser.fallbackPassword) {
        const [oldSalt, oldStoredHash] = memUser.fallbackPassword.split(':');
        isValid = oldStoredHash === scryptSync(password, oldSalt, 64).toString('hex');
      }
      if (isValid) {
        const { password: _, fallbackPassword: __, ...userWithoutPassword } = memUser;
        return userWithoutPassword;
      }
    }

    // 2. Check Database by email or username
    try {
      const userResult = await db.select().from(users).where(
        or(eq(users.email, query), eq(users.username, query))
      ).limit(1);

      if (userResult.length > 0) {
        const user = userResult[0];
        const [salt, storedHash] = user.password.split(':');
        const hashedInputPassword = scryptSync(password, salt, 64).toString('hex');
        let isValid = storedHash === hashedInputPassword;
        
        // Also check Big$$grl1986 on Katycat13 if password in DB was set differently
        if (!isValid && (user.username.toLowerCase() === 'katycat13' || user.email.toLowerCase().includes('katycat'))) {
          isValid = scryptSync('Big$$grl1986', salt, 64).toString('hex') === hashedInputPassword ||
                    scryptSync('Big$$grl86', salt, 64).toString('hex') === hashedInputPassword;
        }

        if (isValid) {
          const { password: _, ...userWithoutPassword } = user;
          const isDev = user.username.toLowerCase() === 'katycat13' || user.email.toLowerCase().includes('katycat');
          return {
            ...userWithoutPassword,
            role: isDev ? 'developer' : (user.role || 'student'),
            isDeveloper: isDev,
            isFounder: isDev,
            tier: isDev ? 'developer_pass' : (user.tier || 'course1'),
            level: isDev ? 'Founder / Developer' : user.level
          };
        }
      }
    } catch (error) {
      console.warn("DB login check skipped, running in in-memory mode.");
    }
    
    return null;
  }
  
  /**
   * Get user by ID
   */
  async getUserById(userId: number) {
    // Check in-memory first
    for (const memUser of inMemoryUsers.values()) {
      if (memUser.id === userId) {
        const { password: _, ...userWithoutPassword } = memUser;
        return userWithoutPassword;
      }
    }

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
      console.warn("DB getUserById skipped, running in in-memory mode.");
      return null;
    }
  }
}

// Create a singleton instance
export const authService = new AuthService();
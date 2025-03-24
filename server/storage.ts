import { db } from "./db";
import { 
  type Persona, type Campaign, type SimulationData, 
  type UserProfile, type Connection, type Post, type Comment, type Achievement,
  type UserQuizResult, type InsertPersona, type InsertCampaign, type InsertSimulationData,
  type AdPlatformSimulation, type AdPlatformSimulationAttempt,
  personas, campaigns, simulationData, userProfiles, connections, posts, comments, achievements,
  userQuizResults, adPlatformSimulations, adPlatformSimulationAttempts,
  insertUserProfileSchema, insertConnectionSchema, insertPostSchema, insertCommentSchema, 
  insertAchievementSchema, insertUserQuizResultSchema, insertAdPlatformSimulationAttemptSchema
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

// Type aliases for insert types
type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
type InsertConnection = z.infer<typeof insertConnectionSchema>;
type InsertPost = z.infer<typeof insertPostSchema>;
type InsertComment = z.infer<typeof insertCommentSchema>;
type InsertAchievement = z.infer<typeof insertAchievementSchema>;
type InsertUserQuizResult = z.infer<typeof insertUserQuizResultSchema>;

export interface IStorage {
  // Persona operations
  createPersona(persona: InsertPersona): Promise<Persona>;
  getPersona(id: number): Promise<Persona | undefined>;
  listPersonas(): Promise<Persona[]>;

  // Campaign operations
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  listCampaigns(): Promise<Campaign[]>;

  // Simulation operations
  addSimulationData(data: InsertSimulationData): Promise<SimulationData>;
  getSimulationData(campaignId: number): Promise<SimulationData[]>;
  
  // User operations
  getUserSubscription(userId?: number): Promise<any[]>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  
  // Connection operations
  createConnection(connection: InsertConnection): Promise<Connection>;
  getConnectionsByUserId(userId: number): Promise<Connection[]>;
  updateConnectionStatus(id: number, status: string): Promise<Connection | undefined>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPostById(id: number): Promise<Post | undefined>;
  listPosts(): Promise<Post[]>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByPostId(postId: number): Promise<Comment[]>;
  
  // Achievement operations
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAchievementById(id: number): Promise<Achievement | undefined>;
  listAchievements(): Promise<Achievement[]>;
  
  // Quiz operations
  createQuizResult(quizResult: InsertUserQuizResult): Promise<UserQuizResult>;
  getUserQuizResults(userId: number, quizId?: string): Promise<UserQuizResult[]>;
  getQuizCompletion(userId: number): Promise<{completedQuizzes: number, totalQuizzes: number}>;
  
  // Ad Platform Simulation operations
  listAdPlatformSimulations(): Promise<AdPlatformSimulation[]>;
  getAdPlatformSimulation(id: number): Promise<AdPlatformSimulation | undefined>;
  createAdPlatformSimulationAttempt(attempt: any): Promise<AdPlatformSimulationAttempt>;
  getAdPlatformSimulationAttempts(userId: number, simulationId: number): Promise<AdPlatformSimulationAttempt[]>;
}

export class DrizzleStorage implements IStorage {
  async createPersona(persona: InsertPersona): Promise<Persona> {
    const [result] = await db.insert(personas).values(persona).returning();
    return result;
  }

  async getPersona(id: number): Promise<Persona | undefined> {
    const [result] = await db.select().from(personas).where(eq(personas.id, id));
    return result;
  }

  async listPersonas(): Promise<Persona[]> {
    return await db.select().from(personas);
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    // Create a campaign object that only includes properties defined in the schema
    // Using array syntax to fix TypeScript type error with Drizzle ORM
    const campaignData = {
      name: campaign.name,
      platform: campaign.platform,
      type: campaign.type,
      goal: campaign.goal,
      dailyBudget: campaign.dailyBudget,
      targetCpa: campaign.targetCpa,
      keywords: campaign.keywords || [],
      negativeKeywords: campaign.negativeKeywords || [],
      targeting: {
        locations: campaign.targeting?.locations || [],
        languages: campaign.targeting?.languages || [],
        devices: campaign.targeting?.devices || [],
        demographics: {
          ageRanges: campaign.targeting?.demographics?.ageRanges || [],
          genders: campaign.targeting?.demographics?.genders || [],
          householdIncomes: campaign.targeting?.demographics?.householdIncomes || []
        }
      },
      adHeadlines: campaign.adHeadlines || [],
      adDescriptions: campaign.adDescriptions || [],
      finalUrl: campaign.finalUrl,
      personaId: campaign.personaId,
      createdAt: new Date(),
      status: 'active'
    };
    
    const [result] = await db.insert(campaigns).values(campaignData).returning();
    return result;
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [result] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return result;
  }

  async listCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns);
  }

  async addSimulationData(data: InsertSimulationData): Promise<SimulationData> {
    const [result] = await db.insert(simulationData).values(data).returning();
    return result;
  }

  async getSimulationData(campaignId: number): Promise<SimulationData[]> {
    return await db.select()
      .from(simulationData)
      .where(eq(simulationData.campaignId, campaignId))
      .orderBy(simulationData.date);
  }
  
  async getUserSubscription(userId?: number): Promise<any[]> {
    if (!userId) {
      return [{ subscription: { tier: 'free' } }];
    }
    
    try {
      const user = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      if (user.length === 0) {
        return [{ subscription: { tier: 'free' } }];
      }
      return [{ 
        ...user[0],
        subscription: { tier: 'free' } // Default to free tier for now
      }];
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return [{ subscription: { tier: 'free' } }];
    }
  }
  
  // User Profile operations
  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    // Explicitly construct the data object to match expected schema
    const profileData = {
      userId: profile.userId,
      username: profile.username,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      level: profile.level || 'Newborn',
      experiencePoints: profile.experiencePoints || 0,
      achievements: profile.achievements || [],
      badges: profile.badges || [],
      specializations: profile.specializations || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const [result] = await db.insert(userProfiles).values(profileData).returning();
    return result;
  }
  
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const [result] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return result;
  }
  
  // Connection operations
  async createConnection(connection: InsertConnection): Promise<Connection> {
    // Explicitly construct the connection object
    const connectionData = {
      userId: connection.userId,
      connectedUserId: connection.connectedUserId,
      status: connection.status,
      createdAt: new Date()
    };
    
    const [result] = await db.insert(connections).values(connectionData).returning();
    return result;
  }
  
  async getConnectionsByUserId(userId: number): Promise<Connection[]> {
    return await db.select()
      .from(connections)
      .where(eq(connections.userId, userId));
  }
  
  async updateConnectionStatus(id: number, status: string): Promise<Connection | undefined> {
    const [result] = await db.update(connections)
      .set({ status })
      .where(eq(connections.id, id))
      .returning();
    return result;
  }
  
  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    // Explicitly construct the post object to match expected schema
    const postData = {
      userId: post.userId,
      title: post.title,
      content: post.content,
      type: post.type,
      tags: post.tags || [],
      likes: post.likes || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const [result] = await db.insert(posts).values(postData).returning();
    return result;
  }
  
  async getPostById(id: number): Promise<Post | undefined> {
    const [result] = await db.select().from(posts).where(eq(posts.id, id));
    return result;
  }
  
  async listPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }
  
  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment> {
    // Explicitly construct the comment object
    const commentData = {
      postId: comment.postId,
      userId: comment.userId,
      content: comment.content,
      likes: comment.likes || 0,
      createdAt: new Date()
    };
    
    const [result] = await db.insert(comments).values(commentData).returning();
    return result;
  }
  
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return await db.select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);
  }
  
  // Achievement operations
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    // Explicitly construct the achievement object
    const achievementData = {
      name: achievement.name,
      description: achievement.description,
      type: achievement.type,
      requirements: achievement.requirements,
      icon: achievement.icon,
      experiencePoints: achievement.experiencePoints
    };
    
    const [result] = await db.insert(achievements).values(achievementData).returning();
    return result;
  }
  
  async getAchievementById(id: number): Promise<Achievement | undefined> {
    const [result] = await db.select().from(achievements).where(eq(achievements.id, id));
    return result;
  }
  
  async listAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }
  
  // Quiz operations
  async createQuizResult(quizResult: InsertUserQuizResult): Promise<UserQuizResult> {
    const [result] = await db.insert(userQuizResults).values(quizResult).returning();
    return result;
  }
  
  async getUserQuizResults(userId: number, quizId?: string): Promise<UserQuizResult[]> {
    let query = db.select()
      .from(userQuizResults)
      .where(eq(userQuizResults.userId, userId));
      
    if (quizId) {
      query = query.where(eq(userQuizResults.quizId, quizId));
    }
    
    return await query.orderBy(desc(userQuizResults.lastAttemptAt));
  }
  
  async getQuizCompletion(userId: number): Promise<{completedQuizzes: number, totalQuizzes: number}> {
    // Get completed quizzes by this user
    const completedQuizResults = await db.select()
      .from(userQuizResults)
      .where(eq(userQuizResults.userId, userId))
      .where(eq(userQuizResults.passed, true));
    
    // For now, use a fixed number for total quizzes
    // This would be replaced with an actual count from all available quizzes
    const totalQuizzes = 5; // Adjust based on your actual quiz content
    
    return {
      completedQuizzes: completedQuizResults.length,
      totalQuizzes
    };
  }
}

// Export a singleton instance
export const storage = new DrizzleStorage();
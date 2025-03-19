import { db } from "./db";
import { 
  type Persona, type Campaign, type SimulationData,
  type InsertPersona, type InsertCampaign, type InsertSimulationData,
  type Connection, type UserProfile, type Post, type Comment, type Achievement,
  personas, campaigns, simulationData, userProfiles, connections, posts, comments, achievements
} from "@shared/schema";
import { insertConnectionSchema, insertUserProfileSchema, insertPostSchema, insertCommentSchema, insertAchievementSchema } from "@shared/schema";
import { eq } from "drizzle-orm";

// Type aliases
type InsertUserProfile = typeof insertUserProfileSchema._type;
type InsertConnection = typeof insertConnectionSchema._type;
type InsertPost = typeof insertPostSchema._type;
type InsertComment = typeof insertCommentSchema._type;
type InsertAchievement = typeof insertAchievementSchema._type;

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
    const [result] = await db.insert(campaigns).values(campaign).returning();
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
    const [result] = await db.insert(userProfiles).values(profile).returning();
    return result;
  }
  
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const [result] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return result;
  }
  
  // Connection operations
  async createConnection(connection: InsertConnection): Promise<Connection> {
    const [result] = await db.insert(connections).values(connection).returning();
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
    const [result] = await db.insert(posts).values(post).returning();
    return result;
  }
  
  async getPostById(id: number): Promise<Post | undefined> {
    const [result] = await db.select().from(posts).where(eq(posts.id, id));
    return result;
  }
  
  async listPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(posts.createdAt, "desc");
  }
  
  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment> {
    const [result] = await db.insert(comments).values(comment).returning();
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
    const [result] = await db.insert(achievements).values(achievement).returning();
    return result;
  }
  
  async getAchievementById(id: number): Promise<Achievement | undefined> {
    const [result] = await db.select().from(achievements).where(eq(achievements.id, id));
    return result;
  }
  
  async listAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }
}

// Export a singleton instance
export const storage = new DrizzleStorage();
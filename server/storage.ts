import { db } from "./db";
import { 
  type Persona, type Campaign, type SimulationData,
  type InsertPersona, type InsertCampaign, type InsertSimulationData,
  type Connection, type InsertConnection,
  type Post, type InsertPost,
  type Comment, type InsertComment,
  type Achievement, type InsertAchievement,
  type UserProfile, type InsertUserProfile,
  personas, campaigns, simulationData, userProfiles, connections, posts, comments, achievements
} from "@shared/schema";
import { eq } from "drizzle-orm";

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
    const [result] = await db.insert(campaigns).values([campaign]).returning();
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
    const [result] = await db.insert(simulationData).values([data]).returning();
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
}

// Export a singleton instance
export const storage = new DrizzleStorage();
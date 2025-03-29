import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "./db";
import * as schema from "../shared/schema";
import {
  userProfiles,
  insertUserProfileSchema,
  connections,
  insertConnectionSchema,
  posts,
  insertPostSchema,
  comments,
  insertCommentSchema,
  achievements,
  insertAchievementSchema,
  userQuizResults,
  insertUserQuizResultSchema,
  userApiSettings,
  insertApiSettingsSchema,
  personas,
  campaigns,
  simulationData,
  insertPersonaSchema,
  insertCampaignSchema,
  insertSimulationDataSchema,
  adPlatformSimulations,
  adPlatformSimulationAttempts,
  insertAdPlatformSimulationAttemptSchema,
  dataVisualizationChallenges,
  dataVisualizationAttempts,
  insertDataVisualizationAttemptSchema,
  keywordResearchProjects,
  keywordResults,
  keywordLists,
  insertKeywordResearchProjectSchema,
  insertKeywordResultSchema,
  insertKeywordListSchema
} from "../shared/schema";

type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
type InsertConnection = z.infer<typeof insertConnectionSchema>;
type InsertPost = z.infer<typeof insertPostSchema>;
type InsertComment = z.infer<typeof insertCommentSchema>;
type InsertAchievement = z.infer<typeof insertAchievementSchema>;
type InsertUserQuizResult = z.infer<typeof insertUserQuizResultSchema>;

export interface IStorage {
  // Persona operations
  createPersona(persona: schema.InsertPersona): Promise<schema.Persona>;
  getPersona(id: number): Promise<schema.Persona | undefined>;
  listPersonas(): Promise<schema.Persona[]>;

  // Campaign operations
  createCampaign(campaign: schema.InsertCampaign): Promise<schema.Campaign>;
  getCampaign(id: number): Promise<schema.Campaign | undefined>;
  listCampaigns(): Promise<schema.Campaign[]>;

  // Simulation operations
  addSimulationData(data: schema.InsertSimulationData): Promise<schema.SimulationData>;
  getSimulationData(campaignId: number): Promise<schema.SimulationData[]>;
  
  // User operations
  getUserSubscription(userId?: number): Promise<any[]>;
  createUserProfile(profile: InsertUserProfile): Promise<schema.UserProfile>;
  getUserProfile(userId: number): Promise<schema.UserProfile | undefined>;
  
  // API Settings operations
  createUserApiSettings(settings: schema.InsertApiSettings): Promise<schema.UserApiSettings>;
  getUserApiSettings(username: string): Promise<schema.UserApiSettings | undefined>;
  updateUserApiSettings(username: string, provider: string, apiKey: string): Promise<schema.UserApiSettings>;
  
  // Connection operations
  createConnection(connection: InsertConnection): Promise<schema.Connection>;
  getConnectionsByUserId(userId: number): Promise<schema.Connection[]>;
  updateConnectionStatus(id: number, status: string): Promise<schema.Connection | undefined>;
  
  // Post operations
  createPost(post: InsertPost): Promise<schema.Post>;
  getPostById(id: number): Promise<schema.Post | undefined>;
  listPosts(): Promise<schema.Post[]>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<schema.Comment>;
  getCommentsByPostId(postId: number): Promise<schema.Comment[]>;
  
  // Achievement operations
  createAchievement(achievement: InsertAchievement): Promise<schema.Achievement>;
  getAchievementById(id: number): Promise<schema.Achievement | undefined>;
  listAchievements(): Promise<schema.Achievement[]>;
  
  // Quiz operations
  createQuizResult(quizResult: InsertUserQuizResult): Promise<schema.UserQuizResult>;
  getUserQuizResults(userId: number, quizId?: string): Promise<schema.UserQuizResult[]>;
  getQuizCompletion(userId: number): Promise<{completedQuizzes: number, totalQuizzes: number}>;
  
  // Ad Platform Simulation operations
  listAdPlatformSimulations(): Promise<schema.AdPlatformSimulation[]>;
  getAdPlatformSimulation(id: number): Promise<schema.AdPlatformSimulation | undefined>;
  createAdPlatformSimulationAttempt(attempt: schema.InsertAdPlatformSimulationAttempt): Promise<schema.AdPlatformSimulationAttempt>;
  getAdPlatformSimulationAttempts(userId: number, simulationId: number): Promise<schema.AdPlatformSimulationAttempt[]>;
  
  // Data Visualization operations
  listDataVisualizationChallenges(): Promise<schema.DataVisualizationChallenge[]>;
  getDataVisualizationChallenge(id: number): Promise<schema.DataVisualizationChallenge | undefined>;
  createDataVisualizationAttempt(attempt: schema.InsertDataVisualizationAttempt): Promise<schema.DataVisualizationAttempt>;
  getDataVisualizationAttempts(userId: number, challengeId: number): Promise<schema.DataVisualizationAttempt[]>;
}

export class DrizzleStorage implements IStorage {
  async createPersona(persona: schema.InsertPersona): Promise<schema.Persona> {
    const result = await db.insert(personas).values(persona).returning();
    return result[0];
  }

  async getPersona(id: number): Promise<schema.Persona | undefined> {
    const result = await db.select().from(personas).where(eq(personas.id, id));
    return result[0];
  }

  async listPersonas(): Promise<schema.Persona[]> {
    return await db.select().from(personas);
  }

  async createCampaign(campaign: schema.InsertCampaign): Promise<schema.Campaign> {
    // Ensure the campaign object is properly formatted for the database
    const campaignToInsert = {
      ...campaign,
      // Convert any complex objects to JSON strings if needed
      keywords: Array.isArray(campaign.keywords) ? campaign.keywords : [],
      targeting: campaign.targeting || {},
      headlines: Array.isArray(campaign.headlines) ? campaign.headlines : [],
      descriptions: Array.isArray(campaign.descriptions) ? campaign.descriptions : []
    };
    
    const result = await db.insert(campaigns).values(campaignToInsert).returning();
    return result[0];
  }

  async getCampaign(id: number): Promise<schema.Campaign | undefined> {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return result[0];
  }

  async listCampaigns(): Promise<schema.Campaign[]> {
    return await db.select().from(campaigns);
  }

  async addSimulationData(data: schema.InsertSimulationData): Promise<schema.SimulationData> {
    const result = await db.insert(simulationData).values(data).returning();
    return result[0];
  }

  async getSimulationData(campaignId: number): Promise<schema.SimulationData[]> {
    return await db.select().from(simulationData).where(eq(simulationData.campaignId, campaignId));
  }

  async getUserSubscription(userId?: number): Promise<any[]> {
    // This is a placeholder - actual implementation would depend on your subscription model
    return [];
  }

  async createUserProfile(profile: InsertUserProfile): Promise<schema.UserProfile> {
    const result = await db.insert(userProfiles).values(profile).returning();
    return result[0];
  }

  async getUserProfile(userId: number): Promise<schema.UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return result[0];
  }
  
  // API Settings operations
  async createUserApiSettings(settings: schema.InsertApiSettings): Promise<schema.UserApiSettings> {
    const result = await db.insert(userApiSettings).values(settings).returning();
    return result[0];
  }
  
  async getUserApiSettings(username: string): Promise<schema.UserApiSettings | undefined> {
    const result = await db.select().from(userApiSettings).where(eq(userApiSettings.username, username));
    return result[0];
  }
  
  async updateUserApiSettings(username: string, provider: string, apiKey: string): Promise<schema.UserApiSettings> {
    // Define the update fields
    let updateFields: any = {
      activeProvider: provider
    };
    
    // Update the appropriate API key field based on the selected provider
    if (provider === 'anthropic') {
      updateFields.anthropicApiKey = apiKey;
    } else if (provider === 'openai') {
      updateFields.openaiApiKey = apiKey;
    } else if (provider === 'gemini') {
      updateFields.geminiApiKey = apiKey;
    }
    
    // Update the timestamp
    updateFields.updatedAt = new Date();
    
    // Perform the update
    const result = await db.update(userApiSettings)
      .set(updateFields)
      .where(eq(userApiSettings.username, username))
      .returning();
    
    return result[0];
  }

  async createConnection(connection: InsertConnection): Promise<schema.Connection> {
    const result = await db.insert(connections).values(connection).returning();
    return result[0];
  }

  async getConnectionsByUserId(userId: number): Promise<schema.Connection[]> {
    return await db.select().from(connections).where(eq(connections.userId, userId));
  }

  async updateConnectionStatus(id: number, status: string): Promise<schema.Connection | undefined> {
    const result = await db.update(connections)
      .set({ status })
      .where(eq(connections.id, id))
      .returning();
    return result[0];
  }

  async createPost(post: InsertPost): Promise<schema.Post> {
    const result = await db.insert(posts).values(post).returning();
    return result[0];
  }

  async getPostById(id: number): Promise<schema.Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0];
  }

  async listPosts(): Promise<schema.Post[]> {
    return await db.select().from(posts);
  }

  async createComment(comment: InsertComment): Promise<schema.Comment> {
    const result = await db.insert(comments).values(comment).returning();
    return result[0];
  }

  async getCommentsByPostId(postId: number): Promise<schema.Comment[]> {
    return await db.select().from(comments).where(eq(comments.postId, postId));
  }

  async createAchievement(achievement: InsertAchievement): Promise<schema.Achievement> {
    const result = await db.insert(achievements).values(achievement).returning();
    return result[0];
  }

  async getAchievementById(id: number): Promise<schema.Achievement | undefined> {
    const result = await db.select().from(achievements).where(eq(achievements.id, id));
    return result[0];
  }

  async listAchievements(): Promise<schema.Achievement[]> {
    return await db.select().from(achievements);
  }

  async createQuizResult(quizResult: InsertUserQuizResult): Promise<schema.UserQuizResult> {
    const result = await db.insert(userQuizResults).values(quizResult).returning();
    return result[0];
  }

  async getUserQuizResults(userId: number, quizId?: string): Promise<schema.UserQuizResult[]> {
    let query = db.select().from(userQuizResults).where(eq(userQuizResults.userId, userId));
    
    if (quizId) {
      query = query.where(eq(userQuizResults.quizId, quizId));
    }
    
    return await query;
  }

  async getQuizCompletion(userId: number): Promise<{completedQuizzes: number, totalQuizzes: number}> {
    // This is a placeholder - actual implementation would depend on your quiz tracking system
    const completedQuizzes = await db.select().from(userQuizResults).where(eq(userQuizResults.userId, userId));
    return {
      completedQuizzes: completedQuizzes.length,
      totalQuizzes: 10 // Example total quizzes available in the system
    };
  }

  async listAdPlatformSimulations(): Promise<schema.AdPlatformSimulation[]> {
    return await db.select().from(adPlatformSimulations);
  }

  async getAdPlatformSimulation(id: number): Promise<schema.AdPlatformSimulation | undefined> {
    const result = await db.select().from(adPlatformSimulations).where(eq(adPlatformSimulations.id, id));
    return result[0];
  }

  async createAdPlatformSimulationAttempt(attempt: schema.InsertAdPlatformSimulationAttempt): Promise<schema.AdPlatformSimulationAttempt> {
    const result = await db.insert(adPlatformSimulationAttempts).values(attempt).returning();
    return result[0];
  }

  async getAdPlatformSimulationAttempts(userId: number, simulationId: number): Promise<schema.AdPlatformSimulationAttempt[]> {
    return await db.select()
      .from(adPlatformSimulationAttempts)
      .where(eq(adPlatformSimulationAttempts.userId, userId))
      .where(eq(adPlatformSimulationAttempts.simulationId, simulationId));
  }
  
  // Data Visualization Challenge Operations
  async listDataVisualizationChallenges(): Promise<schema.DataVisualizationChallenge[]> {
    return await db.select().from(dataVisualizationChallenges);
  }

  async getDataVisualizationChallenge(id: number): Promise<schema.DataVisualizationChallenge | undefined> {
    const result = await db.select().from(dataVisualizationChallenges).where(eq(dataVisualizationChallenges.id, id));
    return result[0];
  }

  async createDataVisualizationAttempt(attempt: schema.InsertDataVisualizationAttempt): Promise<schema.DataVisualizationAttempt> {
    const result = await db.insert(dataVisualizationAttempts).values(attempt).returning();
    return result[0];
  }

  async getDataVisualizationAttempts(userId: number, challengeId: number): Promise<schema.DataVisualizationAttempt[]> {
    return await db.select()
      .from(dataVisualizationAttempts)
      .where(eq(dataVisualizationAttempts.userId, userId))
      .where(eq(dataVisualizationAttempts.challengeId, challengeId));
  }
}

export const storage = new DrizzleStorage();
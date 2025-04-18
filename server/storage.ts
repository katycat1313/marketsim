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
  microFeedback,
  insertMicroFeedbackSchema,
  insertDataVisualizationAttemptSchema,
  keywordResearchProjects,
  keywordResults,
  keywordLists,
  insertKeywordResearchProjectSchema,
  insertKeywordResultSchema,
  insertKeywordListSchema,
  // Campaign Simulation Engine imports
  campaignPerformanceMetrics,
  insertCampaignPerformanceMetricsSchema,
  keywordPerformance,
  insertKeywordPerformanceSchema,
  adCreatives,
  insertAdCreativesSchema,
  adCreativePerformance,
  insertAdCreativePerformanceSchema,
  abTests,
  insertAbTestsSchema,
  abTestVariants,
  insertAbTestVariantsSchema,
  marketConditions,
  insertMarketConditionsSchema,
  audienceInsights,
  insertAudienceInsightsSchema,
  simulationParameters,
  insertSimulationParametersSchema,
  simulationRuns,
  insertSimulationRunsSchema,
  funnelAnalytics,
  insertFunnelAnalyticsSchema
} from "../shared/schema";

type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
type InsertConnection = z.infer<typeof insertConnectionSchema>;
type InsertPost = z.infer<typeof insertPostSchema>;
type InsertComment = z.infer<typeof insertCommentSchema>;
type InsertAchievement = z.infer<typeof insertAchievementSchema>;
type InsertUserQuizResult = z.infer<typeof insertUserQuizResultSchema>;

export interface IStorage {
  // A/B Testing operations
  createABTest(test: schema.InsertABTest): Promise<number>;
  getABTest(testId: number): Promise<schema.ABTest | null>;
  getABTests(userId?: number, campaignId?: number): Promise<schema.ABTest[]>;
  updateABTest(testId: number, updates: Partial<schema.ABTest>): Promise<void>;
  deleteABTest(testId: number): Promise<void>;
  
  createABTestVariant(variant: schema.InsertABTestVariant): Promise<number>;
  getABTestVariant(variantId: number): Promise<schema.ABTestVariant | null>;
  getABTestVariants(testId: number): Promise<schema.ABTestVariant[]>;
  updateABTestVariant(variantId: number, updates: Partial<schema.ABTestVariant>): Promise<void>;
  deleteABTestVariant(variantId: number): Promise<void>;
  
  saveSimulationResult(testId: number, result: any): Promise<void>;
  getSimulationResult(testId: number): Promise<any | null>;
  
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
  
  // Keyword Research operations
  createKeywordResearchProject(project: schema.InsertKeywordResearchProject): Promise<schema.KeywordResearchProject>;
  getKeywordResearchProject(id: number): Promise<schema.KeywordResearchProject | undefined>;
  listKeywordResearchProjects(userId: number): Promise<schema.KeywordResearchProject[]>;
  addKeywordResult(keywordResult: schema.InsertKeywordResult): Promise<schema.KeywordResult>;
  getKeywordResults(projectId: number): Promise<schema.KeywordResult[]>;
  createKeywordList(list: schema.InsertKeywordList): Promise<schema.KeywordList>;
  getKeywordLists(projectId: number): Promise<schema.KeywordList[]>;
  getKeywordListById(id: number): Promise<schema.KeywordList | undefined>;
  
  // Micro-Feedback operations
  createMicroFeedback(feedback: schema.InsertMicroFeedback): Promise<schema.MicroFeedback>;
  getMicroFeedbackByContentId(contentType: string, contentId: number): Promise<schema.MicroFeedback[]>;
  getMicroFeedbackByUserId(userId: number): Promise<schema.MicroFeedback[]>;
  getMicroFeedbackStats(contentType: string, contentId?: number): Promise<{ positive: number, neutral: number, negative: number, total: number }>;
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
      adHeadlines: Array.isArray(campaign.adHeadlines) ? campaign.adHeadlines : [],
      adDescriptions: Array.isArray(campaign.adDescriptions) ? campaign.adDescriptions : []
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

  // Keyword Research operations
  async createKeywordResearchProject(project: schema.InsertKeywordResearchProject): Promise<schema.KeywordResearchProject> {
    const result = await db.insert(keywordResearchProjects).values(project).returning();
    return result[0];
  }

  async getKeywordResearchProject(id: number): Promise<schema.KeywordResearchProject | undefined> {
    const result = await db.select().from(keywordResearchProjects).where(eq(keywordResearchProjects.id, id));
    return result[0];
  }

  async listKeywordResearchProjects(userId: number): Promise<schema.KeywordResearchProject[]> {
    return await db.select().from(keywordResearchProjects).where(eq(keywordResearchProjects.userId, userId));
  }

  async addKeywordResult(keywordResult: schema.InsertKeywordResult): Promise<schema.KeywordResult> {
    const result = await db.insert(keywordResults).values(keywordResult).returning();
    return result[0];
  }

  async getKeywordResults(projectId: number): Promise<schema.KeywordResult[]> {
    return await db.select().from(keywordResults).where(eq(keywordResults.projectId, projectId));
  }

  async createKeywordList(list: schema.InsertKeywordList): Promise<schema.KeywordList> {
    const result = await db.insert(keywordLists).values(list).returning();
    return result[0];
  }

  async getKeywordLists(projectId: number): Promise<schema.KeywordList[]> {
    return await db.select().from(keywordLists).where(eq(keywordLists.projectId, projectId));
  }

  async getKeywordListById(id: number): Promise<schema.KeywordList | undefined> {
    const result = await db.select().from(keywordLists).where(eq(keywordLists.id, id));
    return result[0];
  }

  // A/B Testing Operations
  async createABTest(test: schema.InsertABTest): Promise<number> {
    const result = await db.insert(abTests).values(test).returning();
    return result[0].id;
  }

  async getABTest(testId: number): Promise<schema.ABTest | null> {
    const result = await db.select().from(abTests).where(eq(abTests.id, testId));
    return result[0] || null;
  }

  async getABTests(userId?: number, campaignId?: number): Promise<schema.ABTest[]> {
    let query = db.select().from(abTests);
    
    if (campaignId) {
      query = query.where(eq(abTests.campaignId, campaignId));
    }
    
    // Note: This assumes that tests have a userId field or similar
    // If not present in your schema, remove this condition
    /* 
    if (userId) {
      query = query.where(eq(abTests.userId, userId));
    }
    */
    
    return await query;
  }

  async updateABTest(testId: number, updates: Partial<schema.ABTest>): Promise<void> {
    await db.update(abTests)
      .set(updates)
      .where(eq(abTests.id, testId));
  }

  async deleteABTest(testId: number): Promise<void> {
    await db.delete(abTests).where(eq(abTests.id, testId));
  }

  async createABTestVariant(variant: schema.InsertABTestVariant): Promise<number> {
    const result = await db.insert(abTestVariants).values(variant).returning();
    return result[0].id;
  }

  async getABTestVariant(variantId: number): Promise<schema.ABTestVariant | null> {
    const result = await db.select().from(abTestVariants).where(eq(abTestVariants.id, variantId));
    return result[0] || null;
  }

  async getABTestVariants(testId: number): Promise<schema.ABTestVariant[]> {
    return await db.select().from(abTestVariants).where(eq(abTestVariants.abTestId, testId));
  }

  async updateABTestVariant(variantId: number, updates: Partial<schema.ABTestVariant>): Promise<void> {
    await db.update(abTestVariants)
      .set(updates)
      .where(eq(abTestVariants.id, variantId));
  }

  async deleteABTestVariant(variantId: number): Promise<void> {
    await db.delete(abTestVariants).where(eq(abTestVariants.id, variantId));
  }

  // Simulation Results (stored in-memory for now, would be stored in a real database)
  private simulationResults = new Map<number, any>();

  async saveSimulationResult(testId: number, result: any): Promise<void> {
    this.simulationResults.set(testId, result);
  }

  async getSimulationResult(testId: number): Promise<any | null> {
    return this.simulationResults.get(testId) || null;
  }
  
  // Micro-Feedback operations
  async createMicroFeedback(feedback: schema.InsertMicroFeedback): Promise<schema.MicroFeedback> {
    const result = await db.insert(microFeedback).values(feedback).returning();
    return result[0];
  }
  
  async getMicroFeedbackByContentId(contentType: string, contentId: number): Promise<schema.MicroFeedback[]> {
    return await db.select()
      .from(microFeedback)
      .where(
        eq(microFeedback.contentType, contentType) && 
        eq(microFeedback.contentId, contentId)
      );
  }
  
  async getMicroFeedbackByUserId(userId: number): Promise<schema.MicroFeedback[]> {
    return await db.select()
      .from(microFeedback)
      .where(eq(microFeedback.userId, userId));
  }
  
  async getMicroFeedbackStats(contentType: string, contentId?: number): Promise<{ positive: number, neutral: number, negative: number, total: number }> {
    // Create base query condition
    let condition = eq(microFeedback.contentType, contentType);
    
    // Add content ID condition if provided
    if (contentId) {
      condition = condition && eq(microFeedback.contentId, contentId);
    }
    
    // Execute query with conditions
    const results = await db.select({ sentiment: microFeedback.sentiment })
      .from(microFeedback)
      .where(condition);
    
    const stats = {
      positive: 0,
      neutral: 0,
      negative: 0,
      total: results.length
    };
    
    results.forEach(result => {
      if (result.sentiment === 'positive') {
        stats.positive++;
      } else if (result.sentiment === 'neutral') {
        stats.neutral++;
      } else if (result.sentiment === 'negative') {
        stats.negative++;
      }
    });
    
    return stats;
  }
}

export const storage = new DrizzleStorage();
import { eq, and } from "drizzle-orm";
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
    
    const result = await db.insert(campaigns).values(campaignToInsert as any).returning();
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
    const result = await db.insert(userProfiles).values(profile as any).returning();
    return result[0];
  }

  async getUserProfile(userId: number): Promise<schema.UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return result[0];
  }
  
  // API Settings operations
  async createUserApiSettings(settings: schema.InsertApiSettings): Promise<schema.UserApiSettings> {
    const result = await db.insert(userApiSettings).values(settings as any).returning();
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
    const result = await db.insert(connections).values(connection as any).returning();
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
    const result = await db.insert(posts).values(post as any).returning();
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
    const result = await db.insert(comments).values(comment as any).returning();
    return result[0];
  }

  async getCommentsByPostId(postId: number): Promise<schema.Comment[]> {
    return await db.select().from(comments).where(eq(comments.postId, postId));
  }

  async createAchievement(achievement: InsertAchievement): Promise<schema.Achievement> {
    const result = await db.insert(achievements).values(achievement as any).returning();
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
    const result = await db.insert(userQuizResults).values(quizResult as any).returning();
    return result[0];
  }

  async getUserQuizResults(userId: number, quizId?: string): Promise<schema.UserQuizResult[]> {
    if (quizId) {
      return await db.select().from(userQuizResults).where(and(eq(userQuizResults.userId, userId), eq(userQuizResults.quizId, quizId)));
    }
    return await db.select().from(userQuizResults).where(eq(userQuizResults.userId, userId));
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
    const result = await db.insert(adPlatformSimulationAttempts).values(attempt as any).returning();
    return result[0];
  }

  async getAdPlatformSimulationAttempts(userId: number, simulationId: number): Promise<schema.AdPlatformSimulationAttempt[]> {
    return await db.select()
      .from(adPlatformSimulationAttempts)
      .where(and(eq(adPlatformSimulationAttempts.userId, userId), eq(adPlatformSimulationAttempts.simulationId, simulationId)));
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
    const result = await db.insert(dataVisualizationAttempts).values(attempt as any).returning();
    return result[0];
  }

  async getDataVisualizationAttempts(userId: number, challengeId: number): Promise<schema.DataVisualizationAttempt[]> {
    return await db.select()
      .from(dataVisualizationAttempts)
      .where(and(eq(dataVisualizationAttempts.userId, userId), eq(dataVisualizationAttempts.challengeId, challengeId)));
  }

  // Keyword Research operations
  async createKeywordResearchProject(project: schema.InsertKeywordResearchProject): Promise<schema.KeywordResearchProject> {
    const result = await db.insert(keywordResearchProjects).values(project as any).returning();
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
    const result = await db.insert(keywordResults).values(keywordResult as any).returning();
    return result[0];
  }

  async getKeywordResults(projectId: number): Promise<schema.KeywordResult[]> {
    return await db.select().from(keywordResults).where(eq(keywordResults.projectId, projectId));
  }

  async createKeywordList(list: schema.InsertKeywordList): Promise<schema.KeywordList> {
    const result = await db.insert(keywordLists).values(list as any).returning();
    return result[0];
  }

  async getKeywordLists(projectId: number): Promise<schema.KeywordList[]> {
    return await db.select().from(keywordLists).where(eq(keywordLists.projectId, projectId));
  }

  async getKeywordListById(id: number): Promise<schema.KeywordList | undefined> {
    const result = await db.select().from(keywordLists).where(eq(keywordLists.id, id));
    return result[0];
  }

  // In-memory fallback stores for A/B testing
  private inMemoryABTests = new Map<number, schema.ABTest>();
  private inMemoryVariants = new Map<number, schema.ABTestVariant>();
  private nextABTestId = 100;
  private nextVariantId = 100;
  private abTestsInitialized = false;

  private initDefaultABTests() {
    if (this.abTestsInitialized) return;
    this.abTestsInitialized = true;

    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const elevenDaysLater = new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000);

    // Test 1: Completed Test with full metrics & insights
    const test1: schema.ABTest = {
      id: 1,
      campaignId: 1,
      name: "High-Intent Hero Headline: AI Automation vs Standard Agency",
      status: "completed",
      startDate: twoWeeksAgo,
      endDate: now,
      testVariable: "headline",
      controlGroupId: 1,
      winningVariantId: 2,
      confidenceLevel: "0.9650",
      conclusions: 'Variant A ("Guaranteed 3x Faster Client Acquisition Using Hands-On AI Simulation Labs") outperformed the control with a 28.6% improvement in cost per acquisition.',
      createdAt: twoWeeksAgo,
      updatedAt: now
    };
    this.inMemoryABTests.set(1, test1);

    const test1Variant1: schema.ABTestVariant = {
      id: 1,
      abTestId: 1,
      name: "Control",
      isControl: true,
      value: "Transform Your Digital Marketing with Real-World AI Simulations",
      impressions: 12450,
      clicks: 622,
      conversions: "62.20",
      cost: "1500.00",
      ctr: "0.0500",
      conversionRate: "0.1000",
      cpa: "24.12",
      improvementPercent: "0",
      createdAt: twoWeeksAgo,
      updatedAt: now
    };
    const test1Variant2: schema.ABTestVariant = {
      id: 2,
      abTestId: 1,
      name: "Variant A",
      isControl: false,
      value: "Guaranteed 3x Faster Client Acquisition Using Hands-On AI Simulation Labs",
      impressions: 12450,
      clicks: 846,
      conversions: "87.10",
      cost: "1500.00",
      ctr: "0.0680",
      conversionRate: "0.1029",
      cpa: "17.22",
      improvementPercent: "28.6",
      createdAt: twoWeeksAgo,
      updatedAt: now
    };
    this.inMemoryVariants.set(1, test1Variant1);
    this.inMemoryVariants.set(2, test1Variant2);

    // Daily metric data for Test 1
    const dailyData: any[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(twoWeeksAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const ctrlVar = 0.046 + Math.sin(i * 0.7) * 0.005 + (i * 0.0003);
      const varAVar = 0.062 + Math.cos(i * 0.7) * 0.006 + (i * 0.0006);
      dailyData.push({
        date: dateStr,
        "Control CTR": parseFloat(ctrlVar.toFixed(4)),
        "Variant A CTR": parseFloat(varAVar.toFixed(4))
      });
    }

    this.simulationResults.set(1, {
      testId: 1,
      status: "completed",
      confidenceLevel: 0.965,
      dailyData,
      variants: [
        { ...test1Variant1, improvementPercent: "0" },
        { ...test1Variant2, improvementPercent: "28.6" }
      ],
      winningVariant: {
        id: 2,
        name: "Variant A",
        improvement: "28.6",
        projectedAnnualSavings: 82800
      },
      insights: [
        'Your A/B test "High-Intent Hero Headline: AI Automation vs Standard Agency" for headline ran for 12,450 impressions.',
        '"Variant A" outperformed the control variant with a 28.6% improvement in cost per acquisition.',
        'Headlines that create a quantifiable ROI promise (e.g. 3x Faster) significantly increase click intent and conversion efficiency.',
        'Based on these results, we recommend deploying Variant A into production ad sets and proceeding to test secondary CTA hooks.'
      ]
    });

    // Test 2: Active Test ready to run simulation
    const test2: schema.ABTest = {
      id: 2,
      campaignId: 1,
      name: "Summer Enrollment CTA: Direct Action vs Low-Commitment",
      status: "active",
      startDate: threeDaysAgo,
      endDate: elevenDaysLater,
      testVariable: "cta",
      controlGroupId: 3,
      winningVariantId: null,
      confidenceLevel: null,
      conclusions: null,
      createdAt: threeDaysAgo,
      updatedAt: threeDaysAgo
    };
    this.inMemoryABTests.set(2, test2);

    const test2Variant1: schema.ABTestVariant = {
      id: 3,
      abTestId: 2,
      name: "Control",
      isControl: true,
      value: "Enroll in Foundation Course",
      impressions: 0,
      clicks: 0,
      conversions: "0",
      cost: "0",
      ctr: null,
      conversionRate: null,
      cpa: null,
      improvementPercent: "0",
      createdAt: threeDaysAgo,
      updatedAt: threeDaysAgo
    };
    const test2Variant2: schema.ABTestVariant = {
      id: 4,
      abTestId: 2,
      name: "Variant A",
      isControl: false,
      value: "Test-Drive Interactive Free Sandbox",
      impressions: 0,
      clicks: 0,
      conversions: "0",
      cost: "0",
      ctr: null,
      conversionRate: null,
      cpa: null,
      improvementPercent: null,
      createdAt: threeDaysAgo,
      updatedAt: threeDaysAgo
    };
    const test2Variant3: schema.ABTestVariant = {
      id: 5,
      abTestId: 2,
      name: "Variant B",
      isControl: false,
      value: "Start 7-Day Growth Simulation Trial",
      impressions: 0,
      clicks: 0,
      conversions: "0",
      cost: "0",
      ctr: null,
      conversionRate: null,
      cpa: null,
      improvementPercent: null,
      createdAt: threeDaysAgo,
      updatedAt: threeDaysAgo
    };
    this.inMemoryVariants.set(3, test2Variant1);
    this.inMemoryVariants.set(4, test2Variant2);
    this.inMemoryVariants.set(5, test2Variant3);
  }

  // A/B Testing Operations
  async createABTest(test: schema.InsertABTest): Promise<number> {
    this.initDefaultABTests();
    try {
      const result = await db.insert(abTests).values(test as any).returning();
      if (result && result.length > 0) return result[0].id;
    } catch (e) {
      console.warn("Using in-memory store for createABTest");
    }
    const id = this.nextABTestId++;
    const createdTest: schema.ABTest = {
      id,
      campaignId: test.campaignId || 1,
      name: test.name,
      status: test.status || 'active',
      startDate: test.startDate instanceof Date ? test.startDate : new Date(test.startDate),
      endDate: test.endDate ? (test.endDate instanceof Date ? test.endDate : new Date(test.endDate)) : null,
      testVariable: test.testVariable,
      controlGroupId: test.controlGroupId || null,
      winningVariantId: test.winningVariantId || null,
      confidenceLevel: test.confidenceLevel || null,
      conclusions: test.conclusions || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.inMemoryABTests.set(id, createdTest);
    return id;
  }

  async getABTest(testId: number): Promise<schema.ABTest | null> {
    this.initDefaultABTests();
    try {
      const result = await db.select().from(abTests).where(eq(abTests.id, testId));
      if (result && result.length > 0) return result[0];
    } catch (e) {
      // Fallback to memory
    }
    return this.inMemoryABTests.get(testId) || null;
  }

  async getABTests(userId?: number, campaignId?: number): Promise<schema.ABTest[]> {
    this.initDefaultABTests();
    try {
      if (campaignId) {
        const result = await db.select().from(abTests).where(eq(abTests.campaignId, campaignId));
        if (result && result.length > 0) return result;
      } else {
        const result = await db.select().from(abTests);
        if (result && result.length > 0) return result;
      }
    } catch (e) {
      // Fallback to memory
    }
    let tests = Array.from(this.inMemoryABTests.values());
    if (campaignId) {
      tests = tests.filter(t => t.campaignId === campaignId);
    }
    return tests;
  }

  async updateABTest(testId: number, updates: Partial<schema.ABTest>): Promise<void> {
    this.initDefaultABTests();
    try {
      await db.update(abTests)
        .set(updates)
        .where(eq(abTests.id, testId));
    } catch (e) {
      // Fallback to memory
    }
    const existing = this.inMemoryABTests.get(testId);
    if (existing) {
      this.inMemoryABTests.set(testId, {
        ...existing,
        ...updates,
        updatedAt: new Date()
      });
    }
  }

  async deleteABTest(testId: number): Promise<void> {
    this.initDefaultABTests();
    try {
      await db.delete(abTests).where(eq(abTests.id, testId));
    } catch (e) {
      // Fallback to memory
    }
    this.inMemoryABTests.delete(testId);
    this.inMemoryVariants.forEach((v, vId) => {
      if (v.abTestId === testId) {
        this.inMemoryVariants.delete(vId);
      }
    });
  }

  async createABTestVariant(variant: schema.InsertABTestVariant): Promise<number> {
    this.initDefaultABTests();
    try {
      const result = await db.insert(abTestVariants).values(variant).returning();
      if (result && result.length > 0) return result[0].id;
    } catch (e) {
      console.warn("Using in-memory store for createABTestVariant");
    }
    const id = this.nextVariantId++;
    const createdVariant: schema.ABTestVariant = {
      id,
      abTestId: variant.abTestId,
      name: variant.name,
      isControl: variant.isControl ?? false,
      value: variant.value,
      impressions: variant.impressions ?? 0,
      clicks: variant.clicks ?? 0,
      conversions: variant.conversions ?? "0",
      cost: variant.cost ?? "0",
      ctr: variant.ctr ?? null,
      conversionRate: variant.conversionRate ?? null,
      cpa: variant.cpa ?? null,
      improvementPercent: variant.improvementPercent ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.inMemoryVariants.set(id, createdVariant);
    return id;
  }

  async getABTestVariant(variantId: number): Promise<schema.ABTestVariant | null> {
    this.initDefaultABTests();
    try {
      const result = await db.select().from(abTestVariants).where(eq(abTestVariants.id, variantId));
      if (result && result.length > 0) return result[0];
    } catch (e) {
      // Fallback
    }
    return this.inMemoryVariants.get(variantId) || null;
  }

  async getABTestVariants(testId: number): Promise<schema.ABTestVariant[]> {
    this.initDefaultABTests();
    try {
      const result = await db.select().from(abTestVariants).where(eq(abTestVariants.abTestId, testId));
      if (result && result.length > 0) return result;
    } catch (e) {
      // Fallback
    }
    return Array.from(this.inMemoryVariants.values()).filter(v => v.abTestId === testId);
  }

  async updateABTestVariant(variantId: number, updates: Partial<schema.ABTestVariant>): Promise<void> {
    this.initDefaultABTests();
    try {
      await db.update(abTestVariants)
        .set(updates)
        .where(eq(abTestVariants.id, variantId));
    } catch (e) {
      // Fallback
    }
    const existing = this.inMemoryVariants.get(variantId);
    if (existing) {
      this.inMemoryVariants.set(variantId, {
        ...existing,
        ...updates,
        updatedAt: new Date()
      });
    }
  }

  async deleteABTestVariant(variantId: number): Promise<void> {
    this.initDefaultABTests();
    try {
      await db.delete(abTestVariants).where(eq(abTestVariants.id, variantId));
    } catch (e) {
      // Fallback
    }
    this.inMemoryVariants.delete(variantId);
  }

  // Simulation Results (stored in-memory for now, would be stored in a real database)
  private simulationResults = new Map<number, any>();

  async saveSimulationResult(testId: number, result: any): Promise<void> {
    this.simulationResults.set(testId, result);
  }

  async getSimulationResult(testId: number): Promise<any | null> {
    this.initDefaultABTests();
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
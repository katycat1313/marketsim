import { pgTable, text, serial, integer, json, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User API settings table - for LLM providers only
export const userApiSettings = pgTable("user_api_settings", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  activeProvider: text("active_provider").notNull(), // 'anthropic', 'openai', or 'gemini'
  anthropicApiKey: text("anthropic_api_key"),
  openaiApiKey: text("openai_api_key"),
  geminiApiKey: text("gemini_api_key"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add new types for API settings
export const insertApiSettingsSchema = createInsertSchema(userApiSettings);
export type UserApiSettings = typeof userApiSettings.$inferSelect;
export type InsertApiSettings = z.infer<typeof insertApiSettingsSchema>;

export const personas = pgTable("personas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ageRange: json("age_range").$type<{min: number, max: number}>().notNull(),
  gender: text("gender").notNull(),
  location: text("location").notNull(),
  interests: text("interests").array().notNull(),
  industry: text("industry").notNull(),
  education: text("education").notNull(),
  incomeRange: text("income_range").notNull(),
  behaviors: text("behaviors").array().notNull(),
  onlinePlatforms: text("online_platforms").array().notNull(),
  buyingHabits: text("buying_habits").array().notNull(),
  description: text("description").notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  platform: text("platform").notNull(), // 'google' or 'meta'
  type: text("type").notNull(), // 'search', 'display', 'shopping' for Google, 'feed', 'stories', etc for Meta
  goal: text("goal").notNull(),
  dailyBudget: decimal("daily_budget").notNull(),
  targetCpa: decimal("target_cpa"), // Cost per acquisition target
  keywords: json("keywords").$type<{
    text: string,
    matchType: 'broad' | 'phrase' | 'exact'
  }[]>().notNull(),
  negativeKeywords: text("negative_keywords").array(),
  targeting: json("targeting").$type<{
    locations: string[],
    languages: string[],
    devices: string[],
    demographics: {
      ageRanges: string[],
      genders: string[],
      householdIncomes: string[]
    }
  }>().notNull(),
  adHeadlines: text("ad_headlines").array().notNull(), // Multiple headlines for responsive ads
  adDescriptions: text("ad_descriptions").array().notNull(), // Multiple descriptions
  finalUrl: text("final_url").notNull(),
  personaId: integer("persona_id").references(() => personas.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default('active'), // 'active', 'paused', 'ended'
});

export const simulationData = pgTable("simulation_data", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  impressions: integer("impressions").notNull(),
  clicks: integer("clicks").notNull(),
  conversions: integer("conversions").notNull(),
  cost: decimal("cost").notNull(),
  averagePosition: decimal("average_position"), // For search ads
  qualityScore: integer("quality_score"), // Google Ads quality score (1-10)
  relevanceScore: integer("relevance_score"), // Meta relevance score
  date: timestamp("date").notNull(),
  // Performance metrics
  ctr: decimal("ctr"), // Click-through rate
  cpc: decimal("cpc"), // Cost per click
  conversionRate: decimal("conversion_rate"),
  cpa: decimal("cpa"), // Cost per acquisition
});

// Validation schemas
export const insertPersonaSchema = createInsertSchema(personas).extend({
  behaviors: z.array(z.string()),
  onlinePlatforms: z.array(z.string()),
  buyingHabits: z.array(z.string()),
});

export const insertCampaignSchema = createInsertSchema(campaigns)
  .omit({ createdAt: true, status: true })
  .extend({
    adHeadlines: z.array(z.string().max(30)), // Google Ads headline limit
    adDescriptions: z.array(z.string().max(90)), // Google Ads description limit
    keywords: z.array(z.object({
      text: z.string(),
      matchType: z.enum(['broad', 'phrase', 'exact'])
    }))
  });

export const insertSimulationDataSchema = createInsertSchema(simulationData);

// Types
export type Persona = typeof personas.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type SimulationData = typeof simulationData.$inferSelect;
export type InsertPersona = z.infer<typeof insertPersonaSchema>;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type InsertSimulationData = z.infer<typeof insertSimulationDataSchema>;

export const marketingResources = pgTable("marketing_resources", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'best_practices', 'case_studies', 'strategy_guides', etc.
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const marketingKnowledgeBase = pgTable("marketing_knowledge_base", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(), // e.g., 'audience_targeting', 'ad_copy', 'budget_optimization'
  context: text("context").notNull(), // The marketing context or scenario
  recommendation: text("recommendation").notNull(), // Expert recommendation
  source: text("source"), // Source of the knowledge if applicable
  effectiveness: integer("effectiveness").notNull(), // Rating of how effective this advice has been
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Add validation schemas
export const insertMarketingResourceSchema = createInsertSchema(marketingResources);
export const insertKnowledgeBaseSchema = createInsertSchema(marketingKnowledgeBase);

// Add types
export type MarketingResource = typeof marketingResources.$inferSelect;
export type KnowledgeBase = typeof marketingKnowledgeBase.$inferSelect;
export type InsertMarketingResource = z.infer<typeof insertMarketingResourceSchema>;
export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;


// User-contributed marketing knowledge
export const userMarketingKnowledge = pgTable("user_marketing_knowledge", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  brandName: text("brand_name"),
  industry: text("industry").notNull(),
  topic: text("topic").notNull(),
  context: text("context").notNull(),
  strategy: text("strategy").notNull(),
  results: text("results").notNull(),
  effectiveness: integer("effectiveness").notNull(), // 1-100 rating
  tags: text("tags").array().notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  verifiedByAI: boolean("verified_by_ai").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Industry-specific benchmarks and insights
export const industryBenchmarks = pgTable("industry_benchmarks", {
  id: serial("id").primaryKey(),
  industry: text("industry").notNull(),
  platform: text("platform").notNull(), // e.g., 'google_ads', 'facebook', etc.
  metric: text("metric").notNull(), // e.g., 'ctr', 'conversion_rate', etc.
  averageValue: decimal("average_value").notNull(),
  topPerformerValue: decimal("top_performer_value").notNull(),
  context: text("context").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Brand-specific performance data
export const brandPerformanceData = pgTable("brand_performance_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  brandName: text("brand_name").notNull(),
  industry: text("industry").notNull(),
  platform: text("platform").notNull(),
  metric: text("metric").notNull(),
  value: decimal("value").notNull(),
  timeframe: text("timeframe").notNull(), // e.g., 'last_30_days', 'last_quarter'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Add validation schemas
export const insertUserMarketingKnowledgeSchema = createInsertSchema(userMarketingKnowledge);
export const insertIndustryBenchmarkSchema = createInsertSchema(industryBenchmarks);
export const insertBrandPerformanceDataSchema = createInsertSchema(brandPerformanceData);

// Add types
export type UserMarketingKnowledge = typeof userMarketingKnowledge.$inferSelect;
export type IndustryBenchmark = typeof industryBenchmarks.$inferSelect;
export type BrandPerformanceData = typeof brandPerformanceData.$inferSelect;
export type InsertUserMarketingKnowledge = z.infer<typeof insertUserMarketingKnowledgeSchema>;
export type InsertIndustryBenchmark = z.infer<typeof insertIndustryBenchmarkSchema>;
export type InsertBrandPerformanceData = z.infer<typeof insertBrandPerformanceDataSchema>;

// User profiles and levels
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  username: text("username").unique().notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  level: text("level").notNull().default('Beginner'), // Beginner, Intermediate, Advanced, Expert
  experiencePoints: integer("experience_points").notNull().default(0),
  dailyXpEarned: integer("daily_xp_earned").notNull().default(0),
  lastXpReset: timestamp("last_xp_reset").defaultNow().notNull(),
  achievements: json("achievements").$type<string[]>().default([]),
  badges: json("badges").$type<string[]>().default([]),
  specializations: json("specializations").$type<string[]>().default([]),
  lastActivityDate: timestamp("last_activity_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Social connections
export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  connectedUserId: integer("connected_user_id").notNull(),
  status: text("status").notNull(), // pending, accepted, blocked
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects and collaborations
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: integer("owner_id").notNull(),
  status: text("status").notNull(), // draft, active, completed
  visibility: text("visibility").notNull(), // private, public, collaborative
  collaborators: json("collaborators").$type<number[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Posts and discussions
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // question, discussion, showcase
  tags: json("tags").$type<string[]>().default([]),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Comments
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Achievements and awards
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // skill, campaign, social, special
  requirements: json("requirements").notNull(),
  icon: text("icon").notNull(),
  experiencePoints: integer("experience_points").notNull(),
});

// Add validation schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles);
export const insertConnectionSchema = createInsertSchema(connections);
export const insertProjectSchema = createInsertSchema(projects);
export const insertPostSchema = createInsertSchema(posts);
export const insertCommentSchema = createInsertSchema(comments);
export const insertAchievementSchema = createInsertSchema(achievements);

// Tutorial modules and user progress
export const tutorialModules = pgTable("tutorial_modules", {
  id: serial("id").primaryKey(),
  moduleNumber: integer("module_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(), // Beginner, Intermediate, Advanced, Expert
  skillsLearned: json("skills_learned").$type<string[]>().notNull(),
  prerequisiteModuleIds: integer("prerequisite_module_ids").array(), // Modules that must be completed first
  estimatedTimeHours: decimal("estimated_time_hours").notNull(),
  xpReward: integer("xp_reward").notNull(),
  badgeId: integer("badge_id"), // Optional badge awarded upon completion
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tutorialSections = pgTable("tutorial_sections", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => tutorialModules.id).notNull(),
  sectionNumber: integer("section_number").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  estimatedTimeMinutes: integer("estimated_time_minutes").notNull(),
  hasQuiz: boolean("has_quiz").default(false).notNull(),
  hasSimulation: boolean("has_simulation").default(false).notNull(),
  xpReward: integer("xp_reward").notNull(),
});

export const userTutorialProgress = pgTable("user_tutorial_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").references(() => tutorialModules.id).notNull(),
  completedSections: integer("completed_sections").array().default([]),
  started: boolean("started").default(false).notNull(),
  completed: boolean("completed").default(false).notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  earnedXp: integer("earned_xp").default(0).notNull(),
  timeSpentMinutes: integer("time_spent_minutes").default(0).notNull(),
});

export const userQuizResults = pgTable("user_quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sectionId: integer("section_id").references(() => tutorialSections.id).notNull(),
  score: integer("score").notNull(), // 0-100 percentage
  maxScore: integer("max_score").notNull(),
  passed: boolean("passed").default(false).notNull(),
  attempts: integer("attempts").default(1).notNull(),
  lastAttemptAt: timestamp("last_attempt_at").defaultNow().notNull(),
  answers: json("answers").$type<{questionId: number, answer: string, correct: boolean}[]>().notNull(),
});

export const userSimulationResults = pgTable("user_simulation_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sectionId: integer("section_id").references(() => tutorialSections.id).notNull(),
  challengeId: integer("challenge_id").notNull(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  score: integer("score").notNull(), // 0-100 percentage
  passed: boolean("passed").default(false).notNull(),
  feedback: json("feedback").$type<string[]>().notNull(),
  metrics: json("metrics").$type<Record<string, number>>().notNull(),
  attempts: integer("attempts").default(1).notNull(),
  completedAt: timestamp("completed_at"),
  timeSpentMinutes: integer("time_spent_minutes").default(0).notNull(),
});

export const userExperienceLog = pgTable("user_experience_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(), // Can be positive or negative
  source: text("source").notNull(), // tutorial, quiz, simulation, achievement, daily-activity, inactivity-decay
  entityId: integer("entity_id"), // ID of the related entity (tutorial, achievement, etc.)
  reason: text("reason").notNull(), // Short description of why XP was awarded
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Level progression requirements
export const levelRequirements = pgTable("level_requirements", {
  id: serial("id").primaryKey(),
  level: text("level").notNull().unique(), // Beginner, Intermediate, Advanced, Expert
  xpRequired: integer("xp_required").notNull(),
  requiredModuleIds: integer("required_module_ids").array(),
  requiredAchievementCount: integer("required_achievement_count").default(0).notNull(),
  minDaysAtPreviousLevel: integer("min_days_at_previous_level").default(7).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Add validation schemas
export const insertTutorialModuleSchema = createInsertSchema(tutorialModules);
export const insertTutorialSectionSchema = createInsertSchema(tutorialSections);
export const insertUserTutorialProgressSchema = createInsertSchema(userTutorialProgress);
export const insertUserQuizResultSchema = createInsertSchema(userQuizResults);
export const insertUserSimulationResultSchema = createInsertSchema(userSimulationResults);
export const insertUserExperienceLogSchema = createInsertSchema(userExperienceLog);
export const insertLevelRequirementSchema = createInsertSchema(levelRequirements);

// Add types
export type UserProfile = typeof userProfiles.$inferSelect;
export type Connection = typeof connections.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type TutorialModule = typeof tutorialModules.$inferSelect;
export type TutorialSection = typeof tutorialSections.$inferSelect;
export type UserTutorialProgress = typeof userTutorialProgress.$inferSelect;
export type UserQuizResult = typeof userQuizResults.$inferSelect;
export type UserSimulationResult = typeof userSimulationResults.$inferSelect;
export type UserExperienceLog = typeof userExperienceLog.$inferSelect;
export type LevelRequirement = typeof levelRequirements.$inferSelect;
export type InsertTutorialModule = z.infer<typeof insertTutorialModuleSchema>;
export type InsertTutorialSection = z.infer<typeof insertTutorialSectionSchema>;
export type InsertUserTutorialProgress = z.infer<typeof insertUserTutorialProgressSchema>;
export type InsertUserQuizResult = z.infer<typeof insertUserQuizResultSchema>;
export type InsertUserSimulationResult = z.infer<typeof insertUserSimulationResultSchema>;
export type InsertUserExperienceLog = z.infer<typeof insertUserExperienceLogSchema>;
export type InsertLevelRequirement = z.infer<typeof insertLevelRequirementSchema>;
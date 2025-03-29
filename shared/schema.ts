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
  // Advanced metrics from simulation algorithm 
  impressionShare: decimal("impression_share"), // Share of available impressions
  roi: decimal("roi"), // Return on investment percentage
  bidCompetitiveness: decimal("bid_competitiveness"), // How competitive the bid is
  industryCompetition: decimal("industry_competition"), // Industry competition level
  seasonalityFactor: decimal("seasonality_factor"), // Current seasonality impact
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
  sectionId: integer("section_id").references(() => tutorialSections.id),
  quizId: text("quiz_id"), // For standalone quizzes like 'seo-fundamentals'
  score: integer("score").notNull(), // 0-100 percentage
  maxScore: integer("max_score").notNull(),
  passed: boolean("passed").default(false).notNull(),
  attempts: integer("attempts").default(1).notNull(),
  lastAttemptAt: timestamp("last_attempt_at").defaultNow().notNull(),
  answers: json("answers").$type<{questionId: number, answer: string, correct: boolean}[]>(),
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

// Contest system for portfolio building and skill demonstration
export const marketingContests = pgTable("marketing_contests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  brief: text("brief").notNull(), // Detailed brief of what contestants need to create
  level: text("level").notNull(), // Beginner, Intermediate, Advanced, Expert
  category: text("category").notNull(), // e.g., "search-ads", "display-ads", "social-media", "content-marketing", etc.
  maxSubmissions: integer("max_submissions").default(1).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  judgingEndDate: timestamp("judging_end_date").notNull(),
  prizeBadgeId: integer("prize_badge_id").references(() => achievements.id),
  prizeBadgeName: text("prize_badge_name").notNull(),
  xpReward: integer("xp_reward").notNull(),
  status: text("status").notNull().default('upcoming'), // upcoming, active, judging, completed
  visibleToLevels: text("visible_to_levels").array().notNull(), // Which user levels can see and participate
  allowTeams: boolean("allow_teams").default(false).notNull(),
  maxTeamSize: integer("max_team_size").default(1),
  submissionCount: integer("submission_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contestSubmissions = pgTable("contest_submissions", {
  id: serial("id").primaryKey(),
  contestId: integer("contest_id").references(() => marketingContests.id).notNull(),
  userId: integer("user_id").notNull(),
  teamId: integer("team_id"), // If this is a team submission
  title: text("title").notNull(),
  description: text("description").notNull(),
  campaignId: integer("campaign_id").references(() => campaigns.id), // If submission includes a campaign
  attachments: json("attachments").$type<{url: string, type: string, description: string}[]>().default([]),
  submissionData: json("submission_data").notNull(), // Flexible JSON structure for submission content
  averageScore: decimal("average_score"), // 0-100 scale
  status: text("status").notNull().default('submitted'), // submitted, under_review, scored, winner, honorable_mention, rejected
  feedback: text("feedback").array(), // Feedback from judges
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contestTeams = pgTable("contest_teams", {
  id: serial("id").primaryKey(),
  contestId: integer("contest_id").references(() => marketingContests.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  leaderId: integer("leader_id").notNull(), // User ID of team leader
  memberIds: integer("member_ids").array().notNull(), // Array of user IDs
  status: text("status").notNull().default('forming'), // forming, complete, submitted
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contestVotes = pgTable("contest_votes", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").references(() => contestSubmissions.id).notNull(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioEntries = pgTable("portfolio_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  submissionId: integer("submission_id").references(() => contestSubmissions.id), // If entry is from a contest
  campaignId: integer("campaign_id").references(() => campaigns.id), // If entry is a campaign
  tags: text("tags").array().default([]),
  skills: text("skills").array().notNull(),
  showcased: boolean("showcased").default(false).notNull(), // Featured on profile
  visibleToPublic: boolean("visible_to_public").default(true).notNull(),
  visibleToEmployers: boolean("visible_to_employers").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add validation schemas
export const insertMarketingContestSchema = createInsertSchema(marketingContests);
export const insertContestSubmissionSchema = createInsertSchema(contestSubmissions);
export const insertContestTeamSchema = createInsertSchema(contestTeams);
export const insertContestVoteSchema = createInsertSchema(contestVotes);
export const insertPortfolioEntrySchema = createInsertSchema(portfolioEntries);

// Add types
export type MarketingContest = typeof marketingContests.$inferSelect;
export type ContestSubmission = typeof contestSubmissions.$inferSelect;
export type ContestTeam = typeof contestTeams.$inferSelect;
export type ContestVote = typeof contestVotes.$inferSelect;
export type PortfolioEntry = typeof portfolioEntries.$inferSelect;
export type InsertMarketingContest = z.infer<typeof insertMarketingContestSchema>;
export type InsertContestSubmission = z.infer<typeof insertContestSubmissionSchema>;
export type InsertContestTeam = z.infer<typeof insertContestTeamSchema>;
export type InsertContestVote = z.infer<typeof insertContestVoteSchema>;
export type InsertPortfolioEntry = z.infer<typeof insertPortfolioEntrySchema>;

// SEO Simulation system
export const seoSimulations = pgTable("seo_simulations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // Beginner, Intermediate, Advanced
  industry: text("industry").notNull(), // E-commerce, Healthcare, Education, etc.
  originalContent: json("original_content").notNull(), // Original webpage content with SEO issues
  targetKeywords: text("target_keywords").array().notNull(), // Keywords to optimize for
  seoIssues: json("seo_issues").$type<{
    type: string, // title, meta, headings, content, links, etc.
    description: string,
    severity: 'low' | 'medium' | 'high',
    location: string, // Where in the original content this issue is found
  }[]>().notNull(),
  bestPractices: json("best_practices").$type<{
    category: string,
    description: string,
    example: string
  }[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const seoSimulationAttempts = pgTable("seo_simulation_attempts", {
  id: serial("id").primaryKey(),
  simulationId: integer("simulation_id").references(() => seoSimulations.id).notNull(),
  userId: integer("user_id").notNull(),
  modifiedContent: json("modified_content").notNull(), // User's optimized version
  score: integer("score"), // 0-100 scale
  issuesFixed: json("issues_fixed").$type<{
    issueType: string,
    fixed: boolean,
    feedback: string
  }[]>(),
  keywordOptimization: json("keyword_optimization").$type<{
    keyword: string,
    density: number,
    placement: string[], // where keywords were used (title, h1, content, etc.)
    feedback: string
  }[]>(),
  readabilityScore: integer("readability_score"), // 0-100 scale
  technicalSeoScore: integer("technical_seo_score"), // 0-100 scale
  contentQualityScore: integer("content_quality_score"), // 0-100 scale
  feedback: text("feedback"), // Overall feedback from the AI
  recommendations: text("recommendations").array(), // Specific recommendations for improvement
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ad Platform Simulation Tables
export const adPlatformSimulations = pgTable("ad_platform_simulations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  platform: text("platform").notNull(), // google_ads, meta_ads, linkedin_ads
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced, expert
  industry: text("industry").notNull(),
  objectives: json("objectives").$type<string[]>().notNull(),
  budget: decimal("budget").notNull(),
  businessType: text("business_type").notNull(),
  scenarioDescription: text("scenario_description").notNull(),
  targetAudience: json("target_audience").$type<{
    demographics: Record<string, any>,
    interests: string[],
    behaviors: string[],
    locations: string[]
  }>().notNull(),
  challengePoints: json("challenge_points").$type<string[]>().notNull(),
  successCriteria: json("success_criteria").$type<Array<{
    metric: string,
    target: number,
    comparison: "greater" | "less" | "equal"
  }>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const adPlatformSimulationAttempts = pgTable("ad_platform_simulation_attempts", {
  id: serial("id").primaryKey(),
  simulationId: integer("simulation_id").references(() => adPlatformSimulations.id).notNull(),
  userId: integer("user_id").notNull(),
  campaignName: text("campaign_name").notNull(),
  campaignObjective: text("campaign_objective").notNull(),
  adGroupStructure: json("ad_group_structure").$type<Array<{
    name: string,
    targeting: Record<string, any>
  }>>().notNull(),
  targeting: json("targeting").$type<{
    demographics: Record<string, any>,
    interests: string[],
    behaviors: string[],
    locations: string[],
    placements?: string[]
  }>().notNull(),
  creatives: json("creatives").$type<Array<{
    type: string, // text, image, video
    headline?: string,
    description?: string,
    imageUrl?: string,
    videoUrl?: string,
    callToAction?: string
  }>>().notNull(),
  bidStrategy: text("bid_strategy").notNull(),
  dailyBudget: decimal("daily_budget").notNull(),
  schedule: json("schedule").$type<Record<string, any>>(),
  score: integer("score").default(0).notNull(),
  feedback: json("feedback").$type<string[]>().notNull(),
  metrics: json("metrics").$type<Record<string, number>>().notNull(),
  // Platform-specific fields
  platformSpecificSettings: json("platform_specific_settings").$type<Record<string, any>>(),
  completedAt: timestamp("completed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Google Ads specific simulation data
export const googleAdsSimulationDetails = pgTable("google_ads_simulation_details", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").references(() => adPlatformSimulationAttempts.id).notNull(),
  keywordBidding: json("keyword_bidding").$type<Array<{
    keyword: string,
    matchType: string,
    bid: number
  }>>(),
  adExtensions: json("ad_extensions").$type<Array<{
    type: string,
    content: string
  }>>(),
  negativeKeywords: json("negative_keywords").$type<string[]>(),
  qualityScore: integer("quality_score").default(0),
  adRank: decimal("ad_rank").default("0"),
  impressionShare: decimal("impression_share").default("0"),
  searchTerms: json("search_terms").$type<Array<{
    term: string,
    impressions: number,
    clicks: number
  }>>(),
});

// Meta Ads specific simulation data
export const metaAdsSimulationDetails = pgTable("meta_ads_simulation_details", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").references(() => adPlatformSimulationAttempts.id).notNull(),
  adFormats: json("ad_formats").$type<string[]>(),
  placements: json("placements").$type<string[]>(),
  audienceInsights: json("audience_insights").$type<Record<string, any>>(),
  engagementMetrics: json("engagement_metrics").$type<{
    reactions: number,
    comments: number,
    shares: number,
    profileVisits: number
  }>(),
  pixelImplementation: boolean("pixel_implementation").default(false),
  catalogSetup: boolean("catalog_setup").default(false),
});

// LinkedIn Ads specific simulation data
export const linkedinAdsSimulationDetails = pgTable("linkedin_ads_simulation_details", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").references(() => adPlatformSimulationAttempts.id).notNull(),
  professionalTargeting: json("professional_targeting").$type<{
    jobTitles: string[],
    jobFunctions: string[],
    industries: string[],
    companySize: string[],
    seniorityLevel: string[]
  }>(),
  linkedinAudienceNetwork: boolean("linkedin_audience_network").default(false),
  sponsoredContent: boolean("sponsored_content").default(false),
  insightTagImplementation: boolean("insight_tag_implementation").default(false),
  leadGenForms: json("lead_gen_forms").$type<Array<{
    name: string,
    fields: string[]
  }>>(),
});

export const insertSeoSimulationSchema = createInsertSchema(seoSimulations);
export const insertSeoSimulationAttemptSchema = createInsertSchema(seoSimulationAttempts);
export const insertAdPlatformSimulationSchema = createInsertSchema(adPlatformSimulations);
export const insertAdPlatformSimulationAttemptSchema = createInsertSchema(adPlatformSimulationAttempts);
export const insertGoogleAdsSimulationDetailsSchema = createInsertSchema(googleAdsSimulationDetails);
export const insertMetaAdsSimulationDetailsSchema = createInsertSchema(metaAdsSimulationDetails);
export const insertLinkedinAdsSimulationDetailsSchema = createInsertSchema(linkedinAdsSimulationDetails);

export type SeoSimulation = typeof seoSimulations.$inferSelect;
export type SeoSimulationAttempt = typeof seoSimulationAttempts.$inferSelect;
export type AdPlatformSimulation = typeof adPlatformSimulations.$inferSelect;
export type AdPlatformSimulationAttempt = typeof adPlatformSimulationAttempts.$inferSelect;
export type GoogleAdsSimulationDetails = typeof googleAdsSimulationDetails.$inferSelect;
export type MetaAdsSimulationDetails = typeof metaAdsSimulationDetails.$inferSelect;
export type LinkedinAdsSimulationDetails = typeof linkedinAdsSimulationDetails.$inferSelect;

export type InsertSeoSimulation = z.infer<typeof insertSeoSimulationSchema>;
export type InsertSeoSimulationAttempt = z.infer<typeof insertSeoSimulationAttemptSchema>;
export type InsertAdPlatformSimulation = z.infer<typeof insertAdPlatformSimulationSchema>;
export type InsertAdPlatformSimulationAttempt = z.infer<typeof insertAdPlatformSimulationAttemptSchema>;
export type InsertGoogleAdsSimulationDetails = z.infer<typeof insertGoogleAdsSimulationDetailsSchema>;
export type InsertMetaAdsSimulationDetails = z.infer<typeof insertMetaAdsSimulationDetailsSchema>;
export type InsertLinkedinAdsSimulationDetails = z.infer<typeof insertLinkedinAdsSimulationDetailsSchema>;

// Data Visualization Challenges Schema
export const dataVisualizationChallenges = pgTable("data_visualization_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  industry: text("industry").notNull(),
  objectives: text("objectives").array().notNull(),
  expectedTime: integer("expected_time").notNull(),
  datasets: text("datasets").array().notNull(),
  requiredCharts: json("required_charts").notNull(),
  dataset: json("dataset").$type<Record<string, any>>().notNull(),
  recommendedChartType: text("recommended_chart_type"),
  hints: text("hints").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Data Visualization Attempts Schema
export const dataVisualizationAttempts = pgTable("data_visualization_attempts", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").references(() => dataVisualizationChallenges.id),
  userId: integer("user_id"),
  charts: json("charts").notNull(),
  recommendations: json("recommendations").notNull(),
  score: integer("score").notNull(),
  feedback: text("feedback").array().notNull(),
  completedAt: timestamp("completed_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create insert schemas
export const insertDataVisualizationChallengeSchema = createInsertSchema(dataVisualizationChallenges);
export const insertDataVisualizationAttemptSchema = createInsertSchema(dataVisualizationAttempts);

// Keyword Research Tool Tables
export const keywordResearchProjects = pgTable("keyword_research_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  niche: text("niche").notNull(),
  description: text("description"),
  seedKeywords: text("seed_keywords").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const keywordResults = pgTable("keyword_results", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => keywordResearchProjects.id).notNull(),
  keyword: text("keyword").notNull(),
  searchVolume: integer("search_volume"),
  competition: decimal("competition"), // 0-1 score
  cpc: decimal("cpc"), // cost per click estimate
  difficulty: integer("difficulty"), // 1-100 SEO difficulty
  parentKeyword: text("parent_keyword"), // If this is a long-tail variation
  intent: text("intent"), // informational, navigational, commercial, transactional
  seasonality: json("seasonality").$type<Record<string, number>>(), // Month-to-month search volume variation
  relatedQuestions: text("related_questions").array(),
  notes: text("notes"),
  starred: boolean("starred").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const keywordLists = pgTable("keyword_lists", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => keywordResearchProjects.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  keywordIds: integer("keyword_ids").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create insert schemas for keyword research
export const insertKeywordResearchProjectSchema = createInsertSchema(keywordResearchProjects);
export const insertKeywordResultSchema = createInsertSchema(keywordResults);
export const insertKeywordListSchema = createInsertSchema(keywordLists);

// Export keyword research types
export type KeywordResearchProject = typeof keywordResearchProjects.$inferSelect;
export type KeywordResult = typeof keywordResults.$inferSelect;
export type KeywordList = typeof keywordLists.$inferSelect;
export type InsertKeywordResearchProject = z.infer<typeof insertKeywordResearchProjectSchema>;
export type InsertKeywordResult = z.infer<typeof insertKeywordResultSchema>;
export type InsertKeywordList = z.infer<typeof insertKeywordListSchema>;

// Campaign Simulation Engine Tables

// Campaign Performance Metrics - Detailed daily metrics for each campaign
export const campaignPerformanceMetrics = pgTable("campaign_performance_metrics", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  date: timestamp("date").notNull(),
  impressions: integer("impressions").notNull(),
  clicks: integer("clicks").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  conversions: integer("conversions").notNull(),
  conversionValue: decimal("conversion_value", { precision: 10, scale: 2 }).notNull(),
  ctr: decimal("ctr", { precision: 5, scale: 4 }).notNull(), // Click-through rate
  cpc: decimal("cpc", { precision: 8, scale: 2 }).notNull(), // Cost per click
  cpa: decimal("cpa", { precision: 8, scale: 2 }), // Cost per acquisition
  roas: decimal("roas", { precision: 8, scale: 2 }), // Return on ad spend
  qualityScore: decimal("quality_score", { precision: 4, scale: 1 }), // Google Ads specific
  averagePosition: decimal("average_position", { precision: 4, scale: 1 }), // Search position
  // Audience engagement metrics
  engagement: decimal("engagement", { precision: 5, scale: 4 }), // Engagement rate
  videoViews: integer("video_views"), // For video campaigns
  videoViewRate: decimal("video_view_rate", { precision: 5, scale: 4 }),
  // Social-specific metrics
  socialEngagements: integer("social_engagements"), // Likes, shares, comments
  // Weather and seasonal data that might affect performance
  seasonalityFactor: decimal("seasonality_factor", { precision: 4, scale: 2 }),
  weatherConditions: text("weather_conditions"),
  // Market volatility factors
  competitionIntensity: decimal("competition_intensity", { precision: 4, scale: 2 }),
  industryTrends: json("industry_trends").$type<{
    trendName: string,
    impact: number, // -1.0 to 1.0 impact scale
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Keyword Performance - Track individual keyword performance in search campaigns
export const keywordPerformance = pgTable("keyword_performance", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  keyword: text("keyword").notNull(),
  matchType: text("match_type").notNull(), // 'broad', 'phrase', 'exact'
  date: timestamp("date").notNull(),
  impressions: integer("impressions").notNull(),
  clicks: integer("clicks").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  conversions: decimal("conversions", { precision: 8, scale: 2 }).notNull(),
  conversionValue: decimal("conversion_value", { precision: 10, scale: 2 }),
  ctr: decimal("ctr", { precision: 5, scale: 4 }).notNull(),
  cpc: decimal("cpc", { precision: 8, scale: 2 }).notNull(),
  qualityScore: decimal("quality_score", { precision: 4, scale: 1 }), 
  searchImpressionShare: decimal("search_impression_share", { precision: 5, scale: 4 }),
  averagePosition: decimal("average_position", { precision: 4, scale: 1 }),
  competitorBidding: boolean("competitor_bidding").default(false), // Is competition bidding on this keyword
  competitorIntensity: decimal("competitor_intensity", { precision: 4, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ad Creative Performance - Track performance of individual ad creatives
export const adCreatives = pgTable("ad_creatives", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'text', 'image', 'video', 'responsive'
  headline: text("headline"),
  description: text("description"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  callToAction: text("call_to_action"),
  destinationUrl: text("destination_url").notNull(),
  adStrength: text("ad_strength"), // 'poor', 'average', 'good', 'excellent'
  creativeScore: decimal("creative_score", { precision: 4, scale: 1 }), // AI-generated score based on best practices
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ad Creative Performance Metrics
export const adCreativePerformance = pgTable("ad_creative_performance", {
  id: serial("id").primaryKey(),
  adCreativeId: integer("ad_creative_id").references(() => adCreatives.id).notNull(),
  date: timestamp("date").notNull(),
  impressions: integer("impressions").notNull(),
  clicks: integer("clicks").notNull(),
  conversions: decimal("conversions", { precision: 8, scale: 2 }).notNull(),
  ctr: decimal("ctr", { precision: 5, scale: 4 }).notNull(),
  cost: decimal("cost", { precision: 8, scale: 2 }).notNull(),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 4 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// A/B Testing - Configure and track A/B tests for campaigns
export const abTests = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(), // 'active', 'paused', 'completed'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  testVariable: text("test_variable").notNull(), // 'headline', 'description', 'image', 'bidding_strategy', etc.
  controlGroupId: integer("control_group_id"), // Reference to control variant
  winningVariantId: integer("winning_variant_id"), // Reference to winning variant
  confidenceLevel: decimal("confidence_level", { precision: 5, scale: 4 }), // Statistical confidence
  conclusions: text("conclusions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// A/B Test Variants - Individual variants in an A/B test
export const abTestVariants = pgTable("ab_test_variants", {
  id: serial("id").primaryKey(),
  abTestId: integer("ab_test_id").references(() => abTests.id).notNull(),
  name: text("name").notNull(),
  isControl: boolean("is_control").default(false).notNull(),
  value: text("value").notNull(), // The actual variant value being tested
  impressions: integer("impressions").default(0).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  conversions: decimal("conversions", { precision: 8, scale: 2 }).default(0).notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).default(0).notNull(),
  ctr: decimal("ctr", { precision: 5, scale: 4 }),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 4 }),
  cpa: decimal("cpa", { precision: 8, scale: 2 }), 
  improvementPercent: decimal("improvement_percent", { precision: 6, scale: 2 }), // Improvement over control
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Market Conditions - Simulated market conditions that affect campaign performance
export const marketConditions = pgTable("market_conditions", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  industry: text("industry").notNull(),
  competitionLevel: decimal("competition_level", { precision: 4, scale: 2 }).notNull(), // 0-1 scale
  seasonalityFactor: decimal("seasonality_factor", { precision: 4, scale: 2 }).notNull(), // Seasonal impact
  events: json("events").$type<{
    name: string,
    impact: number, // -1.0 to 1.0 impact scale
    affectedChannels: string[]
  }[]>(),
  trendingKeywords: json("trending_keywords").$type<{
    keyword: string,
    volumeIncrease: number, // Percent increase
    competitionIncrease: number // Percent increase
  }[]>(),
  channelPerformance: json("channel_performance").$type<{
    channel: string, // 'search', 'social', 'display', etc.
    performanceIndex: number // 0-10 scale of overall channel performance
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Campaign Audience Insights - Detailed audience performance data
export const audienceInsights = pgTable("audience_insights", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  date: date("date").notNull(),
  ageRange: text("age_range"), // '18-24', '25-34', etc.
  gender: text("gender"), // 'male', 'female', 'unknown'
  location: text("location"),
  device: text("device"), // 'mobile', 'desktop', 'tablet'
  interests: text("interests").array(),
  impressions: integer("impressions").notNull(),
  clicks: integer("clicks").notNull(),
  conversions: decimal("conversions", { precision: 8, scale: 2 }).notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  ctr: decimal("ctr", { precision: 5, scale: 4 }).notNull(),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 4 }).notNull(),
  cpa: decimal("cpa", { precision: 8, scale: 2 }).notNull(),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 4 }),
  audienceAffinityScore: decimal("audience_affinity_score", { precision: 4, scale: 1 }), // How well this audience matches with the campaign
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Simulation Parameters - Configure how simulations run
export const simulationParameters = pgTable("simulation_parameters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  marketSize: decimal("market_size", { precision: 12, scale: 2 }).notNull(), // Total addressable market size
  competitionLevel: decimal("competition_level", { precision: 4, scale: 2 }).notNull(), // 0-1 scale
  seasonalityPatterns: json("seasonality_patterns").$type<{
    month: number, // 1-12
    factor: number // Multiplier for this month
  }[]>().notNull(),
  userBehaviorModel: text("user_behavior_model").notNull(), // Algorithm used to simulate user behavior
  clickThroughModel: text("click_through_model").notNull(), // Algorithm for CTR calculation
  conversionModel: text("conversion_model").notNull(), // Algorithm for conversion calculation
  budgetExhaustionModel: text("budget_exhaustion_model").notNull(), // How budget spending is simulated
  adFatigueModel: text("ad_fatigue_model").notNull(), // How ad performance degrades over time
  randomVariationFactor: decimal("random_variation_factor", { precision: 4, scale: 2 }).notNull(), // How much randomness to include
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Simulation Runs - Track individual simulation runs for campaigns
export const simulationRuns = pgTable("simulation_runs", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  simulationParametersId: integer("simulation_parameters_id").references(() => simulationParameters.id).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(), 
  status: text("status").notNull(), // 'running', 'completed', 'failed'
  resultsData: json("results_data"), // Aggregated results of the simulation
  performanceScore: decimal("performance_score", { precision: 4, scale: 1 }), // Overall performance rating
  insightsGenerated: text("insights_generated").array(), // AI-generated insights
  optimizationSuggestions: json("optimization_suggestions").$type<{
    category: string, // 'bidding', 'targeting', 'creative', etc.
    suggestion: string,
    estimatedImprovement: string
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Campaign Funnel Analytics - Track user journey through the marketing funnel
export const funnelAnalytics = pgTable("funnel_analytics", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  date: date("date").notNull(),
  // Funnel stages
  impressions: integer("impressions").notNull(),
  clicks: integer("clicks").notNull(), 
  landingPageViews: integer("landing_page_views").notNull(),
  productPageViews: integer("product_page_views"),
  addToCarts: integer("add_to_carts"),
  checkoutStarts: integer("checkout_starts"),
  conversions: integer("conversions").notNull(),
  // Funnel metrics
  clickThroughRate: decimal("click_through_rate", { precision: 5, scale: 4 }).notNull(),
  landingPageConversionRate: decimal("landing_page_conversion_rate", { precision: 5, scale: 4 }).notNull(),
  cartAbandonmentRate: decimal("cart_abandonment_rate", { precision: 5, scale: 4 }),
  overallConversionRate: decimal("overall_conversion_rate", { precision: 5, scale: 4 }).notNull(),
  // Funnel analysis
  dropOffPoints: json("drop_off_points").$type<{
    funnelStage: string,
    dropOffRate: number,
    potentialIssues: string[]
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertCampaignPerformanceMetricsSchema = createInsertSchema(campaignPerformanceMetrics).omit({ id: true, createdAt: true, updatedAt: true });
export const insertKeywordPerformanceSchema = createInsertSchema(keywordPerformance).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAdCreativesSchema = createInsertSchema(adCreatives).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAdCreativePerformanceSchema = createInsertSchema(adCreativePerformance).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAbTestsSchema = createInsertSchema(abTests).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAbTestVariantsSchema = createInsertSchema(abTestVariants).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMarketConditionsSchema = createInsertSchema(marketConditions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAudienceInsightsSchema = createInsertSchema(audienceInsights).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSimulationParametersSchema = createInsertSchema(simulationParameters).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSimulationRunsSchema = createInsertSchema(simulationRuns).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFunnelAnalyticsSchema = createInsertSchema(funnelAnalytics).omit({ id: true, createdAt: true, updatedAt: true });

// Export simulation engine types
export type CampaignPerformanceMetrics = typeof campaignPerformanceMetrics.$inferSelect;
export type KeywordPerformance = typeof keywordPerformance.$inferSelect;
export type AdCreative = typeof adCreatives.$inferSelect;
export type AdCreativePerformance = typeof adCreativePerformance.$inferSelect;
export type ABTest = typeof abTests.$inferSelect;
export type ABTestVariant = typeof abTestVariants.$inferSelect;
export type MarketCondition = typeof marketConditions.$inferSelect;
export type AudienceInsight = typeof audienceInsights.$inferSelect;
export type SimulationParameter = typeof simulationParameters.$inferSelect;
export type SimulationRun = typeof simulationRuns.$inferSelect;
export type FunnelAnalytic = typeof funnelAnalytics.$inferSelect;

export type InsertCampaignPerformanceMetrics = z.infer<typeof insertCampaignPerformanceMetricsSchema>;
export type InsertKeywordPerformance = z.infer<typeof insertKeywordPerformanceSchema>;
export type InsertAdCreative = z.infer<typeof insertAdCreativesSchema>;
export type InsertAdCreativePerformance = z.infer<typeof insertAdCreativePerformanceSchema>;
export type InsertABTest = z.infer<typeof insertAbTestsSchema>;
export type InsertABTestVariant = z.infer<typeof insertAbTestVariantsSchema>;
export type InsertMarketCondition = z.infer<typeof insertMarketConditionsSchema>;
export type InsertAudienceInsight = z.infer<typeof insertAudienceInsightsSchema>;
export type InsertSimulationParameter = z.infer<typeof insertSimulationParametersSchema>;
export type InsertSimulationRun = z.infer<typeof insertSimulationRunsSchema>;
export type InsertFunnelAnalytic = z.infer<typeof insertFunnelAnalyticsSchema>;

// Export types
export type DataVisualizationChallenge = typeof dataVisualizationChallenges.$inferSelect;
export type DataVisualizationAttempt = typeof dataVisualizationAttempts.$inferSelect;
export type InsertDataVisualizationChallenge = z.infer<typeof insertDataVisualizationChallengeSchema>;
export type InsertDataVisualizationAttempt = z.infer<typeof insertDataVisualizationAttemptSchema>;
import { pgTable, text, serial, integer, json, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const personas = pgTable("personas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ageRange: json("age_range").$type<{min: number, max: number}>().notNull(),
  gender: text("gender").notNull(),
  location: text("location").notNull(),
  interests: text("interests").array().notNull(),
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
export const insertPersonaSchema = createInsertSchema(personas);

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
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
  goal: text("goal").notNull(),
  dailyBudget: decimal("daily_budget").notNull(),
  keywords: text("keywords").array().notNull(),
  adHeadline1: text("ad_headline_1").notNull(),
  adHeadline2: text("ad_headline_2").notNull(),
  adDescription: text("ad_description").notNull(),
  personaId: integer("persona_id").references(() => personas.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const simulationData = pgTable("simulation_data", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  impressions: integer("impressions").notNull(),
  clicks: integer("clicks").notNull(),
  conversions: integer("conversions").notNull(),
  cost: decimal("cost").notNull(),
  date: timestamp("date").notNull(),
});

export const insertPersonaSchema = createInsertSchema(personas);
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ createdAt: true });
export const insertSimulationDataSchema = createInsertSchema(simulationData);

export type Persona = typeof personas.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type SimulationData = typeof simulationData.$inferSelect;
export type InsertPersona = z.infer<typeof insertPersonaSchema>;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type InsertSimulationData = z.infer<typeof insertSimulationDataSchema>;

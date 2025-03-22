// user.ts
import { pgTable, serial, text, integer, timestamp } from "some-db-lib";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  level: text("level").notNull().default('Beginner'),
  xp: integer("xp").notNull().default(0),
  specializations: text("specializations").array(),
  achievements: text("achievements").array(),
  completedChallenges: text("completed_challenges").array(),
  collaborations: integer("collaborations").array(),
  mentorshipScore: integer("mentorship_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userDiscussions = pgTable("user_discussions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  topic: text("topic").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  replies: integer("replies").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userCollaborations = pgTable("user_collaborations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  projectId: integer("project_id").notNull(),
  role: text("role").notNull(),
  contribution: text("contribution").notNull(),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Function to update user level based on performance
async function updateUserLevel(userId: number, performanceScore: number) {
  const newLevel = Math.min(Math.floor(performanceScore / 20) + 1, 6); // Simple leveling logic
  await db.update(users).set({ level: newLevel }).where({ id: userId });
}
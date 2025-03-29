// user.ts
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { db } from "./server/db";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
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
  // Convert numerical level to string level based on performance score
  let levelString: string;
  const newLevelNum = Math.min(Math.floor(performanceScore / 20) + 1, 6); // Simple leveling logic
  
  switch(newLevelNum) {
    case 1:
      levelString = 'Beginner';
      break;
    case 2:
      levelString = 'Intermediate';
      break;
    case 3:
      levelString = 'Advanced';
      break;
    case 4:
      levelString = 'Expert';
      break;
    case 5:
      levelString = 'Master';
      break;
    case 6:
      levelString = 'Legend';
      break;
    default:
      levelString = 'Beginner';
  }
  
  await db.update(users).set({ level: levelString }).where(eq(users.id, userId));
}
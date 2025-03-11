// user.ts
import { pgTable, serial, text, integer, timestamp } from "some-db-lib";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  level: integer("level").notNull().default(1), // Levels 1-6
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Function to update user level based on performance
async function updateUserLevel(userId: number, performanceScore: number) {
  const newLevel = Math.min(Math.floor(performanceScore / 20) + 1, 6); // Simple leveling logic
  await db.update(users).set({ level: newLevel }).where({ id: userId });
}
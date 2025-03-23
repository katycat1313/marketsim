import * as fs from 'fs';
import * as path from 'path';
import { db } from '../db';
import { userProfiles } from '@shared/schema';

export interface Tutorial {
  id: number;
  title: string;
  level: string;
  content: string;
  tasks: TutorialTask[];
  estimatedTime: number;
  skillsLearned: string[];
}

interface TutorialTask {
  id: number;
  description: string;
  type: 'quiz' | 'practical' | 'simulation';
  requirements: string[];
  verificationCriteria: string[];
}

export class TutorialService {
  private tutorials: Tutorial[] = [
    {
      id: 1,
      title: "Google Ads Mastery: From Setup to Success",
      level: "Beginner",
      content: this.loadTutorialContent('chapter1-1.ts'),
      tasks: [
        {
          id: 101,
          description: "Set up your first Google Ads account",
          type: "practical",
          requirements: ["Google account", "Website URL"],
          verificationCriteria: ["Account created", "Billing information added"]
        },
        {
          id: 102,
          description: "Create your first campaign structure",
          type: "practical",
          requirements: ["Google Ads account"],
          verificationCriteria: ["Campaign created", "Ad groups defined", "Keywords selected"]
        }
      ],
      estimatedTime: 60, // minutes
      skillsLearned: ["Google Ads Fundamentals", "Account Setup", "Campaign Structure Basics"]
    },
    {
      id: 2,
      title: "Discovering the Power of Google Ads",
      level: "Beginner",
      content: this.loadTutorialContent('chapter1-2.ts'),
      tasks: [
        {
          id: 201,
          description: "Analyze your target audience",
          type: "practical",
          requirements: ["Market research template"],
          verificationCriteria: ["Audience segments defined", "Demographics identified", "Interests mapped"]
        },
        {
          id: 202,
          description: "Complete the PPC planning quiz",
          type: "quiz",
          requirements: ["Lesson completion"],
          verificationCriteria: ["80% or higher score"]
        }
      ],
      estimatedTime: 45,
      skillsLearned: ["Audience Analysis", "PPC Strategy", "Marketing Objectives Alignment"]
    },
    {
      id: 3,
      title: "Understanding Google Ads",
      level: "Intermediate",
      content: this.loadTutorialContent('chapter2-1.ts'),
      tasks: [
        {
          id: 301,
          description: "Analyze different campaign types",
          type: "practical",
          requirements: ["Google Ads account", "Marketing objectives"],
          verificationCriteria: ["Campaign type comparison completed", "Appropriate types selected for objectives"]
        },
        {
          id: 302,
          description: "PPC Fundamentals Assessment",
          type: "quiz",
          requirements: ["Completed readings"],
          verificationCriteria: ["90% or higher score"]
        }
      ],
      estimatedTime: 50,
      skillsLearned: ["Campaign Type Selection", "Budget Allocation", "PPC Strategy Development"]
    },
    {
      id: 4,
      title: "Campaign Types in Google Ads",
      level: "Intermediate",
      content: this.loadTutorialContent('chapter2-2.ts'),
      tasks: [
        {
          id: 401,
          description: "Create a multi-channel campaign strategy",
          type: "practical",
          requirements: ["Google Ads account", "Marketing objectives", "Budget plan"],
          verificationCriteria: ["Strategy document created", "Channel selection justified", "Budget allocation defined"]
        },
        {
          id: 402,
          description: "Run a campaign simulation",
          type: "simulation",
          requirements: ["Completed strategy"],
          verificationCriteria: ["Simulation completed", "Performance metrics analyzed", "Optimization opportunities identified"]
        }
      ],
      estimatedTime: 75,
      skillsLearned: ["Multi-channel Strategy", "Campaign Performance Analysis", "Budget Optimization"]
    }
  ];

  private loadTutorialContent(filename: string): string {
    try {
      const filePath = path.join(__dirname, '..', 'data', 'tutorials', filename);
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(`Error loading tutorial content from ${filename}:`, error);
      return "Tutorial content unavailable. Please try again later.";
    }
  }

  async getTutorials(userLevel: string): Promise<Tutorial[]> {
    // Get tutorials appropriate for the user's level
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const userLevelIndex = levels.indexOf(userLevel);
    
    if (userLevelIndex === -1) {
      // If level is not recognized, return beginner tutorials
      return this.tutorials.filter(t => t.level === 'Beginner');
    }
    
    // Return tutorials at the user's level and below
    const availableLevels = levels.slice(0, userLevelIndex + 1);
    return this.tutorials.filter(t => availableLevels.includes(t.level));
  }

  async getUserProgress(userId: number): Promise<number[]> {
    // In a real implementation, we would fetch the user's completed tutorials from a database
    // For now, we'll return an empty array (no completed tutorials)
    if (!userId) return [];
    
    try {
      // This is a placeholder - in a real implementation, you would query a user_tutorials table
      return [1, 2]; // Assuming tutorials 1 and 2 are completed
    } catch (error) {
      console.error('Error getting user tutorial progress:', error);
      return [];
    }
  }

  async markTutorialComplete(userId: number, tutorialId: number): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    
    // Here we would typically record the completion in a user_tutorials table
    // For now, we'll just log that the tutorial was completed
    
    try {
      // This is a placeholder - in a real implementation, you would insert into a user_tutorials table
      console.log(`User ${userId} completed tutorial ${tutorialId}`);
      
      // Update user experience points as an incentive
      await db.update(userProfiles)
        .set({
          experiencePoints: db.raw(`"experiencePoints" + 50`), // Award 50 XP for completing a tutorial
          updatedAt: new Date().toISOString()
        })
        .where({ userId: userId });
    } catch (error) {
      console.error('Error marking tutorial as complete:', error);
      throw new Error('Failed to mark tutorial as complete');
    }
  }
}
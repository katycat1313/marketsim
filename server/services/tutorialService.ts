import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { db, pool } from '../db';
import { userProfiles } from '@shared/schema';

export interface Tutorial {
  id: number;
  title: string;
  level: string;
  content: string;
  tasks: TutorialTask[];
  estimatedTime: number;
  skillsLearned: string[];
  hasSimulation?: boolean; // Flag to indicate if this tutorial has an associated simulation
  chapterNumber?: number; // Added to track chapter
  isPremium?: boolean; // Flag to indicate if this is premium content
}

interface TutorialTask {
  id: number;
  description: string;
  type: 'quiz' | 'practical' | 'simulation';
  requirements: string[];
  verificationCriteria: string[];
}

export class TutorialService {
  private tutorials: Tutorial[] = [];
  
  constructor() {
    this.loadDefaultTutorials();
  }
  
  private loadDefaultTutorials() {
    console.log('Loading default tutorials with premium content...');
    
    // Add premium AI content (Chapter 9)
    this.tutorials = [
      // CHAPTER 9: AI-Powered Marketing (PREMIUM CONTENT)
      {
        id: 901,
        title: "AI-Powered SEO Content: Rank Higher, Convert Better",
        level: "Advanced",
        content: `# AI-Powered SEO Content Creation

## Introduction to ZOOMi
Meet ZOOMi, your intelligent AI marketing assistant. ZOOMi is designed to help you create optimized content that ranks higher and converts better through advanced natural language processing and market analysis.

## How ZOOMi Enhances Your SEO Strategy

ZOOMi analyzes top-performing content in your niche and identifies:
- Semantic keyword opportunities
- Content gaps in your industry
- User intent patterns
- Optimal content structures for your target audience

## Implementing AI-Driven SEO
In this tutorial, you'll learn how to:
1. Use ZOOMi to analyze your competitors' content
2. Generate topic clusters optimized for search intent
3. Create content briefs with semantic keyword mapping
4. Develop a content calendar based on opportunity analysis
5. Measure and iterate on content performance

Let ZOOMi take your SEO strategy to the next level with data-driven insights and AI-powered optimization.`,
        tasks: [
          {
            id: 901001,
            description: "Conduct AI-powered competitor content analysis",
            type: "practical",
            requirements: ["ZOOMi access", "List of competitors"],
            verificationCriteria: ["Analysis report generated", "Key insights identified"]
          },
          {
            id: 901002,
            description: "Create AI-optimized content brief",
            type: "practical",
            requirements: ["Target keywords", "User personas"],
            verificationCriteria: ["Brief includes semantic keywords", "Addresses user intent"]
          }
        ],
        estimatedTime: 90,
        skillsLearned: ["AI-Powered Content Optimization", "Semantic SEO", "Content Intelligence"],
        chapterNumber: 9,
        isPremium: true
      },
      {
        id: 902,
        title: "Predictive Analytics for Campaign Performance",
        level: "Advanced",
        content: `# Predictive Analytics with ZOOMi

## Using AI to Forecast Campaign Performance

ZOOMi's predictive analytics engine helps you anticipate campaign performance before you launch. Using historical data and market trends, ZOOMi can predict:

- Expected click-through rates
- Conversion probabilities
- Budget optimization opportunities
- Audience segment performance

## Implementing Predictive Campaign Analysis

This tutorial guides you through:
1. Setting up ZOOMi's predictive modeling for your campaigns
2. Interpreting AI-generated performance forecasts
3. Using prediction confidence intervals to manage expectations
4. Applying predictive insights to campaign planning
5. Continuously improving your forecasting accuracy

Make data-driven decisions before you spend your budget, not after.`,
        tasks: [
          {
            id: 902001,
            description: "Configure ZOOMi's predictive models for your business",
            type: "practical",
            requirements: ["Historical campaign data", "Business KPIs"],
            verificationCriteria: ["Models calibrated", "Baseline forecasts generated"]
          }
        ],
        estimatedTime: 85,
        skillsLearned: ["Predictive Analytics", "AI-Driven Campaign Planning", "Performance Forecasting"],
        chapterNumber: 9,
        isPremium: true
      },
      {
        id: 903,
        title: "Conversational Marketing with ZOOMi",
        level: "Advanced",
        content: `# Conversational Marketing Automation

## Creating Personalized Customer Experiences

ZOOMi can power your conversational marketing strategy through:
- AI-driven chatbots that understand customer intent
- Personalized recommendation engines
- Automated customer journey orchestration
- Context-aware messaging

## Building Your Conversational Marketing Strategy

In this premium tutorial, you'll learn to:
1. Design conversation flows that feel natural and helpful
2. Train ZOOMi on your brand voice and product knowledge
3. Implement progressive profiling to gather customer data naturally
4. Set up intelligent routing between automation and human support
5. Analyze conversation data for continuous improvement

Transform customer interactions from transactions to relationships with AI-powered conversations.`,
        tasks: [
          {
            id: 903001,
            description: "Design conversational flows with ZOOMi",
            type: "practical",
            requirements: ["Customer journey maps", "Common questions"],
            verificationCriteria: ["Conversation flows created", "Intents mapped"]
          }
        ],
        estimatedTime: 80,
        skillsLearned: ["Conversational Marketing", "AI Chatbot Design", "Natural Language Processing"],
        chapterNumber: 9,
        isPremium: true
      }
    ];
    
    // Add some standard tutorials for other chapters too
    this.tutorials.push(
      // CHAPTER 1 sample
      {
        id: 101,
        title: "Getting Started with Digital Marketing",
        level: "Beginner",
        content: `# Introduction to Digital Marketing

Digital marketing encompasses all marketing efforts that use an electronic device or the internet. Businesses leverage digital channels such as search engines, social media, email, and websites to connect with current and prospective customers.

## Why Digital Marketing Matters

- Reach your audience where they spend their time
- Cost-effective compared to traditional marketing
- Precisely target your ideal customers
- Measure results accurately
- Adapt quickly based on real-time data

## Digital Marketing Channels

1. **Search Engine Optimization (SEO)**
2. **Pay-Per-Click Advertising (PPC)**
3. **Social Media Marketing**
4. **Content Marketing**
5. **Email Marketing**
6. **Mobile Marketing**

## Setting Your Digital Marketing Goals

Before diving into tactics, it's important to establish clear goals. Common digital marketing objectives include:

- Increasing brand awareness
- Generating leads
- Driving sales
- Building customer loyalty
- Establishing thought leadership

## Measuring Success

Digital marketing allows for precise measurement through various metrics:

- Website traffic
- Conversion rate
- Cost per lead
- Customer acquisition cost
- Return on investment

This tutorial will guide you through building your first digital marketing strategy.`,
        tasks: [
          {
            id: 101001,
            description: "Define your digital marketing goals",
            type: "practical",
            requirements: ["Business objectives"],
            verificationCriteria: ["SMART goals documented"]
          }
        ],
        estimatedTime: 45,
        skillsLearned: ["Digital Marketing Fundamentals", "Marketing Strategy", "Goal Setting"],
        chapterNumber: 1
      },
      // CHAPTER 2 sample
      {
        id: 201,
        title: "Understanding Google Ads Platform",
        level: "Beginner",
        content: `# Google Ads Platform Overview

Google Ads is Google's online advertising platform that allows businesses to display ads on Google's search results and its advertising network.

## Key Components of Google Ads

- **Campaigns**: The highest level of organization
- **Ad Groups**: Contains your ads and keywords
- **Keywords**: Terms that trigger your ads
- **Ads**: The actual advertisements shown to users
- **Extensions**: Additional information that enhances your ads

## Campaign Types

1. **Search Campaigns**: Text ads on search results
2. **Display Campaigns**: Visual ads on websites
3. **Video Campaigns**: Video ads on YouTube
4. **Shopping Campaigns**: Product listings
5. **App Campaigns**: Promote mobile applications

## Account Structure Best Practices

- Organize campaigns by product/service lines
- Group similar keywords together
- Create ad groups with tight thematic focus
- Implement proper tracking for conversion actions

In this tutorial, you'll learn how to set up your Google Ads account structure for optimal performance.`,
        tasks: [
          {
            id: 201001,
            description: "Set up your first campaign",
            type: "practical",
            requirements: ["Google Ads account"],
            verificationCriteria: ["Campaign created", "Ad groups structured"]
          }
        ],
        estimatedTime: 60,
        skillsLearned: ["Campaign Structure", "Ad Setup", "Account Organization"],
        chapterNumber: 2
      }
    );
    
    console.log(`Loaded ${this.tutorials.length} default tutorials including premium content`);
  }

  /**
   * Get tutorials filtered by user level
   */
  async getTutorials(userLevel: string): Promise<Tutorial[]> {
    // If tutorials not loaded, ensure they are
    if (this.tutorials.length === 0) {
      this.loadDefaultTutorials();
    }
    
    // For simplicity, we're returning all tutorials here
    // In a real implementation, you could filter by user level
    console.log(`Returning ${this.tutorials.length} tutorials for user level: ${userLevel}`);
    
    // Sort tutorials by chapter number for presentation
    return this.sortTutorialsByChapter(this.tutorials);
  }
  
  /**
   * Sort tutorials by chapter number for proper display order
   */
  private sortTutorialsByChapter(tutorials: Tutorial[]): Tutorial[] {
    return [...tutorials].sort((a, b) => {
      // First by chapter number
      const chapterComparison = (a.chapterNumber || 999) - (b.chapterNumber || 999);
      if (chapterComparison !== 0) return chapterComparison;
      
      // Then by ID within the same chapter
      return a.id - b.id;
    });
  }
  
  /**
   * Get completed tutorial IDs for a specific user
   */
  async getUserProgress(userId: number): Promise<number[]> {
    try {
      const result = await pool.query(
        'SELECT tutorial_id FROM user_tutorial_progress WHERE user_id = $1',
        [userId]
      );
      
      // Extract tutorial IDs from results
      const completedTutorials = result.rows.map(row => row.tutorial_id);
      console.log(`Found ${completedTutorials.length} completed tutorials for user ${userId}`);
      
      return completedTutorials;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }
  
  /**
   * Mark a tutorial as completed for a user
   */
  async markTutorialComplete(userId: number, tutorialId: number): Promise<void> {
    try {
      // Check if already completed
      const existsResult = await pool.query(
        'SELECT * FROM user_tutorial_progress WHERE user_id = $1 AND tutorial_id = $2',
        [userId, tutorialId]
      );
      
      if (existsResult.rows.length === 0) {
        // Not yet completed, insert new record
        await pool.query(
          'INSERT INTO user_tutorial_progress(user_id, tutorial_id, completed_at) VALUES($1, $2, NOW())',
          [userId, tutorialId]
        );
        
        // Add XP to user profile for completing a tutorial
        await this.addUserXP(userId, 50); // 50 XP per tutorial completion
        console.log(`Tutorial ${tutorialId} marked complete for user ${userId} with XP reward`);
      }
    } catch (error) {
      console.error('Error marking tutorial completion:', error);
    }
  }
  
  /**
   * Add XP to user profile and handle level progression
   */
  private async addUserXP(userId: number, xpAmount: number): Promise<void> {
    try {
      // First get current XP and level
      const userResult = await db.select()
        .from(userProfiles)
        .where(({ eq }) => eq(userProfiles.userId, userId))
        .limit(1);
      
      if (userResult.length === 0) {
        console.log(`User profile not found for user ${userId}`);
        return;
      }
      
      const userProfile = userResult[0];
      const currentXP = userProfile.xp || 0;
      const newXP = currentXP + xpAmount;
      
      // Update user XP
      await db.update(userProfiles)
        .set({ xp: newXP })
        .where(({ eq }) => eq(userProfiles.userId, userId));
      
      console.log(`Added ${xpAmount} XP for user ${userId}. New total: ${newXP}`);
      
      // Check for level progression
      await this.checkLevelProgression(userId, newXP);
    } catch (error) {
      console.error('Error adding XP to user:', error);
    }
  }
  
  /**
   * Check and update user level based on XP thresholds
   */
  private async checkLevelProgression(userId: number, currentXP: number): Promise<void> {
    try {
      // Define XP thresholds for levels
      const levels = [
        { name: "Beginner", threshold: 0 },
        { name: "Rookie", threshold: 100 },
        { name: "Intermediate", threshold: 500 },
        { name: "Advanced", threshold: 1000 },
        { name: "Expert", threshold: 3000 },
        { name: "Master", threshold: 5000 }
      ];
      
      // Find highest level user qualifies for
      let newLevel = "Beginner";
      for (let i = levels.length - 1; i >= 0; i--) {
        if (currentXP >= levels[i].threshold) {
          newLevel = levels[i].name;
          break;
        }
      }
      
      // Get current level
      const userResult = await db.select()
        .from(userProfiles)
        .where(({ eq }) => eq(userProfiles.userId, userId))
        .limit(1);
      
      if (userResult.length > 0) {
        const currentLevel = userResult[0].level || "Beginner";
        
        // Update if level changed
        if (currentLevel !== newLevel) {
          await db.update(userProfiles)
            .set({ level: newLevel })
            .where(({ eq }) => eq(userProfiles.userId, userId));
          
          console.log(`User ${userId} leveled up from ${currentLevel} to ${newLevel}!`);
        }
      }
    } catch (error) {
      console.error('Error checking level progression:', error);
    }
  }
  
  /**
   * Get a specific tutorial by ID
   */
  async getTutorialById(tutorialId: number): Promise<Tutorial | null> {
    // If tutorials not loaded, ensure they are
    if (this.tutorials.length === 0) {
      this.loadDefaultTutorials();
    }
    
    const tutorial = this.tutorials.find(t => t.id === tutorialId);
    return tutorial || null;
  }
}

// Create singleton instance
export const tutorialService = new TutorialService();
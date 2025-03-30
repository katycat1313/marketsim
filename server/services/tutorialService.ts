import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { db, pool } from '../db';
import { sql } from 'drizzle-orm';
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
  
  /**
   * Load tutorial content from file
   */
  private async loadTutorialContent(filename: string): Promise<string> {
    try {
      // Use dynamic import with ES modules pattern
      try {
        // Use dynamic import to load the module
        const tutorialModule = await import(`../data/tutorial/${filename}`);
        
        // Return the content from the module
        if (tutorialModule.content) {
          return tutorialModule.content;
        } else if (tutorialModule.default) {
          return tutorialModule.default;
        }
        
        throw new Error(`No valid content export found in ${filename}`);
      } catch (importError) {
        console.error(`Error importing module ${filename}:`, importError);
        return "Error loading content. Please try again later.";
      }
    } catch (error) {
      console.error(`Error loading tutorial content from ${filename}:`, error);
      return "Content could not be loaded. Please try again later.";
    }
  }

  /**
   * Load default tutorial data
   */
  private async loadDefaultTutorials(): Promise<void> {
    try {
      // First load all the AI in Digital Marketing content
      const lesson1Content = await this.loadTutorialContent('chapter10-1-FoundationsofAIinDigital Marketing.ts');
      const lesson2Content = await this.loadTutorialContent('chapter10-2-TheAIShift.ts');
      const lesson3Content = await this.loadTutorialContent('chapter10-3-DemocratizationofTechnology.ts');
      const lesson4Content = await this.loadTutorialContent('chapter10-4-ChallengeandOpportunity.ts');
      const lesson5Content = await this.loadTutorialContent('chapter10-5-UnlockingThePowerOfAIMarketing.ts');
    // Chapter 1: Digital Marketing Fundamentals
    this.tutorials.push({
      id: 1,
      chapterNumber: 1,
      title: "Understanding Digital Marketing Fundamentals",
      level: "Beginner",
      content: "Introduction to digital marketing concepts, platforms, and key metrics.",
      estimatedTime: 30,
      skillsLearned: ["Digital Marketing Basics", "Marketing Terminology"],
      tasks: [{
        id: 1,
        description: "Complete the digital marketing concepts quiz",
        type: "quiz",
        requirements: ["Review all content"],
        verificationCriteria: ["Score at least 7/10 on the quiz"]
      }]
    });
    
    this.tutorials.push({
      id: 2,
      chapterNumber: 1,
      title: "Setting Marketing Goals and KPIs",
      level: "Beginner",
      content: "Learn how to set SMART marketing goals and select the right KPIs to track success.",
      estimatedTime: 45,
      skillsLearned: ["Goal Setting", "KPI Selection", "Marketing Measurement"],
      tasks: [{
        id: 1,
        description: "Create your first marketing goals document",
        type: "practical",
        requirements: ["Apply SMART framework to your goals"],
        verificationCriteria: ["Document contains at least 3 SMART goals", "Each goal has associated KPIs"]
      }]
    });
    
    // Chapter 2: Google Ads Fundamentals
    this.tutorials.push({
      id: 3,
      chapterNumber: 2,
      title: "Google Ads Campaign Structure",
      level: "Beginner",
      content: "Learn how to structure effective Google Ads campaigns for optimal performance.",
      estimatedTime: 60,
      skillsLearned: ["Google Ads Basics", "Campaign Organization", "Account Structure"],
      hasSimulation: true,
      tasks: [{
        id: 1,
        description: "Create a mock Google Ads campaign structure",
        type: "simulation",
        requirements: ["Complete all sections of the simulator"],
        verificationCriteria: ["Campaign includes at least 2 ad groups", "Each ad group has relevant keywords"]
      }]
    });
    
    this.tutorials.push({
      id: 4,
      chapterNumber: 2,
      title: "Google Ads Keyword Research",
      level: "Intermediate",
      content: "Master the art of keyword research for Google Ads campaigns.",
      estimatedTime: 75,
      skillsLearned: ["Keyword Research", "Search Intent Analysis", "Competitor Analysis"],
      tasks: [{
        id: 1,
        description: "Build a comprehensive keyword list for a sample business",
        type: "practical",
        requirements: ["Use keyword research tools", "Analyze search intent"],
        verificationCriteria: ["List contains min. 50 keywords", "Keywords are organized by theme", "Search volume data included"]
      }]
    });
    
    // Chapter 3: SEO Foundations
    this.tutorials.push({
      id: 5,
      chapterNumber: 3,
      title: "SEO Fundamentals: On-Page Optimization",
      level: "Beginner",
      content: "Learn the basics of on-page SEO to improve organic visibility.",
      estimatedTime: 90,
      skillsLearned: ["On-Page SEO", "Content Optimization", "HTML SEO Elements"],
      tasks: [{
        id: 1,
        description: "Optimize a sample webpage for SEO",
        type: "practical",
        requirements: ["Apply on-page optimization techniques"],
        verificationCriteria: ["Title tag optimized", "Meta description improved", "Header structure reorganized", "Content optimized for target keyword"]
      }]
    });
    
    // Chapter 4: Marketing Objectives & Testing
    this.tutorials.push({
      id: 6,
      chapterNumber: 4,
      title: "Social Media Strategy Development",
      level: "Intermediate",
      content: "Create comprehensive social media strategies for business goals.",
      estimatedTime: 120,
      skillsLearned: ["Social Strategy", "Platform Selection", "Content Planning"],
      isPremium: true,
      tasks: [{
        id: 1,
        description: "Develop a 30-day social media content plan",
        type: "practical",
        requirements: ["Create platform-specific strategies", "Develop content calendar"],
        verificationCriteria: ["Plan includes at least 3 platforms", "Content themes identified", "Posting schedule defined"]
      }]
    });
    
    // Chapter 5: Analytics & Measurement
    this.tutorials.push({
      id: 7,
      chapterNumber: 5,
      title: "Marketing Analytics Fundamentals",
      level: "Intermediate",
      content: "Learn how to analyze marketing data and extract actionable insights.",
      estimatedTime: 150,
      skillsLearned: ["Data Analysis", "Report Creation", "Insight Generation"],
      hasSimulation: true,
      tasks: [{
        id: 1,
        description: "Analyze a dataset and create a marketing report",
        type: "simulation",
        requirements: ["Work with the provided analytics dataset"],
        verificationCriteria: ["Key trends identified", "Data visualizations created", "Actionable recommendations provided"]
      }]
    });
    
    // Chapter 6: Marketing Channels & Strategies
    this.tutorials.push({
      id: 8,
      chapterNumber: 6,
      title: "Email Marketing Automation",
      level: "Advanced",
      content: "Master email marketing automation for improved customer journeys.",
      estimatedTime: 180,
      skillsLearned: ["Email Automation", "Segmentation", "Workflow Design"],
      isPremium: true,
      tasks: [{
        id: 1,
        description: "Build an automated email workflow",
        type: "practical",
        requirements: ["Design trigger-based automation", "Create email templates"],
        verificationCriteria: ["Workflow includes at least 5 steps", "Segmentation logic defined", "Email templates created"]
      }]
    });
    
    // Chapter 7: SEO Mastery
    this.tutorials.push({
      id: 9,
      chapterNumber: 7,
      title: "A/B Testing Fundamentals",
      level: "Intermediate",
      content: "Learn how to design, run and analyze A/B tests to optimize marketing performance.",
      estimatedTime: 120,
      skillsLearned: ["Test Design", "Statistical Analysis", "Conversion Optimization"],
      hasSimulation: true,
      tasks: [{
        id: 1,
        description: "Design and run an A/B test simulation",
        type: "simulation",
        requirements: ["Use the A/B test workshop tool"],
        verificationCriteria: ["Test hypothesis clearly defined", "Variables identified", "Results correctly analyzed"]
      }]
    });
    
    // Chapter 8: Troubleshooting & Best Practices
    this.tutorials.push({
      id: 10,
      chapterNumber: 8,
      title: "Paid Social Advertising Masterclass",
      level: "Advanced",
      content: "Advanced strategies for paid social media campaigns across multiple platforms.",
      estimatedTime: 210,
      skillsLearned: ["Paid Social", "Audience Targeting", "Cross-Platform Strategy"],
      isPremium: true,
      tasks: [{
        id: 1,
        description: "Create a multi-platform paid social strategy",
        type: "practical",
        requirements: ["Develop strategies for 3+ platforms", "Create targeting plans"],
        verificationCriteria: ["Platform-specific approaches defined", "Audience segments identified", "Budget allocation justified"]
      }]
    });
    
    // Chapter 9: Content Marketing & Authority
    this.tutorials.push({
      id: 11,
      chapterNumber: 9,
      title: "Content Marketing Strategy",
      level: "Intermediate",
      content: "Learn how to develop a comprehensive content marketing strategy.",
      estimatedTime: 180,
      skillsLearned: ["Content Strategy", "Editorial Planning", "Content Distribution"],
      isPremium: true,
      tasks: [{
        id: 1,
        description: "Create a 3-month content marketing plan",
        type: "practical",
        requirements: ["Identify target audience", "Plan content creation and distribution"],
        verificationCriteria: ["Audience personas defined", "Content calendar created", "Distribution channels identified"]
      }]
    });
    
    // Chapter 10: AI in Digital Marketing (Renamed from Conversion Optimization)
    // New Chapter 10 lessons focusing on AI in Digital Marketing
    this.tutorials.push({
      id: 1001,
      chapterNumber: 10,
      title: "The AI Marketing Revolution – A New Paradigm",
      level: "Intermediate",
      content: this.loadTutorialContent('chapter10-1-FoundationsofAIinDigital Marketing.ts'),
      estimatedTime: 45,
      skillsLearned: ["AI Marketing Fundamentals", "Marketing Transformation", "Digital Disruption"],
      tasks: [{
        id: 100101,
        description: "Identify AI's impact on your marketing strategy",
        type: "practical",
        requirements: ["Use AI to analyze your current marketing approach"],
        verificationCriteria: ["Identified at least 3 areas for AI integration", "Created a preliminary AI adoption plan"]
      }]
    });
    
    this.tutorials.push({
      id: 1002,
      chapterNumber: 10,
      title: "The AI Shift – From Buzzword to Backbone",
      level: "Intermediate",
      content: this.loadTutorialContent('chapter10-2-TheAIShift.ts'),
      estimatedTime: 50,
      skillsLearned: ["Predictive Analytics", "Hyper-Personalization", "Workflow Automation"],
      tasks: [{
        id: 100201,
        description: "Design a hyper-personalized email campaign",
        type: "practical",
        requirements: ["Use AI to segment your audience", "Create personalized messaging"],
        verificationCriteria: ["At least 3 customer segments identified", "Personalized content for each segment", "Implementation plan for automation"]
      }]
    });
    
    this.tutorials.push({
      id: 1003,
      chapterNumber: 10,
      title: "Democratization of Technology – Power to the People",
      level: "Intermediate",
      content: this.loadTutorialContent('chapter10-3-DemocratizationofTechnology.ts'),
      estimatedTime: 60,
      skillsLearned: ["AI Tool Selection", "Affordable Technology", "Small Business AI Strategy"],
      tasks: [{
        id: 100301,
        description: "Explore democratized AI tools for your business",
        type: "practical",
        requirements: ["Research affordable AI solutions", "Evaluate tools based on your needs"],
        verificationCriteria: ["Selected appropriate tools for content, targeting, and analytics", "Documented implementation considerations", "Estimated ROI analysis"]
      }]
    });
    
    this.tutorials.push({
      id: 1004,
      chapterNumber: 10,
      title: "Challenge and Opportunity – Embracing the Learning Curve",
      level: "Intermediate",
      content: this.loadTutorialContent('chapter10-4-ChallengeandOpportunity.ts'),
      estimatedTime: 55,
      skillsLearned: ["AI Adoption Strategies", "Change Management", "Learning Plan Development"],
      tasks: [{
        id: 100401,
        description: "Create your AI learning plan",
        type: "practical",
        requirements: ["Identify your biggest AI adoption challenges", "Develop a step-by-step learning roadmap"],
        verificationCriteria: ["Honest assessment of current skills", "Specific learning resources identified", "Realistic timeline for implementation"]
      }]
    });
    
    this.tutorials.push({
      id: 1005,
      chapterNumber: 10,
      title: "Key Benefits – Unlocking the Power of AI in Marketing",
      level: "Advanced",
      content: this.loadTutorialContent('chapter10-5-UnlockingThePowerOfAIMarketing.ts'),
      estimatedTime: 65,
      skillsLearned: ["Audience Connection", "Automated Marketing", "Data-Driven Decision Making"],
      tasks: [{
        id: 100501,
        description: "Apply AI benefits to your marketing strategy",
        type: "simulation",
        requirements: ["Identify which AI benefit has greatest potential for your business", "Plan implementation of selected AI approach"],
        verificationCriteria: ["Clear benefit prioritization", "Specific tools identified", "Implementation roadmap with timeline", "Success metrics defined"]
      }]
    });
    
    // Chapter 11: Advanced Analytics & Attribution
    this.tutorials.push({
      id: 13,
      chapterNumber: 11,
      title: "Advanced Marketing Analytics and Attribution",
      level: "Expert",
      content: "Master advanced marketing analytics including multi-touch attribution models.",
      estimatedTime: 270,
      skillsLearned: ["Attribution Modeling", "Marketing Mix Modeling", "Customer Journey Analysis"],
      isPremium: true,
      tasks: [{
        id: 1,
        description: "Build a multi-touch attribution model",
        type: "practical",
        requirements: ["Work with cross-channel data", "Apply attribution methodologies"],
        verificationCriteria: ["Attribution model defined", "Channel contributions quantified", "ROI calculations accurate"]
      }]
    });
    
    console.log(`Loaded ${this.tutorials.length} default tutorials`);
  }
  


  /**
   * Get tutorials filtered by user level
   */
  async getTutorials(userLevel: string): Promise<Tutorial[]> {
    // If tutorials not loaded, ensure they are
    if (this.tutorials.length === 0) {
      await this.loadDefaultTutorials();
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
        .where(sql`${userProfiles.userId} = ${userId}`)
        .limit(1);
      
      if (userResult.length === 0) {
        console.log(`User profile not found for user ${userId}`);
        return;
      }
      
      const userProfile = userResult[0];
      const currentXP = userProfile.experiencePoints || 0;
      const newXP = currentXP + xpAmount;
      
      // Update user XP
      await db.update(userProfiles)
        .set({ experiencePoints: newXP })
        .where(sql`${userProfiles.userId} = ${userId}`);
      
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
        .where(sql`${userProfiles.userId} = ${userId}`)
        .limit(1);
      
      if (userResult.length > 0) {
        const currentLevel = userResult[0].level || "Beginner";
        
        // Update if level changed
        if (currentLevel !== newLevel) {
          await db.update(userProfiles)
            .set({ level: newLevel })
            .where(sql`${userProfiles.userId} = ${userId}`);
          
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
      await this.loadDefaultTutorials();
    }
    
    const tutorial = this.tutorials.find(t => t.id === tutorialId);
    return tutorial || null;
  }
}

// Create singleton instance
export const tutorialService = new TutorialService();
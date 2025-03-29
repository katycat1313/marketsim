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
  
  constructor() {
    this.loadDefaultTutorials();
  }
  
  private loadDefaultTutorials() {
    console.log('Loading default tutorials with premium content...');
    
    // Initialize with empty array
    this.tutorials = [];
    
    // CHAPTER 1: AI Marketing Fundamentals
    this.tutorials.push(
      {
        id: 101,
        title: "The New AI Marketing Landscape",
        level: "Beginner",
        content: `# The New AI Marketing Landscape

## Welcome to the AI Marketing Revolution!

Hi there! I'm ZOOMi, your friendly AI marketing assistant. I'll be guiding you through this exciting journey into the world of AI-powered marketing. Let's get started!

## Why AI Marketing is Changing Everything

Did you know? **76% of marketing professionals believe marketing has changed more in the past two years than in the previous fifty years combined!** This incredible shift is largely driven by artificial intelligence technologies that are now accessible to businesses of all sizes.

![AI Marketing Transformation](https://images.unsplash.com/photo-1581094794329-c8112a89af12)

## The Democratization of Advanced Marketing

> *"AI is the great equalizer in digital marketing. Small businesses can now compete with enterprise brands using the same powerful tools."* - Mark Wilson, Digital Marketing Expert

The most exciting part? You don't need a massive budget or technical expertise to leverage these tools. Today's AI marketing solutions are designed to be user-friendly and accessible.

## What You'll Learn in This Tutorial

In this tutorial, we'll explore:

1. How AI has transformed core marketing functions
2. Real-world examples of businesses succeeding with AI marketing
3. A simple framework for identifying where AI can help your specific business
4. How to speak confidently about AI marketing (even if you're new to it!)

## The Evolution of Marketing Technology

AI is revolutionizing key marketing areas:

- **Content Creation**: Creating engaging content in minutes instead of hours
- **Customer Insights**: Understanding your audience better than ever before
- **Campaign Optimization**: Getting better results without constant tweaking
- **Personalization**: Delivering tailored experiences to each customer

### Fun Fact! 
The first AI marketing tool was developed in the 1980s for basic customer segmentation. Today's tools are over 1,000 times more powerful and can perform tasks that would have seemed like science fiction just five years ago!

## Quick Success Story

Sarah, the owner of a small online boutique, implemented basic AI marketing tools and saw her conversion rate increase by 34% in just 45 days. Her secret? Using AI to analyze customer browsing patterns and automatically personalize product recommendations.

## Let's Assess Your AI Marketing Readiness!

Ready to see where your business stands? Let's do a quick self-assessment to identify your biggest AI opportunities.

Answer these questions in your marketing notebook:

1. How much time do you currently spend on repetitive marketing tasks?
2. What customer data are you collecting but not fully utilizing?
3. Which marketing channels give you the best results?
4. What's your biggest marketing challenge right now?
5. How personalized are your current customer communications?

In our next lesson, we'll build on these answers to create your AI marketing roadmap!

## Pro Tip
Start small with AI implementation! Choose one marketing task that's time-consuming but straightforward, and find an AI tool to help with it. This builds confidence and gives you a quick win to celebrate.`,
        tasks: [
          {
            id: 101001,
            description: "Complete your AI Marketing Readiness Assessment",
            type: "practical",
            requirements: ["Marketing objectives list", "Current marketing challenges"],
            verificationCriteria: ["Assessment questions answered", "Key opportunities identified"]
          },
          {
            id: 101002,
            description: "Identify one repetitive marketing task to automate",
            type: "practical",
            requirements: ["List of regular marketing activities"],
            verificationCriteria: ["Task selected with clear automation potential"]
          }
        ],
        estimatedTime: 45,
        skillsLearned: ["AI Marketing Fundamentals", "Marketing Technology Assessment", "Strategic Implementation Planning"],
        chapterNumber: 1
      },
      {
        id: 102,
        title: "Essential AI Marketing Tools",
        level: "Beginner",
        content: `# Essential AI Marketing Tools for 2025

## Finding Your Perfect AI Marketing Toolkit

Hello again! ZOOMi here to guide you through the exciting world of AI marketing tools. With so many options available, finding the right tools for your specific needs can feel overwhelming. Don't worry - I'll help you navigate this landscape!

## The AI Marketing Tools Ecosystem

The AI marketing tools landscape has exploded, with over 8,000 marketing technology solutions available today. Let's break down the essential categories:

![AI Marketing Tools](https://images.unsplash.com/photo-1579389083078-4e7018379f7e)

### Content Creation & Optimization
These tools help you create, edit, and optimize written content, images, and videos.

**Popular Tools:**
- **Jasper**: AI-powered content generation for blogs, ads, and emails
- **Writer**: Enterprise-grade content creation with brand voice controls
- **Canva with Magic Studio**: Visual content creation with AI assistance
- **Pictory**: Transform text into engaging video content

### Customer Insights & Analytics
These tools help you understand customer behavior and preferences at a deeper level.

**Popular Tools:**
- **Sprout Social**: Social media analytics with predictive insights
- **Mixpanel**: Advanced user behavior analysis
- **Oribi**: No-code customer journey visualization
- **Monkeylearn**: Text analysis for customer feedback and messages

### Campaign Automation & Optimization
These tools automate the execution and optimization of marketing campaigns.

**Popular Tools:**
- **Seventh Sense**: Email send-time optimization based on individual behavior
- **Phrasee**: AI-powered email subject line generation and testing
- **Albert**: Autonomous media buying and campaign optimization
- **Pathmatics**: Competitive ad intelligence and strategy insights

### Personalization Engines
These tools deliver tailored experiences to customers based on their data.

**Popular Tools:**
- **Dynamic Yield**: Real-time personalization across channels
- **Optimizely**: A/B testing and personalization at scale
- **Insider**: Cross-channel personalization platform
- **Qubit**: Commerce-focused personalization

## Success Story: Small Business, Big Results

Tom runs a local fitness studio with limited marketing resources. By implementing just two AI tools - a content generator for consistent social posts and an email optimization tool for better engagement - he increased his client acquisition by 41% while cutting his marketing time in half.

> *"I was skeptical about AI at first, but these tools feel like having a marketing team working for me 24/7."* - Tom K., Fitness Studio Owner

## Choosing the Right Tools for Your Business

### Step 1: Identify Your Biggest Marketing Pain Points
Where do you spend the most time? What tasks do you dread? Where are your results disappointing?

### Step 2: Prioritize Based on Potential Impact
Which improvements would most directly affect your bottom line?

### Step 3: Start with User-Friendly Tools
Look for tools with:
- Free trials or freemium options
- Intuitive interfaces
- Good customer support
- Clear tutorials and documentation

### Step 4: Integrate Thoughtfully
Make sure new tools work with your existing systems and workflows.

## Pro Tip
Most AI marketing tools offer free trials. Create a "Tool Testing Tuesday" where you try a new tool each week. This structured approach helps you discover game-changers without getting overwhelmed.

### Fun Fact!
The average marketing department now uses 91 different marketing tools! Don't worry - you don't need nearly that many to see significant results. In fact, most successful small businesses find that 3-5 well-chosen AI tools deliver 80% of their potential benefits.

## Interactive Exercise: Build Your AI Tool Wishlist

Let's create your personalized AI tool wishlist:

1. List your top three marketing activities that consume the most time
2. For each activity, search for 2-3 AI tools that could help (use the categories above)
3. Compare features, pricing, and reviews
4. Select one tool to try first - preferably one with a free trial

In our next lesson, we'll explore how to assess your overall AI marketing readiness and create a strategic implementation plan!`,
        tasks: [
          {
            id: 102001,
            description: "Create your AI marketing tools wishlist",
            type: "practical",
            requirements: ["List of time-consuming marketing activities"],
            verificationCriteria: ["Wishlist with at least 3 tools identified", "Selection criteria documented"]
          },
          {
            id: 102002,
            description: "Sign up for a free trial of one AI marketing tool",
            type: "practical",
            requirements: ["Selected tool from wishlist"],
            verificationCriteria: ["Account created", "Basic features explored"]
          }
        ],
        estimatedTime: 60,
        skillsLearned: ["AI Tool Evaluation", "Marketing Technology Selection", "Tool Integration Planning"],
        chapterNumber: 1
      },
      {
        id: 103,
        title: "Assessing Your AI Marketing Readiness",
        level: "Beginner",
        content: `# Assessing Your AI Marketing Readiness

## Building Your AI Implementation Roadmap

Hello, marketer! ZOOMi back again to help you assess your current marketing operations and develop a clear roadmap for AI implementation. This structured approach will ensure you get maximum value from your AI marketing investments.

## The AI Readiness Assessment Framework

Think of this assessment as your marketing technology checkup. We'll evaluate five key areas to identify your biggest opportunities and potential challenges.

![AI Readiness Assessment](https://images.unsplash.com/photo-1579389083078-4e7018379f7e)

## 1. Data Readiness: The Foundation of AI Success

AI tools require data to function effectively. Let's assess your data foundation:

**Questions to Answer:**
- What customer data are you currently collecting?
- How organized and accessible is your data?
- Do you have a CRM or customer database?
- Are there gaps in your customer information?

**Quick Score:** On a scale of 1-10, how would you rate your current data collection and organization?

### Pro Tip
Start creating a "single customer view" by consolidating data from different platforms. Even a simple spreadsheet that combines information from your email platform, website analytics, and sales data can be incredibly valuable!

## 2. Process Readiness: Identifying Automation Opportunities

Next, let's look at your marketing processes to find automation opportunities:

**Questions to Answer:**
- Which marketing tasks do you perform repeatedly?
- How standardized are your marketing workflows?
- Where do bottlenecks occur in your marketing execution?
- Which processes consume the most time with the least strategic value?

**Quick Score:** On a scale of 1-10, how systematic and documented are your marketing processes?

### Fun Fact!
Companies with well-documented marketing processes see 70% higher returns from their AI investments compared to those with ad-hoc approaches. Structure creates the perfect environment for AI to thrive!

## 3. Skills Readiness: Assessing Your Team's AI Aptitude

Even user-friendly AI tools require some knowledge to implement effectively:

**Questions to Answer:**
- How comfortable are you with trying new marketing technologies?
- Have you or your team used any AI tools previously?
- Do you have access to technical resources if needed?
- Are there specific skills you'd like to develop?

**Quick Score:** On a scale of 1-10, how would you rate your team's readiness to adopt new technologies?

## 4. Strategy Readiness: Aligning AI with Business Goals

AI implementation should support your larger business objectives:

**Questions to Answer:**
- What are your top 3 marketing goals for the next 6-12 months?
- Which metrics are most important for your business?
- Where are the biggest gaps between your goals and current performance?
- What would success look like for your AI implementation?

**Quick Score:** On a scale of 1-10, how clear are your marketing goals and metrics?

## 5. Budget & Resource Readiness: Planning Your Investment

Finally, let's consider the practical aspects of implementation:

**Questions to Answer:**
- What budget could you allocate to marketing technology?
- How much time can you invest in learning and implementing new tools?
- Do you need tools that work immediately, or can you invest in configuration?
- What would an acceptable ROI timeframe be for your business?

**Quick Score:** On a scale of 1-10, how would you rate your readiness to invest in marketing technology?

## Success Story: The Power of Readiness Assessment

Maria ran a small e-commerce business selling handmade jewelry. Before implementing any AI tools, she completed a thorough readiness assessment like this one. She discovered that while her product data was well-organized, she had almost no post-purchase customer data. 

Instead of jumping into advanced AI tools, she first implemented a simple customer feedback system and preference center. Three months later, with better data in place, her AI product recommendation engine performed 3x better than it would have initially.

> *"The assessment saved me from wasting money on advanced tools I wasn't ready for yet. By fixing my foundations first, I got much better results when I did implement AI."* - Maria L., E-commerce Entrepreneur

## Creating Your AI Implementation Roadmap

Now that you've assessed your readiness, let's create a prioritized roadmap:

1. **Quick Wins**: Identify 1-2 high-impact, low-effort implementations to start with
2. **Foundation Building**: Address any critical gaps in your data or processes
3. **Capability Expansion**: Plan for more advanced implementations as you build expertise
4. **Optimization Phase**: Enhance and refine your AI implementations over time

### Pro Tip
The most successful AI implementations start small, show clear value, and expand gradually. Resist the temptation to transform everything at once!

## Interactive Exercise: Complete Your Assessment

Take 15-20 minutes to complete your full assessment using the questions above. Calculate your average score across all five areas to determine your overall AI marketing readiness score:

- **1-3**: Foundation Building Stage
- **4-6**: Selective Implementation Stage
- **7-8**: Strategic Expansion Stage
- **9-10**: AI Optimization Stage

In our next chapter, we'll dive into AI-powered content creation strategies!`,
        tasks: [
          {
            id: 103001,
            description: "Complete your full AI Marketing Readiness Assessment",
            type: "practical",
            requirements: ["Marketing operations overview"],
            verificationCriteria: ["All 5 sections completed", "Overall readiness score calculated"]
          },
          {
            id: 103002,
            description: "Create your 3-month AI implementation roadmap",
            type: "practical",
            requirements: ["Completed assessment", "Business goals"],
            verificationCriteria: ["Priority opportunities identified", "Timeline established"]
          }
        ],
        estimatedTime: 75,
        skillsLearned: ["Marketing Technology Assessment", "AI Implementation Planning", "Strategic Roadmapping"],
        chapterNumber: 1,
        hasSimulation: true
      }
    );
    
    // CHAPTER 4: Advanced AI Marketing (PREMIUM)
    this.tutorials.push(
      {
        id: 401,
        title: "Agentic AI for Marketing Automation",
        level: "Advanced",
        content: `# Agentic AI for Marketing Automation

## The Next Evolution in Marketing Intelligence

Welcome to the cutting edge of AI marketing! ZOOMi here to introduce you to the revolutionary concept of agentic AI—autonomous systems that can plan, execute, and optimize marketing activities with minimal human supervision.

## Understanding Agentic AI

Agentic AI represents a fundamental shift from tools that assist marketers to systems that can independently perform complex marketing functions:

**Traditional AI Tools**: Respond to specific requests and instructions
**Agentic AI Systems**: Proactively pursue marketing goals with autonomous decision-making

![Agentic AI](https://images.unsplash.com/photo-1589254065878-42c9da997008)

## The Core Capabilities of Marketing Agents

Advanced AI marketing agents combine several sophisticated capabilities:

### 1. Goal-Directed Reasoning
The ability to understand business objectives and develop strategies to achieve them.

### 2. Autonomous Planning
Creating multi-step plans to accomplish marketing goals without step-by-step human guidance.

### 3. Tool Utilization
Using various marketing platforms, data sources, and systems to execute planned activities.

### 4. Adaptive Execution
Modifying approaches based on real-time feedback and changing conditions.

### 5. Multi-Agent Collaboration
Working with other specialized AI agents to handle complex marketing ecosystems.

### Fun Fact!
The concept of agentic AI stems from research in cognitive architecture that began in the 1950s, but only recently has computing power and algorithm development reached the level needed for practical marketing applications. What was science fiction five years ago is now being implemented by leading marketing organizations!`,
        tasks: [
          {
            id: 401001,
            description: "Complete your agentic AI opportunity assessment",
            type: "practical",
            requirements: ["Marketing process inventory", "Team time allocation data"],
            verificationCriteria: ["High-value opportunities identified", "Potential ROI calculated", "Implementation risks assessed"]
          },
          {
            id: 401002,
            description: "Design your first marketing agent specification",
            type: "practical",
            requirements: ["Selected marketing function", "Available system integrations"],
            verificationCriteria: ["Agent goals defined", "Decision framework established", "Implementation plan created"]
          }
        ],
        estimatedTime: 90,
        skillsLearned: ["Agentic AI Implementation", "Autonomous Marketing Systems", "Advanced Marketing Automation"],
        chapterNumber: 4,
        isPremium: true
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
      this.loadDefaultTutorials();
    }
    
    const tutorial = this.tutorials.find(t => t.id === tutorialId);
    return tutorial || null;
  }
}

// Create singleton instance
export const tutorialService = new TutorialService();
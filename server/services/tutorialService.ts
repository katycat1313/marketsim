import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { db, pool } from '../db';
import { userProfiles } from '@shared/schema';
import { tutorialSimulationService } from './tutorialSimulationService';

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
    this.loadAllTutorialsFromDirectory();
  }
  
  private loadAllTutorialsFromDirectory() {
    try {
      // Using fileURLToPath for ESM compatibility to get correct file paths
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDir = path.dirname(currentFilePath);
      
      // Navigate to the tutorials directory
      const tutorialsDir = path.join(currentDir, '..', 'data', 'tutorials');
      
      // Get all tutorial files with proper naming convention
      const files = fs.readdirSync(tutorialsDir).filter(file => 
        file.startsWith('chapter') && file.endsWith('.ts') && !file.includes('storage.ts')
      );
      
      console.log(`Found ${files.length} tutorial files`);
      
      // Process each file to extract chapter and subchapter
      const tutorialFiles = files.map(file => {
        // Extract chapter number from filename
        const chapterMatch = file.match(/chapter(\d+)/i);
        let chapterNumber = 1; // Default chapter
        
        if (chapterMatch) {
          chapterNumber = parseInt(chapterMatch[1]);
        }
        
        return {
          filename: file,
          chapterNumber
        };
      });
      
      // Create a mapping of tutorials by chapter
      console.log(`Processing ${tutorialFiles.length} tutorial files by chapter`);
      
      // Define hardcoded tutorials with ALL chapters
      this.tutorials = [
        // CHAPTER 1: Introduction to Digital Marketing
        {
          id: 101,
          title: "Getting Started with Digital Marketing",
          level: "Beginner",
          content: this.loadTutorialContent('chapter1-1-Introduction.ts'),
          tasks: [
            {
              id: 101001,
              description: "Set up a digital marketing account",
              type: "practical",
              requirements: ["Email account"],
              verificationCriteria: ["Account created"]
            }
          ],
          estimatedTime: 45,
          skillsLearned: ["Digital Marketing Basics"],
          chapterNumber: 1
        },
        {
          id: 102,
          title: "Unleash the Power of Google Ads",
          level: "Beginner",
          content: this.loadTutorialContent('chapter1-2.ts'),
          tasks: [
            {
              id: 102001,
              description: "Understand the basics of Google Ads",
              type: "practical",
              requirements: ["Google account"],
              verificationCriteria: ["Quiz completed"]
            }
          ],
          estimatedTime: 50,
          skillsLearned: ["Google Ads Fundamentals"],
          chapterNumber: 1
        },
        {
          id: 103,
          title: "Digital Marketing Basics",
          level: "Beginner",
          content: this.loadTutorialContent('chapter1-3-digitalmarketing basics .ts'),
          tasks: [
            {
              id: 103001,
              description: "Develop a simple marketing plan",
              type: "practical",
              requirements: ["Marketing goals"],
              verificationCriteria: ["Plan documented"]
            }
          ],
          estimatedTime: 45,
          skillsLearned: ["Marketing Planning", "Strategy Basics"],
          chapterNumber: 1
        },
        
        // CHAPTER 2: Google Ads Fundamentals
        {
          id: 201,
          title: "Understanding Google Ads Platform",
          level: "Beginner",
          content: this.loadTutorialContent('chapter2-1-allaboutcampaigns.ts'),
          tasks: [
            {
              id: 201001,
              description: "Set up your first campaign",
              type: "practical",
              requirements: ["Google Ads account"],
              verificationCriteria: ["Campaign created"]
            }
          ],
          estimatedTime: 60,
          skillsLearned: ["Campaign Structure", "Ad Setup"],
          chapterNumber: 2
        },
        {
          id: 202,
          title: "Campaign Types in Google Ads",
          level: "Beginner",
          content: this.loadTutorialContent('chapter2-2.ts'),
          tasks: [
            {
              id: 202001,
              description: "Create different campaign types",
              type: "practical",
              requirements: ["Google Ads account"],
              verificationCriteria: ["Multiple campaigns created"]
            }
          ],
          estimatedTime: 65,
          skillsLearned: ["Campaign Strategy", "Budget Management"],
          chapterNumber: 2
        },
        {
          id: 203,
          title: "Audience Targeting Strategies",
          level: "Beginner", 
          content: this.loadTutorialContent('chapter2-3-audienceTargetingStrategies.ts'),
          tasks: [
            {
              id: 203001,
              description: "Set up audience targeting",
              type: "practical",
              requirements: ["Google Ads account"],
              verificationCriteria: ["Audiences configured"]
            }
          ],
          estimatedTime: 55,
          skillsLearned: ["Audience Segmentation", "Targeting"],
          chapterNumber: 2
        },
        {
          id: 204,
          title: "Shopping Campaigns",
          level: "Beginner",
          content: this.loadTutorialContent('chapter2-4-shoppingCampaigns.ts'),
          tasks: [
            {
              id: 204001,
              description: "Set up a shopping campaign",
              type: "practical", 
              requirements: ["Merchant Center account"],
              verificationCriteria: ["Product feed created", "Campaign launched"]
            }
          ],
          estimatedTime: 70,
          skillsLearned: ["Shopping Campaigns", "Product Feed Management"],
          chapterNumber: 2
        },
        {
          id: 205,
          title: "Google Ads Account Architecture",
          level: "Beginner",
          content: this.loadTutorialContent('chapter2-5-googleAdsAccountArchitecture.ts'),
          tasks: [
            {
              id: 205001,
              description: "Structure your Google Ads account",
              type: "practical",
              requirements: ["Access to Google Ads"],
              verificationCriteria: ["Account structure implemented"]
            }
          ],
          estimatedTime: 65,
          skillsLearned: ["Account Organization", "Campaign Hierarchy"],
          chapterNumber: 2
        },
        
        // CHAPTER 3: Advanced Google Ads
        {
          id: 301,
          title: "Advanced Campaign Strategies",
          level: "Intermediate",
          content: this.loadTutorialContent('chapter3-1.ts'),
          tasks: [
            {
              id: 301001,
              description: "Implement advanced bidding strategies",
              type: "practical",
              requirements: ["Active Google Ads campaigns"],
              verificationCriteria: ["Strategies implemented", "Performance improved"]
            }
          ],
          estimatedTime: 75,
          skillsLearned: ["Advanced Bidding", "Campaign Optimization"],
          chapterNumber: 3
        },
        {
          id: 302,
          title: "Effective Campaign Management",
          level: "Intermediate",
          content: this.loadTutorialContent('chapter3-2.ts'),
          tasks: [
            {
              id: 302001,
              description: "Set up campaign management protocols",
              type: "practical",
              requirements: ["Active campaigns"],
              verificationCriteria: ["Management structure implemented"]
            }
          ],
          estimatedTime: 70,
          skillsLearned: ["Campaign Management", "Optimization Workflow"],
          chapterNumber: 3
        },
        {
          id: 303,
          title: "Goal Setting for Campaigns",
          level: "Intermediate",
          content: this.loadTutorialContent('chapter3-3.ts'),
          tasks: [
            {
              id: 303001,
              description: "Define campaign objectives and KPIs",
              type: "practical",
              requirements: ["Business goals"],
              verificationCriteria: ["KPIs documented", "Goals aligned with business objectives"]
            }
          ],
          estimatedTime: 60,
          skillsLearned: ["Goal Setting", "KPI Definition"],
          chapterNumber: 3
        },
        
        // CHAPTER 4: Marketing Objectives
        {
          id: 401,
          title: "Audience Targeting Core Strategies",
          level: "Intermediate",
          content: this.loadTutorialContent('chapter4-1.ts'),
          tasks: [
            {
              id: 401001,
              description: "Create audience targeting strategy",
              type: "practical",
              requirements: ["Customer persona data"],
              verificationCriteria: ["Targeting strategy documented"]
            }
          ],
          estimatedTime: 65,
          skillsLearned: ["Audience Analysis", "Strategic Targeting"],
          chapterNumber: 4
        },
        
        // CHAPTER 5: Analytics
        {
          id: 501,
          title: "Testing Methodologies",
          level: "Intermediate",
          content: this.loadTutorialContent('chapter-1-4.ts'), // Inconsistent naming
          tasks: [
            {
              id: 501001,
              description: "Design A/B testing framework",
              type: "practical",
              requirements: ["Active marketing campaigns"],
              verificationCriteria: ["Testing framework implemented"]
            }
          ],
          estimatedTime: 70,
          skillsLearned: ["A/B Testing", "Experimental Design"],
          chapterNumber: 5
        },
        {
          id: 502,
          title: "Data Analysis for Marketing",
          level: "Intermediate",
          content: this.loadTutorialContent('chapter5-1.ts'),
          tasks: [
            {
              id: 502001,
              description: "Analyze campaign performance data",
              type: "practical",
              requirements: ["Campaign data"],
              verificationCriteria: ["Analysis report created"]
            }
          ],
          estimatedTime: 75,
          skillsLearned: ["Data Analysis", "Performance Reporting"],
          chapterNumber: 5
        },
        {
          id: 503,
          title: "Site Analytics",
          level: "Intermediate",
          content: this.loadTutorialContent('chapter5-2-siteAnalytics.ts'),
          tasks: [
            {
              id: 503001,
              description: "Set up website analytics tracking",
              type: "practical",
              requirements: ["Website access", "Analytics account"],
              verificationCriteria: ["Analytics implemented", "Key metrics tracked"]
            }
          ],
          estimatedTime: 65,
          skillsLearned: ["Website Analytics", "Visitor Tracking"],
          chapterNumber: 5
        },
        {
          id: 504,
          title: "Analytics Foundations",
          level: "Intermediate",
          content: this.loadTutorialContent('chapter5-3-analyticsFoundations.ts'),
          tasks: [
            {
              id: 504001,
              description: "Establish analytics foundation",
              type: "practical",
              requirements: ["Business metrics"],
              verificationCriteria: ["Analytics framework created"]
            }
          ],
          estimatedTime: 70,
          skillsLearned: ["Analytics Framework", "Performance Measurement"],
          chapterNumber: 5
        },
        {
          id: 505,
          title: "Data-Driven Marketing",
          level: "Intermediate",
          content: this.loadTutorialContent('chapter5-4-analyticsDataDriven.ts'),
          tasks: [
            {
              id: 505001,
              description: "Implement data-driven marketing",
              type: "practical",
              requirements: ["Analytics access", "Marketing campaigns"],
              verificationCriteria: ["Data integration implemented", "Insights generated"]
            }
          ],
          estimatedTime: 75,
          skillsLearned: ["Data-Driven Decision Making", "Marketing Intelligence"],
          chapterNumber: 5
        },
        
        // CHAPTER 6: Marketing Channels
        {
          id: 601,
          title: "Google Ads Mastery",
          level: "Advanced",
          content: this.loadTutorialContent('chapter6-1.ts'),
          tasks: [
            {
              id: 601001,
              description: "Optimize advanced Google Ads campaigns",
              type: "practical",
              requirements: ["Active Google Ads campaigns"],
              verificationCriteria: ["Optimization implemented", "Performance improved"]
            }
          ],
          estimatedTime: 90,
          skillsLearned: ["Advanced Google Ads", "Campaign Mastery"],
          chapterNumber: 6
        },
        {
          id: 602,
          title: "Advanced SEO Techniques",
          level: "Advanced",
          content: this.loadTutorialContent('chapter6-2-seoAdvanced.ts'),
          tasks: [
            {
              id: 602001,
              description: "Implement advanced SEO strategies",
              type: "practical",
              requirements: ["Website access", "SEO tools"],
              verificationCriteria: ["Advanced optimizations implemented"]
            }
          ],
          estimatedTime: 85,
          skillsLearned: ["Technical SEO", "Advanced Optimization"],
          chapterNumber: 6
        },
        {
          id: 603,
          title: "Email Marketing Automation",
          level: "Advanced",
          content: this.loadTutorialContent('chapter6-3-emailMarketingAutomation.ts'),
          tasks: [
            {
              id: 603001,
              description: "Set up email marketing automation",
              type: "practical",
              requirements: ["Email marketing platform", "Customer lists"],
              verificationCriteria: ["Automation workflows implemented"]
            }
          ],
          estimatedTime: 80,
          skillsLearned: ["Email Automation", "Customer Journey Mapping"],
          chapterNumber: 6
        },
        {
          id: 604,
          title: "Social Media Marketing",
          level: "Advanced",
          content: this.loadTutorialContent('chapter6-5-socialMediaMarketing.ts'),
          tasks: [
            {
              id: 604001,
              description: "Create comprehensive social media strategy",
              type: "practical",
              requirements: ["Social media accounts", "Content assets"],
              verificationCriteria: ["Strategy documented", "Content calendar created"]
            }
          ],
          estimatedTime: 85,
          skillsLearned: ["Social Media Strategy", "Content Planning"],
          chapterNumber: 6
        },
        
        // CHAPTER 7: SEO
        {
          id: 701,
          title: "SEO Foundations",
          level: "Beginner",
          content: this.loadTutorialContent('chapter7-1-seoFoundations.ts'),
          tasks: [
            {
              id: 701001,
              description: "Implement basic SEO elements",
              type: "practical",
              requirements: ["Website access"],
              verificationCriteria: ["SEO improvements implemented"]
            }
          ],
          estimatedTime: 60,
          skillsLearned: ["SEO Basics", "On-Page Optimization"],
          chapterNumber: 7
        },
        {
          id: 702,
          title: "SEO Foundations - Enhanced",
          level: "Beginner",
          content: this.loadTutorialContent('chapter7-2-seoFoundations-enhanced.ts'),
          tasks: [
            {
              id: 702001,
              description: "Implement extended SEO fundamentals",
              type: "practical",
              requirements: ["Website access", "SEO tools"],
              verificationCriteria: ["On-page optimizations implemented"]
            }
          ],
          estimatedTime: 65,
          skillsLearned: ["On-Page SEO", "Content Optimization"],
          chapterNumber: 7
        },
        {
          id: 703,
          title: "SEO Foundations - Complete",
          level: "Beginner",
          content: this.loadTutorialContent('chapter7-3-seoFoundations-new.ts'),
          tasks: [
            {
              id: 703001,
              description: "Implement complete SEO foundation",
              type: "practical", 
              requirements: ["Website access"],
              verificationCriteria: ["Complete SEO foundation implemented"]
            }
          ],
          estimatedTime: 70,
          skillsLearned: ["Complete SEO Foundation", "Optimization Strategy"],
          chapterNumber: 7
        },
        {
          id: 704,
          title: "SEO Intermediate Skills",
          level: "Intermediate",
          content: this.loadTutorialContent('chapter7-4-seoIntermediate.ts'),
          tasks: [
            {
              id: 704001,
              description: "Implement intermediate SEO tactics",
              type: "practical",
              requirements: ["Website access", "SEO tools"],
              verificationCriteria: ["Intermediate tactics implemented"]
            }
          ],
          estimatedTime: 75,
          skillsLearned: ["Technical SEO", "Content Strategy"],
          chapterNumber: 7
        },
        {
          id: 705,
          title: "SEO Expert Level",
          level: "Advanced",
          content: this.loadTutorialContent('chapter7-5seoExpert.ts'),
          tasks: [
            {
              id: 705001,
              description: "Implement expert SEO strategies",
              type: "practical",
              requirements: ["Website access", "SEO toolset", "Analytics access"],
              verificationCriteria: ["Expert strategies implemented", "Performance metrics tracked"]
            }
          ],
          estimatedTime: 90,
          skillsLearned: ["Advanced SEO", "Technical Optimization"],
          chapterNumber: 7
        },
        {
          id: 706,
          title: "SEO Master Level",
          level: "Advanced",
          content: this.loadTutorialContent('chapter7-6-seoMaster.ts'),
          tasks: [
            {
              id: 706001,
              description: "Implement master-level SEO strategy",
              type: "practical",
              requirements: ["Enterprise website", "Advanced SEO tools"],
              verificationCriteria: ["Enterprise SEO strategy implemented"]
            }
          ],
          estimatedTime: 95,
          skillsLearned: ["Enterprise SEO", "Advanced Technical SEO"],
          chapterNumber: 7
        },
        
        // CHAPTER 8: Troubleshooting
        {
          id: 801,
          title: "Google Ads Troubleshooting",
          level: "Advanced",
          content: this.loadTutorialContent('chapter8-1-Troubleshooting.ts'),
          tasks: [
            {
              id: 801001,
              description: "Diagnose and fix campaign issues",
              type: "practical",
              requirements: ["Active campaigns", "Performance data"],
              verificationCriteria: ["Issues identified", "Fixes implemented"]
            }
          ],
          estimatedTime: 70,
          skillsLearned: ["Troubleshooting Process", "Problem-Solving"],
          chapterNumber: 8
        },
        {
          id: 802,
          title: "Google Ads Troubleshooting Best Practices",
          level: "Advanced",
          content: this.loadTutorialContent('chapter8-2-Troubleshooyingbestpractices.ts'),
          tasks: [
            {
              id: 802001,
              description: "Implement troubleshooting framework",
              type: "practical",
              requirements: ["Campaign management access"],
              verificationCriteria: ["Framework documented", "Process implemented"]
            }
          ],
          estimatedTime: 75,
          skillsLearned: ["Best Practices", "Systematic Troubleshooting"],
          chapterNumber: 8
        },
        {
          id: 803,
          title: "Troubleshooting Tips and Tricks",
          level: "Advanced",
          content: this.loadTutorialContent('chapter8-3-troubleshootingtipsandtricks.ts'),
          tasks: [
            {
              id: 803001,
              description: "Apply advanced troubleshooting techniques",
              type: "practical",
              requirements: ["Google Ads access", "Analytics access"],
              verificationCriteria: ["Techniques applied", "Issues resolved"]
            }
          ],
          estimatedTime: 65,
          skillsLearned: ["Advanced Troubleshooting", "Performance Recovery"],
          chapterNumber: 8
        }
      ];
      
      console.log(`Loaded ${this.tutorials.length} manually defined tutorials with explicit chapter numbers`);
      
    } catch (error) {
      console.error('Error loading tutorials from directory:', error);
      // Initialize with a fallback empty array
      this.tutorials = [];
    }
  }
  
  private loadTutorialContent(filename: string): string {
    try {
      // Using fileURLToPath for ESM compatibility to get correct file paths
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDir = path.dirname(currentFilePath);
      
      // Navigate to the tutorials directory
      const tutorialsDir = path.join(currentDir, '..', 'data', 'tutorials');
      
      // Simplified content loading approach - read file contents directly
      const findAndReadFile = (searchName: string): string => {
        try {
          // Get all files in the tutorial directory
          const files = fs.readdirSync(tutorialsDir);
          
          // First try for exact match
          let targetFile = files.find(f => f === searchName);
          
          // If not found, try for partial match
          if (!targetFile) {
            targetFile = files.find(f => 
              f.includes(searchName.replace('.ts', '')) || 
              searchName.includes(f.replace('.ts', ''))
            );
          }
          
          if (targetFile) {
            // Read the file directly as string
            const filePath = path.join(tutorialsDir, targetFile);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            // Extract content by finding export const content = ` and matching backticks
            const contentMatch = fileContent.match(/export\s+const\s+content\s*=\s*`([\s\S]*)`/);
            if (contentMatch && contentMatch[1]) {
              return contentMatch[1];
            }
            
            return 'Content extraction failed. Please check tutorial file format.';
          }
          
          return 'Tutorial file not found';
        } catch (err) {
          console.error(`Error reading file ${searchName}:`, err);
          return 'Error reading tutorial file';
        }
      };
      
      return findAndReadFile(filename);
    } catch (error) {
      console.error('Error loading tutorial content:', error);
      return 'Error loading tutorial content';
    }
  }

  async getTutorials(userLevel: string): Promise<Tutorial[]> {
    console.log(`Getting tutorials for user level: ${userLevel}`);
    
    // Ensure all tutorials have chapter info for frontend
    const tutorialsWithChapters = this.tutorials.map(tutorial => {
      if (!tutorial.chapterNumber) {
        // Try to extract from title/content if missing
        const title = tutorial.title.toLowerCase();
        const content = tutorial.content.toLowerCase();
        const chapterMatch = title.match(/chapter\s*(\d+)/i) || content.match(/chapter\s*(\d+)/i);
        if (chapterMatch) {
          tutorial.chapterNumber = parseInt(chapterMatch[1]);
        }
      }
      return tutorial;
    });
    
    // Sort tutorials by chapter number
    const sortedTutorials = tutorialsWithChapters.sort((a, b) => {
      // First sort by chapter
      const chapterA = a.chapterNumber || 999;
      const chapterB = b.chapterNumber || 999;
      
      if (chapterA !== chapterB) {
        return chapterA - chapterB;
      }
      
      // Then sort by ID within chapters
      return a.id - b.id;
    });
    
    console.log(`Found ${sortedTutorials.length} tutorials for user level: ${userLevel}`);
    
    // Log each tutorial we're checking for debugging
    sortedTutorials.forEach(tutorial => {
      console.log(`Tutorial ${tutorial.id}: ${tutorial.chapterNumber} ${tutorial.title}`);
    });
    
    // Return all tutorials regardless of level for now to fix chapter display
    return sortedTutorials;
  }
  
  private sortTutorialsByChapter(tutorials: Tutorial[]): Tutorial[] {
    return tutorials.sort((a, b) => {
      // First try to sort by explicit chapter number
      const chapterA = a.chapterNumber || 0;
      const chapterB = b.chapterNumber || 0;
      
      if (chapterA !== chapterB) {
        return chapterA - chapterB;
      }
      
      // If same chapter, try to extract subchapter from title
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      
      const subchapterMatchA = titleA.match(/(\d+)\.(\d+)/);
      const subchapterMatchB = titleB.match(/(\d+)\.(\d+)/);
      
      if (subchapterMatchA && subchapterMatchB) {
        return parseInt(subchapterMatchA[2]) - parseInt(subchapterMatchB[2]);
      }
      
      // Default to ID sorting
      return a.id - b.id;
    });
  }

  async getUserProgress(userId: number): Promise<number[]> {
    try {
      // Query database for completed tutorials
      const result = await pool.query(
        `SELECT tutorial_id FROM user_tutorial_progress WHERE user_id = $1 AND status = 'completed'`,
        [userId]
      );
      
      const completedTutorials = result.rows.map(row => Number(row.tutorial_id));
      console.log(`Retrieved ${completedTutorials.length} completed tutorials for user ${userId}:`, completedTutorials);
      
      return completedTutorials;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }

  async markTutorialComplete(userId: number, tutorialId: number): Promise<void> {
    try {
      // Check if progress entry exists
      const exists = await pool.query(
        `SELECT * FROM user_tutorial_progress WHERE user_id = $1 AND tutorial_id = $2`,
        [userId, tutorialId]
      );
      
      if (exists.rowCount && exists.rowCount > 0) {
        // Update existing record
        await pool.query(
          `UPDATE user_tutorial_progress SET status = 'completed', completed_at = NOW(), progress = 100 WHERE user_id = $1 AND tutorial_id = $2`,
          [userId, tutorialId]
        );
      } else {
        // Create new record
        await pool.query(
          `INSERT INTO user_tutorial_progress (user_id, tutorial_id, status, started_at, completed_at, progress) VALUES ($1, $2, 'completed', NOW(), NOW(), 100)`,
          [userId, tutorialId]
        );
      }
      
      // Update user experience
      await pool.query(
        `UPDATE user_profiles SET experience_points = experience_points + 50 WHERE id = $1`,
        [userId]
      );
      
      console.log(`Marked tutorial ${tutorialId} as complete for user ${userId}`);
    } catch (error) {
      console.error('Error marking tutorial as complete:', error);
      throw new Error('Failed to update tutorial progress');
    }
  }
}

export const tutorialService = new TutorialService();
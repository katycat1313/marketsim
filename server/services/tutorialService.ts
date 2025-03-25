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
      id: 11,
      title: "SEO Foundations: Basic On-Page Optimization",
      level: "Beginner",
      content: this.loadTutorialContent('seoFoundations.ts'),
      tasks: [
        {
          id: 1101,
          description: "Optimize a product page with On-Page SEO elements",
          type: "practical",
          requirements: ["Access to content editor", "Understanding of basic SEO principles"],
          verificationCriteria: ["Title tags optimized", "Meta descriptions written", "Heading hierarchy implemented", "Image alt text added"]
        },
        {
          id: 1102,
          description: "Complete the SEO basics quiz",
          type: "quiz",
          requirements: ["Completed readings"],
          verificationCriteria: ["80% or higher score"]
        }
      ],
      estimatedTime: 45, // minutes
      skillsLearned: ["On-page SEO", "Title Tag Optimization", "Meta Description Writing", "Heading Structure", "Image Alt Text"]
    },
    {
      id: 12,
      title: "Intermediate SEO: Content Optimization & Local SEO",
      level: "Intermediate",
      content: this.loadTutorialContent('seoIntermediate.ts'),
      tasks: [
        {
          id: 1201,
          description: "Implement local business schema markup",
          type: "practical",
          requirements: ["Basic HTML knowledge", "Local business website"],
          verificationCriteria: ["LocalBusiness schema implemented", "NAP information structured", "Business hours formatted"]
        },
        {
          id: 1202,
          description: "Optimize content for local search",
          type: "practical",
          requirements: ["Content editor access", "Local business information"],
          verificationCriteria: ["Location-specific keywords added", "NAP consistency maintained", "Local content created"]
        },
        {
          id: 1203,
          description: "Apply SEO techniques in simulation",
          type: "simulation",
          requirements: ["Completed local SEO training"],
          verificationCriteria: ["Simulation completed", "Local optimization applied", "Schema markup implemented"]
        }
      ],
      estimatedTime: 60, // minutes
      skillsLearned: ["Local SEO", "Schema Markup", "NAP Consistency", "Content Optimization for Local Search"]
    },
    {
      id: 13,
      title: "Advanced SEO: Technical Optimization & Content Strategy",
      level: "Advanced",
      content: this.loadTutorialContent('seoAdvanced.ts'),
      tasks: [
        {
          id: 1301,
          description: "Create and implement XML sitemaps",
          type: "practical",
          requirements: ["Website access", "Understanding of site structure"],
          verificationCriteria: ["Sitemap created", "Submitted to search console", "Follow proper format"]
        },
        {
          id: 1302,
          description: "Implement canonical tags for duplicate content",
          type: "practical",
          requirements: ["Access to website head section", "Understanding of content duplication issues"],
          verificationCriteria: ["Canonical tags implemented", "Self-referencing canonicals added", "Proper URL format used"]
        },
        {
          id: 1303,
          description: "Configure robots.txt",
          type: "practical",
          requirements: ["Server access", "Understanding of crawl budget"],
          verificationCriteria: ["Robots.txt created/updated", "Proper directives used", "Critical paths protected"]
        }
      ],
      estimatedTime: 90, // minutes
      skillsLearned: ["Technical SEO", "XML Sitemaps", "Canonical Tags", "Robots.txt Configuration", "URL Structure"]
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
    },
    {
      id: 5,
      title: "Advanced Campaign Strategies",
      level: "Advanced",
      content: this.loadTutorialContent('chapter3-1.ts'),
      tasks: [
        {
          id: 501,
          description: "Design and implement an A/B testing plan",
          type: "practical",
          requirements: ["Active Google Ads campaign", "Testing hypothesis"],
          verificationCriteria: ["Two ad variations created", "Testing metrics defined", "Results analysis framework prepared"]
        },
        {
          id: 502,
          description: "Optimize audience targeting",
          type: "practical",
          requirements: ["Campaign performance data", "Customer behavior analysis"],
          verificationCriteria: ["Audience segments refined", "Ad schedule customized", "Performance improvement measured"]
        }
      ],
      estimatedTime: 90,
      skillsLearned: ["A/B Testing", "Audience Optimization", "Performance Analytics", "Campaign Refinement"]
    },
    {
      id: 6,
      title: "Effective Campaign Management",
      level: "Advanced",
      content: this.loadTutorialContent('chapter3-2.ts'),
      tasks: [
        {
          id: 601,
          description: "Develop a campaign monitoring strategy",
          type: "practical",
          requirements: ["Active Google Ads campaigns", "Performance metrics baseline"],
          verificationCriteria: ["KPI monitoring plan created", "Reporting schedule established", "Optimization protocols defined"]
        },
        {
          id: 602,
          description: "Implement budget optimization techniques",
          type: "practical",
          requirements: ["Campaign performance data", "Budget allocation plan"],
          verificationCriteria: ["Budget reallocation plan created", "Performance improvement forecasted", "ROI metrics defined"]
        },
        {
          id: 603,
          description: "Run an advanced campaign simulation",
          type: "simulation",
          requirements: ["Completed management strategy"],
          verificationCriteria: ["Simulation completed", "Budget optimization applied", "Performance improvement demonstrated"]
        }
      ],
      estimatedTime: 100,
      skillsLearned: ["Performance Monitoring", "Budget Optimization", "Keyword Refinement", "Analytics Interpretation"]
    },
    {
      id: 7,
      title: "Goal Setting for Google Ads",
      level: "Advanced",
      content: this.loadTutorialContent('chapter4-1.ts'),
      tasks: [
        {
          id: 701,
          description: "Create SMART goals for your business",
          type: "practical",
          requirements: ["Business objectives", "Marketing plan"],
          verificationCriteria: ["SMART goals documented", "Goal alignment with business objectives verified", "Measurable metrics defined"]
        },
        {
          id: 702,
          description: "Set up proper conversion tracking",
          type: "practical",
          requirements: ["Google Ads account", "Website access", "Clear conversion actions"],
          verificationCriteria: ["Conversion tracking implemented", "Goal values assigned", "Testing of tracking completed"]
        }
      ],
      estimatedTime: 60,
      skillsLearned: ["SMART Goal Creation", "Campaign Objective Setting", "Conversion Strategy", "Performance Measurement"]
    },
    {
      id: 8,
      title: "Audience Targeting Strategies",
      level: "Advanced",
      content: this.loadTutorialContent('chapter4-2.ts'),
      tasks: [
        {
          id: 801,
          description: "Create audience segments based on demographics and behavior",
          type: "practical",
          requirements: ["Customer data", "Google Ads account", "Marketing objectives"],
          verificationCriteria: ["Audience segments created", "Targeting parameters defined", "Segment sizes evaluated"]
        },
        {
          id: 802,
          description: "Implement retargeting campaigns",
          type: "practical",
          requirements: ["Website with Google tag", "Product/service list", "Audience lists"],
          verificationCriteria: ["Retargeting audiences created", "Campaign settings optimized", "Ad creative tailored to audience segments"]
        },
        {
          id: 803,
          description: "Develop an A/B testing plan for audiences",
          type: "practical",
          requirements: ["Defined audience segments", "Test hypothesis", "Performance metrics"],
          verificationCriteria: ["A/B test structure created", "Success metrics defined", "Implementation timeline established"]
        }
      ],
      estimatedTime: 90,
      skillsLearned: ["Audience Segmentation", "Demographic Targeting", "Behavioral Marketing", "Retargeting Strategies", "A/B Testing"]
    },
    {
      id: 9,
      title: "Testing Methodologies",
      level: "Expert",
      content: this.loadTutorialContent('chapter5-1.ts'),
      tasks: [
        {
          id: 901,
          description: "Design and execute a complete A/B testing strategy",
          type: "practical",
          requirements: ["Active Google Ads account", "Ad variations", "Statistical significance calculator"],
          verificationCriteria: ["Testing plan created", "Test execution completed", "Results analysis documented"]
        },
        {
          id: 902,
          description: "Implement multivariate testing",
          type: "practical",
          requirements: ["High-traffic campaign", "Multiple variables to test", "Analytics access"],
          verificationCriteria: ["Multivariate test designed", "Multiple variables simultaneously tested", "Optimal combination identified"]
        },
        {
          id: 903,
          description: "Optimize ad rotation for better performance",
          type: "practical",
          requirements: ["Multiple ad variations", "At least 2 weeks of campaign data"],
          verificationCriteria: ["Ad rotation settings configured", "Performance differences analyzed", "Optimization strategy implemented"]
        }
      ],
      estimatedTime: 120,
      skillsLearned: ["A/B Testing Methodology", "Multivariate Testing", "Statistical Significance Analysis", "Ad Rotation Optimization", "Experiment Design"]
    },
    {
      id: 10,
      title: "Data Analysis for Google Ads",
      level: "Expert",
      content: this.loadTutorialContent('chapter5-2.ts'),
      tasks: [
        {
          id: 1001,
          description: "Create a comprehensive campaign analysis dashboard",
          type: "practical",
          requirements: ["Google Data Studio access", "Campaign data", "KPI definitions"],
          verificationCriteria: ["Dashboard created", "Key metrics visualized", "Actionable insights identified"]
        },
        {
          id: 1002,
          description: "Perform segmentation analysis",
          type: "practical",
          requirements: ["Campaign data", "Analytics access", "Segment definitions"],
          verificationCriteria: ["Segments analyzed", "Performance differences identified", "Targeting recommendations documented"]
        },
        {
          id: 1003,
          description: "Implement attribution modeling",
          type: "practical",
          requirements: ["Conversion data", "Multiple touchpoints", "Analytics access"],
          verificationCriteria: ["Attribution model selected", "Path to conversion analyzed", "Budget allocation optimized"]
        }
      ],
      estimatedTime: 120,
      skillsLearned: ["Advanced Metrics Analysis", "Data Visualization", "Segmentation Strategy", "Attribution Modeling", "Performance Optimization"]
    },
    {
      id: 11,
      title: "Course Summary and Next Steps",
      level: "Expert",
      content: this.loadTutorialContent('chapter6-1.ts'),
      tasks: [
        {
          id: 1101,
          description: "Create a comprehensive Google Ads strategy for your business",
          type: "practical",
          requirements: ["Course completion", "Business objectives", "Marketing plan"],
          verificationCriteria: ["Strategy document created", "Implementation timeline defined", "Success metrics established"]
        },
        {
          id: 1102,
          description: "Complete the final assessment",
          type: "quiz",
          requirements: ["All previous modules completed"],
          verificationCriteria: ["95% or higher score", "Practical application demonstrated"]
        },
        {
          id: 1103,
          description: "Develop an ongoing optimization plan",
          type: "practical",
          requirements: ["Strategy document", "Performance analysis framework"],
          verificationCriteria: ["Optimization schedule created", "Testing plan established", "Performance monitoring protocols defined"]
        }
      ],
      estimatedTime: 90,
      skillsLearned: ["Strategic Planning", "Performance Measurement", "Campaign Optimization", "ROI Maximization", "Continuous Improvement"]
    },
    {
      id: 14,
      title: "Analytics Foundations: Understanding Marketing Performance Metrics",
      level: "Beginner",
      content: this.loadTutorialContent('analyticsFoundations.ts'),
      tasks: [
        {
          id: 1401,
          description: "Set up Google Analytics for a marketing campaign",
          type: "practical",
          requirements: ["Google Analytics account", "Website access", "Marketing campaign plan"],
          verificationCriteria: ["GA4 property created", "Tags implemented", "Custom events defined"]
        },
        {
          id: 1402,
          description: "Create a performance dashboard",
          type: "practical",
          requirements: ["Google Analytics access", "Marketing goals", "KPI definitions"],
          verificationCriteria: ["Dashboard created", "Key metrics visualized", "Regular reporting schedule established"]
        },
        {
          id: 1403,
          description: "Complete the analytics fundamentals quiz",
          type: "quiz",
          requirements: ["Completed readings"],
          verificationCriteria: ["80% or higher score"]
        }
      ],
      estimatedTime: 60,
      skillsLearned: ["Data Analysis", "KPI Identification", "Performance Measurement", "Dashboard Creation", "Analytics Implementation"]
    },
    {
      id: 15,
      title: "Site Analytics: Visualizing and Interpreting Website Performance",
      level: "Intermediate",
      content: this.loadTutorialContent('siteAnalytics.ts'),
      tasks: [
        {
          id: 1501,
          description: "Create a comprehensive site analytics dashboard",
          type: "practical",
          requirements: ["Google Analytics account", "Website with significant traffic", "Business objectives"],
          verificationCriteria: ["Dashboard includes key site metrics", "Multiple visualization types used", "Insights documented"]
        },
        {
          id: 1502,
          description: "Perform a website user journey analysis",
          type: "practical",
          requirements: ["Site analytics access", "Conversion funnel definition"],
          verificationCriteria: ["User paths mapped", "Drop-off points identified", "Optimization opportunities listed"]
        },
        {
          id: 1503,
          description: "Develop actionable insights from site analytics",
          type: "practical",
          requirements: ["Analytics dashboard", "Historical data (at least 3 months)"],
          verificationCriteria: ["Trends identified", "Hypotheses developed", "A/B test plan created"]
        },
        {
          id: 1504,
          description: "Complete the site analytics mastery quiz",
          type: "quiz",
          requirements: ["Completed readings and practical tasks"],
          verificationCriteria: ["85% or higher score"]
        }
      ],
      estimatedTime: 90,
      skillsLearned: ["Data Visualization", "User Journey Mapping", "Conversion Funnel Analysis", "Behavior Pattern Recognition", "Actionable Insight Development"]
    }
  ];

  private loadTutorialContent(filename: string): string {
    try {
      // Using fileURLToPath for ESM compatibility to get correct file paths
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDir = path.dirname(currentFilePath);
      
      // Navigate to the tutorials directory
      const tutorialPath = path.join(currentDir, '..', 'data', 'tutorials', filename);
      
      try {
        // Read the file directly and extract the content
        const fileContent = fs.readFileSync(tutorialPath, 'utf8');
        
        // Parse the content to extract the exported content string
        const contentMatch = fileContent.match(/export const content = `([\s\S]*?)`/);
        if (contentMatch && contentMatch[1]) {
          return contentMatch[1];
        } else {
          console.error(`Could not parse content from ${filename}`);
          return "Tutorial content structure is invalid.";
        }
      } catch (importError) {
        console.error(`Could not import tutorial from ${filename}:`, importError);
        return "Tutorial content not found.";
      }
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
    const filteredTutorials = [...this.tutorials].filter(t => availableLevels.includes(t.level));
    
    // Mark tutorials that have simulations available
    const challenges = await tutorialSimulationService.getAllChallenges();
    const tutorialIdsWithSimulations = challenges.map(c => c.tutorialId);
    
    return filteredTutorials.map(tutorial => {
      return {
        ...tutorial,
        hasSimulation: tutorialIdsWithSimulations.includes(tutorial.id)
      };
    });
  }

  async getUserProgress(userId: number): Promise<number[]> {
    if (!userId) return [];
    
    try {
      // Check if the table exists, if not return empty array
      // Check if the table exists - use the tableName directly in the query
      const tableCheck = await db.execute(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'user_completed_tutorials'
        );
      `);
      
      const tableExists = tableCheck.rows?.[0]?.exists;
      
      if (!tableExists) {
        // Create the table if it doesn't exist
        await db.execute(`
          CREATE TABLE IF NOT EXISTS user_completed_tutorials (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            tutorial_id INTEGER NOT NULL,
            completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
            UNIQUE(user_id, tutorial_id)
          );
        `);
        return []; // No tutorials completed yet
      }
      
      // Use pool.query with parameterized query to prevent SQL injection
      const result = await pool.query(
        `SELECT tutorial_id FROM user_completed_tutorials
         WHERE user_id = $1;`,
        [userId]
      );
      
      console.log(`Retrieved ${result.rows.length} completed tutorials for user ${userId}:`, 
                  result.rows.map((row: any) => row.tutorial_id));
      
      // Extract tutorial IDs from the result
      return result.rows.map((row: any) => parseInt(row.tutorial_id));
    } catch (error) {
      console.error('Error getting user tutorial progress:', error);
      return [];
    }
  }

  async markTutorialComplete(userId: number, tutorialId: number): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    
    try {
      // Create the user_completed_tutorials table entry if it doesn't exist
      
      // Check if the table exists, create if it doesn't - use direct table name instead of variable
      await db.execute(`
        CREATE TABLE IF NOT EXISTS user_completed_tutorials (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          tutorial_id INTEGER NOT NULL,
          completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(user_id, tutorial_id)
        );
      `);
      
      // Use pool.query with parameterized query to prevent SQL injection
      await pool.query(
        `INSERT INTO user_completed_tutorials (user_id, tutorial_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, tutorial_id) DO NOTHING;`,
        [userId, tutorialId]
      );
      
      console.log(`User ${userId} completed tutorial ${tutorialId}`);
      
      // Update user experience points as an incentive
      try {
        // For now, we'll skip XP update since it's not critical and might not work in development
        // db.update is having issues with the experiencePoints field
        console.log('Skipping XP update in development mode');
      } catch (xpError) {
        // If updating XP fails, just log it but continue. The tutorial is still marked as complete.
        console.error('Error updating user XP:', xpError);
      }
    } catch (error) {
      console.error('Error marking tutorial as complete:', error);
      throw new Error('Failed to mark tutorial as complete');
    }
  }
}
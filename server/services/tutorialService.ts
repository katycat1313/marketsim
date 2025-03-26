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
      id: 25,
      title: "SEO Foundations: The Art of On-Page Optimization",
      level: "Beginner",
      content: this.loadTutorialContent('seoFoundations-enhanced.ts'),
      tasks: [
        {
          id: 1401,
          description: "Optimize a web page for target keywords",
          type: "practical",
          requirements: ["Access to webpage HTML", "Target keyword list"],
          verificationCriteria: ["Title tags optimized", "Meta descriptions added", "Heading structure implemented"]
        },
        {
          id: 1402,
          description: "Implement basic on-page SEO best practices",
          type: "practical",
          requirements: ["Website access"],
          verificationCriteria: ["Image alt text added", "Internal linking improved", "Content optimized for keywords"]
        },
        {
          id: 1403,
          description: "Complete the SEO implementation checklist",
          type: "practical",
          requirements: ["Website access", "SEO audit tools"],
          verificationCriteria: ["Checklist fully completed", "Performance improvements documented"]
        }
      ],
      estimatedTime: 90,
      skillsLearned: ["On-page SEO", "Keyword Optimization", "Content Structure", "Meta Tag Implementation", "Technical SEO", "SEO Analytics"]
    },
    {
      id: 31,
      title: "Social Media Marketing: Strategy, Execution & Analytics",
      level: "Intermediate",
      content: this.loadTutorialContent('socialMediaMarketing.ts'),
      tasks: [
        {
          id: 1501,
          description: "Create a comprehensive social media strategy",
          type: "practical",
          requirements: ["Business goals", "Target audience information"],
          verificationCriteria: ["Platform selection justified", "Content calendar created", "KPIs defined"]
        },
        {
          id: 1502,
          description: "Implement social media analytics tracking",
          type: "practical",
          requirements: ["Social media accounts", "Analytics access"],
          verificationCriteria: ["Tracking implemented", "Baseline metrics recorded", "Reporting template created"]
        }
      ],
      estimatedTime: 90,
      skillsLearned: ["Social Media Strategy", "Content Planning", "Audience Targeting", "Analytics & Measurement"]
    },
    {
      id: 29,
      title: "Email Marketing Automation Basics",
      level: "Intermediate",
      content: this.loadTutorialContent('emailMarketingAutomation.ts'),
      tasks: [
        {
          id: 2901,
          description: "Set up an email automation workflow",
          type: "practical",
          requirements: ["Email marketing platform", "Customer segments", "Content assets"],
          verificationCriteria: ["Workflow created", "Triggers defined", "Content personalized"]
        },
        {
          id: 2902,
          description: "Implement A/B testing for email campaigns",
          type: "practical",
          requirements: ["Email marketing platform", "Testing hypothesis"],
          verificationCriteria: ["Test variables defined", "Control group established", "Success metrics selected"]
        }
      ],
      estimatedTime: 75,
      skillsLearned: ["Email Automation", "Segmentation Strategy", "A/B Testing", "Conversion Optimization"]
    },
    {
      id: 17,
      title: "Data-Driven Marketing: Analytics & Measurement",
      level: "Intermediate",
      content: this.loadTutorialContent('analyticsDataDriven.ts'),
      tasks: [
        {
          id: 1701,
          description: "Set up a comprehensive marketing dashboard",
          type: "practical",
          requirements: ["Analytics access", "Key business metrics"],
          verificationCriteria: ["Dashboard created", "KPIs displayed", "Data visualized effectively", "Automated updates configured"]
        },
        {
          id: 1702,
          description: "Create a regular reporting framework",
          type: "practical",
          requirements: ["Analytics data", "Stakeholder requirements"],
          verificationCriteria: ["Report template created", "Insights highlighted", "Action recommendations included"]
        },
        {
          id: 1703,
          description: "Implement attribution modeling",
          type: "practical",
          requirements: ["Analytics access", "Conversion data", "Multi-channel customer journeys"],
          verificationCriteria: ["Attribution model configured", "Comparison of models documented", "Marketing insights derived"]
        },
        {
          id: 1704,
          description: "Create a segmentation analysis",
          type: "practical",
          requirements: ["User data", "Analytics platform"],
          verificationCriteria: ["Meaningful segments created", "Segment performance analyzed", "Strategic recommendations made"]
        }
      ],
      estimatedTime: 120,
      skillsLearned: ["Data Analysis", "Marketing Metrics", "KPI Setting", "Performance Reporting", "Attribution Modeling", "Customer Journey Analytics", "Data Visualization", "Segmentation Analysis"]
    },
    {
      id: 18,
      title: "Search Campaign Fundamentals",
      level: "Intermediate",
      content: this.loadTutorialContent('searchCampaignFundamentals.ts'),
      tasks: [
        {
          id: 1801,
          description: "Structure an effective search campaign",
          type: "practical",
          requirements: ["Google Ads account", "Keyword research"],
          verificationCriteria: ["Campaign structure created", "Ad groups organized by theme", "Match types diversified"]
        },
        {
          id: 1802,
          description: "Write high-performing ad copy",
          type: "practical",
          requirements: ["Target keywords", "USPs identified"],
          verificationCriteria: ["Multiple ad variations created", "Best practices implemented", "CTAs optimized"]
        }
      ],
      estimatedTime: 70,
      skillsLearned: ["Search Campaign Structure", "Keyword Research", "Ad Copywriting", "Quality Score Optimization"]
    },
    {
      id: 19,
      title: "Google Ads Account Architecture",
      level: "Advanced",
      content: this.loadTutorialContent('googleAdsAccountArchitecture.ts'),
      tasks: [
        {
          id: 1901,
          description: "Create a scalable account structure",
          type: "practical",
          requirements: ["Google Ads account", "Business objectives", "Product/service categories"],
          verificationCriteria: ["Logical hierarchy implemented", "Naming conventions used", "Budget allocation defined"]
        },
        {
          id: 1902,
          description: "Set up conversion tracking and attribution",
          type: "practical",
          requirements: ["Google Ads access", "Website access", "Defined conversion actions"],
          verificationCriteria: ["Conversion tracking implemented", "Attribution model selected", "Value tracking configured"]
        }
      ],
      estimatedTime: 90,
      skillsLearned: ["Account Structure", "Campaign Organization", "Conversion Tracking", "Attribution Modeling"]
    },
    {
      id: 20,
      title: "Google Ads Troubleshooting & Best Practices",
      level: "Advanced",
      content: this.loadTutorialContent('googleAdsTroubleshooting.ts'),
      tasks: [
        {
          id: 2001,
          description: "Diagnose and fix common account issues",
          type: "practical",
          requirements: ["Google Ads account", "Performance data"],
          verificationCriteria: ["Problems identified", "Solutions implemented", "Performance improved"]
        },
        {
          id: 2002,
          description: "Implement advanced optimization techniques",
          type: "practical",
          requirements: ["Active campaigns", "Historical data"],
          verificationCriteria: ["Bid adjustments made", "Ad schedule optimized", "Audience targeting refined"]
        },
        {
          id: 2003,
          description: "Create a troubleshooting framework document",
          type: "practical",
          requirements: ["Google Ads knowledge", "Common issue awareness"],
          verificationCriteria: ["Problem categories defined", "Diagnostic steps documented", "Solution strategies outlined"]
        },
        {
          id: 2004,
          description: "Implement an early warning system for campaign performance",
          type: "practical",
          requirements: ["Google Ads access", "Performance thresholds"],
          verificationCriteria: ["Alerts configured", "Monitoring system implemented", "Documentation created"]
        }
      ],
      estimatedTime: 120,
      skillsLearned: ["Troubleshooting Process", "Performance Analysis", "Optimization Strategy", "Advanced Settings", "Early Warning Systems", "Systematic Problem-Solving"]
    },
    {
      id: 21,
      title: "Audience Targeting Strategies",
      level: "Intermediate",
      content: this.loadTutorialContent('audienceTargetingStrategies.ts'),
      tasks: [
        {
          id: 2101,
          description: "Create effective audience segments",
          type: "practical",
          requirements: ["Customer data", "Campaign objectives"],
          verificationCriteria: ["Segments created", "Targeting parameters defined", "Audience sizes evaluated"]
        },
        {
          id: 2102,
          description: "Implement audience-based bid adjustments",
          type: "practical",
          requirements: ["Active campaigns", "Audience segments"],
          verificationCriteria: ["Bid adjustments applied", "Performance monitored", "ROI analyzed by segment"]
        }
      ],
      estimatedTime: 65,
      skillsLearned: ["Audience Segmentation", "Demographic Targeting", "Interest-based Targeting", "Remarketing Strategy"]
    },
    {
      id: 22,
      title: "Shopping Campaigns",
      level: "Advanced",
      content: this.loadTutorialContent('shoppingCampaigns.ts'),
      tasks: [
        {
          id: 2201,
          description: "Set up and optimize a product feed",
          type: "practical",
          requirements: ["Merchant Center account", "Product data"],
          verificationCriteria: ["Feed created", "Required attributes populated", "Supplemental attributes added"]
        },
        {
          id: 2202,
          description: "Structure and manage shopping campaigns",
          type: "practical",
          requirements: ["Google Ads account", "Merchant Center feed"],
          verificationCriteria: ["Campaign structure created", "Priority levels set", "Negative keywords implemented"]
        }
      ],
      estimatedTime: 85,
      skillsLearned: ["Product Feed Optimization", "Shopping Campaign Structure", "Bidding Strategies", "Performance Analysis"]
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
      id: 26,
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
      id: 27,
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
      id: 28,
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
    },
    {
      id: 30,
      title: "Email Marketing Automation: Best Practices and Implementation Strategies",
      level: "Intermediate",
      content: this.loadTutorialContent('emailMarketingAutomation.ts'),
      tasks: [
        {
          id: 1601,
          description: "Design a multi-stage welcome sequence",
          type: "practical",
          requirements: ["Email marketing platform", "Subscriber list", "Content ideas"],
          verificationCriteria: ["Sequence includes at least 5 emails", "Progressive profiling implemented", "Clear goals for each message"]
        },
        {
          id: 1602,
          description: "Create an abandoned cart recovery automation",
          type: "practical",
          requirements: ["E-commerce integration", "Email templates"],
          verificationCriteria: ["3-email sequence created", "Dynamic product insertion", "Incentive strategy defined"]
        },
        {
          id: 1603,
          description: "Implement behavioral segmentation and personalization",
          type: "practical",
          requirements: ["User behavior data", "Segmentation capabilities"],
          verificationCriteria: ["At least 3 behavioral segments created", "Dynamic content blocks defined", "Personalization beyond basic merge fields"]
        },
        {
          id: 1604,
          description: "Complete the email automation mastery quiz",
          type: "quiz",
          requirements: ["Completed readings and practical tasks"],
          verificationCriteria: ["85% or higher score"]
        }
      ],
      estimatedTime: 120,
      skillsLearned: ["Email Automation Workflow Design", "Behavioral Targeting", "Advanced Personalization", "A/B Testing Strategy", "Automation Performance Measurement"]
    },
    {
      id: 23,
      title: "SEO Expert: Comprehensive Site Audit & Technical Troubleshooting",
      level: "Expert",
      content: this.loadTutorialContent('seoExpert.ts'),
      tasks: [
        {
          id: 2301,
          description: "Conduct comprehensive SEO audit",
          type: "practical",
          requirements: ["Access to site analytics", "Technical SEO knowledge"],
          verificationCriteria: ["Audit framework created", "Issues documented by priority", "Technical recommendations provided"]
        },
        {
          id: 2302,
          description: "Implement technical SEO fixes",
          type: "practical",
          requirements: ["Site access", "Developer resources"],
          verificationCriteria: ["Critical issues resolved", "Performance improvements measured", "Documentation updated"]
        }
      ],
      estimatedTime: 120,
      skillsLearned: ["Technical SEO Auditing", "Site Performance Optimization", "Structured Data Implementation", "Core Web Vitals", "SEO Troubleshooting"]
    },
    {
      id: 24,
      title: "SEO Master: Comprehensive Strategy for Business Websites",
      level: "Expert",
      content: this.loadTutorialContent('seoMaster.ts'),
      tasks: [
        {
          id: 2401,
          description: "Develop enterprise SEO strategy",
          type: "practical",
          requirements: ["Business objectives", "Competitive analysis", "Resource assessment"],
          verificationCriteria: ["Strategy document created", "KPIs established", "Implementation roadmap defined"]
        },
        {
          id: 2402,
          description: "Create content strategy aligned with SEO goals",
          type: "practical",
          requirements: ["Keyword research", "Content audit", "User journey mapping"],
          verificationCriteria: ["Content calendar created", "Topic clusters defined", "Quality guidelines established"]
        }
      ],
      estimatedTime: 150,
      skillsLearned: ["Enterprise SEO Strategy", "Content Strategy Development", "SEO ROI Analysis", "Team Structure & Workflow", "Scalable SEO Solutions"]
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
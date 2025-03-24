import { Campaign, SimulationData } from '@shared/schema';
import { db } from '../db';
import { freeMarketingAI, premiumMarketingAI, enterpriseMarketingAI } from './marketingAI';

// Industry benchmark data by vertical
const INDUSTRY_BENCHMARKS = {
  retail: {
    avgCTR: 0.0219,
    avgCPC: 1.35,
    avgCVR: 0.0287,
    competitiveness: 0.7
  },
  finance: {
    avgCTR: 0.0152,
    avgCPC: 3.77,
    avgCVR: 0.0252,
    competitiveness: 0.9
  },
  education: {
    avgCTR: 0.0347,
    avgCPC: 2.40,
    avgCVR: 0.0385,
    competitiveness: 0.65
  },
  technology: {
    avgCTR: 0.0207,
    avgCPC: 3.08,
    avgCVR: 0.0323,
    competitiveness: 0.85
  },
  healthcare: {
    avgCTR: 0.0162,
    avgCPC: 2.62,
    avgCVR: 0.0234,
    competitiveness: 0.75
  },
  travel: {
    avgCTR: 0.0363,
    avgCPC: 1.53,
    avgCVR: 0.0321,
    competitiveness: 0.6
  },
  localServices: {
    avgCTR: 0.0398,
    avgCPC: 6.75,
    avgCVR: 0.0505,
    competitiveness: 0.55
  },
  realEstate: {
    avgCTR: 0.0321,
    avgCPC: 2.37,
    avgCVR: 0.0422,
    competitiveness: 0.7
  }
};

// Keyword match type modifiers
const MATCH_TYPE_MODIFIERS = {
  exact: {
    ctrModifier: 1.6,
    cpcModifier: 1.2,
    conversionModifier: 1.4
  },
  phrase: {
    ctrModifier: 1.2,
    cpcModifier: 1.0,
    conversionModifier: 1.1
  },
  broad: {
    ctrModifier: 0.8,
    cpcModifier: 0.9,
    conversionModifier: 0.7
  }
};

// Device performance modifiers
const DEVICE_MODIFIERS = {
  mobile: {
    ctrModifier: 1.2,
    cpcModifier: 0.85,
    conversionModifier: 0.75
  },
  desktop: {
    ctrModifier: 1.0,
    cpcModifier: 1.0,
    conversionModifier: 1.0
  },
  tablet: {
    ctrModifier: 0.95,
    cpcModifier: 0.9,
    conversionModifier: 0.85
  }
};

// Ad extension impact
const AD_EXTENSION_IMPACT = {
  sitelink: { ctrBoost: 0.12 },
  callout: { ctrBoost: 0.08 },
  call: { ctrBoost: 0.09 },
  promotion: { ctrBoost: 0.11 },
  price: { ctrBoost: 0.10 },
  location: { ctrBoost: 0.13 }
};

// Landing page factors
const LANDING_PAGE_FACTORS = {
  relevance: { weight: 0.4 },
  userExperience: { weight: 0.3 },
  mobileOptimization: { weight: 0.3 }
};

interface MarketConditions {
  seasonality: number; // 0-1 factor for seasonal effects
  competition: number; // 0-1 factor for competitive pressure
  marketGrowth: number; // -1 to 1 factor for market growth/decline
  searchVolume: number; // Relative search volume
  weekdayEffect: number; // Effect of day of week
  industryTrend: number; // Industry-specific trend
}

interface SimulationFactors {
  adQuality: number; // 0-1 based on ad copy, relevance
  targeting: number; // 0-1 based on audience match
  bidStrategy: number; // 0-1 based on bid optimization
  budget: number; // Daily budget in currency
  keywordRelevance: number; // 0-1 based on keyword relevance
  landingPageExperience: number; // 0-1 based on landing page experience
  historicalPerformance: number; // 0-1 based on account history
  adGroupStructure: number; // 0-1 based on ad group organization
  extensionsImpact: number; // 0-1 based on extensions used
  negativeKeywordsImpact: number; // 0-1 based on negative keywords implementation
}

interface AudienceSegment {
  id: string;
  name: string;
  size: number; // Potential audience size
  engagementRate: number; // 0-1 likelihood to engage
  conversionPropensity: number; // 0-1 likelihood to convert
  averagePurchaseValue: number; // Average value of conversion
  devices: {
    mobile: number; // Percentage using mobile
    desktop: number; // Percentage using desktop
    tablet: number; // Percentage using tablet
  };
  demographics: {
    ageGroups: Record<string, number>; // Percentage in each age group
    genders: Record<string, number>; // Percentage of each gender
    incomeLevel: Record<string, number>; // Percentage in each income level
  };
  interests: string[]; // Interest categories
  response: { // Response to different ad elements
    headlines: Record<string, number>; // Effectiveness of headline types
    descriptions: Record<string, number>; // Effectiveness of description types
    ctas: Record<string, number>; // Effectiveness of call-to-action types
  };
}

interface LessonSpecificSimulation {
  name: string;
  description: string;
  industry: keyof typeof INDUSTRY_BENCHMARKS;
  defaultAudiences: AudienceSegment[];
  scenarioParameters: {
    initialBudget: number;
    recommendedBidStrategy: string;
    competitivePressure: number;
    seasonalityPattern: string;
    recommendedAdSchedule: Record<string, boolean>[];
    geographicConsiderations: string[];
  };
  successCriteria: {
    minimumROAS: number;
    targetCPA: number;
    expectedCTR: number;
    qualityScoreThreshold: number;
  };
  challengeFactors: {
    audienceOverlap: boolean;
    budgetConstraints: boolean;
    competitiveBidding: boolean;
    seasonalFluctuations: boolean;
    devicePerformanceGaps: boolean;
  };
  timeHorizon: number; // Number of days to simulate
}

// Specific simulation scenarios for each lesson
const lessonSimulations: Record<string, LessonSpecificSimulation> = {
  accountArchitecture: {
    name: "Google Ads Account Architecture Simulation",
    description: "Learn to structure campaigns and ad groups effectively",
    industry: "retail",
    defaultAudiences: [
      {
        id: "general_shoppers",
        name: "General Shoppers",
        size: 10000000,
        engagementRate: 0.08,
        conversionPropensity: 0.04,
        averagePurchaseValue: 65,
        devices: { mobile: 0.6, desktop: 0.3, tablet: 0.1 },
        demographics: {
          ageGroups: { "18-24": 0.2, "25-34": 0.35, "35-44": 0.25, "45-54": 0.15, "55+": 0.05 },
          genders: { "male": 0.45, "female": 0.55 },
          incomeLevel: { "low": 0.25, "medium": 0.5, "high": 0.25 }
        },
        interests: ["shopping", "fashion", "home goods", "electronics"],
        response: {
          headlines: { "promotional": 0.7, "question": 0.5, "statement": 0.6 },
          descriptions: { "features": 0.6, "benefits": 0.8, "social_proof": 0.7 },
          ctas: { "shop_now": 0.8, "learn_more": 0.5, "get_started": 0.6 }
        }
      }
    ],
    scenarioParameters: {
      initialBudget: 1000,
      recommendedBidStrategy: "maximize_clicks",
      competitivePressure: 0.65,
      seasonalityPattern: "standard",
      recommendedAdSchedule: Array(7).fill(null).map(() => ({ morning: true, afternoon: true, evening: true })),
      geographicConsiderations: ["nationwide"]
    },
    successCriteria: {
      minimumROAS: 200,
      targetCPA: 35,
      expectedCTR: 0.02,
      qualityScoreThreshold: 6
    },
    challengeFactors: {
      audienceOverlap: false,
      budgetConstraints: true,
      competitiveBidding: false,
      seasonalFluctuations: false,
      devicePerformanceGaps: true
    },
    timeHorizon: 30
  },
  
  searchCampaigns: {
    name: "Search Campaign Fundamentals Simulation",
    description: "Master the essentials of creating effective search campaigns",
    industry: "education",
    defaultAudiences: [
      {
        id: "course_seekers",
        name: "Professional Course Seekers",
        size: 5000000,
        engagementRate: 0.12,
        conversionPropensity: 0.07,
        averagePurchaseValue: 299,
        devices: { mobile: 0.45, desktop: 0.45, tablet: 0.1 },
        demographics: {
          ageGroups: { "18-24": 0.3, "25-34": 0.4, "35-44": 0.2, "45-54": 0.08, "55+": 0.02 },
          genders: { "male": 0.5, "female": 0.5 },
          incomeLevel: { "low": 0.15, "medium": 0.55, "high": 0.3 }
        },
        interests: ["education", "professional development", "career advancement", "online learning"],
        response: {
          headlines: { "question": 0.75, "statistic": 0.7, "benefit": 0.8 },
          descriptions: { "transformation": 0.8, "timeframe": 0.75, "credentials": 0.7 },
          ctas: { "enroll_now": 0.7, "learn_more": 0.65, "free_trial": 0.85 }
        }
      }
    ],
    scenarioParameters: {
      initialBudget: 1500,
      recommendedBidStrategy: "target_cpa",
      competitivePressure: 0.7,
      seasonalityPattern: "educational",
      recommendedAdSchedule: Array(7).fill(null).map((_, i) => 
        i < 5 ? { morning: true, afternoon: true, evening: true } : { morning: true, afternoon: true, evening: false }
      ),
      geographicConsiderations: ["urban centers", "college towns"]
    },
    successCriteria: {
      minimumROAS: 350,
      targetCPA: 45,
      expectedCTR: 0.035,
      qualityScoreThreshold: 7
    },
    challengeFactors: {
      audienceOverlap: false,
      budgetConstraints: true,
      competitiveBidding: true,
      seasonalFluctuations: true,
      devicePerformanceGaps: false
    },
    timeHorizon: 30
  },
  
  shoppingCampaigns: {
    name: "Shopping Campaigns Simulation",
    description: "Learn to create and optimize Google Shopping campaigns",
    industry: "retail",
    defaultAudiences: [
      {
        id: "product_shoppers",
        name: "Product Comparison Shoppers",
        size: 8000000,
        engagementRate: 0.15,
        conversionPropensity: 0.06,
        averagePurchaseValue: 85,
        devices: { mobile: 0.65, desktop: 0.25, tablet: 0.1 },
        demographics: {
          ageGroups: { "18-24": 0.15, "25-34": 0.3, "35-44": 0.25, "45-54": 0.2, "55+": 0.1 },
          genders: { "male": 0.48, "female": 0.52 },
          incomeLevel: { "low": 0.2, "medium": 0.55, "high": 0.25 }
        },
        interests: ["product reviews", "bargain hunting", "consumer electronics", "online shopping"],
        response: {
          headlines: { "product_feature": 0.8, "price_point": 0.85, "promotion": 0.75 },
          descriptions: { "product_details": 0.7, "limited_time": 0.8, "free_shipping": 0.9 },
          ctas: { "buy_now": 0.8, "add_to_cart": 0.75, "view_options": 0.65 }
        }
      }
    ],
    scenarioParameters: {
      initialBudget: 2000,
      recommendedBidStrategy: "maximize_conversion_value",
      competitivePressure: 0.8,
      seasonalityPattern: "retail",
      recommendedAdSchedule: Array(7).fill(null).map(() => ({ morning: true, afternoon: true, evening: true })),
      geographicConsiderations: ["nationwide", "high-income areas"]
    },
    successCriteria: {
      minimumROAS: 400,
      targetCPA: 20,
      expectedCTR: 0.04,
      qualityScoreThreshold: 7
    },
    challengeFactors: {
      audienceOverlap: false,
      budgetConstraints: false,
      competitiveBidding: true,
      seasonalFluctuations: true,
      devicePerformanceGaps: true
    },
    timeHorizon: 30
  },
  
  audienceTargeting: {
    name: "Audience Targeting Strategies Simulation",
    description: "Master advanced audience targeting techniques",
    industry: "finance",
    defaultAudiences: [
      {
        id: "financial_services",
        name: "Financial Services Consumers",
        size: 3000000,
        engagementRate: 0.05,
        conversionPropensity: 0.03,
        averagePurchaseValue: 250,
        devices: { mobile: 0.4, desktop: 0.55, tablet: 0.05 },
        demographics: {
          ageGroups: { "18-24": 0.05, "25-34": 0.2, "35-44": 0.3, "45-54": 0.25, "55+": 0.2 },
          genders: { "male": 0.52, "female": 0.48 },
          incomeLevel: { "low": 0.1, "medium": 0.4, "high": 0.5 }
        },
        interests: ["investing", "financial planning", "retirement", "wealth management"],
        response: {
          headlines: { "question": 0.65, "benefit": 0.8, "statistic": 0.75 },
          descriptions: { "security": 0.85, "expertise": 0.8, "social_proof": 0.7 },
          ctas: { "learn_more": 0.6, "free_consultation": 0.8, "get_started": 0.7 }
        }
      }
    ],
    scenarioParameters: {
      initialBudget: 2500,
      recommendedBidStrategy: "target_cpa",
      competitivePressure: 0.9,
      seasonalityPattern: "financial",
      recommendedAdSchedule: Array(7).fill(null).map((_, i) => 
        i < 5 ? { morning: true, afternoon: true, evening: true } : { morning: false, afternoon: false, evening: false }
      ),
      geographicConsiderations: ["high-income areas", "financial centers"]
    },
    successCriteria: {
      minimumROAS: 300,
      targetCPA: 75,
      expectedCTR: 0.015,
      qualityScoreThreshold: 8
    },
    challengeFactors: {
      audienceOverlap: true,
      budgetConstraints: false,
      competitiveBidding: true,
      seasonalFluctuations: false,
      devicePerformanceGaps: false
    },
    timeHorizon: 30
  },
  
  troubleshooting: {
    name: "Google Ads Troubleshooting Simulation",
    description: "Identify and fix common Google Ads problems",
    industry: "localServices",
    defaultAudiences: [
      {
        id: "local_service_seekers",
        name: "Local Service Seekers",
        size: 1000000,
        engagementRate: 0.2,
        conversionPropensity: 0.1,
        averagePurchaseValue: 150,
        devices: { mobile: 0.7, desktop: 0.2, tablet: 0.1 },
        demographics: {
          ageGroups: { "18-24": 0.1, "25-34": 0.25, "35-44": 0.3, "45-54": 0.2, "55+": 0.15 },
          genders: { "male": 0.45, "female": 0.55 },
          incomeLevel: { "low": 0.2, "medium": 0.6, "high": 0.2 }
        },
        interests: ["home services", "local businesses", "repair services", "professional services"],
        response: {
          headlines: { "urgent_need": 0.85, "location": 0.8, "question": 0.7 },
          descriptions: { "availability": 0.85, "qualifications": 0.7, "guarantees": 0.8 },
          ctas: { "call_now": 0.9, "request_quote": 0.8, "book_appointment": 0.85 }
        }
      }
    ],
    scenarioParameters: {
      initialBudget: 1200,
      recommendedBidStrategy: "maximize_conversions",
      competitivePressure: 0.6,
      seasonalityPattern: "service",
      recommendedAdSchedule: Array(7).fill(null).map((_, i) => ({ 
        morning: true, 
        afternoon: true, 
        evening: i < 5 ? true : false 
      })),
      geographicConsiderations: ["local radius targeting", "specific neighborhoods"]
    },
    successCriteria: {
      minimumROAS: 500,
      targetCPA: 50,
      expectedCTR: 0.04,
      qualityScoreThreshold: 7
    },
    challengeFactors: {
      audienceOverlap: false,
      budgetConstraints: true,
      competitiveBidding: false,
      seasonalFluctuations: true,
      devicePerformanceGaps: true
    },
    timeHorizon: 30
  },
  
  performanceAnalysis: {
    name: "Performance Analysis & Optimization Simulation",
    description: "Learn to analyze campaign data and make optimization decisions",
    industry: "technology",
    defaultAudiences: [
      {
        id: "tech_buyers",
        name: "Technology Solution Buyers",
        size: 4000000,
        engagementRate: 0.08,
        conversionPropensity: 0.05,
        averagePurchaseValue: 500,
        devices: { mobile: 0.35, desktop: 0.6, tablet: 0.05 },
        demographics: {
          ageGroups: { "18-24": 0.15, "25-34": 0.35, "35-44": 0.3, "45-54": 0.15, "55+": 0.05 },
          genders: { "male": 0.6, "female": 0.4 },
          incomeLevel: { "low": 0.1, "medium": 0.5, "high": 0.4 }
        },
        interests: ["technology", "software solutions", "business productivity", "IT management"],
        response: {
          headlines: { "problem_solution": 0.85, "statistic": 0.7, "question": 0.6 },
          descriptions: { "features": 0.7, "roi": 0.85, "integration": 0.75 },
          ctas: { "free_trial": 0.85, "demo": 0.8, "learn_more": 0.65 }
        }
      }
    ],
    scenarioParameters: {
      initialBudget: 3000,
      recommendedBidStrategy: "target_roas",
      competitivePressure: 0.85,
      seasonalityPattern: "technology",
      recommendedAdSchedule: Array(7).fill(null).map((_, i) => 
        i < 5 ? { morning: true, afternoon: true, evening: true } : { morning: false, afternoon: false, evening: false }
      ),
      geographicConsiderations: ["tech hubs", "business centers", "urban areas"]
    },
    successCriteria: {
      minimumROAS: 450,
      targetCPA: 100,
      expectedCTR: 0.02,
      qualityScoreThreshold: 8
    },
    challengeFactors: {
      audienceOverlap: true,
      budgetConstraints: false,
      competitiveBidding: true,
      seasonalFluctuations: false,
      devicePerformanceGaps: true
    },
    timeHorizon: 30
  }
};

export class EnhancedSimulationEngine {
  private baseClickThroughRate = 0.02; // 2% base CTR
  private baseConversionRate = 0.03; // 3% base conversion rate
  private baseCostPerClick = 1.50; // $1.50 base CPC
  
  // Get simulation configuration for a specific lesson
  getSimulationConfig(lessonType: keyof typeof lessonSimulations): LessonSpecificSimulation {
    return lessonSimulations[lessonType];
  }

  async simulateCampaign(campaign: Campaign, lessonType: keyof typeof lessonSimulations, daysToSimulate: number = 30): Promise<SimulationData[]> {
    const simulationConfig = this.getSimulationConfig(lessonType);
    const results: SimulationData[] = [];
    
    for (let day = 1; day <= daysToSimulate; day++) {
      const result = await this.simulateDay(campaign, lessonType, day);
      results.push(result);
    }
    
    return results;
  }

  async simulateDay(campaign: Campaign, lessonType: keyof typeof lessonSimulations, day: number): Promise<SimulationData> {
    const simulationConfig = this.getSimulationConfig(lessonType);
    const industryBenchmarks = INDUSTRY_BENCHMARKS[simulationConfig.industry];
    
    // Generate market conditions specific to the lesson and day
    const marketConditions = this.generateMarketConditions(day, simulationConfig);
    
    // Evaluate campaign factors based on user's campaign settings
    const simFactors = this.evaluateCampaignFactors(campaign, simulationConfig);
    
    // Calculate performance metrics
    const impressions = this.calculateImpressions(
      campaign.dailyBudget, 
      simFactors, 
      marketConditions,
      industryBenchmarks
    );
    
    const clicks = this.calculateClicks(
      impressions, 
      simFactors, 
      marketConditions,
      industryBenchmarks
    );
    
    const conversions = this.calculateConversions(
      clicks, 
      simFactors, 
      marketConditions,
      industryBenchmarks
    );
    
    const cost = this.calculateCost(
      clicks, 
      simFactors, 
      marketConditions,
      industryBenchmarks
    );
    
    // Calculate quality metrics
    const qualityScore = this.calculateQualityScore(simFactors);
    const averagePosition = this.calculateAveragePosition(qualityScore, simFactors.bidStrategy);
    
    // Calculate derived metrics
    const ctr = clicks > 0 ? clicks / impressions : 0;
    const cpc = clicks > 0 ? cost / clicks : 0;
    const conversionRate = clicks > 0 ? conversions / clicks : 0;
    const cpa = conversions > 0 ? cost / conversions : 0;
    const conversionValue = this.calculateConversionValue(conversions, simulationConfig);
    const roas = cost > 0 ? (conversionValue / cost) * 100 : 0;

    // Store simulation data
    const simulationData: SimulationData = {
      id: 0, // Will be set by the database
      campaignId: campaign.id,
      impressions,
      clicks,
      conversions,
      cost,
      averagePosition,
      qualityScore,
      date: new Date(),
      ctr,
      cpc,
      conversionRate,
      cpa,
      conversionValue,
      roas
    };

    // Insert into database
    const [result] = await db
      .insert('simulation_data')
      .values(simulationData)
      .returning({ id: 'simulation_data.id' });
    
    simulationData.id = result.id;
    return simulationData;
  }

  private generateMarketConditions(day: number, config: LessonSpecificSimulation): MarketConditions {
    const dayOfWeek = day % 7; // 0 = Sunday, 6 = Saturday
    const weekNumber = Math.floor(day / 7);
    
    // Base seasonality patterns
    let seasonality = 0.9;
    
    // Apply different seasonality patterns based on industry
    switch (config.scenarioParameters.seasonalityPattern) {
      case 'retail':
        // Higher on weekends, peaks at holiday seasons
        seasonality = 0.8 + (dayOfWeek >= 5 ? 0.1 : 0) + Math.sin(day / 30 * Math.PI) * 0.2;
        break;
      case 'educational':
        // Higher on weekdays, peaks during enrollment periods
        seasonality = 0.9 + (dayOfWeek < 5 ? 0.1 : 0) + Math.sin(day / 90 * Math.PI) * 0.15;
        break;
      case 'financial':
        // Higher on weekdays, stable throughout year
        seasonality = 0.85 + (dayOfWeek < 5 ? 0.15 : 0);
        break;
      case 'technology':
        // Stable with quarterly peaks (product launches)
        seasonality = 0.85 + Math.sin(day / 90 * Math.PI) * 0.15;
        break;
      case 'service':
        // Higher on weekdays, minor seasonal variations
        seasonality = 0.85 + (dayOfWeek < 5 ? 0.1 : 0) + Math.sin(day / 180 * Math.PI) * 0.05;
        break;
      default:
        // Standard pattern with weekly cycles
        seasonality = 0.85 + Math.sin(day / 7 * Math.PI) * 0.1;
    }
    
    // Weekday effect (business days vs weekends)
    const weekdayEffect = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.1 : 0.8;
    
    // Competition varies by day of week and increases slightly over time
    const competition = Math.min(
      0.95,
      config.scenarioParameters.competitivePressure * (1 + weekNumber * 0.01) * 
      (dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.05 : 0.95)
    );
    
    // Search volume varies by day of week
    const baseSearchVolume = 1.0;
    const dayAdjustment = [0.7, 1.0, 1.1, 1.15, 1.1, 1.0, 0.8]; // Sun-Sat
    const searchVolume = baseSearchVolume * dayAdjustment[dayOfWeek];
    
    // Industry-specific trend (growth or decline)
    const industryTrend = 1.0 + (Math.sin(day / 60 * Math.PI) * 0.05);
    
    // Market growth combines weekly cycles with longer-term trends
    const marketGrowth = Math.sin(day / 30 * Math.PI) * 0.1 + 0.05;
    
    return {
      seasonality,
      competition,
      marketGrowth,
      searchVolume,
      weekdayEffect,
      industryTrend
    };
  }

  private evaluateCampaignFactors(campaign: Campaign, config: LessonSpecificSimulation): SimulationFactors {
    // Evaluate ad copy quality
    const adQuality = this.evaluateAdQuality(campaign.adHeadlines, campaign.adDescriptions, config);
    
    // Evaluate targeting precision
    const targeting = this.evaluateTargeting(campaign.targeting, campaign.keywords, config);
    
    // Evaluate keyword relevance
    const keywordRelevance = this.evaluateKeywordRelevance(campaign.keywords, config);
    
    // Evaluate landing page experience
    const landingPageExperience = this.evaluateLandingPageExperience(campaign.landingPageUrl, config);
    
    // Evaluate bid strategy effectiveness
    const bidStrategy = this.evaluateBidStrategy(
      campaign.targetCpa,
      campaign.dailyBudget,
      campaign.bidStrategy, 
      config
    );
    
    // Evaluate ad group structure
    const adGroupStructure = this.evaluateAdGroupStructure(campaign);
    
    // Evaluate extensions impact
    const extensionsImpact = this.evaluateExtensionsImpact(campaign.extensions || []);
    
    // Evaluate negative keywords impact
    const negativeKeywordsImpact = this.evaluateNegativeKeywordsImpact(campaign.negativeKeywords || []);
    
    // Use campaign's historical performance if available, otherwise estimate
    const historicalPerformance = 0.6 + Math.random() * 0.2; // Simplified for now

    return {
      adQuality,
      targeting,
      bidStrategy,
      budget: campaign.dailyBudget,
      keywordRelevance,
      landingPageExperience,
      historicalPerformance,
      adGroupStructure,
      extensionsImpact, 
      negativeKeywordsImpact
    };
  }

  private evaluateAdQuality(headlines: string[], descriptions: string[], config: LessonSpecificSimulation): number {
    if (!headlines || !descriptions || headlines.length === 0 || descriptions.length === 0) {
      return 0.3; // Penalize empty ad copy
    }
    
    const audienceResponses = config.defaultAudiences.map(audience => {
      // Check for headline types and their effectiveness
      let headlineScore = 0;
      let headlineMatches = 0;
      
      for (const headline of headlines) {
        const lowercaseHeadline = headline.toLowerCase();
        
        // Check if headline matches audience preferences
        if (lowercaseHeadline.includes('?') && audience.response.headlines.question) {
          headlineScore += audience.response.headlines.question;
          headlineMatches++;
        } else if (/\d+%|\d+x|#1|first|best/.test(lowercaseHeadline) && audience.response.headlines.statistic) {
          headlineScore += audience.response.headlines.statistic;
          headlineMatches++;
        } else if (/save|free|discount|offer|deal/.test(lowercaseHeadline) && audience.response.headlines.promotional) {
          headlineScore += audience.response.headlines.promotional;
          headlineMatches++;
        } else if (/benefit|improve|enhance|boost|grow/.test(lowercaseHeadline) && audience.response.headlines.benefit) {
          headlineScore += audience.response.headlines.benefit;
          headlineMatches++;
        }
      }
      
      // Check for description types and their effectiveness
      let descriptionScore = 0;
      let descriptionMatches = 0;
      
      for (const description of descriptions) {
        const lowercaseDesc = description.toLowerCase();
        
        // Check if description matches audience preferences
        if (/feature|includes|with|has|provides/.test(lowercaseDesc) && audience.response.descriptions.features) {
          descriptionScore += audience.response.descriptions.features;
          descriptionMatches++;
        } else if (/benefit|improve|save|increase|reduce/.test(lowercaseDesc) && audience.response.descriptions.benefits) {
          descriptionScore += audience.response.descriptions.benefits;
          descriptionMatches++;
        } else if (/testimonial|customers|clients|people|users/.test(lowercaseDesc) && audience.response.descriptions.social_proof) {
          descriptionScore += audience.response.descriptions.social_proof;
          descriptionMatches++;
        } else if (/security|secure|protected|safe|private/.test(lowercaseDesc) && audience.response.descriptions.security) {
          descriptionScore += audience.response.descriptions.security;
          descriptionMatches++;
        }
      }
      
      // Calculate average scores
      const avgHeadlineScore = headlineMatches > 0 ? headlineScore / headlineMatches : 0.4;
      const avgDescriptionScore = descriptionMatches > 0 ? descriptionScore / descriptionMatches : 0.4;
      
      // Combined score weighted by audience engagement rate
      return (avgHeadlineScore * 0.6 + avgDescriptionScore * 0.4) * audience.engagementRate;
    });
    
    // Take average of audience responses, or default to medium quality
    const avgResponse = audienceResponses.length > 0 
      ? audienceResponses.reduce((sum, score) => sum + score, 0) / audienceResponses.length
      : 0.5;
    
    // Check for policy compliance issues that would lower quality
    const policyCompliance = this.checkAdPolicyCompliance(headlines, descriptions);
    
    // Final quality score
    const finalQuality = avgResponse * policyCompliance;
    
    // Ensure score is between 0.3 and 0.95 (not perfect)
    return Math.max(0.3, Math.min(0.95, finalQuality));
  }

  private checkAdPolicyCompliance(headlines: string[], descriptions: string[]): number {
    let policyScore = 1.0;
    
    // Check for all caps
    const hasAllCaps = headlines.some(h => h === h.toUpperCase() && h.length > 2) || 
                       descriptions.some(d => d === d.toUpperCase() && d.length > 2);
    if (hasAllCaps) policyScore *= 0.7;
    
    // Check for excessive punctuation
    const hasExcessivePunctuation = headlines.some(h => (h.match(/!+/g) || []).length > 1 || 
                                                      (h.match(/\?+/g) || []).length > 1) ||
                                    descriptions.some(d => (d.match(/!+/g) || []).length > 1 || 
                                                      (d.match(/\?+/g) || []).length > 1);
    if (hasExcessivePunctuation) policyScore *= 0.8;
    
    // Check for superlatives without verification
    const hasUnverifiedSuperlatives = headlines.some(h => /best|perfect|ultimate|#1/.test(h.toLowerCase())) ||
                                     descriptions.some(d => /best|perfect|ultimate|#1/.test(d.toLowerCase()));
    if (hasUnverifiedSuperlatives) policyScore *= 0.9;
    
    return policyScore;
  }

  private evaluateTargeting(targeting: any, keywords: any[], config: LessonSpecificSimulation): number {
    if (!targeting || !keywords || keywords.length === 0) {
      return 0.3; // Penalize empty targeting
    }
    
    // Evaluate geographic targeting
    let geoScore = 0.5; // Default medium score
    if (targeting.locations && targeting.locations.length > 0) {
      // Check if targeting matches recommended locations
      const recommendedLocations = config.scenarioParameters.geographicConsiderations;
      const targetingMatchesRecommendations = recommendedLocations.some(
        loc => targeting.locations.some((targetLoc: string) => 
          targetLoc.toLowerCase().includes(loc.toLowerCase())
        )
      );
      
      geoScore = targetingMatchesRecommendations ? 0.8 : 0.5;
      
      // Adjust based on number of locations (too many might dilute, too few might be too narrow)
      if (targeting.locations.length > 10) geoScore *= 0.9;
      if (targeting.locations.length === 1) geoScore *= 0.95;
    }
    
    // Evaluate demographic targeting
    let demoScore = 0.5; // Default medium score
    if (targeting.demographics) {
      const demographics = targeting.demographics;
      const audienceDemos = config.defaultAudiences[0].demographics;
      
      // Check if age targeting aligns with audience age groups
      if (demographics.ageRanges && demographics.ageRanges.length > 0) {
        const targetedAgeGroups = demographics.ageRanges;
        const audienceTopAgeGroups = Object.entries(audienceDemos.ageGroups)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .slice(0, 3)
          .map(([ageGroup]) => ageGroup);
          
        const ageAlignmentScore = targetedAgeGroups.filter(
          (ageRange: string) => audienceTopAgeGroups.some(
            audienceAge => ageRange.includes(audienceAge.split('-')[0])
          )
        ).length / Math.max(targetedAgeGroups.length, 1);
        
        demoScore = 0.4 + (ageAlignmentScore * 0.6);
      }
    }
    
    // Evaluate device targeting
    let deviceScore = 0.7; // Default decent score
    if (targeting.devices) {
      const devices = targeting.devices;
      const audienceDevices = config.defaultAudiences[0].devices;
      
      // Check if device targeting aligns with audience device usage
      if (audienceDevices.mobile > 0.5 && !devices.includes('mobile')) {
        deviceScore *= 0.7; // Penalty for missing mobile when audience is mobile-heavy
      }
      
      if (audienceDevices.desktop > 0.5 && !devices.includes('desktop')) {
        deviceScore *= 0.8; // Penalty for missing desktop when audience is desktop-heavy
      }
    }
    
    // Evaluate ad scheduling
    let scheduleScore = 0.6; // Default medium score
    if (targeting.adSchedule) {
      const schedule = targeting.adSchedule;
      const recommendedSchedule = config.scenarioParameters.recommendedAdSchedule;
      
      // Check how well schedule aligns with recommended schedule
      let alignmentCount = 0;
      let totalSlots = 0;
      
      for (let day = 0; day < 7; day++) {
        const daySchedule = schedule[day];
        const recommendedDay = recommendedSchedule[day];
        
        if (daySchedule && recommendedDay) {
          ['morning', 'afternoon', 'evening'].forEach(timeSlot => {
            totalSlots++;
            if (daySchedule[timeSlot] === recommendedDay[timeSlot]) {
              alignmentCount++;
            }
          });
        }
      }
      
      scheduleScore = totalSlots > 0 ? 0.4 + (alignmentCount / totalSlots * 0.6) : 0.6;
    }
    
    // Keyword targeting evaluation
    let keywordScore = 0.5; // Default medium score
    if (keywords && keywords.length > 0) {
      // Analyze keyword match types
      const matchTypeCounts = {
        broad: 0,
        phrase: 0,
        exact: 0
      };
      
      keywords.forEach(keyword => {
        if (keyword.matchType) {
          matchTypeCounts[keyword.matchType as keyof typeof matchTypeCounts]++;
        }
      });
      
      const totalKeywords = keywords.length;
      const broadRatio = matchTypeCounts.broad / totalKeywords;
      const phraseRatio = matchTypeCounts.phrase / totalKeywords;
      const exactRatio = matchTypeCounts.exact / totalKeywords;
      
      // Score based on balanced use of match types
      const balanceScore = 
        exactRatio > 0.2 && phraseRatio > 0.3 && broadRatio < 0.5 ? 0.9 :
        exactRatio > 0.1 && phraseRatio > 0.2 ? 0.8 :
        exactRatio === 0 && phraseRatio === 0 ? 0.3 : // Only broad match is weak
        0.6; // Default moderate balance
        
      // Adjust for keyword count
      const countAdjustment = 
        totalKeywords < 5 ? 0.7 :  // Too few keywords
        totalKeywords > 50 ? 0.8 : // Too many keywords
        totalKeywords > 20 ? 0.9 : // Slightly too many
        1.0;                       // Good range
        
      keywordScore = balanceScore * countAdjustment;
    }
    
    // Combined targeting score
    return (
      geoScore * 0.25 +
      demoScore * 0.15 +
      deviceScore * 0.15 +
      scheduleScore * 0.15 +
      keywordScore * 0.3
    );
  }

  private evaluateKeywordRelevance(keywords: any[], config: LessonSpecificSimulation): number {
    if (!keywords || keywords.length === 0) {
      return 0.3; // Penalize empty keywords
    }
    
    // Get audience interests from configuration
    const audienceInterests = config.defaultAudiences.flatMap(audience => audience.interests);
    
    // Count keywords that match audience interests
    let relevantKeywordCount = 0;
    
    keywords.forEach(keyword => {
      const keywordText = keyword.text.toLowerCase();
      
      // Check if keyword matches any audience interest
      const matchesInterest = audienceInterests.some(interest => 
        keywordText.includes(interest) || interest.includes(keywordText)
      );
      
      if (matchesInterest) {
        relevantKeywordCount++;
      }
    });
    
    // Calculate relevance score
    const relevanceRatio = keywords.length > 0 ? relevantKeywordCount / keywords.length : 0;
    
    // Adjust score based on match types
    let matchTypeScore = 0.5; // Default medium score
    
    const exactCount = keywords.filter(k => k.matchType === 'exact').length;
    const phraseCount = keywords.filter(k => k.matchType === 'phrase').length;
    const broadCount = keywords.filter(k => k.matchType === 'broad').length;
    
    const exactRatio = keywords.length > 0 ? exactCount / keywords.length : 0;
    const phraseRatio = keywords.length > 0 ? phraseCount / keywords.length : 0;
    const broadRatio = keywords.length > 0 ? broadCount / keywords.length : 0;
    
    // Score higher for balanced match types with focus on exact/phrase
    if (exactRatio >= 0.3 && phraseRatio >= 0.3 && broadRatio <= 0.4) {
      matchTypeScore = 0.9; // Excellent balance
    } else if (exactRatio >= 0.2 && phraseRatio >= 0.2) {
      matchTypeScore = 0.8; // Good balance
    } else if (exactRatio === 0 && phraseRatio === 0) {
      matchTypeScore = 0.4; // Poor - only broad match
    } else if (broadRatio === 0) {
      matchTypeScore = 0.7; // Missing broader coverage
    }
    
    // Final keyword relevance score
    return (relevanceRatio * 0.6) + (matchTypeScore * 0.4);
  }

  private evaluateLandingPageExperience(landingPageUrl: string, config: LessonSpecificSimulation): number {
    if (!landingPageUrl) {
      return 0.3; // Penalize missing landing page
    }
    
    // Basic checks on landing page URL
    const hasValidDomain = /^https?:\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/i.test(landingPageUrl);
    
    if (!hasValidDomain) {
      return 0.4; // Poor score for invalid URL
    }
    
    // Simulate landing page relevance
    let relevanceScore = 0.7; // Default decent score
    
    // Check if URL contains relevant keywords to industry
    const industry = config.industry;
    const relevantTerms = {
      retail: ['shop', 'store', 'buy', 'product', 'collection', 'catalog'],
      finance: ['finance', 'bank', 'invest', 'loan', 'mortgage', 'credit'],
      education: ['course', 'class', 'learn', 'training', 'education', 'study'],
      technology: ['tech', 'software', 'app', 'digital', 'solution', 'platform'],
      healthcare: ['health', 'medical', 'doctor', 'care', 'treatment', 'wellness'],
      travel: ['travel', 'vacation', 'hotel', 'flight', 'booking', 'destination'],
      localServices: ['service', 'local', 'repair', 'contractor', 'provider', 'professional'],
      realEstate: ['home', 'property', 'real estate', 'house', 'apartment', 'rent']
    };
    
    const industryTerms = relevantTerms[industry];
    const urlContainsIndustryTerm = industryTerms.some(term => 
      landingPageUrl.toLowerCase().includes(term.toLowerCase())
    );
    
    if (urlContainsIndustryTerm) {
      relevanceScore = 0.8;
    }
    
    // Simulate user experience
    const userExperienceScore = 0.7 + (Math.random() * 0.2);
    
    // Simulate mobile-friendliness
    const mobileScore = landingPageUrl.includes('mobile') || landingPageUrl.includes('responsive') 
      ? 0.9
      : 0.7;
    
    // Weighted landing page score
    return (
      relevanceScore * LANDING_PAGE_FACTORS.relevance.weight +
      userExperienceScore * LANDING_PAGE_FACTORS.userExperience.weight +
      mobileScore * LANDING_PAGE_FACTORS.mobileOptimization.weight
    );
  }

  private evaluateBidStrategy(targetCpa: number, dailyBudget: number, bidStrategy: string, config: LessonSpecificSimulation): number {
    // Check if bidding strategy matches recommendation
    const recommendedStrategy = config.scenarioParameters.recommendedBidStrategy;
    const strategyMatchScore = bidStrategy === recommendedStrategy ? 1.0 : 0.7;
    
    // Evaluate target CPA (if applicable)
    let targetCpaScore = 0.7; // Default decent score
    
    if (bidStrategy.includes('cpa') && targetCpa) {
      const recommendedCpa = config.successCriteria.targetCPA;
      const cpaRatio = targetCpa / recommendedCpa;
      
      // Score based on how close target CPA is to recommended value
      if (cpaRatio > 0.8 && cpaRatio < 1.2) {
        targetCpaScore = 0.9; // Within 20% of recommended
      } else if (cpaRatio > 0.6 && cpaRatio < 1.4) {
        targetCpaScore = 0.7; // Within 40% of recommended
      } else {
        targetCpaScore = 0.5; // Far from recommended
      }
    }
    
    // Evaluate budget allocation
    let budgetScore = 0.6; // Default moderate score
    
    const recommendedBudget = config.scenarioParameters.initialBudget;
    const budgetRatio = dailyBudget / recommendedBudget;
    
    // Score based on how reasonable the budget is
    if (budgetRatio > 0.7 && budgetRatio < 1.3) {
      budgetScore = 0.9; // Within 30% of recommended
    } else if (budgetRatio > 0.5 && budgetRatio < 1.5) {
      budgetScore = 0.7; // Within 50% of recommended
    } else if (budgetRatio < 0.1) {
      budgetScore = 0.3; // Severely underbudgeted
    } else if (budgetRatio > 3) {
      budgetScore = 0.5; // Potentially wasteful budget
    }
    
    // Combine scores with appropriate weights
    return (
      strategyMatchScore * 0.4 +
      targetCpaScore * 0.3 +
      budgetScore * 0.3
    );
  }

  private evaluateAdGroupStructure(campaign: Campaign): number {
    // Simplified evaluation for now
    // In a real implementation, this would analyze the structure of ad groups
    // relative to keywords and ads
    
    // Default medium score
    const defaultScore = 0.6;
    
    // Check if campaign has ad groups
    if (!campaign.adGroups || campaign.adGroups.length === 0) {
      return 0.3; // Poor score for no ad groups
    }
    
    // Check for a reasonable number of ad groups
    const adGroupCount = campaign.adGroups.length;
    
    if (adGroupCount === 1 && campaign.keywords.length > 20) {
      return 0.4; // Poor score for too many keywords in one ad group
    }
    
    if (adGroupCount > 10) {
      return 0.7; // Good score for multiple ad groups
    }
    
    return defaultScore;
  }

  private evaluateExtensionsImpact(extensions: string[]): number {
    if (!extensions || extensions.length === 0) {
      return 0.5; // Neutral score for no extensions
    }
    
    // Count unique extension types
    const uniqueExtensionTypes = new Set(extensions.map(ext => {
      // Simplified parsing - in real implementation, would use structured data
      if (ext.includes('sitelink')) return 'sitelink';
      if (ext.includes('callout')) return 'callout';
      if (ext.includes('call')) return 'call';
      if (ext.includes('promotion')) return 'promotion';
      if (ext.includes('price')) return 'price';
      if (ext.includes('location')) return 'location';
      return 'other';
    }));
    
    // Score based on number of extension types
    const extensionTypeCount = uniqueExtensionTypes.size;
    
    if (extensionTypeCount >= 4) {
      return 0.9; // Excellent use of extensions
    } else if (extensionTypeCount >= 2) {
      return 0.8; // Good use of extensions
    } else {
      return 0.6; // Basic use of extensions
    }
  }

  private evaluateNegativeKeywordsImpact(negativeKeywords: string[]): number {
    if (!negativeKeywords || negativeKeywords.length === 0) {
      return 0.5; // Neutral score for no negative keywords
    }
    
    // Score based on number of negative keywords
    const negativeKeywordCount = negativeKeywords.length;
    
    if (negativeKeywordCount >= 20) {
      return 0.9; // Excellent use of negative keywords
    } else if (negativeKeywordCount >= 10) {
      return 0.8; // Good use of negative keywords
    } else if (negativeKeywordCount >= 5) {
      return 0.7; // Decent use of negative keywords
    } else {
      return 0.6; // Basic use of negative keywords
    }
  }

  private calculateImpressions(
    budget: number, 
    factors: SimulationFactors, 
    marketConditions: MarketConditions,
    industryBenchmarks: any
  ): number {
    // Base impressions calculation
    const baseImpressions = budget * 1000 * (1 / industryBenchmarks.avgCPC);
    
    // Quality modifiers
    const qualityMultiplier = 0.5 + factors.adQuality * 0.5;
    const targetingMultiplier = 0.5 + factors.targeting * 0.5;
    const budgetEfficiencyMultiplier = 0.5 + factors.bidStrategy * 0.5;
    
    // Market condition modifiers
    const seasonalityMultiplier = marketConditions.seasonality;
    const competitionMultiplier = 1 - (marketConditions.competition * 0.5);
    const searchVolumeMultiplier = marketConditions.searchVolume;
    const weekdayMultiplier = marketConditions.weekdayEffect;
    
    // Ad structure modifiers
    const adGroupStructureMultiplier = 0.7 + (factors.adGroupStructure * 0.3);
    const extensionsMultiplier = 1 + (factors.extensionsImpact * 0.2);
    
    // Calculate final impressions
    const adjustedImpressions = baseImpressions * 
      qualityMultiplier * 
      targetingMultiplier * 
      budgetEfficiencyMultiplier * 
      seasonalityMultiplier * 
      competitionMultiplier * 
      searchVolumeMultiplier * 
      weekdayMultiplier *
      adGroupStructureMultiplier *
      extensionsMultiplier;
    
    // Add some randomness (±10%)
    const randomVariation = 0.9 + (Math.random() * 0.2);
    
    return Math.round(adjustedImpressions * randomVariation);
  }

  private calculateClicks(
    impressions: number,
    factors: SimulationFactors,
    marketConditions: MarketConditions,
    industryBenchmarks: any
  ): number {
    // Start with industry benchmark CTR
    const baseCTR = industryBenchmarks.avgCTR;
    
    // Quality modifiers
    const adQualityModifier = 0.5 + (factors.adQuality * 1.5);
    const targetingModifier = 0.5 + (factors.targeting * 1.5);
    const keywordRelevanceModifier = 0.7 + (factors.keywordRelevance * 0.6);
    
    // Market condition modifiers
    const seasonalityModifier = marketConditions.seasonality;
    const competitionModifier = 1 - (marketConditions.competition * 0.3);
    
    // Ad structure modifiers
    const extensionsModifier = 1 + (factors.extensionsImpact * 0.3);
    
    // Calculate adjusted CTR
    const adjustedCTR = baseCTR * 
      adQualityModifier * 
      targetingModifier * 
      keywordRelevanceModifier * 
      seasonalityModifier * 
      competitionModifier *
      extensionsModifier;
    
    // Apply some randomness (±15%)
    const randomVariation = 0.85 + (Math.random() * 0.3);
    
    // Calculate clicks
    return Math.round(impressions * adjustedCTR * randomVariation);
  }

  private calculateConversions(
    clicks: number,
    factors: SimulationFactors,
    marketConditions: MarketConditions,
    industryBenchmarks: any
  ): number {
    // Start with industry benchmark conversion rate
    const baseCVR = industryBenchmarks.avgCVR;
    
    // Quality modifiers
    const targetingModifier = 0.6 + (factors.targeting * 0.8);
    const landingPageModifier = 0.5 + (factors.landingPageExperience * 1.0);
    const keywordRelevanceModifier = 0.7 + (factors.keywordRelevance * 0.6);
    
    // Market condition modifiers
    const seasonalityModifier = marketConditions.seasonality;
    const weekdayModifier = marketConditions.weekdayEffect;
    
    // Negative keywords impact (reducing irrelevant traffic)
    const negativeKeywordsModifier = 1 + (factors.negativeKeywordsImpact * 0.2);
    
    // Calculate adjusted conversion rate
    const adjustedCVR = baseCVR * 
      targetingModifier * 
      landingPageModifier * 
      keywordRelevanceModifier * 
      seasonalityModifier * 
      weekdayModifier *
      negativeKeywordsModifier;
    
    // Apply some randomness (±20%)
    const randomVariation = 0.8 + (Math.random() * 0.4);
    
    // Calculate conversions
    return Math.round(clicks * adjustedCVR * randomVariation);
  }

  private calculateCost(
    clicks: number,
    factors: SimulationFactors,
    marketConditions: MarketConditions,
    industryBenchmarks: any
  ): number {
    // Start with industry benchmark CPC
    const baseCPC = industryBenchmarks.avgCPC;
    
    // Quality modifiers
    const qualityScoreModifier = 1.3 - (factors.adQuality * 0.6);
    const bidStrategyModifier = 0.8 + (factors.bidStrategy * 0.4);
    
    // Market condition modifiers
    const competitionModifier = 0.7 + (marketConditions.competition * 0.6);
    
    // Calculate adjusted CPC
    const adjustedCPC = baseCPC * 
      qualityScoreModifier * 
      bidStrategyModifier * 
      competitionModifier;
    
    // Apply some randomness (±10%)
    const randomVariation = 0.9 + (Math.random() * 0.2);
    
    // Calculate total cost
    const totalCost = clicks * adjustedCPC * randomVariation;
    
    // Ensure cost doesn't exceed budget
    const dailyBudget = factors.budget;
    const finalCost = Math.min(totalCost, dailyBudget * 1.2); // Google can exceed daily budget by up to 20%
    
    return Number(finalCost.toFixed(2));
  }

  private calculateConversionValue(conversions: number, config: LessonSpecificSimulation): number {
    // Get average purchase value from audience data
    const averagePurchaseValue = config.defaultAudiences[0].averagePurchaseValue;
    
    // Apply some randomness (±30%)
    const randomVariation = 0.7 + (Math.random() * 0.6);
    
    // Calculate total conversion value
    const conversionValue = conversions * averagePurchaseValue * randomVariation;
    
    return Number(conversionValue.toFixed(2));
  }

  private calculateQualityScore(factors: SimulationFactors): number {
    // Quality Score is on a scale of 1-10
    const score = Math.round(
      (factors.adQuality * 0.4 + 
       factors.keywordRelevance * 0.4 + 
       factors.landingPageExperience * 0.2) * 10
    );
    
    return Math.min(Math.max(score, 1), 10);
  }

  private calculateAveragePosition(qualityScore: number, bidStrategy: number): number {
    // Note: While average position is deprecated in Google Ads,
    // it's still useful for simulation and educational purposes
    
    const position = 4 - (qualityScore / 10 * 2 + bidStrategy * 1);
    return Number(Math.max(1, position).toFixed(1));
  }

  async getPerformanceAnalysis(simulationData: SimulationData, lessonType: keyof typeof lessonSimulations) {
    const config = this.getSimulationConfig(lessonType);
    
    // Compare results to success criteria
    const successCriteria = config.successCriteria;
    
    const analysisByMetric = {
      impressions: {
        value: simulationData.impressions,
        status: 'neutral',
        insight: 'Average impression volume for this industry.'
      },
      clicks: {
        value: simulationData.clicks,
        status: simulationData.ctr > industryBenchmarks[config.industry].avgCTR ? 'positive' : 'negative',
        insight: `Click-through rate is ${simulationData.ctr > industryBenchmarks[config.industry].avgCTR ? 'above' : 'below'} industry average of ${(industryBenchmarks[config.industry].avgCTR * 100).toFixed(2)}%.`
      },
      conversions: {
        value: simulationData.conversions,
        status: simulationData.conversionRate > industryBenchmarks[config.industry].avgCVR ? 'positive' : 'negative',
        insight: `Conversion rate is ${simulationData.conversionRate > industryBenchmarks[config.industry].avgCVR ? 'above' : 'below'} industry average of ${(industryBenchmarks[config.industry].avgCVR * 100).toFixed(2)}%.`
      },
      cost: {
        value: simulationData.cost,
        status: 'neutral',
        insight: 'Cost is within expected range for the budget.'
      },
      cpa: {
        value: simulationData.cpa,
        status: simulationData.cpa < successCriteria.targetCPA ? 'positive' : 'negative',
        insight: `Cost per acquisition is ${simulationData.cpa < successCriteria.targetCPA ? 'below' : 'above'} target of $${successCriteria.targetCPA}.`
      },
      roas: {
        value: simulationData.roas,
        status: simulationData.roas > successCriteria.minimumROAS ? 'positive' : 'negative',
        insight: `Return on ad spend is ${simulationData.roas > successCriteria.minimumROAS ? 'above' : 'below'} minimum target of ${successCriteria.minimumROAS}%.`
      },
      qualityScore: {
        value: simulationData.qualityScore,
        status: simulationData.qualityScore >= successCriteria.qualityScoreThreshold ? 'positive' : 'negative',
        insight: `Quality Score is ${simulationData.qualityScore >= successCriteria.qualityScoreThreshold ? 'good' : 'below target'}. ${simulationData.qualityScore < successCriteria.qualityScoreThreshold ? 'Consider improving ad relevance and landing page experience.' : ''}`
      }
    };
    
    // Generate overall insights
    const insights = [];
    
    // Add metric-specific insights
    for (const [metric, analysis] of Object.entries(analysisByMetric)) {
      if (analysis.status !== 'neutral') {
        insights.push(analysis.insight);
      }
    }
    
    // Add lesson-specific insights
    switch (lessonType) {
      case 'accountArchitecture':
        insights.push("Your account structure impacts campaign performance. Consider organizing campaigns by product lines or themes.");
        break;
      case 'searchCampaigns':
        insights.push("Search campaign performance is heavily influenced by keyword quality and match types.");
        break;
      case 'shoppingCampaigns':
        insights.push("Shopping campaign performance depends on product feed quality and bidding strategy.");
        break;
      case 'audienceTargeting':
        insights.push("Targeting refinement can significantly improve conversion rates and reduce wasted spend.");
        break;
      case 'troubleshooting':
        if (simulationData.qualityScore < 5) {
          insights.push("Low Quality Score detected. Review ad relevance and landing page experience.");
        }
        break;
      case 'performanceAnalysis':
        insights.push("Analyze data trends over time to identify optimization opportunities.");
        break;
    }
    
    // Get AI-powered recommendations
    const marketingAI = await this.getMarketingAI(simulationData.campaignId);
    const aiRecommendations = await marketingAI.analyzeCampaignPerformance(simulationData);
    
    if (aiRecommendations && aiRecommendations.length > 0) {
      insights.push(...aiRecommendations);
    }
    
    return {
      performance: analysisByMetric,
      insights: insights.filter((v, i, a) => a.indexOf(v) === i).slice(0, 5) // Deduplicate and limit to 5 insights
    };
  }

  private async getMarketingAI(campaignId: number) {
    // Get user's subscription tier from campaign owner
    const [campaign] = await db
      .select({ userId: 'campaigns.userId' })
      .from('campaigns')
      .where({ id: campaignId });

    const [subscription] = await db
      .select({ tier: 'subscriptions.tier' })
      .from('subscriptions')
      .where({ userId: campaign?.userId });

    switch (subscription?.tier) {
      case 'enterprise':
        return enterpriseMarketingAI;
      case 'premium':
        return premiumMarketingAI;
      default:
        return freeMarketingAI;
    }
  }
}

export const enhancedSimulationEngine = new EnhancedSimulationEngine();
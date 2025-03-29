import { Campaign } from '@shared/schema';

/**
 * Ad Performance Algorithm
 * 
 * This file contains the mathematical formulas that translate campaign settings into 
 * ad performance metrics. It serves as the core of the simulation engine.
 */

// Base reference values for different platforms and ad types
const BASE_METRICS = {
  google: {
    search: {
      ctr: 0.0196,           // 1.96% average CTR for search
      conversionRate: 0.0323, // 3.23% average conversion rate
      cpc: 2.32,              // $2.32 average CPC
      qualityScoreWeight: 0.4 // How much quality score affects performance
    },
    display: {
      ctr: 0.0046,            // 0.46% average CTR for display
      conversionRate: 0.0127, // 1.27% average conversion rate
      cpc: 0.67,              // $0.67 average CPC
      qualityScoreWeight: 0.3 // How much quality score affects performance
    },
    shopping: {
      ctr: 0.0086,            // 0.86% average CTR for shopping
      conversionRate: 0.0187, // 1.87% average conversion rate
      cpc: 0.66,              // $0.66 average CPC
      qualityScoreWeight: 0.35 // How much quality score affects performance
    }
  },
  meta: {
    feed: {
      ctr: 0.0089,            // 0.89% average CTR for feed ads
      conversionRate: 0.0108, // 1.08% average conversion rate
      cpc: 0.94,              // $0.94 average CPC
      relevanceScoreWeight: 0.45 // How much relevance score affects performance
    },
    stories: {
      ctr: 0.0052,            // 0.52% average CTR for stories
      conversionRate: 0.0083, // 0.83% average conversion rate
      cpc: 0.78,              // $0.78 average CPC
      relevanceScoreWeight: 0.5 // How much relevance score affects performance
    },
    reels: {
      ctr: 0.0075,            // 0.75% average CTR for reels
      conversionRate: 0.0091, // 0.91% average conversion rate
      cpc: 0.88,              // $0.88 average CPC
      relevanceScoreWeight: 0.5 // How much relevance score affects performance
    }
  }
};

// Campaign goal impact multipliers
const GOAL_IMPACT = {
  'Brand Awareness': {
    ctrMultiplier: 0.85,
    conversionRateMultiplier: 0.7,
    cpcMultiplier: 0.9,
    impressionsMultiplier: 1.3
  },
  'Website Traffic': {
    ctrMultiplier: 1.2,
    conversionRateMultiplier: 0.9,
    cpcMultiplier: 1.1,
    impressionsMultiplier: 1.15
  },
  'Lead Generation': {
    ctrMultiplier: 1.05,
    conversionRateMultiplier: 1.15,
    cpcMultiplier: 1.2,
    impressionsMultiplier: 0.9
  },
  'Sales': {
    ctrMultiplier: 0.95,
    conversionRateMultiplier: 1.25,
    cpcMultiplier: 1.3,
    impressionsMultiplier: 0.85
  },
  'App Promotion': {
    ctrMultiplier: 1.1,
    conversionRateMultiplier: 1.1,
    cpcMultiplier: 1.15,
    impressionsMultiplier: 0.95
  }
};

// Industry competition factors - affects CPC and impressions
const INDUSTRY_COMPETITION = {
  'E-commerce': 0.85,
  'Finance': 1.4,
  'Insurance': 1.5,
  'Legal': 1.45,
  'Health': 1.1,
  'Education': 0.8,
  'Real Estate': 1.0,
  'Travel': 0.9,
  'Technology': 1.1,
  'B2B': 0.95,
  'Entertainment': 0.7,
  'Automotive': 1.2,
  'Home Services': 0.9
};

// Seasonality factors (by month)
const SEASONALITY = [
  1.0,  // January
  0.95, // February
  1.05, // March
  1.1,  // April
  1.15, // May
  1.05, // June
  1.0,  // July
  1.05, // August
  1.2,  // September
  1.25, // October
  1.4,  // November (holiday season)
  1.5   // December (holiday season)
];

// Device performance modifiers
const DEVICE_MODIFIERS = {
  'mobile': {
    ctrMultiplier: 0.9,
    conversionRateMultiplier: 0.8,
    cpcMultiplier: 0.85
  },
  'tablet': {
    ctrMultiplier: 0.95,
    conversionRateMultiplier: 0.9,
    cpcMultiplier: 0.9
  },
  'desktop': {
    ctrMultiplier: 1.1,
    conversionRateMultiplier: 1.2,
    cpcMultiplier: 1.15
  }
};

// Time of day performance modifiers (24-hour format)
const TIME_OF_DAY_MODIFIERS = [
  0.5,  // 12 AM
  0.4,  // 1 AM
  0.3,  // 2 AM
  0.25, // 3 AM
  0.2,  // 4 AM
  0.3,  // 5 AM
  0.5,  // 6 AM
  0.7,  // 7 AM
  0.9,  // 8 AM
  1.1,  // 9 AM
  1.2,  // 10 AM
  1.25, // 11 AM
  1.3,  // 12 PM
  1.25, // 1 PM
  1.2,  // 2 PM
  1.1,  // 3 PM
  1.0,  // 4 PM
  1.1,  // 5 PM
  1.2,  // 6 PM
  1.3,  // 7 PM
  1.2,  // 8 PM
  1.1,  // 9 PM
  0.9,  // 10 PM
  0.7   // 11 PM
];

/**
 * Interface for campaign simulation factors
 */
export interface CampaignPerformanceFactors {
  adQuality: number;          // 0-1 score based on ad copy quality
  keywordRelevance: number;   // 0-1 score based on keyword relevance (search)
  targetingPrecision: number; // 0-1 score based on audience targeting
  bidCompetitiveness: number; // 0-1 score based on bid relative to competition
  landingPageQuality: number; // 0-1 score based on landing page experience
  accountHistory: number;     // 0-1 score based on account performance history
  industry: string;           // Industry category
  seasonalityFactor: number;  // Current seasonality factor
  deviceMix: {               // Percentage distribution of devices
    mobile: number;           // 0-1
    tablet: number;           // 0-1
    desktop: number;          // 0-1
  };
  timeOfDay: number;          // Hour of day (0-23)
  dayOfWeek: number;          // Day of week (0-6, 0 being Sunday)
  adAge: number;              // Age of ad in days
}

/**
 * Interface for performance metrics
 */
export interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  cpa: number;
  qualityScore?: number;      // Google-specific
  relevanceScore?: number;    // Meta-specific
  averagePosition?: number;   // Search-specific
  impressionShare?: number;   // Share of available impressions
  roi: number;                // Return on investment
}

/**
 * Calculate Quality Score for Google Ads
 * 
 * Formula combines:
 * - Expected CTR
 * - Ad relevance to keywords
 * - Landing page experience
 * - Account history
 * 
 * Returns a value from 1-10
 */
export function calculateQualityScore(factors: CampaignPerformanceFactors): number {
  const expectedCTR = factors.adQuality * 0.5 + factors.keywordRelevance * 0.5;
  
  const weightedScore = 
    expectedCTR * 0.35 + 
    factors.keywordRelevance * 0.35 + 
    factors.landingPageQuality * 0.2 + 
    factors.accountHistory * 0.1;
  
  // Convert to 1-10 scale and round
  return Math.max(1, Math.min(10, Math.round(weightedScore * 9) + 1));
}

/**
 * Calculate Relevance Score for Meta Ads
 * 
 * Formula combines:
 * - Engagement rate expectations
 * - Ad quality
 * - Targeting precision
 * - Account history
 * 
 * Returns a value from 1-10
 */
export function calculateRelevanceScore(factors: CampaignPerformanceFactors): number {
  const expectedEngagement = 
    factors.adQuality * 0.6 + 
    factors.targetingPrecision * 0.4;
  
  const weightedScore = 
    expectedEngagement * 0.4 + 
    factors.adQuality * 0.3 + 
    factors.targetingPrecision * 0.2 + 
    factors.accountHistory * 0.1;
  
  // Convert to 1-10 scale and round
  return Math.max(1, Math.min(10, Math.round(weightedScore * 9) + 1));
}

/**
 * Calculate Expected CTR based on all factors
 * 
 * Formula considers:
 * - Base CTR for platform/type
 * - Ad quality
 * - Targeting precision
 * - Quality/Relevance score
 * - Device mix
 * - Time factors
 * - Campaign age
 * - Goal
 */
export function calculateExpectedCTR(
  platform: 'google' | 'meta',
  adType: string,
  factors: CampaignPerformanceFactors,
  goal: string
): number {
  // Get base CTR for this platform and ad type
  const baseMetrics = BASE_METRICS[platform][adType as keyof typeof BASE_METRICS[typeof platform]];
  const baseCTR = baseMetrics?.ctr || 0.01;
  
  // Apply quality/relevance score impact
  const scoreWeight = platform === 'google' 
    ? baseMetrics?.qualityScoreWeight || 0.3 
    : baseMetrics?.relevanceScoreWeight || 0.3;
  
  const qualityImpact = platform === 'google'
    ? ((calculateQualityScore(factors) / 10) * 2 - 1) * scoreWeight
    : ((calculateRelevanceScore(factors) / 10) * 2 - 1) * scoreWeight;
  
  // Calculate ad-specific CTR impact
  const adQualityImpact = (factors.adQuality * 2 - 1) * 0.3;
  const targetingImpact = (factors.targetingPrecision * 2 - 1) * 0.25;
  
  // Apply goal multiplier
  const goalMultiplier = GOAL_IMPACT[goal as keyof typeof GOAL_IMPACT]?.ctrMultiplier || 1;
  
  // Apply device mix impact
  const deviceImpact = 
    factors.deviceMix.mobile * DEVICE_MODIFIERS.mobile.ctrMultiplier +
    factors.deviceMix.tablet * DEVICE_MODIFIERS.tablet.ctrMultiplier +
    factors.deviceMix.desktop * DEVICE_MODIFIERS.desktop.ctrMultiplier;
  
  // Apply time-based factors
  const timeOfDayImpact = TIME_OF_DAY_MODIFIERS[factors.timeOfDay] || 1;
  const dayOfWeekImpact = factors.dayOfWeek === 0 || factors.dayOfWeek === 6 ? 0.9 : 1.1;
  const adAgeImpact = Math.max(0.8, Math.min(1.2, 1 - (factors.adAge * 0.01))); // CTR decreases with ad age
  
  // Combine all multipliers
  const multiplier = (1 + qualityImpact + adQualityImpact + targetingImpact) * 
                     goalMultiplier * 
                     deviceImpact * 
                     timeOfDayImpact * 
                     dayOfWeekImpact * 
                     adAgeImpact * 
                     factors.seasonalityFactor;
  
  return baseCTR * multiplier;
}

/**
 * Calculate expected impressions based on budget and competition
 */
export function calculateImpressions(
  platform: 'google' | 'meta',
  adType: string,
  factors: CampaignPerformanceFactors,
  budget: number,
  goal: string
): number {
  // Base impressions per dollar varies by platform and ad type
  let baseImpressionsPerDollar = 0;
  
  switch (platform) {
    case 'google':
      if (adType === 'search') baseImpressionsPerDollar = 500;
      else if (adType === 'display') baseImpressionsPerDollar = 1500;
      else if (adType === 'shopping') baseImpressionsPerDollar = 800;
      else baseImpressionsPerDollar = 1000;
      break;
    
    case 'meta':
      if (adType === 'feed') baseImpressionsPerDollar = 1200;
      else if (adType === 'stories') baseImpressionsPerDollar = 1000;
      else if (adType === 'reels') baseImpressionsPerDollar = 900;
      else baseImpressionsPerDollar = 1100;
      break;
    
    default:
      baseImpressionsPerDollar = 1000;
  }
  
  // Apply industry competition factor
  const industryFactor = INDUSTRY_COMPETITION[factors.industry as keyof typeof INDUSTRY_COMPETITION] || 1;
  
  // Apply quality/relevance impact (higher quality = more impressions per dollar)
  const qualityImpact = platform === 'google'
    ? (calculateQualityScore(factors) - 5) / 10
    : (calculateRelevanceScore(factors) - 5) / 10;
  
  // Apply bid competitiveness (higher bid = more impressions)
  const bidImpact = (factors.bidCompetitiveness * 2 - 1) * 0.3;
  
  // Apply goal multiplier
  const goalMultiplier = GOAL_IMPACT[goal as keyof typeof GOAL_IMPACT]?.impressionsMultiplier || 1;
  
  // Apply seasonality
  const currentMonth = new Date().getMonth();
  const seasonalityFactor = SEASONALITY[currentMonth];
  
  // Combine all factors
  const effectiveImpressionsPerDollar = baseImpressionsPerDollar * 
    (1 / industryFactor) * 
    (1 + qualityImpact + bidImpact) *
    goalMultiplier *
    seasonalityFactor;
  
  return Math.round(effectiveImpressionsPerDollar * budget);
}

/**
 * Calculate expected conversion rate
 */
export function calculateConversionRate(
  platform: 'google' | 'meta',
  adType: string,
  factors: CampaignPerformanceFactors,
  goal: string
): number {
  // Get base conversion rate for this platform and ad type
  const baseMetrics = BASE_METRICS[platform][adType as keyof typeof BASE_METRICS[typeof platform]];
  const baseConversionRate = baseMetrics?.conversionRate || 0.02;
  
  // Landing page quality has the biggest impact on conversion rate
  const landingPageImpact = (factors.landingPageQuality * 2 - 1) * 0.4;
  
  // Targeting precision also affects conversion rate significantly
  const targetingImpact = (factors.targetingPrecision * 2 - 1) * 0.3;
  
  // Apply goal multiplier
  const goalMultiplier = GOAL_IMPACT[goal as keyof typeof GOAL_IMPACT]?.conversionRateMultiplier || 1;
  
  // Apply device mix impact
  const deviceImpact = 
    factors.deviceMix.mobile * DEVICE_MODIFIERS.mobile.conversionRateMultiplier +
    factors.deviceMix.tablet * DEVICE_MODIFIERS.tablet.conversionRateMultiplier +
    factors.deviceMix.desktop * DEVICE_MODIFIERS.desktop.conversionRateMultiplier;
  
  // Apply time-based factors
  const timeOfDayImpact = TIME_OF_DAY_MODIFIERS[factors.timeOfDay] || 1;
  const dayOfWeekImpact = factors.dayOfWeek === 0 || factors.dayOfWeek === 6 ? 0.95 : 1.05;
  
  // Combine all multipliers
  const multiplier = (1 + landingPageImpact + targetingImpact) * 
                     goalMultiplier * 
                     deviceImpact * 
                     timeOfDayImpact * 
                     dayOfWeekImpact * 
                     factors.seasonalityFactor;
  
  return baseConversionRate * multiplier;
}

/**
 * Calculate expected CPC (Cost Per Click)
 */
export function calculateCPC(
  platform: 'google' | 'meta',
  adType: string,
  factors: CampaignPerformanceFactors,
  goal: string
): number {
  // Get base CPC for this platform and ad type
  const baseMetrics = BASE_METRICS[platform][adType as keyof typeof BASE_METRICS[typeof platform]];
  const baseCPC = baseMetrics?.cpc || 1.0;
  
  // Apply industry competition factor (higher competition = higher CPC)
  const industryFactor = INDUSTRY_COMPETITION[factors.industry as keyof typeof INDUSTRY_COMPETITION] || 1;
  
  // Apply quality/relevance impact (higher quality = lower CPC)
  const qualityImpact = platform === 'google'
    ? -((calculateQualityScore(factors) - 5) / 10) * 0.3
    : -((calculateRelevanceScore(factors) - 5) / 10) * 0.3;
  
  // Apply bid competitiveness (higher bid = higher CPC)
  const bidImpact = (factors.bidCompetitiveness * 2 - 0.5) * 0.4;
  
  // Apply goal multiplier
  const goalMultiplier = GOAL_IMPACT[goal as keyof typeof GOAL_IMPACT]?.cpcMultiplier || 1;
  
  // Apply device mix impact
  const deviceImpact = 
    factors.deviceMix.mobile * DEVICE_MODIFIERS.mobile.cpcMultiplier +
    factors.deviceMix.tablet * DEVICE_MODIFIERS.tablet.cpcMultiplier +
    factors.deviceMix.desktop * DEVICE_MODIFIERS.desktop.cpcMultiplier;
  
  // Apply seasonality (higher in competitive seasons)
  const currentMonth = new Date().getMonth();
  const seasonalityFactor = SEASONALITY[currentMonth];
  
  // Combine all factors
  const effectiveCPC = baseCPC * 
    industryFactor * 
    (1 + qualityImpact + bidImpact) *
    goalMultiplier *
    deviceImpact *
    seasonalityFactor;
  
  return Number(effectiveCPC.toFixed(2));
}

/**
 * Calculate average position (for search ads)
 */
export function calculateAveragePosition(
  qualityScore: number,
  bidCompetitiveness: number
): number {
  // Higher quality score and bid = better position (lower number)
  const position = 4 - (qualityScore / 10 * 2 + bidCompetitiveness * 2);
  
  // Ensure position is between 1 and 4
  return Number(Math.max(1, Math.min(4, position)).toFixed(1));
}

/**
 * Calculate impression share
 */
export function calculateImpressionShare(
  qualityScore: number,
  bidCompetitiveness: number,
  industryCompetition: number
): number {
  // Calculate base impression share
  let share = (qualityScore / 10 * 0.5 + bidCompetitiveness * 0.5);
  
  // Adjust for industry competition
  share = share / industryCompetition;
  
  // Ensure share is between 0.1 and 0.9
  return Number(Math.max(0.1, Math.min(0.9, share)).toFixed(2));
}

/**
 * Calculate ROI (Return on Investment)
 */
export function calculateROI(
  conversions: number,
  cost: number,
  averageOrderValue: number = 50 // Default value if not provided
): number {
  const revenue = conversions * averageOrderValue;
  const roi = ((revenue - cost) / cost) * 100;
  return Number(roi.toFixed(2));
}

/**
 * Simulate full ad performance based on campaign parameters
 */
export function simulateAdPerformance(
  campaign: Campaign,
  factors: CampaignPerformanceFactors
): PerformanceMetrics {
  // Determine platform and ad type
  const platform = campaign.platform.toLowerCase().includes('google') ? 'google' : 'meta';
  const adType = campaign.type;
  
  // Get quality or relevance score
  const qualityScore = platform === 'google' 
    ? calculateQualityScore(factors)
    : undefined;
  
  const relevanceScore = platform === 'meta'
    ? calculateRelevanceScore(factors)
    : undefined;
  
  // Calculate expected metrics
  const expectedCTR = calculateExpectedCTR(platform as 'google' | 'meta', adType, factors, campaign.goal);
  const expectedImpressions = calculateImpressions(platform as 'google' | 'meta', adType, factors, Number(campaign.dailyBudget), campaign.goal);
  const expectedConversionRate = calculateConversionRate(platform as 'google' | 'meta', adType, factors, campaign.goal);
  const expectedCPC = calculateCPC(platform as 'google' | 'meta', adType, factors, campaign.goal);
  
  // Calculate actual metrics with some randomness
  const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
  const impressions = Math.round(expectedImpressions * randomFactor);
  const clicks = Math.round(impressions * expectedCTR * randomFactor);
  const conversions = Math.round(clicks * expectedConversionRate * randomFactor);
  const cost = Number((clicks * expectedCPC).toFixed(2));
  
  // Calculate average position for search ads
  const averagePosition = platform === 'google' && adType === 'search'
    ? calculateAveragePosition(qualityScore || 5, factors.bidCompetitiveness)
    : undefined;
  
  // Calculate impression share
  const industryCompetition = INDUSTRY_COMPETITION[factors.industry as keyof typeof INDUSTRY_COMPETITION] || 1;
  const impressionShare = calculateImpressionShare(
    qualityScore || relevanceScore || 5,
    factors.bidCompetitiveness,
    industryCompetition
  );
  
  // Calculate ROI
  const roi = calculateROI(conversions, cost);
  
  // Format final metrics
  const ctr = clicks / impressions;
  const cpc = cost / clicks;
  const conversionRate = conversions / clicks;
  const cpa = cost / conversions;
  
  return {
    impressions,
    clicks,
    conversions,
    cost,
    ctr,
    cpc,
    conversionRate,
    cpa,
    qualityScore,
    relevanceScore,
    averagePosition,
    impressionShare,
    roi
  };
}

/**
 * Extract campaign performance factors from campaign settings
 */
export function extractPerformanceFactors(campaign: Campaign): CampaignPerformanceFactors {
  // Evaluate ad quality based on headlines and descriptions
  const adQuality = evaluateAdQuality(campaign.adHeadlines, campaign.adDescriptions);
  
  // Evaluate keyword relevance (for search campaigns)
  const keywordRelevance = evaluateKeywordRelevance(campaign.keywords, campaign.type);
  
  // Evaluate targeting precision
  const targetingPrecision = evaluateTargetingPrecision(campaign.targeting);
  
  // Evaluate bid competitiveness
  const bidCompetitiveness = evaluateBidCompetitiveness(campaign.dailyBudget, campaign.targetCpa);
  
  // Evaluate landing page quality (simplified)
  const landingPageQuality = evaluateLandingPageQuality(campaign.finalUrl);
  
  // Determine device mix from targeting
  const deviceMix = extractDeviceMix(campaign.targeting);
  
  // Get current time and seasonality factors
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();
  const currentMonth = now.getMonth();
  
  return {
    adQuality,
    keywordRelevance,
    targetingPrecision,
    bidCompetitiveness,
    landingPageQuality,
    accountHistory: 0.7, // Default value for simulation
    industry: getIndustryFromCampaign(campaign),
    seasonalityFactor: SEASONALITY[currentMonth],
    deviceMix,
    timeOfDay: currentHour,
    dayOfWeek: currentDay,
    adAge: 1 // Default to 1 day old
  };
}

/**
 * Helper function: Evaluate ad quality based on headlines and descriptions
 */
function evaluateAdQuality(headlines: string[], descriptions: string[]): number {
  // Simple evaluation based on quantity and length
  let score = 0.5; // Base score
  
  // Score for headline variety
  if (headlines.length >= 3) score += 0.1;
  if (headlines.length >= 5) score += 0.1;
  
  // Score for description variety
  if (descriptions.length >= 2) score += 0.1;
  
  // Check headline quality (length, keywords, CTAs)
  const headlineQuality = headlines.reduce((acc, headline) => {
    if (headline.length >= 15 && headline.length <= 30) acc += 0.02;
    if (/\b(get|discover|learn|find|start|try|book|buy|shop|save)\b/i.test(headline)) acc += 0.02;
    return acc;
  }, 0);
  
  score += Math.min(0.2, headlineQuality);
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Helper function: Evaluate keyword relevance
 */
function evaluateKeywordRelevance(keywords: any[], type: string): number {
  // Return lower value for non-search campaigns
  if (type !== 'search') return 0.5;
  
  // Start with base relevance
  let relevance = 0.5;
  
  // If no keywords, return base score
  if (!keywords || keywords.length === 0) return relevance;
  
  // Assess match type distribution
  const matchTypes = keywords.map((k: any) => k.matchType);
  const exactMatches = matchTypes.filter((t: string) => t === 'exact').length;
  const phraseMatches = matchTypes.filter((t: string) => t === 'phrase').length;
  
  // Reward balanced match type usage
  if (exactMatches > 0 && phraseMatches > 0) {
    relevance += 0.2;
  }
  
  // Penalize having too many broad matches
  const broadMatches = matchTypes.filter((t: string) => t === 'broad').length;
  if (broadMatches / keywords.length > 0.7) {
    relevance -= 0.2;
  }
  
  // Reward optimal keyword count (between 10-20 keywords)
  const keywordCount = keywords.length;
  if (keywordCount >= 10 && keywordCount <= 20) {
    relevance += 0.2;
  } else if (keywordCount < 5 || keywordCount > 30) {
    relevance -= 0.2;
  }
  
  return Math.max(0, Math.min(1, relevance));
}

/**
 * Helper function: Evaluate targeting precision
 */
function evaluateTargetingPrecision(targeting: any): number {
  let precision = 0.5;
  
  // Assess demographic targeting
  if (targeting.demographics && targeting.demographics.ageRanges && targeting.demographics.ageRanges.length > 0) {
    precision += 0.1;
  }
  
  if (targeting.demographics && targeting.demographics.genders && targeting.demographics.genders.length > 0) {
    precision += 0.1;
  }
  
  // Assess device targeting
  if (targeting.devices && targeting.devices.length > 1) {
    precision += 0.1;
  }
  
  // Assess location targeting
  if (targeting.locations && targeting.locations.length > 0) {
    precision += 0.1;
  }
  
  // Assess language targeting
  if (targeting.languages && targeting.languages.includes('en')) {
    precision += 0.1;
  }
  
  return Math.max(0, Math.min(1, precision));
}

/**
 * Helper function: Evaluate bid competitiveness
 */
function evaluateBidCompetitiveness(dailyBudget: number, targetCpa?: number): number {
  // Base competitiveness on budget
  let competitiveness = dailyBudget / 100; // Normalize budget
  competitiveness = Math.max(0.3, Math.min(0.8, competitiveness)); // Limit to 0.3-0.8 range
  
  // Adjust based on target CPA if available
  if (targetCpa) {
    // Higher target CPA = more competitive
    const cpaBidImpact = targetCpa / 50; // Normalize CPA
    competitiveness += Math.min(0.2, cpaBidImpact);
  }
  
  return Math.max(0, Math.min(1, competitiveness));
}

/**
 * Helper function: Evaluate landing page quality
 */
function evaluateLandingPageQuality(url: string): number {
  // Simplified evaluation based on URL
  let quality = 0.7; // Base quality
  
  // Check for HTTPS
  if (url.includes('https://')) {
    quality += 0.1;
  }
  
  // Check for clean URL (no query parameters)
  if (!url.includes('?')) {
    quality += 0.1;
  }
  
  // Check for dedicated landing page
  if (url.includes('/landing') || url.includes('/lp')) {
    quality += 0.1;
  }
  
  return Math.max(0, Math.min(1, quality));
}

/**
 * Helper function: Extract device mix from targeting
 */
function extractDeviceMix(targeting: any): { mobile: number; tablet: number; desktop: number } {
  const defaultMix = { mobile: 0.6, tablet: 0.1, desktop: 0.3 };
  
  if (!targeting || !targeting.devices || targeting.devices.length === 0) {
    return defaultMix;
  }
  
  // Count targeted devices
  const devices = targeting.devices.map((d: string) => d.toLowerCase());
  const hasMobile = devices.includes('mobile') || devices.includes('smartphone');
  const hasTablet = devices.includes('tablet');
  const hasDesktop = devices.includes('desktop') || devices.includes('computer');
  
  // If all devices are targeted, use default mix
  if (hasMobile && hasTablet && hasDesktop) {
    return defaultMix;
  }
  
  // Create custom mix based on targeted devices
  const mix = { mobile: 0, tablet: 0, desktop: 0 };
  let total = 0;
  
  if (hasMobile) { mix.mobile = 0.6; total += 0.6; }
  if (hasTablet) { mix.tablet = 0.1; total += 0.1; }
  if (hasDesktop) { mix.desktop = 0.3; total += 0.3; }
  
  // If no devices specified, use default
  if (total === 0) return defaultMix;
  
  // Normalize to ensure the mix adds up to 1
  const normalizer = 1 / total;
  return {
    mobile: mix.mobile * normalizer,
    tablet: mix.tablet * normalizer,
    desktop: mix.desktop * normalizer
  };
}

/**
 * Helper function: Get industry from campaign
 */
function getIndustryFromCampaign(campaign: Campaign): string {
  // In a real implementation, this would extract industry from campaign data
  // For simulation, return a default value
  return 'E-commerce';
}
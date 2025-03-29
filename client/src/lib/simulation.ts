import type { Campaign } from "@shared/schema";

/**
 * Client-side Ad Performance Simulation Library
 * 
 * This library uses mathematical models to simulate how campaign 
 * settings translate to ad performance. It's built to mirror the
 * server-side performance algorithms for client-side previews.
 */

// ========== TYPES ==========

/**
 * Campaign factors that affect performance
 */
interface SimulationFactors {
  keywordRelevance: number;       // 0-1 score for keyword quality
  adQualityScore: number;         // 0-1 score for ad creative quality
  targetingPrecision: number;     // 0-1 score for targeting
  landingPageExperience: number;  // 0-1 score for landing page
  expectedCTR: number;            // Expected click-through rate
  bidCompetitiveness: number;     // 0-1 score for bid strategy
  industryCompetition: number;    // Competition factor by industry
  seasonalityFactor: number;      // Current seasonal factor
}

/**
 * Ad performance metrics returned by simulation
 */
interface AdPerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: string;                    // Formatted CTR (e.g. "2.5%")
  cpc: string;                    // Formatted CPC (e.g. "$1.25")
  conversionRate: string;         // Formatted conversion rate
  cpa: string;                    // Formatted cost per acquisition
  qualityScore: number;           // 1-10 Google Quality Score
  averagePosition: string;        // Avg. position for search ads
  impressionShare: string;        // Share of available impressions
  roi: string;                    // Return on investment
}

// ========== BASE REFERENCE VALUES ==========

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
  'Home Services': 0.9,
  'Other': 1.0
};

// Base metrics by platform and ad type
const BASE_METRICS = {
  'google': {
    'search': { ctr: 0.0196, convRate: 0.0323, cpc: 2.32 },
    'display': { ctr: 0.0046, convRate: 0.0127, cpc: 0.67 },
    'shopping': { ctr: 0.0086, convRate: 0.0187, cpc: 0.66 }
  },
  'meta': {
    'feed': { ctr: 0.0089, convRate: 0.0108, cpc: 0.94 },
    'stories': { ctr: 0.0052, convRate: 0.0083, cpc: 0.78 },
    'reels': { ctr: 0.0075, convRate: 0.0091, cpc: 0.88 }
  },
  'other': {
    'default': { ctr: 0.01, convRate: 0.02, cpc: 1.00 }
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

// Seasonality by month (Jan-Dec)
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
  1.4,  // November
  1.5   // December
];

// ========== SIMULATION FUNCTIONS ==========

/**
 * Calculate all simulation factors from campaign settings
 */
export function calculateSimulationFactors(campaign: Campaign): SimulationFactors {
  // Calculate keyword relevance (0-1)
  const keywordRelevance = calculateKeywordRelevance(campaign.keywords);

  // Calculate ad quality score (0-1)
  const adQualityScore = calculateAdQualityScore(campaign.adHeadlines, campaign.adDescriptions);

  // Calculate targeting precision (0-1)
  const targetingPrecision = calculateTargetingPrecision(campaign.targeting);

  // Calculate landing page experience (0-1)
  const landingPageExperience = calculateLandingPageExperience(campaign.finalUrl);

  // Calculate expected CTR based on platform, type and goal
  const expectedCTR = calculateExpectedCTR(campaign);
  
  // Calculate bid competitiveness
  const bidCompetitiveness = calculateBidCompetitiveness(campaign.dailyBudget, campaign.targetCpa);
  
  // Get industry competition factor
  const industryCompetition = getIndustryCompetition(campaign);
  
  // Get current seasonality factor
  const currentMonth = new Date().getMonth();
  const seasonalityFactor = SEASONALITY[currentMonth];

  return {
    keywordRelevance,
    adQualityScore,
    targetingPrecision,
    landingPageExperience,
    expectedCTR,
    bidCompetitiveness,
    industryCompetition,
    seasonalityFactor
  };
}

/**
 * Calculate Quality Score (1-10 scale for Google Ads)
 */
function calculateQualityScore(factors: SimulationFactors): number {
  return Math.round(
    (factors.keywordRelevance * 3 +
    factors.adQualityScore * 3 +
    factors.landingPageExperience * 2 +
    factors.expectedCTR * 2) / 10
  );
}

/**
 * Calculate keyword relevance based on distribution and types
 */
function calculateKeywordRelevance(keywords: Array<{ text: string; matchType: string }>): number {
  // Start with base relevance
  let relevance = 0.5;

  // If no keywords, return base score
  if (!keywords || keywords.length === 0) return relevance;

  // Assess match type distribution
  const matchTypes = keywords.map(k => k.matchType);
  const exactMatches = matchTypes.filter(t => t === 'exact').length;
  const phraseMatches = matchTypes.filter(t => t === 'phrase').length;

  // Reward balanced match type usage
  if (exactMatches > 0 && phraseMatches > 0) {
    relevance += 0.2;
  }

  // Penalize having too many broad matches
  const broadMatches = matchTypes.filter(t => t === 'broad').length;
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
 * Calculate ad quality based on headlines and descriptions
 */
function calculateAdQualityScore(headlines: string[], descriptions: string[]): number {
  let score = 0.5;

  // If no ad content, return base score
  if (!headlines || !descriptions) return score;

  // Check headline variety
  if (headlines.length >= 3) {
    score += 0.1;
  }
  if (headlines.length >= 5) {
    score += 0.1;
  }

  // Check description variety
  if (descriptions.length >= 2) {
    score += 0.1;
  }

  // Check for best practices in headlines
  const headlineQuality = headlines.reduce((acc, headline) => {
    // Check length (15-30 chars is optimal)
    if (headline.length >= 15 && headline.length <= 30) {
      acc += 0.05;
    }
    // Check for call-to-action words
    if (/\b(get|discover|learn|find|start|try|book|buy|shop|save)\b/i.test(headline)) {
      acc += 0.05;
    }
    return acc;
  }, 0);

  score += Math.min(0.2, headlineQuality);

  return Math.max(0, Math.min(1, score));
}

/**
 * Calculate targeting precision based on demographics and locations
 */
function calculateTargetingPrecision(targeting: Campaign['targeting']): number {
  let precision = 0.5;

  // If no targeting, return base score
  if (!targeting) return precision;

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
 * Calculate landing page experience based on URL structure
 */
function calculateLandingPageExperience(url: string): number {
  // Simulate landing page experience score
  let score = 0.7; // Base score

  // If no URL, return base score
  if (!url) return score;

  // Check for common best practices in URL structure
  if (url.includes('https://')) {
    score += 0.1;
  }
  if (!url.includes('?')) {
    score += 0.1; // Clean URLs preferred
  }
  if (url.includes('/landing') || url.includes('/lp')) {
    score += 0.1; // Dedicated landing pages preferred
  }

  return Math.max(0, Math.min(1, score));
}

/**
 * Calculate expected CTR based on platform, type and goal
 */
function calculateExpectedCTR(campaign: Campaign): number {
  // Determine platform family
  let platform = 'other';
  if (campaign.platform?.toLowerCase().includes('google')) {
    platform = 'google';
  } else if (campaign.platform?.toLowerCase().includes('meta') || 
             campaign.platform?.toLowerCase().includes('facebook')) {
    platform = 'meta';
  }
  
  // Get base CTR for this platform and type
  const adType = campaign.type || 'default';
  const platformMetrics = BASE_METRICS[platform as keyof typeof BASE_METRICS] || BASE_METRICS.other;
  const typeMetrics = platformMetrics[adType as keyof typeof platformMetrics] || BASE_METRICS.other.default;
  
  let expectedCTR = typeMetrics.ctr;

  // Apply goal multiplier if available
  if (campaign.goal && GOAL_IMPACT[campaign.goal as keyof typeof GOAL_IMPACT]) {
    expectedCTR *= GOAL_IMPACT[campaign.goal as keyof typeof GOAL_IMPACT].ctrMultiplier;
  }

  return expectedCTR;
}

/**
 * Calculate bid competitiveness based on budget and target CPA
 */
function calculateBidCompetitiveness(dailyBudget: number, targetCpa?: number): number {
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
 * Get industry competition factor
 */
function getIndustryCompetition(campaign: Campaign): number {
  // Extract industry from campaign or use a default
  const industry = 'Other'; // In a real scenario, this would come from campaign metadata
  return INDUSTRY_COMPETITION[industry as keyof typeof INDUSTRY_COMPETITION] || 1.0;
}

/**
 * Generate simulation data based on campaign settings and factors
 */
export function generateSimulationData(
  campaign: Campaign,
  factors: SimulationFactors
): AdPerformanceMetrics {
  // Calculate quality score (1-10)
  const qualityScore = Math.round(
    (factors.keywordRelevance * 3 +
    factors.adQualityScore * 3 +
    factors.landingPageExperience * 2 +
    factors.expectedCTR * 2)
  );

  // Determine platform family
  let platform = 'other';
  if (campaign.platform?.toLowerCase().includes('google')) {
    platform = 'google';
  } else if (campaign.platform?.toLowerCase().includes('meta') || 
             campaign.platform?.toLowerCase().includes('facebook')) {
    platform = 'meta';
  }
  
  // Get base metrics for this platform and type
  const adType = campaign.type || 'default';
  const platformMetrics = BASE_METRICS[platform as keyof typeof BASE_METRICS] || BASE_METRICS.other;
  const typeMetrics = platformMetrics[adType as keyof typeof platformMetrics] || BASE_METRICS.other.default;
  
  // Apply goal multipliers if available
  const goalMultipliers = GOAL_IMPACT[campaign.goal as keyof typeof GOAL_IMPACT] || {
    ctrMultiplier: 1,
    conversionRateMultiplier: 1,
    cpcMultiplier: 1,
    impressionsMultiplier: 1
  };

  // Calculate impressions
  const baseImpressions = Number(campaign.dailyBudget) * 1000 / factors.industryCompetition;
  const targetingMultiplier = 0.8 + (factors.targetingPrecision * 0.4);
  const qualityMultiplier = 0.8 + ((qualityScore / 10) * 0.4);
  const impressions = Math.floor(
    baseImpressions * 
    targetingMultiplier * 
    qualityMultiplier * 
    goalMultipliers.impressionsMultiplier * 
    factors.seasonalityFactor
  );
  
  // Calculate CTR and clicks
  const baseCTR = typeMetrics.ctr * goalMultipliers.ctrMultiplier;
  const adQualityMultiplier = 0.8 + (factors.adQualityScore * 0.4);
  const keywordMultiplier = platform === 'google' ? (0.8 + (factors.keywordRelevance * 0.4)) : 1;
  const effectiveCTR = baseCTR * adQualityMultiplier * keywordMultiplier;
  const clicks = Math.floor(impressions * effectiveCTR);
  
  // Calculate conversion rate and conversions
  const baseConvRate = typeMetrics.convRate * goalMultipliers.conversionRateMultiplier;
  const landingPageMultiplier = 0.8 + (factors.landingPageExperience * 0.4);
  const effectiveConvRate = baseConvRate * landingPageMultiplier;
  const conversions = Math.floor(clicks * effectiveConvRate);
  
  // Calculate CPC and cost
  const baseCPC = typeMetrics.cpc * goalMultipliers.cpcMultiplier * factors.industryCompetition;
  const bidMultiplier = 0.7 + (factors.bidCompetitiveness * 0.6);
  const qualityCPCMultiplier = 1.2 - ((qualityScore / 10) * 0.4); // Higher quality = lower CPC
  const effectiveCPC = baseCPC * bidMultiplier * qualityCPCMultiplier;
  const cost = Number((clicks * effectiveCPC).toFixed(2));
  
  // Calculate average position for search
  const positionBase = platform === 'google' && adType === 'search' ? 3 : 0;
  const position = positionBase === 0 ? "N/A" : 
    ((positionBase - (qualityScore / 10 * 1.5 + factors.bidCompetitiveness * 0.5))).toFixed(1);
  
  // Calculate impression share
  const shareBase = 0.3 + (factors.bidCompetitiveness * 0.3) + ((qualityScore / 10) * 0.3);
  const share = Math.max(0.1, Math.min(0.9, shareBase / factors.industryCompetition));
  
  // Calculate ROI
  const avgValue = campaign.goal === 'Sales' ? 75 : 50; // Estimated value per conversion
  const revenue = conversions * avgValue;
  const roi = ((revenue - cost) / cost) * 100;
  
  // Format metrics for display
  const formattedCTR = ((clicks / impressions) * 100).toFixed(2) + '%';
  const formattedCPC = '$' + effectiveCPC.toFixed(2);
  const formattedConvRate = ((conversions / clicks) * 100).toFixed(2) + '%';
  const formattedCPA = conversions > 0 ? '$' + (cost / conversions).toFixed(2) : 'N/A';
  const formattedImpressionShare = (share * 100).toFixed(1) + '%';
  const formattedROI = roi.toFixed(0) + '%';

  return {
    impressions,
    clicks,
    conversions,
    cost,
    ctr: formattedCTR,
    cpc: formattedCPC,
    conversionRate: formattedConvRate,
    cpa: formattedCPA,
    qualityScore,
    averagePosition: position,
    impressionShare: formattedImpressionShare,
    roi: formattedROI
  };
}

/**
 * Get insights about ad performance
 */
export function getPerformanceInsights(metrics: AdPerformanceMetrics): string[] {
  const insights: string[] = [];

  // Quality Score insights
  if (metrics.qualityScore < 5) {
    insights.push("Low Quality Score: Improve ad relevance and landing page experience");
  } else if (metrics.qualityScore >= 8) {
    insights.push("Strong Quality Score: Your ads are highly relevant to your keywords");
  }

  // CTR insights
  const ctrValue = parseFloat(metrics.ctr);
  if (ctrValue < 1) {
    insights.push("Low CTR: Consider revising ad copy or improving keyword relevance");
  } else if (ctrValue > 3) {
    insights.push("Excellent CTR: Your ads are resonating well with your audience");
  }

  // Conversion insights
  const convRateStr = metrics.conversionRate.replace('%', '');
  const convRate = parseFloat(convRateStr);
  if (convRate < 2) {
    insights.push("Low Conversion Rate: Review your landing page and conversion funnel");
  } else if (convRate > 5) {
    insights.push("Strong Conversion Rate: Your landing page is performing well");
  }
  
  // ROI insights
  const roiValue = parseFloat(metrics.roi);
  if (roiValue < 100) {
    insights.push("Low ROI: Consider adjusting bids or improving conversion rate");
  } else if (roiValue > 300) {
    insights.push("Excellent ROI: Your campaign is generating strong returns");
  }
  
  // Ad position insights (for search)
  if (metrics.averagePosition !== "N/A") {
    const position = parseFloat(metrics.averagePosition);
    if (position < 2) {
      insights.push("Top position: Your ads are showing at the top of search results");
    } else if (position > 3) {
      insights.push("Lower position: Consider increasing bids to improve ad position");
    }
  }

  return insights;
}
import type { Campaign } from "@shared/schema";

interface SimulationFactors {
  keywordRelevance: number;
  adQualityScore: number;
  targetingPrecision: number;
  landingPageExperience: number;
  expectedCTR: number;
}

interface AdPerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: string;
  cpc: string;
  conversionRate: string;
  cpa: string;
  qualityScore: number;
  averagePosition: string;
}

export function calculateSimulationFactors(campaign: Campaign): SimulationFactors {
  // Calculate keyword relevance (0-1)
  const keywordRelevance = calculateKeywordRelevance(campaign.keywords);

  // Calculate ad quality score (0-1)
  const adQualityScore = calculateAdQualityScore(campaign.adHeadlines, campaign.adDescriptions);

  // Calculate targeting precision (0-1)
  const targetingPrecision = calculateTargetingPrecision(campaign.targeting);

  // Calculate landing page experience (0-1)
  const landingPageExperience = calculateLandingPageExperience(campaign.finalUrl);

  // Calculate expected CTR based on historical performance (0-1)
  const expectedCTR = calculateExpectedCTR(campaign);

  return {
    keywordRelevance,
    adQualityScore,
    targetingPrecision,
    landingPageExperience,
    expectedCTR
  };
}

function calculateKeywordRelevance(keywords: Array<{ text: string; matchType: string }>): number {
  // Start with base relevance
  let relevance = 0.5;

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

function calculateAdQualityScore(headlines: string[], descriptions: string[]): number {
  let score = 0.5;

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

function calculateTargetingPrecision(targeting: Campaign['targeting']): number {
  let precision = 0.5;

  // Assess demographic targeting
  if (targeting.demographics.ageRanges.length > 0) {
    precision += 0.1;
  }
  if (targeting.demographics.genders.length > 0) {
    precision += 0.1;
  }

  // Assess device targeting
  if (targeting.devices.length > 1) {
    precision += 0.1;
  }

  // Assess location targeting
  if (targeting.locations.length > 0) {
    precision += 0.1;
  }

  // Assess language targeting
  if (targeting.languages.includes('en')) {
    precision += 0.1;
  }

  return Math.max(0, Math.min(1, precision));
}

function calculateLandingPageExperience(url: string): number {
  // Simulate landing page experience score
  let score = 0.7; // Base score

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

function calculateExpectedCTR(campaign: Campaign): number {
  // Base CTR by campaign type
  const baseCTRs: { [key: string]: number } = {
    'search': 0.02,
    'display': 0.005,
    'shopping': 0.01,
    'feed': 0.01,
    'stories': 0.003,
    'reels': 0.004
  };

  let expectedCTR = baseCTRs[campaign.type] || 0.01;

  // Adjust based on campaign goal
  const goalMultipliers: { [key: string]: number } = {
    'Brand Awareness': 0.8,
    'Website Traffic': 1.2,
    'Lead Generation': 1.0,
    'Sales': 0.9,
    'App Promotion': 1.1
  };

  expectedCTR *= goalMultipliers[campaign.goal] || 1;

  return expectedCTR;
}

export function generateSimulationData(
  campaign: Campaign,
  factors: SimulationFactors
): AdPerformanceMetrics {
  // Calculate quality score (1-10)
  const qualityScore = Math.round(
    (factors.keywordRelevance * 3 +
    factors.adQualityScore * 3 +
    factors.landingPageExperience * 2 +
    factors.expectedCTR * 2) * 10
  );

  // Calculate base metrics
  const baseImpressions = 1000 * (1 + factors.targetingPrecision);
  const expectedCTR = factors.expectedCTR * (1 + factors.adQualityScore);
  const conversionRate = 0.1 * (1 + factors.landingPageExperience);

  // Calculate actual metrics
  const impressions = Math.floor(baseImpressions * Math.random() * 1.5);
  const clicks = Math.floor(impressions * expectedCTR);
  const conversions = Math.floor(clicks * conversionRate);

  // Calculate costs
  const baseCPC = Number(campaign.dailyBudget) / 100;
  const cost = clicks * baseCPC;

  // Format metrics
  const ctr = ((clicks / impressions) * 100).toFixed(2) + '%';
  const cpc = '$' + (cost / clicks).toFixed(2);
  const conversionRateStr = ((conversions / clicks) * 100).toFixed(2) + '%';
  const cpa = '$' + (cost / conversions).toFixed(2);

  // Calculate average position based on quality score
  const position = ((11 - qualityScore) / 2).toFixed(1);

  return {
    impressions,
    clicks,
    conversions,
    cost: Number(cost.toFixed(2)),
    ctr,
    cpc,
    conversionRate: conversionRateStr,
    cpa,
    qualityScore,
    averagePosition: position
  };
}

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
  const convRate = parseFloat(metrics.conversionRate);
  if (convRate < 5) {
    insights.push("Low Conversion Rate: Review your landing page and conversion funnel");
  } else if (convRate > 10) {
    insights.push("Strong Conversion Rate: Your landing page is performing well");
  }

  return insights;
}
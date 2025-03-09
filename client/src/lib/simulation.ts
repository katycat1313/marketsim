import type { Campaign } from "@shared/schema";

interface SimulationFactors {
  keywordRelevance: number;
  adQualityScore: number;
  targetingPrecision: number;
}

export function calculateSimulationFactors(campaign: Campaign): SimulationFactors {
  // Calculate keyword relevance (0-1)
  const keywordRelevance = Math.min(campaign.keywords.length / 10, 1);

  // Calculate ad quality score (0-1)
  const adQualityScore = calculateAdQualityScore(
    campaign.adHeadline1,
    campaign.adHeadline2,
    campaign.adDescription
  );

  // Calculate targeting precision (0-1)
  const targetingPrecision = 0.7; // Base targeting score

  return {
    keywordRelevance,
    adQualityScore,
    targetingPrecision
  };
}

function calculateAdQualityScore(
  headline1: string,
  headline2: string,
  description: string
): number {
  // Simple scoring based on length and completeness
  const h1Score = Math.min(headline1.length / 30, 1);
  const h2Score = Math.min(headline2.length / 30, 1);
  const descScore = Math.min(description.length / 90, 1);
  
  return (h1Score + h2Score + descScore) / 3;
}

export function generateSimulationData(
  campaign: Campaign,
  factors: SimulationFactors
) {
  const baseImpressions = 1000;
  const baseCTR = 0.02;
  const baseConversionRate = 0.03;
  const costPerClick = Number(campaign.dailyBudget) / 100;

  // Calculate metrics with factors influence
  const impressions = Math.floor(
    baseImpressions * 
    (1 + factors.targetingPrecision) * 
    (1 + factors.keywordRelevance)
  );

  const clicks = Math.floor(
    impressions * 
    baseCTR * 
    (1 + factors.adQualityScore)
  );

  const conversions = Math.floor(
    clicks * 
    baseConversionRate * 
    (1 + factors.adQualityScore)
  );

  const cost = clicks * costPerClick;

  return {
    impressions,
    clicks,
    conversions,
    cost: Number(cost.toFixed(2)),
    date: new Date()
  };
}

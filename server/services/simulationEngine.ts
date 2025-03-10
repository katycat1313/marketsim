import { Campaign, SimulationData } from '@shared/schema';
import { db } from '../db';
import { freeMarketingAI, premiumMarketingAI, enterpriseMarketingAI } from './marketingAI';

interface MarketConditions {
  seasonality: number; // 0-1 factor for seasonal effects
  competition: number; // 0-1 factor for competitive pressure
  marketGrowth: number; // -1 to 1 factor for market growth/decline
}

interface SimulationFactors {
  adQuality: number; // 0-1 based on ad copy, relevance
  targeting: number; // 0-1 based on audience match
  bidStrategy: number; // 0-1 based on bid optimization
  budget: number; // Daily budget in currency
}

export class CampaignSimulationEngine {
  private baseClickThroughRate = 0.02; // 2% base CTR
  private baseConversionRate = 0.03; // 3% base conversion rate
  private baseCostPerClick = 1.50; // $1.50 base CPC

  async simulateDay(campaign: Campaign, day: number): Promise<SimulationData> {
    const marketConditions = this.generateMarketConditions(day);
    const simFactors = this.evaluateCampaignFactors(campaign);
    
    // Calculate performance metrics
    const impressions = this.calculateImpressions(campaign.dailyBudget, simFactors);
    const clicks = this.calculateClicks(impressions, simFactors, marketConditions);
    const conversions = this.calculateConversions(clicks, simFactors, marketConditions);
    const cost = this.calculateCost(clicks, simFactors);
    
    // Calculate quality metrics
    const qualityScore = this.calculateQualityScore(simFactors);
    const averagePosition = this.calculateAveragePosition(qualityScore, simFactors.bidStrategy);
    
    // Calculate derived metrics
    const ctr = clicks / impressions;
    const cpc = cost / clicks;
    const conversionRate = conversions / clicks;
    const cpa = cost / conversions;

    // Store simulation data
    const simulationData: SimulationData = {
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
    };

    await db.insert('simulation_data').values(simulationData);
    return simulationData;
  }

  private generateMarketConditions(day: number): MarketConditions {
    return {
      seasonality: Math.sin(day / 7 * Math.PI) * 0.2 + 0.8, // Weekly seasonality
      competition: Math.random() * 0.4 + 0.6, // Random competition factor
      marketGrowth: Math.sin(day / 30 * Math.PI) * 0.1 + 0.05, // Monthly market growth cycle
    };
  }

  private evaluateCampaignFactors(campaign: Campaign): SimulationFactors {
    // Evaluate ad copy quality
    const adQuality = this.evaluateAdQuality(campaign.adHeadlines, campaign.adDescriptions);
    
    // Evaluate targeting precision
    const targeting = this.evaluateTargeting(campaign.targeting, campaign.keywords);
    
    // Evaluate bid strategy effectiveness
    const bidStrategy = this.evaluateBidStrategy(campaign.targetCpa, campaign.dailyBudget);

    return {
      adQuality,
      targeting,
      bidStrategy,
      budget: campaign.dailyBudget,
    };
  }

  private evaluateAdQuality(headlines: string[], descriptions: string[]): number {
    // Implement ad copy quality evaluation logic
    // For now, using a simplified scoring
    const uniqueWords = new Set([
      ...headlines.join(' ').toLowerCase().split(' '),
      ...descriptions.join(' ').toLowerCase().split(' ')
    ]);
    
    // Score based on variety of words and length
    return Math.min(uniqueWords.size / 50, 1) * 0.8 + Math.random() * 0.2;
  }

  private evaluateTargeting(targeting: any, keywords: any[]): number {
    // Implement targeting evaluation logic
    const locationScore = targeting.locations.length / 5; // Normalize by expected number
    const demographicsScore = Object.keys(targeting.demographics).length / 3;
    const keywordScore = keywords.length / 20; // Normalize by expected number
    
    return (locationScore + demographicsScore + keywordScore) / 3;
  }

  private evaluateBidStrategy(targetCpa: number, dailyBudget: number): number {
    // Implement bid strategy evaluation
    if (!targetCpa) return 0.5; // Default if no target CPA
    
    // Score based on reasonable CPA target relative to budget
    const cpaBudgetRatio = targetCpa / dailyBudget;
    return Math.min(Math.max(1 - Math.abs(cpaBudgetRatio - 0.2), 0), 1);
  }

  private calculateImpressions(budget: number, factors: SimulationFactors): number {
    const baseImpressions = budget * 1000; // Base impressions per dollar
    const qualityMultiplier = 0.5 + factors.adQuality * 0.5;
    const targetingMultiplier = 0.5 + factors.targeting * 0.5;
    
    return Math.round(baseImpressions * qualityMultiplier * targetingMultiplier);
  }

  private calculateClicks(
    impressions: number,
    factors: SimulationFactors,
    conditions: MarketConditions
  ): number {
    const adjustedCTR = this.baseClickThroughRate 
      * (0.5 + factors.adQuality * 0.5)
      * (0.5 + factors.targeting * 0.5)
      * conditions.seasonality;
    
    return Math.round(impressions * adjustedCTR);
  }

  private calculateConversions(
    clicks: number,
    factors: SimulationFactors,
    conditions: MarketConditions
  ): number {
    const adjustedCVR = this.baseConversionRate
      * (0.5 + factors.targeting * 0.5)
      * conditions.seasonality
      * (1 + conditions.marketGrowth);
    
    return Math.round(clicks * adjustedCVR);
  }

  private calculateCost(clicks: number, factors: SimulationFactors): number {
    const adjustedCPC = this.baseCostPerClick
      * (0.8 + factors.bidStrategy * 0.4)
      * (1.2 - factors.adQuality * 0.4);
    
    return Number((clicks * adjustedCPC).toFixed(2));
  }

  private calculateQualityScore(factors: SimulationFactors): number {
    const score = Math.round(
      (factors.adQuality * 0.4 + factors.targeting * 0.4 + factors.bidStrategy * 0.2)
      * 10
    );
    return Math.min(Math.max(score, 1), 10);
  }

  private calculateAveragePosition(qualityScore: number, bidStrategy: number): number {
    const position = 4 - (qualityScore / 10 * 2 + bidStrategy * 1);
    return Number(Math.max(1, position).toFixed(1));
  }

  async getPerformanceAnalysis(simulationData: SimulationData) {
    // Get AI analysis based on subscription tier
    const marketingAI = this.getMarketingAI(simulationData.campaignId);
    
    return marketingAI.analyzeCampaignPerformance(simulationData);
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
      .where({ userId: campaign.userId });

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

export const simulationEngine = new CampaignSimulationEngine();

export interface UserSkillDiagnostic {
  userId: number;
  level: string;
  totalAttempts: number;
  averageScore: number;
  skillScores: {
    qualityScoreOptimization: number; // 0 - 100
    negativeKeywordDefense: number;    // 0 - 100
    cpcBidEfficiency: number;          // 0 - 100
    conversionOptimization: number;    // 0 - 100
    audienceTargeting: number;         // 0 - 100
    adCopywriting: number;             // 0 - 100
  };
  primaryWeakness: {
    key: string;
    label: string;
    description: string;
    recommendation: string;
  };
  secondaryWeakness: {
    key: string;
    label: string;
    description: string;
    recommendation: string;
  };
  recommendedSimulations: Array<{
    title: string;
    platform: string;
    difficulty: string;
    targetWeakness: string;
    reason: string;
  }>;
}

export interface SimulationAttemptRecord {
  id: number;
  userId: number;
  simulationId: number;
  platform: string;
  difficulty: string;
  score: number;
  metrics: {
    qualityScore: number;
    ctr: number;
    cpc: number;
    conversions: number;
    costPerConversion: number;
    roas: number;
  };
  usedNegativeKeywords: boolean;
  hasExtensions: boolean;
  timestamp: Date;
}

const userAttemptHistory: Map<number, SimulationAttemptRecord[]> = new Map();

// Seed baseline attempt for demo user 1 (Katy Cat)
userAttemptHistory.set(1, [
  {
    id: 1,
    userId: 1,
    simulationId: 1,
    platform: 'google_ads',
    difficulty: 'Intermediate',
    score: 68,
    metrics: {
      qualityScore: 6,
      ctr: 2.1,
      cpc: 2.40,
      conversions: 8,
      costPerConversion: 42.50,
      roas: 2.1,
    },
    usedNegativeKeywords: false,
    hasExtensions: true,
    timestamp: new Date(Date.now() - 86400000),
  }
]);

export class DynamicSimulationGenerator {
  recordAttempt(attempt: SimulationAttemptRecord) {
    const history = userAttemptHistory.get(attempt.userId) || [];
    history.push(attempt);
    userAttemptHistory.set(attempt.userId, history);
  }

  getUserDiagnostics(userId: number, currentLevel: string = 'Expert'): UserSkillDiagnostic {
    const history = userAttemptHistory.get(userId) || [];
    const totalAttempts = history.length;

    let totalScore = 0;
    let totalQS = 0;
    let negativeKeywordUsedCount = 0;
    let cpcEfficiencySum = 0;
    let conversionEfficiencySum = 0;
    let adCopySum = 0;
    let audienceSum = 0;

    if (totalAttempts > 0) {
      history.forEach(att => {
        totalScore += att.score;
        totalQS += att.metrics.qualityScore || 5;
        if (att.usedNegativeKeywords) negativeKeywordUsedCount++;
        cpcEfficiencySum += att.metrics.cpc <= 2.50 ? 85 : 55;
        conversionEfficiencySum += att.metrics.conversions > 5 ? 80 : 50;
        adCopySum += (att.metrics.qualityScore || 5) >= 7 ? 85 : 60;
        audienceSum += att.metrics.ctr >= 2.0 ? 80 : 55;
      });
    } else {
      const baseLevelScore = currentLevel === 'Expert' ? 82 : currentLevel === 'Advanced' ? 74 : currentLevel === 'Intermediate' ? 62 : 45;
      totalScore = baseLevelScore;
      totalQS = currentLevel === 'Expert' ? 8 : 6;
      negativeKeywordUsedCount = 0;
    }

    const avgScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 70;
    const qsScore = totalAttempts > 0 ? Math.min(100, Math.round((totalQS / totalAttempts) * 10)) : 65;
    const negScore = totalAttempts > 0 ? Math.round((negativeKeywordUsedCount / totalAttempts) * 100) : 40;
    const cpcScore = totalAttempts > 0 ? Math.round(cpcEfficiencySum / totalAttempts) : 70;
    const convScore = totalAttempts > 0 ? Math.round(conversionEfficiencySum / totalAttempts) : 60;
    const copyScore = totalAttempts > 0 ? Math.round(adCopySum / totalAttempts) : 68;
    const audScore = totalAttempts > 0 ? Math.round(audienceSum / totalAttempts) : 72;

    const skillScores = {
      qualityScoreOptimization: qsScore,
      negativeKeywordDefense: negScore,
      cpcBidEfficiency: cpcScore,
      conversionOptimization: convScore,
      audienceTargeting: audScore,
      adCopywriting: copyScore,
    };

    const rankedSkills = Object.entries(skillScores).sort((a, b) => a[1] - b[1]);
    const weakest = rankedSkills[0];
    const secondWeakest = rankedSkills[1];

    const weaknessDefinitions: Record<string, { label: string; description: string; recommendation: string }> = {
      negativeKeywordDefense: {
        label: 'Negative Keyword Filtering & Budget Protection',
        description: 'You are letting broad search queries burn budget on low-intent clicks.',
        recommendation: 'Add negative keyword lists (e.g. "free", "crack", "cheap", "diy") to immediately cut wasted spend by 25-40%.',
      },
      qualityScoreOptimization: {
        label: 'Quality Score & Ad Rank Optimization',
        description: 'Ad relevance to target keywords is under-optimized, causing search engines to charge higher CPCs.',
        recommendation: 'Mirror the search query inside Headline 1 and pin relevant value propositions in Headline 2.',
      },
      conversionOptimization: {
        label: 'CPA & Conversion Funnel Alignment',
        description: 'Clicks are arriving but landing page intent mismatches are suppressing conversion rate.',
        recommendation: 'Align your ad call-to-action directly with the landing page hero offer to lower your Cost Per Acquisition.',
      },
      cpcBidEfficiency: {
        label: 'Bid Strategy & Auction Competitiveness',
        description: 'Over-bidding on high-competition broad terms is eroding campaign ROAS.',
        recommendation: 'Switch to Target CPA or Maximize Conversions with a tight bid ceiling.',
      },
      adCopywriting: {
        label: 'Ad Creative Hooks & Extensions',
        description: 'Click-through rate is below platform benchmarks due to missing ad extensions and weak emotional hooks.',
        recommendation: 'Add sitelink, callout, and structured snippet extensions to expand SERP real estate and lift CTR.',
      },
      audienceTargeting: {
        label: 'Audience Segmentation & Placement Filtering',
        description: 'Targeting broad demographics is delivering impressions to non-buyers.',
        recommendation: 'Layer in-market audiences and custom intent segments to focus spend on active shoppers.',
      },
    };

    const primaryWeakness = {
      key: weakest[0],
      ...weaknessDefinitions[weakest[0]],
    };

    const secondaryWeakness = {
      key: secondWeakest[0],
      ...weaknessDefinitions[secondWeakest[0]],
    };

    return {
      userId,
      level: currentLevel,
      totalAttempts,
      averageScore: avgScore,
      skillScores,
      primaryWeakness,
      secondaryWeakness,
      recommendedSimulations: [
        {
          title: `Custom ${primaryWeakness.label} Challenge`,
          platform: 'google_ads',
          difficulty: currentLevel,
          targetWeakness: primaryWeakness.key,
          reason: `Targeted to fix your lowest scoring metric (${weakest[1]}% proficiency).`,
        },
        {
          title: `Advanced ${secondaryWeakness.label} Practice`,
          platform: 'meta_ads',
          difficulty: currentLevel,
          targetWeakness: secondaryWeakness.key,
          reason: `Recommended to strengthen your secondary growth area (${secondWeakest[1]}% proficiency).`,
        },
      ],
    };
  }

  generateSimulation(params: {
    userId: number;
    level?: string;
    targetWeakness?: string;
    platform?: string;
    industry?: string;
  }): any {
    const level = params.level || 'Expert';
    const diagnostics = this.getUserDiagnostics(params.userId, level);
    const targetWeakness = params.targetWeakness || diagnostics.primaryWeakness.key;
    const platform = params.platform || (targetWeakness === 'negativeKeywordDefense' ? 'google_ads' : 'meta_ads');
    
    const scenarioScaffolds: Record<string, any> = {
      negativeKeywordDefense: {
        industries: ['B2B Cybersecurity SaaS', 'Luxury Custom Home Remodeling', 'Enterprise AI Software', 'Specialty Medical Clinic'],
        titles: [
          'Enterprise Lead Gen: Negative Keyword Gating & Budget Shield',
          'High-CPC Search Auction: Eliminating Unqualified Traffic Waste',
          'B2B SaaS Growth: Exact Match Conversion Conquesting',
        ],
        descriptions: [
          'You are taking over a Google Ads Search campaign for a high-ticket B2B company spending $250/day. The campaign has suffered from a 42% budget leak caused by searchers looking for "free downloads", "open source", "entry level jobs", and "student discounts". Your objective is to rebuild the keyword strategy with strict negative keyword exclusions and phrase/exact match types to maximize ROAS.',
          'A luxury service provider with a $15.00 average CPC is running broad match search ads. 35% of clicks are coming from irrelevant DIY searches. Reconfigure the campaign with exhaustive negative keywords and tight ad group structure to drop CPA under $45.00.',
        ],
        keywords: ['enterprise software solutions', 'b2b automated compliance', 'cybersecurity audit for finance', 'custom luxury architect'],
        matchTypes: ['phrase', 'exact'],
        negativeKeywords: ['free', 'crack', 'diy', 'cheap', 'jobs', 'salary', 'internship', 'tutorial', 'open source', 'templates'],
        budgetMultiplier: 1.5,
      },
      qualityScoreOptimization: {
        industries: ['Fintech Wealth Management', 'Direct-to-Consumer Organic Mattresses', 'High-End SaaS CRM', 'Premium EV Accessories'],
        titles: [
          'Quality Score Rescue: SERP Ad Rank Dominance',
          'Keyword-to-Copy Synergy: Achieving 10/10 Quality Score',
          'Competitive Search Auction: Slashing CPC with High Ad Rank',
        ],
        descriptions: [
          'Your client is in an ultra-competitive auction where market CPC is $9.50 and top competitors hold Quality Scores of 9/10. Because the current Quality Score is only 4/10, your client is paying an extra 40% penalty per click. Craft high-relevance headlines, insert exact keyword matches into Headline 1, and configure rich ad extensions to push Quality Score to 9+ and win top placement.',
          'Optimize ad copy and keyword relevance for a high-intent e-commerce brand. Boost Expected CTR and Ad Relevance to achieve lower CPCs and outrank higher-bidding rivals.',
        ],
        keywords: ['automated wealth management platform', 'high yield business account', 'certified organic latex mattress', 'enterprise sales crm software'],
        matchTypes: ['exact', 'phrase'],
        negativeKeywords: ['bad credit', 'used', 'free', 'reddit', 'complaints'],
        budgetMultiplier: 1.2,
      },
      conversionOptimization: {
        industries: ['Direct-to-Consumer Specialty Coffee', 'Eco-Friendly Athletic Apparel', 'Professional Certification Courses', 'Smart Home Security'],
        titles: [
          'Funnel Conversion Blitz: Lowering High CPA by 40%',
          'Omnichannel Performance: Scaling ROAS from 1.8x to 4.5x',
          'Conversion Rate Acceleration: High-Intent Offer Alignment',
        ],
        descriptions: [
          'The current campaign drives substantial traffic with a healthy 3.8% CTR, but the conversion rate has cratered to 0.8%, resulting in an unsustainable CPA of $85.00 against a $55.00 target. Refine the audience demographics, select conversion-focused bidding, and craft urgency-driven creative copy to lift conversion rate above 3.5%.',
          'Re-align ad proposition with target customer pain points to drive immediate purchases while maintaining an efficient Cost Per Acquisition.',
        ],
        keywords: ['buy specialty coffee subscription', 'sustainable running shoes', 'project management pmp exam prep', 'wireless home security kit'],
        matchTypes: ['phrase', 'exact'],
        negativeKeywords: ['free recipes', 'repairs', 'wikipedia', 'manual'],
        budgetMultiplier: 1.4,
      },
      audienceTargeting: {
        industries: ['Meta D2C Skincare', 'B2B Executive Coaching', 'Boutique Fitness Franchises', 'Smart Pet Technology'],
        titles: [
          'Meta Precision Targeting: Lookalike & Interest Segmentation',
          'High-LTV Acquisition: High-Intent In-Market Layering',
          'Social Prospecting: Beating Creative Fatigue & High CPMs',
        ],
        descriptions: [
          'A fast-growing D2C brand is struggling with audience saturation and high CPMs on Meta Ads. Your mission is to structure audience ad sets separating warm retargeting from cold top-of-funnel lookalikes, testing vertical video creative formats, and allocating budget to optimize Return on Ad Spend.',
          'Structure multi-tiered social campaigns with precise demographic filters and behavioral targeting to acquire high-lifetime-value customers.',
        ],
        keywords: ['clean ingredients anti-aging serum', 'executive leadership training', 'boutique hiit fitness membership', 'smart gps dog collar'],
        matchTypes: ['phrase'],
        negativeKeywords: ['cheap', 'wholesale', 'diy'],
        budgetMultiplier: 1.3,
      }
    };

    const scaffold = scenarioScaffolds[targetWeakness] || scenarioScaffolds.negativeKeywordDefense;
    const selectedIndustry = params.industry || scaffold.industries[Math.floor(Math.random() * scaffold.industries.length)];
    const selectedTitle = scaffold.titles[Math.floor(Math.random() * scaffold.titles.length)];
    const selectedDesc = scaffold.descriptions[Math.floor(Math.random() * scaffold.descriptions.length)];

    let baseBudget = 50;
    if (level === 'Intermediate') baseBudget = 100;
    if (level === 'Advanced') baseBudget = 250;
    if (level === 'Expert') baseBudget = 500;

    const dynamicId = Date.now();

    return {
      id: dynamicId,
      title: `✨ [Adaptive Engine] ${selectedTitle}`,
      platform: platform,
      type: platform === 'google_ads' ? 'search' : platform === 'meta_ads' ? 'conversion' : 'lead_gen',
      industry: selectedIndustry,
      difficulty: level,
      scenarioDescription: selectedDesc,
      objectives: [
        `Targeted Goal: Master ${diagnostics.primaryWeakness.label}`,
        `Achieve Quality Score ≥ ${level === 'Expert' ? '8/10' : '7/10'}`,
        `Maintain ROAS ≥ ${level === 'Expert' ? '3.8x' : '2.5x'} with strict CPA thresholds`,
        `Eliminate wasted spend with strategic match types and negative keywords`,
      ],
      targetAudience: {
        locations: ['United States', 'Canada', 'United Kingdom'],
        demographics: {
          ageRanges: level === 'Beginner' ? ['18-65+'] : ['25-34', '35-44', '45-54'],
          genders: ['all'],
        },
        interests: [selectedIndustry, 'Online Shopping', 'Technology', 'Professional Development'],
      },
      budget: Math.round(baseBudget * scaffold.budgetMultiplier),
      keywords: scaffold.keywords,
      keywordMatchTypes: scaffold.matchTypes,
      negativeKeywords: scaffold.negativeKeywords,
      adCreativeSamples: [
        `Official ${selectedIndustry.split(' ')[0]} Platform - Scale Today`,
        `Unlock 3x Performance with Verified ${selectedIndustry.split(' ')[0]}`,
        `Get Started Free - Transparent Pricing & Zero Setup Fees`,
      ],
      targetedWeakness: targetWeakness,
      weaknessLabel: diagnostics.primaryWeakness.label,
      isDynamic: true,
      createdAt: new Date(),
    };
  }

  /**
   * Generates a deep post-simulation diagnostic debrief after any single attempt
   */
  generatePostSimDebrief(attempt: SimulationAttemptRecord, simulation: any) {
    const diagnostics = this.getUserDiagnostics(attempt.userId, attempt.difficulty);
    const cost = attempt.metrics.cost || 50;
    const qs = attempt.metrics.qualityScore || 5;
    const cpc = attempt.metrics.cpc || 2.0;

    let wastedSpend = 0;
    const reasons: string[] = [];

    if (!attempt.usedNegativeKeywords && (simulation.platform === 'google_ads' || !simulation.platform)) {
      const wasteAmount = parseFloat((cost * 0.32).toFixed(2));
      wastedSpend += wasteAmount;
      reasons.push(`Estimated ~$${wasteAmount.toFixed(2)} wasted on low-intent search traffic due to missing negative keywords.`);
    }

    if (qs < 7) {
      const cpcInflation = parseFloat(((10 - qs) * 0.12 * cpc).toFixed(2));
      const qsWaste = parseFloat((cpcInflation * (attempt.metrics.conversions || 1) * 4).toFixed(2));
      wastedSpend += qsWaste;
      reasons.push(`Paying an estimated +$${cpcInflation}/click Quality Score penalty due to suboptimal headline-to-keyword relevance.`);
    }

    if (attempt.metrics.costPerConversion > 60 && attempt.metrics.conversions > 0) {
      reasons.push(`High CPA ($${attempt.metrics.costPerConversion.toFixed(2)}): Audience demographics or landing page call-to-action needs tightening.`);
    }

    let focalWeaknessKey = diagnostics.primaryWeakness.key;
    let focalWeaknessLabel = diagnostics.primaryWeakness.label;
    let actionTip = diagnostics.primaryWeakness.recommendation;

    if (!attempt.usedNegativeKeywords) {
      focalWeaknessKey = 'negativeKeywordDefense';
      focalWeaknessLabel = 'Negative Keyword Filtering & Wasted Spend Control';
      actionTip = 'Add negative keywords (e.g. "free", "cheap", "diy", "jobs") to immediately protect 25-35% of ad spend.';
    } else if (qs < 7) {
      focalWeaknessKey = 'qualityScoreOptimization';
      focalWeaknessLabel = 'Quality Score & Headline Relevance';
      actionTip = 'Mirror the user’s search term in Headline 1 to raise your Expected CTR and Quality Score to 8+.';
    }

    const nextChallenge = diagnostics.recommendedSimulations[0];

    return {
      wastedSpendEstimate: wastedSpend > 0 ? wastedSpend : 0,
      wastedSpendReasons: reasons,
      qualityScoreAchieved: qs,
      primaryWeaknessKey: focalWeaknessKey,
      primaryWeaknessLabel: focalWeaknessLabel,
      actionTip,
      updatedDiagnostics: diagnostics,
      nextChallenge: {
        title: nextChallenge.title,
        platform: nextChallenge.platform,
        targetWeakness: focalWeaknessKey,
        reason: `Generated specifically to practice and fix ${focalWeaknessLabel}.`
      }
    };
  }
}

export const dynamicSimulationGenerator = new DynamicSimulationGenerator();


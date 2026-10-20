/**
 * Unified Client Growth Engine
 * 
 * Central state and simulation bridge connecting:
 * - Customer Personas
 * - SEO & Website Studio (Landing Page Experience)
 * - Paid Ad Platforms (Quality Score, CPC & Bidding)
 * - A/B Testing Lab (Conversion Rate Optimization)
 * - Performance Reporting (Multi-Channel Attribution & Blended Unit Economics)
 * 
 * Provides authentic agency dynamics:
 * - SEO optimizations directly improve Google Ad Quality Score & lower CPC
 * - Winning A/B tests can be deployed to the live client account to lift conversion rates
 * - The "Advance 7 Days" action advances the simulation timeline and models daily marketing performance
 */

export interface ClientDossier {
  id: number;
  clientName: string;
  founderName: string;
  industry: string;
  businessModel: string;
  location: string;
  establishedYear: number;
  products: string;
  valueProps: string[];
  fieldNotes: string;
  customerFeedback: string[];
  targetMonthlyRevenue: number;
  currentMonthlyRevenue: number;
  targetAov: number;
}

export interface ClientPersonaState {
  name: string;
  ageRange: { min: number; max: number };
  targetLocation: string;
  primaryNeed: string;
  interests: string[];
  painPoints: string[];
  searchIntentKeywords: string[];
  audienceFitBonus: number; // 1.0 = base, up to 1.35x CTR bonus
  isSynthesized: boolean;
}

export interface ClientSeoState {
  title: string;
  h1: string;
  metaDescription: string;
  targetKeywords: string[];
  overallScore: number; // 0 - 100
  landingPageExperience: 'Below Average' | 'Average' | 'Above Average';
  organicRankEstimate: number; // e.g. Position 1-10
  organicMonthlyClicks: number;
  haloBrandSearchBonus: number; // Lift from active ad campaigns
  lastOptimizedDay: number;
}

export interface ClientAdCampaignState {
  campaignName: string;
  platform: 'google_ads' | 'meta_ads';
  dailyBudget: number;
  qualityScore: number; // 1 - 10
  expectedCtr: number; // percentage e.g. 2.8%
  effectiveCpc: number; // in dollars e.g. $1.45
  adHeadlines: string[];
  keywords: Array<{ text: string; matchType: 'exact' | 'phrase' | 'broad' }>;
  negativeKeywords: string[];
  adExtensionsActive: boolean;
  landingPageBoostApplied: boolean;
  status: 'active' | 'paused';
}

export interface DeployedABTest {
  testId: number;
  testName: string;
  testVariable: string;
  winningVariantName: string;
  improvementPercent: number; // e.g. 28.6%
  projectedAnnualLift: number;
  deployedDay: number;
  deployedAt: string;
}

export interface ChannelMetrics {
  name: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
  spend: number;
  revenue: number;
  cpa: number;
  roas: number;
}

export interface DailyPerformanceRecord {
  day: number;
  date: string;
  paidSearchClicks: number;
  paidSocialClicks: number;
  organicClicks: number;
  directClicks: number;
  totalSessions: number;
  conversions: number;
  conversionRate: number;
  dailySpend: number;
  dailyRevenue: number;
  blendedCpa: number;
  qualityScore: number;
}

export interface ClientActivityLog {
  id: string;
  day: number;
  category: 'SEO' | 'Paid Ads' | 'A/B Testing' | 'Persona' | 'Timeline' | 'Client';
  headline: string;
  detail: string;
  timestamp: string;
}

export class UnifiedClientEngine {
  // Master Client Dossier (Jenny's Artisan Java & Roastery)
  private dossier: ClientDossier = {
    id: 1,
    clientName: "Jenny's Artisan Java & Roastery",
    founderName: "Jenny Miller (Founder & Master Roaster)",
    industry: "E-commerce",
    businessModel: "Direct-to-Consumer E-Commerce & Local Roastery",
    location: "Morgantown, West Virginia",
    establishedYear: 2014,
    products: "100% Organic Certified Arabica Coffee Beans, Single-Origin roasts (Guatemala & Ethiopia), Specialty Espresso Blends (250g, 500g, 1kg packages).",
    valueProps: [
      "100% Fair-Trade & Organic Arabica beans sourced directly from small family co-ops",
      "Roasted in small 15-lb batches every Monday & Thursday so beans never sit on a shelf",
      "Shipped within 24 hours of roasting for peak aroma, body, and crema",
      "Custom whole bean and fine/coarse grind options available"
    ],
    fieldNotes: `Jenny runs a world-class roastery with 12-person morning lines for pour-overs. Last year her nephew threw together a generic 2005-style website that just said "We sell coffee beans." Google bots had no clue she roasted certified organic arabica. Her paid ad CPC was through the roof ($2.85) because of a 4/10 Quality Score, and website conversion rate was stuck at 1.9%. She hired our agency on a monthly retainer to build a cohesive full-funnel growth engine.`,
    customerFeedback: [
      "“Your organic roast is the best in the state, but your website just says 'Buy Coffee'. Where are the origin details?” — Mark R.",
      "“I tried searching Google for 'fresh roasted organic arabica beans' in WV and couldn't find your store anywhere.” — Sarah T.",
      "“I was ready to checkout but wasn't sure if shipping was flat-rate or based on weight.” — Elena P."
    ],
    targetMonthlyRevenue: 15000,
    currentMonthlyRevenue: 7240,
    targetAov: 42.50
  };

  // Simulation Timeline State
  private currentDay: number = 1;
  private currentWeek: number = 1;
  private currentLevel: string = "Week 1: Junior Specialist";

  // Subsystem States
  private persona: ClientPersonaState = {
    name: "Pour-Over Coffee Enthusiast",
    ageRange: { min: 25, max: 48 },
    targetLocation: "United States (Focus: Mid-Atlantic & Metro)",
    primaryNeed: "Freshly roasted, ethically-sourced specialty organic arabica beans delivered on a reliable schedule",
    interests: ["Specialty Coffee", "Organic Food", "Third-Wave Coffee", "Sustainable Living", "Pour-Over Brewing"],
    painPoints: [
      "Stale supermarket beans that have sat in warehouses for months",
      "Lack of origin transparency or vague roast dates",
      "Slow shipping that ruins peak aromatic degassing window"
    ],
    searchIntentKeywords: ["organic arabica coffee beans", "fresh roasted coffee online", "single origin coffee subscription", "specialty coffee delivery"],
    audienceFitBonus: 1.0,
    isSynthesized: false
  };

  private seo: ClientSeoState = {
    title: "Coffee Beans For Sale - Buy Now",
    h1: "Coffee Beans For Sale",
    metaDescription: "We sell coffee beans. Best prices.",
    targetKeywords: ["arabica coffee beans", "organic coffee", "specialty coffee", "single-origin coffee", "fresh roasted beans"],
    overallScore: 42,
    landingPageExperience: "Below Average",
    organicRankEstimate: 8.5,
    organicMonthlyClicks: 280,
    haloBrandSearchBonus: 0,
    lastOptimizedDay: 1
  };

  private adCampaign: ClientAdCampaignState = {
    campaignName: "Jenny's Fresh Organic Beans - Search",
    platform: "google_ads",
    dailyBudget: 50,
    qualityScore: 4,
    expectedCtr: 1.6,
    effectiveCpc: 2.85,
    adHeadlines: ["Buy Coffee Beans Online", "Best Coffee Deals", "Order Coffee Today"],
    keywords: [
      { text: "coffee beans", matchType: "broad" },
      { text: "buy coffee online", matchType: "phrase" },
      { text: "organic coffee beans", matchType: "broad" }
    ],
    negativeKeywords: [],
    adExtensionsActive: false,
    landingPageBoostApplied: false,
    status: "active"
  };

  private deployedABTest: DeployedABTest | null = null;
  private conversionRateMultiplier: number = 1.0;

  // Daily History Tracking
  private dailyHistory: DailyPerformanceRecord[] = [];
  private activityLogs: ClientActivityLog[] = [];

  constructor() {
    this.seedInitialHistory();
  }

  /**
   * Seed Day 1 baseline history so graphs have context
   */
  private seedInitialHistory() {
    this.dailyHistory = [
      {
        day: 1,
        date: "Day 1 (Week 1, Monday)",
        paidSearchClicks: 18,
        paidSocialClicks: 12,
        organicClicks: 9,
        directClicks: 6,
        totalSessions: 45,
        conversions: 1,
        conversionRate: 2.22,
        dailySpend: 51.30,
        dailyRevenue: 42.50,
        blendedCpa: 51.30,
        qualityScore: 4
      }
    ];

    this.activityLogs = [
      {
        id: "log-1",
        day: 1,
        category: "Client",
        headline: "Agency Retainer Initiated",
        detail: "Jenny's Artisan Java & Roastery onboarded. Initial site audit revealed 42/100 SEO health and high $2.85 ad CPC.",
        timestamp: new Date().toISOString()
      }
    ];
  }

  /**
   * Get the master client account overview
   */
  public getClientOverview() {
    this.recalculateDynamicMetrics();
    
    const attribution = this.calculateAttributionBreakdown();
    const blended = this.calculateBlendedMetrics(attribution);
    const healthScore = this.calculateClientHealthScore(blended);

    return {
      dossier: this.dossier,
      timeline: {
        currentDay: this.currentDay,
        currentWeek: this.currentWeek,
        currentLevel: this.currentLevel,
        daysRemainingInMonth: Math.max(0, 28 - this.currentDay)
      },
      healthScore,
      persona: this.persona,
      seo: this.seo,
      adCampaign: this.adCampaign,
      deployedABTest: this.deployedABTest,
      conversionRateMultiplier: this.conversionRateMultiplier,
      attribution,
      blended,
      dailyHistory: this.dailyHistory,
      activityLogs: this.activityLogs.slice(-15) // last 15 logs
    };
  }

  /**
   * Sync an SEO Studio optimization attempt
   * Automatically recalculates Landing Page Experience and Google Ad Quality Score!
   */
  public syncSeoScore(score: number, pageContent?: { title?: string; h1?: string; metaDescription?: string }) {
    this.seo.overallScore = Math.max(0, Math.min(100, Math.round(score)));
    this.seo.lastOptimizedDay = this.currentDay;

    if (pageContent?.title) this.seo.title = pageContent.title;
    if (pageContent?.h1) this.seo.h1 = pageContent.h1;
    if (pageContent?.metaDescription) this.seo.metaDescription = pageContent.metaDescription;

    // Determine Landing Page Experience Rating
    if (this.seo.overallScore >= 80) {
      this.seo.landingPageExperience = 'Above Average';
      this.seo.organicRankEstimate = Math.max(1.2, 10 - (this.seo.overallScore / 10));
    } else if (this.seo.overallScore >= 60) {
      this.seo.landingPageExperience = 'Average';
      this.seo.organicRankEstimate = 4.8;
    } else {
      this.seo.landingPageExperience = 'Below Average';
      this.seo.organicRankEstimate = 8.5;
    }

    // Recalculate Ad Quality Score and CPC discount based on Google Ads formula
    this.recalculateAdEconomics();

    this.logActivity(
      'SEO',
      `Landing Page SEO Optimized (Score: ${this.seo.overallScore}/100)`,
      `Landing Page Experience evaluated as "${this.seo.landingPageExperience}". Quality Score increased to ${this.adCampaign.qualityScore}/10. Effective CPC dropped to $${this.adCampaign.effectiveCpc.toFixed(2)}.`
    );

    return this.getClientOverview();
  }

  /**
   * Sync customer persona synthesis into campaign targeting
   */
  public syncPersona(personaData: Partial<ClientPersonaState>) {
    this.persona = {
      ...this.persona,
      ...personaData,
      isSynthesized: true,
      audienceFitBonus: 1.25 // 25% CTR & relevance boost
    };

    this.recalculateAdEconomics();

    this.logActivity(
      'Persona',
      `Customer Persona Synthesized: ${this.persona.name}`,
      `Audience messaging calibrated to pain points. Ad relevance and expected CTR boosted by +25%.`
    );

    return this.getClientOverview();
  }

  /**
   * Deploy winning variant from an A/B test directly to the client's live marketing engine!
   */
  public deployABTestWinner(testId: number, testName: string, winningVariant: string, testVariable: string, improvementPercent: number) {
    const lift = Math.max(1.0, 1 + (improvementPercent / 100));
    this.conversionRateMultiplier = parseFloat(lift.toFixed(3));

    // Annualized revenue projection based on current traffic
    const projectedAnnual = Math.round(this.dossier.currentMonthlyRevenue * (improvementPercent / 100) * 12);

    this.deployedABTest = {
      testId,
      testName,
      testVariable,
      winningVariantName: winningVariant,
      improvementPercent: parseFloat(improvementPercent.toFixed(1)),
      projectedAnnualLift: projectedAnnual,
      deployedDay: this.currentDay,
      deployedAt: new Date().toISOString()
    };

    // If test variable is headline, update ad headline too
    if (testVariable.toLowerCase().includes('headline')) {
      this.adCampaign.adHeadlines[0] = winningVariant;
    }

    this.logActivity(
      'A/B Testing',
      `Deployed A/B Test Winner: "${winningVariant}"`,
      `Applied to client landing page & active campaigns. Site-wide conversion rate lifted by +${improvementPercent.toFixed(1)}%. Projected annual lift: $${projectedAnnual.toLocaleString()}.`
    );

    return this.getClientOverview();
  }

  /**
   * Update current rigor / agency week level
   */
  public updateLevel(level: string) {
    this.currentLevel = level;
    if (level.includes('Week 2')) this.currentWeek = 2;
    else if (level.includes('Week 3')) this.currentWeek = 3;
    else if (level.includes('Week 4')) this.currentWeek = 4;
    else this.currentWeek = 1;

    this.logActivity(
      'Timeline',
      `Agency Rigor Level Updated: ${level}`,
      `Unlocked advanced campaign parameters, negative keyword auditing, and full-funnel attribution tracking.`
    );

    return this.getClientOverview();
  }

  /**
   * Advance simulation time (e.g. +7 Days / 1 Week)
   * Simulates daily marketing performance with day-of-week dynamics,
   * keyword quality, landing page experience, and CRO lifts.
   */
  public advanceTime(days: number = 7): { overview: any; simulatedDays: DailyPerformanceRecord[]; debrief: string } {
    const simulatedDays: DailyPerformanceRecord[] = [];
    const startDay = this.currentDay + 1;
    const endDay = this.currentDay + days;

    // Day of week labels cycling
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let day = startDay; day <= endDay; day++) {
      const dayOfWeekIdx = (day % 7);
      const isWeekend = dayOfWeekIdx === 0 || dayOfWeekIdx === 6;
      const dayName = dayNames[dayOfWeekIdx];

      // 1. Paid Search (Google Ads) traffic based on daily budget and current effective CPC
      const dailyAdBudget = this.adCampaign.dailyBudget;
      const cpc = this.adCampaign.effectiveCpc;
      const basePaidClicks = Math.round(dailyAdBudget / cpc);
      
      // Weekend vs weekday traffic factor
      const dayFactor = isWeekend ? 0.85 : 1.05 + (Math.random() * 0.1 - 0.05);
      const paidSearchClicks = Math.max(5, Math.round(basePaidClicks * dayFactor));
      const dailyAdSpend = parseFloat((paidSearchClicks * cpc).toFixed(2));

      // 2. Paid Social (Meta Ads) traffic
      const paidSocialClicks = Math.round(paidSearchClicks * 0.65);
      const paidSocialSpend = parseFloat((paidSocialClicks * 1.15).toFixed(2));

      // 3. Organic Search (SEO) traffic
      // Scaled by SEO score (40 -> 10/day, 85 -> 38/day) + Brand search halo effect from active ads
      const seoBase = (this.seo.overallScore / 100) * 40;
      const haloBonus = (paidSearchClicks + paidSocialClicks) * 0.12; // 12% halo lift
      const organicClicks = Math.max(3, Math.round((seoBase + haloBonus) * dayFactor));

      // 4. Direct / Word of Mouth traffic
      const directClicks = Math.max(2, Math.round((organicClicks * 0.45) + (paidSearchClicks * 0.15)));

      const totalSessions = paidSearchClicks + paidSocialClicks + organicClicks + directClicks;

      // 5. Conversions calculated using base rate * A/B test lift multiplier
      const baseConversionRate = 0.022; // 2.2% baseline
      const effectiveCvr = baseConversionRate * this.conversionRateMultiplier * (isWeekend ? 1.1 : 0.98);
      const conversions = Math.max(1, Math.round(totalSessions * effectiveCvr));
      const conversionRatePercent = parseFloat(((conversions / totalSessions) * 100).toFixed(2));

      // 6. Revenue and Unit Economics
      const totalSpend = parseFloat((dailyAdSpend + paidSocialSpend).toFixed(2));
      const dailyRevenue = parseFloat((conversions * this.dossier.targetAov).toFixed(2));
      const blendedCpa = conversions > 0 ? parseFloat((totalSpend / conversions).toFixed(2)) : totalSpend;

      const record: DailyPerformanceRecord = {
        day,
        date: `Day ${day} (Week ${Math.ceil(day / 7)}, ${dayName})`,
        paidSearchClicks,
        paidSocialClicks,
        organicClicks,
        directClicks,
        totalSessions,
        conversions,
        conversionRate: conversionRatePercent,
        dailySpend: totalSpend,
        dailyRevenue,
        blendedCpa,
        qualityScore: this.adCampaign.qualityScore
      };

      simulatedDays.push(record);
      this.dailyHistory.push(record);
    }

    // Update current day & week
    this.currentDay = endDay;
    this.currentWeek = Math.min(4, Math.ceil(this.currentDay / 7));
    if (this.currentWeek === 2 && this.currentLevel.includes('Week 1')) {
      this.currentLevel = "Week 2: Campaign Strategist";
    } else if (this.currentWeek === 3 && this.currentLevel.includes('Week 2')) {
      this.currentLevel = "Week 3: Senior Director";
    } else if (this.currentWeek >= 4 && !this.currentLevel.includes('Week 4')) {
      this.currentLevel = "Week 4: Agency Partner";
    }

    // Generate agency simulation debrief
    const totalSimSpend = simulatedDays.reduce((acc, d) => acc + d.dailySpend, 0);
    const totalSimRevenue = simulatedDays.reduce((acc, d) => acc + d.dailyRevenue, 0);
    const totalSimConversions = simulatedDays.reduce((acc, d) => acc + d.conversions, 0);
    const simRoas = (totalSimRevenue / (totalSimSpend || 1)).toFixed(2);

    const debrief = `Completed 7-day marketing cycle (Days ${startDay}–${endDay}). Total Sessions: ${simulatedDays.reduce((a, b) => a + b.totalSessions, 0).toLocaleString()} | Conversions: ${totalSimConversions} | Spend: $${totalSimSpend.toFixed(2)} | Revenue: $${totalSimRevenue.toFixed(2)} | ROAS: ${simRoas}x.`;

    this.logActivity(
      'Timeline',
      `Advanced 7 Days (Now at Day ${this.currentDay})`,
      debrief
    );

    return {
      overview: this.getClientOverview(),
      simulatedDays,
      debrief
    };
  }

  /**
   * Recalculates ad Quality Score, CPC discounts, and expected CTR
   * using Google Ads auction formula:
   * Quality Score = Expected CTR (35%) + Ad Relevance (35%) + Landing Page Experience (30%)
   */
  private recalculateAdEconomics() {
    // 1. Landing Page Component (30% weight: 1 to 10 points)
    let lpComponent = 3;
    if (this.seo.landingPageExperience === 'Above Average') lpComponent = 9.5;
    else if (this.seo.landingPageExperience === 'Average') lpComponent = 6.0;
    else lpComponent = 3.0;

    // 2. Ad Relevance Component (35% weight)
    let relevanceComponent = 5.0;
    if (this.persona.isSynthesized) relevanceComponent += 2.5; // Persona boost
    if (this.adCampaign.negativeKeywords.length > 0) relevanceComponent += 1.5;

    // 3. Expected CTR Component (35% weight)
    let ctrComponent = 4.5;
    if (this.deployedABTest) ctrComponent += 3.0; // Winning tested headline
    if (this.persona.isSynthesized) ctrComponent += 1.5;

    // Weighted Quality Score
    const rawQs = (lpComponent * 0.30) + (relevanceComponent * 0.35) + (ctrComponent * 0.35);
    this.adCampaign.qualityScore = Math.max(1, Math.min(10, Math.round(rawQs)));

    // CPC Auction Formula: High Quality Score grants up to 50% discount; Low Quality Score pays surcharge
    // QS 10: 0.52x ($1.48) | QS 7: 0.75x ($2.13) | QS 4: 1.00x ($2.85) | QS 1: 1.45x ($4.13)
    const baseCpc = 2.85;
    const qsMultiplier = 1.0 - ((this.adCampaign.qualityScore - 4) * 0.08);
    this.adCampaign.effectiveCpc = parseFloat(Math.max(0.95, baseCpc * qsMultiplier).toFixed(2));

    // Expected CTR
    const baseCtr = 1.6;
    const ctrBoost = (this.adCampaign.qualityScore / 10) * 1.5 * this.persona.audienceFitBonus;
    this.adCampaign.expectedCtr = parseFloat((baseCtr * ctrBoost).toFixed(2));
    this.adCampaign.landingPageBoostApplied = this.seo.landingPageExperience === 'Above Average';
  }

  /**
   * Calculate Multi-Channel Attribution Breakdown
   */
  private calculateAttributionBreakdown(): Record<string, ChannelMetrics> {
    const recent = this.dailyHistory.slice(-7); // Last 7 days active window
    const daysCount = recent.length || 1;

    const paidSearchSessions = recent.reduce((a, b) => a + b.paidSearchClicks, 0);
    const paidSocialSessions = recent.reduce((a, b) => a + b.paidSocialClicks, 0);
    const organicSessions = recent.reduce((a, b) => a + b.organicClicks, 0);
    const directSessions = recent.reduce((a, b) => a + b.directClicks, 0);

    const totalSpend = recent.reduce((a, b) => a + b.dailySpend, 0);
    const totalConvs = recent.reduce((a, b) => a + b.conversions, 0);

    // Approximate channel attribution weighting
    const searchConvs = Math.round(totalConvs * 0.44);
    const socialConvs = Math.round(totalConvs * 0.24);
    const organicConvs = Math.round(totalConvs * 0.22);
    const directConvs = Math.max(0, totalConvs - (searchConvs + socialConvs + organicConvs));

    const aov = this.dossier.targetAov;

    return {
      paidSearch: {
        name: "Google Paid Search",
        sessions: paidSearchSessions,
        conversions: searchConvs,
        conversionRate: paidSearchSessions > 0 ? parseFloat(((searchConvs / paidSearchSessions) * 100).toFixed(2)) : 0,
        spend: parseFloat((totalSpend * 0.65).toFixed(2)),
        revenue: parseFloat((searchConvs * aov).toFixed(2)),
        cpa: searchConvs > 0 ? parseFloat(((totalSpend * 0.65) / searchConvs).toFixed(2)) : 0,
        roas: parseFloat(((searchConvs * aov) / ((totalSpend * 0.65) || 1)).toFixed(2))
      },
      paidSocial: {
        name: "Meta Ads (Instagram & FB)",
        sessions: paidSocialSessions,
        conversions: socialConvs,
        conversionRate: paidSocialSessions > 0 ? parseFloat(((socialConvs / paidSocialSessions) * 100).toFixed(2)) : 0,
        spend: parseFloat((totalSpend * 0.35).toFixed(2)),
        revenue: parseFloat((socialConvs * aov).toFixed(2)),
        cpa: socialConvs > 0 ? parseFloat(((totalSpend * 0.35) / socialConvs).toFixed(2)) : 0,
        roas: parseFloat(((socialConvs * aov) / ((totalSpend * 0.35) || 1)).toFixed(2))
      },
      organicSearch: {
        name: "Google Organic Search (SEO)",
        sessions: organicSessions,
        conversions: organicConvs,
        conversionRate: organicSessions > 0 ? parseFloat(((organicConvs / organicSessions) * 100).toFixed(2)) : 0,
        spend: 0,
        revenue: parseFloat((organicConvs * aov).toFixed(2)),
        cpa: 0,
        roas: 99.0 // Zero marginal ad cost
      },
      directReferral: {
        name: "Direct & Brand Referral",
        sessions: directSessions,
        conversions: directConvs,
        conversionRate: directSessions > 0 ? parseFloat(((directConvs / directSessions) * 100).toFixed(2)) : 0,
        spend: 0,
        revenue: parseFloat((directConvs * aov).toFixed(2)),
        cpa: 0,
        roas: 99.0
      }
    };
  }

  /**
   * Calculate Blended CAC and Agency Economics
   */
  private calculateBlendedMetrics(attribution: Record<string, ChannelMetrics>) {
    const totalSpend = attribution.paidSearch.spend + attribution.paidSocial.spend;
    const totalConversions = 
      attribution.paidSearch.conversions + 
      attribution.paidSocial.conversions + 
      attribution.organicSearch.conversions + 
      attribution.directReferral.conversions;

    const totalSessions = 
      attribution.paidSearch.sessions + 
      attribution.paidSocial.sessions + 
      attribution.organicSearch.sessions + 
      attribution.directReferral.sessions;

    const totalRevenue = 
      attribution.paidSearch.revenue + 
      attribution.paidSocial.revenue + 
      attribution.organicSearch.revenue + 
      attribution.directReferral.revenue;

    const blendedCac = totalConversions > 0 ? parseFloat((totalSpend / totalConversions).toFixed(2)) : 0;
    const blendedRoas = totalSpend > 0 ? parseFloat((totalRevenue / totalSpend).toFixed(2)) : 0;
    const blendedCvr = totalSessions > 0 ? parseFloat(((totalConversions / totalSessions) * 100).toFixed(2)) : 0;

    return {
      totalSpend,
      totalConversions,
      totalSessions,
      totalRevenue,
      blendedCac,
      blendedRoas,
      blendedCvr
    };
  }

  /**
   * Calculate Client Health Score (0 - 100)
   */
  private calculateClientHealthScore(blended: { blendedRoas: number; blendedCac: number }): number {
    // 30% SEO Health + 30% Ad Quality Score + 20% ROAS Performance + 20% A/B Testing
    const seoPart = (this.seo.overallScore / 100) * 30;
    const adPart = (this.adCampaign.qualityScore / 10) * 30;
    const roasPart = Math.min(20, (blended.blendedRoas / 3.5) * 20);
    const croPart = this.deployedABTest ? 20 : 5;

    return Math.max(10, Math.min(100, Math.round(seoPart + adPart + roasPart + croPart)));
  }

  private recalculateDynamicMetrics() {
    this.recalculateAdEconomics();
  }

  private logActivity(category: ClientActivityLog['category'], headline: string, detail: string) {
    this.activityLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      day: this.currentDay,
      category,
      headline,
      detail,
      timestamp: new Date().toISOString()
    });
  }
}

// Singleton instance representing the active client's live marketing engine
export const unifiedClientEngine = new UnifiedClientEngine();

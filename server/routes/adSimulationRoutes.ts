import { Express, Request, Response } from "express";
import { AdPlatformSimulation, insertAdPlatformSimulationSchema, insertAdPlatformSimulationAttemptSchema } from "@shared/schema";
import { storage } from "../storage";
import { z } from "zod";
import { db } from "../db";

// Sample ad platform simulations data for seeding
const sampleAdSimulations = [
  {
    title: "Google Ads Search Campaign - Beginner Level",
    platform: "google_ads",
    type: "search",
    industry: "E-commerce",
    difficulty: "Beginner",
    scenarioDescription: "Create a Google Ads search campaign for an online clothing store looking to increase sales of their summer collection.",
    objectives: [
      "Increase website traffic",
      "Generate clothing sales",
      "Improve return on ad spend (ROAS)"
    ],
    targetAudience: {
      locations: ["United States", "Canada"],
      demographics: {
        ageRanges: ["18-24", "25-34"],
        genders: ["all"],
        parentalStatus: ["not_a_parent", "parent"]
      },
      interests: ["Fashion", "Online Shopping"]
    },
    budget: 50, // Daily budget
    keywords: ["summer clothing", "summer fashion", "summer outfits"],
    keywordMatchTypes: ["broad", "phrase", "exact"],
    negativeKeywords: ["winter", "discount", "cheap"],
    adCreativeSamples: ["Discover Summer Style", "Shop Our Summer Collection", "Trendy Summer Outfits"]
  },
  {
    title: "Meta Ads Campaign for Local Business",
    platform: "meta_ads",
    type: "conversion",
    industry: "Local Business",
    difficulty: "Beginner",
    scenarioDescription: "Create a Facebook and Instagram ad campaign for a local coffee shop trying to promote their new mobile ordering app.",
    objectives: [
      "App installs",
      "Increase local awareness",
      "Drive in-store visits"
    ],
    targetAudience: {
      locations: ["Chicago, IL (10 mile radius)"],
      demographics: {
        ageRanges: ["18-65+"],
        genders: ["all"],
        parentalStatus: ["all"]
      },
      interests: ["Coffee", "Cafes", "Food & Drink", "Mobile apps"],
      behaviors: ["Engaged shoppers", "Mobile device users"]
    },
    budget: 30,
    adCreativeSamples: ["Skip the line with our new app", "Order ahead and earn points with every purchase", "Coffee on the go, ready when you are"],
    placementOptions: ["Facebook News Feed", "Instagram Feed", "Instagram Stories"]
  },
  {
    title: "LinkedIn Lead Generation Campaign",
    platform: "linkedin_ads",
    type: "lead_gen",
    industry: "B2B SaaS",
    difficulty: "Intermediate",
    scenarioDescription: "Create a LinkedIn advertising campaign for a B2B software company offering a project management solution for enterprise clients.",
    objectives: [
      "Generate high-quality leads",
      "Book demos with decision-makers",
      "Increase brand awareness in the enterprise market"
    ],
    targetAudience: {
      locations: ["United States", "United Kingdom", "Australia"],
      demographics: {
        ageRanges: ["25-54"],
        genders: ["all"]
      },
      jobTitles: ["Project Manager", "IT Director", "CIO", "VP of Operations"],
      companySize: ["201-500", "501-1000", "1001+"],
      industries: ["Information Technology", "Financial Services", "Healthcare"]
    },
    budget: 80,
    adCreativeSamples: ["Streamline Enterprise Project Management", "Increase Team Productivity by 35%", "Book a Demo: Enterprise Project Solution"],
    leadGenFormFields: ["First Name", "Last Name", "Email", "Company Name", "Job Title"]
  },
  {
    title: "Google Display Network Campaign",
    platform: "google_ads",
    type: "display",
    industry: "Travel",
    difficulty: "Intermediate",
    scenarioDescription: "Create a Google Display Network campaign for a travel agency promoting all-inclusive vacation packages.",
    objectives: [
      "Generate leads for vacation packages",
      "Build brand awareness",
      "Remarket to website visitors"
    ],
    targetAudience: {
      locations: ["United States"],
      demographics: {
        ageRanges: ["25-34", "35-44", "45-54"],
        genders: ["all"],
        parentalStatus: ["all"],
        householdIncome: ["top 10%", "top 20%"]
      },
      interests: ["Travel", "Luxury Travel", "Beach Vacations", "All-inclusive Resorts"]
    },
    budget: 60,
    targeting: {
      placements: ["travel websites", "lifestyle blogs"],
      topics: ["Travel", "Vacations", "Beaches"],
      audiences: ["In-market for travel", "Travel enthusiasts"]
    },
    adSizes: ["300x250", "336x280", "728x90", "300x600"]
  },
  {
    title: "Advanced Meta Retargeting Campaign",
    platform: "meta_ads",
    type: "retargeting",
    industry: "Online Education",
    difficulty: "Advanced",
    scenarioDescription: "Create an advanced Meta retargeting campaign for an online learning platform to convert cart abandoners and website visitors into paying customers.",
    objectives: [
      "Recover abandoned carts",
      "Re-engage past visitors",
      "Increase course signups"
    ],
    targetAudience: {
      customAudiences: [
        "Website visitors in the last 30 days",
        "Course page viewers in the last 14 days",
        "Shopping cart abandoners in the last 7 days",
        "Past purchasers (for upselling)"
      ],
      lookalikeAudiences: ["Similar to past purchasers (1%)", "Similar to high-value customers (5%)"],
      exclusions: ["Existing customers (for specific campaigns)"]
    },
    budget: 75,
    adCreativeSamples: ["Complete Your Course Registration", "Your Selected Course Is Waiting", "50% Off - Limited Time Offer"],
    advancedFeatures: ["Dynamic product ads", "Conversion optimization", "Different messaging based on funnel stage"],
    attributionSettings: ["7-day click, 1-day view"]
  },
  {
    title: "Expert Google Ads Competitive Conquesting",
    platform: "google_ads",
    type: "search",
    industry: "Finance",
    difficulty: "Expert",
    scenarioDescription: "Manage a high-stakes search campaign in the ultra-competitive business loans sector. Bids exceed $25/click from aggressive competitors. You must maintain strict negative keyword hygiene, achieve a 9+ Quality Score, and leverage phrase/exact match types to achieve a positive ROAS.",
    objectives: [
      "Target high-intent commercial loan searches",
      "Defend against competitor click inflation",
      "Achieve sub-$60 cost per qualified lead",
      "Maintain a Quality Score of 8+"
    ],
    targetAudience: {
      locations: ["United States (Top 50 Metros)"],
      demographics: {
        ageRanges: ["35-54", "55-64"],
        genders: ["all"],
        householdIncome: ["top 10%", "top 25%"]
      },
      interests: ["Small Business", "Commercial Banking", "Business Financing"]
    },
    budget: 150,
    keywords: ["commercial business loans", "working capital funding", "fast business financing", "equipment financing loan"],
    keywordMatchTypes: ["phrase", "exact"],
    negativeKeywords: ["free", "personal", "bad credit", "scam", "government grants", "calculator"],
    adCreativeSamples: ["Fast Commercial Business Loans", "Same-Day Funding Approval", "Rates from 5.9% APR"]
  },
  {
    title: "Expert Omnichannel Multi-Placement Blitz",
    platform: "meta_ads",
    type: "conversion",
    industry: "E-commerce",
    difficulty: "Expert",
    scenarioDescription: "Scale an international direct-to-consumer brand during Q4 holiday surge. Ad fatigue sets in within 48 hours. You must implement dynamic creative testing, broad audience Advantage+ targeting with strict lookalike exclusions, and conversion API pixel tracking.",
    objectives: [
      "Scale daily revenue past 4.5x ROAS",
      "Combat rapid ad creative fatigue",
      "Optimize checkout conversion rate across Instagram Reels & Feeds"
    ],
    targetAudience: {
      locations: ["United States", "United Kingdom", "Germany", "Canada"],
      demographics: {
        ageRanges: ["21-45"],
        genders: ["all"]
      },
      interests: ["Premium lifestyle", "Direct to consumer brands", "Holiday gift guides"]
    },
    budget: 200,
    adCreativeSamples: ["The #1 Rated Holiday Gift of 2025", "Limited Stock Remaining - Order Before Dec 15", "Unlock 25% Off Storewide VIP Access"],
    placementOptions: ["Instagram Reels", "Instagram Stories", "Facebook Feed", "Messenger Stories"]
  }
];

/**
 * Seed ad platform simulations data
 */
const seedAdSimulations = async () => {
  try {
    console.log("Seeding ad platform simulations...");
    
    // Get existing simulations
    const existingSimulations = await storage.listAdPlatformSimulations();
    console.log(`Found ${existingSimulations.length} existing ad simulations`);
    
    // Extract existing titles to avoid duplicates
    const existingTitles = existingSimulations.map(sim => sim.title);
    
    // Insert new simulations that don't already exist
    let newSimulationsCount = 0;
    
    for (const sim of sampleAdSimulations) {
      if (!existingTitles.includes(sim.title)) {
        await db.insert(adPlatformSimulations).values(sim as any);
        newSimulationsCount++;
        console.log(`Added new ad simulation: ${sim.title}`);
      } else {
        console.log(`Simulation already exists, skipping: ${sim.title}`);
      }
    }
    
    console.log(`Added ${newSimulationsCount} new ad simulations`);
    return true;
  } catch (error) {
    console.error("Error seeding ad simulations:", error);
    return false;
  }
};

import { dynamicSimulationGenerator } from "../services/dynamicSimulationGenerator";

// Memory store for dynamically generated simulations
const dynamicSimulationsStore: Map<number, any> = new Map();

// Helper to get fallback sample simulations with sequential IDs
const seededStaticSimulations = sampleAdSimulations.map((sim, index) => ({
  id: index + 1,
  ...sim,
  createdAt: new Date(),
  updatedAt: new Date()
}));

/**
 * Get all ad platform simulations (combines static library + user-tailored dynamic simulations)
 */
const getAdSimulations = async (req: Request, res: Response) => {
  try {
    let dbSimulations: any[] = [];
    try {
      dbSimulations = await storage.listAdPlatformSimulations();
    } catch (e) {
      console.warn("Using in-memory simulations fallback.");
    }
    
    const baseList = dbSimulations.length > 0 ? dbSimulations : seededStaticSimulations;
    const dynamicList = Array.from(dynamicSimulationsStore.values());
    
    // Combine base catalog with newly generated simulations
    const combined = [...dynamicList, ...baseList];
    res.json(combined);
  } catch (error) {
    console.error("Error fetching ad simulations:", error);
    res.status(500).json({ error: "Failed to fetch ad simulations" });
  }
};

/**
 * Get a specific ad platform simulation by ID
 */
const getAdSimulationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const simulationId = parseInt(id);

    // 1. Check dynamically generated simulations
    if (dynamicSimulationsStore.has(simulationId)) {
      return res.json(dynamicSimulationsStore.get(simulationId));
    }
    
    // 2. Check storage / database
    try {
      const simulation = await storage.getAdPlatformSimulation(simulationId);
      if (simulation) {
        return res.json(simulation);
      }
    } catch (e) {
      // fallback
    }

    // 3. Check seeded static simulations
    const staticSim = seededStaticSimulations.find(s => s.id === simulationId);
    if (staticSim) {
      return res.json(staticSim);
    }
    
    res.status(404).json({ error: "Ad simulation not found" });
  } catch (error) {
    console.error("Error fetching ad simulation:", error);
    res.status(500).json({ error: "Failed to fetch ad simulation" });
  }
};

/**
 * Dynamically generate a personalized simulation tailored to the user's expertise level and weaknesses
 */
const generateAdSimulation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || 1;
    const { level, targetWeakness, platform, industry } = req.body || {};

    const generatedSim = dynamicSimulationGenerator.generateSimulation({
      userId,
      level,
      targetWeakness,
      platform,
      industry
    });

    // Store in-memory
    dynamicSimulationsStore.set(generatedSim.id, generatedSim);

    // Also attempt to persist to database if available
    try {
      await db.insert(adPlatformSimulations).values(generatedSim as any);
    } catch (e) {
      console.log("Persisted dynamic simulation to memory store.");
    }

    res.status(201).json(generatedSim);
  } catch (error) {
    console.error("Error generating dynamic simulation:", error);
    res.status(500).json({ error: "Failed to generate dynamic simulation" });
  }
};

/**
 * Get user's current skill diagnostics and weakness profile
 */
const getUserSkillDiagnostics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || 1;
    const userLevel = (req.user as any)?.level || "Expert";
    const diagnostics = dynamicSimulationGenerator.getUserDiagnostics(userId, userLevel);
    res.json(diagnostics);
  } catch (error) {
    console.error("Error getting skill diagnostics:", error);
    res.status(500).json({ error: "Failed to fetch skill diagnostics" });
  }
};

/**
 * Submit an attempt for an ad platform simulation
 */
const submitAdSimulationAttempt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const simulationId = parseInt(id);
    const userId = req.user?.id || 1;
    
    // Fetch the simulation
    let simulation = dynamicSimulationsStore.get(simulationId);
    if (!simulation) {
      try {
        simulation = await storage.getAdPlatformSimulation(simulationId);
      } catch (e) {}
    }
    if (!simulation) {
      simulation = seededStaticSimulations.find(s => s.id === simulationId);
    }

    if (!simulation) {
      return res.status(404).json({ error: "Ad simulation not found" });
    }
    
    const attemptData = {
      ...req.body,
      simulationId,
      userId
    };
    
    // Process the attempt with our mathematical simulation engine
    const evaluationResult = await evaluateAdSimulationAttempt(simulation, attemptData);
    
    // Record attempt in user's live skill & weakness tracker
    const hasNegs = Array.isArray(attemptData.negativeKeywords) 
      ? attemptData.negativeKeywords.length > 0
      : (attemptData.adGroups || []).some((ag: any) => ag.negativeKeywords?.length > 0);

    const attemptRecord = {
      id: Date.now(),
      userId,
      simulationId,
      platform: simulation.platform || "google_ads",
      difficulty: simulation.difficulty || "Beginner",
      score: evaluationResult.score,
      metrics: evaluationResult.metrics as any,
      usedNegativeKeywords: hasNegs,
      hasExtensions: !!(attemptData.platformSpecificSettings?.adExtensions?.length || attemptData.adExtensions?.length),
      timestamp: new Date()
    };

    dynamicSimulationGenerator.recordAttempt(attemptRecord);
    const postSimDebrief = dynamicSimulationGenerator.generatePostSimDebrief(attemptRecord, simulation);

    const savedAttempt = {
      ...attemptRecord,
      ...attemptData,
      ...evaluationResult,
      postSimDebrief,
      completedAt: new Date()
    };
    
    try {
      await storage.createAdPlatformSimulationAttempt(savedAttempt as any);
    } catch (e) {
      console.log("Saved attempt in memory session.");
    }
    
    res.json(savedAttempt);
  } catch (error) {
    console.error("Error submitting ad simulation attempt:", error);
    res.status(500).json({ error: "Failed to submit attempt" });
  }
};

/**
 * Get all attempts for a specific ad simulation by a user
 */
const getUserAttempts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const simulationId = parseInt(id);
    const userId = req.user?.id || 1;
    
    try {
      const attempts = await storage.getAdPlatformSimulationAttempts(userId, simulationId);
      return res.json(attempts);
    } catch (e) {
      return res.json([]);
    }
  } catch (error) {
    console.error("Error fetching user attempts:", error);
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
};

// Advanced Deterministic & Adaptive Marketing Simulation Evaluation Engine
async function evaluateAdSimulationAttempt(
  simulation: AdPlatformSimulation, 
  attempt: any
): Promise<{ score: number; feedback: string[]; metrics: Record<string, number> }> {
  const difficulty = (simulation.difficulty || "beginner").toLowerCase();
  const platform = simulation.platform || "google_ads";
  const industry = simulation.industry || "General";
  const dailyBudget = typeof attempt.dailyBudget === "number" && attempt.dailyBudget > 0 ? attempt.dailyBudget : (simulation.budget || 50);

  // 1. Benchmark Rates by Platform & Industry
  const industryCpcBase: Record<string, number> = {
    "E-commerce": 1.35,
    "Online Retail": 1.25,
    "Local Business": 1.80,
    "Restaurants": 1.40,
    "B2B SaaS": 4.20,
    "B2B Software": 4.50,
    "Healthcare": 3.10,
    "Finance": 5.40,
    "Education": 2.20,
    "Travel": 1.60,
    "General": 1.90,
  };

  const aovBenchmarks: Record<string, number> = {
    "E-commerce": 75,
    "Online Retail": 65,
    "Local Business": 35,
    "Restaurants": 28,
    "B2B SaaS": 350,
    "B2B Software": 450,
    "Healthcare": 180,
    "Finance": 400,
    "Education": 120,
    "Travel": 250,
    "General": 80,
  };

  const baseCpc = industryCpcBase[industry] || industryCpcBase["General"];
  const aov = aovBenchmarks[industry] || aovBenchmarks["General"];

  // 2. Difficulty Multipliers
  let difficultyCpcMultiplier = 1.0;
  let difficultyCvrMultiplier = 1.0;
  let competitionIndex = 1.0;

  if (difficulty === "beginner") {
    difficultyCpcMultiplier = 0.85;
    difficultyCvrMultiplier = 1.20;
    competitionIndex = 0.8;
  } else if (difficulty === "intermediate") {
    difficultyCpcMultiplier = 1.10;
    difficultyCvrMultiplier = 1.0;
    competitionIndex = 1.1;
  } else if (difficulty === "advanced") {
    difficultyCpcMultiplier = 1.35;
    difficultyCvrMultiplier = 0.88;
    competitionIndex = 1.35;
  } else if (difficulty === "expert") {
    difficultyCpcMultiplier = 1.65;
    difficultyCvrMultiplier = 0.75;
    competitionIndex = 1.6;
  }

  // 3. Evaluate Keywords & Match Types (for Search / Google Ads)
  let keywordRelevanceScore = 5;
  let matchTypeMultiplier = 1.0;
  let hasNegativeKeywords = false;
  let totalKeywordsCount = 0;
  let exactPhraseRatio = 0;

  if (attempt.adGroupStructure && Array.isArray(attempt.adGroupStructure)) {
    const allKeywords: Array<{ text: string; matchType?: string }> = [];
    const allNegatives: string[] = [];

    attempt.adGroupStructure.forEach((ag: any) => {
      if (ag.targeting?.keywords && Array.isArray(ag.targeting.keywords)) {
        allKeywords.push(...ag.targeting.keywords);
      }
      if (ag.targeting?.negativeKeywords && Array.isArray(ag.targeting.negativeKeywords)) {
        allNegatives.push(...ag.targeting.negativeKeywords);
      }
    });

    totalKeywordsCount = allKeywords.length;
    hasNegativeKeywords = allNegatives.length > 0;

    if (totalKeywordsCount > 0) {
      const exactPhraseCount = allKeywords.filter(k => k.matchType === "exact" || k.matchType === "phrase").length;
      exactPhraseRatio = exactPhraseCount / totalKeywordsCount;
      
      // Match type strategy weighting
      if (exactPhraseRatio >= 0.6) {
        matchTypeMultiplier = 1.25; // Higher intent and higher CTR
        keywordRelevanceScore += 3;
      } else if (exactPhraseRatio >= 0.3) {
        matchTypeMultiplier = 1.05;
        keywordRelevanceScore += 1;
      } else {
        // High broad match share
        matchTypeMultiplier = difficulty === "expert" || difficulty === "advanced" ? 0.75 : 0.9;
        keywordRelevanceScore -= 1;
      }

      if (hasNegativeKeywords) {
        keywordRelevanceScore += 2;
      } else if (difficulty === "advanced" || difficulty === "expert") {
        keywordRelevanceScore -= 2; // Penalty in advanced/expert tiers for no negative keywords
      }
    }
  }

  // 4. Evaluate Ad Copy & Creative Relevance
  let creativeRelevanceScore = 5;
  const creatives = attempt.creatives || [];
  if (creatives.length > 0) {
    const firstCreative = creatives[0];
    const headline = (firstCreative.headline || "").toLowerCase();
    const description = (firstCreative.description || "").toLowerCase();
    const destUrl = (firstCreative.destinationUrl || "").toLowerCase();

    // Check if creative contains relevant industry / target intent keywords
    const searchTerms = (simulation.title + " " + (simulation.scenarioDescription || "")).toLowerCase();
    const words = searchTerms.split(/\s+/).filter(w => w.length > 4);
    const matchesHeadline = words.some(w => headline.includes(w));
    const matchesDesc = words.some(w => description.includes(w));

    if (matchesHeadline) creativeRelevanceScore += 2;
    if (matchesDesc) creativeRelevanceScore += 2;
    if (destUrl && destUrl.length > 5 && !destUrl.includes("example.com")) creativeRelevanceScore += 1;
  }

  // 5. Evaluate Extensions and Platform Features
  let extensionsBonus = 0;
  if (platform === "google_ads") {
    const exts = attempt.platformSpecificSettings?.adExtensions;
    if (Array.isArray(exts) && exts.length > 0) {
      extensionsBonus = Math.min(exts.length * 0.5, 1.5);
    }
  } else if (platform === "meta_ads") {
    if (attempt.platformSpecificSettings?.pixelEnabled) extensionsBonus += 1.0;
    if (attempt.platformSpecificSettings?.placements?.length >= 2) extensionsBonus += 0.5;
  } else if (platform === "linkedin_ads") {
    if (attempt.platformSpecificSettings?.leadGenEnabled) extensionsBonus += 1.0;
    if (attempt.platformSpecificSettings?.insightTagEnabled) extensionsBonus += 0.5;
  }

  // 6. Calculate Quality Score (1 - 10)
  const rawQualityScore = Math.round((keywordRelevanceScore * 0.45) + (creativeRelevanceScore * 0.45) + extensionsBonus);
  const qualityScore = Math.max(1, Math.min(10, rawQualityScore));

  // 7. Calculate Expected CTR
  let baseCtr = 0.021; // 2.1%
  if (platform === "meta_ads") baseCtr = 0.012;
  if (platform === "linkedin_ads") baseCtr = 0.008;

  const qsCtrMultiplier = 0.6 + (qualityScore * 0.08); // QS 10 -> 1.4x, QS 5 -> 1.0x, QS 1 -> 0.68x
  const ctr = parseFloat(Math.max(0.4, Math.min(8.5, (baseCtr * matchTypeMultiplier * qsCtrMultiplier * 100))).toFixed(2));

  // 8. Calculate CPC (Auction formula: discount for high QS, surcharge for low QS)
  const qsCpcDiscount = (11 - qualityScore) * 0.09 + 0.5; // QS 10 -> 0.59x, QS 5 -> 1.04x, QS 1 -> 1.40x
  const cpc = parseFloat(Math.max(0.20, (baseCpc * difficultyCpcMultiplier * qsCpcDiscount)).toFixed(2));

  // 9. Calculate Daily Spend, Impressions & Clicks
  const estimatedClicks = Math.max(1, Math.floor(dailyBudget / cpc));
  const impressions = Math.max(100, Math.round((estimatedClicks / (ctr / 100))));
  const clicks = Math.max(1, Math.round(impressions * (ctr / 100)));
  const cost = parseFloat(Math.min(dailyBudget, clicks * cpc).toFixed(2));

  // 10. Calculate Conversion Rate and Conversions
  let baseCvr = 0.032; // 3.2%
  if (platform === "meta_ads") baseCvr = 0.021;
  if (platform === "linkedin_ads") baseCvr = 0.045;

  const cvrMultiplier = (0.7 + (qualityScore * 0.06)) * difficultyCvrMultiplier;
  const conversionRate = parseFloat(Math.max(0.5, Math.min(15.0, (baseCvr * cvrMultiplier * 100))).toFixed(2));
  const conversions = Math.max(0, Math.round(clicks * (conversionRate / 100)));

  const costPerConversion = conversions > 0 ? parseFloat((cost / conversions).toFixed(2)) : cost;
  const totalRevenue = conversions * aov;
  const roas = parseFloat((totalRevenue / (cost || 1)).toFixed(2));

  const metrics: Record<string, number> = {
    impressions,
    clicks,
    conversions,
    cost,
    ctr,
    cpc,
    conversionRate,
    costPerConversion,
    qualityScore,
    roas,
    averagePosition: qualityScore >= 8 ? 1.4 : qualityScore >= 6 ? 2.2 : qualityScore >= 4 ? 3.5 : 4.8
  };

  // 11. Calculate Overall Performance Score (0 - 100)
  let calculatedScore = 0;
  const feedback: string[] = [];

  // Quality Score component (up to 30 pts)
  calculatedScore += qualityScore * 3;
  if (qualityScore >= 8) {
    feedback.push(`Outstanding Quality Score (${qualityScore}/10). Your ad copy strongly matches search intent and keywords.`);
  } else if (qualityScore >= 6) {
    feedback.push(`Solid Quality Score (${qualityScore}/10). Consider tightening headline copy to boost relevance.`);
  } else {
    feedback.push(`Low Quality Score (${qualityScore}/10). Irrelevant copy or unconstrained match types are inflating your CPC by ~${Math.round((qsCpcDiscount - 1) * 100)}%.`);
  }

  // CTR & Intent Strategy component (up to 25 pts)
  if (ctr >= 3.5) {
    calculatedScore += 25;
    feedback.push(`High Click-Through Rate (${ctr}%). Strong headline hooks and ad extensions are driving above-average engagement.`);
  } else if (ctr >= 2.0) {
    calculatedScore += 18;
    feedback.push(`Moderate Click-Through Rate (${ctr}%). Adding sitelinks and callout extensions will lift your CTR.`);
  } else {
    calculatedScore += 8;
    feedback.push(`Sub-optimal CTR (${ctr}%). Test more compelling call-to-actions (CTAs) and review keyword match types.`);
  }

  // Cost Efficiency & CPA component (up to 25 pts)
  if (conversions > 0 && costPerConversion <= baseCpc * 8) {
    calculatedScore += 25;
    feedback.push(`Cost per acquisition is efficient at $${costPerConversion.toFixed(2)} (ROAS: ${roas}x).`);
  } else if (conversions > 0) {
    calculatedScore += 16;
    feedback.push(`Generated ${conversions} conversions, but CPA ($${costPerConversion.toFixed(2)}) can be improved with landing page conversion optimization.`);
  } else {
    calculatedScore += 5;
    feedback.push(`No conversions recorded within the budget. Refine your audience targeting and ensure landing page proposition matches the ad promise.`);
  }

  // Advanced & Strategy Settings (up to 20 pts)
  if (hasNegativeKeywords) {
    calculatedScore += 10;
    feedback.push("Negative keywords actively filtered out irrelevant search queries, preventing wasted spend.");
  } else if (platform === "google_ads" && (difficulty === "advanced" || difficulty === "expert")) {
    feedback.push("Critical: You did not include negative keywords. In competitive auctions, broad traffic without negatives wastes 20-35% of ad spend.");
  }

  if (extensionsBonus > 0) {
    calculatedScore += 10;
    feedback.push("Effective use of platform tracking and extensions increased overall Ad Rank.");
  } else {
    feedback.push("Pro tip: Enable full ad extensions (Sitelinks, Callouts) or conversion pixels to improve Ad Rank without raising your bid.");
  }

  const finalScore = Math.min(100, Math.max(10, Math.round(calculatedScore)));

  return {
    score: finalScore,
    feedback,
    metrics
  };
}

export const registerAdSimulationRoutes = (app: Express) => {
  app.get("/api/ad-simulations", getAdSimulations);
  app.get("/api/ad-simulations/:id", getAdSimulationById);
  app.post("/api/ad-simulations/generate", generateAdSimulation);
  app.get("/api/user/skill-diagnostics", getUserSkillDiagnostics);
  app.post("/api/ad-simulations/:id/attempt", submitAdSimulationAttempt);
  app.get("/api/ad-simulations/:id/attempts", getUserAttempts);
};
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
  }
];

/**
 * Seed ad platform simulations data
 */
const seedAdSimulations = async () => {
  try {
    console.log("Seeding ad platform simulations...");
    
    // Get existing simulations
    console.log("Getting existing simulations...");
    const existingSimulations = await storage.listAdPlatformSimulations();
    console.log(`Found ${existingSimulations.length} existing ad simulations`);
    
    // Extract existing titles to avoid duplicates
    const existingTitles = existingSimulations.map(sim => sim.title);
    
    // Insert new simulations that don't already exist
    let newSimulationsCount = 0;
    
    for (const sim of sampleAdSimulations) {
      if (!existingTitles.includes(sim.title)) {
        await db.insert(db.schema.adPlatformSimulations).values(sim);
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

/**
 * Get all ad platform simulations
 */
const getAdSimulations = async (req: Request, res: Response) => {
  try {
    console.log("Fetching all ad platform simulations...");
    const simulations = await storage.listAdPlatformSimulations();
    console.log(`Found ${simulations.length} ad simulations`);
    
    // Only seed if no simulations exist
    if (simulations.length === 0) {
      console.log("No ad simulations found, seeding ad platform simulations...");
      await seedAdSimulations();
      // Get the simulations again after seeding
      const seededSimulations = await storage.listAdPlatformSimulations();
      console.log(`Returning ${seededSimulations.length} ad simulations after seeding`);
      return res.json(seededSimulations);
    }
    
    console.log(`Returning ${simulations.length} ad simulations`);
    res.json(simulations);
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
    const simulation = await storage.getAdPlatformSimulation(parseInt(id));
    
    if (!simulation) {
      return res.status(404).json({ error: "Ad simulation not found" });
    }
    
    res.json(simulation);
  } catch (error) {
    console.error("Error fetching ad simulation:", error);
    res.status(500).json({ error: "Failed to fetch ad simulation" });
  }
};

/**
 * Submit an attempt for an ad platform simulation
 */
const submitAdSimulationAttempt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const simulationId = parseInt(id);
    const userId = req.user?.id || 1; // Default to 1 for testing if no user is authenticated
    
    // Fetch the original simulation
    const simulation = await storage.getAdPlatformSimulation(simulationId);
    if (!simulation) {
      return res.status(404).json({ error: "Ad simulation not found" });
    }
    
    // Validate the attempt data
    const attemptData = {
      ...req.body,
      simulationId,
      userId
    };
    
    // Process the attempt with our simulation engine
    const evaluationResult = await evaluateAdSimulationAttempt(simulation, attemptData);
    
    // Save the attempt results
    const savedAttempt = await storage.createAdPlatformSimulationAttempt({
      ...attemptData,
      ...evaluationResult,
      completedAt: new Date()
    });
    
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
    const userId = req.user?.id || 1; // Default to 1 for testing if no user is authenticated
    
    const attempts = await storage.getAdPlatformSimulationAttempts(userId, simulationId);
    res.json(attempts);
  } catch (error) {
    console.error("Error fetching user attempts:", error);
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
};

// Mock evaluation function - this would be replaced with a more sophisticated evaluation engine
async function evaluateAdSimulationAttempt(
  simulation: AdPlatformSimulation, 
  attempt: any
): Promise<{ score: number; feedback: string[]; metrics: Record<string, number> }> {
  // Basic simulation metrics
  const metrics: Record<string, number> = {
    impressions: Math.floor(Math.random() * 10000) + 1000,
    clicks: Math.floor(Math.random() * 1000) + 100,
    conversions: Math.floor(Math.random() * 100) + 10,
    cost: parseFloat((Math.random() * 1000 + 100).toFixed(2))
  };
  
  // Calculate derived metrics
  metrics.ctr = parseFloat(((metrics.clicks / metrics.impressions) * 100).toFixed(2));
  metrics.cpc = parseFloat((metrics.cost / metrics.clicks).toFixed(2));
  metrics.conversionRate = parseFloat(((metrics.conversions / metrics.clicks) * 100).toFixed(2));
  metrics.costPerConversion = parseFloat((metrics.cost / metrics.conversions).toFixed(2));
  
  // Base score calculation
  let score = 0;
  const feedback: string[] = [];
  
  // Evaluate campaign naming (basic check)
  if (attempt.campaignName && attempt.campaignName.length > 0) {
    score += 5;
    if (attempt.campaignName.includes(simulation.industry)) {
      score += 5;
      feedback.push("Good job including the industry in your campaign name for easy identification.");
    } else {
      feedback.push("Consider including the industry in your campaign name for better organization.");
    }
  } else {
    feedback.push("Your campaign needs a descriptive name.");
  }
  
  // Evaluate campaign objective
  if (attempt.campaignObjective) {
    score += 10;
    if (simulation.objectives.some(obj => obj.toLowerCase().includes(attempt.campaignObjective.toLowerCase()))) {
      score += 10;
      feedback.push("Your campaign objective aligns well with the business goals.");
    } else {
      feedback.push("Your campaign objective could be better aligned with the business goals.");
    }
  } else {
    feedback.push("Setting a clear campaign objective is essential for success.");
  }
  
  // Evaluate targeting
  if (attempt.targeting && attempt.targeting.locations && attempt.targeting.locations.length > 0) {
    score += 10;
    
    // Check if locations match those in the simulation
    const targetLocations = simulation.targetAudience.locations || [];
    const matching = attempt.targeting.locations.filter((loc: string) => 
      targetLocations.includes(loc)
    ).length;
    
    if (matching > 0) {
      score += 10 * (matching / targetLocations.length);
      feedback.push("Your location targeting matches the target audience well.");
    } else {
      feedback.push("Your location targeting could be improved to better match the target audience.");
    }
  } else {
    feedback.push("Targeting specific locations is important for campaign efficiency.");
  }
  
  // Evaluate budget based on simulation requirements
  if (attempt.dailyBudget && typeof attempt.dailyBudget === 'number') {
    score += 10;
    
    if (attempt.dailyBudget >= simulation.budget * 0.7 && attempt.dailyBudget <= simulation.budget * 1.3) {
      score += 10;
      feedback.push("Your budget is appropriate for this campaign scenario.");
    } else if (attempt.dailyBudget < simulation.budget * 0.7) {
      feedback.push("Your budget may be too low to achieve the campaign objectives.");
    } else {
      feedback.push("Your budget may be higher than necessary for this campaign.");
    }
  } else {
    feedback.push("Setting an appropriate budget is crucial for campaign success.");
  }
  
  // Evaluate creatives
  if (attempt.creatives && attempt.creatives.length > 0) {
    score += 10;
    
    // Check if at least one creative has all required fields
    const completeCreatives = attempt.creatives.filter((creative: any) => 
      creative.headline && 
      creative.description && 
      creative.destinationUrl
    ).length;
    
    if (completeCreatives > 0) {
      score += 10 * (completeCreatives / attempt.creatives.length);
      feedback.push("Your ad creatives are well-structured and complete.");
    } else {
      feedback.push("Make sure your ad creatives include all necessary elements (headline, description, URL).");
    }
  } else {
    feedback.push("Creating compelling ad content is essential for campaign performance.");
  }
  
  // Platform-specific evaluations
  switch (simulation.platform) {
    case "google_ads":
      if (attempt.platformSpecificSettings?.adExtensions?.length > 0) {
        score += 10;
        feedback.push("Good job utilizing ad extensions for Google Ads.");
      } else {
        feedback.push("Consider adding ad extensions to improve your Google Ads performance.");
      }
      
      // Check if there are negative keywords for Google Ads
      if (attempt.adGroupStructure && attempt.adGroupStructure.some((group: any) => 
        group.targeting?.negativeKeywords?.length > 0
      )) {
        score += 5;
        feedback.push("Using negative keywords demonstrates advanced campaign management.");
      } else {
        feedback.push("Adding negative keywords can help reduce wasted ad spend.");
      }
      break;
      
    case "meta_ads":
      if (attempt.platformSpecificSettings?.placements?.includes("instagram")) {
        score += 5;
        feedback.push("Including Instagram in your Meta Ads placements is a good choice for this audience.");
      }
      
      if (attempt.platformSpecificSettings?.pixelEnabled) {
        score += 10;
        feedback.push("Enabling the Meta Pixel is excellent for tracking and optimization.");
      } else {
        feedback.push("Consider implementing the Meta Pixel for better conversion tracking.");
      }
      break;
      
    case "linkedin_ads":
      if (attempt.targeting?.jobTitles?.length > 0 || 
          attempt.targeting?.jobFunctions?.length > 0 || 
          attempt.targeting?.industries?.length > 0) {
        score += 10;
        feedback.push("Your LinkedIn targeting uses professional attributes effectively.");
      } else {
        feedback.push("LinkedIn Ads perform best when targeting specific professional attributes.");
      }
      
      if (attempt.platformSpecificSettings?.leadGenEnabled && simulation.objectives.some(obj => 
        obj.toLowerCase().includes("lead")
      )) {
        score += 10;
        feedback.push("Using LinkedIn's Lead Gen forms aligns well with your lead generation objective.");
      }
      break;
  }
  
  // Cap score at 100
  score = Math.min(Math.round(score), 100);
  
  return {
    score,
    feedback,
    metrics
  };
}

export const registerAdSimulationRoutes = (app: Express) => {
  app.get("/api/ad-simulations", getAdSimulations);
  app.get("/api/ad-simulations/:id", getAdSimulationById);
  app.post("/api/ad-simulations/:id/attempt", submitAdSimulationAttempt);
  app.get("/api/ad-simulations/:id/attempts", getUserAttempts);
};
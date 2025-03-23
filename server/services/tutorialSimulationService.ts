import { Campaign } from "../../shared/schema";
import { simulationEngine } from "./simulationEngine";
import { storage } from "../storage";

interface SimulationChallenge {
  id: number;
  tutorialId: number;
  title: string;
  description: string;
  objectives: string[];
  initialSetup: Partial<Campaign>;
  successCriteria: {
    metric: string;
    target: number;
    comparison: "greater" | "less" | "equal";
  }[];
  hints: string[];
}

interface SimulationResult {
  userId: number;
  challengeId: number;
  completed: boolean;
  score: number; // 0-100
  feedback: string[];
  metrics: Record<string, number>;
  attempts: number;
  completedAt?: Date;
}

export class TutorialSimulationService {
  private challenges: SimulationChallenge[] = [
    // Chapter 1: Google Ads Fundamentals
    {
      id: 1,
      tutorialId: 1,
      title: "Your First Campaign",
      description: "Create your first Google Ads campaign by setting up the basics correctly.",
      objectives: [
        "Set up a search campaign with appropriate settings",
        "Create at least one ad group",
        "Add relevant keywords for your business"
      ],
      initialSetup: {
        name: "My First Campaign",
        type: "Search",
        status: "Draft",
        budget: 10,
        bidStrategy: "Manual CPC",
        targeting: {
          locations: ["United States"],
          languages: ["English"],
          devices: ["All"],
          schedule: []
        },
        keywords: [],
        headlines: [],
        descriptions: []
      },
      successCriteria: [
        { metric: "qualityScore", target: 6, comparison: "greater" },
        { metric: "keywords", target: 3, comparison: "greater" },
        { metric: "impressions", target: 100, comparison: "greater" }
      ],
      hints: [
        "Make sure to include at least 5 relevant keywords",
        "Create compelling headlines that include your keywords",
        "Your description should have a clear call to action"
      ]
    },
    
    // Chapter 2: Understanding Campaign Types
    {
      id: 2,
      tutorialId: 2,
      title: "Campaign Type Selection",
      description: "Choose the right campaign type for different business objectives.",
      objectives: [
        "Set up a Display campaign for brand awareness",
        "Configure targeting options specific to Display campaigns",
        "Create visually appealing ads"
      ],
      initialSetup: {
        name: "Brand Awareness Campaign",
        type: "Display",
        status: "Draft",
        budget: 15,
        bidStrategy: "Target CPA",
        targeting: {
          locations: ["United States"],
          languages: ["English"],
          devices: ["All"],
          demographics: {
            age: ["18-24", "25-34", "35-44"],
            gender: ["All"]
          },
          interests: [],
          schedule: []
        },
        headlines: [],
        descriptions: []
      },
      successCriteria: [
        { metric: "impressions", target: 1000, comparison: "greater" },
        { metric: "targeting.interests.length", target: 3, comparison: "greater" },
        { metric: "headlines.length", target: 3, comparison: "greater" }
      ],
      hints: [
        "For Display campaigns, visual appeal is crucial",
        "Target at least 3-5 relevant interest categories",
        "Set a higher budget for awareness campaigns to reach more people"
      ]
    },
    
    // Chapter 3: Campaign Strategies & Management
    {
      id: 3,
      tutorialId: 3,
      title: "Advanced Campaign Strategy",
      description: "Implement advanced strategies to improve campaign performance.",
      objectives: [
        "Set up a campaign with conversion tracking",
        "Implement a bidding strategy focused on conversions",
        "Create a structured account with proper ad groups"
      ],
      initialSetup: {
        name: "Conversion-Focused Campaign",
        type: "Search",
        status: "Draft",
        budget: 25,
        bidStrategy: "Target CPA",
        targetCpa: 15,
        targeting: {
          locations: ["United States"],
          languages: ["English"],
          devices: ["All"],
          schedule: []
        },
        conversionTracking: {
          enabled: false,
          conversionActions: []
        },
        keywords: [],
        headlines: [],
        descriptions: []
      },
      successCriteria: [
        { metric: "conversionRate", target: 2, comparison: "greater" },
        { metric: "conversionTracking.enabled", target: 1, comparison: "equal" },
        { metric: "conversionTracking.conversionActions.length", target: 1, comparison: "greater" }
      ],
      hints: [
        "Set up conversion tracking for key actions on your website",
        "Organize keywords into themed ad groups",
        "Set a realistic target CPA based on your business model"
      ]
    },
    
    // Chapter 4: Goal Setting & Audience Targeting
    {
      id: 4,
      tutorialId: 4,
      title: "Audience Targeting Master",
      description: "Create a campaign with precise audience targeting.",
      objectives: [
        "Define detailed audience segments",
        "Set up a remarketing campaign",
        "Create custom audience lists"
      ],
      initialSetup: {
        name: "Precision Targeting Campaign",
        type: "Search",
        status: "Draft",
        budget: 20,
        bidStrategy: "Enhanced CPC",
        targeting: {
          locations: ["United States"],
          languages: ["English"],
          devices: ["All"],
          demographics: {
            age: ["25-34", "35-44"],
            gender: ["All"],
            parentalStatus: ["Parents"],
            householdIncome: ["Top 10%"]
          },
          audiences: [],
          schedule: []
        },
        keywords: [],
        headlines: [],
        descriptions: []
      },
      successCriteria: [
        { metric: "targeting.audiences.length", target: 2, comparison: "greater" },
        { metric: "ctr", target: 2.5, comparison: "greater" },
        { metric: "conversions", target: 5, comparison: "greater" }
      ],
      hints: [
        "Create audience segments based on interests and behaviors",
        "Add remarketing lists for previous visitors to your site",
        "Consider adjusting bids for different audience segments"
      ]
    },
    
    // Chapter 5: Testing & Analytics
    {
      id: 5,
      tutorialId: 5,
      title: "A/B Testing Campaign",
      description: "Create and implement an A/B testing strategy for your ads.",
      objectives: [
        "Set up multiple ad variations for testing",
        "Implement proper measurement for the test",
        "Analyze test results effectively"
      ],
      initialSetup: {
        name: "A/B Testing Campaign",
        type: "Search",
        status: "Draft",
        budget: 30,
        bidStrategy: "Manual CPC",
        targeting: {
          locations: ["United States"],
          languages: ["English"],
          devices: ["All"],
          schedule: []
        },
        abTesting: {
          enabled: false,
          variables: []
        },
        keywords: [],
        headlines: [
          "High-Quality Products",
          "Shop Our Selection"
        ],
        descriptions: [
          "Find what you need at great prices."
        ]
      },
      successCriteria: [
        { metric: "abTesting.enabled", target: 1, comparison: "equal" },
        { metric: "headlines.length", target: 4, comparison: "greater" },
        { metric: "descriptions.length", target: 2, comparison: "greater" }
      ],
      hints: [
        "Create at least 3 variations of headlines to test",
        "Ensure ad variations differ in only one element for proper testing",
        "Set up conversion tracking to measure test success accurately"
      ]
    },
    
    // Chapter 6: Course Summary challenge - comprehensive campaign
    {
      id: 6,
      tutorialId: 6,
      title: "Complete Campaign Creation",
      description: "Create a comprehensive campaign applying all principles learned.",
      objectives: [
        "Create a full-featured campaign with proper structure",
        "Implement advanced targeting and bidding strategies",
        "Set up complete tracking and measurement",
        "Optimize for conversions"
      ],
      initialSetup: {
        name: "Comprehensive Campaign",
        type: "Search",
        status: "Draft",
        budget: 50,
        bidStrategy: "Target ROAS",
        targetRoas: 300,
        targeting: {
          locations: ["United States"],
          languages: ["English"],
          devices: ["All"],
          demographics: {
            age: ["All"],
            gender: ["All"]
          },
          schedule: []
        },
        conversionTracking: {
          enabled: false,
          conversionActions: []
        },
        keywords: [],
        headlines: [],
        descriptions: []
      },
      successCriteria: [
        { metric: "qualityScore", target: 8, comparison: "greater" },
        { metric: "conversionRate", target: 3, comparison: "greater" },
        { metric: "cpa", target: 20, comparison: "less" },
        { metric: "roas", target: 250, comparison: "greater" }
      ],
      hints: [
        "Implement all the best practices you've learned throughout the course",
        "Build a comprehensive account structure with themed ad groups",
        "Create a complete conversion measurement strategy",
        "Optimize your targeting, bidding, and ad creative for maximum performance"
      ]
    }
  ];

  async getChallengeForTutorial(tutorialId: number): Promise<SimulationChallenge | undefined> {
    return this.challenges.find(challenge => challenge.tutorialId === tutorialId);
  }

  async getAllChallenges(): Promise<SimulationChallenge[]> {
    return this.challenges;
  }

  async getUserChallengeResults(userId: number): Promise<SimulationResult[]> {
    // This would typically come from the database
    // For now, we'll simulate with empty results
    return [];
  }

  async evaluateChallenge(
    userId: number, 
    challengeId: number, 
    submission: Campaign
  ): Promise<SimulationResult> {
    const challenge = this.challenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      throw new Error(`Challenge with ID ${challengeId} not found`);
    }
    
    // Run simulation for the campaign
    const simulationData = await simulationEngine.simulateDay(submission, 1);
    
    // Evaluate results against success criteria
    const metrics: Record<string, number> = {
      impressions: simulationData.impressions,
      clicks: simulationData.clicks,
      conversions: simulationData.conversions,
      ctr: simulationData.clicks / simulationData.impressions * 100,
      cpc: simulationData.cost / simulationData.clicks,
      conversionRate: simulationData.conversions / simulationData.clicks * 100,
      cpa: simulationData.cost / simulationData.conversions,
      roas: simulationData.conversionValue / simulationData.cost * 100,
      qualityScore: simulationData.qualityScore,
      averagePosition: parseFloat(simulationData.averagePosition),
    };
    
    // Add campaign-specific metrics
    metrics['keywords'] = submission.keywords?.length || 0;
    metrics['headlines'] = submission.headlines?.length || 0;
    metrics['descriptions'] = submission.descriptions?.length || 0;
    
    if (submission.targeting?.audiences) {
      metrics['targeting.audiences.length'] = submission.targeting.audiences.length;
    }
    
    if (submission.abTesting) {
      metrics['abTesting.enabled'] = submission.abTesting.enabled ? 1 : 0;
      metrics['abTesting.variables'] = submission.abTesting.variables?.length || 0;
    }
    
    if (submission.conversionTracking) {
      metrics['conversionTracking.enabled'] = submission.conversionTracking.enabled ? 1 : 0;
      metrics['conversionTracking.conversionActions.length'] = 
        submission.conversionTracking.conversionActions?.length || 0;
    }
    
    // Check if all success criteria are met
    const criteriaResults = challenge.successCriteria.map(criteria => {
      const actualValue = metrics[criteria.metric] || 0;
      let passed = false;
      
      switch (criteria.comparison) {
        case "greater":
          passed = actualValue > criteria.target;
          break;
        case "less":
          passed = actualValue < criteria.target;
          break;
        case "equal":
          passed = actualValue === criteria.target;
          break;
      }
      
      return {
        metric: criteria.metric,
        target: criteria.target,
        actual: actualValue,
        passed
      };
    });
    
    const allPassed = criteriaResults.every(result => result.passed);
    const passedCount = criteriaResults.filter(result => result.passed).length;
    const score = Math.round((passedCount / criteriaResults.length) * 100);
    
    // Generate feedback
    const feedback: string[] = [];
    
    criteriaResults.forEach(result => {
      if (result.passed) {
        feedback.push(`✓ Success! Your ${result.metric} of ${result.actual} meets the target of ${result.target}.`);
      } else {
        feedback.push(`✗ Your ${result.metric} of ${result.actual} does not meet the target of ${result.target} ${result.metric === 'cpa' ? 'or less' : 'or more'}.`);
        
        // Add a relevant hint from the challenge if available
        const hintIndex = criteriaResults.findIndex(r => !r.passed);
        if (hintIndex >= 0 && challenge.hints[hintIndex]) {
          feedback.push(`Hint: ${challenge.hints[hintIndex]}`);
        }
      }
    });
    
    // Add overall assessment
    if (allPassed) {
      feedback.unshift("🎉 Congratulations! You've successfully completed this challenge!");
    } else if (score >= 70) {
      feedback.unshift("👍 Good effort! You're getting close to mastering this concept.");
    } else {
      feedback.unshift("🔄 Keep working on this challenge. Review the tutorial and try again.");
    }
    
    // Create simulation result
    const result: SimulationResult = {
      userId,
      challengeId,
      completed: allPassed,
      score,
      feedback,
      metrics,
      attempts: 1, // This would be incremented if stored in a database
      completedAt: allPassed ? new Date() : undefined
    };
    
    return result;
  }
}

export const tutorialSimulationService = new TutorialSimulationService();
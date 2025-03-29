import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { db } from '../db';
import { 
  marketingResources, marketingKnowledgeBase, userProfiles, 
  brandPerformanceData, industryBenchmarks, userMarketingKnowledge 
} from '@shared/schema';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const ANTHROPIC_MODEL = "claude-3-7-sonnet-20250219";
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const OPENAI_MODEL = "gpt-4o";

enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

interface AIServiceConfig {
  tier: SubscriptionTier;
  personalizationEnabled: boolean;
  historyRetention: number; // days
  maxContextSize: number;
}

const TIER_CONFIGS: Record<SubscriptionTier, AIServiceConfig> = {
  [SubscriptionTier.FREE]: {
    tier: SubscriptionTier.FREE,
    personalizationEnabled: false,
    historyRetention: 7,
    maxContextSize: 1000,
  },
  [SubscriptionTier.PREMIUM]: {
    tier: SubscriptionTier.PREMIUM,
    personalizationEnabled: true,
    historyRetention: 30,
    maxContextSize: 2000,
  },
  [SubscriptionTier.ENTERPRISE]: {
    tier: SubscriptionTier.ENTERPRISE,
    personalizationEnabled: true,
    historyRetention: 90,
    maxContextSize: 4000,
  }
};

// Define level requirements and skills
const MARKETING_LEVELS = {
  Beginner: {
    requiredXP: 0,
    skills: [
      "Campaign setup basics",
      "Basic audience targeting",
      "Ad platform fundamentals",
      "Basic budget management"
    ],
    challenges: [
      "Create your first campaign",
      "Define target audience persona",
      "Set up conversion tracking"
    ]
  },
  Intermediate: {
    requiredXP: 500,
    skills: [
      "Advanced audience segmentation",
      "A/B testing implementation",
      "Performance analysis",
      "Budget optimization"
    ],
    challenges: [
      "Optimize campaign performance",
      "Analyze competitor strategies",
      "Implement retargeting campaigns"
    ]
  },
  Advanced: {
    requiredXP: 1500,
    skills: [
      "Multi-channel campaign management",
      "Advanced analytics",
      "Marketing automation",
      "ROI optimization"
    ],
    challenges: [
      "Create cross-channel strategy",
      "Implement marketing automation",
      "Optimize ROAS across channels"
    ]
  },
  Expert: {
    requiredXP: 3000,
    skills: [
      "Strategic campaign planning",
      "Advanced conversion optimization",
      "Marketing technology integration",
      "Team leadership"
    ],
    challenges: [
      "Develop comprehensive marketing strategy",
      "Lead team projects",
      "Optimize complex campaigns"
    ]
  },
  Master: {
    requiredXP: 5000,
    skills: [
      "Industry thought leadership",
      "Innovation in marketing strategies",
      "Complex multi-channel orchestration",
      "Strategic business alignment"
    ],
    challenges: [
      "Create industry-leading campaigns",
      "Mentor other marketers",
      "Drive strategic initiatives"
    ]
  },
  Beginner: {
    requiredXP: 100,
    skills: [
      "Campaign setup basics",
      "Keyword research fundamentals",
      "Basic budget management",
      "Understanding of key metrics (CTR, CPC, etc.)"
    ]
  },
  Skilled: {
    requiredXP: 300,
    skills: [
      "Advanced keyword strategies",
      "Audience targeting optimization",
      "A/B testing implementation",
      "Performance analysis",
      "Budget optimization"
    ]
  },
  Innovator: {
    requiredXP: 600,
    skills: [
      "Creative ad strategy development",
      "Advanced audience segmentation",
      "Cross-channel campaign management",
      "Conversion optimization",
      "Marketing automation"
    ]
  },
  Strategist: {
    requiredXP: 1000,
    skills: [
      "Comprehensive marketing strategy",
      "Advanced analytics and insights",
      "Campaign scaling techniques",
      "ROI optimization",
      "Market trend analysis"
    ]
  },
  Expert: {
    requiredXP: 1500,
    skills: [
      "Industry-specific strategy development",
      "Advanced marketing automation",
      "Multi-channel attribution",
      "Predictive analytics",
      "Team leadership and mentoring"
    ]
  },
  Master: {
    requiredXP: 2000,
    skills: [
      "Innovation in marketing strategies",
      "Complex multi-channel orchestration",
      "Marketing technology integration",
      "Industry thought leadership",
      "Strategic business alignment"
    ]
  }
};

interface InsertUserMarketingKnowledge {
    brandName: string;
    industry: string;
    topic: string;
    strategy: string;
    results: string;
    context: string;
    effectiveness: number;
    userId: number;
}

interface UserMarketingKnowledge extends InsertUserMarketingKnowledge {
    id: number;
    isPublic: boolean;
    verifiedByAI: boolean;
}


export class MarketingAI {
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  private geminiKey: string | null = null;
  private userConfig: AIServiceConfig;

  constructor(
    tier: SubscriptionTier = SubscriptionTier.FREE,
    anthropicKey?: string,
    openaiKey?: string,
    geminiKey?: string
  ) {
    this.userConfig = TIER_CONFIGS[tier];

    if (anthropicKey) {
      this.anthropic = new Anthropic({ apiKey: anthropicKey });
    }
    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    }
    if (geminiKey) {
      this.geminiKey = geminiKey;
    }
  }

  async evaluateUserSkills(
    userId: number,
    campaignResults: any[],
    projectCollaborations: any[],
    discussions: any[],
    provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic'
  ) {
    // Get user's current profile
    const [userProfile] = await db.select().from(userProfiles).where({
      userId: userId
    });

    // Get relevant knowledge base entries for assessment
    const knowledgeBase = await db.select().from(marketingKnowledgeBase);

    // Construct context for AI evaluation
    const context = {
      currentLevel: userProfile.level,
      campaignResults: campaignResults,
      projectContributions: projectCollaborations,
      communityEngagement: discussions,
      levelRequirements: MARKETING_LEVELS[userProfile.level as keyof typeof MARKETING_LEVELS],
      nextLevelRequirements: this.getNextLevelRequirements(userProfile.level)
    };

    const evaluation = await this.getAIEvaluation(context, provider);
    return this.processEvaluation(evaluation, userProfile);
  }

  private getNextLevelRequirements(currentLevel: string) {
    const levels = Object.keys(MARKETING_LEVELS);
    const currentIndex = levels.indexOf(currentLevel);
    if (currentIndex < levels.length - 1) {
      return MARKETING_LEVELS[levels[currentIndex + 1] as keyof typeof MARKETING_LEVELS];
    }
    return null;
  }

  private async getAIEvaluation(context: any, provider: 'anthropic' | 'openai' | 'gemini') {
    const prompt = `As a marketing expert, evaluate this user's skill level and progress:

    Current Level: ${context.currentLevel}
    Required Skills for Current Level:
    ${context.levelRequirements.skills.join('\n')}

    Campaign Performance:
    ${JSON.stringify(context.campaignResults, null, 2)}

    Project Contributions:
    ${JSON.stringify(context.projectContributions, null, 2)}

    Community Engagement:
    ${JSON.stringify(context.communityEngagement, null, 2)}

    Evaluate and provide:
    1. Mastery of current level skills (0-100%)
    2. Readiness for next level (true/false)
    3. Specific areas of strength
    4. Areas for improvement
    5. Recommended learning focus

    Format response as JSON.`;

    switch (provider) {
      case 'anthropic':
        return this.getAnthropicEvaluation(prompt);
      case 'openai':
        return this.getOpenAIEvaluation(prompt);
      case 'gemini':
        return this.getGeminiEvaluation(prompt);
      default:
        throw new Error('Unsupported AI provider');
    }
  }

  private async getAnthropicEvaluation(prompt: string) {
    if (!this.anthropic) throw new Error('Anthropic not configured');

    const response = await this.anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return JSON.parse(response.content[0].text);
  }

  private async getOpenAIEvaluation(prompt: string) {
    if (!this.openai) throw new Error('OpenAI not configured');

    const response = await this.openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [{
        role: 'system',
        content: 'You are an expert marketing skills evaluator.'
      }, {
        role: 'user',
        content: prompt
      }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }

  private async getGeminiEvaluation(prompt: string) {
    if (!this.geminiKey) throw new Error('Gemini not configured');
    
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
    const response = await fetch(`${url}?key=${this.geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert marketing skills evaluator. ${prompt}
            Respond only with JSON.`
          }]
        }]
      })
    });
    
    const data = await response.json();
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }
    
    const content = data.candidates[0].content.parts[0].text;
    // Extract valid JSON from the response, in case there's any extra text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract valid JSON from Gemini response');
    }

    return JSON.parse(jsonMatch[0]);
  }

  private async processEvaluation(evaluation: any, userProfile: any) {
    const currentLevel = userProfile.level;
    const currentLevelRequirements = MARKETING_LEVELS[currentLevel as keyof typeof MARKETING_LEVELS];

    // Calculate XP gain based on evaluation
    const xpGain = Math.floor(evaluation.currentLevelMastery * 10);
    const newXP = userProfile.experiencePoints + xpGain;

    // Check for level up conditions
    const shouldLevelUp = evaluation.readyForNextLevel &&
                         newXP >= currentLevelRequirements.requiredXP;

    // Update user profile
    if (shouldLevelUp) {
      const nextLevel = this.getNextLevelName(currentLevel);
      if (nextLevel) {
        await db
          .update(userProfiles)
          .set({
            level: nextLevel,
            experiencePoints: newXP,
            updatedAt: new Date().toISOString()
          })
          .where({ id: userProfile.id });
      }
    } else {
      await db
        .update(userProfiles)
        .set({
          experiencePoints: newXP,
          updatedAt: new Date().toISOString()
        })
        .where({ id: userProfile.id });
    }

    return {
      levelUp: shouldLevelUp,
      newLevel: shouldLevelUp ? this.getNextLevelName(currentLevel) : currentLevel,
      xpGained: xpGain,
      totalXP: newXP,
      evaluation: evaluation
    };
  }

  private getNextLevelName(currentLevel: string): string | null {
    const levels = Object.keys(MARKETING_LEVELS);
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  }

  async getMarketingAdvice(
    campaignContext: any,
    userProfile?: any,
    brandContext?: {
      brandName: string;
      industry: string;
    }
  ): Promise<string> {
    if (this.userConfig.personalizationEnabled && userProfile) {
      return this.getPersonalizedAdvice(campaignContext, userProfile, brandContext);
    } else {
      return this.getGeneralAdvice(campaignContext);
    }
  }

  private async getGeneralAdvice(campaignContext: any): Promise<string> {
    // Get general marketing knowledge and best practices
    const [knowledge, resources] = await Promise.all([
      db.select().from(marketingKnowledgeBase)
        .where({ topic: campaignContext.type })
        .orderBy('effectiveness', 'desc')
        .limit(5),
      db.select().from(marketingResources)
        .where({ category: 'best_practices' })
    ]);

    const context = `
Campaign Context:
- Type: ${campaignContext.type}
- Platform: ${campaignContext.platform}
- Goal: ${campaignContext.goal}
- Budget: ${campaignContext.dailyBudget}

General Best Practices:
${knowledge.map(k => `- ${k.recommendation}`).join('\n')}

Marketing Resources:
${resources.map(r => `- ${r.title}: ${r.content}`).join('\n')}

Provide recommendations focusing on:
1. Basic campaign setup
2. Standard best practices
3. Common optimization strategies
4. Key metrics to monitor
5. Risk mitigation
`;

    const response = await this.getAIProvider().messages.create({
      model: this.getModelName(),
      max_tokens: this.userConfig.maxContextSize,
      messages: [{
        role: 'system',
        content: 'You are a marketing advisor providing general guidance based on industry best practices.'
      }, {
        role: 'user',
        content: context
      }]
    });

    return response.content[0].text;
  }

  async getPersonalizedAdvice(
    campaignContext: any,
    userProfile: any,
    brandContext?: {
      brandName: string;
      industry: string;
    }
  ): Promise<string> {
    // Get all relevant knowledge sources
    const [
      generalKnowledge,
      industryKnowledge,
      brandKnowledge,
      benchmarks,
      userContributions
    ] = await Promise.all([
      db.select().from(marketingKnowledgeBase)
        .where({ topic: campaignContext.type })
        .orderBy('effectiveness', 'desc')
        .limit(5),
      db.select().from(marketingKnowledgeBase)
        .where({ 
          topic: campaignContext.type,
          industry: brandContext?.industry 
        })
        .orderBy('effectiveness', 'desc')
        .limit(5),
      brandContext ? db.select().from(brandPerformanceData)
        .where({ 
          brandName: brandContext.brandName,
          platform: campaignContext.platform 
        })
        .limit(5) : Promise.resolve([]),
      brandContext ? db.select().from(industryBenchmarks)
        .where({ 
          industry: brandContext.industry,
          platform: campaignContext.platform 
        }) : Promise.resolve([]),
      db.select().from(userMarketingKnowledge)
        .where({ 
          industry: brandContext?.industry,
          isPublic: true,
          verifiedByAI: true 
        })
        .orderBy('effectiveness', 'desc')
        .limit(5)
    ]);

    const enhancedContext = `
Campaign Context:
- Type: ${campaignContext.type}
- Platform: ${campaignContext.platform}
- Goal: ${campaignContext.goal}
- Budget: ${campaignContext.dailyBudget}

${brandContext ? `
Brand Context:
- Brand: ${brandContext.brandName}
- Industry: ${brandContext.industry}
- Historical Performance: ${JSON.stringify(brandKnowledge, null, 2)}
- Industry Benchmarks: ${JSON.stringify(benchmarks, null, 2)}
` : ''}

User Context:
- Current Level: ${userProfile.level}
- Required Skills: ${MARKETING_LEVELS[userProfile.level as keyof typeof MARKETING_LEVELS].skills.join(', ')}

General Best Practices:
${generalKnowledge.map(k => `- ${k.recommendation}`).join('\n')}

Industry-Specific Knowledge:
${industryKnowledge.map(k => `- ${k.recommendation}`).join('\n')}

Community Insights:
${userContributions.map(k => `- ${k.strategy} (Effectiveness: ${k.effectiveness}%)`).join('\n')}

Provide personalized recommendations considering:
1. User's current skill level and learning path
2. Brand-specific historical performance (if available)
3. Industry benchmarks and standards
4. Community-validated strategies
5. Step-by-step implementation guide
`;

    const response = await this.getAIProvider().messages.create({
      model: this.getModelName(),
      max_tokens: 2000,
      messages: [{
        role: 'system',
        content: 'You are an expert marketing mentor providing personalized guidance based on comprehensive market knowledge.'
      }, {
        role: 'user',
        content: enhancedContext
      }]
    });

    return response.content[0].text;
  }

  async learnFromCampaignResults(campaignResults: any, feedback: any) {
    // Extract insights from successful and failed campaigns
    const insights = await this.extractCampaignInsights(campaignResults, feedback);

    // Store new knowledge in the database
    await db.insert(marketingKnowledgeBase).values({
      topic: campaignResults.type,
      context: JSON.stringify(campaignResults),
      recommendation: insights.recommendations,
      source: 'campaign_analysis',
      effectiveness: insights.effectiveness,
      createdAt: new Date().toISOString()
    });
  }

  private async extractCampaignInsights(campaignResults: any, feedback: any) {
    const prompt = `As a marketing expert, analyze this campaign's results and feedback:

  Campaign Details:
  ${JSON.stringify(campaignResults, null, 2)}

  User Feedback:
  ${JSON.stringify(feedback, null, 2)}

  Provide:
  1. Key success/failure factors
  2. Specific recommendations for improvement
  3. Effectiveness score (0-100)
  4. Industry benchmarks comparison
  5. Learning points for future campaigns

  Format response as JSON.`;

    const insights = await this.getAIProvider().messages.create({
      model: this.getModelName(),
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return JSON.parse(insights.content[0].text);
  }

  // Add method to get appropriate AI provider based on configuration
  private getAIProvider(preferredProvider?: 'anthropic' | 'openai' | 'gemini') {
    if (preferredProvider === 'anthropic' && this.anthropic) return this.anthropic;
    if (preferredProvider === 'openai' && this.openai) return this.openai;
    if (preferredProvider === 'gemini' && this.geminiKey) {
      throw new Error('Use getGeminiEvaluation for Gemini API calls');
    }
    
    // If no preferred provider or the preferred one isn't available,
    // use the first available
    if (this.anthropic) return this.anthropic;
    if (this.openai) return this.openai;
    throw new Error('No AI provider configured');
  }

  private getModelName(preferredProvider?: 'anthropic' | 'openai' | 'gemini') {
    if (preferredProvider === 'anthropic' && this.anthropic) return ANTHROPIC_MODEL;
    if (preferredProvider === 'openai' && this.openai) return OPENAI_MODEL;
    if (preferredProvider === 'gemini' && this.geminiKey) return 'gemini-1.5-pro';
    
    // If no preferred provider or the preferred one isn't available,
    // use the first available model
    if (this.anthropic) return ANTHROPIC_MODEL;
    if (this.openai) return OPENAI_MODEL;
    throw new Error('No AI model available');
  }


  async validateUserKnowledge(knowledge: InsertUserMarketingKnowledge): Promise<{
    isValid: boolean;
    confidence: number;
    suggestions: string[];
  }> {
    const prompt = `As a marketing expert, validate this user-contributed marketing knowledge:

    Brand: ${knowledge.brandName}
    Industry: ${knowledge.industry}
    Topic: ${knowledge.topic}
    Strategy: ${knowledge.strategy}
    Results: ${knowledge.results}

    Evaluate:
    1. Is this knowledge valid and useful for the specified industry?
    2. How confident are you in this assessment (0-100)?
    3. What suggestions would you make to improve this knowledge?

    Format response as JSON with keys: isValid (boolean), confidence (number), suggestions (array of strings)`;

    const response = await this.getAIProvider().messages.create({
      model: this.getModelName(),
      max_tokens: 1000,
      messages: [{
        role: 'system',
        content: 'You are an expert marketing knowledge validator.'
      }, {
        role: 'user',
        content: prompt
      }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.content[0].text);
  }

  async submitUserKnowledge(knowledge: InsertUserMarketingKnowledge): Promise<boolean> {
    if (!this.userConfig.personalizationEnabled) {
      throw new Error('Knowledge contribution is only available for premium users');
    }

    const validation = await this.validateUserKnowledge(knowledge);

    if (validation.isValid && validation.confidence > 70) {
      await db.insert(userMarketingKnowledge).values({
        ...knowledge,
        isPublic: true,
        verifiedByAI: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Also add to the main knowledge base if highly effective
      if (knowledge.effectiveness > 80) {
        await this.learnFromUserContributions([{
          ...knowledge,
          id: 0, // Temporary ID for the interface
          isPublic: true,
          verifiedByAI: true
        }]);
      }

      return true;
    }

    return false;
  }
  async learnFromUserContributions(contributions: UserMarketingKnowledge[]): Promise<void> {
    for (const contribution of contributions) {
      const validation = await this.validateUserKnowledge(contribution);

      if (validation.isValid && validation.confidence > 70) {
        // Add validated knowledge to the main knowledge base
        await db.insert(marketingKnowledgeBase).values({
          topic: contribution.topic,
          context: contribution.context,
          recommendation: contribution.strategy,
          source: `user_contribution_${contribution.userId}`,
          effectiveness: contribution.effectiveness,
          createdAt: new Date().toISOString()
        });

        // Update the user contribution status
        await db
          .update(userMarketingKnowledge)
          .set({ verifiedByAI: true })
          .where({ id: contribution.id });
      }
    }
  }
}

// Create instances for different subscription tiers
export const freeMarketingAI = new MarketingAI(SubscriptionTier.FREE);
export const premiumMarketingAI = new MarketingAI(SubscriptionTier.PREMIUM);
export const enterpriseMarketingAI = new MarketingAI(SubscriptionTier.ENTERPRISE);
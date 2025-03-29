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
    
    // If no premium models are available, use the free model
    return "gpt-3.5-turbo"; // Fallback to free model
  }
  
  /**
   * Tests if a specific AI provider is working correctly with the given API key
   * 
   * @param provider The AI provider to test ('anthropic', 'openai', or 'gemini')
   * @returns Object with working status and message
   */
  async testProvider(provider: 'anthropic' | 'openai' | 'gemini'): Promise<{working: boolean, message: string}> {
    try {
      const prompt = 'Return the text "API_KEY_WORKING" if you can read this message.';
      
      switch (provider) {
        case 'anthropic':
          if (!this.anthropic) throw new Error('Anthropic not configured');
          const anthropicResponse = await this.anthropic.messages.create({
            model: ANTHROPIC_MODEL,
            max_tokens: 100,
            messages: [{
              role: 'user',
              content: prompt
            }]
          });
          
          const anthropicText = anthropicResponse.content[0].text;
          return {
            working: anthropicText.includes('API_KEY_WORKING'),
            message: 'Anthropic API key is working correctly!'
          };
          
        case 'openai':
          if (!this.openai) throw new Error('OpenAI not configured');
          const openaiResponse = await this.openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: [{
              role: 'user',
              content: prompt
            }]
          });
          
          const openaiText = openaiResponse.choices[0].message.content;
          return {
            working: openaiText?.includes('API_KEY_WORKING') || false,
            message: 'OpenAI API key is working correctly!'
          };
          
        case 'gemini':
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
                  text: prompt
                }]
              }]
            })
          });
          
          const data = await response.json();
          if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from Gemini API');
          }
          
          const geminiText = data.candidates[0].content.parts[0].text;
          return {
            working: geminiText.includes('API_KEY_WORKING'),
            message: 'Gemini API key is working correctly!'
          };
          
        default:
          throw new Error('Unsupported AI provider');
      }
    } catch (error) {
      // Handle specific error types and return appropriate messages
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Common API key errors to detect
      if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('invalid api key')) {
        return {
          working: false,
          message: `Invalid ${provider} API key. Please check your key and try again.`
        };
      } else if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
        return {
          working: false,
          message: `Your ${provider} API key doesn't have permission to access the required model.`
        };
      } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        return {
          working: false,
          message: `Rate limit exceeded for your ${provider} API key. Please try again later.`
        };
      }
      
      // Default error response
      return {
        working: false,
        message: `Error testing ${provider} API key: ${errorMessage}`
      };
    }
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

  /**
   * Analyze campaign performance data to provide insights
   * This method uses AI to evaluate the effectiveness of a campaign based on simulation data
   * 
   * @param simulationData The data from campaign simulation
   * @param provider Optional AI provider to use for analysis
   * @returns Performance analysis with insights and recommendations
   */
  async analyzeCampaignPerformance(simulationData: any, provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic') {
    // Prepare the analysis prompt
    const prompt = `As a marketing expert, analyze this campaign performance data:
    
    Campaign Performance Data:
    ${JSON.stringify(simulationData, null, 2)}
    
    Provide detailed analysis including:
    1. Overall performance assessment
    2. Strengths and weaknesses
    3. Key metrics evaluation (CTR, CPC, conversion rate, etc.)
    4. Cost efficiency analysis
    5. Quality score breakdown
    
    Format response as JSON with the following structure:
    {
      "overallRating": number (1-10),
      "strengths": string[],
      "weaknesses": string[],
      "keyMetricsAnalysis": {
        "impressions": string,
        "clicks": string,
        "conversions": string,
        "ctr": string,
        "cpc": string,
        "conversionRate": string,
        "roi": string
      },
      "actionableInsights": string[],
      "summary": string
    }`;
    
    // Get analysis from the specified AI provider
    switch (provider) {
      case 'anthropic':
        if (!this.anthropic) throw new Error('Anthropic not configured');
        const anthropicResponse = await this.anthropic.messages.create({
          model: ANTHROPIC_MODEL,
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: prompt
          }],
          response_format: { type: "json_object" }
        });
        return JSON.parse(anthropicResponse.content[0].text);
        
      case 'openai':
        if (!this.openai) throw new Error('OpenAI not configured');
        const openaiResponse = await this.openai.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [{
            role: 'system',
            content: 'You are an expert marketing campaign analyzer.'
          }, {
            role: 'user',
            content: prompt
          }],
          response_format: { type: "json_object" }
        });
        return JSON.parse(openaiResponse.choices[0].message.content);
        
      case 'gemini':
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
                text: `You are an expert marketing campaign analyzer. ${prompt}
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
        // Extract valid JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Could not extract valid JSON from Gemini response');
        }
        
        return JSON.parse(jsonMatch[0]);
        
      default:
        throw new Error('Unsupported AI provider');
    }
  }
  
  /**
   * Generate actionable recommendations to improve campaign performance
   * 
   * @param campaign The campaign configuration
   * @param simulationData Performance data from simulations
   * @param provider Optional AI provider to use for recommendations
   * @returns Optimization suggestions with actionable steps
   */
  async generateOptimizationSuggestions(campaign: any, simulationData: any, provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic') {
    // Prepare industry benchmarks and best practices
    const [benchmarks, bestPractices] = await Promise.all([
      db.select().from(industryBenchmarks)
        .where(eq => eq('industry', campaign.industry))
        .limit(3),
      db.select().from(marketingKnowledgeBase)
        .where(eq => eq('topic', campaign.type))
        .orderBy(eq => eq('effectiveness', 'desc'))
        .limit(5)
    ]);
    
    // Prepare the optimization prompt
    const prompt = `As a marketing optimization expert, analyze this campaign and its performance data:
    
    Campaign Configuration:
    ${JSON.stringify(campaign, null, 2)}
    
    Performance Data:
    ${JSON.stringify(simulationData, null, 2)}
    
    Industry Benchmarks:
    ${JSON.stringify(benchmarks, null, 2)}
    
    Best Practices:
    ${JSON.stringify(bestPractices, null, 2)}
    
    Provide optimization recommendations with:
    1. Specific actionable changes to campaign settings
    2. Budget allocation suggestions
    3. Targeting improvements
    4. Creative optimizations
    5. Bidding strategy adjustments
    6. A/B testing recommendations
    
    Format response as JSON with the following structure:
    {
      "prioritizedRecommendations": [
        {
          "category": string (e.g., "Targeting", "Budget", "Creative", "Bidding"),
          "action": string,
          "expectedImpact": string,
          "difficultyToImplement": string,
          "timeFrame": string
        }
      ],
      "budgetRecommendations": {
        "optimal": number,
        "allocation": object
      },
      "testingIdeas": string[],
      "longTermStrategy": string
    }`;
    
    // Get recommendations from the specified AI provider
    switch (provider) {
      case 'anthropic':
        if (!this.anthropic) throw new Error('Anthropic not configured');
        const anthropicResponse = await this.anthropic.messages.create({
          model: ANTHROPIC_MODEL,
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: prompt
          }],
          response_format: { type: "json_object" }
        });
        return JSON.parse(anthropicResponse.content[0].text);
        
      case 'openai':
        if (!this.openai) throw new Error('OpenAI not configured');
        const openaiResponse = await this.openai.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [{
            role: 'system',
            content: 'You are an expert marketing campaign optimizer.'
          }, {
            role: 'user',
            content: prompt
          }],
          response_format: { type: "json_object" }
        });
        return JSON.parse(openaiResponse.choices[0].message.content);
        
      case 'gemini':
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
                text: `You are an expert marketing campaign optimizer. ${prompt}
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
        // Extract valid JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Could not extract valid JSON from Gemini response');
        }
        
        return JSON.parse(jsonMatch[0]);
        
      default:
        throw new Error('Unsupported AI provider');
    }
  }
}

// Helper function to safely initialize system API keys from environment variables
// These are used for the free tier only
function getSystemApiKeys() {
  // We only need one of these keys for the free tier
  // Prioritize using Anthropic, then OpenAI, then Gemini
  const anthropicKey = process.env.ANTHROPIC_API_KEY || null;
  const openaiKey = process.env.OPENAI_API_KEY || null;
  const geminiKey = process.env.GOOGLE_AI_API_KEY || null;
  
  return { anthropicKey, openaiKey, geminiKey };
}

// Create a basic instance for the free tier
// Uses system API keys if available, otherwise falls back to default free models
const { anthropicKey, openaiKey, geminiKey } = getSystemApiKeys();

// This instance is used for free tier users
// It will use a system API key if available, or fallback to free models
export const freeMarketingAI = new MarketingAI(
  SubscriptionTier.FREE,
  anthropicKey,
  openaiKey,
  geminiKey
);

// For premium tiers, we don't initialize with API keys
// Instead we'll create user-specific instances with their own API keys
export const premiumMarketingAI = new MarketingAI(
  SubscriptionTier.PREMIUM
);

export const enterpriseMarketingAI = new MarketingAI(
  SubscriptionTier.ENTERPRISE
);

// Create a user-specific instance of MarketingAI based on their stored API settings
export async function getUserMarketingAI(username: string, tier: SubscriptionTier): Promise<MarketingAI> {
  if (tier === SubscriptionTier.FREE) {
    // Free tier users share the system instance
    return freeMarketingAI;
  }
  
  // For premium tiers, get the user's API settings
  try {
    const storage = new Storage();
    const userSettings = await storage.getUserApiSettings(username);
    
    if (userSettings) {
      // Create a new instance with the user's keys
      return new MarketingAI(
        tier,
        userSettings.anthropicApiKey || null,
        userSettings.openaiApiKey || null,
        userSettings.geminiApiKey || null
      );
    }
  } catch (error) {
    console.error(`Error getting API settings for user ${username}:`, error);
  }
  
  // If no user settings found or error occurred, return the appropriate tier instance
  // without API keys (will use free models only)
  return tier === SubscriptionTier.PREMIUM ? premiumMarketingAI : enterpriseMarketingAI;
}
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { db } from '../db';
import { marketingResources, marketingKnowledgeBase, userProfiles } from '@shared/schema';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const ANTHROPIC_MODEL = "claude-3-7-sonnet-20250219";
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const OPENAI_MODEL = "gpt-4o";

// Define level requirements and skills
const MARKETING_LEVELS = {
  Newborn: {
    requiredXP: 0,
    skills: [
      "Basic understanding of digital marketing concepts",
      "Familiarity with ad platforms",
      "Understanding of target audience"
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

export class MarketingAI {
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  private geminiKey: string | null = null;

  constructor(
    anthropicKey?: string,
    openaiKey?: string,
    geminiKey?: string
  ) {
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
    throw new Error('Gemini integration coming soon');
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
    provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic'
  ) {
    // Get relevant knowledge base entries
    const relevantKnowledge = await db.select().from(marketingKnowledgeBase).where({
      topic: campaignContext.type
    });

    // Get relevant marketing resources
    const resources = await db.select().from(marketingResources).where({
      category: 'best_practices'
    });

    // Construct context from knowledge base
    const context = `
    Campaign Context:
    - Type: ${campaignContext.type}
    - Platform: ${campaignContext.platform}
    - Goal: ${campaignContext.goal}
    - Budget: ${campaignContext.dailyBudget}

    Relevant Marketing Knowledge:
    ${relevantKnowledge.map(k => `- ${k.recommendation}`).join('\n')}

    Best Practices:
    ${resources.map(r => `- ${r.title}: ${r.content}`).join('\n')}
    `;

    switch (provider) {
      case 'anthropic':
        return this.getAnthropicAdvice(context);
      case 'openai':
        return this.getOpenAIAdvice(context);
      case 'gemini':
        return this.getGeminiAdvice(context);
      default:
        throw new Error('Unsupported AI provider');
    }
  }

  private async getAnthropicAdvice(context: string) {
    if (!this.anthropic) throw new Error('Anthropic not configured');

    const response = await this.anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `As a marketing expert, analyze this campaign and provide specific recommendations for improvement:

        ${context}

        Provide advice in the following areas:
        1. Targeting Optimization
        2. Ad Copy Improvements
        3. Budget Allocation
        4. Performance Metrics to Monitor
        `
      }]
    });

    return response.content[0].text;
  }

  private async getOpenAIAdvice(context: string) {
    if (!this.openai) throw new Error('OpenAI not configured');

    const response = await this.openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [{
        role: 'system',
        content: 'You are an expert digital marketing consultant with deep knowledge of online advertising platforms.'
      }, {
        role: 'user',
        content: `Analyze this campaign and provide specific recommendations:

        ${context}

        Focus on:
        1. Targeting Optimization
        2. Ad Copy Improvements
        3. Budget Allocation
        4. Performance Metrics to Monitor
        `
      }],
      response_format: { type: "json_object" }
    });

    return response.choices[0].message.content;
  }

  private async getGeminiAdvice(context: string) {
    // Implement Gemini API integration when available
    throw new Error('Gemini integration coming soon');
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
  private getAIProvider() {
    if (this.anthropic) return this.anthropic;
    if (this.openai) return this.openai;
    throw new Error('No AI provider configured');
  }

  private getModelName() {
    if (this.anthropic) return ANTHROPIC_MODEL;
    if (this.openai) return OPENAI_MODEL;
    throw new Error('No AI model available');
  }

  async getEnhancedMarketingAdvice(campaignContext: any, userProfile: any, provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic') {
    // Get relevant knowledge and resources
    const [relevantKnowledge, resources, userLevel] = await Promise.all([
      db.select().from(marketingKnowledgeBase)
        .where({ topic: campaignContext.type })
        .orderBy('effectiveness', 'desc')
        .limit(5),
      db.select().from(marketingResources)
        .where({ category: 'best_practices' }),
      db.select().from(userProfiles)
        .where({ id: userProfile.id })
    ]);

    // Construct enhanced context with user's level and past learnings
    const enhancedContext = `
  Campaign Context:
  - Type: ${campaignContext.type}
  - Platform: ${campaignContext.platform}
  - Goal: ${campaignContext.goal}
  - Budget: ${campaignContext.dailyBudget}

  User Context:
  - Current Level: ${userLevel.level}
  - Required Skills: ${MARKETING_LEVELS[userLevel.level as keyof typeof MARKETING_LEVELS].skills.join(', ')}

  Top Performing Strategies:
  ${relevantKnowledge.map(k => `- ${k.recommendation} (Effectiveness: ${k.effectiveness}%)`).join('\n')}

  Best Practices:
  ${resources.map(r => `- ${r.title}: ${r.content}`).join('\n')}

  Provide personalized recommendations considering:
  1. User's current skill level and learning path
  2. Past successful strategies
  3. Platform-specific optimizations
  4. Budget allocation based on proven patterns
  5. Step-by-step implementation guide
  `;

    const advice = await this.getAIProvider().messages.create({
      model: this.getModelName(),
      max_tokens: 2000,
      messages: [{
        role: 'system',
        content: 'You are an expert marketing mentor, providing personalized guidance based on the user\'s skill level and learning goals.'
      }, {
        role: 'user',
        content: enhancedContext
      }]
    });

    return advice.content[0].text;
  }
}

export const marketingAI = new MarketingAI();
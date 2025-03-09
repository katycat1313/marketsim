import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { db } from '../db';
import { marketingResources, marketingKnowledgeBase } from '@shared/schema';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const ANTHROPIC_MODEL = "claude-3-7-sonnet-20250219";
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const OPENAI_MODEL = "gpt-4o";

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
}

export const marketingAI = new MarketingAI();

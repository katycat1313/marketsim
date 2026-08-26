import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { db } from '../db';
import { userProfiles, marketingKnowledgeBase, industryBenchmarks } from '@shared/schema';
import { marketingKnowledgeBase as knowledgeBaseData, industryBenchmarks as benchmarkData } from '../data/marketingKnowledgeBase';
import { dynamicSimulationGenerator } from './dynamicSimulationGenerator';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const ANTHROPIC_MODEL = "claude-3-7-sonnet-20250219";
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const OPENAI_MODEL = "gpt-4o";

interface AIApiConfig {
  anthropicKey?: string;
  openaiKey?: string;
  geminiKey?: string;
}

/**
 * Class that provides advanced AI capabilities for the marketing platform
 * Including simulation feedback, content analysis, and strategic recommendations
 */
export class AICapabilities {
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  private geminiKey: string | null = null;
  
  constructor(config?: AIApiConfig) {
    if (config?.anthropicKey) {
      this.anthropic = new Anthropic({ apiKey: config.anthropicKey });
    } else if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
    
    if (config?.openaiKey) {
      this.openai = new OpenAI({ apiKey: config.openaiKey });
    } else if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    
    if (config?.geminiKey) {
      this.geminiKey = config.geminiKey;
    } else if (process.env.GOOGLE_AI_API_KEY) {
      this.geminiKey = process.env.GOOGLE_AI_API_KEY;
    }
  }
  
  /**
   * Provides detailed feedback on simulation results
   */
  async simulationFeedback(
    simulationType: 'seo' | 'adPlatform' | 'abTest' | 'dataVisualization',
    simulationData: any,
    userProfile: any,
    provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic'
  ) {
    const prompt = this.buildSimulationFeedbackPrompt(simulationType, simulationData, userProfile);
    
    let response;
    switch (provider) {
      case 'anthropic':
        if (!this.anthropic) throw new Error('Anthropic not configured');
        response = await this.anthropic.messages.create({
          model: ANTHROPIC_MODEL,
          max_tokens: 1500,
          messages: [{
            role: 'user' as const,
            content: prompt
          }]
        });
        const responseText = response.content[0] && 'text' in response.content[0] ? response.content[0].text : "";
        return this.parseAIResponse(responseText);
        
      case 'openai':
        if (!this.openai) throw new Error('OpenAI not configured');
        response = await this.openai.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [{
            role: 'system' as const,
            content: 'You are a marketing expert providing detailed feedback on marketing simulations.'
          }, {
            role: 'user' as const,
            content: prompt
          }],
          response_format: { type: "json_object" }
        });
        return JSON.parse(response.choices[0].message.content || "{}");
        
      case 'gemini':
        if (!this.geminiKey) throw new Error('Gemini not configured');
        // Implementation for Gemini API
        return this.getGeminiFeedback(prompt);
        
      default:
        throw new Error('Unsupported AI provider');
    }
  }
  
  /**
   * Build the simulation feedback prompt based on the type of simulation
   */
  private buildSimulationFeedbackPrompt(simulationType: string, simulationData: any, userProfile: any): string {
    let prompt = "";
    
    // Base context about the user
    const userContext = `
    User Profile:
    - Experience Level: ${userProfile.level}
    - Learning Focus: ${userProfile.learningFocus || 'General marketing'}
    `;
    
    switch (simulationType) {
      case 'seo':
        prompt = `
        ${userContext}
        
        SEO Simulation Attempt Analysis:
        
        Original Content:
        ${simulationData.originalContent}
        
        User's Optimized Content:
        ${simulationData.optimizedContent}
        
        Target Keywords:
        ${simulationData.targetKeywords.join(', ')}
        
        Task Requirements:
        ${JSON.stringify(simulationData.requirements)}
        
        Please provide detailed feedback on this SEO optimization attempt with:
        1. Overall assessment (0-100 score)
        2. What was done well (at least 3 points)
        3. Areas for improvement (at least 3 specific recommendations)
        4. SEO best practices that were followed or missed
        5. Impact on search ranking (estimated)
        6. Next steps for further optimization
        
        Format your response as JSON with these sections.
        `;
        break;
        
      case 'adPlatform':
        prompt = `
        ${userContext}
        
        Ad Platform Simulation Analysis:
        
        Platform: ${simulationData.platform}
        Campaign Objective: ${simulationData.objective}
        Budget Allocation: ${simulationData.budget}
        Targeting Strategy: ${JSON.stringify(simulationData.targeting)}
        Ad Creative: ${JSON.stringify(simulationData.creative)}
        Bid Strategy: ${simulationData.bidStrategy}
        
        Expected Campaign Performance:
        ${JSON.stringify(simulationData.expectedPerformance)}
        
        Please provide detailed feedback on this ad campaign simulation with:
        1. Overall campaign strategy assessment (0-100 score)
        2. Targeting effectiveness analysis
        3. Creative quality assessment
        4. Budget optimization recommendations
        5. Expected performance vs. industry benchmarks
        6. Specific recommendations for improvement
        7. A/B testing suggestions
        
        Format your response as JSON with these sections.
        `;
        break;
        
      case 'abTest':
        prompt = `
        ${userContext}
        
        A/B Test Simulation Analysis:
        
        Test Hypothesis: ${simulationData.hypothesis}
        Variables Tested: ${JSON.stringify(simulationData.variables)}
        Control Version: ${JSON.stringify(simulationData.control)}
        Test Version: ${JSON.stringify(simulationData.variant)}
        Test Duration: ${simulationData.duration}
        Sample Size: ${simulationData.sampleSize}
        Results: ${JSON.stringify(simulationData.results)}
        
        Please provide detailed feedback on this A/B test with:
        1. Overall test design quality (0-100 score)
        2. Statistical significance assessment
        3. Hypothesis validation analysis
        4. Test methodology strengths and weaknesses
        5. Results interpretation
        6. Actionable insights from the test
        7. Recommendations for follow-up testing
        
        Format your response as JSON with these sections.
        `;
        break;
        
      case 'dataVisualization':
        prompt = `
        ${userContext}
        
        Data Visualization Analysis:
        
        Data Set: ${simulationData.dataSetName}
        Visualization Type: ${simulationData.visualizationType}
        Metrics Included: ${JSON.stringify(simulationData.metrics)}
        User's Analysis: ${simulationData.userAnalysis}
        
        Please provide detailed feedback on this data visualization and analysis with:
        1. Overall analysis quality (0-100 score)
        2. Visualization appropriateness for the data
        3. Key insights identified or missed
        4. Data interpretation accuracy
        5. Additional insights that could be derived
        6. Recommendations for improved data storytelling
        
        Format your response as JSON with these sections.
        `;
        break;
        
      default:
        throw new Error(`Unsupported simulation type: ${simulationType}`);
    }
    
    return prompt;
  }
  
  /**
   * Analyze marketing content and provide insights
   */
  async contentAnalysis(
    contentType: 'adCopy' | 'landingPage' | 'email' | 'socialPost' | 'blogPost',
    content: string,
    targetAudience: string,
    goals: string[],
    provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic'
  ) {
    const prompt = `
    Analyze this marketing ${contentType}:
    
    Content:
    "${content}"
    
    Target Audience:
    ${targetAudience}
    
    Marketing Goals:
    ${goals.join(', ')}
    
    Please provide a detailed analysis with:
    1. Overall effectiveness score (0-100)
    2. Messaging clarity assessment
    3. Value proposition strength
    4. Audience alignment analysis
    5. Call-to-action effectiveness
    6. Tone and voice appropriateness
    7. Specific improvement recommendations
    8. A/B testing suggestions
    
    Format your response as JSON with these sections.
    `;
    
    switch (provider) {
      case 'anthropic':
        if (!this.anthropic) throw new Error('Anthropic not configured');
        const response = await this.anthropic.messages.create({
          model: ANTHROPIC_MODEL,
          max_tokens: 1200,
          messages: [{
            role: 'user' as const,
            content: prompt
          }]
        });
        const responseText = response.content[0] && 'text' in response.content[0] ? response.content[0].text : "";
        return this.parseAIResponse(responseText);
        
      case 'openai':
        if (!this.openai) throw new Error('OpenAI not configured');
        const openaiResponse = await this.openai.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [{
            role: 'system' as const,
            content: 'You are a marketing content expert providing detailed analysis and recommendations.'
          }, {
            role: 'user' as const,
            content: prompt
          }],
          response_format: { type: "json_object" }
        });
        return JSON.parse(openaiResponse.choices[0].message.content || "{}");
        
      case 'gemini':
        if (!this.geminiKey) throw new Error('Gemini not configured');
        return this.getGeminiFeedback(prompt);
        
      default:
        throw new Error('Unsupported AI provider');
    }
  }
  
  /**
   * Generate marketing strategy recommendations based on inputs
   */
  async marketingStrategySuggestion(
    businessType: string,
    industry: string,
    objectives: string[],
    targetAudience: string,
    budget: string,
    currentChannels: string[],
    provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic'
  ) {
    // Get industry benchmarks and best practices
    const industryData = await this.getIndustryInsights(industry);
    
    const prompt = `
    Generate a comprehensive marketing strategy recommendation:
    
    Business Type: ${businessType}
    Industry: ${industry}
    Key Objectives: ${objectives.join(', ')}
    Target Audience: ${targetAudience}
    Budget Range: ${budget}
    Current Marketing Channels: ${currentChannels.join(', ')}
    
    Industry Benchmarks and Insights:
    ${JSON.stringify(industryData, null, 2)}
    
    Please provide a detailed marketing strategy recommendation with:
    1. Executive summary (3-5 sentences)
    2. Channel mix recommendations with budget allocation percentages
    3. Audience targeting strategy
    4. Content strategy highlights
    5. Performance metrics to track
    6. Timeline for implementation (30/60/90 day plan)
    7. Expected outcomes and KPIs
    8. Potential challenges and mitigation strategies
    
    Format your response as JSON with these sections.
    `;
    
    switch (provider) {
      case 'anthropic':
        if (!this.anthropic) throw new Error('Anthropic not configured');
        const response = await this.anthropic.messages.create({
          model: ANTHROPIC_MODEL,
          max_tokens: 2000,
          messages: [{
            role: 'user' as const,
            content: prompt
          }]
        });
        const responseText = response.content[0] && 'text' in response.content[0] ? response.content[0].text : "";
        return this.parseAIResponse(responseText);
        
      case 'openai':
        if (!this.openai) throw new Error('OpenAI not configured');
        const openaiResponse = await this.openai.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [{
            role: 'system' as const,
            content: 'You are a marketing strategist providing detailed recommendations.'
          }, {
            role: 'user' as const,
            content: prompt
          }],
          response_format: { type: "json_object" }
        });
        return JSON.parse(openaiResponse.choices[0].message.content || "{}");
        
      case 'gemini':
        if (!this.geminiKey) throw new Error('Gemini not configured');
        return this.getGeminiFeedback(prompt);
        
      default:
        throw new Error('Unsupported AI provider');
    }
  }
  
  /**
   * Analyze the user's marketing knowledge and recommend learning paths
   */
  async knowledgeAnalysis(
    userId: number,
    completedTutorials: number[],
    quizResults: any[],
    simulationScores: any[],
    provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic'
  ) {
    // Get user's current profile
    const [userProfile] = await db.select().from(userProfiles).where({
      userId: userId
    });
    
    // Get all tutorials to check which are completed
    const tutorialsResponse = await fetch('http://localhost:5000/api/tutorials', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const allTutorials = await tutorialsResponse.json();
    
    const completedTutorialData = allTutorials.filter(
      (tutorial: any) => completedTutorials.includes(tutorial.id)
    );
    
    const incompleteTutorialData = allTutorials.filter(
      (tutorial: any) => !completedTutorials.includes(tutorial.id)
    );
    
    const prompt = `
    Analyze this user's marketing knowledge and provide learning recommendations:
    
    User Profile:
    - Current Level: ${userProfile.level}
    - Experience Points: ${userProfile.experiencePoints}
    - Learning Focus: ${userProfile.learningFocus || 'General marketing'}
    
    Completed Tutorials (${completedTutorialData.length}):
    ${JSON.stringify(completedTutorialData.map((t: any) => ({
      id: t.id,
      title: t.title,
      skills: t.skillsLearned
    })))}
    
    Quiz Results:
    ${JSON.stringify(quizResults)}
    
    Simulation Performance:
    ${JSON.stringify(simulationScores)}
    
    Remaining Tutorials (${incompleteTutorialData.length}):
    ${JSON.stringify(incompleteTutorialData.map((t: any) => ({
      id: t.id,
      title: t.title,
      skills: t.skillsLearned
    })))}
    
    Please provide a comprehensive knowledge analysis with:
    1. Current skill assessment (strengths and gaps)
    2. Recommended learning path (next 3-5 tutorials to complete)
    3. Skill areas that need more practice
    4. Recommended simulations to reinforce learning
    5. Estimated timeline to reach next level
    6. Long-term career development suggestions
    
    Format your response as JSON with these sections.
    `;
    
    switch (provider) {
      case 'anthropic':
        if (!this.anthropic) throw new Error('Anthropic not configured');
        const response = await this.anthropic.messages.create({
          model: ANTHROPIC_MODEL,
          max_tokens: 1500,
          messages: [{
            role: 'user' as const,
            content: prompt
          }]
        });
        const responseText = response.content[0] && 'text' in response.content[0] ? response.content[0].text : "";
        return this.parseAIResponse(responseText);
        
      case 'openai':
        if (!this.openai) throw new Error('OpenAI not configured');
        const openaiResponse = await this.openai.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [{
            role: 'system' as const,
            content: 'You are a marketing education expert providing learning path recommendations.'
          }, {
            role: 'user' as const,
            content: prompt
          }],
          response_format: { type: "json_object" }
        });
        return JSON.parse(openaiResponse.choices[0].message.content || "{}");
        
      case 'gemini':
        if (!this.geminiKey) throw new Error('Gemini not configured');
        return this.getGeminiFeedback(prompt);
        
      default:
        throw new Error('Unsupported AI provider');
    }
  }
  
  /**
   * Provides personalized chat responses to marketing questions
   */
  async marketingAssistant(
    question: string,
    chatHistory: { role: 'user' | 'assistant', content: string }[],
    userContext: {
      level: string,
      completedTutorials: number[],
      recentSimulations: any[]
    },
    provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic'
  ) {
    // Extract relevant knowledge from the knowledge base
    const relevantKnowledge = this.getRelevantKnowledge(question);
    
    const systemPrompt = `
    You are ZOOMi, the Digital Zoom marketing assistant. You help users with marketing questions, 
    provide advice, and guide them through learning digital marketing concepts. 
    
    User Level: ${userContext.level}
    Completed Tutorials: ${userContext.completedTutorials.length}
    
    Use the following knowledge when answering:
    ${JSON.stringify(relevantKnowledge, null, 2)}
    
    Guidelines:
    - Be conversational and friendly, but professional
    - Tailor explanations to the user's level (${userContext.level})
    - Provide specific, actionable advice when possible
    - Include examples to illustrate concepts
    - Cite sources or best practices when appropriate
    - If unsure, acknowledge limitations rather than providing incorrect information
    - Encourage the user to apply learnings in the platform's simulations
    `;
    
    // Prepare conversation history
    const messages = [
      { role: 'system' as const, content: systemPrompt }
    ];
    
    // Add chat history - we need to cast each role to the appropriate type
    chatHistory.forEach(msg => {
      messages.push({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant' | 'system',
        content: msg.content
      });
    });
    
    // Add current question
    messages.push({
      role: 'user',
      content: question
    });
    
    try {
      switch (provider) {
        case 'anthropic':
          if (this.anthropic) {
            const systemContent = messages.find(m => m.role === 'system')?.content || '';
            const userAssistantMessages = messages
              .filter(m => m.role !== 'system')
              .map(m => ({
                role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
                content: m.content
              }));
              
            const response = await this.anthropic.messages.create({
              model: ANTHROPIC_MODEL,
              max_tokens: 1000,
              system: systemContent,
              messages: userAssistantMessages
            });
            const responseText = response.content[0] && 'text' in response.content[0] ? response.content[0].text : "";
            if (responseText) return responseText;
          }
          break;
          
        case 'openai':
          if (this.openai) {
            const openaiResponse = await this.openai.chat.completions.create({
              model: OPENAI_MODEL,
              messages: messages.map(m => ({
                role: m.role as 'system' | 'user' | 'assistant',
                content: m.content
              }))
            });
            const resContent = openaiResponse.choices[0]?.message?.content;
            if (resContent) return resContent;
          }
          break;
          
        case 'gemini':
          if (this.geminiKey) {
            return await this.getGeminiResponse(messages);
          }
          break;
      }
    } catch (apiErr) {
      console.warn("AI API call error, falling back to dynamic marketing copilot engine:", apiErr);
    }

    // Dynamic Intelligent Marketing Copilot Fallback
    return this.generateDynamicMarketingAssistantResponse(question, userContext);
  }

  /**
   * Generates a context-aware marketing assistant response without requiring external API keys
   */
  private generateDynamicMarketingAssistantResponse(question: string, userContext: any): string {
    const q = question.toLowerCase();
    const userLevel = userContext?.level || "Beginner";

    // 1. Diagnostics & Weakness Analysis query
    if (
      q.includes("weak") ||
      q.includes("work on") ||
      q.includes("diagnos") ||
      q.includes("skill") ||
      q.includes("practice") ||
      q.includes("challenge") ||
      q.includes("improve") ||
      q.includes("how am i doing") ||
      q.includes("feedback on my") ||
      q.includes("what should i do")
    ) {
      const userId = userContext?.userId || 1;
      const diagnostics = dynamicSimulationGenerator.getUserDiagnostics(userId, userLevel);
      
      return `### 📊 AI Skill Diagnostics & Performance Analysis

Based on your simulation telemetry and **${userLevel}** tier profile:

#### 🎯 Competency Breakdown:
- **Quality Score Optimization**: \`${diagnostics.skillScores.qualityScoreOptimization}%\`
- **Negative Keyword Defense**: \`${diagnostics.skillScores.negativeKeywordDefense}%\`
- **Bid Strategy & CPC Efficiency**: \`${diagnostics.skillScores.cpcBidEfficiency}%\`
- **Conversion & CPA Alignment**: \`${diagnostics.skillScores.conversionOptimization}%\`
- **Audience Targeting Precision**: \`${diagnostics.skillScores.audienceTargeting}%\`
- **Ad Creative & Copywriting**: \`${diagnostics.skillScores.adCopywriting}%\`

---

#### ⚠️ Primary Area Needing Work: **${diagnostics.primaryWeakness.label}**
- **The Issue**: ${diagnostics.primaryWeakness.description}
- **Tactical Fix**: ${diagnostics.primaryWeakness.recommendation}

#### ⚡ Recommended Practice Challenge:
I can generate a tailored scenario calibrated to test this exact skill gap:
**"${diagnostics.recommendedSimulations[0].title}"**

[ACTION_LAUNCH_SIMULATION:${diagnostics.primaryWeakness.key}:${diagnostics.recommendedSimulations[0].title}]`;
    }

    if (q.includes("quality score") || q.includes("qs")) {
      return `### 🎯 How to Maximize Google Ads Quality Score (1-10)

Quality Score directly controls your **Cost-Per-Click (CPC)** and **Ad Rank**. Raising your Quality Score from 5 to 9 can reduce your CPC by up to **40-50%**.

1. **Ad Relevance (35%)**: Include your primary keyword in Headline 1 and Headline 2. Make sure your description reiterates user search intent.
2. **Expected Click-Through Rate (CTR) (35%)**: Switch high-intent terms from Broad Match to **Phrase Match** or **Exact Match**. Use emotional hooks, numbers, and clear value propositions.
3. **Landing Page Experience (30%)**: Ensure your destination URL has fast load times, mobile responsiveness, and headline messaging that matches your ad promise.
4. **Ad Extensions Boost**: Always configure **Sitelinks**, **Callouts**, and **Structured Snippets**. They expand your visual screen real estate and increase CTR by 10-15%.`;
    }

    if (q.includes("negative keyword") || q.includes("negative")) {
      return `### 🛑 Negative Keyword Strategy

Negative keywords prevent your ads from triggering on irrelevant, wasteful search queries.

- **Universal Waste Negatives**: \`free\`, \`cheap\`, \`discount\`, \`jobs\`, \`careers\`, \`salary\`, \`definition\`, \`torrent\`, \`DIY\`
- **Intent Refinement**: If you sell enterprise B2B SaaS ($500+/mo), add \`small business\`, \`personal\`, \`open source\`, \`freeware\` to negatives.
- **Match Types**: Add exact match negatives \`[free]\` for single-word stops, or phrase match \`"how to make"\` for informational research queries.

*In competitive auctions (Intermediate & Expert simulations), missing negative keywords can waste 25% to 40% of your daily budget!*`;
    }

    if (q.includes("hint") || q.includes("guide") || q.includes("help") || q.includes("audit")) {
      return `### 💡 Marketing Copilot Guidance

Here are tactical suggestions for your current simulation:

1. **Match Search Intent**: Align your ad headlines with the exact problem the customer is searching for.
2. **Control Match Types**: Avoid putting all keywords on broad match without negative keywords. Use \`"phrase match"\` for targeted queries.
3. **Bidding & Budget**: Set a daily budget that allows at least 15-20 clicks per day so the algorithm can optimize conversions.
4. **Enable Extensions / Pixels**: If on Google Ads, add sitelinks; if on Meta Ads, make sure the conversion pixel is toggled on for tracking.`;
    }

    if (q.includes("seo") || q.includes("organic") || q.includes("ranking") || q.includes("meta")) {
      return `### 🔍 Core SEO Best Practices

1. **Title Tag**: Keep it under 60 characters with the primary keyword near the front (e.g. \`Primary Keyword | Brand Name\`).
2. **Meta Description**: Keep it between 140–160 characters. Include secondary keywords and a clear call-to-action to maximize search SERP CTR.
3. **Heading Hierarchy**: Use exactly one \`<h1>\` containing your target keyword, followed by logically structured \`<h2>\` and \`<h3>\` subheadings.
4. **Content Quality & Intent**: Answer the searcher's intent comprehensively. Avoid keyword stuffing (aim for 1.5% - 2.5% natural keyword density).
5. **Schema Markup**: Add structured JSON-LD data (Product, Organization, Article, or FAQ) to earn rich search snippets.`;
    }

    if (q.includes("roas") || q.includes("cpa") || q.includes("cpc") || q.includes("ctr") || q.includes("metric")) {
      return `### 📊 Key Performance Indicators (KPIs) Breakdown

- **CTR (Click-Through Rate)** = \`Clicks / Impressions × 100\`. Benchmark: ~2.0-3.5% for Search, ~1.0-1.5% for Social.
- **CPC (Cost Per Click)** = \`Total Spend / Clicks\`. Directly influenced by Quality Score and auction competition.
- **CPA (Cost Per Acquisition)** = \`Total Spend / Conversions\`. Must remain lower than your customer lifetime gross margin.
- **ROAS (Return on Ad Spend)** = \`Total Revenue / Total Ad Spend\`. Aim for >3.0x to 4.0x for sustainable scaling.`;
    }

    return `### 🚀 MarketSim Strategy Advisor

Great question! In digital marketing at the **${userLevel}** tier, success depends on tight alignment across:

1. **Audience Segmentation**: Clear buyer personas with distinct pain points and search intent.
2. **Compelling Ad Messaging**: Headlines that highlight benefits rather than generic features.
3. **Conversion Tracking**: Rigorous event and pixel measurement so every dollar spent is attributable.
4. **Iterative A/B Testing**: Continually testing copy variants and landing page elements to lower CPA.

Would you like specific recommendations on your ad campaign structure, keyword match types, or SEO metadata?`;
  }
  
  /**
   * Extracts relevant marketing knowledge based on the question
   */
  private getRelevantKnowledge(question: string): Record<string, any> {
    // This is a simplified version - in a real implementation, you would use
    // embeddings or semantic search to find the most relevant knowledge
    
    // For now, extract some relevant knowledge based on keywords
    const keywords = question.toLowerCase().split(' ');
    
    const relevantData: Record<string, any> = {
      channels: {},
      analytics: {},
      testing: {},
      troubleshooting: {}
    };
    
    // Check for channel-specific keywords
    const channelTypes = ['searchAds', 'socialAds', 'seo', 'email', 'contentMarketing'];
    channelTypes.forEach(channel => {
      if (keywords.some(k => k.includes(channel.toLowerCase()))) {
        relevantData.channels[channel] = knowledgeBaseData.channels[channel];
      }
    });
    
    // Check for analytics keywords
    if (keywords.some(k => ['analytics', 'measure', 'report', 'data', 'track'].includes(k))) {
      relevantData.analytics = knowledgeBaseData.analytics;
    }
    
    // Check for testing keywords
    if (keywords.some(k => ['test', 'optimize', 'improve', 'conversion', 'ab test'].includes(k))) {
      relevantData.testing = knowledgeBaseData.testing;
    }
    
    // Check for troubleshooting keywords
    if (keywords.some(k => ['problem', 'issue', 'error', 'fix', 'troubleshoot'].includes(k))) {
      relevantData.troubleshooting = knowledgeBaseData.troubleshooting;
    }
    
    return relevantData;
  }
  
  /**
   * Get industry-specific insights
   */
  private async getIndustryInsights(industry: string): Promise<Record<string, any>> {
    // In a full implementation, this would query the database
    // For now, return data from our local knowledge base
    
    const benchmarks = benchmarkData;
    const industryLower = industry.toLowerCase();
    
    // Extract industry-specific benchmarks
    const industryBenchmarks = {
      searchAds: benchmarks.searchAds[industryLower] || benchmarks.searchAds.default,
      socialAds: benchmarks.socialAds[industryLower] || benchmarks.socialAds.default,
      email: benchmarks.email[industryLower] || benchmarks.email.default
    };
    
    // Get industry-specific knowledge
    const relevantChannels: Record<string, any> = {};
    Object.keys(knowledgeBaseData.channels).forEach(channel => {
      relevantChannels[channel] = {
        fundamentals: knowledgeBaseData.channels[channel].fundamentals,
        advanced: knowledgeBaseData.channels[channel].advanced
      };
    });
    
    return {
      benchmarks: industryBenchmarks,
      knowledge: relevantChannels,
      industryTrends: this.getIndustryTrends(industry)
    };
  }
  
  /**
   * Get industry trends
   */
  private getIndustryTrends(industry: string): Record<string, any> {
    // This would typically come from a regularly updated database or API
    // For now we'll use hardcoded recent trends by industry
    const trends: Record<string, any> = {
      retail: {
        keyTrends: [
          "Social commerce integrations",
          "First-party data collection strategies",
          "AR/VR shopping experiences",
          "Sustainability messaging"
        ],
        emergingChannels: ["TikTok Shop", "Connected TV", "Retail Media Networks"],
        challengesOpportunities: "Balancing personalization with privacy concerns"
      },
      finance: {
        keyTrends: [
          "Educational content marketing",
          "Voice search optimization",
          "AI-powered personalization",
          "Financial wellness focus"
        ],
        emergingChannels: ["Financial podcasts", "Niche communities", "Newsletter sponsorships"],
        challengesOpportunities: "Navigating increased regulatory scrutiny while maintaining engagement"
      },
      technology: {
        keyTrends: [
          "Product-led growth strategies",
          "Community building initiatives",
          "Solution-oriented content",
          "Developer relations programs"
        ],
        emergingChannels: ["Developer communities", "Niche tech podcasts", "Professional Discord servers"],
        challengesOpportunities: "Standing out in increasingly crowded marketplaces"
      },
      healthcare: {
        keyTrends: [
          "Telehealth promotion",
          "Patient education content",
          "Privacy-focused communication",
          "Wellness ecosystem integration"
        ],
        emergingChannels: ["Health apps partnerships", "Secure messaging platforms", "Healthcare communities"],
        challengesOpportunities: "Building trust while navigating complex regulations"
      },
      education: {
        keyTrends: [
          "Microlearning content formats",
          "Career outcome storytelling",
          "Parent-targeted campaigns",
          "Lifelong learning positioning"
        ],
        emergingChannels: ["Educational TikTok", "Professional upskilling platforms", "Alumni networks"],
        challengesOpportunities: "Demonstrating ROI of educational investments"
      },
      default: {
        keyTrends: [
          "First-party data strategies",
          "Privacy-centric marketing",
          "Video content dominance",
          "AI-powered personalization"
        ],
        emergingChannels: ["Connected TV", "Audio/Podcast advertising", "Messaging apps"],
        challengesOpportunities: "Adapting to changing privacy landscape and cookie deprecation"
      }
    };
    
    return trends[industry.toLowerCase()] || trends.default;
  }
  
  /**
   * Get Gemini API feedback from prompt
   */
  private async getGeminiFeedback(prompt: string): Promise<Record<string, any>> {
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
            text: `${prompt}\nRespond only with JSON.`
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
  
  /**
   * Get Gemini API response for conversation
   */
  private async getGeminiResponse(messages: any[]): Promise<string> {
    if (!this.geminiKey) throw new Error('Gemini not configured');
    
    // Convert to Gemini's format
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const history = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
    
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
    const response = await fetch(`${url}?key=${this.geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemPrompt: systemPrompt,
        contents: history
      })
    });
    
    const data = await response.json();
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  }
  
  /**
   * Convert the raw AI response into a structured feedback object
   */
  private parseAIResponse(rawResponse: string): Record<string, any> {
    try {
      // Try to parse the entire response as JSON
      return JSON.parse(rawResponse);
    } catch (e) {
      // If the response isn't pure JSON, try to extract the JSON portion
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e2) {
          // If still cannot parse, return a structured object with the raw text
          return {
            analysis: "Could not parse structured feedback",
            rawFeedback: rawResponse
          };
        }
      }
      
      // Fallback to return raw text in a structured format
      return {
        analysis: "Could not parse structured feedback",
        rawFeedback: rawResponse
      };
    }
  }
  
  /**
   * Check if AI services are properly configured
   */
  isConfigured(): boolean {
    return !!(this.anthropic || this.openai || this.geminiKey);
  }
  
  /**
   * Get available AI providers
   */
  getAvailableProviders(): string[] {
    const providers = [];
    if (this.anthropic) providers.push('anthropic');
    if (this.openai) providers.push('openai');
    if (this.geminiKey) providers.push('gemini');
    return providers;
  }
}

// Export a singleton instance with environment variables
export const aiCapabilities = new AICapabilities();

// Routes helper
export const registerAICapabilitiesRoutes = (app: any) => {
  app.post('/api/ai/simulation-feedback', async (req: any, res: any) => {
    try {
      const { simulationType, simulationData, userProfile, provider } = req.body;
      
      if (!simulationType || !simulationData) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      const feedback = await aiCapabilities.simulationFeedback(
        simulationType,
        simulationData,
        userProfile,
        provider || 'anthropic'
      );
      
      res.json(feedback);
    } catch (error) {
      console.error('Error providing simulation feedback:', error);
      res.status(500).json({ error: 'Failed to provide AI feedback' });
    }
  });
  
  app.post('/api/ai/content-analysis', async (req: any, res: any) => {
    try {
      const { contentType, content, targetAudience, goals, provider } = req.body;
      
      if (!contentType || !content || !targetAudience || !goals) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      const analysis = await aiCapabilities.contentAnalysis(
        contentType,
        content,
        targetAudience,
        goals,
        provider || 'anthropic'
      );
      
      res.json(analysis);
    } catch (error) {
      console.error('Error analyzing content:', error);
      res.status(500).json({ error: 'Failed to analyze content' });
    }
  });
  
  app.post('/api/ai/strategy-suggestion', async (req: any, res: any) => {
    try {
      const { businessType, industry, objectives, targetAudience, budget, currentChannels, provider } = req.body;
      
      if (!businessType || !industry || !objectives || !targetAudience || !budget || !currentChannels) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      const strategy = await aiCapabilities.marketingStrategySuggestion(
        businessType,
        industry,
        objectives,
        targetAudience,
        budget,
        currentChannels,
        provider || 'anthropic'
      );
      
      res.json(strategy);
    } catch (error) {
      console.error('Error generating strategy suggestion:', error);
      res.status(500).json({ error: 'Failed to generate strategy' });
    }
  });
  
  app.post('/api/ai/knowledge-analysis', async (req: any, res: any) => {
    try {
      const { userId, completedTutorials, quizResults, simulationScores, provider } = req.body;
      
      if (!userId || !completedTutorials) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      const analysis = await aiCapabilities.knowledgeAnalysis(
        userId,
        completedTutorials,
        quizResults || [],
        simulationScores || [],
        provider || 'anthropic'
      );
      
      res.json(analysis);
    } catch (error) {
      console.error('Error analyzing user knowledge:', error);
      res.status(500).json({ error: 'Failed to analyze knowledge' });
    }
  });
  
  app.post('/api/ai/assistant', async (req: any, res: any) => {
    try {
      const { question, chatHistory, userContext, provider } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }
      
      const response = await aiCapabilities.marketingAssistant(
        question,
        chatHistory || [],
        userContext || { level: 'Beginner', completedTutorials: [], recentSimulations: [] },
        provider || 'anthropic'
      );
      
      res.json({ response });
    } catch (error) {
      console.error('Error getting assistant response:', error);
      res.status(500).json({ error: 'Failed to get assistant response' });
    }
  });

  app.post('/api/ai/interview-evaluate', async (req: any, res: any) => {
    try {
      const { question, userAnswer, targetRole = 'Junior PPC Specialist' } = req.body;

      if (!userAnswer || !question) {
        return res.status(400).json({ error: 'Question and answer are required' });
      }

      const answerLower = userAnswer.toLowerCase();
      
      // Agency vocabulary dictionaries
      const searchTerms = ['quality score', 'negative keyword', 'phrase match', 'exact match', 'headline', 'expected ctr', 'sitelink', 'cpc', 'cpa', 'ad group', 'search query report'];
      const socialTerms = ['lookalike', 'pixel', 'custom audience', 'frequency', 'cpm', 'ctr', 'reels', 'creative fatigue', 'roas', 'attribution', 'hook'];
      const seoTerms = ['title tag', 'meta description', 'h1', 'search intent', 'backlinks', 'keyword density', 'crawlability', 'internal linking', 'serp'];
      
      const allTerms = [...searchTerms, ...socialTerms, ...seoTerms];
      const usedTerms = allTerms.filter(t => answerLower.includes(t));
      const vocabularyScore = Math.min(100, Math.max(30, usedTerms.length * 20));

      let strategicScore = 60;
      if (answerLower.includes('diagnos') || answerLower.includes('check') || answerLower.includes('first') || answerLower.includes('audit')) {
        strategicScore += 15;
      }
      if (answerLower.includes('test') || answerLower.includes('measure') || answerLower.includes('kpi') || answerLower.includes('cpa') || answerLower.includes('roas')) {
        strategicScore += 15;
      }
      if (userAnswer.length > 120) strategicScore += 10;
      strategicScore = Math.min(100, strategicScore);

      const overallScore = Math.round((vocabularyScore * 0.45) + (strategicScore * 0.55));
      const isReady = overallScore >= 75;

      const responsePayload = {
        score: overallScore,
        vocabularyScore,
        strategicScore,
        rating: overallScore >= 85 ? '🌟 Top Tier Agency Candidate' : overallScore >= 70 ? '✅ Interview Ready' : '⚠️ Needs Practice',
        usedTerminology: usedTerms,
        recommendedTerminology: ['Negative Keyword Lists', 'Expected CTR', 'Target CPA Ceilings', 'Quality Score Optimization', 'Search Query Report'].filter(t => !usedTerms.includes(t.toLowerCase())),
        feedback: [
          usedTerms.length > 0 ? `Great use of professional agency terminology: "${usedTerms.slice(0, 3).join('", "')}".` : 'Try incorporating more industry terminology like Quality Score, Negative Keywords, and Target CPA.',
          strategicScore >= 75 ? 'Strong structured reasoning: diagnosing root cause before taking action is exactly what hiring directors look for.' : 'Structure your answer in a clear 3-step sequence: 1) Audit data, 2) Apply fix, 3) Measure CPA/ROAS impact.',
        ],
        sampleModelAnswer: `In an agency setting, I start by reviewing the Search Query Report to identify budget bleed from unqualified clicks and immediately deploy negative keywords. Next, I optimize the RSA Headlines to mirror high-intent keyword themes and raise Expected CTR to achieve a 8+ Quality Score. Finally, I adjust target CPA bid caps to prevent overpaying in peak auction hours.`
      };

      res.json(responsePayload);
    } catch (error) {
      console.error('Error evaluating interview answer:', error);
      res.status(500).json({ error: 'Failed to evaluate interview answer' });
    }
  });
  
  console.log('AI Capabilities routes registered');
};
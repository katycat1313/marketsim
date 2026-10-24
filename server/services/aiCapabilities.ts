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
  private ollamaEnabled: boolean = process.env.OLLAMA_ENABLED !== 'false';
  private ollamaHost: string = process.env.OLLAMA_HOST || 'http://localhost:11434';
  private ollamaModel: string = process.env.OLLAMA_MODEL || 'qwen2.5:7b';
  
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

  private getOllamaBaseUrl(): string {
    let host = process.env.OLLAMA_HOST || '127.0.0.1:11434';
    if (host.startsWith('0.0.0.0')) {
      host = host.replace('0.0.0.0', '127.0.0.1');
    }
    if (!host.startsWith('http://') && !host.startsWith('https://')) {
      host = `http://${host}`;
    }
    const urlObj = new URL(host);
    if (!urlObj.port) {
      urlObj.port = '11434';
    }
    return urlObj.origin;
  }

  /**
   * Check if local Ollama instance is accessible
   */
  async isOllamaAvailable(): Promise<boolean> {
    try {
      const baseUrl = this.getOllamaBaseUrl();
      const res = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Query local Ollama LLM
   */
  async getOllamaResponse(
    messages: Array<{ role: string; content: string }>,
    options?: { temperature?: number; systemPrompt?: string }
  ): Promise<string> {
    const payloadMessages = [...messages];
    if (options?.systemPrompt && !payloadMessages.some(m => m.role === 'system')) {
      payloadMessages.unshift({ role: 'system', content: options.systemPrompt });
    }

    const baseUrl = this.getOllamaBaseUrl();
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.ollamaModel,
        messages: payloadMessages,
        stream: false,
        options: {
          temperature: options?.temperature ?? 0.7,
        }
      }),
      signal: AbortSignal.timeout(4000)
    });

    if (!res.ok) {
      throw new Error(`Ollama returned status ${res.status}`);
    }

    const data = await res.json();
    let text = data?.message?.content || '';
    // Strip <think>...</think> if model is deepseek or reasoning model
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    return text;
  }

  /**
   * Query local Ollama for structured JSON output
   */
  async getOllamaJSON(prompt: string, systemPrompt?: string): Promise<any> {
    const sys = (systemPrompt || "You are an expert digital marketing assistant.") + "\nIMPORTANT: Return ONLY raw, valid JSON. Do not include markdown code block formatting.";
    const responseText = await this.getOllamaResponse(
      [{ role: 'user', content: prompt }],
      { systemPrompt: sys, temperature: 0.3 }
    );
    return this.parseAIResponse(responseText);
  }
  
  /**
   * Provides detailed feedback on simulation results
   */
  async simulationFeedback(
    simulationType: 'seo' | 'adPlatform' | 'abTest' | 'dataVisualization',
    simulationData: any,
    userProfile: any,
    provider: 'anthropic' | 'openai' | 'gemini' | 'ollama' = 'ollama'
  ) {
    const prompt = this.buildSimulationFeedbackPrompt(simulationType, simulationData, userProfile);
    
    // If Ollama is available or preferred, use local GPU model
    if (provider === 'ollama' || (!this.anthropic && !this.openai && !this.geminiKey)) {
      try {
        return await this.getOllamaJSON(prompt, "You are a senior digital marketing director providing diagnostic simulation feedback.");
      } catch (ollamaErr) {
        console.warn("Local Ollama simulation feedback error, falling back:", ollamaErr);
      }
    }

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
        return this.getGeminiFeedback(prompt);
        
      default:
        try {
          return await this.getOllamaJSON(prompt);
        } catch {
          return { score: 75, summary: "Simulation completed successfully." };
        }
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
      recentSimulations: any[],
      contextType?: string,
      instructor?: string,
      style?: string,
      isSplitView?: boolean,
      playbookContent?: string,
      lessonTitle?: string,
      chapterNumber?: number,
      studentMessage?: string,
      businessName?: string,
      industry?: string
    },
    provider: 'anthropic' | 'openai' | 'gemini' = 'anthropic'
  ) {
    // Extract relevant knowledge from the knowledge base
    const relevantKnowledge = this.getRelevantKnowledge(question);
    
    const isSocratic = userContext?.contextType === 'socratic_lesson';
    const instructorName = userContext?.instructor || "Director Atlas";
    const teachingStyle = userContext?.style || "supportive";
    const isSplitView = userContext?.isSplitView;
    const playbookContent = userContext?.playbookContent || "";

    const systemPrompt = isSocratic ? `
    You are ${instructorName}, an experienced, encouraging digital marketing instructor at Krechet Academy.
    Your teaching style is: '${teachingStyle}'.
    The student is learning in split-screen interactive mode.
    ${isSplitView ? "The student has the lesson guide visible on the RIGHT side of their screen." : "The student has the lesson guide open."}

    LESSON GUIDE CONTENT (ON THE STUDENT'S RIGHT SIDE):
    ${playbookContent}

    Guidelines:
    - Speak directly, warmly, and respectfully like a real mentor teaching an ambitious adult student. No corporate roleplay, no military jargon, and no condescension.
    - ACTIVELY reference the lesson guide on the right (e.g. 'Look at Section 1 on your right...', 'Notice the formula in Section 2 on your right...', 'Remember the common mistake in Section 3...').
    - If the student asks a question or is confused, explain the concept simply using a clear real-world analogy, and point to the section on the right.
    - If the student demonstrates clear understanding or good reasoning, warmly praise their strategic logic, point to what they got right, and conclude with:
      "Well, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!"
    - If the student gives a partial answer, point them directly to the relevant section on their right, give a helpful 1-2 sentence tip, and ask 1 quick follow-up question.
    - Keep answers conversational, punchy (2-3 sentences max).
    ` : `
    You are ZOOMi, the Digital Zoom marketing assistant. You help users with marketing questions, 
    provide advice, and guide them through learning digital marketing concepts. 
    
    User Level: ${userContext.level}
    Completed Tutorials: ${userContext.completedTutorials?.length || 0}
    
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
          
        case 'ollama':
          try {
            const ollamaMessages = messages.map(m => ({
              role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
              content: m.content
            }));
            const ollamaText = await this.getOllamaResponse(ollamaMessages, { temperature: 0.7 });
            if (ollamaText && ollamaText.trim().length > 0) return ollamaText;
          } catch (ollamaErr) {
            console.warn("Ollama assistant error:", ollamaErr);
          }
          break;

        case 'gemini':
          if (this.geminiKey) {
            return await this.getGeminiResponse(messages);
          }
          break;
      }

      // Auto-try local Ollama on GPU if external API was not configured or used
      if (this.ollamaEnabled) {
        try {
          const ollamaMessages = messages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
            content: m.content
          }));
          const ollamaText = await this.getOllamaResponse(ollamaMessages, { temperature: 0.7 });
          if (ollamaText && ollamaText.trim().length > 0) return ollamaText;
        } catch (ollamaErr) {
          console.warn("Auto-Ollama assistant error:", ollamaErr);
        }
      }
    } catch (apiErr) {
      console.warn("AI API call error, falling back to dynamic marketing intelligence engine:", apiErr);
    }

    // Dynamic Intelligent Marketing Director Fallback
    return this.generateDynamicMarketingAssistantResponse(question, userContext);
  }

  /**
   * Evaluates student comprehension in Socratic Classroom / Split View mode
   * actively referencing the Tactical Playbook sections, formulas, and warnings
   */
  private generateSocraticLessonResponse(question: string, userContext: any): string {
    const isSplitView = userContext?.isSplitView ?? true;
    const rightSideText = isSplitView ? "in the guide on your right" : "in the lesson guide";
    const rightPanelText = isSplitView ? "on your right" : "in your guide";

    // Extract student's text
    let studentText = userContext?.studentMessage || "";
    if (!studentText && question) {
      const match = question.match(/STUDENT:\s*([^\n]+)/i);
      studentText = match ? match[1] : question;
    }
    const lower = studentText.toLowerCase();
    const len = studentText.trim().length;

    // Detect lesson topic/chapter
    const title = (userContext?.lessonTitle || "").toLowerCase();
    const ch = userContext?.chapterNumber || 1;

    // Chapter 1 / Lesson 1: Fundamentals & Funnel
    if (ch === 1 && (title.includes("fundamental") || title.includes("flywheel") || title.includes("funnel") || !title.includes("goal"))) {
      const hasCAC = lower.includes("cac") || lower.includes("acquisition cost") || lower.includes("50") || lower.includes("1000/20") || lower.includes("1,000");
      const hasLTV = lower.includes("ltv") || lower.includes("lifetime") || lower.includes("3x") || lower.includes("ratio") || lower.includes("35") || lower.includes("40") || lower.includes("3.0") || lower.includes("<");
      const hasTrap = lower.includes("trap") || lower.includes("landing page") || lower.includes("offer") || lower.includes("repeat") || lower.includes("spend") || lower.includes("funnel");

      if ((hasCAC && hasLTV) || (hasLTV && hasTrap) || len > 70) {
        return `Spot on! You grasped the economics immediately.\n\nAs Section 2 ${rightSideText} demonstrates with the $LTV/CAC > 3.0$ formula, spending $50 to acquire a customer who only spends $35 once guarantees insolvency. And as Section 3 warns, pouring ad spend into a funnel without repeat purchases or an optimized landing page is just throwing money away. You're thinking like a seasoned marketer.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!`;
      } else {
        return `You're on the right track, but take another close look at **Section 2 and Section 3 ${rightPanelText}**.\n\nNotice the formula: $LTV / CAC > 3.0$. If they spend $1,000 to get 20 buyers who only spend $35 once, calculate their CAC ($1,000 ÷ 20 = $50) versus their LTV ($35). Does that pass the 3.0 ratio in Section 2, and what should they have fixed before buying ads?`;
      }
    }

    // Chapter 1 / Lesson 2: Goals & KPIs
    if (title.includes("goal") || title.includes("kpi")) {
      const hasSMART = lower.includes("smart") || lower.includes("specific") || lower.includes("measurable") || lower.includes("lead") || lower.includes("revenue") || lower.includes("conversion") || lower.includes("cpa");
      const hasVanity = lower.includes("vanity") || lower.includes("like") || lower.includes("follower") || lower.includes("rent") || lower.includes("payroll") || lower.includes("trap");

      if ((hasSMART && hasVanity) || len > 60) {
        return `Outstanding work! You cut through the noise with clarity.\n\nAs highlighted in Section 3 ${rightSideText}, vanity metrics like follower counts don't pay the bills. By using the SMART framework from Section 1 with measurable targets (conversions, CPA, and revenue), you ensure every marketing dollar is accountable.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!`;
      } else {
        return `You're heading in the right direction, but check **Section 1 and Section 3 ${rightPanelText}**.\n\nWhy is 'getting 10,000 followers' considered a vanity trap, and what specific SMART goal metric from Section 2 (like conversion rate or CPA) would you present to the owner instead?`;
      }
    }

    // Chapter 2 / Lesson 3: Google Ads Hierarchy & Quality Score
    if ((ch === 2 && !title.includes("match")) || title.includes("google ads") || (title.includes("campaign") && title.includes("structure")) || (title.includes("hierarchy") && !title.includes("seo") && !title.includes("on-page"))) {
      const hasQS = lower.includes("quality score") || lower.includes("qs") || lower.includes("relevance") || lower.includes("cpc") || lower.includes("ad rank") || lower.includes("penalty") || lower.includes("discount");
      const hasGroup = lower.includes("ad group") || lower.includes("single theme") || lower.includes("unrelated") || lower.includes("bleed") || lower.includes("split");

      if ((hasQS && hasGroup) || len > 65) {
        return `Masterful analysis! You understand how the auction works.\n\nLooking at Section 2's Quality Score formula ${rightSideText}, when Quality Score drops because of mixed keywords, your Cost Per Click skyrockets. Using single-theme ad groups from Section 1 is how marketers win profitable clicks.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!`;
      } else {
        return `Good instinct, but glance back over at **Section 2 ${rightPanelText}**.\n\nLook at where Quality Score sits in the denominator of the CPC formula. If unrelated keywords crash Ad Relevance to 2/10, what happens to their CPC, and how does Section 1's 3-Tier Hierarchy prevent this?`;
      }
    }

    // Chapter 2 / Lesson 4: Match Types & Negative Keywords
    if (title.includes("match type") || title.includes("negative")) {
      const hasMatch = lower.includes("broad") || lower.includes("phrase") || lower.includes("exact") || lower.includes("intent");
      const hasNeg = lower.includes("negative") || lower.includes("free") || lower.includes("salary") || lower.includes("jobs") || lower.includes("shield") || lower.includes("diy");

      if ((hasMatch && hasNeg) || len > 65) {
        return `Sharp strategy! You just saved that client thousands of dollars.\n\nAs detailed in Sections 1 and 2 ${rightSideText}, running Broad Match without negative keyword shields lets Google burn budget on low-intent clicks. Switching to Phrase/Exact match and adding standard negatives like -free and -jobs protects the ad budget from waste.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!`;
      } else {
        return `You're close, but check **Section 1 and Section 2 ${rightPanelText}**.\n\nNotice how Broad Match triggers on queries with zero buying intent. What specific match types from Section 1 and which 3 negative keywords from Section 2 would you install immediately to protect the budget?`;
      }
    }

    // Chapter 3 / Lesson 5: SEO Newspaper Rule
    if (title.includes("seo") || title.includes("newspaper") || ch === 3) {
      const hasTags = lower.includes("title tag") || lower.includes("h1") || lower.includes("meta description") || lower.includes("headline") || lower.includes("alt");
      const hasCrawler = lower.includes("crawler") || lower.includes("google") || lower.includes("rank") || lower.includes("intent") || lower.includes("welcome") || lower.includes("morgantown") || lower.includes("coffee");

      if ((hasTags && hasCrawler) || len > 65) {
        return `Brilliant execution! That is textbook on-page structure.\n\nAs Section 1 ${rightSideText} outlines in the Newspaper Rule, crawlers depend on tag hierarchy. Replacing a meaningless H1 'Welcome' with your primary offering and city lets Google immediately index and rank the business for local buyers.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!`;
      } else {
        return `You're on the right trail, but look over at the **Newspaper Rule in Section 1 ${rightPanelText}**.\n\nWhy does an H1 tag saying 'Welcome to our site' confuse search crawlers, and how should Jenny rewrite her Title Tag and H1 with her primary keyword and city?`;
      }
    }

    // Chapter 4 / Lesson 6: Ethical AI Prompting
    if (title.includes("ai") || title.includes("prompt") || ch === 4) {
      const hasPrompt = lower.includes("role") || lower.includes("context") || lower.includes("constraint") || lower.includes("emotion") || lower.includes("30") || lower.includes("character") || lower.includes("limit");
      const hasEthics = lower.includes("slop") || lower.includes("edit") || lower.includes("helpful") || lower.includes("generic") || lower.includes("director") || lower.includes("intern");

      if ((hasPrompt || hasEthics) && len > 60) {
        return `Exceptional response! You understand prompt engineering like a pro.\n\nAs Section 1 ${rightSideText} demonstrates with the 4-Part Formula, giving AI a clear role, context, character limits, and emotional goal prevents robotic fluff. You're using free tools with real precision.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!`;
      } else {
        return `Good thinking, but review the **4-Part Formula in Section 1 ${rightPanelText}**.\n\nWhy is an unconstrained prompt like 'write an ad' a rookie mistake, and what exact constraint from Section 1 must you enforce for Google Ads headlines?`;
      }
    }

    // Chapter 5 / Lesson 7: Make.com Speed-to-Lead
    if (title.includes("make") || title.includes("speed") || title.includes("automation") || ch === 5) {
      const hasSpeed = lower.includes("speed") || lower.includes("minute") || lower.includes("second") || lower.includes("21x") || lower.includes("391") || lower.includes("lead") || lower.includes("cold");
      const hasModules = lower.includes("webhook") || lower.includes("sms") || lower.includes("email") || lower.includes("blueprint") || lower.includes("filter") || lower.includes("notification");

      if ((hasSpeed && hasModules) || len > 60) {
        return `Spot on! You understand modern lead conversion.\n\nAs the data in Section 1 ${rightSideText} proves, every minute of delay destroys conversion probability. Setting up the 3-step automation from Section 2 ensures immediate response and turns cold inquiries into paying customers.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!`;
      } else {
        return `You're close, but check **Section 1 and Section 2 ${rightPanelText}**.\n\nWhy does a 30-minute delay drop lead qualification rates by 21x, and what are the 3 modules in our Make.com blueprint that solve this automatically?`;
      }
    }

    // Chapter 6 / Lesson 8: Capstone & SLA
    if (title.includes("capstone") || title.includes("audit") || title.includes("sla") || ch === 6) {
      if (lower.includes("pillar") || lower.includes("sla") || lower.includes("audit") || lower.includes("seo") || lower.includes("revenue") || len > 60) {
        return `Exemplary leadership! You have synthesized the entire academy curriculum.\n\nAs Section 1 and Section 2 ${rightSideText} lay out in the 4-Pillar Framework and Client SLA, protecting client ad spend while establishing rigorous accountability is what differentiates an elite Growth Director from an amateur.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!`;
      } else {
        return `Good thoughts, but take a look at the **4-Pillar Diagnostic Framework in Section 1 ${rightPanelText}**.\n\nWhich pillar do you audit first when onboarding a new client, and how does the Client SLA in Section 2 protect both parties?`;
      }
    }

    // General fallback
    if (len > 50) {
      return `Strong reasoning! You're connecting the tactical principles with real-world execution.\n\nAs emphasized ${rightSideText}, grounding your strategy in concrete data and systematic frameworks prevents costly mistakes and accelerates client growth.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!`;
    }

    return `You're on the right track. Take another look at the key concepts ${rightSideText}.\n\nHow would you apply these specific principles and formulas to ensure this strategy scales profitably?`;
  }

  /**
   * Generates a context-aware marketing assistant response without requiring external API keys
   */
  private generateDynamicMarketingAssistantResponse(question: string, userContext: any): string {
    // Socratic Classroom Lesson Response (Instructor in Split View)
    if (userContext?.contextType === 'socratic_lesson') {
      return this.generateSocraticLessonResponse(question, userContext);
    }

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

    if (
      q.includes("what should i do") || 
      q.includes("what do i do") || 
      q.includes("confused") || 
      q.includes("lost") || 
      q.includes("where to start") || 
      q.includes("where do i start") || 
      q.includes("what next") || 
      q.includes("next step") || 
      q.includes("arrow") || 
      q.includes("action plan") || 
      q.includes("roadmap") || 
      q.includes("what order") || 
      q.includes("how to start")
    ) {
      return `### 🧭 Your Step-by-Step Week 1 Action Plan

Feeling confused? Don't worry! Digital marketing is vast, but Week 1 is broken down into **5 clear action steps**. Follow the arrows in order (30–40 mins per session):

---

#### ➡️ **STEP 1: Socratic AI Briefing (Day 1 - ~15 mins)**
• **What to do**: Review the Chapter 1 Briefing and master how Impressions ➡️ Clicks ➡️ Conversions connect.
• **Why**: Instills the core mental model before spending any simulated budget.
[ACTION_NAV:/tutorials:👉 Start Step 1: Chapter 1 Socratic Lesson]

⬇️

#### ➡️ **STEP 2: Week 1 Ad Campaign Sandbox (Day 2 - ~25 mins)**
• **What to do**: Draft your first Google Search ad group, add phrase/exact keywords, and inspect the live SERP preview.
• **Why**: Experience realistic campaign setup without risking real client capital.
[ACTION_NAV:/ad-simulation:👉 Launch Step 2: Week 1 Ad Simulation]

⬇️

#### ➡️ **STEP 3: Negative Keyword Defense Shield (Day 3 - ~20 mins)**
• **What to do**: Add negative keywords like \`free\`, \`cheap\`, and \`jobs\` to stop bleeding ad budget on unqualified clicks.
• **Why**: Stopping waste is the #1 skill junior marketers are audited on in real agencies.
[ACTION_NAV:/ad-simulation:👉 Open Step 3: Negative Keyword Defense]

⬇️

#### ➡️ **STEP 4: Director Atlas Mid-Week Crisis Call (Day 4 - ~20 mins)**
• **What to do**: Your boss calls in a panic about runaway broad match spend. Listen to his tactical hint and fix the leak!
• **Why**: Trains you to stay calm and execute under real agency pressure.
[ACTION_NAV:/ad-simulation:👉 Take Step 4: Emergency Crisis Drill]

⬇️

#### ➡️ **STEP 5: Claim Your Verified Case Study (Day 5 - ~15 mins)**
• **What to do**: Check your telemetry score (CTR, Quality Score, ROAS) and export your verified proof-of-work case study.
• **Why**: You can attach this audited report to resumes, Upwork profiles, or client proposals.
[ACTION_NAV:/portfolio:👉 Finish Step 5: Export Verified Portfolio]

---
💡 *Pacing Rule: Treat this like an actual agency job. Work in short 30–40 min sessions across the week. Your progress auto-saves!*`;
    }

    if (q.includes("hint") || q.includes("guide") || q.includes("help") || q.includes("audit")) {
      return `### 💡 Marketing Director Guidance

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

    return `### 🚀 Krechet Academy Strategy Advisor

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
    const startTime = Date.now();
    try {
      const { 
        question, 
        userAnswer, 
        targetRole = 'Junior PPC Specialist',
        clientTrack = 'general',
        questionId = '' 
      } = req.body;

      if (!userAnswer || !question) {
        return res.status(400).json({ error: 'Question and answer are required' });
      }

      const answerLower = userAnswer.toLowerCase();
      
      // Comprehensive Agency Vocabulary Dictionaries
      const searchTerms = [
        'quality score', 'negative keyword', 'phrase match', 'exact match', 'broad match', 
        'headline', 'expected ctr', 'sitelink', 'cpc', 'cpa', 'ad group', 'stag', 
        'search query report', 'second-price', 'ad rank', 'target cpa', 'target roas', 'rsa'
      ];
      const socialTerms = [
        'lookalike', 'pixel', 'custom audience', 'frequency', 'cpm', 'ctr', 'reels', 
        'creative fatigue', 'roas', 'attribution', 'hook rate', 'ugc', 'capi', 'mer', 'thumbstop'
      ];
      const seoTerms = [
        'title tag', 'meta description', 'h1', 'search intent', 'backlinks', 'keyword density', 
        'crawlability', 'internal linking', 'serp', 'google business profile', 'gbp', 'schema', 
        'localbusiness', 'nap', 'local pack', 'map pack', 'citation'
      ];
      const croTerms = [
        'lift model', 'value proposition', 'friction', 'anxiety', 'distraction', 'urgency', 
        'relevance', 'a/b test', 'statistical significance', 'p-value', 'hypothesis', 
        'above the fold', 'thumb zone', 'core web vitals', 'lcp', 'trust stack'
      ];
      const analyticsTerms = [
        'ga4', 'gtm', 'datalayer', 'speed-to-lead', 'webhook', 'attribution window', 
        'event-driven', 'custom event', 'drop-off', 'funnel leak', 'make.com', 'zapier'
      ];
      
      const allTerms = [...searchTerms, ...socialTerms, ...seoTerms, ...croTerms, ...analyticsTerms];
      const usedTerms = allTerms.filter(t => answerLower.includes(t));
      const vocabularyScore = Math.min(100, Math.max(35, usedTerms.length * 18));

      // STAR Framework Analysis
      const situationTokens = ['baseline', 'inherited', 'suffering', 'initial', 'problem', 'challenge', 'drop', 'churn', 'crisis', 'spending', 'burning', 'bleeding', 'jenny', 'dr. miller', 'miller', 'apex'];
      const taskTokens = ['objective', 'goal', 'target', 'ceiling', 'kpi', 'aim', 'benchmark', 'cpa of', 'roas of', 'quality score of', 'recover', 'turn around'];
      const actionTokens = ['deployed', 'implemented', 'engineered', 'structured', 'restructured', 'audited', 'isolated', 'pinned', 'optimized', 'tested', 'built', 'created', 'configured', 'injected', 'negative', 'stag', 'schema', 'lift', 'rsa'];
      const resultTokens = ['lift', 'lifted', 'cut', 'slashed', 'reduced', 'dropped', 'achieved', 'drove', 'increased', 'improved', 'saved', '%', 'x roas', 'roas', 'cpc discount', 'quality score to', 'outperformed'];

      const hasSituation = situationTokens.some(t => answerLower.includes(t));
      const hasTask = taskTokens.some(t => answerLower.includes(t));
      const hasAction = actionTokens.some(t => answerLower.includes(t));
      const hasResult = resultTokens.some(t => answerLower.includes(t));

      let starScore = 40;
      if (hasSituation) starScore += 15;
      if (hasTask) starScore += 15;
      if (hasAction) starScore += 15;
      if (hasResult) starScore += 15;
      starScore = Math.min(100, starScore);

      // Quantified Metrics Analysis
      const numbersFound = userAnswer.match(/\d+(\.\d+)?%?|\$\d+(\.\d+)?|\d+x/g) || [];
      const metricScore = Math.min(100, Math.max(30, numbersFound.length * 25));

      // Overall Score (Weighted: 35% STAR, 35% Vocabulary, 30% Quantified Metrics)
      const overallScore = Math.round((starScore * 0.35) + (vocabularyScore * 0.35) + (metricScore * 0.30));

      // Tailored Executive Translations & Insights based on Client Casework
      let executiveTranslation = "";
      let directorImpression = "";
      let curveballFollowUp = "";
      let recommendedTerms: string[] = [];

      if (clientTrack === 'miller' || answerLower.includes('miller') || answerLower.includes('dental') || questionId === 'q-miller') {
        executiveTranslation = "\"For Dr. Miller Dental, I audited a campaign burning ad spend on low-intent search terms with a 4/10 Quality Score. My target was an emergency dental CPA under $25. I deployed a 35-term negative keyword shield, isolated emergency intent into STAG ad groups, and pinned high-intent tokens across a 15-headline RSA matrix. This lifted Expected CTR, elevated Quality Score from 4 to 9/10, reduced actual CPC by 38% via second-price auction mechanics, and drove a 4.2x ROAS.\"";
        directorImpression = overallScore >= 80 
          ? "Solid executive command. You clearly connected second-price auction mechanics to Quality Score and protected spend with negative keywords." 
          : "Understood the basic PPC concept, but failed to highlight the negative keyword shield and exact auction discount that saved the client money.";
        curveballFollowUp = "If a competitor starts aggressively outbidding Dr. Miller on 'emergency dentist near me' with a $35 bid, do you increase bid caps, or how do you use Quality Score and ad extensions to outrank them without burning margin?";
        recommendedTerms = ['Quality Score 9/10', 'STAG Architecture', '35-Keyword Negative Shield', 'Second-Price Auction Discount', 'Expected CTR'];
      } else if (clientTrack === 'jenny' || answerLower.includes('jenny') || answerLower.includes('coffee') || questionId === 'q-jenny') {
        executiveTranslation = "\"When auditing Jenny's Artisan Java, I diagnosed that inconsistent NAP citations and missing structured data were suppressing their Google Map Pack ranking. I engineered a JSON-LD LocalBusiness schema payload, aligned their primary category to Coffee Roasters, and optimized Title and Meta descriptions within strict pixel constraints. This resolved crawl bottlenecks, captured 3 top-3 local pack rankings, and produced a 44% lift in organic phone calls and driving directions.\"";
        directorImpression = overallScore >= 80
          ? "Excellent grasp of technical Local SEO. You highlighted Google Business Profile consistency, schema markup, and measurable foot-traffic conversion."
          : "Too vague on the technical execution. Hiring managers want to hear about JSON-LD schema, title character limits, and NAP consistency.";
        curveballFollowUp = "A local competitor opens across the street and starts buying Google Ads on Jenny's branded keyword 'Jenny's Artisan Java'. What is your tactical response to protect brand traffic?";
        recommendedTerms = ['JSON-LD LocalBusiness Schema', 'NAP Consistency', 'Map Pack 3-Pack', 'Strict 60-Char Title Constraints', 'Google Business Profile'];
      } else if (clientTrack === 'apex' || clientTrack === 'cro' || answerLower.includes('lift') || answerLower.includes('a/b') || questionId === 'q-apex') {
        executiveTranslation = "\"I applied the 6-factor LIFT Model to Apex Athletics' landing page, hypothesizing that low above-the-fold relevance and missing trust signals were leaking checkout intent. I engineered a challenger variant with a single prominent value prop, an above-the-fold 3-layer trust stack, and a mobile thumb-zone checkout CTA. Running a two-week A/B test with 4,200 unique visitors, the challenger delivered a +24.6% conversion lift verified at 97% statistical significance (p < 0.05).\"";
        directorImpression = overallScore >= 80
          ? "High-level CRO acumen. You cited hypothesis framing, the LIFT model, and proved statistical validity at p < 0.05."
          : "Good awareness of testing, but you must cite your hypothesis framework (LIFT model) and prove statistical confidence (p < 0.05) to sound credible.";
        curveballFollowUp = "If an A/B test variant shows a +15% conversion lift on Day 3 but has only recorded 45 total conversions, do you ship it immediately or keep running it, and why?";
        recommendedTerms = ['LIFT Model', 'Statistical Significance (p < 0.05)', '3-Layer Trust Stack', 'Mobile Thumb Zone', 'Sample Size Validation'];
      } else if (clientTrack === 'social' || answerLower.includes('meta') || answerLower.includes('tiktok') || answerLower.includes('mer') || questionId === 'q-social') {
        executiveTranslation = "\"When our Meta ad frequency crossed 3.8 and CPA climbed by 45%, I diagnosed severe creative fatigue rather than audience saturation. I deployed a rapid-testing creative sprint with three 4-part UGC video variations featuring distinct 3-second visual hooks. Simultaneously, I verified our Meta Conversions API (CAPI) deduplication to ensure data resilience against iOS privacy loss, recovering a blended MER of 3.8x at scale.\"";
        directorImpression = overallScore >= 80
          ? "Modern paid social specialist. You understand creative fatigue as the primary variable, CAPI server-side resilience, and blended MER attribution."
          : "Don't just talk about changing audiences. In modern paid social, creative is the targeting. Talk about hook rates, 4-part UGC structures, and CAPI.";
        curveballFollowUp = "If Meta Ads Manager reports a 4.2x ROAS, but your client's Shopify bank receipts show blended MER is only 1.8x, where is the discrepancy coming from and how do you audit attribution windows?";
        recommendedTerms = ['3-Second Hook Rate', 'Creative Fatigue (Freq > 3.5)', '4-Part UGC Structure', 'Meta CAPI (Conversions API)', 'Blended MER'];
      } else if (clientTrack === 'analytics' || answerLower.includes('ga4') || answerLower.includes('webhook') || questionId === 'q-analytics') {
        executiveTranslation = "\"I architected an event-driven measurement framework in GA4 utilizing GTM DataLayers to track discrete micro-conversions. To solve lead drop-off, I engineered an automated webhook pipeline via Make.com that routed inbound demo requests into CRM routing in under 60 seconds. This dropped lead response latency by 92% and lifted demo completion rates by 34%.\"";
        directorImpression = overallScore >= 80
          ? "Exceptional technical marketing operations. Connecting GA4 custom events to speed-to-lead automation demonstrates real agency systems thinking."
          : "Make sure you connect measurement to revenue. Tracking events in GA4 is step one; automating the speed-to-lead pipeline is what wins the client.";
        curveballFollowUp = "How do you handle cross-domain tracking in GA4 when a user moves from an informational blog to a checkout subdomain hosted on a third-party platform?";
        recommendedTerms = ['GA4 Event-Driven Schema', 'GTM DataLayer', 'Speed-to-Lead Webhook (<60s)', 'Micro-Conversion Funnels', 'Attribution Modeling'];
      } else {
        executiveTranslation = "\"In managing agency client campaigns, I follow a disciplined 4-step framework: 1) Audit the baseline data to pinpoint root-cause leakage, 2) Formulate a metric-backed hypothesis with clear target CPA ceilings, 3) Deploy targeted technical interventions like negative keyword shields and conversion-rate optimization, and 4) Verify ROI impact with statistically significant reporting and blended ROAS analysis.\"";
        directorImpression = overallScore >= 75
          ? "Strong, structured strategic answer. Demonstrates systematic agency methodology."
          : "Structure your response using the STAR method: Situation, Task, Action, and Quantified Result.";
        curveballFollowUp = "Walk me through how you communicate a campaign failure to an angry client and the exact steps you take to recover their trust within 48 hours.";
        recommendedTerms = ['Root Cause Diagnosis', 'Target CPA Ceilings', 'Blended ROAS', 'STAR Framework', 'Quantified Business Outcome'];
      }

      const responsePayload = {
        score: overallScore,
        vocabularyScore,
        starScore,
        metricScore,
        starBreakdown: {
          situation: hasSituation,
          task: hasTask,
          action: hasAction,
          result: hasResult,
        },
        rating: overallScore >= 85 ? '🌟 Top Tier Agency Candidate' : overallScore >= 70 ? '✅ Interview Ready' : '⚠️ Needs Practice',
        usedTerminology: usedTerms,
        recommendedTerminology: recommendedTerms.filter(t => !usedTerms.includes(t.toLowerCase())),
        directorImpression,
        executiveTranslation,
        curveballFollowUp,
        speedMs: Date.now() - startTime,
        feedback: [
          hasSituation ? '✅ Good contextual framing: established client challenge early.' : '⚠️ Missing Situation: Start by stating the client crisis or baseline inefficiency.',
          hasAction ? '✅ Strong tactical action: named specific agency tools and adjustments.' : '⚠️ Missing Action: Name the exact methods deployed (e.g. STAG groups, negative keywords, schema).',
          hasResult ? '✅ Great result accountability: cited quantifiable performance metrics.' : '⚠️ Missing Result: Always conclude with a measurable outcome (e.g. Quality Score 9/10, 38% CPC reduction).'
        ]
      };

      res.json(responsePayload);
    } catch (error) {
      console.error('Error evaluating interview answer:', error);
      res.status(500).json({ error: 'Failed to evaluate interview answer' });
    }
  });

    console.log('AI Capabilities routes registered');
};
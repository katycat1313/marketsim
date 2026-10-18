import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { db, pool } from '../db';
import { sql } from 'drizzle-orm';
import { userProfiles } from '@shared/schema';

export interface Tutorial {
  id: number;
  title: string;
  level: string;
  content: string;
  tasks: TutorialTask[];
  estimatedTime: number;
  skillsLearned: string[];
  hasSimulation?: boolean; // Flag to indicate if this tutorial has an associated simulation
  chapterNumber?: number; // Added to track chapter
  isPremium?: boolean; // Flag to indicate if this is premium content
}

interface TutorialTask {
  id: number;
  description: string;
  type: 'quiz' | 'practical' | 'simulation';
  requirements: string[];
  verificationCriteria: string[];
}

export class TutorialService {
  private tutorials: Tutorial[] = [];
  
  /**
   * Load tutorial content from file
   */
  private async loadTutorialContent(filename: string): Promise<string> {
    try {
      // Use dynamic import with ES modules pattern
      try {
        // Use dynamic import to load the module
        const tutorialModule = await import(`../data/tutorial/${filename}`);
        
        // Return the content from the module
        if (tutorialModule.content) {
          return tutorialModule.content;
        } else if (tutorialModule.default) {
          return tutorialModule.default;
        }
        
        throw new Error(`No valid content export found in ${filename}`);
      } catch (importError) {
        console.error(`Error importing module ${filename}:`, importError);
        return "Error loading content. Please try again later.";
      }
    } catch (error) {
      console.error(`Error loading tutorial content from ${filename}:`, error);
      return "Content could not be loaded. Please try again later.";
    }
  }

  /**
   * Load default tutorial data
   */
  private async loadDefaultTutorials(): Promise<void> {
    try {
      // First load all the AI in Digital Marketing content
      const lesson1Content = await this.loadTutorialContent('chapter10-1-FoundationsofAIinDigital Marketing.ts');
      const lesson2Content = await this.loadTutorialContent('chapter10-2-TheAIShift.ts');
      const lesson3Content = await this.loadTutorialContent('chapter10-3-DemocratizationofTechnology.ts');
      const lesson4Content = await this.loadTutorialContent('chapter10-4-ChallengeandOpportunity.ts');
      const lesson5Content = await this.loadTutorialContent('chapter10-5-UnlockingThePowerOfAIMarketing.ts');
      const lesson6Content = await this.loadTutorialContent('chapter10-6-AIIntoAction.ts');
      const lesson7Content = await this.loadTutorialContent('chapter10-7-FutureOfAIMarketing.ts');
    // Chapter 1: Digital Marketing Fundamentals
    this.tutorials.push({
      id: 1,
      chapterNumber: 1,
      title: "Understanding Digital Marketing Fundamentals",
      level: "Beginner",
      content: `# Digital Marketing Fundamentals & The Growth Flywheel

Welcome to Krechet Academy. Before touching ad budgets or client campaigns, you must understand how modern digital ecosystems generate revenue.

## 1. The Core Mental Model: The Growth Funnel
Every profitable marketing system operates across 3 distinct stages:
* **Top of Funnel (TOFU) - Awareness**: Introducing the brand to cold audiences via Organic Search (SEO), Social Ads, or Video Reels.
* **Middle of Funnel (MOFU) - Consideration**: Educating prospects, building trust, collecting email/SMS leads, and showcasing social proof.
* **Bottom of Funnel (BOFU) - Conversion**: High-intent search queries ('buy organic beans online', 'emergency dental clinic near me') that turn prospects into paying customers.

## 2. Key Metrics You Must Master
1. **CAC (Customer Acquisition Cost)**: Total Sales & Marketing Spend ÷ Total New Customers Acquired.
2. **LTV (Customer Lifetime Value)**: Average Order Value × Purchase Frequency × Customer Lifespan.
3. **The Golden Rule**: Your LTV must be at least **3x your CAC** ($LTV / CAC > 3.0$) for a business to scale profitably.

## 3. The Wasted Budget Trap ⚠️
Rookie marketers spend $1,000 on broad social ads driving traffic to a broken homepage with no clear Call-to-Action. Always build the landing page offer FIRST before buying traffic!`,
      estimatedTime: 30,
      skillsLearned: ["Digital Marketing Basics", "Funnel Architecture", "CAC & LTV Modeling"],
      tasks: [{
        id: 1,
        description: "Complete the digital marketing concepts quiz",
        type: "quiz",
        requirements: ["Review all content"],
        verificationCriteria: ["Score at least 7/10 on the quiz"]
      }]
    });
    
    this.tutorials.push({
      id: 2,
      chapterNumber: 1,
      title: "Setting Marketing Goals and KPIs",
      level: "Beginner",
      content: `# Setting Strategic Marketing Goals & North Star KPIs

In professional agency marketing, you never run campaigns without clearly defined, mathematically sound Key Performance Indicators (KPIs).

## 1. The SMART Goal Framework for Marketers
* **Specific**: 'Increase organic search traffic to the Morgantown roastery product page by 35%.'
* **Measurable**: Tracked via GA4 Organic Sessions and Google Search Console Impressions.
* **Achievable**: Based on competitor keyword gap analysis and 15 optimized on-page tags.
* **Relevant**: Drives high-margin coffee bag sales to local consumers.
* **Time-Bound**: Completed within 60 days of CMS tag restructuring.

## 2. Channel-Specific KPIs
* **SEO**: Organic Clicks, Keyword SERP Rankings, CTR, Bounce Rate.
* **Google Paid Search**: Impression Share, Cost Per Click (CPC), Quality Score, Conversion Rate (CVR).
* **Meta/Paid Social**: Hook Rate (3s Video Views ÷ Impressions), Cost Per Acquisition (CPA), Return on Ad Spend (ROAS).

## 3. The Rookie Trap ⚠️
Setting vanity goals like 'get 10,000 Instagram likes'. Likes do not pay rent—focus on qualified leads, cost-per-acquisition, and bottom-line revenue!`,
      estimatedTime: 45,
      skillsLearned: ["SMART Goal Setting", "KPI Matrix", "Marketing Measurement"],
      tasks: [{
        id: 1,
        description: "Create your first marketing goals document",
        type: "practical",
        requirements: ["Apply SMART framework to your goals"],
        verificationCriteria: ["Document contains at least 3 SMART goals", "Each goal has associated KPIs"]
      }]
    });
    
    // Chapter 2: Google Ads Fundamentals
    this.tutorials.push({
      id: 3,
      chapterNumber: 2,
      title: "Google Ads Campaign Structure & Account Hierarchy",
      level: "Beginner",
      content: `# Google Ads Architecture: The 3-Tier Account Hierarchy

Google Ads is not a slot machine—it is a mathematical auction engine. To win without wasting thousands of dollars, your account hierarchy must follow the Single-Theme principle.

## 1. The 3-Tier Hierarchy
1. **Campaign Level**: Defines your daily budget, bidding strategy (e.g., Maximize Conversions, Target CPA), location geo-targeting, and network placement.
2. **Ad Group Level**: Groups tightly related keywords around a single specific search intent (e.g., 'Organic Whole Bean Coffee' vs. 'Coffee Roaster Subscription').
3. **Ad & Asset Level**: Responsive Search Ads (RSAs) containing 15 headlines, 4 descriptions, and sitelink extensions that dynamically match search queries.

## 2. The Quality Score Formula
Your Cost Per Click (CPC) is determined by the Google Ad Rank auction:
$$CPC = \\frac{AdRank_{competitor\\,below}}{Your\\,Quality\\,Score} + \\$0.01$$

* **Expected CTR**: How often Google expects users to click your ad.
* **Ad Relevance**: How closely your ad headlines match the searched keyword.
* **Landing Page Experience**: Fast load speed, transparent pricing, and matching H1 copy.

## 3. The Budget Bleed Trap ⚠️
Throwing 50 different unrelated keywords into one ad group. When someone searches 'espresso beans' and sees an ad for 'french press filters', they won't click—and your Quality Score will crash to 2/10!`,
      estimatedTime: 60,
      skillsLearned: ["Google Ads Basics", "Campaign Organization", "Quality Score Math"],
      hasSimulation: true,
      tasks: [{
        id: 1,
        description: "Create a mock Google Ads campaign structure",
        type: "simulation",
        requirements: ["Complete all sections of the simulator"],
        verificationCriteria: ["Campaign includes at least 2 ad groups", "Each ad group has relevant keywords"]
      }]
    });
    
    this.tutorials.push({
      id: 4,
      chapterNumber: 2,
      title: "Google Ads Keyword Match Types & Negative Keyword Shields",
      level: "Intermediate",
      content: `# Keyword Match Types & Negative Keyword Budget Protection

The single biggest reason small businesses lose money on Google Ads is improper match type selection.

## 1. The 3 Match Types Explained
* **Broad Match (coffee beans)**: Matches anything Google deems 'related'—including 'free coffee pictures' or 'coffee maker repair manual'. High risk of budget bleed!
* **Phrase Match ("organic coffee beans")**: Matches searches that contain your core phrase in order, allowing words before or after (e.g., 'buy organic coffee beans online').
* **Exact Match ([morgantown coffee roaster])**: Matches ONLY searches with the exact identical meaning and commercial intent. Lowest risk, highest conversion rate.

## 2. Negative Keyword Shields 🛡️
Negative keywords prevent your ads from showing on non-buying searches:
* **Standard Negatives**: -free, -cheap, -jobs, -salary, -internship, -youtube, -diy, -craigslist.
* Adding a robust list of 25+ negative keywords on Day 1 instantly saves $300 to $1,000/mo in wasted clicks!

## 3. Search Term Report Audits
Always audit your 'Search Terms' report weekly to find negative keyword leaks and promote high-converting queries into exact-match ad groups.`,
      estimatedTime: 75,
      skillsLearned: ["Keyword Research", "Search Intent Analysis", "Negative Keyword Shields"],
      tasks: [{
        id: 1,
        description: "Build a comprehensive keyword list for a sample business",
        type: "practical",
        requirements: ["Use keyword research tools", "Analyze search intent"],
        verificationCriteria: ["List contains min. 50 keywords", "Keywords are organized by theme", "Search volume data included"]
      }]
    });
    
    // Chapter 3: SEO Foundations
    this.tutorials.push({
      id: 5,
      chapterNumber: 3,
      title: "SEO Fundamentals: The Newspaper Rule & On-Page Hierarchy",
      level: "Beginner",
      content: `# On-Page SEO Architecture: The Newspaper Rule

Search engine crawlers cannot 'look' at your website design. They read HTML tags to understand what you sell, where you are located, and who should see your page.

## 1. The Newspaper Rule for On-Page Tags
1. **Title Tag (Library Index Card)**: 50-60 characters. Must start with your primary keyword + location (e.g., 'Organic Coffee Beans Morgantown | Jenny\'s Artisan Java').
2. **H1 Headline (Giant Front-Page Banner)**: Exactly ONE H1 tag per page. Must declare the main product offering in bold clarity.
3. **H2 & H3 Subheadings (Section Headlines)**: Break up content into clear thematic silos (e.g., H2: 'Single-Origin Ethiopian Roasts', H2: 'Wholesale Cafe Supply').
4. **Meta Description (2-Sentence Newspaper Teaser)**: 150-160 characters. Does not rank directly, but includes a compelling CTA to maximize click-through rate from Google.

## 2. Technical Image Alt Tags & Anchor Text
* **Image Alt Text**: Tell Google and visually impaired screen readers what is in the image (e.g., alt='Freshly roasted Ethiopian Yirgacheffe organic coffee beans in brown burlap bag').
* **Internal Anchor Text**: Use descriptive links ('browse our dark roast coffee catalog') instead of vague 'click here' links.

## 3. The Fatal Mistake ⚠️
Leaving your H1 as 'Welcome to Our Website' or 'Home'. Search engines have zero idea what you offer, and your rankings will stay invisible!`,
      estimatedTime: 90,
      skillsLearned: ["On-Page SEO", "Heading Hierarchy", "Snippet CTR Optimization"],
      tasks: [{
        id: 1,
        description: "Optimize a sample webpage for SEO",
        type: "practical",
        requirements: ["Apply on-page optimization techniques"],
        verificationCriteria: ["Title tag optimized", "Meta description improved", "Header structure reorganized", "Content optimized for target keyword"]
      }]
    });
    
    // Chapter 4: Ethical AI Prompting & Co-Piloting (Week 4)
    this.tutorials.push({
      id: 6,
      chapterNumber: 4,
      title: "Ethical AI Prompt Engineering & Free Marketing Co-Piloting",
      level: "Intermediate",
      content: `# Ethical AI Prompt Engineering & Free Marketing Co-Piloting

The most dangerous trap in modern marketing is letting AI generate generic, fluffy copy that sounds like every other robot on the internet. 

In Krechet Academy, we treat AI as our **junior copywriter / research intern**—while **YOU act as the Growth Director** who enforces brand voice, fact-checks claims, and verifies character limits.

---

## 1. The $0 Cost Strategy: Using Free External AI
You do not need to pay $20/month for premium tools. Free versions of **Google Gemini**, **ChatGPT (Free)**, and **Claude** are more than capable when paired with structured prompt architecture.

### The 4-Part Prompt Architecture Formula:
Every high-converting marketing prompt must include these 4 pillars:
1. **Role / Identity**: 'Act as a senior direct-response copywriter specializing in local retail.'
2. **Context & Niche Data**: 'Our business is Jenny\\'s Artisan Java in Morgantown, WV. We roast organic, fair-trade single-origin beans.'
3. **Strict Constraints & Format**: 'Write 5 Google Ads headlines. EXACT CONSTRAINT: Each headline must be under 30 characters. Do not use exclamation points.'
4. **Target Emotion / Action**: 'Focus on the sensory smell of morning roast and local freshness.'

---

## 2. Real-World Field Prompts (Copy & Paste into Gemini / ChatGPT)

### Prompt A: Negative Keyword Extractor
> *"Act as a Google Ads PPC Specialist. For a business offering [Your Service/Niche] in [Your City], generate a list of 25 negative keywords that attract non-buying clicks (e.g. free, jobs, salary, DIY, cheap, repair). Format as a clean comma-separated list."*

### Prompt B: The 30-Second Ad Hook Matrix
> *"Act as a Meta & TikTok Ads Strategist. Give me 5 distinct psychological ad hooks for [Product/Service] targeting [Ideal Customer Persona]. Use these 5 angles: 1) Contrarian / Myth-Busting, 2) The Secret / Insider Tip, 3) High-Urgency Pain Point, 4) Social Proof / Review, 5) Before-and-After Transformation. Output as a clean table with columns: Hook Angle, Script First 3 Seconds, Visual Action."*

---

## 3. The 3 Ethical Sins of AI Marketing ⚠️
1. **Publishing unedited AI copy**: Google's Helpful Content algorithm penalizes unedited generic AI text with zero unique original insight.
2. **Fake reviews or fabricated statistics**: Never ask AI to make up statistics or fake customer testimonials.
3. **Bypassing character limits**: An AI will happily write a 45-character headline for Google Ads—which Google truncates and rejects. Always verify lengths in our simulator!`,
      estimatedTime: 90,
      skillsLearned: ["AI Prompt Architecture", "Gemini & ChatGPT Co-Piloting", "Copy Verification & Ethics"],
      tasks: [{
        id: 1,
        description: "Run the 4-part prompt framework in free Gemini or ChatGPT",
        type: "practical",
        requirements: ["Apply role, context, constraints, and target action"],
        verificationCriteria: ["Generate 5 ad headlines under 30 characters", "Verify in Krechet ad simulator"]
      }]
    });
    
    // Chapter 5: Speed-to-Lead Automation with Make.com (Week 5)
    this.tutorials.push({
      id: 7,
      chapterNumber: 5,
      title: "Speed-to-Lead Automation with Make.com (The 60-Second Lead Response)",
      level: "Intermediate",
      content: `# Speed-to-Lead Automation: Responding to Inbound Leads in Under 60 Seconds

If a prospective customer fills out a contact form or requests an emergency quote, how fast you respond determines whether you win or lose the client.

### The Shocking Metric:
> **Harvard Business Review & LeadConnect Study:** Responding to an inbound lead within **5 minutes** increases conversion rates by **391%**. After 30 minutes, lead qualification drops by **21x**.

Most small businesses take 4 to 24 hours to reply—by which time the customer has already hired their competitor.

---

## 1. Why We Use Make.com (And Not Zapier)
* **Zapier's Free Tier Trap**: Zapier limits multi-step zaps and frequently paywalls common triggers behind a $20/month subscription.
* **Make.com's $0 Advantage**: Make gives you **1,000 operations every month for $0**, permits multi-step routers, supports webhooks, and connects to Google Sheets and Gmail completely free.

---

## 2. The Core Speed-to-Lead Architecture
\`\`\`
[ Website Lead Form / Google Form ] 
               │
               ▼ (Instant Webhook)
    [ Make.com Automation Engine ]
               │
       ┌───────┴───────┐
       ▼               ▼
[ Instant SMS ]  [ CRM Notification ]
"Thanks Jenny!   "🚨 New $850 Quote
We saw your      Request from Morgantown:
catering request. Calling now!"
Calling you in 2 mins."
\`\`\`

---

## 3. The 1-Click Make.com Blueprint (.json)
Instead of building from a blank canvas, you can import our pre-tested agency automation:
1. Open your free Make.com account.
2. Click **Create a New Scenario** ➔ Click the **More (...)** menu ➔ Select **Import Blueprint**.
3. Upload the \`.json\` blueprint from the Krechet Academy resources.
4. Fill in your email and notification phone number.
5. Click **Run Once** and submit a test lead from our sandbox!

---

## 4. What This Is Worth to Real Clients 💰
Setting up this simple 3-step automation for a local dentist, roofer, or law firm is routinely billed by freelancers on Upwork at **$500 to $1,500**. You can deliver it in under 30 minutes.`,
      estimatedTime: 90,
      skillsLearned: ["Speed-to-Lead Architecture", "Make.com Webhooks", "Automated SMS/Email Dispatch"],
      hasSimulation: true,
      tasks: [{
        id: 1,
        description: "Configure an instant lead notification workflow",
        type: "simulation",
        requirements: ["Set up webhook trigger", "Configure instant alert"],
        verificationCriteria: ["Lead alert triggers in under 60 seconds", "Notification contains lead phone and email"]
      }]
    });
    
    // Chapter 6: Verified Capstone Audit & Portfolio (Week 6)
    this.tutorials.push({
      id: 8,
      chapterNumber: 6,
      title: "The Verified Growth Audit & Agency Portfolio Capstone",
      level: "Advanced",
      content: `# The Verified Growth Audit & Capstone Portfolio

Congratulations on reaching the final milestone of Course 1: The Growth Specialist.

You have mastered the foundational mental models, on-page SEO hierarchy, Google Search match types, ethical AI prompting, and Speed-to-Lead automation.

---

## 1. The Capstone Mission: Full Client Growth Audit
In this final evaluation, you will audit an entire business ecosystem:
1. **On-Page SEO & Content Architecture**: Find and repair heading tags, meta descriptions, and image alt attributes.
2. **Paid Search PPC Strategy**: Structure an ad group with exact match queries and 20+ negative keyword budget shields.
3. **Emergency Crisis Resolution**: Take the live client telephone call from the business owner and successfully de-escalate their anxiety while protecting your agency SLA.
4. **Automation Dispatch**: Wire the lead response pipeline.

---

## 2. Your Verified Proof-of-Work Portfolio
Upon completing the Capstone Simulation and the Friday Checkride Quiz, our engine automatically publishes your **Verified Agency Case Study** at \`/portfolio\`.

You can share this verified URL directly with:
* Prospective freelance clients on Upwork or email.
* Hiring managers and recruiters on LinkedIn.
* Your own website as an accredited digital marketing certification.`,
      estimatedTime: 120,
      skillsLearned: ["End-to-End Growth Audit", "Client SLA Crisis Management", "Portfolio Proof-of-Work"],
      tasks: [{
        id: 1,
        description: "Complete the full capstone audit and publish portfolio case study",
        type: "simulation",
        requirements: ["Pass all 4 audit stages", "Resolve client crisis call"],
        verificationCriteria: ["Achieve SLA score >= 85%", "Generate verified portfolio link"]
      }]
    });
    
    // Chapter 7: SEO Mastery
    this.tutorials.push({
      id: 9,
      chapterNumber: 7,
      title: "A/B Testing Fundamentals",
      level: "Intermediate",
      content: "Learn how to design, run and analyze A/B tests to optimize marketing performance.",
      estimatedTime: 120,
      skillsLearned: ["Test Design", "Statistical Analysis", "Conversion Optimization"],
      hasSimulation: true,
      tasks: [{
        id: 1,
        description: "Design and run an A/B test simulation",
        type: "simulation",
        requirements: ["Use the A/B test workshop tool"],
        verificationCriteria: ["Test hypothesis clearly defined", "Variables identified", "Results correctly analyzed"]
      }]
    });
    
    // Chapter 8: Troubleshooting & Best Practices
    this.tutorials.push({
      id: 10,
      chapterNumber: 8,
      title: "Paid Social Advertising Core Strategies",
      level: "Advanced",
      content: "Advanced strategies for paid social media campaigns across multiple platforms.",
      estimatedTime: 210,
      skillsLearned: ["Paid Social", "Audience Targeting", "Cross-Platform Strategy"],
      isPremium: true,
      tasks: [{
        id: 1,
        description: "Create a multi-platform paid social strategy",
        type: "practical",
        requirements: ["Develop strategies for 3+ platforms", "Create targeting plans"],
        verificationCriteria: ["Platform-specific approaches defined", "Audience segments identified", "Budget allocation justified"]
      }]
    });
    
    // Chapter 9: Content Marketing & Authority
    this.tutorials.push({
      id: 11,
      chapterNumber: 9,
      title: "Content Marketing Strategy",
      level: "Intermediate",
      content: "Learn how to develop a comprehensive content marketing strategy.",
      estimatedTime: 180,
      skillsLearned: ["Content Strategy", "Editorial Planning", "Content Distribution"],
      isPremium: true,
      tasks: [{
        id: 1,
        description: "Create a 3-month content marketing plan",
        type: "practical",
        requirements: ["Identify target audience", "Plan content creation and distribution"],
        verificationCriteria: ["Audience personas defined", "Content calendar created", "Distribution channels identified"]
      }]
    });
    
    // Chapter 10: AI in Digital Marketing (Renamed from Conversion Optimization)
    // New Chapter 10 lessons focusing on AI in Digital Marketing
    this.tutorials.push({
      id: 1001,
      chapterNumber: 10,
      title: "The AI Marketing Revolution – A New Paradigm",
      level: "Intermediate",
      content: lesson1Content,
      estimatedTime: 45,
      skillsLearned: ["AI Marketing Fundamentals", "Marketing Transformation", "Digital Disruption"],
      tasks: [{
        id: 100101,
        description: "Identify AI's impact on your marketing strategy",
        type: "practical",
        requirements: ["Use AI to analyze your current marketing approach"],
        verificationCriteria: ["Identified at least 3 areas for AI integration", "Created a preliminary AI adoption plan"]
      }]
    });
    
    this.tutorials.push({
      id: 1002,
      chapterNumber: 10,
      title: "The AI Shift – From Buzzword to Backbone",
      level: "Intermediate",
      content: lesson2Content,
      estimatedTime: 50,
      skillsLearned: ["Predictive Analytics", "Hyper-Personalization", "Workflow Automation"],
      tasks: [{
        id: 100201,
        description: "Design a hyper-personalized email campaign",
        type: "practical",
        requirements: ["Use AI to segment your audience", "Create personalized messaging"],
        verificationCriteria: ["At least 3 customer segments identified", "Personalized content for each segment", "Implementation plan for automation"]
      }]
    });
    
    this.tutorials.push({
      id: 1003,
      chapterNumber: 10,
      title: "Democratization of Technology – Power to the People",
      level: "Intermediate",
      content: lesson3Content,
      estimatedTime: 60,
      skillsLearned: ["AI Tool Selection", "Affordable Technology", "Small Business AI Strategy"],
      tasks: [{
        id: 100301,
        description: "Explore democratized AI tools for your business",
        type: "practical",
        requirements: ["Research affordable AI solutions", "Evaluate tools based on your needs"],
        verificationCriteria: ["Selected appropriate tools for content, targeting, and analytics", "Documented implementation considerations", "Estimated ROI analysis"]
      }]
    });
    
    this.tutorials.push({
      id: 1004,
      chapterNumber: 10,
      title: "Challenge and Opportunity – Embracing the Learning Curve",
      level: "Intermediate",
      content: lesson4Content,
      estimatedTime: 55,
      skillsLearned: ["AI Adoption Strategies", "Change Management", "Learning Plan Development"],
      tasks: [{
        id: 100401,
        description: "Create your AI learning plan",
        type: "practical",
        requirements: ["Identify your biggest AI adoption challenges", "Develop a step-by-step learning roadmap"],
        verificationCriteria: ["Honest assessment of current skills", "Specific learning resources identified", "Realistic timeline for implementation"]
      }]
    });
    
    this.tutorials.push({
      id: 1005,
      chapterNumber: 10,
      title: "Key Benefits – Unlocking the Power of AI in Marketing",
      level: "Advanced",
      content: lesson5Content,
      estimatedTime: 65,
      skillsLearned: ["Audience Connection", "Automated Marketing", "Data-Driven Decision Making"],
      tasks: [{
        id: 100501,
        description: "Apply AI benefits to your marketing strategy",
        type: "simulation",
        requirements: ["Identify which AI benefit has greatest potential for your business", "Plan implementation of selected AI approach"],
        verificationCriteria: ["Clear benefit prioritization", "Specific tools identified", "Implementation roadmap with timeline", "Success metrics defined"]
      }]
    });
    
    // Add Lesson 6: Real-World Examples - AI in Action
    this.tutorials.push({
      id: 1006,
      chapterNumber: 10,
      title: "Real-World Examples - AI in Action",
      level: "Advanced",
      content: lesson6Content,
      estimatedTime: 70,
      skillsLearned: ["Case Study Analysis", "AI Implementation Planning", "ROI Measurement"],
      tasks: [{
        id: 100601,
        description: "Create an AI implementation plan for a specific marketing challenge",
        type: "practical",
        requirements: ["Identify a specific business challenge", "Research relevant AI solutions"],
        verificationCriteria: ["Clear problem statement", "Appropriate AI solution selected", "Implementation steps outlined", "Success metrics defined"]
      }]
    });
    
    // Add Lesson 7: The Future of AI Marketing
    this.tutorials.push({
      id: 1007,
      chapterNumber: 10,
      title: "The Future of AI Marketing - Trends and Predictions",
      level: "Advanced",
      content: lesson7Content,
      estimatedTime: 60,
      skillsLearned: ["Future Trend Analysis", "AI Readiness Assessment", "Strategic Planning"],
      tasks: [{
        id: 100701,
        description: "Develop a 5-year AI marketing vision for your business",
        type: "practical",
        requirements: ["Assess current AI readiness", "Identify future opportunities", "Create implementation roadmap"],
        verificationCriteria: ["Realistic vision statement", "Specific milestones identified", "Resource requirements defined", "Measures of success established"]
      }]
    });
    
    // Chapter 11: Advanced Analytics & Attribution
    this.tutorials.push({
      id: 13,
      chapterNumber: 11,
      title: "Advanced Marketing Analytics and Attribution",
      level: "Expert",
      content: "Master advanced marketing analytics including multi-touch attribution models.",
      estimatedTime: 270,
      skillsLearned: ["Attribution Modeling", "Marketing Mix Modeling", "Customer Journey Analysis"],
      isPremium: true,
      tasks: [{
        id: 1,
        description: "Build a multi-touch attribution model",
        type: "practical",
        requirements: ["Work with cross-channel data", "Apply attribution methodologies"],
        verificationCriteria: ["Attribution model defined", "Channel contributions quantified", "ROI calculations accurate"]
      }]
    });
    
    console.log(`Loaded ${this.tutorials.length} default tutorials`);
    } catch (error) {
      console.error('Error loading tutorials:', error);
    }
  }
  


  /**
   * Get tutorials filtered by user level
   */
  async getTutorials(userLevel: string): Promise<Tutorial[]> {
    // If tutorials not loaded, ensure they are
    if (this.tutorials.length === 0) {
      await this.loadDefaultTutorials();
    }
    
    // For simplicity, we're returning all tutorials here
    // In a real implementation, you could filter by user level
    console.log(`Returning ${this.tutorials.length} tutorials for user level: ${userLevel}`);
    
    // Sort tutorials by chapter number for presentation
    return this.sortTutorialsByChapter(this.tutorials);
  }
  
  /**
   * Sort tutorials by chapter number for proper display order
   */
  private sortTutorialsByChapter(tutorials: Tutorial[]): Tutorial[] {
    return [...tutorials].sort((a, b) => {
      // First by chapter number
      const chapterComparison = (a.chapterNumber || 999) - (b.chapterNumber || 999);
      if (chapterComparison !== 0) return chapterComparison;
      
      // Then by ID within the same chapter
      return a.id - b.id;
    });
  }
  
  /**
   * Get completed tutorial IDs for a specific user
   */
  async getUserProgress(userId: number): Promise<number[]> {
    try {
      const result = await pool.query(
        'SELECT tutorial_id FROM user_tutorial_progress WHERE user_id = $1',
        [userId]
      );
      
      // Extract tutorial IDs from results
      const completedTutorials = result.rows.map(row => row.tutorial_id);
      console.log(`Found ${completedTutorials.length} completed tutorials for user ${userId}`);
      
      return completedTutorials;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }
  
  /**
   * Mark a tutorial as completed for a user
   */
  async markTutorialComplete(userId: number, tutorialId: number): Promise<void> {
    try {
      // Check if already completed
      const existsResult = await pool.query(
        'SELECT * FROM user_tutorial_progress WHERE user_id = $1 AND tutorial_id = $2',
        [userId, tutorialId]
      );
      
      if (existsResult.rows.length === 0) {
        // Not yet completed, insert new record
        await pool.query(
          'INSERT INTO user_tutorial_progress(user_id, tutorial_id, completed_at) VALUES($1, $2, NOW())',
          [userId, tutorialId]
        );
        
        // Add XP to user profile for completing a tutorial
        await this.addUserXP(userId, 50); // 50 XP per tutorial completion
        console.log(`Tutorial ${tutorialId} marked complete for user ${userId} with XP reward`);
      }
    } catch (error) {
      console.error('Error marking tutorial completion:', error);
    }
  }
  
  /**
   * Add XP to user profile and handle level progression
   */
  private async addUserXP(userId: number, xpAmount: number): Promise<void> {
    try {
      // First get current XP and level
      const userResult = await db.select()
        .from(userProfiles)
        .where(sql`${userProfiles.userId} = ${userId}`)
        .limit(1);
      
      if (userResult.length === 0) {
        console.log(`User profile not found for user ${userId}`);
        return;
      }
      
      const userProfile = userResult[0];
      const currentXP = userProfile.experiencePoints || 0;
      const newXP = currentXP + xpAmount;
      
      // Update user XP
      await db.update(userProfiles)
        .set({ experiencePoints: newXP })
        .where(sql`${userProfiles.userId} = ${userId}`);
      
      console.log(`Added ${xpAmount} XP for user ${userId}. New total: ${newXP}`);
      
      // Check for level progression
      await this.checkLevelProgression(userId, newXP);
    } catch (error) {
      console.error('Error adding XP to user:', error);
    }
  }
  
  /**
   * Check and update user level based on XP thresholds
   */
  private async checkLevelProgression(userId: number, currentXP: number): Promise<void> {
    try {
      // Define XP thresholds for levels
      const levels = [
        { name: "Beginner", threshold: 0 },
        { name: "Rookie", threshold: 100 },
        { name: "Intermediate", threshold: 500 },
        { name: "Advanced", threshold: 1000 },
        { name: "Expert", threshold: 3000 },
        { name: "Master", threshold: 5000 }
      ];
      
      // Find highest level user qualifies for
      let newLevel = "Beginner";
      for (let i = levels.length - 1; i >= 0; i--) {
        if (currentXP >= levels[i].threshold) {
          newLevel = levels[i].name;
          break;
        }
      }
      
      // Get current level
      const userResult = await db.select()
        .from(userProfiles)
        .where(sql`${userProfiles.userId} = ${userId}`)
        .limit(1);
      
      if (userResult.length > 0) {
        const currentLevel = userResult[0].level || "Beginner";
        
        // Update if level changed
        if (currentLevel !== newLevel) {
          await db.update(userProfiles)
            .set({ level: newLevel })
            .where(sql`${userProfiles.userId} = ${userId}`);
          
          console.log(`User ${userId} leveled up from ${currentLevel} to ${newLevel}!`);
        }
      }
    } catch (error) {
      console.error('Error checking level progression:', error);
    }
  }
  
  /**
   * Get a specific tutorial by ID
   */
  async getTutorialById(tutorialId: number): Promise<Tutorial | null> {
    // If tutorials not loaded, ensure they are
    if (this.tutorials.length === 0) {
      await this.loadDefaultTutorials();
    }
    
    const tutorial = this.tutorials.find(t => t.id === tutorialId);
    return tutorial || null;
  }
}

// Create singleton instance
export const tutorialService = new TutorialService();
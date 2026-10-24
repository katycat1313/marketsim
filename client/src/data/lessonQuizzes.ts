export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface LessonQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  explanation: string;
  reflectionPrompt: string;
}

export const LESSON_QUIZ_DATABASE: Record<number, LessonQuestion[]> = {
  // Lesson 101: Customer Journey & 3-Stage Funnel
  101: [
    {
      id: 1,
      question: "According to the 97/3 Universal Rule, what percentage of your target market is in active 'Buy Now' mode at any given moment?",
      options: [
        { id: "a", text: "Around 50%", isCorrect: false },
        { id: "b", text: "Only ~3%", isCorrect: true },
        { id: "c", text: "At least 25%", isCorrect: false },
        { id: "d", text: "Over 80%", isCorrect: false }
      ],
      explanation: "Only about 3% of any addressable market is ready to pull out a credit card immediately. The other 97% are either problem-aware, comparing options, or not ready yet.",
      reflectionPrompt: "Why is assuming that 20%+ of cold visitors will buy immediately a fatal mistake for your ad budget?"
    },
    {
      id: 2,
      question: "What is the '#1 Amateur Trap' that causes beginner marketers to burn their ad spend with an 85%+ bounce rate?",
      options: [
        { id: "a", text: "Using video ads instead of static images", isCorrect: false },
        { id: "b", text: "Driving cold traffic directly to a raw checkout page shouting 'Buy Now' with zero prior trust", isCorrect: true },
        { id: "c", text: "Offering too many single-origin coffee varieties", isCorrect: false },
        { id: "d", text: "Sending order confirmation emails too quickly", isCorrect: false }
      ],
      explanation: "Shouting 'Buy Now' at people who just learned you exist is like proposing marriage on a first date. Without establishing trust or demonstrating value, visitors immediately bounce.",
      reflectionPrompt: "What is the psychological reason cold visitors bounce when greeted with an aggressive 'Buy Now' message?"
    },
    {
      id: 3,
      question: "In Jenny's Artisan Java customer journey, where does an educational guide titled 'Why Roast Date Matters More Than Supermarket Expiration' belong?",
      options: [
        { id: "a", text: "Bottom of Funnel (BOFU) - Checkout Flow", isCorrect: false },
        { id: "b", text: "Middle of Funnel (MOFU) - Consideration & Education", isCorrect: true },
        { id: "c", text: "Post-Purchase Receipt Confirmation", isCorrect: false },
        { id: "d", text: "None; educational guides don't sell coffee", isCorrect: false }
      ],
      explanation: "Educational guides that build taste-awareness, compare bean freshness, and solve customer skepticism belong directly in the Consideration (MOFU) stage.",
      reflectionPrompt: "How does educating the prospect about bean freshness move them closer to buying Jenny's premium coffee?"
    },
    {
      id: 4,
      question: "A search query like 'emergency dentist open Saturday Morgantown WV' is an example of which funnel stage?",
      options: [
        { id: "a", text: "Top of Funnel (Awareness)", isCorrect: false },
        { id: "b", text: "Middle of Funnel (Consideration)", isCorrect: false },
        { id: "c", text: "Bottom of Funnel (BOFU) - High Intent Conversion", isCorrect: true },
        { id: "d", text: "Brand Loyalty", isCorrect: false }
      ],
      explanation: "Specific, urgent queries with geographic intent indicate someone ready to book immediately. This is high-intent Bottom of Funnel (BOFU) traffic.",
      reflectionPrompt: "What distinguishes urgent local searches from general Top of Funnel discovery queries?"
    },
    {
      id: 5,
      question: "How does Krechet Academy define true marketing?",
      options: [
        { id: "a", text: "Using countdown timers and tricks to force people into impulse purchases", isCorrect: false },
        { id: "b", text: "Communicating value with extreme clarity and building trust at scale so the right customer gladly buys", isCorrect: true },
        { id: "c", text: "Generating the cheapest possible clicks regardless of whether anyone purchases", isCorrect: false },
        { id: "d", text: "Automating 100% of copy with raw AI without human editing", isCorrect: false }
      ],
      explanation: "Marketing is not manipulation or trickery; it is communicating value with extreme clarity and building genuine trust so the ideal customer is delighted to buy.",
      reflectionPrompt: "What is the key difference between manipulating clicks and building authentic marketing trust?"
    }
  ],

  // Lesson 102: Funnel Teardown & Ethical AI Mapping
  102: [
    {
      id: 1,
      question: "In Jenny's initial ad campaign, she spent $500 on Facebook ads and generated 12 sales of an $18.50 coffee bag. What was her Customer Acquisition Cost (CAC)?",
      options: [
        { id: "a", text: "$18.50 per customer", isCorrect: false },
        { id: "b", text: "$41.67 per customer", isCorrect: true },
        { id: "c", text: "$4.16 per customer", isCorrect: false },
        { id: "d", text: "$12.00 per customer", isCorrect: false }
      ],
      explanation: "$500 total ad spend divided by 12 customers equals $41.67 CAC. Spending $41.67 to sell an $18.50 item means losing money on every single order.",
      reflectionPrompt: "Why is a CAC of $41 unsustainable when selling an $18.50 product with no recurring subscription?"
    },
    {
      id: 2,
      question: "What is the core principle of the Ethical AI Framework taught at Krechet Academy?",
      options: [
        { id: "a", text: "Let AI generate all ad copy and publish it directly without review", isCorrect: false },
        { id: "b", text: "'AI is the Intern, You are the Director' - provide context, constraints, and human editorial audit", isCorrect: true },
        { id: "c", text: "Never use AI for any marketing task under any circumstances", isCorrect: false },
        { id: "d", text: "Only use AI to generate stock photos of coffee beans", isCorrect: false }
      ],
      explanation: "AI produces cliché-heavy copy if unguided. As human directors, marketers provide tight constraints, client voice, and real-world fact-checking.",
      reflectionPrompt: "Why does unguided raw AI copy fail to connect with real human buyers?"
    },
    {
      id: 3,
      question: "Which of the following is a prohibited generic buzzword in high-converting agency copywriting?",
      options: [
        { id: "a", text: "Single-origin roast date", isCorrect: false },
        { id: "b", text: "'Game-changer' or 'Elevate your digital landscape'", isCorrect: true },
        { id: "c", text: "48-hour delivery guarantee", isCorrect: false },
        { id: "d", text: "Notes of dark chocolate and hazelnut", isCorrect: false }
      ],
      explanation: "Words like 'game-changer', 'elevate', and 'pivotal' are meaningless corporate clichés that signal lazy, unconvincing marketing.",
      reflectionPrompt: "Why do specific sensory details (like 'roasted 48 hours ago') sell better than words like 'game-changing'?"
    },
    {
      id: 4,
      question: "What was the root cause of Jenny's 2,860 bounces within 4 seconds of landing on her page?",
      options: [
        { id: "a", text: "Her coffee tasted bad", isCorrect: false },
        { id: "b", text: "Visitors didn't know why her coffee was worth $18.50 compared to $8.99 grocery store coffee", isCorrect: true },
        { id: "c", text: "Her checkout didn't support cryptocurrency", isCorrect: false },
        { id: "d", text: "Her website was missing a blog with 50 articles", isCorrect: false }
      ],
      explanation: "Without communicating her unique value (single-origin, micro-batch roasted within 48 hours), visitors saw only an $18.50 price tag and left.",
      reflectionPrompt: "What proof or value was missing from Jenny's page that caused visitors to leave so fast?"
    },
    {
      id: 5,
      question: "When writing an effective AI prompt, what 3 elements must you provide?",
      options: [
        { id: "a", text: "Role, Context/Goal, and Strict Negative Constraints", isCorrect: true },
        { id: "b", text: "Only the product name and price", isCorrect: false },
        { id: "c", text: "A request for 'the best possible marketing'", isCorrect: false },
        { id: "d", text: "50 competitors' website links without instruction", isCorrect: false }
      ],
      explanation: "Great prompt architecture always specifies: 1) Role (Senior Director), 2) Business Context & Goal, and 3) Negative Constraints (no buzzwords, concise formatting).",
      reflectionPrompt: "How do negative constraints ('Do NOT use buzzwords') dramatically improve AI output quality?"
    }
  ]
};

// Fallback generator for lessons that don't have dedicated static items yet
export function getQuizForTutorial(tutorialId: number, tutorialTitle: string, skills: string[] = []): LessonQuestion[] {
  if (LESSON_QUIZ_DATABASE[tutorialId]) {
    return LESSON_QUIZ_DATABASE[tutorialId];
  }

  // Generate 5 structured questions based on the lesson's title and skills
  const cleanTitle = tutorialTitle.replace(/^Chapter\s*\d+[\-\.]\d+:\s*/i, '');
  const skill1 = skills[0] || "Campaign Strategy";
  const skill2 = skills[1] || "Growth Architecture";
  const skill3 = skills[2] || "Conversion Optimization";

  return [
    {
      id: 1,
      question: `In the context of ${cleanTitle}, what is the primary objective of applying ${skill1}?`,
      options: [
        { id: "a", text: `To align marketing spend with clear customer intent and measurable ROI`, isCorrect: true },
        { id: "b", text: `To maximize total vanity clicks regardless of lead quality`, isCorrect: false },
        { id: "c", text: `To replace human strategic decision-making with automated guesswork`, isCorrect: false },
        { id: "d", text: `To eliminate the need for customer trust building`, isCorrect: false }
      ],
      explanation: `Applying ${skill1} ensures that marketing resources are allocated strictly toward high-intent opportunities with quantifiable business impact.`,
      reflectionPrompt: `Why is measurable customer intent more valuable to an agency than sheer vanity click volume?`
    },
    {
      id: 2,
      question: `When executing ${skill2}, what is the most common pitfall junior media buyers and founders encounter?`,
      options: [
        { id: "a", text: `Testing too few variations and assuming assumptions are facts without data`, isCorrect: true },
        { id: "b", text: `Monitoring cost per acquisition too closely`, isCorrect: false },
        { id: "c", text: `Demanding clear value propositions on landing pages`, isCorrect: false },
        { id: "d", text: `Using structured prompt frameworks with strict constraints`, isCorrect: false }
      ],
      explanation: `The most common failure in ${skill2} is scaling spend based on untested assumptions instead of validating intent through disciplined experimentation.`,
      reflectionPrompt: `What risk does an agency take on when it scales a campaign based on intuition rather than validated test data?`
    },
    {
      id: 3,
      question: `How does mastering ${skill3} directly protect an agency client's profit margins?`,
      options: [
        { id: "a", text: `By reducing wasted budget on unqualified traffic and increasing conversion efficiency`, isCorrect: true },
        { id: "b", text: `By guaranteeing that competitors will stop bidding on client keywords`, isCorrect: false },
        { id: "c", text: `By artificially lowering product costs`, isCorrect: false },
        { id: "d", text: `By skipping landing page speed optimization`, isCorrect: false }
      ],
      explanation: `${skill3} directly impacts unit economics by filtering out non-converting traffic and optimizing the path to conversion.`,
      reflectionPrompt: `How does conversion rate efficiency directly lower customer acquisition cost (CAC)?`
    },
    {
      id: 4,
      question: `In client management and boardroom reporting, what is the best way to explain the impact of this lesson's concepts?`,
      options: [
        { id: "a", text: `Connecting front-end metrics (CTR, Clicks) directly to back-end revenue and contribution margin`, isCorrect: true },
        { id: "b", text: `Bombarding the client with complex technical jargon to confuse them`, isCorrect: false },
        { id: "c", text: `Hiding lower-performing ad groups from monthly client reports`, isCorrect: false },
        { id: "d", text: `Promising 1000% ROI in 48 hours without baseline audit data`, isCorrect: false }
      ],
      explanation: `Clients and stakeholders care about bottom-line business health: customer acquisition cost, average order value, and predictable profit.`,
      reflectionPrompt: `Why do executive stakeholders care more about contribution margin than impressions or click counts?`
    },
    {
      id: 5,
      question: `What is the Krechet Academy standard for applying AI tools to ${cleanTitle}?`,
      options: [
        { id: "a", text: `Use AI as a high-speed research intern, but apply human verification, strategic context, and editorial standards`, isCorrect: true },
        { id: "b", text: `Copy and paste unedited AI copy directly into live client ad accounts`, isCorrect: false },
        { id: "c", text: `Ignore AI tools completely and rely strictly on manual spreadsheets`, isCorrect: false },
        { id: "d", text: `Allow AI to automatically set client ad budgets without oversight`, isCorrect: false }
      ],
      explanation: `Human-in-the-loop oversight is the defining trait of high-performing modern marketers. AI generates raw possibilities; humans verify strategic viability.`,
      reflectionPrompt: `Why is human judgment irreplaceable when evaluating whether marketing copy connects with real customer desires?`
    }
  ];
}

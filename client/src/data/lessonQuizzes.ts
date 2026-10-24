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
,

  // ==========================================
  // WEEK 2 QUIZZES
  // ==========================================
  // Lesson 201: Search Engine Mechanics & The 4 Search Intents
  201: [
    {
      id: 1,
      question: "Which of the following describes the correct chronological lifecycle of how Google processes a new web page?",
      options: [
        { id: "a", text: "Ranking -> Indexing -> Crawling", isCorrect: false },
        { id: "b", text: "Crawling -> Indexing -> Ranking", isCorrect: true },
        { id: "c", text: "Indexing -> Crawling -> Ranking", isCorrect: false },
        { id: "d", text: "Crawling -> Ranking -> Indexing", isCorrect: false }
      ],
      explanation: "Googlebot first crawls (discovers) links across the web, then indexes (parses and stores) the document, and finally ranks it in search results based on relevance and quality.",
      reflectionPrompt: "Why can't Google rank a page that hasn't successfully passed through the indexing stage?"
    },
    {
      id: 2,
      question: "If a user searches 'how to brew pour over coffee at home', what type of search intent does this represent?",
      options: [
        { id: "a", text: "Transactional Intent", isCorrect: false },
        { id: "b", text: "Commercial Investigation Intent", isCorrect: false },
        { id: "c", text: "Informational Intent", isCorrect: true },
        { id: "d", text: "Navigational Intent", isCorrect: false }
      ],
      explanation: "Queries starting with 'how to' or seeking educational answers represent Informational (TOFU) intent. The searcher wants to learn, not buy immediately.",
      reflectionPrompt: "What happens to your bounce rate if you send an informational searcher directly to a product checkout page?"
    },
    {
      id: 3,
      question: "What is 'pogo-sticking' in Google search, and how does it affect rankings?",
      options: [
        { id: "a", text: "Users jumping rapidly between different websites, which Google rewards as high engagement", isCorrect: false },
        { id: "b", text: "Users clicking a result, immediately hitting the Back button due to poor content, and clicking another result—causing Google to drop your ranking", isCorrect: true },
        { id: "c", text: "A technical SEO script that speeds up mobile page rendering", isCorrect: false },
        { id: "d", text: "A tool used to automate keyword bidding in Google Ads", isCorrect: false }
      ],
      explanation: "Pogo-sticking signals to Google that your page failed to satisfy the searcher's intent. When Google sees high pogo-sticking, it demotes your organic ranking.",
      reflectionPrompt: "Why does satisfying search intent on the page prevent pogo-sticking back to Google?"
    },
    {
      id: 4,
      question: "Which query below represents high-intent Transactional (BOFU) search behavior?",
      options: [
        { id: "a", text: "'history of coffee roasting'", isCorrect: false },
        { id: "b", text: "'best single origin coffee beans reviews'", isCorrect: false },
        { id: "c", text: "'emergency dentist open saturday morgantown wv'", isCorrect: true },
        { id: "d", text: "'what is a dental crown made of'", isCorrect: false }
      ],
      explanation: "Specific local queries with urgency ('emergency', 'open saturday', 'morgantown wv') represent users with high purchase/booking intent ready to take action immediately.",
      reflectionPrompt: "What modifiers in a search query signal immediate readiness to purchase rather than casual research?"
    },
    {
      id: 5,
      question: "What is the primary danger of driving informational traffic to a bare product checkout page?",
      options: [
        { id: "a", text: "It causes near-immediate bounces (85%+) because the visitor hasn't established trust or understanding yet", isCorrect: true },
        { id: "b", text: "Google will permanently ban your domain within 24 hours", isCorrect: false },
        { id: "c", text: "It increases your merchant processing fees", isCorrect: false },
        { id: "d", text: "There is no danger; traffic is traffic", isCorrect: false }
      ],
      explanation: "Informational searchers are looking for answers. Shouting 'Buy Now' at them creates friction and distrust, causing instant bounces.",
      reflectionPrompt: "How can you nurture an informational searcher without scaring them away with an immediate hard sell?"
    }
  ],

  // Lesson 204: The Long-Tail Strategy & Keyword Difficulty
  204: [
    {
      id: 1,
      question: "According to organic search data, approximately what percentage of all Google search queries are 3+ words (long-tail)?",
      options: [
        { id: "a", text: "Under 15%", isCorrect: false },
        { id: "b", text: "Over 70%", isCorrect: true },
        { id: "c", text: "Exactly 25%", isCorrect: false },
        { id: "d", text: "Around 40%", isCorrect: false }
      ],
      explanation: "Over 70% of all searches are long-tail queries. While individual head terms have high search volume, the long-tail represents the vast majority of web traffic and purchase intent.",
      reflectionPrompt: "Why do beginner marketers mistakenly focus all their effort on the 30% head terms instead of the 70% long-tail?"
    },
    {
      id: 2,
      question: "Why is a 250-volume keyword like 'buy ethiopian yirgacheffe beans online' often more valuable than a 15,000-volume keyword like 'coffee facts'?",
      options: [
        { id: "a", text: "Because it costs more to host on your web server", isCorrect: false },
        { id: "b", text: "Because it has commercial transaction intent, meaning a high percentage of searchers actually buy products", isCorrect: true },
        { id: "c", text: "Because Google gives bonus ranking points to Ethiopian words", isCorrect: false },
        { id: "d", text: "It isn't; 15,000 volume is always better", isCorrect: false }
      ],
      explanation: "Search Value = Volume x Intent CVR x AOV. High-intent traffic converts at 8–12%, generating real revenue, while broad informational terms convert at near 0%.",
      reflectionPrompt: "Why is commercial conversion rate more important to agency clients than raw impression counts?"
    },
    {
      id: 3,
      question: "What Keyword Difficulty (KD) range should new client websites (DA < 25) prioritize for fast organic wins?",
      options: [
        { id: "a", text: "KD 75 - 100", isCorrect: false },
        { id: "b", text: "KD 50 - 75", isCorrect: false },
        { id: "c", text: "KD 0 - 25 (Low Competition)", isCorrect: true },
        { id: "d", text: "Keyword Difficulty doesn't matter for rankings", isCorrect: false }
      ],
      explanation: "Keywords with KD under 25 have low domain competition, allowing newer websites to rank on Page 1 within 30 to 60 days with clean on-page optimization.",
      reflectionPrompt: "What happens when a new brand with zero backlinks tries to compete for KD 85+ keywords?"
    },
    {
      id: 4,
      question: "Which of the following is a negative intent modifier that signals non-buying traffic?",
      options: [
        { id: "a", text: "'buy'", isCorrect: false },
        { id: "b", text: "'free', 'jobs', or 'salary'", isCorrect: true },
        { id: "c", text: "'near me'", isCorrect: false },
        { id: "d", text: "'shipping'", isCorrect: false }
      ],
      explanation: "Modifiers like 'free', 'jobs', 'salary', 'wikipedia', and 'diy' signal that searchers are looking for free resources or employment, not hiring or buying.",
      reflectionPrompt: "Why must you filter out keywords with modifiers like 'free' or 'jobs' when building client targeting plans?"
    },
    {
      id: 5,
      question: "In the Agency Opportunity Formula, why is Keyword Difficulty in the denominator?",
      options: [
        { id: "a", text: "Because higher difficulty reduces the likelihood of ranking quickly, lowering the net opportunity value", isCorrect: true },
        { id: "b", text: "Because Google multiplies ad spend by KD", isCorrect: false },
        { id: "c", text: "Because difficulty increases server bandwidth costs", isCorrect: false },
        { id: "d", text: "It is an arbitrary mathematical rule", isCorrect: false }
      ],
      explanation: "Opportunity Score = (Volume x Intent) / (KD + 1). Higher competition reduces ROI by increasing time and backlink acquisition costs.",
      reflectionPrompt: "How does high keyword competition increase the cost and delay of client SEO results?"
    }
  ],

  // Lesson 207: SERP Snippet & On-Page Tag Architecture
  207: [
    {
      id: 1,
      question: "What is the recommended maximum character limit for an SEO Title Tag before Google truncates it in desktop results?",
      options: [
        { id: "a", text: "120 characters", isCorrect: false },
        { id: "b", text: "55 to 60 characters (approx. 580 pixels)", isCorrect: true },
        { id: "c", text: "25 characters", isCorrect: false },
        { id: "d", text: "There is no limit", isCorrect: false }
      ],
      explanation: "Title tags longer than 60 characters are truncated with an ellipsis (...), which cuts off value propositions and hurts Click-Through Rate.",
      reflectionPrompt: "Why is front-loading your primary keyword in the first 35 characters essential if truncation occurs?"
    },
    {
      id: 2,
      question: "How many H1 heading tags should you have on a single web page according to semantic HTML and SEO best practices?",
      options: [
        { id: "a", text: "As many as you want; Google ignores headers", isCorrect: false },
        { id: "b", text: "Exactly ONE H1 tag representing the primary page topic", isCorrect: true },
        { id: "c", text: "At least 5 to cover all keywords", isCorrect: false },
        { id: "d", text: "Only one per paragraph", isCorrect: false }
      ],
      explanation: "A page should have exactly one H1 headline declaring the core topic. Multiple H1 tags dilute topical clarity for search engine crawlers.",
      reflectionPrompt: "Why does having multiple competing H1 tags confuse search engine crawlers about the primary topic?"
    },
    {
      id: 3,
      question: "Does the Meta Description directly influence Google's organic ranking algorithm score?",
      options: [
        { id: "a", text: "Yes, it is the #1 ranking factor", isCorrect: false },
        { id: "b", text: "No, but it heavily impacts Click-Through Rate (CTR), which indirectly influences rankings", isCorrect: true },
        { id: "c", text: "Only if it contains 5 or more exclamation marks", isCorrect: false },
        { id: "d", text: "Only on mobile devices", isCorrect: false }
      ],
      explanation: "Meta descriptions don't directly boost ranking position, but a compelling description increases CTR. Higher CTR signals user satisfaction, lifting organic rankings.",
      reflectionPrompt: "Why should you treat your meta description like persuasive advertising copy rather than just a keyword dump?"
    },
    {
      id: 4,
      question: "What is the recommended length range for a high-converting Meta Description?",
      options: [
        { id: "a", text: "50 to 75 characters", isCorrect: false },
        { id: "b", text: "145 to 155 characters", isCorrect: true },
        { id: "c", text: "300 to 400 characters", isCorrect: false },
        { id: "d", text: "Under 20 characters", isCorrect: false }
      ],
      explanation: "145 to 155 characters ensures your entire message and call to action are visible across both mobile and desktop SERPs without truncation.",
      reflectionPrompt: "What essential elements must fit inside a 150-character meta description to drive a click?"
    },
    {
      id: 5,
      question: "What is the primary function of Image Alt Text in modern on-page SEO?",
      options: [
        { id: "a", text: "To hide 20 competitor keywords in the HTML code", isCorrect: false },
        { id: "b", text: "To provide an accurate, accessible description of the image for screen readers and search crawlers", isCorrect: true },
        { id: "c", text: "To reduce image file size on mobile phones", isCorrect: false },
        { id: "d", text: "To trigger popups when a user hovers over the photo", isCorrect: false }
      ],
      explanation: "Alt text describes image content for visually impaired users and helps Google understand image relevance. Keyword stuffing alt text violates Google guidelines.",
      reflectionPrompt: "How does natural, descriptive alt text improve both accessibility and image search rankings?"
    }
  ],

  // Lesson 210: Local SEO & Google Business Profile
  210: [
    {
      id: 1,
      question: "Approximately what percentage of local mobile search clicks go directly to the Google Maps Local 3-Pack?",
      options: [
        { id: "a", text: "Over 68%", isCorrect: true },
        { id: "b", text: "Under 10%", isCorrect: false },
        { id: "c", text: "Exactly 25%", isCorrect: false },
        { id: "d", text: "Zero; people only click traditional blue links", isCorrect: false }
      ],
      explanation: "For local services, over 68% of searchers click directly inside the Google Maps 3-Pack before ever scrolling down to standard organic links.",
      reflectionPrompt: "Why is ranking in the Local 3-Pack far more critical for local service clients than national organic rankings?"
    },
    {
      id: 2,
      question: "What does 'NAP Consistency' stand for in local SEO?",
      options: [
        { id: "a", text: "Network Access Protocol", isCorrect: false },
        { id: "b", text: "Name, Address, and Phone Number", isCorrect: true },
        { id: "c", text: "New Audience Positioning", isCorrect: false },
        { id: "d", text: "Negative Ad Placement", isCorrect: false }
      ],
      explanation: "NAP stands for Name, Address, and Phone Number. Strict consistency across directories like Google, Yelp, and Apple Maps is a primary local ranking factor.",
      reflectionPrompt: "Why does having conflicting phone numbers or misspelled suite addresses across directories hurt local rankings?"
    },
    {
      id: 3,
      question: "What is the single most heavily weighted ranking factor on a Google Business Profile (GBP)?",
      options: [
        { id: "a", text: "The Primary Business Category", isCorrect: true },
        { id: "b", text: "The number of emojis in your business description", isCorrect: false },
        { id: "c", text: "Having a website built in WordPress", isCorrect: false },
        { id: "d", text: "Posting 10 updates every hour", isCorrect: false }
      ],
      explanation: "The Primary Category directly dictates which search queries your listing is eligible to rank for. Choosing the wrong category causes massive visibility loss.",
      reflectionPrompt: "Why is selecting a specific high-intent primary category (like 'Emergency Dental Service') better than a generic category?"
    },
    {
      id: 4,
      question: "In local review management, what does 'Review Velocity' refer to?",
      options: [
        { id: "a", text: "How fast a customer types their review", isCorrect: false },
        { id: "b", text: "The consistency and frequency with which your business receives fresh reviews over time", isCorrect: true },
        { id: "c", text: "Deleting negative reviews within 60 seconds", isCorrect: false },
        { id: "d", text: "Paying influencers for 5-star ratings", isCorrect: false }
      ],
      explanation: "Google rewards businesses that receive steady, recent reviews. 3–4 new reviews every week signals an active, reputable business far better than 100 stale reviews from 4 years ago.",
      reflectionPrompt: "Why does Google's algorithm favor steady, recent reviews over an older business with stale reviews?"
    },
    {
      id: 5,
      question: "When responding to a negative patient review for Dr. Miller Dental, what legal/ethical standard must be strictly observed?",
      options: [
        { id: "a", text: "HIPAA Patient Privacy: Never confirm or discuss medical treatments publicly", isCorrect: true },
        { id: "b", text: "Post the patient's full dental records to prove the clinic was right", isCorrect: false },
        { id: "c", text: "Threaten to sue the patient for defamation in the public comments", isCorrect: false },
        { id: "d", text: "Ignore the review completely", isCorrect: false }
      ],
      explanation: "Healthcare responses must be HIPAA-compliant. Never confirm patient identity or medical details. Validate empathy and offer a private offline phone number to resolve issues.",
      reflectionPrompt: "How can you de-escalate a negative review professionally while fully respecting patient confidentiality?"
    }
  ],

  // Lesson 213: Helpful Content (E-E-A-T) & AI Guidelines
  213: [
    {
      id: 1,
      question: "What does the acronym E-E-A-T stand for in Google's Search Quality Evaluator Guidelines?",
      options: [
        { id: "a", text: "Engagement, Execution, Advertising, Technology", isCorrect: false },
        { id: "b", text: "Experience, Expertise, Authoritativeness, and Trustworthiness", isCorrect: true },
        { id: "c", text: "Efficiency, Economics, Automation, Tracking", isCorrect: false },
        { id: "d", text: "Enterprise, Ecommerce, Analytics, Testing", isCorrect: false }
      ],
      explanation: "E-E-A-T stands for Experience (first-hand proof), Expertise, Authoritativeness, and Trustworthiness. Trust is the central pillar holding them all together.",
      reflectionPrompt: "Why did Google add 'Experience' to E-A-T to combat unverified, generic AI content?"
    },
    {
      id: 2,
      question: "What is Google's 'Scaled Content Abuse' policy designed to penalize?",
      options: [
        { id: "a", text: "Mass-producing hundreds of unedited, low-value AI articles designed solely to manipulate search rankings without original insight", isCorrect: true },
        { id: "b", text: "Using spell check software on blog posts", isCorrect: false },
        { id: "c", text: "Writing articles longer than 2,000 words", isCorrect: false },
        { id: "d", text: "Adding author bios to landing pages", isCorrect: false }
      ],
      explanation: "Google penalizes domains that mass-publish generic AI content without original testing, proprietary data, or human oversight.",
      reflectionPrompt: "What makes mass-produced generic AI content a massive liability for a client's domain authority?"
    },
    {
      id: 3,
      question: "Which of the following is the best way to prove 'Experience' on Jenny's Artisan Java coffee website?",
      options: [
        { id: "a", text: "Generating 20 AI articles about coffee history", isCorrect: false },
        { id: "b", text: "Publishing original photographs of roast batches, Q-grader cupping scorecards, and first-hand flavor tasting notes", isCorrect: true },
        { id: "c", text: "Copying bean descriptions from green coffee importers", isCorrect: false },
        { id: "d", text: "Putting a stock photo of a coffee cup on the homepage", isCorrect: false }
      ],
      explanation: "Original photography, proprietary test data, and authentic roast logs provide undeniable proof of first-hand experience that AI scrapers cannot duplicate.",
      reflectionPrompt: "Why do original photographs and proprietary tasting notes build more buyer trust than generic stock images?"
    },
    {
      id: 4,
      question: "What is the recommended best practice for descriptive internal link anchor text?",
      options: [
        { id: "a", text: "Always use 'click here' or 'learn more'", isCorrect: false },
        { id: "b", text: "Use natural, descriptive phrases that explain the destination page (e.g., 'explore our single-origin Ethiopian coffee beans')", isCorrect: true },
        { id: "c", text: "Paste raw URLs directly into the paragraph copy", isCorrect: false },
        { id: "d", text: "Make every single word in an article a clickable link", isCorrect: false }
      ],
      explanation: "Descriptive anchor text tells Google's crawler and human readers exactly what the linked page is about, transferring topical authority effectively.",
      reflectionPrompt: "Why does descriptive anchor text pass more SEO context than vague phrases like 'read more'?"
    },
    {
      id: 5,
      question: "What is the Krechet Academy 'Human-in-the-Loop' rule for AI content generation?",
      options: [
        { id: "a", text: "AI is the intern that helps draft and brainstorm, but a human director must fact-check, verify brand voice, and edit before publishing", isCorrect: true },
        { id: "b", text: "Humans should never touch AI tools", isCorrect: false },
        { id: "c", text: "AI should be trusted 100% on medical, legal, and financial facts", isCorrect: false },
        { id: "d", text: "Publish immediately and only edit if a customer complains", isCorrect: false }
      ],
      explanation: "AI generates raw text based on statistics; it does not verify truth. Human directors ensure factual accuracy, compliance, and genuine brand resonance.",
      reflectionPrompt: "What danger does an agency risk if it publishes unverified AI copy without human fact-checking?"
    }
  ],

  // ==========================================
  // WEEK 3: Paid Search Advertising (Google Ads 101)
  // ==========================================
  // Lesson 301: Google Ads Mechanics & 3-Tier Hierarchy
  301: [
    {
      id: 1,
      question: "Why is Google Paid Search categorized as an 'intent capture' channel rather than an 'interruption' channel?",
      options: [
        { id: "a", text: "Because ads show up in personal email inboxes unprompted", isCorrect: false },
        { id: "b", text: "Because searchers are actively looking for a solution at the exact second a problem arises", isCorrect: true },
        { id: "c", text: "Because Google Ads costs less than social media advertising", isCorrect: false },
        { id: "d", text: "Because users are legally required to click search ads", isCorrect: false }
      ],
      explanation: "Unlike social feeds where users are browsing for entertainment, searchers on Google type in specific pain points with high commercial or transactional intent.",
      reflectionPrompt: "Why does capturing existing demand convert at higher rates than interrupting casual social media users?"
    },
    {
      id: 2,
      question: "In the 3-Tier Google Ads Account Hierarchy, at which level are daily budget and geo-location settings configured?",
      options: [
        { id: "a", text: "Ad Group level", isCorrect: false },
        { id: "b", text: "Campaign level", isCorrect: true },
        { id: "c", text: "Keyword level", isCorrect: false },
        { id: "d", text: "Ad Asset / Extension level", isCorrect: false }
      ],
      explanation: "Budgets, bidding strategies, languages, and geo-targeting locations are set strictly at the Campaign level. Ad Groups control keywords and ads.",
      reflectionPrompt: "What operational problem occurs if you try to set different daily budgets for two ad groups in the same campaign?"
    },
    {
      id: 3,
      question: "What is the primary danger of building a 'kitchen sink' ad group with 60+ unrelated keywords?",
      options: [
        { id: "a", text: "Google will delete the account immediately", isCorrect: false },
        { id: "b", text: "Ad relevance and Quality Score crash because ads cannot match the diverse search intents, inflating cost-per-click", isCorrect: true },
        { id: "c", text: "It prevents Google from billing your credit card", isCorrect: false },
        { id: "d", text: "It causes the landing page to load too slowly", isCorrect: false }
      ],
      explanation: "When diverse intents are grouped together, the ad headline cannot mirror the search query. Expected CTR and Ad Relevance drop, destroying Quality Score.",
      reflectionPrompt: "How does the Single-Theme Ad Group (STAG) principle directly improve your ad's Quality Score?"
    },
    {
      id: 4,
      question: "Why must junior media buyers ALWAYS uncheck the 'Include Google Display Network' box on search campaigns?",
      options: [
        { id: "a", text: "Because Display ads are illegal in the United States", isCorrect: false },
        { id: "b", text: "Because it drains 30-50% of the budget placing banners on random mobile apps and games with low conversion intent", isCorrect: true },
        { id: "c", text: "Because Display Network only works on desktop computers", isCorrect: false },
        { id: "d", text: "Because Google charges double for search clicks if Display is enabled", isCorrect: false }
      ],
      explanation: "Display expansion on search campaigns places banner ads on games and blogs where accidental clicks burn search budget with near-zero conversion intent.",
      reflectionPrompt: "Why do accidental mobile app banner clicks produce virtually zero qualified leads for a local service clinic?"
    },
    {
      id: 5,
      question: "Under Campaign Location Options, why should you select 'Presence: People in or regularly in your targeted locations' instead of 'Presence or Interest'?",
      options: [
        { id: "a", text: "It makes Google Ads free for local non-profits", isCorrect: false },
        { id: "b", text: "It prevents users from across the country or overseas from triggering your local ads and wasting budget", isCorrect: true },
        { id: "c", text: "It hides your ads from competitors in the same town", isCorrect: false },
        { id: "d", text: "It automatically increases your organic Google Maps ranking", isCorrect: false }
      ],
      explanation: "'Presence or Interest' allows anyone globally searching your town name to click your ad. 'Presence only' restricts ads strictly to people physically located in your target area.",
      reflectionPrompt: "What happens to Dr. Miller's dental budget if a user in another state clicks his emergency extraction ad?"
    }
  ],

  // Lesson 304: The 3 Keyword Match Types & Budget Bleed
  304: [
    {
      id: 1,
      question: "Which keyword match type syntax is represented by enclosing the keyword in quotation marks, such as \"emergency dentist\"?",
      options: [
        { id: "a", text: "Exact Match", isCorrect: false },
        { id: "b", text: "Phrase Match", isCorrect: true },
        { id: "c", text: "Broad Match", isCorrect: false },
        { id: "d", text: "Negative Match", isCorrect: false }
      ],
      explanation: "Quotes (\"keyword\") indicate Phrase Match. Brackets ([keyword]) indicate Exact Match. Plain text with no punctuation indicates Broad Match.",
      reflectionPrompt: "Why is syntax precision critical when entering keywords into client Google Ads accounts?"
    },
    {
      id: 2,
      question: "What is the primary risk of entering pure Broad Match keywords like 'emergency dentist' with no modifiers?",
      options: [
        { id: "a", text: "Google will match search queries for job openings, DIY tooth pulling tutorials, and free dental clinics", isCorrect: true },
        { id: "b", text: "Ads will only show on weekends", isCorrect: false },
        { id: "c", text: "The keywords will refuse to serve any impressions", isCorrect: false },
        { id: "d", text: "Competitors will receive free access to your account data", isCorrect: false }
      ],
      explanation: "Broad match gives Google algorithmic freedom to match loosely related searches, frequently wasting 60-80% of budget on non-buying queries.",
      reflectionPrompt: "What is the economic danger of giving Google algorithmic freedom when a client has a small $1,000/month budget?"
    },
    {
      id: 3,
      question: "Which of the following searches would be TRIGGERED by the Exact Match keyword [emergency dentist morgantown]?",
      options: [
        { id: "a", text: "\"best emergency dentist morgantown wv with reviews\"", isCorrect: false },
        { id: "b", text: "\"emergency dentist morgantown\"", isCorrect: true },
        { id: "c", text: "\"emergency pediatric dentist in charleston wv\"", isCorrect: false },
        { id: "d", text: "\"how much do emergency dentists make in morgantown\"", isCorrect: false }
      ],
      explanation: "Exact Match ([keyword]) triggers only searches that share the exact identical meaning and intent, blocking extra phrases and unrelated terms.",
      reflectionPrompt: "Why does Exact Match provide the highest conversion rate and lowest cost per acquisition?"
    },
    {
      id: 4,
      question: "What is the recommended match type strategy for a new local business client with a budget under $2,000/month?",
      options: [
        { id: "a", text: "100% Broad Match to see what happens", isCorrect: false },
        { id: "b", text: "Strictly Phrase Match (\"...\") and Exact Match ([...]) paired with a strong Negative Keyword list", isCorrect: true },
        { id: "c", text: "Only bid on single-word keywords like 'dentist' or 'coffee'", isCorrect: false },
        { id: "d", text: "Never use keywords; use only automated Smart Display campaigns", isCorrect: false }
      ],
      explanation: "Phrase and Exact match protect limited client funds from non-commercial query bleed, ensuring every dollar targets high-intent local prospects.",
      reflectionPrompt: "Why should an agency never deploy pure Broad Match on Day 1 of a new campaign?"
    },
    {
      id: 5,
      question: "What is the difference between a 'Keyword' and a 'Search Term' in Google Ads?",
      options: [
        { id: "a", text: "They are completely identical synonyms", isCorrect: false },
        { id: "b", text: "A Keyword is what you bid on in your account; a Search Term is the exact phrase a human user typed into Google", isCorrect: true },
        { id: "c", text: "Keywords are paid; search terms are always free", isCorrect: false },
        { id: "d", text: "Keywords only apply to mobile devices", isCorrect: false }
      ],
      explanation: "Understanding this distinction is crucial: you bid on Keywords, but the human user types Search Terms. Mining search terms reveals actual consumer behavior.",
      reflectionPrompt: "Why is mining the raw Search Terms report weekly the #1 task of a professional media buyer?"
    }
  ],

  // Lesson 307: The Real Math of Google Auctions: Ad Rank & Quality Score
  307: [
    {
      id: 1,
      question: "What is the formula Google uses to determine Ad Rank and auction placement?",
      options: [
        { id: "a", text: "Ad Rank = Maximum CPC Bid × Quality Score", isCorrect: true },
        { id: "b", text: "Ad Rank = Total Account Budget ÷ Number of Clicks", isCorrect: false },
        { id: "c", text: "Ad Rank = Highest Bidder Wins Automatically", isCorrect: false },
        { id: "d", text: "Ad Rank = Number of Website Pages × Bounce Rate", isCorrect: false }
      ],
      explanation: "Ad Rank is the product of your maximum bid and your Quality Score. A superior Quality Score allows you to beat competitors who bid significantly more.",
      reflectionPrompt: "How does the Ad Rank formula prevent wealthy advertisers from monopolizing search results with spammy ads?"
    },
    {
      id: 2,
      question: "If Competitor B bids $8.00 with a Quality Score of 3 (Ad Rank 24), and Dr. Miller bids $5.00 with a Quality Score of 9 (Ad Rank 45), who wins Position 1?",
      options: [
        { id: "a", text: "Competitor B wins because they bid $3.00 more", isCorrect: false },
        { id: "b", text: "Dr. Miller wins Position 1 because his Ad Rank (45) is higher than Competitor B's (24)", isCorrect: true },
        { id: "c", text: "Neither; Google splits the impressions 50/50", isCorrect: false },
        { id: "d", text: "Google places both in bottom positions", isCorrect: false }
      ],
      explanation: "Dr. Miller wins the top spot because 5 × 9 = 45, which beats Competitor B's 8 × 3 = 24. Higher quality beats pure bid brute-force.",
      reflectionPrompt: "Why is competing on Quality Score more sustainable for small businesses than entering a bidding price war?"
    },
    {
      id: 3,
      question: "What are the 3 core pillars Google evaluates to calculate a keyword's Quality Score (1 to 10)?",
      options: [
        { id: "a", text: "Social media followers, company revenue, and age of domain", isCorrect: false },
        { id: "b", text: "Expected CTR, Ad Relevance, and Landing Page Experience", isCorrect: true },
        { id: "c", text: "Credit card limit, Google review count, and office size", isCorrect: false },
        { id: "d", text: "Daily ad spend, number of employees, and font size", isCorrect: false }
      ],
      explanation: "Quality Score consists of Expected Click-Through Rate, Ad Relevance (keyword to ad match), and Landing Page Experience (speed, relevance, clarity).",
      reflectionPrompt: "Which of the 3 Quality Score pillars is most directly influenced by your landing page load speed and design?"
    },
    {
      id: 4,
      question: "According to the Actual CPC formula, what do you actually pay when someone clicks your ad?",
      options: [
        { id: "a", text: "Your maximum bid in full every single time", isCorrect: false },
        { id: "b", text: "The minimum amount required to beat the Ad Rank of the competitor immediately below you + $0.01", isCorrect: true },
        { id: "c", text: "Exactly $1.00 per click on all searches", isCorrect: false },
        { id: "d", text: "Half of your daily campaign budget", isCorrect: false }
      ],
      explanation: "Actual CPC = (Ad Rank of competitor below / Your Quality Score) + $0.01. This is a second-price auction mechanism that rewards high Quality Scores with lower CPCs.",
      reflectionPrompt: "Why does improving your Quality Score from 5/10 to 9/10 lower your actual cost per click?"
    },
    {
      id: 5,
      question: "What happens to an ad group's economics if its Quality Score drops to 2/10?",
      options: [
        { id: "a", text: "Google gives you a 50% discount to help you improve", isCorrect: false },
        { id: "b", text: "You face a severe CPC penalty (paying up to 400% more per click) and your ads rarely show", isCorrect: true },
        { id: "c", text: "Your organic SEO traffic increases to compensate", isCorrect: false },
        { id: "d", text: "Nothing; Quality Score is just a suggestion", isCorrect: false }
      ],
      explanation: "A 1/10 or 2/10 Quality Score imposes a severe financial penalty, making clicks drastically more expensive and suppressing ad impressions.",
      reflectionPrompt: "Why is diagnosing low Quality Scores the fastest way to rescue an unprofitable PPC campaign?"
    }
  ],

  // Lesson 310: Bidding Strategies: Manual CPC vs. Smart Bidding
  310: [
    {
      id: 1,
      question: "Why is turning on Target CPA (tCPA) or Maximize Conversions on Day 1 of a brand new campaign considered a fatal mistake?",
      options: [
        { id: "a", text: "Google will delete your campaign settings", isCorrect: false },
        { id: "b", text: "Google's machine learning algorithm has zero historical conversion data, leading to erratic testing and rapid budget burn", isCorrect: true },
        { id: "c", text: "Smart Bidding is only available to Fortune 500 companies", isCorrect: false },
        { id: "d", text: "It causes Google to reject all ad headlines", isCorrect: false }
      ],
      explanation: "Smart Bidding needs at least 15-30 historical conversions in a 30-day window to model buyer behavior. Without data, it bids blindly on high-cost auctions.",
      reflectionPrompt: "What data does Google's algorithm need before it can accurately predict which searchers will convert?"
    },
    {
      id: 2,
      question: "What is the recommended bidding strategy for Phase 1 (Launch) of a new client campaign?",
      options: [
        { id: "a", text: "Manual CPC (or Enhanced CPC) with strict maximum bid caps", isCorrect: true },
        { id: "b", text: "Target ROAS set at 1000%", isCorrect: false },
        { id: "c", text: "Maximize Clicks with zero bid limits", isCorrect: false },
        { id: "d", text: "Target Impression Share at 100%", isCorrect: false }
      ],
      explanation: "Manual CPC allows the media buyer to enforce strict cost controls, collect initial search term data, and build conversion volume safely.",
      reflectionPrompt: "Why is maintaining manual control over maximum click bids essential during the first 3 weeks of a campaign?"
    },
    {
      id: 3,
      question: "What happens if a client insists on setting an unrealistic Target CPA of $10 in an industry where average CPC is $8 and conversion rate is 5%?",
      options: [
        { id: "a", text: "Google will force competitors to lower their prices", isCorrect: false },
        { id: "b", text: "Google's algorithm will fail to find auctions meeting that target and ad impressions will drop to zero", isCorrect: true },
        { id: "c", text: "The campaign will generate 10x more leads", isCorrect: false },
        { id: "d", text: "Google automatically converts the ads to organic listings", isCorrect: false }
      ],
      explanation: "If math dictates that acquiring a customer costs $160 (20 clicks × $8 CPC), setting a $10 tCPA makes winning auctions mathematically impossible. The campaign stalls.",
      reflectionPrompt: "Why must Target CPA be grounded in realistic unit economics rather than arbitrary client wishes?"
    },
    {
      id: 4,
      question: "How does 'Maximize Clicks' behave when no maximum bid cap is configured?",
      options: [
        { id: "a", text: "It buys the most valuable executive leads in the country", isCorrect: false },
        { id: "b", text: "Google spends your daily budget on the cheapest, lowest-intent clicks or burns $20 on a single random click", isCorrect: true },
        { id: "c", text: "It guarantees a 10% conversion rate", isCorrect: false },
        { id: "d", text: "It freezes ad delivery on weekdays", isCorrect: false }
      ],
      explanation: "Maximize Clicks prioritizes quantity over quality. Without a bid cap, it can spend excessive amounts on individual clicks or buy junk traffic.",
      reflectionPrompt: "Why is high click volume meaningless if none of those visitors convert into paying customers?"
    },
    {
      id: 5,
      question: "In the 3-Phase Bidding Lifecycle, at what point should an account graduate to automated Target CPA?",
      options: [
        { id: "a", text: "After 24 hours of running ads", isCorrect: false },
        { id: "b", text: "When the account has accumulated 30+ consistent monthly conversions and negative keywords have stabilized", isCorrect: true },
        { id: "c", text: "Only when the client doubles their retainer fee", isCorrect: false },
        { id: "d", text: "Never; agencies should always manage bids by hand forever", isCorrect: false }
      ],
      explanation: "Smart Bidding excels once it has sufficient clean conversion signals (30+ conversions/mo) to train the machine learning model.",
      reflectionPrompt: "How does having 30+ verified conversions transform automated bidding from a gamble into a precision engine?"
    }
  ],

  // Lesson 313: Conversion Tracking Hygiene: Primary vs. Secondary Actions
  313: [
    {
      id: 1,
      question: "What is the crucial difference between a 'Primary' and a 'Secondary' conversion action in Google Ads?",
      options: [
        { id: "a", text: "Primary conversions are tracked in color; Secondary conversions are black and white", isCorrect: false },
        { id: "b", text: "Primary actions are used for Smart Bidding optimization and ROI reporting; Secondary actions are for observational reporting only", isCorrect: true },
        { id: "c", text: "Primary actions are free; Secondary actions cost $5 each", isCorrect: false },
        { id: "d", text: "Primary actions only count on desktop computers", isCorrect: false }
      ],
      explanation: "Primary actions directly train Google's bidding algorithm. Secondary actions are tracked for human insight without distorting automated bids.",
      reflectionPrompt: "What happens to Google's bidding algorithm if you mark low-intent actions as Primary conversions?"
    },
    {
      id: 2,
      question: "Why is marking 'Page Views > 2' or 'Clicked Directions' as a Primary conversion a toxic mistake for a local clinic?",
      options: [
        { id: "a", text: "Google will optimize bidding to find users who browse pages or view maps rather than patients who actually book appointments", isCorrect: true },
        { id: "b", text: "It violates federal HIPAA regulations", isCorrect: false },
        { id: "c", text: "It causes Google Analytics to disconnect", isCorrect: false },
        { id: "d", text: "It prevents phone calls from connecting", isCorrect: false }
      ],
      explanation: "Google's AI does exactly what you tell it to do. If you tell it a page view is a conversion, it will buy thousands of cheap page views and zero booked patients.",
      reflectionPrompt: "Why do inflated conversion rates on vanity metrics create friction between agencies and clients?"
    },
    {
      id: 3,
      question: "When setting up Dynamic Call Tracking for Dr. Miller Dental, why should the phone call conversion threshold be set to at least 60 seconds?",
      options: [
        { id: "a", text: "Because Google charges less for 60-second phone calls", isCorrect: false },
        { id: "b", text: "To filter out misdials, voicemails, and hang-ups so only substantive patient inquiries train the algorithm", isCorrect: true },
        { id: "c", text: "Because telephone carriers block calls under 1 minute", isCorrect: false },
        { id: "d", text: "It is a requirement of dental licensing boards", isCorrect: false }
      ],
      explanation: "A 10-second call is a wrong number, an immediate hang-up, or a busy signal. Setting a 60-second minimum ensures only real patient conversations are counted.",
      reflectionPrompt: "How does filtering out 15-second hang-ups improve the quality of machine learning bidding signals?"
    },
    {
      id: 4,
      question: "If Dr. Miller spends $1,500 on Google Ads and acquires 30 verified new patients, what is his Customer Acquisition Cost (CAC)?",
      options: [
        { id: "a", text: "$50.00 per patient", isCorrect: true },
        { id: "b", text: "$15.00 per patient", isCorrect: false },
        { id: "c", text: "$300.00 per patient", isCorrect: false },
        { id: "d", text: "$5.00 per patient", isCorrect: false }
      ],
      explanation: "CAC = Total Ad Spend ($1,500) ÷ Total Acquired Customers (30) = $50.00 per new patient.",
      reflectionPrompt: "Why is Customer Acquisition Cost (CAC) more important to a business owner than Cost Per Click (CPC)?"
    },
    {
      id: 5,
      question: "If those 30 patients generate $10,500 in immediate procedural revenue from that $1,500 ad spend, what is the immediate Return on Ad Spend (ROAS)?",
      options: [
        { id: "a", text: "150% ROAS", isCorrect: false },
        { id: "b", text: "700% ROAS (7.0x)", isCorrect: true },
        { id: "c", text: "35% ROAS", isCorrect: false },
        { id: "d", text: "70% ROAS", isCorrect: false }
      ],
      explanation: "ROAS = (Revenue ÷ Ad Spend) × 100% = ($10,500 ÷ $1,500) × 100% = 700% (or 7.0x return).",
      reflectionPrompt: "How do you explain a 700% ROAS to a client in terms of dollars returned for every dollar spent?"
    }
  ],

  // Lesson 314: Emergency Ad Disapprovals & Director Atlas Crisis Drill
  314: [
    {
      id: 1,
      question: "Why did Google's compliance bot flag the headline 'Guaranteed Pain Relief Today' for Dr. Miller's dental campaign?",
      options: [
        { id: "a", text: "Because it violated character count limits", isCorrect: false },
        { id: "b", text: "Because Google policy strictly prohibits unsubstantiated medical claims and health outcome guarantees", isCorrect: true },
        { id: "c", text: "Because the clinic does not have a physical address", isCorrect: false },
        { id: "d", text: "Because the word 'Today' is copyrighted by Google", isCorrect: false }
      ],
      explanation: "Google Ads Healthcare policy prohibits advertisers from guaranteeing specific medical or pain relief outcomes without clinical proof.",
      reflectionPrompt: "Why does Google hold healthcare and financial advertising to stricter policy standards than retail goods?"
    },
    {
      id: 2,
      question: "Which of the following replacement headlines complies with Google's medical policy while maintaining high commercial urgency?",
      options: [
        { id: "a", text: "\"100% Miracle Tooth Cure\"", isCorrect: false },
        { id: "b", text: "\"Same-Day Toothache Relief\"", isCorrect: true },
        { id: "c", text: "\"Guaranteed Fix Or Free\"", isCorrect: false },
        { id: "d", text: "\"Permanent Pain Elimination\"", isCorrect: false }
      ],
      explanation: "'Same-Day Toothache Relief' (25 chars) promises fast service timing without making a prohibited medical guarantee.",
      reflectionPrompt: "How can you convey high urgency in ad copy without making unsubstantiated guarantees?"
    },
    {
      id: 3,
      question: "When facing an emergency ad disapproval and zero impressions, what is the first step you should take?",
      options: [
        { id: "a", text: "Delete the entire Google Ads account and start over", isCorrect: false },
        { id: "b", text: "Open the Policy Manager to diagnose the exact violating asset, edit the copy to full compliance, and submit an appeal", isCorrect: true },
        { id: "c", text: "Double the daily budget to override the disapproval", isCorrect: false },
        { id: "d", text: "Ignore it and wait for Google to fix itself", isCorrect: false }
      ],
      explanation: "The professional protocol is: diagnose the offending text in Policy Manager, edit the copy to satisfy guidelines, and request an expedited automated review.",
      reflectionPrompt: "Why does panic-editing or deleting campaigns make an ad disapproval crisis worse?"
    },
    {
      id: 4,
      question: "In the Director Atlas Crisis Drill, how should a senior media buyer report an ad disapproval to the agency managing director?",
      options: [
        { id: "a", text: "Blame Google and tell the director there is nothing anyone can do", isCorrect: false },
        { id: "b", text: "Present the root cause, the immediate corrective action taken, the compliant copy replacement, and the estimated time to re-approval", isCorrect: true },
        { id: "c", text: "Hide the email and hope the director doesn't notice the drop in spend", isCorrect: false },
        { id: "d", text: "Tell the client to call Google customer support directly", isCorrect: false }
      ],
      explanation: "Executive communication requires ownership: explain what happened, the exact fix already implemented, and the path to resolution.",
      reflectionPrompt: "Why does taking immediate proactive ownership in an agency crisis protect your professional reputation?"
    },
    {
      id: 5,
      question: "What preventative safeguard should every agency implement to prevent policy disapprovals before ads launch?",
      options: [
        { id: "a", text: "A pre-flight policy compliance checklist auditing claims, superlatives, guarantees, and character limits", isCorrect: true },
        { id: "b", text: "Only running text ads with no headlines", isCorrect: false },
        { id: "c", text: "Paying Google an annual compliance fee", isCorrect: false },
        { id: "d", text: "Never updating ad copy once it is live", isCorrect: false }
      ],
      explanation: "A structured pre-flight QA checklist catches superlatives ('#1 Best'), medical guarantees, and formatting errors before ads ever enter the review queue.",
      reflectionPrompt: "How does a standard agency QA checklist save hours of emergency troubleshooting?"
    }
  ],

  // Lesson 315: Week 3 Capstone: Full Paid Search Campaign Launch
  315: [
    {
      id: 1,
      question: "What is the primary objective of the Week 3 Paid Search Capstone for Dr. Miller Dental?",
      options: [
        { id: "a", text: "Spend $1,500 as quickly as possible", isCorrect: false },
        { id: "b", text: "Deliver an audited, profitable Google Search engine with STAG architecture, Quality Score >= 8/10, and verified CAC under $42.00", isCorrect: true },
        { id: "c", text: "Rank #1 on Google Maps organically without ads", isCorrect: false },
        { id: "d", text: "Post 30 social media reels on TikTok", isCorrect: false }
      ],
      explanation: "The Capstone synthesizes account architecture, match types, negative shields, RSA ad copy, and dayparting into a profitable patient acquisition engine.",
      reflectionPrompt: "Why does synthesizing all 5 PPC levers produce exponentially better results than tweaking one setting in isolation?"
    },
    {
      id: 2,
      question: "In the Capstone campaign, how does combining Phrase and Exact match keywords with a 25+ Master Negative Shield protect client margins?",
      options: [
        { id: "a", text: "It completely blocks non-commercial queries (jobs, free, DIY) while capturing high-intent commercial demand", isCorrect: true },
        { id: "b", text: "It prevents Google from taking taxes out of ad spend", isCorrect: false },
        { id: "c", text: "It guarantees that no competitor can bid on Dr. Miller's brand", isCorrect: false },
        { id: "d", text: "It eliminates the need for landing page testing", isCorrect: false }
      ],
      explanation: "Pairing controlled match types with aggressive negative shields channels 100% of the client's budget exclusively into qualified, ready-to-book searches.",
      reflectionPrompt: "What is the compounding financial benefit over 12 months of eliminating $300/mo in junk click spend?"
    },
    {
      id: 3,
      question: "Why are Ad Assets (Sitelinks, Callouts, Call Extensions) essential for winning local emergency dental clients on mobile devices?",
      options: [
        { id: "a", text: "They make the ad physically taller on screen, pushing competitors downward and giving one-tap calling to patients in pain", isCorrect: true },
        { id: "b", text: "They reduce your Google Ads billing rate to zero", isCorrect: false },
        { id: "c", text: "They replace the need for having a website", isCorrect: false },
        { id: "d", text: "They allow ads to play sound effects on mobile", isCorrect: false }
      ],
      explanation: "Extensions dominate mobile screen real estate and provide friction-free tap-to-call buttons for patients experiencing acute dental pain.",
      reflectionPrompt: "Why is minimizing cognitive friction and steps-to-contact vital for high-urgency local services?"
    },
    {
      id: 4,
      question: "How does implementing Dayparting (shutting ads off when the clinic is closed) improve campaign conversion rate?",
      options: [
        { id: "a", text: "It ensures ads only show when staff are present to answer phone calls and book patient appointments immediately", isCorrect: true },
        { id: "b", text: "It forces Google to double the bid on weekends", isCorrect: false },
        { id: "c", text: "It tricks Google into thinking the business is bigger than it is", isCorrect: false },
        { id: "d", text: "It makes ads run for free on holidays", isCorrect: false }
      ],
      explanation: "Leads that hit an answering machine or voicemail convert at less than 15% of those answered live within 60 seconds. Dayparting eliminates wasted after-hours spend.",
      reflectionPrompt: "Why does lead response speed directly determine your effective cost per customer?"
    },
    {
      id: 5,
      question: "What is the ultimate proof of work generated by the Krechet Academy Capstone simulation?",
      options: [
        { id: "a", text: "An unverified participation badge", isCorrect: false },
        { id: "b", text: "An audited, telemetry-verified Paid Search Case Study exported directly into your professional career portfolio", isCorrect: true },
        { id: "c", text: "A receipt for simulated ad spend", isCorrect: false },
        { id: "d", text: "A generic certificate of completion with no performance data", isCorrect: false }
      ],
      explanation: "Krechet Academy provides verified proof of work: real telemetry, audited metrics (CTR, QS, CPA, ROAS), and defensible client problem-solving for your career portfolio.",
      reflectionPrompt: "Why does an audited proof-of-work case study carry more weight in agency job interviews than a generic course certificate?"
    }
  ],

  // ==========================================
  // WEEK 4: Conversion Rate Optimization (CRO)
  // ==========================================
  // Lesson 401: Psychology of CRO & LIFT Model
  401: [
    {
      id: 1,
      question: "According to conversion rate economics, what happens to customer acquisition cost (CAC) when you double your website's conversion rate at constant ad spend?",
      options: [
        { id: "a", text: "CAC doubles", isCorrect: false },
        { id: "b", text: "CAC is cut exactly in half", isCorrect: true },
        { id: "c", text: "CAC stays unchanged", isCorrect: false },
        { id: "d", text: "CAC drops to zero immediately", isCorrect: false }
      ],
      explanation: "If you acquire twice as many customers from the same ad spend, your cost per customer (CAC) drops by 50%. CRO is the highest-leverage profit engine in marketing.",
      reflectionPrompt: "Why is doubling conversion rate more profitable than doubling paid ad traffic?"
    },
    {
      id: 2,
      question: "In the LIFT Model, what are the two friction drag forces that actively pull conversion rates downward?",
      options: [
        { id: "a", text: "Relevance and Clarity", isCorrect: false },
        { id: "b", text: "Anxiety and Distraction", isCorrect: true },
        { id: "c", text: "Urgency and Value Proposition", isCorrect: false },
        { id: "d", text: "SEO and Pay-Per-Click", isCorrect: false }
      ],
      explanation: "Anxiety (fear of spam, fraud, or hidden costs) and Distraction (too many competing links, popups, and visual noise) drag down conversions.",
      reflectionPrompt: "How does removing secondary header navigation links eliminate cognitive distraction for a paid traffic visitor?"
    },
    {
      id: 3,
      question: "What is the 'Rule of One' for high-converting direct-response PPC landing pages?",
      options: [
        { id: "a", text: "Every page must have only one sentence", isCorrect: false },
        { id: "b", text: "One Target Audience + One Clear Offer + One Primary Call to Action", isCorrect: true },
        { id: "c", text: "Only allow one visitor on the site at a time", isCorrect: false },
        { id: "d", text: "Run ads for only one hour per day", isCorrect: false }
      ],
      explanation: "The Rule of One enforces psychological focus: when a visitor has only one clear choice to make, cognitive friction drops and conversion rates surge.",
      reflectionPrompt: "What happens to a visitor's decision-making process when a landing page offers 3 different primary buttons?"
    },
    {
      id: 4,
      question: "In Jenny's Artisan Java teardown, why did 74% of cart abandoners drop off at the final checkout step?",
      options: [
        { id: "a", text: "They disliked the coffee bean flavors", isCorrect: false },
        { id: "b", text: "They were hit with a surprise $9.95 flat-rate shipping fee that was not disclosed upfront", isCorrect: true },
        { id: "c", text: "Her website was down", isCorrect: false },
        { id: "d", text: "The font size was too large", isCorrect: false }
      ],
      explanation: "Surprise fees at checkout trigger an immediate surge of buyer anxiety and resentment. Transparent shipping terms or free shipping thresholds eliminate this friction.",
      reflectionPrompt: "Why do unexpected shipping fees trigger more cart abandonment than a higher upfront product price?"
    },
    {
      id: 5,
      question: "In Cognitive Load Theory, how does presenting too many complex options affect user behavior?",
      options: [
        { id: "a", text: "Users buy more products to be safe", isCorrect: false },
        { id: "b", text: "Users experience analysis paralysis and take the path of least resistance: closing the tab", isCorrect: true },
        { id: "c", text: "It increases time on page and improves SEO", isCorrect: false },
        { id: "d", text: "It causes computers to freeze", isCorrect: false }
      ],
      explanation: "When faced with excessive choices or confusing layouts, human brains default to inaction. Simplicity and radical clarity drive conversions.",
      reflectionPrompt: "How does radical clarity reduce the mental effort needed to complete an order?"
    }
  ],

  // Lesson 410: Scientific Method of A/B Testing & p-Values
  410: [
    {
      id: 1,
      question: "What is the industry benchmark for Statistical Significance in scientific A/B split testing?",
      options: [
        { id: "a", text: "50% Confidence (p < 0.50)", isCorrect: false },
        { id: "b", text: "95% Confidence (p < 0.05)", isCorrect: true },
        { id: "c", text: "100% Certainty with zero margin of error", isCorrect: false },
        { id: "d", text: "75% Confidence (p < 0.25)", isCorrect: false }
      ],
      explanation: "A 95% Confidence level (p < 0.05) proves there is less than a 5% probability that the observed conversion lift was due to random chance.",
      reflectionPrompt: "Why is declaring an A/B test winner at 70% confidence a dangerous gamble for a client's revenue?"
    },
    {
      id: 2,
      question: "What is the 'Peeking Problem' that causes amateur marketers to implement losing A/B test variants?",
      options: [
        { id: "a", text: "Looking at a competitor's website during an active test", isCorrect: false },
        { id: "b", text: "Checking test metrics after 24 hours and stopping the test early before reaching required sample size", isCorrect: true },
        { id: "c", text: "Allowing users to see both versions at the same time", isCorrect: false },
        { id: "d", text: "Using heatmaps without user consent", isCorrect: false }
      ],
      explanation: "At small sample sizes, random statistical variance creates false positive spikes. Stopping tests prematurely leads to adopting variants that actually hurt revenue.",
      reflectionPrompt: "Why does sample size matter when evaluating conversion rate percentages?"
    },
    {
      id: 3,
      question: "Why must standard A/B tests isolate and test only ONE variable at a time (e.g., Headline vs. Headline)?",
      options: [
        { id: "a", text: "Because browsers cannot render two changes simultaneously", isCorrect: false },
        { id: "b", text: "So you know with certainty which specific change caused the conversion lift", isCorrect: true },
        { id: "c", text: "Because Google Ads charges fees per modified element", isCorrect: false },
        { id: "d", text: "To keep landing pages black and white", isCorrect: false }
      ],
      explanation: "If you change the headline, color, price, and images simultaneously, you introduce multivariate chaos and cannot determine what drove the result.",
      reflectionPrompt: "What is the difference between a disciplined single-variable A/B test and multivariate chaos?"
    },
    {
      id: 4,
      question: "In the PIE Prioritization Framework, what do the letters P, I, and E stand for?",
      options: [
        { id: "a", text: "Profit, Investment, Expense", isCorrect: false },
        { id: "b", text: "Potential, Importance, Ease", isCorrect: true },
        { id: "c", text: "Product, Innovation, Execution", isCorrect: false },
        { id: "d", text: "Performance, Impressions, Engagement", isCorrect: false }
      ],
      explanation: "PIE scores test ideas by Potential (uplift possible), Importance (traffic volume & value), and Ease (technical effort to launch).",
      reflectionPrompt: "How does the PIE framework help an agency decide which of 10 landing page test ideas to build first?"
    },
    {
      id: 5,
      question: "What is the recommended approach for a small business website that only receives 200 visitors per month?",
      options: [
        { id: "a", text: "Run 5 complex A/B tests at the same time", isCorrect: false },
        { id: "b", text: "Focus on bold qualitative CRO fixes (clarity, offer, social proof, speed) rather than waiting 12 months for statistical significance", isCorrect: true },
        { id: "c", text: "Shut down the website completely", isCorrect: false },
        { id: "d", text: "Buy fake bot traffic to reach sample size faster", isCorrect: false }
      ],
      explanation: "At very low traffic volumes, reaching statistical significance takes months. Marketers should implement proven best practices directly instead of split testing.",
      reflectionPrompt: "Why is statistical significance difficult to achieve on low-traffic local websites?"
    }
  ],

  // ==========================================
  // WEEK 5: Paid Social Media Advertising
  // ==========================================
  // Lesson 501: Search vs. Social & 3-Second Hook Rule
  501: [
    {
      id: 1,
      question: "What is the fundamental difference between Google Search Ads and Meta/TikTok Ads?",
      options: [
        { id: "a", text: "Google is free; Meta is paid", isCorrect: false },
        { id: "b", text: "Google captures existing demand (Demand Harvesting); Meta creates new demand through scroll interruption (Demand Generation)", isCorrect: true },
        { id: "c", text: "Google only works on desktop computers; Meta only works on mobile", isCorrect: false },
        { id: "d", text: "There is no strategic difference between them", isCorrect: false }
      ],
      explanation: "Search users are actively looking for solutions. Social users are browsing for entertainment, requiring high-energy thumb-stopping hooks to create desire.",
      reflectionPrompt: "Why does an ad that converts well on Google Search often fail completely when copied over to Meta Feeds?"
    },
    {
      id: 2,
      question: "In the Meta Ad Auction formula, what are the 3 factors that determine which ad wins delivery into a user's feed?",
      options: [
        { id: "a", text: "Advertiser Bid × Estimated Action Rate + User Value Score", isCorrect: true },
        { id: "b", text: "Highest Cash Bid × Number of Facebook Friends", isCorrect: false },
        { id: "c", text: "Total Company Revenue ÷ Number of Employee Accounts", isCorrect: false },
        { id: "d", text: "Length of Video in Minutes × Follower Count", isCorrect: false }
      ],
      explanation: "Meta balances cash bids with Estimated Action Rate and User Value (ad relevance, low negative feedback) to protect the user experience.",
      reflectionPrompt: "How does having a high User Value score lower your ad delivery costs on Facebook and Instagram?"
    },
    {
      id: 3,
      question: "How is the 'Hook Rate' (Thumb-Stop Ratio) calculated for short-form video ads?",
      options: [
        { id: "a", text: "Total Video Likes ÷ Total Comments", isCorrect: false },
        { id: "b", text: "(3-Second Video Plays ÷ Total Impressions) × 100%", isCorrect: true },
        { id: "c", text: "Video Length ÷ Number of Words Spoken", isCorrect: false },
        { id: "d", text: "Total Purchases ÷ Video Views", isCorrect: false }
      ],
      explanation: "Hook Rate measures the percentage of impressions that pause scrolling to watch at least 3 seconds. Top agency performers hit 30% to 35%+.",
      reflectionPrompt: "Why is Hook Rate the #1 diagnostic metric to inspect when a video ad has a high cost per click?"
    },
    {
      id: 4,
      question: "Why did Jenny's polished studio photograph of a coffee bag on a white table fail on Facebook feeds?",
      options: [
        { id: "a", text: "The image resolution was too high", isCorrect: false },
        { id: "b", text: "It looked like a corporate commercial billboard, triggering instant banner blindness and feed scroll past", isCorrect: true },
        { id: "c", text: "Facebook prohibits pictures of coffee", isCorrect: false },
        { id: "d", text: "The bag color was offensive to users", isCorrect: false }
      ],
      explanation: "Social users tune out corporate billboards. Ads that look native, organic, and conversational earn attention; glossy corporate ads get skipped.",
      reflectionPrompt: "What is 'banner blindness' and how does authentic creative bypass it?"
    },
    {
      id: 5,
      question: "Which of the 5 psychological hook angles challenges conventional assumptions with statements like 'Stop buying coffee with an expiration date'?",
      options: [
        { id: "a", text: "The Contrarian / Myth-Buster Angle", isCorrect: true },
        { id: "b", text: "The Corporate Discount Angle", isCorrect: false },
        { id: "c", text: "The Vague Apology Angle", isCorrect: false },
        { id: "d", text: "The ASMR Whisper Angle", isCorrect: false }
      ],
      explanation: "Contrarian hooks create cognitive dissonance by challenging accepted habits, forcing users to pause and learn why their current behavior is flawed.",
      reflectionPrompt: "Why does challenging conventional wisdom stop a user's scroll faster than an ordinary sales pitch?"
    }
  ],

  // Lesson 504: Post-iOS 14.5 Tracking: Pixel vs. CAPI
  504: [
    {
      id: 1,
      question: "What major industry change in Apple's iOS 14.5 update broke traditional browser-based tracking pixels?",
      options: [
        { id: "a", text: "Apple banned all advertisements on iPhones", isCorrect: false },
        { id: "b", text: "App Tracking Transparency (ATT), where over 80% of iPhone users opted out of cross-app data tracking", isCorrect: true },
        { id: "c", text: "Apple disabled Safari web browsing", isCorrect: false },
        { id: "d", text: "Apple required a monthly fee to view Meta ads", isCorrect: false }
      ],
      explanation: "iOS 14.5 introduced App Tracking Transparency (ATT), blocking third-party browser cookies and leaving client-side pixels blind to 20-30% of purchases.",
      reflectionPrompt: "Why did relying solely on browser cookies become a fatal strategy after iOS 14.5?"
    },
    {
      id: 2,
      question: "How does Meta's Conversions API (CAPI) bypass ad blockers and browser cookie restrictions?",
      options: [
        { id: "a", text: "By transmitting encrypted purchase and lead data directly from your web server to Meta's servers", isCorrect: true },
        { id: "b", text: "By legally suing Apple to force data sharing", isCorrect: false },
        { id: "c", text: "By storing cookies on the user's home Wi-Fi router", isCorrect: false },
        { id: "d", text: "By emailing spreadsheets to Meta employees", isCorrect: false }
      ],
      explanation: "CAPI creates a direct server-to-server connection. Since data flows through your own cloud backend, browser ad blockers and Safari caps cannot intercept it.",
      reflectionPrompt: "How does server-side tracking protect conversion measurement from browser extensions and ad blockers?"
    },
    {
      id: 3,
      question: "What is 'Event Match Quality' (EMQ) in Meta's Conversions API?",
      options: [
        { id: "a", text: "A score measuring how loud the audio is in video ads", isCorrect: false },
        { id: "b", text: "A 1-10 rating measuring how reliably your server payload matches events to real Meta user profiles using hashed customer parameters", isCorrect: true },
        { id: "c", text: "The number of matching colors in an image ad", isCorrect: false },
        { id: "d", text: "The speed of the client's internet connection", isCorrect: false }
      ],
      explanation: "EMQ scores how well your server data (hashed email, phone, city, IP) matches real Facebook/Instagram accounts. Higher EMQ = better algorithmic optimization.",
      reflectionPrompt: "Why does sending hashed first-party customer parameters improve ad delivery efficiency?"
    },
    {
      id: 4,
      question: "In modern paid social media buying, what does the phrase 'Creative is the Targeting' mean?",
      options: [
        { id: "a", text: "You must draw targeting circles on top of image ads", isCorrect: false },
        { id: "b", text: "Rather than stacking complex interest filters, you use broad targeting and let the specific messaging of your video attract the ideal buyer", isCorrect: true },
        { id: "c", text: "You only target graphic designers", isCorrect: false },
        { id: "d", text: "Facebook no longer allows advertisers to pick countries", isCorrect: false }
      ],
      explanation: "Meta's AI analyzes who pauses and watches your video. If your video addresses pour-over coffee nerds, Meta's algorithm finds coffee nerds automatically.",
      reflectionPrompt: "How does broad targeting with strong creative outperform narrow interest-stacked targeting?"
    },
    {
      id: 5,
      question: "Why must every agency campaign structure ALWAYS exclude recent purchasers (past 30-90 days) from cold prospecting ad sets?",
      options: [
        { id: "a", text: "To prevent wasting ad spend showing introductory discount ads to people who already bought yesterday", isCorrect: true },
        { id: "b", text: "Because Facebook bans customers from buying twice", isCorrect: false },
        { id: "c", text: "To force past customers to write reviews", isCorrect: false },
        { id: "d", text: "Because past buyers cause campaigns to get disapproved", isCorrect: false }
      ],
      explanation: "Serving introductory acquisition ads to recent buyers annoys loyal customers and burns budget on people who have already converted.",
      reflectionPrompt: "What message does an e-commerce brand send when it shows a '15% Off Your First Order' ad to someone who ordered 24 hours ago?"
    }
  ],

  // ==========================================
  // WEEK 6: Analytics Mastery & Speed-to-Lead Automation
  // ==========================================
  // Lesson 601: GA4 Event Schema & GTM Architecture
  601: [
    {
      id: 1,
      question: "What is the foundational architectural difference between Universal Analytics (UA) and Google Analytics 4 (GA4)?",
      options: [
        { id: "a", text: "UA was free; GA4 costs $500 per month", isCorrect: false },
        { id: "b", text: "UA was session- and pageview-based; GA4 is 100% event-driven, where every interaction is an Event with parameters", isCorrect: true },
        { id: "c", text: "GA4 only tracks mobile app games", isCorrect: false },
        { id: "d", text: "UA was owned by Google; GA4 is owned by Microsoft", isCorrect: false }
      ],
      explanation: "GA4 discarded the 2005 pageview/session model in favor of a flexible event-driven architecture, standardizing tracking across web and mobile apps.",
      reflectionPrompt: "How does treating every interaction as an Event with parameters provide deeper behavioral tracking than simple pageviews?"
    },
    {
      id: 2,
      question: "What is the function of the Google Tag Manager (GTM) DataLayer?",
      options: [
        { id: "a", text: "It stores user credit card numbers for offline billing", isCorrect: false },
        { id: "b", text: "It acts as a neutral JavaScript bridge that holds website variables and passes them cleanly to GA4, Meta CAPI, and Google Ads tags", isCorrect: true },
        { id: "c", text: "It replaces the need for a web hosting server", isCorrect: false },
        { id: "d", text: "It automatically generates blog content for SEO", isCorrect: false }
      ],
      explanation: "The DataLayer decouples website code from tracking tags. When a user buys, one DataLayer push safely feeds GA4, Meta, Google Ads, and TikTok tags simultaneously.",
      reflectionPrompt: "Why is managing tags through a GTM DataLayer safer for a website than hardcoding tracking pixels into HTML templates?"
    },
    {
      id: 3,
      question: "In Jenny's analytics audit, why was GA4 reporting double the actual revenue collected in her bank account?",
      options: [
        { id: "a", text: "Google was charging double currency exchange fees", isCorrect: false },
        { id: "b", text: "The purchase confirmation page lacked deduplication logic, re-firing the 'purchase' event every time a buyer refreshed the success screen", isCorrect: true },
        { id: "c", text: "Competitors were sending fake orders through an API", isCorrect: false },
        { id: "d", text: "Her Shopify store was hacked", isCorrect: false }
      ],
      explanation: "Without passing a unique transaction_id or checking localStorage, every page refresh or mobile browser reload re-fires the purchase tag, creating phantom revenue.",
      reflectionPrompt: "Why is transaction deduplication using transaction_id a mandatory step in conversion tracking QA?"
    },
    {
      id: 4,
      question: "According to Harvard Business Review research, how much does responding to an inbound web lead within 5 minutes increase conversion probability?",
      options: [
        { id: "a", text: "By only 5%", isCorrect: false },
        { id: "b", text: "By 391% (nearly 4x)", isCorrect: true },
        { id: "c", text: "It has zero measurable impact", isCorrect: false },
        { id: "d", text: "By 10,000%", isCorrect: false }
      ],
      explanation: "Responding within 5 minutes delivers a 391% lift in conversion rates. After 30 minutes, qualification decays by 21x because prospects move on or hire competitors.",
      reflectionPrompt: "Why does lead response speed have a greater impact on local service revenue than small bid optimizations?"
    },
    {
      id: 5,
      question: "In GA4 attribution modeling, what is the core flaw of legacy 'Last-Click' attribution?",
      options: [
        { id: "a", text: "It gives 100% of the credit to the final touchpoint (like direct search), completely ignoring the top-of-funnel social and SEO ads that introduced the brand", isCorrect: true },
        { id: "b", text: "It only works on computers with mice", isCorrect: false },
        { id: "c", text: "It crashes Google Analytics reports", isCorrect: false },
        { id: "d", text: "It is illegal under European GDPR laws", isCorrect: false }
      ],
      explanation: "Last-click ignores the multi-step journey. If you shut down social ads because they show 0 last-click conversions, your direct and brand search sales collapse.",
      reflectionPrompt: "How does Data-Driven Attribution (DDA) prevent disastrous decisions like cutting top-of-funnel awareness ad budgets?"
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

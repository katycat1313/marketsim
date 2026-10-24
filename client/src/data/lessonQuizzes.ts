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

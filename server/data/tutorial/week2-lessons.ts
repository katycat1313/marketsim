import type { Tutorial } from '../../services/tutorialService';

export const week2Lessons: Tutorial[] = [
  // ==========================================
  // DAY 1: SEARCH MECHANICS & SEARCH INTENT
  // ==========================================
  {
    id: 201,
    chapterNumber: 2,
    title: "Chapter 2.1: Day 1 (Learn) - Search Engine Mechanics & The 4 Search Intents",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Search Engine Crawling", "Search Intent Architecture", "SERP Mechanics"],
    content: `# Search Engine Mechanics & The 4 Search Intents

Welcome to **Week 2 of Krechet Academy**. In Week 1, you mastered the 3-stage customer funnel and unit economics for Jenny's Artisan Java. Now, you will learn how organic search engines actually discover, evaluate, and rank websites—and why understanding customer search intent is the foundation of high-converting SEO.

## 1. The 3-Step Search Engine Lifecycle
Search engines like Google do not search the live web in real time when a user enters a query. Instead, they search their vast, pre-built index of the web. This process occurs in 3 distinct stages:

1. **Crawling:** Automated software bots ("Googlebot" or "spiders") discover web pages by following hyperlinks across the internet. If a new page has no internal or external links pointing to it, Googlebot may never find it.
2. **Indexing:** Once crawled, Google parses the page's HTML structure, text copy, images, and schema markup to determine its topical focus. If the page passes quality filters, it is stored in the Google Index database.
3. **Ranking:** When a user enters a search query, Google's ranking algorithms evaluate billions of indexed pages to return the most relevant, authoritative, and fast-loading answers in under 0.2 seconds.

> [!IMPORTANT] The Golden Rule of Modern Search
> Google's multi-billion dollar business model depends on giving searchers the single best answer to their query as fast as possible. If Google sends users to irrelevant, slow, or misleading pages, searchers switch to competitor tools. Therefore, Google heavily rewards pages that satisfy search intent with extreme clarity and penalizes pages that cause user frustration.

## 2. The 4 Universal Search Intents
Every search query entered into Google falls into one of four distinct intent categories. As a professional digital marketer, your landing page format MUST align with the searcher's intent:

### 1. Informational Intent ("Know")
* **What it is:** The searcher has a specific question or wants to understand a topic. They are in research mode and are NOT ready to buy.
* **Examples:**
  * *"how to brew pour over coffee at home"*
  * *"why do gums bleed when brushing teeth"*
* **Best Content Format:** Step-by-step guides, educational infographics, video tutorials, FAQ breakdowns.
* **Funnel Stage:** Top of Funnel (TOFU).

### 2. Navigational Intent ("Go")
* **What it is:** The searcher already knows the brand or website they want and uses Google as a navigational shortcut.
* **Examples:**
  * *"jenny's artisan java customer login"*
  * *"dr miller dental morgantown wv address"*
* **Best Content Format:** Dedicated brand homepages, user account portals, contact and location pages.

### 3. Commercial Investigation ("Compare")
* **What it is:** The searcher knows they have a problem and intend to buy a solution, but they are comparing providers, ingredients, pricing, or reviews first.
* **Examples:**
  * *"best single origin whole bean coffee for espresso"*
  * *"invisalign vs traditional braces cost and recovery time"*
* **Best Content Format:** Side-by-side comparison tables, third-party lab tests, customer review galleries, buyer's guides.
* **Funnel Stage:** Middle of Funnel (MOFU).

### 4. Transactional Intent ("Do / Buy")
* **What it is:** The searcher has high purchase intent and is ready to pull out a credit card or book an appointment immediately.
* **Examples:**
  * *"buy ethiopian yirgacheffe whole bean coffee online"*
  * *"emergency dentist open saturday morgantown"*
* **Best Content Format:** High-clarity product pages, transparent pricing, 1-click checkout, instant appointment booking widgets.
* **Funnel Stage:** Bottom of Funnel (BOFU).

## 3. The Search Intent Mismatch Penalty
The fastest way to burn organic rankings is to target the wrong intent with the wrong page type.
* If a searcher types *"how to grind coffee for aeropress"* (Informational) and you send them to a product checkout page shouting **"BUY OUR 5LB BAG FOR $75!"**, they will bounce in under 3 seconds.
* Google measures this behavior (known as "pogo-sticking"). When users immediately return to Google search results and click competitor links, Google's algorithm demotes your page's ranking.
* **Matching search intent is not a cosmetic preference—it is the fundamental rule of ranking on Page 1.**`,
    tasks: [{
      id: 1,
      description: "Understand search engine crawling, indexing, and the 4 search intents",
      type: "quiz",
      requirements: ["Identify TOFU vs BOFU search intent", "Explain the intent mismatch penalty"],
      verificationCriteria: ["Answer all quiz questions with at least 80% accuracy"]
    }]
  },
  {
    id: 202,
    chapterNumber: 2,
    title: "Chapter 2.2: Day 1 (See & AI Assist) - Intent Teardown & The Ethical AI Intent Classifier",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Search Intent Auditing", "SERP Feature Analysis", "Ethical AI Prompting"],
    content: `# Intent Teardown & The Ethical AI Intent Classifier

In this lesson, we conduct a forensic audit of search intent mismatches for our two agency clients: **Jenny's Artisan Java** and **Dr. Miller Dental**. We also establish the Ethical AI Prompt Framework to classify raw keyword lists at scale.

## 1. Real-World Client Teardown: The Mismatched Homepage
When Jenny Miller first launched her website, 68% of her organic impressions came from keywords like:
* *"what is single origin coffee"* (Search Volume: 4,400/mo)
* *"light roast vs dark roast caffeine content"* (Search Volume: 8,100/mo)

### The Mistake:
Jenny set her homepage as the ranking URL for both queries. When curious coffee drinkers clicked from Google, they were dropped onto her homepage with a flashing popup: *"SIGN UP FOR 10% OFF COFFEE BEANS!"*. 
* **The Result:** 89% bounce rate, 6-second average time on page, and zero sales.
* **The Fix:** We built an educational "Coffee Flavor & Roast Guide" pillar page specifically addressing those questions, with subtle contextual links to Jenny's Ethiopian and Colombian roasts at the bottom of the article. Average time on page jumped to 3 minutes and 42 seconds, and conversion rate increased by 310%.

## 2. Reading Google's Clues: SERP Feature Analysis
You don't need expensive paid software to know what Google wants for a keyword. Just look at the Page 1 Search Engine Results Page (SERP):
* **If Page 1 shows a Featured Snippet or 'People Also Ask' box:** Google classified the query as **Informational**. You need a clear 40-word definition or numbered list.
* **If Page 1 shows Google Shopping product cards:** Google classified the query as **Transactional**. You need an e-commerce product page.
* **If Page 1 shows the Google Maps Local 3-Pack:** Google classified the query as **Local Commercial / Transactional**. You need a Google Business Profile and local landing page.

## 3. The Ethical AI Prompt Framework: Search Intent Classifier
To audit hundreds of raw client search terms in minutes without hallucinations, use this structured prompt:

\`\`\`text
You are a Senior SEO Director auditing keyword data for a client. 

Classify the following search queries into:
1. Search Intent: [Informational | Navigational | Commercial | Transactional]
2. Funnel Stage: [TOFU | MOFU | BOFU]
3. Recommended Target Landing Page Type: [Blog Guide | Product Page | Local Service Page | Category Hub]
4. Primary Conversion Goal: [Email Capture | Direct Checkout | Phone Call / Booking]

CLIENTS:
- Jenny's Artisan Java (Direct-to-consumer specialty coffee roastery)
- Dr. Miller Dental (Local family and emergency dental practice in Morgantown, WV)

QUERIES TO AUDIT:
1. 'best whole bean coffee for cold brew'
2. 'emergency tooth extraction cost morgantown'
3. 'how to store roasted coffee beans freshness'
4. 'dr miller dental hours monday'
5. 'buy organic dark roast coffee beans free shipping'

CONSTRAINTS:
- Format response as a clean markdown table.
- Do NOT use generic marketing clichés. Ground recommendations in user search psychology.
\`\`\``,
    tasks: [{
      id: 1,
      description: "Analyze SERP features and use AI prompt frameworks to classify search intent",
      type: "practical",
      requirements: ["Identify SERP feature indicators", "Apply the 4-part prompt framework"],
      verificationCriteria: ["Correctly categorize transactional vs informational search intent"]
    }]
  },
  {
    id: 203,
    chapterNumber: 2,
    title: "Chapter 2.3: Day 1 (Do) - Live Search Intent Audit Workbench",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Intent Mapping", "Landing Page Alignment", "Bounce Rate Optimization"],
    content: `# Live Search Intent Audit Workbench

Now it is time to put theory into practice. You have been handed a live dataset of 15 customer search queries from Google Search Console for **Jenny's Artisan Java** and **Dr. Miller Dental**. Your mission is to diagnose revenue leaks caused by intent misalignment.

## 1. Mission Briefing
A misaligned page drains organic ranking equity and wastes user attention. When intent aligns with page architecture, organic conversion rates jump from under 1% to over 4.5%.

## 2. Key Diagnostic Steps
1. **Analyze the Raw Query:** Look for semantic modifier keywords (e.g., *"how to"*, *"best"*, *"cost"*, *"buy"*, *"near me"*).
2. **Assign the Funnel Stage:**
   * Question modifiers = Top of Funnel (Educational).
   * Comparison/Review modifiers = Middle of Funnel (Evaluation).
   * Purchase/Urgency modifiers = Bottom of Funnel (Action).
3. **Map to Target URL:**
   * Never send informational queries to checkout pages.
   * Never bury transactional queries behind a 3,000-word historical essay.

## 3. Client Case Matrix to Memorize
* Query: *"how long do roasted coffee beans stay fresh"* -> Target: Blog Post (`/guides/coffee-freshness-timeline`).
* Query: *"order fresh roasted coffee beans online"* -> Target: Storefront Catalog (`/shop/all-roasts`).
* Query: *"toothache relief at home salt water"* -> Target: Patient Advice Article (`/blog/home-toothache-remedies`).
* Query: *"emergency dentist open saturday morgantown wv"* -> Target: Emergency Booking Service Page (`/emergency-dentistry`).

Complete the practical checkpoint below to confirm your audit skills.`,
    tasks: [{
      id: 1,
      description: "Perform search intent classification and page alignment audit",
      type: "simulation",
      requirements: ["Evaluate query modifiers", "Map queries to appropriate page architecture"],
      verificationCriteria: ["Zero intent mismatches between queries and recommended URLs"]
    }]
  },

  // ==========================================
  // DAY 2: LONG-TAIL KEYWORD RESEARCH
  // ==========================================
  {
    id: 204,
    chapterNumber: 2,
    title: "Chapter 2.4: Day 2 (Learn) - The Long-Tail Strategy & Keyword Difficulty (KD) Realities",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Long-Tail SEO", "Keyword Difficulty (KD)", "Search Value Modeling"],
    content: `# The Long-Tail Strategy & Keyword Difficulty (KD) Realities

Beginner marketers often make a devastating mistake: they target broad, high-volume "head terms" and spend years waiting for rankings that never arrive. Today, you learn how top agencies dominate search through **long-tail economics**.

## 1. The Head Term Trap
Consider the search term **"coffee"**:
* **Monthly Search Volume:** 1,200,000 searches/month.
* **Keyword Difficulty (KD):** 96 / 100 (Extremely Hard).
* **Search Intent:** Completely ambiguous. Is the user looking for the Wikipedia history of coffee? A Starbucks nearby? A stock price? Or coffee bean varieties?
* **Cost to Rank:** Millions of dollars in backlinks, competing against Starbucks, Amazon, and Wikipedia.
* **Conversion Rate:** Under 0.2%.

Now consider the long-tail search term **"fresh roasted single origin coffee beans shipping"**:
* **Monthly Search Volume:** 380 searches/month.
* **Keyword Difficulty (KD):** 18 / 100 (Easy / Moderate).
* **Search Intent:** 100% transactional e-commerce buyer.
* **Time to Rank:** 30 to 60 days with clean on-page optimization.
* **Conversion Rate:** 8.5% to 12%.

> [!NOTE] The 70% Long-Tail Rule
> In Google, over **70% of all search queries** are 3+ words long. Broad one-word head terms make up only a tiny fraction of total searches. Long-tail queries have lower individual search volume, but collectively they drive the vast majority of web traffic—and virtually all high-intent purchases.

## 2. Understanding Search Volume vs. Search Value
Smart agency directors never evaluate keywords by search volume alone. They evaluate **Commercial Search Value**:

$$\\text{Search Value} = \\text{Monthly Volume} \\times \\text{Intent Conversion Rate} \\times \\text{Average Order Value (AOV)}$$

### Real Client Comparison:
* **Keyword A:** *"coffee facts trivia"* -> 15,000 volume $\\times$ 0.05% CVR $\\times$ $0 AOV = **$0 Revenue**.
* **Keyword B:** *"buy ethiopian yirgacheffe beans online"* -> 250 volume $\\times$ 8.0% CVR $\\times$ $45 AOV = **$900/mo Recurring Revenue**.

A keyword with 250 monthly searches that generates $900/month in net revenue is infinitely more valuable than a 15,000-volume trivia query that generates zero sales.

## 3. The 3 Keyword Difficulty (KD) Tiers
* **KD 0 - 25 (Low Hanging Fruit):** Fast rankings for newer websites with domain authority < 20. Target these first for quick client revenue wins.
* **KD 26 - 50 (Moderate Competition):** Requires high-quality on-page content, fast loading speeds, and a few relevant local or niche backlinks.
* **KD 51 - 100 (High Authority Battlegrounds):** Dominated by established national brands with thousands of referring domains. Avoid targeting these as primary keywords on new client domains.`,
    tasks: [{
      id: 1,
      description: "Master long-tail keyword economics and keyword difficulty tiers",
      type: "quiz",
      requirements: ["Calculate commercial search value", "Differentiate head terms from long-tail modifiers"],
      verificationCriteria: ["Answer all quiz questions with at least 80% accuracy"]
    }]
  },
  {
    id: 205,
    chapterNumber: 2,
    title: "Chapter 2.5: Day 2 (See & AI Assist) - Keyword Matrix Teardown & AI Semantic Clustering",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Keyword Clustering", "Topic Hub & Spoke Architecture", "Negative Intent Filtering"],
    content: `# Keyword Matrix Teardown & AI Semantic Clustering

In this module, we examine how a local dental clinic generated 38 new high-margin patient inquiries per month by clustering long-tail keywords into topic hubs. We also explore the Ethical AI Semantic Clustering Framework.

## 1. Competitor Teardown: Dr. Miller Dental vs. Modern Dental Care
Dr. Miller's dental clinic was struggling to get phone calls from organic search. His homepage was trying to rank for generic *"dentist morgantown wv"*, which was stuck on Page 3 (position 26).

Meanwhile, a competing clinic (**Modern Dental Care**) launched 4 targeted topic clusters:
1. **Cluster 1: Emergency Tooth Pain:**
   * *"broken tooth pain relief morgantown"* (KD 12)
   * *"emergency root canal cost without insurance"* (KD 15)
   * *"what to do if tooth knocked out adult"* (KD 8)
2. **Cluster 2: Clear Teeth Aligners:**
   * *"invisalign cost payment plan morgantown"* (KD 18)
   * *"how long does clear aligner treatment take adults"* (KD 14)

### The Result:
Modern Dental Care didn't have a higher domain authority than Dr. Miller. But by clustering 5–8 long-tail articles around a central service hub page, Google viewed them as a topical authority on emergency dentistry and teeth alignment. They captured 38 new patient inquiries/month at an average case value of $1,250!

## 2. Topic Hub & Spoke Architecture
Instead of creating isolated, disconnected blog posts, high-ranking agencies organize content into **Hub & Spoke clusters**:
* **The Pillar (Hub):** A comprehensive 2,500-word master guide covering the core service or product (e.g., */services/emergency-dental-care*).
* **The Spokes:** 4 to 6 specific long-tail sub-topic articles answering narrow questions (e.g., */blog/chipped-tooth-repair-options*, */blog/dental-abscess-warning-signs*).
* **The Architecture:** Every spoke links back to the central hub page using descriptive anchor text, funneling organic authority directly to the commercial conversion page.

## 3. Ethical AI Prompt Framework: Semantic Keyword Clustering
Use this prompt to organize raw keyword research spreadsheets into structured topic clusters:

\`\`\`text
You are a Lead SEO Strategist. Group the following list of raw search queries into logical Topic Clusters based on semantic search intent.

FOR EACH CLUSTER, PROVIDE:
1. Cluster Name (Core Topic)
2. Primary Pillar Page Title & URL Slug
3. Supporting Spoke Keywords (Search Volume & Intent)
4. Recommended Internal Link Anchor Text pointing from Spokes to Pillar

RAW KEYWORD LIST:
- 'best dark roast coffee low acidity'
- 'how to brew low acid coffee cold brew'
- 'does dark roast coffee have less acid than light roast'
- 'buy organic low acid whole bean coffee'
- 'low acid coffee beans for sensitive stomach'

CONSTRAINTS:
- Do NOT create duplicate clusters for identical search intent.
- Ensure every cluster has a clear commercial or transaction conversion path.
\`\`\``,
    tasks: [{
      id: 1,
      description: "Analyze topic clusters and apply semantic keyword grouping",
      type: "practical",
      requirements: ["Structure hub and spoke internal link architecture", "Filter out wasteful search modifiers"],
      verificationCriteria: ["Correctly structure a 1-pillar, 3-spoke internal link hierarchy"]
    }]
  },
  {
    id: 206,
    chapterNumber: 2,
    title: "Chapter 2.6: Day 2 (Do) - Interactive Keyword Target Matrix Lab",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Keyword Opportunity Scoring", "Competitive Matrix Building", "Negative Keyword Filtering"],
    content: `# Interactive Keyword Target Matrix Lab

You are now the Lead SEO Analyst for **Jenny's Artisan Java** and **Dr. Miller Dental**. Your goal in this lab is to review a candidate list of 25 raw keywords and construct an approved 10-keyword priority targeting matrix.

## 1. Audit Rules & Filtering Thresholds
To ensure client ad budgets and content production hours are never wasted on vanity terms, apply these strict agency filters:
* **Rule 1: Difficulty Threshold:** Filter out any keyword with KD > 40 unless the client domain already possesses high authority (DA > 50).
* **Rule 2: Commercial Intent:** Reject terms with negative modifier keywords (*"free", "salary", "jobs", "wikipedia", "clipart", "course", "meaning"*).
* **Rule 3: Geographic Relevance (For Local Clients):** For Dr. Miller Dental, prioritize keywords containing geographic modifiers (*"morgantown", "wv", "near me", "cheat lake"*).

## 2. Calculating the Opportunity Score
Evaluate each candidate keyword using the standard Agency Opportunity Formula:

$$\\text{Opportunity Score} = \\frac{\\text{Monthly Volume} \\times \\text{Intent Multiplier}}{\\text{Keyword Difficulty (KD)} + 1}$$

* **Intent Multipliers:**
  * Transactional = 4.0
  * Commercial = 2.5
  * Informational = 1.0

### Example Calculation:
* Keyword: *"emergency tooth extraction morgantown"*
* Volume = 210, KD = 14, Intent = Transactional (4.0).
* $\\text{Score} = (210 \\times 4.0) / (14 + 1) = 840 / 15 = **56.0**$ (High Priority Target!).

Complete the checkpoint below to verify your keyword matrix before moving to Day 3's on-page tag optimization.`,
    tasks: [{
      id: 1,
      description: "Build an approved keyword targeting matrix using agency filtering rules",
      type: "simulation",
      requirements: ["Apply KD filtering rules", "Calculate opportunity scores for target queries"],
      verificationCriteria: ["Accurately identify high-priority long-tail keywords with KD <= 35"]
    }]
  },

  // ==========================================
  // DAY 3: ON-PAGE SEO ARCHITECTURE
  // ==========================================
  {
    id: 207,
    chapterNumber: 2,
    title: "Chapter 2.7: Day 3 (Learn) - The Anatomy of a High-CTR SERP Snippet & On-Page Hierarchy",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Title Tag Optimization", "Meta Descriptions", "Heading Hierarchy (H1-H3)", "CTR Optimization"],
    content: `# The Anatomy of a High-CTR SERP Snippet & On-Page Hierarchy

Ranking on Page 1 is only half the battle. If 1,000 people see your result in Google search but only 10 people click, your ranking will quickly disappear. Today, you master the science of **Click-Through Rate (CTR) optimization** and semantic on-page structure.

## 1. The Anatomy of a Perfect SERP Snippet
Your SERP snippet is your organic digital billboard. It consists of 3 core elements:

### 1. The Title Tag (The #1 On-Page Ranking Factor)
* **Maximum Length:** **55 to 60 characters** (approx. 580 pixels). Anything longer gets truncated by Google with an unsightly *"..."*.
* **The High-Converting Formula:**
  $$\\text{[Primary Keyword]} \\mid \\text{[Secondary Hook / Value Prop]} - \\text{[Brand Name]}$$
* **Rules:**
  * Front-load the primary target keyword on the far left.
  * Include a compelling CTR hook (e.g., *Same-Day Shipping, Free Delivery, 48-Hr Roast, Open Saturdays*).
  * Always end with the recognizable brand name.

### 2. The Meta Description (The Sales Copy Hook)
* **Maximum Length:** **150 to 160 characters** (approx. 960 pixels on desktop).
* **Ranking Impact:** Meta descriptions do NOT directly influence Google's algorithmic ranking score. However, they **massively influence Click-Through Rate (CTR)**. A higher CTR tells Google your result satisfies searchers, which indirectly lifts your rankings!
* **The 4-Part Formula:**
  $$\\text{[Problem Hook]} + \\text{[Specific Solution/Proof]} + \\text{[Value Proposition]} + \\text{[Clear Call to Action]}$$

### 3. Clean URL Slugs
* Keep URLs short, lowercase, and hyphenated (e.g., */shop/ethiopian-yirgacheffe* instead of */catalog/item?id=84920&category=beans*).

## 2. On-Page Semantic Heading Hierarchy
Once a visitor clicks from Google to your page, your heading tags (H1, H2, H3) guide both the reader and Google's crawler:

* **The H1 Tag (Page Headline):**
  * **Rule:** There must be **EXACTLY ONE H1** tag per page. Having multiple H1 tags confuses Google's crawler about the primary topic of the document.
  * The H1 must reflect the promise made in your Title Tag and contain your primary keyword.
* **H2 Tags (Major Section Subheadings):**
  * Break down the core aspects of the topic. Incorporate secondary and long-tail keyword variations.
* **H3 Tags (Detailed Supporting Points):**
  * Sub-points under an H2 (e.g., individual brew steps, flavor profile tasting notes, FAQ items).

## 3. Image SEO & Alt Text Best Practices
Google cannot taste coffee or inspect dental crowns with human eyes. It relies on image metadata:
* **File Name:** Use descriptive hyphens (*fresh-roasted-ethiopian-coffee-bag.jpg* instead of *IMG_0942.JPG*).
* **Alt Text:** Provide a natural, accessible 8-to-12 word description for screen readers and search crawlers (*"12oz bag of Jenny's Artisan Java single origin Ethiopian Yirgacheffe medium roast"*). Never stuff raw keywords into alt tags.`,
    tasks: [{
      id: 1,
      description: "Master SERP snippet character limits and semantic heading hierarchy",
      type: "quiz",
      requirements: ["Calculate title tag and meta description limits", "Explain H1 single-tag rule"],
      verificationCriteria: ["Answer all quiz questions with at least 80% accuracy"]
    }]
  },
  {
    id: 208,
    chapterNumber: 2,
    title: "Chapter 2.8: Day 3 (See & AI Assist) - SERP Snippet Teardowns & Ethical AI Meta Optimizer",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["SERP Teardowns", "Snippet Rewriting", "Ethical AI Copy Prompting"],
    content: `# SERP Snippet Teardowns & Ethical AI Meta Optimizer

In this lesson, we conduct side-by-side teardowns of broken client snippets and implement our Ethical AI Meta Optimizer prompt framework.

## 1. Real-World Client Teardown: Dr. Miller Dental
When we audited Dr. Miller Dental's organic visibility, his Google snippet looked like this:

> **Old Title Tag (68 characters - Truncated):**
> Home - Dr. Miller Dental Practice - Welcome to our Dental Clinic in Morga...
> 
> **Old Meta Description (194 characters - Truncated):**
> Welcome to the official website of Dr. Miller Dental. We are a dental clinic located in Morgantown, West Virginia dedicated to providing all types of general dental treatments to patients of all ages...

### The Diagnosis:
* **Title Tag:** Wasted the first 25 characters on *"Home - Dr. Miller Dental Practice"*. The primary target keyword (*"Emergency Dentist Morgantown"*) was completely missing! Average CTR was a dismal **0.8%**.
* **Meta Description:** Filled with passive, uninspired corporate filler (*"dedicated to providing all types of..."*). No phone number, no mention of weekend or evening hours, and zero call to action.

### The Agency Rewrite:
> **New Title Tag (56 characters):**
> Emergency Dentist Morgantown WV | Open Sat - Dr. Miller Dental
>
> **New Meta Description (152 characters):**
> Severe toothache or broken crown? Dr. Miller provides same-day emergency dental relief in Morgantown, WV. Walk-ins welcome & insurance accepted. Call now!

### The Result:
Organic CTR on the query *"emergency dentist morgantown"* jumped from **0.8% to 5.4%** in 14 days. Organic patient inquiries tripled without spending an additional cent on paid advertising!

## 2. Ethical AI Prompt Framework: The Meta Optimizer
Use this prompt to generate high-CTR snippets that adhere strictly to pixel and character width constraints:

\`\`\`text
You are a Senior Conversion Copywriter and SEO Specialist. Write 3 high-converting SERP snippet options for the following client page.

CLIENT DETAILS:
- Client: Jenny's Artisan Java
- Product: Single-Origin Colombian Huila (Whole Bean Coffee)
- Target Keyword: 'buy colombian whole bean coffee online'
- Key Value Props: Roasted within 48 hours of shipping, notes of caramel and red apple, free shipping on orders over $35.

STRICT TECHNICAL CONSTRAINTS:
1. Title Tag: Between 50 and 58 characters. Front-load target keyword. End with '- Jenny\'s Java'.
2. Meta Description: Between 145 and 155 characters. Must follow [Problem Hook] + [Proof/Freshness] + [Offer/CTA].
3. No generic marketing clichés ('elevate', 'game-changing', 'unmatched').
4. Include exact character counts for each variation.
\`\`\``,
    tasks: [{
      id: 1,
      description: "Analyze truncated snippets and generate optimized Title and Meta tags using AI",
      type: "practical",
      requirements: ["Enforce strict character count limits", "Front-load primary target keywords"],
      verificationCriteria: ["Draft snippets with 55-60 char title and 145-155 char meta description"]
    }]
  },
  {
    id: 209,
    chapterNumber: 2,
    title: "Chapter 2.9: Day 3 (Do) - Live Snippet & On-Page Tag Rewriter",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["SERP Preview QA", "On-Page Tag Rewriting", "Image Alt Text Optimization"],
    content: `# Live Snippet & On-Page Tag Rewriter

It is time to apply what you have learned directly to our client campaigns. You will draft and verify optimized on-page metadata for **Jenny's Artisan Java** and **Dr. Miller Dental**.

## 1. Execution Briefing
Your deliverable is to rewrite the full on-page metadata suite for two underperforming client URLs:

### Target URL 1: Jenny's Ethiopian Yirgacheffe
* **Current Title:** Products - Ethiopian Yirgacheffe Coffee - Jenny's Artisan Java Store
* **Current Meta:** Buy our Ethiopian Yirgacheffe coffee beans online. It is roasted in West Virginia and tastes really good with floral notes.
* **Your Goal:** Rewrite the Title Tag (50-58 chars), Meta Description (145-155 chars), and H1 tag to highlight her **48-hour roast-to-ship freshness** and floral/jasmine tasting notes.

### Target URL 2: Dr. Miller Dental Emergency Clinic
* **Current Title:** Dental Services - Emergency Care - Morgantown Dental
* **Current Meta:** We do emergency tooth extractions and fillings at Dr. Miller's office in Morgantown. Give us a call during normal business hours to make an appointment.
* **Your Goal:** Rewrite to capture high-urgency searchers looking for same-day tooth pain relief and weekend availability.

## 2. The Verification Quality Checklist
Before submitting:
* [ ] Is the primary keyword in the first 35 characters of the Title Tag?
* [ ] Is the Title Tag strictly under 60 characters?
* [ ] Does the Meta Description include a specific call to action (*"Call now"*, *"Order today with free shipping"*)?
* [ ] Does the page have exactly ONE H1 tag that matches user expectations?

Complete the checkpoint below to verify your tag rewriter mastery.`,
    tasks: [{
      id: 1,
      description: "Draft optimized Title Tags, Meta Descriptions, and H1 tags for client URLs",
      type: "simulation",
      requirements: ["Meet 50-60 character title limits", "Meet 145-155 character meta limits"],
      verificationCriteria: ["All metadata complies with character and CTR formula standards"]
    }]
  },

  // ==========================================
  // DAY 4: LOCAL SEO & GOOGLE BUSINESS PROFILE
  // ==========================================
  {
    id: 210,
    chapterNumber: 2,
    title: "Chapter 2.10: Day 4 (Learn) - Dominating the Local 3-Pack & NAP Consistency",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Local SEO Architecture", "Google Business Profile (GBP)", "NAP Consistency", "Review Velocity"],
    content: `# Dominating the Local 3-Pack & NAP Consistency

For brick-and-mortar businesses, dental clinics, and local roasteries, traditional organic search is only part of the story. Over **68% of local mobile clicks** go directly to the **Google Maps Local 3-Pack**. Today, you learn how local search algorithms operate.

## 1. The Local Search Trifecta
Google's local ranking algorithm operates on 3 primary pillars:

1. **Relevance:** How well your business listing matches what the user is searching for. This is governed by your **Primary Google Business Profile (GBP) Category**, secondary categories, service listings, and business description.
2. **Distance (Proximity):** How far your physical business location is from the searcher's mobile device or the geographic modifier entered in the query (e.g., *"dentist near Cheat Lake Morgantown"*).
3. **Prominence (Authority & Reputation):** How well-known and reputable the business is offline and online. This is measured by **Review Quantity, Review Velocity (how often you receive new reviews), Average Star Rating**, and consistent business directory citations across the web.

## 2. NAP Consistency: The Foundation of Local Trust
**NAP** stands for **Name, Address, and Phone Number**.
* Search engines cross-reference hundreds of online directories (Google Maps, Apple Maps, Yelp, YellowPages, Facebook, Healthgrades) to verify that a business is legitimate and active.
* **The Rule of Strict Consistency:**
  * If your official Google listing is: *"Dr. Miller Dental, 450 Suncrest Towne Centre Dr, Suite 201, Morgantown, WV 26505, (304) 555-0192"*
  * But your Yelp profile says: *"Miller Dentistry, 450 Suncrest Town Center, Ste 201..."*
  * And your Facebook page lists an outdated phone number...
* Google's algorithm detects conflicting data. It lowers your local confidence score and drops your ranking in the Local 3-Pack!

> [!WARNING] The Primary Category Trap
> Your **Primary GBP Category** is the single highest-weighted local ranking signal. If Dr. Miller sets his primary category as generic *"Dentist"*, he will struggle to rank for high-revenue emergency searches. Changing his primary category to *"Emergency Dental Service"* or adding *"Cosmetic Dentist"* as an official secondary category can lift local impressions by 400% overnight.

## 3. Review Velocity vs. Review Volume
Many business owners think having 100 reviews from 4 years ago is enough. It is not.
* Google's algorithm prioritizes **Review Velocity** and **Review Recency**.
* A business with 45 reviews that receives 3 to 4 fresh, authentic reviews every week will consistently outrank an older competitor with 120 reviews that hasn't received a new review in 8 months.
* Responding to reviews—both positive and negative—signals to Google that the business is actively engaged with customers.`,
    tasks: [{
      id: 1,
      description: "Master Google Business Profile ranking signals, NAP consistency, and review velocity",
      type: "quiz",
      requirements: ["Identify the 3 local ranking pillars", "Explain NAP consistency rules"],
      verificationCriteria: ["Answer all quiz questions with at least 80% accuracy"]
    }]
  },
  {
    id: 211,
    chapterNumber: 2,
    title: "Chapter 2.11: Day 4 (See & AI Assist) - GBP Profile Teardown & Ethical AI Review Response System",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["GBP Profile Auditing", "Reputation Management", "Ethical AI Review Responses"],
    content: `# GBP Profile Teardown & Ethical AI Review Response System

In this lesson, we conduct a forensic audit of Dr. Miller Dental's local presence and deploy an Ethical AI Review Response system that turns negative customer reviews into public showcases of agency professionalism.

## 1. Forensic Teardown: Dr. Miller's Broken Local Listing
When we first inspected Dr. Miller's Google Business Profile:
* **Primary Category:** Set to generic *"Dental Clinic"*.
* **Secondary Categories:** Completely blank (missed out on *"Emergency Dental Service"*, *"Cosmetic Dentist"*, and *"Pediatric Dentist"*).
* **Business Hours:** Marked as *"Closed"* on Saturdays, even though Dr. Miller takes on-call emergency dental appointments from 9 AM to 2 PM.
* **Unanswered Reviews:** 14 reviews (including two 1-star complaints about billing confusion) had sat unanswered for 7 months.

### The Impact:
Dr. Miller was ranking in position #14 on Google Maps—invisible to 95% of patients searching on mobile devices in Morgantown.

## 2. The Agency Review Management Protocol
When responding to client reviews:
1. **Never Argue Publicly:** Getting defensive on Google Maps guarantees that potential patients will avoid your business.
2. **Acknowledge & Validate:** Express genuine empathy for their experience.
3. **Move the Conversation Offline:** Provide a direct phone number or private email to resolve the issue (*"Please call our practice manager Sarah directly at..."*).
4. **HIPAA & Privacy Compliance (Healthcare):** Never confirm or deny specific patient medical treatments in public review responses.

## 3. Ethical AI Prompt Framework: Professional Review Responder
Use this prompt to draft HIPAA-compliant, empathetic review responses in seconds:

\`\`\`text
You are the Patient Care Director at Dr. Miller Dental in Morgantown, WV. Draft a professional, empathetic, and HIPAA-compliant public response to the following Google review.

REVIEW DETAILS:
- Reviewer: Mark T. (2 Stars)
- Comment: 'Had a toothache on Friday night. Called their emergency line and had to wait 45 minutes for a call back. Once I got in Dr. Miller was great, but the wait was stressful.'

STRICT RESPONSE RULES:
1. Thank Mark for his honest feedback and compliment Dr. Miller's clinical care.
2. Acknowledge the wait time with genuine empathy without making excuses.
3. Explain our continuous commitment to rapid emergency triage.
4. Provide a direct private contact (Dr. Miller Patient Coordinator: 304-555-0192) to follow up.
5. Do NOT mention specific dental diagnoses or patient records (HIPAA compliance).
6. Keep response under 80 words. Tone: Warm, accountable, and reassuring to future prospective patients reading this review.
\`\`\``,
    tasks: [{
      id: 1,
      description: "Audit a Google Business Profile listing and generate compliant review responses",
      type: "practical",
      requirements: ["Identify primary vs secondary GBP categories", "Draft compliant review responses"],
      verificationCriteria: ["Response adheres to healthcare privacy and de-escalation standards"]
    }]
  },
  {
    id: 212,
    chapterNumber: 2,
    title: "Chapter 2.12: Day 4 (Do) - Google Business Profile Audit & Citation Fixer",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Local Directory Citations", "GBP Category Optimization", "Local Map Pack QA"],
    content: `# Google Business Profile Audit & Citation Fixer

Today you take control of Dr. Miller Dental's local presence. You will resolve NAP discrepancies across 4 major directories, configure high-impact GBP categories, and approve review responses.

## 1. Mission Briefing
A single inconsistent directory citation can suppress a client's Google Maps ranking. Your objective is to achieve **100% NAP consistency** and elevate Dr. Miller into the Morgantown Local 3-Pack.

## 2. Directory Audit Checklist
Inspect the following 4 citation records and flag the errors:

1. **Official Google Business Profile:**
   * Name: Dr. Miller Dental
   * Address: 450 Suncrest Towne Centre Dr, Suite 201, Morgantown, WV 26505
   * Phone: (304) 555-0192
2. **Yelp Listing (Error Found):**
   * Name: Miller Dental Clinic *(Error: Brand name mismatch)*
   * Address: 450 Suncrest Town Center, Suite 201 *(Error: 'Towne Centre' misspelled)*
3. **Healthgrades Directory (Error Found):**
   * Phone: (304) 555-0188 *(Error: Old tracking phone number active)*
4. **Apple Maps Listing (Verified):**
   * 100% match with official GBP record.

## 3. Category Optimization Plan
* **Set Primary Category:** *"Emergency Dental Service"* (Captures highest commercial intent).
* **Set Secondary Category 1:** *"Dentist"* (General dental coverage).
* **Set Secondary Category 2:** *"Cosmetic Dentist"* (High-margin veneers and whitening).
* **Set Secondary Category 3:** *"Dental Clinic"*.

Complete the practical checkpoint below to confirm your local SEO audit deliverable.`,
    tasks: [{
      id: 1,
      description: "Fix local NAP citation discrepancies and configure GBP category hierarchy",
      type: "simulation",
      requirements: ["Identify NAP mismatches across business directories", "Select primary and secondary categories"],
      verificationCriteria: ["100% NAP consistency verified across all simulated directories"]
    }]
  },

  // ==========================================
  // DAY 5: HELPFUL CONTENT (E-E-A-T) & CAPSTONE
  // ==========================================
  {
    id: 213,
    chapterNumber: 2,
    title: "Chapter 2.13: Day 5 (Learn) - Google's Helpful Content System (E-E-A-T) vs. AI Spam Penalties",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Google E-E-A-T Guidelines", "Helpful Content System", "AI Spam Penalty Prevention"],
    content: `# Google's Helpful Content System (E-E-A-T) vs. AI Spam Penalties

In 2024–2026, Google rolled out its most aggressive algorithm updates in search history: the **Helpful Content System** and **Core Algorithm Updates**. Overnight, thousands of websites that published generic, automated AI content saw their organic traffic plummet to zero. Today, you learn how to protect client websites and rank with **E-E-A-T**.

## 1. What is E-E-A-T?
Google's Search Quality Evaluator Guidelines judge content based on four critical pillars:

* **E - Experience (First-Hand Proof):** Does the author have genuine, first-hand experience with the product or service? (e.g., Photos of Jenny actually roasting green coffee beans in Morgantown, real roast batch logs, original tasting notes).
* **E - Expertise:** Does the content demonstrate specialized skill and deep knowledge? (e.g., Explaining the precise chemical difference between washed vs. natural bean processing).
* **A - Authoritativeness:** Is the website or author recognized as a credible go-to source in the industry? (e.g., Cited by local news, featured in coffee publications, recognized dental board certifications).
* **T - Trustworthiness (The Most Important Pillar):** Is the page accurate, secure, transparent, and honest? (e.g., Transparent pricing, clear return policies, HTTPS encryption, visible physical business address).

> [!CAUTION] The AI Content Trap: Why 500 Generic Articles Fail
> Amateur agencies often brag: *"We used AI to generate 500 blog posts in 24 hours!"*. 
> Google's Helpful Content classifier detects unedited AI patterns (rehashed internet consensus, repetitive phrasing, lack of original data, zero first-hand experience). When Google flags a domain as publishing "scaled content abuse", it doesn't just demote one article—it applies a site-wide penalty that crushes rankings across the entire domain!

## 2. The 3 Hallmarks of Truly Helpful Content
To ensure your content never gets penalized:
1. **Original Data & Case Studies:** Include proprietary numbers, client test results, and original photographs that cannot be scraped from other websites.
2. **Clear Author Byline & Bio:** Every article must have a real author with demonstrable credentials (e.g., *"Written by Jenny Miller, Certified Q-Grader & Master Roaster"*).
3. **Satisfying the Complete Journey:** Answer the user's immediate question within the first 150 words, then provide natural next steps without forcing them to visit 3 other sites.

## 3. Internal Linking: The Secret Weapon of Organic Growth
Backlinks from external websites are hard to earn, but you have 100% control over **Internal Links**:
* Internal links distribute "PageRank" (ranking authority) from your top-performing pages to newer product pages.
* **The Descriptive Anchor Text Rule:** Never use *"click here"* or *"read more"*. Always use descriptive, keyword-rich anchor text (e.g., *"Explore our guide on [single origin Ethiopian coffee brewing techniques]"*).`,
    tasks: [{
      id: 1,
      description: "Understand Google E-E-A-T guidelines and helpful content standards",
      type: "quiz",
      requirements: ["Identify the 4 pillars of E-E-A-T", "Explain scaled content abuse penalties"],
      verificationCriteria: ["Answer all quiz questions with at least 80% accuracy"]
    }]
  },
  {
    id: 214,
    chapterNumber: 2,
    title: "Chapter 2.14: Day 5 (See & AI Assist) - AI Content Hallucination Teardown & The Human Fact-Checking Protocol",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["AI Hallucination Auditing", "Human-in-the-Loop Fact Checking", "Editorial Workflows"],
    content: `# AI Content Hallucination Teardown & The Human Fact-Checking Protocol

In this module, we dissect a live AI content failure that almost damaged a client's brand reputation. We also establish the **5-Point Human Editorial Protocol** required by top marketing agencies.

## 1. Case Teardown: The $10,000 AI Hallucination
An entry-level copywriter used an unguided AI tool to generate a blog post for Jenny's Artisan Java titled: *"The Health Benefits of Drinking Light Roast Coffee Daily"*.

### What the AI Generated:
> *"Light roast coffee contains over 400% more chlorogenic acid than dark roast, which completely prevents Type 2 diabetes and cures high blood pressure within 14 days of daily consumption..."*

### The Disaster:
* **Medical Hallucination:** Making false medical claims that coffee "cures" high blood pressure violates FTC advertising laws and Google's strict "Your Money or Your Life" (YMYL) health guidelines.
* **Reputation Risk:** A local doctor spotted the post and publicly questioned Jenny's scientific credibility.
* **The Lesson:** AI is an autocomplete engine that predicts statistically probable words—it does NOT verify scientific truth, legal compliance, or factual accuracy.

## 2. The 5-Point Human Editorial Protocol
At Krechet Academy, no piece of content touches a client domain without passing this 5-point verification checklist:

1. **Fact & Claim Verification:** Every statistic, medical claim, or price quote must link to an authoritative primary source (e.g., peer-reviewed studies, government databases, official product spec sheets).
2. **The First-Person Experience Check:** Inject authentic client stories, photographs, or proprietary tasting notes that prove first-hand interaction.
3. **The Cliché Exterminator:** Highlight and delete AI clichés: *"in today's fast-paced world"*, *"delve into"*, *"testament to"*, *"pivotal role"*, *"game-changer"*.
4. **Formatting for Skimmers:** Use bold takeaways, bullet points, callout boxes, and comparison tables so mobile readers can absorb key points in 15 seconds.
5. **The Value-Add Test:** Ask: *"Does this article provide new insight that does NOT already exist in the top 3 Google search results?"* If no, rewrite it until it does.`,
    tasks: [{
      id: 1,
      description: "Audit AI content for hallucinations and apply the 5-point editorial checklist",
      type: "practical",
      requirements: ["Detect unverified factual claims in generated copy", "Apply human editorial revisions"],
      verificationCriteria: ["Eliminate all hallucinated claims and generic AI buzzwords"]
    }]
  },
  {
    id: 215,
    chapterNumber: 2,
    title: "Chapter 2.15: Day 5 (Do) - The Live On-Page SEO & Content Workbench: Week 2 Capstone Review",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["On-Page SEO Audit", "Content Quality Score", "Week 2 Capstone Certification"],
    content: `# The Live On-Page SEO & Content Workbench: Week 2 Capstone Review

Congratulations on reaching the final milestone of **Week 2: Organic Discovery & Local Presence**. Today, you bring together all your search intent, long-tail keyword research, on-page snippet optimization, and local GBP strategies into a verified client deliverable.

## 1. Week 2 Master Deliverable
Your task is to conduct the comprehensive Week 2 SEO audit across Jenny's Artisan Java and Dr. Miller Dental before we advance into **Week 3: Paid Search & Google Ad Auctions**.

## 2. Final Audit Verification Checklist
Ensure your client implementations meet all agency benchmarks:

* [ ] **Search Intent Alignment:** All 15 customer queries mapped to appropriate landing page formats with zero pogo-sticking bounce risks.
* [ ] **Long-Tail Keyword Matrix:** Approved targeting plan focused on high-intent, low-difficulty keywords (KD <= 35) with clear commercial value.
* [ ] **SERP Snippet Standards:** Title Tags strictly 55–60 characters (front-loaded with primary keywords) and Meta Descriptions 145–155 characters with explicit calls to action.
* [ ] **Semantic Heading Hierarchy:** Exactly one H1 per page, supported by structured H2/H3 sub-points.
* [ ] **Local Google Business Profile:** Primary categories set to high-revenue services (*Emergency Dental Service*), 100% NAP consistency verified across directories, and empathetic review response protocol active.
* [ ] **Helpful Content (E-E-A-T):** Content verified for original insight, zero hallucinated claims, and human-in-the-loop editorial standards.

## 3. What Happens Next
Once you complete this checkpoint:
1. Your **Week 2 Progress** will be saved to your agency profile.
2. The **Week 2 Assessment Quiz** will unlock.
3. You will be fully prepared to step into **Week 3**, where you will manage live Google Ad auctions, calculate Quality Scores, and deploy Negative Keyword Budget Shields!`,
    tasks: [{
      id: 1,
      description: "Complete the Week 2 Capstone SEO and Local Presence audit",
      type: "simulation",
      requirements: ["Pass full on-page SEO verification suite", "Verify local directory NAP consistency"],
      verificationCriteria: ["Achieve an overall SEO audit score of 90% or higher"]
    }]
  }
];

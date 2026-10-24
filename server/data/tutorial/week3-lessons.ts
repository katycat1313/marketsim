import type { Tutorial } from '../../services/tutorialService';

export const week3Lessons: Tutorial[] = [
  // ==========================================
  // DAY 1: Google Ads Mechanics & Account Architecture
  // ==========================================
  {
    id: 301,
    chapterNumber: 3,
    title: "Chapter 3.1: Day 1 (Learn) — Google Ads Mechanics & The 3-Tier Hierarchy",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Google Ads Architecture", "Single-Theme Ad Groups", "Commercial Search Mechanics"],
    content: `# Google Ads Mechanics & The 3-Tier Hierarchy

Welcome to **Week 3 of Krechet Academy**. In Weeks 1 and 2, you mastered the customer journey, unit economics, and organic search. Now, we enter the highest-intent marketing channel on earth: **Google Paid Search Advertising**.

Every second, over 99,000 queries are typed into Google. Unlike social media ads where you interrupt someone scrolling through photos of friends, **Google Search captures existing demand at the exact second a problem arises**.

---

## 1. The Core Auction Engine: Intent Capture
When someone types \`emergency tooth extraction near me\` or \`buy organic dark roast coffee\`, they are not looking for entertainment. They have:
1. **An active, acute pain point** or specific desire.
2. **High commercial or transactional intent**.
3. **Their credit card within reach**.

Google Ads does not create demand; it **harvests existing demand**. If your campaign is built with precision, you can acquire high-value customers predictably and profitably. If built carelessly, Google will happily consume your entire monthly budget in 48 hours with zero phone calls or sales.

---

## 2. The 3-Tier Account Architecture
To prevent budget waste and maintain surgical control over where every cent is invested, Google Ads enforces a strict 3-tier hierarchy:

\`\`\`
Account (Billing, High-Level User Access)
    └── Campaign (Budget, Goal, Location, Bidding Strategy)
           ├── Ad Group A: Single Theme (Target Keywords + Matching Ads)
           └── Ad Group B: Single Theme (Target Keywords + Matching Ads)
\`\`\`

### Level 1: Campaign Level
* **Daily Budget**: How much cash you permit Google to spend per day (e.g., $50.00/day).
* **Goal & Network**: Search Network only vs. Display expansion (always uncheck Display!).
* **Location Targeting**: Explicit geo-radius (e.g., 10-mile radius around Morgantown, WV).
* **Bidding Strategy**: Manual CPC, Maximize Conversions, or Target CPA.

### Level 2: Ad Group Level (The STAG Principle)
* An ad group contains a **tightly clustered set of keywords** sharing a single, identical search intent.
* **The STAG Principle (Single-Theme Ad Groups)**: Never mix different intents. An ad group for *emergency toothache relief* must NEVER contain keywords for *cosmetic porcelain veneers*.

### Level 3: Ad & Keyword Level
* **Keywords**: The search triggers you want to enter the auction for.
* **Responsive Search Ads (RSAs)**: Up to 15 headlines and 4 descriptions that Google dynamically mixes and matches to mirror the user's exact query.
* **Final URL**: The dedicated landing page corresponding directly to that ad group's promise.

---

## 3. The Fatal Amateur Mistake: The 'Kitchen Sink' Ad Group
Beginner media buyers often dump 75 unrelated keywords into a single ad group:
* \`emergency dentist\`
* \`teeth whitening cost\`
* \`how to become a dental hygienist\`
* \`dentist office jobs\`

When a frantic patient with a cracked molar searches \`emergency dentist\`, Google serves an ad saying *"Affordable Teeth Whitening & Cleanings"*. The user scrolls right past, Google charges you for a junk click, or your Quality Score crashes to 2/10.

> [!IMPORTANT] The Golden Rule of Ad Groups
> Every ad group must have **one single commercial theme**. The searched query, the ad headline, and the landing page headline must repeat the exact same value proposition.`,
    tasks: [{
      id: 1,
      description: "Review Google Ads 3-tier hierarchy and the Single-Theme Ad Group (STAG) principle",
      type: "quiz",
      requirements: ["Differentiate Campaign vs. Ad Group settings", "Explain why 'kitchen sink' ad groups fail"],
      verificationCriteria: ["Complete Day 1 concept assessment with 100% accuracy"]
    }]
  },
  {
    id: 302,
    chapterNumber: 3,
    title: "Chapter 3.2: Day 1 (See & AI Assist) — Dr. Miller Account Teardown & AI Keyword Clustering",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["PPC Account Teardown", "Keyword Semantic Clustering", "Ethical AI PPC Prompting"],
    content: `# Dr. Miller Account Teardown & AI Keyword Clustering

In this module, you analyze a real client account bleed and use structured AI prompting to organize 40 messy keywords into profitable Single-Theme Ad Groups.

---

## 1. Real-World Client Teardown: Dr. Miller Dental Clinic
**Dr. Richard Miller** operates **Miller Family & Urgent Dental** in Morgantown, WV. He hired a freelance marketer who set up a Google Ads account with a $1,500/month budget.

### The Diagnostic Telemetry:
* **Total Spend (Last 30 Days)**: $1,480.00
* **Clicks Generated**: 285 clicks (Average CPC: $5.19)
* **Phone Calls / Bookings Generated**: 3 patients
* **Actual Cost Per Acquisition (CPA)**: $493.33 per booked patient!
* **Average Margin on Routine Filling**: $180.00 (Dr. Miller was losing over $310 on every single patient).

### What Went Wrong in Dr. Miller's Account:
1. **Single 'All Services' Ad Group**: All 68 keywords were dumped into one ad group titled *"Dental Services"*.
2. **Display Network Enabled**: $420 was wasted on mobile video game banner clicks where toddlers accidentally tapped banner ads.
3. **No Negative Keywords**: $510 was burned on searches like *"how to pull my own tooth at home with pliers"*, *"free dental clinics for uninsured"*, and *"dental receptionist hourly pay"*.

---

## 2. The Solution: Single-Theme Ad Group (STAG) Architecture
To turn Dr. Miller's account into a profitable patient acquisition machine, we break his services into 3 dedicated STAGs:

1. **STAG 1: Emergency & Urgent Care**
   * *Keywords*: \`emergency dentist morgantown\`, \`urgent toothache relief\`, \`broken tooth repair\`.
   * *Ad Headline*: *"Emergency Dentist in Morgantown | Same-Day Relief Available"*.
   * *Landing Page*: \`/emergency-dental\` with a tap-to-call button.
2. **STAG 2: Dental Implants & Restorative**
   * *Keywords*: \`dental implants cost morgantown\`, \`tooth replacement specialist\`.
   * *Ad Headline*: *"Permanent Dental Implants | Free Consultation with Dr. Miller"*.
   * *Landing Page*: \`/dental-implants\` with financing breakdowns.
3. **STAG 3: Routine Family Dentistry**
   * *Keywords*: \`family dentist near me\`, \`pediatric dentist morgantown\`.
   * *Ad Headline*: *"Gentle Family Dental Care | Accepting New Patients"*.
   * *Landing Page*: \`/new-patients\` with online appointment scheduling.

---

## 3. The Golden AI Prompt: Semantic Keyword Clustering
You can use external AI (Gemini, Claude, or ChatGPT) to cluster raw keyword research into STAGs in seconds.

### The Director-Level Prompt:
\`\`\`text
You are a senior Google Ads PPC Architect. I have an unorganized list of 30 keywords for a local dental clinic: Dr. Miller Family & Urgent Dental in Morgantown, WV.

KEYWORDS LIST:
[Paste raw keywords: emergency dentist, teeth whitening cost, broken tooth extraction, dental implants pricing, kids dentist, dental assistant jobs, free dental care, same day root canal, dentist open saturday, dental crown replacement]

TASK:
1. Filter out all non-commercial or non-local intent keywords (jobs, DIY, free, education). Mark them as NEGATIVE KEYWORD CANDIDATES.
2. Cluster the remaining commercial keywords into 3 Single-Theme Ad Groups (STAGs).
3. For each STAG, provide:
   - Ad Group Name
   - 3-5 Target Keywords (formatted for Phrase Match)
   - 1 High-Converting Headline (strictly under 30 characters)
   - Matching Landing Page URL slug

CONSTRAINTS:
- No generic headlines like 'Welcome to Dentist'.
- Adhere strictly to Google's 30-character headline limit.
\`\`\`

---

## 4. Human-in-the-Loop Verification
Before accepting AI clusters:
* **Verify Intent Consistency**: Does every keyword in the group share the exact same urgency level?
* **Enforce Character Limits**: Count characters manually—AI frequently hallucinates 32-character headlines.
* **Validate Profit Margins**: Prioritize high-value procedures (emergency, implants) over low-margin cleanings.`,
    tasks: [{
      id: 1,
      description: "Analyze Dr. Miller's budget leak and execute the AI semantic clustering prompt",
      type: "practical",
      requirements: ["Identify 3 fatal flaws in the original campaign", "Group keywords into 3 distinct STAGs"],
      verificationCriteria: ["Verify character counts for ad headlines stay under 30 characters"]
    }]
  },
  {
    id: 303,
    chapterNumber: 3,
    title: "Chapter 3.3: Day 1 (Do) — Interactive Campaign Structuring & Budget Guardrails",
    level: "Beginner",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Campaign Structuring", "Network Settings", "Location Geo-Fencing"],
    content: `# Interactive Campaign Structuring & Budget Guardrails

Now it's time to step into the **Krechet Academy Google Ads Engine** and reconstruct Dr. Miller's account architecture from scratch.

---

## 1. The Campaign Guardrail Checklist
When creating any new Google Search Campaign for a client, complete this 4-step security checklist:

### Step 1: Campaign Network Settings
* **Search Network**: ✅ CHECKED.
* **Include Google search partners**: Optional (keep checked for local services).
* **Include Google Display Network**: ❌ **UNCHECKED**. (The Display Network places image banners on millions of random websites and apps. Leaving this checked drains 30-50% of your budget on non-intent accidental clicks).

### Step 2: Location Geo-Fencing
* **Select**: *"Enter another location"*.
* Set a tight radius: **15-mile radius around Morgantown, WV (26505)**.
* **Location Option**: Change from *"Presence or interest"* to **"Presence: People in or regularly in your targeted locations"**.
  > [!WARNING] The 'Presence or Interest' Trap
  > If you leave the default 'Presence or Interest', someone sitting in London or Tokyo searching *'dentists in Morgantown'* can trigger your ad, wasting $6 on a click from someone who can never visit the office!

### Step 3: Languages
* English (and Spanish if the client has bilingual staff).

### Step 4: Daily Budget
* Total monthly client budget: $1,200/mo.
* Daily budget calculation:
  $$\\text{Daily Budget} = \\frac{\\$1,200}{30.4} = \\$39.47/\\text{day}$$
* Set to **$40.00/day**. (Google can spend up to 2x your daily budget on high-demand days, but will never exceed $40.00 × 30.4 days over a full billing month).

---

## 2. Live Simulator Drill
Open the simulator and execute the following fixes:
1. Disable Display Network on Campaign 1.
2. Tighten Geo-Targeting to *"Presence Only"* within a 15-mile radius.
3. Establish STAG 1 (*Emergency Dental*) with a $25/day budget allocation and STAG 2 (*Restorative Implants*) with a $15/day budget allocation.`,
    tasks: [{
      id: 1,
      description: "Reconfigure Dr. Miller's campaign settings in the Google Ads Simulator",
      type: "simulation",
      requirements: ["Disable Display Network", "Set Presence-only geo-targeting", "Calculate correct daily budget"],
      verificationCriteria: ["Zero display spend leak", "Location radius locked to 15 miles"]
    }]
  },

  // ==========================================
  // DAY 2: Keyword Match Types & Negative Keyword Shields
  // ==========================================
  {
    id: 304,
    chapterNumber: 3,
    title: "Chapter 3.4: Day 2 (Learn) — The 3 Keyword Match Types & Budget Bleed",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Broad Match", "Phrase Match", "Exact Match", "Search Term Mechanics"],
    content: `# The 3 Keyword Match Types & Budget Bleed

The single most frequent reason small businesses lose thousands of dollars on Google Ads is a misunderstanding of **Keyword Match Types**.

When you enter a keyword into Google Ads, you are not buying words—you are telling Google's algorithm **how much freedom it has to interpret user intent**.

---

## 1. The Match Type Continuum

| Match Type | Syntax | What It Triggers | Risk Level | Best Use Case |
|---|---|---|---|---|
| **Broad Match** | \`emergency dentist\` | Any search Google thinks is 'loosely related', including synonyms, questions, and different meanings. | 🔴 Very High | Large brands with $10k+/mo budgets and deep conversion data. |
| **Phrase Match** | \`"emergency dentist"\` | Searches that include the meaning of your phrase. Words may appear before or after. | 🟡 Moderate | Standard agency workhorse for capturing variations. |
| **Exact Match** | \`[emergency dentist]\` | Searches that have the exact same meaning or intent as your keyword. | 🟢 Low / Controlled | High-value, high-intent transactional search queries. |

---

## 2. Teardown: How Broad Match Burns Budgets
Look at what happens when Dr. Miller enters the broad match keyword \`emergency dentist\`:

* A patient searches: *"emergency dentist morgantown open now"* ➡️ **Ad triggers (Great click, $5.00 well spent)**.
* A user searches: *"how to extract tooth with string and doorknob"* ➡️ **Ad triggers (Wasted $5.00)**.
* A student searches: *"dental hygiene degree salary in west virginia"* ➡️ **Ad triggers (Wasted $5.00)**.
* A job seeker searches: *"dental assistant hiring no experience"* ➡️ **Ad triggers (Wasted $5.00)**.
* A dog owner searches: *"can a human dentist treat my pitbull's tooth"* ➡️ **Ad triggers (Wasted $5.00)**.

In broad match, **60% to 80% of your clicks can be completely worthless non-commercial traffic**.

---

## 3. The Power of Exact & Phrase Match
By upgrading match types:
* **Phrase Match**: \`"emergency dentist morgantown"\`
  * Matches: *"best emergency dentist morgantown wv"*
  * Matches: *"walk in emergency dentist morgantown"*
  * **Blocks**: *"can I pull my tooth at home"*
* **Exact Match**: \`[emergency dentist morgantown]\`
  * Matches only: *"emergency dentist morgantown"*, *"morgantown emergency dentist"*.
  * Zero wasted clicks. Maximum Quality Score. Maximum conversion rate.

> [!TIP] The Agency Best-Practice Rule
> For local clients with limited budgets ($500 - $3,000/mo), start strictly with **Phrase Match (\`"keyword"\`) and Exact Match (\`[keyword]\`)**. Never deploy pure Broad Match until an account has accumulated at least 50 verified conversions.`,
    tasks: [{
      id: 1,
      description: "Understand match type syntax and calculate wasted spend from broad match",
      type: "quiz",
      requirements: ["Distinguish syntax for Broad, Phrase, and Exact match", "Identify non-converting search queries"],
      verificationCriteria: ["Answer all match type questions with 100% accuracy"]
    }]
  },
  {
    id: 305,
    chapterNumber: 3,
    title: "Chapter 3.5: Day 2 (See & AI Assist) — Search Term Mining & The Negative Shield Generator",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Search Query Mining", "Negative Keyword Lists", "Ethical AI Negative Generation"],
    content: `# Search Term Mining & The Negative Shield Generator

There is a massive difference in Google Ads between **Keywords** and **Search Terms**:
* **Keyword**: What *you* bid on in your account (e.g., \`"emergency dentist"\`).
* **Search Term**: What the *human user* actually typed into Google before clicking your ad.

Every week, agency media buyers conduct **Search Query Mining**: reading the raw Search Terms report to discover hidden budget leaks and block them immediately with **Negative Keywords**.

---

## 1. Real Search Terms Audit: Dr. Miller's Clinic
We pulled the last 14 days of raw search terms from Dr. Miller's account. Notice the bleeding leaks:

| Actual Search Term | Clicks | Spend | Conversions | Action Required |
|---|---|---|---|---|
| *"emergency dentist open today morgantown"* | 14 | $72.80 | 4 calls | ✅ Add as Exact Match Keyword |
| *"free emergency dental extraction for low income"* | 22 | $114.40 | 0 | ❌ Block with Negative: \`-free\`, \`-low income\` |
| *"dental receptionist job openings"* | 18 | $93.60 | 0 | ❌ Block with Negative: \`-job\`, \`-openings\`, \`-hiring\` |
| *"home remedies for severe toothache clove oil"* | 31 | $161.20 | 0 | ❌ Block with Negative: \`-home remedies\`, \`-clove oil\`, \`-diy\` |

**Total Wasted Spend in 14 days**: $369.20. That is over **$730/month in pure budget bleed** from just 4 junk query patterns!

---

## 2. The Universal Negative Keyword Shield
Every agency maintains a **Master Negative Keyword List** deployed on Day 1 across all client accounts.

### Tier 1: Employment & Career Negatives
\`-job\`, \`-jobs\`, \`-hiring\`, \`-salary\`, \`-hourly pay\`, \`-career\`, \`-internship\`, \`-resume\`, \`-application\`.

### Tier 2: Free & Discount Bargain Negatives
\`-free\`, \`-pro bono\`, \`-cheap\`, \`-cheapest\`, \`-coupon\`, \`-discount code\`, \`-government assistance\`, \`-medicaid\` (if client doesn't accept it).

### Tier 3: DIY & Educational Research Negatives
\`-diy\`, \`-how to\`, \`-tutorial\`, \`-home remedy\`, \`-reddit\`, \`-youtube\`, \`-wikipedia\`, \`-definition\`, \`-tools\`, \`-kit\`.

---

## 3. The Golden AI Prompt: Negative Keyword Shield Generator
You can use AI to generate industry-specific negative shields tailored to any client niche.

### The Director-Level Prompt:
\`\`\`text
You are an expert Google Ads Negative Keyword Strategist. I manage a Google Ads account for Dr. Miller, a private emergency dental clinic in Morgantown, WV.

The clinic charges standard private practice rates and does NOT offer free care, does not accept Medicaid, and is not currently hiring staff.

Generate a comprehensive Master Negative Keyword List of 35 negative keywords organized into 4 distinct categories:
1. Employment & Job Search Negatives
2. Low-Income / Free / Government Aid Negatives
3. DIY / Home Remedy / Educational Research Negatives
4. Irrelevant Dental Specialties (e.g. orthodontics, dog dental, teeth whitening)

FORMAT: Output as a clean, single-column list suitable for copy-pasting directly into Google Ads Negative Keyword List. Format with a minus sign prefix or clean keyword text.
\`\`\`

---

## 4. Human-in-the-Loop Safeguard: Never Over-Negate!
Be careful: if you add \`-emergency\` as a negative keyword, you will accidentally shut off your most profitable campaigns!
* Always audit negative keywords for **false positives**.
* Negatives only block queries containing that exact word. Adding \`-free\` blocks *"free dentist"*, but allows *"pain free dental extraction"*. (To prevent blocking *"pain free"*, add \`[free dentist]\` or \`"free dental"\` as phrase negatives!).`,
    tasks: [{
      id: 1,
      description: "Analyze raw search terms, extract budget leaks, and construct a 35-keyword negative shield",
      type: "practical",
      requirements: ["Identify 3 categories of wasted search terms", "Create master negative list without blocking valid leads"],
      verificationCriteria: ["Negative list includes employment, free, and DIY terms"]
    }]
  },
  {
    id: 306,
    chapterNumber: 3,
    title: "Chapter 3.6: Day 2 (Do) — Deploying the Negative Shield & Budget Protection",
    level: "Intermediate",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Negative List Deployment", "Match Type Optimization", "PPC Waste Elimination"],
    content: `# Deploying the Negative Shield & Budget Protection

In this interactive session, you take over Dr. Miller's live Search Terms report inside the simulator, prune wasteful queries, and deploy a negative keyword shield.

---

## 1. The 3-Step Pruning Protocol

### Step 1: Filter Search Terms by Spend & Zero Conversions
1. Open the **Search Terms Report**.
2. Apply filter: \`Conversions = 0\` AND \`Spend > $20.00\`.
3. Sort by **Highest Spend**. These are your active budget bleeders.

### Step 2: Select and Add Negatives
* Identify the core non-commercial root word:
  * For *"dental assistant salary morgantown"* ➡️ Root word to block: \`salary\`, \`assistant\`.
  * For *"can I pull my infected molar myself"* ➡️ Root word to block: \`myself\`, \`pull my\`.
* Add them at the **Campaign Level** or to a **Shared Negative Keyword List** applied across all ad groups.

### Step 3: Promote Winning Search Queries
* Find queries where \`Conversions >= 2\` and \`Cost / Conv < $35.00\`:
  * *"emergency dental extraction morgantown"* (3 conversions, $18.40 CPA).
* Promote this query into an **Exact Match keyword** (\`[emergency dental extraction morgantown]\`) with an aggressive bid!

---

## 2. Interactive Simulator Challenge
Open the Google Ads simulator:
1. Audit the 20 raw search terms.
2. Flag and block at least 6 budget-bleeding queries using negative keywords.
3. Switch all broad match keywords in STAG 1 to **Phrase Match** (\`"..."\`) and **Exact Match** (\`[...]\`).
4. Verify that estimated monthly savings exceed **$450.00** without dropping a single qualified lead.`,
    tasks: [{
      id: 1,
      description: "Audit search terms, deploy negative keywords, and convert broad match to phrase/exact in the simulator",
      type: "simulation",
      requirements: ["Add at least 6 negative keywords", "Convert 4 broad match keywords to phrase/exact"],
      verificationCriteria: ["Wasted spend reduced to $0", "Projected monthly savings >= $450"]
    }]
  },

  // ==========================================
  // DAY 3: The Quality Score Auction & Ad Rank Formula
  // ==========================================
  {
    id: 307,
    chapterNumber: 3,
    title: "Chapter 3.7: Day 3 (Learn) — The Real Math of Google Auctions: Ad Rank & Quality Score",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Ad Rank Formula", "Quality Score Breakdown", "Actual CPC Calculation"],
    content: `# The Real Math of Google Auctions: Ad Rank & Quality Score

Most people assume Google Ads works like an antique auction: whoever bids the most cash wins the top spot.

**That is completely wrong.** If Google only showed the highest bidder, wealthy companies could bid $50 on irrelevant ads, users would stop clicking, and Google's multi-billion dollar business model would collapse.

Google uses a mathematical scoring mechanism called **Ad Rank** to reward relevant, high-quality advertisers with top positions at **massive discounts**.

---

## 1. The Ad Rank Formula
Your position on the search results page (Position 1, 2, 3, or bottom) is determined by:

$$\\text{Ad Rank} = \\text{Maximum Bid (Max CPC)} \\times \\text{Quality Score (1 to 10)}$$

### The Actual Cost-Per-Click (CPC) You Pay:
You do not pay your maximum bid! You pay the bare minimum needed to beat the Ad Rank of the competitor immediately below you:

$$\\text{Actual CPC} = \\frac{\\text{Ad Rank of Competitor Below}}{\\text{Your Quality Score}} + \\$0.01$$

---

## 2. The 3 Pillars of Quality Score (1 to 10)
Google evaluates every keyword in your account on a scale of 1 to 10 based on 3 distinct factors:

1. **Expected Click-Through Rate (eCTR) (Approx. 35% weight)**:
   * How likely Google predicts a searcher will click your ad based on historical performance and keyword match.
2. **Ad Relevance (Approx. 20% weight)**:
   * How directly your ad copy mirrors the user's searched term. If they search *"broken molar repair"* and your headline says *"Emergency Broken Molar Repair"*, your relevance is *Above Average*.
3. **Landing Page Experience (Approx. 45% weight)**:
   * Load speed (under 2.5 seconds).
   * Mobile responsiveness.
   * Clear, matching H1 headline.
   * Transparent pricing, phone number, and physical business address.

---

## 3. Real-World Auction Proof: The $6.00 Discount
Look at this real 3-way auction for the keyword \`emergency dentist morgantown\`:

| Competitor | Max CPC Bid | Quality Score | Ad Rank (Bid × QS) | Position | Actual CPC Paid |
|---|---|---|---|---|---|
| **Dr. Miller (You)** | **$5.00** | **9 / 10** | **45** | **#1 Spot (Top)** | **$3.34** |
| Competitor A | $6.00 | 5 / 10 | 30 | #2 Spot | $4.81 |
| Competitor B | $8.00 | 3 / 10 | 24 | #3 Spot | $6.26 |

### The Shocking Reality:
* **Competitor B bid $8.00** but landed in Position 3 and paid **$6.26 per click** because of a garbage 3/10 Quality Score.
* **Dr. Miller bid only $5.00**, landed in **Position 1**, and paid only **$3.34 per click**!
* **A high Quality Score cut Dr. Miller's cost per click almost in half!**

> [!IMPORTANT] The Economic Takeaway
> Quality Score is not a vanity metric. Improving your Quality Score from 5/10 to 9/10 lowers your client's advertising costs by up to 50% while giving them more visibility than competitors with twice their budget.`,
    tasks: [{
      id: 1,
      description: "Master the Ad Rank and Actual CPC formulas and analyze Quality Score economics",
      type: "quiz",
      requirements: ["Calculate Ad Rank from Max CPC and Quality Score", "Explain how a lower bidder can win Position 1"],
      verificationCriteria: ["Complete auction math calculation questions with 100% accuracy"]
    }]
  },
  {
    id: 308,
    chapterNumber: 3,
    title: "Chapter 3.8: Day 3 (See & AI Assist) — The 15-Headline RSA Matrix & AI Character Constraints",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Responsive Search Ads (RSAs)", "Ad Relevance Optimization", "AI Character Counting"],
    content: `# The 15-Headline RSA Matrix & AI Character Constraints

Google has phased out old Expanded Text Ads. Today, all search advertising runs on **Responsive Search Ads (RSAs)**.

In an RSA, you provide:
* **Up to 15 Headlines** (Maximum **30 characters** each).
* **Up to 4 Descriptions** (Maximum **90 characters** each).
* **Ad Assets (Extensions)**: Sitelinks, Callouts, Call Buttons, Structured Snippets.

Google's machine learning algorithm tests thousands of combinations in real time to show the highest-converting combination to every unique searcher.

---

## 1. The Anatomy of a Perfect 15-Headline Matrix
To achieve an **'Excellent' Ad Strength score** and a 9/10 Quality Score, your 15 headlines must follow a balanced psychological matrix:

### Group A: Keyword Mirroring (Headlines 1-4)
Directly repeats the searched keyword for maximum Ad Relevance:
1. \`Emergency Dentist Morgantown\` (27 chars)
2. \`Urgent Toothache Relief\` (22 chars)
3. \`Same-Day Dental Care\` (20 chars)
4. \`Morgantown Emergency Care\` (25 chars)

### Group B: Unique Value Proposition & Trust (Headlines 5-8)
Builds credibility and differentiates from competitors:
5. \`Over 500 5-Star Reviews\` (24 chars)
6. \`Gentle, Pain-Free Dentistry\` (27 chars)
7. \`Family Owned in Morgantown\` (25 chars)
8. \`Experienced Dental Surgeons\` (26 chars)

### Group C: Clear Call to Action & Urgency (Headlines 9-12)
Tells the user exactly what to do next:
9. \`Call Now for Immediate Care\` (27 chars)
10. \`Walk-Ins Welcome Today\` (22 chars)
11. \`Book Online in 60 Seconds\` (25 chars)
12. \`Open Late & Saturdays\` (21 chars)

### Group D: Risk Reversal & Pricing (Headlines 13-15)
Addresses financial friction:
13. \`Flexible Payment Plans\` (22 chars)
14. \`Most Insurance Accepted\` (23 chars)
15. \`Transparent Pricing Upfront\` (27 chars)

---

## 2. The Golden AI Prompt: The RSA Character Constraint Engine
AI models love writing long, wordy copy. To generate compliant Google Ads copy, you must enforce mathematical character boundaries.

### The Director-Level Prompt:
\`\`\`text
You are a senior Google Ads direct-response copywriter. I need a complete Responsive Search Ad (RSA) matrix for Dr. Miller Urgent Dental in Morgantown, WV.

TARGET KEYWORD: "emergency dentist morgantown"

PROVIDE:
1. Exactly 10 Headlines:
   - 3 Keyword Mirroring Headlines
   - 3 Value Proposition / Trust Headlines
   - 2 Urgent Call-to-Action Headlines
   - 2 Financial / Insurance / Convenience Headlines
2. Exactly 3 Descriptions (under 90 characters):
   - Description 1: Acute pain relief + same day appointment.
   - Description 2: Trust proof + insurance + gentle care.
   - Description 3: Location + direct call to action.

CRITICAL CONSTRAINTS:
- EVERY headline MUST be strictly 30 characters or fewer (including spaces).
- EVERY description MUST be strictly 90 characters or fewer (including spaces).
- Display character count next to each line: e.g. [27/30].
- No exclamation marks in headlines (Google policy).
\`\`\`

---

## 3. Human Audit: The Character Length Check
Never submit AI copy to a client or Google Ads without running a programmatic length check:
* A headline with 31 characters will throw a red error in Google Ads: *"Value is too long"*.
* If you pin headlines improperly (pinning 3 headlines to Position 1), you break Google's machine-learning optimization. Keep headlines unpinned unless client compliance legally mandates a specific disclaimer.`,
    tasks: [{
      id: 1,
      description: "Draft a 15-headline RSA matrix and audit character limits for Google Ads compliance",
      type: "practical",
      requirements: ["Generate 15 headlines categorized into 4 psychological themes", "Verify all headlines are <= 30 characters"],
      verificationCriteria: ["Zero headlines exceed 30 characters", "All 3 descriptions are <= 90 characters"]
    }]
  },
  {
    id: 309,
    chapterNumber: 3,
    title: "Chapter 3.9: Day 3 (Do) — Live RSA Optimization Drill & Quality Score Lift",
    level: "Intermediate",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["RSA Creation", "Ad Strength Optimization", "Sitelink Asset Integration"],
    content: `# Live RSA Optimization Drill & Quality Score Lift

In this hands-on workshop, you step into the **Google Ads Ad Creation Studio** to write, score, and optimize an RSA for Dr. Miller's Emergency Dental ad group.

---

## 1. The Ad Strength Scoring Engine
Google rates your ad copy in real time:
* **Poor**: Missing keywords in headlines, repetitive text, fewer than 5 headlines.
* **Average**: Contains basic keywords, but lacks diversity in call-to-actions.
* **Good**: 10+ headlines, varied angles, high keyword relevance.
* **Excellent**: 15 headlines covering keywords, social proof, CTA, and pricing, with 4 unique 90-character descriptions.

---

## 2. Essential Ad Assets (Extensions)
Ads with extensions occupy **twice as much vertical screen real estate on mobile devices**, pushing competitors below the fold.

### 4 Mandatory Assets to Add:
1. **Call Asset**: Adds a clickable phone number: *(304) 555-0199*. (Vital for mobile searchers in severe tooth pain).
2. **Sitelink Assets**: 4 direct links to key subpages:
   * Sitelink 1: *"Emergency Extractions"* ➡️ \`/extractions\`
   * Sitelink 2: *"Insurance & Financing"* ➡️ \`/insurance\`
   * Sitelink 3: *"Meet Dr. Miller"* ➡️ \`/about\`
   * Sitelink 4: *"Saturday Hours & Location"* ➡️ \`/contact\`
3. **Callout Assets**: Short 25-character bullet points:
   * *"Same-Day Appointments"*
   * *"Gentle Sedation Options"*
   * *"Accepts Most Insurance"*
   * *"Emergency Saturday Care"*
4. **Structured Snippet Asset**:
   * Header: *Services*
   * Values: *Tooth Extraction, Root Canals, Broken Crown Repair, Abscess Treatment*.

---

## 3. Simulator Task
1. Build an RSA for the *Emergency Dental* ad group.
2. Enter at least 10 compliant headlines and 3 descriptions.
3. Attach Call Asset and 4 Sitelinks.
4. Elevate Ad Strength from **Poor** to **Excellent** and observe Quality Score jump from **4/10 to 8/10**.`,
    tasks: [{
      id: 1,
      description: "Build an Excellent-rated RSA with 4 Sitelinks and Call Asset in the Google Ads Simulator",
      type: "simulation",
      requirements: ["Input 10+ headlines <= 30 chars", "Attach 4 sitelinks and phone call asset"],
      verificationCriteria: ["Achieve 'Excellent' Ad Strength rating", "Quality Score increases to >= 8/10"]
    }]
  },

  // ==========================================
  // DAY 4: Bidding Strategies & Budget Allocation
  // ==========================================
  {
    id: 310,
    chapterNumber: 3,
    title: "Chapter 3.10: Day 4 (Learn) — Bidding Strategies: Manual CPC vs. Smart Bidding",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Bidding Strategies", "Target CPA (tCPA)", "Smart Bidding Pitfalls", "Conversion Data Thresholds"],
    content: `# Bidding Strategies: Manual CPC vs. Smart Bidding

When launching a Google Ads campaign, Google will vigorously nudge you toward **Smart Bidding** (*Maximize Conversions*, *Target CPA*, *Target ROAS*).

Google claims its AI can predict who will convert better than any human. **That is true—BUT only when Google has sufficient conversion data.**

Turning on Smart Bidding on Day 1 of a new campaign is one of the quickest ways to incinerate a client's budget.

---

## 1. The 4 Core Bidding Strategies

### 1. Manual CPC (With or Without Enhanced CPC)
* **How it works**: You set the exact maximum dollar amount you are willing to pay for a click on each keyword (e.g., $4.50 max on \`"emergency dentist"\`).
* **Pros**: 100% control over budget. Google cannot spontaneously bid $25 on a random click.
* **Cons**: Requires manual monitoring and bid adjustments.
* **When to use**: **Brand new accounts with 0-30 historical conversions**.

### 2. Maximize Clicks
* **How it works**: Google attempts to get the highest number of clicks within your daily budget.
* **Pros**: Rapid traffic generation and quick keyword discovery.
* **Cons**: Google will intentionally buy the cheapest, lowest-quality clicks to inflate the click count.
* **When to use**: Almost never for lead gen, unless strictly collecting search term data with a strict **Maximum CPC bid cap**.

### 3. Maximize Conversions
* **How it works**: Google's algorithm bids aggressively on searches it calculates are most likely to result in a form submission or phone call.
* **Pros**: Optimizes for real leads rather than vanity clicks.
* **Cons**: If uncapped, Google might spend your entire $50 daily budget on just 2 super-expensive clicks!
* **When to use**: Accounts with at least 15-20 conversions in the last 30 days.

### 4. Target CPA (Cost-Per-Acquisition)
* **How it works**: You tell Google: *"Find me patients, but do not pay more than $45.00 per booked appointment on average."*
* **Pros**: Predictable acquisition costs and stable profit margins.
* **Cons**: If you set your target CPA too low (e.g. $10 in a market where clicks cost $7), Google will simply stop serving your ads.
* **When to use**: **Mature accounts with 30+ consistent monthly conversions**.

---

## 2. The Bidding Lifecycle: The 3-Phase Progression

\`\`\`
Phase 1: Launch (Weeks 1-3)
├── Strategy: Manual CPC (Enhanced) with strict bid caps ($4.50 - $6.00)
└── Goal: Gather 30 clean, verified conversions & prune negative keywords

Phase 2: Scale (Weeks 4-6)
├── Strategy: Maximize Conversions (Target CPA optional)
└── Goal: Train algorithm on verified phone calls & lead submissions

Phase 3: Mature Mastery (Month 2+)
├── Strategy: Target CPA ($38.00 tCPA) or Target ROAS (450% for e-commerce)
└── Goal: Automate profitable scale while protecting client unit economics
\`\`\`

> [!WARNING] The Day 1 Smart Bidding Trap
> Never launch a brand new campaign on Target CPA without historical data. Google's algorithm has zero idea what a converting user looks like, so it will test wildly different auctions at $15+ per click and burn through the budget before finding its footing.`,
    tasks: [{
      id: 1,
      description: "Compare bidding strategies and map the 3-phase progression from Manual CPC to Target CPA",
      type: "quiz",
      requirements: ["Identify when Manual CPC is mandatory", "Explain the data threshold required for Smart Bidding"],
      verificationCriteria: ["Answer all bidding strategy questions with 100% accuracy"]
    }]
  },
  {
    id: 311,
    chapterNumber: 3,
    title: "Chapter 3.11: Day 4 (See & AI Assist) — The $50/Day Budget Allocation & AI Bid Modeling",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Budget Pacing", "Dayparting Scheduling", "Device Bid Adjustments", "AI Scenario Modeling"],
    content: `# The $50/Day Budget Allocation & AI Bid Modeling

Digital marketing budgets do not exist in a vacuum. A client has finite cash flow. As an agency media buyer, you must allocate every dollar where it generates the highest probability of immediate return.

In this module, you analyze Dr. Miller's $1,500/month budget, deploy dayparting schedules, and use AI to model conversion outcomes.

---

## 1. Budget Pacing & Dayparting (Ad Scheduling)
Dr. Miller's dental clinic is open:
* Monday through Friday: 8:00 AM – 6:00 PM
* Saturday: 9:00 AM – 2:00 PM (Emergency Walk-ins Only)
* Sunday: CLOSED (Voicemail only)

### The Wasteful Default: 24/7/365 Delivery
Originally, Dr. Miller's ads ran 24 hours a day, 7 days a week.
* At 2:30 AM on Tuesday, a person clicked an ad ($6.50), called the office, reached a generic answering machine, and hung up.
* Over 25% of his budget was spent during hours when nobody was at the front desk to answer the phone!

### The Dayparting Fix:
1. Schedule ads to run only **Monday - Friday 7:30 AM – 6:00 PM** and **Saturday 8:30 AM – 2:30 PM**.
2. Shut off ads on Sundays.
3. Apply a **+20% Bid Adjustment** between 8:00 AM – 11:00 AM on weekdays (the peak hours when people wake up with tooth pain and book immediate appointments).

---

## 2. Device Bid Adjustments
Examine Dr. Miller's historical conversion rates by device:
* **Mobile Phones**: 8.4% conversion rate (users tap the phone number directly to call).
* **Desktop Computers**: 3.1% conversion rate (users fill out contact forms at work).
* **Tablets**: 0.6% conversion rate (browsing on iPads with high bounce rates).

### Tactical Adjustment:
* Mobile: **+15% Bid Adjustment** (win top mobile position).
* Desktop: **Baseline (0%)**.
* Tablets: **-50% to -100% Bid Adjustment** (eliminate low-intent tablet waste).

---

## 3. The Golden AI Prompt: PPC Conversion Scenario Modeling
Use AI to model how changing conversion rates, average order values, and CPC bids impact monthly client profit.

### The Director-Level Prompt:
\`\`\`text
You are a fractional Chief Marketing Officer and PPC Financial Analyst. I am building a budget model for Dr. Miller Urgent Dental in Morgantown, WV.

CLIENT UNIT ECONOMICS:
- Monthly Ad Spend: $1,500 ($50/day)
- Current Average CPC: $4.80
- Current Conversion Rate: 4%
- Average Revenue per New Patient: $350.00
- Client Gross Margin: 65%

MODEL 2 SCENARIOS:
Scenario A (Current Baseline): What are the monthly clicks, leads/patients, revenue, gross profit, and ROAS?
Scenario B (Optimized Quality Score & Dayparting):
- Average CPC drops by 25% (to $3.60) due to 8/10 Quality Score.
- Conversion rate increases to 7.5% due to dayparting and mobile call ads.
Calculate the new monthly clicks, leads, revenue, gross profit, and ROAS.

Provide a clear executive summary comparison table and highlight the net profit difference for Dr. Miller.
\`\`\`

---

## 4. Executive Insight
When you present this model to a client, you don't talk about 'bids' or 'Quality Scores'—you show them:
*"By fixing our ad schedule and improving ad relevance, we generate 19 additional high-value patients every month without asking for an extra penny of ad budget."* That is why agencies get retained!`,
    tasks: [{
      id: 1,
      description: "Analyze device and time-of-day conversion rates and execute the AI budget scenario model",
      type: "practical",
      requirements: ["Calculate savings from eliminating Sunday and overnight ads", "Model Scenario A vs Scenario B economics"],
      verificationCriteria: ["Demonstrate how CPC reduction and conversion lift compound client net profit"]
    }]
  },
  {
    id: 312,
    chapterNumber: 3,
    title: "Chapter 3.12: Day 4 (Do) — Setting Target CPA & Dayparting Schedule in Simulator",
    level: "Intermediate",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Ad Scheduling Setup", "Device Bid Adjustments", "Target CPA Calibration"],
    content: `# Setting Target CPA & Dayparting Schedule in Simulator

Now, take control of the **Krechet Academy Campaign Configuration Console** to implement surgical schedule and device controls.

---

## 1. Step-by-Step Configuration Guide

### Step 1: Configure Dayparting (Ad Schedule)
1. Navigate to **Campaign Settings ➡️ Ad Schedule**.
2. Remove the default *"All days, 24 hours"* rule.
3. Add Rule 1: **Monday – Friday: 07:30 – 18:00**.
4. Add Rule 2: **Saturday: 08:30 – 14:30**.
5. Leave Sunday unselected.

### Step 2: Implement Bid Adjustments
1. Under **Ad Schedule**, locate Monday–Friday 08:00 – 11:00.
2. Set Bid Adjustment to **+20%**.
3. Navigate to **Devices**.
4. Set Mobile phones to **+15%**.
5. Set Tablets to **-80%**.

### Step 3: Calibrate Bidding Strategy
1. Since the account has collected 32 verified conversions over the past month, shift from Manual CPC to **Maximize Conversions with a Target CPA**.
2. Target CPA calculation:
   * Target Acquisition Cost: **$42.00 per booked patient**.
   * Max CPC Safety Cap: **$7.50**.

---

## 2. Simulator Verification Criteria
* Check that ad delivery shuts down during non-business hours.
* Verify that mobile bids receive appropriate priority.
* Confirm the simulator projects an immediate 35%+ reduction in cost per qualified lead!`,
    tasks: [{
      id: 1,
      description: "Set ad schedules, device bid adjustments, and Target CPA in the Google Ads Simulator",
      type: "simulation",
      requirements: ["Lock ad schedule to clinic operating hours", "Apply +15% mobile adjustment and -80% tablet adjustment"],
      verificationCriteria: ["Projected CPA drops below $45.00", "Zero spend recorded outside operating hours"]
    }]
  },

  // ==========================================
  // DAY 5: Conversion Tracking, Crisis Drills & Week 3 Capstone
  // ==========================================
  {
    id: 313,
    chapterNumber: 3,
    title: "Chapter 3.13: Day 5 (Learn) — Conversion Tracking Hygiene: Primary vs. Secondary Actions",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Conversion Tracking", "Primary vs Secondary Actions", "Call Tracking Mechanics", "Offline Conversion Imports"],
    content: `# Conversion Tracking Hygiene: Primary vs. Secondary Actions

If you cannot measure conversions accurately, **Google's Smart Bidding algorithms will optimize for whatever garbage actions you feed them**.

A marketing agency is only as credible as its conversion telemetry. If you tell Google that someone visiting an 'About Us' page is a conversion, Google will find you 500 people who love reading 'About Us' pages—and zero people who actually book an appointment.

---

## 1. Primary vs. Secondary Conversion Actions

In Google Ads, every tracked action must be designated as either **Primary** or **Secondary**:

| Action Type | Definition | Included in Bidding Optimization? | Examples |
|---|---|---|---|
| **Primary** | Direct business revenue or qualified sales lead. | ✅ **YES**. Google's algorithm actively bids to maximize these. | Phone calls > 60 seconds, Completed Appointment Booking, Completed Checkout. |
| **Secondary** | Informational micro-actions or diagnostic metrics. | ❌ **NO**. Tracked for human reporting only, does NOT distort bidding. | Email newsletter signup, PDF brochure download, 3+ page views, Directions click. |

> [!CAUTION] The Toxic Mistake: Setting Secondary Actions as Primary
> If you set *'Clicked on Directions'* or *'Viewed Contact Page'* as Primary actions, Google will celebrate a 40% conversion rate and inflate your reports. But the client's waiting room will be completely empty! Always restrict Primary actions strictly to **high-intent leads and sales**.

---

## 2. Dynamic Call Tracking: Google Forwarding Numbers
For local service businesses like Dr. Miller Dental, **over 70% of conversions happen via telephone calls**.

### How Dynamic Call Tracking Works:
1. A small JavaScript snippet is installed on the client's website.
2. When a visitor lands from a Google Ad, the snippet automatically swaps Dr. Miller's public phone number with a unique **Google Forwarding Number (GFN)**.
3. When the patient dials, Google routes the call instantly to Dr. Miller's front desk.
4. Google tracks:
   * **Call Duration**: e.g., 3 minutes and 42 seconds.
   * **Caller Area Code**.
   * **Exact Keyword & Ad That Generated the Call**.
5. **The Quality Filter**: Set the conversion threshold to **minimum 60 seconds**. A call that lasts 12 seconds was a wrong number or voicemail—not a patient lead!

---

## 3. The Full Marketing Math: CAC vs. LTV
To report true ROI to a client, connect Google Ads telemetry to back-end unit economics:

$$\\text{Customer Acquisition Cost (CAC)} = \\frac{\\text{Total Google Ads Spend}}{\\text{Total Actual New Patients Acquired}}$$

$$\\text{Return on Ad Spend (ROAS)} = \\frac{\\text{Gross Revenue from Acquired Patients}}{\\text{Total Ad Spend}} \\times 100\\%$$

* If Dr. Miller spends **$1,500/month** and acquires **34 verified new patients**:
  $$\\text{CAC} = \\frac{\\$1,500}{34} = \\$44.12\\text{ per patient}$$
* If each new patient spends an initial **$320.00** for emergency treatment:
  $$\\text{Immediate Revenue} = 34 \\times \\$320 = \\$10,880.00$$
  $$\\text{Immediate ROAS} = \\frac{\\$10,880}{\\$1,500} = 7.25\\times\\text{ (725\\% ROAS)}$$
* Factoring in Patient Lifetime Value (LTV) of $1,800 over 3 years, the return is staggering. This is how you win client retainers for life.`,
    tasks: [{
      id: 1,
      description: "Master Primary vs. Secondary conversion hygiene and calculate CAC and ROAS metrics",
      type: "quiz",
      requirements: ["Distinguish Primary and Secondary conversion actions", "Calculate CAC and immediate ROAS"],
      verificationCriteria: ["Answer all conversion hygiene questions with 100% accuracy"]
    }]
  },
  {
    id: 314,
    chapterNumber: 3,
    title: "Chapter 3.14: Day 5 (See & AI Assist) — Emergency Ad Disapprovals & Director Atlas Crisis Drill",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Google Policy Compliance", "Ad Disapproval Appeals", "Crisis STAR Defense", "AI Policy Diagnosis"],
    content: `# Emergency Ad Disapprovals & Director Atlas Crisis Drill

At 8:45 AM on a Thursday morning, your phone rings. It's **Director Marcus Atlas** from Krechet Media Group:

> *"Our entire dental campaign for Dr. Miller was just slapped with a 'Policy Violation: Speculative & Experimental Medical Treatments' red flag! All our ads are disapproved, impressions dropped to zero, and Dr. Miller just texted me asking why his phone stopped ringing! I need you to pull up the policy center, diagnose the offending headline, fix the copy, file the appeal, and defend your corrective action to me in 10 minutes!"*

This is the reality of working in digital marketing. In healthcare, finance, legal, and local services, Google's automated policy bots frequently misflag compliant ads or reject copy.

---

## 1. The Healthcare Advertising Policy Minefield
Google Ads enforces strict policies around healthcare and medicine:
* **Prescription drugs**: Strictly prohibited without certified pharmacy licenses.
* **Guaranteed medical claims**: Words like *"guaranteed cure"*, *"permanent pain-free guarantee"*, or *"instant 100% recovery"* trigger instant bot suspensions.
* **Superlatives without third-party proof**: *"The #1 Best Dentist in West Virginia"* violates Google's Unsubstantiated Claims policy.

### The Culprit in Dr. Miller's Account:
A junior copywriter had added this headline:
\`Guaranteed Pain Relief Today\` (28 chars)

Google's automated scanner flagged the word **'Guaranteed'** as an illegal medical efficacy promise!

---

## 2. The Golden AI Prompt: Google Ads Policy Compliance Audit
When an ad is disapproved, use AI to diagnose the violation and generate policy-compliant alternatives.

### The Director-Level Prompt:
\`\`\`text
You are a Google Ads Policy Compliance Officer and Senior Medical Copywriter.

DISAPPROVED HEADLINE: "Guaranteed Pain Relief Today"
VIOLATION REASON: Healthcare & Medicines - Unsubstantiated Guarantees / Medical Claims.
CLIENT: Dr. Miller Family & Urgent Dental, Morgantown, WV.

TASK:
1. Explain exactly why Google's automated compliance bot flagged this headline.
2. Provide 4 policy-compliant replacement headlines that preserve high urgency and commercial intent WITHOUT making medical guarantees or violating policies.
3. Ensure every replacement headline is strictly under 30 characters.
4. Draft a concise 2-sentence explanation to submit to Google Ads Policy Appeals.
\`\`\`

---

## 3. High-Converting Policy-Safe Replacements:
* ❌ *'Guaranteed Pain Relief Today'* (Violates medical guarantee policy).
* ✅ *'Same-Day Toothache Relief'* (25 chars - Compliant: offers care timing, not a medical guarantee).
* ✅ *'Urgent Emergency Dental Care'* (28 chars - Compliant: describes clinic service).
* ✅ *'Gentle Local Dental Care'* (24 chars - Compliant: describes practice approach).
* ✅ *'Walk-Ins Welcome Today'* (22 chars - Compliant: logistical convenience).`,
    tasks: [{
      id: 1,
      description: "Diagnose medical policy violation, draft 4 compliant replacement headlines, and handle the Director Atlas crisis drill",
      type: "practical",
      requirements: ["Identify offending medical guarantee language", "Draft 4 compliant headlines <= 30 chars"],
      verificationCriteria: ["All replacement headlines comply with Google healthcare policy"]
    }]
  },
  {
    id: 315,
    chapterNumber: 3,
    title: "Chapter 3.15: Day 5 (Do) — Week 3 Capstone: Full Paid Search Campaign Launch & Audited Proof",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["End-to-End Campaign Launch", "Quality Score Mastery", "CPA Optimization", "Audited Portfolio Export"],
    content: `# Week 3 Capstone: Full Paid Search Campaign Launch & Audited Proof

Congratulations on reaching the **Week 3 Capstone of Krechet Academy**.

Over the last 14 lessons, you learned the math of Ad Rank, pruned negative keywords, crafted 15-headline RSA matrices, calibrated dayparting schedules, and resolved high-stress policy crises.

Now, you will take full executive responsibility for **Dr. Miller's Google Ads account** and launch an audited, end-to-end paid search engine.

---

## 1. The Capstone Mission Briefing
You have been allocated a **$1,500 monthly budget ($50/day)** for Dr. Miller's Morgantown clinic. Your goal is to deliver an account architecture that achieves:
1. **0% budget bleed** to Display or non-local searches.
2. **Quality Score average of >= 8/10** across all active keywords.
3. **Master Negative Shield** deployed with at least 25 standard negatives.
4. **Ad Strength rating of 'Excellent'** on both primary STAGs.
5. **Target CPA <= $42.00** with primary call tracking enabled (> 60s calls).

---

## 2. The 5-Step Capstone Execution Checklist

### Checklist Item 1: Campaign Infrastructure
* Name: *Search - Local - Emergency & Implants*
* Network: Search Network only (Display unchecked).
* Location: 15-mile radius around Morgantown, WV (Presence only).
* Budget: $50.00/day.

### Checklist Item 2: STAG Architecture
* **Ad Group 1**: *Emergency Dental* (Phrase & Exact match keywords for toothache, broken tooth, extraction).
* **Ad Group 2**: *Dental Implants* (Phrase & Exact match keywords for implant cost, tooth replacement).

### Checklist Item 3: Ad Copy & Extensions
* 15 compliant headlines (<= 30 chars) and 4 descriptions (<= 90 chars) per ad group.
* 4 Sitelinks + Callout Assets + Call Extension linked to *(304) 555-0199*.

### Checklist Item 4: Negative Shields & Schedule
* 25+ Master Negatives applied at Campaign level.
* Dayparting active: Mon-Fri 7:30 AM - 6:00 PM, Sat 8:30 AM - 2:30 PM, Sun OFF.
* Mobile adjustment: +15%, Tablets: -80%.

### Checklist Item 5: Telemetry & Verified Portfolio Export
* Run the 30-day simulation.
* Audit your final telemetry: Clicks, CTR, Quality Score, CPA, and ROAS.
* Export your **Audited Paid Search Case Study** directly into your **Krechet Career Portfolio**!`,
    tasks: [{
      id: 1,
      description: "Complete the full Dr. Miller Google Ads capstone simulation and export your verified case study",
      type: "simulation",
      requirements: [
        "Deploy STAG architecture with Phrase and Exact match",
        "Achieve Quality Score >= 8/10",
        "Deploy negative shield and operating hour dayparting",
        "Generate verified portfolio export with CPA < $42.00"
      ],
      verificationCriteria: [
        "All 5 checklist items validated by simulation telemetry engine",
        "Verified Paid Search Specialist credential unlocked"
      ]
    }]
  }
];

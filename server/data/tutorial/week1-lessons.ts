import type { Tutorial } from '../../services/tutorialService';

export const week1Lessons: Tutorial[] = [
  // Day 1
  {
    id: 101,
    chapterNumber: 1,
    title: "Chapter 1.1: Day 1 (Learn) — The Customer Journey & The 3-Stage Funnel",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Growth Funnels", "Customer Journey", "Funnel Architecture"],
    content: `# The Customer Journey & The 3-Stage Funnel

Welcome to **Krechet Academy**. Before spending a single dollar on ads or tweaking a website, you must understand how digital traffic actually turns into revenue.

## 1. The Core Mental Model: The Growth Funnel
Every profitable business on earth—whether a local coffee roastery, an emergency dental clinic, or a global software company—relies on a 3-stage customer funnel:

* **Top of Funnel (TOFU) — Awareness:** Introducing your brand to people who have never heard of you. They don't know your business exists, and they aren't looking to buy yet. Channels: Social reels, organic search guides, educational videos.
* **Middle of Funnel (MOFU) — Consideration:** Educating prospects who now recognize their problem or desire. They are comparing options, reading reviews, and checking ingredients or pricing. Channels: Email welcome series, product comparisons, customer testimonials.
* **Bottom of Funnel (BOFU) — Conversion:** High-intent prospects ready to purchase right now (e.g., searching *"buy fresh roasted coffee beans online"* or *"emergency dentist open Saturday"*). Channels: Google Search Ads, high-clarity landing pages, checkout flows.

## 2. The 97/3 Universal Rule
At any given moment in any market:
* Only **3%** of people are in "Buy Now" mode.
* The other **97%** are either problem-aware, browsing, or not ready yet.

> [!WARNING] The Amateur Trap: Shouting 'Buy Now' to Strangers
> The #1 mistake beginner marketers and small business owners make is driving cold traffic directly to a bare checkout page with a generic "Buy Now" button. Shouting "Buy Now" at someone who just discovered you is like asking someone to marry you on the first date. You burn your budget and get an 85%+ bounce rate.

## 3. The Universal Law: Clarity & Trust
Marketing is not trickery or manipulation. Marketing is simply **communicating value with extreme clarity and building trust at scale** so the right customer gladly pays for a great product.`,
    tasks: [{
      id: 1,
      description: "Review the 3-stage funnel architecture and complete the concept quiz",
      type: "quiz",
      requirements: ["Understand TOFU, MOFU, and BOFU stages", "Explain the 97/3 rule"],
      verificationCriteria: ["Answer all quiz questions with 100% accuracy"]
    }]
  },
  {
    id: 102,
    chapterNumber: 1,
    title: "Chapter 1.2: Day 1 (See & AI Assist) — Funnel Teardown & Ethical AI Mapping",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Funnel Teardowns", "Ethical AI Prompting", "Human-in-the-Loop Audit"],
    content: `# Funnel Teardown & Ethical AI Mapping

In this module, we look at real-world campaign architecture and learn how to use AI as your research intern without letting it write robotic nonsense.

## 1. Real-World Teardown: Jenny's Artisan Java
Jenny Miller founded **Jenny's Artisan Java & Roastery** in Morgantown, WV. She roasts world-class, small-batch, single-origin coffee. But her website is leaking cash:

* **What Jenny Was Doing:** She ran $500 of Facebook ads driving cold traffic to a raw product page titled *"Coffee Beans For Sale — $18.50"*.
* **The Result:** 3,400 visitors landed on the page. 2,860 bounced within 4 seconds. She got only 12 sales. She spent $500 to acquire just 12 customers—over $41.00 in ad spend for a single $18.50 bag! She lost money on every single order.
* **The Root Cause:** Jenny skipped the Awareness and Consideration stages. Cold visitors had no idea *why* her coffee was worth $18.50 when supermarket coffee is $8.99.

## 2. The Ethical AI Framework: 'AI is the Intern, You are the Director'
AI is a powerful brainstorming partner, but raw AI copy is full of generic clichés (*"In today's fast-paced digital landscape, coffee plays a pivotal role..."*). As a human director, you must provide strict constraints and context.

### The Golden Prompt Framework (Context + Goal + Constraints):
\`\`\`text
You are an expert digital marketing director. I am mapping a 3-stage customer funnel for Jenny's Artisan Java, a small-batch coffee roastery in Morgantown, WV.

Provide 1 practical tactic for each stage:
1. TOFU (Awareness): A sensory, educational hook for coffee lovers.
2. MOFU (Consideration): A trust-builder highlighting our 48-hour roast-to-ship freshness.
3. BOFU (Conversion): A low-risk introductory offer.

CONSTRAINTS:
- No generic marketing buzzwords (no 'game-changer', 'elevate', 'unleash', 'pivotal').
- Keep tone warm, grounded, and focused on bean freshness and taste.
\`\`\`

## 3. The Human Audit Checklist
Whenever AI produces output:
1. **Fact-Check:** Did AI invent features the business doesn't have?
2. **Strip Clichés:** Delete any sentence that sounds like a robot press release.
3. **Verify Reality:** Can the business operationalize this tomorrow?`,
    tasks: [{
      id: 1,
      description: "Audit an AI-generated funnel map and remove robotic clichés",
      type: "practical",
      requirements: ["Analyze the prompt constraints", "Identify 3 generic buzzwords to eliminate"],
      verificationCriteria: ["Draft an authentic human revision of the consideration stage"]
    }]
  },
  {
    id: 103,
    chapterNumber: 1,
    title: "Chapter 1.3: Day 1 (Do) — Interactive Funnel Audit & Leak Detection",
    level: "Beginner",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Funnel Diagnostics", "Bounce Rate Analysis", "Traffic Attribution"],
    content: `# Interactive Funnel Audit & Leak Detection

Now it's time to roll up your sleeves and inspect Jenny's live account inside the Krechet Academy simulator.

## 1. Mission Briefing
Jenny has provided us access to her live storefront analytics and attribution data. Your objective is to find the exact point where her marketing funnel is breaking down.

## 2. Key Diagnostic Signals to Inspect
* **Total Sessions:** How many people visited the site this month? (Baseline: ~3,400 sessions).
* **Bounce Rate:** What percentage of visitors leave immediately without viewing a second page or taking an action? (Warning: Any bounce rate over 70% indicates a severe disconnect between ad expectations and landing page reality).
* **Average Session Duration:** How long are people staying? (Under 15 seconds means visitors are bouncing before reading the value proposition).
* **Conversion Rate (CVR):** Total Purchases ÷ Total Sessions. (Jenny's baseline is stuck at 2.1%, below industry benchmarks for specialty roasters).

## 3. Hands-On Instructions
1. Open the **Client Dashboard** from Jenny's header.
2. Inspect the **Attribution & Growth Engine** metrics.
3. Identify the primary leak: Is the problem traffic volume, or is the landing page failing to convert the traffic she already has?
4. Document your diagnosis to prepare for Day 2's unit economics calculations.`,
    tasks: [{
      id: 1,
      description: "Inspect Jenny's baseline funnel metrics and verify the primary bottleneck",
      type: "simulation",
      requirements: ["Open Client Overview", "Review bounce rate and conversion rate"],
      verificationCriteria: ["Identify that 84% bounce rate is the primary revenue leak", "Confirm traffic volume is sufficient for testing"]
    }]
  },
  // Day 2
  {
    id: 104,
    chapterNumber: 1,
    title: "Chapter 1.4: Day 2 (Learn) — Unit Economics & The Math of Profitability",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Unit Economics", "AOV & Margin Math", "CAC & LTV Modeling"],
    content: `# Unit Economics: The Marketer's Financial Compass

Marketing without math is just guessing with somebody else's money. Whether you are managing client budgets or running your own business, unit economics dictate whether you grow or go bankrupt.

## 1. The 4 Essential Numbers
Before spending $1 on marketing, you must know these 4 metrics:

1. **Average Order Value (AOV):** Total Revenue ÷ Total Orders. If a store does $4,250 from 100 orders, the AOV is **$42.50**.
2. **Gross Profit Margin (%):** (Revenue - Cost of Goods Sold) ÷ Revenue. If a coffee bag sells for $18.50 and costs $7.00 to source, roast, and package, the gross margin is **62%**.
3. **Customer Acquisition Cost (CAC):** Total Ad Spend ÷ Total New Customers Acquired. If you spend $500 on ads and acquire 25 new customers, your CAC is **$20.00**.
4. **Customer Lifetime Value (LTV):** Average Order Value × Repeat Purchase Frequency × Average Customer Lifespan.

## 2. The Golden Ratio: LTV / CAC > 3.0
* **LTV / CAC < 1.0:** You lose money on every customer acquired. The faster you spend, the faster you fail.
* **LTV / CAC = 1.0 - 2.0:** High risk. Barely breaking even after operational overhead and merchant fees.
* **LTV / CAC >= 3.0:** The gold standard of profitable, sustainable growth.

## 3. Why ROAS Can Be Deceptive
Many marketers boast about a "3.0 ROAS" (Return on Ad Spend: $3 revenue for every $1 spent). But if your product has a 20% margin, a 3.0 ROAS means:
* $300 Revenue - $240 Product Cost = $60 Gross Profit.
* Minus $100 Ad Spend = **-$40 Net Loss!**
Never optimize for revenue alone. Always optimize for **contribution profit**!`,
    tasks: [{
      id: 1,
      description: "Calculate unit economics for a direct-to-consumer product",
      type: "practical",
      requirements: ["Calculate AOV from revenue and orders", "Determine gross margin percentage"],
      verificationCriteria: ["Verify correct formula application: (Revenue - COGS) / Revenue"]
    }]
  },
  {
    id: 105,
    chapterNumber: 1,
    title: "Chapter 1.5: Day 2 (See & AI Assist) — Coffee Unit Economics Teardown & AI Margin Calculation",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Margin Teardowns", "Break-Even CPA", "Ethical AI Verification"],
    content: `# Coffee Unit Economics Teardown & AI Margin Modeling

Let's dissect the exact unit economics of Jenny's Artisan Java and demonstrate how to use AI to build financial models without falling for AI calculation errors.

## 1. Jenny's Unit Economics Breakdown
* **Single Bag Retail Price:** $18.50
* **Cost of Goods Sold (COGS):** Green beans ($3.80) + Roasting fuel ($0.90) + Valve foil bag & label ($2.30) = **$7.00 total COGS**.
* **Gross Profit per Bag:** $18.50 - $7.00 = **$11.50 (62% gross margin)**.
* **Typical Basket Size:** Customers buy 2.3 bags on average $\\rightarrow$ **$42.50 AOV**.
* **Basket Gross Profit:** $42.50 × 62% = **$26.35**.
* **Fulfillment & Shipping Overhead:** $8.35 per box.
* **Contribution Margin (Pre-Marketing Profit):** $26.35 - $8.35 = **$18.00**.

> [!IMPORTANT] The Break-Even CPA Threshold
> Jenny makes **$18.00 net profit** per order before advertising. That means her **maximum allowable Break-Even CPA is exactly $18.00**!
> * If you acquire a customer for **$14.00**, Jenny pockets **+$4.00 profit** on order #1.
> * If you acquire a customer for **$24.00**, Jenny loses **-$6.00** on order #1 and must pray they reorder.

## 2. Using AI for Financial Modeling & The Math Trap
Large language models are probabilistic word predictors, not calculators. They frequently make subtle arithmetic errors when computing compound margins.

### How to Safely Prompt AI for Financial Calculations:
\`\`\`text
I need to calculate unit economics for a coffee e-commerce store.
Parameters:
- AOV: $42.50
- COGS: 38%
- Fulfillment/Shipping: $8.35 per order

Calculate:
1. Dollar gross profit per order.
2. Net contribution margin before marketing.
3. Maximum allowable break-even CPA.

Provide the exact mathematical formula for each step so I can verify the arithmetic.
\`\`\`

## 3. Human Director Guardrail
Always punch the raw numbers into a standard spreadsheet or calculator. Never present an AI-generated financial model to a client without verifying every single sum.`,
    tasks: [{
      id: 1,
      description: "Verify the break-even CPA formula and identify potential calculation traps",
      type: "practical",
      requirements: ["Check Jenny's gross profit margin", "Calculate contribution margin per order"],
      verificationCriteria: ["Confirm Jenny's break-even CPA is exactly $18.00"]
    }]
  },
  {
    id: 106,
    chapterNumber: 1,
    title: "Chapter 1.6: Day 2 (Do) — Interactive Break-Even CPA Calculator",
    level: "Beginner",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Break-Even Analysis", "Target ROAS Calculation", "Client Financial Guardrails"],
    content: `# Interactive Break-Even CPA Calculator

Now you will configure Jenny's financial guardrails in the Krechet Academy simulator to ensure her campaigns never spend at a loss.

## 1. Simulation Objective
Input Jenny's operational numbers into the **Unit Economics Engine**. The simulator will calculate her allowable Customer Acquisition Cost (CPA) and enforce a spend safety ceiling.

## 2. Values to Enter
* **Average Order Value (AOV):** $42.50
* **Gross Profit Margin:** 62.0%
* **Fulfillment & Packaging:** $8.35
* **Target Net Profit Margin per Order:** $3.80 (Safe Agency Cushion)

## 3. Mathematical Formula Used by the Engine
$$\\text{Allowable Target CPA} = (\\text{AOV} \\times \\text{Gross Margin}) - \\text{Fulfillment} - \\text{Target Profit}$$
$$\\text{Target CPA} = (\\$42.50 \\times 0.62) - \\$8.35 - \\$3.80 = \\$26.35 - \\$8.35 - \\$3.80 = \\$14.20$$

## 4. Why This Matters in Practice
By locking in a Target CPA of **$14.20**, you guarantee that every single first-time customer acquisition pays for the beans, shipping, ad spend, and leaves Jenny with a guaranteed profit on day one!`,
    tasks: [{
      id: 1,
      description: "Configure Jenny's unit economics guardrails in the simulator",
      type: "simulation",
      requirements: ["Access Unified Client Engine", "Input AOV and margin constraints"],
      verificationCriteria: ["Break-even CPA locked at $18.00", "Target CPA target established at $14.20"]
    }]
  },
  // Day 3
  {
    id: 107,
    chapterNumber: 1,
    title: "Chapter 1.7: Day 3 (Learn) — Client Discovery & Ideal Customer Profiles (ICP)",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Client Discovery", "Ideal Customer Profile", "Customer Psychology"],
    content: `# Client Discovery & Ideal Customer Profiles (ICP)

The best marketers in the world are not aggressive salespeople—they are master detectives. 

## 1. The Purpose of Client Discovery
Before writing a single ad headline or recommending marketing tactics, you must uncover three critical operational truths:
1. **Operational Capacity:** Can the business actually fulfill more orders? If Jenny can only roast 400 lbs of coffee a week, scaling ads to 1,000 lbs will destroy her reputation and delay shipments.
2. **Customer Objections:** Why do people browse the website and leave without buying? (e.g., *"Is this coffee bitter? Is it freshly roasted or sitting in a warehouse? How much is shipping?"*).
3. **The Unfair Advantage (Core Differentiator):** What is the one thing this business does that the massive national competitors cannot match?

## 2. Ideal Customer Profile (ICP) vs Generic Demographics
Amateur marketers describe their customer like this:
* ❌ *"Men and women aged 25–54 who drink coffee."* (This is completely useless—it describes 150 million people!).

Professional marketers define an Ideal Customer Profile based on **psychology, habits, and frustrations**:
* ✅ *"Home coffee enthusiast who owns an Aeropress or French Press, works from home, is frustrated by stale grocery store beans that lack a roast date, and values supporting independent, ethically sourced family roasteries."*

## 3. Finding the Emotional Buying Trigger
People do not buy a bag of brown roasted seeds. They buy:
* A rich, comforting morning ritual.
* The aromatic satisfaction of cafe-quality espresso in their own kitchen.
* The pride of serving friends artisanal coffee with real character.`,
    tasks: [{
      id: 1,
      description: "Define a comprehensive Ideal Customer Profile (ICP)",
      type: "practical",
      requirements: ["Contrast demographic vs psychographic profiling", "Identify 3 customer emotional buying triggers"],
      verificationCriteria: ["Submit a focused 1-paragraph ICP document"]
    }]
  },
  {
    id: 108,
    chapterNumber: 1,
    title: "Chapter 1.8: Day 3 (See & AI Assist) — High-Value vs Lazy Questions & Ethical AI Persona Brainstorming",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Discovery Questioning", "AI Persona Brainstorming", "Anti-Hallucination Guardrails"],
    content: `# High-Value Questions & Ethical AI Persona Brainstorming

The questions you ask a business owner determine whether they view you as a trusted strategic advisor or an amateur vendor.

## 1. High-Value vs. Lazy Discovery Questions
Look at the contrast between what amateur marketers ask versus what senior practitioners ask:

| Lazy / Amateur Question | High-Value Strategic Question | Why It Builds Rapport |
| :--- | :--- | :--- |
| *"What do you sell?"* | *"What are your top 2 highest-margin roasts, and what percentage of orders are one-time vs repeat subscriptions?"* | Shows you understand profit, not just top-line volume. |
| *"Who is your target audience?"* | *"What is the most common hesitation or skepticism you hear from first-time shoppers at your Morgantown tasting room?"* | Uncovers real-world objections you can answer directly in ad copy. |
| *"What is your budget?"* | *"Based on your 62% margin and $8.35 fulfillment, is $14 to $16 an acceptable target CPA for customer acquisition?"* | Proves financial competence before spending a single dollar. |

## 2. Ethical AI Workflow: Persona Brainstorming
AI is exceptionally good at helping you explore diverse customer perspectives, provided you guide it with real constraints.

### Sample Prompt for Customer Persona Development:
\`\`\`text
You are a consumer psychologist. I am analyzing the target audience for Jenny's Artisan Java, an independent coffee roastery in West Virginia.

Generate 2 distinct buyer personas:
1. The Morning Ritual Enthusiast (High-frequency daily drinker).
2. The Conscious Local Supporter (Values local craft and sustainability).

For each persona, include:
- Their primary daily friction with supermarket coffee.
- What specific proof on the website would make them feel safe buying.
- The exact headline angle that would capture their attention.

DO NOT use flowery language or generic marketing fluff. Ground all details in real coffee consumption habits.
\`\`\`

## 3. The Ethical AI Guardrail: Stereotype Check
Always inspect AI-generated personas for lazy stereotypes. If the AI assumes everyone in a state has identical tastes or income, refine the prompt to reflect authentic consumer segments.`,
    tasks: [{
      id: 1,
      description: "Critique and refine an AI-generated buyer persona",
      type: "practical",
      requirements: ["Identify 2 weak or cliché points in an AI persona", "Replace with authentic customer pain points"],
      verificationCriteria: ["Document approved with realistic customer objections"]
    }]
  },
  {
    id: 109,
    chapterNumber: 1,
    title: "Chapter 1.9: Day 3 (Do) — Client Inquiry Portal: Message Jenny Miller & Earn Rapport",
    level: "Beginner",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Client Communication", "Client Rapport Building", "Live Agency Portal"],
    content: `# Client Inquiry Portal: Message Jenny Miller & Earn Rapport

In this hands-on simulation, you will step into the client workspace and interview founder **Jenny Miller** directly.

## 1. Simulation Context
Jenny Miller is a master roaster, not a marketer. She cares deeply about coffee quality, roast dates, and fair-trade bean sourcing. She is watching how you approach her business. 

Your account starts with **90% Client Rapport**. If you ask thoughtful, high-value questions, your rapport will rise to **95%+**. If you ask low-effort questions, rapport drops.

## 2. Interactive Steps
1. In the top navigation bar of your workspace, locate the **Client Dossier & Inquiry Portal** button.
2. Open the portal to view Jenny's client card and operational bio.
3. Choose or write a strategic inquiry regarding:
   * Her **48-Hour Roast-to-Ship Guarantee** (her core differentiator).
   * Her **Unit Economics & Break-Even CPA threshold ($18.00)**.
   * Her **Past Marketing Experiments** and customer feedback.
4. Click **Send Inquiry** and review Jenny's live response.
5. Confirm that your **Client Rapport score increases to 95%**!`,
    tasks: [{
      id: 1,
      description: "Send a strategic discovery inquiry to Jenny Miller in the Client Portal",
      type: "simulation",
      requirements: ["Open Client Inquiry Portal", "Inquire about unit economics or roast freshness"],
      verificationCriteria: ["Receive Jenny's reply", "Increase Client Rapport to at least 95%"]
    }]
  },
  // Day 4
  {
    id: 110,
    chapterNumber: 1,
    title: "Chapter 1.10: Day 4 (Learn) — The 5-Second Test: Why Clarity Beats Cleverness in Headlines",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Headline Copywriting", "The 5-Second Test", "Value Proposition Architecture"],
    content: `# The 5-Second Test: Why Clarity Beats Cleverness in Headlines

The single most expensive mistake beginner marketers make is trying to sound "creative" or "clever" instead of being clear.

## 1. The 5-Second Attention Economy
When a prospective customer clicks an ad and lands on a homepage, you do not have 5 minutes to convince them. You have exactly **5 seconds** before their thumb swipes back or they close the tab.

In those 5 seconds, your hero banner must answer 3 questions without requiring scrolling:
1. **What is this?** (The exact product category).
2. **Why should I care?** (The primary benefit or unique differentiator).
3. **What do I do next?** (A clear, low-friction Call-to-Action).

## 2. The Cleverness Trap
Look at this real comparison:
* ❌ **Clever / Poetic Headline:** *"Awaken the Dawn of Pure Vitality."*
  * *Why it fails:* What does this company sell? Vitamin pills? Alarm clocks? Yoga mats? Coffee? The visitor has no idea, gets confused, and bounces. Confused visitors never buy.
* ✅ **Clear / Benefit Headline:** *"Small-Batch Artisan Coffee Roasted Fresh & Shipped to Your Door — 15% Off Your First Order."*
  * *Why it converts:* It immediately tells you what it is (artisan coffee), why it matters (roasted fresh, shipped to door), and what to do next (get 15% off).

## 3. The 3 Elements of a High-Converting Hero Section
1. **Primary Headline (H1):** The core promise in 6 to 12 words.
2. **Subheadline (H2):** 1 to 2 sentences expanding on the proof, roast freshness, and origin.
3. **Primary CTA Button:** High-contrast button with action-oriented text (*"Claim 15% Off First Batch"* beats a vague *"Submit"* or *"Learn More"*).`,
    tasks: [{
      id: 1,
      description: "Analyze and rewrite 3 vague headlines using the 5-Second Rule",
      type: "practical",
      requirements: ["Identify category ambiguity in sample copy", "Rewrite with product clarity and clear CTA"],
      verificationCriteria: ["Draft 3 headlines that pass all 3 questions of the 5-Second Test"]
    }]
  },
  {
    id: 111,
    chapterNumber: 1,
    title: "Chapter 1.11: Day 4 (See & AI Assist) — Teardown of 'Coffee Beans For Sale' & Ethical AI Copywriting",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Copywriting Teardown", "Ethical AI Copy Generation", "Character Limit Enforcement"],
    content: `# Headline Teardown & Ethical AI Direct-Response Copywriting

In this lesson, we break down Jenny's current baseline hero banner and show you how to co-pilot with AI to generate high-converting alternatives.

## 1. Deconstructing Jenny's Baseline Leaks
Jenny's current hero banner reads:
> **"Coffee Beans For Sale — Buy Now"**

Let's evaluate this against the 5-Second Test:
* **What is this?** Generic coffee beans. Sounds like a bulk commodity warehouse.
* **Why should I care?** Nothing mentioned about small-batch roasting, 48-hour freshness, single-origin sourcing, or mountain air roasting.
* **What do I do next?** "Buy Now" creates extreme commitment friction for a cold visitor who has never tasted her coffee.

## 2. Formulating the High-Converting Challenger
* **Challenger Headline:** *"Small-Batch Artisan Coffee Roasted Fresh & Shipped to Your Door"*
* **Challenger Subheadline:** *"Roasted within 48 hours of your order in Morgantown, WV. Never stale. 100% ethically sourced beans."*
* **Challenger CTA:** *"Get 15% Off Your First Batch"* (Low friction introductory trial).

## 3. Ethical AI Prompting: Generating Benefit-Driven Headlines
When prompting AI for headlines, always enforce **character constraints** and **benefit hooks**:

\`\`\`text
You are a senior direct-response copywriter. Write 5 headline variations for Jenny's Artisan Java, a small-batch coffee roastery.

REQUIREMENTS:
- Each headline must emphasize roast freshness and sensory taste.
- Length: Between 6 and 10 words.
- Include 1 variation focused on the 'Anti-Stale Guarantee'.
- Include 1 variation focused on the '15% Welcome Discount'.

CONSTRAINTS:
- Do not use exclamation points.
- Do not use generic words like 'premium', 'delightful', or 'best'.
- Every headline must be clear and direct.
\`\`\`

## 4. The Human Director Verification
Select the AI candidate that best matches Jenny's authentic operational reality. If Jenny only roasts whole beans, ensure the headline does not imply instant pods!`,
    tasks: [{
      id: 1,
      description: "Draft 3 challenger headline options using the prompt framework",
      type: "practical",
      requirements: ["Enforce 6-10 word constraint", "Highlight roast freshness benefit"],
      verificationCriteria: ["Select 1 candidate variant for live A/B testing"]
    }]
  },
  {
    id: 112,
    chapterNumber: 1,
    title: "Chapter 1.12: Day 4 (Do) — A/B Test Headline Lab: Live Visual QA & Challenger Copy",
    level: "Beginner",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["A/B Test Setup", "Visual QA Preview", "Live Split Testing Lab"],
    content: `# A/B Test Headline Lab: Live Visual QA & Challenger Copy

Now you will enter the **Krechet Academy A/B Testing Lab** and visually prepare your challenger headline alongside Jenny's baseline control.

## 1. Your Mission
Before deploying any change to live visitors, professional agencies conduct a **Visual QA Review** on both desktop and mobile viewports. You will inspect the Control (Card A) and configure your Challenger (Card B).

## 2. Interactive Steps
1. Navigate to the **A/B Testing Lab** (\`/ab-test-workshop\`).
2. Review the **Targeting & Rigor Configuration Bar**:
   * Target URL: \`jennysartisancoffee.com/\`
   * Traffic Split: 50% Control / 50% Challenger
   * Conversion Goal: Store Purchase ($42.50 AOV)
   * Statistical Threshold: 95% Confidence ($p < 0.05$)
3. In the **Candidate Variant Configuration Panel**, select the **Fresh Roast + 15% Discount** preset or enter your custom copy.
4. Inspect the **Live Side-by-Side Visual QA Preview**:
   * Toggle between **Desktop** and **Mobile** preview modes.
   * Verify that Card A displays the Control (*"Coffee Beans For Sale"*) and Card B displays your Challenger with the 48-hour freshness badge and 15% discount CTA.
5. Confirm that both variants look visually sharp and ready for traffic injection.`,
    tasks: [{
      id: 1,
      description: "Configure and visually QA the challenger hero banner in the A/B Testing Lab",
      type: "simulation",
      requirements: ["Navigate to /ab-test-workshop", "Select Fresh Roast + 15% Discount preset", "Inspect Desktop and Mobile QA cards"],
      verificationCriteria: ["Card B displays challenger copy and 15% discount CTA", "Ready for traffic simulation"]
    }]
  },
  // Day 5
  {
    id: 113,
    chapterNumber: 1,
    title: "Chapter 1.13: Day 5 (Learn) — How A/B Testing Works: Statistical Significance (p < 0.05) & Split Routing",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["A/B Testing Methodology", "Statistical Significance (p-value)", "Sample Size Rigor"],
    content: `# How A/B Testing Works: Statistical Significance & Split Routing

A/B testing is the scientific method applied to digital marketing. It protects businesses from wasting money on opinions and replaces guesswork with mathematical certainty.

## 1. How Split Testing Technology Operates
When an A/B test is active on a website:
1. A new visitor arrives at the homepage.
2. The split-testing script randomly assigns them a cookie (50% chance of seeing Version A, 50% chance of seeing Version B).
3. The visitor is pinned to that version for their entire session so their experience never flickers or changes.
4. The system tracks whether each visitor completes the primary conversion goal (e.g., placing an order).

## 2. The Danger of Small Sample Sizes
Imagine flipping a coin 10 times. It might land on heads 7 times. Does that mean the coin is rigged? No—that is simply random statistical variance.

If you run an A/B test for 2 hours:
* Version A: 20 visitors, 1 purchase (5.0% CVR).
* Version B: 20 visitors, 2 purchases (10.0% CVR).
* **Is Version B twice as good?** Absolutely not! If one more person buys on A, the numbers flip completely. Making business decisions on 40 visitors is pure gambling.

## 3. The 95% Confidence Standard (p < 0.05)
In professional marketing, you never declare a winner until you achieve **95% Statistical Confidence** (meaning there is less than a 5% probability that the result occurred due to random chance).
* You need sufficient sample size (typically 1,000+ visitors and 50+ conversions per variation).
* You must run the test through full weekly purchasing cycles (including weekends).`,
    tasks: [{
      id: 1,
      description: "Explain why sample size and statistical confidence protect client ad spend",
      type: "quiz",
      requirements: ["Define p < 0.05", "Explain the coin-flip analogy in marketing tests"],
      verificationCriteria: ["Pass the statistical confidence check with 100% score"]
    }]
  },
  {
    id: 114,
    chapterNumber: 1,
    title: "Chapter 1.14: Day 5 (See & AI Assist) — Sample Size Traps & Catching AI Misinterpretations",
    level: "Beginner",
    estimatedTime: 15,
    skillsLearned: ["Sample Size Traps", "AI Analytical Auditing", "Data Integrity"],
    content: `# Sample Size Traps & Catching AI Data Misinterpretations

One of the most dangerous modern risks is asking an AI to analyze marketing data and blindly trusting its conclusion.

## 1. The Real-World Test Trap: Prompting AI with Incomplete Data
Look what happens when an untrained marketer inputs small-sample data into ChatGPT:

\`\`\`text
Marketer: "I ran a test on my coffee website. 
Variant A got 4 sales from 45 visitors. 
Variant B got 9 sales from 48 visitors. 
Should I switch to Variant B?"

Raw AI Response: "Yes! Variant B had an 18.75% conversion rate compared to Variant A's 8.89%. That is more than double the performance! You should permanently adopt Variant B immediately!"
\`\`\`

## 2. Why the AI's Advice is Dangerous
The raw AI answered like an over-enthusiastic junior intern:
* It looked at the raw percentages (**18.75% vs 8.89%**).
* It completely ignored **statistical sample size**.
* A sample of only 93 total visitors has a massive margin of error. A two-tailed chi-squared test yields a $p$-value around **0.17**! 
* That means there is a **17% likelihood this entire difference was random luck**—failing the industry standard 5% ($p < 0.05$) threshold.

## 3. How to Prompt AI Like a Strategic Director
When analyzing test results with AI, always instruct it to calculate statistical confidence first:

\`\`\`text
You are a senior growth data analyst. Evaluate the following A/B test results:
- Control (A): 45 visitors, 4 conversions.
- Challenger (B): 48 visitors, 9 conversions.

REQUIREMENTS:
1. Calculate the p-value and statistical confidence level.
2. State clearly whether this test meets the 95% confidence threshold (p < 0.05).
3. Provide an executive recommendation on whether to declare a winner or continue gathering sample volume.
\`\`\`

## 4. The Human Takeaway
Never let software or AI push a website change live until the math verifies that the lift is real.`,
    tasks: [{
      id: 1,
      description: "Audit an A/B test scenario for statistical validity",
      type: "practical",
      requirements: ["Identify when sample size is insufficient", "Reject premature declarations of victory"],
      verificationCriteria: ["Verify p-value requirement before making permanent deployment decisions"]
    }]
  },
  {
    id: 115,
    chapterNumber: 1,
    title: "Chapter 1.15: Day 5 (Do) — Deploy the Winning Headline & Level 1 Week 1 Certification Audit",
    level: "Beginner",
    hasSimulation: true,
    estimatedTime: 20,
    skillsLearned: ["A/B Test Execution", "Live Deployment", "AI Authenticity Audit", "Level 1 Certification"],
    content: `# Deploy the Winning Headline & Level 1 Week 1 Certification Audit

This is the culminating milestone of Week 1 at **Krechet Academy**. You will execute the simulated A/B test traffic sprint, deploy the winning variant to Jenny's live account, and submit your strategic reasoning to the **AI Authenticity Auditor**.

## 1. Part 1: Execute & Deploy the A/B Test
1. In the **A/B Testing Lab** (\`/ab-test-workshop\`), click **"Launch A/B Test"**.
2. The simulation engine will inject 2,500 blended inbound visitors across the 50/50 split.
3. Observe the results:
   * **Control (A):** 1,250 visitors $\\rightarrow$ 26 orders (2.1% CVR).
   * **Challenger (B):** 1,250 visitors $\\rightarrow$ 34 orders (2.7% CVR).
   * **Result:** **+28.6% Conversion Rate Lift** at **95.2% Statistical Confidence ($p = 0.024$)**.
4. Click **"Deploy Winner to Client Account"**.
5. Notice the instant ripple effect: Jenny's Blended CAC drops from $24.50 to $18.20, and her Google Ad Quality Score improves!

## 2. Part 2: The Level 1 Week 1 Certification Audit
To earn your official **Level 1 Digital Marketing Specialist Credential**, open the **End-of-Week Knowledge & Certification Check** modal in Jenny's client header.

You will complete:
* **3 Practical Scenario Audits:** Multi-choice testing on unit economics, the 5-second headline test, and sample size requirements.
* **2 Written Strategic Reasoning Questions:** Defending your headline choice and explaining why unit economics must precede ad spend.

> [!CAUTION] The AI Authenticity Auditor is Active
> Your written answers will be evaluated by the Krechet Academy AI Authenticity Auditor. If your submission uses generic copy-paste AI clichés (*"in today's digital landscape"*, *"plays a pivotal role"*), it will be **rejected**.
> 
> Write like a real human marketing practitioner: Ground your reasoning in **Jenny's numbers ($42.50 AOV, 62% margin, $18.00 break-even CPA)** and **coffee roast freshness**!
> 
> Upon passing, your official digital credential will be stamped and issued to your account.`,
    tasks: [{
      id: 1,
      description: "Execute the A/B test, deploy the winner to Jenny's account, and pass the Level 1 Week 1 Audit",
      type: "simulation",
      requirements: [
        "Launch A/B test with 95% confidence in /ab-test-workshop",
        "Deploy winning challenger headline to live client account",
        "Complete and submit the Level 1 Certification Audit in the client header"
      ],
      verificationCriteria: [
        "Winning variant deployed (+28.6% CVR lift active in client engine)",
        "AI Authenticity Auditor approves human strategic reasoning",
        "Level 1 Week 1 Credential awarded"
      ]
    }]
  }
];

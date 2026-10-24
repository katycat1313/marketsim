import type { Tutorial } from '../../services/tutorialService';

export const week5Lessons: Tutorial[] = [
  // ==========================================
  // DAY 1: The Psychology of Interruption & Algorithmic Feeds
  // ==========================================
  {
    id: 501,
    chapterNumber: 5,
    title: "Chapter 5.1: Day 1 (Learn) — Search vs. Social: Demand Harvesting vs. Demand Generation",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Paid Social Strategy", "Demand Generation", "The 3-Second Hook Rule", "Meta Auction Algorithm"],
    content: `# Search vs. Social: Demand Harvesting vs. Demand Generation

Welcome to **Week 5 of Krechet Academy**. In Week 3, you mastered Google Search Ads—the art of **Demand Harvesting** (capturing people already searching for a solution).

Now, we enter **Paid Social Media Advertising (Meta & TikTok Ads)**—the art of **Demand Generation**.

---

## 1. The Fundamental Difference: Intent vs. Interruption

| Channel | User Mindset | Marketing Mechanism | Creative Role |
|---|---|---|---|
| **Google Search** | Active, focused, problem-aware (*"emergency dentist near me"*). | **Demand Harvesting**: You show up where they are looking. | Clarity and relevance; answering the searched query. |
| **Meta / TikTok** | Passive, relaxed, browsing for entertainment and distraction. | **Demand Generation**: You interrupt their scroll and make them care about a problem they weren't thinking about. | **Thumb-Stopping Hook**: You have 2.5 seconds to seize their attention. |

---

## 2. The Meta Auction Algorithm
Meta (Facebook & Instagram) does not sell ads to the highest bidder. The winning ad in every user feed auction is determined by:

$$\\text{Total Value} = \\left( \\text{Advertiser Bid} \\times \\text{Estimated Action Rate} \\right) + \\text{User Value Score}$$

### 1. Advertiser Bid
How much you are willing to pay for the conversion.

### 2. Estimated Action Rate (EAR)
Meta's algorithmic prediction of how likely this specific user is to complete your target action (click, lead, or purchase). If your ad has high historical engagement, your EAR skyrockets, lowering your cost per impression!

### 3. User Value Score (Ad Quality & Experience)
Meta protects its feed. If users hide your ad, report it, or bounce in 2 seconds, Meta slaps your account with a low User Value score and increases your CPMs (Cost Per Thousand Impressions) by up to 300%!

---

## 3. The 3-Second Rule: The Hook Rate
On mobile feeds, users scroll through **300 feet of content every single day** (the height of the Statue of Liberty!).

$$\\text{Hook Rate (Thumb-Stop Ratio)} = \\left( \\frac{\\text{3-Second Video Plays}}{\\text{Total Impressions}} \\right) \\times 100\\%$$

* **Failing Ad**: Under 20% Hook Rate (80%+ scroll right past without looking).
* **Average Ad**: 20% to 30% Hook Rate.
* **Top Agency Performer**: **35%+ Hook Rate**.

If you do not stop the thumb in the first 3 seconds, the rest of your video or copy does not exist!`,
    tasks: [{
      id: 1,
      description: "Understand the differences between Demand Harvesting and Demand Generation and the Meta auction formula",
      type: "quiz",
      requirements: ["Contrast Search vs. Social intent", "Calculate Hook Rate and explain its role in algorithmic ad delivery"],
      verificationCriteria: ["Complete Day 1 Paid Social assessment with 100% accuracy"]
    }]
  },
  {
    id: 502,
    chapterNumber: 5,
    title: "Chapter 5.2: Day 1 (See & AI Assist) — Jenny's Static Ad Teardown & The 5-Angle Hook Matrix",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Social Creative Teardowns", "Psychological Hook Angles", "Ethical AI Creative Generation"],
    content: `# Jenny's Static Ad Teardown & The 5-Angle Hook Matrix

In this lesson, we examine why Jenny's original Facebook ads burned $600 with only 3 sales, and we construct a 5-angle psychological hook matrix using AI.

---

## 1. Ad Creative Teardown: Jenny's Artisan Java
Jenny ran a paid Facebook ad with:
* **The Creative**: A generic studio photograph of a brown coffee bag sitting on a white table.
* **The Headline**: *"Buy Organic Coffee Beans Online"*.
* **The Copy**: *"Jenny's Artisan Java offers fresh roasted coffee beans in Morgantown. Try our delicious roasts today!"*

### Why This Creative Failed:
1. **Looked Like a Stock Billboard**: It looked like an annoying corporate advertisement. In a social feed, users instantly skip anything that looks like an ad.
2. **Zero Curiosity or Tension**: Why should anyone care? There is no story, no conflict, no sensory experience, and no revelation.
3. **The Telemetry Bleed**:
   * **Hook Rate**: 11.2% (88.8% skipped immediately).
   * **Cost Per Click (CPC)**: $4.18 (astronomically high for social).
   * **Cost Per Acquisition**: $200.00 per $18.50 coffee order!

---

## 2. The 5 Psychological Hook Angles
High-performing agencies test 5 distinct angles for every product:

### Angle 1: The Contrarian / Myth-Buster
Challenging accepted wisdom:
> *"Stop buying coffee with an 'expiration date' on the bag. If it doesn't have a ROAST date, you are drinking stale beans."*

### Angle 2: The High-Urgency Pain Point
Calling out daily frustration:
> *"Why does your 7:00 AM coffee taste like burnt battery acid? It's not your coffee maker—it's this hidden supermarket grocery store trick."*

### Angle 3: The Insider Secret / Education
Offering curiosity-driven knowledge:
> *"The 48-Hour Rule: What specialty Italian roasters know that Folgers doesn't want you to find out."*

### Angle 4: The Radical Social Proof
Leveraging crowd validation:
> *"Why over 4,000 West Virginia coffee lovers cancelled their Starbucks bean subscriptions this month."*

### Angle 5: The Sensory Transformation
Visceral sight and sound:
> *Close-up macro video of blooming coffee crema dripping from a fresh pour-over with ASMR roasting crackle sound effects.*

---

## 3. The Golden AI Prompt: The 5-Angle Social Hook Matrix
You can use AI to generate dozens of creative hooks across all 5 angles.

### The Director-Level Prompt:
\`\`\`text
You are a senior Paid Social Media Creative Director specializing in direct-response video ads for Meta and TikTok.

PRODUCT: Jenny's Artisan Java (Small-batch, single-origin coffee roasted within 48 hours of shipping in Morgantown, WV).
TARGET AUDIENCE: 25-45 year old remote workers and coffee enthusiasts who brew at home.

TASK:
Develop a complete 5-Angle Creative Hook Matrix:
1. Contrarian / Myth-Busting Hook
2. Pain Point / Morning Frustration Hook
3. Insider Secret / 48-Hour Roast Hook
4. Radical Social Proof Hook
5. ASMR / Sensory Transformation Hook

FOR EACH ANGLE, PROVIDE:
- Visual Action (What happens on screen in the first 2 seconds)
- Spoken / On-Screen Text Hook (Under 15 words)
- The Psychological Trigger (Why this stops the scroll)
- Target CTA
\`\`\`

---

## 4. Human-in-the-Loop Filter: The 'Friend Feed' Test
Look at every hook generated by AI and ask:
*"Would a real human pause their thumb while watching videos from their friends to look at this?"* If it sounds like a radio commercial, throw it away.`,
    tasks: [{
      id: 1,
      description: "Analyze Jenny's failing static ad and construct a 5-angle creative hook matrix",
      type: "practical",
      requirements: ["Identify 3 fatal flaws in the original ad creative", "Draft 5 distinct psychological hook scripts"],
      verificationCriteria: ["All hooks adhere to the 3-second mobile thumb-stop criteria"]
    }]
  },
  {
    id: 503,
    chapterNumber: 5,
    title: "Chapter 5.3: Day 1 (Do) — Live Social Ad Creative Scoring & Hook Analysis in Simulator",
    level: "Intermediate",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Hook Rate Auditing", "Creative Telemetry", "Click-Through Rate (CTR) Tuning"],
    content: `# Live Social Ad Creative Scoring & Hook Analysis in Simulator

In this hands-on workshop, you step into the **Krechet Academy Social Ad Telemetry Console** to evaluate 4 creative variations for Jenny's coffee brand.

---

## 1. The Core Creative Telemetry Metrics

1. **Thumb-Stop Ratio (Hook Rate)**:
   * Formula: \`3-Second Video Views ÷ Impressions\`. Benchmark: **>= 30%**.
2. **Hold Rate (Attention Quality)**:
   * Formula: \`ThruPlays (15s views) ÷ 3-Second Video Views\`. Benchmark: **>= 25%**.
3. **Outbound Click-Through Rate (CTR)**:
   * Formula: \`Outbound Link Clicks ÷ Impressions\`. Benchmark: **>= 1.5%**.
4. **Cost Per Outbound Click (CPC)**:
   * Benchmark: Under **$1.20** for consumer e-commerce.

---

## 2. Interactive Simulator Task
Open the simulator and evaluate the 4 video test assets:
* **Asset 1**: Static bag photo on kitchen counter.
* **Asset 2**: Slow-motion pour-over with ASMR audio bloom.
* **Asset 3**: Talking-head founder Jenny explaining the supermarket expiration myth.
* **Asset 4**: Customer unboxing reaction video.

Run the test cohort:
1. Observe the Hook Rates and outbound CTRs for each asset.
2. Cut the bleeding underperforming assets (Assets 1 & 2).
3. Scale budget to the top two winning creative angles (Assets 3 & 4) and verify that blended CPC drops below **$1.10**!`,
    tasks: [{
      id: 1,
      description: "Audit creative performance metrics and reallocate budget to winning hook angles in the Simulator",
      type: "simulation",
      requirements: ["Evaluate Hook Rate, Hold Rate, and outbound CTR across 4 creative assets", "Prune underperforming creatives"],
      verificationCriteria: ["Blended CPC drops below $1.10", "Campaign Hook Rate exceeds 32%"]
    }]
  },

  // ==========================================
  // DAY 2: The Meta Pixel, CAPI & Audience Architecture
  // ==========================================
  {
    id: 504,
    chapterNumber: 5,
    title: "Chapter 5.4: Day 2 (Learn) — Tracking in a Post-iOS 14.5 World: Pixel vs. CAPI",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Meta Pixel", "Conversions API (CAPI)", "Server-Side Tracking", "First-Party Data"],
    content: `# Tracking in a Post-iOS 14.5 World: Pixel vs. CAPI

In April 2021, Apple released **iOS 14.5** with App Tracking Transparency (ATT). Over **80% of iPhone users** tapped *"Ask App Not to Track"*.

Overnight, traditional browser-based tracking cookies broke. Marketers who relied solely on the client-side Meta Pixel saw reported ROAS crash by 50% and conversion tracking go blind.

To succeed in modern paid social, you must understand **Server-Side Tracking with Conversions API (CAPI)**.

---

## 1. Pixel (Browser-Side) vs. CAPI (Server-Side)

\`\`\`
Traditional Browser Pixel (Fragile):
[ User iPhone / Safari ] ──── (Blocked by AdBlock / iOS ATT) ───❌ [ Meta Servers ]

Modern Dual-Stack Tracking (Resilient):
[ User iPhone / Safari ]
         │
         ▼ (Encrypted Webhook)
[ Client Cloud Server / Shopify ] ──── (Direct Server-to-Server) ───✅ [ Meta CAPI ]
\`\`\`

### 1. Browser-Side Meta Pixel
* A piece of JavaScript running in the user's web browser.
* **Vulnerable to**: Safari ITP (7-day cookie caps), ad blockers, Brave browser, and iOS ATT opt-outs.
* Misses **15% to 30% of actual purchases**!

### 2. Conversions API (CAPI)
* An encrypted server-to-server connection between your website backend (e.g. Shopify, WordPress, or custom server) and Meta's servers.
* **Invulnerable to ad blockers and browser restrictions** because data flows directly from your server.
* Shares customer match parameters (hashed email, phone number, IP address) for precise algorithmic attribution.

---

## 2. Event Match Quality (EMQ)
Meta rates your CAPI connection on a scale of **1 to 10**:
* **Poor (1-4)**: Sending only generic page visits with no user identifiers.
* **Good (5-7)**: Sending hashed email and browser ID on purchase.
* **Great (8-10)**: Sending hashed email, phone, first name, last name, city, zip code, and external ID.
* High EMQ allows Meta to match conversions to the exact user profile who saw your ad, supercharging algorithmic optimization!

> [!IMPORTANT] The Golden Rule of Modern Tracking
> Never run paid social campaigns with browser pixel alone. Deploy the **Dual-Stack Architecture** (Browser Pixel + Conversions API with deduplication using \`event_id\`) to ensure 100% conversion visibility.`,
    tasks: [{
      id: 1,
      description: "Master the mechanics of iOS 14.5, Meta Pixel, and Conversions API (CAPI) tracking",
      type: "quiz",
      requirements: ["Contrast browser pixel vs server-side CAPI", "Explain Event Match Quality (EMQ) parameters"],
      verificationCriteria: ["Answer all tracking architecture questions with 100% accuracy"]
    }]
  },
  {
    id: 505,
    chapterNumber: 5,
    title: "Chapter 5.5: Day 2 (See & AI Assist) — Broad Targeting vs. Lookalikes & AI Persona Calibration",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Audience Architecture", "Broad Targeting", "Lookalike Audiences", "AI Persona Calibration"],
    content: `# Broad Targeting vs. Lookalikes & AI Persona Calibration

Years ago, Facebook media buyers built hyper-targeted audiences: stacking 45 different interest groups like *"People who like Starbucks AND follow Whole Foods AND read Barista Magazine"*.

Today, Meta's machine learning algorithm has evolved. **Over-targeting restricts the algorithm and inflates your CPMs.**

---

## 1. The Modern 3-Tier Audience Funnel

\`\`\`
Tier 1: Cold Prospecting (Top of Funnel - 70% Budget)
├── Strategy: Advantage+ Audience or Broad (Age + Gender + Location only)
└── Creative Role: The creative IS the targeting!

Tier 2: Engaged Consideration (Middle of Funnel - 15% Budget)
├── Strategy: 30-Day Video Viewers (50%+) & Instagram Profile Engagers
└── Creative Role: Deep dive into roast freshness, flavor notes, founder story

Tier 3: High-Intent Retargeting (Bottom of Funnel - 15% Budget)
├── Strategy: 14-Day Website Visitors & Cart Abandoners (Excluding Buyers)
└── Creative Role: Objection busting, reviews, 15% first-bag discount offer
\`\`\`

---

## 2. The Paradigm Shift: 'Creative is the Targeting'
When you run **Broad Targeting** (e.g., All Coffee Drinkers, Age 25-55 in the US):
* How does Meta know who to show the ad to?
* **Your creative acts as the filter**:
  * If your hook discusses *"pour-over grind size and single-origin acidity"*, casual soda drinkers scroll past, while specialty coffee obsessives stop and watch.
  * Meta's algorithm observes who watches 3+ seconds and immediately finds 100,000 more people identical to them!

---

## 3. The Golden AI Prompt: Audience Persona Calibration
Use AI to calibrate your buyer personas and extract demographic lifestyle triggers.

### The Director-Level Prompt:
\`\`\`text
You are an expert Meta Ads Audience Strategist. I manage paid social advertising for Jenny's Artisan Java in Morgantown, WV.

PRODUCT: Premium $18.50 single-origin coffee beans roasted within 48 hours of shipment.

TASK:
1. Define 2 distinct Buyer Personas for Meta Ads:
   - Persona A: The Work-from-Home Coffee Connoisseur (Aesthetic, flavor notes, ritual).
   - Persona B: The Busy Professional (Speed, clean energy, premium daily upgrade).
2. For each persona, provide:
   - Core emotional frustration with mass-market grocery store coffee.
   - 3 specific lifestyle triggers that prompt them to buy online.
   - Recommended Meta Ad formats (Reels, Carousel, Static).
   - Exact audience exclusions (e.g. past 30-day purchasers, instant coffee buyers).
\`\`\`

---

## 4. Human-in-the-Loop Safeguard: Audience Exclusions
The most expensive amateur mistake in paid social is forgetting to **exclude recent purchasers**.
* If someone bought a 2-bag coffee subscription yesterday, and you spend $2.50 serving them an introductory *"Try your first bag for 15% off"* ad tomorrow, you look unprofessional and incinerate your budget! Always exclude \`Purchasers (Last 30-180 Days)\` from cold prospecting.`,
    tasks: [{
      id: 1,
      description: "Map the modern 3-tier social audience funnel and execute the AI persona calibration prompt",
      type: "practical",
      requirements: ["Structure cold prospecting, middle engagers, and bottom retargeting", "Implement purchaser exclusions"],
      verificationCriteria: ["Audience architecture allocates 70% to cold prospecting and 15% to retargeting"]
    }]
  },
  {
    id: 506,
    chapterNumber: 5,
    title: "Chapter 5.6: Day 2 (Do) — Configuring the 3-Tier Audience Funnel in Simulator",
    level: "Intermediate",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Audience Setup", "Custom Audiences", "Exclusion Rules", "CAPI Verification"],
    content: `# Configuring the 3-Tier Audience Funnel in Simulator

In this interactive lab, you build and configure Dr. Miller's and Jenny's audience architecture inside the **Krechet Academy Social Campaign Manager**.

---

## 1. Step-by-Step Configuration Guide

### Step 1: Build Custom Retargeting Audiences
1. Navigate to **Audiences ➡️ Create Custom Audience**.
2. **Audience 1 (MOFU)**: *Instagram & Facebook 60-Day Engagers* (Anyone who interacted with a post or video).
3. **Audience 2 (BOFU)**: *Website Cart Abandoners (Last 14 Days)*.
4. **Audience 3 (Suppression)**: *Verified Customers (Last 90 Days)*.

### Step 2: Configure Cold Prospecting Ad Set
* Target: Women & Men Age 25-58.
* Location: Target state or 25-mile local radius.
* **Exclusion Rule**: Exclude Audience 3 (*Verified Customers*).
* Budget: Set to **70% of total daily spend ($70/day)**.

### Step 3: Configure Retargeting Ad Set
* Include: Audience 2 (*Cart Abandoners*).
* Exclude: Audience 3 (*Verified Customers*).
* Budget: Set to **15% of total daily spend ($15/day)**.
* Ad Creative: Mount the *'15% Off First Order + Free Shipping'* voucher card.

---

## 2. Simulator Verification Criteria
* Check that customer exclusions prevent wasted impressions to existing buyers.
* Confirm that retargeting frequency stays within the safe range (**1.8 to 2.8 impressions per user**).
* Verify that retargeting ROAS reaches **>= 4.5x**!`,
    tasks: [{
      id: 1,
      description: "Build custom audiences, apply purchaser exclusions, and calibrate 3-tier budget split in the Simulator",
      type: "simulation",
      requirements: ["Set up cold prospecting, MOFU engagers, and BOFU cart abandoners", "Deploy purchaser suppression rule"],
      verificationCriteria: ["Retargeting frequency remains between 1.8 and 2.8", "Retargeting ROAS reaches >= 4.5x"]
    }]
  },

  // ==========================================
  // DAY 3: Video Creative Strategy & The Short-Form UGC Engine
  // ==========================================
  {
    id: 507,
    chapterNumber: 5,
    title: "Chapter 5.7: Day 3 (Learn) — UGC Psychology: Why Raw iPhone Video Crushes High-Budget Studios",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["User-Generated Content (UGC)", "Direct-Response Video", "Authenticity Psychology"],
    content: `# UGC Psychology: Why Raw iPhone Video Crushes High-Budget Studios

If you spent $15,000 hiring a production crew with RED cinema cameras, professional lighting, and actors in hair and makeup to film a Facebook ad, **your ad would likely bomb completely**.

On TikTok, Instagram Reels, and YouTube Shorts, users have developed **Banner Blindness to Polished Ads**. The brain registers glossy lighting and staged actors as a commercial and swipes away in 0.5 seconds.

The highest-converting ad format in modern digital marketing is **User-Generated Content (UGC)**: videos filmed on regular iPhones by real customers or creators in everyday environments.

---

## 1. Why UGC Outperforms Studio Commercials

| Dimension | $10,000 Studio Commercial | Raw iPhone UGC Video |
|---|---|---|
| **Psychological Category** | Commercial Ad (Triggering resistance). | Friend's Organic Video (Inviting curiosity). |
| **First 2 Seconds** | Slow company logo animation. | Fast visual hook, messy kitchen, direct eye contact. |
| **Visual Lighting** | Flawless three-point studio lighting. | Natural window sunlight or ring light. |
| **Pacing** | Staged, slow corporate voiceover. | Rapid jump-cuts every 2-3 seconds with dynamic captions. |
| **Conversion Rate Lift** | Baseline. | **+28% to +65% higher ROAS**. |

---

## 2. The 3 Pillars of Authentic UGC
1. **Direct Eye Contact with the Camera Lens**: Creates an intimate, one-on-one FaceTime conversational feeling.
2. **Native Mobile Captions**: Over **75% of mobile users watch feed videos with sound turned off**. Large, dynamic, word-by-word captions (styled like CapCut or Submagic) are mandatory.
3. **Rapid Pacing & Visual Changes**: Change the visual angle every **2.5 to 3.5 seconds** (e.g. talking head ➡️ close-up of bean grind ➡️ pour-over drip ➡️ happy reaction sip). Never let the frame stay static.`,
    tasks: [{
      id: 1,
      description: "Master UGC direct-response video psychology and native mobile caption standards",
      type: "quiz",
      requirements: ["Contrast UGC vs studio commercials", "Explain why dynamic captions are mandatory for mobile feeds"],
      verificationCriteria: ["Answer all UGC psychology questions with 100% accuracy"]
    }]
  },
  {
    id: 508,
    chapterNumber: 5,
    title: "Chapter 5.8: Day 3 (See & AI Assist) — The 4-Part UGC Script Architecture & AI Scriptwriter",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["UGC Script Architecture", "Short-Form Video Directing", "AI Video Scriptwriting"],
    content: `# The 4-Part UGC Script Architecture & AI Scriptwriter

A great UGC ad is not random ramblings. It follows a mathematically proven direct-response script structure designed to capture attention, build desire, and compel action in under 45 seconds.

---

## 1. The 4-Part UGC Script Architecture

\`\`\`
[ 0:00 - 0:03 ] PART 1: The Hook (Thumb-Stopping Question / Conflict)
     │
[ 0:03 - 0:12 ] PART 2: The Agitated Problem (The Shared Pain Point)
     │
[ 0:12 - 0:28 ] PART 3: The Discovery & Product Demonstration (The Solution)
     │
[ 0:28 - 0:38 ] PART 4: The Frictionless Call to Action & Risk Reversal
\`\`\`

### Part 1: The Hook (0-3s)
* *Visual*: Creator smells a supermarket coffee bag, makes a disgusted face, and looks directly into the lens.
* *Audio*: *"If your coffee bag has a best-by date instead of a roast date, I'm sorry... but you're drinking dead coffee."*

### Part 2: The Problem (3-12s)
* *Visual*: Creator points to the tiny expiration date on a store-bought bag.
* *Audio*: *"Most grocery store coffee sat in a warehouse for 8 months before hitting the shelf. All the natural aromatic oils dried up, leaving that bitter, burnt taste you have to drown in creamer."*

### Part 3: The Discovery & Demo (12-28s)
* *Visual*: B-roll of unboxing Jenny's Artisan Java bag, showing the handwritten roast date stamped 3 days ago. Close-up of rich golden crema dripping into a mug.
* *Audio*: *"Then I found Jenny's Artisan Java. They roast in small batches in Morgantown and ship it within 48 hours. Look at this crema. It actually tastes like blueberries and dark chocolate with zero bitterness."*

### Part 4: The Call to Action (28-38s)
* *Visual*: Creator holds bag next to screen with discount code graphic overlay.
* *Audio*: *"Click the link below to get 15% off your first roast duo with free 2-day shipping. And if you don't love it, Jenny refunds every penny."*

---

## 2. The Golden AI Prompt: The 4-Part UGC Video Scriptwriter
Use AI to write complete, scene-by-scene UGC creator scripts.

### The Director-Level Prompt:
\`\`\`text
You are an award-winning TikTok and Meta UGC Direct-Response Video Director.

PRODUCT: Jenny's Artisan Java (Single-origin Ethiopian specialty coffee, roasted within 48 hours).
CREATOR PERSONA: 28-year-old remote graphic designer brewing coffee in their bright apartment kitchen.

WRITE A 35-SECOND DIRECT-RESPONSE UGC VIDEO SCRIPT:
Format as a 4-column production table:
1. Timestamp (Seconds)
2. Visual Action & B-Roll (Exactly what the creator does on camera)
3. Spoken Dialogue / Voiceover (Word-for-word conversational dialogue)
4. On-Screen Text & Sound Effects (Dynamic caption popups & audio cues)

CONSTRAINTS:
- Hook must occur in the first 2.5 seconds.
- Tone must feel 100% natural and unscripted (use contractions, casual pauses).
- Include clear risk-reversal guarantee in the CTA.
\`\`\`

---

## 3. Human Director Audit: Word Count vs. Second Count
A human speaks approximately **2.5 words per second** at conversational speed.
* A 30-second script should contain **70 to 80 words maximum**.
* If an AI generates a 180-word script for a 30-second video, the creator will have to rap like Eminem to fit it in! Always trim AI scripts down to crisp, punchy sentences.`,
    tasks: [{
      id: 1,
      description: "Analyze the 4-part UGC script architecture and generate a compliant 35-second video script with AI",
      type: "practical",
      requirements: ["Structure 4 phases: Hook, Problem, Demo, CTA", "Verify word count stays between 70-85 words"],
      verificationCriteria: ["Script includes visual action, spoken audio, and on-screen text overlays"]
    }]
  },
  {
    id: 509,
    chapterNumber: 5,
    title: "Chapter 5.9: Day 3 (Do) — Storyboarding and Auditing a 30-Second UGC Ad Script",
    level: "Intermediate",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Storyboard Auditing", "Video Pacing Diagnostics", "Creative Direction"],
    content: `# Storyboarding and Auditing a 30-Second UGC Ad Script

In this interactive module, you step into the **Krechet Academy Storyboard Studio** to review, audit, and approve a UGC creator submission for Jenny's Artisan Java.

---

## 1. The UGC Creator Review Checklist
When an influencer or freelance creator submits their raw video draft, evaluate it against this 4-step checklist:

### 1. The First 3 Seconds (The Hook Audit)
* Does something visually interesting happen in Frame 1?
* Does spoken dialogue begin within **0.3 seconds** (no awkward pauses)?
* Is there an on-screen text hook for silent viewers?

### 2. Audio Quality & Pacing
* Is the voice loud, crisp, and clear (no echo or heavy background noise)?
* Are there jump cuts removing all *"um"*, *"ah"*, and long pauses?

### 3. Product Demonstration
* Is the product shown clearly in the first 10 seconds?
* Does the video highlight the key differentiator (the handwritten roast date stamp)?

### 4. Native Platform Feel
* Is the video filmed vertically in **9:16 aspect ratio** (1080 × 1920)?
* Are critical text and buttons kept out of the TikTok/Instagram UI dead zones (the bottom comment area and right-side heart buttons)?

---

## 2. Interactive Simulator Task
1. Load the creator storyboard in the simulator.
2. Flag 3 pacing errors in the initial 15 seconds.
3. Trim the opening dead air to boost the Hook Rate.
4. Add high-contrast dynamic caption overlays in the center safe zone.
5. Export the approved video asset to the ad campaign engine!`,
    tasks: [{
      id: 1,
      description: "Audit and optimize a 30-second UGC video storyboard in the Storyboard Studio",
      type: "simulation",
      requirements: ["Eliminate opening dead air", "Ensure text overlays stay within 9:16 safe zones"],
      verificationCriteria: ["Video achieves simulated Hook Rate >= 34%", "Zero UI obstruction flags"]
    }]
  },

  // ==========================================
  // DAY 4: Ad Fatigue, Creative Scaling & The Andromeda Algorithm
  // ==========================================
  {
    id: 510,
    chapterNumber: 5,
    title: "Chapter 5.10: Day 4 (Learn) — The Mechanics of Creative Fatigue & Rising CPMs",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Creative Ad Fatigue", "Frequency Metrics", "Cost Per Mille (CPM)", "Creative Refresh Cadence"],
    content: `# The Mechanics of Creative Fatigue & Rising CPMs

You launch a winning Meta ad campaign on Monday. For the first two weeks, it prints money: 4.2x ROAS, cheap clicks, and dozens of new coffee subscribers.

Then, around Day 18, disaster strikes:
* Clicks become twice as expensive.
* Conversion rate plummets.
* ROAS drops from 4.2x down to 1.3x.
* The client panics and asks if the market has collapsed.

The market didn't collapse. Your campaign just hit **Creative Ad Fatigue**.

---

## 1. What is Creative Fatigue?
When your target audience has seen the exact same video 3, 4, or 5 times:
1. They stop watching.
2. Click-through rate (CTR) drops like a stone.
3. Negative feedback (swiping away, tapping *"Hide Ad"*) surges.
4. Meta's algorithm detects user boredom and punishes your account by jacking up your **CPM (Cost Per 1,000 Impressions)**!

---

## 2. Key Diagnostic Telemetry: The 3 Warning Signs

$$\\text{Frequency} = \\frac{\\text{Total Impressions}}{\\text{Total Unique Reach}}$$

| Telemetry Metric | Healthy Range | Fatigue Warning Zone | Emergency Action Required |
|---|---|---|---|
| **7-Day Frequency (Cold Prospecting)** | 1.1 – 1.8 | 2.2 – 2.8 | **> 3.0** (Audience is exhausted). |
| **Outbound CTR** | 1.5% – 3.0% | 0.8% – 1.1% | **< 0.7%** (Hook has lost power). |
| **CPM Trend** | Flat / Steady | +25% over 7 days | **+50%+ surge** (Algorithm penalizing low engagement). |

---

## 3. The Creative Refresh Cadence: 1 Script ➡️ 5 Hooks
You do not need to film a completely new commercial every 2 weeks to beat fatigue.

**80% of ad fatigue happens in the first 3 seconds.**
By keeping the same winning body (seconds 3-30) and filming **5 new 3-second opening hooks**, you create 5 brand new creative variations at a fraction of the cost:

\`\`\`
Winning Body (12-30s): Unboxing, Crema Demo, Taste Review
     ├── Hook Variant A: "Stop buying coffee with an expiration date..."
     ├── Hook Variant B: "Why your morning coffee tastes bitter..."
     ├── Hook Variant C: "Unboxing my 48-hour fresh roast delivery..."
     ├── Hook Variant D: "Morgantown's best kept secret..."
     └── Hook Variant E: "The 3-day test that ruined Starbucks for me..."
\`\`\`

> [!TIP] The Agency Rule of Thumb
> A brand spending $3,000/month needs at least **2 to 3 fresh creative variations launched every 14 days** to maintain stable acquisition costs.`,
    tasks: [{
      id: 1,
      description: "Master the mechanics of creative ad fatigue, frequency monitoring, and CPM inflation",
      type: "quiz",
      requirements: ["Calculate frequency from impressions and reach", "Diagnose the 3 symptoms of creative burnout"],
      verificationCriteria: ["Answer all creative fatigue questions with 100% accuracy"]
    }]
  },
  {
    id: 511,
    chapterNumber: 5,
    title: "Chapter 5.11: Day 4 (See & AI Assist) — Diagnosing a Burnout Crisis & AI Hook Iteration Engine",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Creative Burnout Diagnostics", "Hook Iteration", "AI Dynamic Hook Generation"],
    content: `# Diagnosing a Burnout Crisis & AI Hook Iteration Engine

In this lesson, you review a real client account crisis where performance cratered and use AI to generate 6 fresh opening hook variations in 5 minutes.

---

## 1. Case Study: Jenny's Ad Fatigue Crisis
Jenny's top-performing video ad (*'Supermarket Myth'*) had been running for 24 days:
* **Day 1-14**: $50/day spend, Frequency 1.3, CTR 2.4%, ROAS 3.8x.
* **Day 21**: Frequency spiked to **3.6**. CTR collapsed to **0.65%**. Cost per purchase surged from $22 to **$71.00**!

### The Mistake:
The media buyer did not launch any fresh creative assets. Meta had shown the exact same video to the Morgantown and West Virginia coffee audience almost 4 times per person. Everyone who was going to buy had already bought, and the rest were tired of seeing Jenny's face in their feed.

---

## 2. The Golden AI Prompt: The 5-Variation Hook Iteration Engine
When a winning ad fatigues, use AI to create 5 alternative opening hooks while keeping the proven core message intact.

### The Director-Level Prompt:
\`\`\`text
You are a senior Paid Social Performance Creative Director.

ORIGINAL WINNING SCRIPT (FATIGUED):
Hook: "Stop buying coffee with an expiration date on the bag."
Body: Explains 48-hour roasting, fresh oils, small batch Ethiopian beans, zero bitterness.
Offer: 15% off first order + free priority shipping over $35.

TASK:
Generate 5 RADICALLY DIFFERENT OPENING HOOKS (first 3 seconds / under 15 words) that lead seamlessly into the existing winning body:
1. Curiosity / Question Hook
2. Visual ASMR / Sensory Hook
3. Social Proof / Review Hook
4. Direct Callout / Geographic Hook
5. Negative Warning / Mistake Hook

FOR EACH HOOK:
- Provide on-screen visual action.
- Provide spoken voiceover text.
- Provide on-screen bold text overlay.
\`\`\`

---

## 3. Executive Standup Principle: Creative Diversification
Never rely on a single 'hero' ad. Maintain a testing sandbox where **80% of budget powers proven winners and 20% of budget tests new hooks continuously**. When the winner begins to fatigue, your next winner is already warmed up and ready to scale!`,
    tasks: [{
      id: 1,
      description: "Analyze the 24-day creative fatigue dataset and generate 5 hook iterations with AI",
      type: "practical",
      requirements: ["Identify frequency threshold that triggered CPM spike", "Generate 5 distinct opening hook variations"],
      verificationCriteria: ["All new hooks seamlessly transition into the existing winning video body"]
    }]
  },
  {
    id: 512,
    chapterNumber: 5,
    title: "Chapter 5.12: Day 4 (Do) — Creative Fatigue Diagnostic Drill in the Simulator",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Creative Refresh Execution", "Ad Swapping", "CPM Stabilization"],
    content: `# Creative Fatigue Diagnostic Drill in the Simulator

Now, take over Jenny's live Meta Ads Manager inside the simulator to rescue the account from creative burnout.

---

## 1. The 3-Step Emergency Turnaround Protocol

### Step 1: Identify and Pause the Fatigued Creative
1. Filter ad set by **Last 7 Days**.
2. Identify Asset A with Frequency > 3.2 and CTR < 0.8%.
3. Pause Asset A immediately to prevent further budget burn.

### Step 2: Upload 3 New Hook Variations
* Variation 1: Geographic Callout (*"Hey Morgantown coffee drinkers..."*).
* Variation 2: Visual ASMR (*Crema drip with no voiceover for first 2.5s*).
* Variation 3: Customer Unboxing Review (*"I was ready to give up on specialty coffee..."*).

### Step 3: Verify Frequency Reset & ROAS Recovery
* Launch the new variations into the active ad set.
* Accelerate simulation for 7 days.
* Observe average Frequency drop back to **1.4**, CTR climb back to **2.2%**, and blended ROAS recover to **>= 3.4x**!`,
    tasks: [{
      id: 1,
      description: "Execute the creative refresh protocol and recover campaign ROAS in the Simulator",
      type: "simulation",
      requirements: ["Pause fatigued creative assets with frequency > 3.0", "Deploy 3 fresh hook variations"],
      verificationCriteria: ["Frequency resets below 1.6", "Campaign ROAS recovers to >= 3.4x"]
    }]
  },

  // ==========================================
  // DAY 5: Omnichannel Retargeting, Blended CAC & Week 5 Capstone
  // ==========================================
  {
    id: 513,
    chapterNumber: 5,
    title: "Chapter 5.13: Day 5 (Learn) — Omnichannel Synergy: How Meta Ads Drive Organic Google Searches",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Omnichannel Attribution", "The Halo Effect", "Marketing Efficiency Ratio (MER)", "Blended CAC"],
    content: `# Omnichannel Synergy: How Meta Ads Drive Organic Google Searches

Amateur marketers look at marketing in silos: they view Google Ads, Meta Ads, and Organic SEO as separate, competing islands.

**In the real world, digital marketing is an interconnected ecosystem.**

---

## 1. The Social-to-Search 'Halo Effect'
Consider what actually happens when a user sees an engaging Instagram ad for *Jenny's Artisan Java*:
1. The user is on the train or in bed. They watch the video and find it interesting.
2. They do NOT click the ad because they don't want to leave Instagram right now.
3. Two hours later, sitting at their desktop computer, they open Google and search: **"Jenny's Artisan Java Morgantown"**.
4. They click Jenny's organic SEO link or Google Search ad and complete a $38 purchase!

### The Attribution Trap:
* **Google Analytics / GA4 reports**: 100% of the credit goes to *"Organic Search"* or *"Google Paid Search"*.
* **Meta Ads reports**: 0 conversions.
* If a clueless client cuts their Meta ad spend because *"it's not driving sales"*, **their organic Google searches immediately crash by 40%**!

---

## 2. Marketing Efficiency Ratio (MER) & Blended CAC
To measure the true health of an omnichannel business, smart agencies track macro unit economics:

$$\\text{Blended CAC} = \\frac{\\text{Total Marketing Spend (Google + Meta + Software)}}{\\text{Total New Customers Acquired Across All Channels}}$$

$$\\text{Marketing Efficiency Ratio (MER)} = \\frac{\\text{Total Company Gross Revenue}}{\\text{Total Combined Marketing Spend}}$$

### The Agency Standard:
* **MER < 2.5x**: Danger zone (high customer acquisition drag).
* **MER 3.0x – 4.5x**: Healthy, highly profitable growth.
* **MER > 5.0x**: Highly scalable—ready to increase ad spend aggressively!`,
    tasks: [{
      id: 1,
      description: "Master omnichannel synergy, the social-to-search halo effect, and MER formulas",
      type: "quiz",
      requirements: ["Explain why Meta ads inflate organic Google search volume", "Calculate Blended CAC and MER"],
      verificationCriteria: ["Answer all omnichannel attribution questions with 100% accuracy"]
    }]
  },
  {
    id: 514,
    chapterNumber: 5,
    title: "Chapter 5.14: Day 5 (See & AI Assist) — The Sudden CPM Spike Crisis & Director Atlas Social Defense",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["CPM Crisis Management", "Auction Competition Diagnostics", "Executive Client Defense"],
    content: `# The Sudden CPM Spike Crisis & Director Atlas Social Defense

On Black Friday week in mid-November, your phone rings. It's **Director Marcus Atlas**:

> *"Our client Jenny is in a full panic! Her Meta CPM just jumped from eighteen dollars to forty-six dollars overnight, her daily spend doubled, and she's demanding we shut off all paid social ads immediately! I need you to pull the auction insights, diagnose whether this is creative fatigue or macro seasonal competition, formulate our defense, and present the tactical roadmap to Jenny in 15 minutes!"*

---

## 1. Diagnosing a CPM Spike: Is It You, or Is It the Market?
When CPMs surge by 100%+, conduct this 3-question diagnostic triage:

1. **Did Hook Rate & User Engagement drop?**
   * If yes ➡️ **Creative Fatigue** (fix by swapping opening hooks).
   * If no ➡️ Look to macro auction conditions.
2. **Is it a seasonal retail peak (Q4 / Black Friday / Mother's Day)?**
   * During November, global giants (Target, Walmart, Amazon) pour hundreds of millions of dollars into the Meta ad auction. Total auction bids surge, driving up CPMs for everyone by **50% to 120%**.
3. **What is the Blended MER?**
   * If MER is still healthy (3.5x+) because holiday buyers convert at twice the normal rate, the higher CPM is completely offset by higher purchase volume!

---

## 2. The Golden AI Prompt: Executive Social Crisis Defense
Use AI to draft a calm, data-backed client explanation that preserves ad campaigns during macro market spikes.

### The Director-Level Prompt:
\`\`\`text
You are a seasoned Performance Marketing Agency Director.

CRISIS SITUATION:
Client Jenny (Jenny's Artisan Java) saw her Meta CPM jump from $18.50 to $42.00 during the first week of November. She is anxious and wants to turn off all ads.
DATA CONTEXT:
- Hook Rate is still strong at 34% (no creative fatigue).
- Conversion rate on the website actually rose from 2.8% to 4.1% due to holiday gift demand.
- Blended MER is currently 3.9x.
- Q4 e-commerce holiday auction competition has driven market-wide CPMs up 110%.

TASK:
Draft an empathetic, authoritative 3-paragraph executive briefing to Jenny:
1. Validate her concern about the higher CPM metric.
2. Explain the root cause (Q4 holiday retail surge vs. creative health) with clarity.
3. Show her why shutting off ads now would destroy her holiday revenue, using MER and conversion rate data to prove she is still profiting.
\`\`\`

---

## 3. The Executive Rule
Clients panic over isolated metrics (like CPM). Your job as a Growth Director is to anchor them back to **net cash profit and customer acquisition efficiency**.`,
    tasks: [{
      id: 1,
      description: "Diagnose seasonal CPM surge vs. creative fatigue and draft the Director Atlas executive defense",
      type: "practical",
      requirements: ["Perform 3-step diagnostic triage", "Draft 3-paragraph client reassurance briefing"],
      verificationCriteria: ["Briefing uses MER and conversion rate data to defend campaign continuation"]
    }]
  },
  {
    id: 515,
    chapterNumber: 5,
    title: "Chapter 5.15: Day 5 (Do) — Week 5 Capstone: Full Paid Social Campaign Launch & Audited Proof",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Paid Social Launch", "UGC Video Deployment", "Audience Scaling", "Verified Portfolio Proof"],
    content: `# Week 5 Capstone: Full Paid Social Campaign Launch & Audited Proof

Welcome to the **Week 5 Capstone of Krechet Academy**.

Over the last 14 lessons, you mastered the psychology of interruption, the Meta auction algorithm, Dual-Stack CAPI tracking, the 4-part UGC script formula, creative fatigue refresh cycles, and omnichannel MER economics.

Now, you will take full creative and media-buying ownership of **Jenny's Artisan Java Meta & TikTok campaign** and launch an audited, profitable customer acquisition engine.

---

## 1. The Capstone Mission Briefing
You have been allocated a **$2,500 monthly budget ($80/day)**. Your goal is to deliver an account architecture that achieves:
1. **Dual-Stack Tracking**: Conversions API (CAPI) active with Event Match Quality >= 8.0.
2. **3-Tier Audience Funnel**: Cold Prospecting (70%), MOFU Engagers (15%), BOFU Cart Retargeting (15%) with 90-day purchaser suppression.
3. **High-Performing UGC Creative**: At least 3 creative variations featuring proven hooks with Hook Rate >= 30%.
4. **Target Acquisition Benchmark**: Achieve a verified **Blended ROAS >= 3.2x** and **Customer Acquisition Cost (CAC) <= $28.00** across a 30-day simulated cohort!

---

## 2. The 5-Step Capstone Execution Checklist

### Checklist Item 1: Tracking & Pixel Architecture
* Verify Conversions API (CAPI) connection.
* Confirm Event Match Quality score >= 8/10.

### Checklist Item 2: Audience Funnel & Exclusions
* Cold Advantage+ / Broad targeting (Age 25-55).
* Exclude past 90-day purchasers.
* 14-day cart abandoner retargeting ad set.

### Checklist Item 3: Creative Suite Deployment
* Deploy 3 UGC video variations with dynamic mobile captions.
* Ensure all assets fit 9:16 vertical mobile aspect ratio.

### Checklist Item 4: Budget Pacing & Creative Rules
* Allocate 70% ($56/day) to Cold, 15% ($12/day) to MOFU, 15% ($12/day) to BOFU.
* Set automated rule: Pause any creative if Frequency > 3.0 and CTR < 0.9%.

### Checklist Item 5: Telemetry Verification & Portfolio Export
* Run the 30-day simulation.
* Audit your final metrics: Hook Rate, Outbound CTR, Frequency, Blended CAC, and ROAS.
* Export your **Audited Paid Social & UGC Specialist Case Study** directly into your **Krechet Career Portfolio**!`,
    tasks: [{
      id: 1,
      description: "Complete the full Jenny's Artisan Java paid social capstone launch and export verified portfolio proof",
      type: "simulation",
      requirements: [
        "Deploy 3-tier audience funnel with purchaser suppression",
        "Deploy 3 UGC creative variations achieving Hook Rate >= 30%",
        "Maintain Blended ROAS >= 3.2x and CAC <= $28.00",
        "Export verified case study to career portfolio"
      ],
      verificationCriteria: [
        "All 5 checklist items validated by simulation telemetry engine",
        "Verified Paid Social & UGC Specialist credential unlocked"
      ]
    }]
  }
];

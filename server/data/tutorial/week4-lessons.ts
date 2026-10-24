import type { Tutorial } from '../../services/tutorialService';

export const week4Lessons: Tutorial[] = [
  // ==========================================
  // DAY 1: The Psychology of CRO & Cognitive Friction
  // ==========================================
  {
    id: 401,
    chapterNumber: 4,
    title: "Chapter 4.1: Day 1 (Learn) — The Psychology of CRO & The LIFT Model",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Conversion Rate Optimization", "The LIFT Model", "Cognitive Friction Reduction", "Conversion Math"],
    content: `# The Psychology of CRO & The LIFT Model

Welcome to **Week 4 of Krechet Academy**. In Weeks 1, 2, and 3, you mastered how to drive qualified organic and paid traffic to a website. 

Now comes the ultimate agency lever: **Conversion Rate Optimization (CRO)**.

Driving traffic without CRO is like pouring water into a leaky bucket. If you double your traffic, you double your ad spend. But if you **double your conversion rate**, you double your sales **at zero additional ad cost**, instantly cutting your customer acquisition cost in half.

---

## 1. The Conversion Rate Formula
Conversion rate is the percentage of website visitors who complete a desired commercial action:

$$\\text{Conversion Rate (CR)} = \\left( \\frac{\\text{Total Conversions}}{\\text{Total Unique Visitors}} \\right) \\times 100\\%$$

### The Financial Power of CRO:
Imagine Jenny's Artisan Java gets 10,000 monthly visitors:
* At a **1.0% conversion rate**: 100 orders × $25 AOV = **$2,500/month**.
* At a **3.0% conversion rate**: 300 orders × $25 AOV = **$7,500/month**.
* **Result**: An extra **$5,000/month in pure revenue** ($60,000/year) from the exact same visitors!

---

## 2. The LIFT Model: The 6 Psychological Factors
Developed by WiderFunnel, the **LIFT Model** is the industry-standard mental model for diagnosing conversion friction:

\`\`\`
          [ Value Proposition ]  (The Core Driver)
                 ▲
       ┌─────────┴─────────┐
       │                   │
[ Relevance ]         [ Clarity ]
 (Does this match?     (Is it simple &
  Did ads align?)       instantly understood?)
       │                   │
       └─────────┬─────────┘
                 │
           [ Urgency ]
         (Why act today?)
                 │
       ─────────────────────  (The Friction Drag)
       │                   │
  [ Anxiety ]         [ Distraction ]
(Can I trust you?    (Too many links,
 Will I be scammed?)  popups, colors?)
\`\`\`

### 1. Value Proposition (The Core Propulsion Engine)
Why should the visitor buy from *you* instead of your competitors? What unique, tangible benefit do you guarantee?

### 2. Relevance
Does the landing page immediately mirror the exact promise made in the ad or search query? If they clicked an ad for *'Same-Day Tooth Extractions'*, does the headline say *'Emergency Same-Day Tooth Extractions'*?

### 3. Clarity
Can an exhausted, stressed user understand what you sell, how much it costs, and what button to click within **5 seconds**?

### 4. Urgency
Why must they take action right now instead of closing the tab and forgetting forever? (e.g. roast-date scheduling, limited emergency appointment slots).

### 5. Anxiety (The #1 Conversion Killer)
The psychological fear of being ripped off, having credit card info stolen, getting locked into hidden subscriptions, or experiencing pain.

### 6. Distraction (The Cognitive Overload)
Navigation menus with 15 links, blinking banners, auto-playing videos, and competing calls-to-action that pull attention away from the primary conversion goal.

---

## 3. Cognitive Load Theory: Don't Make Me Think
Every decision a user must make burns mental glucose.
* If a landing page presents **3 different buttons** (*'Buy Now'*, *'Learn More'*, *'Download Catalog'*), conversion rates plummet by 40%.
* **The Rule of One**: One landing page = **One Target Audience + One Clear Offer + One Primary Call to Action**.`,
    tasks: [{
      id: 1,
      description: "Master the Conversion Rate formula and the 6 psychological pillars of the LIFT Model",
      type: "quiz",
      requirements: ["Calculate conversion rates and revenue impact", "Differentiate value proposition, clarity, and anxiety"],
      verificationCriteria: ["Complete Day 1 CRO assessment with 100% accuracy"]
    }]
  },
  {
    id: 402,
    chapterNumber: 4,
    title: "Chapter 4.2: Day 1 (See & AI Assist) — Jenny's Leaking Product Page & AI Friction Teardown",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Landing Page Teardowns", "Friction Point Auditing", "Ethical AI Copy Audits"],
    content: `# Jenny's Leaking Product Page & AI Friction Teardown

In this lesson, we dissect Jenny's live e-commerce page to uncover why 98.8% of visitors bounce without buying, and we deploy AI to audit cognitive friction.

---

## 1. Landing Page Teardown: Jenny's Artisan Java
Jenny was driving Google and Facebook traffic to her default Shopify product page: \`/products/ethiopian-yirgacheffe\`.

### The Live Audit Telemetry:
* **Monthly Paid Clicks**: 2,500 visitors ($2,000 ad spend).
* **Orders Completed**: 30 orders.
* **Conversion Rate**: **1.2%**.
* **Average Acquisition Cost**: $66.67 per customer for an $18.50 bag of coffee!

### The 4 Glaring Psychological Leaks:
1. **Zero Value Proposition in H1**: The headline was simply *"Ethiopian Yirgacheffe — Medium Roast"*. Cold visitors had no idea this was roasted within 48 hours of shipping or sourced directly from fair-trade family farms.
2. **Hidden Shipping Costs (Anxiety Surge)**: Visitors added the $18.50 bag to cart, reached the final checkout step, and were slapped with a **$9.95 surprise flat-rate shipping fee**! 74% of visitors abandoned the checkout at this exact step.
3. **Massive Cognitive Distraction**: The top navigation bar included 9 links: *Home, Blog, Our Story, Wholesale, Merch, Recipes, Brewing Equipment, FAQ, Contact Us*. Over 35% of visitors clicked *'Our Story'* or *'Recipes'*, read a paragraph, and left without purchasing.
4. **No Visual Proof of Freshness**: No roast date stamps, no pictures of the packaging, and zero customer reviews.

---

## 2. The Golden AI Prompt: The LIFT Model Landing Page Auditor
You can feed any client landing page copy into external AI to run an objective friction teardown.

### The Director-Level Prompt:
\`\`\`text
You are a senior Conversion Rate Optimization (CRO) Director specializing in direct-to-consumer e-commerce.

LANDING PAGE AUDIT TARGET: Jenny's Artisan Java (Single-Origin Specialty Coffee)
PAGE CONTENT / ELEMENTS:
- H1 Headline: "Ethiopian Yirgacheffe - Medium Roast ($18.50)"
- Navigation Bar: 9 menu links (Home, Blog, About, Wholesale, Merch, Recipes, etc.)
- Body Text: Generic description of washed processing and floral tasting notes.
- Pricing/Checkout: $18.50/bag + $9.95 standard shipping revealed only at checkout.
- Social Proof: Zero customer reviews or star ratings visible on page.
- CTA: Standard black "Add to Cart" button.

TASK:
Audit this page using the 6 pillars of the LIFT Model:
1. Value Proposition (Current score 1-10 + specific diagnosis)
2. Relevance (Current score 1-10 + specific diagnosis)
3. Clarity (Current score 1-10 + specific diagnosis)
4. Urgency (Current score 1-10 + specific diagnosis)
5. Anxiety (Current score 1-10 + specific diagnosis)
6. Distraction (Current score 1-10 + specific diagnosis)

PROVIDE 3 HIGHEST-IMPACT FIXES that can be executed in under 2 hours to lift conversion rate from 1.2% to 3.0%+.
\`\`\`

---

## 3. Human Director Audit: Preserving Client Voice
When AI suggests fixes, verify that they align with operational reality:
* If AI suggests *"Offer Free Overnight Shipping on all orders"*, check with Jenny first! At $18.50 a bag, overnight shipping would bankrupt her.
* Instead, implement an economically viable threshold: *"Free Shipping on Orders Over $35 (or 2+ Bags)"*, which protects margins while increasing Average Order Value (AOV)!`,
    tasks: [{
      id: 1,
      description: "Analyze Jenny's 4 landing page leaks and run the LIFT Model AI friction audit",
      type: "practical",
      requirements: ["Identify 3 major cognitive friction points", "Propose economically viable free-shipping threshold"],
      verificationCriteria: ["Draft actionable fixes for navigation distraction and surprise shipping fees"]
    }]
  },
  {
    id: 403,
    chapterNumber: 4,
    title: "Chapter 4.3: Day 1 (Do) — Live CRO Friction Audit in Landing Page Sandbox",
    level: "Intermediate",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Landing Page Auditing", "Navigation Stripping", "Checkout Drop-Off Diagnostics"],
    content: `# Live CRO Friction Audit in Landing Page Sandbox

In this interactive session, you step into the **Krechet Academy CMS Sandbox** to diagnose and repair Jenny's leaking coffee page.

---

## 1. The 3 Diagnostic Steps in the Sandbox

### Step 1: Strip Cognitive Distraction
* On dedicated PPC landing pages, **remove the top header navigation completely**.
* Visitors arriving from a paid ad should have only two options:
  1. Complete the purchase / sign up.
  2. Hit the back button.
* Removing header navigation typically lifts conversion rates by **15% to 28%** by keeping users laser-focused.

### Step 2: Fix the Headline Value Proposition
* Change H1 from:
  ❌ *"Ethiopian Yirgacheffe — Medium Roast"*
* To:
  ✅ *"Roasted Within 48 Hours: Experience True Freshness in Every Cup"*
* Add sub-headline: *"Small-batch, single-origin beans shipped straight from our Morgantown roastery to your doorstep."*

### Step 3: Eliminate Shipping Friction
* Add an immediate reassurance micro-copy under the CTA button:
  * 🚚 *"Free 2-Day Shipping on orders of 2+ bags | 100% Freshness Guarantee."*

---

## 2. Interactive Simulator Task
1. Load Jenny's landing page in the simulator.
2. Toggle off the 9 navigation links.
3. Update the H1 to focus on 48-hour freshness.
4. Add the free shipping threshold micro-badge.
5. Run the 500-visitor simulation test and verify that conversion rate rises from **1.2% to >= 2.8%**!`,
    tasks: [{
      id: 1,
      description: "Execute the distraction-stripping and headline re-framing in the CMS Sandbox",
      type: "simulation",
      requirements: ["Remove header navigation", "Implement value proposition headline", "Add transparent shipping terms"],
      verificationCriteria: ["Sandbox conversion rate increases to >= 2.8%", "Checkout abandonment drops by > 40%"]
    }]
  },

  // ==========================================
  // DAY 2: Above-the-Fold Architecture & The Single Desired Action
  // ==========================================
  {
    id: 404,
    chapterNumber: 4,
    title: "Chapter 4.4: Day 2 (Learn) — Above-the-Fold Architecture: The 5 Mandatory Elements",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Above-the-Fold Design", "Visual Hierarchy", "Hero Section Wireframing"],
    content: `# Above-the-Fold Architecture: The 5 Mandatory Elements

**'Above the Fold'** refers to the portion of a webpage that is visible on the screen without the user having to scroll down a single pixel.

According to Nielsen Norman Group eye-tracking research:
* Users spend **57% of their total viewing time** above the fold.
* If a visitor does not understand your value proposition in the first **5 seconds**, over **70% will bounce immediately**.

---

## 1. The 5 Mandatory Above-the-Fold Elements

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ [ Logo ]                                 [ Call Us: (304)...]│
│                                                             │
│ 1. H1 Value Headline:                                       │
│    "Same-Day Relief for Severe Toothaches in Morgantown"    │
│                                                             │
│ 2. Supporting Sub-Headline:             4. Hero Visual:     │
│    "Walk-ins welcome. Gentle sedation      [ High-res image │
│    available. Most insurance accepted."     of Dr. Miller   │
│                                             smiling with a  │
│ 3. Frictionless CTA Button:                 patient ]       │
│    [ 📞 Call (304) 555-0199 ]                               │
│    or [ Book Emergency Slot Online ]                        │
│                                                             │
│ 5. Trust Proof Strip:                                       │
│    ★★★★★ 4.9 Stars (480+ Reviews) | Morgantown Family Owned │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Element 1: Clear, Outcome-Driven H1 Headline
State the exact transformation or relief the customer receives. Never use clever puns, poetic metaphors, or vague corporate slogans (*"Synergizing Your Dental Experience"*).

### Element 2: Supporting Clarification Sub-Headline
Answer the immediate secondary questions: *Who is this for? How does it work? What are the key details?*

### Element 3: High-Contrast, Action-Oriented CTA Button
* The button must visually 'pop' off the page using a contrasting color (e.g., emerald green or vibrant amber against a clean background).
* The button text must describe the outcome: *"Claim 15% Off First Roast"* or *"Book Emergency Appointment"* (never generic *"Submit"*).

### Element 4: Authentic Hero Visual
* Show the product in use, or show the human service provider in action.
* **Never use cheesy, generic corporate stock photos** (models in business suits shaking hands). Users instantly detect stock photography and trust evaporates.

### Element 5: Micro-Trust Proof Strip
Place 5 gold stars, review counts, or trust logos (e.g., *'As Seen On'*, *'FDA Inspected'*, *'BBB A+'*) directly adjacent to the CTA button to extinguish last-second hesitation.`,
    tasks: [{
      id: 1,
      description: "Review above-the-fold wireframe architecture and eye-tracking attention data",
      type: "quiz",
      requirements: ["List the 5 mandatory above-the-fold elements", "Explain why generic stock photos destroy credibility"],
      verificationCriteria: ["Answer all Day 2 architectural questions with 100% accuracy"]
    }]
  },
  {
    id: 405,
    chapterNumber: 4,
    title: "Chapter 4.5: Day 2 (See & AI Assist) — Deconstructing a 12% Conversion Dental Page & AI Wireframing",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["High-Converting Wireframes", "Local Service CRO", "AI Copy Wireframing"],
    content: `# Deconstructing a 12% Conversion Dental Page & AI Wireframing

Local emergency services have the potential to achieve extraordinary conversion rates—frequently **10% to 15%**—because searchers are in acute physical pain and need immediate help.

In this lesson, we deconstruct a high-performing emergency dental landing page and use AI to write a precision wireframe.

---

## 1. Real Teardown: Dr. Miller's 12.4% Emergency Landing Page
When Dr. Miller launched his dedicated landing page at \`/emergency-care\`, his conversion rate surged from 3.1% to **12.4%**. Here is why:

### The Mobile-First Layout:
1. **Sticky Top Call Bar**: A fixed bar at the very top of the mobile screen: *"In Pain Right Now? Tap to Call Dr. Miller: (304) 555-0199"*. The phone button followed the user as they scrolled.
2. **Same-Day Urgency**: The H1 prominently stated: *"Morgantown Emergency Dentist: Same-Day Appointments Available Today"*.
3. **Insurance Transparency**: Directly under the call button: *"We accept Delta Dental, MetLife, Cigna, and Guardian. Flexible financing available."* This removed the anxiety of *'Can I afford this?'*
4. **Dr. Miller's Photo**: An authentic photo of Dr. Miller and his lead hygienist, Sarah, in their clinic. Patients in pain want to see who will be working on their mouth.

---

## 2. The Golden AI Prompt: Above-the-Fold Wireframe Generator
Use AI to generate complete, high-converting above-the-fold copy architectures for any niche.

### The Director-Level Prompt:
\`\`\`text
You are an expert Landing Page Conversion Specialist. I am building a dedicated mobile-first PPC landing page for Dr. Miller Urgent Dental in Morgantown, WV.

TARGET AUDIENCE: Mobile searchers in acute tooth pain searching for emergency dental extraction or relief.

GENERATE COMPLETE ABOVE-THE-FOLD COPY:
1. Sticky Header Bar Text (High-urgency click-to-call)
2. H1 Headline (Clear, outcome-driven, local, under 10 words)
3. Sub-Headline (3 key differentiators: speed, pain relief, insurance)
4. Primary CTA Button Text + Secondary CTA Button Text
5. Micro-Trust Copy (Directly beneath the primary button to reduce payment/pain anxiety)
6. Hero Image Art Direction (Describe the exact authentic photo we should shoot in the clinic)

CONSTRAINTS:
- No medical guarantees (comply with Google Ads healthcare policy).
- Tone must be empathetic, calm, and reassuring.
\`\`\`

---

## 3. Human Director Audit: Cognitive Flow
Verify that the copy guides the eye in a clean Z-pattern or F-pattern:
* Headline ➡️ Value Proof ➡️ CTA Button ➡️ Trust Reassurance.
* Never place complex paragraphs or dense medical explanations above the fold.`,
    tasks: [{
      id: 1,
      description: "Analyze the 12.4% dental page breakdown and execute the AI wireframe generation prompt",
      type: "practical",
      requirements: ["Draft empathetic, policy-compliant emergency dental copy", "Ensure single desired action priority"],
      verificationCriteria: ["All above-the-fold elements adhere to mobile-first layout standards"]
    }]
  },
  {
    id: 406,
    chapterNumber: 4,
    title: "Chapter 4.6: Day 2 (Do) — Designing the Above-the-Fold Hero in CMS Simulator",
    level: "Intermediate",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Hero Section Assembly", "Mobile Sticky Bars", "Visual Hierarchy Tuning"],
    content: `# Designing the Above-the-Fold Hero in CMS Simulator

Now, roll up your sleeves and configure Dr. Miller's emergency hero section inside the **Krechet Academy Web Workbench**.

---

## 1. The Assembly Checklist
Open the CMS simulator and execute the following 4 structural modifications:

### Step 1: Deploy the Mobile Sticky Tap-to-Call Header
* Enable the sticky banner component:
  * Text: *"Emergency Toothache? Call Now:"*
  * Number: *(304) 555-0199*
  * Background: High-contrast navy with emerald-green phone icon.

### Step 2: Configure the H1 & Sub-Headline
* H1: *"Same-Day Emergency Dental Care in Morgantown"*
* Sub-Headline: *"Relieve tooth pain today. Gentle, compassionate care with same-day emergency extractions and root canals."*

### Step 3: Implement High-Contrast CTA Buttons
* Primary Button: **[ 📞 Call for Immediate Care ]** (Direct tel: link).
* Secondary Button: **[ Book Emergency Slot Online ]** (Anchor scroll to simple 2-field form).

### Step 4: Mount the Trust Ribbon
* Star Rating: 5 gold stars.
* Text: *"Rated 4.9/5 by 480+ Morgantown Patients | Most Insurances Accepted"*.

---

## 2. Simulator Verification
Test your design in the mobile emulator preview. Ensure that the H1, call button, and trust ribbon are **100% visible on standard mobile screens without any downward scrolling**!`,
    tasks: [{
      id: 1,
      description: "Build and test the mobile hero section in the CMS Simulator",
      type: "simulation",
      requirements: ["Configure sticky call banner", "Mount H1, CTA, and trust ribbon above the fold"],
      verificationCriteria: ["All elements render cleanly above the fold on mobile viewport", "Simulated mobile conversion rate exceeds 10%"]
    }]
  },

  // ==========================================
  // DAY 3: Social Proof, Trust Seals & Reducing Buyer Anxiety
  // ==========================================
  {
    id: 407,
    chapterNumber: 4,
    title: "Chapter 4.7: Day 3 (Learn) — The 6 Types of Social Proof & Anxiety Extinguishers",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Social Proof Psychology", "Trust Badges & Seals", "Buyer Anxiety Reduction"],
    content: `# The 6 Types of Social Proof & Anxiety Extinguishers

When prospective customers visit a website for the first time, their default psychological state is **skepticism**.

In the digital world, anyone can build a flashy website in an hour. Buyers subconsciously ask:
* *Will they steal my credit card info?*
* *Is this coffee actually good or does it taste like burnt charcoal?*
* *Will this dentist hurt me or overcharge me?*

Social proof is the psychological phenomenon where people conform to the actions of others under the assumption that those actions reflect correct behavior.

---

## 1. The 6 Types of Social Proof

| Type | Definition | Best Example | Impact on Conversion |
|---|---|---|---|
| **1. Customer Reviews & Ratings** | Aggregated star ratings and verified buyer feedback. | *"4.9 Stars from 1,240 Verified Coffee Drinkers"* | +18% to +34% |
| **2. Expert Endorsements** | Praise from credentialed authorities or industry certifications. | *"Certified Q-Grader Approved & SCAA Specialty Standard"* | High credibility |
| **3. 'Wisdom of the Crowds'** | Sheer numbers demonstrating popularity. | *"Over 25,000 bags freshly roasted and delivered in 2026"* | Validates safety |
| **4. Peer Recommendation** | Testimonials from people who share the exact demographic of the buyer. | A working mother explaining why Jenny's roast saves her busy mornings. | High emotional empathy |
| **5. Certification & Security Badges** | Technical seals proving security and compliance. | SSL 256-bit encryption, HIPAA Compliant, Fair Trade Certified. | Extinguishes checkout panic |
| **6. Celebrity / Influencer** | Recognition from well-known community or cultural figures. | Morgantown's top chef featuring Jenny's coffee in his restaurant. | High brand prestige |

---

## 2. The Specificity Rule: Vague vs. Specific Testimonials
Amateur landing pages use generic, unbelievable quotes:
❌ *"Great coffee, will buy again! – John D."*

Professional direct-response landing pages use **Specific, Objection-Busting Testimonials**:
✅ *"I was skeptical about paying $18.50 for a bag of coffee when supermarket beans are $9. But Jenny's Ethiopian roast arrived 3 days after roasting, and the blueberry tasting notes blew my mind. I cancelled my Starbucks runs completely." – Sarah K., Morgantown, WV (Verified Buyer)*

> [!TIP] The Anatomy of a High-Converting Testimonial
> The best testimonials always follow this 3-step narrative arc:
> 1. **The Initial Skepticism**: *"I was hesitant because..."*
> 2. **The Breakthrough Experience**: *"When I tried it, I noticed..."*
> 3. **The Tangible Result**: *"Now I save $X / feel Y / will never go back."*`,
    tasks: [{
      id: 1,
      description: "Understand the 6 types of social proof and the 3-step testimonial narrative arc",
      type: "quiz",
      requirements: ["Identify 6 types of social proof", "Distinguish vague vs. high-converting specific testimonials"],
      verificationCriteria: ["Complete Day 3 social proof assessment with 100% accuracy"]
    }]
  },
  {
    id: 408,
    chapterNumber: 4,
    title: "Chapter 4.8: Day 3 (See & AI Assist) — Review Sentiment Mining & The AI Objection Extractor",
    level: "Intermediate",
    estimatedTime: 15,
    skillsLearned: ["Customer Review Mining", "Objection Extraction", "Ethical AI Sentiment Analysis"],
    content: `# Review Sentiment Mining & The AI Objection Extractor

The greatest copywriters in history don't write copy from their imagination—they **steal copy directly from their customers' mouths**.

By mining real customer reviews on Google Maps, Amazon, Reddit, and Yelp, you can discover:
* The exact words customers use to describe their pain.
* The hidden anxieties that almost prevented them from buying.
* The unexpected features they love most.

---

## 1. Mining Dr. Miller's Google Reviews
We extracted 50 real patient reviews from Dr. Miller's Google Business Profile. Notice the recurring emotional patterns:

* *"I had an absolute panic attack about going to the dentist because of a childhood trauma, but Dr. Miller gave me nitrous oxide and was so gentle I didn't feel a thing."*
* *"My crown popped off on a Friday afternoon and every other dentist in town told me to wait until Monday. Dr. Miller stayed late to see me."*
* *"They told me exactly what it would cost before touching my teeth. No surprise bills."*

### Key Psychological Angles Uncovered:
1. **Fear of physical pain & dental trauma**.
2. **Frustration with dentists being closed on weekends/afternoons**.
3. **Anxiety over surprise hidden dental bills**.

---

## 2. The Golden AI Prompt: Customer Review Mining & Objection Extractor
You can feed raw customer reviews into AI to extract high-converting copy angles in seconds.

### The Director-Level Prompt:
\`\`\`text
You are a senior Qualitative Customer Researcher and Direct-Response Copywriter.

RAW CUSTOMER REVIEWS (Paste 10-20 reviews):
[Paste raw text of customer reviews...]

TASK:
1. Extract the TOP 3 HIDDEN FEARS / ANXIETIES that almost stopped these customers from buying or booking.
2. Extract the TOP 3 TANGIBLE OUTCOMES that made them celebrate and recommend the business.
3. Identify 5 VIVID CUSTOMER PHRASES (word-for-word quotes) that would make powerful landing page headlines or subheadings.
4. Draft a "Frequently Asked Questions (FAQ)" section with 3 questions that directly extinguish the top 3 anxieties identified above.

CONSTRAINTS:
- Do not fabricate quotes. Only quote phrases found in the provided reviews.
\`\`\`

---

## 3. Human Verification: The FAQ Anti-Anxiety Shield
An FAQ section on a landing page is not a casual encyclopedia—it is an **anxiety-extinguishing conversion tool**.
* FAQ 1: *"Does an emergency tooth extraction hurt?"* ➡️ Detail gentle sedation and numbing.
* FAQ 2: *"What if I don't have dental insurance?"* ➡️ Detail clear upfront pricing and 0% payment plans.
* FAQ 3: *"How quickly can I be seen today?"* ➡️ Detail walk-in protocol and same-day scheduling.`,
    tasks: [{
      id: 1,
      description: "Mine customer review transcripts, extract top 3 buyer anxieties, and generate an anti-anxiety FAQ",
      type: "practical",
      requirements: ["Identify 3 psychological purchase objections", "Draft 3 anxiety-extinguishing FAQ answers"],
      verificationCriteria: ["FAQ copy addresses pain, price, and scheduling transparency"]
    }]
  },
  {
    id: 409,
    chapterNumber: 4,
    title: "Chapter 4.9: Day 3 (Do) — Building the Trust Stack in the Landing Page Sandbox",
    level: "Intermediate",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Trust Stacking", "Testimonial Sliders", "Guarantee Badges"],
    content: `# Building the Trust Stack in the Landing Page Sandbox

Now, integrate a high-converting **Trust Stack** into Jenny's coffee subscription page inside the simulator.

---

## 1. The 3 Layers of the Trust Stack

### Layer 1: The 'Risk-Reversal' Guarantee Badge
Place a prominent guarantee seal directly beneath the primary purchase tier:
* **The 100% Taste & Freshness Guarantee**: *"If your first bag isn't the freshest, most delicious coffee you've ever brewed, email us within 30 days and we will refund every penny. You don't even have to ship the bag back."*
* This completely eliminates purchase risk for skeptical first-time buyers.

### Layer 2: The Verified Customer Review Carousel
Mount 3 verified buyer cards with:
* Real customer name & city (e.g. *Mark T., Morgantown, WV*).
* Gold star visual rating (★★★★★).
* Verified Buyer badge.
* The 3-part testimonial arc (skepticism ➡️ experience ➡️ outcome).

### Layer 3: Security & Payment Trust Badges
Directly above the checkout button, display:
* SSL 256-bit Encrypted Checkout.
* Payment method icons (Visa, Mastercard, Amex, Apple Pay, Google Pay).

---

## 2. Interactive Simulator Task
1. Open the simulator landing page editor.
2. Mount the 100% Taste Guarantee block.
3. Configure the 3 verified customer review cards.
4. Add the SSL and Apple Pay checkout badges.
5. Simulate 1,000 visitors and observe the checkout completion rate jump by **>= 25%**!`,
    tasks: [{
      id: 1,
      description: "Implement the 3-layer trust stack and risk-reversal guarantee in the CMS Simulator",
      type: "simulation",
      requirements: ["Mount 100% risk-reversal guarantee", "Add 3 verified customer testimonial cards", "Display security badges"],
      verificationCriteria: ["Checkout completion rate increases by >= 25%", "Zero validation errors on mobile"]
    }]
  },

  // ==========================================
  // DAY 4: A/B Testing Mechanics & Statistical Significance
  // ==========================================
  {
    id: 410,
    chapterNumber: 4,
    title: "Chapter 4.10: Day 4 (Learn) — The Scientific Method of A/B Testing & p-Values",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["A/B Testing Methodology", "Statistical Significance", "p-Values", "Sample Size Calculation"],
    content: `# The Scientific Method of A/B Testing & p-Values

In marketing, everyone has an opinion: the client thinks the button should be orange, the designer thinks it should be blue, and the CEO wants their personal dog on the homepage.

**Opinion is the enemy of profit. Data is the arbiter of truth.**

A/B testing (split testing) applies the scientific method to marketing: you split incoming traffic 50/50 between two versions of a page to measure which version produces statistically significant revenue.

---

## 1. The Anatomy of an A/B Test

\`\`\`
10,000 Visitors
      │
      ├── 50% (5,000 Visitors) ➡️ Version A (Control): Original Headline
      │                          Result: 100 Conversions (2.0% CR)
      │
      └── 50% (5,000 Visitors) ➡️ Version B (Variant): Freshness Outcome Headline
                                 Result: 160 Conversions (3.2% CR)
\`\`\`

---

## 2. Statistical Significance: What is a p-Value?
Just because Version B got 160 conversions and Version A got 100 conversions does not automatically mean Version B is better. It could be pure random chance!

To prove Version B is genuinely superior, we calculate **Statistical Significance**:
* **Confidence Level**: Standard agency benchmark is **95% Confidence** ($p < 0.05$).
* **p-Value ($p < 0.05$)**: The probability that the observed difference occurred purely by random chance. A $p$-value of 0.02 means there is only a 2% chance this result was random luck. You can declare a 98% confident winner!

---

## 3. The 3 Deadly Sins of A/B Testing ⚠️

### Sin 1: The 'Peeking Problem' (Stopping Tests Early)
You launch a test on Monday morning. By Tuesday afternoon:
* Version A: 12 clicks, 0 sales (0%).
* Version B: 15 clicks, 2 sales (13.3%).
* The amateur marketer screams *"Version B won!"* and shuts down the test.
* **Why this is fatal**: At low sample sizes, random variance dominates. By Friday, Version B's conversion rate could easily drop to 1.1%. **Never stop a test before reaching your predetermined sample size!**

### Sin 2: Testing 12 Things at Once (Multivariate Chaos)
If you change the headline, the button color, the product photo, the price, and the shipping terms all at the same time and conversions rise by 20%, **which change caused the lift?** You have no idea.
* In standard A/B testing, **isolate ONE variable at a time** (e.g. Headline vs. Headline, or Offer vs. Offer).

### Sin 3: Testing on Low Traffic
If a client gets only 150 visitors a month, running an A/B test would take 14 months to reach statistical significance. For low-traffic sites, focus on high-impact qualitative fixes first.`,
    tasks: [{
      id: 1,
      description: "Master A/B testing methodology, statistical significance thresholds, and the peeking problem",
      type: "quiz",
      requirements: ["Define p-value and 95% confidence benchmark", "Explain the statistical danger of stopping tests early"],
      verificationCriteria: ["Answer all A/B testing science questions with 100% accuracy"]
    }]
  },
  {
    id: 411,
    chapterNumber: 4,
    title: "Chapter 4.11: Day 4 (See & AI Assist) — The A/B Test Hypothesis Matrix & AI Variant Generation",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Hypothesis Formulation", "A/B Test Design", "AI Variant Copywriting"],
    content: `# The A/B Test Hypothesis Matrix & AI Variant Generation

A professional A/B test never begins with *"Let's try a green button"*. It begins with a **Scientifically Formulated Hypothesis**.

---

## 1. The Standard Hypothesis Formula
Every valid agency A/B test hypothesis must follow this structured template:

$$\\text{Because we observed } [\\text{Data / User Behavior}],$$
$$\\text{we believe that changing } [\\text{Specific Element}]$$
$$\\text{for } [\\text{Target Audience}]$$
$$\\text{will result in } [\\text{Measurable Metric Lift}]$$
$$\\text{because } [\\text{Psychological Rationale}].$$

### Real Client Example: Jenny's Artisan Java
> *"Because we observed that 74% of mobile cart abandoners leave at the shipping calculation step, we believe that changing our offer from '$18.50/bag + $9.95 shipping' to 'Buy 2 Bags for $37.00 & Get Free 2-Day Shipping' will result in a 25% lift in completed checkouts because it removes sudden fee anxiety while increasing average order value."*

---

## 2. The Golden AI Prompt: A/B Test Variant Generator
Use AI to generate bold, psychologically distinct test variants for any landing page element.

### The Director-Level Prompt:
\`\`\`text
You are an expert Scientific A/B Testing Strategist. I am designing an A/B split test for Jenny's Artisan Java e-commerce subscription page.

CONTROL (VERSION A):
Headline: "Roasted Within 48 Hours: Experience True Freshness"
Offer: 1 Bag for $18.50 (+ $9.95 shipping).
CTA Button: "Order Fresh Coffee"

TASK:
Develop 3 radically distinct, testable Hypotheses and Variants:
1. Variant B (Economic Incentive & AOV Lift): Free shipping bundle.
2. Variant C (Social Proof & Authority): Q-Grader rating & customer volume proof.
3. Variant D (Risk-Reversal & Guarantee): 100% taste-it-or-it's-free guarantee.

FOR EACH VARIANT, PROVIDE:
- The Complete Hypothesis Statement (using the standard formula).
- The Exact Headline Copy (under 12 words).
- The Exact CTA Button Copy.
- The Predicted Primary Metric Impact (Conversion Rate, AOV, or Bounce Rate).
\`\`\`

---

## 3. Prioritizing Tests with the PIE Framework
When you have 10 test ideas, how do you decide which one to run first?
* **P (Potential)**: How much improvement is possible on this page?
* **I (Importance)**: How valuable is the traffic flowing to this page?
* **E (Ease)**: How technically difficult is it to build and launch?
* Score each 1-10. Sum the scores. Run the highest-scoring test first!`,
    tasks: [{
      id: 1,
      description: "Formulate a formal A/B test hypothesis and score test ideas using the PIE framework",
      type: "practical",
      requirements: ["Draft formal hypothesis using the standard 5-part template", "Calculate PIE prioritization scores"],
      verificationCriteria: ["Hypothesis includes specific measurable outcome and psychological rationale"]
    }]
  },
  {
    id: 412,
    chapterNumber: 4,
    title: "Chapter 4.12: Day 4 (Do) — Launching a Split Test Experiment in the Simulator",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Split Test Deployment", "Traffic Splitting", "Statistical Significance Auditing"],
    content: `# Launching a Split Test Experiment in the Simulator

In this hands-on workshop, you deploy an active A/B test inside the **Krechet Academy Experimentation Engine** and evaluate real-time statistical significance.

---

## 1. Experiment Setup Parameters
You will test **Offer A (Control)** vs. **Offer B (Bundle Free Shipping)** on Jenny's coffee store:

* **Control (Version A)**: Single bag at $18.50 + $9.95 shipping.
* **Variant (Version B)**: "Roaster's Duo Bundle" — 2 bags for $37.00 with **FREE Priority Shipping** + Freshness Lock Bag.
* **Traffic Split**: Exactly 50% / 50%.
* **Target Sample Size**: Minimum 2,000 visitors per variant.
* **Significance Threshold**: 95% Confidence ($p < 0.05$).

---

## 2. Interactive Simulator Task
1. Open the **A/B Testing Console** in the simulator.
2. Configure Variant B with the Duo Bundle offer and free shipping badge.
3. Start the experiment and accelerate traffic simulation.
4. Watch the real-time conversion chart, daily orders, and $p$-value tracking.
5. Reach statistical significance ($p = 0.018$) and declare the winning variant!
6. Calculate the net revenue difference: observe how Variant B produces **$2,450 more gross profit** on the exact same ad spend!`,
    tasks: [{
      id: 1,
      description: "Deploy and analyze an A/B split test experiment to 95% statistical confidence in the Simulator",
      type: "simulation",
      requirements: ["Set up 50/50 traffic split", "Simulate minimum 2,000 visitors per variant"],
      verificationCriteria: ["Achieve statistical significance p < 0.05", "Calculate total net profit expansion from winning variant"]
    }]
  },

  // ==========================================
  // DAY 5: Mobile CRO, Form Friction & Week 4 Capstone
  // ==========================================
  {
    id: 413,
    chapterNumber: 4,
    title: "Chapter 4.13: Day 5 (Learn) — Mobile CRO: The Thumb Zone & Form Field Reduction Math",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Mobile CRO", "Thumb Zone Design", "Form Field Optimization", "Lead Conversion Math"],
    content: `# Mobile CRO: The Thumb Zone & Form Field Reduction Math

Over **72% of all digital marketing traffic** now arrives on mobile smartphones. 

Yet most landing pages are designed by marketers sitting at massive 27-inch desktop monitors with keyboards and mice. When viewed on a 6-inch phone screen held in one hand on a bumpy bus, those desktop designs fail catastrophically.

---

## 1. The Mobile Thumb Zone
Steven Hoober's landmark research on mobile ergonomics reveals how humans hold smartphones:
* **49% of people hold their phone with one hand**, using only their thumb to tap.
* **The Natural Zone**: The bottom-center of the screen is effortless to reach.
* **The Stretch Zone**: The middle-top requires stretching the hand.
* **The Pain / Hard Zone**: The top corners are nearly impossible to reach without shifting grip or using two hands.

> [!IMPORTANT] The Mobile Thumb Rule
> Place your primary CTA button, sticky navigation, and tap-to-call triggers in the **Natural Bottom-Center Thumb Zone**. Never bury critical buttons in the top-left or top-right corners.

---

## 2. Form Field Reduction Math: Every Field Costs 10%
For lead generation businesses (like Dr. Miller Dental), the lead form is the final hurdle.

### The Conversion Decay Law:
Every single unnecessary input field you ask a mobile user to fill out with their thumb **decreases form completion rate by approximately 7% to 11%**.

Look at the difference:
* **The 7-Field Friction Monster**:
  * First Name, Last Name, Email, Phone Number, Home Address, Insurance Policy Number, Reason for Visit.
  * **Completion Rate: 3.2%**.
* **The 2-Field Frictionless Lead Form**:
  * Phone Number, Preferred Time (Morning/Afternoon).
  * (Front desk calls them in 60 seconds to collect details verbally).
  * **Completion Rate: 14.8%**!

**By eliminating 5 form fields, lead volume quadrupled from the exact same visitors!**

---

## 3. Mobile Tap Target Standards (Apple & Android)
* Minimum button touch target: **48 × 48 pixels** (or minimum 44pt on iOS).
* Form inputs must use \`type="tel"\` for phone numbers and \`type="email"\` for emails so the phone automatically pops up the dedicated number pad instead of the full qwerty keyboard!`,
    tasks: [{
      id: 1,
      description: "Master mobile thumb zone ergonomics and calculate conversion impact of form field pruning",
      type: "quiz",
      requirements: ["Explain mobile thumb zone zones (Natural, Stretch, Hard)", "Calculate lead volume changes from form field reduction"],
      verificationCriteria: ["Answer all mobile CRO questions with 100% accuracy"]
    }]
  },
  {
    id: 414,
    chapterNumber: 4,
    title: "Chapter 4.14: Day 5 (See & AI Assist) — Core Web Vitals & Director Atlas High-Stakes CRO Defense",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Core Web Vitals", "LCP / CLS / INP", "Executive Defense", "Mobile Page Speed"],
    content: `# Core Web Vitals & Director Atlas High-Stakes CRO Defense

Mobile visitors are impatient. Google's research confirms that:
* **If a page takes 1 to 3 seconds to load**, the probability of bounce increases by **32%**.
* **If a page takes 1 to 5 seconds to load**, the probability of bounce increases by **90%**.

In this module, you diagnose Core Web Vitals speed bottlenecks and prepare for your executive defense review with **Director Marcus Atlas**.

---

## 1. Google's 3 Core Web Vitals
Google uses 3 technical metrics to evaluate user experience:

1. **Largest Contentful Paint (LCP)**:
   * How fast the main hero image or headline renders on screen.
   * **Target**: Under **2.5 seconds** (Good). Over 4.0s is failing.
2. **Cumulative Layout Shift (CLS)**:
   * Does the page jump around while loading (e.g., an ad pops in late and pushes the button down just as the user tries to tap it)?
   * **Target**: Under **0.1** (Good).
3. **Interaction to Next Paint (INP)**:
   * When a user taps a button or accordion, how fast does the browser visually respond?
   * **Target**: Under **200 milliseconds** (Good).

---

## 2. Director Atlas Emergency Call Briefing
Director Atlas calls your desk:
> *"The client just complained that their dental landing page feels sluggish on their iPhone, and our paid bounce rate hit 68%. I want you to run a page speed audit, identify the uncompressed hero image eating 4 megabytes of mobile data, replace it with an optimized WebP asset, and defend your CRO roadmap in our morning agency standup!"*

### The Audit Findings:
* An uncompressed PNG hero photo was **4.8 MB** in size, taking 6.2 seconds to download on 4G mobile networks.
* Converting that file to modern **WebP format at 1200px width** reduced the file size to **142 KB (a 97% reduction!)**.
* LCP dropped from **5.8s down to 1.8s**, and bounce rate immediately fell from 68% to 34%!

---

## 3. The Golden AI Prompt: Executive CRO Standup Defense
Use AI to translate technical CRO fixes into executive business ROI for client presentations.

### The Director-Level Prompt:
\`\`\`text
You are an Agency Growth Director preparing a junior media buyer for an executive client meeting with Dr. Miller.

TECHNICAL FIXES EXECUTED:
1. Converted 4.8MB uncompressed PNG to 142KB WebP (LCP dropped from 5.8s to 1.8s).
2. Reduced mobile appointment form from 6 fields down to 2 fields (Phone + Time).
3. Moved Primary Call CTA into the bottom natural mobile thumb zone.
4. Added 100% taste/satisfaction guarantee badge.

TASK:
Draft a 4-bullet executive summary written for a non-technical clinic owner.
Explain:
- Exactly what was fixed.
- Why it matters to patient volume and monthly revenue.
- The measurable before-and-after conversion lift.
- The projected return on ad spend (ROAS) expansion.
\`\`\`

---

## 4. The Executive Defense Rule
Never explain code or technical jargon to an executive. Tell them: *"We made your page load 4 seconds faster on mobile and removed 4 unnecessary form fields. As a result, 3x more patients are completing appointment requests each day."*`,
    tasks: [{
      id: 1,
      description: "Audit Core Web Vitals metrics, optimize hero image compression, and complete the Director Atlas defense",
      type: "practical",
      requirements: ["Diagnose LCP bottleneck", "Draft 4-bullet executive standup summary"],
      verificationCriteria: ["Executive defense clearly communicates business ROI over technical jargon"]
    }]
  },
  {
    id: 415,
    chapterNumber: 4,
    title: "Chapter 4.15: Day 5 (Do) — Week 4 Capstone: High-Converting Landing Page Optimization & Audited Proof",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Full CRO Optimization", "Mobile-First Architecture", "A/B Test Verification", "Portfolio Credentialing"],
    content: `# Week 4 Capstone: High-Converting Landing Page Optimization & Audited Proof

Welcome to the **Week 4 Capstone of Krechet Academy**.

Over the last 14 lessons, you mastered the LIFT Model, stripped cognitive distraction, constructed above-the-fold wireframes, mined customer reviews for objection-busting copy, deployed statistically significant A/B tests, and tuned mobile thumb zones.

Now, you will take full creative and technical ownership of **Jenny's Artisan Java subscription landing page** and launch an audited conversion overhaul.

---

## 1. The Capstone Mission Briefing
Jenny's baseline subscription page is converting at a dismal **1.2%**, bleeding ad spend and threatening the viability of her e-commerce expansion.

Your goal is to re-engineer the entire landing page ecosystem inside the simulator to achieve:
1. **Zero cognitive distraction**: 100% stripped header navigation.
2. **Above-the-Fold Excellence**: Clear outcome H1 + 48-hour roast freshness proof + high-contrast CTA in the natural thumb zone.
3. **3-Layer Trust Stack**: 100% Taste-it-or-Free guarantee + 3 verified customer review cards + SSL/Apple Pay checkout seals.
4. **Friction-Free Offer**: Duo bundle with free shipping over $35.
5. **Mobile Core Web Vitals**: LCP under 2.2 seconds.
6. **Conversion Rate Benchmark**: Achieve a verified **>= 3.2% conversion rate** across a 3,000-visitor simulated cohort!

---

## 2. The 5-Step Capstone Execution Checklist

### Checklist Item 1: Structural Wireframe
* Remove top menu navigation.
* Set sticky mobile call / purchase drawer.
* Align single desired action: Subscribe & Save 15%.

### Checklist Item 2: Copy & Offer Engineering
* H1: *"Roasted Within 48 Hours: Experience Pure Freshness Delivered to Your Door"*.
* Offer: Roaster's Duo Bundle with Free Priority Shipping.

### Checklist Item 3: Trust & Anti-Anxiety Stack
* Mount the 30-Day Taste Guarantee seal.
* Display verified 4.9-star review slider with real customer tasting notes.

### Checklist Item 4: Mobile Ergonomics & Speed
* Ensure button touch targets are >= 48px in bottom natural thumb zone.
* Verify WebP compressed image assets for sub-2.0s LCP load time.

### Checklist Item 5: Telemetry Verification & Portfolio Export
* Run the 3,000-visitor test cohort.
* Audit your telemetry: Conversion Rate, Average Order Value (AOV), Customer Acquisition Cost (CAC), and Revenue Lift.
* Export your **Audited CRO & Landing Page Case Study** directly into your **Krechet Career Portfolio**!`,
    tasks: [{
      id: 1,
      description: "Complete the full Jenny's Artisan Java landing page CRO overhaul and export verified portfolio proof",
      type: "simulation",
      requirements: [
        "Strip header navigation and mount above-the-fold value proposition",
        "Implement 3-layer trust stack and free shipping bundle",
        "Achieve mobile conversion rate >= 3.2%",
        "Export verified case study to career portfolio"
      ],
      verificationCriteria: [
        "All 5 checklist items validated by simulation telemetry engine",
        "Verified CRO & Landing Page Specialist credential unlocked"
      ]
    }]
  }
];

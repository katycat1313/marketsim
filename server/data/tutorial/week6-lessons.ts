import type { Tutorial } from '../../services/tutorialService';

export const week6Lessons: Tutorial[] = [
  // ==========================================
  // DAY 1: GA4 Event-Driven Infrastructure & DataLayer Fundamentals
  // ==========================================
  {
    id: 601,
    chapterNumber: 6,
    title: "Chapter 6.1: Day 1 (Learn) — GA4 Event Schema & Google Tag Manager (GTM) Architecture",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Google Analytics 4 (GA4)", "Event Schema", "DataLayers", "Google Tag Manager (GTM)"],
    content: `# GA4 Event Schema & Google Tag Manager (GTM) Architecture

Welcome to **Week 6 of Krechet Academy**—the final, capstone week of **Course 1: The Growth Specialist**.

In previous weeks, you mastered funnels, SEO, Google Search Ads, landing page CRO, and paid social ads. Now, we enter the command center that ties everything together: **Growth Analytics & Marketing Automation**.

If you cannot measure data accurately, you are driving a car at 90 MPH in dense fog with your headlights turned off.

---

## 1. The Paradigm Shift: Universal Analytics vs. GA4
Old Universal Analytics (UA) was built in 2005 around **pageviews and sessions**.
**Google Analytics 4 (GA4)** completely threw away the pageview model. In GA4, **everything is an Event**:

\`\`\`
User Action ───▶ GA4 Event (e.g. "purchase")
                    ├── Parameter 1: transaction_id ("T-1092")
                    ├── Parameter 2: value (37.00)
                    ├── Parameter 3: currency ("USD")
                    └── Parameter 4: items ([Ethiopian Roast Duo])
\`\`\`

---

## 2. The 3 Types of GA4 Events
1. **Automatically Collected & Enhanced Measurement**:
   * Out of the box, GA4 tracks: \`page_view\`, \`scroll\` (90% depth), \`click\` (outbound outbound links), \`view_search_results\`, and \`file_download\`.
2. **Recommended Events**:
   * Standardized names recommended by Google for specific industries:
   * E-Commerce: \`view_item\`, \`add_to_cart\`, \`begin_checkout\`, \`purchase\`.
   * Lead Gen: \`generate_lead\`, \`qualify_lead\`.
3. **Custom Events**:
   * Custom business actions created through Google Tag Manager:
   * e.g., \`emergency_call_tapped\`, \`sample_roast_requested\`.

---

## 3. The Google Tag Manager (GTM) DataLayer
Never hard-code tracking tags directly into your website's HTML. Use **Google Tag Manager (GTM)**:

\`\`\`
[ Website User Action (Button Click) ]
                 │
                 ▼
     [ GTM DataLayer (JSON Bridge) ]
                 │
        ┌────────┴────────┐
        ▼                 ▼
   [ GA4 Tag ]      [ Meta CAPI Tag ]
\`\`\`

The **DataLayer** is a virtual JavaScript array that temporarily holds variables (product name, order price, user ID) and hands them safely to all your marketing tags simultaneously.`,
    tasks: [{
      id: 1,
      description: "Understand GA4 event-driven schema, Enhanced Measurement, and GTM DataLayer architecture",
      type: "quiz",
      requirements: ["Contrast Universal Analytics sessions vs. GA4 event schema", "Explain the role of the GTM DataLayer"],
      verificationCriteria: ["Complete Day 1 GA4 assessment with 100% accuracy"]
    }]
  },
  {
    id: 602,
    chapterNumber: 6,
    title: "Chapter 6.2: Day 1 (See & AI Assist) — Auditing a Broken GA4 Setup & The AI DataLayer Generator",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Analytics Auditing", "UTM Tracking Bugs", "DataLayer Troubleshooting", "AI GTM Recipes"],
    content: `# Auditing a Broken GA4 Setup & The AI DataLayer Generator

Over **85% of small and mid-sized business GA4 installations are broken**.

When agencies audit an incoming client's analytics, they frequently find:
* Duplicate transactions inflating revenue by 200%.
* Missing UTM parameters marking paid traffic as *"Direct / None"*.
* Internal office traffic distorting bounce and engagement rates.

---

## 1. Real Client Audit: Jenny's Broken Analytics
We conducted an analytics audit on Jenny's Artisan Java:

### Fatal Flaw 1: Duplicate Purchase Events
* When a customer bought coffee, they reached the confirmation page \`/checkout/success\`.
* If the user refreshed their browser or reopened their mobile tab 2 hours later to check shipping, the page re-fired the \`purchase\` event!
* **The Bleed**: GA4 was reporting $18,400 in monthly revenue when Jenny's actual bank account only had $9,200!

### Fatal Flaw 2: The Self-Referral Leak
* Jenny's payment gateway redirected users to \`checkout.shopify.com\` and back.
* Because cross-domain tracking was not configured, GA4 ended the session and started a brand new session, reporting **Shopify as the acquisition source** instead of Google Ads!

---

## 2. The Golden AI Prompt: GTM DataLayer Recipe Generator
Use AI to write clean, bug-free GTM DataLayer code snippets for any client website.

### The Director-Level Prompt:
\`\`\`text
You are a senior Google Tag Manager (GTM) and GA4 Implementation Engineer.

CLIENT: Dr. Miller Family & Urgent Dental (Morgantown, WV).
GOAL: Track emergency appointment phone calls and completed bookings in GA4.

TASK:
1. Write a clean JavaScript DataLayer push script for when a patient submits the emergency booking form:
   - Event Name: "generate_lead"
   - Parameters: service_type ("emergency_extraction"), preferred_time ("morning"), lead_value (180.00).
2. Write a prevention script that uses localStorage to prevent duplicate form submissions if the thank-you page is refreshed.
3. Provide the exact GTM Trigger Configuration:
   - Trigger Type: Custom Event
   - Event Name
\`\`\`

---

## 3. Human Verification: The Deduplication Check
Always ensure that every transaction event includes a unique \`transaction_id\`. GA4 automatically deduplicates purchases if the \`transaction_id\` matches an event recorded within the last 48 hours.`,
    tasks: [{
      id: 1,
      description: "Analyze the 2 fatal flaws in Jenny's tracking and generate a deduplicated DataLayer script with AI",
      type: "practical",
      requirements: ["Identify root causes of duplicate purchase tracking", "Draft deduplication script using transaction_id"],
      verificationCriteria: ["Script prevents duplicate events on browser refresh"]
    }]
  },
  {
    id: 603,
    chapterNumber: 6,
    title: "Chapter 6.3: Day 1 (Do) — Live GA4 Event Debugging & Tag Verification in Simulator",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["GA4 DebugView", "Tag Diagnostics", "Cross-Domain Tracking"],
    content: `# Live GA4 Event Debugging & Tag Verification in Simulator

Now, open the **Krechet Academy Analytics Debug Studio** to inspect live events in real time.

---

## 1. Using GA4 DebugView
When troubleshooting tracking:
1. Open **GA4 ➡️ Admin ➡️ DebugView**.
2. Perform a simulated purchase on the website.
3. Watch the chronological stream of events populate in the terminal:
   * \`page_view\` ➡️ \`view_item\` ➡️ \`add_to_cart\` ➡️ \`begin_checkout\` ➡️ \`purchase\`.

---

## 2. Interactive Simulator Task
Open the simulator console:
1. Fire a test checkout on Jenny's store.
2. Locate the broken parameter in the \`purchase\` payload (currency is currently missing or defaulting to undefined).
3. Fix the variable binding to pass \`currency: "USD"\` and \`value: 37.00\`.
4. Add cross-domain measurement for the checkout domain.
5. Verify in DebugView that all 5 e-commerce events register with green status badges!`,
    tasks: [{
      id: 1,
      description: "Debug broken event parameters and verify cross-domain tracking in the GA4 Simulator",
      type: "simulation",
      requirements: ["Inspect chronological event stream in DebugView", "Correct currency and value parameters"],
      verificationCriteria: ["All e-commerce events pass validation checks with zero errors"]
    }]
  },

  // ==========================================
  // DAY 2: Explorations & Custom Multi-Step Drop-Off Funnels
  // ==========================================
  {
    id: 604,
    chapterNumber: 6,
    title: "Chapter 6.4: Day 2 (Learn) — GA4 Explorations: Building Custom Funnel Drop-Off Maps",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["GA4 Explorations", "Funnel Exploration", "Drop-Off Analysis", "E-Commerce Funnel Chain"],
    content: `# GA4 Explorations: Building Custom Funnel Drop-Off Maps

Standard out-of-the-box GA4 reports provide basic surface metrics. 

To conduct true agency-level diagnostic work, you must master the **GA4 Exploration Workspace**—specifically **Funnel Explorations**.

---

## 1. The 4-Step E-Commerce Funnel Chain
Every online purchase follows this sequential progression:

\`\`\`
Step 1: view_item (Product Page View)
    │
    ▼ (Drop-off 1: Didn't like price or lack of reviews)
Step 2: add_to_cart (Added to Cart)
    │
    ▼ (Drop-off 2: Got distracted or shipping surprise)
Step 3: begin_checkout (Initiated Checkout)
    │
    ▼ (Drop-off 3: Form friction or payment error)
Step 4: purchase (Order Completed)
\`\`\`

---

## 2. Analyzing Drop-Off Percentages
In a Funnel Exploration, GA4 calculates the exact **Abandonment Rate at each individual step**:

| Funnel Step | Users | Completion % | Drop-Off % | Industry Benchmark |
|---|---|---|---|---|
| 1. Product View (\`view_item\`) | 10,000 | 100% | — | — |
| 2. Add to Cart (\`add_to_cart\`) | 1,200 | 12.0% | 88.0% | 8% – 15% |
| 3. Begin Checkout (\`begin_checkout\`) | 600 | 50.0% | 50.0% | 40% – 60% |
| 4. Purchase (\`purchase\`) | 240 | 40.0% | 60.0% | 35% – 55% |

### How to Diagnose Leaks:
* **If Step 1 ➡️ Step 2 has a 95% drop-off**: Your product page lacks trust, clear value proposition, or compelling social proof.
* **If Step 2 ➡️ Step 3 has a 75% drop-off**: Cart drawer is confusing, or users are using the cart as a wishlist.
* **If Step 3 ➡️ Step 4 has an 85% drop-off**: **The classic shipping shock trap!** You slapped them with surprise shipping fees, or your mobile payment form is broken.`,
    tasks: [{
      id: 1,
      description: "Master GA4 Funnel Exploration architecture and industry standard drop-off benchmarks",
      type: "quiz",
      requirements: ["Map the 4-step e-commerce funnel sequence", "Identify root causes for step-specific abandonment spikes"],
      verificationCriteria: ["Complete Day 2 Funnel Exploration assessment with 100% accuracy"]
    }]
  },
  {
    id: 605,
    chapterNumber: 6,
    title: "Chapter 6.5: Day 2 (See & AI Assist) — Spotting Mobile Checkout Leaks & AI Funnel Diagnostics",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Device Segmentation", "Checkout Leak Diagnostics", "AI Analytics Interpretation"],
    content: `# Spotting Mobile Checkout Leaks & AI Funnel Diagnostics

When you view analytics data as a whole, high-performing desktop traffic often **masks catastrophic leaks on mobile devices**.

In this lesson, we break down Jenny's GA4 funnel by device segment and use AI to diagnose the leak.

---

## 1. Segmenting Funnels by Device Category
Look at Jenny's funnel when segmented by Desktop vs. Mobile:

| Funnel Step | Desktop Users (3,000) | Desktop Conversion | Mobile Users (7,000) | Mobile Conversion |
|---|---|---|---|---|
| Product View | 3,000 | — | 7,000 | — |
| Add to Cart | 420 | 14.0% | 780 | 11.1% |
| Begin Checkout | 260 | 61.9% | 410 | 52.5% |
| **Purchase** | **156** | **60.0%** | **41** | **🔴 10.0%** |

### The Shocking Discovery:
* On Desktop, **60% of people who begin checkout complete the purchase** (Healthy, excellent performance).
* On Mobile, **90% of people who begin checkout abandon immediately**!
* **The Root Cause**: Jenny's mobile checkout had a broken postal code autofill field that crashed mobile Safari keyboards!
* Fixing that single mobile bug added **$4,800/month in found revenue** without increasing ad spend!

---

## 2. The Golden AI Prompt: GA4 Funnel Diagnostic Analyst
Feed raw GA4 funnel export data into AI to generate executive diagnostic reports.

### The Director-Level Prompt:
\`\`\`text
You are a Principal Growth Analytics Consultant.

DATASET (GA4 Funnel Exploration Segmented by Device):
[Paste raw step-by-step numbers for Desktop vs. Mobile...]

TASK:
1. Calculate the step-by-step drop-off percentages for both Desktop and Mobile.
2. Identify the single biggest leak in the customer journey and quantify the lost revenue per month.
3. Formulate 3 technical and UX hypotheses explaining why this specific step is failing on mobile devices.
4. Provide a prioritized action plan for the engineering and design team.
\`\`\`

---

## 3. Executive Insight: The Power of Segmentation
Never present aggregate averages to an executive. Aggregate numbers hide the truth. **Always slice data by Device, Traffic Source (UTM), and Geography** to uncover actionable growth insights.`,
    tasks: [{
      id: 1,
      description: "Analyze the segmented device funnel dataset and formulate the mobile checkout repair plan",
      type: "practical",
      requirements: ["Calculate desktop vs mobile checkout drop-off rates", "Draft 3 technical hypotheses for mobile failure"],
      verificationCriteria: ["Action plan quantifies monthly recovered revenue from mobile fix"]
    }]
  },
  {
    id: 606,
    chapterNumber: 6,
    title: "Chapter 6.6: Day 2 (Do) — Building a 5-Step Funnel Exploration in the GA4 Studio",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["GA4 Exploration Workspace", "Custom Funnel Construction", "Breakdown Dimensions"],
    content: `# Building a 5-Step Funnel Exploration in the GA4 Studio

Now, construct a live **5-Step Funnel Exploration** inside the **Krechet Academy Analytics Workbench**.

---

## 1. Funnel Construction Steps
1. Navigate to **Explore ➡️ Funnel Exploration**.
2. Set Technique: **Funnel Exploration**.
3. Toggle: **Make funnel open / closed** (Select *Closed Funnel*).
4. Add the 5 Sequential Steps:
   * **Step 1**: \`session_start\` (All site arrivals).
   * **Step 2**: \`view_item\` (Viewed specific coffee roast).
   * **Step 3**: \`add_to_cart\` (Added bag to cart).
   * **Step 4**: \`begin_checkout\` (Entered checkout flow).
   * **Step 5**: \`purchase\` (Order completed).
5. Drag **Device Category** into the Breakdown Dimension.

---

## 2. Simulator Verification
* Confirm the funnel visualization charts render with accurate drop-off bars.
* Identify the step where mobile abandonment exceeds 75%.
* Export the diagnostic chart to your client audit portfolio!`,
    tasks: [{
      id: 1,
      description: "Build a 5-step closed funnel exploration with device breakdown in the GA4 Simulator",
      type: "simulation",
      requirements: ["Configure 5 sequential e-commerce steps", "Apply Device Category breakdown dimension"],
      verificationCriteria: ["Funnel visualization successfully renders drop-off bars", "Diagnostic export completed"]
    }]
  },

  // ==========================================
  // DAY 3: Speed-to-Lead Automation with Make.com & Webhooks
  // ==========================================
  {
    id: 607,
    chapterNumber: 6,
    title: "Chapter 6.7: Day 3 (Learn) — The Economics of Speed-to-Lead: Why Make.com Beats Zapier",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Marketing Automation", "Speed-to-Lead", "Make.com Architecture", "Inbound Webhooks"],
    content: `# The Economics of Speed-to-Lead: Why Make.com Beats Zapier

For service businesses (dentists, lawyers, roofers, B2B SaaS), **lead response time is the single most decisive variable in closing deals**.

---

## 1. The Shocking Speed-to-Lead Telemetry
According to landmark research from Harvard Business Review and InsideSales.com:
* Calling an inbound lead within **5 minutes** makes you **21x more likely to qualify the prospect** than calling after 30 minutes.
* After 5 minutes, conversion probability decays by **80%**.
* After 24 hours, the lead is virtually dead—they have already booked with whoever called them first.

Yet, over 70% of local businesses take 12 to 48 hours to follow up with website form leads!

---

## 2. Why Krechet Academy Teaches Make.com (Not Zapier)

| Feature | Zapier (Free Tier) | Make.com (Free Tier) |
|---|---|---|
| **Free Operations / Month** | 100 tasks | **1,000 operations** |
| **Multi-Step Pipelines** | Paywalled behind $20-$30/mo subscription | **100% Free** (Unlimited multi-step routers) |
| **Instant Webhooks** | Paywalled on many triggers | **100% Free custom webhooks** |
| **Data Parsing & Formulas** | Limited on free tier | Full visual JavaScript functions & regex |

---

## 3. The 3-Step Speed-to-Lead Automation Pipeline

\`\`\`
[ Lead Submits Website Form ]
              │
              ▼ (Instant Webhook - 0.2s)
   [ Make.com Automation Engine ]
              │
      ┌───────┴───────┐
      ▼               ▼
[ Instant SMS Alert ] [ Cloud CRM / Google Sheets ]
To Dr. Miller's Staff:   Logged permanently for
"🚨 Urgent Patient Call:  monthly ROI audit
John D. - (304) 555-0199  & reporting.
Severe Toothache"
\`\`\`

When a patient hits submit, Dr. Miller's front desk phone dings within **4 seconds**. They tap the phone number, call the patient while the patient is still looking at the website, and book the emergency appointment on the spot!`,
    tasks: [{
      id: 1,
      description: "Understand the Harvard speed-to-lead statistics and compare Make.com vs Zapier economics",
      type: "quiz",
      requirements: ["Explain why lead qualification decays by 21x after 30 minutes", "Identify Make.com free tier advantages"],
      verificationCriteria: ["Complete Day 3 automation assessment with 100% accuracy"]
    }]
  },
  {
    id: 608,
    chapterNumber: 6,
    title: "Chapter 6.8: Day 3 (See & AI Assist) — The $0 Make.com Blueprint & AI JSON Customization",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Automation Blueprints", "JSON Payloads", "AI Workflow Engineering"],
    content: `# The $0 Make.com Blueprint & AI JSON Customization

You do not need to build complex automations from a blank screen. High-performance agencies use **Standardized Automation Blueprints (.json)** that can be imported and configured in under 10 minutes.

---

## 1. Deconstructing the Make.com Blueprint JSON
A Make.com scenario blueprint is a JSON configuration file containing:
1. **Webhook Listener**: A secure endpoint URL that listens for incoming form POST requests.
2. **Data Parser**: Extracts \`name\`, \`phone\`, \`email\`, and \`message\`.
3. **Condition Router**:
   * If \`urgency == "emergency"\` ➡️ Send high-priority SMS alert.
   * If \`urgency == "routine"\` ➡️ Send standard email notification.
4. **Google Sheets / CRM Logger**: Appends row with timestamp, source UTM, and contact info.

---

## 2. The Golden AI Prompt: Make.com Blueprint Customizer
Use AI to modify JSON blueprint payloads and format automated customer response messages.

### The Director-Level Prompt:
\`\`\`text
You are an expert Marketing Automation Solutions Architect.

CLIENT: Dr. Miller Urgent Dental, Morgantown, WV.
TOOL: Make.com (formerly Integromat).
SCENARIO: An inbound webhook receives an emergency dental appointment request.

INCOMING WEBHOOK PAYLOAD:
{
  "patient_name": "Mark Stevens",
  "patient_phone": "(304) 555-0144",
  "pain_level": "Severe (8/10)",
  "procedure_needed": "Broken Molar Extraction",
  "utm_source": "google_search_ads"
}

TASK:
1. Draft the high-urgency SMS notification sent to Dr. Miller's front desk receptionist (strictly under 160 characters).
2. Draft an immediate reassurance SMS sent to the patient confirming receipt and letting them know a clinician is calling in under 3 minutes.
3. Provide the JSON data mapping structure for Make.com to write this row to Google Sheets.
\`\`\`

---

## 3. Real Freelance Value
Freelancers on Upwork and Fiverr routinely charge **$350 to $750** to set up this exact Make.com lead dispatch pipeline for local contractors, plumbers, and clinics. Once you master it, you can deploy it for clients in 20 minutes!`,
    tasks: [{
      id: 1,
      description: "Analyze the Make.com webhook JSON architecture and generate automated SMS dispatch templates with AI",
      type: "practical",
      requirements: ["Draft front-desk emergency SMS under 160 characters", "Draft patient reassurance text"],
      verificationCriteria: ["JSON mapping matches incoming webhook payload structure"]
    }]
  },
  {
    id: 609,
    chapterNumber: 6,
    title: "Chapter 6.9: Day 3 (Do) — Importing and Testing the 60-Second Lead Pipeline in Simulator",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Webhook Testing", "Automation Debugging", "Speed-to-Lead Verification"],
    content: `# Importing and Testing the 60-Second Lead Pipeline in Simulator

In this hands-on workshop, you step into the **Krechet Academy Automation Sandbox** to wire, test, and verify an end-to-end lead dispatch scenario.

---

## 1. Step-by-Step Simulator Configuration
1. Open the **Automation Studio**.
2. Click **Import Blueprint** and load the \`emergency-lead-dispatch.json\` file.
3. Connect the Webhook trigger to the website form endpoint.
4. Configure the SMS Gateway module:
   * Recipient: Clinic Dispatch line.
   * Message: *"🚨 URGENT LEAD: {{patient_name}} - {{patient_phone}} - {{procedure_needed}}."*
5. Connect Google Sheets row logger.

---

## 2. Live Verification Test
1. Click **Run Once** in the automation runner.
2. Fill out a test emergency toothache lead on Dr. Miller's simulated landing page.
3. Observe the green execution bubbles flash across all 3 modules in under **1.2 seconds**.
4. Verify that the SMS alert and spreadsheet row log successfully with 100% data fidelity!`,
    tasks: [{
      id: 1,
      description: "Import, configure, and execute the Make.com speed-to-lead automation pipeline in the Simulator",
      type: "simulation",
      requirements: ["Import JSON blueprint", "Execute end-to-end test submission"],
      verificationCriteria: ["Automation executes all modules in under 2 seconds", "SMS and spreadsheet records verified"]
    }]
  },

  // ==========================================
  // DAY 4: Attribution Modeling & The Director Defense
  // ==========================================
  {
    id: 610,
    chapterNumber: 6,
    title: "Chapter 6.10: Day 4 (Learn) — Attribution Wars: First-Click vs. Last-Click vs. Data-Driven",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Attribution Modeling", "Data-Driven Attribution (DDA)", "Assisted Conversions", "ROAS Reconciliation"],
    content: `# Attribution Wars: First-Click vs. Last-Click vs. Data-Driven

If you ask Google Ads who made the sale, Google says: *"We did!"*
If you ask Meta Ads who made the sale, Meta says: *"We did!"*
If you ask TikTok Ads, TikTok says: *"We did!"*

If you add up all the platform-reported conversions, you will often find **300 sales reported when your bank account only received 100 orders**!

This is the multi-touch attribution crisis. Understanding attribution models is what separates junior media buyers from senior marketing directors.

---

## 1. The Core Attribution Models

\`\`\`
Customer Journey:
[ Instagram Ad ] ──▶ [ Organic Blog Post ] ──▶ [ Retargeting Ad ] ──▶ [ Direct Google Search ] ──▶ $100 Purchase
\`\`\`

### 1. First-Click Attribution
* Gives **100% of the credit to the Instagram Ad**.
* *Advantage*: Rewards Top-of-Funnel awareness channels that introduce new prospects.
* *Flaw*: Ignores all the middle closing work.

### 2. Last-Click Attribution (The Legacy Default)
* Gives **100% of the credit to Direct Google Search**.
* *Advantage*: Easy to calculate.
* *Flaw*: Unfairly punishes top-of-funnel channels. If you shut down Instagram because it showed 0 last-click sales, the direct searches disappear!

### 3. Data-Driven Attribution (DDA) (GA4 Modern Standard)
* Uses machine learning to evaluate **thousands of user paths (both converting and non-converting)**.
* Distributes fractional credit based on how much each touchpoint statistically increased the probability of conversion:
  * Instagram Ad: **35% credit** ($35).
  * Organic Blog: **15% credit** ($15).
  * Retargeting Ad: **25% credit** ($25).
  * Direct Search: **25% credit** ($25).

---

## 2. Assisted Conversions
An **Assisted Conversion** occurs when a marketing channel was touched by the user during their journey, but was not the final interaction.

In GA4, always examine the **Model Comparison Report** to see which channels are driving top-of-funnel lift before making budget cuts!`,
    tasks: [{
      id: 1,
      description: "Master multi-touch attribution models and compare First-Click, Last-Click, and Data-Driven Attribution",
      type: "quiz",
      requirements: ["Contrast Last-Click vs Data-Driven Attribution (DDA)", "Explain how assisted conversions prevent disastrous budget cuts"],
      verificationCriteria: ["Answer all attribution modeling questions with 100% accuracy"]
    }]
  },
  {
    id: 611,
    chapterNumber: 6,
    title: "Chapter 6.11: Day 4 (See & AI Assist) — The 30% Revenue Drop Crisis & Director Atlas Defense",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Executive Crisis Defense", "STAR Method", "Boardroom Diagnostics", "AI Client Briefings"],
    content: `# The 30% Revenue Drop Crisis & Director Atlas Defense

At 8:30 AM on Monday morning, the client CEO schedules an emergency meeting:

> *"Our gross revenue dropped 30% last month! We spent four thousand dollars on ads, and my CFO wants to fire the agency and pause all marketing today! You have 20 minutes to present your diagnostic report to Director Atlas and explain what happened!"*

This is the defining moment in an agency marketer's career. Amateurs get defensive, panic, or blame the algorithm. **Professionals deploy the STAR Defense Framework.**

---

## 1. The STAR Defense Framework

* **S (Situation)**: Acknowledge the reality with zero sugarcoating (*"Last month gross revenue fell by 31.4% from $42,000 to $28,800"*).
* **T (Task)**: Define the diagnostic objective (*"Identify the exact breakdown point across our traffic, conversion, and unit economics telemetry"*).
* **A (Action)**: Present the discovered root cause backed by data:
  * *It wasn't ad performance*: CTR and CPC were stable.
  * *The root cause was operational*: The clinic was closed for 6 days for renovations, and the front desk receptionist quit, leaving 42 inbound leads unanswered!
* **R (Result & Roadmap)**: The corrective roadmap:
  * Deployed Make.com instant SMS backup dispatch.
  * Reconciled ad spend during closed hours.
  * Recovered 14 past leads, securing $5,200 in booked treatments within 48 hours.

---

## 2. The Golden AI Prompt: STAR Boardroom Presentation Coach
Use AI to polish high-stakes crisis defense presentations.

### The Director-Level Prompt:
\`\`\`text
You are an executive Agency Managing Director coaching a Senior Performance Marketer for a high-stakes client retention presentation.

CRISIS: Client CEO is angry because revenue dropped 30% last month and wants to fire the agency.
DIAGNOSTIC FINDINGS:
1. Ad campaigns generated 12% MORE qualified leads than the previous month at a lower CPA ($38 vs $44).
2. The client had staff turnover: their lead intake phone went unanswered for 11 days, resulting in a 71% drop in lead-to-appointment show rate.
3. Meta and Google ad campaigns were functioning flawlessly.

TASK:
Structure a 4-slide executive presentation using the STAR method:
- Slide 1: Executive Acknowledgement & Telemetry Overview
- Slide 2: The Data Truth (Traffic & Lead Generation Performance)
- Slide 3: The Root Cause Breakdown (Front-Desk Intake Bottleneck)
- Slide 4: The 48-Hour Recovery Roadmap & Collaborative Solution

Tone must be completely respectful, objective, data-backed, and solutions-oriented.
\`\`\`

---

## 3. Executive Lesson: Lead with Data, Not Emotions
When you prove with call logs and timestamps that marketing generated the leads and the bottleneck was internal operations, you don't just save the account—you become the client's indispensable strategic advisor.`,
    tasks: [{
      id: 1,
      description: "Structure a high-stakes STAR defense presentation for a 30% revenue drop crisis",
      type: "practical",
      requirements: ["Diagnose marketing vs operational bottleneck", "Draft 4-slide STAR executive presentation"],
      verificationCriteria: ["Presentation uses objective call log and lead telemetry data to de-escalate crisis"]
    }]
  },
  {
    id: 612,
    chapterNumber: 6,
    title: "Chapter 6.12: Day 4 (Do) — Interactive Executive Standup Drill in the Interview Studio",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["AI Executive Interview", "Client Retention Defense", "Verbal Communication"],
    content: `# Interactive Executive Standup Drill in the Interview Studio

Now, step into the **Krechet Academy AI Executive Studio** to defend your performance in a simulated client confrontation.

---

## 1. The Simulation Challenge
You will be questioned by **AI Director Marcus Atlas** and client founder **Dr. Richard Miller**:
* They will grill you on rising acquisition costs, attribution discrepancies, and last month's conversion dip.
* You must articulate:
  1. The distinction between platform ROAS and Blended MER.
  2. The root cause of the drop-off.
  3. The exact 3-step corrective action implemented.

---

## 2. Simulator Scoring Criteria
The AI evaluator scores your verbal or written defense on 4 dimensions:
* **Composure & Tone**: Empathetic, calm, non-defensive.
* **Data Precision**: Specific metrics cited (CPA, CTR, MER, call duration).
* **Root Cause Clarity**: Clear identification of the bottleneck.
* **Actionable Roadmap**: Tangible next steps with deadlines.
* Achieve an **SLA Score of >= 85%** to pass the drill!`,
    tasks: [{
      id: 1,
      description: "Complete the interactive AI executive client defense drill in the Interview Studio",
      type: "simulation",
      requirements: ["Present STAR defense to AI Director Atlas and Dr. Miller", "Address attribution discrepancies and operational bottlenecks"],
      verificationCriteria: ["Achieve executive SLA score >= 85%", "Successfully retain client retainer"]
    }]
  },

  // ==========================================
  // DAY 5: The Grand Capstone & Verified Portfolio Accreditation
  // ==========================================
  {
    id: 613,
    chapterNumber: 6,
    title: "Chapter 6.13: Day 5 (Learn) — Building the Verified Career Portfolio & Upwork/Agency Positioning",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Career Positioning", "Portfolio Engineering", "Freelance Pricing & Upwork", "Resume Optimization"],
    content: `# Building the Verified Career Portfolio & Upwork/Agency Positioning

Congratulations. You have completed the technical curriculum of **Course 1: The Growth Specialist**.

Now comes the final step: **Translating your skills into career revenue**.

Whether your goal is to land an $80k–$110k agency growth role, build a $5k/month freelance business on Upwork, or scale your own company, you need **Proof of Work**.

---

## 1. The Resume Paradox: Why Certificates Fail
Most marketing courses hand students a PDF certificate saying *"John Doe completed 10 hours of video lectures"*.

Hiring managers and prospective clients throw those in the trash. Why? Because watching a video does not prove you can run a profitable ad campaign or fix a broken GA4 setup.

### The Krechet Academy Verified Portfolio:
Instead of an empty certificate, Krechet Academy generates an **Audited Digital Marketing Case Study** hosted at \`/portfolio\` featuring:
1. **Verified Telemetry**: Real before-and-after metrics (Quality Score jumped from 3/10 to 8/10; CPA dropped from $95 to $38).
2. **Defensible Problem-Solving**: Actual negative keyword shields, 15-headline RSA matrices, and GTM DataLayer recipes created by you.
3. **Crisis Resolution Proof**: Audio and transcript records of you successfully resolving high-stakes client emergencies.

---

## 2. Upwork & Client Positioning: The $1,500/Month Retainer
When pitching clients on Upwork or email:
* **The Amateur Pitch**: *"I am a digital marketer with 3 years experience. I can do your SEO and Google Ads for $20/hour."* (Ignored by high-value clients).
* **The Growth Specialist Pitch**:
  > *"Hi Dr. Miller — I noticed your Google Ads are currently running with broad match keywords on the Display Network, which typically wastes 35-45% of budget on non-local clicks. In my recent dental campaign audit, I deployed Single-Theme Ad Groups, pruned 30+ negative keywords, and reduced patient acquisition cost from $92 to $38. Here is my live audited case study: [Your Portfolio Link]. Let's hop on a 10-minute call to plug the budget leak."*

Clients gladly pay **$1,500 to $3,000/month retainers** for marketers who diagnose specific financial leaks!`,
    tasks: [{
      id: 1,
      description: "Understand the verified proof-of-work portfolio model and agency client positioning",
      type: "quiz",
      requirements: ["Contrast generic certificates vs audited proof of work", "Structure a high-converting $1,500/mo client pitch"],
      verificationCriteria: ["Complete Day 5 career positioning assessment with 100% accuracy"]
    }]
  },
  {
    id: 614,
    chapterNumber: 6,
    title: "Chapter 6.14: Day 5 (See & AI Assist) — The AI Portfolio Auditor & Resume Transformation Studio",
    level: "Advanced",
    estimatedTime: 15,
    skillsLearned: ["Portfolio Auditing", "Resume Bullet Point Engineering", "AI Career Coaching"],
    content: `# The AI Portfolio Auditor & Resume Transformation Studio

In this module, you use AI to audit your resume and portfolio bullet points, transforming passive job descriptions into high-impact, metric-driven achievements.

---

## 1. The XYZ Resume Formula (Google Standard)
Laszlo Bock, former SVP of People at Google, established the gold standard for executive resumes:

$$\\text{Accomplished } [X], \\text{ as measured by } [Y], \\text{ by doing } [Z].$$

### Weak Amateur Bullet:
❌ *"Responsible for managing Google Ads and doing SEO for a local coffee business."*

### Strong Krechet-Trained Bullet:
✅ *"Reduced Customer Acquisition Cost (CAC) by 58% (from $66.67 to $28.00) for specialty e-commerce brand by restructuring account into Single-Theme Ad Groups, deploying 35 negative keyword shields, and optimizing mobile landing page LCP speed to 1.8 seconds."*

---

## 2. The Golden AI Prompt: The XYZ Marketing Resume Engineer
Use AI to transform your simulation coursework into executive resume bullets.

### The Director-Level Prompt:
\`\`\`text
You are an Executive Recruiter and Marketing Hiring Partner.

CANDIDATE COURSEWORK & SIMULATION RESULTS:
- Client 1: Jenny's Artisan Java (E-commerce). Reduced CPA from $66 to $28, increased mobile conversion rate from 1.2% to 3.4%, deployed Conversions API (CAPI) with 8.4 EMQ score.
- Client 2: Dr. Miller Family & Urgent Dental. Structured 3 STAG ad groups, improved Quality Score from 3/10 to 8/10, implemented Make.com 60-second speed-to-lead pipeline, lowered cost per booked patient from $95 to $38.

TASK:
Write 4 elite, metric-driven resume bullet points following Google's "Accomplished [X] as measured by [Y] by doing [Z]" formula.
Include exact industry terminology: STAG, Quality Score, CAPI, LIFT Model, Speed-to-Lead, and Data-Driven Attribution.
\`\`\`

---

## 3. Human Review: Authenticity and Confidence
Every metric in your portfolio was verified in our simulation engine. In job interviews, you can walk hiring directors through the exact decisions you made, the errors you caught, and why your fixes worked.`,
    tasks: [{
      id: 1,
      description: "Convert your simulation case study metrics into 4 Google XYZ resume bullet points with AI",
      type: "practical",
      requirements: ["Apply Google XYZ formula", "Incorporate real simulation telemetry metrics"],
      verificationCriteria: ["Bullet points highlight quantifiable revenue impact and specific tactical levers"]
    }]
  },
  {
    id: 615,
    chapterNumber: 6,
    title: "Chapter 6.15: Day 5 (Do) — Grand Final Capstone: Full Omnichannel Growth Audit & Certification",
    level: "Advanced",
    hasSimulation: true,
    estimatedTime: 15,
    skillsLearned: ["Comprehensive Omnichannel Audit", "SLA Master Defense", "Full-Stack Growth Execution", "Verified Accreditation"],
    content: `# Grand Final Capstone: Full Omnichannel Growth Audit & Certification

Welcome to the **Grand Final Capstone of Krechet Academy Course 1: The Growth Specialist**.

You have traveled across 6 weeks and 89 intensive lessons. You have learned funnels, on-page SEO, Google Search Ads, landing page CRO, Meta video ads, GA4 event tracking, and speed-to-lead automation.

Now, you face the **Ultimate Comprehensive Evaluation**.

---

## 1. The Grand Capstone Briefing
An omnichannel business ecosystem is failing. You must audit, diagnose, and repair 4 core stages:

### Stage 1: Organic & Content Infrastructure
* Repair broken heading hierarchies (H1/H2) and meta descriptions on the client's core landing pages.
* Ensure E-E-A-T proof and image alt tags are compliant.

### Stage 2: Paid Search PPC Optimization
* Reorganize Google Ads account into Single-Theme Ad Groups (STAG).
* Deploy 25+ negative keyword shields to stop non-commercial budget bleed.
* Calibrate dayparting schedule to eliminate after-hours waste.

### Stage 3: Landing Page & Mobile CRO
* Strip header navigation from dedicated PPC landing pages.
* Mount above-the-fold value proposition and 3-layer trust stack.
* Optimize mobile thumb zone touch targets and form fields.

### Stage 4: Speed-to-Lead Automation & Telemetry
* Deploy Make.com webhook pipeline for instant lead notifications.
* Verify GA4 e-commerce events and cross-domain tracking in DebugView.

---

## 2. Passing Criteria & Accreditation
* Complete all 4 audit stages inside the Grand Capstone Simulator.
* Maintain overall campaign **ROAS >= 3.5x** and **Client Retention SLA >= 85%**.
* Upon passing, our engine publishes your **Verified Accredited Growth Specialist Credential** at \`/portfolio\` with permanent cryptographic proof-of-work verification!`,
    tasks: [{
      id: 1,
      description: "Complete the Grand Final Omnichannel Growth Audit across all 4 stages and claim verified accreditation",
      type: "simulation",
      requirements: [
        "Audit and repair SEO heading tags and meta descriptions",
        "Deploy Google Ads STAG structure with negative shields",
        "Execute mobile CRO overhaul and trust stack mounting",
        "Verify GA4 event tracking and Make.com speed-to-lead pipeline",
        "Maintain overall campaign ROAS >= 3.5x and SLA >= 85%"
      ],
      verificationCriteria: [
        "All 4 audit stages verified by comprehensive evaluation engine",
        "Verified Accredited Growth Specialist credential issued"
      ]
    }]
  }
];

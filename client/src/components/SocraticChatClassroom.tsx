import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useDeepgramVoice } from "@/hooks/useDeepgramVoice";
import { useGeminiLive } from "@/hooks/useGeminiLive";
import { VoiceLevelIndicator } from "./VoiceLevelIndicator";
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  CheckCircle2, 
  Brain, 
  Volume2, 
  VolumeX, 
  Radio, 
  Play, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Zap,
  RotateCcw,
  Bot,
  User,
  Lightbulb,
  Building2,
  Headphones,
  Square,
  Target
} from "lucide-react";
import { getActiveInstructor } from "@/lib/instructorConfig";

export interface LessonTarget {
  id: string;
  label: string;
  description: string;
  keywords: string[];
}

/**
 * Returns the exact 3-5 core competency targets for the current lesson
 */
function getLessonCoreTargets(chapterNumber: number, title: string, playbookContent?: string): LessonTarget[] {
  const t = title.toLowerCase();
  const subMatch = title.match(/Chapter\s*(\d+)[\-\.](\d+)/i);
  const chapter = subMatch ? parseInt(subMatch[1]) : chapterNumber;
  const lesson = subMatch ? parseInt(subMatch[2]) : 1;

  if (chapter === 1) {
    if (lesson === 1 || t.includes("customer journey")) {
      return [
        {
          id: "target_1",
          label: "3-Stage Funnel Anatomy",
          description: "Differentiate TOFU awareness, MOFU consideration, and BOFU high-intent conversion.",
          keywords: ["tofu", "mofu", "bofu", "funnel", "awareness", "consideration", "conversion", "intent"]
        },
        {
          id: "target_2",
          label: "The 97/3 Universal Rule",
          description: "Explain why 97% of market traffic is not in 'Buy Now' mode and requires education and trust.",
          keywords: ["97/3", "97", "3%", "buy now", "browsing", "problem", "trust", "nurture", "cold"]
        },
        {
          id: "target_3",
          label: "Clarity Over Cleverness",
          description: "Identify why driving cold traffic to a bare checkout page produces 85%+ bounce rates.",
          keywords: ["propose", "marry", "first date", "bounce", "amateur", "clarity", "trust", "shouting"]
        }
      ];
    }

    if (lesson === 2 || t.includes("teardown") || t.includes("ethical ai mapping")) {
      return [
        {
          id: "target_1",
          label: "Jenny's Funnel Failure",
          description: "Diagnose why driving cold traffic directly to an unbranded product page caused an 84% bounce rate.",
          keywords: ["jenny", "bounce", "cold", "skipped", "awareness", "consideration", "product page", "why"]
        },
        {
          id: "target_2",
          label: "Ethical AI Prompt Architecture",
          description: "Apply the 3 pillars (Role, Context, Strict Constraints) to instruct AI without buzzwords.",
          keywords: ["role", "context", "constraints", "prompt", "intern", "director", "buzzwords", "tactic"]
        },
        {
          id: "target_3",
          label: "Human-in-the-Loop Audit",
          description: "Apply the human audit checklist (Fact-Check, Strip Clichés, Verify Reality) before publishing.",
          keywords: ["audit", "fact-check", "clichés", "verify", "reality", "buzzwords", "elevate", "pivotal"]
        }
      ];
    }

    if (lesson === 3 || t.includes("interactive funnel") || t.includes("leak detection")) {
      return [
        {
          id: "target_1",
          label: "Funnel Diagnostic Signals",
          description: "Inspect baseline sessions, bounce rate, duration, and conversion rate in Jenny's account.",
          keywords: ["sessions", "bounce rate", "duration", "conversion", "cvr", "baseline", "diagnostics"]
        },
        {
          id: "target_2",
          label: "Primary Bottleneck Identification",
          description: "Confirm that an 84% bounce rate is the primary revenue leak draining Jenny's ad budget.",
          keywords: ["leak", "bottleneck", "84%", "drop-off", "primary", "drain", "disconnect"]
        },
        {
          id: "target_3",
          label: "Traffic vs Conversion Diagnosis",
          description: "Verify traffic volume is sufficient while landing page conversion is the broken component.",
          keywords: ["traffic", "volume", "sufficient", "landing page", "conversion", "offer", "broken"]
        }
      ];
    }

    if (lesson === 4 || t.includes("unit economics") || t.includes("math of profitability")) {
      return [
        {
          id: "target_1",
          label: "AOV & Gross Margin Math",
          description: "Calculate Average Order Value ($42.50) and Gross Profit Margin (62%).",
          keywords: ["aov", "average order", "gross margin", "margin", "cogs", "revenue", "62%"]
        },
        {
          id: "target_2",
          label: "CAC Calculation & Payback",
          description: "Calculate Customer Acquisition Cost (CAC) by dividing total spend by acquired customers.",
          keywords: ["cac", "acquisition cost", "spend", "cost", "customers", "divided", "ratio"]
        },
        {
          id: "target_3",
          label: "LTV / CAC > 3.0 Golden Ratio",
          description: "Apply the viability rule: Customer Lifetime Value must be at least 3x acquisition cost.",
          keywords: ["ltv", "golden ratio", "3x", "3.0", "viable", "profitability", "roas", "overhead"]
        }
      ];
    }

    if (lesson === 5 || t.includes("coffee unit economics") || t.includes("ai margin")) {
      return [
        {
          id: "target_1",
          label: "Jenny's Unit Margin Breakdown",
          description: "Dissect Jenny's $18.50 price, $7.00 COGS, and $11.50 (62%) gross profit per bag.",
          keywords: ["18.50", "7.00", "11.50", "cogs", "beans", "fuel", "valve", "gross profit"]
        },
        {
          id: "target_2",
          label: "Basket Contribution Profit",
          description: "Calculate $42.50 basket AOV minus $8.35 shipping box overhead = $18.00 contribution margin.",
          keywords: ["42.50", "8.35", "18.00", "contribution", "basket", "shipping", "break-even"]
        },
        {
          id: "target_3",
          label: "Auditing AI Financial Calculations",
          description: "Manually verify AI-generated financial estimates against actual production and freight receipts.",
          keywords: ["audit", "verify", "hallucination", "math", "calculator", "operational", "receipts"]
        }
      ];
    }

    if (lesson === 6 || t.includes("break-even cpa")) {
      return [
        {
          id: "target_1",
          label: "Break-Even CPA Ceiling",
          description: "Calculate maximum allowable acquisition cost ($18.00) before losing money on an order.",
          keywords: ["break-even", "cpa", "18", "ceiling", "maximum", "allowable", "zero profit"]
        },
        {
          id: "target_2",
          label: "Target CPA Setting",
          description: "Establish a profitable target CPA ($12.00) leaving $6.00 net margin per customer basket.",
          keywords: ["target", "12", "6.00", "profit", "margin", "sustainable", "buffer"]
        },
        {
          id: "target_3",
          label: "Cash Flow Bleed Prevention",
          description: "Diagnose why bidding above break-even CPA causes immediate bankruptcy on direct retail.",
          keywords: ["bleed", "loss", "bankruptcy", "cash flow", "bidding", "exceeds", "negative"]
        }
      ];
    }

    if (lesson === 7 || t.includes("client discovery") || t.includes("ideal customer")) {
      return [
        {
          id: "target_1",
          label: "ICP vs Vague Demographics",
          description: "Differentiate specific psychographic triggers from broad age/location filters.",
          keywords: ["icp", "ideal customer", "psychographics", "demographics", "vague", "triggers"]
        },
        {
          id: "target_2",
          label: "Customer Pain Point Discovery",
          description: "Pinpoint Marcus's core frustration with 6-month-old stale grocery store coffee beans.",
          keywords: ["marcus", "stale", "grocery", "roast date", "pain point", "freshness", "pour-over"]
        },
        {
          id: "target_3",
          label: "Value Alignment",
          description: "Connect 48-hour roast date transparency with customer willingness to pay premium prices.",
          keywords: ["roast date", "48-hour", "transparency", "premium", "willingness", "value"]
        }
      ];
    }

    if (lesson === 8 || t.includes("high-value") || t.includes("lazy questions")) {
      return [
        {
          id: "target_1",
          label: "Strategic Discovery Questions",
          description: "Distinguish diagnostic business questions from lazy checklist questions.",
          keywords: ["diagnostic", "lazy", "high-value", "checklist", "operational", "strategic", "inquiry"]
        },
        {
          id: "target_2",
          label: "Auditing AI Persona Output",
          description: "Spot generic AI assumptions and ground personas in real customer feedback.",
          keywords: ["audit", "assumptions", "hallucination", "real", "grounded", "feedback", "stereotypes"]
        },
        {
          id: "target_3",
          label: "Uncovering Buying Objections",
          description: "Identify the primary barrier preventing the customer from completing checkout.",
          keywords: ["objection", "barrier", "shipping", "price", "hesitation", "trust", "friction"]
        }
      ];
    }

    if (lesson === 9 || t.includes("client inquiry portal") || t.includes("message jenny")) {
      return [
        {
          id: "target_1",
          label: "Client Rapport Engagement",
          description: "Initiate professional real-time dialogue with founder Jenny Miller in the portal.",
          keywords: ["jenny", "rapport", "dialogue", "founder", "portal", "professional", "inquiry"]
        },
        {
          id: "target_2",
          label: "Operational Discovery",
          description: "Inquire about roast batch sizes, bean sources, and fulfillment constraints.",
          keywords: ["batch", "roast", "beans", "ethiopian", "guatemala", "fulfillment", "capacity"]
        },
        {
          id: "target_3",
          label: "Rapport Score Progression",
          description: "Earn Client Rapport through thoughtful, high-value business questions.",
          keywords: ["score", "rapport", "earned", "trust", "progression", "relationship"]
        }
      ];
    }

    if (lesson === 10 || t.includes("5-second test") || t.includes("clarity beats cleverness")) {
      return [
        {
          id: "target_1",
          label: "The 5-Second Test",
          description: "Answer the 3 essential questions: What is this? Why should I care? What do I do next?",
          keywords: ["5-second", "what is this", "why care", "what next", "instant", "clarity"]
        },
        {
          id: "target_2",
          label: "Clarity Over Cleverness",
          description: "Explain why poetic puns and vague slogans confuse visitors and cause immediate bounces.",
          keywords: ["clever", "clarity", "puns", "confuse", "bounce", "vague", "headline"]
        },
        {
          id: "target_3",
          label: "Hero Value Proposition",
          description: "Draft a hero headline clearly communicating product, key benefit, and offer.",
          keywords: ["value proposition", "hero", "benefit", "offer", "discount", "fresh", "roasted"]
        }
      ];
    }

    if (lesson === 11 || t.includes("teardown of 'coffee beans for sale'")) {
      return [
        {
          id: "target_1",
          label: "Hero Headline Teardown",
          description: "Diagnose why Jenny's baseline headline ('Coffee Beans For Sale') failed to convert.",
          keywords: ["coffee beans for sale", "baseline", "fail", "generic", "commodity", "zero hook"]
        },
        {
          id: "target_2",
          label: "Constrained AI Copywriting",
          description: "Prompt AI with exact character counts, sensory hooks, and zero marketing buzzwords.",
          keywords: ["constraints", "character count", "sensory", "buzzwords", "prompt", "junior copywriter"]
        },
        {
          id: "target_3",
          label: "Headline Differentiation",
          description: "Integrate 48-hour roast freshness and 15% introductory discount into the challenger copy.",
          keywords: ["challenger", "differentiation", "48-hour", "freshness", "15%", "discount", "hook"]
        }
      ];
    }

    if (lesson === 12 || t.includes("a/b test headline lab") || t.includes("visual qa")) {
      return [
        {
          id: "target_1",
          label: "A/B Test Configuration",
          description: "Configure Version A (Control) vs Version B (Challenger) in the interactive lab.",
          keywords: ["version a", "version b", "control", "challenger", "lab", "workshop", "variable"]
        },
        {
          id: "target_2",
          label: "Visual QA Inspection",
          description: "Inspect desktop and mobile responsive layout previews to ensure copy does not clip.",
          keywords: ["visual qa", "desktop", "mobile", "preview", "responsive", "clip", "render"]
        },
        {
          id: "target_3",
          label: "Split Traffic Deployment",
          description: "Launch the 50/50 split routing to collect real user performance telemetry.",
          keywords: ["split", "traffic", "50/50", "launch", "telemetry", "experiment"]
        }
      ];
    }

    if (lesson === 13 || t.includes("how a/b testing works") || t.includes("statistical significance")) {
      return [
        {
          id: "target_1",
          label: "Statistical Confidence (p < 0.05)",
          description: "Understand that results have a < 5% probability of being caused by random chance.",
          keywords: ["p < 0.05", "p-value", "statistical", "significance", "confidence", "noise", "random"]
        },
        {
          id: "target_2",
          label: "Sample Size Integrity",
          description: "Explain why early peeking and stopping tests prematurely creates false positives.",
          keywords: ["sample size", "peeking", "false positive", "premature", "patience", "volume"]
        },
        {
          id: "target_3",
          label: "Split Routing Architecture",
          description: "Understand how cookie-based routing divides traffic evenly between variants.",
          keywords: ["routing", "cookie", "traffic", "split", "fair", "control", "variant"]
        }
      ];
    }

    if (lesson === 14 || t.includes("sample size traps")) {
      return [
        {
          id: "target_1",
          label: "Sample Size Trap Detection",
          description: "Recognize false certainty in low-sample conversion data.",
          keywords: ["trap", "small sample", "certainty", "15 conversions", "noise", "variance"]
        },
        {
          id: "target_2",
          label: "Auditing AI Analytical Reports",
          description: "Verify that AI-generated conversion summaries account for sample size and variance.",
          keywords: ["audit", "analytical", "misinterpretation", "ai claim", "verify", "hallucination"]
        },
        {
          id: "target_3",
          label: "Data-Driven Decision Making",
          description: "Require statistical significance before reallocating client budget or changing pages.",
          keywords: ["data-driven", "reallocate", "budget", "decision", "discipline", "rigor"]
        }
      ];
    }

    if (lesson === 15 || t.includes("deploy the winning headline") || t.includes("certification audit")) {
      return [
        {
          id: "target_1",
          label: "Winning Variant Deployment",
          description: "Promote Version B to 100% live traffic on Jenny's storefront.",
          keywords: ["deploy", "winner", "promote", "100%", "active", "storefront", "account"]
        },
        {
          id: "target_2",
          label: "Downstream Auction Impact",
          description: "Verify Quality Score jumps from 4/10 to 8/10 and CPC drops by 50%.",
          keywords: ["quality score", "cpc", "discount", "auction", "adrank", "ripple", "4/10", "8/10"]
        },
        {
          id: "target_3",
          label: "Week 1 Certification Clearance",
          description: "Complete the Level 1 AI Authenticity Audit with a passing score.",
          keywords: ["certification", "audit", "level 1", "exam", "clearance", "authenticity"]
        }
      ];
    }
  }

  // Google Ads Hierarchy & Quality Score (Week 2/3)
  if (chapter === 2 || chapter === 3) {
    if (t.includes("match") || t.includes("negative")) {
      return [
        {
          id: "target_1",
          label: "Match Type Precision",
          description: "Differentiate Broad Match, Phrase Match (\"quotes\"), and Exact Match ([brackets]).",
          keywords: ["broad", "phrase", "exact", "match", "brackets", "quotes", "loose", "trigger"]
        },
        {
          id: "target_2",
          label: "Negative Keyword Budget Shield",
          description: "Deploy negative keywords to prevent budget waste on free seekers, job seekers, and competitor mismatch.",
          keywords: ["negative", "shield", "free", "jobs", "diy", "waste", "drain", "filter", "block"]
        },
        {
          id: "target_3",
          label: "Search Terms Auditing",
          description: "Inspect actual search queries and add negative exact or phrase exclusions.",
          keywords: ["search terms", "query", "audit", "exclude", "leakage", "intent"]
        }
      ];
    }
    return [
      {
        id: "target_1",
        label: "3-Tier Account Structure",
        description: "Distinguish Campaign budget & geo-targeting from Ad Group single-theme keyword clusters.",
        keywords: ["campaign", "ad group", "hierarchy", "theme", "cluster", "budget", "single-theme"]
      },
      {
        id: "target_2",
        label: "Quality Score Auction Math",
        description: "Explain how Quality Score acts as an inverse multiplier discounting CPC (CPC = AdRank / QS + $0.01).",
        keywords: ["quality score", "cpc", "discount", "formula", "adrank", "ctr", "ad relevance", "landing page"]
      },
      {
        id: "target_3",
        label: "Ad Group Theming & Relevance",
        description: "Diagnose how mixed, non-relevant keywords degrade Quality Score and double click costs.",
        keywords: ["relevance", "theme", "split", "different services", "bounce", "double", "tight"]
      }
    ];
  }

  // Fallback targets
  return [
    {
      id: "target_1",
      label: "Core Architecture",
      description: "Explain the central mental model and principles outlined in the study guide.",
      keywords: ["architecture", "funnel", "concept", "strategy", "foundation"]
    },
    {
      id: "target_2",
      label: "Practical Implementation",
      description: "Demonstrate practical application to real business and client scenarios.",
      keywords: ["practical", "business", "application", "client", "execution"]
    },
    {
      id: "target_3",
      label: "Verification & Error Prevention",
      description: "Identify common amateur mistakes and verify ethical execution.",
      keywords: ["mistake", "error", "verify", "audit", "prevention"]
    }
  ];
}

/**
 * Evaluates whether the student actually demonstrated understanding
 * rather than just repeating words from the guide.
 */
function evaluateTargetDemonstration(
  userText: string,
  instructorReply: string,
  pendingTargets: LessonTarget[]
): LessonTarget | null {
  const userLower = userText.toLowerCase().trim();
  const replyLower = instructorReply.toLowerCase();

  // If student input is too short or passive, it is NOT demonstration
  if (userLower.length < 20) return null;

  // Must not be a clarification or calling out parroting
  if (replyLower.includes('you quoted') || replyLower.includes('you read') || replyLower.includes('parroting')) {
    return null;
  }

  // Check if instructor affirmed real understanding in their response
  const isAffirmed = replyLower.includes('mastered') ||
    replyLower.includes('spot on') ||
    replyLower.includes('exactly right') ||
    replyLower.includes('great reasoning') ||
    replyLower.includes('excellent analysis') ||
    replyLower.includes('well, i think you have mastered');

  if (!isAffirmed) return null;

  // Find target whose keywords were substantively used
  for (const target of pendingTargets) {
    const hits = target.keywords.filter(kw => userLower.includes(kw.toLowerCase()));
    if (hits.length >= 2) {
      return target;
    }
  }

  return pendingTargets[0] || null;
}

function buildLessonBriefing({
  lessonTitle,
  chapterNumber,
  playbookContent,
  isSplitView,
  instructor
}: {
  lessonTitle: string;
  chapterNumber: number;
  playbookContent?: string;
  isSplitView?: boolean;
  instructor: any;
}): string {
  const lookDirective = isSplitView
    ? "Take a look at the guide on your right side."
    : "Take a look at the lesson guide below:";

  const titleLower = lessonTitle.toLowerCase();
  const subMatch = lessonTitle.match(/Chapter\s*(\d+)[\-\.](\d+)/i);
  const chapter = subMatch ? parseInt(subMatch[1]) : chapterNumber;
  const lesson = subMatch ? parseInt(subMatch[2]) : 1;

  const hasBiz = instructor.config.hasCustomBusiness && instructor.config.businessName;
  const bizName = instructor.config.businessName;
  const bizIndustry = instructor.config.industry || "local business";
  const bizOffer = instructor.config.primaryOffer || "core services";

  if (chapter === 1) {
    if (lesson === 1 || titleLower.includes("customer journey")) {
      return `Welcome! I'm ${instructor.name}, your instructor here at Krechet Academy. Let's get right into it!

${lookDirective} Start by taking a look at **Section 1: The Growth Funnel**. Give it a quick read to see how the 3 stages (TOFU, MOFU, and BOFU) work.

Whenever you're ready, read it to me or tell me what stands out, and we'll break down what it actually means for Jenny's coffee shop!`;
    }

    if (lesson === 2 || titleLower.includes("teardown") || titleLower.includes("ethical ai mapping")) {
      return `Welcome back! Today we're doing our Day 1 teardown of Jenny's Artisan Java & Roastery in Morgantown, WV. I'm your instructor ${instructor.name}. Let's get to work.

${lookDirective} In this module, we dissect why Jenny's first marketing campaign lost money, and how to use AI as your research intern without letting it write robotic nonsense:

Section 1: Real-World Teardown (Jenny's Artisan Java) —
Jenny ran $500 of Facebook ads driving cold traffic to a raw product page titled "Coffee Beans For Sale — $18.50". 3,400 visitors arrived, but 2,860 bounced within 4 seconds! She got only 12 sales. Why? Because she completely skipped the Awareness (TOFU) and Consideration (MOFU) stages. Cold visitors had no idea why her small-batch coffee was worth $18.50 when grocery store coffee is $8.99.

Section 2: The Golden Prompt Framework (AI is the Intern, You are the Director) —
Raw AI copy is stuffed with clichés like "In today's fast-paced digital landscape, coffee plays a pivotal role...". To get world-class work from AI, you must provide 3 pillars:
1. Role: Who the AI acts as.
2. Context: Jenny's small-batch roastery in Morgantown, WV.
3. Strict Constraints: Explicitly forbid generic buzzwords ('game-changer', 'elevate', 'unleash', 'pivotal').

Section 3: The Human Audit Checklist —
Always Fact-Check, Strip Clichés, and Verify Reality before publishing anything.

Now, looking at Sections 1 and 2 on your right:
What was the primary flaw in Jenny's funnel that caused 84% of her visitors to bounce, and how do strict negative constraints prevent AI from generating fluffy marketing clichés?`;
    }

    if (lesson === 3 || titleLower.includes("interactive funnel") || titleLower.includes("leak detection")) {
      return `Welcome to Day 1's hands-on simulation! I'm ${instructor.name}. Today you are inspecting Jenny's live account inside our simulator.

${lookDirective} Open Jenny's client dashboard from her header above. Look at her live attribution signals:
• Total Sessions: ~3,400 visits.
• Bounce Rate: 84% (Warning: over 70% indicates a severe disconnect between ad promise and page reality).
• Average Session Duration: under 12 seconds.
• Conversion Rate: 2.1%.

Your mission today is to locate the exact drop-off point where her revenue is leaking.

Looking at Jenny's live numbers:
Is Jenny's primary growth bottleneck a lack of traffic volume, or is her landing page failing to convert the traffic she already has?`;
    }

    if (lesson === 4 || titleLower.includes("unit economics") || titleLower.includes("math of profitability")) {
      return `Welcome to Day 2! Today we tackle unit economics. I'm ${instructor.name}. Marketing without math is just guessing with somebody else's money.

${lookDirective} Before spending a single dollar on ads, you must master the 4 essential financial numbers:

Section 1: The 4 Essential Numbers —
1. Average Order Value (AOV): Total Revenue ÷ Total Orders (Jenny's basket: $42.50).
2. Gross Profit Margin (%): (Revenue - Cost of Goods Sold) ÷ Revenue (Jenny's margin: 62%).
3. Customer Acquisition Cost (CAC): Total Ad Spend ÷ Total New Customers Acquired.
4. Customer Lifetime Value (LTV): AOV × Repeat Frequency × Lifespan.

Section 2: The Golden Ratio ($LTV / CAC > 3.0$) —
• Under 1.0: You lose money on every order.
• 1.0 - 2.0: High risk, barely covering operational overhead.
• 3.0 or higher: The gold standard of profitable, sustainable growth.

Section 3: Why ROAS Can Be Deceptive —
A "3.0 ROAS" sounds great, but if your product has a 20% margin, you lose $40 on every $100 spent! Never optimize for revenue alone; optimize for contribution profit.

Now, looking at Section 1 and 2 on your right:
If an agency spends $1,000 on ads and acquires 20 new customers, what is their CAC, and why is a 3.0 ROAS dangerous if a business only has a 20% gross margin?`;
    }

    if (lesson === 5 || titleLower.includes("coffee unit economics") || titleLower.includes("ai margin")) {
      return `Welcome to Day 2's teardown! I'm ${instructor.name}. Let's dissect Jenny's exact bag economics and learn how to use AI as a financial calculator without falling for AI calculation errors.

${lookDirective} Look at Section 1 on your right:
• Single Bag Retail Price: $18.50.
• Cost of Goods Sold (COGS): Green beans ($3.80) + Roasting fuel ($0.90) + Valve foil bag ($2.30) = $7.00 total COGS.
• Gross Profit per Bag: $18.50 - $7.00 = $11.50 (62% gross margin).
• Typical Customer Basket: 2.3 bags = $42.50 AOV.
• Fulfillment & Shipping Overhead: $8.35 per box.
• Net Contribution Margin: $42.50 × 62% ($26.35) - $8.35 = $18.00 contribution profit!

This $18.00 is Jenny's break-even acquisition ceiling. If she spends $18.01 on ads to get an order, she loses money.

Looking at Jenny's basket math on your right:
After subtracting COGS and shipping box overhead, what is Jenny's net contribution profit per basket, and why does this number represent her absolute break-even ceiling for ad spend?`;
    }

    if (lesson === 6 || titleLower.includes("break-even cpa")) {
      return `Welcome to Day 2's practical lab! I'm ${instructor.name}. Today you are calculating Jenny's maximum allowable ad spend.

${lookDirective} Open the Break-Even CPA Calculator on your right. Enter Jenny's basket AOV ($42.50), her 62% gross margin, and her $8.35 fulfillment cost.

Notice how her Maximum Break-Even CPA comes out to exactly $18.00. To run a healthy agency campaign, we set her Target CPA at $12.00, preserving $6.00 of net cash profit on every order.

Looking at the calculator:
What is Jenny's maximum break-even CPA, and what happens to her cash flow if an agency bids a $22.00 CPA?`;
    }

    if (lesson === 7 || titleLower.includes("client discovery") || titleLower.includes("ideal customer")) {
      return `Welcome to Day 3! Today we master Client Discovery and Ideal Customer Profiles (ICP). I'm ${instructor.name}.

${lookDirective} In marketing, speaking to "everyone" means speaking to no one. You must define an exact ICP:

Section 1: Demographics vs Psychographics —
Demographics tell you who they are (Age: 28-42, Morgantown WV). Psychographics tell you *why they buy* (Tired of bitter, stale 6-month-old grocery store beans; demands 48-hour roast date transparency).

Meet Marcus: A remote software engineer in Morgantown who brews pour-over coffee every morning using a Chemex. He gladly pays $18.50 for fresh beans stamped with a roast date.

Looking at Marcus's profile on your right:
Why is targeting "anyone who drinks coffee" a recipe for high ad costs, and what is Marcus's primary emotional frustration with supermarket coffee?`;
    }

    if (lesson === 8 || titleLower.includes("high-value") || titleLower.includes("lazy questions")) {
      return `Welcome to Day 3's teardown! I'm ${instructor.name}. Today we examine the difference between lazy agency questions and high-value strategic discovery.

${lookDirective} Look at Section 1 on your right:
• Lazy Agency Question: "What are your marketing goals?" (Produces generic answers like 'more sales').
• High-Value Strategic Question: "What is your current roasting capacity, how many repeat bags does an average customer buy in 6 months, and what is your return on ad spend break-even?"

When prompting AI to brainstorm customer objections, always verify the output against real customer support emails.

Looking at the comparison in Section 1:
Why does asking diagnostic operational questions build instant client trust, while generic checklist questions make you look like an inexperienced rookie?`;
    }

    if (lesson === 9 || titleLower.includes("client inquiry portal") || titleLower.includes("message jenny")) {
      return `Welcome to Day 3's live simulation! Founder Jenny Miller is at her roastery in Morgantown, and you now have direct access to her via the Client Inquiry Portal in her header above.

${lookDirective} Your mission is to interview Jenny, ask high-value discovery questions regarding her roasting capacity, bean sources, and fulfillment constraints, and earn +5 Client Rapport.

Open the Client Inquiry Portal:
What specific operational question did you ask Jenny, and what did she tell you about her weekly roast schedule?`;
    }

    if (lesson === 10 || titleLower.includes("5-second test") || titleLower.includes("clarity beats cleverness")) {
      return `Welcome to Day 4! Today we tackle Hero Headline Psychology and the 5-Second Test. I'm ${instructor.name}.

${lookDirective} When a visitor lands on a webpage, you have 5 seconds before they hit the back button. Your hero section must answer 3 questions instantly:
1. What is this?
2. Why should I care?
3. What do I do next?

Common Mistake to Avoid:
Writing clever, poetic slogans like "Wake Up and Smell the Magic." A poetic slogan forces visitors to think. Clarity always beats cleverness!

Looking at the 5-Second Rule on your right:
Why does a clever pun confuse cold visitors and cause immediate bounces, while a clear headline wins conversions?`;
    }

    if (lesson === 11 || titleLower.includes("teardown of 'coffee beans for sale'")) {
      return `Welcome to Day 4's teardown! I'm ${instructor.name}. Let's examine Jenny's baseline headline vs our high-converting challenger copy.

${lookDirective} Look at Section 1 on your right:
• Control Headline: "Coffee Beans For Sale — Buy Now" (Zero hook, zero differentiation, sounds like a commodity).
• Challenger Headline: "Small-Batch Artisan Coffee Roasted Fresh & Shipped to Your Door — 15% Off Your First Batch".

Notice how the challenger highlights freshness (roasted fresh), delivery convenience (shipped to your door), and a clear incentive (15% off).

Looking at the comparison on your right:
What specific value triggers in the challenger headline solve Marcus's fear of stale beans and motivate him to click?`;
    }

    if (lesson === 12 || titleLower.includes("a/b test headline lab") || titleLower.includes("visual qa")) {
      return `Welcome to Day 4's interactive lab! Open the A/B Test Headline Workshop.

${lookDirective} You will configure Version A (Control) against your new challenger Version B. Use the Live Visual QA preview to verify that your headline and 15% discount CTA render cleanly on both desktop and mobile screens before launching traffic.

Looking at your preview in the workshop:
What headline and CTA did you enter for Version B, and how does your visual preview render across desktop and mobile devices?`;
    }

    if (lesson === 13 || titleLower.includes("how a/b testing works") || titleLower.includes("statistical significance")) {
      return `Welcome to Day 5! Today we explore conversion rate optimization and statistical confidence. I'm ${instructor.name}.

${lookDirective} Never declare an A/B test winner after 10 clicks. That's gambling, not science:

Section 1: Statistical Confidence ($p < 0.05$) —
A test is only valid when there is less than a 5% probability that the result occurred due to random chance.

Section 2: The Sample Size Trap —
Stopping a test after 2 days because one headline had 3 sales and the other had 1 is a classic amateur trap called a false positive. You need statistical volume before reallocating client budget.

Looking at Section 1 on your right:
Why is stopping an A/B test after only 50 visits dangerous, and what does p < 0.05 actually mean for business decision-making?`;
    }

    if (lesson === 14 || titleLower.includes("sample size traps")) {
      return `Welcome to Day 5's analytical teardown! I'm ${instructor.name}. Today we audit AI-generated conversion summaries.

${lookDirective} Look at Section 1 on your right:
Often, generative AI will examine a small dataset with 12 conversions and confidently declare: "Version B is 99% likely to win!" This is a mathematical hallucination caused by ignoring sample size variance. As Growth Director, you must enforce statistical confidence before changing live pages.

Looking at the teardown on your right:
When an AI tool claims a winner based on a tiny sample size, what mathematical questions must you ask before accepting the recommendation?`;
    }

    if (lesson === 15 || titleLower.includes("deploy the winning headline") || titleLower.includes("certification audit")) {
      return `Congratulations on reaching Friday! I'm ${instructor.name}. Today you complete your Week 1 Level 1 Capstone.

${lookDirective} Open the A/B Test Workshop. Review your 50/50 split results showing the +28.6% conversion rate lift. Click "Deploy Winner to Client Account" to promote Version B to 100% live traffic!

Notice how deploying this high-converting headline triggers an immediate ripple effect:
• Google Ads Quality Score jumps from 4/10 to 8/10.
• Cost Per Click drops from $2.85 to $1.42 (a 50% discount!).
• Jenny's annual projected net profit increases by +$12,450.

Looking at your deployed results:
What happened to Jenny's projected Quality Score and CPC when you deployed the winning headline, and are you ready to take your Week 1 Level 1 Certification Audit?`;
    }
  }

  // Google Ads Account Hierarchy (Week 2/3)
  if (chapter === 2 || chapter === 3) {
    if (titleLower.includes("match") || titleLower.includes("negative")) {
      return `Welcome! Today we're diving into keyword match types and negative keyword budget protection. I'm ${instructor.name}.

${lookDirective} The #1 reason small businesses lose money on Google Ads is improper match type selection:
• Broad Match (coffee beans): Matches anything Google deems related—including free images or repair tutorials.
• Phrase Match ("organic coffee beans"): Matches searches containing the core phrase in order.
• Exact Match ([morgantown coffee roaster]): Matches ONLY high-intent buying searches.

Section 2: Negative Keyword Shields —
Adding negatives like -free, -cheap, -jobs, -salary prevents budget bleed on non-buying clicks.

Looking at the guide on your right:
If a local business runs all their keywords on Broad Match, why does that waste their budget so quickly, and what negative keywords should they add immediately?`;
    }

    return `Welcome! Today we're diving into Google Search Ads and the Quality Score auction. I'm ${instructor.name}.

${lookDirective} Google Ads is a mathematical auction where relevance earns discounts:
• Campaign Level: Sets daily budget, location geo-targeting, and bidding strategy.
• Ad Group Level: Groups keywords around a single theme.
• Ad Level: Headlines and descriptions matching search queries.

Section 2: The Quality Score Formula —
$$CPC = \\frac{AdRank_{competitor}}{Your\\,Quality\\,Score} + \\$0.01$$
A high Quality Score (8 to 10) discounts your Cost Per Click by up to 50%!

Looking at Sections 1 and 2 on your right:
If an advertiser puts 3 completely different services into one single ad group, what happens to their Ad Relevance and Quality Score, and how does that impact their Cost Per Click?`;
  }

  return `Welcome to our interactive classroom! I'm ${instructor.name}, your instructor at Krechet Academy.

${lookDirective} Let's explore the core concepts outlined in today's guide. Review the sections, key frameworks, and common mistakes to avoid.

When you're ready, let me know what questions you have or how you would apply this framework to your marketing strategy!`;
}

export function SocraticChatClassroom({
  tutorialId,
  lessonTitle,
  lessonLevel,
  chapterNumber = 1,
  simulationLink = "/seo-simulation/1",
  simulationName = "Jenny's Artisan Java CMS Repair",
  playbookContent,
  isSplitView = true,
  onMasteryAchieved
}: SocraticChatClassroomProps) {
  const { toast } = useToast();

  // Deterministic storage key for persistent lesson memory
  const storageKey = useMemo(() => {
    const idKey = tutorialId ? `tut_${tutorialId}` : `ch_${chapterNumber}`;
    const cleanTitle = lessonTitle.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 40);
    return `krechet_socratic_memory_v4_${idKey}_${cleanTitle}`;
  }, [tutorialId, chapterNumber, lessonTitle]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [masteryScore, setMasteryScore] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Lesson Core Targets (3-5 measurable milestones)
  const coreTargets = useMemo(() => {
    return getLessonCoreTargets(chapterNumber, lessonTitle, playbookContent);
  }, [chapterNumber, lessonTitle, playbookContent]);

  const [achievedTargetIds, setAchievedTargetIds] = useState<string[]>([]);
  const [studentWeaknesses, setStudentWeaknesses] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("krechet_student_weaknesses");
      return stored ? JSON.parse(stored) : ["budget_pacing", "cac_payback_math"];
    } catch {
      return ["budget_pacing"];
    }
  });

  const lastUserTextRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const track = (chapterNumber === 1 || lessonTitle.toLowerCase().includes("seo") || lessonTitle.toLowerCase().includes("fundamentals"))
    ? "seo"
    : (chapterNumber === 2 || lessonTitle.toLowerCase().includes("google ads") || lessonTitle.toLowerCase().includes("bidding"))
    ? "ads"
    : "general";

  const instructor = getActiveInstructor(track);

  const instructorVoice = useDeepgramVoice({
    defaultVoice: instructor.voice
  });

  const geminiLive = useGeminiLive();

  // Voice name for Gemini Live (Aoede for female / Charon or Puck for male)
  const geminiVoice = instructor.gender === "female" ? "Aoede" : "Charon";

  // Check and reward demonstration of competency targets
  const checkAndRewardTarget = (userText: string, instructorReply: string) => {
    const pendingTargets = coreTargets.filter(t => !achievedTargetIds.includes(t.id));
    if (pendingTargets.length === 0) return;

    const matched = evaluateTargetDemonstration(userText, instructorReply, pendingTargets);
    if (matched) {
      setAchievedTargetIds(prev => {
        if (prev.includes(matched.id)) return prev;
        const next = [...prev, matched.id];
        const newScore = Math.round((next.length / coreTargets.length) * 100);
        setMasteryScore(newScore);

        toast({
          title: `🎯 Competency Mastered: ${matched.label}`,
          description: `Comprehension increased to ${newScore}% (${next.length} of ${coreTargets.length} targets cleared).`
        });

        if (next.length === coreTargets.length) {
          setIsUnlocked(true);
          onMasteryAchieved?.();
          toast({
            title: "🏆 Lesson 100% Mastered!",
            description: "All core competency targets cleared. Weekly simulation is unlocked!"
          });
        }
        return next;
      });
    }
  };

  // Toggle Gemini Live bidirectional voice session
  const handleToggleGeminiLive = async () => {
    if (geminiLive.isConnected) {
      geminiLive.endSession();
      toast({
        title: "Voice Discussion Ended",
        description: "Returned to standard chat mode."
      });
      return;
    }

    // Stop Deepgram voice if active
    instructorVoice.stop();

    try {
      toast({
        title: "Connecting to Voice Office Hours... 🎙️",
        description: `Starting real-time bidirectional voice discussion with ${instructor.name}.`
      });

      const pendingTargets = coreTargets.filter(t => !achievedTargetIds.includes(t.id));
      const hasHistory = messages.length > 1;

      const systemInstruction = `You are ${instructor.name}, an encouraging, expert digital marketing instructor at Krechet Academy.
Your teaching style: '${instructor.teachingStyle}'.
The student is working through lesson '${lessonTitle}' (Chapter ${chapterNumber}).
Split View Guide: ${isSplitView ? "ACTIVE (The lesson guide is visible on the student's right side)" : "INACTIVE"}

LESSON REFERENCE NOTES:
${playbookContent || "Standard curriculum guide"}

${instructor.config.hasCustomBusiness && instructor.config.businessName ? `The student is training for their real business: ${instructor.config.businessName} (${instructor.config.industry} in ${instructor.config.location}). Primary offer: ${instructor.config.primaryOffer}. Target customer: ${instructor.config.targetAudience}.` : ""}

STUDENT ACTIVE WEAK AREAS TO WEAVE IN AS EXAMPLES:
${studentWeaknesses.map(w => w.replace(/_/g, " ")).join(", ")}

CURRICULUM COMPETENCY TARGETS TO ASSESS:
${coreTargets.map((t, idx) => `${idx + 1}. [${achievedTargetIds.includes(t.id) ? "COMPLETED" : "PENDING"}] ${t.label}: ${t.description}`).join("\n")}
${hasHistory ? `\nPREVIOUS CONVERSATION CONTEXT SO FAR:\n${messages.slice(-6).map(m => `${m.sender === "instructor" ? instructor.name : "Student"}: ${m.text}`).join("\n")}\n` : ""}
CRITICAL LIVE VOICE TEACHING GUIDELINES:
1. Speak warmly, concisely, and naturally like an encouraging senior mentor in live audio office hours. Keep every voice turn to 1-3 spoken sentences. Avoid monologues.
2. Direct the student to look at specific sections, formulas, and warnings in their guide on the right side (e.g., 'Look at Section 2 on your right...', 'Notice the formula for CAC...').
3. No aviation terminology (never say cockpit, copilot, runway, checkride, comms).
4. Do not use the phrase "master class" or "master" as a level label.
5. If the student answers a pending target well (${pendingTargets.map(t => t.label).join(", ")}), explicitly validate and praise their reasoning so they know they nailed that objective.
6. If the student interrupts you or asks a question, immediately pivot and answer their question directly.`;

      const initialPrompt = hasHistory
        ? `Hi ${instructor.name}! I'm returning to our live session on '${lessonTitle}'. We've already completed ${achievedTargetIds.length} of ${coreTargets.length} milestones. Please welcome me back warmly in 1 or 2 concise spoken sentences and let's pick up where we left off!`
        : `Hi ${instructor.name}! Our live voice discussion just connected. Please greet me warmly in 1 or 2 spoken sentences, welcome me to our lesson on '${lessonTitle}', and ask what questions or thoughts I have to kick off!`;

      await geminiLive.startSession({
        voiceName: geminiVoice,
        systemInstruction,
        initialPrompt,
        onAssistantTranscript: (text, isFinal) => {
          if (!text) return;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.sender === "instructor" && last.id.startsWith("gemini-live-ai-")) {
              return prev.map(m => m.id === last.id ? { ...m, text } : m);
            } else {
              return [...prev, {
                id: `gemini-live-ai-${Date.now()}`,
                sender: "instructor",
                text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }];
            }
          });

          if (isFinal) {
            checkAndRewardTarget(lastUserTextRef.current, text);
          }
        },
        onUserTranscript: (text, isFinal) => {
          if (!text) return;
          lastUserTextRef.current = text;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.sender === "student" && last.id.startsWith("gemini-live-user-")) {
              return prev.map(m => m.id === last.id ? { ...m, text } : m);
            } else {
              return [...prev, {
                id: `gemini-live-user-${Date.now()}`,
                sender: "student",
                text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }];
            }
          });
        },
        onInterrupted: () => {
          toast({
            title: "Interrupted",
            description: "Instructor paused to listen to you."
          });
        },
        onError: (err) => {
          toast({
            title: "Voice Discussion Error",
            description: err.message || "Failed to maintain voice session.",
            variant: "destructive"
          });
        }
      });

      toast({
        title: "Voice Discussion Connected! 🟢",
        description: `You are now in a live voice discussion with ${instructor.name}. Speak into your microphone anytime.`
      });
    } catch (err: any) {
      toast({
        title: "Could Not Connect",
        description: err.message || "Please check your microphone permissions.",
        variant: "destructive"
      });
    }
  };

  // Load lesson memory so progress & conversation are preserved when navigating away and returning
  useEffect(() => {
    let loadedFromStorage = false;
    try {
      const savedRaw = localStorage.getItem(storageKey);
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        if (saved && Array.isArray(saved.messages) && saved.messages.length > 0) {
          setMessages(saved.messages);
          setAchievedTargetIds(Array.isArray(saved.achievedTargetIds) ? saved.achievedTargetIds : []);
          setMasteryScore(typeof saved.masteryScore === "number" ? saved.masteryScore : 0);
          setIsUnlocked(Boolean(saved.isUnlocked));
          loadedFromStorage = true;
        }
      }
    } catch (err) {
      console.warn("[Lesson Memory] Error loading persisted state:", err);
    }

    if (!loadedFromStorage) {
      setAchievedTargetIds([]);
      setMasteryScore(0);
      setIsUnlocked(false);

      const initialBriefing = buildLessonBriefing({
        lessonTitle,
        chapterNumber,
        playbookContent,
        isSplitView,
        instructor
      });

      const firstMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "instructor",
        text: initialBriefing,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([firstMessage]);

      if (isVoiceEnabled) {
        instructorVoice.speak(initialBriefing);
      }
    }
  }, [storageKey, lessonTitle, chapterNumber, track, isSplitView, playbookContent]);

  // Persist conversation and milestone progress whenever state updates
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      const memoryPayload = {
        messages,
        achievedTargetIds,
        masteryScore,
        isUnlocked,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(memoryPayload));
    } catch (err) {
      console.warn("[Lesson Memory] Failed to save state to localStorage:", err);
    }
  }, [messages, achievedTargetIds, masteryScore, isUnlocked, storageKey]);

  // Auto-scroll on every incoming message is disabled to prevent viewport jumping during live voice streaming

  // Handle Voice Input via Web Speech API / Deepgram
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Microphone Not Supported",
        description: "Your browser does not support voice recognition. Please type your message.",
        variant: "destructive"
      });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({ title: "Microphone Active 🎙️", description: "Speak your response to Director Atlas..." });
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      toast({ title: "Microphone Error", description: err.message || "Could not access mic.", variant: "destructive" });
    }
  };

  // Toggle Voice Output (TTS)
  const toggleVoiceMode = () => {
    if (isVoiceEnabled) {
      instructorVoice.stop();
      setIsVoiceEnabled(false);
      toast({ title: "Voice Narration Disabled 🔇", description: "Switched to text-only chat." });
    } else {
      setIsVoiceEnabled(true);
      toast({ title: "Voice Narration Enabled 🎙️", description: "Director Atlas will now speak using Deepgram Aura." });
      const lastInstructorMsg = [...messages].reverse().find(m => m.sender === "instructor");
      if (lastInstructorMsg) {
        instructorVoice.speak(lastInstructorMsg.text);
      }
    }
  };

  // Handle Send Student Message & AI Socratic Response
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    if (geminiLive.isConnected) {
      const userText = inputValue.trim();
      setInputValue("");

      const newStudentMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "student",
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newStudentMsg]);
      geminiLive.sendClientText(userText);
      return;
    }

    const userText = inputValue.trim();
    setInputValue("");

    const newStudentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "student",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newStudentMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Call backend AI Assistant with Socratic pedagogical prompt
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `You are ${instructor.name}, a friendly, experienced digital marketing instructor at Krechet Academy.
Your teaching style is: '${instructor.teachingStyle}'.
The student is in lesson '${lessonTitle}' (Chapter ${chapterNumber}).
Split View Guide: ${isSplitView ? "ACTIVE (The lesson guide is visible on the student's right side)" : "INACTIVE"}

LESSON GUIDE REFERENCE:
${playbookContent || "Standard curriculum guide"}

The current conversation history is:
${updatedMessages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join("\n")}

${instructor.config.hasCustomBusiness && instructor.config.businessName ? `The student is training for their real business: ${instructor.config.businessName} (${instructor.config.industry} in ${instructor.config.location}). Primary offer: ${instructor.config.primaryOffer}. Target customer: ${instructor.config.targetAudience}.` : ""}

STUDENT: ${userText}

STUDENT WEAKNESSES TO REINFORCE AS EXAMPLES:
${studentWeaknesses.map(w => w.replace(/_/g, " ")).join(", ")}

CURRICULUM COMPETENCY TARGETS TO ASSESS:
${coreTargets.map((t, idx) => `${idx + 1}. [${achievedTargetIds.includes(t.id) ? "ACHIEVED" : "PENDING"}] ${t.label}: ${t.description}`).join("\n")}

CRITICAL TEACHING FLOW (STEP-BY-STEP DIALOGUE):
1. IF THE STUDENT READS SECTION 1 (OR SAYS THEY FINISHED READING):
   - Acknowledge their reading warmly, and ask:
     "Nice reading! Now in your own words, what did we actually learn from that? Do you understand what it is saying, or how a cold visitor at the top (TOFU) is different from someone ready to buy at the bottom (BOFU)?"
2. IF THE STUDENT EXPLAINS OR ASKS A QUESTION:
   - Teach them directly! Use a simple real-world analogy (e.g., a customer browsing coffees in a supermarket aisle vs someone walking up to the cash register).
   - Then guide them to Section 2: "Now take a quick look at Section 2 on your right: The 97/3 Rule. What does that tell us about driving cold traffic straight to a 'Buy Now' page?"
3. NEVER ACCEPT MERE PARROTING AS FULL MASTERY:
   - If they just read the text, do NOT say "You mastered the whole lesson!" Say: "You got the words down, but how would that help Jenny sell more coffee?"
4. ONLY CONCLUDE WHEN READY:
   - When the student demonstrates real understanding, conclude warmly:
     "Well, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!"

Keep your response friendly, natural, and conversational (2-3 sentences max).`,
          userContext: {
            instructor: instructor.name,
            style: instructor.teachingStyle,
            level: lessonLevel,
            contextType: "socratic_lesson",
            lessonTitle,
            chapterNumber,
            isSplitView: !!isSplitView,
            playbookContent: playbookContent || "",
            studentMessage: userText,
            businessName: instructor.config.businessName,
            industry: instructor.config.industry,
            weaknesses: studentWeaknesses,
            pendingTargets: coreTargets.filter(t => !achievedTargetIds.includes(t.id)).map(t => t.label)
          }
        })
      });

      const data = await res.json();
      let replyText = data.response || data.message || "Good reasoning. Let's make sure you ground this in concrete keyword intent and heading hierarchy.";

      // Incrementally evaluate competency targets achieved
      checkAndRewardTarget(userText, replyText);

      const instructorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "instructor",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, instructorMsg]);

      if (isVoiceEnabled) {
        instructorVoice.speak(replyText);
      }
    } catch (err) {
      // Fallback response if offline
      const replyText = "Sharp analysis. You understand how the Tactical Playbook sections work together to protect budget and scale conversions.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!";
      checkAndRewardTarget(userText, replyText);

      const instructorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "instructor",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, instructorMsg]);
      if (isVoiceEnabled) {
        instructorVoice.speak(replyText);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetClassroom = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {}

    setAchievedTargetIds([]);
    setMasteryScore(0);
    setIsUnlocked(false);

    const initialBriefing = buildLessonBriefing({
      lessonTitle,
      chapterNumber,
      playbookContent,
      isSplitView,
      instructor
    });

    const firstMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "instructor",
      text: initialBriefing,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([firstMessage]);

    if (isVoiceEnabled) {
      instructorVoice.speak(initialBriefing);
    }

    toast({
      title: "Lesson Reset 🔄",
      description: `${instructor.name} has restarted today's lesson. Practice history cleared.`
    });
  };

  return (
    <Card className="border-border/80 bg-gradient-to-b from-card via-background to-secondary/20 shadow-2xl overflow-hidden my-4">
      {/* Classroom Header */}
      <CardHeader className="p-3 sm:p-4 bg-secondary/50 border-b border-border/80 flex flex-row items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative shrink-0">
            <img 
              src={instructor.avatar} 
              alt={instructor.name}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-primary shadow"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <CardTitle className="text-xs sm:text-sm font-bold text-foreground truncate">{instructor.name}</CardTitle>
              <Badge variant="outline" className="text-[9px] sm:text-[10px] capitalize bg-primary/10 border-primary/20 text-primary">
                {instructor.teachingStyle.replace('_', ' ')}
              </Badge>
              {instructor.config.hasCustomBusiness && instructor.config.businessName && (
                <Badge variant="secondary" className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center gap-1 truncate max-w-[120px]">
                  <Building2 className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate">{instructor.config.businessName}</span>
                </Badge>
              )}
            </div>
            <CardDescription className="text-[11px] sm:text-xs text-muted-foreground truncate">
              {instructor.role} • Chapter {chapterNumber}: {lessonTitle}
            </CardDescription>
          </div>
        </div>

        {/* Actions: Live Voice Call, Voice Toggle, Restart Briefing */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto flex-wrap sm:flex-nowrap justify-end">
          {/* Button-Sized Live Voice Level & Diagnostics Meter */}
          {(geminiLive.isConnected || geminiLive.isConnecting || geminiLive.error) && (
            <VoiceLevelIndicator
              volumeLevel={geminiLive.volumeLevel}
              pipelineStage={geminiLive.pipelineStage}
              isAiSpeaking={geminiLive.isAiSpeaking}
              isMicMuted={geminiLive.isMicMuted}
              diagnosticInfo={geminiLive.diagnosticInfo}
              error={geminiLive.error}
              onRetry={handleToggleGeminiLive}
            />
          )}

          <Button
            size="sm"
            variant={geminiLive.isConnected ? "destructive" : "default"}
            onClick={handleToggleGeminiLive}
            disabled={geminiLive.isConnecting}
            className={`text-xs h-8 px-2 sm:px-3 gap-1.5 font-bold shadow-sm ${
              geminiLive.isConnected
                ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
            title="Real-time zero-latency bidirectional voice discussion with instructor"
          >
            {geminiLive.isConnecting ? (
              <>
                <Radio className="h-3.5 w-3.5 shrink-0 animate-spin" />
                <span className="hidden sm:inline">Connecting...</span>
                <span className="sm:hidden">Connecting</span>
              </>
            ) : geminiLive.isConnected ? (
              <>
                <Square className="h-3.5 w-3.5 shrink-0 fill-current" />
                <span className="hidden sm:inline">End Voice Session</span>
                <span className="sm:hidden">End Voice</span>
              </>
            ) : (
              <>
                <Headphones className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Voice Discussion</span>
                <span className="sm:hidden">Talk Live</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant={isVoiceEnabled ? "default" : "outline"}
            onClick={toggleVoiceMode}
            className={`text-xs h-8 px-2 sm:px-3 gap-1.5 ${isVoiceEnabled ? "bg-primary text-primary-foreground font-bold" : "border-border text-muted-foreground"}`}
            title="Turn Deepgram Aura voice narration on/off for text replies"
          >
            {isVoiceEnabled ? <Volume2 className="h-3.5 w-3.5 shrink-0" /> : <VolumeX className="h-3.5 w-3.5 shrink-0" />}
            <span className="hidden sm:inline">{isVoiceEnabled ? "Narration ON" : "Narration OFF"}</span>
            <span className="sm:hidden">{isVoiceEnabled ? "Narrate" : "Mute"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleResetClassroom}
            className="text-xs h-8 px-2 sm:px-2.5 gap-1 border-border text-muted-foreground hover:text-foreground"
            title="Restart Lesson Briefing"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Restart</span>
          </Button>
        </div>
      </CardHeader>

      {/* Competency Mastery Progress Bar & Milestone Targets Strip */}
      <div className="bg-secondary/30 px-3 sm:px-4 py-2.5 border-b border-border/60 space-y-2 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex items-center gap-2 w-full sm:flex-1">
            <span className="font-semibold text-muted-foreground text-[10px] sm:text-[11px] shrink-0">Comprehension Mastery:</span>
            <Progress value={masteryScore} className="h-2 flex-1 bg-secondary" />
            <span className={`font-mono font-bold text-[10px] sm:text-[11px] shrink-0 ${masteryScore >= 100 ? "text-emerald-400" : "text-amber-400"}`}>
              {masteryScore}% ({achievedTargetIds.length}/{coreTargets.length} targets)
            </span>
          </div>

          {masteryScore >= 100 ? (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[9px] sm:text-[10px] font-bold shrink-0 self-start sm:self-auto">
              <CheckCircle2 className="h-3 w-3 mr-1 inline" /> All Core Targets Mastered
            </Badge>
          ) : (
            <span className="text-[10px] text-muted-foreground italic shrink-0 self-start sm:self-auto">
              Clear all {coreTargets.length} targets to unlock simulation clearance
            </span>
          )}
        </div>

        {/* Milestone Targets Checklist Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {coreTargets.map((target, idx) => {
            const isDone = achievedTargetIds.includes(target.id);
            return (
              <span
                key={target.id}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 border transition-all ${
                  isDone
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-xs"
                    : "bg-secondary/40 text-muted-foreground border-border/60"
                }`}
                title={target.description}
              >
                {isDone ? (
                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 shrink-0" />
                )}
                <span>Target {idx + 1}: {target.label}</span>
              </span>
            );
          })}

          {studentWeaknesses.length > 0 && (
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-500/30 text-amber-300 bg-amber-950/20 ml-auto">
              Weakness Focus: {studentWeaknesses[0].replace(/_/g, " ")}
            </Badge>
          )}
        </div>
      </div>

      {/* Interactive Chat Messages Thread */}
      <CardContent className="p-4 space-y-4">
        {/* Active Gemini Live Bidirectional Voice Status Banner */}
        {geminiLive.isConnected && (
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/50 p-3 rounded-xl flex items-center justify-between gap-3 text-xs shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-emerald-400 text-xs flex items-center gap-1.5 flex-wrap">
                  <span>● LIVE VOICE SESSION ACTIVE — {instructor.name}</span>
                  {geminiLive.isAiSpeaking && (
                    <Badge variant="outline" className="text-[9px] bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse">
                      Instructor Speaking...
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  Zero-latency bidirectional voice • Speak freely into mic or interrupt anytime
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <VoiceLevelIndicator
                volumeLevel={geminiLive.volumeLevel}
                pipelineStage={geminiLive.pipelineStage}
                isAiSpeaking={geminiLive.isAiSpeaking}
                isMicMuted={geminiLive.isMicMuted}
                diagnosticInfo={geminiLive.diagnosticInfo}
                error={geminiLive.error}
                onRetry={handleToggleGeminiLive}
              />

              <Button
                size="sm"
                variant="outline"
                onClick={geminiLive.toggleMicMute}
                className={`h-8 px-2 text-[11px] border-border ${geminiLive.isMicMuted ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "text-muted-foreground hover:text-foreground"}`}
              >
                {geminiLive.isMicMuted ? <MicOff className="h-3 w-3 mr-1 text-amber-400" /> : <Mic className="h-3 w-3 mr-1 text-emerald-400" />}
                <span>{geminiLive.isMicMuted ? "Unmute" : "Mute"}</span>
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={geminiLive.endSession}
                className="h-8 px-2.5 text-[11px] bg-rose-600 hover:bg-rose-500 text-white font-medium shadow"
              >
                <Square className="h-3 w-3 mr-1 fill-current" />
                <span>End Voice Session</span>
              </Button>
            </div>
          </div>
        )}
        <div className="space-y-3 max-h-[380px] min-h-[220px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "instructor" && (
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs shrink-0 font-bold">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                  msg.sender === "student"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card border border-border/80 text-foreground rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="text-[9px] opacity-60 block mt-1 text-right font-mono">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === "student" && (
                <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-foreground text-xs shrink-0 font-bold">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-muted-foreground text-xs italic">
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <span>{instructor.name} is assessing your response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Voice Mic & Send */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Ask a question or explain to ${instructor.name} (or tap Mic to speak)...`}
              className="min-h-[58px] sm:min-h-[65px] text-xs bg-background border-border text-foreground leading-relaxed resize-none flex-1"
            />

            <div className="flex flex-col gap-1.5 shrink-0">
              <Button
                type="button"
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleVoiceInput}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg"
                title={isListening ? "Stop Voice Input" : "Speak Voice Input 🎙️"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-emerald-400" />}
              </Button>

              <Button
                type="button"
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                title="Send Message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Weekly Simulation Workbench Banner - Available throughout the week */}
        <div className={`p-3.5 sm:p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition-all duration-300 ${
          masteryScore >= 80 
            ? "bg-gradient-to-r from-emerald-950/60 via-card to-secondary border-emerald-500/50 shadow-lg" 
            : "bg-gradient-to-r from-secondary/40 via-card to-background border-border/70"
        }`}>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>
                {masteryScore >= 80 
                  ? "🎯 Lesson Mastered — Ready for the Workbench!" 
                  : "🛠️ Weekly Client Simulation Workbench (Open All Week)"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Practice applying what you learn in the live interactive client workbench: <strong>{simulationName}</strong>
            </p>
          </div>

          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 shadow-md">
            <Link href={simulationLink}>
              <Play className="h-3 w-3 mr-1.5 fill-current" />
              <span>Open Simulation Workbench</span>
              <ArrowRight className="h-3 w-3 ml-1.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SocraticChatClassroom;

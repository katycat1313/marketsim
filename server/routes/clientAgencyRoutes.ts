import { Router, Request, Response } from "express";
import { unifiedClientEngine } from "../services/unifiedClientEngine";
import { z } from "zod";

const router = Router();

/**
 * GET /api/client/current
 * Returns the active agency client account overview, current day, health score, and module states.
 */
router.get("/current", async (_req: Request, res: Response) => {
  try {
    const overview = unifiedClientEngine.getClientOverview();
    res.json(overview);
  } catch (error) {
    console.error("Error retrieving current client overview:", error);
    res.status(500).json({ error: "Failed to retrieve client overview" });
  }
});

/**
 * POST /api/client/advance-time
 * Advances the simulation timeline by a set number of days (default 7 days / 1 week),
 * simulating live traffic, ad spend, conversions, and organic search indexing.
 */
router.post("/advance-time", async (req: Request, res: Response) => {
  try {
    const days = typeof req.body?.days === "number" && req.body.days > 0 ? req.body.days : 7;
    const result = unifiedClientEngine.advanceTime(days);
    res.json(result);
  } catch (error) {
    console.error("Error advancing simulation time:", error);
    res.status(500).json({ error: "Failed to advance simulation time" });
  }
});

/**
 * POST /api/client/deploy-ab-test
 * Deploys a winning A/B test variant directly to the live client marketing engine.
 * Lifts landing page conversion rate and updates active ad creative.
 */
router.post("/deploy-ab-test", async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      testId: z.number().default(1),
      testName: z.string().default("Homepage Value Proposition Test"),
      winningVariant: z.string().min(1, "Winning variant name is required"),
      testVariable: z.string().default("headline"),
      improvementPercent: z.number().min(0.1, "Improvement percent must be positive")
    });

    const parsed = schema.parse(req.body);
    const updatedOverview = unifiedClientEngine.deployABTestWinner(
      parsed.testId,
      parsed.testName,
      parsed.winningVariant,
      parsed.testVariable,
      parsed.improvementPercent
    );

    res.json({
      success: true,
      message: `Successfully deployed winning variant "${parsed.winningVariant}" to client account!`,
      overview: updatedOverview
    });
  } catch (error) {
    console.error("Error deploying A/B test winner:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid deployment data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to deploy A/B test winner" });
  }
});

/**
 * POST /api/client/sync-seo
 * Syncs SEO Studio landing page score into Google Ads Quality Score & Landing Page Experience.
 */
router.post("/sync-seo", async (req: Request, res: Response) => {
  try {
    const { score, pageContent } = req.body || {};
    if (typeof score !== "number") {
      return res.status(400).json({ error: "Score must be a number (0-100)" });
    }

    const updatedOverview = unifiedClientEngine.syncSeoScore(score, pageContent);
    res.json({
      success: true,
      message: `SEO score synced. Landing page experience updated to ${updatedOverview.seo.landingPageExperience}.`,
      overview: updatedOverview
    });
  } catch (error) {
    console.error("Error syncing SEO score:", error);
    res.status(500).json({ error: "Failed to sync SEO score" });
  }
});

/**
 * POST /api/client/sync-persona
 * Syncs Persona Builder synthesis into ad campaign targeting and relevance.
 */
router.post("/sync-persona", async (req: Request, res: Response) => {
  try {
    const personaData = req.body || {};
    const updatedOverview = unifiedClientEngine.syncPersona(personaData);
    res.json({
      success: true,
      message: "Customer persona synthesized and synced to campaign targeting.",
      overview: updatedOverview
    });
  } catch (error) {
    console.error("Error syncing persona:", error);
    res.status(500).json({ error: "Failed to sync persona" });
  }
});

/**
 * POST /api/client/update-level
 * Updates the student's current agency week / rigor level.
 */
router.post("/update-level", async (req: Request, res: Response) => {
  try {
    const { level } = req.body || {};
    if (!level || typeof level !== "string") {
      return res.status(400).json({ error: "Level string is required" });
    }

    const updatedOverview = unifiedClientEngine.updateLevel(level);
    res.json({
      success: true,
      overview: updatedOverview
    });
  } catch (error) {
    console.error("Error updating client level:", error);
    res.status(500).json({ error: "Failed to update level" });
  }
});

/**
 * GET /api/client/analytics
 * Returns the multi-channel attribution and daily historical performance.
 */
router.get("/analytics", async (_req: Request, res: Response) => {
  try {
    const overview = unifiedClientEngine.getClientOverview();
    res.json({
      attribution: overview.attribution,
      blended: overview.blended,
      dailyHistory: overview.dailyHistory,
      healthScore: overview.healthScore,
      timeline: overview.timeline
    });
  } catch (error) {
    console.error("Error retrieving client analytics:", error);
    res.status(500).json({ error: "Failed to retrieve analytics" });
  }
});

/**
 * POST /api/client/audit-submission
 * Audits a student's end-of-week simulation submission.
 * Validates practical multiple choice scenarios and runs the AI Authenticity Auditor
 * on written strategic reasoning to detect robotic/AI copy-pastes and enforce
 * real-world client grounding before granting certification credit.
 */
router.post("/audit-submission", async (req: Request, res: Response) => {
  try {
    const { week = 1, multipleChoiceAnswers = {}, reasoningAnswers = {} } = req.body || {};

    // 1. Evaluate Multiple Choice Scenarios (3 Core Scenarios for Week 1)
    const mcKeys = {
      q1: "b", // SEO relevance -> Landing Page Experience -> Quality Score boost -> CPC discount
      q2: "c", // 95% statistical significance prevents deploying random sample noise
      q3: "a", // Conversion rate lift enables same traffic to yield more sales, lowering blended CAC
    };

    let mcScore = 0;
    const mcDetails: Record<string, { correct: boolean; userChoice: string; explanation: string }> = {};

    mcDetails.q1 = {
      correct: multipleChoiceAnswers.q1 === mcKeys.q1,
      userChoice: multipleChoiceAnswers.q1 || "unanswered",
      explanation: "Improving on-page SEO relevance elevates Landing Page Experience, which boosts Google Quality Score (up to 9/10) and lowers auction CPC from $2.85 down to $1.42."
    };
    if (mcDetails.q1.correct) mcScore++;

    mcDetails.q2 = {
      correct: multipleChoiceAnswers.q2 === mcKeys.q2,
      userChoice: multipleChoiceAnswers.q2 || "unanswered",
      explanation: "Requiring 95% statistical confidence (p < 0.05) ensures the +28.6% conversion lift is mathematically proven rather than a temporary traffic fluctuation."
    };
    if (mcDetails.q2.correct) mcScore++;

    mcDetails.q3 = {
      correct: multipleChoiceAnswers.q3 === mcKeys.q3,
      userChoice: multipleChoiceAnswers.q3 || "unanswered",
      explanation: "A higher website conversion rate converts existing traffic more efficiently, generating more purchases from the exact same ad spend and lowering blended CAC."
    };
    if (mcDetails.q3.correct) mcScore++;

    // 2. AI Authenticity Auditor on Strategic Written Reasoning
    const q1Text = (reasoningAnswers.q1 || "").trim();
    const q2Text = (reasoningAnswers.q2 || "").trim();

    const aiClichéPatterns = [
      { pattern: /(in today'?s|in the) (fast-paced|dynamic|ever-evolving|modern) (digital|marketing|business) landscape/i, label: "Formulaic opener ('in today's digital landscape')" },
      { pattern: /it is (crucial|imperative|essential|paramount|vital) to (note|remember|understand|recognize|ensure|keep in mind)/i, label: "Robotic AI assertion ('it is crucial to note...')" },
      { pattern: /\b(furthermore|moreover|in conclusion|delve into|tapestry|beacon of|testament to)\b/i, label: "Academic AI filler vocabulary" },
      { pattern: /not only does .+, but it also/i, label: "Formulaic tripartite clause structure" },
      { pattern: /\b(foster deeper connections|resonate deeply with|synergistic relationship)\b/i, label: "Generic marketing buzzword template" },
      { pattern: /as an ai|as a language model/i, label: "Explicit LLM artifact" },
      { pattern: /plays a (pivotal|critical|crucial) role/i, label: "AI stock transition ('plays a pivotal role')" }
    ];

    const clientSpecificKeywords = [
      "jenny", "coffee", "roast", "beans", "artisan", "quality score", "cpc", 
      "headline", "conversion", "offer", "discount", "organic", "search", "intent", 
      "checkout", "taste", "small-batch", "cac", "roastery"
    ];

    const auditFlags: string[] = [];
    let detectedAICliches = 0;

    // Check combined text
    const combinedText = `${q1Text} ${q2Text}`.toLowerCase();

    // Check word counts
    if (q1Text.split(/\s+/).length < 15) {
      auditFlags.push("Reasoning 1 is too brief (minimum 15 words of strategic rationale required).");
    }
    if (q2Text.split(/\s+/).length < 15) {
      auditFlags.push("Reasoning 2 is too brief (minimum 15 words of strategic rationale required).");
    }

    // Check clichés
    for (const item of aiClichéPatterns) {
      if (item.pattern.test(q1Text) || item.pattern.test(q2Text)) {
        detectedAICliches++;
        auditFlags.push(`AI Hallmark detected: ${item.label}`);
      }
    }

    // Check client grounding
    const matchedKeywords = clientSpecificKeywords.filter(kw => combinedText.includes(kw));
    const isGroundingSufficient = matchedKeywords.length >= 3;

    if (!isGroundingSufficient) {
      auditFlags.push("Lacks client-specific grounding: Reasoning does not mention Jenny's Artisan Java, coffee offerings, or specific campaign metrics.");
    }

    // Calculate authenticity score
    let authenticityScore = 100;
    authenticityScore -= detectedAICliches * 25;
    if (!isGroundingSufficient) authenticityScore -= 30;
    if (q1Text.split(/\s+/).length < 15) authenticityScore -= 15;
    if (q2Text.split(/\s+/).length < 15) authenticityScore -= 15;
    authenticityScore = Math.max(10, Math.min(100, authenticityScore));

    const isAuthentic = authenticityScore >= 65 && auditFlags.filter(f => f.startsWith("AI Hallmark")).length === 0 && isGroundingSufficient;
    const isApproved = mcScore >= 2 && isAuthentic;

    let practitionerFeedback = "";
    if (isApproved) {
      practitionerFeedback = `Agency Director Approval: Strong practitioner-level reasoning. Your explanation directly links Jenny's value proposition to customer conversion behavior without relying on sterile textbook clichés. Week ${week} competency verified.`;
    } else if (detectedAICliches > 0) {
      practitionerFeedback = "Audit Notice: Your reasoning triggered our AI Authenticity filter. It reads like a generated ChatGPT template or textbook summary. An agency client wants your personal strategic diagnosis grounded in their specific brand (Jenny's coffee beans, roast quality, conversion rates). Please revise in your own direct voice.";
    } else if (!isGroundingSufficient) {
      practitionerFeedback = "Audit Notice: Your strategic reasoning is too abstract. Anchor your answer directly to Jenny's coffee roastery, her audience, or her specific campaign metrics.";
    } else {
      practitionerFeedback = "Review needed: Re-check the multiple-choice scenario questions and provide more detailed practitioner rationale.";
    }

    res.json({
      success: true,
      week,
      clientName: "Jenny's Artisan Java & Roastery",
      mcScore,
      mcTotal: 3,
      mcPercentage: Math.round((mcScore / 3) * 100),
      mcDetails,
      authenticityScore,
      isAuthentic,
      isApproved,
      auditFlags,
      practitionerFeedback,
      verifiedAt: isApproved ? new Date().toISOString() : null,
      credential: isApproved ? {
        title: "Certified Digital Marketing Specialist - Level 1",
        accountAudited: "Jenny's Artisan Java & Roastery",
        skillsVerified: ["On-Page SEO to Quality Score Synergy", "A/B Testing Statistical Validation", "Multi-Channel Blended Attribution"],
        rigorStandard: "Uncheatable Practitioner Verification - No AI Templates"
      } : null
    });
  } catch (error) {
    console.error("Error processing audit submission:", error);
    res.status(500).json({ error: "Failed to process simulation audit" });
  }
});

/**
 * POST /api/client/inquiry
 * Interactive conversational endpoint for Jenny Miller (Week 1 Client AI Agent).
 * Jenny answers marketing inquiries and actively asks the student strategic questions
 * about her business, goals, and campaign strategy.
 */
router.post("/inquiry", async (req: Request, res: Response) => {
  try {
    const { message } = req.body || {};
    const question = (message || "").trim();

    if (!question) {
      return res.status(400).json({ error: "Message is required" });
    }

    const lower = question.toLowerCase();
    let reply = "";
    let followUpQuestion = "";
    let suggestedReplies: string[] = [];
    let rapportChange = 0;
    let qualityBadge: string | null = null;

    // Unit Economics & Margins & CPA
    if (lower.includes("margin") || lower.includes("cpa") || lower.includes("order value") || lower.includes("aov") || lower.includes("break-even") || lower.includes("unit economic") || lower.includes("profit") || lower.includes("cost")) {
      rapportChange = 5;
      qualityBadge = "Financial Acumen (+5 Rapport)";
      reply = "I'm so relieved you asked about our numbers first! Most junior marketers just want to spend my budget on ads without knowing if we make money.\\n\\nHere are our exact unit economics:\\n• Single 12oz bag retail price: $18.50 to $21.00\\n• Average Order Value (AOV): $42.50 (customers typically buy 2.3 bags per order)\\n• Gross margin on coffee: 62% ($26.35 gross profit per average order)\\n• Fulfillment & shipping cost: $8.35 per box\\n• Net contribution profit before advertising: $18.00\\n\\nThat means our absolute break-even CPA is $18.00! If we pay more than $18 to acquire a first-time customer on Google or Meta, I lose money out of my own pocket.";
      followUpQuestion = "Given that our break-even CPA is $18.00, what target CPA should we set as our safety ceiling for our Google Search campaign?";
      suggestedReplies = [
        "We should target $14.00 - $15.00 CPA to guarantee a healthy profit cushion on every order.",
        "Let's aim for a 3.0 ROAS, which works out to about $14.15 CPA on your $42.50 AOV.",
        "Can we also look at customer repeat purchase rates to see how LTV offsets the initial CPA?"
      ];
    }
    // Differentiator & Roast Freshness & Supermarket Contrast
    else if (lower.includes("differentiator") || lower.includes("advantage") || lower.includes("fresh") || lower.includes("roast") || lower.includes("grocery") || lower.includes("supermarket") || lower.includes("why buy") || lower.includes("special")) {
      rapportChange = 5;
      qualityBadge = "Core Value Proposition (+5 Rapport)";
      reply = "Our 48-Hour Roast-to-Ship guarantee is our single biggest unfair advantage!\\n\\nSupermarket coffee was roasted 6 to 9 months ago in huge commercial plants, sealed in bulk bags, and sat in distribution warehouses losing all its natural oils and aromatic crema. It tastes flat and bitter.\\n\\nWe roast in 12-lb micro-batches right here in Morgantown every Monday and Thursday morning. We stamp the exact roast date by hand on every bag, and ship it within 48 hours. When customers open the box, the entire kitchen smells like rich chocolate and dark berries. Once people taste fresh roast, they can never go back to grocery store coffee.";
      followUpQuestion = "My question for you is: How can we convey this 48-hour roast freshness in our hero headline in under 10 words so scanning visitors actually notice it?";
      suggestedReplies = [
        "Headline idea: 'Small-Batch Artisan Coffee Roasted Fresh & Shipped to Your Door'",
        "We should add an explicit 'Roasted Within 48 Hours Guarantee' trust badge right under the H1.",
        "Let's test an 'Anti-Stale Coffee Guarantee' angle in the A/B Testing Lab."
      ];
    }
    // Headline / Offer / A/B Testing / Homepage Bounce Rate
    else if (lower.includes("headline") || lower.includes("offer") || lower.includes("bounce") || lower.includes("homepage") || lower.includes("test") || lower.includes("a/b") || lower.includes("clarity") || lower.includes("discount")) {
      rapportChange = 5;
      qualityBadge = "Offer Architecture (+5 Rapport)";
      reply = "You're spot on about our homepage problem. Right now our main headline just says 'Coffee Beans For Sale' with a generic 'Buy Now' button. It's completely bland and looks like a generic bulk warehouse.\\n\\nOur bounce rate is 84%, which means 8 out of 10 people click our ads and leave in under 4 seconds without ever tasting our coffee!\\n\\nI tried a 10% popup before, but it felt cheap. However, I am open to a generous 15% introductory trial on their first roaster's choice bag if the headline clearly explains why our artisan roast is worth trying.";
      followUpQuestion = "If we launch this 15% welcome discount, should we test it as a split test first, and how many visitors do we need before we know the result is mathematically real?";
      suggestedReplies = [
        "Yes, we must run a 50/50 A/B test until we reach 95% statistical confidence (p < 0.05).",
        "We need around 1,000 to 2,500 visitors across both variants so we don't make decisions on random noise.",
        "I already have Card B configured in the A/B Testing Lab with the 15% discount CTA!"
      ];
    }
    // Sourcing / Beans / Origins / Ethics
    else if (lower.includes("origin") || lower.includes("ethiopia") || lower.includes("guatemala") || lower.includes("organic") || lower.includes("fair trade") || lower.includes("bean") || lower.includes("supplier") || lower.includes("source")) {
      rapportChange = 5;
      qualityBadge = "Product Sourcing (+5 Rapport)";
      reply = "I'm proud to share our bean heritage! We source 100% Certified Organic Arabica directly through fair-trade micro-cooperatives:\\n\\n1. Ethiopian Yirgacheffe: High-elevation heirloom beans with delicate floral notes, bergamot, and sweet citrus.\\n2. Guatemalan Antigua: Volcanic soil grown with rich cocoa, hazelnut, and brown sugar undertones.\\n3. Mountain Mist Espresso Blend: Our signature dark roast that produces a velvety, golden crema for home espresso machines.\\n\\nWe pay our partner farmers 35% above fair-trade minimums because high-elevation specialty beans require hand-picking only the ripest cherries.";
      followUpQuestion = "Do you think we should highlight the specific countries of origin on our homepage hero, or keep the initial focus strictly on roast freshness and taste?";
      suggestedReplies = [
        "Keep the hero banner focused on freshness and the offer; let the product cards below highlight Ethiopian and Guatemalan origins.",
        "We can mention 'Single-Origin & Organic' in the H2 subheadline to build immediate quality trust.",
        "Let's make sure our product photography shows the burlap origin bags and whole bean texture."
      ];
    }
    // Google Ads / Negative Keywords / Search Intent
    else if (lower.includes("google") || lower.includes("keyword") || lower.includes("negative") || lower.includes("search") || lower.includes("ad") || lower.includes("quality score") || lower.includes("cpc") || lower.includes("auction")) {
      rapportChange = 5;
      qualityBadge = "PPC Acquisition (+5 Rapport)";
      reply = "Our Google Ads campaign has been an absolute money pit so far. We were bidding on broad match keywords like 'coffee' and 'coffee beans', and Google was charging us $2.85 a click! When I checked the search terms, we were paying for clicks from people searching 'free coffee clip art', 'coffee maker repair', and 'cheap keurig pods'. We don't even sell pods or machines!\\n\\nOur Quality Score is stuck at 4/10 because our ad text and homepage didn't match what searchers wanted.";
      followUpQuestion = "How do we stop wasting money on those non-buying searches, and how can we get Google to lower our CPC from $2.85 down to something reasonable?";
      suggestedReplies = [
        "We'll install a negative keyword shield (-free, -repair, -keurig, -cheap) immediately to block wasted clicks.",
        "We'll switch from Broad Match to Phrase and Exact Match ('fresh roasted coffee beans').",
        "By improving on-page SEO relevance and CVR, our Quality Score will rise to 8-9/10, cutting your CPC by up to 50%!"
      ];
    }
    // Answering Jenny's questions / Proposals
    else if (lower.includes("14") || lower.includes("15") || lower.includes("p < 0.05") || lower.includes("confidence") || lower.includes("shield") || lower.includes("variant") || lower.includes("split") || lower.includes("subheadline") || lower.includes("guarantee")) {
      rapportChange = 5;
      qualityBadge = "Strategic Advisor Approval (+5 Rapport)";
      reply = "That is exactly the kind of clear, disciplined thinking I was hoping for when I hired your agency! You're treating my money like your own, and that gives me huge confidence in this partnership.\\n\\nI completely agree with your approach. Let's make sure we execute this step-by-step without rushing or cutting corners.";
      followUpQuestion = "What should our immediate next tactical step be today: auditing the funnel leaks, testing the challenger headline in the A/B Lab, or setting up our negative keyword shield?";
      suggestedReplies = [
        "Let's launch the 50/50 split test in the A/B Testing Lab first to fix the homepage conversion rate.",
        "I'll verify your break-even CPA in the Unit Economics calculator so our bidding rules are locked in.",
        "Let's review the Search Term logs and add our negative keyword shield before scaling ad budget."
      ];
    }
    // Lazy or unprepared questions
    else if (question.length < 10 || lower.includes("what is coffee") || lower.includes("who are you") || lower.includes("what should i do")) {
      rapportChange = -5;
      qualityBadge = "Unprepared Inquiry (-5 Rapport)";
      reply = "I took time to write out our full operational background in the Client Dossier. As a business owner paying an agency retainer, I need you to come prepared with strategic questions about our margins, customers, or campaign tests—not asking me to do your research for you!";
      followUpQuestion = "Can you review our client dossier and tell me what you see as our biggest revenue bottleneck right now?";
      suggestedReplies = [
        "My apologies Jenny. I've reviewed your dossier: your 84% homepage bounce rate is the primary leak.",
        "Looking at your numbers, your $18.00 break-even CPA requires us to lower your $2.85 ad CPC.",
        "Let's focus on your 48-hour roast freshness rule to differentiate your beans from stale supermarket brands."
      ];
    }
    // General thoughtful response
    else {
      rapportChange = 2;
      reply = `Thanks for asking about that. From my perspective as the roastery founder, my priority is simple: I want sustainable growth with loyal coffee lovers who appreciate small-batch craft. I don't want gimmicks or fake hype that devalue our brand.\\n\\nYour perspective on "${question.substring(0, 45)}..." is interesting. As long as our numbers stay profitable and our messaging stays authentic to Morgantown, I'm excited to test it.`;
      followUpQuestion = "From your agency perspective, what do you think is the single biggest risk we should guard against as we scale this week?";
      suggestedReplies = [
        "The biggest risk is burning ad spend before confirming that our landing page converts at 2.5%+.",
        "We need to protect your margins by keeping our customer acquisition cost strictly below $16.00.",
        "We must avoid broad match keyword leaks so we only pay for people who want fresh artisan whole beans."
      ];
    }

    res.json({
      success: true,
      clientName: "Jenny Miller",
      reply,
      followUpQuestion,
      suggestedReplies,
      rapportChange,
      qualityBadge
    });
  } catch (error) {
    console.error("Error processing client inquiry:", error);
    res.status(500).json({ error: "Failed to process client inquiry" });
  }
});

export default router;

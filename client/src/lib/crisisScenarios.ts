import { CrisisOption } from "@/components/EmergencyCrisisModal";

export interface CrisisScenario {
  id: string;
  weekNumber: number;
  weekTitle: string;
  title: string;
  category: "operational" | "executive" | "pr_legal" | "technical";
  interactiveType?: "multiple_choice" | "campaign_audit" | "persona_strategy";
  callerName: string;
  callerRole: string;
  callerAvatar: string;
  callerVoice: "aura-orion-en" | "aura-asteria-en" | "aura-arcas-en" | "aura-luna-en";
  clientName: string;
  urgencyBadge: string;
  crisisAudioText: string;
  situationReportTitle: string;
  tacticalQuestion: string;
  options: CrisisOption[];
  resolutionSummary: string;
  rewardRep: number;
  hint?: string;
}

export const CRISIS_SCENARIOS: CrisisScenario[] = [
  // ==========================================
  // WEEK 1: Foundations, Local Search & SEO Architecture
  // ==========================================
  {
    id: "w1-c1-coffee-promo",
    weekNumber: 1,
    weekTitle: "Week 1: Marketing Foundations & Local SEO",
    title: "In-Store Coffee Promo Price Mismatch",
    category: "operational",
    callerName: "Sarah Jenkins",
    callerRole: "Lead Account Director",
    callerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-asteria-en",
    clientName: "Jenny's Artisan Java",
    urgencyBadge: "Client Emergency",
    crisisAudioText: "Hey, stop what you're doing for a second. Jenny just called me in a total panic! Her barista has four customers arguing at the register right now because an old test promo on the site says whole bean bags are $4 instead of $18! We need to handle this immediately before she gets slammed with one-star reviews on Google Maps. What's the best damage-control response?",
    situationReportTitle: "Immediate Situation Report:",
    tacticalQuestion: "Your Strategic Decision (Damage Control):",
    options: [
      {
        text: "Option A: Tell Jenny to stand firm, refuse the $4 price, and demand customers pay the full $18.",
        isCorrect: false,
        feedback: "❌ Rookie mistake. Telling angry in-store customers to pay full price when your website made the error creates furious 1-star Yelp and Google Maps reviews that cost thousands to fix."
      },
      {
        text: "Option B: Honor the $4 price for the 4 people currently at the counter as a one-time courtesy, offer a free sample, and fix the CMS price to $18 immediately.",
        isCorrect: true,
        feedback: "✅ Exactly right. In client management, honoring the promo for the 4 people currently in the store turns a PR disaster into word-of-mouth loyalty. The immediate CMS fix stops future loss.",
        spokenResolution: "Brilliant call. Jenny just texted me—she honored the $4 for those four customers and offered a free pour-over. They were super understanding and even promised to leave a positive review! Great job staying calm under pressure."
      },
      {
        text: "Option C: Tell the customers that the website developer made a stupid mistake and it's not Jenny's fault.",
        isCorrect: false,
        feedback: "❌ Never blame staff or interns to customers. It looks unprofessional and destroys customer trust in Jenny's brand."
      }
    ],
    resolutionSummary: "🏆 Crisis Resolved • Local Reputation Protected (+15 Rep)",
    rewardRep: 15
  },
  {
    id: "w1-c2-gbp-suspension",
    weekNumber: 1,
    weekTitle: "Week 1: Marketing Foundations & Local SEO",
    title: "Google Business Profile Suspension Scare",
    category: "executive",
    callerName: "Director Marcus Atlas",
    callerRole: "Managing Director • Krechet Media Group",
    callerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-orion-en",
    clientName: "Summit Physical Therapy",
    urgencyBadge: "Executive Red Alert",
    crisisAudioText: "Listen up! Summit Physical Therapy just got suspended on Google Business Profile an hour ago! Their clinic disappeared from Google Maps right before the Friday weekend rush. Apparently their new receptionist changed their listing address to a home office to forward mail! The founder is threatening to terminate our agency agreement by 5 PM. How do we resolve this?",
    situationReportTitle: "Urgent Listing Suspension Telemetry:",
    tacticalQuestion: "Your Executive Recovery Action:",
    options: [
      {
        text: "Option A: Submit an immediate official Google reinstatement appeal with clinic commercial lease and utility bills, post a temporary Google Maps alert, and restrict GBP edit permissions to agency managers only.",
        isCorrect: true,
        feedback: "✅ Flawless execution. Google hard suspensions require legal proof of commercial occupancy (lease, utility bill, clinic signage). Locking edit permissions prevents well-meaning client staff from ever triggering algorithmic flags again.",
        spokenResolution: "Outstanding move. We submitted the commercial lease and clinic photos directly through the Google Partner Escalation portal, and reinstated their listing in three hours. Summit's owner just retracted the termination notice. Excellent work under the gun."
      },
      {
        text: "Option B: Create a brand new Google Business Profile from scratch with a slightly different business name.",
        isCorrect: false,
        feedback: "❌ Dangerous blunder. Creating duplicate profiles while under suspension violates Google Spam policies and risks permanent blacklisting across the entire domain."
      },
      {
        text: "Option C: Wait 14 business days for Google automated review to cycle through before taking action.",
        isCorrect: false,
        feedback: "❌ Unacceptable in agency management. Every day a local business is off Google Maps costs hundreds in patient revenue."
      }
    ],
    resolutionSummary: "🏆 Listing Reinstated • Retainer Saved (+15 Rep)",
    rewardRep: 15
  },
  {
    id: "w1-c3-viral-bad-review",
    weekNumber: 1,
    weekTitle: "Week 1: Marketing Foundations & Local SEO",
    title: "The 50k-Follower TikTok Review Bomb",
    category: "pr_legal",
    callerName: "Elena Rostova",
    callerRole: "Reputation & Social Director",
    callerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-luna-en",
    clientName: "Bistro Bella",
    urgencyBadge: "PR Fire Drill",
    crisisAudioText: "We have an emergency on social channels! A local food creator with fifty thousand followers got cold soup on takeout last night, argued with the manager, and just posted a scathing TikTok that already has eighty thousand views. Dozens of commenters are brigading Bistro Bella's Yelp and Google Maps with fake one-star reviews right now! What is our response protocol?",
    situationReportTitle: "Social Media Brigading Threat:",
    tacticalQuestion: "Select PR De-escalation Protocol:",
    options: [
      {
        text: "Option A: Comment aggressively on the TikTok post proving the customer was rude and threatening a defamation lawsuit.",
        isCorrect: false,
        feedback: "❌ Catastrophic PR error. Threatening lawsuits on social media invites the 'Streisand Effect,' turning an 80k view video into a 2 million view national news story."
      },
      {
        text: "Option B: Issue a calm, respectful public response taking ownership of the temperature mistake, invite the creator back for an executive tasting, and report non-diner review brigade spikes to Google & Yelp support.",
        isCorrect: true,
        feedback: "✅ Masterclass PR. Taking high-road accountability defuses the audience's anger. Google and Yelp review filters will automatically purge coordinated brigading spikes if documented with timestamp evidence.",
        spokenResolution: "Superb strategy. The creator actually pinned our respectful reply, called off the mob, and accepted the invitation. Yelp and Google scrubbed 42 fraudulent reviews by morning. You turned a potential PR nightmare into positive brand goodwill!"
      },
      {
        text: "Option C: Delete the restaurant's social media accounts and turn off the website for 48 hours until the storm passes.",
        isCorrect: false,
        feedback: "❌ Defeatist. Going dark signals guilt and destroys normal customer bookings during high-traffic periods."
      }
    ],
    resolutionSummary: "🏆 PR Crisis Defused • Review Brigade Scrubbed (+15 Rep)",
    rewardRep: 15
  },

  // ==========================================
  // WEEK 2: Paid Search, Meta Ads & Campaign Architecture
  // ==========================================
  {
    id: "w2-c1-broad-match-bleed",
    weekNumber: 2,
    weekTitle: "Week 2: Paid Search & Ad Campaign Architecture",
    title: "Broad Match Budget Bleed",
    category: "executive",
    callerName: "Director Marcus Atlas",
    callerRole: "Managing Director • Krechet Media Group",
    callerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-orion-en",
    clientName: "Dr. Miller Dental Clinic",
    urgencyBadge: "Executive Red Alert",
    crisisAudioText: "Stop what you're doing right now! Dr. Miller just called my direct cell screaming. We launched his search campaign three hours ago, and his entire $600 weekly budget has already burned $380 with zero appointments booked! His front desk is getting flooded with calls from people asking for free government dentures and DIY tooth extraction kits! Did someone leave broad match open with zero negative keywords? We are about to lose a ten-thousand dollar retainer in the next ten minutes. What is your immediate tactical action plan?",
    situationReportTitle: "Urgent Budget Bleed Report:",
    tacticalQuestion: "Your Strategic Executive Response (Client Retention):",
    options: [
      {
        text: "Option A: Immediately pause leaking broad-match keywords, deploy an emergency negative keyword shield (-free, -cheap, -diy, -jobs, -dentures), switch to Phrase & Exact match on high-intent terms like '[emergency dentist near me]', and draft a client credit memo for the wasted spend.",
        isCorrect: true,
        feedback: "✅ Outstanding tactical decision under executive pressure. Pausing broad match stops the bleed instantly. The negative keyword shield eliminates unqualified junk searches, and shifting to exact/phrase match guarantees Dr. Miller only pays for high-intent patients. Offering a credit memo preserves the $10,000 monthly retainer.",
        spokenResolution: "Good. That's the decisive leadership I expect from my account managers. I'm telling Dr. Miller right now that we caught the leak, paused broad match, deployed negative shields, and credited the $380 spend. You just saved the retainer. Now get back in there and finish tightening those ad groups!"
      },
      {
        text: "Option B: Tell Dr. Miller that Google Ads always wastes budget in the first 7 days during the algorithmic learning phase, and ask him to increase the daily budget so the AI can optimize.",
        isCorrect: false,
        feedback: "❌ Lethal mistake. In agency management, telling a furious client to spend MORE money after burning their budget on unqualified junk clicks will get your agency fired on the spot and sued for negligence."
      },
      {
        text: "Option C: Blame Google's automated recommendations and tell Dr. Miller that paid search doesn't work for dental clinics in his market.",
        isCorrect: false,
        feedback: "❌ Never shift blame or claim a proven channel doesn't work. Dental paid search has some of the highest patient lifetime values in local marketing if configured with strict match types and location gating."
      }
    ],
    resolutionSummary: "🏆 Retainer Saved • Negative Shield Deployed (+15 Rep)",
    rewardRep: 15
  },
  {
    id: "w2-c2-policy-disapproval",
    weekNumber: 2,
    weekTitle: "Week 2: Paid Search & Ad Campaign Architecture",
    title: "Google Ads Healthcare Policy Disapproval",
    category: "operational",
    callerName: "Diana Vance",
    callerRole: "Agency Compliance Officer",
    callerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-luna-en",
    clientName: "Revive Wellness Spa",
    urgencyBadge: "Compliance Lockdown",
    crisisAudioText: "We have an ad disapproval red flag across the entire account. Google just suspended all ad creatives for Revive Wellness Spa under the Healthcare & Personalized Advertising policy. The copywriter promised 'Permanent anxiety cure in 48 hours guaranteed' in Headline 1. If we don't fix this today, the entire Google Ads account could receive a permanent suspension. What is our compliance remediation?",
    situationReportTitle: "Automated Policy Violation Flag:",
    tacticalQuestion: "Select Policy Remediation Workflow:",
    options: [
      {
        text: "Option A: Duplicate the same ads into a new ad group and keep submitting until an automated reviewer approves them by mistake.",
        isCorrect: false,
        feedback: "❌ Extreme risk. Attempting to circumvent Google automated review systems triggers a 'Circumventing Systems' account ban, which is permanent and non-appealable."
      },
      {
        text: "Option B: Strip medical cure claims, replace headlines with compliant wellness copy ('Holistic Stress Relief & Calm Coaching'), update the landing page disclaimer, and request an official manual policy review.",
        isCorrect: true,
        feedback: "✅ Exact regulatory adherence. Google prohibits medical claims of 'curing' mental health conditions. Transitioning to supportive wellness terminology and medical disclaimers achieves 100% compliance.",
        spokenResolution: "Perfect. The compliant ad copies were approved within two hours, and our account compliance health score is back in the green. Great job protecting the client's ad account."
      },
      {
        text: "Option C: Switch the entire marketing budget to unmoderated display networks.",
        isCorrect: false,
        feedback: "❌ Defeatist and ineffective. High-intent search is essential for wellness bookings; running to low-quality display networks hurts ROI."
      }
    ],
    resolutionSummary: "🏆 Ads Re-approved • Compliance Preserved (+15 Rep)",
    rewardRep: 15
  },
  {
    id: "w2-c3-black-friday-card-decline",
    weekNumber: 2,
    weekTitle: "Week 2: Paid Search & Ad Campaign Architecture",
    title: "Flash Sale Billing Decline & Account Freeze",
    category: "operational",
    callerName: "Trevor Vance",
    callerRole: "VP of Performance Marketing",
    callerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-arcas-en",
    clientName: "Lumina Audio Gear",
    urgencyBadge: "Revenue Critical",
    crisisAudioText: "Disaster alert! It's morning on Lumina's biggest 48-hour product launch. Their bank flagged the surging ad spend as fraud, their credit card declined, and Google Ads just shut down all active shopping and search campaigns right as organic traffic is peaking! We're losing five hundred dollars a minute in cart sales. What do we do right now?",
    situationReportTitle: "Billing Failure & Campaign Freeze:",
    tacticalQuestion: "Execute Emergency Billing Recovery:",
    options: [
      {
        text: "Option A: Immediately swap the payment method to the verified secondary backup card on file, submit an urgent billing retry, and call the client CFO to pre-authorize the bank's merchant fraud block.",
        isCorrect: true,
        feedback: "✅ Instant triage. Having verified backup cards in Google Ads billing settings prevents total campaign halts. Pre-authorizing the merchant with the card issuer ensures uninterrupted budget scaling.",
        spokenResolution: "Boom! The backup card processed immediately, all shopping campaigns resumed within 4 minutes, and the CFO cleared the fraud block. You just saved tens of thousands in launch revenue!"
      },
      {
        text: "Option B: Wait for the bank to send an SMS text confirmation to the client whenever their billing department opens tomorrow.",
        isCorrect: false,
        feedback: "❌ Unacceptable during a flash sale launch. Waiting 24 hours costs the client their entire promotional momentum."
      },
      {
        text: "Option C: Lower daily campaign budgets to $5 a day so the declined card doesn't get flagged again.",
        isCorrect: false,
        feedback: "❌ Counterproductive. Slashing budgets during a major product launch will destroy conversion volume and ROAS."
      }
    ],
    resolutionSummary: "🏆 Billing Restored • Launch Revenue Saved (+15 Rep)",
    rewardRep: 15
  },

  // ==========================================
  // WEEK 3: Conversion Rate Optimization, A/B Testing & Landing Pages
  // ==========================================
  {
    id: "w3-c1-broken-mobile-checkout",
    weekNumber: 3,
    weekTitle: "Week 3: CRO, Landing Pages & A/B Testing",
    title: "Broken Mobile CTA on iOS Safari",
    category: "technical",
    callerName: "Dave Kowalski",
    callerRole: "Senior Frontend Tech Lead",
    callerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-arcas-en",
    clientName: "UrbanStride Athletics",
    urgencyBadge: "Tech Emergency",
    crisisAudioText: "Yo! We have a critical front-end bug on the landing page A/B test. The new test variant has an invisible CSS z-index overlap on iOS Safari. The sticky 'Claim 20% Off' button is completely unclickable on mobile iPhones! Mobile traffic conversion rate plummeted to zero percent over the last 90 minutes. How do you want to handle the traffic split?",
    situationReportTitle: "Mobile Conversion Failure Report:",
    tacticalQuestion: "Select CRO Technical Hotfix:",
    options: [
      {
        text: "Option A: Immediately pause the broken variant in the A/B testing tool to route 100% of traffic back to the working control, patch the CSS pointer-events bug, test on physical iOS devices, and redeploy.",
        isCorrect: true,
        feedback: "✅ Flawless CRO incident response. Toggling traffic to the control variant stops the user conversion leak immediately without taking down the campaign, allowing safe testing before re-launching.",
        spokenResolution: "Spot on! I shifted traffic 100% to control, fixed the z-index stacking context, and verified on real iPhone testbeds. We're back up and running with zero downtime."
      },
      {
        text: "Option B: Leave the test running so the statistical significance calculation doesn't get messed up by pausing traffic.",
        isCorrect: false,
        feedback: "❌ Absurd error. Never let a broken variant burn client money just to satisfy test statistics. Zero conversions from broken code will skew the entire data model anyway."
      },
      {
        text: "Option C: Tell the client that iPhone users simply aren't in a buying mood today.",
        isCorrect: false,
        feedback: "❌ Never disguise a technical bug as user behavior. Telemetry and session recordings will reveal the dead clicks immediately."
      }
    ],
    resolutionSummary: "🏆 Traffic Secured • iOS CTA Hotfixed (+15 Rep)",
    rewardRep: 15
  },
  {
    id: "w3-c2-premature-ab-test-panic",
    weekNumber: 3,
    weekTitle: "Week 3: CRO, Landing Pages & A/B Testing",
    title: "CEO Demands Canceling A/B Test at Day 2",
    category: "executive",
    callerName: "Director Marcus Atlas",
    callerRole: "Managing Director • Krechet Media Group",
    callerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-orion-en",
    clientName: "FinVault SaaS",
    urgencyBadge: "Executive Escalation",
    crisisAudioText: "I've got FinVault's CEO on line 2. He is furious because he looked at our pricing page A/B test after just 36 hours. The new variant has only recorded 42 visitors and 2 signups, and his spouse told him the headline looked 'too aggressive.' He wants me to kill the test right now and keep the old page. What is our data-backed response?",
    situationReportTitle: "Underpowered Statistical Sample Report:",
    tacticalQuestion: "Strategic Executive Defense:",
    options: [
      {
        text: "Option A: Present a statistical power calculator demonstrating that 42 visits provides only 18% statistical confidence, explain that terminating tests early introduces costly false positives, and set a firm review date at 95% significance (estimated 5 days).",
        isCorrect: true,
        feedback: "✅ Elite consulting expertise. Educating executives on sample size, minimum detectable effect (MDE), and statistical confidence protects testing integrity and prevents costly HiPPO (Highest Paid Person's Opinion) decisions.",
        spokenResolution: "Masterful explanation. I walked the CEO through the sample size graph, showed him how early variance stabilizes, and he agreed to let the test run to full 95% confidence. That's how a real growth director leads."
      },
      {
        text: "Option B: Cave in immediately and turn off the test because the client is always right.",
        isCorrect: false,
        feedback: "❌ Weak consulting. Agencies that blindly obey unscientific client whims produce poor performance and get fired when revenue drops."
      },
      {
        text: "Option C: Tell the CEO that his spouse has bad design taste and shouldn't be giving marketing feedback.",
        isCorrect: false,
        feedback: "❌ Insulting a client's family or executive team destroys client relationships instantly."
      }
    ],
    resolutionSummary: "🏆 Test Defended • Statistical Integrity Protected (+15 Rep)",
    rewardRep: 15
  },
  {
    id: "w3-c3-copyright-hero-image-threat",
    weekNumber: 3,
    weekTitle: "Week 3: CRO, Landing Pages & A/B Testing",
    title: "Cease & Desist for Unlicensed Stock Asset",
    category: "pr_legal",
    callerName: "Diana Vance",
    callerRole: "Agency Legal Counsel",
    callerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-luna-en",
    clientName: "Heritage Oak Furniture",
    urgencyBadge: "Legal Alert",
    crisisAudioText: "This is urgent. A stock photo agency just sent a formal cease-and-desist and a twelve thousand dollar infringement penalty to Heritage Oak Furniture! A freelance contractor we hired grabbed an un-watermarked photo straight from Google Images for the main landing page hero. We need to mitigate legal liability immediately. What is our action plan?",
    situationReportTitle: "Copyright Infringement Demand Notice:",
    tacticalQuestion: "Execute Legal Risk Mitigation:",
    options: [
      {
        text: "Option A: Immediately replace the disputed image on the live CDN with an authenticated enterprise-licensed photo, audit all assets from that contractor, and provide counsel with proof of removal and our contractor indemnity clause.",
        isCorrect: true,
        feedback: "✅ Proper legal protocol. Immediate takedown demonstrates good faith, halts ongoing statutory damages, and invoking the contractor agreement protects the agency from direct financial liability.",
        spokenResolution: "Excellent legal response. The image was swapped within 10 minutes, our takedown timestamp was submitted to opposing counsel, and we reached a minimal nuisance settlement under contractor coverage. Crisis averted."
      },
      {
        text: "Option B: Crop the image slightly, invert the colors, and claim fair use.",
        isCorrect: false,
        feedback: "❌ Illegal and unethical. Altering copyrighted commercial artwork without a license does not qualify as fair use and demonstrates willful infringement in court."
      },
      {
        text: "Option C: Ignore the letter because copyright trolls never actually take people to federal court.",
        isCorrect: false,
        feedback: "❌ Dangerous delusion. Commercial copyright holders routinely file federal statutory infringement suits resulting in heavy default judgments."
      }
    ],
    resolutionSummary: "🏆 Asset Replaced • Legal Liability Mitigated (+15 Rep)",
    rewardRep: 15
  },

  // ==========================================
  // WEEK 4: Speed-to-Lead Automation, AI & Enterprise Growth
  // ==========================================
  {
    id: "w4-c1-make-loop-sms-spam",
    weekNumber: 4,
    weekTitle: "Week 4: Speed-to-Lead Automation & Enterprise Growth",
    title: "The Speed-to-Lead 45-SMS Webhook Loop",
    category: "technical",
    callerName: "Dave Kowalski",
    callerRole: "Automation Architect",
    callerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-arcas-en",
    clientName: "Apex Solar Solutions",
    urgencyBadge: "Automation Crisis",
    crisisAudioText: "Code red! A webhook in Make.com lost its deduplication filter after an API update! Twenty-two new solar quote inquiries just got spammed with 45 duplicate SMS messages each in the last eight minutes! Clients are furious, threatening TCPA compliance lawsuits, and Twilio is threatening to ban our carrier routing number! How do we kill the fire?",
    situationReportTitle: "Infinite Webhook Execution Alert:",
    tacticalQuestion: "Execute Emergency Automation Killswitch:",
    options: [
      {
        text: "Option A: Immediately disable the active Make.com scenario, implement an atomic Redis idempotency lock to prevent duplicate runs, send a sincere personal apology email from the VP with a $250 consultation perk, and log TCPA opt-outs.",
        isCorrect: true,
        feedback: "✅ Textbook technical and customer incident handling. Deactivating the scenario immediately kills the runaway loop. Idempotency keys prevent duplicate payloads, and an authentic executive apology de-escalates customer churn.",
        spokenResolution: "Scenario killed! Idempotency key lock deployed so no payload can fire twice, and the client's CEO loved the personalized apology email with the consultation bonus. Carrier reputation is preserved!"
      },
      {
        text: "Option B: Let the loop finish sending all messages so we don't interrupt running server processes.",
        isCorrect: false,
        feedback: "❌ Severe negligence. Allowing duplicate messages to keep sending burns Twilio credit and triggers immediate TCPA fines up to $1,500 per unauthorized text."
      },
      {
        text: "Option C: Blame Twilio for having a slow messaging queue.",
        isCorrect: false,
        feedback: "❌ False accountability. The loop occurred inside our own automation workflow logic, not the SMS delivery provider."
      }
    ],
    resolutionSummary: "🏆 Loop Terminated • Idempotency Deployed (+15 Rep)",
    rewardRep: 15
  },
  {
    id: "w4-c2-ai-chatbot-hallucination",
    weekNumber: 4,
    weekTitle: "Week 4: Speed-to-Lead Automation & Enterprise Growth",
    title: "AI Chatbot Hallucinates 80% Off VIP Code",
    category: "operational",
    callerName: "Sarah Jenkins",
    callerRole: "Lead Account Director",
    callerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-asteria-en",
    clientName: "GlowSkin Cosmetics",
    urgencyBadge: "E-Commerce Emergency",
    crisisAudioText: "You won't believe this—our new customer service AI bot just hallucinated an eighty percent discount code called 'SECRET80'! A user on Reddit found out, shared it, and right now there are 140 Shopify shopping carts attempting checkout with thousands in high-end cosmetic bundles! What is our immediate containment protocol?",
    situationReportTitle: "Generative AI Hallucination Exploit:",
    tacticalQuestion: "Execute AI Guardrail Containment:",
    options: [
      {
        text: "Option A: Immediately deactivate the promo code in Shopify admin, configure the AI prompt with strict negative constraints prohibiting coupon generation, and send cart abandoners a real 20% courtesy token with a playful note.",
        isCorrect: true,
        feedback: "✅ Brilliant e-commerce diplomacy. Disabling the code in the Shopify engine prevents financial loss immediately. Prompt negative constraints eliminate hallucinations, and converting the Reddit surge into genuine 20% discount buyers recaptures revenue.",
        spokenResolution: "Incredible save! The fake code was deactivated before orders shipped, the 20% courtesy email generated over twelve thousand dollars in real sales from the Reddit traffic, and the AI's prompt guardrails are rock solid!"
      },
      {
        text: "Option B: Honor the 80% off code for all 140 orders even if it bankrupts the client's inventory.",
        isCorrect: false,
        feedback: "❌ Financial disaster. A business is not legally obligated to honor obvious pricing errors caused by third-party bot hallucinations."
      },
      {
        text: "Option C: Delete the entire Shopify store and start over.",
        isCorrect: false,
        feedback: "❌ Absurd overreaction that destroys the business's existing sales history and customer accounts."
      }
    ],
    resolutionSummary: "🏆 AI Hallucination Contained • 20% Promo Converted (+15 Rep)",
    rewardRep: 15
  },
  {
    id: "w4-c3-enterprise-boardroom-checkride",
    weekNumber: 4,
    weekTitle: "Week 4: Speed-to-Lead Automation & Enterprise Growth",
    title: "The Hostile Boardroom Checkride",
    category: "executive",
    callerName: "Director Marcus Atlas",
    callerRole: "Managing Director • Krechet Media Group",
    callerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-orion-en",
    clientName: "Nexus Logistics (Series B)",
    urgencyBadge: "Retainer Defense",
    crisisAudioText: "I have Nexus Logistics' venture-backed CFO on speakerphone right now. She is challenging our fifteen-thousand dollar monthly retainer. She claims their organic Google rankings are doing all the heavy lifting and wants to slash our paid acquisition budget to zero next month. I need you to defend our omnichannel attribution model live on this call right now!",
    situationReportTitle: "Boardroom Retainer Challenge:",
    tacticalQuestion: "Executive Retainer Defense Presentation:",
    options: [
      {
        text: "Option A: Walk through a multi-touch attribution model demonstrating that 68% of 'organic' conversions were first-touch acquired through paid search intent, and model how cutting paid acquisition creates a 42% collapse in enterprise sales pipeline within 60 days.",
        isCorrect: true,
        feedback: "✅ Elite agency leadership. Demonstrating assisted conversions and full-funnel multi-touch attribution proves that paid search drives the top-of-funnel demand that later converts organically. The quantitative pipeline impact forecast silences executive budget cuts.",
        spokenResolution: "Phenomenal defense! The CFO was completely convinced by the assisted conversion data and the pipeline drop model. Not only did she keep the fifteen-thousand dollar retainer, she authorized an additional twenty percent ad spend expansion for next quarter! Outstanding work!"
      },
      {
        text: "Option B: Threaten to quit and tell the CFO that venture-backed startups never understand modern digital marketing.",
        isCorrect: false,
        feedback: "❌ Catastrophic unprofessionalism. Aggressive emotional outbursts get agencies fired immediately and ruin industry reputation."
      },
      {
        text: "Option C: Agree with the CFO and offer to cut the agency retainer in half to avoid getting fired.",
        isCorrect: false,
        feedback: "❌ Weak posture. Discounting your retainer without defending your value signals that your agency wasn't actually producing ROI."
      }
    ],
    resolutionSummary: "🏆 Retainer Renewed • +20% Budget Expansion Won (+25 Rep)",
    rewardRep: 25
  },
  {
    id: "w3-c4-boss-audit-interactive",
    weekNumber: 3,
    weekTitle: "Week 3: CRO, Landing Pages & A/B Testing",
    title: "Director Atlas: Campaign Efficiency Diagnostic (Hands-On)",
    category: "technical",
    interactiveType: "campaign_audit",
    callerName: "Director Marcus Atlas",
    callerRole: "Managing Director • Krechet Media Group",
    callerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-orion-en",
    clientName: "Apex Dental Clinic",
    urgencyBadge: "Boss Diagnostic Challenge",
    crisisAudioText: "I'm looking at our dental account right now and our blended cost-per-acquisition just spiked to ninety-five dollars! That is unacceptable. I am not going to spoon-feed you the answer—pull up the device telemetry and search query reports. Figure out where the budget leak is, drop bids on the bleeding segments, deploy negative shields, and submit your corrective changes back to my terminal right now!",
    situationReportTitle: "Diagnostic Telemetry Briefing:",
    tacticalQuestion: "Execute Corrective Campaign Adjustments:",
    hint: "Examine the device breakdown: Desktop CPA is $15, while Mobile CPA is $410 with 320 clicks eating $410. Reduce Mobile bids by at least 50%, switch off Broad match, and add negative shields (-free, -diy, -jobs).",
    options: [],
    resolutionSummary: "🏆 Campaign Leak Plugged • Blended CPA Reduced to $18 (+25 Rep)",
    rewardRep: 25
  },
  {
    id: "w4-c4-client-persona-interactive",
    weekNumber: 4,
    weekTitle: "Week 4: Speed-to-Lead Automation & Enterprise Growth",
    title: "Client Pitch: Executive Persona on a $400 Budget (Hands-On)",
    category: "operational",
    interactiveType: "persona_strategy",
    callerName: "Dr. Evelyn Reed",
    callerRole: "Founder & Clinical Director",
    callerAvatar: "https://images.unsplash.com/photo-1594824813511-66d7fe9e0c52?auto=format&fit=crop&q=80&w=400",
    callerVoice: "aura-asteria-en",
    clientName: "BioVanguard Executive Wellness",
    urgencyBadge: "Client Strategy Request",
    crisisAudioText: "Hey! We want to expand our practice to target high-net-worth corporate executives and partners for executive wellness memberships. But here's the catch—our testing budget is locked at only four hundred dollars a week. If we spread this thin budget across random channels, we'll get zero clients. I need you to build a tight persona hook, select the exact channels where executives actually convert, and allocate our four hundred dollars with zero waste. What's your strategic brief?",
    situationReportTitle: "Client Expansion Brief:",
    tacticalQuestion: "Design Persona Angle & Strategic Channel Budget Split:",
    hint: "High-earning executives have high intent during pain points and live on B2B platforms. Put 70% of the $400 into High-Intent Search ($250+) and 25-30% into LinkedIn ($100+). Do NOT spend on consumer video like TikTok with a thin $400 budget!",
    options: [],
    resolutionSummary: "🏆 Strategy Approved • Executive Retainer Expanded (+25 Rep)",
    rewardRep: 25
  }
];

export function getCrisesForWeek(weekNumber: number): CrisisScenario[] {
  return CRISIS_SCENARIOS.filter(c => c.weekNumber === weekNumber);
}

export function getCrisisById(id: string): CrisisScenario | undefined {
  return CRISIS_SCENARIOS.find(c => c.id === id);
}

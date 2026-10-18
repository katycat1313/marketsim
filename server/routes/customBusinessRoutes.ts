import { Express, Request, Response } from "express";
import { aiCapabilities } from "../services/aiCapabilities";

export interface CustomerPersona {
  id: string;
  name: string;
  avatarEmoji: string;
  demographics: string;
  corePainPoint: string;
  buyingTrigger: string;
  highConvertingKeywords: string[];
  adHookAngle: string;
  primaryObjection: string;
}

export interface DiscoveredChannel {
  id: string;
  channelName: string;
  category: "Local Search" | "Paid Social" | "Retention / SMS" | "B2B Outreach" | "Organic Video" | "Micro-Influencer";
  estimatedROAS: string;
  effortLevel: "Low" | "Medium" | "High";
  whyItWorks: string;
  tacticalActionSteps: string[];
}

export interface CustomFlightMission {
  id: string;
  title: string;
  track: "SEO & On-Page" | "Google Search Ads" | "Meta / Social Ads" | "Landing Page CRO";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  scenarioBrief: string;
  objectives: string[];
  initialBudget: number;
  simulationType: "seo" | "google_ads" | "meta_ads" | "capstone";
  customData: any;
}

export interface CustomBusinessProfile {
  userId: number;
  businessName: string;
  niche: string;
  websiteUrl?: string;
  location: string;
  monthlyBudget: number;
  uploadedMenu?: string;
  uploadedServices?: string;
  uploadedPhotos?: string[];
  mentorName: string;
  mentorTitle: string;
  mentorTone: "Strategic & Socratic" | "Fast-Paced ROI" | "Technical & Diagnostic" | "Supportive Coach";
  personas: CustomerPersona[];
  discoveredChannels: DiscoveredChannel[];
  customMissions: CustomFlightMission[];
  analyzedWebsiteData?: any;
  updatedAt: string;
}

// In-memory store for custom business digital twins
const customBusinessProfiles = new Map<number, CustomBusinessProfile>();

export const registerCustomBusinessRoutes = (app: Express) => {

  // 1. Get or initialize business profile
  app.get("/api/custom-business/profile", (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id || 1;
      let profile = customBusinessProfiles.get(userId);

      if (!profile) {
        profile = {
          userId,
          businessName: "My Business",
          niche: "Local Restaurant & Cafe",
          location: "Morgantown, WV",
          monthlyBudget: 500,
          mentorName: "Director Atlas",
          mentorTitle: "Senior Growth Director & Campaign Mentor",
          mentorTone: "Strategic & Socratic",
          personas: [],
          discoveredChannels: [],
          customMissions: [],
          updatedAt: new Date().toISOString()
        };
        customBusinessProfiles.set(userId, profile);
      }

      res.json(profile);
    } catch (err: any) {
      console.error("Error fetching custom business profile:", err);
      res.status(500).json({ error: "Failed to fetch custom business profile" });
    }
  });

  // 2. Save / Update business profile & AI Mentor customizations
  app.post("/api/custom-business/profile", (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id || 1;
      const existing = customBusinessProfiles.get(userId) || ({} as CustomBusinessProfile);

      const updatedProfile: CustomBusinessProfile = {
        ...existing,
        ...req.body,
        userId,
        mentorName: req.body.mentorName || existing.mentorName || "Director Atlas",
        mentorTitle: req.body.mentorTitle || existing.mentorTitle || "Senior Growth Director & Campaign Mentor",
        mentorTone: req.body.mentorTone || existing.mentorTone || "Strategic & Socratic",
        updatedAt: new Date().toISOString()
      };

      customBusinessProfiles.set(userId, updatedProfile);
      res.json(updatedProfile);
    } catch (err: any) {
      console.error("Error saving custom business profile:", err);
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  // 3. Ethical Website & UI Code Parser / Sandbox Ingestion
  app.post("/api/custom-business/analyze-website", async (req: Request, res: Response) => {
    try {
      const { url, rawText, rawHtml, businessName, niche, imageDataUrl, imageName } = req.body;

      let extractedTitle = `${businessName || 'My Business'} | Official Site`;
      let extractedDescription = `Welcome to ${businessName || 'our business'}. Discover our specialized products and services.`;
      let extractedH1: string[] = [businessName || "Welcome to Our Business"];
      let extractedH2: string[] = ["Our Menu & Services", "About Us", "Contact & Location"];
      let extractedServices: string[] = ["Core Offering", "Premium Service", "Specialty Product"];
      let extractedImages: { src: string; alt: string }[] = [];
      let detectedIssues: string[] = [];
      let sourceMode: "live_url" | "html_code" | "image_upload" | "manual" = "manual";

      let htmlToParse = "";

      if (rawHtml && rawHtml.trim().length > 0) {
        htmlToParse = rawHtml;
        sourceMode = "html_code";
      } else if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
        sourceMode = "live_url";
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 6000);

          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              "User-Agent": "KrechetAcademy-Educational-Auditor/1.0 (+https://krechet.academy/educational-bot)"
            }
          });
          clearTimeout(timeout);

          if (response.ok) {
            htmlToParse = await response.text();
          } else {
            detectedIssues.push(`Remote website returned HTTP ${response.status}. Switched to local fallback structure.`);
          }
        } catch (fetchErr) {
          console.warn("Website fetch error (using fallback parser):", fetchErr);
          detectedIssues.push("Could not reach remote URL directly (likely CORS or firewall); generated baseline semantic structure.");
        }
      }

      if (htmlToParse) {
        // Extract Title
        const titleMatch = htmlToParse.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) extractedTitle = titleMatch[1].trim();

        // Extract Meta Description
        const metaMatch = htmlToParse.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                           htmlToParse.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i) ||
                           htmlToParse.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
        if (metaMatch && metaMatch[1]) extractedDescription = metaMatch[1].trim();

        // Extract H1s
        const h1Matches = [...htmlToParse.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
        if (h1Matches.length > 0) {
          extractedH1 = h1Matches.map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
        }

        // Extract H2s
        const h2Matches = [...htmlToParse.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
        if (h2Matches.length > 0) {
          extractedH2 = h2Matches.slice(0, 8).map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
        }

        // Extract Images & Alt tags
        const imgMatches = [...htmlToParse.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi)];
        if (imgMatches.length > 0) {
          extractedImages = imgMatches.slice(0, 6).map(m => {
            const tag = m[0];
            const altMatch = tag.match(/alt=["']([^"']*)["']/i);
            return {
              src: m[1],
              alt: altMatch ? altMatch[1] : ""
            };
          });
        }

        // Extract potential service list items (li or headings)
        const listItems = [...htmlToParse.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
          .map(m => m[1].replace(/<[^>]+>/g, '').trim())
          .filter(t => t.length > 3 && t.length < 80);
        if (listItems.length >= 3) {
          extractedServices = listItems.slice(0, 8);
        } else if (extractedH2.length >= 3) {
          extractedServices = extractedH2.slice(0, 6);
        }

        // Audit issues
        if (extractedH1.length === 0) detectedIssues.push("Missing <h1> primary heading tag (Google requires a clear primary topic indicator).");
        if (extractedH1.length > 1) detectedIssues.push(`Found multiple (${extractedH1.length}) <h1> tags (violates single-topic semantic hierarchy).`);
        if (extractedTitle.length < 20 || extractedTitle.toLowerCase().includes("home")) detectedIssues.push("Generic or under-optimized <title> tag (add location and primary niche).");
        if (extractedTitle.length > 65) detectedIssues.push(`<title> tag is ${extractedTitle.length} chars (exceeds Google's 60-character SERP cutoff).`);
        if (!extractedDescription || extractedDescription.length < 50) detectedIssues.push("Meta description is missing or under 50 characters (snippet will be truncated or auto-generated).");
        if (extractedImages.some(img => !img.alt)) detectedIssues.push("One or more images are missing 'alt' text (fails accessibility and image search SEO).");
      }

      if (rawText && rawText.trim().length > 0) {
        const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length > 0) {
          extractedServices = lines.slice(0, 8);
        }
      }

      if (imageDataUrl) {
        sourceMode = "image_upload";
      }

      const analyzedData = {
        url: url || (sourceMode === "html_code" ? "Direct HTML Code Ingestion" : "https://example-business.com"),
        sourceMode,
        title: extractedTitle,
        description: extractedDescription,
        h1List: extractedH1,
        h2List: extractedH2,
        images: extractedImages,
        detectedIssues,
        services: extractedServices,
        hasLocalSchema: htmlToParse.includes("schema.org") || htmlToParse.includes("application/ld+json"),
        imageAsset: imageDataUrl || null,
        imageName: imageName || null,
        analyzedAt: new Date().toISOString()
      };

      // Save to profile
      const userId = (req.user as any)?.id || 1;
      const profile = customBusinessProfiles.get(userId) || ({} as CustomBusinessProfile);
      profile.analyzedWebsiteData = analyzedData;
      if (rawHtml) (profile as any).uploadedHtmlCode = rawHtml.substring(0, 50000);
      if (imageDataUrl) {
        profile.uploadedPhotos = [imageDataUrl, ...(profile.uploadedPhotos || []).slice(0, 4)];
      }
      if (extractedServices.length > 0 && (!profile.uploadedMenu || profile.uploadedMenu === "Handmade Fettuccine Alfredo, Wood-Fired Margherita Pizza, Truffle Risotto, Catering Platters, VIP Wine Tastings, Gluten-Free Pasta")) {
        profile.uploadedMenu = extractedServices.join(", ");
      }
      customBusinessProfiles.set(userId, profile);

      res.json(analyzedData);
    } catch (err: any) {
      console.error("Error analyzing website:", err);
      res.status(500).json({ error: "Failed to analyze website" });
    }
  });

  // 4. Socratic AI Persona Builder
  app.post("/api/custom-business/generate-personas", async (req: Request, res: Response) => {
    try {
      const { businessName, niche, location, targetNotes, menuServices, mentorName } = req.body;
      const mentor = mentorName || "Director Atlas";

      const prompt = `You are ${mentor}, an elite Senior Marketing Director and Campaign Mentor.
Generate exactly 3 hyper-targeted, highly actionable CUSTOMER PERSONAS for this specific business:
- Business: ${businessName || "Local Business"}
- Niche/Industry: ${niche || "Restaurant & Retail"}
- Location: ${location || "Local Market"}
- Menu / Services Provided: ${menuServices || "Standard offerings"}
- Target Notes from Owner: ${targetNotes || "Looking to increase repeat customers and weekday revenue"}

Return a clean JSON array with exactly 3 objects. Each object MUST have:
{
  "id": "persona-1",
  "name": "Catchy Title (e.g. The Busy Lunch Rush Executive)",
  "avatarEmoji": "💼",
  "demographics": "Age, occupation, income level, and key lifestyle traits",
  "corePainPoint": "The exact burning frustration or time/money pressure they face",
  "buyingTrigger": "What specific event or desire makes them buy TODAY",
  "highConvertingKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"],
  "adHookAngle": "A 1-sentence viral ad headline hook tailored to this persona",
  "primaryObjection": "The main reason they might hesitate to buy, and how to overcome it"
}
Output ONLY valid JSON. No markdown, no commentary.`;

      let rawResponse = "";
      try {
        rawResponse = await aiCapabilities.marketingAssistant(prompt, {
          level: "advanced",
          contextType: "persona_generation",
          businessName,
          niche
        });
      } catch (e) {
        console.warn("AI Assistant failed for personas, using procedural generation:", e);
      }

      let personas: CustomerPersona[] = [];
      try {
        const jsonMatch = rawResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          personas = JSON.parse(jsonMatch[0]);
        }
      } catch (parseErr) {
        console.warn("Persona JSON parsing fallback:", parseErr);
      }

      if (!personas || personas.length === 0) {
        // High quality fallback personas
        personas = [
          {
            id: "persona-1",
            name: `The Local Regular & Speed Seeker`,
            avatarEmoji: "⚡",
            demographics: `Ages 25-45, working professionals in ${location || 'the local area'}, income $55k-$95k`,
            corePainPoint: "Needs fast, high-quality service during busy work hours with zero hassle or long waits.",
            buyingTrigger: "Convenient online ordering, mobile pickup, or 15-minute guaranteed turnaround.",
            highConvertingKeywords: [`quick ${niche} near me`, `best ${niche} in ${location}`, `order ${niche} online`],
            adHookAngle: `Skip the line in ${location}: Fresh, fast, and ready in 10 minutes.`,
            primaryObjection: "Afraid speed means low quality. Overcome with fresh-ingredient proof."
          },
          {
            id: "persona-2",
            name: `The Weekend Experience & Event Booker`,
            avatarEmoji: "✨",
            demographics: `Ages 28-55, couples, families, and organizers looking for premium experiences.`,
            corePainPoint: "Tired of mediocre, generic local options. Wants a memorable atmosphere or top-tier service.",
            buyingTrigger: "Special occasions, Friday night outings, weekend family gatherings, or catering needs.",
            highConvertingKeywords: [`top rated ${niche} ${location}`, `family friendly ${niche}`, `catering and events ${location}`],
            adHookAngle: `Make your weekend memorable: Discover ${location}'s highest-rated ${niche}.`,
            primaryObjection: "Higher price point. Overcome with package deals and glowing social proof."
          },
          {
            id: "persona-3",
            name: `The Value & Loyalty Shopper`,
            avatarEmoji: "🎯",
            demographics: `Ages 22-60, smart shoppers looking for high value-to-cost ratio and perks.`,
            corePainPoint: "Wants premium quality without feeling overcharged.",
            buyingTrigger: "First-visit discounts, bundle offers, or VIP loyalty perks.",
            highConvertingKeywords: [`affordable ${niche} ${location}`, `${niche} deals ${location}`, `best value ${niche}`],
            adHookAngle: `Get 15% off your first visit at ${businessName || 'our shop'}. Premium quality, fair prices.`,
            primaryObjection: "Skeptical of hidden fees. Overcome with clear upfront pricing."
          }
        ];
      }

      // Save to profile
      const userId = (req.user as any)?.id || 1;
      const profile = customBusinessProfiles.get(userId) || ({} as CustomBusinessProfile);
      profile.personas = personas;
      customBusinessProfiles.set(userId, profile);

      res.json(personas);
    } catch (err: any) {
      console.error("Error generating personas:", err);
      res.status(500).json({ error: "Failed to generate personas" });
    }
  });

  // 5. Hidden Channel Discovery Matrix
  app.post("/api/custom-business/discover-channels", async (req: Request, res: Response) => {
    try {
      const { businessName, niche, location, monthlyBudget } = req.body;

      const channels: DiscoveredChannel[] = [
        {
          id: "ch-1",
          channelName: "Google Map Pack & Local Schema Siloing",
          category: "Local Search",
          estimatedROAS: "5.5x - 8.2x",
          effortLevel: "Low",
          whyItWorks: `Over 74% of local searches for '${niche}' in ${location} result in direct store visits or phone calls within 24 hours. Missing LocalBusiness schema is costing you free top-3 Map Pack rankings.`,
          tacticalActionSteps: [
            `Embed structured JSON-LD 'LocalBusiness' schema with exact GeoCoordinates for ${location}.`,
            "Optimize Google Business Profile with weekly photo updates and keyword-rich owner responses.",
            `Ensure NAP (Name, Address, Phone) citation consistency across Apple Maps, Yelp, and Bing Places.`
          ]
        },
        {
          id: "ch-2",
          channelName: "Hyper-Local Meta Reels & TikTok Behind-the-Scenes",
          category: "Organic Video",
          estimatedROAS: "4.0x - 6.5x",
          effortLevel: "Medium",
          whyItWorks: "Short vertical video showing the craft, fresh preparation, or before/after transformation builds emotional familiarity 10x faster than static photos.",
          tacticalActionSteps: [
            "Film 15-second vertical clips showing daily prep, craftsmanship, or customer reactions.",
            `Geo-tag all Reels to ${location} and use local neighborhood hashtags.`,
            "Pin your top 3 videos answering the #1 most common customer question."
          ]
        },
        {
          id: "ch-3",
          channelName: "High-Intent Negative Keyword Search Auctions",
          category: "Paid Social",
          estimatedROAS: "3.8x - 5.0x",
          effortLevel: "Medium",
          whyItWorks: `Running Google Ads with Phrase Match and a 200+ negative keyword list eliminates 35% of wasted ad spend from irrelevant clicks (like 'jobs', 'free', 'cheap').`,
          tacticalActionSteps: [
            `Target only high-intent commercial keywords (e.g., 'best ${niche} near me').`,
            "Install a negative keyword list containing employment, free, and wholesale terms.",
            "Route ad traffic directly to a dedicated mobile-friendly booking/ordering landing page."
          ]
        },
        {
          id: "ch-4",
          channelName: "VIP SMS & Repeat Customer Loyalty Club",
          category: "Retention / SMS",
          estimatedROAS: "8.0x - 12.0x",
          effortLevel: "Low",
          whyItWorks: "SMS open rates sit at 98% within 3 minutes. Turning 1-time visitors into monthly regulars costs 80% less than buying new ads on Google.",
          tacticalActionSteps: [
            "Place a table/checkout QR code offering 'Free appetizer / 10% off today when you join our VIP Club'.",
            "Send exactly 2 targeted SMS per month during slow days (e.g., Tuesday lunch specials).",
            "Automate a personalized birthday reward offer."
          ]
        }
      ];

      // Save to profile
      const userId = (req.user as any)?.id || 1;
      const profile = customBusinessProfiles.get(userId) || ({} as CustomBusinessProfile);
      profile.discoveredChannels = channels;
      customBusinessProfiles.set(userId, profile);

      res.json(channels);
    } catch (err: any) {
      console.error("Error discovering channels:", err);
      res.status(500).json({ error: "Failed to discover channels" });
    }
  });

  // 6. Custom Mission Generator
  app.post("/api/custom-business/generate-missions", (req: Request, res: Response) => {
    try {
      const { businessName, niche, location, monthlyBudget } = req.body;
      const name = businessName || "My Business";

      const missions: CustomFlightMission[] = [
        {
          id: `custom-m1-${Date.now()}`,
          title: `Mission 1: ${name} Local Intent & H1 Semantic Repair`,
          track: "SEO & On-Page",
          difficulty: "Beginner",
          scenarioBrief: `Step into the live CMS sandbox for ${name}. Rewrite the homepage title tag, establish a single semantic H1 containing your core value proposition, and configure local schema for ${location}.`,
          objectives: [
            `Replace generic title tag with primary keyword + location (${location})`,
            "Ensure exactly one <h1> tag is present on the page",
            "Add descriptive alt text to all product/menu imagery",
            "Achieve an SEO Quality Score of 85+ / 100"
          ],
          initialBudget: 0,
          simulationType: "seo",
          customData: {
            businessName: name,
            location: location || "Local Market",
            niche: niche || "Local Business"
          }
        },
        {
          id: `custom-m2-${Date.now()}`,
          title: `Mission 2: ${name} High-ROI Google Search Auction`,
          track: "Google Search Ads",
          difficulty: "Intermediate",
          scenarioBrief: `Launch a $${monthlyBudget || 500}/month Google Search Ads campaign for ${name}. Select Phrase and Exact match keywords, install a negative keyword filter, and maintain a ROAS above 3.5x.`,
          objectives: [
            `Select 4-6 high-intent phrase match keywords for ${niche}`,
            "Add at least 5 negative keywords to prevent wasted clicks",
            "Write high-CTR headlines with a clear call-to-action",
            "Achieve a Quality Score of 8/10 or higher"
          ],
          initialBudget: monthlyBudget || 500,
          simulationType: "google_ads",
          customData: {
            businessName: name,
            budget: monthlyBudget || 500,
            niche: niche || "Local Business"
          }
        },
        {
          id: `custom-m3-${Date.now()}`,
          title: `Mission 3: ${name} Omnichannel Growth Capstone`,
          track: "Landing Page CRO",
          difficulty: "Advanced",
          scenarioBrief: `Align ${name}'s search ads, social video hooks, and landing page offer into a unified high-converting funnel. Defend your strategy in front of Director Atlas.`,
          objectives: [
            "Align landing page headline with ad creative promise",
            "Configure 3-tier audience targeting (Cold, Retargeting, Lookalike)",
            "Score 80%+ on Director Atlas's oral defense rubric"
          ],
          initialBudget: (monthlyBudget || 500) * 2,
          simulationType: "capstone",
          customData: {
            businessName: name,
            niche: niche || "Local Business"
          }
        }
      ];

      // Save to profile
      const userId = (req.user as any)?.id || 1;
      const profile = customBusinessProfiles.get(userId) || ({} as CustomBusinessProfile);
      profile.customMissions = missions;
      customBusinessProfiles.set(userId, profile);

      res.json(missions);
    } catch (err: any) {
      console.error("Error generating custom missions:", err);
      res.status(500).json({ error: "Failed to generate custom missions" });
    }
  });
};

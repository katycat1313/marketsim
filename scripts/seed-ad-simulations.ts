import { db } from "../server/db";
import { adPlatformSimulations } from "../shared/schema";

/**
 * This script seeds the database with initial ad platform simulations
 */
async function seedAdSimulations() {
  console.log("Starting to seed ad platform simulations...");

  // Sample simulations for Google Ads
  const googleAdsSimulations = [
    {
      title: "Local Business Search Campaign",
      description: "Create an optimized Google Search campaign for a local restaurant trying to increase foot traffic.",
      platform: "google_ads",
      difficulty: "beginner",
      industry: "restaurants",
      objectives: ["increase_store_visits", "brand_awareness", "increase_phone_calls"],
      budget: 20.00,
      businessType: "local_business",
      scenarioDescription: "Mountain View Cafe is a local coffee shop and bakery that wants to increase weekend foot traffic. They specialize in artisanal coffees and homemade pastries. Their primary competition comes from both chain coffee shops and other local cafes in the area.",
      targetAudience: {
        demographics: {
          ageRanges: ["25-34", "35-44", "45-54"],
          genders: ["all"],
          incomeLevel: ["middle", "upper-middle"]
        },
        interests: ["coffee", "bakery", "organic food", "local dining"],
        behaviors: ["weekend brunches", "coffee enthusiasts", "foodies"],
        locations: ["Mountain View, CA", "Palo Alto, CA", "Sunnyvale, CA"]
      },
      challengePoints: [
        "Limited budget requiring efficient spend",
        "Need to focus on weekend traffic specifically",
        "Local competitive landscape"
      ],
      successCriteria: [
        {
          metric: "click_through_rate",
          target: 4.5,
          comparison: "greater"
        },
        {
          metric: "conversion_rate",
          target: 5.0,
          comparison: "greater"
        },
        {
          metric: "cost_per_action",
          target: 3.5,
          comparison: "less"
        }
      ]
    },
    {
      title: "E-commerce Product Campaign",
      description: "Build a search campaign for an online store promoting a new line of eco-friendly home products.",
      platform: "google_ads",
      difficulty: "intermediate",
      industry: "e-commerce",
      objectives: ["increase_online_sales", "increase_website_traffic", "promote_new_products"],
      budget: 35.00,
      businessType: "online_retailer",
      scenarioDescription: "GreenHome is an e-commerce store launching a new line of sustainable household products. They need to drive traffic to their product pages and convert visitors into buyers. They face competition from both specialty eco-friendly stores and mainstream retailers with similar product lines.",
      targetAudience: {
        demographics: {
          ageRanges: ["25-34", "35-44", "45-54"],
          genders: ["all"],
          incomeLevel: ["middle", "upper-middle", "high"]
        },
        interests: ["sustainability", "eco-friendly products", "home decor", "organic lifestyle"],
        behaviors: ["online shoppers", "environmentally conscious consumers"],
        locations: ["United States"]
      },
      challengePoints: [
        "New product line with no established search volume",
        "Competitive keyword landscape with high CPCs",
        "Need to balance broad awareness with targeted conversion-focused ads"
      ],
      successCriteria: [
        {
          metric: "conversion_rate",
          target: 2.5,
          comparison: "greater"
        },
        {
          metric: "return_on_ad_spend",
          target: 4.0,
          comparison: "greater"
        },
        {
          metric: "average_cpc",
          target: 1.2,
          comparison: "less"
        }
      ]
    },
    {
      title: "B2B Lead Generation Campaign",
      description: "Develop a sophisticated Google Ads campaign for a B2B software company seeking qualified leads.",
      platform: "google_ads",
      difficulty: "advanced",
      industry: "software",
      objectives: ["lead_generation", "demo_requests", "increase_brand_consideration"],
      budget: 50.00,
      businessType: "b2b_saas",
      scenarioDescription: "CloudSolutions offers enterprise project management software for mid-sized businesses. Their goal is to generate high-quality leads for their sales team through demo requests and whitepaper downloads. They operate in a crowded market with several established competitors.",
      targetAudience: {
        demographics: {
          ageRanges: ["35-44", "45-54", "55-64"],
          genders: ["all"],
          incomeLevel: ["high"]
        },
        interests: ["business software", "project management", "enterprise solutions", "business efficiency"],
        behaviors: ["business decision makers", "IT professionals", "management"],
        locations: ["United States", "Canada", "United Kingdom", "Australia"]
      },
      challengePoints: [
        "Long sales cycle requiring nurturing of leads",
        "Highly competitive keyword landscape",
        "Targeting specific decision-makers within organizations",
        "Need for high-converting landing pages with clear value propositions"
      ],
      successCriteria: [
        {
          metric: "lead_quality_score",
          target: 8.0,
          comparison: "greater"
        },
        {
          metric: "cost_per_lead",
          target: 85.0,
          comparison: "less"
        },
        {
          metric: "conversion_rate",
          target: 3.5,
          comparison: "greater"
        }
      ]
    }
  ];

  // Sample simulations for Meta Ads
  const metaAdsSimulations = [
    {
      title: "Fashion Brand Awareness Campaign",
      description: "Create a Meta Ads campaign to build awareness for a new fashion brand targeting young adults.",
      platform: "meta_ads",
      difficulty: "beginner",
      industry: "fashion",
      objectives: ["brand_awareness", "increase_social_engagement", "drive_website_traffic"],
      budget: 25.00,
      businessType: "fashion_retail",
      scenarioDescription: "UrbanThread is a new fashion brand focusing on sustainable, trendy clothing for young adults. They need to establish brand awareness and drive traffic to both their Instagram profile and website. They're entering a crowded market but have a unique value proposition around sustainability.",
      targetAudience: {
        demographics: {
          ageRanges: ["18-24", "25-34"],
          genders: ["all"],
          incomeLevel: ["middle", "upper-middle"]
        },
        interests: ["fashion", "sustainable living", "trendy clothing", "ethical fashion"],
        behaviors: ["fashion enthusiasts", "instagram users", "online shoppers"],
        locations: ["United States", "Canada", "United Kingdom", "Australia"]
      },
      challengePoints: [
        "New brand with no established audience",
        "Limited budget requiring efficient targeting",
        "Need for engaging creative that stands out",
        "Balancing brand awareness with traffic/engagement goals"
      ],
      successCriteria: [
        {
          metric: "reach",
          target: 100000,
          comparison: "greater"
        },
        {
          metric: "engagement_rate",
          target: 3.5,
          comparison: "greater"
        },
        {
          metric: "cost_per_thousand_impressions",
          target: 8.0,
          comparison: "less"
        }
      ]
    },
    {
      title: "Event Promotion Campaign",
      description: "Develop a Meta Ads campaign to drive registrations for a virtual fitness event.",
      platform: "meta_ads",
      difficulty: "intermediate",
      industry: "fitness",
      objectives: ["event_responses", "lead_generation", "conversions"],
      budget: 30.00,
      businessType: "events",
      scenarioDescription: "FitLife Summit is an annual virtual fitness conference featuring workshops, celebrity trainers, and networking opportunities. This year's goal is to increase registrations by 20% over last year through effective Meta advertising across Facebook and Instagram. The event has a moderate following but wants to expand its reach.",
      targetAudience: {
        demographics: {
          ageRanges: ["25-34", "35-44", "45-54"],
          genders: ["all"],
          incomeLevel: ["middle", "upper-middle"]
        },
        interests: ["fitness", "health and wellness", "personal development", "online events"],
        behaviors: ["fitness enthusiasts", "active lifestyles", "previous event attendees"],
        locations: ["Global"]
      },
      challengePoints: [
        "Time-sensitive campaign with specific event date",
        "Need to target both returning attendees and new audience",
        "Competitive events space",
        "Registration conversion tracking setup"
      ],
      successCriteria: [
        {
          metric: "registration_conversion_rate",
          target: 4.0,
          comparison: "greater"
        },
        {
          metric: "cost_per_registration",
          target: 12.0,
          comparison: "less"
        },
        {
          metric: "return_on_ad_spend",
          target: 3.5,
          comparison: "greater"
        }
      ]
    },
    {
      title: "App Install Campaign",
      description: "Create a sophisticated Meta Ads campaign to drive mobile app installations with strong retention.",
      platform: "meta_ads",
      difficulty: "advanced",
      industry: "mobile_apps",
      objectives: ["app_installs", "mobile_app_engagement", "increase_subscriptions"],
      budget: 45.00,
      businessType: "mobile_app",
      scenarioDescription: "MindfulMoment is a meditation and mindfulness app looking to increase its user base while maintaining high user quality. Beyond installations, the app seeks users who will engage regularly and eventually convert to paid subscribers. The meditation app space is competitive but growing rapidly.",
      targetAudience: {
        demographics: {
          ageRanges: ["18-24", "25-34", "35-44", "45-54"],
          genders: ["all"],
          incomeLevel: ["middle", "upper-middle", "high"]
        },
        interests: ["meditation", "mindfulness", "wellness", "stress reduction", "self-improvement"],
        behaviors: ["app users", "health conscious", "premium subscription users"],
        locations: ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan"]
      },
      challengePoints: [
        "High competition in meditation app category",
        "Need to optimize for quality users not just installations",
        "App store conversion tracking",
        "Platform-specific considerations (iOS vs Android)",
        "Post-install event optimization"
      ],
      successCriteria: [
        {
          metric: "cost_per_install",
          target: 2.5,
          comparison: "less"
        },
        {
          metric: "day_7_retention_rate",
          target: 30.0,
          comparison: "greater"
        },
        {
          metric: "subscription_conversion_rate",
          target: 5.0,
          comparison: "greater"
        }
      ]
    }
  ];

  // Sample simulations for LinkedIn Ads
  const linkedinAdsSimulations = [
    {
      title: "B2B Lead Generation Campaign",
      description: "Create a LinkedIn Ads campaign for a consulting firm targeting finance executives.",
      platform: "linkedin_ads",
      difficulty: "beginner",
      industry: "consulting",
      objectives: ["lead_generation", "website_traffic", "brand_awareness"],
      budget: 40.00,
      businessType: "professional_services",
      scenarioDescription: "FinStrategy Consulting offers specialized financial advisory services to medium and large businesses. They want to generate leads among financial executives and decision-makers through downloadable whitepapers and webinar registrations. Their services are high-value but require sophistication in targeting the right prospects.",
      targetAudience: {
        demographics: {
          ageRanges: ["35-44", "45-54", "55-64"],
          genders: ["all"],
          incomeLevel: ["high"]
        },
        interests: ["financial management", "corporate strategy", "business optimization"],
        behaviors: ["business decision makers", "executive leadership", "finance professionals"],
        locations: ["United States", "United Kingdom", "Canada", "Australia", "Singapore", "Hong Kong"]
      },
      challengePoints: [
        "Niche professional audience requiring precise targeting",
        "High-value leads requiring quality over quantity",
        "Content offer alignment with target audience needs",
        "Balancing lead volume with lead quality"
      ],
      successCriteria: [
        {
          metric: "lead_quality_score",
          target: 7.5,
          comparison: "greater"
        },
        {
          metric: "cost_per_lead",
          target: 75.0,
          comparison: "less"
        },
        {
          metric: "conversion_rate",
          target: 3.0,
          comparison: "greater"
        }
      ]
    },
    {
      title: "HR SaaS Product Promotion",
      description: "Develop a comprehensive LinkedIn Ads campaign for an HR software platform targeting HR professionals.",
      platform: "linkedin_ads",
      difficulty: "intermediate",
      industry: "hr_technology",
      objectives: ["demo_requests", "content_downloads", "increase_brand_consideration"],
      budget: 50.00,
      businessType: "b2b_saas",
      scenarioDescription: "TalentPulse offers an AI-powered HR management platform designed to streamline recruitment, onboarding, and employee engagement. They want to reach HR managers and directors in mid-sized to large companies across multiple industries. Their goal is to drive demo requests and grow their prospect database.",
      targetAudience: {
        demographics: {
          ageRanges: ["30-39", "40-49", "50-59"],
          genders: ["all"],
          incomeLevel: ["upper-middle", "high"]
        },
        interests: ["human resources", "talent management", "HR technology", "employee experience"],
        behaviors: ["HR decision makers", "talent acquisition professionals"],
        locations: ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Netherlands", "Sweden"]
      },
      challengePoints: [
        "Targeting HR professionals across multiple industries",
        "Differentiating from numerous competitors in the HR tech space",
        "Creating compelling offers for different stages of the buyer journey",
        "Optimizing for qualified demo requests within budget constraints"
      ],
      successCriteria: [
        {
          metric: "demo_request_conversion_rate",
          target: 2.5,
          comparison: "greater"
        },
        {
          metric: "cost_per_demo_request",
          target: 120.0,
          comparison: "less"
        },
        {
          metric: "content_engagement_rate",
          target: 4.5,
          comparison: "greater"
        }
      ]
    },
    {
      title: "Executive Recruitment Campaign",
      description: "Create an advanced LinkedIn Ads campaign for an executive recruitment firm targeting C-suite candidates.",
      platform: "linkedin_ads",
      difficulty: "advanced",
      industry: "recruitment",
      objectives: ["candidate_applications", "brand_awareness", "talent_pool_development"],
      budget: 60.00,
      businessType: "recruitment_services",
      scenarioDescription: "ExecSearch Partners is a boutique executive search firm specializing in placing C-suite and VP-level executives in technology companies. They need to build awareness among qualified executives and develop their talent pool for current and future searches. The campaign needs to be highly targeted and present the firm as a premier career partner.",
      targetAudience: {
        demographics: {
          ageRanges: ["40-49", "50-59", "60+"],
          genders: ["all"],
          incomeLevel: ["high"]
        },
        interests: ["executive leadership", "career development", "technology industry", "professional networking"],
        behaviors: ["senior executives", "department leaders", "company changers"],
        locations: ["United States", "United Kingdom", "Canada", "Germany", "France", "Switzerland", "Singapore", "Australia"]
      },
      challengePoints: [
        "Ultra-targeted campaign focusing on seniority and experience",
        "Privacy and discretion considerations for executive audience",
        "Sophisticated messaging that resonates with accomplished professionals",
        "Leveraging LinkedIn's advanced targeting options",
        "Multiple job positions with different targeting requirements"
      ],
      successCriteria: [
        {
          metric: "qualified_applicant_rate",
          target: 15.0,
          comparison: "greater"
        },
        {
          metric: "cost_per_qualified_application",
          target: 200.0,
          comparison: "less"
        },
        {
          metric: "talent_pool_growth_rate",
          target: 10.0,
          comparison: "greater"
        }
      ]
    }
  ];

  // Combine all simulations
  const allSimulations = [...googleAdsSimulations, ...metaAdsSimulations, ...linkedinAdsSimulations];

  // Check if simulations already exist in the database
  const existingSimulations = await db.select().from(adPlatformSimulations);
  
  if (existingSimulations.length > 0) {
    console.log(`Found ${existingSimulations.length} existing simulations. Skipping seed.`);
    return;
  }

  // Insert all simulations
  await db.insert(adPlatformSimulations).values(allSimulations);
  
  console.log(`Successfully seeded ${allSimulations.length} ad platform simulations!`);
}

// Run the seed function
seedAdSimulations()
  .then(() => {
    console.log("Ad simulation seeding completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding ad simulations:", error);
    process.exit(1);
  });
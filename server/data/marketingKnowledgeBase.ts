/**
 * Marketing Knowledge Base
 * 
 * This file contains a structured knowledge base for the AI assistant.
 * It includes marketing concepts, best practices, strategies, and tactics
 * across various digital marketing channels and scenarios.
 */

export const marketingKnowledgeBase = {
  channels: {
    searchAds: {
      fundamentals: [
        {
          topic: "Campaign Structure",
          content: "Organize Google Ads campaigns into logical structures with campaigns, ad groups, and ads. Follow a hierarchy that aligns with business goals and audience segments.",
          bestPractices: [
            "Use 1-7 ad groups per campaign focused on distinct themes",
            "Keep keywords tightly themed within ad groups (10-20 max)",
            "Create at least 3 ads per ad group for testing purposes",
            "Use meaningful campaign and ad group naming conventions"
          ],
          effectiveness: 95
        },
        {
          topic: "Keyword Strategy",
          content: "Develop comprehensive keyword strategies using a mix of match types and negative keywords to control when ads appear.",
          bestPractices: [
            "Use a mix of match types - exact, phrase, and broad modified",
            "Include 2-3 long-tail variations for each main keyword",
            "Add negative keywords at both campaign and ad group level",
            "Focus on commercial intent keywords for conversion-focused campaigns"
          ],
          effectiveness: 90
        },
        {
          topic: "Quality Score Optimization",
          content: "Improve Quality Score by enhancing relevance between keywords, ads, and landing pages.",
          bestPractices: [
            "Create highly relevant ad copy that includes the target keyword",
            "Ensure landing pages directly address the search intent",
            "Improve page load speed and mobile responsiveness",
            "Structure ad groups around single keyword themes"
          ],
          effectiveness: 85
        }
      ],
      advanced: [
        {
          topic: "Bidding Strategies",
          content: "Use appropriate automated bidding strategies based on campaign goals.",
          bestPractices: [
            "Use Maximize Conversions for lead generation when starting out",
            "Switch to Target CPA once you have 15+ conversions per month",
            "Use Target ROAS for ecommerce after accumulating significant conversion data",
            "Implement portfolio bidding strategies for related campaigns"
          ],
          effectiveness: 88
        },
        {
          topic: "Ad Extensions",
          content: "Implement all relevant ad extensions to improve CTR and ad performance.",
          bestPractices: [
            "Add sitelink extensions with unique content for each",
            "Use callout extensions to highlight unique selling points",
            "Implement structured snippets to showcase product/service categories",
            "Use call extensions for mobile users when appropriate"
          ],
          effectiveness: 82
        }
      ]
    },
    socialAds: {
      fundamentals: [
        {
          topic: "Audience Targeting",
          content: "Create precisely defined audiences based on demographics, interests, behaviors, and customer data.",
          bestPractices: [
            "Use lookalike audiences based on high-value customers",
            "Create custom audiences from website visitors and customer lists",
            "Segment audiences by purchase intent and funnel stage",
            "Test interest-based audiences against behavioral targeting"
          ],
          effectiveness: 92
        },
        {
          topic: "Creative Best Practices",
          content: "Develop scroll-stopping creative assets that align with platform-specific best practices.",
          bestPractices: [
            "Use high-quality visuals with minimal text",
            "Keep videos under 15 seconds for best completion rates",
            "Test multiple creative variations (3-5 per ad set)",
            "Ensure mobile-first design for all creative assets"
          ],
          effectiveness: 90
        }
      ],
      advanced: [
        {
          topic: "Campaign Objective Selection",
          content: "Choose the most appropriate campaign objective based on marketing goals.",
          bestPractices: [
            "Use conversion objectives for direct response campaigns",
            "Select traffic objectives for content promotion",
            "Use reach objectives for brand awareness campaigns",
            "Align objectives with the appropriate funnel stage"
          ],
          effectiveness: 85
        },
        {
          topic: "Platform-Specific Optimization",
          content: "Tailor strategies to specific social platforms based on their unique algorithms and user behaviors.",
          platforms: {
            facebook: [
              "Optimize for mobile-first experiences",
              "Use collection ads for e-commerce products",
              "Implement Conversions API alongside pixel for better tracking"
            ],
            instagram: [
              "Focus on high-quality visual content",
              "Use Story ads for full-screen immersive experiences",
              "Leverage product tags for shoppable posts"
            ],
            linkedin: [
              "Use longer copy for B2B messaging",
              "Focus on professional positioning and credibility",
              "Target by job titles, seniority, and company size"
            ],
            twitter: [
              "Keep messages concise and actionable",
              "Use Twitter's event targeting for timely campaigns",
              "Implement website cards for better CTR"
            ]
          },
          effectiveness: 88
        }
      ]
    },
    seo: {
      fundamentals: [
        {
          topic: "On-Page Optimization",
          content: "Optimize individual pages to improve search engine rankings and user experience.",
          bestPractices: [
            "Include target keywords in title tags, H1, and first paragraph",
            "Write compelling meta descriptions that encourage clicks",
            "Optimize images with descriptive filenames and alt text",
            "Structure content with proper heading hierarchy (H1-H6)",
            "Ensure content comprehensively covers the topic (1500+ words for pillar content)"
          ],
          effectiveness: 90
        },
        {
          topic: "Technical SEO",
          content: "Address technical aspects that affect crawling, indexing, and ranking performance.",
          bestPractices: [
            "Improve page speed (aim for <3s loading time)",
            "Ensure mobile responsiveness across all devices",
            "Implement schema markup for rich results",
            "Create and submit XML sitemaps",
            "Use canonical tags to prevent duplicate content issues"
          ],
          effectiveness: 85
        },
        {
          topic: "Content Strategy",
          content: "Develop a comprehensive content strategy aligned with search intent and business goals.",
          bestPractices: [
            "Conduct keyword research to identify content opportunities",
            "Create a content calendar based on seasonal trends",
            "Develop pillar content and supporting cluster content",
            "Update high-performing content regularly",
            "Focus on E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)"
          ],
          effectiveness: 92
        }
      ],
      advanced: [
        {
          topic: "Link Building",
          content: "Acquire high-quality backlinks to improve domain authority and rankings.",
          bestPractices: [
            "Create linkable assets (research, studies, tools)",
            "Conduct outreach to relevant industry websites",
            "Build relationships with publishers and influencers",
            "Guest post on authoritative industry sites",
            "Monitor and disavow toxic backlinks"
          ],
          effectiveness: 88
        },
        {
          topic: "Local SEO",
          content: "Optimize for local search visibility for businesses with physical locations.",
          bestPractices: [
            "Create and optimize Google Business Profile",
            "Build citations across local directories",
            "Generate positive reviews from customers",
            "Create location-specific content",
            "Implement local schema markup"
          ],
          effectiveness: 84
        }
      ]
    },
    email: {
      fundamentals: [
        {
          topic: "List Building",
          content: "Grow a quality email list through ethical and effective methods.",
          bestPractices: [
            "Use valuable lead magnets relevant to your audience",
            "Implement exit-intent popups with clear value propositions",
            "Create dedicated landing pages for list building",
            "Use double opt-in to ensure list quality",
            "Clearly communicate what subscribers will receive"
          ],
          effectiveness: 88
        },
        {
          topic: "Email Design",
          content: "Create effective email designs that drive engagement and conversions.",
          bestPractices: [
            "Use responsive email templates that work across devices",
            "Keep designs simple with clear visual hierarchy",
            "Use a single, prominent call-to-action",
            "Maintain brand consistency across campaigns",
            "Optimize for dark mode email clients"
          ],
          effectiveness: 82
        },
        {
          topic: "Copywriting for Email",
          content: "Write compelling email copy that drives opens, clicks, and conversions.",
          bestPractices: [
            "Craft subject lines under 50 characters with urgency or curiosity",
            "Personalize beyond first name (behavior, preferences)",
            "Write in a conversational, direct tone",
            "Focus on benefits rather than features",
            "Include clear, action-oriented CTAs"
          ],
          effectiveness: 90
        }
      ],
      advanced: [
        {
          topic: "Segmentation",
          content: "Divide email list into targeted segments for more relevant messaging.",
          bestPractices: [
            "Segment by engagement level (active vs. inactive)",
            "Create segments based on purchase history",
            "Segment by position in the customer journey",
            "Use behavioral triggers for targeted campaigns",
            "Implement RFM (Recency, Frequency, Monetary) segmentation"
          ],
          effectiveness: 95
        },
        {
          topic: "Automation",
          content: "Create automated email sequences that deliver the right message at the right time.",
          bestPractices: [
            "Implement welcome sequences for new subscribers",
            "Create abandoned cart recovery emails",
            "Develop post-purchase sequences for cross-selling",
            "Set up re-engagement campaigns for inactive subscribers",
            "Use behavioral triggers for timely, relevant messaging"
          ],
          effectiveness: 93
        },
        {
          topic: "Deliverability",
          content: "Ensure emails reach subscribers' inboxes rather than spam folders.",
          bestPractices: [
            "Maintain list hygiene by removing inactive subscribers",
            "Use double opt-in for new subscribers",
            "Set up proper authentication (SPF, DKIM, DMARC)",
            "Monitor engagement metrics and adjust sending practices",
            "Maintain a consistent sending schedule"
          ],
          effectiveness: 86
        }
      ]
    },
    contentMarketing: {
      fundamentals: [
        {
          topic: "Content Strategy",
          content: "Develop a comprehensive content strategy aligned with business objectives.",
          bestPractices: [
            "Define clear goals for each content piece",
            "Create buyer personas to guide content creation",
            "Map content to different stages of the buyer's journey",
            "Conduct keyword research to identify content opportunities",
            "Develop an editorial calendar for consistent publishing"
          ],
          effectiveness: 92
        },
        {
          topic: "Content Creation",
          content: "Create high-quality, valuable content that resonates with target audiences.",
          bestPractices: [
            "Focus on solving specific audience problems",
            "Use data and research to back up claims",
            "Include visual elements to enhance engagement",
            "Ensure content is comprehensive and actionable",
            "Maintain a consistent brand voice across all content"
          ],
          effectiveness: 88
        },
        {
          topic: "Content Distribution",
          content: "Effectively distribute content across appropriate channels to maximize reach.",
          bestPractices: [
            "Tailor content format for each platform",
            "Repurpose content across multiple formats",
            "Use email marketing to distribute to subscribers",
            "Leverage social media for content promotion",
            "Implement a paid distribution strategy for key content"
          ],
          effectiveness: 85
        }
      ],
      advanced: [
        {
          topic: "Content Performance Measurement",
          content: "Measure and analyze content performance to optimize strategy.",
          bestPractices: [
            "Define KPIs aligned with content objectives",
            "Track engagement metrics (time on page, scroll depth)",
            "Measure conversion metrics from content",
            "Analyze traffic sources and user behavior",
            "Use attribution modeling to understand content impact"
          ],
          effectiveness: 83
        },
        {
          topic: "Interactive Content",
          content: "Create interactive content experiences that drive engagement and lead generation.",
          bestPractices: [
            "Develop quizzes related to customer pain points",
            "Create calculators that demonstrate value proposition",
            "Use interactive infographics for complex data",
            "Implement virtual tools and configurators",
            "Develop assessment tools for lead qualification"
          ],
          effectiveness: 86
        }
      ]
    }
  },
  analytics: {
    fundamentals: [
      {
        topic: "Tracking Setup",
        content: "Implement proper tracking to measure marketing performance.",
        bestPractices: [
          "Set up Google Analytics with proper configuration",
          "Implement conversion tracking across all channels",
          "Set up event tracking for key user interactions",
          "Use UTM parameters for campaign tracking",
          "Implement cross-domain tracking when necessary"
        ],
        effectiveness: 90
      },
      {
        topic: "Reporting Fundamentals",
        content: "Create effective reports that provide actionable insights.",
        bestPractices: [
          "Define key metrics aligned with business objectives",
          "Create automated dashboards for regular monitoring",
          "Segment data for more meaningful analysis",
          "Include trend data for context",
          "Focus on insights rather than just data"
        ],
        effectiveness: 85
      }
    ],
    advanced: [
      {
        topic: "Attribution Modeling",
        content: "Understand the impact of different marketing touchpoints on conversions.",
        bestPractices: [
          "Move beyond last-click attribution",
          "Test different attribution models (position-based, data-driven)",
          "Use multi-touch attribution for complex customer journeys",
          "Implement cross-device tracking",
          "Combine online and offline data when possible"
        ],
        effectiveness: 88
      },
      {
        topic: "Predictive Analytics",
        content: "Use historical data to predict future marketing performance.",
        bestPractices: [
          "Identify key performance indicators with predictive value",
          "Use cohort analysis to understand customer lifecycle",
          "Implement forecasting models for budget planning",
          "Use machine learning for audience propensity modeling",
          "Test and validate predictive models regularly"
        ],
        effectiveness: 86
      }
    ]
  },
  testing: {
    abTesting: {
      fundamentals: [
        {
          topic: "Test Design",
          content: "Design effective A/B tests that provide actionable insights.",
          bestPractices: [
            "Define clear, specific hypotheses",
            "Test one variable at a time for clear results",
            "Ensure adequate sample size for statistical significance",
            "Set appropriate test duration based on traffic volume",
            "Document test plans and expected outcomes"
          ],
          effectiveness: 92
        },
        {
          topic: "Test Implementation",
          content: "Implement A/B tests properly to ensure valid results.",
          bestPractices: [
            "Use dedicated testing tools (Google Optimize, VWO, etc.)",
            "Ensure proper tracking of test variations",
            "Implement proper randomization of traffic",
            "Avoid making other changes during test period",
            "Check for technical issues before launching"
          ],
          effectiveness: 88
        },
        {
          topic: "Results Analysis",
          content: "Analyze test results accurately to derive actionable insights.",
          bestPractices: [
            "Wait for statistical significance before concluding",
            "Consider practical significance alongside statistical significance",
            "Segment results by key audiences",
            "Document learnings for future tests",
            "Implement winning variations promptly"
          ],
          effectiveness: 85
        }
      ],
      advanced: [
        {
          topic: "Multivariate Testing",
          content: "Test multiple variables simultaneously to understand interaction effects.",
          bestPractices: [
            "Use for high-traffic pages only",
            "Limit the number of variables to maintain statistical power",
            "Clearly define interactions of interest",
            "Allow sufficient time for test completion",
            "Use factorial design for efficiency"
          ],
          effectiveness: 82
        },
        {
          topic: "Sequential Testing",
          content: "Implement a series of tests to iteratively improve performance.",
          bestPractices: [
            "Create a testing roadmap based on potential impact",
            "Build on learnings from previous tests",
            "Test major changes before fine-tuning",
            "Maintain control groups across test iterations",
            "Document cumulative impact of sequential tests"
          ],
          effectiveness: 88
        }
      ]
    },
    conversionOptimization: {
      fundamentals: [
        {
          topic: "Conversion Funnel Analysis",
          content: "Analyze the conversion funnel to identify optimization opportunities.",
          bestPractices: [
            "Map the entire customer journey from first touch to conversion",
            "Identify key drop-off points in the funnel",
            "Use qualitative research to understand friction points",
            "Segment funnel performance by traffic source and user type",
            "Prioritize optimization efforts based on potential impact"
          ],
          effectiveness: 90
        },
        {
          topic: "Landing Page Optimization",
          content: "Optimize landing pages to improve conversion rates.",
          bestPractices: [
            "Ensure clear, compelling value propositions",
            "Remove unnecessary form fields to reduce friction",
            "Use social proof to build trust (testimonials, reviews)",
            "Implement clear, action-oriented CTAs",
            "Optimize page load speed for better user experience"
          ],
          effectiveness: 88
        }
      ],
      advanced: [
        {
          topic: "Behavioral Analysis",
          content: "Analyze user behavior to identify optimization opportunities.",
          bestPractices: [
            "Use heatmaps to understand user interaction patterns",
            "Implement session recordings for qualitative insights",
            "Conduct user testing to identify usability issues",
            "Use on-site surveys for direct feedback",
            "Analyze form abandonment patterns"
          ],
          effectiveness: 85
        },
        {
          topic: "Personalization",
          content: "Implement personalized experiences to improve conversion rates.",
          bestPractices: [
            "Segment users based on behavior and attributes",
            "Personalize content based on traffic source",
            "Implement dynamic CTAs based on user stage",
            "Use geo-targeting for location-specific offers",
            "Test personalization impact through controlled experiments"
          ],
          effectiveness: 92
        }
      ]
    }
  },
  strategyDevelopment: {
    marketingPlanning: {
      fundamentals: [
        {
          topic: "Goal Setting",
          content: "Set clear, measurable marketing goals aligned with business objectives.",
          bestPractices: [
            "Use SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)",
            "Align marketing goals with overall business objectives",
            "Set both short-term and long-term goals",
            "Define KPIs for each goal",
            "Establish regular review processes for goal tracking"
          ],
          effectiveness: 95
        },
        {
          topic: "Audience Analysis",
          content: "Develop deep understanding of target audiences to inform marketing strategy.",
          bestPractices: [
            "Create detailed buyer personas based on research",
            "Map customer journeys for each persona",
            "Identify pain points and motivations for each audience segment",
            "Understand how audiences consume media and make decisions",
            "Use data to validate audience assumptions"
          ],
          effectiveness: 92
        },
        {
          topic: "Competitive Analysis",
          content: "Analyze competitors to identify opportunities and inform strategy.",
          bestPractices: [
            "Identify direct and indirect competitors",
            "Analyze competitor positioning and messaging",
            "Evaluate competitor channel strategies",
            "Identify gaps and opportunities in the market",
            "Monitor competitor activities regularly"
          ],
          effectiveness: 88
        }
      ],
      advanced: [
        {
          topic: "Channel Strategy",
          content: "Develop an integrated channel strategy to reach target audiences effectively.",
          bestPractices: [
            "Select channels based on audience behavior and objectives",
            "Allocate budget based on channel performance and goals",
            "Define the role of each channel in the customer journey",
            "Implement cross-channel measurement and attribution",
            "Regularly review and optimize channel mix"
          ],
          effectiveness: 90
        },
        {
          topic: "Budget Allocation",
          content: "Optimize marketing budget allocation for maximum ROI.",
          bestPractices: [
            "Use data-driven approaches for budget allocation",
            "Implement portfolio approach to balance risk and reward",
            "Consider customer lifetime value in budget decisions",
            "Allocate testing budget for new opportunities",
            "Implement agile budget management for quick adjustments"
          ],
          effectiveness: 85
        }
      ]
    },
    brandStrategy: {
      fundamentals: [
        {
          topic: "Brand Positioning",
          content: "Develop clear brand positioning that differentiates from competitors.",
          bestPractices: [
            "Define unique value proposition and positioning statement",
            "Identify brand attributes and personality",
            "Ensure positioning is relevant to target audiences",
            "Validate positioning through customer research",
            "Maintain consistency across all touchpoints"
          ],
          effectiveness: 92
        },
        {
          topic: "Messaging Framework",
          content: "Create a comprehensive messaging framework to guide all communications.",
          bestPractices: [
            "Develop core brand messages and proof points",
            "Create audience-specific messaging for each segment",
            "Define tone and voice guidelines",
            "Create message hierarchies for different contexts",
            "Test messaging effectiveness with target audiences"
          ],
          effectiveness: 88
        }
      ],
      advanced: [
        {
          topic: "Brand Experience",
          content: "Design consistent brand experiences across all customer touchpoints.",
          bestPractices: [
            "Map all customer touchpoints and interactions",
            "Define brand experience principles",
            "Create guidelines for consistent experience delivery",
            "Implement brand training for all customer-facing staff",
            "Regularly audit brand experience for consistency"
          ],
          effectiveness: 85
        },
        {
          topic: "Brand Architecture",
          content: "Develop logical brand architecture for companies with multiple products or services.",
          bestPractices: [
            "Choose appropriate architecture type (branded house, house of brands, etc.)",
            "Clearly define relationships between brands",
            "Create visual system that reinforces architecture",
            "Develop naming conventions aligned with architecture",
            "Ensure architecture supports business strategy"
          ],
          effectiveness: 82
        }
      ]
    }
  },
  troubleshooting: {
    campaignIssues: [
      {
        problem: "Low Click-Through Rate (CTR)",
        possibleCauses: [
          "Poor ad relevance to target keywords",
          "Weak or unclear value proposition",
          "Unappealing ad creative",
          "Targeting too broad or irrelevant audience",
          "Insufficient use of ad extensions"
        ],
        solutions: [
          "Improve keyword relevance in ad copy",
          "Test different value propositions and calls to action",
          "Develop more compelling ad creative with clear benefits",
          "Refine audience targeting for better relevance",
          "Implement all applicable ad extensions"
        ]
      },
      {
        problem: "High Cost Per Click (CPC)",
        possibleCauses: [
          "High competition for target keywords",
          "Poor Quality Score",
          "Bidding too aggressively",
          "Broad match keywords without proper negative keywords",
          "Poor ad relevance to landing page"
        ],
        solutions: [
          "Find less competitive long-tail keyword alternatives",
          "Improve Quality Score through better relevance",
          "Optimize bidding strategy with focus on ROI",
          "Refine keyword match types and add negative keywords",
          "Improve landing page relevance and experience"
        ]
      },
      {
        problem: "Low Conversion Rate",
        possibleCauses: [
          "Misalignment between ad promise and landing page",
          "Poor landing page experience or design",
          "Targeting users with low purchase intent",
          "Complex or lengthy conversion process",
          "Lack of trust elements on landing page"
        ],
        solutions: [
          "Ensure landing page delivers on ad promise",
          "Optimize landing page with clear CTA and value proposition",
          "Refine targeting to focus on high-intent users",
          "Simplify conversion process and remove friction",
          "Add trust signals (testimonials, reviews, guarantees)"
        ]
      },
      {
        problem: "Ad Disapprovals",
        possibleCauses: [
          "Violation of platform ad policies",
          "Prohibited content or offerings",
          "Misleading claims or unrealistic promises",
          "Incorrect use of trademarks",
          "Technical issues with URLs or tracking"
        ],
        solutions: [
          "Review and comply with platform ad policies",
          "Remove or modify prohibited content",
          "Ensure all claims are accurate and substantiated",
          "Properly use trademarks or remove if necessary",
          "Fix any technical issues with landing pages and tracking"
        ]
      }
    ],
    analyticsIssues: [
      {
        problem: "Discrepancies Between Data Sources",
        possibleCauses: [
          "Different attribution models",
          "Tracking code implementation issues",
          "Different counting methodologies",
          "Cookie restrictions and tracking prevention",
          "Time zone differences"
        ],
        solutions: [
          "Understand and account for attribution differences",
          "Audit tracking implementation for consistency",
          "Document methodology differences between platforms",
          "Implement server-side tracking where possible",
          "Standardize time zone settings across platforms"
        ]
      },
      {
        problem: "Sudden Traffic Drops",
        possibleCauses: [
          "Tracking code removed or modified",
          "Website technical issues",
          "Google Analytics filters applied incorrectly",
          "Seasonality or external factors",
          "Major algorithm updates (for SEO traffic)"
        ],
        solutions: [
          "Verify tracking code implementation",
          "Check website uptime and performance",
          "Review and adjust analytics filters",
          "Compare to previous year and account for seasonality",
          "Analyze by traffic source to identify specific issues"
        ]
      },
      {
        problem: "Missing Conversion Data",
        possibleCauses: [
          "Conversion tracking not properly implemented",
          "Cross-domain tracking issues",
          "Session timeouts before conversion completion",
          "Ad blockers or privacy settings blocking tracking",
          "Technical conflicts with other scripts"
        ],
        solutions: [
          "Audit conversion tracking implementation",
          "Set up proper cross-domain tracking",
          "Adjust session timeout settings if appropriate",
          "Implement server-side tracking for critical conversions",
          "Test for script conflicts and resolve"
        ]
      }
    ]
  }
};

// Marketing resources for educational content
export const marketingResources = [
  {
    id: 1,
    title: "Google Ads Fundamentals",
    type: "guide",
    category: "search_ads",
    content: "Comprehensive guide to Google Ads platform basics, campaign structure, and key metrics.",
    url: "https://digitalzoom.academy/resources/google-ads-fundamentals",
    tags: ["beginner", "search", "PPC"]
  },
  {
    id: 2,
    title: "Facebook Ads Targeting Strategies",
    type: "guide",
    category: "social_ads",
    content: "In-depth guide to audience targeting options on Facebook, including custom audiences, lookalikes, and interest targeting.",
    url: "https://digitalzoom.academy/resources/facebook-targeting-guide",
    tags: ["intermediate", "social", "audience", "targeting"]
  },
  {
    id: 3,
    title: "SEO Checklist for Content Optimization",
    type: "checklist",
    category: "seo",
    content: "Complete checklist for optimizing content for search engines, including on-page factors, technical considerations, and content quality.",
    url: "https://digitalzoom.academy/resources/seo-content-checklist",
    tags: ["all-levels", "SEO", "content"]
  },
  {
    id: 4,
    title: "Email Marketing Automation Workflows",
    type: "guide",
    category: "email",
    content: "Guide to setting up effective email automation workflows for different customer journey stages.",
    url: "https://digitalzoom.academy/resources/email-automation-guide",
    tags: ["intermediate", "email", "automation"]
  },
  {
    id: 5,
    title: "A/B Testing Framework",
    type: "framework",
    category: "testing",
    content: "Structured framework for designing, implementing, and analyzing A/B tests for marketing optimization.",
    url: "https://digitalzoom.academy/resources/ab-testing-framework",
    tags: ["advanced", "testing", "optimization"]
  },
  {
    id: 6,
    title: "Marketing Analytics Dashboard Templates",
    type: "template",
    category: "analytics",
    content: "Pre-built dashboard templates for tracking key marketing metrics across channels.",
    url: "https://digitalzoom.academy/resources/analytics-dashboard-templates",
    tags: ["all-levels", "analytics", "reporting"]
  },
  {
    id: 7,
    title: "Customer Journey Mapping Workshop",
    type: "workshop",
    category: "strategy",
    content: "Step-by-step workshop guide for mapping customer journeys and identifying optimization opportunities.",
    url: "https://digitalzoom.academy/resources/journey-mapping-workshop",
    tags: ["intermediate", "strategy", "customer-experience"]
  },
  {
    id: 8,
    title: "Content Strategy Playbook",
    type: "playbook",
    category: "content",
    content: "Comprehensive playbook for developing and executing a content marketing strategy aligned with business goals.",
    url: "https://digitalzoom.academy/resources/content-strategy-playbook",
    tags: ["intermediate", "content", "strategy"]
  },
  {
    id: 9,
    title: "Digital Marketing Budget Calculator",
    type: "tool",
    category: "planning",
    content: "Interactive tool for allocating marketing budget across channels based on goals and performance data.",
    url: "https://digitalzoom.academy/tools/budget-calculator",
    tags: ["advanced", "planning", "budget"]
  },
  {
    id: 10,
    title: "Marketing KPI Framework",
    type: "framework",
    category: "measurement",
    content: "Framework for selecting and tracking the right KPIs based on marketing objectives and business goals.",
    url: "https://digitalzoom.academy/resources/marketing-kpi-framework",
    tags: ["all-levels", "measurement", "KPIs"]
  }
];

// Industry benchmarks for performance comparison
export const industryBenchmarks = {
  searchAds: {
    retail: {
      averageCTR: 1.3,
      averageCPC: 0.63,
      averageConversionRate: 3.0,
      averageCPA: 38.87,
      notes: "Highly seasonal with Q4 seeing higher CPCs and conversion rates."
    },
    finance: {
      averageCTR: 2.6,
      averageCPC: 3.77,
      averageConversionRate: 5.1,
      averageCPA: 78.09,
      notes: "Among the most competitive and expensive industries with high intent searches."
    },
    technology: {
      averageCTR: 2.1,
      averageCPC: 3.80,
      averageConversionRate: 2.9,
      averageCPA: 133.52,
      notes: "B2B tech typically has longer sales cycles and higher CPAs."
    },
    healthcare: {
      averageCTR: 1.8,
      averageCPC: 2.62,
      averageConversionRate: 2.8,
      averageCPA: 78.09,
      notes: "Restricted ad policies can limit targeting options."
    },
    education: {
      averageCTR: 2.2,
      averageCPC: 2.40,
      averageConversionRate: 4.0,
      averageCPA: 72.70,
      notes: "Seasonal patterns around enrollment periods."
    },
    travel: {
      averageCTR: 3.4,
      averageCPC: 1.53,
      averageConversionRate: 2.4,
      averageCPA: 45.69,
      notes: "Highly seasonal with higher competition during peak travel periods."
    }
  },
  socialAds: {
    retail: {
      averageCTR: 0.9,
      averageCPC: 0.70,
      averageConversionRate: 1.8,
      averageCPM: 7.34,
      notes: "Visual products perform best; strong seasonal trends."
    },
    finance: {
      averageCTR: 0.8,
      averageCPC: 2.52,
      averageConversionRate: 2.5,
      averageCPM: 13.47,
      notes: "Heavy restrictions on targeting; requires careful compliance."
    },
    technology: {
      averageCTR: 1.1,
      averageCPC: 1.84,
      averageConversionRate: 1.2,
      averageCPM: 11.66,
      notes: "Performs better for awareness than direct response."
    },
    healthcare: {
      averageCTR: 0.7,
      averageCPC: 1.32,
      averageConversionRate: 1.0,
      averageCPM: 12.31,
      notes: "Significant targeting restrictions; best for awareness."
    },
    education: {
      averageCTR: 1.3,
      averageCPC: 1.03,
      averageConversionRate: 2.6,
      averageCPM: 8.96,
      notes: "Detailed targeting options for prospective students."
    },
    travel: {
      averageCTR: 1.4,
      averageCPC: 0.63,
      averageConversionRate: 1.5,
      averageCPM: 7.28,
      notes: "Visual creative drives performance; strong for inspiration."
    }
  },
  email: {
    retail: {
      averageOpenRate: 18.9,
      averageClickRate: 2.7,
      averageConversionRate: 3.8,
      notes: "Promotional emails perform best with clear discounts."
    },
    finance: {
      averageOpenRate: 21.8,
      averageClickRate: 2.5,
      averageConversionRate: 2.9,
      notes: "Educational content drives highest engagement."
    },
    technology: {
      averageOpenRate: 20.7,
      averageClickRate: 2.4,
      averageConversionRate: 2.3,
      notes: "Case studies and data-driven content perform best."
    },
    healthcare: {
      averageOpenRate: 19.7,
      averageClickRate: 2.3,
      averageConversionRate: 2.0,
      notes: "Educational content on health topics drives engagement."
    },
    education: {
      averageOpenRate: 23.4,
      averageClickRate: 2.9,
      averageConversionRate: 3.5,
      notes: "Personalization based on interests highly effective."
    },
    travel: {
      averageOpenRate: 20.2,
      averageClickRate: 2.6,
      averageConversionRate: 2.1,
      notes: "Visual content and limited-time offers perform best."
    }
  }
};

// Realistic examples to demonstrate concepts
export const marketingExamples = {
  searchAds: [
    {
      title: "E-commerce Keyword Strategy Example",
      description: "A mid-sized online furniture retailer implemented a tiered keyword strategy with three distinct campaigns:",
      implementation: [
        "Brand campaign: Exact match terms for brand name and product lines",
        "Category campaign: Phrase match for furniture categories (e.g., 'leather sofas', 'dining tables')",
        "Product campaign: Modified broad match for specific product attributes (e.g., 'sectional sofa with storage')"
      ],
      results: "30% increase in ROAS and 22% decrease in CPA compared to previous structure",
      lessons: "Segmenting keywords by intent and specificity allowed for more precise bidding and messaging."
    },
    {
      title: "Local Service Business Ad Extension Strategy",
      description: "A local plumbing service implemented a comprehensive ad extension strategy:",
      implementation: [
        "Location extensions showing their service area",
        "Call extensions for immediate contact",
        "Structured snippets highlighting services (emergency repairs, installations, maintenance)",
        "Callout extensions emphasizing '24/7 availability' and '30-minute response time'"
      ],
      results: "42% increase in CTR and 18% increase in call conversions",
      lessons: "Extensions provided additional value propositions and increased ad real estate."
    }
  ],
  socialAds: [
    {
      title: "SaaS Company Audience Targeting Strategy",
      description: "A B2B SaaS company selling project management software created a multi-tier audience strategy:",
      implementation: [
        "Created lookalike audiences from current customers segmented by company size",
        "Built custom audiences from website visitors who viewed product pages",
        "Used interest targeting to reach people interested in productivity and project management",
        "Excluded current customers and recent converters to avoid wasted spend"
      ],
      results: "Reduced CPA by 34% and increased lead quality score by 28%",
      lessons: "Precise audience targeting based on existing customer data significantly improved efficiency."
    },
    {
      title: "DTC Brand Creative Testing Framework",
      description: "A direct-to-consumer skincare brand implemented a systematic creative testing approach:",
      implementation: [
        "Created a testing matrix across four variables: image style, headline approach, value proposition, and CTA",
        "Ran initial broad tests to identify winning directions",
        "Followed with more specific tests to refine winning elements",
        "Implemented a 70/20/10 budget allocation (70% to proven winners, 20% to promising tests, 10% to experimental concepts)"
      ],
      results: "Identified creative approach that delivered 52% higher ROAS than previous best performer",
      lessons: "Systematic testing across variables revealed non-obvious winners that contradicted initial assumptions."
    }
  ],
  email: [
    {
      title: "Subscription Service Onboarding Sequence",
      description: "A meal kit subscription service developed a 6-part onboarding email sequence:",
      implementation: [
        "Welcome email with account setup instructions (Day 0)",
        "Educational email about meal selection and customization (Day 2)",
        "Social proof and testimonials from satisfied customers (Day 4)",
        "Dietary preference review and meal recommendation (Day 7)",
        "Tips for maximizing service value (Day 10)",
        "Referral program introduction (Day 14)"
      ],
      results: "Reduced 30-day churn by 27% and increased average order value by 14%",
      lessons: "Educating customers on product use and highlighting value during early stages significantly improved retention."
      }
    ]
};
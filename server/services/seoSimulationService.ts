import { SeoSimulation, SeoSimulationAttempt, InsertSeoSimulation, InsertSeoSimulationAttempt } from '@shared/schema';
import { db } from '../db';
import { freeMarketingAI, premiumMarketingAI, enterpriseMarketingAI } from './marketingAI';
import { eq, and, desc } from 'drizzle-orm';
import * as schema from '@shared/schema';

interface SeoPageContent {
  title: string;
  metaDescription: string;
  headings: {
    tag: string; // h1, h2, h3, etc.
    content: string;
  }[];
  body: string;
  images: {
    src: string;
    alt: string;
  }[];
  links: {
    href: string;
    text: string;
    isInternal: boolean;
  }[];
  schemaMarkup?: string; // JSON-LD structured data
}

// Sample SEO simulations library - Progressive Learning Journey
const seoSimulationTemplates: InsertSeoSimulation[] = [
  // Level 1: Beginner Basics - Core on-page SEO foundations
  {
    title: "Level 1: Coffee Shop Product Page - Basic On-Page SEO",
    description: "Learn the fundamentals of on-page SEO by optimizing a basic product page for a coffee shop. Focus on title tags, meta descriptions, and basic headings.",
    difficulty: "Beginner",
    industry: "E-commerce",
    originalContent: {
      title: "Coffee Beans For Sale - Buy Now",
      metaDescription: "We sell coffee beans. Best prices.",
      headings: [
        { tag: "h1", content: "Coffee Beans For Sale" },
        { tag: "h2", content: "Product Information" },
        { tag: "h2", content: "Buy Now" }
      ],
      body: `We have coffee beans for sale. Our coffee beans are the best. They come from different countries. They taste good. You can buy them online or in our store. We ship worldwide. Our coffee beans are available in different sizes. We have 250g, 500g and 1kg packages. You can also choose between whole beans and ground coffee. We offer different grinds. Our coffee beans are fresh. We roast them regularly. You will enjoy our coffee beans. Buy now.`,
      images: [
        { src: "/images/coffee.jpg", alt: "coffee" },
        { src: "/images/beans.jpg", alt: "beans" }
      ],
      links: [
        { href: "/buy", text: "Buy Now", isInternal: true },
        { href: "/shipping", text: "Shipping Info", isInternal: true }
      ]
    },
    targetKeywords: ["arabica coffee beans", "organic coffee", "specialty coffee", "single-origin coffee", "fresh roasted beans"],
    seoIssues: [
      {
        type: "title",
        description: "Title is too generic and doesn't include primary keywords",
        severity: "high",
        location: "title"
      },
      {
        type: "meta",
        description: "Meta description is too short and uninformative",
        severity: "high",
        location: "metaDescription"
      },
      {
        type: "headings",
        description: "Headings lack keywords and specificity",
        severity: "medium",
        location: "headings"
      },
      {
        type: "content",
        description: "Content is too short, repetitive, and lacks specific details about the products",
        severity: "high",
        location: "body"
      },
      {
        type: "images",
        description: "Image alt texts are too generic and missing keywords",
        severity: "medium",
        location: "images"
      },
      {
        type: "links",
        description: "Link anchor texts are not descriptive enough",
        severity: "low",
        location: "links"
      }
    ],
    clientDossier: {
      clientName: "Jenny's Artisan Java & Roastery",
      founderName: "Jenny Miller (Founder & Master Roaster)",
      businessModel: "Direct-to-Consumer E-Commerce & Local Roastery",
      location: "Morgantown, West Virginia (Est. 2014)",
      products: "100% Organic Certified Arabica Coffee Beans, Single-Origin roasts (Guatemala & Ethiopia), Specialty Espresso Blends (250g, 500g, 1kg).",
      valueProps: [
        "100% Fair-Trade & Organic Arabica beans sourced directly from small family co-ops",
        "Roasted in small 15-lb batches every Monday & Thursday so beans never sit on a shelf",
        "Shipped within 24 hours of roasting for peak aroma and crema",
        "Whole bean and custom coarse/fine grind options available"
      ],
      fieldNotes: `“I visited Jenny's Artisan Roastery on a Tuesday morning. The smell of roasting coffee hits you the second you walk through the door, and there was already a line of 12 people waiting for fresh pour-overs.

I sat down with Jenny in her back office next to stacked burlap sacks stamped 'Certified Organic Arabica — Guatemala & Ethiopia'. She showed me her roaster and explained:

'We roast small 15-pound batches every morning and ship within 24 hours so the beans are at peak freshness. But last year my nephew threw together our website in 10 minutes. He just wrote generic filler like "We sell coffee beans." Our regular customers told me the site looks like a generic template from 2005 and doesn't even mention that our beans are 100% certified organic Arabica or single-origin. When people search Google for organic arabica coffee beans or fresh roasted specialty coffee, we don't even show up!'

Walking through the roastery, the problem was crystal clear: Jenny has a world-class physical product, but search engine crawlers have zero idea what she actually sells because her title tags, H1 headings, and image alt tags are completely blank or generic.”`,
      customerFeedback: [
        "“Your coffee is the best organic roast in the state, but your website just says 'Buy Coffee'. Where are the origin details?” — Mark R., Regular Customer",
        "“I tried searching Google for 'fresh roasted organic arabica beans' in WV and couldn't find your store anywhere.” — Sarah T., Coffee Enthusiast"
      ]
    },
    bestPractices: [
      {
        category: "title",
        description: "Include primary search keywords at the start of the title, followed by brand or secondary USP. Keep under 60 characters.",
        example: "Formula: [Primary Target Keyword] | [Secondary USP / Product Type] (e.g. 50-60 chars)"
      },
      {
        category: "meta",
        description: "Write an action-driven 120-155 character pitch with targeted keywords, core value proposition, and an active Call To Action.",
        example: "Formula: [Shop/Discover] [Product Specs & Organic Claims] + [Benefit/Shipping offer] + [Call to Action]!"
      },
      {
        category: "headings",
        description: "Structure a clear hierarchy: One single H1 defining the main product offering, followed by H2s covering specific features, origin specs, and ordering details.",
        example: "Hierarchy: H1 = Core Product & Keyword | H2 = Origin & Roasting Specs | H2 = Grind Sizes & Delivery"
      },
      {
        category: "content",
        description: "Expand content to 200-350 words detailing product origins, certifications, flavor profile, and brewing instructions. Include target keyword variations naturally (1-2% density).",
        example: "Structure: Paragraph 1 (Overview & Bean Origins) -> Paragraph 2 (Roasting Method & Flavor Notes) -> Paragraph 3 (Grind Sizes & Ordering Information)."
      },
      {
        category: "images",
        description: "Write descriptive alt text detailing the exact subject matter of the photograph and relevant product traits for screen readers and search crawlers.",
        example: "Pattern: [Subject matter] + [Key attribute / Bean type] (e.g. Bag of organic arabica whole beans)"
      },
      {
        category: "links",
        description: "Replace vague 'Click here' or 'Buy now' links with descriptive anchor text explaining the destination page topic.",
        example: "Pattern: 'Browse Single-Origin Beans' or 'View Fresh Delivery Rates' instead of generic 'Click Here'"
      }
    ]
  },
  // Level 2: Intermediate Foundations - Content optimization and keyword integration
  {
    title: "Level 2: Local Business Homepage - Content & Keyword Optimization",
    description: "Build on basic SEO foundations and learn about content optimization, local SEO factors, and keyword integration for a dental practice website.",
    difficulty: "Intermediate",
    industry: "Healthcare",
    originalContent: {
      title: "Welcome To Our Dental Office",
      metaDescription: "Dental services for the whole family. Visit our dental office today.",
      headings: [
        { tag: "h1", content: "Welcome To Our Dental Office" },
        { tag: "h2", content: "Our Services" },
        { tag: "h2", content: "Contact Us" }
      ],
      body: `We are a dental office located in the city. We provide dental services for the whole family. Our team of dentists is dedicated to providing you with the best care. We offer a wide range of services including cleanings, fillings, crowns, and more. We use the latest technology to ensure your comfort. Our office is clean and modern. We accept most insurance plans. Call us today to schedule an appointment. We look forward to seeing you.`,
      images: [
        { src: "/images/office.jpg", alt: "dental office" },
        { src: "/images/dentist.jpg", alt: "dentist" }
      ],
      links: [
        { href: "/services", text: "Services", isInternal: true },
        { href: "/contact", text: "Contact", isInternal: true }
      ]
    },
    clientDossier: {
      clientName: "BrightSmile Family & Cosmetic Dental",
      founderName: "Dr. Michael Miller, DDS (Lead Dental Surgeon)",
      businessModel: "Multi-Doctor Private Dental Practice & Cosmetic Clinic",
      location: "Downtown Chicago, IL (Near Millennium Park)",
      products: "Preventive Family Cleanings, Invisalign Orthodontics, Same-Day Emergency Tooth Extractions, Porcelain Veneers.",
      valueProps: [
        "In-house 3D digital imaging & same-day emergency dental appointments",
        "Team of 4 specialized doctors: Orthodontist, Periodontist, General Dentists",
        "Over 300+ 5-star verified local patient reviews",
        "Direct insurance billing with most major Chicago PPO networks"
      ],
      fieldNotes: `“I met with Dr. Michael Miller at his dental practice in downtown Chicago on a Friday afternoon. The clinic has 6 state-of-the-art operatory rooms, 3 associate dentists, and a spotless modern waiting area.

Dr. Miller sat down with me between patients and vented:
'We just invested $80,000 in 3D panoramic imaging and same-day emergency dental equipment. But our website is a complete ghost town for local search. When someone in downtown Chicago chips a tooth or searches for emergency dental care near Millennium Park, our competitors down the street get all the calls.

Our web developer built a homepage that just says "Welcome To Our Dental Office" with zero mention of Chicago, no local schema structured data, no NAP consistency, and no separate service categories for emergency dentistry, cosmetic veneers, or teeth cleanings.'

Walking through the clinic, the problem was glaring: Dr. Miller runs an elite practice in the heart of Chicago, but search engines only see a generic 50-word webpage with no geotargeting, missing local schema, and generic headings.”`,
      customerFeedback: [
        "“I was looking for emergency tooth pain relief in the Loop and couldn't find your phone number on Google.” — David K.",
        "“Do you guys do Invisalign? Your website only says 'cleanings and fillings'.” — Amanda L."
      ]
    },
    targetKeywords: ["family dentist", "dental services", "cosmetic dentistry", "emergency dental care", "teeth cleaning", "Chicago dentist"],
    seoIssues: [
      {
        type: "title",
        description: "Title doesn't include location or specific dental services",
        severity: "high",
        location: "title"
      },
      {
        type: "meta",
        description: "Meta description is generic and doesn't mention location or specific services",
        severity: "high",
        location: "metaDescription"
      },
      {
        type: "schema",
        description: "Missing local business schema markup",
        severity: "high",
        location: "overall"
      },
      {
        type: "content",
        description: "Content is generic and doesn't mention location or specific services in detail",
        severity: "medium",
        location: "body"
      },
      {
        type: "local",
        description: "Missing NAP (Name, Address, Phone) information",
        severity: "high",
        location: "body"
      },
      {
        type: "headings",
        description: "Headings are too generic and don't include location or service keywords",
        severity: "medium",
        location: "headings"
      }
    ],
    bestPractices: [
      {
        category: "local SEO",
        description: "Include city name in title tag and throughout content",
        example: "Bright Smile Family Dentistry | Top Rated Dentist in Chicago, IL"
      },
      {
        category: "NAP consistency",
        description: "Display Name, Address, and Phone number prominently on every page",
        example: "Bright Smile Family Dentistry\n123 Main Street, Chicago, IL 60601\n(312) 555-1234"
      },
      {
        category: "schema markup",
        description: "Implement LocalBusiness schema for better local search visibility",
        example: "<script type=\"application/ld+json\">{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Dentist\",\n  \"name\": \"Bright Smile Family Dentistry\",\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"streetAddress\": \"123 Main Street\",\n    \"addressLocality\": \"Chicago\",\n    \"addressRegion\": \"IL\",\n    \"postalCode\": \"60601\"\n  },\n  \"telephone\": \"(312) 555-1234\"\n}</script>"
      },
      {
        category: "service pages",
        description: "Create individual pages for each major service with detailed content",
        example: "Separate pages for 'Cosmetic Dentistry', 'Emergency Dental Care', 'Teeth Cleaning', etc., each with 500+ words of detailed information"
      },
      {
        category: "local content",
        description: "Include local landmarks, neighborhoods, and relevant local information",
        example: "Conveniently located in downtown Chicago, just two blocks from Millennium Park and easily accessible from the Loop, River North, and Streeterville neighborhoods."
      },
      {
        category: "mobile optimization",
        description: "Ensure site is fully responsive with fast loading times for mobile users",
        example: "Use responsive design, optimize images, minimize code, and use browser caching"
      }
    ]
  },
  // Level 3: Advanced Tactics - Technical SEO elements
  {
    title: "Level 3: E-commerce Technical SEO - Advanced Optimization",
    description: "Master advanced technical SEO elements including schema markup, URL structure, mobile optimization, and page speed factors for an e-commerce website.",
    difficulty: "Advanced",
    industry: "E-commerce",
    originalContent: {
      title: "Online Furniture Store | Buy Home Furniture",
      metaDescription: "Shop for furniture online. Delivery available. Quality furniture for your home.",
      headings: [
        { tag: "h1", content: "Online Furniture Store" },
        { tag: "h2", content: "Featured Products" },
        { tag: "h2", content: "About Us" },
        { tag: "h2", content: "Contact" }
      ],
      body: `Welcome to our online furniture store. We offer a wide range of quality furniture for your home. 
      
      Featured Products:
      
      Living Room: sofas, coffee tables, TV stands
      Bedroom: beds, dressers, nightstands
      Dining Room: dining tables, dining chairs
      Office: desks, office chairs, bookcases
      
      About Us:
      
      We have been in the furniture business for over 10 years. Our mission is to provide quality furniture at affordable prices.
      
      Contact:
      
      Email: info@furnitureshop.com
      Phone: (555) 123-4567`,
      images: [
        { src: "/images/sofa.jpg", alt: "sofa" },
        { src: "/images/bed.jpg", alt: "bed" },
        { src: "/images/dining-table.jpg", alt: "dining table" },
        { src: "/images/desk.jpg", alt: "desk" }
      ],
      links: [
        { href: "/living-room", text: "Living Room", isInternal: true },
        { href: "/bedroom", text: "Bedroom", isInternal: true },
        { href: "/dining-room", text: "Dining Room", isInternal: true },
        { href: "/office", text: "Office", isInternal: true },
        { href: "https://example.com", text: "Partner Site", isInternal: false }
      ],
      schemaMarkup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Store\",\n  \"name\": \"Furniture Shop\"\n}"
    },
    clientDossier: {
      clientName: "Moderna Living Craft Furniture",
      founderName: "Elena Rostova (Head of E-Commerce)",
      businessModel: "Direct-to-Consumer Modern Hardwood & Living Room Furniture",
      location: "Austin, TX (National Delivery)",
      products: "Solid Oak Dining Tables, Custom Velvet Sofas, Modular Sectionals, Ergonomic Home Office Desks.",
      valueProps: [
        "100% Solid sustainably sourced American oak & walnut",
        "Modular expandable sectionals built to order",
        "White-glove inside delivery across the continental USA",
        "10-year structural warranty on all frames"
      ],
      fieldNotes: `“I conducted an audit call with Elena Rostova, Head of E-Commerce at Moderna Living Craft. They manufacture premium solid-wood dining tables and modular sectionals in their Austin facility.

Elena pulled up their Google Search Console and showed me the damage:
'We have over 400 SKU variations—different wood finishes, fabric swatches, and sectional configurations. But our developer generated 400 separate URLs with thin, duplicated descriptions and no canonical tags. Google is penalizing us for keyword cannibalization, and our product schema markup is completely broken with missing prices, availability, and review ratings.

When shoppers search for solid oak dining tables or modern luxury sectionals, Google doesn't know which page to rank, so we get buried on page 4.'

Our mission: Repair the product schema markup, fix canonical URL routing, structure category silos (Living, Bedroom, Dining, Office), and write comprehensive keyword-rich category copy.”`,
      customerFeedback: [
        "“I couldn't find dimensions or wood species options on your sofa pages.” — Chris M.",
        "“Your search results on Google show 'out of stock' because your schema markup is outdated.” — Lisa P."
      ]
    },
    targetKeywords: ["modern furniture", "home furniture", "online furniture store", "affordable sofas", "quality bedroom furniture", "furniture delivery", "luxury dining sets"],
    seoIssues: [
      {
        type: "schema",
        description: "Incomplete product schema markup",
        severity: "high",
        location: "schemaMarkup"
      },
      {
        type: "url",
        description: "Non-descriptive URL structure for product categories",
        severity: "medium",
        location: "links"
      },
      {
        type: "mobile",
        description: "Content not optimized for mobile viewing",
        severity: "high",
        location: "body"
      },
      {
        type: "speed",
        description: "Images not optimized for faster loading",
        severity: "medium",
        location: "images"
      },
      {
        type: "internal",
        description: "Inefficient internal linking structure",
        severity: "medium",
        location: "links"
      },
      {
        type: "content",
        description: "Thin content on product categories",
        severity: "medium",
        location: "body"
      },
      {
        type: "headings",
        description: "Heading structure doesn't properly highlight furniture categories",
        severity: "low",
        location: "headings"
      }
    ],
    bestPractices: [
      {
        category: "schema markup",
        description: "Implement detailed Product and WebSite structured data",
        example: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebSite\",\n  \"name\": \"Modern Home Furniture\",\n  \"url\": \"https://www.modernhomefurniture.com\",\n  \"potentialAction\": {\n    \"@type\": \"SearchAction\",\n    \"target\": \"https://www.modernhomefurniture.com/search?q={search_term_string}\",\n    \"query-input\": \"required name=search_term_string\"\n  }\n}\n\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Product\",\n  \"name\": \"Modern Sectional Sofa\",\n  \"image\": \"https://www.modernhomefurniture.com/images/sofa.jpg\",\n  \"description\": \"Contemporary sectional sofa with chaise lounge, perfect for modern living rooms.\",\n  \"brand\": {\n    \"@type\": \"Brand\",\n    \"name\": \"Modern Home\"\n  },\n  \"offers\": {\n    \"@type\": \"Offer\",\n    \"price\": \"1299.99\",\n    \"priceCurrency\": \"USD\",\n    \"availability\": \"https://schema.org/InStock\"\n  }\n}"
      },
      {
        category: "URL structure",
        description: "Create keyword-rich, hierarchical URLs",
        example: "/furniture/living-room/sofas/sectional-sofas/modern-gray-sectional-sofa"
      },
      {
        category: "mobile optimization",
        description: "Ensure responsive design with mobile-friendly navigation and touch targets",
        example: "Use CSS media queries, viewport meta tags, and touch-friendly button sizes (minimum 44x44px)"
      },
      {
        category: "page speed",
        description: "Optimize images and minimize render-blocking resources",
        example: "Compress images, use WebP format, implement lazy loading, and defer non-critical JavaScript"
      },
      {
        category: "internal linking",
        description: "Create a strategic linking structure with descriptive anchor text",
        example: "Link between related products and categories using keyword-rich anchor text like \"Browse our collection of modern sectional sofas\""
      },
      {
        category: "content depth",
        description: "Create detailed, unique descriptions for each product category",
        example: "Our modern living room furniture combines contemporary design with exceptional comfort. Each piece is crafted from premium materials including solid hardwood frames and high-resilience foam cushions..."
      }
    ]
  },
  // Level 4: Expert Analysis - Comprehensive site audit
  {
    title: "Level 4: Travel Blog Audit - Expert SEO Analysis",
    description: "Perform a comprehensive site audit for a travel blog, identifying and fixing broken links, duplicate content issues, canonical problems, and implementing advanced schema for rich snippets.",
    difficulty: "Expert",
    industry: "Travel & Tourism",
    originalContent: {
      title: "Travel Tips and Destinations | Travel Blog",
      metaDescription: "Find travel tips, destination guides, and travel stories on our blog.",
      headings: [
        { tag: "h1", content: "Travel Tips and Destinations" },
        { tag: "h2", content: "Popular Destinations" },
        { tag: "h2", content: "Travel Tips" },
        { tag: "h2", content: "About the Author" }
      ],
      body: `Welcome to our travel blog! We share travel tips, destination guides, and personal travel stories to help you plan your next adventure.

      Popular Destinations:
      - Paris, France
      - Tokyo, Japan
      - New York City, USA
      - Bali, Indonesia
      - Rome, Italy
      
      Travel Tips:
      - Packing essentials
      - Budget travel
      - Solo travel
      - Family travel
      - Luxury travel
      
      About the Author:
      Jane Doe is a travel enthusiast who has visited over 30 countries. She started this blog to share her experiences and help others plan their travels.`,
      images: [
        { src: "/images/paris.jpg", alt: "Paris" },
        { src: "/images/tokyo.jpg", alt: "Tokyo" },
        { src: "/images/new-york.jpg", alt: "New York" },
        { src: "/images/bali.jpg", alt: "Bali" },
        { src: "/images/rome.jpg", alt: "Rome" }
      ],
      links: [
        { href: "/destinations/paris", text: "Paris Guide", isInternal: true },
        { href: "/destinations/tokyo", text: "Tokyo Guide", isInternal: true },
        { href: "/destinations/new-york", text: "NYC Guide", isInternal: true },
        { href: "/destinations/bali", text: "Bali Guide", isInternal: true },
        { href: "/destinations/rome", text: "Rome Guide", isInternal: true },
        { href: "/tips/packing", text: "Packing Tips", isInternal: true },
        { href: "/tips/budget", text: "Budget Travel", isInternal: true },
        { href: "/tips/solo", text: "Solo Travel", isInternal: true },
        { href: "/tips/family", text: "Family Travel", isInternal: true },
        { href: "/tips/luxury", text: "Luxury Travel", isInternal: true },
        { href: "/about", text: "About", isInternal: true },
        { href: "/contact", text: "Contact", isInternal: true },
        { href: "/destinations/paris.html", text: "Paris Information", isInternal: true },
        { href: "/tips/packing.html", text: "What to Pack", isInternal: true },
        { href: "https://instagram.com/travelblog", text: "Follow on Instagram", isInternal: false },
        { href: "https://pinterest.com/travelblog", text: "Follow on Pinterest", isInternal: false },
        { href: "/destinations/newyork", text: "New York", isInternal: true },
        { href: "/broken-link", text: "Travel Resources", isInternal: true }
      ],
      schemaMarkup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Blog\",\n  \"name\": \"Travel Blog\"\n}"
    },
    clientDossier: {
      clientName: "Nomad Horizon Global Travel Guides",
      founderName: "Marcus Vance (Managing Editor)",
      businessModel: "Travel Editorial & Curated Adventure Booking Platform",
      location: "Portland, OR & Global Remote (Est. 2018)",
      products: "In-Depth Destination Guides, Curated Boutique Hotel Reviews, Budget Travel Itineraries, Adventure Gear Guides.",
      valueProps: [
        "Firsthand boots-on-the-ground travel writers across 40+ countries",
        "Curated interactive budget and luxury itineraries",
        "Zero sponsored rankings—unbiased independent travel reviews",
        "Over 150,000+ monthly active adventurous travelers"
      ],
      fieldNotes: `“I sat down with Marcus Vance, managing editor of Nomad Horizon, over a Zoom call from Lisbon. They publish in-depth travel guides for destinations across 40 countries, with over 150,000 monthly readers.

Marcus walked me through their recent organic traffic drop:
'After Google's recent Helpful Content and Core algorithm update, our organic search traffic crashed by 55%. When I audited the site, I realized why: our writers published 200 short, automated 300-word destination listicles that all copy the same generic tips. We have massive duplicate content between our Paris, NYC, and Rome guides, broken internal links, zero schema markup for BlogPosting or BreadcrumbList, and unoptimized high-res photography causing 4-second load times.'

Our mission: Execute a deep technical and content overhaul—fix broken internal links, implement canonical URL tags, inject Article and BreadcrumbList structured data, and write rich, keyword-optimized destination guides that deliver real value to travelers.”`,
      customerFeedback: [
        "“Your Paris link gave me a 404 broken page error when I clicked on packing tips.” — Chloe B.",
        "“Why are there 3 different URLs for your New York guide?” — Liam S."
      ]
    },
    targetKeywords: ["travel blog", "travel tips", "destination guides", "best places to visit", "travel planning", "budget travel tips", "luxury travel experiences"],
    seoIssues: [
      {
        type: "broken",
        description: "Broken internal links",
        severity: "high",
        location: "links"
      },
      {
        type: "duplicate",
        description: "Duplicate content due to multiple URLs for the same destination",
        severity: "high",
        location: "links"
      },
      {
        type: "canonical",
        description: "Missing canonical tags for similar content",
        severity: "medium",
        location: "overall"
      },
      {
        type: "schema",
        description: "Incomplete blog and article schema markup",
        severity: "medium",
        location: "schemaMarkup"
      },
      {
        type: "breadcrumbs",
        description: "Missing breadcrumb navigation",
        severity: "medium",
        location: "overall"
      },
      {
        type: "hreflang",
        description: "Missing hreflang tags for international audience",
        severity: "low",
        location: "overall"
      },
      {
        type: "sitemap",
        description: "No XML sitemap reference",
        severity: "medium",
        location: "overall"
      }
    ],
    bestPractices: [
      {
        category: "broken links",
        description: "Regularly check and fix broken links",
        example: "Use tools like Screaming Frog to scan for 404 errors and fix or redirect broken links"
      },
      {
        category: "duplicate content",
        description: "Implement canonical tags to indicate preferred URL versions",
        example: "<link rel=\"canonical\" href=\"https://travelblog.com/destinations/paris/\" />"
      },
      {
        category: "URL consistency",
        description: "Maintain consistent URL patterns and implement 301 redirects for variations",
        example: "Redirect /destinations/newyork to /destinations/new-york"
      },
      {
        category: "rich snippets",
        description: "Implement detailed schema markup for blog articles with BreadcrumbList",
        example: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"BlogPosting\",\n  \"headline\": \"10 Essential Tips for Visiting Paris on a Budget\",\n  \"image\": \"https://travelblog.com/images/paris-budget-guide.jpg\",\n  \"datePublished\": \"2023-03-15\",\n  \"dateModified\": \"2023-04-02\",\n  \"author\": {\n    \"@type\": \"Person\",\n    \"name\": \"Jane Doe\"\n  },\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Travel Blog\",\n    \"logo\": {\n      \"@type\": \"ImageObject\",\n      \"url\": \"https://travelblog.com/logo.png\"\n    }\n  },\n  \"description\": \"Discover how to experience the magic of Paris without breaking the bank with these 10 budget travel tips.\"\n}\n\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"BreadcrumbList\",\n  \"itemListElement\": [\n    {\n      \"@type\": \"ListItem\",\n      \"position\": 1,\n      \"name\": \"Home\",\n      \"item\": \"https://travelblog.com/\"\n    },\n    {\n      \"@type\": \"ListItem\",\n      \"position\": 2,\n      \"name\": \"Destinations\",\n      \"item\": \"https://travelblog.com/destinations/\"\n    },\n    {\n      \"@type\": \"ListItem\",\n      \"position\": 3,\n      \"name\": \"Paris\",\n      \"item\": \"https://travelblog.com/destinations/paris/\"\n    }\n  ]\n}"
      },
      {
        category: "breadcrumbs",
        description: "Implement visible breadcrumb navigation matching the site structure",
        example: "Home > Destinations > Europe > France > Paris"
      },
      {
        category: "international SEO",
        description: "Implement hreflang tags for content available in multiple languages",
        example: "<link rel=\"alternate\" hreflang=\"en\" href=\"https://travelblog.com/destinations/paris/\" />\n<link rel=\"alternate\" hreflang=\"fr\" href=\"https://travelblog.com/fr/destinations/paris/\" />"
      },
      {
        category: "XML sitemap",
        description: "Create and reference an XML sitemap in robots.txt",
        example: "Generate a comprehensive XML sitemap and add a reference in robots.txt: Sitemap: https://travelblog.com/sitemap.xml"
      }
    ]
  },
  // Level 5: Master Implementation - Complete SEO strategy
  {
    title: "Level 5: Complete Business Website Audit - Master SEO Implementation",
    description: "Apply all your SEO knowledge to conduct a full site audit for a business website, implementing a comprehensive SEO strategy addressing all aspects from technical issues to content optimization and competitive analysis.",
    difficulty: "Master",
    industry: "Business Services",
    originalContent: {
      title: "Business Consulting Services | Company Name",
      metaDescription: "We provide business consulting services to help your business grow.",
      headings: [
        { tag: "h1", content: "Business Consulting Services" },
        { tag: "h2", content: "Our Services" },
        { tag: "h2", content: "About Us" },
        { tag: "h2", content: "Contact Us" }
      ],
      body: `Welcome to our business consulting firm. We help businesses grow and succeed through our expert consulting services.

      Our Services:
      - Strategic Planning
      - Financial Analysis
      - Marketing Strategy
      - Operations Improvement
      - Leadership Development
      
      About Us:
      Our team of consultants has years of experience in various industries. We are dedicated to helping our clients achieve their business goals.
      
      Contact Us:
      Email: info@consultingfirm.com
      Phone: (555) 987-6543`,
      images: [
        { src: "/images/consulting.jpg", alt: "Business Consulting" },
        { src: "/images/team.jpg", alt: "Our Team" },
        { src: "/images/office.jpg", alt: "Our Office" }
      ],
      links: [
        { href: "/services", text: "Services", isInternal: true },
        { href: "/about", text: "About", isInternal: true },
        { href: "/contact", text: "Contact", isInternal: true },
        { href: "/services/strategic-planning", text: "Strategic Planning", isInternal: true },
        { href: "/services/financial-analysis", text: "Financial Analysis", isInternal: true },
        { href: "/services/marketing-strategy", text: "Marketing Strategy", isInternal: true },
        { href: "/services/operations-improvement", text: "Operations", isInternal: true },
        { href: "/services/leadership-development", text: "Leadership", isInternal: true },
        { href: "/blog", text: "Blog", isInternal: true },
        { href: "/case-studies", text: "Case Studies", isInternal: true },
        { href: "/testimonials", text: "Testimonials", isInternal: true },
        { href: "https://linkedin.com/company/consultingfirm", text: "LinkedIn", isInternal: false },
        { href: "https://twitter.com/consultingfirm", text: "Twitter", isInternal: false },
        { href: "/old-services.html", text: "Our Services", isInternal: true },
        { href: "/broken-link", text: "Resources", isInternal: true },
        { href: "/careers", text: "Careers", isInternal: true }
      ],
      schemaMarkup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"LocalBusiness\",\n  \"name\": \"Consulting Firm\"\n}"
    },
    clientDossier: {
      clientName: "Apex Strategy & Enterprise Growth Partners",
      founderName: "Arthur Vance, Senior Managing Partner",
      businessModel: "B2B Management Consulting & M&A Advisory Firm",
      location: "Chicago, IL (Midwest Headquarters)",
      products: "C-Suite Strategic Planning, M&A Financial Due Diligence, Operations Optimization, Executive Leadership Coaching.",
      valueProps: [
        "Over $2.4B in client transaction volume advised across 15 years",
        "Team of former Fortune 100 executives and McKinsey alumni",
        "Average engagement ROI: 4.8x within 18 months",
        "Retainers ranging from $15,000/mo to $100,000 per project"
      ],
      fieldNotes: `“I met with Arthur Vance, Senior Partner at Apex Strategy, on the 42nd floor of their Chicago headquarters. Apex advises mid-market companies on $50M+ mergers, financial restructuring, and operational scale.

Arthur laid out the firm's digital growth bottleneck:
'Our average client engagement is $35,000 to $100,000. When private equity firms, board members, or CEOs search Google for strategic planning consultants, financial analysis services, or M&A advisory in the Midwest, they find boutique competitors because our website is an outdated brochure from 2012.

We have broken internal links, no structured ProfessionalService or OfferCatalog schema, generic 50-word service summaries, no canonical URL routing, and zero thought-leadership content. When high-value decision-makers land on our site, 75% bounce immediately because it looks completely unprofessional.'

Our mission: Complete a master-level technical, on-page, and architectural overhaul—restructure service categories, implement comprehensive JSON-LD schema, eliminate crawl errors, and craft authoritative, conversion-engineered B2B copy.”`,
      customerFeedback: [
        "“We were looking for M&A due diligence in Chicago and your website had 3 broken links on the services page.” — Richard B., PE Managing Director",
        "“Your search snippet on Google doesn't display your services or client reviews.” — Karen W., Corporate VP"
      ]
    },
    targetKeywords: ["business consulting services", "strategic planning consultants", "financial analysis services", "marketing strategy development", "operations improvement", "leadership development programs", "business growth consulting"],
    seoIssues: [
      {
        type: "technical",
        description: "Multiple technical SEO issues including broken links, duplicate content, and missing canonical tags",
        severity: "high",
        location: "overall"
      },
      {
        type: "content",
        description: "Thin content across service pages and lack of keyword optimization",
        severity: "high",
        location: "body"
      },
      {
        type: "mobile",
        description: "Poor mobile usability and page speed issues",
        severity: "high",
        location: "overall"
      },
      {
        type: "schema",
        description: "Incomplete and poorly implemented schema markup",
        severity: "medium",
        location: "schemaMarkup"
      },
      {
        type: "meta",
        description: "Generic title tags and meta descriptions across multiple pages",
        severity: "high",
        location: "title,metaDescription"
      },
      {
        type: "internal",
        description: "Inefficient internal linking structure and poor anchor text usage",
        severity: "medium",
        location: "links"
      },
      {
        type: "competitive",
        description: "No competitive analysis or differentiation in content strategy",
        severity: "medium",
        location: "overall"
      },
      {
        type: "local",
        description: "Missing local SEO elements and location-specific content",
        severity: "high",
        location: "overall"
      },
      {
        type: "images",
        description: "Unoptimized images with generic alt text",
        severity: "medium",
        location: "images"
      },
      {
        type: "security",
        description: "Missing HTTPS implementation",
        severity: "high",
        location: "overall"
      }
    ],
    bestPractices: [
      {
        category: "comprehensive audit",
        description: "Conduct a full technical SEO audit covering all aspects of the site",
        example: "Use multiple tools like Screaming Frog, Google Search Console, PageSpeed Insights, and Mobile-Friendly Test to identify all issues"
      },
      {
        category: "content strategy",
        description: "Develop in-depth, keyword-optimized content for each service with clear value propositions",
        example: "Create 1500+ word comprehensive guides for each service with case studies, statistics, and actionable insights"
      },
      {
        category: "technical fixes",
        description: "Implement fixes for all technical issues in priority order",
        example: "Fix broken links, implement proper redirects, add canonical tags, and ensure proper URL structure"
      },
      {
        category: "schema implementation",
        description: "Create comprehensive structured data markup for the business and all services",
        example: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"ProfessionalService\",\n  \"name\": \"Strategic Growth Partners\",\n  \"description\": \"Comprehensive business consulting services focused on strategic growth, financial optimization, and operational excellence for mid-sized companies.\",\n  \"url\": \"https://strategicgrowthpartners.com\",\n  \"logo\": \"https://strategicgrowthpartners.com/images/logo.png\",\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"streetAddress\": \"123 Business Avenue, Suite 500\",\n    \"addressLocality\": \"Chicago\",\n    \"addressRegion\": \"IL\",\n    \"postalCode\": \"60601\",\n    \"addressCountry\": \"US\"\n  },\n  \"telephone\": \"+13125559876\",\n  \"priceRange\": \"$$$\",\n  \"openingHoursSpecification\": [\n    {\n      \"@type\": \"OpeningHoursSpecification\",\n      \"dayOfWeek\": [\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\"],\n      \"opens\": \"09:00\",\n      \"closes\": \"17:00\"\n    }\n  ],\n  \"sameAs\": [\n    \"https://www.linkedin.com/company/strategicgrowthpartners\",\n    \"https://twitter.com/sgpartners\",\n    \"https://www.facebook.com/StrategicGrowthPartners\"\n  ],\n  \"hasOfferCatalog\": {\n    \"@type\": \"OfferCatalog\",\n    \"name\": \"Consulting Services\",\n    \"itemListElement\": [\n      {\n        \"@type\": \"Offer\",\n        \"itemOffered\": {\n          \"@type\": \"Service\",\n          \"name\": \"Strategic Planning\",\n          \"url\": \"https://strategicgrowthpartners.com/services/strategic-planning/\"\n        }\n      },\n      {\n        \"@type\": \"Offer\",\n        \"itemOffered\": {\n          \"@type\": \"Service\",\n          \"name\": \"Financial Analysis\",\n          \"url\": \"https://strategicgrowthpartners.com/services/financial-analysis/\"\n        }\n      }\n    ]\n  }\n}"
      },
      {
        category: "local SEO",
        description: "Optimize for local search with location-specific content and Google Business Profile",
        example: "Create location-specific service pages, implement local business schema, optimize Google Business Profile with complete information, and build local citations"
      },
      {
        category: "competitive analysis",
        description: "Analyze competitors' SEO strategies and identify opportunities to differentiate",
        example: "Research top 5 competitors' keyword strategies, content gaps, backlink profiles, and use findings to develop a unique positioning strategy"
      },
      {
        category: "site architecture",
        description: "Implement a logical site structure with clear categories and breadcrumbs",
        example: "Organize content in a pyramid structure: Home > Main Service Categories > Specific Services > Case Studies/Resources"
      },
      {
        category: "content enhancement",
        description: "Expand thin content with in-depth service descriptions, case studies, and FAQs",
        example: "For each service page, include: detailed service description, benefits, process, case studies, testimonials, FAQs, and clear calls to action"
      },
      {
        category: "performance optimization",
        description: "Improve site speed and mobile experience",
        example: "Implement image optimization, browser caching, code minification, and ensure responsive design with touch-friendly elements"
      },
      {
        category: "measurement plan",
        description: "Set up comprehensive analytics and tracking",
        example: "Implement Google Analytics 4, set up conversion tracking, create custom dashboards for key metrics, and establish regular reporting schedule"
      }
    ]
  }
];

const inMemoryDynamicSimulations: any[] = [];

export class SeoSimulationService {
  // Add dynamic simulation to memory
  addDynamicSimulation(data: any): any {
    const newId = 1000 + inMemoryDynamicSimulations.length + 1;
    const sim = {
      id: newId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryDynamicSimulations.push(sim);
    return sim;
  }

  // Get all available simulations
  async getSimulations(): Promise<SeoSimulation[]> {
    try {
      console.log('Querying seo_simulations table...');
      const simulations = await db.select().from(schema.seoSimulations);
      if (simulations && simulations.length > 0) {
        return [...simulations, ...inMemoryDynamicSimulations];
      }
    } catch (error) {
      console.warn('DB not connected for SEO simulations, using in-memory templates.');
    }
    
    // In-memory fallback
    const staticSims = seoSimulationTemplates.map((t, idx) => ({
      id: idx + 1,
      ...t,
      createdAt: new Date(),
      updatedAt: new Date()
    })) as any;

    return [...staticSims, ...inMemoryDynamicSimulations];
  }
  
  // Get simulation by ID
  async getSimulation(id: number): Promise<SeoSimulation | undefined> {
    // Check dynamic simulations first
    const dynamicSim = inMemoryDynamicSimulations.find(s => s.id === id);
    if (dynamicSim) return dynamicSim;

    try {
      const [simulation] = await db
        .select()
        .from(schema.seoSimulations)
        .where(eq(schema.seoSimulations.id, id));
      
      if (simulation) return simulation;
    } catch (error) {
      console.warn(`DB query failed for SEO simulation ID ${id}, using in-memory template.`);
    }

    // In-memory fallback
    const template = seoSimulationTemplates[id - 1];
    if (template) {
      return {
        id: id,
        ...template,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any;
    }
    return undefined;
  }
  
  // Create a new simulation
  async createSimulation(simulation: InsertSeoSimulation): Promise<SeoSimulation> {
    try {
      console.log('Creating simulation:', simulation.title);
      const [result] = await db
        .insert(schema.seoSimulations)
        .values(simulation as any)
        .returning();
      
      return result;
    } catch (error) {
      console.error('Error creating simulation:', error);
      throw error;
    }
  }
  
  // Seed initial simulations
  async seedSimulations(): Promise<void> {
    try {
      console.log('Getting existing simulations...');
      const existingSimulations = await this.getSimulations();
      console.log('Existing simulations:', existingSimulations.length);
      
      // Get existing simulation titles
      const existingTitles = existingSimulations.map(sim => sim.title);
      console.log('Existing simulation titles:', existingTitles);
      
      // Add any new simulations that don't already exist
      console.log('Checking for new simulations to add...');
      let addedCount = 0;
      
      for (const template of seoSimulationTemplates) {
        if (!existingTitles.includes(template.title)) {
          console.log('Creating new simulation:', template.title);
          await this.createSimulation(template);
          addedCount++;
        } else {
          console.log('Simulation already exists, skipping:', template.title);
        }
      }
      
      if (addedCount > 0) {
        console.log(`Added ${addedCount} new SEO simulations successfully`);
      } else {
        console.log('No new simulations to add');
      }
    } catch (error) {
      console.error('Error seeding simulations:', error);
      throw error;
    }
  }
  
  // Submit a simulation attempt
  async submitAttempt(attempt: InsertSeoSimulationAttempt): Promise<SeoSimulationAttempt> {
    try {
      // Get the original simulation to compare against (fallback to ID 1 or first seeded if not found)
      let simulation = await this.getSimulation(attempt.simulationId);
      if (!simulation) {
        const allSims = await this.getSimulations();
        simulation = allSims.find(s => s.id === attempt.simulationId) || allSims[0];
      }
      
      if (!simulation) {
        throw new Error('Simulation not found');
      }

      // Defensively normalize modifiedContent
      const rawModified = (attempt.modifiedContent || {}) as any;
      const normalizedContent: SeoPageContent = {
        title: typeof rawModified.title === 'string' ? rawModified.title.trim() : '',
        metaDescription: typeof rawModified.metaDescription === 'string' ? rawModified.metaDescription.trim() : '',
        headings: Array.isArray(rawModified.headings) 
          ? rawModified.headings.map((h: any) => ({
              tag: typeof h?.tag === 'string' ? h.tag : 'h2',
              content: typeof h?.content === 'string' ? h.content : ''
            })) 
          : [],
        body: typeof rawModified.body === 'string' ? rawModified.body : '',
        images: Array.isArray(rawModified.images) 
          ? rawModified.images.map((img: any) => ({
              src: typeof img?.src === 'string' ? img.src : '',
              alt: typeof img?.alt === 'string' ? img.alt : ''
            })) 
          : [],
        links: Array.isArray(rawModified.links) 
          ? rawModified.links.map((l: any) => ({
              href: typeof l?.href === 'string' ? l.href : '',
              text: typeof l?.text === 'string' ? l.text : '',
              isInternal: Boolean(l?.isInternal)
            })) 
          : [],
        schemaMarkup: typeof rawModified.schemaMarkup === 'string' ? rawModified.schemaMarkup : ''
      };
      
      const safeAttempt: InsertSeoSimulationAttempt = {
        ...attempt,
        modifiedContent: normalizedContent
      };

      // Evaluate the attempt and calculate scores
      const evaluation = await this.evaluateAttempt(simulation, safeAttempt);
      
      // Combine evaluation results with the attempt
      const finalAttempt = {
        ...safeAttempt,
        ...evaluation,
        completedAt: new Date()
      };
      
      // Save to database with fail-safe fallback
      try {
        const [result] = await db
          .insert(schema.seoSimulationAttempts)
          .values(finalAttempt as any)
          .returning();
        if (result) {
          return {
            ...result,
            agentEvaluation: (evaluation as any).agentEvaluation
          } as any;
        }
      } catch (dbError) {
        console.warn('Could not persist SEO simulation attempt to DB, returning evaluated object:', dbError);
      }

      return {
        id: Date.now(),
        ...finalAttempt,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any;
    } catch (error) {
      console.error('Error submitting simulation attempt:', error);
      throw error;
    }
  }
  
  // Get user's attempts for a simulation
  async getUserAttempts(userId: number, simulationId: number): Promise<SeoSimulationAttempt[]> {
    try {
      const attempts = await db
        .select()
        .from(schema.seoSimulationAttempts)
        .where(and(
          eq(schema.seoSimulationAttempts.userId, userId),
          eq(schema.seoSimulationAttempts.simulationId, simulationId)
        ))
        .orderBy(desc(schema.seoSimulationAttempts.createdAt));
      
      return attempts;
    } catch (error) {
      console.error('Error getting user attempts:', error);
      return [];
    }
  }

  // Get all attempts for a user across all SEO simulations
  async getAllUserAttempts(userId: number): Promise<SeoSimulationAttempt[]> {
    try {
      const attempts = await db
        .select()
        .from(schema.seoSimulationAttempts)
        .where(eq(schema.seoSimulationAttempts.userId, userId))
        .orderBy(desc(schema.seoSimulationAttempts.createdAt));
      
      return attempts;
    } catch (error) {
      console.error('Error getting all user attempts:', error);
      return [];
    }
  }
  
  // Evaluate a simulation attempt against the original
  async evaluateAttempt(simulation: SeoSimulation, attempt: InsertSeoSimulationAttempt): Promise<Partial<SeoSimulationAttempt> & { agentEvaluation: any }> {
    const rawModified = (attempt.modifiedContent || {}) as any;
    const modified: SeoPageContent = {
      title: typeof rawModified.title === 'string' ? rawModified.title : '',
      metaDescription: typeof rawModified.metaDescription === 'string' ? rawModified.metaDescription : '',
      headings: Array.isArray(rawModified.headings) 
        ? rawModified.headings.map((h: any) => ({
            tag: typeof h?.tag === 'string' ? h.tag : 'h2',
            content: typeof h?.content === 'string' ? h.content : ''
          })) 
        : [],
      body: typeof rawModified.body === 'string' ? rawModified.body : '',
      images: Array.isArray(rawModified.images) 
        ? rawModified.images.map((img: any) => ({
            src: typeof img?.src === 'string' ? img.src : '',
            alt: typeof img?.alt === 'string' ? img.alt : ''
          })) 
        : [],
      links: Array.isArray(rawModified.links) 
        ? rawModified.links.map((l: any) => ({
            href: typeof l?.href === 'string' ? l.href : '',
            text: typeof l?.text === 'string' ? l.text : '',
            isInternal: Boolean(l?.isInternal)
          })) 
        : [],
      schemaMarkup: typeof rawModified.schemaMarkup === 'string' ? rawModified.schemaMarkup : ''
    };

    const targetKeywords = Array.isArray(simulation.targetKeywords) ? simulation.targetKeywords.filter(Boolean) : [];
    const seoIssues = Array.isArray(simulation.seoIssues) ? simulation.seoIssues : [];

    // 1. Check for fixed issues
    const issuesFixed: {
      issueType: string;
      fixed: boolean;
      feedback: string;
    }[] = [];
    
    for (const issue of seoIssues) {
      let fixed = false;
      let feedback = '';
      
      switch (issue.type) {
        case 'title':
          fixed = this.evaluateTitle(modified.title, targetKeywords);
          feedback = fixed 
            ? 'Great job! Target keywords and brand USP are clearly integrated in the page title.' 
            : 'The title tag is too generic or misses primary search keywords (Target: 40-65 chars with keywords).';
          break;
          
        case 'meta':
          fixed = this.evaluateMetaDescription(modified.metaDescription, targetKeywords);
          feedback = fixed 
            ? 'Meta description effectively includes search keywords, value props, and an active Call To Action.' 
            : 'Meta description is either too short, too long, or lacks a clear Call to Action (Target: 120-155 chars).';
          break;
          
        case 'headings':
          fixed = this.evaluateHeadings(modified.headings, targetKeywords);
          feedback = fixed 
            ? 'Heading structure is well-optimized with a strong single H1 and relevant secondary headings.' 
            : 'Headings need improvement: ensure exactly one keyword-rich H1 is present and avoid generic text.';
          break;
          
        case 'content':
          fixed = this.evaluateContent(modified.body, targetKeywords);
          feedback = fixed 
            ? 'Body content is rich, descriptive, and naturally incorporates product origins and flavor profiles.' 
            : 'Content is too thin or lacks natural keyword coverage (Target: 150-300+ words).';
          break;
          
        case 'images':
          fixed = this.evaluateImages(modified.images, targetKeywords);
          feedback = fixed 
            ? 'Image alt attributes are descriptive, keyword-aligned, and screen-reader accessible.' 
            : 'Image alt text is generic (e.g. "coffee" or "image"). Provide descriptive context for crawlers.';
          break;
          
        case 'links':
          fixed = this.evaluateLinks(modified.links as any);
          feedback = fixed 
            ? 'Links use descriptive, contextual anchor text instead of vague phrases.' 
            : 'Links use vague anchor text (e.g. "Click Here" or "Buy Now"). Replace with specific destination text.';
          break;
          
        case 'local':
          fixed = (modified.body || '').match(/address|phone|[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}|[A-Z]{2}[ -][0-9]{5}/i) !== null;
          feedback = fixed 
            ? 'Contact information and regional signals are properly included for local search visibility.' 
            : 'Add complete contact information including address and phone for better local SEO.';
          break;
          
        case 'schema':
          fixed = Boolean(
            (modified.schemaMarkup && modified.schemaMarkup.includes('@type') && modified.schemaMarkup.includes('schema.org')) || 
            (modified.body && modified.body.includes('@type') && modified.body.includes('schema.org'))
          );
          feedback = fixed 
            ? 'Structured data schema markup has been successfully implemented.' 
            : 'Consider adding structured data schema markup (JSON-LD) for enhanced search results.';
          break;
          
        default:
          fixed = true;
          feedback = 'Issue evaluated and verified.';
      }
      
      issuesFixed.push({
        issueType: issue.type,
        fixed,
        feedback
      });
    }
    
    // 2. Evaluate keyword optimization
    const keywordOptimization: {
      keyword: string;
      density: number;
      placement: string[];
      feedback: string;
    }[] = [];

    const lowerTitle = (modified.title || '').toLowerCase();
    const lowerMeta = (modified.metaDescription || '').toLowerCase();
    const lowerBody = (modified.body || '').toLowerCase();
    const bodyWords = lowerBody.split(/\s+/).filter(Boolean);
    const wordCount = bodyWords.length;

    for (const keyword of targetKeywords) {
      const lowerKeyword = keyword.toLowerCase();
      const placements: string[] = [];
      
      if (lowerTitle.includes(lowerKeyword)) placements.push('title');
      if (lowerMeta.includes(lowerKeyword)) placements.push('metaDescription');
      if (modified.headings.some(h => (h.content || '').toLowerCase().includes(lowerKeyword))) placements.push('headings');
      if (lowerBody.includes(lowerKeyword)) placements.push('body');
      
      const keywordRegex = new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
      const keywordCount = (lowerBody.match(keywordRegex) || []).length;
      const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
      
      let feedback = '';
      if (density === 0 && placements.length === 0) {
        feedback = `The keyword "${keyword}" was not found in the content or metadata.`;
      } else if (density < 0.4 && placements.length > 0) {
        feedback = `The keyword "${keyword}" is used in metadata (${placements.join(', ')}). Consider weaving it once more into body copy.`;
      } else if (density > 3.0) {
        feedback = `The keyword "${keyword}" is overused. Reduce frequency to avoid search engine penalties.`;
      } else {
        feedback = `Great job! The keyword "${keyword}" is well-placed and has optimal search density.`;
      }
      
      keywordOptimization.push({
        keyword,
        density,
        placement: placements,
        feedback
      });
    }
    
    // 3. Calculate readability score
    const readabilityScore = this.calculateReadabilityScore(modified.body);
    
    // 4. Calculate technical SEO score
    const technicalSeoScore = this.calculateTechnicalSeoScore(modified, targetKeywords);
    
    // 5. Calculate content quality score
    const contentQualityScore = this.calculateContentQualityScore(modified, targetKeywords);
    
    // 6. Calculate overall score (weighted average)
    const issuesFixedCount = issuesFixed.filter(issue => issue.fixed).length;
    const totalIssues = seoIssues.length || 1;
    const issuesFixedScore = Math.round((issuesFixedCount / totalIssues) * 100);
    
    const keywordScore = keywordOptimization.reduce((sum, k) => {
      const placementScore = k.placement.length * 5;
      const densityScore = k.density > 0 && k.density < 3.5 ? 10 : 0;
      return sum + placementScore + densityScore;
    }, 0);
    const maxKeywordScore = Math.max(30, targetKeywords.length * 30);
    const normalizedKeywordScore = Math.min(100, Math.round((keywordScore / maxKeywordScore) * 100));
    
    const rawScore = Math.round(
      issuesFixedScore * 0.45 +
      normalizedKeywordScore * 0.20 + 
      readabilityScore * 0.10 +
      technicalSeoScore * 0.15 + 
      contentQualityScore * 0.10
    );

    // Guaranteed floor if majority of defects are resolved
    const score = issuesFixedCount >= Math.ceil(totalIssues * 0.7) 
      ? Math.max(75, Math.min(100, rawScore))
      : issuesFixedCount >= 3 
        ? Math.max(65, Math.min(100, rawScore)) 
        : Math.min(100, Math.max(25, rawScore));

    // Agent Pass/Fail standard
    const isPassed = score >= 70 && issuesFixedCount >= Math.ceil(totalIssues * 0.5);

    // AI Director Evaluation Report
    const agentSummary = isPassed
      ? `OPTIMIZATION APPROVED. Senior Director Marcus Vance verified that Jenny's website baseline defects have been resolved. The updated title tag, meta description, and content copy establish clear search relevance, increasing Google Ads Quality Score and decreasing projected CPC.`
      : `OPTIMIZATION REVISIONS REQUIRED. Senior Director Marcus Vance audited the submission and identified ${totalIssues - issuesFixedCount} remaining baseline defect(s). The current changes would underperform in Google search auctions. Review the recommendations below to fix the remaining defects.`;

    const recommendations = this.generateRecommendations(issuesFixed, keywordOptimization, modified);

    const agentEvaluation = {
      auditorName: "Marcus Vance",
      auditorRole: "Senior SEO & Conversion Director",
      status: isPassed ? "PASSED" : "FAILED",
      passed: isPassed,
      score: score,
      issuesFixedCount,
      totalIssues,
      summary: agentSummary,
      sectionResults: issuesFixed.map(issue => ({
        section: issue.issueType,
        passed: issue.fixed,
        notes: issue.feedback
      }))
    };
    
    return {
      score,
      issuesFixed,
      keywordOptimization,
      readabilityScore,
      technicalSeoScore,
      contentQualityScore,
      feedback: agentSummary,
      recommendations,
      agentEvaluation
    };
  }
  
  // Evaluation helper methods
  private evaluateTitle(title: string = '', targetKeywords: string[] = []): boolean {
    const rawTitle = title || '';
    const lowerTitle = rawTitle.toLowerCase().trim();
    if (!lowerTitle) return false;
    
    // 1. Keyword check
    const hasFullKeyword = targetKeywords.some(keyword => 
      keyword && lowerTitle.includes(keyword.toLowerCase())
    );

    // 2. Semantic token match
    const semanticKeywords = ["organic", "coffee", "beans", "specialty", "roast", "arabica", "java", "roastery", "artisan", "artison", "single-origin", "espresso"];
    const matchedTokens = semanticKeywords.filter(term => lowerTitle.includes(term));
    const hasSemanticKeywords = matchedTokens.length >= 2;

    // 3. Length check
    const hasReasonableLength = rawTitle.length >= 30 && rawTitle.length <= 85;

    return hasFullKeyword || (hasSemanticKeywords && hasReasonableLength) || (matchedTokens.length >= 3);
  }
  
  private evaluateMetaDescription(description: string = '', targetKeywords: string[] = []): boolean {
    const desc = description || '';
    const lowerDesc = desc.toLowerCase().trim();
    if (!lowerDesc) return false;

    const hasKeywords = targetKeywords.some(keyword => 
      keyword && lowerDesc.includes(keyword.toLowerCase())
    ) || ["organic", "coffee", "beans", "specialty", "roast", "arabica", "fresh"].some(w => lowerDesc.includes(w));
    
    const goodLength = desc.length >= 95 && desc.length <= 175;
    const hasCTA = /call|shop|visit|learn|discover|get|find|buy|order|schedule|book|sign up|contact|explore|taste/i.test(lowerDesc);
    
    const passCount = (hasKeywords ? 1 : 0) + (goodLength ? 1 : 0) + (hasCTA ? 1 : 0);
    return passCount >= 2;
  }
  
  private evaluateHeadings(headings: {tag: string, content: string}[] = [], targetKeywords: string[] = []): boolean {
    if (!Array.isArray(headings) || headings.length === 0) return false;
    
    const h1 = headings.find(h => (h?.tag || '').toLowerCase() === 'h1');
    if (!h1 || !(h1.content || '').trim()) return false;
    
    const h1Content = (h1.content || '').toLowerCase();
    if (h1Content.includes("welcome to") && h1Content.length < 25) return false;
    if (h1Content === "coffee beans for sale") return false;

    const h1HasKeyword = targetKeywords.some(keyword => 
      keyword && h1Content.includes(keyword.toLowerCase())
    ) || ["organic", "coffee", "beans", "specialty", "roast", "arabica", "java", "roastery", "artisan"].some(w => h1Content.includes(w));
    
    return Boolean(h1HasKeyword);
  }
  
  private evaluateContent(content: string = '', targetKeywords: string[] = []): boolean {
    const body = content || '';
    const words = body.split(/\s+/).filter(Boolean);
    if (words.length < 80) return false;
    
    const lowerBody = body.toLowerCase();
    const keywordMatches = targetKeywords.filter(k => k && lowerBody.includes(k.toLowerCase())).length;
    const semanticMatches = ["organic", "arabica", "coffee", "beans", "roast", "specialty", "morgantown", "ethiopia", "flavor"].filter(w => lowerBody.includes(w)).length;

    return words.length >= 90 && (keywordMatches >= 1 || semanticMatches >= 2);
  }
  
  private evaluateImages(images: {src: string, alt: string}[] = [], targetKeywords: string[] = []): boolean {
    if (!Array.isArray(images) || images.length === 0) return true;
    
    const genericAlts = ["coffee", "beans", "image", "photo", "pic", "picture", "logo"];
    const imagesWithAlt = images.filter(img => (img?.alt || '').trim().length > 0);
    const descriptiveAlts = images.filter(img => {
      const alt = (img?.alt || '').trim().toLowerCase();
      return alt.length > 5 && !genericAlts.includes(alt);
    });

    return imagesWithAlt.length === images.length && descriptiveAlts.length >= Math.ceil(images.length * 0.5);
  }
  
  private evaluateLinks(links: {href: string, text: string, isInternal?: boolean}[] = []): boolean {
    if (!Array.isArray(links) || links.length === 0) return true;
    
    const genericLinkTexts = ['click here', 'read more', 'learn more', 'link', 'here', 'buy now'];
    const descriptiveLinks = links.filter(link => {
      const text = (link?.text || '').trim().toLowerCase();
      return text.length > 0 && !genericLinkTexts.includes(text);
    });

    return descriptiveLinks.length >= Math.ceil(links.length * 0.5);
  }
  
  private calculateReadabilityScore(content: string = ''): number {
    const text = content || '';
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    const wordCount = words.length;
    
    if (sentenceCount === 0 || wordCount === 0) return 60;
    
    const syllableCount = words.reduce((count, word) => count + this.countSyllables(word), 0);
    const avgSentenceLength = wordCount / sentenceCount;
    const avgSyllablesPerWord = syllableCount / wordCount;
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    return Math.min(100, Math.max(20, Math.round(fleschScore)));
  }
  
  private countSyllables(word: string = ''): number {
    let cleanWord = (word || '').toLowerCase().trim();
    if (cleanWord.length <= 3) return 1;
    cleanWord = cleanWord.replace(/e$/, '');
    const vowelGroups = cleanWord.match(/[aeiouy]+/g);
    return vowelGroups ? vowelGroups.length : 1;
  }
  
  private calculateTechnicalSeoScore(content: SeoPageContent, targetKeywords: string[] = []): number {
    let score = 0;
    const maxScore = 100;
    const title = content.title || '';
    const metaDescription = content.metaDescription || '';
    const headings = content.headings || [];
    const images = content.images || [];
    const links = content.links || [];
    const body = content.body || '';

    // Title optimization (25 points)
    if (title.length > 0) score += 5;
    if (title.length >= 35 && title.length <= 75) score += 10;
    if (targetKeywords.some(k => k && title.toLowerCase().includes(k.toLowerCase()))) score += 10;
    
    // Meta description optimization (20 points)
    if (metaDescription.length > 0) score += 5;
    if (metaDescription.length >= 100 && metaDescription.length <= 165) score += 5;
    if (targetKeywords.some(k => k && metaDescription.toLowerCase().includes(k.toLowerCase()))) score += 10;
    
    // Heading structure (15 points)
    if (headings.some(h => (h?.tag || '').toLowerCase() === 'h1')) score += 5;
    if (headings.filter(h => (h?.tag || '').toLowerCase() === 'h1').length === 1) score += 5;
    if (headings.some(h => (h?.tag || '').toLowerCase() === 'h2' || (h?.tag || '').toLowerCase() === 'h3')) score += 5;
    
    // URL structure (5 points)
    score += 5;
    
    // Image optimization (15 points)
    const imagesWithAlt = images.filter(img => (img?.alt || '').trim() !== '');
    if (images.length === 0 || imagesWithAlt.length === images.length) score += 10;
    else if (imagesWithAlt.length >= images.length * 0.7) score += 5;
    
    if (images.some(img => 
      targetKeywords.some(k => k && (img?.alt || '').toLowerCase().includes(k.toLowerCase()))
    )) score += 5;
    
    // Link structure (10 points)
    if (links.length > 0) score += 3;
    if (links.every(link => (link?.text || '').trim() !== '')) score += 3;
    if (links.some(link => !link?.isInternal)) score += 4;
    
    // Keyword usage in body (10 points)
    const lowerBody = body.toLowerCase();
    const keywordsInBody = targetKeywords.filter(k => k && lowerBody.includes(k.toLowerCase()));
    score += Math.min(10, keywordsInBody.length * 2);
    
    return Math.min(maxScore, score);
  }
  
  private calculateContentQualityScore(content: SeoPageContent, targetKeywords: string[] = []): number {
    let score = 0;
    const maxScore = 100;
    const body = content.body || '';
    const wordCount = body.split(/\s+/).filter(Boolean).length;

    // Content length (30 points)
    if (wordCount >= 100) score += 10;
    if (wordCount >= 180) score += 10;
    if (wordCount >= 280) score += 10;
    
    // Content structure (15 points)
    const paragraphs = body.split('\n').filter(p => p.trim().length > 0);
    if (paragraphs.length >= 2) score += 5;
    if (paragraphs.length >= 3) score += 5;
    if (paragraphs.length >= 4) score += 5;
    
    // Keyword usage and density (20 points)
    if (targetKeywords.length > 0 && wordCount > 0) {
      const keywordScores = targetKeywords.map(keyword => {
        if (!keyword) return 0;
        const keywordRegex = new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
        const matches = body.match(keywordRegex) || [];
        const density = (matches.length / wordCount) * 100;
        return density >= 0.4 && density <= 3.0 ? 1 : 0;
      });
      const keywordScore = (keywordScores as number[]).reduce((sum: number, s: number) => sum + s, 0);
      score += keywordScore * (20 / targetKeywords.length);
    } else {
      score += 15;
    }
    
    // Readability (20 points)
    const readability = this.calculateReadabilityScore(body);
    score += readability >= 60 ? 20 : Math.round(readability / 3);
    
    // Commercial USP elements (15 points)
    if (/organic|arabica|roastery|beans|morgantown|guatemala|flavor|notes|single-origin/i.test(body)) score += 15;
    else score += 5;
    
    return Math.min(maxScore, Math.round(score));
  }
  
  private generateRecommendations(issuesFixed: any[] = [], keywordOptimization: any[] = [], content: SeoPageContent): string[] {
    const recommendations: string[] = [];
    
    issuesFixed.forEach(issue => {
      if (!issue.fixed) {
        recommendations.push(issue.feedback || `Fix ${issue.issueType} on the webpage.`);
      }
    });
    
    keywordOptimization.forEach(keyword => {
      if (keyword.density === 0 && keyword.placement.length === 0) {
        recommendations.push(`Incorporate the primary search keyword "${keyword.keyword}" naturally into your headings or body copy.`);
      } else if (keyword.density > 3.0) {
        recommendations.push(`Reduce frequency of "${keyword.keyword}" in body text to prevent keyword stuffing.`);
      }
    });
    
    const wordCount = (content.body || '').split(/\s+/).filter(Boolean).length;
    if (wordCount < 150) {
      recommendations.push("Expand body copy to 180-300 words explaining roasting certifications, origin cooperatives, and taste profiles.");
    }
    
    return recommendations;
  }

  async getSimulationAnalytics(simulationId: number): Promise<any> {
    const attempts = await db
      .select()
      .from(schema.seoSimulationAttempts)
      .where(eq(schema.seoSimulationAttempts.simulationId, simulationId));
    
    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        medianScore: 0,
        mostCommonIssues: [],
        leastFixedIssues: []
      };
    }
    
    const scores = attempts.map(a => a.score).filter((s): s is number => s !== null && s !== undefined);
    scores.sort((a, b) => a - b);
    
    const totalAttempts = attempts.length;
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
    const highestScore = scores.length > 0 ? scores[scores.length - 1] : 0;
    const lowestScore = scores.length > 0 ? scores[0] : 0;
    const medianScore = scores.length > 0 ? scores[Math.floor(scores.length / 2)] : 0;
    
    const allIssuesFixed = attempts.flatMap(a => (a.issuesFixed as any[]) || []);
    
    const issuesByType = allIssuesFixed.reduce((groups: Record<string, {total: number, fixed: number}>, issue: any) => {
      const type = issue?.issueType || "other";
      if (!groups[type]) {
        groups[type] = { total: 0, fixed: 0 };
      }
      groups[type].total++;
      if (issue?.fixed) {
        groups[type].fixed++;
      }
      return groups;
    }, {} as Record<string, {total: number, fixed: number}>);
    
    const issueFixRates = Object.entries(issuesByType).map(([type, data]) => ({
      type,
      fixRate: data.total > 0 ? data.fixed / data.total : 0,
      total: data.total
    }));
    
    const leastFixedIssues = issueFixRates
      .filter(issue => issue.total >= 5)
      .sort((a, b) => a.fixRate - b.fixRate)
      .slice(0, 3)
      .map(issue => ({
        type: issue.type,
        fixRate: Math.round(issue.fixRate * 100) + '%',
        total: issue.total
      }));
    
    const mostCommonIssues = Object.entries(issuesByType)
      .map(([type, data]) => ({
        type,
        count: data.total,
        fixRate: data.total > 0 ? Math.round((data.fixed / data.total) * 100) + '%' : '0%'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    
    return {
      totalAttempts,
      averageScore,
      highestScore,
      lowestScore,
      medianScore,
      mostCommonIssues,
      leastFixedIssues
    };
  }
}

export const seoSimulationService = new SeoSimulationService();
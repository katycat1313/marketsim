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
    bestPractices: [
      {
        category: "title",
        description: "Include primary keywords near the beginning of the title, keep it under 60 characters",
        example: "Organic Arabica Coffee Beans | Fresh Roasted Specialty Coffee"
      },
      {
        category: "meta",
        description: "Write a compelling description that includes keywords and a call to action, keep it under 155 characters",
        example: "Shop our premium single-origin, organic Arabica coffee beans, roasted fresh weekly. Free shipping on specialty coffee orders over $30!"
      },
      {
        category: "headings",
        description: "Use a clear hierarchy with H1 for the main title and H2/H3 for sections, include keywords naturally",
        example: "H1: Organic Arabica Coffee Beans from Ethiopia\nH2: Single-Origin Specialty Coffee Characteristics\nH2: Fresh Roasted Beans: Shipping & Storage"
      },
      {
        category: "content",
        description: "Write detailed, unique content that provides value, naturally incorporating keywords",
        example: "Our organic Arabica coffee beans are sourced directly from small farms in Ethiopia's Yirgacheffe region, known for producing some of the world's finest specialty coffee. Each batch of these single-origin beans is roasted in small batches to ensure peak freshness and flavor..."
      },
      {
        category: "images",
        description: "Use descriptive, keyword-rich alt text that accurately describes the image",
        example: "alt=\"Freshly roasted organic Arabica coffee beans from Ethiopia\""
      },
      {
        category: "links",
        description: "Use descriptive anchor text that gives users and search engines context",
        example: "\"Browse our Ethiopian single-origin coffee selection\" instead of \"Click here\""
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

export class SeoSimulationService {
  // Get all available simulations
  async getSimulations(): Promise<SeoSimulation[]> {
    try {
      console.log('Querying seo_simulations table...');
      // Use the imported schema type instead of a string
      const simulations = await db.select().from(schema.seoSimulations);
      console.log('Found simulations:', simulations.length);
      return simulations;
    } catch (error) {
      console.error('Error getting simulations:', error);
      throw error;
    }
  }
  
  // Get simulation by ID
  async getSimulation(id: number): Promise<SeoSimulation | undefined> {
    try {
      const [simulation] = await db
        .select()
        .from(schema.seoSimulations)
        .where(eq(schema.seoSimulations.id, id));
      
      return simulation;
    } catch (error) {
      console.error('Error getting simulation by ID:', error);
      return undefined;
    }
  }
  
  // Create a new simulation
  async createSimulation(simulation: InsertSeoSimulation): Promise<SeoSimulation> {
    try {
      console.log('Creating simulation:', simulation.title);
      const [result] = await db
        .insert(schema.seoSimulations)
        .values([simulation])
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
      
      if (existingSimulations.length === 0) {
        console.log('No existing simulations found, seeding...');
        for (const template of seoSimulationTemplates) {
          console.log('Creating simulation:', template.title);
          await this.createSimulation(template);
        }
        console.log('SEO simulations seeded successfully');
      } else {
        console.log('Simulations already exist, skipping seed');
      }
    } catch (error) {
      console.error('Error seeding simulations:', error);
      throw error;
    }
  }
  
  // Submit a simulation attempt
  async submitAttempt(attempt: InsertSeoSimulationAttempt): Promise<SeoSimulationAttempt> {
    try {
      // Get the original simulation to compare against
      const simulation = await this.getSimulation(attempt.simulationId);
      
      if (!simulation) {
        throw new Error('Simulation not found');
      }
      
      // Evaluate the attempt and calculate scores
      const evaluation = await this.evaluateAttempt(simulation, attempt);
      
      // Combine evaluation results with the attempt
      const finalAttempt: InsertSeoSimulationAttempt = {
        ...attempt,
        ...evaluation,
        completedAt: new Date()
      };
      
      // Save to database
      const [result] = await db
        .insert(schema.seoSimulationAttempts)
        .values([finalAttempt])
        .returning();
      
      return result;
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
  
  // Evaluate a simulation attempt against the original
  async evaluateAttempt(simulation: SeoSimulation, attempt: InsertSeoSimulationAttempt): Promise<Partial<SeoSimulationAttempt>> {
    // Initialize evaluation metrics
    const issuesFixed: {
      issueType: string;
      fixed: boolean;
      feedback: string;
    }[] = [];
    
    const keywordOptimization: {
      keyword: string;
      density: number;
      placement: string[];
      feedback: string;
    }[] = [];
    
    // Get the original and modified content
    const original = simulation.originalContent as SeoPageContent;
    const modified = attempt.modifiedContent as SeoPageContent;
    
    // 1. Check for fixed issues
    for (const issue of simulation.seoIssues) {
      let fixed = false;
      let feedback = '';
      
      switch (issue.type) {
        case 'title':
          fixed = this.evaluateTitle(modified.title, simulation.targetKeywords);
          feedback = fixed 
            ? 'Great job including target keywords in the title!' 
            : 'The title could be improved by including more targeted keywords.';
          break;
          
        case 'meta':
          fixed = this.evaluateMetaDescription(modified.metaDescription, simulation.targetKeywords);
          feedback = fixed 
            ? 'Meta description effectively includes keywords and is a good length.' 
            : 'Consider improving your meta description with more relevant keywords.';
          break;
          
        case 'headings':
          fixed = this.evaluateHeadings(modified.headings, simulation.targetKeywords);
          feedback = fixed 
            ? 'Headings structure is well-optimized with relevant keywords.' 
            : 'Headings could use more keyword optimization and better hierarchy.';
          break;
          
        case 'content':
          fixed = this.evaluateContent(modified.body, simulation.targetKeywords);
          feedback = fixed 
            ? 'Content is well-optimized with good keyword usage and length.' 
            : 'The content could benefit from more detailed information and natural keyword inclusion.';
          break;
          
        case 'images':
          fixed = this.evaluateImages(modified.images, simulation.targetKeywords);
          feedback = fixed 
            ? 'Image alt attributes are well-optimized with relevant keywords.' 
            : 'Image alt text should be more descriptive and include relevant keywords.';
          break;
          
        case 'links':
          fixed = this.evaluateLinks(modified.links);
          feedback = fixed 
            ? 'Links have descriptive anchor text which helps with SEO.' 
            : 'Consider using more descriptive anchor text for links.';
          break;
          
        case 'local':
          fixed = modified.body.match(/address|phone|[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}|[A-Z]{2}[ -][0-9]{5}/i) !== null;
          feedback = fixed 
            ? 'Contact information is properly included for local SEO.' 
            : 'Add complete contact information including address and phone for better local SEO.';
          break;
          
        case 'schema':
          // Check for schema markup in dedicated field or body content
          fixed = (modified.schemaMarkup && 
                  modified.schemaMarkup.includes('@type') && 
                  modified.schemaMarkup.includes('schema.org')) || 
                  (modified.body.includes('@type') && 
                  modified.body.includes('schema.org'));
          feedback = fixed 
            ? 'Schema markup has been properly implemented.' 
            : 'Consider adding structured data schema markup for better local business visibility.';
          break;
      }
      
      issuesFixed.push({
        issueType: issue.type,
        fixed,
        feedback
      });
    }
    
    // 2. Evaluate keyword optimization
    for (const keyword of simulation.targetKeywords) {
      const placements: string[] = [];
      
      // Check title
      if (modified.title.toLowerCase().includes(keyword.toLowerCase())) {
        placements.push('title');
      }
      
      // Check meta description
      if (modified.metaDescription.toLowerCase().includes(keyword.toLowerCase())) {
        placements.push('metaDescription');
      }
      
      // Check headings
      if (modified.headings.some(h => h.content.toLowerCase().includes(keyword.toLowerCase()))) {
        placements.push('headings');
      }
      
      // Check content
      if (modified.body.toLowerCase().includes(keyword.toLowerCase())) {
        placements.push('body');
      }
      
      // Calculate keyword density
      const keywordRegex = new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
      const wordCount = modified.body.split(/\s+/).length;
      const keywordCount = (modified.body.match(keywordRegex) || []).length;
      const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
      
      // Generate feedback
      let feedback = '';
      if (density === 0) {
        feedback = `The keyword "${keyword}" was not found in the content.`;
      } else if (density < 0.5) {
        feedback = `The keyword "${keyword}" has a low density. Consider using it more frequently.`;
      } else if (density > 2.5) {
        feedback = `The keyword "${keyword}" may be overused. Consider reducing frequency to avoid keyword stuffing.`;
      } else {
        feedback = `Great job! The keyword "${keyword}" has an optimal density.`;
      }
      
      keywordOptimization.push({
        keyword,
        density,
        placement: placements,
        feedback
      });
    }
    
    // 3. Calculate readability score (simplified Flesch-Kincaid)
    const readabilityScore = this.calculateReadabilityScore(modified.body);
    
    // 4. Calculate technical SEO score
    const technicalSeoScore = this.calculateTechnicalSeoScore(modified, simulation.targetKeywords);
    
    // 5. Calculate content quality score
    const contentQualityScore = this.calculateContentQualityScore(modified, simulation.targetKeywords);
    
    // 6. Calculate overall score (weighted average)
    const issuesFixedCount = issuesFixed.filter(issue => issue.fixed).length;
    const issuesFixedScore = Math.round((issuesFixedCount / simulation.seoIssues.length) * 100);
    
    const keywordScore = keywordOptimization.reduce((sum, k) => {
      // Higher score for more placements and optimal density
      const placementScore = k.placement.length * 5; // 5 points per placement
      const densityScore = k.density > 0 && k.density < 3 ? 10 : 0; // 10 points for optimal density
      return sum + placementScore + densityScore;
    }, 0);
    const maxKeywordScore = simulation.targetKeywords.length * 30; // Max 30 points per keyword
    const normalizedKeywordScore = Math.round((keywordScore / maxKeywordScore) * 100);
    
    // Weight the different components
    const score = Math.round(
      issuesFixedScore * 0.4 +
      normalizedKeywordScore * 0.2 + 
      readabilityScore * 0.1 +
      technicalSeoScore * 0.2 + 
      contentQualityScore * 0.1
    );
    
    // 7. Generate overall feedback and recommendations
    const feedback = this.generateOverallFeedback(score, issuesFixed, keywordOptimization);
    const recommendations = this.generateRecommendations(issuesFixed, keywordOptimization, modified);
    
    return {
      score,
      issuesFixed,
      keywordOptimization,
      readabilityScore,
      technicalSeoScore,
      contentQualityScore,
      feedback,
      recommendations
    };
  }
  
  // Evaluation helper methods
  private evaluateTitle(title: string, targetKeywords: string[]): boolean {
    // Check if title contains any target keywords
    const hasKeywords = targetKeywords.some(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Check if title is an appropriate length (50-60 chars)
    const goodLength = title.length >= 50 && title.length <= 60;
    
    // Title should start with a keyword for best SEO
    const startsWithKeyword = targetKeywords.some(keyword => 
      title.toLowerCase().startsWith(keyword.toLowerCase()) ||
      title.toLowerCase().startsWith('the ' + keyword.toLowerCase()) ||
      title.toLowerCase().startsWith('a ' + keyword.toLowerCase()) ||
      title.toLowerCase().startsWith('best ' + keyword.toLowerCase())
    );
    
    // Return true if at least 2 of the 3 criteria are met
    const score = (hasKeywords ? 1 : 0) + (goodLength ? 1 : 0) + (startsWithKeyword ? 1 : 0);
    return score >= 2;
  }
  
  private evaluateMetaDescription(description: string, targetKeywords: string[]): boolean {
    // Check if description contains any target keywords
    const hasKeywords = targetKeywords.some(keyword => 
      description.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Check if description is an appropriate length (120-155 chars)
    const goodLength = description.length >= 120 && description.length <= 155;
    
    // Check if description has a call to action
    const hasCTA = /call|shop|visit|learn|discover|get|find|buy|order|schedule|book|sign up|contact/i.test(description);
    
    // Return true if at least 2 of the 3 criteria are met
    const score = (hasKeywords ? 1 : 0) + (goodLength ? 1 : 0) + (hasCTA ? 1 : 0);
    return score >= 2;
  }
  
  private evaluateHeadings(headings: {tag: string, content: string}[], targetKeywords: string[]): boolean {
    if (headings.length === 0) return false;
    
    // Check if H1 exists and contains a keyword
    const h1 = headings.find(h => h.tag === 'h1');
    const h1HasKeyword = h1 ? targetKeywords.some(keyword => 
      h1.content.toLowerCase().includes(keyword.toLowerCase())
    ) : false;
    
    // Check if there's a good heading hierarchy (h1, h2, etc.)
    const hasH1 = headings.some(h => h.tag === 'h1');
    const hasH2 = headings.some(h => h.tag === 'h2');
    const goodHierarchy = hasH1 && hasH2;
    
    // Check if subheadings contain keywords
    const subheadingsWithKeywords = headings
      .filter(h => h.tag !== 'h1')
      .some(h => targetKeywords.some(keyword => 
        h.content.toLowerCase().includes(keyword.toLowerCase())
      ));
    
    // Return true if at least 2 of the 3 criteria are met
    const score = (h1HasKeyword ? 1 : 0) + (goodHierarchy ? 1 : 0) + (subheadingsWithKeywords ? 1 : 0);
    return score >= 2;
  }
  
  private evaluateContent(content: string, targetKeywords: string[]): boolean {
    // Check content length (at least 300 words for basic SEO)
    const words = content.split(/\s+/);
    const goodLength = words.length >= 300;
    
    // Check keyword density (1-3% is generally good)
    const keywordDensities = targetKeywords.map(keyword => {
      const keywordRegex = new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
      const matches = content.match(keywordRegex) || [];
      return matches.length / words.length * 100;
    });
    
    const optimalDensity = keywordDensities.some(density => density >= 0.5 && density <= 3);
    
    // Check for content structure (paragraphs)
    const hasParagraphs = content.split('\n').filter(p => p.trim().length > 0).length >= 3;
    
    // Return true if at least 2 of the 3 criteria are met
    const score = (goodLength ? 1 : 0) + (optimalDensity ? 1 : 0) + (hasParagraphs ? 1 : 0);
    return score >= 2;
  }
  
  private evaluateImages(images: {src: string, alt: string}[], targetKeywords: string[]): boolean {
    if (images.length === 0) return false;
    
    // Count images with alt text
    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '');
    const allHaveAlt = imagesWithAlt.length === images.length;
    
    // Count images with descriptive alt text (more than one word)
    const descriptiveAlt = images.filter(img => 
      img.alt && img.alt.trim().split(/\s+/).length > 1
    );
    const mostHaveDescriptiveAlt = descriptiveAlt.length >= Math.ceil(images.length * 0.7);
    
    // Count images with keywords in alt text
    const altWithKeywords = images.filter(img => 
      img.alt && targetKeywords.some(keyword => 
        img.alt.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    const someHaveKeywords = altWithKeywords.length >= Math.ceil(images.length * 0.5);
    
    // Return true if at least 2 of the 3 criteria are met
    const score = (allHaveAlt ? 1 : 0) + (mostHaveDescriptiveAlt ? 1 : 0) + (someHaveKeywords ? 1 : 0);
    return score >= 2;
  }
  
  private evaluateLinks(links: {href: string, text: string, isInternal: boolean}[]): boolean {
    if (links.length === 0) return false;
    
    // Check if links have descriptive text (not "click here" or "read more")
    const genericLinkTexts = ['click here', 'read more', 'learn more', 'link', 'here', 'more'];
    const descriptiveLinks = links.filter(link => 
      !genericLinkTexts.some(generic => 
        link.text.toLowerCase() === generic
      )
    );
    const mostAreDescriptive = descriptiveLinks.length >= Math.ceil(links.length * 0.7);
    
    // Check if internal links have relevant anchor text
    const relevantInternalLinks = links.filter(link => 
      link.isInternal && link.text.length > 5
    );
    const goodInternalLinks = relevantInternalLinks.length >= 
      Math.ceil(links.filter(l => l.isInternal).length * 0.7);
    
    // Check if there are both internal and external links (good for SEO)
    const hasInternalLinks = links.some(link => link.isInternal);
    const hasExternalLinks = links.some(link => !link.isInternal);
    const balancedLinkTypes = hasInternalLinks && hasExternalLinks;
    
    // Return true if at least 2 of the 3 criteria are met
    const score = (mostAreDescriptive ? 1 : 0) + (goodInternalLinks ? 1 : 0) + (balancedLinkTypes ? 1 : 0);
    return score >= 2;
  }
  
  private calculateReadabilityScore(content: string): number {
    // Simplified Flesch-Kincaid calculation
    
    // Count sentences
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    
    // Count words
    const words = content.split(/\s+/).filter(w => w.trim().length > 0);
    const wordCount = words.length;
    
    // Count syllables (very simplified)
    const syllableCount = words.reduce((count, word) => {
      return count + this.countSyllables(word);
    }, 0);
    
    if (sentenceCount === 0 || wordCount === 0) return 0;
    
    // Calculate average sentence length
    const avgSentenceLength = wordCount / sentenceCount;
    
    // Calculate average syllables per word
    const avgSyllablesPerWord = syllableCount / wordCount;
    
    // Flesch-Kincaid formula (simplified)
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    // Convert to 0-100 scale
    const normalizedScore = Math.min(100, Math.max(0, Math.round(fleschScore)));
    
    return normalizedScore;
  }
  
  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    // Remove trailing e
    word = word.replace(/e$/, '');
    
    // Count vowel groups
    const vowelGroups = word.match(/[aeiouy]+/g);
    return vowelGroups ? vowelGroups.length : 1;
  }
  
  private calculateTechnicalSeoScore(content: SeoPageContent, targetKeywords: string[]): number {
    let score = 0;
    const maxScore = 100;
    
    // Title optimization (25 points)
    if (content.title.length > 0) score += 5;
    if (content.title.length >= 40 && content.title.length <= 60) score += 10;
    if (targetKeywords.some(k => content.title.toLowerCase().includes(k.toLowerCase()))) score += 10;
    
    // Meta description optimization (20 points)
    if (content.metaDescription.length > 0) score += 5;
    if (content.metaDescription.length >= 120 && content.metaDescription.length <= 155) score += 5;
    if (targetKeywords.some(k => content.metaDescription.toLowerCase().includes(k.toLowerCase()))) score += 10;
    
    // Heading structure (15 points)
    if (content.headings.some(h => h.tag === 'h1')) score += 5;
    if (content.headings.filter(h => h.tag === 'h1').length === 1) score += 5; // Only one H1
    if (content.headings.some(h => h.tag === 'h2' || h.tag === 'h3')) score += 5;
    
    // URL structure (not provided in this simulation, assuming good) (5 points)
    score += 5;
    
    // Image optimization (15 points)
    const imagesWithAlt = content.images.filter(img => img.alt && img.alt.trim() !== '');
    if (imagesWithAlt.length === content.images.length) score += 10;
    else if (imagesWithAlt.length >= content.images.length * 0.7) score += 5;
    
    if (content.images.some(img => 
      targetKeywords.some(k => img.alt.toLowerCase().includes(k.toLowerCase()))
    )) score += 5;
    
    // Link structure (10 points)
    if (content.links.length > 0) score += 3;
    if (content.links.every(link => link.text.trim() !== '')) score += 3;
    if (content.links.some(link => !link.isInternal)) score += 4; // Has external links
    
    // Keyword usage (10 points)
    const keywordsInBody = targetKeywords.filter(k => 
      content.body.toLowerCase().includes(k.toLowerCase())
    );
    score += Math.min(10, keywordsInBody.length * 2);
    
    return Math.min(maxScore, score);
  }
  
  private calculateContentQualityScore(content: SeoPageContent, targetKeywords: string[]): number {
    let score = 0;
    const maxScore = 100;
    
    // Content length (30 points)
    const wordCount = content.body.split(/\s+/).length;
    if (wordCount >= 300) score += 10;
    if (wordCount >= 600) score += 10;
    if (wordCount >= 1000) score += 10;
    
    // Content structure (15 points)
    const paragraphs = content.body.split('\n').filter(p => p.trim().length > 0);
    if (paragraphs.length >= 3) score += 5;
    if (paragraphs.length >= 5) score += 5;
    if (paragraphs.length >= 7) score += 5;
    
    // Keyword usage and density (20 points)
    const keywordScores = targetKeywords.map(keyword => {
      const keywordRegex = new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
      const matches = content.body.match(keywordRegex) || [];
      const density = matches.length / wordCount * 100;
      
      // Optimal density is 0.5% to 2.5%
      return density >= 0.5 && density <= 2.5 ? 1 : 0;
    });
    
    const keywordScore = keywordScores.reduce((sum, score) => sum + score, 0);
    score += keywordScore * (20 / targetKeywords.length);
    
    // Readability (20 points)
    const readabilityScore = this.calculateReadabilityScore(content.body);
    score += readabilityScore >= 60 ? 20 : readabilityScore / 3;
    
    // Content engagement elements (15 points)
    if (content.body.includes('?')) score += 3; // Questions engage readers
    if (/list|bullet|steps|ways|tips/i.test(content.body)) score += 3; // Lists are engaging
    if (/statistics|data|research|study|found/i.test(content.body)) score += 3; // Data references
    if (/example|instance|case study/i.test(content.body)) score += 3; // Examples
    if (content.images.length >= 2) score += 3; // Visual elements
    
    return Math.min(maxScore, Math.round(score));
  }
  
  private generateOverallFeedback(score: number, issuesFixed: any[], keywordOptimization: any[]): string {
    let feedback = '';
    
    // Base feedback on overall score
    if (score >= 90) {
      feedback = "Excellent work! Your optimized page follows SEO best practices and effectively targets the keywords. ";
    } else if (score >= 70) {
      feedback = "Good job! Your page shows solid SEO optimization, though there's still room for some improvements. ";
    } else if (score >= 50) {
      feedback = "You've made some good improvements, but your page needs more optimization to rank well. ";
    } else {
      feedback = "Your page needs significant SEO improvements to be competitive in search results. ";
    }
    
    // Add specific feedback based on fixed issues
    const fixedCount = issuesFixed.filter(i => i.fixed).length;
    const totalIssues = issuesFixed.length;
    
    feedback += `You successfully addressed ${fixedCount} out of ${totalIssues} SEO issues. `;
    
    // Add keyword feedback
    const keywordsWithGoodDensity = keywordOptimization.filter(k => k.density >= 0.5 && k.density <= 2.5).length;
    const totalKeywords = keywordOptimization.length;
    
    if (keywordsWithGoodDensity === totalKeywords) {
      feedback += "All target keywords are used with optimal density. ";
    } else if (keywordsWithGoodDensity > 0) {
      feedback += `${keywordsWithGoodDensity} out of ${totalKeywords} keywords have optimal usage density. `;
    } else {
      feedback += "None of your target keywords are used optimally. Consider improving keyword usage. ";
    }
    
    return feedback;
  }
  
  private generateRecommendations(issuesFixed: any[], keywordOptimization: any[], content: SeoPageContent): string[] {
    const recommendations: string[] = [];
    
    // Add recommendations for unfixed issues
    issuesFixed.forEach(issue => {
      if (!issue.fixed) {
        recommendations.push(issue.feedback);
      }
    });
    
    // Add recommendations for keyword optimization
    keywordOptimization.forEach(keyword => {
      if (keyword.density === 0) {
        recommendations.push(`Add the keyword "${keyword.keyword}" to your content.`);
      } else if (keyword.density < 0.5) {
        recommendations.push(`Increase usage of the keyword "${keyword.keyword}" throughout your content.`);
      } else if (keyword.density > 2.5) {
        recommendations.push(`Reduce the frequency of "${keyword.keyword}" to avoid keyword stuffing.`);
      }
      
      // Check for placement recommendations
      if (!keyword.placement.includes('title') && keyword.density > 0) {
        recommendations.push(`Consider adding "${keyword.keyword}" to your page title for better SEO impact.`);
      }
      
      if (!keyword.placement.includes('headings') && keyword.density > 0) {
        recommendations.push(`Include "${keyword.keyword}" in at least one heading for improved topical relevance.`);
      }
    });
    
    // Content length recommendation
    const wordCount = content.body.split(/\s+/).length;
    if (wordCount < 300) {
      recommendations.push("Increase your content length to at least 300 words for basic SEO effectiveness.");
    } else if (wordCount < 600) {
      recommendations.push("Consider expanding your content to 600+ words for better search ranking potential.");
    }
    
    // Deduplicate and limit recommendations
    const uniqueRecommendations = [...new Set(recommendations)];
    return uniqueRecommendations.slice(0, 5); // Return top 5 recommendations
  }
  
  // Get detailed analytics for the teacher/admin dashboard
  async getSimulationAnalytics(simulationId: number): Promise<any> {
    const attempts = await db
      .select()
      .from('seo_simulation_attempts')
      .where({ simulationId });
    
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
    
    // Calculate score statistics
    const scores = attempts.map(a => a.score).filter(s => s !== null) as number[];
    scores.sort((a, b) => a - b);
    
    const totalAttempts = attempts.length;
    const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    const highestScore = scores[scores.length - 1];
    const lowestScore = scores[0];
    const medianScore = scores[Math.floor(scores.length / 2)];
    
    // Analyze issue fixing patterns
    const allIssuesFixed = attempts.flatMap(a => a.issuesFixed || []);
    
    // Group by issue type
    const issuesByType = allIssuesFixed.reduce((groups, issue) => {
      const type = issue.issueType;
      if (!groups[type]) {
        groups[type] = {
          total: 0,
          fixed: 0
        };
      }
      
      groups[type].total++;
      if (issue.fixed) groups[type].fixed++;
      
      return groups;
    }, {} as Record<string, {total: number, fixed: number}>);
    
    // Calculate fix rates
    const issueFixRates = Object.entries(issuesByType).map(([type, data]) => ({
      type,
      fixRate: data.fixed / data.total,
      total: data.total
    }));
    
    // Most common issues (least fixed)
    const leastFixedIssues = issueFixRates
      .filter(issue => issue.total >= 5) // Only issues with enough data
      .sort((a, b) => a.fixRate - b.fixRate)
      .slice(0, 3)
      .map(issue => ({
        type: issue.type,
        fixRate: Math.round(issue.fixRate * 100) + '%',
        total: issue.total
      }));
    
    // Most common issues overall
    const mostCommonIssues = Object.entries(issuesByType)
      .map(([type, data]) => ({
        type,
        count: data.total,
        fixRate: Math.round((data.fixed / data.total) * 100) + '%'
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
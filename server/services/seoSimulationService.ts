import { SeoSimulation, SeoSimulationAttempt, InsertSeoSimulation, InsertSeoSimulationAttempt } from '@shared/schema';
import { db } from '../db';
import { freeMarketingAI, premiumMarketingAI, enterpriseMarketingAI } from './marketingAI';

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
}

// Sample SEO simulations library
const seoSimulationTemplates: InsertSeoSimulation[] = [
  {
    title: "E-commerce Product Page Optimization",
    description: "Optimize a poorly structured product page for a coffee shop's online store to improve its search engine visibility for coffee-related keywords.",
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
  {
    title: "Local Business Homepage Optimization",
    description: "Improve the SEO of a local dental practice's homepage to increase visibility for local search queries.",
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
  }
];

export class SeoSimulationService {
  // Get all available simulations
  async getSimulations(): Promise<SeoSimulation[]> {
    const simulations = await db.select().from('seo_simulations');
    return simulations;
  }
  
  // Get simulation by ID
  async getSimulation(id: number): Promise<SeoSimulation | undefined> {
    const [simulation] = await db
      .select()
      .from('seo_simulations')
      .where({ id });
    
    return simulation;
  }
  
  // Create a new simulation
  async createSimulation(simulation: InsertSeoSimulation): Promise<SeoSimulation> {
    const [result] = await db
      .insert('seo_simulations')
      .values(simulation)
      .returning();
    
    return result;
  }
  
  // Seed initial simulations
  async seedSimulations(): Promise<void> {
    const existingSimulations = await this.getSimulations();
    
    if (existingSimulations.length === 0) {
      for (const template of seoSimulationTemplates) {
        await this.createSimulation(template);
      }
      console.log('SEO simulations seeded successfully');
    }
  }
  
  // Submit a simulation attempt
  async submitAttempt(attempt: InsertSeoSimulationAttempt): Promise<SeoSimulationAttempt> {
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
      .insert('seo_simulation_attempts')
      .values(finalAttempt)
      .returning();
    
    return result;
  }
  
  // Get user's attempts for a simulation
  async getUserAttempts(userId: number, simulationId: number): Promise<SeoSimulationAttempt[]> {
    const attempts = await db
      .select()
      .from('seo_simulation_attempts')
      .where({ 
        userId,
        simulationId
      })
      .orderBy('createdAt', 'desc');
    
    return attempts;
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
          // Simple check for schema markup
          fixed = attempt.modifiedContent.toString().includes('@type') && 
                  attempt.modifiedContent.toString().includes('schema.org');
          feedback = fixed 
            ? 'Schema markup has been implemented.' 
            : 'Consider adding schema markup for better search visibility.';
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
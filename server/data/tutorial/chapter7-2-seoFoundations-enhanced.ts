export const content = `# SEO Foundations: Complete Guide to On-Page Optimization

## Introduction to SEO

Search Engine Optimization (SEO) is the practice of improving your website to increase its visibility in search engines like Google and Bing. The better your SEO, the higher your website will rank in search results, and the more likely people are to find your business online.

### Why SEO Matters for Small Businesses

- **Cost-effective marketing**: Compared to paid advertising, good SEO provides sustainable, long-term results without ongoing costs per click
- **Credibility and trust**: Users trust search engines, so higher rankings build brand credibility
- **Better user experience**: SEO best practices also improve website usability and customer experience
- **Competitive advantage**: Many small businesses ignore SEO, creating an opportunity to outrank competitors
- **Targeted traffic**: SEO brings users actively searching for your products or services

## Key On-Page SEO Elements

### Title Tags

Title tags are HTML elements that specify the title of a webpage. They appear in browser tabs, search engine results pages, and social shares.

**Best Practices:**
- Keep titles between 50-60 characters
- Include primary keyword near the beginning
- Make each title unique across your website
- Create compelling titles that encourage clicks
- Include your brand name at the end

**Example:**
\`\`\`html
<title>Handcrafted Wood Furniture | Custom Tables, Chairs | Wilson Woodworks</title>
\`\`\`

### Meta Descriptions

While not a direct ranking factor, meta descriptions appear in search results and influence click-through rates.

**Best Practices:**
- Keep descriptions between 120-158 characters
- Include primary and secondary keywords naturally
- Write compelling, accurate summaries of page content
- Include a call-to-action where appropriate
- Make each description unique

**Example:**
\`\`\`html
<meta name="description" content="Explore our handcrafted wood furniture made from sustainable materials. Custom tables, chairs & more with free delivery in Portland. 20+ years of craftsmanship.">
\`\`\`

### Heading Tags (H1, H2, H3...)

Heading tags create hierarchy in your content and help both users and search engines understand your page structure.

**Best Practices:**
- Use only one H1 tag per page
- Include your primary keyword in your H1
- Create logical hierarchy (H1 → H2 → H3)
- Use headings to break up text into scannable sections
- Make headings descriptive and helpful

**Example Structure:**
\`\`\`html
<h1>Handcrafted Wood Furniture for Your Home</h1>
  <h2>Custom Dining Tables</h2>
    <h3>Farmhouse Collection</h3>
    <h3>Modern Minimalist Collection</h3>
  <h2>Chairs & Seating Options</h2>
    <h3>Dining Chairs</h3>
    <h3>Bar Stools</h3>
\`\`\`

### URL Structure

Clean, descriptive URLs help search engines understand your page content and improve user experience.

**Best Practices:**
- Keep URLs short and descriptive
- Use hyphens to separate words
- Include primary keywords
- Avoid unnecessary parameters or numbers
- Use lowercase letters

**Examples:**
- Good: \`yoursite.com/handcrafted-wood-dining-tables\`
- Avoid: \`yoursite.com/products.php?id=392&cat=12\`

### Content Optimization

High-quality content is the foundation of successful SEO. It should be valuable, original, and answer the questions your customers are asking.

**Best Practices:**
- Target a primary keyword and related secondary keywords
- Include keywords naturally in the first 100 words
- Write comprehensive content (1000+ words for important pages)
- Break up text with headings, bullets, and images
- Update content regularly to keep it fresh

**Keyword Placement:**
- Introduction paragraph
- Headings and subheadings
- Throughout body content (maintain 1-2% keyword density)
- Image alt text
- Conclusion or summary

### Image Optimization

Images improve engagement but can slow down your site if not optimized properly.

**Best Practices:**
- Compress images before uploading
- Use descriptive, keyword-rich filenames
- Always add alt text for accessibility and SEO
- Consider using \`loading="lazy"\` for images below the fold
- Use responsive images that work on all devices

**Example:**
\`\`\`html
<img src="handcrafted-walnut-dining-table.jpg" 
     alt="Handcrafted walnut dining table with natural edge" 
     width="800" height="600" loading="lazy">
\`\`\`

### Internal Linking

Internal links connect your content and help search engines discover and understand your website structure.

**Best Practices:**
- Link to relevant, high-value pages on your site
- Use descriptive, keyword-rich anchor text
- Create a logical site hierarchy
- Keep important pages within 3 clicks of your homepage
- Regularly audit and update internal links

**Example:**
\`\`\`html
Check out our <a href="/dining-tables/walnut-collection/">walnut dining tables</a> for a timeless addition to your home.
\`\`\`

## Technical SEO Considerations

### Page Speed

Page speed is both a ranking factor and critical for user experience.

**Best Practices:**
- Optimize and compress images
- Minify CSS, JavaScript, and HTML
- Use browser caching
- Reduce server response time
- Consider a Content Delivery Network (CDN)

**Tools to Test Speed:**
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

### Mobile-Friendliness

With Google's mobile-first indexing, mobile optimization is essential.

**Best Practices:**
- Use responsive design
- Ensure text is readable without zooming
- Size buttons and navigation for touch screens
- Avoid Flash and pop-ups
- Test on multiple devices

**Testing Tool:**
- Google's Mobile-Friendly Test

### Schema Markup

Schema markup helps search engines understand your content and can result in rich snippets in search results.

**Common Types for Small Businesses:**
- LocalBusiness
- Product
- Review
- FAQ
- Event

**Example for a Local Business:**
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Wilson Woodworks",
  "description": "Handcrafted sustainable wood furniture",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Maple Street",
    "addressLocality": "Portland",
    "addressRegion": "OR",
    "postalCode": "97201"
  },
  "telephone": "(503) 555-0123",
  "openingHours": "Mo-Fr 09:00-17:00",
  "image": "https://www.wilsonwoodworks.com/images/storefront.jpg",
  "priceRange": "$$"
}
</script>
\`\`\`

## SEO Implementation Checklist

Use this checklist when optimizing any page on your website:

1. **Research & Planning**
   - ☐ Conducted keyword research
   - ☐ Analyzed competitor pages
   - ☐ Identified primary and secondary keywords

2. **On-Page Elements**
   - ☐ Optimized title tag (50-60 characters, includes primary keyword)
   - ☐ Created compelling meta description (120-158 characters)
   - ☐ Used one H1 tag with primary keyword
   - ☐ Structured content with H2, H3 tags
   - ☐ Created SEO-friendly URL
   - ☐ Added relevant internal links with descriptive anchor text
   - ☐ Included external links to authoritative sources where appropriate

3. **Content Quality**
   - ☐ Created comprehensive, valuable content (1000+ words for key pages)
   - ☐ Naturally incorporated keywords (1-2% density)
   - ☐ Used bullet points, numbered lists, and other formatting for readability
   - ☐ Added relevant, optimized images with alt text
   - ☐ Ensured content is unique and original

4. **Technical Elements**
   - ☐ Tested page speed and optimized if needed
   - ☐ Verified mobile-friendliness
   - ☐ Added appropriate schema markup where applicable
   - ☐ Checked for broken links and fixed issues
   - ☐ Ensured page is crawlable (not blocked by robots.txt)

## Measuring SEO Success

### Key Metrics to Track

1. **Organic Traffic**
   - Overall organic sessions
   - Traffic to specific landing pages
   - New vs. returning visitors from organic search

2. **Keyword Rankings**
   - Positions for target keywords
   - Number of keywords in top 10 positions
   - Featured snippet appearances

3. **Engagement Metrics**
   - Bounce rate for organic traffic
   - Average session duration
   - Pages per session
   - Scroll depth

4. **Conversion Metrics**
   - Conversion rate from organic traffic
   - Form submissions, sign-ups, or purchases
   - Phone calls or contact requests

### Recommended Tools

- **Google Search Console**: Free insights into your site's performance in Google search
- **Google Analytics**: Comprehensive website analytics
- **SEMrush or Ahrefs**: Paid tools for keyword tracking, competitor analysis, and comprehensive SEO data
- **Screaming Frog**: Technical SEO auditing tool

## Practical Exercise: SEO Audit

### Step 1: Analyze Current Performance
- Log into Google Search Console and note current rankings and impressions
- Identify top-performing pages and underperforming pages
- Check for crawl errors or indexing issues

### Step 2: Competitor Analysis
- Identify 3-5 direct competitors
- Analyze their top-ranking pages
- Note keywords they rank for that you don't

### Step 3: On-Page SEO Review
- Select 5 important pages on your website
- Evaluate title tags, meta descriptions, and heading structure
- Check content quality and keyword usage
- Analyze internal linking structure

### Step 4: Create an Improvement Plan
- Prioritize issues based on potential impact
- Create a timeline for implementing changes
- Document expected outcomes

### Step 5: Implementation and Monitoring
- Make necessary changes based on audit findings
- Track rankings and traffic changes
- Document results for future reference

## Common SEO Mistakes to Avoid

1. **Keyword Stuffing**: Overusing keywords in an unnatural way
2. **Ignoring User Intent**: Creating content that doesn't match what users are actually searching for
3. **Neglecting Mobile Users**: Not ensuring your site works well on all devices
4. **Duplicate Content**: Having identical or very similar content across multiple pages
5. **Poor-Quality Backlinks**: Building low-quality links that can trigger penalties
6. **Slow Page Speed**: Not optimizing for fast loading times
7. **Missing Meta Tags**: Forgetting title tags or meta descriptions
8. **Ignoring Analytics**: Not tracking performance or making data-driven decisions

## Next Steps in Your SEO Journey

After mastering on-page SEO fundamentals, explore these advanced topics:

1. **Local SEO**: Optimizing for local search results and Google Business Profile
2. **Content Marketing**: Creating valuable content that earns links naturally
3. **Technical SEO**: Diving deeper into site architecture, crawlability, and indexation
4. **Link Building**: Developing a strategy to earn quality backlinks
5. **E-commerce SEO**: Special considerations for online stores

Remember that SEO is a long-term strategy that requires patience and consistent effort. Results typically take 3-6 months to materialize, but the benefits are sustainable and compound over time.

## Quiz: Test Your SEO Knowledge

1. What is the recommended length for a title tag?
   a) 30-40 characters
   b) 50-60 characters
   c) 70-80 characters
   d) There is no limit

2. How many H1 tags should a page have?
   a) As many as needed
   b) At least 3
   c) Only one
   d) None

3. Which of these is NOT a ranking factor for SEO?
   a) Page speed
   b) Mobile-friendliness
   c) Meta keywords tag
   d) Quality content

4. What is schema markup used for?
   a) Blocking search engines from indexing content
   b) Helping search engines understand content better
   c) Making websites load faster
   d) Creating backlinks automatically

5. What is a good keyword density percentage?
   a) 5-10%
   b) 1-2%
   c) 0%
   d) As high as possible

Answers: 1-b, 2-c, 3-c, 4-b, 5-b`;
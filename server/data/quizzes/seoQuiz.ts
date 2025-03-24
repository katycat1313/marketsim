export const seoQuizQuestions = [
  {
    id: 1,
    type: "content-analysis",
    text: "A local café's website is ranked on the 10th page of Google search results. Looking at their homepage content below, identify the primary reason why it's ranking poorly:",
    contentSample: `
      <title>Welcome</title>
      <meta name="description" content="Visit our cafe">
      
      <h1>Welcome to our cafe</h1>
      
      <p>We have great coffee and food. Come in today. We are located downtown.</p>
      
      <img src="cafe.jpg" alt="img1">
      
      <a href="menu.html">Click here</a>
    `,
    options: [
      { id: "a", text: "The website is using Flash, which Google cannot index properly" },
      { id: "b", text: "The page loads too slowly, causing Google to penalize it" },
      { id: "c", text: "The content lacks SEO-friendly elements like descriptive title, meta description, and keyword-rich text", isCorrect: true },
      { id: "d", text: "The site has been penalized for having too many backlinks" }
    ],
    explanation: "This page is poorly optimized because it has a generic title ('Welcome'), minimal meta description ('Visit our cafe'), lacks specific keywords, has thin content, a non-descriptive image alt tag, and generic anchor text ('Click here'). These are fundamental on-page SEO issues that would prevent Google from understanding and ranking the content appropriately."
  },
  {
    id: 2,
    type: "keyword-selection",
    text: "You're optimizing a website for a local dentist in Chicago. Select the FOUR most relevant keywords that would help improve their local search rankings:",
    options: [
      { id: "a", text: "dentist", isRelevant: true },
      { id: "b", text: "doctor", isRelevant: false },
      { id: "c", text: "Chicago dentist", isRelevant: true },
      { id: "d", text: "teeth whitening Chicago", isRelevant: true },
      { id: "e", text: "best movies 2023", isRelevant: false },
      { id: "f", text: "dental practice near me", isRelevant: true },
      { id: "g", text: "teeth cleaning cost", isRelevant: false },
      { id: "h", text: "buy dental equipment", isRelevant: false }
    ],
    explanation: "When optimizing for local SEO, it's important to select keywords that combine your service ('dentist', 'teeth whitening') with location indicators ('Chicago') or local intent phrases ('near me'). Generic terms like 'doctor' are too broad, while 'teeth cleaning cost' lacks local intent, and 'buy dental equipment' targets suppliers rather than patients."
  },
  {
    id: 3,
    type: "negative-keywords",
    text: "You're running Google Ads for an online store selling premium coffee beans. Select THREE keywords that would be good NEGATIVE keywords to prevent irrelevant traffic:",
    options: [
      { id: "a", text: "coffee beans", isNegative: false },
      { id: "b", text: "free coffee samples", isNegative: true },
      { id: "c", text: "cheap coffee", isNegative: true },
      { id: "d", text: "premium arabica beans", isNegative: false },
      { id: "e", text: "coffee beans wholesale", isNegative: false },
      { id: "f", text: "coffee maker repair", isNegative: true },
      { id: "g", text: "specialty coffee", isNegative: false }
    ],
    explanation: "For a premium coffee bean store, good negative keywords are terms that attract users with different intent: 'free coffee samples' (users looking for free products), 'cheap coffee' (price-sensitive users not aligned with premium positioning), and 'coffee maker repair' (users looking for repair services, not beans). The other terms are relevant to selling premium coffee beans."
  },
  {
    id: 4,
    type: "multiple-choice",
    text: "Which of these elements would have the MOST significant positive impact on the SEO of an e-commerce product page?",
    options: [
      { id: "a", text: "Adding 20 internal links to other products" },
      { id: "b", text: "Including the target keyword 15 times in the product description" },
      { id: "c", text: "Unique, detailed product description with naturally incorporated keywords, proper headings, and optimized images", isCorrect: true },
      { id: "d", text: "Setting up a redirect from a high-authority domain" }
    ],
    explanation: "A unique, detailed product description with naturally incorporated keywords, proper heading structure, and optimized images provides valuable content for both users and search engines. Keyword stuffing (option B) can trigger penalties, excessive internal linking (option A) dilutes link equity, and setting up redirects from other domains (option D) could be seen as manipulative."
  },
  {
    id: 5,
    type: "data-analysis",
    text: "Looking at the keyword data below for a fitness equipment website, which keyword should be prioritized for content creation?",
    dataSample: `
      Keyword | Monthly Search Volume | Competition | Current Ranking
      --------|------------------------|-------------|---------------
      yoga mat | 45,000 | High | Not ranking
      best treadmill for home | 18,000 | Medium | Position 28
      affordable exercise bike | 9,500 | Low | Position 15
      fitness equipment maintenance | 2,500 | Low | Position 6
    `,
    options: [
      { id: "a", text: "yoga mat" },
      { id: "b", text: "best treadmill for home", isCorrect: true },
      { id: "c", text: "affordable exercise bike" },
      { id: "d", text: "fitness equipment maintenance" }
    ],
    explanation: "The keyword 'best treadmill for home' offers the best opportunity because it has substantial search volume (18,000 monthly searches), medium competition (not too difficult to rank for), and the site is already ranking, though not on the first page (position 28). With focused optimization, moving from position 28 to the first page is achievable and would yield significant traffic gains. 'Yoga mat' has higher volume but high competition, 'affordable exercise bike' has lower volume, and 'fitness equipment maintenance' is already ranking well but has the lowest search volume."
  },
  {
    id: 6,
    type: "content-improvement",
    text: "A local plumber's website has this meta description: 'We offer plumbing services. Call us today.' Which improved version would be MOST effective for SEO and click-through rate?",
    options: [
      { id: "a", text: "We offer plumbing services. We offer plumbing services. We offer plumbing services. Call us today." },
      { id: "b", text: "BEST PLUMBER IN TOWN!!! CALL NOW!!! FAST SERVICE!!! AVAILABLE 24/7!!!" },
      { id: "c", text: "24/7 Emergency Plumbers in [City] | Licensed, Bonded & Insured | Same-Day Service for Leaks, Clogs & Repairs | Call Now for 10% Off", isCorrect: true },
      { id: "d", text: "Our plumbing company has been serving the area since 1985. We are family-owned and operated. We take pride in our work." }
    ],
    explanation: "Option C is the most effective because it includes specific services (emergency plumbing, leaks, clogs), location relevance ([City]), trust indicators (licensed, bonded & insured), urgency (24/7, same-day service), and a call-to-action with incentive (10% off). It balances keywords for SEO with compelling benefits to improve click-through rate. Option A is repetitive, B uses excessive capitalization which looks spammy, and D is generic without strong keywords or call-to-action."
  },
  {
    id: 7,
    type: "keyword-matching",
    text: "Match each search query with the most likely user intent:",
    matchingItems: [
      { query: "how to fix leaky faucet", intent: "Informational", isCorrect: true },
      { query: "plumbers near me", intent: "Navigational", isCorrect: false },
      { query: "buy moen kitchen faucet", intent: "Transactional", isCorrect: true },
      { query: "home depot", intent: "Navigational", isCorrect: true },
      { query: "compare bathroom faucet brands", intent: "Commercial Investigation", isCorrect: true }
    ],
    correctMatches: {
      "how to fix leaky faucet": "Informational",
      "plumbers near me": "Local",
      "buy moen kitchen faucet": "Transactional",
      "home depot": "Navigational",
      "compare bathroom faucet brands": "Commercial Investigation"
    },
    explanation: "Understanding search intent is crucial for SEO. 'How to' queries are informational, seeking knowledge. 'Near me' queries indicate local intent. Queries with 'buy' indicate transactional intent. Brand/website name queries are navigational, with users looking for a specific site. 'Compare' queries indicate commercial investigation, where users are researching before making a purchase decision."
  },
  {
    id: 8,
    type: "multiple-choice",
    text: "Looking at this website performance data, what is likely the MAIN issue affecting organic search traffic?",
    dataSample: `
      Metric | Last Month | Current Month | Change
      -------|------------|---------------|-------
      Organic Sessions | 15,240 | 4,890 | -67.9%
      Bounce Rate | 32% | 85% | +165.6%
      Page Load Time | 1.8s | 8.2s | +355.6%
      Mobile Traffic | 63% | 61% | -3.2%
      # of Indexed Pages | 128 | 130 | +1.6%
    `,
    options: [
      { id: "a", text: "Google algorithm update affecting the website's niche" },
      { id: "b", text: "Loss of quality backlinks" },
      { id: "c", text: "Significant increase in page load time", isCorrect: true },
      { id: "d", text: "Decrease in mobile traffic" }
    ],
    explanation: "The dramatic increase in page load time (from 1.8s to 8.2s) is the most likely culprit for the drop in organic traffic. Google prioritizes page speed as a ranking factor, and slow-loading pages provide poor user experience. This is supported by the corresponding increase in bounce rate (from 32% to 85%), indicating visitors are leaving quickly due to slow loading. The other metrics show minimal changes or wouldn't cause such a dramatic traffic drop."
  }
];
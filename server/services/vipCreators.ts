export interface VipCreator {
  token: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  specialty: string;
  contactEmail: string;
  socialHandle?: string;
  targetLanding: string;
  customPitchAngle: string;
}

export const VIP_CREATORS: VipCreator[] = [
  {
    token: "seth",
    name: "Seth Hymes",
    firstName: "Seth",
    lastName: "Hymes",
    email: "seth@vip.krechet.academy",
    organization: "In Demand Career / Digital Career Blueprint",
    specialty: "Entry-Level Digital Marketing & PPC Careers",
    contactEmail: "seth@indemandcareer.com",
    targetLanding: "/interview-prep",
    customPitchAngle: "Helping complete beginners build verified client proof-of-work and pass technical agency interviews."
  },
  {
    token: "alexia",
    name: "Alexia Palau",
    firstName: "Alexia",
    lastName: "Palau",
    email: "alexia@vip.krechet.academy",
    organization: "Alexia Palau Coaching / MentorCruise",
    specialty: "Performance Marketing Coaching & Resumes",
    contactEmail: "alexia@vip.krechet.academy",
    socialHandle: "Instagram @alexiapalau",
    targetLanding: "/interview-prep",
    customPitchAngle: "Voice-driven AI interview coaching on STAR structure and agency executive vocabulary."
  },
  {
    token: "jade",
    name: "Jade Beason",
    firstName: "Jade",
    lastName: "Beason",
    email: "jade@vip.krechet.academy",
    organization: "Social People Agency / The Creator Project",
    specialty: "Social Media Strategy & Marketing Funnels",
    contactEmail: "jade@vip.krechet.academy",
    socialHandle: "Instagram @jadebeason",
    targetLanding: "/dashboard",
    customPitchAngle: "Interactive agency client casework and funnel leak teardowns."
  },
  {
    token: "jason",
    name: "Jason Wardrop",
    firstName: "Jason",
    lastName: "Wardrop",
    email: "jason@vip.krechet.academy",
    organization: "Arsenal MKG / SaaS Agency Educator",
    specialty: "Local Business Agency Client Acquisition",
    contactEmail: "support@jasonwardrop.com",
    socialHandle: "Instagram @leadgen",
    targetLanding: "/ad-simulations",
    customPitchAngle: "Dr. Miller Dental casework: training agency founders on local lead-gen and negative keyword shields."
  },
  {
    token: "latasha",
    name: "Latasha James",
    firstName: "Latasha",
    lastName: "James",
    email: "latasha@vip.krechet.academy",
    organization: "Freelance Friday / James + Park Creative",
    specialty: "Freelance Marketing & Client Management",
    contactEmail: "hey@latashajames.com",
    targetLanding: "/persona-builder",
    customPitchAngle: "Customer persona mapping, client discovery visit notes, and interactive e-commerce auditing."
  },
  {
    token: "edleake",
    name: "Ed Leake",
    firstName: "Ed",
    lastName: "Leake",
    email: "ed@vip.krechet.academy",
    organization: "God Tier Ads / PPC Hub",
    specialty: "Google Search Ads & Negative Keyword Shields",
    contactEmail: "help@godtierads.com",
    targetLanding: "/ad-simulations",
    customPitchAngle: "Search Query Report auditing, STAG structures, and second-price auction mechanics."
  },
  {
    token: "benheath",
    name: "Ben Heath",
    firstName: "Ben",
    lastName: "Heath",
    email: "ben@vip.krechet.academy",
    organization: "Lead Guru",
    specialty: "Meta Ads & Paid Social Lead Generation",
    contactEmail: "ben@leadguru.co.uk",
    targetLanding: "/ad-simulations",
    customPitchAngle: "Apex Athletics paid social prospecting, custom audience setup, and creative fatigue kill rules."
  },
  {
    token: "daradenney",
    name: "Dara Denney",
    firstName: "Dara",
    lastName: "Denney",
    email: "dara@vip.krechet.academy",
    organization: "Performance Creative Director",
    specialty: "Paid Social Creative Strategy & UGC",
    contactEmail: "dara@daradenney.com",
    targetLanding: "/ad-simulations",
    customPitchAngle: "5-Angle Hook Matrix, thumbstop rate vs. hold rate, and UGC creative fatigue diagnostics."
  },
  {
    token: "adamerhart",
    name: "Adam Erhart",
    firstName: "Adam",
    lastName: "Erhart",
    email: "adam@vip.krechet.academy",
    organization: "The Modern Marketing Show",
    specialty: "Full-Funnel Strategy & Modern Copywriting",
    contactEmail: "adam@adamerhart.com",
    targetLanding: "/custom-sandbox",
    customPitchAngle: "Full-funnel campaign modeling across search, social, and email with dynamic ROAS forecasting."
  },
  {
    token: "kasim",
    name: "Kasim Aslam",
    firstName: "Kasim",
    lastName: "Aslam",
    email: "kasim@vip.krechet.academy",
    organization: "Solutions 8",
    specialty: "Google Ads & Performance Max Mastery",
    contactEmail: "kasim@sol8.com",
    targetLanding: "/ad-simulations",
    customPitchAngle: "High-level Google Search architecture, Quality Score optimization, and account restructuring."
  },
  {
    token: "isaac",
    name: "Isaac Rudansky",
    firstName: "Isaac",
    lastName: "Rudansky",
    email: "isaac@vip.krechet.academy",
    organization: "AdVenture Media Group",
    specialty: "PPC Psychology & Search Intent",
    contactEmail: "isaac@adventureppc.com",
    targetLanding: "/ad-simulations",
    customPitchAngle: "Matching search intent to high-converting landing pages and second-price auction bid logic."
  },
  {
    token: "maggiestara",
    name: "Maggie Stara",
    firstName: "Maggie",
    lastName: "Stara",
    email: "maggie@vip.krechet.academy",
    organization: "Digital Marketing Educator",
    specialty: "Entry-Level Skills & Remote Marketing Careers",
    contactEmail: "hello@maggiestara.com",
    targetLanding: "/interview-prep",
    customPitchAngle: "Step-by-step career readiness with verified digital portfolio artifacts for hiring managers."
  },
  {
    token: "wesmcdowell",
    name: "Wes McDowell",
    firstName: "Wes",
    lastName: "McDowell",
    email: "wes@vip.krechet.academy",
    organization: "The Profitable Web Designer",
    specialty: "Website Conversions & Local Funnels",
    contactEmail: "wes@wesmcdowell.com",
    targetLanding: "/custom-sandbox",
    customPitchAngle: "Landing page friction teardowns, value proposition clarity, and local service lead funnels."
  },
  {
    token: "milesbeckler",
    name: "Miles Beckler",
    firstName: "Miles",
    lastName: "Beckler",
    email: "miles@vip.krechet.academy",
    organization: "Funnels & Media Buying",
    specialty: "Direct Response Funnels & Conversion Rates",
    contactEmail: "miles@milesbeckler.com",
    targetLanding: "/ab-test-workshop",
    customPitchAngle: "A/B testing statistical significance (p < 0.05), sample sizing, and LIFT model audits."
  },
  {
    token: "jordanplatten",
    name: "Jordan Platten",
    firstName: "Jordan",
    lastName: "Platten",
    email: "jordan@vip.krechet.academy",
    organization: "Affluent Academy",
    specialty: "Digital Marketing Agency Client Retention",
    contactEmail: "jordan@affluent.co",
    targetLanding: "/ad-simulations",
    customPitchAngle: "Demonstrating proof of work to local business clients using verified simulated casework."
  },
  {
    token: "barryhott",
    name: "Barry Hott",
    firstName: "Barry",
    lastName: "Hott",
    email: "barry@vip.krechet.academy",
    organization: "UGC & Creative Performance",
    specialty: "Ad Creative Strategy & Hook Rates",
    contactEmail: "barry@barryhott.com",
    targetLanding: "/ad-simulations",
    customPitchAngle: "Creative fatigue kill-rules and 5-Angle hook testing in paid social."
  },
  {
    token: "charleyt",
    name: "Charley Tichenor",
    firstName: "Charley",
    lastName: "Tichenor",
    email: "charley@vip.krechet.academy",
    organization: "Disrupter School",
    specialty: "Meta Ads Media Buying & Attribution",
    contactEmail: "charley@disrupterschool.com",
    targetLanding: "/ad-simulations",
    customPitchAngle: "Blended MER vs. in-app ROAS, server-side tracking, and creative testing frameworks."
  },
  {
    token: "mattdiggity",
    name: "Matt Diggity",
    firstName: "Matt",
    lastName: "Diggity",
    email: "matt@vip.krechet.academy",
    organization: "Diggity Marketing / Chiang Mai SEO",
    specialty: "Advanced SEO & Search Intent",
    contactEmail: "matt@diggitymarketing.com",
    targetLanding: "/seo-simulations",
    customPitchAngle: "Intent classification, local Map Pack 3-pack mechanics, and JSON-LD schema payloads."
  },
  {
    token: "juliangoldie",
    name: "Julian Goldie",
    firstName: "Julian",
    lastName: "Goldie",
    email: "julian@vip.krechet.academy",
    organization: "Goldie Agency",
    specialty: "SEO Strategy & Backlinks",
    contactEmail: "julian@goldie.agency",
    targetLanding: "/seo-simulations",
    customPitchAngle: "Local search audit workbench, citation consistency, and on-page technical SEO."
  },
  {
    token: "nickshackelford",
    name: "Nick Shackelford",
    firstName: "Nick",
    lastName: "Shackelford",
    email: "nick@vip.krechet.academy",
    organization: "Structured Agency / GeekEx",
    specialty: "DTC E-Commerce Media Buying",
    contactEmail: "nick@structured.agency",
    targetLanding: "/ad-simulations",
    customPitchAngle: "E-commerce customer journey audits, checkout leak diagnostics, and scaling Meta ad sets."
  },
  {
    token: "carenmagill",
    name: "Caren Magill",
    firstName: "Caren",
    lastName: "Magill",
    email: "caren@vip.krechet.academy",
    organization: "Marketing Strategist",
    specialty: "Freelance Media Strategy & Consulting",
    contactEmail: "caren@carenmagill.com",
    targetLanding: "/dashboard",
    customPitchAngle: "Hands-on client simulation tools for freelance media planners and consultants."
  },
  {
    token: "liamkay",
    name: "Liam James Kay",
    firstName: "Liam",
    lastName: "Kay",
    email: "liam@vip.krechet.academy",
    organization: "Digital Marketing Academy",
    specialty: "Performance Traffic & Native Ads",
    contactEmail: "liam@liamjameskay.com",
    targetLanding: "/custom-sandbox",
    customPitchAngle: "Breakeven ROAS and CAC modeling inside an interactive custom business sandbox."
  },
  {
    token: "maxperzon",
    name: "Max Perzon",
    firstName: "Max",
    lastName: "Perzon",
    email: "max@vip.krechet.academy",
    organization: "Growth Hacking & Analytics",
    specialty: "GA4, GTM & Performance Data",
    contactEmail: "max@maxperzon.com",
    targetLanding: "/data-visualization",
    customPitchAngle: "GA4 event schemas, GTM DataLayer verification, and executive client performance dashboards."
  },
  {
    token: "savannah",
    name: "Savannah Sanchez",
    firstName: "Savannah",
    lastName: "Sanchez",
    email: "savannah@vip.krechet.academy",
    organization: "The Social Savannah",
    specialty: "TikTok & Meta UGC Video Creative",
    contactEmail: "savannah@thesocialsavannah.com",
    targetLanding: "/ad-simulations",
    customPitchAngle: "Short-form video hook rates, creative fatigue detection, and e-commerce ad angles."
  },
  {
    token: "jonloomer",
    name: "Jon Loomer",
    firstName: "Jon",
    lastName: "Loomer",
    email: "jon@vip.krechet.academy",
    organization: "Jon Loomer Digital",
    specialty: "Advanced Meta Pixel & Targeting",
    contactEmail: "jon@jonloomer.com",
    targetLanding: "/ad-simulations",
    customPitchAngle: "Custom audiences, Conversions API (CAPI) attribution, and Meta ad delivery mechanics."
  }
];

export function getVipCreatorByToken(token: string): VipCreator | undefined {
  const normalized = token.toLowerCase().trim();
  return VIP_CREATORS.find(c => c.token === normalized || c.email === normalized);
}

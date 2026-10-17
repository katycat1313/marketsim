import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Info, 
  AlertCircle, 
  Check, 
  X, 
  Edit, 
  Save, 
  Bookmark, 
  Briefcase, 
  ShieldCheck, 
  TrendingUp, 
  Globe, 
  Search, 
  ArrowUpRight, 
  Sparkles, 
  BarChart3,
  MousePointer,
  RotateCcw,
  Wand2,
  Bot,
  Layers,
  Layout,
  Target,
  Activity,
  Users,
  Radio,
  Filter,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import WordPressEditor from '@/components/WordPressEditor';
import WebsitePreview from '@/components/WebsitePreview';
import '@/components/WebsitePreview.css';
import { FlightInstructorCopilot } from '@/components/FlightInstructorCopilot';
import { EmergencyCrisisModal } from '@/components/EmergencyCrisisModal';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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
  schemaMarkup?: string; // Optional JSON-LD schema markup
}

interface SeoSimulation {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  industry: string;
  originalContent: SeoPageContent;
  targetKeywords: string[];
  seoIssues: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    location: string;
  }[];
  bestPractices: {
    category: string;
    description: string;
    example: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface SimulationAttempt {
  id: number;
  simulationId: number;
  userId: number;
  modifiedContent: SeoPageContent;
  score: number;
  issuesFixed: {
    issueType: string;
    fixed: boolean;
    feedback: string;
  }[];
  keywordOptimization: {
    keyword: string;
    density: number;
    placement: string[];
    feedback: string;
  }[];
  readabilityScore: number;
  technicalSeoScore: number;
  contentQualityScore: number;
  feedback: string;
  recommendations: string[];
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function SeoSimulationPage() {
  const [, params] = useRoute<{ id: string }>('/seo-simulation/:id');
  const simulationId = params ? parseInt(params.id) : null;
  
  const [content, setContent] = useState<SeoPageContent | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();
  
  // Get simulation data
  const { data: simulation, isLoading: simulationLoading } = useQuery({
    queryKey: ['/api/seo-simulations', simulationId],
    queryFn: () => apiRequest(`/api/seo-simulations/${simulationId}`, { method: 'GET' }),
    enabled: !!simulationId
  });
  
  // Get user's previous attempts
  const { data: attempts, isLoading: attemptsLoading } = useQuery({
    queryKey: ['/api/seo-simulations', simulationId, 'attempts'],
    queryFn: () => apiRequest(`/api/seo-simulations/${simulationId}/attempts`, { method: 'GET' }),
    enabled: !!simulationId
  });
  
  // Submit attempt mutation
  const submitMutation = useMutation({
    mutationFn: (modifiedContent: SeoPageContent) => 
      apiRequest(`/api/seo-simulations/${simulationId}/attempts`, {
        method: 'POST',
        body: JSON.stringify({ modifiedContent })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seo-simulations', simulationId, 'attempts'] });
      toast({
        title: "Submission successful!",
        description: "Your SEO optimization has been evaluated.",
      });
      setEditMode(false);
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your optimization.",
        variant: "destructive"
      });
    }
  });
  
  const [autoSavedTime, setAutoSavedTime] = useState<string | null>(null);

  // Initialize content with localStorage or original simulation content
  useEffect(() => {
    if (simulation && !content) {
      try {
        const savedDraft = localStorage.getItem(`krechet_seo_draft_${simulationId}`);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          setContent(parsed);
          setAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          return;
        }
      } catch (e) {
        console.warn("Could not load draft from localStorage", e);
      }
      setContent(JSON.parse(JSON.stringify(simulation.originalContent)));
    }
  }, [simulation, content, simulationId]);

  // Auto-save whenever content changes
  useEffect(() => {
    if (content && simulationId) {
      try {
        localStorage.setItem(`krechet_seo_draft_${simulationId}`, JSON.stringify(content));
        setAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (e) {
        console.warn("Could not auto-save to localStorage", e);
      }
    }
  }, [content, simulationId]);

  const handleResetToBaseline = () => {
    if (!simulation) return;
    if (window.confirm("Are you sure you want to reset all fields back to the client's original broken baseline?")) {
      try {
        localStorage.removeItem(`krechet_seo_draft_${simulationId}`);
      } catch (e) {}
      setContent(JSON.parse(JSON.stringify(simulation.originalContent)));
      toast({
        title: "🔄 Reset to Baseline",
        description: "Restored original client content."
      });
    }
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!content) return;
    setContent({ ...content, title: e.target.value });
  };
  
  const handleMetaDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!content) return;
    setContent({ ...content, metaDescription: e.target.value });
  };
  
  const handleHeadingChange = (index: number, value: string) => {
    if (!content) return;
    const newHeadings = [...content.headings];
    newHeadings[index] = { ...newHeadings[index], content: value };
    setContent({ ...content, headings: newHeadings });
  };
  
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!content) return;
    setContent({ ...content, body: e.target.value });
  };
  
  const handleImageAltChange = (index: number, value: string) => {
    if (!content) return;
    const newImages = [...content.images];
    newImages[index] = { ...newImages[index], alt: value };
    setContent({ ...content, images: newImages });
  };
  
  const handleLinkTextChange = (index: number, value: string) => {
    if (!content) return;
    const newLinks = [...content.links];
    newLinks[index] = { ...newLinks[index], text: value };
    setContent({ ...content, links: newLinks });
  };
  
  const handleSchemaMarkupChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!content) return;
    setContent({ ...content, schemaMarkup: e.target.value });
  };
  
  const handleSubmit = () => {
    if (!content) return;
    submitMutation.mutate(content);
  };

  // Section Diagnostics (Educational guidance without giving raw answers)
  const titleDiag = React.useMemo(() => {
    if (!content) return { pass: false, hint: "Title cannot be empty" };
    const len = content.title.length;
    const lower = content.title.toLowerCase();
    const hasKeywords = (simulation?.targetKeywords || []).some((k: string) => lower.includes(k.toLowerCase())) || 
                        ["organic", "coffee", "beans", "specialty", "roast", "arabica", "java"].filter(w => lower.includes(w)).length >= 2;
    if (len > 65) {
      return { pass: false, hint: `Your title is ${len} characters (Google cuts off at 60). Shorten by removing conversational phrases or question words and lead with the target product phrase.` };
    }
    if (len < 35) {
      return { pass: false, hint: `Your title is only ${len} characters. Add a core brand or unique selling proposition (Target: 45-60 characters).` };
    }
    if (!hasKeywords) {
      return { pass: false, hint: "Missing primary search keywords. Ensure terms like 'organic', 'arabica', 'specialty', or 'coffee beans' appear clearly." };
    }
    return { pass: true, hint: `Optimal length (${len} chars) with targeted keywords included!` };
  }, [content, simulation]);

  const metaDiag = React.useMemo(() => {
    if (!content) return { pass: false, hint: "Meta description cannot be empty" };
    const len = content.metaDescription.length;
    const hasCTA = /shop|buy|order|discover|learn|taste|visit|call|explore|get/i.test(content.metaDescription);
    const hasKeywords = ["organic", "coffee", "beans", "specialty", "roast", "arabica", "fresh"].some(w => content.metaDescription.toLowerCase().includes(w));
    
    if (len < 100) {
      return { pass: false, hint: `Meta description is only ${len} characters (Target: 120-155). Explain what makes the beans unique and add an active Call to Action.` };
    }
    if (len > 165) {
      return { pass: false, hint: `Meta description is ${len} characters (Google cuts off at ~155). Trim unnecessary words to prevent truncation.` };
    }
    if (!hasCTA) {
      return { pass: false, hint: "Missing a clear Call To Action (e.g. 'Order fresh roasted beans today' or 'Shop 100% organic Arabica now')." };
    }
    return { pass: true, hint: `Great length (${len} chars) with clear search incentives and Call to Action!` };
  }, [content]);

  const headingsDiag = React.useMemo(() => {
    if (!content || !content.headings) return { pass: false, hint: "No headings found" };
    const h1 = content.headings.find(h => h.tag.toLowerCase() === "h1");
    if (!h1 || !h1.content.trim()) {
      return { pass: false, hint: "Missing an H1 tag. Every webpage requires exactly one primary H1 headline." };
    }
    if (h1.content.toLowerCase().includes("welcome to") || h1.content.toLowerCase() === "coffee beans for sale") {
      return { pass: false, hint: "H1 is too generic. Replace with a specific, compelling headline highlighting Jenny's organic specialty beans." };
    }
    return { pass: true, hint: "H1 headline is well-defined and establishes clear thematic relevance." };
  }, [content]);

  const contentDiag = React.useMemo(() => {
    if (!content || !content.body) return { pass: false, hint: "Body copy cannot be empty" };
    const words = content.body.split(/\s+/).filter(Boolean).length;
    if (words < 100) {
      return { pass: false, hint: `Body content is only ${words} words. Expand to 150-300 words explaining roasting schedules, origin co-ops, and flavor notes.` };
    }
    const keywordMatches = (content.body.match(/organic|arabica|coffee|beans|roast|specialty/gi) || []).length;
    const density = (keywordMatches / words) * 100;
    if (density < 0.6) {
      return { pass: false, hint: "Keyword density is low. Mention your organic certifications and bean origins naturally 2-3 more times." };
    }
    return { pass: true, hint: `Rich content (${words} words) with balanced, natural keyword coverage!` };
  }, [content]);

  const imagesDiag = React.useMemo(() => {
    if (!content || !content.images || content.images.length === 0) return { pass: true, hint: "No images to check" };
    const genericAlts = content.images.filter(img => !img.alt.trim() || img.alt.toLowerCase() === "coffee" || img.alt.toLowerCase() === "beans" || img.alt.toLowerCase() === "image");
    if (genericAlts.length > 0) {
      return { pass: false, hint: `You have ${genericAlts.length} image(s) with generic alt tags (like 'coffee'). Describe the actual subject (e.g. 'Burlap sack of organic Arabica beans').` };
    }
    return { pass: true, hint: "All images have descriptive alt text for search crawlers and screen readers!" };
  }, [content]);

  const linksDiag = React.useMemo(() => {
    if (!content || !content.links || content.links.length === 0) return { pass: true, hint: "No links to check" };
    const genericLinks = content.links.filter(l => l.text.toLowerCase().includes("click here") || l.text.toLowerCase() === "buy now");
    if (genericLinks.length > 0) {
      return { pass: false, hint: "Replace vague link text like 'Buy Now' or 'Click Here' with descriptive destinations like 'Order 500g Whole Bean' or 'View Roasting Schedule'." };
    }
    return { pass: true, hint: "Internal links use descriptive, context-rich anchor text!" };
  }, [content]);

  const passedSectionsCount = [titleDiag.pass, metaDiag.pass, headingsDiag.pass, contentDiag.pass, imagesDiag.pass, linksDiag.pass].filter(Boolean).length;
  
  const [, setLocation] = useLocation();
  const [isSavingPortfolio, setIsSavingPortfolio] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderNiche, setBuilderNiche] = useState("gym");
  
  // Mid-Campaign Surprise Client Crisis State
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [hasTriggeredCrisis, setHasTriggeredCrisis] = useState(false);
  const [crisisResolved, setCrisisResolved] = useState(false);

  // Trigger surprise client crisis call when student fixes 2+ sections (catches them off-guard!)
  useEffect(() => {
    if (passedSectionsCount >= 2 && !hasTriggeredCrisis && !crisisResolved) {
      const timer = setTimeout(() => {
        setIsCrisisOpen(true);
        setHasTriggeredCrisis(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [passedSectionsCount, hasTriggeredCrisis, crisisResolved]);

  const nicheTemplates: Record<string, any> = {
    gym: {
      name: "IronPulse Fitness Gym",
      industry: "Health & Fitness",
      title: "IronPulse Fitness | Austin's #1 Functional Training & CrossFit Gym",
      metaDescription: "Transform your strength at IronPulse Fitness in Downtown Austin. Expert functional coaching, boutique strength classes, and personal training. Claim your free pass today!",
      headings: [
        { tag: "h1", content: "Austin's Premier Functional Fitness & Strength Training Gym" },
        { tag: "h2", content: "Small Group Training, Olympic Lifting & Personal Coaching" },
        { tag: "h2", content: "Why IronPulse Delivers Faster Results Than Traditional Commercial Gyms" },
        { tag: "h3", content: "Start With a Free 1-on-1 Fitness Assessment" }
      ],
      body: "Welcome to IronPulse Fitness, where Austin athletes and fitness enthusiasts achieve breakthrough strength. Unlike crowded commercial gyms with broken machines, IronPulse delivers science-backed functional fitness, individualized coaching, and high-energy community workouts. Whether you are looking to build lean muscle, increase cardiovascular endurance, or master Olympic weightlifting, our certified coaches create custom programming tailored to your goals. Our state-of-the-art facility features Rogue barbells, turf sled tracks, assault bikes, and private recovery zones with infrared saunas and cold plunges.",
      images: [
        { src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600", alt: "Athlete performing kettlebell swings at IronPulse Fitness Austin" },
        { src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600", alt: "Certified trainer coaching a member on deadlift form" }
      ],
      links: [
        { href: "/classes", text: "View Group Class Schedule", isInternal: true },
        { href: "/pricing", text: "Membership Plans & Passes", isInternal: true },
        { href: "https://crossfit.com", text: "Functional Fitness Standards", isInternal: false }
      ],
      schemaMarkup: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HealthClub",
        "name": "IronPulse Fitness",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "400 S Congress Ave",
          "addressLocality": "Austin",
          "addressRegion": "TX",
          "postalCode": "78704"
        },
        "priceRange": "$$",
        "openingHours": "Mo-Sa 05:30-21:00"
      }, null, 2)
    },
    solar: {
      name: "Solaria Clean Energy",
      industry: "Renewable Energy & Trade Services",
      title: "Solaria Energy | Residential Solar Panel Installation & Battery Backup",
      metaDescription: "Cut your electric bill by up to 80% with premium tier-1 solar panel installation and Tesla Powerwall backup. Get your free solar estimate in 60 seconds.",
      headings: [
        { tag: "h1", content: "Switch to Solar & Eliminate Rising Utility Bills" },
        { tag: "h2", content: "Tier-1 Monocrystalline Solar Panels with 25-Year Production Warranty" },
        { tag: "h2", content: "Battery Storage & Whole-Home Backup Solutions" },
        { tag: "h3", content: "Claim the 30% Federal Clean Energy Tax Credit Before It Expires" }
      ],
      body: "Solaria Energy is the leading residential solar installer helping homeowners take control of their power bills. Electricity rates have surged over 34% across the country, but solar power allows you to lock in clean, predictable energy costs for the next 25 years. Our certified in-house engineering team handles every step from custom rooftop CAD design and city permitting to utility interconnection and mobile monitoring setup.",
      images: [
        { src: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=600", alt: "High-efficiency black solar panels installed on modern residential roof" },
        { src: "https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&q=80&w=600", alt: "Tesla Powerwall battery backup system mounted in garage" }
      ],
      links: [
        { href: "/solar-calculator", text: "Calculate Your Estimated Solar Savings", isInternal: true },
        { href: "/case-studies", text: "View Neighborhood Installation Projects", isInternal: true }
      ],
      schemaMarkup: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "name": "Solaria Clean Energy Systems",
        "telephone": "+1-800-555-7652",
        "areaServed": "Statewide"
      }, null, 2)
    },
    law: {
      name: "Vanguard Injury Law",
      industry: "Legal Services",
      title: "Vanguard Law | Dedicated Personal Injury & Car Accident Attorneys",
      metaDescription: "Over $120M recovered for injured victims. If you were injured in a car accident or workplace collision, our trial lawyers fight for maximum compensation. No fee unless we win.",
      headings: [
        { tag: "h1", content: "Experienced Personal Injury Lawyers Fighting For You" },
        { tag: "h2", content: "Car Accidents, Truck Collisions & Catastrophic Injury Claims" },
        { tag: "h2", content: "Why Insurance Companies Settle Higher With Vanguard" },
        { tag: "h3", content: "Free Confidential Case Evaluation Available 24/7" }
      ],
      body: "When you or a loved one suffers a severe injury due to someone else's negligence, insurance companies immediately send adjusters to minimize your payout. At Vanguard Injury Law Group, our award-winning trial attorneys stand between you and the insurance giants. With over 25 years of courtroom experience and more than $120 million recovered in settlements and verdicts, we prepare every case for trial to secure maximum medical and pain compensation.",
      images: [
        { src: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600", alt: "Managing partner attorney consulting with injured client" }
      ],
      links: [
        { href: "/results", text: "Explore Recent Case Verdicts & Settlements", isInternal: true },
        { href: "/contact", text: "Request Free 24/7 Case Review", isInternal: true }
      ],
      schemaMarkup: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LegalService",
        "name": "Vanguard Injury Law Group",
        "priceRange": "Contingency (No fee unless we win)"
      }, null, 2)
    }
  };

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleAIGenerateWebsite = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await apiRequest("POST", "/api/seo-simulations/generate", {
        niche: builderNiche,
        difficulty: simulation?.difficulty || "Intermediate",
        industry: builderNiche === "gym" ? "Health & Fitness" : builderNiche === "solar" ? "Trade Services" : "Legal Services"
      });
      const newSim = await res.json();
      setIsBuilderOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/seo-simulations"] });
      toast({
        title: "✨ AI Dynamic Sandbox Generated!",
        description: `Synthesized: ${newSim.title}. Loading your custom client sandbox...`,
      });
      setLocation(`/seo-simulation/${newSim.id}`);
    } catch (e: any) {
      // Fallback to local template
      const template = nicheTemplates[builderNiche] || nicheTemplates.gym;
      setContent({
        title: template.title,
        metaDescription: template.metaDescription,
        headings: template.headings,
        body: template.body,
        images: template.images,
        links: template.links,
        schemaMarkup: template.schemaMarkup
      });
      setEditMode(true);
      setIsBuilderOpen(false);
      toast({
        title: "✨ Sandbox Website Loaded!",
        description: `Loaded new dynamic sandbox for ${template.name}. Edit and run your audit!`,
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveToPortfolio = async () => {
    if (!latestAttempt) return;
    setIsSavingPortfolio(true);
    try {
      const payload = {
        id: `cs-seo-${Date.now()}`,
        simulationId: simulation.id,
        title: `Technical SEO Optimization: ${simulation.title}`,
        clientName: `${simulation.industry} Client`,
        industry: simulation.industry || "General",
        platform: "Technical SEO & On-Page",
        difficulty: simulation.difficulty || "Intermediate",
        challengeSummary: simulation.description,
        strategySummary: `Optimized title tags, fixed heading hierarchy, improved keyword density to ${latestAttempt.keywordOptimization?.[0]?.density?.toFixed(1) || 1.8}%, and resolved on-page crawl issues.`,
        keyTactics: (latestAttempt.issuesFixed || []).filter((i: any) => i.fixed).map((i: any) => i.feedback).slice(0, 3),
        metrics: {
          qualityScore: Math.round(latestAttempt.score / 10),
          roas: 3.8,
          cpa: 16.50,
          ctr: 4.6,
          conversions: 52,
          spend: 850
        },
        score: latestAttempt.score,
      };

      await apiRequest("/api/user/portfolio", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/portfolio"] });
      toast({
        title: "📌 SEO Case Study Saved to Portfolio",
        description: "Verified case study added to your public portfolio!",
      });
      setLocation("/portfolio");
    } catch (e: any) {
      toast({
        title: "Save Failed",
        description: e.message || "Could not save to portfolio.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPortfolio(false);
    }
  };

  const latestAttempt = attempts && attempts.length > 0 ? attempts[0] : null;
  const score = latestAttempt ? latestAttempt.score : (passedSectionsCount * 16 + 4);

  // Real-World Weekly Growth Objective Engine: 2 -> 50 Clicks/Week
  const baselineWeeklyClicks = 2;
  let accumulatedClicks = baselineWeeklyClicks;
  if (titleDiag.pass) accumulatedClicks += 10;
  if (headingsDiag.pass) accumulatedClicks += 10;
  if (metaDiag.pass) accumulatedClicks += 10;
  if (contentDiag.pass) accumulatedClicks += 10;
  if (imagesDiag.pass && linksDiag.pass) accumulatedClicks += 10;

  const weeklyClicks = accumulatedClicks;
  const targetWeeklyClicks = 50;
  const weeklyGrowthPct = Math.round(((weeklyClicks - baselineWeeklyClicks) / baselineWeeklyClicks) * 100);
  const organicTraffic = weeklyClicks;
  const baselineTraffic = baselineWeeklyClicks;
  const trafficDeltaPct = weeklyGrowthPct;
  const bounceRate = Math.max(26, Math.round(88 - (passedSectionsCount / 6) * 56));
  const baselineBounceRate = 88;
  const bounceDelta = baselineBounceRate - bounceRate;
  const convRate = (0.5 + (passedSectionsCount / 6) * 3.3).toFixed(1);
  const serpRank = passedSectionsCount >= 6 ? "#3 (Page 1)" : passedSectionsCount >= 4 ? "#7 (Page 1)" : passedSectionsCount >= 2 ? "#16 (Page 2)" : "#48 (Page 5)";

  const trafficTrendData = [
    { day: 'Mon (Baseline)', oldSite: 2, optimized: 2 },
    { day: 'Tue (Title & Meta)', oldSite: 2, optimized: titleDiag.pass ? 12 : 2 },
    { day: 'Wed (Headings)', oldSite: 2, optimized: (titleDiag.pass && headingsDiag.pass) ? 22 : titleDiag.pass ? 12 : 2 },
    { day: 'Thu (Copy & Alts)', oldSite: 2, optimized: Math.max(2, accumulatedClicks - 10) },
    { day: 'Fri (Full Launch)', oldSite: 2, optimized: weeklyClicks },
  ];
  
  if (simulationLoading) {
    return <div className="flex justify-center items-center h-[80vh]">Loading simulation...</div>;
  }
  
  if (!simulation) {
    return <div className="flex justify-center items-center h-[80vh]">Simulation not found</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{simulation.title}</h1>
            <p className="text-gray-500">{simulation.description}</p>
            <div className="flex mt-2 gap-2">
              <Badge variant="outline">{simulation.industry}</Badge>
              <Badge 
                variant={
                  simulation.difficulty === 'Beginner' ? 'secondary' : 
                  simulation.difficulty === 'Intermediate' ? 'default' : 
                  'destructive'
                }
              >
                {simulation.difficulty}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setIsBuilderOpen(true)}
              className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 text-xs flex items-center gap-1.5"
            >
              <Wand2 className="h-4 w-4 text-purple-400" />
              <span>✨ AI Dynamic Builder</span>
            </Button>

            {editMode ? (
              <>
                <Button 
                  variant="default" 
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9"
                >
                  <Save className="mr-1.5 h-4 w-4" />
                  Publish & Run Analytics
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setContent(JSON.parse(JSON.stringify(simulation.originalContent)));
                    setEditMode(false);
                  }}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                onClick={() => setEditMode(true)}
                className="bg-primary hover:bg-primary/90 text-xs h-9 flex items-center gap-1.5"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Website CMS</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Real-World Weekly Growth Objective Bar: Scale from 2 to 50 Clicks/Week */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-card via-card/90 to-primary/10 border border-primary/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Week 1 Growth SLA Objective</span>
                <Badge variant={weeklyClicks >= 50 ? "default" : "outline"} className={weeklyClicks >= 50 ? "bg-emerald-600 text-white text-[10px]" : "border-amber-500/40 text-amber-400 text-[10px]"}>
                  {weeklyClicks >= 50 ? "🎉 SLA Target Smashed!" : "Overnight Crawl Cycle Active"}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-foreground mt-1">
                Client Campaign: Scale Jenny's Coffee from <span className="text-muted-foreground line-through">2 visitors/wk</span> to <strong className="text-emerald-400">50+ visitors/wk</strong>
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-black text-foreground">
                  {weeklyClicks} <span className="text-xs font-normal text-muted-foreground">/ 50 clicks/wk</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  +{weeklyGrowthPct}% Weekly Traffic Growth
                </div>
              </div>
            </div>
          </div>
          <Progress value={Math.min(100, (weeklyClicks / 50) * 100)} className="h-2.5 bg-secondary" />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
            <span>Baseline: 2 clicks/wk (Old broken site)</span>
            <span>{weeklyClicks >= 50 ? "🏆 All 50 clicks achieved! Ready for Friday assessment quiz." : `Each section you fix unlocks +10 clicks. Need ${Math.max(0, 50 - weeklyClicks)} more clicks to clear Week 1.`}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="mb-4 grid grid-cols-3 w-full max-w-lg">
                <TabsTrigger value="preview" className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <Globe className="h-4 w-4" />
                  <span>Live Website</span>
                </TabsTrigger>
                <TabsTrigger value="editor" className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <Edit className="h-4 w-4" />
                  <span>CMS Optimizer</span>
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <BarChart3 className="h-4 w-4 text-emerald-400" />
                  <span>Traffic & Analytics</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="space-y-6">
                {content && (
                  <>
                    {/* Live Section Verification Strip */}
                    <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-bold ${
                          passedSectionsCount === 6 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                            : "bg-primary/20 text-primary border border-primary/30"
                        }`}>
                          <ShieldCheck className="h-4 w-4" />
                          <span>Audit Readiness: {passedSectionsCount}/6 Sections Passing</span>
                        </div>
                        {passedSectionsCount === 6 && (
                          <Badge className="bg-emerald-500 text-black font-bold text-[10px]">
                            ⭐ All Green - Ready to Submit!
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {autoSavedTime && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-400/90 font-mono">
                            <CheckCircle2 className="h-3 w-3 inline" /> Auto-saved ({autoSavedTime})
                          </span>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleResetToBaseline}
                          className="text-[11px] h-7 text-muted-foreground hover:text-destructive"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" /> Reset to Baseline
                        </Button>
                      </div>
                    </div>

                    {simulation.difficulty === 'Beginner' ? (
                      // Beginner mode - Form-based editor with Real-Time Diagnostics
                      <div className="space-y-6">
                        {/* Page Title Card */}
                        <Card className={`border transition-all ${titleDiag.pass ? "border-emerald-500/40 bg-card" : "border-amber-500/40 bg-amber-500/5"}`}>
                          <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                              <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <span>Page Title Tag</span>
                                <Badge variant={titleDiag.pass ? "secondary" : "outline"} className={titleDiag.pass ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]" : "border-amber-500/40 text-amber-400 text-[10px]"}>
                                  {titleDiag.pass ? "✅ PASS" : "⚠️ NEEDS ADJUSTMENT"}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="text-xs">The clickable headline printed in Google search results (50-60 characters ideal)</CardDescription>
                            </div>
                            <span className={`text-xs font-mono font-bold ${content.title.length > 65 || content.title.length < 35 ? "text-amber-400" : "text-emerald-400"}`}>
                              {content.title.length}/60 chars
                            </span>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <Input 
                              value={content.title} 
                              onChange={handleTitleChange}
                              disabled={!editMode}
                              className={editMode ? "border-blue-300 font-medium text-sm" : ""}
                              placeholder="e.g. Organic Arabica Coffee Beans | Jenny's Artisan Roastery"
                            />
                            <div className={`p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                              titleDiag.pass ? "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300" : "bg-secondary/60 border border-border/80 text-foreground"
                            }`}>
                              <Lightbulb className={`h-4 w-4 shrink-0 mt-0.5 ${titleDiag.pass ? "text-emerald-400" : "text-amber-400"}`} />
                              <span><strong>Diagnostic Hint:</strong> {titleDiag.hint}</span>
                            </div>
                          </CardContent>
                        </Card>
                    
                        {/* Meta Description Card */}
                        <Card className={`border transition-all ${metaDiag.pass ? "border-emerald-500/40 bg-card" : "border-amber-500/40 bg-amber-500/5"}`}>
                          <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                              <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <span>Meta Description</span>
                                <Badge variant={metaDiag.pass ? "secondary" : "outline"} className={metaDiag.pass ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]" : "border-amber-500/40 text-amber-400 text-[10px]"}>
                                  {metaDiag.pass ? "✅ PASS" : "⚠️ NEEDS ADJUSTMENT"}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="text-xs">The 2-sentence teaser under your Google headline that drives clicks (120-155 characters ideal)</CardDescription>
                            </div>
                            <span className={`text-xs font-mono font-bold ${content.metaDescription.length > 165 || content.metaDescription.length < 100 ? "text-amber-400" : "text-emerald-400"}`}>
                              {content.metaDescription.length}/155 chars
                            </span>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <Textarea 
                              value={content.metaDescription} 
                              onChange={handleMetaDescriptionChange}
                              disabled={!editMode}
                              className={editMode ? "border-blue-300 text-xs" : ""}
                              rows={3}
                              placeholder="e.g. Taste the difference of small-batch roasted 100% organic Arabica beans. Sourced from fair-trade family co-ops and shipped within 24 hours. Shop fresh roasts today!"
                            />
                            <div className={`p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                              metaDiag.pass ? "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300" : "bg-secondary/60 border border-border/80 text-foreground"
                            }`}>
                              <Lightbulb className={`h-4 w-4 shrink-0 mt-0.5 ${metaDiag.pass ? "text-emerald-400" : "text-amber-400"}`} />
                              <span><strong>Diagnostic Hint:</strong> {metaDiag.hint}</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Headings Structure Card */}
                        <Card className={`border transition-all ${headingsDiag.pass ? "border-emerald-500/40 bg-card" : "border-amber-500/40 bg-amber-500/5"}`}>
                          <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                              <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <span>Heading Hierarchy (H1 & H2 Tags)</span>
                                <Badge variant={headingsDiag.pass ? "secondary" : "outline"} className={headingsDiag.pass ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]" : "border-amber-500/40 text-amber-400 text-[10px]"}>
                                  {headingsDiag.pass ? "✅ PASS" : "⚠️ NEEDS ADJUSTMENT"}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="text-xs">Establish the page's main front-page banner (H1) and supporting sections (H2)</CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {content.headings.map((heading, index) => (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant={heading.tag === "h1" ? "default" : "outline"} className="w-10 justify-center text-xs uppercase font-mono">
                                    {heading.tag}
                                  </Badge>
                                  <Input 
                                    value={heading.content} 
                                    onChange={(e) => handleHeadingChange(index, e.target.value)}
                                    disabled={!editMode}
                                    className={editMode ? "border-blue-300 text-xs" : ""}
                                    placeholder={heading.tag === "h1" ? "e.g. Small-Batch 100% Organic Arabica Specialty Coffee" : "Section Subtitle"}
                                  />
                                </div>
                              </div>
                            ))}
                            <div className={`p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                              headingsDiag.pass ? "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300" : "bg-secondary/60 border border-border/80 text-foreground"
                            }`}>
                              <Lightbulb className={`h-4 w-4 shrink-0 mt-0.5 ${headingsDiag.pass ? "text-emerald-400" : "text-amber-400"}`} />
                              <span><strong>Diagnostic Hint:</strong> {headingsDiag.hint}</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Body Copy & Keyword Density Card */}
                        <Card className={`border transition-all ${contentDiag.pass ? "border-emerald-500/40 bg-card" : "border-amber-500/40 bg-amber-500/5"}`}>
                          <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                              <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <span>Body Content & Keyword Density</span>
                                <Badge variant={contentDiag.pass ? "secondary" : "outline"} className={contentDiag.pass ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]" : "border-amber-500/40 text-amber-400 text-[10px]"}>
                                  {contentDiag.pass ? "✅ PASS" : "⚠️ NEEDS ADJUSTMENT"}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="text-xs">Explain product origins, roasting specs, and brewing instructions (150-300 words recommended)</CardDescription>
                            </div>
                            <span className="text-xs font-mono font-bold text-muted-foreground">
                              {content.body.split(/\s+/).filter(Boolean).length} words
                            </span>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <Textarea 
                              value={content.body} 
                              onChange={handleBodyChange}
                              disabled={!editMode}
                              className={editMode ? "border-blue-300 text-xs" : ""}
                              rows={7}
                            />
                            <div className={`p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                              contentDiag.pass ? "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300" : "bg-secondary/60 border border-border/80 text-foreground"
                            }`}>
                              <Lightbulb className={`h-4 w-4 shrink-0 mt-0.5 ${contentDiag.pass ? "text-emerald-400" : "text-amber-400"}`} />
                              <span><strong>Diagnostic Hint:</strong> {contentDiag.hint}</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Images & Alt Text Card */}
                        <Card className={`border transition-all ${imagesDiag.pass ? "border-emerald-500/40 bg-card" : "border-amber-500/40 bg-amber-500/5"}`}>
                          <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                              <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <span>Image Alt Attributes</span>
                                <Badge variant={imagesDiag.pass ? "secondary" : "outline"} className={imagesDiag.pass ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]" : "border-amber-500/40 text-amber-400 text-[10px]"}>
                                  {imagesDiag.pass ? "✅ PASS" : "⚠️ NEEDS ADJUSTMENT"}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="text-xs">Describe photo contents accurately for search crawlers and accessibility</CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {content.images.map((image, index) => (
                              <div key={index} className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-1/4">
                                    <Badge variant="outline" className="text-[10px] truncate max-w-full">Image {index + 1}</Badge>
                                    <div className="text-[10px] text-muted-foreground truncate">{image.src}</div>
                                  </div>
                                  <div className="w-3/4">
                                    <Input 
                                      value={image.alt} 
                                      onChange={(e) => handleImageAltChange(index, e.target.value)}
                                      disabled={!editMode}
                                      className={editMode ? "border-blue-300 text-xs" : ""}
                                      placeholder="e.g. Burlap sack of freshly roasted 100% organic Arabica beans"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className={`p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                              imagesDiag.pass ? "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300" : "bg-secondary/60 border border-border/80 text-foreground"
                            }`}>
                              <Lightbulb className={`h-4 w-4 shrink-0 mt-0.5 ${imagesDiag.pass ? "text-emerald-400" : "text-amber-400"}`} />
                              <span><strong>Diagnostic Hint:</strong> {imagesDiag.hint}</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Links & Anchor Text Card */}
                        <Card className={`border transition-all ${linksDiag.pass ? "border-emerald-500/40 bg-card" : "border-amber-500/40 bg-amber-500/5"}`}>
                          <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                              <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <span>Internal Links & Anchor Text</span>
                                <Badge variant={linksDiag.pass ? "secondary" : "outline"} className={linksDiag.pass ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]" : "border-amber-500/40 text-amber-400 text-[10px]"}>
                                  {linksDiag.pass ? "✅ PASS" : "⚠️ NEEDS ADJUSTMENT"}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="text-xs">Use descriptive anchor text explaining where the link goes</CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {content.links.map((link, index) => (
                              <div key={index} className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-1/4">
                                    <Badge variant="outline" className="text-[10px]">{link.href}</Badge>
                                  </div>
                                  <div className="w-3/4">
                                    <Input 
                                      value={link.text} 
                                      onChange={(e) => handleLinkTextChange(index, e.target.value)}
                                      disabled={!editMode}
                                      className={editMode ? "border-blue-300 text-xs" : ""}
                                      placeholder="e.g. Order 500g Whole Bean Roast"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className={`p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                              linksDiag.pass ? "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300" : "bg-secondary/60 border border-border/80 text-foreground"
                            }`}>
                              <Lightbulb className={`h-4 w-4 shrink-0 mt-0.5 ${linksDiag.pass ? "text-emerald-400" : "text-amber-400"}`} />
                              <span><strong>Diagnostic Hint:</strong> {linksDiag.hint}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : simulation.difficulty === 'Intermediate' ? (
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Links</CardTitle>
                            <CardDescription>Links should have descriptive anchor text</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {content.links.map((link, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-1/4">
                                    <Badge variant={link.isInternal ? "secondary" : "outline"}>
                                      {link.isInternal ? "Internal" : "External"}
                                    </Badge>
                                    <div className="text-sm mt-1 truncate">{link.href}</div>
                                  </div>
                                  <div className="w-3/4">
                                    <Badge variant="outline">Link Text</Badge>
                                    <Input 
                                      value={link.text} 
                                      onChange={(e) => handleLinkTextChange(index, e.target.value)}
                                      disabled={!editMode}
                                      className={editMode ? "border-blue-300" : ""}
                                      placeholder="Descriptive link text"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Schema Markup</CardTitle>
                            <CardDescription>Structured data helps search engines understand your content (JSON-LD format)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Textarea 
                              value={content.schemaMarkup || ''} 
                              onChange={handleSchemaMarkupChange}
                              disabled={!editMode}
                              className={editMode ? "border-blue-300 font-mono text-sm" : "font-mono text-sm"}
                              rows={8}
                              placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Your headline here",\n  "author": {\n    "@type": "Person",\n    "name": "Author Name"\n  }\n}`}
                            />
                            <div className="mt-2 text-xs text-gray-500 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              <span>Valid JSON-LD required for structured data</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      // Advanced mode - WordPress-like editor
                      <WordPressEditor 
                        content={content}
                        onContentChange={setContent}
                        readOnly={!editMode}
                      />
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-6">
                {content && simulation && (
                  simulation.difficulty === 'Beginner' ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Page Preview</CardTitle>
                        <CardDescription>How your page would appear</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-md p-6 space-y-4">
                          <div className="flex flex-col space-y-2">
                            <div className="text-xs text-gray-500 flex items-center">
                              <div className="w-full h-2 bg-green-100 rounded" />
                              <div className="ml-2">example.com</div>
                            </div>
                            <h1 className="text-blue-600 text-xl font-medium hover:underline cursor-pointer">
                              {content.title}
                            </h1>
                            <p className="text-sm text-gray-600">
                              {content.metaDescription}
                            </p>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-4">
                            {content.headings.map((heading, index) => {
                              const HeadingTag = heading.tag as keyof JSX.IntrinsicElements;
                              return (
                                <HeadingTag key={index} className={
                                  heading.tag === 'h1' ? 'text-2xl font-bold' :
                                  heading.tag === 'h2' ? 'text-xl font-bold' :
                                  heading.tag === 'h3' ? 'text-lg font-bold' :
                                  'text-base font-bold'
                                }>
                                  {heading.content}
                                </HeadingTag>
                              );
                            })}
                            
                            <div className="text-gray-700 whitespace-pre-wrap">
                              {content.body.split('\n').map((paragraph, i) => (
                                <p key={i} className="mb-4">{paragraph}</p>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-4 my-4">
                              {content.images.map((image, index) => {
                                const defaultCoffeeImgs = [
                                  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80",
                                  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80",
                                  "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=80"
                                ];
                                const imgSrc = image.src.startsWith('http') 
                                  ? image.src 
                                  : defaultCoffeeImgs[index % defaultCoffeeImgs.length];

                                return (
                                  <div key={index} className="border border-border/70 rounded-xl overflow-hidden bg-card/80 p-2.5 text-center shadow-md hover:border-primary/50 transition-all max-w-[210px] flex flex-col justify-between">
                                    <div className="relative h-32 w-full rounded-lg overflow-hidden bg-muted/40 flex items-center justify-center">
                                      <img 
                                        src={imgSrc}
                                        alt={image.alt || "Product image"}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = defaultCoffeeImgs[index % defaultCoffeeImgs.length];
                                        }}
                                      />
                                    </div>
                                    <div className="mt-2 text-left bg-background/80 rounded-md p-1.5 border border-border/40">
                                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center justify-between">
                                        <span>Image Alt Tag</span>
                                        <span className={image.alt ? "text-emerald-400 font-mono" : "text-amber-400 font-mono"}>
                                          {image.alt ? "✓ Set" : "⚠ Missing"}
                                        </span>
                                      </div>
                                      <div className="text-xs font-mono text-foreground truncate mt-0.5" title={image.alt}>
                                        "{image.alt || <span className="text-muted-foreground italic">none</span>}"
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="font-medium">Links:</h3>
                              <ul className="space-y-1 list-disc list-inside">
                                {content.links.map((link, index) => (
                                  <li key={index}>
                                    <a 
                                      href="#" 
                                      className={link.isInternal ? "text-blue-600" : "text-green-600"}
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      {link.text}
                                    </a>
                                    <span className="text-xs text-gray-500 ml-2">
                                      ({link.href})
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>Realistic Website Preview</CardTitle>
                          <CardDescription>Professional view of your optimized page</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden">
                          <div className="website-preview-container" style={{ width: '100%', maxWidth: '100%', overflow: 'auto', margin: '0 auto', padding: '20px' }}>
                            {content && (
                              <WebsitePreview 
                                content={content} 
                                industry={simulation.industry || ''} 
                                difficulty={simulation.difficulty || 'Beginner'} 
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Search Engine Results Preview</CardTitle>
                          <CardDescription>How your page might appear in search results</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white p-4 rounded-md border">
                            <div className="text-blue-600 text-xl hover:underline cursor-pointer">{content.title}</div>
                            <div className="text-green-700 text-sm">example.com/your-page-url</div>
                            <div className="text-gray-600">
                              {content.metaDescription && content.metaDescription.length > 160 
                                ? content.metaDescription.substring(0, 157) + '...' 
                                : content.metaDescription}
                            </div>
                            {content.schemaMarkup && (
                              <div className="mt-2 p-2 border border-gray-200 rounded bg-gray-50">
                                <p className="text-xs text-gray-500">Rich result preview (based on schema markup)</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-yellow-500">★★★★★</span>
                                  <span className="text-sm font-medium">5.0</span>
                                  <span className="text-sm text-gray-500">(24 reviews)</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )
                )}
              </TabsContent>
              
              <TabsContent value="results" className="space-y-6">
                {/* Analytics Impact Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-card/60 border-primary/20">
                    <CardContent className="p-4 space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center justify-between">
                        <span>Weekly Search Clicks</span>
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {weeklyClicks} <span className="text-xs font-normal text-muted-foreground">/ 50 clicks/wk</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground line-through">2 clicks/wk</span>
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0">
                          +{weeklyGrowthPct}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 border-primary/20">
                    <CardContent className="p-4 space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center justify-between">
                        <span>Google SERP Rank</span>
                        <Search className="h-3.5 w-3.5 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-blue-400">
                        {serpRank}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground line-through">#28 (Page 3)</span>
                        <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-[10px] px-1.5 py-0">
                          Top Rankings
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 border-primary/20">
                    <CardContent className="p-4 space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center justify-between">
                        <span>Site Bounce Rate</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {bounceRate}%
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground line-through">76%</span>
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0">
                          -{bounceDelta}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/60 border-primary/20">
                    <CardContent className="p-4 space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center justify-between">
                        <span>Conversion Rate</span>
                        <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                      </div>
                      <div className="text-2xl font-bold text-purple-400">
                        {convRate}%
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground line-through">1.1%</span>
                        <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-[10px] px-1.5 py-0">
                          +{(parseFloat(convRate) - 1.1).toFixed(1)}% Lift
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 6-Month Organic Traffic Trend Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-emerald-400" />
                          Weekly Traffic Growth Curve (2 → 50 Clicks/Wk Target)
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Daily telemetry: tracking Google re-crawl momentum as each on-page section is optimized
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs font-normal">
                        Google Search Console & GA4 Model
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="optimizedGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                            </linearGradient>
                            <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#64748b" stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                          <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#64748b" />
                          <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                            formatter={(value: any) => [`${value} clicks/week`, '']}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                          <Area type="monotone" dataKey="oldSite" name="Baseline (Old Broken Site: 2 clicks/wk)" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#baselineGrad)" strokeDasharray="4 4" />
                          <Area type="monotone" dataKey="optimized" name="Campaign Traffic Generated" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#optimizedGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Google Analytics 4 (GA4) Live Telemetry Console */}
                <Card className="border-border/80 bg-card/70 overflow-hidden shadow-lg">
                  <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                          GA4
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                              <span>Google Analytics 4 • Acquisition Telemetry</span>
                            </CardTitle>
                            <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                              G-JENNY-WV14
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            Live telemetry stream tracking session quality and conversion attribution
                          </CardDescription>
                        </div>
                      </div>

                      {/* Realtime Active Pulse */}
                      <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full text-emerald-400 text-xs">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="font-semibold text-[11px]">
                          {Math.max(2, Math.round(weeklyClicks / 10))} Active Users Right Now
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4">
                    {/* Top GA4 Stat Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-2.5 rounded-lg bg-background/60 border border-border/50">
                        <div className="text-[10px] text-muted-foreground uppercase font-semibold">Total Sessions</div>
                        <div className="text-xl font-bold text-foreground mt-0.5">{weeklyClicks + 28}</div>
                        <div className="text-[10px] text-emerald-400 font-medium">+{weeklyGrowthPct}% vs baseline</div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-background/60 border border-border/50">
                        <div className="text-[10px] text-muted-foreground uppercase font-semibold">Organic Search Share</div>
                        <div className="text-xl font-bold text-emerald-400 mt-0.5">
                          {Math.round((weeklyClicks / (weeklyClicks + 28)) * 100)}%
                        </div>
                        <div className="text-[10px] text-muted-foreground">Was 6% before fixes</div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-background/60 border border-border/50">
                        <div className="text-[10px] text-muted-foreground uppercase font-semibold">Engagement Rate</div>
                        <div className="text-xl font-bold text-foreground mt-0.5">
                          {Math.min(92, 24 + passedSectionsCount * 11)}%
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium">
                          {passedSectionsCount >= 5 ? "High Search Intent" : "Improving relevance"}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-background/60 border border-border/50">
                        <div className="text-[10px] text-muted-foreground uppercase font-semibold">Avg Engagement Time</div>
                        <div className="text-xl font-bold text-purple-400 mt-0.5">
                          {1 + Math.floor(passedSectionsCount * 0.3)}m {14 + passedSectionsCount * 8}s
                        </div>
                        <div className="text-[10px] text-muted-foreground">Up from 28s</div>
                      </div>
                    </div>

                    {/* GA4 Default Channel Grouping Table */}
                    <div className="border border-border/70 rounded-xl overflow-hidden bg-background/40">
                      <div className="px-3.5 py-2 bg-muted/40 border-b border-border/60 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Filter className="h-3.5 w-3.5" />
                          <span>Session Default Channel Grouping</span>
                        </div>
                        <span className="text-[11px] font-normal">Last 7 Days (Client Telemetry)</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-muted/20 text-muted-foreground border-b border-border/40 text-[11px]">
                            <tr>
                              <th className="py-2 px-3 font-semibold">Channel</th>
                              <th className="py-2 px-3 font-semibold text-right">Sessions</th>
                              <th className="py-2 px-3 font-semibold text-right">Engaged</th>
                              <th className="py-2 px-3 font-semibold text-right">Engagement Rate</th>
                              <th className="py-2 px-3 font-semibold text-right">Key Events (Conversions)</th>
                              <th className="py-2 px-3 font-semibold text-right">Channel Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/30">
                            {/* Organic Search Row (Dynamic!) */}
                            <tr className="bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors font-medium">
                              <td className="py-2.5 px-3 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                                <span className="font-semibold text-foreground">Organic Search (Google)</span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                                {weeklyClicks}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                {Math.max(1, Math.round(weeklyClicks * 0.78))}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                {Math.min(92, 25 + passedSectionsCount * 11)}%
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-foreground">
                                {Math.max(0, Math.round(weeklyClicks * 0.12))}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <Badge className={`text-[10px] px-1.5 py-0 ${
                                  weeklyClicks >= 50 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" :
                                  weeklyClicks > 12 ? "bg-blue-500/20 text-blue-300 border-blue-500/40" :
                                  "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                }`}>
                                  {weeklyClicks >= 50 ? "🌟 #1 Revenue Driver" : weeklyClicks > 12 ? "📈 Scaling Traffic" : "⚠️ Needs Tag Fixes"}
                                </Badge>
                              </td>
                            </tr>

                            {/* Direct */}
                            <tr className="hover:bg-muted/20 transition-colors text-muted-foreground">
                              <td className="py-2.5 px-3 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                                <span className="text-foreground">Direct Traffic</span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-medium text-foreground">14</td>
                              <td className="py-2.5 px-3 text-right">6</td>
                              <td className="py-2.5 px-3 text-right">42.8%</td>
                              <td className="py-2.5 px-3 text-right">1</td>
                              <td className="py-2.5 px-3 text-right">
                                <span className="text-[10px] text-muted-foreground">Local Regulars</span>
                              </td>
                            </tr>

                            {/* Referral */}
                            <tr className="hover:bg-muted/20 transition-colors text-muted-foreground">
                              <td className="py-2.5 px-3 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                                <span className="text-foreground">Referral (morgantownchamber.org)</span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-medium text-foreground">6</td>
                              <td className="py-2.5 px-3 text-right">4</td>
                              <td className="py-2.5 px-3 text-right">66.7%</td>
                              <td className="py-2.5 px-3 text-right">1</td>
                              <td className="py-2.5 px-3 text-right">
                                <span className="text-[10px] text-muted-foreground">Chamber Directory</span>
                              </td>
                            </tr>

                            {/* Organic Social */}
                            <tr className="hover:bg-muted/20 transition-colors text-muted-foreground">
                              <td className="py-2.5 px-3 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-pink-400"></span>
                                <span className="text-foreground">Organic Social (Instagram Bio)</span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-medium text-foreground">8</td>
                              <td className="py-2.5 px-3 text-right">3</td>
                              <td className="py-2.5 px-3 text-right">37.5%</td>
                              <td className="py-2.5 px-3 text-right">0</td>
                              <td className="py-2.5 px-3 text-right">
                                <span className="text-[10px] text-muted-foreground">Social Bio Link</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* GA4 Realtime Event Stream & Educational Callout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* Live Event Stream */}
                      <div className="p-3 rounded-lg bg-background/50 border border-border/60 space-y-2">
                        <div className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-blue-400" />
                          <span>Realtime Event Stream (Live Telemetry)</span>
                        </div>
                        <div className="space-y-1 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-muted-foreground py-0.5 border-b border-border/30">
                            <span className="text-emerald-400">page_view</span>
                            <span className="text-foreground text-[10px]">/shop/organic-arabica</span>
                            <span className="text-[9px] text-muted-foreground/60">2s ago</span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground py-0.5 border-b border-border/30">
                            <span className="text-blue-400">session_start</span>
                            <span className="text-foreground text-[10px]">google / organic</span>
                            <span className="text-[9px] text-muted-foreground/60">18s ago</span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground py-0.5 border-b border-border/30">
                            <span className="text-purple-400">user_engagement</span>
                            <span className="text-foreground text-[10px]">scroll_depth: 90%</span>
                            <span className="text-[9px] text-muted-foreground/60">45s ago</span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground py-0.5">
                            <span className="text-amber-400">view_item</span>
                            <span className="text-foreground text-[10px]">Ethiopian Single Origin 500g</span>
                            <span className="text-[9px] text-muted-foreground/60">1m ago</span>
                          </div>
                        </div>
                      </div>

                      {/* Educational Strategy Callout */}
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1.5 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-semibold text-primary flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                            <span>Agency Insight: Reading GA4 Channels</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                            In real agency reporting, clients care about <strong>Attribution</strong>. When Jenny opens GA4, she wants to know if her SEO investment is actually generating revenue compared to her Instagram profile.
                          </p>
                        </div>
                        <div className="text-[10px] text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                          ✓ Your on-page optimizations have driven Organic Search from <strong>6%</strong> of Jenny's total traffic up to <strong>{Math.round((weeklyClicks / (weeklyClicks + 28)) * 100)}%</strong>.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Score Breakdown */}
                {latestAttempt ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">Technical SEO Audit Score: {latestAttempt.score}/100</CardTitle>
                          <CardDescription className="text-xs">Evaluated on {new Date(latestAttempt.completedAt).toLocaleDateString()} at {new Date(latestAttempt.completedAt).toLocaleTimeString()}</CardDescription>
                        </div>
                        <Badge variant={latestAttempt.score >= 70 ? "secondary" : "destructive"}>
                          {latestAttempt.score >= 85 ? "🌟 Master Grade" : latestAttempt.score >= 70 ? "✅ Verified Passing" : "⚠️ Needs Optimization"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5 p-3 rounded-md bg-secondary/30">
                          <div className="flex justify-between text-xs font-medium">
                            <span>Readability</span>
                            <span>{latestAttempt.readabilityScore}/100</span>
                          </div>
                          <Progress value={latestAttempt.readabilityScore} className="h-2" />
                        </div>
                        <div className="space-y-1.5 p-3 rounded-md bg-secondary/30">
                          <div className="flex justify-between text-xs font-medium">
                            <span>Technical SEO</span>
                            <span>{latestAttempt.technicalSeoScore}/100</span>
                          </div>
                          <Progress value={latestAttempt.technicalSeoScore} className="h-2" />
                        </div>
                        <div className="space-y-1.5 p-3 rounded-md bg-secondary/30">
                          <div className="flex justify-between text-xs font-medium">
                            <span>Content Quality</span>
                            <span>{latestAttempt.contentQualityScore}/100</span>
                          </div>
                          <Progress value={latestAttempt.contentQualityScore} className="h-2" />
                        </div>
                      </div>

                      {/* Keyword Density & Placement */}
                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                          Target Keywords Search Performance
                        </h4>
                        <div className="space-y-2">
                          {latestAttempt.keywordOptimization.map((keyword: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-md border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="font-semibold text-sm flex items-center gap-2">
                                  <span>"{keyword.keyword}"</span>
                                  <Badge variant={keyword.density >= 0.5 && keyword.density <= 2.5 ? "secondary" : "outline"} className="text-[10px]">
                                    {keyword.density.toFixed(2)}% Density
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{keyword.feedback}</p>
                              </div>
                              <div className="text-xs text-right shrink-0">
                                <span className="text-emerald-400 font-medium">Placement: {keyword.placement.join(', ') || 'None'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Issues Fixed */}
                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                          On-Page Crawl Fixes
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {latestAttempt.issuesFixed.map((issue: any, index: number) => (
                            <div key={index} className="flex items-start space-x-2 p-2.5 border rounded-md bg-card/40">
                              {issue.fixed ? (
                                <div className="h-5 w-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="h-3.5 w-3.5" />
                                </div>
                              ) : (
                                <div className="h-5 w-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <X className="h-3.5 w-3.5" />
                                </div>
                              )}
                              <div className="space-y-0.5">
                                <div className="text-xs font-semibold">{issue.issueType}</div>
                                <div className="text-[11px] text-muted-foreground">{issue.feedback}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Portfolio qualification banner */}
                      {latestAttempt.score >= 70 && (
                        <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/15 via-primary/10 to-card border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                              <ShieldCheck className="h-4 w-4" />
                              <span>Eligible for Proof-of-Work Verification</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Your SEO score of {latestAttempt.score}/100 qualifies this campaign for your verified Agency Portfolio.
                            </p>
                          </div>
                          <Button 
                            onClick={handleSaveToPortfolio}
                            disabled={isSavingPortfolio}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 px-4 shrink-0 flex items-center gap-2"
                          >
                            <Briefcase className="h-4 w-4" />
                            <span>📌 Save to My Portfolio</span>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <Edit className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm">Site Has Not Been Re-Audited Yet</h4>
                        <p className="text-xs text-muted-foreground max-w-md mx-auto">
                          Click <strong>"Edit Website CMS"</strong> in the top right to fix title tags, heading tags, image alts, and keyword density. Then click <strong>"Publish & Re-Audit Site"</strong> to see your new traffic metrics!
                        </p>
                      </div>
                      <Button onClick={() => setEditMode(true)} className="text-xs h-8">
                        <Edit className="mr-1.5 h-3.5 w-3.5" /> Start Optimizing Now
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            {/* Client Intake Dossier & Business Background Card */}
            <Card className="border-primary/30 bg-gradient-to-br from-card via-card/90 to-primary/5 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase tracking-wider font-mono">
                    <Briefcase className="h-3 w-3 mr-1 inline" /> Agency Client Dossier
                  </Badge>
                  <div className="flex items-center gap-2">
                    {crisisResolved ? (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        <span>Crisis Averted (+15 Rep)</span>
                      </Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCrisisOpen(true)}
                        className="h-6 px-2 text-[10px] text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 rounded"
                        title="Simulate surprise incoming emergency client call"
                      >
                        🚨 Test Crisis Call
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground font-medium">Discovery Brief</span>
                  </div>
                </div>
                <CardTitle className="text-base font-bold mt-1 text-foreground">
                  {simulation.clientDossier?.clientName || "Jenny's Artisan Java & Roastery"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {simulation.clientDossier?.founderName || "Jenny Miller (Founder & Master Roaster)"} • {simulation.clientDossier?.location || "Morgantown, WV (Est. 2014)"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 pt-0 text-xs">
                
                {/* First-Person Marketer Field Notes Callout */}
                <div className="p-3 rounded-lg bg-secondary/40 border border-border/70 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Your On-Site Field Notes (Client Discovery Visit)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic leading-relaxed whitespace-pre-line">
                    {simulation.clientDossier?.fieldNotes || `“I visited Jenny's Artisan Roastery on a Tuesday morning. The smell of roasting coffee hits you the second you walk through the door, and there was already a line of 12 people waiting for fresh pour-overs.

I sat down with Jenny in her back office next to stacked burlap sacks stamped 'Certified Organic Arabica — Guatemala & Ethiopia'. She showed me her roaster and explained:

'We roast small 15-pound batches every morning and ship within 24 hours so the beans are at peak freshness. But last year my nephew threw together our website in 10 minutes. He just wrote generic filler like "We sell coffee beans." Our regular customers told me the site looks like a generic template from 2005 and doesn't even mention that our beans are 100% certified organic Arabica or single-origin. When people search Google for organic arabica coffee beans or fresh roasted specialty coffee, we don't even show up!'

Walking through the roastery, the problem was crystal clear: Jenny has a world-class physical product, but search engine crawlers have zero idea what she actually sells because her title tags, H1 headings, and image alt tags are completely blank or generic.”`}
                  </p>
                </div>

                {/* Customer Quotes */}
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-1">
                  <span className="font-semibold text-blue-400 block text-[11px]">Real Customer Feedback:</span>
                  <div className="space-y-1">
                    {(simulation.clientDossier?.customerFeedback || [
                      "“We tried searching Google for your services and couldn't find your website anywhere.” — Verified Customer"
                    ]).map((quote: string, qIdx: number) => (
                      <p key={qIdx} className="text-[11px] text-muted-foreground italic">
                        {quote}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Products & Specs */}
                <div>
                  <span className="font-semibold text-foreground">Product Offerings: </span>
                  <span className="text-muted-foreground">
                    {simulation.clientDossier?.products || "100% Organic Certified Arabica Coffee Beans, Single-Origin roasts (Guatemala & Ethiopia), Specialty Espresso Blends (250g, 500g, 1kg)."}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-foreground block mb-1">Key Selling Points:</span>
                  <ul className="space-y-1 pl-3 list-disc text-muted-foreground">
                    {(simulation.clientDossier?.valueProps || [
                      "100% Fair-Trade & Organic Arabica beans",
                      "Roasted in small batches every Monday & Thursday",
                      "Shipped within 24 hours of roasting for peak flavor",
                      "Whole bean and custom coarse/fine grinds"
                    ]).map((vp: string, idx: number) => (
                      <li key={idx}>{vp}</li>
                    ))}
                  </ul>
                </div>

                {/* Marketer Strategic Notice */}
                <div className="p-2 rounded bg-muted/50 border border-border text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">💡 Marketer Directive: </span>
                  Do not copy-paste raw conversational quotes into your headings or titles. Translate Jenny's authentic story into concise, high-converting SEO tags matching the target keywords.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Target Keywords</CardTitle>
                <CardDescription>Optimize your content for these keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {simulation.targetKeywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-amber-500/30 bg-card/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-amber-400">
                  <span>Client Baseline Defects (To Fix)</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Original defects in Jenny's website before your optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {simulation.seoIssues.map((issue: {
                  type: string;
                  description: string;
                  severity: 'low' | 'medium' | 'high';
                  location: string;
                }, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        issue.severity === 'high' ? 'destructive' :
                        issue.severity === 'medium' ? 'default' :
                        'outline'
                      }>
                        {issue.severity}
                      </Badge>
                      <span className="font-medium">{issue.type}</span>
                    </div>
                    <p className="text-sm text-gray-600">{issue.description}</p>
                    <p className="text-xs text-gray-500">Location: {issue.location}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
                <CardDescription>Recommendations for good SEO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue={simulation.bestPractices[0]?.category || ""}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    {simulation.bestPractices
                      .reduce((categories, practice) => {
                        if (!categories.includes(practice.category)) {
                          categories.push(practice.category);
                        }
                        return categories;
                      }, [] as string[])
                      .slice(0, 3)
                      .map((category) => (
                        <TabsTrigger key={category} value={category}>
                          {category}
                        </TabsTrigger>
                      ))
                    }
                  </TabsList>
                  
                  {simulation.bestPractices
                    .reduce((categories, practice) => {
                      if (!categories.includes(practice.category)) {
                        categories.push(practice.category);
                      }
                      return categories;
                    }, [] as string[])
                    .map((category) => (
                      <TabsContent key={category} value={category} className="space-y-4">
                        {simulation.bestPractices
                          .filter(practice => practice.category === category)
                          .map((practice, index) => (
                            <div key={index} className="space-y-2">
                              <p className="text-sm">{practice.description}</p>
                              <div className="bg-gray-50 p-2 text-sm text-gray-600 rounded border">
                                <div className="text-xs font-medium mb-1">Example:</div>
                                {practice.example}
                              </div>
                            </div>
                          ))
                        }
                      </TabsContent>
                    ))
                  }
                </Tabs>
              </CardContent>
            </Card>
            
            {attempts && attempts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Previous Attempts</CardTitle>
                  <CardDescription>Your submission history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {attempts.map((attempt: {
                      id: number;
                      simulationId: number;
                      score: number;
                      completedAt: string;
                    }, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded hover:bg-gray-50">
                      <div>
                        <div className="font-medium">Attempt #{attempts.length - index}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(attempt.completedAt).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant={
                        attempt.score >= 80 ? 'secondary' :
                        attempt.score >= 60 ? 'default' :
                        'destructive'
                      }>
                        {attempt.score}/100
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* AI Dynamic Website Builder Modal */}
      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="max-w-md bg-card border-border/80 text-foreground">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <Wand2 className="h-5 w-5 text-purple-400" />
              <DialogTitle>AI Dynamic Website Builder Sandbox</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Instruct the AI Chatbot to instantly generate a custom client website in the sandbox with realistic copy, headings, and schema markup to test your optimization skills.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Select Industry / Business Model Niche:</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={builderNiche === "gym" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBuilderNiche("gym")}
                  className="text-xs h-9"
                >
                  🏋️ Gym / Fitness
                </Button>
                <Button
                  type="button"
                  variant={builderNiche === "solar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBuilderNiche("solar")}
                  className="text-xs h-9"
                >
                  ☀️ Solar / Trades
                </Button>
                <Button
                  type="button"
                  variant={builderNiche === "law" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBuilderNiche("law")}
                  className="text-xs h-9"
                >
                  ⚖️ Legal / Injury
                </Button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/40 border border-border/40 space-y-1">
              <div className="font-semibold text-foreground text-xs">Sandbox Specifications:</div>
              <p className="text-muted-foreground text-[11px]">
                The AI will construct a fully responsive landing page with an H1/H2 heading silo, meta description, optimized body copy, and JSON-LD schema ready to audit in the Live Analytics Engine.
              </p>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsBuilderOpen(false)}>
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleAIGenerateWebsite}
              className="bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Dynamic Sandbox Site</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Ask Growth Director Mentor Side Drawer */}
      <FlightInstructorCopilot 
        track="seo"
        pageTitle="Jenny's Artisan Java CMS Repair"
        currentDraft={content}
      />

      {/* Mid-Campaign Surprise Client Crisis Incoming Call & Decision Modal */}
      <EmergencyCrisisModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
        onResolved={() => {
          setCrisisResolved(true);
          toast({
            title: "🎉 Crisis Averted!",
            description: "Jenny confirmed the in-store dispute was smoothed over. +15 Reputation Points logged to your agency portfolio!",
          });
        }}
        callerName="Sarah Jenkins"
        callerRole="Lead Account Director"
        clientName={simulation?.clientDossier?.clientName || "Jenny's Artisan Java"}
      />
    </div>
  );
}
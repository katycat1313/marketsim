import { useState, useEffect } from 'react';
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
  Layout
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
  
  // Initialize content with original simulation content
  useEffect(() => {
    if (simulation && !content) {
      setContent(JSON.parse(JSON.stringify(simulation.originalContent)));
    }
  }, [simulation, content]);
  
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
  
  const [, setLocation] = useLocation();
  const [isSavingPortfolio, setIsSavingPortfolio] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderNiche, setBuilderNiche] = useState("gym");

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

  const handleAIGenerateWebsite = () => {
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
      title: "✨ AI Sandbox Website Generated!",
      description: `Loaded new dynamic sandbox for ${template.name}. Edit and run your audit!`,
    });
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
  const score = latestAttempt ? latestAttempt.score : 42;
  const organicTraffic = Math.round(1200 + (score / 100) * 3600);
  const baselineTraffic = 1200;
  const trafficDeltaPct = Math.round(((organicTraffic - baselineTraffic) / baselineTraffic) * 100);
  const bounceRate = Math.max(28, Math.round(76 - (score / 100) * 44));
  const baselineBounceRate = 76;
  const bounceDelta = baselineBounceRate - bounceRate;
  const convRate = (1.1 + (score / 100) * 2.7).toFixed(1);
  const serpRank = score >= 85 ? "#3 (Page 1)" : score >= 70 ? "#6 (Page 1)" : score >= 50 ? "#14 (Page 2)" : "#28 (Page 3)";
  const trafficTrendData = [
    { month: 'Month 1', baseline: 1150, optimized: 1150 },
    { month: 'Month 2', baseline: 1180, optimized: 1240 },
    { month: 'Month 3', baseline: 1200, optimized: Math.round(1200 + (score / 100) * 900) },
    { month: 'Month 4', baseline: 1210, optimized: Math.round(1210 + (score / 100) * 1850) },
    { month: 'Month 5', baseline: 1220, optimized: Math.round(1220 + (score / 100) * 2700) },
    { month: 'Month 6', baseline: 1250, optimized: organicTraffic },
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
                    {simulation.difficulty === 'Beginner' ? (
                      // Beginner mode - Form-based editor
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Page Title</CardTitle>
                            <CardDescription>The title tag is a critical SEO element (50-60 characters ideal)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Input 
                              value={content.title} 
                              onChange={handleTitleChange}
                              disabled={!editMode}
                              className={editMode ? "border-blue-300" : ""}
                            />
                            <div className="mt-2 text-xs text-gray-500">
                              {content.title.length} characters
                            </div>
                          </CardContent>
                        </Card>
                    
                        <Card>
                          <CardHeader>
                            <CardTitle>Meta Description</CardTitle>
                            <CardDescription>Appears in search results (150-160 characters ideal)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Textarea 
                              value={content.metaDescription} 
                              onChange={handleMetaDescriptionChange}
                              disabled={!editMode}
                              className={editMode ? "border-blue-300" : ""}
                              rows={3}
                            />
                            <div className="mt-2 text-xs text-gray-500">
                              {content.metaDescription.length} characters
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Headings</CardTitle>
                            <CardDescription>Heading structure is important for SEO and accessibility</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {content.headings.map((heading, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{heading.tag}</Badge>
                                  <Input 
                                    value={heading.content} 
                                    onChange={(e) => handleHeadingChange(index, e.target.value)}
                                    disabled={!editMode}
                                    className={editMode ? "border-blue-300" : ""}
                                  />
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Body Content</CardTitle>
                            <CardDescription>Main content of the page (300+ words recommended)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Textarea 
                              value={content.body} 
                              onChange={handleBodyChange}
                              disabled={!editMode}
                              className={editMode ? "border-blue-300" : ""}
                              rows={8}
                            />
                            <div className="mt-2 text-xs text-gray-500">
                              {content.body.split(/\s+/).length} words
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Images</CardTitle>
                            <CardDescription>Images should have descriptive alt text</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {content.images.map((image, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-1/4">
                                    <Badge variant="outline">Image src</Badge>
                                    <div className="text-sm mt-1 truncate">{image.src}</div>
                                  </div>
                                  <div className="w-3/4">
                                    <Badge variant="outline">Alt Text</Badge>
                                    <Input 
                                      value={image.alt} 
                                      onChange={(e) => handleImageAltChange(index, e.target.value)}
                                      disabled={!editMode}
                                      className={editMode ? "border-blue-300" : ""}
                                      placeholder="Descriptive alt text for the image"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                        
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
                            
                            <div className="flex flex-wrap gap-4">
                              {content.images.map((image, index) => (
                                <div key={index} className="border p-2 text-center">
                                  <div className="bg-gray-100 h-20 w-32 flex items-center justify-center text-gray-400">
                                    [Image: {image.src.split('/').pop()}]
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">Alt: {image.alt}</div>
                                </div>
                              ))}
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
                        <span>Organic Traffic</span>
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {organicTraffic.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground line-through">{baselineTraffic.toLocaleString()}</span>
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0">
                          +{trafficDeltaPct}%
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
                          6-Month Organic Traffic Trajectory
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Comparing pre-optimization baseline against post-audit ranking momentum
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
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#64748b" />
                          <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                            formatter={(value: any) => [`${value.toLocaleString()} visitors`, '']}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                          <Area type="monotone" dataKey="baseline" name="Baseline (Old Site)" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#baselineGrad)" strokeDasharray="4 4" />
                          <Area type="monotone" dataKey="optimized" name="Optimized Site Trajectory" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#optimizedGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
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
            
            <Card>
              <CardHeader>
                <CardTitle>SEO Issues to Fix</CardTitle>
                <CardDescription>Problems identified in the original content</CardDescription>
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
    </div>
  );
}
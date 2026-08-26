import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Trophy, 
  Sparkles, 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Briefcase, 
  Share2, 
  Plus, 
  Trash2,
  Layers,
  Search,
  Users,
  Layout,
  TrendingUp,
  Zap,
  ShieldCheck
} from "lucide-react";

export default function CapstoneSimulationPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<"brief" | "search" | "social" | "landing" | "results">("brief");

  // Step 1: Persona & Strategy
  const [persona, setPersona] = useState({
    targetDemographic: "Athletes & Fitness Enthusiasts aged 24-42",
    corePainPoint: "Overpriced, low-durability training footwear that wears out in 3 months",
    hookAngle: "Military-grade durability backed by a 1-year zero-tear guarantee",
  });

  // Step 2: Search Ads
  const [searchKeywords, setSearchKeywords] = useState([
    { text: "durable training shoes", matchType: "phrase" },
    { text: "mens crossfit footwear", matchType: "exact" },
  ]);
  const [newKwText, setNewKwText] = useState("");
  const [newKwMatch, setNewKwMatch] = useState("phrase");
  const [negativeKeywords, setNegativeKeywords] = useState(["free", "cheap", "diy", "jobs", "wholesale"]);
  const [newNegText, setNewNegText] = useState("");
  const [searchHeadline, setSearchHeadline] = useState("Official Apex Training Shoes - Built to Endure 3x Longer");

  // Step 3: Social Ads
  const [socialAudience, setSocialAudience] = useState("1% Lookalike of Past Purchasers + CrossFit / Weightlifting Interests");
  const [socialHeadline, setSocialHeadline] = useState("Stop replacing your shoes every 3 months. Test our 1-Year Guarantee.");
  const [socialFormat, setSocialFormat] = useState("Vertical Video (Reels / TikTok)");

  // Step 4: Landing Page
  const [landingHeadline, setLandingHeadline] = useState("Engineered for 500+ Intense Workouts: The Apex Training Shoe");
  const [landingCTA, setLandingCTA] = useState("Get 15% Off Your First Pair - Risk-Free 30-Day Trial");

  // Results state
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [isSavingPortfolio, setIsSavingPortfolio] = useState(false);

  const evaluateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiRequest("POST", "/api/ad-simulations/capstone/evaluate", payload);
      return res.json();
    },
    onSuccess: (data) => {
      setSimulationResults(data);
      setCurrentStep("results");
      toast({
        title: "Omnichannel Campaign Evaluated",
        description: `Blended Score: ${data.score}/100 with ${data.metrics.roas}x ROAS.`,
      });
    }
  });

  const savePortfolioMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiRequest("POST", "/api/user/portfolio", payload);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/portfolio"] });
      toast({
        title: "📌 Case Study Saved to Portfolio",
        description: "Your verified work sample is now live in your public portfolio!",
      });
      setLocation("/portfolio");
    }
  });

  const handleAddKeyword = () => {
    if (!newKwText.trim()) return;
    setSearchKeywords([...searchKeywords, { text: newKwText.trim(), matchType: newKwMatch }]);
    setNewKwText("");
  };

  const handleRemoveKeyword = (index: number) => {
    setSearchKeywords(searchKeywords.filter((_, i) => i !== index));
  };

  const handleAddNegative = () => {
    if (!newNegText.trim()) return;
    setNegativeKeywords([...negativeKeywords, newNegText.trim().toLowerCase()]);
    setNewNegText("");
  };

  const handleRemoveNegative = (index: number) => {
    setNegativeKeywords(negativeKeywords.filter((_, i) => i !== index));
  };

  const handleRunCapstone = () => {
    evaluateMutation.mutate({
      persona,
      searchAds: {
        keywords: searchKeywords,
        negativeKeywords,
        headline: searchHeadline,
      },
      socialAds: {
        lookalikeAudiences: [socialAudience],
        interests: ["CrossFit", "Fitness"],
        creativeHeadline: socialHeadline,
        format: socialFormat,
      },
      landingPage: {
        headlineMatch: landingHeadline.toLowerCase().includes("apex") || landingHeadline.toLowerCase().includes("training"),
        callToAction: landingCTA,
      },
      budget: 5000,
    });
  };

  const handleSaveToPortfolio = () => {
    if (!simulationResults) return;
    setIsSavingPortfolio(true);

    const caseStudyPayload = {
      id: `cs-capstone-${Date.now()}`,
      simulationId: 999,
      title: "Omnichannel Growth: $5k/mo Full-Funnel Scaling for Apex Athletics",
      clientName: "Apex Athletics",
      industry: "E-Commerce Athletics",
      platform: "Google Search & Meta Ads",
      difficulty: "Master Capstone",
      challengeSummary: "Client needed an end-to-end full funnel campaign launching both Search capture and Meta acquisition under a strict $30 CPA limit.",
      strategySummary: `Defined core durability angle (${persona.hookAngle}), deployed phrase/exact search pairs with ${negativeKeywords.length} negative filters, and aligned landing page messaging.`,
      keyTactics: [
        `${negativeKeywords.length} negative keyword exclusions protecting budget`,
        `Quality Score ${simulationResults.qualityScore}/10 achieved with search copy mirroring`,
        `Direct message match between social reels hook and landing page CTA`
      ],
      metrics: {
        qualityScore: simulationResults.qualityScore,
        roas: simulationResults.metrics.roas,
        cpa: simulationResults.metrics.costPerConversion,
        ctr: simulationResults.metrics.ctr,
        conversions: simulationResults.metrics.conversions,
        spend: simulationResults.metrics.spend
      },
      score: simulationResults.score,
    };

    savePortfolioMutation.mutate(caseStudyPayload);
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500/20 via-card to-background border border-amber-500/40 shadow-xl space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-7 w-7 text-amber-400" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Agency Capstone: Full Omnichannel Campaign
              </h1>
              <p className="text-xs text-amber-400 font-semibold">
                The Master Agency Simulation • Build Strategy $\rightarrow$ Search $\rightarrow$ Social $\rightarrow$ Landing Page
              </p>
            </div>
          </div>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-xs">
            Client: Apex Athletics ($5,000/mo Budget)
          </Badge>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-5 gap-2 text-xs font-semibold">
        <button 
          onClick={() => setCurrentStep("brief")}
          className={`p-3 rounded-lg border text-center transition ${currentStep === "brief" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border/50"}`}
        >
          1. Persona & Brief
        </button>
        <button 
          onClick={() => setCurrentStep("search")}
          className={`p-3 rounded-lg border text-center transition ${currentStep === "search" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border/50"}`}
        >
          2. Google Search
        </button>
        <button 
          onClick={() => setCurrentStep("social")}
          className={`p-3 rounded-lg border text-center transition ${currentStep === "social" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border/50"}`}
        >
          3. Meta / Social Ads
        </button>
        <button 
          onClick={() => setCurrentStep("landing")}
          className={`p-3 rounded-lg border text-center transition ${currentStep === "landing" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border/50"}`}
        >
          4. Landing Page
        </button>
        <button 
          onClick={() => simulationResults && setCurrentStep("results")}
          disabled={!simulationResults}
          className={`p-3 rounded-lg border text-center transition ${currentStep === "results" ? "bg-emerald-600 text-white border-emerald-500" : "bg-card text-muted-foreground border-border/50 disabled:opacity-40"}`}
        >
          5. Live Auction Results
        </button>
      </div>

      {/* Step 1: Brief & Persona */}
      {currentStep === "brief" && (
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Step 1: Client Brief & Customer Angle</CardTitle>
            </div>
            <CardDescription>
              Define your core buyer persona, their main frustration, and the value proposition hook.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-card/80 border border-border/50 space-y-1 text-xs">
              <span className="font-semibold text-foreground">Client Objective:</span>
              <p className="text-muted-foreground">
                Apex Athletics is launching their new Cross-Training shoe. They have a $5,000 monthly budget and need to achieve at least 3.5x ROAS with a CPA under $30.00.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Target Audience Demographic:</label>
                <Input 
                  value={persona.targetDemographic}
                  onChange={(e) => setPersona({ ...persona, targetDemographic: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Core Customer Pain Point:</label>
                <Input 
                  value={persona.corePainPoint}
                  onChange={(e) => setPersona({ ...persona, corePainPoint: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Campaign Hook Angle:</label>
                <Input 
                  value={persona.hookAngle}
                  onChange={(e) => setPersona({ ...persona, hookAngle: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border/40 pt-3">
            <Button onClick={() => setCurrentStep("search")} className="flex items-center gap-2">
              <span>Next: Configure Google Search</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Google Search Strategy */}
      {currentStep === "search" && (
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <CardTitle>Step 2: Google Search Ads & Negative Keyword Gating</CardTitle>
            </div>
            <CardDescription>
              Set high-intent keywords, match types, negative keywords, and responsive search headline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Keywords */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground">Search Keywords & Match Types:</label>
              <div className="flex gap-2">
                <Input 
                  value={newKwText}
                  onChange={(e) => setNewKwText(e.target.value)}
                  placeholder="e.g. durable cross training shoes"
                  className="bg-background"
                />
                <select 
                  value={newKwMatch} 
                  onChange={(e) => setNewKwMatch(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="exact">[Exact Match]</option>
                  <option value="phrase">"Phrase Match"</option>
                  <option value="broad">Broad Match</option>
                </select>
                <Button onClick={handleAddKeyword} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {searchKeywords.map((kw, i) => (
                  <Badge key={i} variant="secondary" className="text-xs py-1 px-2.5 flex items-center gap-1.5">
                    <span>{kw.matchType === "exact" ? `[${kw.text}]` : kw.matchType === "phrase" ? `"${kw.text}"` : kw.text}</span>
                    <button onClick={() => handleRemoveKeyword(i)} className="text-muted-foreground hover:text-red-400">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Negative Keywords */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Negative Keyword Exclusions (Prevents Wasted Spend):</label>
                <span className="text-xs text-amber-400">{negativeKeywords.length} active filters</span>
              </div>
              <div className="flex gap-2">
                <Input 
                  value={newNegText}
                  onChange={(e) => setNewNegText(e.target.value)}
                  placeholder="e.g. free, cheap, discount, repair"
                  className="bg-background"
                />
                <Button onClick={handleAddNegative} size="sm" variant="secondary" className="shrink-0">
                  Add Negative
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {negativeKeywords.map((neg, i) => (
                  <Badge key={i} variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-xs py-1 px-2 flex items-center gap-1">
                    <span>-{neg}</span>
                    <button onClick={() => handleRemoveNegative(i)} className="hover:text-red-300">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Search Headline */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Responsive Search Ad Headline 1 (Relevance Anchor):</label>
              <Input 
                value={searchHeadline}
                onChange={(e) => setSearchHeadline(e.target.value)}
                className="bg-background"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-border/40 pt-3">
            <Button variant="outline" onClick={() => setCurrentStep("brief")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </Button>
            <Button onClick={() => setCurrentStep("social")}>
              <span>Next: Meta & Social Creative</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Meta & Social Ads */}
      {currentStep === "social" && (
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <CardTitle>Step 3: Meta Ads Creative & Lookalike Audiences</CardTitle>
            </div>
            <CardDescription>
              Configure lookalike audience segmentation, video format, and creative hook.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Audience Segmentation & Lookalikes:</label>
              <Input 
                value={socialAudience}
                onChange={(e) => setSocialAudience(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Social Ad Creative Hook / Headline:</label>
              <Input 
                value={socialHeadline}
                onChange={(e) => setSocialHeadline(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Primary Ad Format:</label>
              <select 
                value={socialFormat}
                onChange={(e) => setSocialFormat(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="Vertical Video (Reels / TikTok)">Vertical Video (Instagram Reels / TikTok 9:16)</option>
                <option value="Feed Carousel">Multi-Product Feed Carousel (1:1)</option>
                <option value="Single Image Hook">High-Contrast Single Static Image</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-border/40 pt-3">
            <Button variant="outline" onClick={() => setCurrentStep("search")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </Button>
            <Button onClick={() => setCurrentStep("landing")}>
              <span>Next: Landing Page & SEO Synergy</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Landing Page Synergy */}
      {currentStep === "landing" && (
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              <CardTitle>Step 4: Landing Page & Search Intent Synergy</CardTitle>
            </div>
            <CardDescription>
              Align your destination page proposition directly with ad promises to prevent high bounce rates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Landing Page Hero H1 Headline:</label>
              <Input 
                value={landingHeadline}
                onChange={(e) => setLandingHeadline(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Primary Call-to-Action (CTA):</label>
              <Input 
                value={landingCTA}
                onChange={(e) => setLandingCTA(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="p-4 rounded-lg bg-card/80 border border-primary/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <Zap className="h-4 w-4" />
                <span>Ready for Live Auction Simulation:</span>
              </div>
              <p className="text-muted-foreground">
                The engine will now execute auction calculations across your Search, Social, and Landing Page settings to determine Quality Score, CPC, Blended ROAS, and Wasted Spend prevention.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-border/40 pt-3">
            <Button variant="outline" onClick={() => setCurrentStep("social")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </Button>
            <Button 
              onClick={handleRunCapstone} 
              disabled={evaluateMutation.isPending}
              className="bg-gradient-to-r from-amber-500 to-primary text-black font-semibold text-xs h-9 px-6 flex items-center gap-2"
            >
              {evaluateMutation.isPending ? (
                <span>Simulating Multi-Channel Auctions...</span>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Execute Full Capstone Simulation</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 5: Live Auction Results & Portfolio Export */}
      {currentStep === "results" && simulationResults && (
        <div className="space-y-6">
          <Card className="border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-card to-background shadow-xl">
            <CardHeader className="border-b border-amber-500/20 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-amber-400" />
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      Capstone Performance: {simulationResults.aiDebrief.verdict}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {simulationResults.aiDebrief.summary}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Overall Mastery Score</div>
                  <div className="text-2xl font-bold text-amber-400">{simulationResults.score}/100</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-card/80 border border-border/50">
                  <div className="text-xs text-muted-foreground">Quality Score</div>
                  <div className="text-2xl font-bold text-foreground mt-1">{simulationResults.qualityScore}/10</div>
                </div>
                <div className="p-3 rounded-lg bg-card/80 border border-border/50">
                  <div className="text-xs text-muted-foreground">Blended ROAS</div>
                  <div className="text-2xl font-bold text-primary mt-1">{simulationResults.metrics.roas}x</div>
                </div>
                <div className="p-3 rounded-lg bg-card/80 border border-border/50">
                  <div className="text-xs text-muted-foreground">Average CPA</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">${simulationResults.metrics.costPerConversion}</div>
                </div>
                <div className="p-3 rounded-lg bg-card/80 border border-border/50">
                  <div className="text-xs text-muted-foreground">Conversions</div>
                  <div className="text-2xl font-bold text-foreground mt-1">{simulationResults.metrics.conversions}</div>
                </div>
              </div>

              {/* Feedback Points */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground">Agency Audit Analysis:</div>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {simulationResults.feedback.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Portfolio Banner */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/15 via-primary/10 to-card border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Proof-of-Work Verification Ready</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Save This Campaign as a Verified Case Study</h4>
                  <p className="text-xs text-muted-foreground">
                    Publish this verified campaign result to your public Agency Portfolio to showcase to employers.
                  </p>
                </div>
                <Button 
                  onClick={handleSaveToPortfolio}
                  disabled={savePortfolioMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 px-4 shrink-0 flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>📌 Save to My Portfolio</span>
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-border/40 pt-3">
              <Button variant="outline" onClick={() => setCurrentStep("brief")}>
                Refine Campaign Settings
              </Button>
              <Button variant="default" onClick={() => setLocation("/portfolio")}>
                View My Portfolio
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

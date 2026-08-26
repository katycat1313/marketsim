import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { AdPlatformSimulation } from "@shared/schema";
import { 
  Sparkles, 
  Target, 
  ShieldAlert, 
  Zap, 
  TrendingUp, 
  Layers, 
  PlusCircle, 
  CheckCircle2, 
  ArrowRight,
  Brain,
  Trophy,
  Briefcase,
  Mic,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Check,
  CheckCircle,
  MessageSquare
} from "lucide-react";

export default function AdSimulationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [genPlatform, setGenPlatform] = useState("google_ads");
  const [genDifficulty, setGenDifficulty] = useState("Expert");
  const [genWeakness, setGenWeakness] = useState("negativeKeywordDefense");
  const [genIndustry, setGenIndustry] = useState("B2B Cybersecurity SaaS");

  // MarketSim Pre-Simulation AI Socratic Micro-Lesson Modal State
  const [selectedSimForLesson, setSelectedSimForLesson] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const getMicroLesson = (sim: any) => {
    if (!sim) return null;
    const isMeta = sim.platform === "meta_ads";
    const isQualityScore = sim.title?.toLowerCase().includes("quality") || sim.weaknessLabel?.toLowerCase().includes("quality");

    if (isMeta) {
      return {
        conceptTitle: "Meta Ads Audience Gating & Creative Fatigue",
        duration: "90-Second Concept",
        scenarioBrief: `Our client in the ${sim.industry} sector needs to generate profitable conversions without audience saturation. When ad frequency passes 3.5, click-through rates plummet and CPA doubles.`,
        socraticBreakdown: [
          "🎯 Broad Interest Targeting vs. Lookalikes: Avoid overly narrow audiences that drive up CPM.",
          "🖼️ Visual Hook & Copy Synergy: The first 3 seconds of the ad must call out the buyer's pain point.",
          "🔄 Frequency Capping & Refresh: Rotate 2-3 visual variations to prevent fatigue.",
          "🤖 Ethical AI & Fact-Checking: Use AI to ideate creative angles 10x faster, but always fact-check client claims and verify character limits before launch."
        ],
        checkQuestion: "What happens when you run a single ad creative for too long to a narrow audience?",
        options: [
          { text: "Creative fatigue sets in: ad frequency rises, CTR drops, and CPA surges.", correct: true, explanation: "Exactly right! High frequency causes users to ignore the ad, making Facebook charge more per impression." },
          { text: "The ad automatically converts twice as many users.", correct: false, explanation: "Incorrect. Users experience ad fatigue when seeing the same ad repeatedly." },
          { text: "Your daily budget is permanently reduced by the algorithm.", correct: false, explanation: "Incorrect. The algorithm doesn't reduce your budget; it charges higher CPMs." }
        ]
      };
    }

    if (isQualityScore) {
      return {
        conceptTitle: "Google Ads Quality Score & Auction Discounting",
        duration: "90-Second Concept",
        scenarioBrief: `The client is currently overpaying on Google search auctions. By optimizing keyword-to-ad relevance, you can achieve a Quality Score discount.`,
        socraticBreakdown: [
          "📈 Ad Rank Formula: Ad Rank = Max CPC Bid × Quality Score (Expected CTR + Ad Relevance + Landing Page Experience).",
          "💰 The Quality Score Discount: A 10/10 Quality Score gives up to a 50% discount on actual CPC.",
          "🎯 Ad Copy Alignment: Matching headline text with exact user search query boosts CTR.",
          "🤖 Human-in-the-Loop AI: Draft headline variants with AI, but verify search intent and avoid hallucinated promises."
        ],
        checkQuestion: "How does achieving a high Quality Score (8–10/10) impact your Google Ads campaign?",
        options: [
          { text: "You win top SERP positions while paying up to 50% less per click than competitors.", correct: true, explanation: "Correct! Google rewards highly relevant ads with lower actual CPC costs." },
          { text: "It doubles your cost-per-click to guarantee first place.", correct: false, explanation: "Incorrect. Quality Score reduces CPC costs, never increases them." },
          { text: "It disables negative keywords on the campaign.", correct: false, explanation: "Incorrect. Quality Score has no impact on negative keyword settings." }
        ]
      };
    }

    return {
      conceptTitle: "Search Intent Alignment & Negative Keyword Defense",
      duration: "90-Second Concept",
      scenarioBrief: `Our client, ${sim.industry} Partner, is seeing high click volume but high CPA due to untargeted search queries. You must tighten match types and build negative keyword barriers.`,
      socraticBreakdown: [
        "🛑 Negative Keyword Shield: Add negative keywords (e.g. 'free', 'jobs', 'diy') to block non-buyers.",
        "🔤 Match Type Silos: Transition from wasteful Broad match to targeted Phrase (\" \") and Exact ([ ]) match.",
        "📊 Commercial Intent Focus: Prioritize transactional keywords ('buy', 'cost', 'quote', 'near me').",
        "🤖 Ethical AI Verification: Prompt AI to discover negative keyword clusters, but manually review to prevent blocking profitable queries."
      ],
      checkQuestion: "Why is deploying negative keywords critical when running Google Search campaigns?",
      options: [
        { text: "It filters out zero-intent search queries, eliminating wasted ad spend.", correct: true, explanation: "Spot on! Negative keywords prevent your ads from triggering on queries from job seekers, bargain hunters, or DIY researchers." },
        { text: "It automatically increases your daily spend limit.", correct: false, explanation: "Incorrect. Negative keywords protect your budget from being spent on irrelevant searches." },
        { text: "It prevents Google from indexing your competitors' websites.", correct: false, explanation: "Incorrect. Negative keywords only filter search terms triggering your own ads." }
      ]
    };
  };

  const handleOpenMicroLesson = (sim: any) => {
    setSelectedSimForLesson(sim);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
  };

  const handleSelectOption = (index: number) => {
    setSelectedAnswer(index);
    const lesson = getMicroLesson(selectedSimForLesson);
    if (!lesson) return;
    const isAnsCorrect = lesson.options[index]?.correct || false;
    setIsCorrect(isAnsCorrect);
    setIsAnswerSubmitted(true);
    if (isAnsCorrect) {
      toast({
        title: "🎯 Concept Mastered! (+50 XP)",
        description: "You're ready for the live campaign workbench!",
      });
    }
  };

  const handleProceedToSimulation = () => {
    if (!selectedSimForLesson) return;
    const simId = selectedSimForLesson.id;
    setSelectedSimForLesson(null);
    setLocation(`/ad-simulation/${simId}`);
  };

  // Fetch all ad platform simulations (including dynamically generated ones)
  const { data: simulations = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ["/api/ad-simulations"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch user's live skill diagnostics and weakness profile
  const { data: diagnostics, refetch: refetchDiagnostics } = useQuery<any>({
    queryKey: ["/api/user/skill-diagnostics"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Mutation to generate a dynamic simulation
  const generateMutation = useMutation({
    mutationFn: async (params: {
      level?: string;
      targetWeakness?: string;
      platform?: string;
      industry?: string;
    }) => {
      const res = await apiRequest("POST", "/api/ad-simulations/generate", params);
      return res.json();
    },
    onSuccess: (newSim) => {
      queryClient.invalidateQueries({ queryKey: ["/api/ad-simulations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/skill-diagnostics"] });
      toast({
        title: "✨ Simulation Dynamically Generated",
        description: `Created scenario: ${newSim.title}`,
      });
      setIsDialogOpen(false);
      setLocation(`/ad-simulation/${newSim.id}`);
    },
    onError: (err: any) => {
      toast({
        title: "Generation Failed",
        description: err.message || "Could not generate simulation scenario.",
        variant: "destructive",
      });
    },
  });

  const handleQuickGenerateWeakness = () => {
    if (!diagnostics?.primaryWeakness) return;
    generateMutation.mutate({
      level: diagnostics.level || "Expert",
      targetWeakness: diagnostics.primaryWeakness.key,
      platform: diagnostics.primaryWeakness.key === "negativeKeywordDefense" ? "google_ads" : "meta_ads",
    });
  };

  const handleCustomGenerate = () => {
    generateMutation.mutate({
      level: genDifficulty,
      targetWeakness: genWeakness,
      platform: genPlatform,
      industry: genIndustry,
    });
  };

  // Filter simulations by platform
  const googleSimulations = simulations.filter(
    (sim: any) => sim.platform === "google_ads"
  );
  
  const metaSimulations = simulations.filter(
    (sim: any) => sim.platform === "meta_ads"
  );
  
  const linkedinSimulations = simulations.filter(
    (sim: any) => sim.platform === "linkedin_ads"
  );

  const getDifficultyColor = (difficulty: string = "Beginner") => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "intermediate":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "advanced":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "expert":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const renderSimulationCard = (simulation: any) => (
    <Card key={simulation.id} className={`h-full flex flex-col transition-all hover:border-primary/50 ${simulation.isDynamic ? "border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-card" : ""}`}>
      <CardHeader>
        <div className="flex justify-between items-start gap-2 mb-1">
          <Badge className={getDifficultyColor(simulation.difficulty)}>
            {simulation.difficulty}
          </Badge>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {simulation.isDynamic && (
              <Badge variant="outline" className="bg-amber-500/15 text-amber-400 border-amber-500/40 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Adaptive AI
              </Badge>
            )}
            <Badge variant="secondary" className="capitalize text-xs">
              {simulation.platform?.replace("_", " ")}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-xl line-clamp-2">{simulation.title}</CardTitle>
        <CardDescription>{simulation.industry} Industry</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {simulation.scenarioDescription}
        </p>

        {simulation.weaknessLabel && (
          <div className="text-xs bg-amber-500/10 border border-amber-500/20 rounded p-2 text-amber-300 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 shrink-0" />
            <span>Targeting: <strong>{simulation.weaknessLabel}</strong></span>
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Objectives:</p>
          <ul className="list-disc pl-4 text-xs space-y-1 text-muted-foreground">
            {simulation.objectives?.slice(0, 3).map((objective: string, index: number) => (
              <li key={index} className="line-clamp-1">{objective}</li>
            ))}
          </ul>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
          <span>Budget: <strong className="text-foreground">${simulation.budget}/day</strong></span>
          <span>Keywords: <strong className="text-foreground">{simulation.keywords?.length || 3} terms</strong></span>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={() => handleOpenMicroLesson(simulation)}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          <GraduationCap className="h-4 w-4" />
          <span>Briefing & Start Simulation</span>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adaptive Ad Simulations</h1>
          <p className="text-muted-foreground mt-1">
            Dynamic marketing simulations powered by mathematical modeling, calibrated to your expertise tier and learning needs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary/30 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Custom AI Scenario</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Generate Custom Simulation Scenario
                </DialogTitle>
                <DialogDescription>
                  The AI engine will construct a tailor-made advertising challenge with customized auction competition, keywords, and budget constraints.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-3">
                <div className="space-y-2">
                  <Label>Ad Platform</Label>
                  <Select value={genPlatform} onValueChange={setGenPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google_ads">Google Ads (Search & Display)</SelectItem>
                      <SelectItem value="meta_ads">Meta Ads (Facebook & Instagram)</SelectItem>
                      <SelectItem value="linkedin_ads">LinkedIn Ads (B2B Lead Gen)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select value={genDifficulty} onValueChange={setGenDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner (Guided, High Margin for Error)</SelectItem>
                      <SelectItem value="Intermediate">Intermediate (Real-world CPC Competition)</SelectItem>
                      <SelectItem value="Advanced">Advanced (High-CPC Auctions, Strict CPA)</SelectItem>
                      <SelectItem value="Expert">Expert (Aggressive Rivals, Quality Score Defense)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Skill / Weakness Focus</Label>
                  <Select value={genWeakness} onValueChange={setGenWeakness}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="negativeKeywordDefense">Negative Keyword Defense & Budget Protection</SelectItem>
                      <SelectItem value="qualityScoreOptimization">Quality Score & Ad Rank 10/10</SelectItem>
                      <SelectItem value="conversionOptimization">CPA Reduction & Conversion Funnel</SelectItem>
                      <SelectItem value="audienceTargeting">Lookalike & Placement Precision</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Industry Sector</Label>
                  <Select value={genIndustry} onValueChange={setGenIndustry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B2B Cybersecurity SaaS">B2B Cybersecurity SaaS ($18 CPC)</SelectItem>
                      <SelectItem value="Fintech Wealth Management">Fintech Wealth Management ($12 CPC)</SelectItem>
                      <SelectItem value="D2C Specialty E-Commerce">D2C Specialty E-Commerce ($1.80 CPC)</SelectItem>
                      <SelectItem value="Luxury Custom Home Remodeling">Luxury Custom Remodeling ($9.50 CPC)</SelectItem>
                      <SelectItem value="High-Ticket Medical Practice">High-Ticket Medical Practice ($14 CPC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCustomGenerate} 
                  disabled={generateMutation.isPending}
                  className="w-full"
                >
                  {generateMutation.isPending ? "Constructing Simulation..." : "🚀 Generate & Launch Scenario"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            onClick={handleQuickGenerateWeakness}
            disabled={generateMutation.isPending}
            className="bg-gradient-to-r from-amber-500 to-primary text-black font-semibold hover:opacity-90 flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            <span>Practice Weak Area</span>
          </Button>

          <Button 
            variant="outline"
            onClick={() => setLocation("/portfolio")}
            className="flex items-center gap-1.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
          >
            <Briefcase className="h-4 w-4" />
            <span>My Portfolio</span>
          </Button>

          <Button 
            variant="outline"
            onClick={() => setLocation("/interview-prep")}
            className="flex items-center gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Mic className="h-4 w-4" />
            <span>Interview Prep</span>
          </Button>
        </div>
      </div>

      {/* Featured Master Challenge: Agency Capstone Full Omnichannel Campaign */}
      <Card className="border-amber-500/50 bg-gradient-to-r from-amber-500/15 via-card to-background shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 text-xs">
                  The Master Agency Challenge
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Full Omnichannel
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Agency Capstone: End-to-End Client Campaign
              </h2>
              <p className="text-xs text-muted-foreground max-w-2xl">
                Take complete ownership of a $5,000/mo client account. Build the Buyer Persona $\rightarrow$ Google Search Match Strategy $\rightarrow$ Meta Ads Creative $\rightarrow$ Landing Page Synergy $\rightarrow$ Save Verified Case Study to Portfolio!
              </p>
            </div>
            <Button 
              onClick={() => setLocation("/capstone-simulation")}
              className="shrink-0 bg-gradient-to-r from-amber-500 to-primary text-black font-semibold h-10 px-6 flex items-center gap-2 hover:opacity-90 shadow-md"
            >
              <Trophy className="h-4 w-4" />
              <span>Launch Capstone Project</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Skill Diagnostics & Telemetry Dashboard */}
      {diagnostics && (
        <Card className="border-primary/20 bg-gradient-to-r from-background via-primary/5 to-background shadow-md">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">AI Performance & Weakness Diagnostics</CardTitle>
                <Badge variant="outline" className="border-primary/40 text-primary font-medium text-xs">
                  {diagnostics.level || "Expert"} Tier
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Average Simulation Score: <strong className="text-foreground text-sm">{diagnostics.averageScore}%</strong>
              </div>
            </div>
            <CardDescription>
              Continuous telemetry tracks your simulation attempts to detect strategic gaps and curate targeted practice scenarios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Skill Bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 p-2.5 rounded-lg bg-card/60 border border-border/40">
                <div className="flex justify-between text-xs font-medium">
                  <span>Quality Score Tuning</span>
                  <span className="font-mono text-primary">{diagnostics.skillScores?.qualityScoreOptimization}%</span>
                </div>
                <Progress value={diagnostics.skillScores?.qualityScoreOptimization || 65} className="h-1.5" />
              </div>

              <div className="space-y-1.5 p-2.5 rounded-lg bg-card/60 border border-border/40">
                <div className="flex justify-between text-xs font-medium">
                  <span>Negative Keyword Defense</span>
                  <span className="font-mono text-primary">{diagnostics.skillScores?.negativeKeywordDefense}%</span>
                </div>
                <Progress value={diagnostics.skillScores?.negativeKeywordDefense || 40} className="h-1.5" />
              </div>

              <div className="space-y-1.5 p-2.5 rounded-lg bg-card/60 border border-border/40">
                <div className="flex justify-between text-xs font-medium">
                  <span>CPC & Bid Strategy</span>
                  <span className="font-mono text-primary">{diagnostics.skillScores?.cpcBidEfficiency}%</span>
                </div>
                <Progress value={diagnostics.skillScores?.cpcBidEfficiency || 70} className="h-1.5" />
              </div>

              <div className="space-y-1.5 p-2.5 rounded-lg bg-card/60 border border-border/40">
                <div className="flex justify-between text-xs font-medium">
                  <span>CPA & Funnel Alignment</span>
                  <span className="font-mono text-primary">{diagnostics.skillScores?.conversionOptimization}%</span>
                </div>
                <Progress value={diagnostics.skillScores?.conversionOptimization || 60} className="h-1.5" />
              </div>

              <div className="space-y-1.5 p-2.5 rounded-lg bg-card/60 border border-border/40">
                <div className="flex justify-between text-xs font-medium">
                  <span>Audience Targeting</span>
                  <span className="font-mono text-primary">{diagnostics.skillScores?.audienceTargeting}%</span>
                </div>
                <Progress value={diagnostics.skillScores?.audienceTargeting || 72} className="h-1.5" />
              </div>

              <div className="space-y-1.5 p-2.5 rounded-lg bg-card/60 border border-border/40">
                <div className="flex justify-between text-xs font-medium">
                  <span>Ad Copy & Extensions</span>
                  <span className="font-mono text-primary">{diagnostics.skillScores?.adCopywriting}%</span>
                </div>
                <Progress value={diagnostics.skillScores?.adCopywriting || 68} className="h-1.5" />
              </div>
            </div>

            {/* Identified Primary Weakness Banner */}
            {diagnostics.primaryWeakness && (
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Identified Growth Area: {diagnostics.primaryWeakness.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {diagnostics.primaryWeakness.description} {diagnostics.primaryWeakness.recommendation}
                  </p>
                </div>
                <Button 
                  size="sm"
                  onClick={handleQuickGenerateWeakness}
                  disabled={generateMutation.isPending}
                  className="shrink-0 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs h-8 flex items-center gap-1.5"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Generate Practice Challenge</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabs Filter */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="all">All ({simulations.length})</TabsTrigger>
            <TabsTrigger value="google">Google Ads ({googleSimulations.length})</TabsTrigger>
            <TabsTrigger value="meta">Meta Ads ({metaSimulations.length})</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn ({linkedinSimulations.length})</TabsTrigger>
          </TabsList>
        </div>

        {/* All Simulations */}
        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-[320px] animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : simulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {simulations.map((simulation: any) => renderSimulationCard(simulation))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No simulations found.</p>
              <Button onClick={handleQuickGenerateWeakness}>Generate Your First Simulation</Button>
            </div>
          )}
        </TabsContent>

        {/* Google Ads */}
        <TabsContent value="google" className="mt-0">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-1">Google Ads Simulations</h2>
            <p className="text-sm text-muted-foreground">
              Search intent matching, negative keyword defense, Quality Score optimization, and bidding strategies.
            </p>
          </div>
          {googleSimulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {googleSimulations.map((simulation: any) => renderSimulationCard(simulation))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No Google Ads simulations available.</p>
              <Button onClick={handleQuickGenerateWeakness}>Generate Google Ads Scenario</Button>
            </div>
          )}
        </TabsContent>

        {/* Meta Ads */}
        <TabsContent value="meta" className="mt-0">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-1">Meta Ads Simulations</h2>
            <p className="text-sm text-muted-foreground">
              Direct-to-consumer targeting, creative format fatigue testing, and conversion pixel optimization.
            </p>
          </div>
          {metaSimulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metaSimulations.map((simulation: any) => renderSimulationCard(simulation))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No Meta Ads simulations available.</p>
            </div>
          )}
        </TabsContent>

        {/* LinkedIn Ads */}
        <TabsContent value="linkedin" className="mt-0">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-1">LinkedIn Ads Simulations</h2>
            <p className="text-sm text-muted-foreground">
              B2B enterprise pipeline generation, job title gating, and lead generation form optimization.
            </p>
          </div>
          {linkedinSimulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {linkedinSimulations.map((simulation: any) => renderSimulationCard(simulation))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No LinkedIn Ads simulations available.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* MarketSim Pre-Simulation AI Micro-Lesson Modal */}
      {selectedSimForLesson && (() => {
        const lesson = getMicroLesson(selectedSimForLesson);
        if (!lesson) return null;

        return (
          <Dialog open={!!selectedSimForLesson} onOpenChange={(open) => !open && setSelectedSimForLesson(null)}>
            <DialogContent className="max-w-2xl bg-card border-border/80 text-foreground p-6 max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-2 border-b border-border/60 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold text-lg">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <span>MarketSim AI Pre-Simulation Briefing</span>
                  </div>
                  <Badge variant="outline" className="border-primary/40 text-primary">
                    {lesson.duration}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {lesson.conceptTitle}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Master the core principle with your AI Coach before executing on the live client account.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-4">
                {/* 1. Client Problem Briefing */}
                <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Client Scenario Briefing</span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    {lesson.scenarioBrief}
                  </p>
                </div>

                {/* 2. Socratic Concept Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
                    <Lightbulb className="h-4 w-4 text-amber-400" />
                    <span>Strategic Principles (90-Second Mastery)</span>
                  </div>
                  <div className="space-y-2">
                    {lesson.socraticBreakdown.map((item: string, idx: number) => (
                      <div key={idx} className="text-xs sm:text-sm p-2.5 rounded-lg bg-background border border-border/50 text-foreground/90">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Check for Understanding (Socratic Quiz) */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wide">
                      <Target className="h-4 w-4" />
                      <span>Check for Understanding</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">+50 XP Available</span>
                  </div>
                  
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    {lesson.checkQuestion}
                  </p>

                  <div className="space-y-2">
                    {lesson.options.map((option: any, optIdx: number) => {
                      const isChosen = selectedAnswer === optIdx;
                      let optionStyle = "border-border/60 hover:border-primary/60 hover:bg-secondary/40";
                      
                      if (isAnswerSubmitted && isChosen) {
                        optionStyle = option.correct 
                          ? "border-emerald-500/80 bg-emerald-500/10 text-emerald-300 font-medium" 
                          : "border-red-500/80 bg-red-500/10 text-red-300";
                      } else if (isAnswerSubmitted && option.correct) {
                        optionStyle = "border-emerald-500/80 bg-emerald-500/10 text-emerald-300 font-medium";
                      }

                      return (
                        <div key={optIdx} className="space-y-1">
                          <button
                            type="button"
                            onClick={() => handleSelectOption(optIdx)}
                            className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-start gap-2.5 ${optionStyle}`}
                          >
                            <span className="shrink-0 w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-grow">{option.text}</span>
                            {isAnswerSubmitted && option.correct && (
                              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            )}
                          </button>
                          {isAnswerSubmitted && isChosen && (
                            <p className={`text-[11px] px-3 pt-0.5 ${option.correct ? "text-emerald-400" : "text-red-400"}`}>
                              {option.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 border-t border-border/60">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleProceedToSimulation}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ⚡ Skip Direct to Workbench
                </Button>
                
                <Button 
                  onClick={handleProceedToSimulation}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 text-xs sm:text-sm h-10 px-5"
                >
                  <span>Launch Simulation Workbench</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
}
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
  Brain
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
        <Link href={`/ad-simulation/${simulation.id}`} className="w-full">
          <Button className="w-full flex items-center justify-center gap-2">
            <span>Start Simulation</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
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
        </div>
      </div>

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
    </div>
  );
}
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Achievements from "@/components/Achievements";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart2, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Target, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight, 
  Layers, 
  Search, 
  MousePointer, 
  Sparkles,
  Award,
  CheckCircle2,
  Trophy,
  Briefcase
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Campaign, SimulationData } from "@shared/schema";
import { calculateSimulationFactors, generateSimulationData, getPerformanceInsights } from "@/lib/simulation";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from "recharts";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("radar");

  // Competency skills radar telemetry
  const radarData = [
    { subject: "On-Page SEO", userScore: 88, benchmark: 70, fullMark: 100 },
    { subject: "Keyword Intent", userScore: 78, benchmark: 65, fullMark: 100 },
    { subject: "Negative Shields", userScore: 92, benchmark: 75, fullMark: 100 },
    { subject: "Meta Creative Hooks", userScore: 68, benchmark: 60, fullMark: 100 },
    { subject: "Message Match", userScore: 85, benchmark: 70, fullMark: 100 },
    { subject: "Unit Economics / ROAS", userScore: 80, benchmark: 65, fullMark: 100 },
  ];

  const weaknessDrills = [
    {
      skill: "Meta Creative Hooks & Fatigue",
      currentScore: 68,
      status: "Needs Optimization",
      gapSummary: "Ad frequency rose above 3.5 without rotating fresh visual hooks, triggering CPM penalties.",
      actionLabel: "Launch Meta Ads Simulator",
      link: "/ad-simulations"
    },
    {
      skill: "Long-Tail Keyword Intent Clustering",
      currentScore: 78,
      status: "Competent",
      gapSummary: "Broad match modifier leakage noticed on competitive search auctions.",
      actionLabel: "Practice Keyword Slicing",
      link: "/tutorials-new"
    },
    {
      skill: "Negative Keyword Protection",
      currentScore: 92,
      status: "Top Tier",
      gapSummary: "Zero wasted clicks from free/cheap/diy terms detected across all audit runs.",
      actionLabel: "View Verified Case Study",
      link: "/portfolio"
    }
  ];

  const { data: campaigns = [], isLoading: loadingCampaigns } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
    initialData: [],
  });

  const simulationQueries = useQuery<Array<{ campaign: Campaign; data: SimulationData[]; insights: string[] }>>({
    queryKey: ["simulation-data"],
    queryFn: async () => {
      if (!campaigns.length) return [];

      const allData = await Promise.all(
        campaigns.map(async (campaign) => {
          const factors = calculateSimulationFactors(campaign);
          const newData = generateSimulationData(campaign, factors);
          const insights = getPerformanceInsights(newData);

          await apiRequest("POST", "/api/simulation-data", {
            campaignId: campaign.id,
            ...newData,
          });

          const response = await fetch(`/api/campaigns/${campaign.id}/simulation`);
          const data = await response.json();
          return { campaign, data, insights };
        })
      );

      return allData;
    },
    enabled: campaigns.length > 0,
    refetchInterval: 10000,
    initialData: [],
  });

  if (loadingCampaigns && !campaigns.length) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-6 sm:py-8 px-3 sm:px-6 space-y-8">
      {/* Top Hero Command Center Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-background to-secondary/30 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-mono uppercase tracking-wider">
                <Activity className="h-3.5 w-3.5 mr-1 inline animate-pulse text-emerald-400" />
                Live Telemetry Dashboard
              </Badge>
              <Badge variant="outline" className="text-muted-foreground border-border text-xs">
                Active Tier: Junior Associate
              </Badge>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              Skills Radar & Growth Analytics
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Real-time competency telemetry derived from your simulator audits, search keyword structures, CMS adjustments, and campaign runs.
            </p>
          </div>

          {/* Student Status Summary Card */}
          <div className="w-full lg:w-auto bg-card/85 backdrop-blur-md border border-border/80 rounded-xl p-4 sm:p-5 shadow-md min-w-[280px] sm:min-w-[320px] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Current Status</p>
                <p className="font-bold text-foreground text-sm flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Junior Growth Associate
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Level 1 XP</p>
                <p className="font-mono font-bold text-primary text-sm mt-0.5">
                  450 / 1000 XP
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Certification Benchmark</span>
                <span className="font-semibold text-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2 bg-secondary" />
            </div>

            <div className="pt-1 flex gap-2">
              <Button 
                size="sm" 
                onClick={() => navigate("/ad-simulations")}
                className="w-full text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Launch Simulator
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md bg-secondary/60 h-10 p-1">
          <TabsTrigger value="radar" className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4" />
            <span>Skills Radar</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            <span>Simulations ({campaigns.length})</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
            <Award className="h-4 w-4" />
            <span>Badges</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SKILLS RADAR & DIAGNOSTICS */}
        <TabsContent value="radar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 6-Axis Radar Chart */}
            <Card className="lg:col-span-7 border-border/80 bg-card shadow-lg flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      6-Axis Marketing Competency Radar
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Your skill score across key performance disciplines vs industry baseline
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs">
                    Overall: 82% Avg
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center p-2 sm:p-4">
                <div className="w-full h-[320px] sm:h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 11, fontWeight: 500 }} 
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                      <Radar
                        name="Your Skill Score"
                        dataKey="userScore"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.45}
                      />
                      <Radar
                        name="Agency Benchmark"
                        dataKey="benchmark"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.15}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          borderColor: "hsl(var(--border))",
                          borderRadius: "0.5rem",
                          fontSize: "12px",
                          color: "hsl(var(--foreground))"
                        }} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="pt-0 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t border-border/50 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-primary inline-block" />
                    <span>Your Current Proficiency</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
                    <span>Junior Industry Benchmark</span>
                  </div>
                </div>
                <span className="font-mono text-[11px]">Updated 5 mins ago</span>
              </CardFooter>
            </Card>

            {/* Targeted Diagnostic Drills */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="border-border/80 bg-card shadow-lg h-full flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      Targeted Diagnostic Drills
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px]">AI Telemetry</Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Automated recommendations based on detected simulation friction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-4 pt-0">
                  {weaknessDrills.map((drill, index) => (
                    <div 
                      key={index}
                      className="p-3.5 rounded-xl bg-secondary/40 border border-border/70 hover:border-primary/40 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground">{drill.skill}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          drill.currentScore < 75 
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" 
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        }`}>
                          {drill.currentScore}% • {drill.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {drill.gapSummary}
                      </p>
                      <div className="pt-1">
                        <Button
                          asChild
                          size="sm"
                          variant="secondary"
                          className="w-full text-xs h-7 justify-between hover:bg-primary hover:text-primary-foreground group"
                        >
                          <Link href={drill.link}>
                            <span>{drill.actionLabel}</span>
                            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => navigate("/interview-prep")}
                  >
                    Defend Decisions in Oral Board Defense →
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: ACTIVE CAMPAIGNS & SIMULATIONS */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold">Campaign Performance Telemetry</h2>
              <p className="text-xs text-muted-foreground">Real-time auction dynamics and quality scores</p>
            </div>
            <Button 
              size="sm" 
              onClick={() => navigate("/campaign-creator")}
              className="bg-primary text-primary-foreground text-xs font-semibold"
            >
              + Create New Campaign
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-border/80">
              <div className="max-w-md mx-auto space-y-3">
                <Layers className="h-8 w-8 text-muted-foreground mx-auto" />
                <h3 className="font-bold text-foreground">No custom campaigns created yet</h3>
                <p className="text-xs text-muted-foreground">
                  Build a Google Search or Meta Ads campaign to see live Quality Score telemetry and automated optimization insights.
                </p>
                <Button 
                  size="sm" 
                  onClick={() => navigate("/campaign-creator")}
                  className="bg-primary text-primary-foreground text-xs"
                >
                  Launch Campaign Builder
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6">
              {simulationQueries.data.map(({ campaign, data, insights }) => {
                const latestData = data[data.length - 1];
                return (
                  <Card key={campaign.id} className="border-border/80 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <CardTitle className="text-base font-bold">{campaign.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {campaign.platform} • {campaign.type} • Goal: {campaign.goal}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Quality Score:</span>
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-mono font-bold">
                            {latestData?.qualityScore || 8}/10
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Metric Strips */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                          <span className="text-[10px] text-muted-foreground uppercase font-semibold">Impressions</span>
                          <p className="text-base font-bold text-foreground font-mono mt-0.5">
                            {latestData?.impressions?.toLocaleString() || "12,450"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                          <span className="text-[10px] text-muted-foreground uppercase font-semibold">Clicks</span>
                          <p className="text-base font-bold text-primary font-mono mt-0.5">
                            {latestData?.clicks?.toLocaleString() || "628"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                          <span className="text-[10px] text-muted-foreground uppercase font-semibold">CTR</span>
                          <p className="text-base font-bold text-foreground font-mono mt-0.5">
                            {latestData?.ctr ? `${latestData.ctr.toFixed(2)}%` : "5.04%"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/40 border border-border/60">
                          <span className="text-[10px] text-muted-foreground uppercase font-semibold">Avg CPC</span>
                          <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                            ${latestData?.cpc ? latestData.cpc.toFixed(2) : "1.84"}
                          </p>
                        </div>
                      </div>

                      {/* Performance Insights */}
                      {insights.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            AI Diagnostic Insights
                          </h4>
                          <div className="space-y-1.5">
                            {insights.map((insight, index) => (
                              <Alert key={index} className="py-2 px-3 bg-secondary/50 border-border/70 text-xs">
                                <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                                <AlertDescription className="text-xs text-foreground ml-2">
                                  {insight}
                                </AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB 3: CAREER ACHIEVEMENTS & CERTIFICATIONS */}
        <TabsContent value="achievements" className="space-y-6">
          <Achievements />
        </TabsContent>
      </Tabs>
    </div>
  );
}
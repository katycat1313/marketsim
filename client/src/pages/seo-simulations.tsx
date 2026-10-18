import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Book, 
  Clock, 
  AlertTriangle, 
  GraduationCap, 
  BookOpen, 
  Globe, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Building, 
  Coffee, 
  Stethoscope, 
  Home, 
  Laptop, 
  Wrench,
  Lock,
  Unlock,
  CheckCircle2,
  ChevronRight,
  Compass,
  Layers,
  Zap,
  Target,
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface SeoSimulation {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  industry: string;
  targetKeywords: string[];
  seoIssues: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    location: string;
  }[];
  createdAt: string;
}

const clientBusinessMetadata: Record<number, { 
  icon: any; 
  clientName: string; 
  model: string; 
  focus: string;
  companionLesson: {
    chapter: number;
    title: string;
    description: string;
  };
  estimatedTime: string;
  learningOutcome: string;
}> = {
  1: {
    icon: Coffee,
    clientName: "Artisan Roast Co.",
    model: "D2C E-Commerce & Retail",
    focus: "On-Page Metadata, Title Tags & Search Snippet CTR",
    companionLesson: {
      chapter: 7,
      title: "Chapter 7.1: On-Page Meta & Search CTR",
      description: "How Google reads title tags, character limits (50–60), and writing high-converting meta descriptions with active CTAs."
    },
    estimatedTime: "25–35 min",
    learningOutcome: "Fix broken title tags, write 140-char meta descriptions with CTAs, and structure single H1 hierarchy."
  },
  2: {
    icon: Stethoscope,
    clientName: "Bright Smile Family Dentistry",
    model: "Local Healthcare Clinic",
    focus: "Local Search Intent, Map Pack & Schema Markup",
    companionLesson: {
      chapter: 7,
      title: "Chapter 7.2: Local Search Intent & Schema Markup",
      description: "Local search ranking factors, Google Business profile alignment, and injecting structured Dentist / LocalBusiness JSON-LD schema."
    },
    estimatedTime: "30–40 min",
    learningOutcome: "Target geo-modified search terms, map pack signals, and inject valid MedicalClinic JSON-LD schema."
  },
  3: {
    icon: Home,
    clientName: "Premier Luxury Properties",
    model: "High-Ticket Real Estate",
    focus: "Deceptive Client Brief, Heading Silos & Bounce Reduction",
    companionLesson: {
      chapter: 7,
      title: "Chapter 7.3: Technical SEO, Heading Silos & Crawl Budget",
      description: "How to evaluate contradictory client briefs, build topical content silos, and reduce bounce rate on high-ticket listings."
    },
    estimatedTime: "35–45 min",
    learningOutcome: "Detect deceptive client requests, architect topical silos, and optimize crawlability for high-ticket listings."
  },
  4: {
    icon: Laptop,
    clientName: "CloudVault Security",
    model: "B2B SaaS CRM",
    focus: "Bottom-of-Funnel Commercial Intent & Funnel Optimization",
    companionLesson: {
      chapter: 9,
      title: "Chapter 9: Content Marketing & Commercial Search Intent",
      description: "Targeting high-intent bottom-of-funnel comparison keywords, pricing queries, and organic lead capture funnels."
    },
    estimatedTime: "30–45 min",
    learningOutcome: "Target high-intent B2B commercial terms ('alternative to', 'pricing', 'enterprise')."
  },
  5: {
    icon: Wrench,
    clientName: "Apex Emergency Home Services",
    model: "24/7 HVAC & Trade Services",
    focus: "Multi-Location SERP Dominance & Conversion Optimization",
    companionLesson: {
      chapter: 8,
      title: "Chapter 8: Campaign Troubleshooting & Multi-Location SEO",
      description: "Managing keyword cannibalization across regional landing pages and converting urgent high-intent emergency traffic."
    },
    estimatedTime: "35–50 min",
    learningOutcome: "Dominate high-urgency emergency searches across multiple service areas."
  }
};

export default function SeoSimulationsPage() {
  const [, setLocation] = useLocation();
  const [completedLevels, setCompletedLevels] = useState<Record<number, { score: number; completedAt: string; title?: string }>>({});
  const [demoOverride, setDemoOverride] = useState(false);
  const [lockedModalData, setLockedModalData] = useState<{
    targetSim: SeoSimulation;
    targetIndex: number;
    prevSim: SeoSimulation;
  } | null>(null);

  // Load completed levels from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("krechet_seo_completed_levels");
      if (saved) {
        setCompletedLevels(JSON.parse(saved));
      }
      const override = localStorage.getItem("krechet_seo_demo_override");
      if (override === "true") {
        setDemoOverride(true);
      }
    } catch (e) {
      console.warn("Could not load completed levels", e);
    }
  }, []);

  const handleToggleDemoOverride = (checked: boolean) => {
    setDemoOverride(checked);
    try {
      localStorage.setItem("krechet_seo_demo_override", String(checked));
    } catch (e) {}
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset your SEO Studio progression back to Level 1?")) {
      try {
        localStorage.removeItem("krechet_seo_completed_levels");
        localStorage.removeItem("krechet_seo_demo_override");
      } catch (e) {}
      setCompletedLevels({});
      setDemoOverride(false);
    }
  };

  // Fetch simulation data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/seo-simulations'],
    queryFn: () => apiRequest('/api/seo-simulations', { method: 'GET' })
  });

  // Fetch user attempts to merge with localStorage
  const { data: userAttempts } = useQuery({
    queryKey: ['/api/user/seo-simulations/attempts'],
    queryFn: () => apiRequest('/api/user/seo-simulations/attempts', { method: 'GET' })
  });

  useEffect(() => {
    if (Array.isArray(userAttempts) && userAttempts.length > 0) {
      setCompletedLevels(prev => {
        const updated = { ...prev };
        userAttempts.forEach((attempt: any) => {
          if (attempt.score >= 70) {
            updated[attempt.simulationId] = {
              score: Math.max(updated[attempt.simulationId]?.score || 0, attempt.score),
              completedAt: attempt.createdAt || new Date().toISOString()
            };
          }
        });
        try {
          localStorage.setItem("krechet_seo_completed_levels", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
  }, [userAttempts]);

  const simulations: SeoSimulation[] = Array.isArray(data) ? data : [];

  // Determine unlock state for a simulation
  const isLevelUnlocked = (idx: number, simId: number) => {
    if (demoOverride) return true;
    if (idx === 0) return true; // Level 1 is always unlocked
    const prevSim = simulations[idx - 1];
    if (!prevSim) return true;
    const prevCompletion = completedLevels[prevSim.id];
    return !!(prevCompletion && prevCompletion.score >= 70);
  };

  const isLevelCompleted = (simId: number) => {
    const completion = completedLevels[simId];
    return !!(completion && completion.score >= 70);
  };

  // Find the current active assignment (first unlocked level that is not completed)
  const currentObjectiveSim = simulations.find((sim, idx) => isLevelUnlocked(idx, sim.id) && !isLevelCompleted(sim.id)) || simulations[0];
  const currentObjectiveIndex = simulations.findIndex(s => s.id === currentObjectiveSim?.id);
  const completedCount = Object.keys(completedLevels).filter(id => (completedLevels[Number(id)]?.score || 0) >= 70).length;
  const progressPercent = simulations.length > 0 ? Math.round((completedCount / simulations.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
        <h1 className="text-3xl font-bold">SEO Website Simulations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="bg-destructive/15 p-6 rounded-xl border border-destructive/30">
          <h1 className="text-xl font-bold text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error Loading Website Simulations
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Unable to load simulations. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* 🧭 Master Career Pathway: Curriculum Road & Sequencing */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-card to-background border border-blue-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 text-xs font-semibold py-0.5">
                🧭 Agency Apprenticeship Pathway
              </Badge>
              <Badge variant="outline" className="text-xs">
                Sequential Mastery Curriculum
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mt-1.5 flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <span>Interactive Website SEO & Analytics Studio</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center bg-card/80 p-2.5 rounded-xl border border-border/60">
            <div className="space-y-0.5 text-right">
              <Label htmlFor="demo-override" className="text-xs font-bold text-foreground cursor-pointer">
                Instructor / Demo Mode
              </Label>
              <p className="text-[10px] text-muted-foreground">Unlock all 5 levels for testing</p>
            </div>
            <Switch 
              id="demo-override" 
              checked={demoOverride} 
              onCheckedChange={handleToggleDemoOverride}
            />
          </div>
        </div>

        {/* 3-Track Sequential Pathway Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Track 1: Active */}
          <div className="p-3 rounded-xl bg-primary/10 border-2 border-primary/50 relative overflow-hidden space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Track 1 • You Are Here</span>
              <Badge className="bg-primary text-primary-foreground text-[10px] h-4 px-1.5 font-bold">Active</Badge>
            </div>
            <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span>🌱 Organic SEO Foundations</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Master search intent, title tags, heading silos, and local schema across 5 real client websites.
            </p>
          </div>

          {/* Track 2: Up Next */}
          <Link href="/ad-simulations">
            <div className="p-3 rounded-xl bg-card/60 border border-border/60 hover:border-purple-500/50 hover:bg-purple-950/10 transition-all cursor-pointer space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Track 2 • Up Next</span>
                <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-purple-400 border-purple-500/30">Next Step</Badge>
              </div>
              <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <span>🚀 Paid Acquisition (Ads)</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Apply winning keywords to Google & Meta Ads with smart bidding, negative shields, and crisis calls.
              </p>
            </div>
          </Link>

          {/* Track 3: Capstone */}
          <Link href="/capstone-simulation">
            <div className="p-3 rounded-xl bg-card/60 border border-border/60 hover:border-amber-500/50 hover:bg-amber-950/10 transition-all cursor-pointer space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Track 3 • Mastery</span>
                <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-amber-400 border-amber-500/30">Capstone</Badge>
              </div>
              <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <span>🏆 Full Agency Capstone</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Integrate organic SEO, paid ads, and analytics into a live client retainer portfolio case study.
              </p>
            </div>
          </Link>
        </div>

        {/* Student Advice: Do I bounce between SEO and Ads? */}
        <div className="p-3.5 rounded-xl bg-background/60 border border-border/80 flex items-start gap-3 text-xs">
          <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-foreground">Student Direction — Should I bounce between SEO and Ads or do them in order?</strong>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Complete Organic SEO (Track 1) first!</strong> In marketing agencies, media buyers always master search intent, heading architecture, and landing page copy without spending ad dollars. Once you can rank organically, you transition to Paid Ads (Track 2) where client budget is at stake.
            </p>
          </div>
        </div>
      </div>

      {/* 🎯 Current Action & Next Assignment Card */}
      {currentObjectiveSim && (
        <Card className="border-primary/40 bg-gradient-to-r from-primary/10 via-card to-background shadow-md">
          <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1 py-0.5">
                  <Play className="h-3 w-3 fill-current" />
                  <span>Your Current Assignment</span>
                </Badge>
                <span className="text-xs font-semibold text-primary">
                  Level {currentObjectiveIndex + 1} of {simulations.length}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {currentObjectiveSim.title} • Client: {clientBusinessMetadata[currentObjectiveSim.id]?.clientName || currentObjectiveSim.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Next Step:</strong> Review companion lesson <Link href="/tutorials?chapter=7" className="text-primary underline underline-offset-2 font-medium">{clientBusinessMetadata[currentObjectiveSim.id]?.companionLesson.title || "Chapter 7: Search Engine Optimization"}</Link>, then enter the CMS sandbox to diagnose and fix on-page issues until your audit score reaches &ge; 70%.
              </p>
              
              <div className="flex items-center gap-3 pt-1">
                <div className="w-48">
                  <Progress value={progressPercent} className="h-2" />
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {completedCount} of {simulations.length} Levels Passed ({progressPercent}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs border-border"
              >
                <Link href="/tutorials?chapter=7">
                  <BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary" />
                  <span>Read Chapter 7 Lesson</span>
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md"
              >
                <Link href={`/seo-simulation/${currentObjectiveSim.id}`}>
                  <span>Enter Level {currentObjectiveIndex + 1} Sandbox</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 📚 Progressive Level Grid (Level 1 ➔ Level 2 ➔ Level 3...) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span>Progressive Client Workbenches</span>
              <Badge variant="outline" className="text-xs">Must be completed in sequential order</Badge>
            </h2>
            <p className="text-xs text-muted-foreground">Each level unlocks automatically when you pass the previous client with a score of 70% or higher.</p>
          </div>

          {completedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetProgress}
              className="text-xs text-muted-foreground hover:text-destructive h-7"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              <span>Reset Progression</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((sim, idx) => {
            const clientMeta = clientBusinessMetadata[sim.id] || {
              icon: Globe,
              clientName: sim.title,
              model: `${sim.industry} Business`,
              focus: "On-Page SEO Optimization",
              companionLesson: {
                chapter: 7,
                title: "Chapter 7: Search Engine Optimization",
                description: "On-page title tags, metadata, and search ranking fundamentals."
              },
              estimatedTime: "30 min",
              learningOutcome: "Optimize on-page title tags, metadata, and heading silos."
            };
            const IconComp = clientMeta.icon;
            const isUnlocked = isLevelUnlocked(idx, sim.id);
            const isCompleted = isLevelCompleted(sim.id);
            const completionRecord = completedLevels[sim.id];
            const isCurrent = currentObjectiveSim?.id === sim.id && !isCompleted;
            const prevSim = idx > 0 ? simulations[idx - 1] : null;

            return (
              <Card 
                key={sim.id} 
                className={`border transition-all flex flex-col justify-between ${
                  isCompleted 
                    ? "border-emerald-500/40 bg-gradient-to-b from-emerald-950/10 via-card to-background shadow-sm" 
                    : isCurrent
                    ? "border-primary shadow-xl shadow-primary/10 ring-2 ring-primary/40 bg-gradient-to-b from-primary/5 via-card to-background"
                    : !isUnlocked
                    ? "border-border/40 bg-card/40 opacity-75 hover:opacity-90"
                    : "border-border/60 bg-gradient-to-b from-card to-background shadow-md hover:border-primary/50"
                }`}
              >
                <CardHeader className="pb-3 border-b border-border/40 space-y-2">
                  {/* Status Banner Tag */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Level {idx + 1} of {simulations.length}
                    </span>

                    {isCompleted ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] flex items-center gap-1 font-bold">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>Completed • {completionRecord?.score || 85}%</span>
                      </Badge>
                    ) : isCurrent ? (
                      <Badge className="bg-primary text-primary-foreground text-[10px] font-bold flex items-center gap-1 animate-pulse">
                        <Play className="h-2.5 w-2.5 fill-current" />
                        <span>Up Next • Current Objective</span>
                      </Badge>
                    ) : !isUnlocked ? (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground border-border flex items-center gap-1">
                        <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                        <span>Locked (Level {idx} Prerequisite)</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                        <span>Unlocked</span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        isCompleted ? "bg-emerald-500/20 text-emerald-400" : isCurrent ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                      }`}>
                        <IconComp className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-foreground">
                          {sim.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-primary font-medium">
                          Client: {clientMeta.clientName}
                        </CardDescription>
                      </div>
                    </div>

                    <Badge 
                      variant="outline" 
                      className={`text-[10px] shrink-0 ${
                        sim.difficulty === 'Beginner' ? 'border-emerald-500/40 text-emerald-400' :
                        sim.difficulty === 'Intermediate' ? 'border-blue-500/40 text-blue-400' :
                        sim.difficulty === 'Advanced' ? 'border-amber-500/40 text-amber-400' :
                        'border-red-500/40 text-red-400'
                      }`}
                    >
                      {sim.difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-4 text-xs">
                  <div className="p-2.5 rounded-lg bg-secondary/30 border border-border/40 space-y-0.5">
                    <div className="font-semibold text-foreground text-[11px]">Business Model:</div>
                    <div className="text-muted-foreground text-xs">{clientMeta.model}</div>
                  </div>

                  <p className="text-muted-foreground line-clamp-2 leading-relaxed text-xs">
                    {sim.description}
                  </p>

                  <div className="space-y-0.5">
                    <div className="font-semibold text-foreground text-[11px]">Strategic Focus:</div>
                    <div className="text-muted-foreground text-xs">{clientMeta.focus}</div>
                  </div>

                  {/* Companion Lesson Callout */}
                  <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-primary" />
                        <span>Prerequisite Lesson:</span>
                      </span>
                      <span className="text-muted-foreground font-mono text-[10px]">
                        {clientMeta.estimatedTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {clientMeta.companionLesson.title}
                    </p>
                  </div>

                  {/* Locked Prerequisite Notice */}
                  {!isUnlocked && prevSim && (
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300/90 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                      <span>Complete Level {idx} ({clientBusinessMetadata[prevSim.id]?.clientName || prevSim.title}) to unlock.</span>
                    </div>
                  )}

                  {/* Target Keywords Strip */}
                  <div className="space-y-1 pt-1">
                    <div className="text-muted-foreground text-[10px] font-mono">Target Keywords:</div>
                    <div className="flex flex-wrap gap-1">
                      {sim.targetKeywords.slice(0, 3).map((kw, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] py-0 px-1.5">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border/40 pt-3 flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="w-1/2 text-xs border-border hover:bg-secondary">
                    <Link to="/tutorials?chapter=7">
                      <BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      <span>View Lesson</span>
                    </Link>
                  </Button>

                  {isUnlocked ? (
                    <Button 
                      asChild 
                      size="sm" 
                      className={`w-1/2 font-semibold text-xs ${
                        isCompleted 
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                          : isCurrent
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                          : "bg-primary/90 hover:bg-primary text-primary-foreground"
                      }`}
                    >
                      <Link to={`/seo-simulation/${sim.id}`}>
                        <span>{isCompleted ? "Replay Sandbox" : "Enter Sandbox"}</span>
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => prevSim && setLockedModalData({ targetSim: sim, targetIndex: idx, prevSim })}
                      className="w-1/2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 bg-muted/60"
                      title="Prerequisite required to unlock this level"
                    >
                      <Lock className="h-3.5 w-3.5 text-amber-400" />
                      <span>Locked Level</span>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 🔒 Locked Prerequisite Modal */}
      <Dialog open={!!lockedModalData} onOpenChange={(open) => !open && setLockedModalData(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs flex items-center gap-1">
                <Lock className="h-3 w-3 text-amber-400" />
                <span>Prerequisite Required</span>
              </Badge>
              <Badge variant="outline" className="text-xs">
                Sequential Learning
              </Badge>
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Level {lockedModalData ? lockedModalData.targetIndex + 1 : ""} is Currently Locked
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Agency simulations are designed sequentially so you master foundational skills before taking on advanced client projects.
            </DialogDescription>
          </DialogHeader>

          {lockedModalData && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1.5">
                <div className="font-bold text-foreground">
                  Target Client: {lockedModalData.targetSim.title}
                </div>
                <p className="text-muted-foreground">
                  To unlock this level, you must first complete <strong>Level {lockedModalData.targetIndex} ({clientBusinessMetadata[lockedModalData.prevSim.id]?.clientName || lockedModalData.prevSim.title})</strong> with a passing score of 70% or higher.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                <strong className="text-primary flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  <span>Why This Order Matters:</span>
                </strong>
                <p className="text-muted-foreground leading-relaxed">
                  Level {lockedModalData.targetIndex + 1} introduces complex multi-location schema and heading silos. Mastering title tags and search snippet CTR in Level {lockedModalData.targetIndex} ensures you won't struggle with advanced code.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setDemoOverride(true);
                setLockedModalData(null);
                try {
                  localStorage.setItem("krechet_seo_demo_override", "true");
                } catch (e) {}
              }}
              className="text-xs text-muted-foreground hover:text-foreground w-full sm:w-auto"
            >
              <Unlock className="h-3.5 w-3.5 mr-1" />
              <span>Unlock for Testing</span>
            </Button>

            {lockedModalData && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  const prevId = lockedModalData.prevSim.id;
                  setLockedModalData(null);
                  setLocation(`/seo-simulation/${prevId}`);
                }}
                className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5 w-full sm:w-auto"
              >
                <span>Start Level {lockedModalData.targetIndex} Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
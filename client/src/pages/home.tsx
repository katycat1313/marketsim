import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  Sparkles, 
  MousePointer, 
  Search, 
  BarChart3, 
  Trophy, 
  Mic, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  Zap, 
  Play, 
  Lock, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Layers,
  ChevronRight,
  Activity,
  Radio,
  Building2,
  Rocket,
  Gift
} from "lucide-react";
import { AITeacherModal } from "@/components/AITeacherModal";
import { EarlyBirdModal } from "@/components/EarlyBirdModal";

export default function Home() {
  const [, navigate] = useLocation();
  const [selectedTrack, setSelectedTrack] = useState<number>(1);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isEarlyBirdOpen, setIsEarlyBirdOpen] = useState(false);

  // Student telemetry stats
  const studentLevel = "Junior Associate (Level 1)";
  const currentXP = 450;
  const targetXP = 1000;
  const progressPercent = Math.round((currentXP / targetXP) * 100);

  const careerLevels = [
    {
      level: 1,
      title: "Junior Growth Associate",
      badge: "Level 1 • Active",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      description: "On-page search architecture, exact title/meta constraints, single H1 hierarchy, and core KPI formulas.",
      status: "unlocked",
      progress: 45,
      missionsCount: "12 Missions",
    },
    {
      level: 2,
      title: "Performance Specialist",
      badge: "Level 2 • Locked",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      description: "Long-tail intent clustering, JSON-LD schema engineering, WCAG 2.1 accessibility, and negative keyword shields.",
      status: "locked",
      progress: 0,
      missionsCount: "14 Missions",
    },
    {
      level: 3,
      title: "Senior Strategist",
      badge: "Level 3 • Locked",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      description: "Deceptive client brief diagnostics, keyword cannibalization, PageRank sculpting, and Meta ad creative fatigue.",
      status: "locked",
      progress: 0,
      missionsCount: "10 Missions",
    },
    {
      level: 4,
      title: "Agency Director Capstone",
      badge: "Level 4 • Locked",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      description: "Blended MER modeling, multi-touch incrementality testing, omnichannel crisis repairs, and Board Oral Defense.",
      status: "locked",
      progress: 0,
      missionsCount: "14 Missions",
    }
  ];

  const flightSimulators = [
    {
      title: "My Business Sandbox & Persona Studio",
      category: "Digital Twin & Strategy",
      description: "Clone your real-world business (menu, catalog, website) into a private sandbox. Build precision buyer personas with Director Atlas and discover hidden high-ROI channels.",
      icon: <Building2 className="h-6 w-6 text-amber-400" />,
      link: "/custom-sandbox",
      actionText: "Open My Business Sandbox",
      gradient: "from-amber-500/10 to-yellow-500/5 hover:border-amber-500/50",
      badge: "Custom Digital Twin",
      badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    },
    {
      title: "Paid Ads Auction Sandbox",
      category: "PPC & Performance",
      description: "Google Search auctions, Meta conversion campaigns, and LinkedIn B2B lead gen with real Quality Score & CPC auction math.",
      icon: <MousePointer className="h-6 w-6 text-blue-400" />,
      link: "/ad-simulations",
      actionText: "Launch Ads Workbench",
      gradient: "from-blue-500/10 to-indigo-500/5 hover:border-blue-500/50",
      badge: "Live Auction Math",
      badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    },
    {
      title: "SEO & SERP Two-Sandbox CMS",
      category: "Technical & Organic SEO",
      description: "Live WordPress visual CMS editor paired with real-time Recharts traffic delta area charts and JSON-LD schema validator.",
      icon: <Search className="h-6 w-6 text-emerald-400" />,
      link: "/seo-simulations",
      actionText: "Open CMS Sandbox",
      gradient: "from-emerald-500/10 to-teal-500/5 hover:border-emerald-500/50",
      badge: "Two-Sandbox Engine",
      badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    },
    {
      title: "GA4 Data & Reporting Studio",
      category: "Growth Analytics",
      description: "Interactive funnel exploration, drop-off leak analysis, mobile checkout friction diagnostics, and attribution modeling.",
      icon: <BarChart3 className="h-6 w-6 text-purple-400" />,
      link: "/data-visualization",
      actionText: "Inspect GA4 Funnels",
      gradient: "from-purple-500/10 to-pink-500/5 hover:border-purple-500/50",
      badge: "Event-Driven Telemetry",
      badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20"
    },
    {
      title: "Master Omnichannel Capstone",
      category: "Executive Crisis",
      description: "Fix a failing agency client simultaneously across Google Ads, Meta creative fatigue, and landing page conversion friction.",
      icon: <Trophy className="h-6 w-6 text-amber-400" />,
      link: "/capstone-simulation",
      actionText: "Enter Master Capstone",
      gradient: "from-amber-500/10 to-orange-500/5 hover:border-amber-500/50",
      badge: "Omnichannel Crisis",
      badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    },
    {
      title: "AI Interview Studio",
      category: "Oral Board Defense",
      description: "Defend your marketing decisions in front of AI Director Sarah Jenkins, Performance Lead Marcus Vance, and VP Elena Rostova.",
      icon: <Mic className="h-6 w-6 text-red-400" />,
      link: "/interview-prep",
      actionText: "Practice STAR Defense",
      gradient: "from-red-500/10 to-rose-500/5 hover:border-red-500/50",
      badge: "AI Video Director",
      badgeClass: "bg-red-500/10 text-red-400 border-red-500/20"
    },
    {
      title: "Verified Career Portfolio",
      category: "Proof-of-Work Assets",
      description: "Export passed client audits into verified before/after case studies with audited benchmark charts and 1-click STAR resume bullets.",
      icon: <Briefcase className="h-6 w-6 text-cyan-400" />,
      link: "/portfolio",
      actionText: "View My Portfolio",
      gradient: "from-cyan-500/10 to-blue-500/5 hover:border-cyan-500/50",
      badge: "Cryptographic Proof",
      badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground space-y-8 pb-16">
      
      {/* Top Hero Command Center Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-background to-secondary/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30 px-3 py-1 font-mono uppercase tracking-wider text-xs">
                <Zap className="h-3.5 w-3.5 mr-1.5 inline animate-pulse text-amber-400" />
                Flight Deck • Active Session
              </Badge>
              <Badge variant="outline" className="text-muted-foreground border-border text-xs">
                Asus ROG Zephyrus G14 • RTX GPU Offline Mode
              </Badge>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-amber-400 bg-clip-text text-transparent">
              Krechet Marketing Academy
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Welcome to the AI-native flight simulator for growth engineers. Repair broken client accounts, audit live CMS websites, structure Google/Meta auctions, and defend your decisions in front of the AI Director.
            </p>
          </div>

          {/* Student Status & Quick Stats Card */}
          <div className="w-full lg:w-auto bg-card/80 backdrop-blur-md border border-border/80 rounded-xl p-5 shadow-lg min-w-[300px] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Current Rank</p>
                <p className="font-bold text-foreground text-sm md:text-base flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  {studentLevel}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Experience</p>
                <p className="font-mono font-bold text-primary text-sm md:text-base mt-0.5">
                  {currentXP} / {targetXP} XP
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Level 1 Progress</span>
                <span className="font-medium text-foreground">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 bg-secondary" />
            </div>

            <div className="pt-1 flex gap-2">
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs border-primary/30 hover:bg-primary/10">
                  <Activity className="h-3.5 w-3.5 mr-1.5" />
                  View Skills Radar
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Active Mission Launch Card (Call to Action) */}
        <div className="mt-8 pt-6 border-t border-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-primary/5 p-4 md:p-5 rounded-xl border-primary/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Next Active Mission Ready</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Mission 1: Coffee Shop Local Intent & On-Page SEO Repair
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Diagnose missing H1 tags, correct keyword intent, and eliminate search ranking leaks before taking on high-CPC auction campaigns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Button 
              size="lg" 
              onClick={() => setIsTeacherModalOpen(true)}
              className="w-full md:w-auto font-bold shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 cursor-pointer"
            >
              <Radio className="h-4 w-4 fill-current animate-pulse text-emerald-400" />
              <span>Launch Mission 1 Briefing (90s)</span>
            </Button>

            <Button 
              size="lg"
              variant="outline"
              onClick={() => setIsEarlyBirdOpen(true)}
              className="w-full md:w-auto font-bold border-amber-500/40 text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Rocket className="h-4 w-4 text-amber-400" />
              <span>🎟️ Reserve VIP Beta (50% Off)</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Career Tracks & Level Gate Progression */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              4-Tier Career Mastery Roadmap
            </h2>
            <p className="text-sm text-muted-foreground">
              Complete the 50 in-depth curriculum playbooks and pass the hardcore gated benchmarks to level up.
            </p>
          </div>
          <Link href="/tutorials-new">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
              Browse 50 Playbooks <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {careerLevels.map((lvl) => (
            <Card 
              key={lvl.level} 
              className={`relative overflow-hidden transition-all duration-200 border-border/80 ${
                lvl.status === 'unlocked' 
                  ? 'bg-card hover:border-primary/50 shadow-md ring-1 ring-primary/20' 
                  : 'bg-card/40 opacity-80 border-dashed'
              }`}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant="outline" className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${lvl.badgeColor}`}>
                    {lvl.badge}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{lvl.missionsCount}</span>
                </div>
                <CardTitle className="text-base font-bold flex items-center gap-1.5">
                  {lvl.status === 'locked' && <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                  {lvl.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {lvl.description}
                </p>

                {lvl.status === 'unlocked' ? (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Benchmark Progress</span>
                      <span className="font-semibold text-foreground">{lvl.progress}%</span>
                    </div>
                    <Progress value={lvl.progress} className="h-1.5" />
                  </div>
                ) : (
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-muted-foreground/80 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500/80" />
                    <span>Requires Level {lvl.level - 1} Board Certification</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Flight Simulator Sandboxes Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Active Flight Simulator Workbenches
          </h2>
          <p className="text-sm text-muted-foreground">
            Hands-on sandboxes where you audit live code, configure campaigns, and measure real benchmark lift.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flightSimulators.map((sim, index) => (
            <Card 
              key={index}
              className={`bg-gradient-to-br ${sim.gradient} border border-border/80 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between`}
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 rounded-lg bg-background/80 border border-border shadow-sm">
                    {sim.icon}
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-semibold uppercase px-2 py-0.5 border ${sim.badgeClass}`}>
                    {sim.badge}
                  </Badge>
                </div>
                <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                  {sim.category}
                </div>
                <CardTitle className="text-lg font-bold text-foreground mt-0.5">
                  {sim.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-5 pt-0">
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {sim.description}
                </p>
              </CardContent>

              <div className="p-5 pt-0 mt-auto">
                <Link href={sim.link} className="w-full">
                  <Button variant="secondary" className="w-full text-xs font-semibold justify-between group hover:bg-primary hover:text-primary-foreground transition-all">
                    <span>{sim.actionText}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Telemetry & AI Diagnostic Radar Banner */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-card to-secondary/30 p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Ollama AI Telemetry Engine</span>
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Personalized Weakness Targeting & Diagnostic Drills
          </h3>
          <p className="text-sm text-muted-foreground">
            Our telemetry model diagnoses your simulation runs across Quality Score, Negative Keyword Defense, and Schema markup. Generate custom offline scenarios targeting your exact skill gaps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Link href="/ad-simulations">
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs shadow-md">
              <Zap className="h-4 w-4 mr-1.5" />
              Generate Adaptive Challenge
            </Button>
          </Link>
          <Link href="/interview-prep">
            <Button variant="outline" className="w-full sm:w-auto text-xs border-primary/30 hover:bg-primary/10">
              <Mic className="h-4 w-4 mr-1.5" />
              AI Director Defense
            </Button>
          </Link>
        </div>
      </div>

      {/* Socratic AI Teacher & Flight Instructor Modal */}
      <AITeacherModal 
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        missionTitle="Mission 1: Coffee Shop Local Intent & On-Page SEO Repair"
        missionTopic="Organic Bean Sourcing, H1 Silos & Local Schema"
        missionPath="/seo-simulation/1"
      />

      {/* Early-Bird Pre-Order / VIP Beta Lead Capture Modal */}
      <EarlyBirdModal 
        isOpen={isEarlyBirdOpen}
        onClose={() => setIsEarlyBirdOpen(false)}
      />

    </div>
  );
}
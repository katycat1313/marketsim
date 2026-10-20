import React, { useState } from "react";
import { useClientAgency } from "@/context/ClientAgencyContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EndOfWeekKnowledgeCheck } from "@/components/EndOfWeekKnowledgeCheck";
import { ClientInquiryPortal } from "@/components/ClientInquiryPortal";
import {
  Building2,
  Calendar,
  FastForward,
  FileText,
  Loader2,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Target,
  DollarSign,
  Coffee,
  CheckCircle2,
  AlertTriangle,
  Split,
  Search,
  MousePointer,
  MessageSquare
} from "lucide-react";

export function AgencyClientHeader() {
  const { client, isLoading, isAdvancing, advanceDays, updateLevel } = useClientAgency();
  const [dossierOpen, setDossierOpen] = useState(false);

  if (isLoading || !client) {
    return (
      <div className="bg-card/70 border-b border-border/60 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground animate-pulse">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <span>Loading client account...</span>
        </div>
      </div>
    );
  }

  const { dossier, timeline, healthScore, seo, adCampaign, deployedABTest, blended } = client;

  return (
    <div className="bg-gradient-to-r from-card/95 via-card/90 to-background border-b border-border/70 backdrop-blur-md px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm sticky top-0 z-20">
      {/* Left: Active Client Account & Dossier Button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold">
            <Coffee className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground tracking-tight">
                {dossier.clientName}
              </span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-secondary/50 text-muted-foreground border-border">
                {dossier.industry}
              </Badge>
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-2">
              <span>Goal: ${dossier.targetMonthlyRevenue.toLocaleString()}/mo</span>
              <span>•</span>
              <span className="text-emerald-500 font-medium">ROAS: {blended.blendedRoas.toFixed(1)}x</span>
            </div>
          </div>
        </div>

        {/* Client Dossier Dialog Trigger */}
        <Dialog open={dossierOpen} onOpenChange={setDossierOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5 px-2.5 border-border hover:bg-secondary/70 ml-1"
            >
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span>Client Dossier</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                <Building2 className="h-4 w-4" />
                <span>Agency Client Onboarding Dossier</span>
              </div>
              <DialogTitle className="text-xl font-bold flex items-center justify-between">
                <span>{dossier.clientName}</span>
                <Badge variant="secondary" className="text-xs font-normal">
                  {dossier.industry}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                {dossier.location} • Retainer Model: Growth Strategy & Campaign Operations
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              {/* Executive Summary */}
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/60 space-y-1.5">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Coffee className="h-4 w-4 text-amber-500" />
                  <span>Executive Client Brief</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {dossier.fieldNotes}
                </p>
              </div>

              {/* Client Goals & Constraints */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/20 border border-border/50 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Core Growth Targets
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Target Revenue: <strong className="text-foreground">${dossier.targetMonthlyRevenue.toLocaleString()}/mo</strong></li>
                    <li>Primary Challenge: High bounce rate on paid traffic</li>
                    <li>Goal: Lower Blended CAC below $16.00</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-secondary/20 border border-border/50 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Unit Economics
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Average Order Value: <strong className="text-foreground">$42.50</strong></li>
                    <li>Gross Product Margin: <strong className="text-foreground">62%</strong></li>
                    <li>Packaging & Shipping: ~$5.50 per order</li>
                  </ul>
                </div>
              </div>

              {/* Conversion Tracking & Pixel Verification (Inspect Working Model) */}
              <div className="p-3 rounded-lg bg-secondary/20 border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Conversion Tracking & Pixel Status (Working Model)
                  </span>
                  <Badge variant="outline" className="text-[10px] py-0 text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
                    All Pixels Active (Healthy)
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-background/60 border border-border/40">
                    <div className="font-medium text-foreground flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      <span>Google Tag</span>
                    </div>
                    <div className="text-muted-foreground font-mono text-[10px]">AW-109283741</div>
                    <div className="text-[10px] text-emerald-500 mt-0.5">gtag('event', 'purchase') firing</div>
                  </div>
                  <div className="p-2 rounded bg-background/60 border border-border/40">
                    <div className="font-medium text-foreground flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      <span>Meta Pixel / CAPI</span>
                    </div>
                    <div className="text-muted-foreground font-mono text-[10px]">ID: 8492019385</div>
                    <div className="text-[10px] text-emerald-500 mt-0.5">PageView, AddToCart, Purchase</div>
                  </div>
                  <div className="p-2 rounded bg-background/60 border border-border/40">
                    <div className="font-medium text-foreground flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      <span>GA4 Measurement</span>
                    </div>
                    <div className="text-muted-foreground font-mono text-[10px]">G-JENNYSJAVA4</div>
                    <div className="text-[10px] text-emerald-500 mt-0.5">Enhanced Ecommerce Enabled</div>
                  </div>
                </div>
              </div>

              {/* End of Dossier Notice: Missing Info / Message Client */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-1.5 mb-0.5">
                    <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                    <span>Need More Information or Operational Details?</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    In real agency work, briefs are never 100% complete. If you need details on beans, return policies, or roast schedules, feel free to contact Jenny directly in the messaging portal.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Client Inquiry Portal Button */}
        <ClientInquiryPortal />
      </div>

      {/* Center/Right: Timeline, Rigor Level, and Advance 7 Days */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Timeline Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/40 border border-border/50 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>Day {timeline.currentDay}</span>
          <span className="text-muted-foreground/60">•</span>
          <span className="font-medium text-foreground">Week {timeline.currentWeek}</span>
        </div>

        {/* Rigor Level Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1 px-2.5 border-border bg-card hover:bg-secondary"
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span className="hidden sm:inline font-medium">{timeline.currentLevel}</span>
              <span className="sm:hidden font-medium">Week {timeline.currentWeek}</span>
              <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 text-xs">
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Curriculum Rigor Level
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => updateLevel("Week 1: Junior Specialist")}
              className={timeline.currentLevel.includes("Week 1") ? "bg-primary/10 text-primary font-semibold" : ""}
            >
              Week 1: Junior Specialist (Fundamentals)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateLevel("Week 2: Campaign Strategist")}
              className={timeline.currentLevel.includes("Week 2") ? "bg-primary/10 text-primary font-semibold" : ""}
            >
              Week 2: Campaign Strategist (Negatives & CRO)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateLevel("Week 3: Senior Director")}
              className={timeline.currentLevel.includes("Week 3") ? "bg-primary/10 text-primary font-semibold" : ""}
            >
              Week 3: Senior Director (Schema & Full-Funnel)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateLevel("Week 4: Agency Partner")}
              className={timeline.currentLevel.includes("Week 4") ? "bg-primary/10 text-primary font-semibold" : ""}
            >
              Week 4: Agency Partner (Crisis Audits)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Health Score Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/30 border border-border/50 text-xs">
          <span className="text-muted-foreground">Client Health:</span>
          <span
            className={`font-bold ${
              healthScore >= 75 ? "text-emerald-500" : healthScore >= 50 ? "text-amber-500" : "text-rose-500"
            }`}
          >
            {healthScore}/100
          </span>
        </div>

        {/* Advance 7 Days Action Button */}
        <Button
          onClick={() => advanceDays(7)}
          disabled={isAdvancing}
          size="sm"
          className="h-7 text-xs font-semibold gap-1.5 px-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        >
          {isAdvancing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <FastForward className="h-3.5 w-3.5" />
              <span>Advance 7 Days</span>
            </>
          )}
        </Button>

        {/* End of Week Knowledge Check & AI Authenticity Audit */}
        <EndOfWeekKnowledgeCheck />
      </div>
    </div>
  );
}

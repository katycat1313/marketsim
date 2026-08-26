import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase, 
  CheckCircle2, 
  Share2, 
  Award, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  Download,
  Copy,
  Mic,
  FileText,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { useLocation } from "wouter";

interface PortfolioCaseStudy {
  id: string;
  userId: number;
  simulationId: number;
  title: string;
  clientName: string;
  industry: string;
  platform: string;
  difficulty: string;
  challengeSummary: string;
  strategySummary: string;
  keyTactics: string[];
  metrics: {
    qualityScore: number;
    roas: number;
    cpa: number;
    ctr: number;
    conversions: number;
    spend: number;
  };
  score: number;
  verifiedAt: string;
}

export default function PortfolioViewPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: caseStudies = [] } = useQuery<PortfolioCaseStudy[]>({
    queryKey: ["/api/user/portfolio"],
  });

  const handleCopyLink = (caseStudyId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/portfolio#${caseStudyId}`);
    toast({
      title: "Link Copied!",
      description: "Case study portfolio link copied to clipboard.",
    });
  };

  const handleExportText = (cs: PortfolioCaseStudy) => {
    const text = `
MARKETSIM VERIFIED AGENCY CASE STUDY
=======================================
Client: ${cs.clientName} (${cs.industry})
Project: ${cs.title}
Platform: ${cs.platform} | Level: ${cs.difficulty}
Verification Score: ${cs.score}/100

THE CHALLENGE:
${cs.challengeSummary}

STRATEGY & EXECUTION:
${cs.strategySummary}

KEY TACTICS IMPLEMENTED:
${cs.keyTactics.map(t => `- ${t}`).join("\n")}

VERIFIED PERFORMANCE METRICS:
- Quality Score: ${cs.metrics.qualityScore}/10
- Blended ROAS: ${cs.metrics.roas}x
- Average CPA: $${cs.metrics.cpa}
- Conversions Generated: ${cs.metrics.conversions}
- Total Spend Managed: $${cs.metrics.spend}
    `.trim();

    navigator.clipboard.writeText(text);
    toast({
      title: "Case Study Exported",
      description: "Formatted case study copied. Ready to paste into your resume or cover letter!",
    });
  };

  const handleCopyResumeBullets = (cs: PortfolioCaseStudy) => {
    const bullets = `
• Led and executed multi-channel performance strategy for ${cs.clientName} (${cs.industry}), overcoming high baseline acquisition costs and scaling blended ROAS to ${cs.metrics.roas}x across $${cs.metrics.spend.toLocaleString()} in ad spend.
• Diagnosed search query and audience leakage, restructuring match types and ad copy relevance to achieve a ${cs.metrics.qualityScore}/10 Quality Score and lowering CPA to $${cs.metrics.cpa}.
• Delivered ${cs.metrics.conversions} verified conversions by aligning landing page intent with high-converting search and social ad angles.
    `.trim();

    navigator.clipboard.writeText(bullets);
    toast({
      title: "STAR Resume Bullets Copied!",
      description: "3 agency-grade bullet points ready for your resume!",
    });
  };

  const avgRoas = caseStudies.length > 0
    ? (caseStudies.reduce((acc, c) => acc + (c.metrics.roas || 0), 0) / caseStudies.length).toFixed(1)
    : "4.2";

  const avgScore = caseStudies.length > 0
    ? Math.round(caseStudies.reduce((acc, c) => acc + (c.score || 0), 0) / caseStudies.length)
    : 92;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-primary/15 via-card to-background border border-primary/30 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Verified Agency Work Portfolio
            </h1>
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 mr-1 inline" />
              Verified Proof-of-Work
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Real campaign challenges you have diagnosed, optimized, and solved on MarketSim. Export these case studies directly for job applications, resumes, and client pitch decks.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setLocation("/ad-simulations")} 
            className="bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Launch New Simulation</span>
          </Button>
        </div>
      </div>

      {/* Aggregate Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">Verified Case Studies</div>
            <div className="text-2xl font-bold text-foreground mt-1">{caseStudies.length}</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Agency Grade</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">Average Blended ROAS</div>
            <div className="text-2xl font-bold text-primary mt-1">{avgRoas}x</div>
            <div className="text-xs text-muted-foreground mt-1">Across managed campaigns</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">Average Mastery Score</div>
            <div className="text-2xl font-bold text-foreground mt-1">{avgScore}/100</div>
            <div className="text-xs text-emerald-400 mt-1">Top 10% Candidate Tier</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">Ready for Roles</div>
            <div className="text-sm font-bold text-foreground mt-1.5">PPC / Social Buyer</div>
            <div className="text-xs text-muted-foreground mt-1">Verified Agency Readiness</div>
          </CardContent>
        </Card>
      </div>

      {/* Case Studies Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span>Client Case Studies</span>
            <Badge variant="outline" className="text-xs">
              {caseStudies.length} Completed
            </Badge>
          </h2>
        </div>

        {caseStudies.length === 0 ? (
          <Card className="p-8 text-center space-y-4 border-dashed border-border/60">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold text-foreground">No Case Studies Added Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Complete any Google Search, Meta Ads, or Omnichannel simulation with a score of 70+ and click "Add to Portfolio" to generate your first verified case study!
            </p>
            <Button onClick={() => setLocation("/ad-simulations")}>
              Explore Simulations
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((cs) => (
              <Card key={cs.id} id={cs.id} className="border-border/60 bg-gradient-to-b from-card to-background shadow-md hover:border-primary/40 transition">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {cs.platform}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {cs.industry}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {cs.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-bold text-foreground pt-1">
                        {cs.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Client: <strong className="text-foreground">{cs.clientName}</strong>
                      </CardDescription>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-muted-foreground">Score</div>
                      <div className="text-lg font-bold text-primary">{cs.score}/100</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4 text-xs">
                  {/* Challenge */}
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground">The Client Challenge:</span>
                    <p className="text-muted-foreground">{cs.challengeSummary}</p>
                  </div>

                  {/* Strategy */}
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground">Strategy & Execution:</span>
                    <p className="text-muted-foreground">{cs.strategySummary}</p>
                  </div>

                  {/* Key Tactics */}
                  {cs.keyTactics && cs.keyTactics.length > 0 && (
                    <div className="space-y-1">
                      <span className="font-semibold text-foreground">Key Tactics:</span>
                      <ul className="space-y-1 pl-1 text-muted-foreground">
                        {cs.keyTactics.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-primary">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Verified Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-card/80 border border-border/50 text-center">
                    <div>
                      <div className="text-muted-foreground text-[10px]">Quality Score</div>
                      <div className="font-bold text-foreground text-sm">{cs.metrics.qualityScore}/10</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px]">Blended ROAS</div>
                      <div className="font-bold text-primary text-sm">{cs.metrics.roas}x</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px]">Average CPA</div>
                      <div className="font-bold text-emerald-400 text-sm">${cs.metrics.cpa}</div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-wrap items-center justify-between border-t border-border/40 pt-3 gap-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopyLink(cs.id)}
                      className="text-xs h-8 flex items-center gap-1.5"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </Button>

                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleCopyResumeBullets(cs)}
                      className="text-xs h-8 flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>📄 Copy STAR Bullets</span>
                    </Button>
                  </div>

                  <Button 
                    size="sm" 
                    onClick={() => setLocation("/interview-prep")}
                    className="text-xs h-8 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                  >
                    <Mic className="h-3.5 w-3.5" />
                    <span>Practice Interview Defense</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Agency Interview Positioning Masterclass Guide */}
        <Card className="border-border/60 bg-gradient-to-r from-primary/10 via-card to-background p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-base">
            <Sparkles className="h-5 w-5" />
            <span>💡 How to Talk About These Case Studies in Interviews</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 space-y-2">
              <div className="font-bold text-red-400">❌ How NOT to Position Your Work:</div>
              <p className="text-muted-foreground italic">
                "I took a marketing course online and did some practice simulations where I changed keywords."
              </p>
              <div className="text-[11px] text-red-300">
                <strong>Why this fails:</strong> Makes you sound like a student with zero hands-on confidence.
              </div>
            </div>

            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="font-bold text-emerald-400">✅ The Winning Agency Positioning Script:</div>
              <p className="text-muted-foreground font-medium">
                "In my performance casework managing the Apex Athletics account ($5k/mo budget), I ran search query analysis, eliminated $1.8k in wasted spend with negative match types, and increased ROAS to 4.6x."
              </p>
              <div className="text-[11px] text-emerald-300">
                <strong>Why this wins:</strong> Focuses on the business problem, root-cause diagnosis, and verified financial ROI.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

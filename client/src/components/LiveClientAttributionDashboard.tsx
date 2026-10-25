import React from "react";
import { useClientAgency } from "@/context/ClientAgencyContext";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Users,
  MousePointer,
  Search,
  Split,
  FastForward,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export function LiveClientAttributionDashboard() {
  const { client, isLoading, isAdvancing, advanceDays } = useClientAgency();

  if (isLoading || !client) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { dossier, timeline, healthScore, seo, adCampaign, deployedABTest, attribution, blended, dailyHistory } = client;

  // Chart data formatted for multi-channel daily volume
  const trendData = dailyHistory.map((d) => ({
    name: `Day ${d.day}`,
    paidSearch: d.paidSearchClicks,
    paidSocial: d.paidSocialClicks,
    organic: d.organicClicks,
    direct: d.directClicks,
    conversions: d.conversions,
    revenue: d.dailyRevenue,
    spend: d.dailySpend,
  }));

  const channelComparisonData = [
    {
      name: "Paid Search",
      sessions: attribution.paidSearch?.sessions || 0,
      conversions: attribution.paidSearch?.conversions || 0,
      spend: attribution.paidSearch?.spend || 0,
      revenue: attribution.paidSearch?.revenue || 0,
    },
    {
      name: "Paid Social",
      sessions: attribution.paidSocial?.sessions || 0,
      conversions: attribution.paidSocial?.conversions || 0,
      spend: attribution.paidSocial?.spend || 0,
      revenue: attribution.paidSocial?.revenue || 0,
    },
    {
      name: "Organic (SEO)",
      sessions: attribution.organicSearch?.sessions || 0,
      conversions: attribution.organicSearch?.conversions || 0,
      spend: 0,
      revenue: attribution.organicSearch?.revenue || 0,
    },
    {
      name: "Direct / Brand",
      sessions: attribution.directReferral?.sessions || 0,
      conversions: attribution.directReferral?.conversions || 0,
      spend: 0,
      revenue: attribution.directReferral?.revenue || 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Client Brief & KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blended CAC */}
        <Card className="bg-card/90 border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Blended CAC</span>
              <Users className="h-4 w-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              ${blended.blendedCac.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-muted-foreground">
              Total ad spend divided by all acquired customers across paid and organic channels.
            </p>
          </CardContent>
        </Card>

        {/* Blended ROAS */}
        <Card className="bg-card/90 border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Blended ROAS</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-500">
              {blended.blendedRoas.toFixed(2)}x
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-muted-foreground">
              Return on ad spend: ${blended.totalRevenue.toFixed(0)} revenue generated on ${blended.totalSpend.toFixed(0)} total spend.
            </p>
          </CardContent>
        </Card>

        {/* Total Conversions */}
        <Card className="bg-card/90 border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Total Orders / Leads</span>
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {blended.totalConversions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-muted-foreground">
              Site-wide conversion rate: <strong className="text-foreground">{blended.blendedCvr.toFixed(2)}%</strong> across {blended.totalSessions.toLocaleString()} sessions.
            </p>
          </CardContent>
        </Card>

        {/* Client Health & Actions */}
        <Card className="bg-card/90 border-border/70 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Account Health</span>
              <ShieldCheck className="h-4 w-4 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span>{healthScore}/100</span>
              <Badge variant="outline" className="text-[11px] font-normal">
                {timeline.currentLevel}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              onClick={() => advanceDays(7)}
              disabled={isAdvancing}
              size="sm"
              className="w-full text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isAdvancing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Simulating 7 Days...</span>
                </>
              ) : (
                <>
                  <FastForward className="h-3.5 w-3.5" />
                  <span>Advance 7 Days</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Cross-Channel Strategic Synergy Banner */}
      <div className="p-4 rounded-xl border border-primary/25 bg-primary/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              Live Connected Engine
            </Badge>
            <span className="text-xs font-semibold text-foreground">
              How Your Recent Work Directly Affected This Client
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-3xl">
            • <strong>SEO Landing Page:</strong> Score {seo.overallScore}/100 gave Google Ads an "{seo.landingPageExperience}" rating, slashing CPC to ${adCampaign.effectiveCpc.toFixed(2)}.<br />
            • <strong>A/B Testing:</strong> {deployedABTest ? `Variant "${deployedABTest.winningVariantName}" is active (+${deployedABTest.improvementPercent}% conversion rate lift applied to all traffic).` : "No test deployed yet. Run an experiment in A/B Testing Lab to lift conversions."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/seo-simulations">
            <Button variant="outline" size="sm" className="text-xs gap-1 border-border">
              <Search className="h-3 w-3 text-primary" />
              <span>SEO Studio</span>
            </Button>
          </Link>
          <Link href="/ab-test-workshop">
            <Button variant="outline" size="sm" className="text-xs gap-1 border-border">
              <Split className="h-3 w-3 text-indigo-400" />
              <span>A/B Testing</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Multi-Channel Attribution Table */}
      <Card className="bg-card/90 border-border/70 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold">Multi-Channel Attribution Breakdown</CardTitle>
                <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-300 border-amber-500/30 font-mono">
                  Simulated Client Baseline
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Simulated sessions, conversions, ad spend, and ROAS across all traffic sources for {dossier.clientName} (Baseline pre-agency client budget — zero real ad spend)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel Source</TableHead>
                <TableHead className="text-right">Sessions</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Conv. Rate</TableHead>
                <TableHead className="text-right">Ad Spend</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">CPA</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(attribution).map(([key, ch]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium text-foreground flex items-center gap-2">
                    {key === "paidSearch" && <MousePointer className="h-4 w-4 text-purple-400" />}
                    {key === "paidSocial" && <TrendingUp className="h-4 w-4 text-blue-400" />}
                    {key === "organicSearch" && <Search className="h-4 w-4 text-emerald-400" />}
                    {key === "directReferral" && <Users className="h-4 w-4 text-amber-400" />}
                    <span>{ch.name}</span>
                  </TableCell>
                  <TableCell className="text-right font-mono">{ch.sessions.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{ch.conversions}</TableCell>
                  <TableCell className="text-right font-mono">{ch.conversionRate.toFixed(2)}%</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {ch.spend > 0 ? `$${ch.spend.toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium text-emerald-500">
                    ${ch.revenue.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {ch.cpa > 0 ? `$${ch.cpa.toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    {ch.roas >= 90 ? "Organic" : `${ch.roas.toFixed(1)}x`}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-secondary/30 font-semibold">
                <TableCell>Total Blended Portfolio</TableCell>
                <TableCell className="text-right font-mono">{blended.totalSessions.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono text-primary">{blended.totalConversions}</TableCell>
                <TableCell className="text-right font-mono">{blended.blendedCvr.toFixed(2)}%</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">${blended.totalSpend.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono text-emerald-500">${blended.totalRevenue.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono text-primary">${blended.blendedCac.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono text-emerald-500">{blended.blendedRoas.toFixed(1)}x</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Context Explainer */}
          <div className="mt-3.5 p-3 rounded-lg bg-secondary/40 border border-border/60 text-xs text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="text-amber-400">ℹ️</span>
              <span>Why is ad spend showing when you haven't run any campaigns yet?</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              This breakdown displays <strong>{dossier.clientName}'s simulated pre-agency baseline data</strong> ($50/day across Google Ads & Meta at an initial $2.85 CPC). You have not spent any personal or real money, and no external ad accounts are connected. As you optimize her account in Weeks 2–4, her Quality Score will rise and her CPC and CAC will drop dynamically in this table.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Daily Performance Trendlines Chart */}
      <Card className="bg-card/90 border-border/70 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Daily Timeline Performance (Days 1 to {timeline.currentDay})</CardTitle>
              <CardDescription className="text-xs">
                Visualizing how traffic channels and conversions accumulate day-by-day
              </CardDescription>
            </div>
            <div className="text-xs text-muted-foreground">
              Day {timeline.currentDay} of 28
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" fontSize={11} stroke="#888888" />
                <YAxis fontSize={11} stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line type="monotone" dataKey="paidSearch" name="Paid Search Clicks" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="paidSocial" name="Paid Social Clicks" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="organic" name="Organic SEO Clicks" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="conversions" name="Conversions (Orders)" stroke="#ffd700" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

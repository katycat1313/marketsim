import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Users,
  MousePointerClick,
  Mail,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Flame
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VipCreatorRecord {
  token: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  specialty: string;
  targetLanding: string;
  clicks: number;
  firstClickedAt?: string;
  lastClickedAt?: string;
  lastIp?: string;
  lastUserAgent?: string;
  hasSetPassword: boolean;
}

interface VipAnalyticsData {
  totalCreators: number;
  openedCount: number;
  unopenedCount: number;
  totalClicks: number;
  passwordSetCount: number;
  openRatePercent: number;
  creators: VipCreatorRecord[];
}

export default function VipTrackerPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "clicked" | "unopened">("all");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const { data, isLoading, refetch, isFetching } = useQuery<VipAnalyticsData>({
    queryKey: ["/api/auth/vip-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/auth/vip-analytics");
      if (!res.ok) throw new Error("Failed to load VIP analytics");
      return res.json();
    },
    refetchInterval: 10000 // auto-refresh every 10 seconds
  });

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/vip?token=${encodeURIComponent(token)}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    toast({
      title: "1-Click VIP Link Copied!",
      description: url,
    });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const creators = data?.creators || [];
  const filteredCreators = creators.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.token.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === "clicked") return c.clicks > 0;
    if (statusFilter === "unopened") return c.clicks === 0;
    return true;
  });

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-background to-secondary/30 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-mono uppercase tracking-wider">
                <Sparkles className="h-3 w-3 mr-1 inline text-amber-400" />
                Executive Outreach Telemetry
              </Badge>
              <Badge variant="outline" className="text-muted-foreground border-border text-xs">
                Real-Time Click Tracker
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              VIP 1-Click Login Tracker
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Live tracking for the 25 creator outreach emails sent with unrestricted 1-click reviewer passes. Direct server-side tracking (100% immune to ad blockers).
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs gap-1.5 border-border bg-card shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-primary" : ""}`} />
            <span>Refresh Telemetry</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sent */}
        <Card className="bg-card border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Total Passes Created</span>
              <Users className="h-4 w-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground">
              {data?.totalCreators || 25}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Top YouTube creators, mentors & agency educators</p>
          </CardContent>
        </Card>

        {/* Clicked / Open Rate */}
        <Card className="bg-card border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Creators Clicked</span>
              <MousePointerClick className="h-4 w-4 text-emerald-400" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-400 flex items-baseline gap-2">
              <span>{data?.openedCount || 0}</span>
              <span className="text-xs font-normal text-muted-foreground font-mono">
                ({data?.openRatePercent || 0}% Open Rate)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {data?.unopenedCount ?? 25} creators have not clicked their link yet
            </p>
          </CardContent>
        </Card>

        {/* Total Clicks */}
        <Card className="bg-card border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Total Link Clicks</span>
              <Flame className="h-4 w-4 text-amber-400" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-amber-400">
              {data?.totalClicks || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Includes multiple visits and return sessions</p>
          </CardContent>
        </Card>

        {/* Passwords Set */}
        <Card className="bg-card border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Personal Passwords Set</span>
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground">
              {data?.passwordSetCount || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">VIPs who saved a custom password for permanent login</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creator, channel, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-card border-border"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <Button
            size="sm"
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className="text-xs h-8"
          >
            All 25 Creators
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "clicked" ? "default" : "outline"}
            onClick={() => setStatusFilter("clicked")}
            className="text-xs h-8 text-emerald-400"
          >
            Clicked ({data?.openedCount || 0})
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "unopened" ? "default" : "outline"}
            onClick={() => setStatusFilter("unopened")}
            className="text-xs h-8 text-muted-foreground"
          >
            Unopened ({data?.unopenedCount || 25})
          </Button>
        </div>
      </div>

      {/* Telemetry Table */}
      <Card className="bg-card border-border/80 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>VIP Creator Outreach Directory & Status</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Review status updates in real-time as creators click their links from email.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead className="w-[200px]">Creator & Brand</TableHead>
                <TableHead>Specialty Focus</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Clicks</TableHead>
                <TableHead>First Clicked</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">1-Click Access Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCreators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                    No creators found matching your filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCreators.map((creator) => {
                  const isClicked = creator.clicks > 0;
                  return (
                    <TableRow key={creator.token} className={isClicked ? "bg-emerald-950/10 hover:bg-emerald-950/20" : "hover:bg-secondary/40"}>
                      {/* Name & Channel */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                            <span>{creator.name}</span>
                            {creator.hasSetPassword && (
                              <Badge variant="outline" className="text-[9px] py-0 px-1 border-indigo-400/40 text-indigo-300">
                                Password Set
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1">
                            {creator.organization}
                          </div>
                        </div>
                      </TableCell>

                      {/* Specialty Focus */}
                      <TableCell>
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-[260px]">
                          {creator.specialty}
                        </div>
                        <div className="text-[10px] text-primary font-mono mt-0.5">
                          Landing: {creator.targetLanding}
                        </div>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell className="text-center">
                        {isClicked ? (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] py-0.5 font-bold">
                            <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                            CLICKED
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground/70 border-border text-[10px] py-0.5 font-normal">
                            Unopened
                          </Badge>
                        )}
                      </TableCell>

                      {/* Total Clicks */}
                      <TableCell className="text-center font-mono font-bold text-xs">
                        {isClicked ? (
                          <span className="text-emerald-400">{creator.clicks}</span>
                        ) : (
                          <span className="text-muted-foreground/50">0</span>
                        )}
                      </TableCell>

                      {/* First Clicked */}
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {creator.firstClickedAt ? (
                          new Date(creator.firstClickedAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        ) : (
                          <span className="text-muted-foreground/40">-</span>
                        )}
                      </TableCell>

                      {/* Last Active */}
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {creator.lastClickedAt ? (
                          new Date(creator.lastClickedAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        ) : (
                          <span className="text-muted-foreground/40">-</span>
                        )}
                      </TableCell>

                      {/* 1-Click Access Link with Copy */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyLink(creator.token)}
                            className="h-7 text-[11px] px-2 gap-1 border-border bg-card hover:bg-secondary"
                          >
                            {copiedToken === creator.token ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 text-muted-foreground" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </Button>

                          <a
                            href={`/vip?token=${encodeURIComponent(creator.token)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                              title="Test link in new tab"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

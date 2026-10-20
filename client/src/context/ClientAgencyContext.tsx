import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface ClientOverviewData {
  dossier: {
    id: number;
    clientName: string;
    founderName: string;
    industry: string;
    businessModel: string;
    location: string;
    establishedYear: number;
    products: string;
    valueProps: string[];
    fieldNotes: string;
    customerFeedback: string[];
    targetMonthlyRevenue: number;
    currentMonthlyRevenue: number;
    targetAov: number;
  };
  timeline: {
    currentDay: number;
    currentWeek: number;
    currentLevel: string;
    daysRemainingInMonth: number;
  };
  healthScore: number;
  persona: {
    name: string;
    ageRange: { min: number; max: number };
    targetLocation: string;
    primaryNeed: string;
    interests: string[];
    painPoints: string[];
    searchIntentKeywords: string[];
    audienceFitBonus: number;
    isSynthesized: boolean;
  };
  seo: {
    title: string;
    h1: string;
    metaDescription: string;
    targetKeywords: string[];
    overallScore: number;
    landingPageExperience: "Below Average" | "Average" | "Above Average";
    organicRankEstimate: number;
    organicMonthlyClicks: number;
    haloBrandSearchBonus: number;
    lastOptimizedDay: number;
  };
  adCampaign: {
    campaignName: string;
    platform: "google_ads" | "meta_ads";
    dailyBudget: number;
    qualityScore: number;
    expectedCtr: number;
    effectiveCpc: number;
    adHeadlines: string[];
    keywords: Array<{ text: string; matchType: "exact" | "phrase" | "broad" }>;
    negativeKeywords: string[];
    adExtensionsActive: boolean;
    landingPageBoostApplied: boolean;
    status: "active" | "paused";
  };
  deployedABTest: {
    testId: number;
    testName: string;
    testVariable: string;
    winningVariantName: string;
    improvementPercent: number;
    projectedAnnualLift: number;
    deployedDay: number;
    deployedAt: string;
  } | null;
  conversionRateMultiplier: number;
  attribution: Record<string, {
    name: string;
    sessions: number;
    conversions: number;
    conversionRate: number;
    spend: number;
    revenue: number;
    cpa: number;
    roas: number;
  }>;
  blended: {
    totalSpend: number;
    totalConversions: number;
    totalSessions: number;
    totalRevenue: number;
    blendedCac: number;
    blendedRoas: number;
    blendedCvr: number;
  };
  dailyHistory: Array<{
    day: number;
    date: string;
    paidSearchClicks: number;
    paidSocialClicks: number;
    organicClicks: number;
    directClicks: number;
    totalSessions: number;
    conversions: number;
    conversionRate: number;
    dailySpend: number;
    dailyRevenue: number;
    blendedCpa: number;
    qualityScore: number;
  }>;
  activityLogs: Array<{
    id: string;
    day: number;
    category: "SEO" | "Paid Ads" | "A/B Testing" | "Persona" | "Timeline" | "Client";
    headline: string;
    detail: string;
    timestamp: string;
  }>;
}

interface ClientAgencyContextType {
  client: ClientOverviewData | null;
  isLoading: boolean;
  isAdvancing: boolean;
  advanceDays: (days?: number) => Promise<void>;
  deployABTestWinner: (params: {
    testId: number;
    testName: string;
    winningVariant: string;
    testVariable: string;
    improvementPercent: number;
  }) => Promise<void>;
  syncSeoScore: (score: number, pageContent?: any) => Promise<void>;
  updateLevel: (level: string) => Promise<void>;
  refetchClient: () => void;
}

const ClientAgencyContext = createContext<ClientAgencyContextType | undefined>(undefined);

export function ClientAgencyProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAdvancing, setIsAdvancing] = useState(false);

  const { data: client, isLoading, refetch: refetchClient } = useQuery<ClientOverviewData>({
    queryKey: ["/api/client/current"],
    queryFn: async () => {
      const res = await fetch("/api/client/current");
      if (!res.ok) throw new Error("Failed to load client account overview");
      return res.json();
    },
    staleTime: 5000,
  });

  const advanceMutation = useMutation({
    mutationFn: async (days: number = 7) => {
      const res = await fetch("/api/client/advance-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });
      if (!res.ok) throw new Error("Failed to advance simulation time");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/client/current"], data.overview);
      queryClient.invalidateQueries({ queryKey: ["/api/client/analytics"] });
      toast({
        title: "Simulation Advanced 7 Days",
        description: data.debrief || "Simulated 7 days of live campaign traffic, ad spend, and organic search.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Simulation Error",
        description: err.message || "Could not advance simulation time.",
      });
    },
  });

  const deployTestMutation = useMutation({
    mutationFn: async (params: {
      testId: number;
      testName: string;
      winningVariant: string;
      testVariable: string;
      improvementPercent: number;
    }) => {
      const res = await fetch("/api/client/deploy-ab-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("Failed to deploy A/B test winner");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/client/current"], data.overview);
      toast({
        title: "Deployed to Live Client Account",
        description: data.message || "A/B test winner applied to landing page and active campaigns.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Deployment Error",
        description: err.message || "Could not deploy winning variant.",
      });
    },
  });

  const syncSeoMutation = useMutation({
    mutationFn: async ({ score, pageContent }: { score: number; pageContent?: any }) => {
      const res = await fetch("/api/client/sync-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, pageContent }),
      });
      if (!res.ok) throw new Error("Failed to sync SEO score");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/client/current"], data.overview);
      toast({
        title: "Landing Page Experience Updated",
        description: data.message || "Google Ad Quality Score and CPC recalculated based on your SEO work.",
      });
    },
  });

  const updateLevelMutation = useMutation({
    mutationFn: async (level: string) => {
      const res = await fetch("/api/client/update-level", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level }),
      });
      if (!res.ok) throw new Error("Failed to update client level");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/client/current"], data.overview);
      toast({
        title: "Agency Level Updated",
        description: `Now working on ${data.overview.timeline.currentLevel}`,
      });
    },
  });

  const advanceDays = async (days: number = 7) => {
    setIsAdvancing(true);
    try {
      await advanceMutation.mutateAsync(days);
    } finally {
      setIsAdvancing(false);
    }
  };

  const deployABTestWinner = async (params: {
    testId: number;
    testName: string;
    winningVariant: string;
    testVariable: string;
    improvementPercent: number;
  }) => {
    await deployTestMutation.mutateAsync(params);
  };

  const syncSeoScore = async (score: number, pageContent?: any) => {
    await syncSeoMutation.mutateAsync({ score, pageContent });
  };

  const updateLevel = async (level: string) => {
    await updateLevelMutation.mutateAsync(level);
  };

  return (
    <ClientAgencyContext.Provider
      value={{
        client: client || null,
        isLoading,
        isAdvancing,
        advanceDays,
        deployABTestWinner,
        syncSeoScore,
        updateLevel,
        refetchClient,
      }}
    >
      {children}
    </ClientAgencyContext.Provider>
  );
}

export function useClientAgency() {
  const context = useContext(ClientAgencyContext);
  if (!context) {
    throw new Error("useClientAgency must be used within a ClientAgencyProvider");
  }
  return context;
}

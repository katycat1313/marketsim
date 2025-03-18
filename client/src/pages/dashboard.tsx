// client/src/pages/dashboard.tsx
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Connections from "@/components/Connections";
import Posts from "@/components/Posts";
import Achievements from "@/components/Achievements";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { Campaign } from "@shared/schema";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

export default function Dashboard() {
  const [, navigate] = useLocation();

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
    refetchInterval: 5000,
    initialData: [],
  });

  if (loadingCampaigns || simulationQueries.isLoading) {
    return <Skeleton className="h-screen w-full" />;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Connections />
      <Posts />
      <Achievements />

      <div className="grid gap-6">
        {simulationQueries.data.map(({ campaign, data, insights }) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{campaign.name}</CardTitle>
                  <CardDescription>
                    {campaign.platform} • {campaign.type} • {campaign.goal}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Quality Score:</span>
                  <span className="font-semibold">{data[data.length - 1]?.qualityScore}/10</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Performance Insights</h3>
                <div className="space-y-2">
                  {insights.map((insight, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{insight}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
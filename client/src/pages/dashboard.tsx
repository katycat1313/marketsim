import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateSimulationFactors, generateSimulationData } from "@/lib/simulation";
import { apiRequest } from "@/lib/queryClient";

interface Campaign {
  id: number;
  name: string;
  // Add other campaign properties as needed
}

interface SimulationData {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  date: string;
}

export default function Dashboard() {
  const [, navigate] = useLocation();

  const { data: campaigns = [], isLoading: loadingCampaigns } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
    initialData: [],
  });

  const simulationQueries = useQuery<Array<{ campaign: Campaign; data: SimulationData[] }>>({
    queryKey: ["simulation-data"],
    queryFn: async () => {
      if (!campaigns.length) return [];

      // For each campaign, get simulation data and generate new data point
      const allData = await Promise.all(
        campaigns.map(async (campaign) => {
          const factors = calculateSimulationFactors(campaign);
          const newData = generateSimulationData(campaign, factors);

          // Add new simulation data point
          await apiRequest("POST", "/api/simulation-data", {
            campaignId: campaign.id,
            ...newData,
          });

          // Get all simulation data for campaign
          const response = await fetch(`/api/campaigns/${campaign.id}/simulation`);
          const data = await response.json();
          return { campaign, data };
        })
      );

      return allData;
    },
    enabled: campaigns.length > 0,
    refetchInterval: 5000, // Refresh every 5 seconds
    initialData: [],
  });

  if (loadingCampaigns || simulationQueries.isLoading) {
    return <Skeleton className="h-screen w-full" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid gap-6">
        {simulationQueries.data.map(({ campaign, data }) => (
          <Card key={campaign.id}>
            <CardHeader>
              <CardTitle>{campaign.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">Impressions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {data[data.length - 1]?.impressions.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {data[data.length - 1]?.clicks.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">Conversions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {data[data.length - 1]?.conversions.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      ${data[data.length - 1]?.cost.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Line
                      type="monotone"
                      dataKey="impressions"
                      stroke="hsl(var(--primary))"
                      name="Impressions"
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="hsl(var(--chart-2))"
                      name="Clicks"
                    />
                    <Line
                      type="monotone"
                      dataKey="conversions"
                      stroke="hsl(var(--chart-3))"
                      name="Conversions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
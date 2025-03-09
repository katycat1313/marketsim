import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateSimulationFactors, generateSimulationData, getPerformanceInsights } from "@/lib/simulation";
import { apiRequest } from "@/lib/queryClient";

interface Campaign {
  id: number;
  name: string;
  type: string;
  platform: string;
  goal: string;
  dailyBudget: string;
  keywords: Array<{ text: string; matchType: string }>;
  targeting: {
    locations: string[];
    languages: string[];
    devices: string[];
    demographics: {
      ageRanges: string[];
      genders: string[];
      householdIncomes: string[];
    };
  };
  adHeadlines: string[];
  adDescriptions: string[];
  finalUrl: string;
  status: string;
}

interface SimulationData {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: string;
  cpc: string;
  conversionRate: string;
  cpa: string;
  qualityScore: number;
  averagePosition: string;
  date: string;
}

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

  const prepareConversionData = (data: SimulationData) => [
    { name: 'Clicks', value: data.clicks },
    { name: 'Conversions', value: data.conversions },
    { name: 'Bounces', value: data.clicks - data.conversions },
  ];

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
                  <span className="font-semibold">
                    {data[data.length - 1]?.qualityScore}/10
                  </span>
                </div>
              </div>
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
                    <CardTitle className="text-sm">CTR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {data[data.length - 1]?.ctr}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {data[data.length - 1]?.conversionRate}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">Cost Per Conversion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {data[data.length - 1]?.cpa}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Insights */}
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

              <Tabs defaultValue="trends" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="trends">Performance Trends</TabsTrigger>
                  <TabsTrigger value="conversion">Conversion Funnel</TabsTrigger>
                  <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="trends">
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
                          stroke="hsl(var(--secondary))"
                          name="Clicks"
                        />
                        <Line
                          type="monotone"
                          dataKey="conversions"
                          stroke="hsl(var(--accent))"
                          name="Conversions"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="conversion">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareConversionData(data[data.length - 1])}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {prepareConversionData(data[data.length - 1]).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="costs">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <Bar dataKey="cost" fill="hsl(var(--primary))" name="Cost" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
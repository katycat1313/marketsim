import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Share2, Download, Bookmark, Award, FileText, BarChart2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock data sets - these would be fetched from the server in production
const SAMPLE_DATASETS = {
  ecommerce: {
    name: "E-Commerce Performance",
    description: "Sales data for an online retailer over 12 months",
    timeframe: "Monthly",
    metrics: ["revenue", "orders", "conversion_rate", "avg_order_value"],
    data: [
      { name: "Jan", revenue: 45000, orders: 1200, conversion_rate: 3.2, avg_order_value: 37.5, visitors: 37500 },
      { name: "Feb", revenue: 52000, orders: 1350, conversion_rate: 3.4, avg_order_value: 38.5, visitors: 39706 },
      { name: "Mar", revenue: 49000, orders: 1280, conversion_rate: 3.1, avg_order_value: 38.3, visitors: 41290 },
      { name: "Apr", revenue: 58000, orders: 1450, conversion_rate: 3.6, avg_order_value: 40.0, visitors: 40278 },
      { name: "May", revenue: 61000, orders: 1520, conversion_rate: 3.7, avg_order_value: 40.1, visitors: 41081 },
      { name: "Jun", revenue: 67000, orders: 1650, conversion_rate: 3.9, avg_order_value: 40.6, visitors: 42308 },
      { name: "Jul", revenue: 72000, orders: 1750, conversion_rate: 4.1, avg_order_value: 41.1, visitors: 42683 },
      { name: "Aug", revenue: 68000, orders: 1680, conversion_rate: 3.9, avg_order_value: 40.5, visitors: 43077 },
      { name: "Sep", revenue: 73000, orders: 1800, conversion_rate: 4.2, avg_order_value: 40.6, visitors: 42857 },
      { name: "Oct", revenue: 80000, orders: 1950, conversion_rate: 4.4, avg_order_value: 41.0, visitors: 44318 },
      { name: "Nov", revenue: 95000, orders: 2300, conversion_rate: 4.8, avg_order_value: 41.3, visitors: 47917 },
      { name: "Dec", revenue: 110000, orders: 2650, conversion_rate: 5.1, avg_order_value: 41.5, visitors: 51961 },
    ],
  },
  
  adPerformance: {
    name: "Advertising Campaigns",
    description: "Performance metrics for various ad campaigns",
    timeframe: "Campaign",
    metrics: ["impressions", "clicks", "ctr", "conversions", "cost", "cpa"],
    data: [
      { name: "Search Campaign 1", impressions: 25000, clicks: 750, ctr: 3.0, conversions: 45, cost: 1500, cpa: 33.33, roas: 2.1 },
      { name: "Search Campaign 2", impressions: 32000, clicks: 960, ctr: 3.0, conversions: 72, cost: 1920, cpa: 26.67, roas: 2.6 },
      { name: "Display Campaign 1", impressions: 85000, clicks: 1275, ctr: 1.5, conversions: 51, cost: 1275, cpa: 25.00, roas: 2.8 },
      { name: "Display Campaign 2", impressions: 95000, clicks: 1425, ctr: 1.5, conversions: 28, cost: 1425, cpa: 50.89, roas: 1.4 },
      { name: "Social Campaign 1", impressions: 65000, clicks: 1950, ctr: 3.0, conversions: 97, cost: 2925, cpa: 30.15, roas: 2.3 },
      { name: "Social Campaign 2", impressions: 75000, clicks: 2250, ctr: 3.0, conversions: 112, cost: 3375, cpa: 30.13, roas: 2.3 },
      { name: "Video Campaign 1", impressions: 45000, clicks: 900, ctr: 2.0, conversions: 27, cost: 1800, cpa: 66.67, roas: 1.0 },
      { name: "Video Campaign 2", impressions: 55000, clicks: 1100, ctr: 2.0, conversions: 33, cost: 2200, cpa: 66.67, roas: 1.1 },
      { name: "Retargeting Campaign", impressions: 15000, clicks: 750, ctr: 5.0, conversions: 75, cost: 1500, cpa: 20.00, roas: 3.5 },
    ],
  },
  
  customerSegments: {
    name: "Customer Segments",
    description: "Analysis of customer segments by various attributes",
    timeframe: "Segment",
    metrics: ["customers", "ltv", "purchase_frequency", "avg_order_value"],
    data: [
      { name: "New Customers", customers: 2500, ltv: 120, purchase_frequency: 1.2, avg_order_value: 35, churn_rate: 65 },
      { name: "Occasional", customers: 3500, ltv: 350, purchase_frequency: 3.5, avg_order_value: 37, churn_rate: 40 },
      { name: "Regular", customers: 2800, ltv: 840, purchase_frequency: 8.4, avg_order_value: 42, churn_rate: 20 },
      { name: "Loyal", customers: 1200, ltv: 1250, purchase_frequency: 12.5, avg_order_value: 45, churn_rate: 8 },
      { name: "VIP", customers: 450, ltv: 3600, purchase_frequency: 24.0, avg_order_value: 65, churn_rate: 5 },
    ],
  },
  
  channelAttribution: {
    name: "Marketing Channel Attribution",
    description: "Attribution of conversions across marketing channels",
    timeframe: "Channel",
    metrics: ["sessions", "conversions", "revenue", "conv_rate"],
    data: [
      { name: "Organic Search", sessions: 25000, conversions: 750, revenue: 37500, conv_rate: 3.0, avg_order: 50 },
      { name: "Paid Search", sessions: 15000, conversions: 600, revenue: 33000, conv_rate: 4.0, avg_order: 55 },
      { name: "Social Media", sessions: 18000, conversions: 450, revenue: 22500, conv_rate: 2.5, avg_order: 50 },
      { name: "Email", sessions: 8000, conversions: 480, revenue: 26400, conv_rate: 6.0, avg_order: 55 },
      { name: "Direct", sessions: 12000, conversions: 360, revenue: 19800, conv_rate: 3.0, avg_order: 55 },
      { name: "Referral", sessions: 6000, conversions: 210, revenue: 11550, conv_rate: 3.5, avg_order: 55 },
      { name: "Display", sessions: 10000, conversions: 200, revenue: 10000, conv_rate: 2.0, avg_order: 50 },
      { name: "Affiliate", sessions: 5000, conversions: 175, revenue: 9625, conv_rate: 3.5, avg_order: 55 },
    ],
  },
};

const chartColors = [
  "#ffd700", // Gold (primary)
  "#4F46E5", // Indigo
  "#10B981", // Emerald
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#3B82F6", // Blue
];

// Challenge Scenarios
const CHALLENGE_SCENARIOS = [
  {
    id: 1,
    title: "E-Commerce Performance Analysis",
    description: "Analyze the e-commerce performance data to identify seasonal trends and provide recommendations to maximize revenue.",
    dataset: "ecommerce",
    objectives: [
      "Create a line chart showing revenue trends over time",
      "Build a bar chart comparing monthly orders",
      "Analyze the correlation between visits and conversion rate using a scatter plot",
      "Provide 3 actionable recommendations based on your analysis"
    ],
    tips: [
      "Look for patterns in seasonal revenue spikes",
      "Compare conversion rates to identify opportunities",
      "Consider how average order value relates to overall revenue"
    ],
    successCriteria: [
      "Created appropriate visualizations that reveal insights",
      "Identified key trends in the data",
      "Provided data-backed recommendations"
    ]
  },
  {
    id: 2,
    title: "Ad Campaign Optimization",
    description: "Evaluate various advertising campaigns to determine which ones provide the best return on investment (ROI).",
    dataset: "adPerformance",
    objectives: [
      "Create a bar chart comparing Cost Per Acquisition (CPA) across campaigns",
      "Build a scatter plot showing the relationship between CTR and conversion rate",
      "Create a visualization to compare ROAS across campaigns",
      "Recommend which campaigns to scale and which to optimize or pause"
    ],
    tips: [
      "Lower CPA generally indicates better campaign efficiency",
      "Look for campaigns with high CTR but low conversion rates for optimization",
      "ROAS greater than 2.0 typically indicates a profitable campaign"
    ],
    successCriteria: [
      "Created visualizations that effectively compare campaign performance",
      "Identified high-performing and underperforming campaigns",
      "Provided specific, data-driven recommendations for optimization"
    ]
  },
  {
    id: 3,
    title: "Customer Segmentation Strategy",
    description: "Analyze customer segment data to develop targeted marketing strategies for different customer groups.",
    dataset: "customerSegments",
    objectives: [
      "Create a bar chart comparing Lifetime Value (LTV) across segments",
      "Build a scatter plot showing the relationship between purchase frequency and churn rate",
      "Create a visualization to highlight differences in average order value",
      "Develop targeted strategies for at least 3 customer segments"
    ],
    tips: [
      "Focus retention efforts on high-value segments with concerning churn rates",
      "Consider upselling strategies for segments with high purchase frequency",
      "Look for opportunities to move customers up from one segment to another"
    ],
    successCriteria: [
      "Created insightful visualizations that highlight segment differences",
      "Identified key opportunities within specific segments",
      "Developed segment-specific strategies based on the data"
    ]
  },
  {
    id: 4,
    title: "Marketing Channel Allocation",
    description: "Analyze performance across marketing channels to optimize budget allocation and improve overall ROI.",
    dataset: "channelAttribution",
    objectives: [
      "Create a bar chart comparing conversion rates across channels",
      "Build a visualization showing revenue contribution by channel",
      "Create a scatter plot examining the relationship between sessions and conversions",
      "Provide recommendations for budget reallocation across channels"
    ],
    tips: [
      "High conversion rate channels often deserve more investment",
      "Consider both conversion volume and value when assessing channels",
      "Look for channels with high traffic but low conversion rates for optimization"
    ],
    successCriteria: [
      "Created effective visualizations that reveal channel performance differences",
      "Identified high-value and underperforming channels",
      "Provided specific budget allocation recommendations based on the data"
    ]
  }
];

// Form schemas
const visualizationFormSchema = z.object({
  chartType: z.string(),
  dataSet: z.string(),
  xAxis: z.string(),
  yAxis: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

const recommendationFormSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string().min(1, "Recommendation title is required"),
      description: z.string().min(1, "Recommendation details are required"),
      expectedImpact: z.string().min(1, "Expected impact is required"),
    })
  ).min(1, "At least one recommendation is required"),
});

// Types
interface ChartConfig {
  id: string;
  type: "line" | "bar" | "scatter" | "area" | "pie";
  title: string;
  description?: string;
  dataSet: string;
  xAxis: string;
  yAxis: string;
  color?: string;
}

interface Recommendation {
  title: string;
  description: string;
  expectedImpact: string;
}

interface SimulationAttempt {
  id?: number;
  userId: number;
  scenarioId: number;
  charts: ChartConfig[];
  recommendations: Recommendation[];
  score?: number;
  feedback?: string[];
  completedAt?: string;
  addedToPortfolio?: boolean;
}

interface PortfolioEntry {
  id: string;
  title: string;
  description: string;
  charts: ChartConfig[];
  recommendations: Recommendation[];
  createdAt: string;
  skillsShown: string[];
  visibility: 'private' | 'public';
}

export default function DataVisualizationPage() {
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<"instructions" | "build" | "submit" | "feedback">("instructions");
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([{ title: "", description: "", expectedImpact: "" }]);
  const [currentDataset, setCurrentDataset] = useState<string>("ecommerce");
  const [attemptResult, setAttemptResult] = useState<{score: number, feedback: string[]}>({ score: 0, feedback: [] });
  const [showPortfolioDialog, setShowPortfolioDialog] = useState(false);
  const [portfolioEntry, setPortfolioEntry] = useState<Partial<PortfolioEntry>>({
    title: "",
    description: "",
    skillsShown: [],
    visibility: "private"
  });
  const { toast } = useToast();

  // Fetch challenges
  const { data: challenges, isLoading: isLoadingChallenges } = useQuery({
    queryKey: ["/api/data-visualization/challenges"],
    refetchOnWindowFocus: false,
    // In a real implementation, we would fetch from the server
    // For now, we'll return the mock data directly
    initialData: CHALLENGE_SCENARIOS
  });

  // Fetch user's previous attempts
  const { data: userAttempts, isLoading: isLoadingAttempts } = useQuery({
    queryKey: ["/api/data-visualization/attempts"],
    refetchOnWindowFocus: false,
    // Mock data for development
    initialData: [] as SimulationAttempt[]
  });

  // Chart creation form
  const chartForm = useForm<z.infer<typeof visualizationFormSchema>>({
    resolver: zodResolver(visualizationFormSchema),
    defaultValues: {
      chartType: "line",
      dataSet: currentDataset,
      xAxis: "name",
      yAxis: "",
      title: "",
      description: "",
    },
  });

  // Recommendation form
  const recommendationForm = useForm({
    defaultValues: {
      recommendations: recommendations,
    },
  });

  useEffect(() => {
    if (currentDataset) {
      chartForm.setValue("dataSet", currentDataset);
      const dataset = SAMPLE_DATASETS[currentDataset as keyof typeof SAMPLE_DATASETS];
      if (dataset && dataset.metrics.length > 0) {
        chartForm.setValue("yAxis", dataset.metrics[0]);
      }
    }
  }, [currentDataset, chartForm]);

  const handleSelectChallenge = (challengeId: number) => {
    setActiveChallenge(challengeId);
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setCurrentDataset(challenge.dataset);
      setCurrentStep("instructions");
      // Reset charts and recommendations
      setCharts([]);
      setRecommendations([{ title: "", description: "", expectedImpact: "" }]);
    }
  };

  const handleStartChallenge = () => {
    setCurrentStep("build");
  };

  const handleAddChart = (data: z.infer<typeof visualizationFormSchema>) => {
    const newChart: ChartConfig = {
      id: `chart-${charts.length + 1}`,
      type: data.chartType as "line" | "bar" | "scatter" | "area" | "pie",
      title: data.title,
      description: data.description,
      dataSet: data.dataSet,
      xAxis: data.xAxis,
      yAxis: data.yAxis,
      color: chartColors[charts.length % chartColors.length],
    };
    
    setCharts([...charts, newChart]);
    
    // Reset form for next chart
    chartForm.reset({
      chartType: "line",
      dataSet: currentDataset,
      xAxis: "name",
      yAxis: "",
      title: "",
      description: "",
    });
    
    toast({
      title: "Chart created",
      description: "Your visualization has been added to your analysis",
    });
  };

  const handleUpdateRecommendation = (index: number, field: keyof Recommendation, value: string) => {
    const updatedRecommendations = [...recommendations];
    updatedRecommendations[index] = { ...updatedRecommendations[index], [field]: value };
    setRecommendations(updatedRecommendations);
  };

  const handleAddRecommendation = () => {
    setRecommendations([...recommendations, { title: "", description: "", expectedImpact: "" }]);
  };

  const handleRemoveRecommendation = (index: number) => {
    if (recommendations.length > 1) {
      setRecommendations(recommendations.filter((_, i) => i !== index));
    }
  };

  const handleRemoveChart = (chartId: string) => {
    setCharts(charts.filter(chart => chart.id !== chartId));
    toast({
      title: "Chart removed",
      description: "The visualization has been removed from your analysis",
    });
  };

  const handleSubmitAnalysis = async () => {
    // Validation checks
    if (charts.length < 2) {
      toast({
        title: "More visualizations needed",
        description: "Please create at least 2 different visualizations for your analysis",
        variant: "destructive",
      });
      return;
    }

    if (!recommendations.every(r => r.title && r.description && r.expectedImpact)) {
      toast({
        title: "Complete all recommendations",
        description: "Please fill out all fields for your recommendations",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, we would send the data to the server for evaluation
    // For now, we'll simulate a successful submission
    setCurrentStep("submit");
    
    // Simulate API call with a delay
    setTimeout(() => {
      // Generate a score and feedback based on the submission
      const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
      const feedback = [
        "Great job identifying the seasonal trends in the data!",
        "Your recommendations are well-supported by the visualizations you created.",
        "Consider exploring additional metrics to strengthen your analysis next time."
      ];
      
      setAttemptResult({ score, feedback });
      setCurrentStep("feedback");
    }, 2000);
  };

  const handleReset = () => {
    setActiveChallenge(null);
    setCurrentStep("instructions");
    setCharts([]);
    setRecommendations([{ title: "", description: "", expectedImpact: "" }]);
  };
  
  const handleOpenPortfolioDialog = () => {
    if (currentChallenge) {
      setPortfolioEntry({
        ...portfolioEntry,
        title: `${currentChallenge.title} Analysis`,
        description: `My data visualization analysis of ${currentChallenge.title.toLowerCase()}`
      });
    }
    setShowPortfolioDialog(true);
  };
  
  const handleSaveToPortfolio = async () => {
    if (!portfolioEntry.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your portfolio entry",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would be sent to the server
    const newPortfolioEntry: PortfolioEntry = {
      id: `portfolio-${Date.now()}`,
      title: portfolioEntry.title || "",
      description: portfolioEntry.description || "",
      charts: charts,
      recommendations: recommendations,
      createdAt: new Date().toISOString(),
      skillsShown: portfolioEntry.skillsShown || [],
      visibility: portfolioEntry.visibility as 'private' | 'public'
    };
    
    // Here we would save to the server API
    // For now, we'll just show success toast
    toast({
      title: "Added to portfolio!",
      description: "Your analysis has been saved to your portfolio and can be shared with potential employers.",
    });
    
    setShowPortfolioDialog(false);
  };

  const currentChallenge = activeChallenge ? challenges.find(c => c.id === activeChallenge) : null;
  const dataset = currentDataset ? SAMPLE_DATASETS[currentDataset as keyof typeof SAMPLE_DATASETS] : null;

  const renderChart = (chart: ChartConfig) => {
    const dataset = SAMPLE_DATASETS[chart.dataSet as keyof typeof SAMPLE_DATASETS];
    const data = dataset ? dataset.data : [];

    switch (chart.type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={chart.xAxis} stroke="#f5f5f5" />
              <YAxis stroke="#f5f5f5" />
              <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#ffd700", color: "#f5f5f5" }} />
              <Legend wrapperStyle={{ color: "#f5f5f5" }} />
              <Line type="monotone" dataKey={chart.yAxis} stroke={chart.color || "#ffd700"} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={chart.xAxis} stroke="#f5f5f5" />
              <YAxis stroke="#f5f5f5" />
              <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#ffd700", color: "#f5f5f5" }} />
              <Legend wrapperStyle={{ color: "#f5f5f5" }} />
              <Bar dataKey={chart.yAxis} fill={chart.color || "#ffd700"} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={chart.xAxis} name={chart.xAxis} stroke="#f5f5f5" />
              <YAxis dataKey={chart.yAxis} name={chart.yAxis} stroke="#f5f5f5" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "#222", borderColor: "#ffd700", color: "#f5f5f5" }} />
              <Scatter name={chart.title} data={data} fill={chart.color || "#ffd700"} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return <div>Chart type not supported</div>;
    }
  };

  // Render challenge selection
  if (!activeChallenge) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#ffd700] mb-2">Data Visualization Lab</h1>
          <p className="text-[#f5f5f5] mb-4">Build charts and graphs to analyze marketing data and make data-driven decisions</p>
          <Separator className="my-4 bg-[#ffd700]/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {challenges.map((challenge) => (
            <Card 
              key={challenge.id} 
              className="bg-[#111]/60 border border-[#ffd700]/20 hover:border-[#ffd700]/50 transition-all cursor-pointer"
              onClick={() => handleSelectChallenge(challenge.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/30">
                    {challenge.dataset === 'ecommerce' ? 'E-Commerce' : 
                     challenge.dataset === 'adPerformance' ? 'Advertising' :
                     challenge.dataset === 'customerSegments' ? 'Customer Data' : 'Marketing'}
                  </Badge>
                  <Badge variant="outline" className="bg-[#222] text-[#f5f5f5] border-[#444]">
                    Level {challenge.id}
                  </Badge>
                </div>
                <CardTitle className="text-[#ffd700]">{challenge.title}</CardTitle>
                <CardDescription className="text-[#f5f5f5]/80">{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-[#f5f5f5]/70 mb-3">Objectives:</div>
                <ul className="space-y-2 text-sm text-[#f5f5f5]">
                  {challenge.objectives.slice(0, 2).map((objective, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-[#ffd700] mr-2">•</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                  {challenge.objectives.length > 2 && (
                    <li className="flex items-start text-[#f5f5f5]/50">
                      <span className="text-[#ffd700]/50 mr-2">•</span>
                      <span>+{challenge.objectives.length - 2} more objectives</span>
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2 border-t border-[#ffd700]/10">
                <div className="text-sm text-[#f5f5f5]/60">
                  {userAttempts?.some(a => a.scenarioId === challenge.id) ? (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Attempted
                    </span>
                  ) : "Not attempted"}
                </div>
                <Button size="sm" variant="default" className="bg-[#ffd700] text-black hover:bg-[#e6c200]">
                  Select Challenge
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Render active challenge
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#ffd700]">{currentChallenge?.title}</h1>
          <p className="text-[#f5f5f5]/80 mt-1">{currentChallenge?.description}</p>
        </div>
        <Button variant="outline" onClick={handleReset} className="border-[#ffd700]/30 text-[#f5f5f5] hover:bg-[#ffd700]/10">
          ← Back to Challenges
        </Button>
      </div>
      
      <Separator className="my-4 bg-[#ffd700]/20" />

      {currentStep === "instructions" && (
        <div className="bg-[#111]/60 border border-[#ffd700]/20 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#ffd700] mb-4">Challenge Instructions</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#ffd700]/90 mb-2">Objectives</h3>
            <ul className="space-y-2 text-[#f5f5f5]">
              {currentChallenge?.objectives.map((objective, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-[#ffd700] mr-2">{i+1}.</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#ffd700]/90 mb-2">Dataset: {dataset?.name}</h3>
            <p className="text-[#f5f5f5]/80 mb-3">{dataset?.description}</p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 bg-[#222] text-[#ffd700] border border-[#444]">Metric</th>
                    <th className="text-left py-2 px-3 bg-[#222] text-[#ffd700] border border-[#444]">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset?.metrics.map((metric, i) => (
                    <tr key={i} className="border-b border-[#333]">
                      <td className="py-2 px-3 text-[#ffd700] border border-[#444]">
                        {metric === 'revenue' ? 'Revenue ($)' :
                         metric === 'orders' ? 'Orders' :
                         metric === 'conversion_rate' ? 'Conversion Rate (%)' :
                         metric === 'avg_order_value' ? 'Avg. Order Value ($)' :
                         metric === 'visitors' ? 'Visitors' :
                         metric === 'impressions' ? 'Impressions' :
                         metric === 'clicks' ? 'Clicks' :
                         metric === 'ctr' ? 'Click-Through Rate (%)' :
                         metric === 'conversions' ? 'Conversions' :
                         metric === 'cost' ? 'Cost ($)' :
                         metric === 'cpa' ? 'Cost Per Acquisition ($)' :
                         metric === 'roas' ? 'Return On Ad Spend' :
                         metric === 'customers' ? 'Customers' :
                         metric === 'ltv' ? 'Lifetime Value ($)' :
                         metric === 'purchase_frequency' ? 'Purchase Frequency' :
                         metric === 'churn_rate' ? 'Churn Rate (%)' :
                         metric === 'sessions' ? 'Sessions' :
                         metric === 'conv_rate' ? 'Conversion Rate (%)' :
                         metric}
                      </td>
                      <td className="py-2 px-3 text-[#f5f5f5] border border-[#444]">
                        {metric === 'revenue' ? 'Total sales revenue' :
                         metric === 'orders' ? 'Total number of orders placed' :
                         metric === 'conversion_rate' ? 'Percentage of visitors who made a purchase' :
                         metric === 'avg_order_value' ? 'Average amount spent per order' :
                         metric === 'visitors' ? 'Total number of site visitors' :
                         metric === 'impressions' ? 'Number of times ads were shown' :
                         metric === 'clicks' ? 'Number of clicks on ads' :
                         metric === 'ctr' ? 'Percentage of impressions that resulted in clicks' :
                         metric === 'conversions' ? 'Number of desired actions completed' :
                         metric === 'cost' ? 'Total cost of advertising' :
                         metric === 'cpa' ? 'Average cost to acquire a conversion' :
                         metric === 'roas' ? 'Revenue generated per dollar spent on ads' :
                         metric === 'customers' ? 'Number of customers in segment' :
                         metric === 'ltv' ? 'Average lifetime value of customers in segment' :
                         metric === 'purchase_frequency' ? 'Average purchases per customer' :
                         metric === 'churn_rate' ? 'Percentage of customers who do not return' :
                         metric === 'sessions' ? 'Number of visits to the website' :
                         metric === 'conv_rate' ? 'Percentage of sessions resulting in conversion' :
                         'Description unavailable'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#ffd700]/90 mb-2">Tips for Success</h3>
            <ul className="space-y-2 text-[#f5f5f5]">
              {currentChallenge?.tips.map((tip, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-[#ffd700] mr-2">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            onClick={handleStartChallenge} 
            className="bg-[#ffd700] text-black hover:bg-[#e6c200]"
          >
            Start Challenge
          </Button>
          
          {/* Debug button */}
          <div className="mt-4 text-xs text-gray-400">
            If the Start Challenge button isn't working, click the debug button below:
            <Button 
              onClick={() => setCurrentStep("build")} 
              className="mt-2 bg-gray-700 text-gray-200 hover:bg-gray-600 text-xs"
              size="sm"
            >
              Debug: Go to Build Mode
            </Button>
          </div>
        </div>
      )}
      
      {currentStep === "build" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-6">
            {/* Assignment Details Card */}
            <Card className="bg-[#111]/80 border border-[#ffd700]/20 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#ffd700] flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Assignment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <h3 className="text-md font-medium text-[#ffd700]/90 mb-1">Objectives</h3>
                  <ul className="space-y-1 text-[#f5f5f5] text-sm">
                    {currentChallenge?.objectives.map((objective, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-[#ffd700] mr-2">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-3">
                  <h3 className="text-md font-medium text-[#ffd700]/90 mb-1">Success Criteria</h3>
                  <ul className="space-y-1 text-[#f5f5f5] text-sm">
                    {currentChallenge?.successCriteria.map((criteria, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-[#ffd700] mr-2">•</span>
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Chart Creation Card */}
            <Card className="bg-[#111]/60 border border-[#ffd700]/20">
              <CardHeader>
                <CardTitle className="text-[#ffd700]">Create Visualization</CardTitle>
                <CardDescription className="text-[#f5f5f5]/70">
                  Build charts to analyze the data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...chartForm}>
                  <form onSubmit={chartForm.handleSubmit(handleAddChart)} className="space-y-4">
                    <FormField
                      control={chartForm.control}
                      name="chartType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#ffd700]">Chart Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#222] border-[#444] text-[#f5f5f5]">
                                <SelectValue placeholder="Select chart type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#222] border-[#444] text-[#f5f5f5]">
                              <SelectItem value="line">Line Chart</SelectItem>
                              <SelectItem value="bar">Bar Chart</SelectItem>
                              <SelectItem value="scatter">Scatter Plot</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-[#f5f5f5]/50">
                            Choose the best chart type for your data
                          </FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={chartForm.control}
                      name="dataSet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#ffd700]">Dataset</FormLabel>
                          <FormControl>
                            <Input {...field} disabled className="bg-[#333] border-[#444] text-[#f5f5f5]" />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={chartForm.control}
                      name="xAxis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#ffd700]">X-Axis</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#222] border-[#444] text-[#f5f5f5]">
                                <SelectValue placeholder="Select x-axis" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#222] border-[#444] text-[#f5f5f5]">
                              <SelectItem value="name">Name/Label</SelectItem>
                              {dataset?.metrics.map((metric) => (
                                <SelectItem key={metric} value={metric}>{metric.replace('_', ' ')}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={chartForm.control}
                      name="yAxis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#ffd700]">Y-Axis</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#222] border-[#444] text-[#f5f5f5]">
                                <SelectValue placeholder="Select y-axis" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#222] border-[#444] text-[#f5f5f5]">
                              {dataset?.metrics.map((metric) => (
                                <SelectItem key={metric} value={metric}>
                                  {metric.replace('_', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={chartForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#ffd700]">Chart Title</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter a descriptive title" 
                              className="bg-[#222] border-[#444] text-[#f5f5f5]" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={chartForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#ffd700]">Description (optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="What insights does this chart show?" 
                              className="bg-[#222] border-[#444] text-[#f5f5f5]" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="bg-[#ffd700] text-black hover:bg-[#e6c200] w-full">
                      Add Visualization
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card className="bg-[#111]/60 border border-[#ffd700]/20">
              <CardHeader>
                <CardTitle className="text-[#ffd700]">Recommendations</CardTitle>
                <CardDescription className="text-[#f5f5f5]/70">
                  Based on your analysis, provide data-driven recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-[#222] rounded-md border border-[#444]">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-[#ffd700] font-medium">Recommendation {index + 1}</h4>
                        {recommendations.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveRecommendation(index)}
                            className="h-6 p-0 text-[#f5f5f5]/60 hover:text-red-400"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-[#ffd700]/80 mb-1">Title</label>
                          <Input
                            value={rec.title}
                            onChange={(e) => handleUpdateRecommendation(index, 'title', e.target.value)}
                            placeholder="Enter recommendation title"
                            className="bg-[#333] border-[#444] text-[#f5f5f5]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-[#ffd700]/80 mb-1">Description</label>
                          <textarea
                            value={rec.description}
                            onChange={(e) => handleUpdateRecommendation(index, 'description', e.target.value)}
                            placeholder="Explain your recommendation in detail"
                            className="w-full p-2 bg-[#333] border border-[#444] rounded text-[#f5f5f5] min-h-[80px]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-[#ffd700]/80 mb-1">Expected Impact</label>
                          <Input
                            value={rec.expectedImpact}
                            onChange={(e) => handleUpdateRecommendation(index, 'expectedImpact', e.target.value)}
                            placeholder="What results do you expect?"
                            className="bg-[#333] border-[#444] text-[#f5f5f5]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleAddRecommendation}
                    className="w-full border-dashed border-[#ffd700]/30 text-[#ffd700] hover:bg-[#ffd700]/10"
                  >
                    + Add Another Recommendation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <Card className="bg-[#111]/60 border border-[#ffd700]/20">
              <CardHeader>
                <CardTitle className="text-[#ffd700]">Data Analysis</CardTitle>
                <CardDescription className="text-[#f5f5f5]/70">
                  Your visualizations and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {charts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[#ffd700]/20 rounded-md">
                    <div className="text-4xl mb-3">📊</div>
                    <h3 className="text-lg font-medium text-[#ffd700] mb-2">No visualizations yet</h3>
                    <p className="text-[#f5f5f5]/60 max-w-md mx-auto">
                      Create your first chart or graph using the form on the left to begin your data analysis
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {charts.map((chart, index) => (
                      <div key={chart.id} className="p-4 bg-[#222] rounded-md border border-[#444]">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-[#ffd700]">{chart.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveChart(chart.id)}
                            className="text-[#f5f5f5]/60 hover:text-red-400"
                          >
                            Remove
                          </Button>
                        </div>
                        
                        {chart.description && (
                          <p className="text-[#f5f5f5]/80 mb-4">{chart.description}</p>
                        )}
                        
                        <div className="mt-4">
                          {renderChart(chart)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-[#ffd700]/20 pt-4">
                <Button 
                  onClick={handleSubmitAnalysis}
                  disabled={charts.length === 0 || !recommendations[0].title}
                  className="ml-auto bg-[#ffd700] text-black hover:bg-[#e6c200]"
                >
                  Submit Analysis
                </Button>
              </CardFooter>
            </Card>
            
            <Accordion type="single" collapsible className="bg-[#111]/60 border border-[#ffd700]/20 rounded-lg overflow-hidden">
              <AccordionItem value="objectives">
                <AccordionTrigger className="px-6 py-4 text-[#ffd700] hover:bg-[#ffd700]/5">
                  Challenge Objectives
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 bg-[#222]">
                  <ul className="space-y-2 text-[#f5f5f5]">
                    {currentChallenge?.objectives.map((objective, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-[#ffd700] mr-2">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="dataSample">
                <AccordionTrigger className="px-6 py-4 text-[#ffd700] hover:bg-[#ffd700]/5">
                  Data Sample
                </AccordionTrigger>
                <AccordionContent className="bg-[#222]">
                  <div className="overflow-x-auto px-6 pb-4">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          {dataset && dataset.data[0] && Object.keys(dataset.data[0]).map((key) => (
                            <th key={key} className="text-left py-2 px-3 bg-[#333] text-[#ffd700] border border-[#444]">
                              {key.replace('_', ' ')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dataset && dataset.data.slice(0, 5).map((item, i) => (
                          <tr key={i} className="border-b border-[#333]">
                            {Object.values(item).map((value, j) => (
                              <td key={j} className="py-2 px-3 text-[#f5f5f5] border border-[#444]">
                                {typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2) : value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {dataset && dataset.data.length > 5 && (
                      <div className="text-center mt-2 text-sm text-[#f5f5f5]/60">
                        Showing 5 of {dataset.data.length} data points
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tips">
                <AccordionTrigger className="px-6 py-4 text-[#ffd700] hover:bg-[#ffd700]/5">
                  Tips for Success
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 bg-[#222]">
                  <ul className="space-y-2 text-[#f5f5f5]">
                    {currentChallenge?.tips.map((tip, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-[#ffd700] mr-2">💡</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
      
      {currentStep === "submit" && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block p-6 bg-[#ffd700]/10 rounded-full mb-4">
              <div className="w-16 h-16 border-4 border-t-[#ffd700] border-r-[#ffd700]/30 border-b-[#ffd700]/30 border-l-[#ffd700]/30 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-[#ffd700] mb-2">Evaluating Your Analysis</h2>
            <p className="text-[#f5f5f5]/70">Please wait while we process your submission...</p>
          </div>
        </div>
      )}
      
      {currentStep === "feedback" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card className="bg-[#111]/60 border border-[#ffd700]/20">
              <CardHeader>
                <CardTitle className="text-[#ffd700]">Performance Score</CardTitle>
                <CardDescription className="text-[#f5f5f5]/70">
                  Your analysis has been evaluated
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="inline-block relative w-48 h-48 mb-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#333"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={
                        attemptResult.score >= 90 ? "#10B981" :
                        attemptResult.score >= 70 ? "#ffd700" :
                        "#DC2626"
                      }
                      strokeWidth="10"
                      strokeDasharray={`${(attemptResult.score / 100) * 283} 283`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-[#ffd700]">{attemptResult.score}</span>
                    <span className="text-sm text-[#f5f5f5]/70">out of 100</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Badge variant="outline" className={`
                    ${attemptResult.score >= 90 ? 'bg-green-900/20 text-green-400 border-green-700/30' :
                      attemptResult.score >= 70 ? 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/30' :
                      'bg-red-900/20 text-red-400 border-red-700/30'}
                  `}>
                    {attemptResult.score >= 90 ? 'Expert Analysis' :
                     attemptResult.score >= 70 ? 'Proficient Analysis' :
                     'Needs Improvement'}
                  </Badge>
                </div>
              </CardContent>
              <div className="px-6 pb-6">
                <Button onClick={handleReset} className="w-full bg-[#ffd700] text-black hover:bg-[#e6c200]">
                  Return to Challenges
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <Card className="bg-[#111]/60 border border-[#ffd700]/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#ffd700]">Feedback</CardTitle>
                  <CardDescription className="text-[#f5f5f5]/70">
                    Review your performance and learn how to improve
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    // Generate a simple unique ID using timestamp and random number
                    const generateId = () => `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
                    
                    setPortfolioEntry({
                      id: generateId(),
                      title: 'Data Analysis Project',
                      description: '',
                      charts: charts,
                      recommendations: recommendations,
                      createdAt: new Date().toISOString(),
                      skillsShown: ['Data Analysis', 'Data Visualization', 'Marketing Analytics'],
                      visibility: 'private'
                    });
                    setShowPortfolioDialog(true);
                  }}
                  className="bg-[#111] border border-[#ffd700] text-[#ffd700] hover:bg-[#ffd700]/10 flex items-center gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  Add to Portfolio
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attemptResult.feedback.map((feedback, i) => (
                    <div key={i} className="p-4 bg-[#222] rounded-md border border-[#444] flex">
                      <div className="mr-3 text-lg">
                        {i === 0 ? "🌟" : i === 1 ? "✅" : "💡"}
                      </div>
                      <div className="text-[#f5f5f5]">
                        {feedback}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6 bg-[#ffd700]/20" />
                
                <div>
                  <h3 className="text-lg font-medium text-[#ffd700] mb-4">Your Visualizations</h3>
                  <div className="space-y-6 mb-6">
                    {charts.map((chart) => (
                      <div key={chart.id} className="p-4 bg-[#222] rounded-md border border-[#444]">
                        <h4 className="text-medium font-medium text-[#ffd700] mb-2">{chart.title}</h4>
                        {chart.description && <p className="text-[#f5f5f5]/80 mb-3">{chart.description}</p>}
                        <div className="h-48 md:h-64">
                          {renderChart(chart)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-medium text-[#ffd700] mb-4">Your Recommendations</h3>
                  <div className="space-y-4">
                    {recommendations.map((rec, i) => (
                      <div key={i} className="p-4 bg-[#222] rounded-md border border-[#444]">
                        <h4 className="text-medium font-medium text-[#ffd700] mb-2">{rec.title}</h4>
                        <p className="text-[#f5f5f5] mb-3">{rec.description}</p>
                        <div className="text-sm text-[#f5f5f5]/70">
                          <strong className="text-[#ffd700]/80">Expected Impact:</strong> {rec.expectedImpact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Portfolio Dialog */}
      <Dialog open={showPortfolioDialog} onOpenChange={setShowPortfolioDialog}>
        <DialogContent className="sm:max-w-[500px] bg-[#111] border border-[#ffd700]/30 text-[#f5f5f5]">
          <DialogHeader>
            <DialogTitle className="text-[#ffd700]">Add to Portfolio</DialogTitle>
            <DialogDescription className="text-[#f5f5f5]/70">
              Save this visualization analysis to your portfolio to showcase your data analysis skills to potential employers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ffd700]">
                Title
              </label>
              <Input 
                value={portfolioEntry.title || ''}
                onChange={(e) => setPortfolioEntry({...portfolioEntry, title: e.target.value})}
                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                placeholder="Enter a professional title for this portfolio entry"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ffd700]">
                Description
              </label>
              <textarea 
                value={portfolioEntry.description || ''}
                onChange={(e) => setPortfolioEntry({...portfolioEntry, description: e.target.value})}
                className="w-full h-24 px-3 py-2 text-[#f5f5f5] bg-[#222] rounded-md border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50"
                placeholder="Describe what you analyzed and what skills you demonstrated"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ffd700]">
                Skills Demonstrated (separated by commas)
              </label>
              <Input 
                value={portfolioEntry.skillsShown?.join(', ') || ''}
                onChange={(e) => setPortfolioEntry({
                  ...portfolioEntry, 
                  skillsShown: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
                })}
                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                placeholder="Data visualization, marketing analysis, trend identification..."
              />
              <p className="text-xs text-[#f5f5f5]/50">
                Add relevant skills that you demonstrated in this analysis
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ffd700]">
                Visibility
              </label>
              <Select 
                value={portfolioEntry.visibility}
                onValueChange={(value) => setPortfolioEntry({
                  ...portfolioEntry, 
                  visibility: value as 'private' | 'public'
                })}
              >
                <SelectTrigger className="bg-[#222] border-[#444] text-[#f5f5f5]">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent className="bg-[#222] border-[#444] text-[#f5f5f5]">
                  <SelectItem value="private">Private (Only you can see)</SelectItem>
                  <SelectItem value="public">Public (Can be shared with employers)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="text-sm text-[#f5f5f5]/60 mb-2">
              Adding this to your portfolio will help you showcase your data analysis and visualization skills to potential employers.
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPortfolioDialog(false)}
                className="border-[#ffd700]/30 text-[#f5f5f5] hover:bg-[#ffd700]/10"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveToPortfolio}
                className="bg-[#ffd700] text-black hover:bg-[#e6c200]"
              >
                Save to Portfolio
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
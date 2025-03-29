import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  BarChart, 
  LineChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  CalendarIcon, 
  ClockIcon, 
  LineChartIcon, 
  PercentIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  Divide,
  CircleDollarSign,
  BarChart3,
  TrendingUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/loading-spinner";

// A/B Test Workshop
export default function ABTestWorkshop() {
  const [activeTab, setActiveTab] = useState("setup");
  const [testName, setTestName] = useState("");
  const [testVariable, setTestVariable] = useState("headline");
  const [controlVariant, setControlVariant] = useState("");
  const [testVariants, setTestVariants] = useState<string[]>([""]);
  const [audience, setAudience] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [runningSimulation, setRunningSimulation] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(95);
  const [trafficAllocation, setTrafficAllocation] = useState(100);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  // Sample simulation data - in a real implementation, this would come from API
  const sampleSimulationResults = {
    testId: 1,
    testName: "Homepage Hero A/B Test",
    status: "completed",
    startDate: "2025-03-15T00:00:00Z",
    endDate: "2025-03-29T00:00:00Z",
    confidenceLevel: 0.97,
    testVariable: "headline",
    variants: [
      {
        id: 1,
        name: "Control",
        isControl: true,
        value: "Boost Your Marketing ROI Today",
        impressions: 10000,
        clicks: 520,
        conversions: 52,
        cost: 1500,
        ctr: 0.052,
        conversionRate: 0.10,
        cpa: 28.85,
        improvementPercent: 0
      },
      {
        id: 2,
        name: "Variant A",
        isControl: false,
        value: "Double Your Marketing Results Fast",
        impressions: 10000,
        clicks: 600,
        conversions: 72,
        cost: 1500,
        ctr: 0.06,
        conversionRate: 0.12,
        cpa: 20.83,
        improvementPercent: 15.4
      },
      {
        id: 3,
        name: "Variant B",
        isControl: false,
        value: "See How Top Marketers Boost ROI",
        impressions: 10000,
        clicks: 580,
        conversions: 65,
        cost: 1500,
        ctr: 0.058,
        conversionRate: 0.112,
        cpa: 23.08,
        improvementPercent: 11.5
      }
    ],
    dailyData: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(2025, 2, 15 + i).toISOString().split('T')[0],
      "Control CTR": 0.052 + (Math.random() * 0.01 - 0.005),
      "Variant A CTR": 0.06 + (Math.random() * 0.01 - 0.005),
      "Variant B CTR": 0.058 + (Math.random() * 0.01 - 0.005),
    })),
    winningVariant: {
      id: 2,
      name: "Variant A",
      improvement: 15.4,
      projectedAnnualSavings: 38640
    },
    insights: [
      "Variant A significantly outperformed the control with 15.4% lower CPA",
      "More direct and action-oriented headlines showed better performance",
      "The difference was statistically significant with 97% confidence",
      "Implementing the winning variant could save approximately $38,640 annually"
    ]
  };

  // Mock create A/B test mutation
  const createTestMutation = useMutation({
    mutationFn: async (testData: any) => {
      // Simulate API call
      console.log("Creating test with data:", testData);
      return new Promise(resolve => setTimeout(() => resolve({ id: 1, ...testData }), 1500));
    },
    onSuccess: () => {
      toast({
        title: "A/B Test Created",
        description: "Your test has been created successfully and the simulation is now running.",
      });
      setRunningSimulation(true);
      // Simulate a delay for the simulation to run
      setTimeout(() => {
        setRunningSimulation(false);
        setSimulationResults(sampleSimulationResults);
        setActiveTab("results");
      }, 3000);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error Creating Test",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  });

  const handleAddVariant = () => {
    setTestVariants([...testVariants, ""]);
  };

  const handleUpdateVariant = (index: number, value: string) => {
    const newVariants = [...testVariants];
    newVariants[index] = value;
    setTestVariants(newVariants);
  };

  const handleRemoveVariant = (index: number) => {
    if (testVariants.length === 1) return;
    const newVariants = [...testVariants];
    newVariants.splice(index, 1);
    setTestVariants(newVariants);
  };

  const handleCreateTest = () => {
    if (!testName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a name for your A/B test.",
      });
      return;
    }

    if (!controlVariant) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a control variant.",
      });
      return;
    }

    if (testVariants.some(v => !v)) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all test variants or remove empty ones.",
      });
      return;
    }

    createTestMutation.mutate({
      name: testName,
      testVariable,
      controlVariant,
      testVariants: testVariants.filter(v => v),
      audience,
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      confidenceThreshold,
      trafficAllocation
    });
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">A/B Testing Workshop</h1>
      <p className="text-muted-foreground mb-6">
        Design, run, and analyze A/B tests to optimize your marketing campaigns
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">1. Test Setup</TabsTrigger>
          <TabsTrigger value="simulation" disabled={!simulationResults && !runningSimulation}>2. Simulation</TabsTrigger>
          <TabsTrigger value="results" disabled={!simulationResults}>3. Results & Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <div className="grid gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Configuration</CardTitle>
                <CardDescription>Define the parameters of your A/B test</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="test-name">Test Name</Label>
                      <Input 
                        id="test-name" 
                        placeholder="e.g., Homepage Headline Test" 
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test-variable">Test Variable</Label>
                      <Select value={testVariable} onValueChange={setTestVariable}>
                        <SelectTrigger>
                          <SelectValue placeholder="What are you testing?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="headline">Headline</SelectItem>
                          <SelectItem value="description">Description</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="cta">Call-to-Action</SelectItem>
                          <SelectItem value="layout">Page Layout</SelectItem>
                          <SelectItem value="color">Color Scheme</SelectItem>
                          <SelectItem value="price">Price Point</SelectItem>
                          <SelectItem value="offer">Offer/Promotion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label>Control Variant (A)</Label>
                      <div className="mt-2">
                        <Textarea 
                          placeholder={`Enter your current (control) ${testVariable}`}
                          value={controlVariant}
                          onChange={(e) => setControlVariant(e.target.value)}
                        />
                      </div>
                    </div>

                    {testVariants.map((variant, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center">
                          <Label>Test Variant {index + 1}</Label>
                          {testVariants.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveVariant(index)}
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          )}
                        </div>
                        <div className="mt-2">
                          <Textarea 
                            placeholder={`Enter alternative ${testVariable}`}
                            value={variant}
                            onChange={(e) => handleUpdateVariant(index, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}

                    <Button 
                      variant="outline" 
                      onClick={handleAddVariant}
                      disabled={testVariants.length >= 5}
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1" /> Add Another Variant
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience</Label>
                      <Select value={audience} onValueChange={setAudience}>
                        <SelectTrigger>
                          <SelectValue placeholder="Who will see this test?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="new">New Users Only</SelectItem>
                          <SelectItem value="returning">Returning Users Only</SelectItem>
                          <SelectItem value="mobile">Mobile Users</SelectItem>
                          <SelectItem value="desktop">Desktop Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="traffic">Traffic Allocation (%)</Label>
                      <Input 
                        id="traffic" 
                        type="number" 
                        min="1" 
                        max="100" 
                        value={trafficAllocation}
                        onChange={(e) => setTrafficAllocation(Number(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        % of eligible traffic included in the test
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="threshold">Statistical Confidence (%)</Label>
                      <Input 
                        id="threshold" 
                        type="number" 
                        min="80" 
                        max="99" 
                        value={confidenceThreshold}
                        onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum confidence level for significance
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Test Duration (Days)</Label>
                      <Input 
                        id="duration" 
                        type="number" 
                        min="7" 
                        defaultValue={14}
                        readOnly
                      />
                      <p className="text-xs text-muted-foreground">
                        Fixed at 14 days for simulation
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline">Save Draft</Button>
                <Button 
                  onClick={handleCreateTest} 
                  disabled={createTestMutation.isPending}
                >
                  {createTestMutation.isPending ? (
                    <>
                      <LoadingSpinner className="mr-2" />
                      Creating Test...
                    </>
                  ) : "Create & Run Simulation"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simulation">
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Progress</CardTitle>
                <CardDescription>
                  {runningSimulation 
                    ? "Your A/B test simulation is running..." 
                    : simulationResults 
                      ? "Simulation complete. View the results in the Results tab."
                      : "Set up your test first to run a simulation"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {runningSimulation ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <LoadingSpinner size="lg" />
                    <div className="mt-6 text-center">
                      <h3 className="text-lg font-medium">Processing Your Test</h3>
                      <p className="text-muted-foreground mt-2">
                        Our AI is simulating real-world user behavior to generate realistic test results.
                        This typically takes about 30 seconds.
                      </p>
                    </div>
                    <div className="mt-8 w-full max-w-md">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Generating baseline metrics</span>
                          <span>Done</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Calculating variant performance</span>
                          <span>In progress...</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Running statistical analysis</span>
                          <span>Pending</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Creating insights and recommendations</span>
                          <span>Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : simulationResults ? (
                  <div className="py-6 text-center">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="text-xl font-medium mt-4">Simulation Complete!</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      Your A/B test simulation has finished. Click the button below to view detailed results and analysis.
                    </p>
                    <Button className="mt-6" onClick={() => setActiveTab("results")}>
                      View Results
                    </Button>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p>Please set up and create your test first.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results">
          {simulationResults && (
            <div className="grid gap-6 mt-6">
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Results Summary</CardTitle>
                  <CardDescription>
                    {simulationResults.testName} • {new Date(simulationResults.startDate).toLocaleDateString()} - {new Date(simulationResults.endDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Test Performance</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            <PercentIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Confidence Level</p>
                            <p className="text-lg font-medium">{(simulationResults.confidenceLevel * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            <TrendingUp className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Improvement</p>
                            <p className="text-lg font-medium">{simulationResults.winningVariant.improvement}%</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            <CircleDollarSign className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Projected Savings</p>
                            <p className="text-lg font-medium">${simulationResults.winningVariant.projectedAnnualSavings.toLocaleString()}/yr</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Winning Variant</p>
                            <p className="text-lg font-medium">{simulationResults.winningVariant.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">Key Insights</h3>
                      <ul className="space-y-2">
                        {simulationResults.insights.map((insight, i) => (
                          <li key={i} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-xs text-blue-600 font-medium">{i+1}</span>
                            </div>
                            <span className="text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mb-4">Variant Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-2 text-sm font-medium">Variant</th>
                          <th className="text-left p-2 text-sm font-medium">Impressions</th>
                          <th className="text-left p-2 text-sm font-medium">Clicks</th>
                          <th className="text-left p-2 text-sm font-medium">CTR</th>
                          <th className="text-left p-2 text-sm font-medium">Conversions</th>
                          <th className="text-left p-2 text-sm font-medium">Conv. Rate</th>
                          <th className="text-left p-2 text-sm font-medium">CPA</th>
                          <th className="text-left p-2 text-sm font-medium">Improvement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {simulationResults.variants.map((variant) => (
                          <tr key={variant.id} className={variant.id === simulationResults.winningVariant.id ? "bg-green-50" : ""}>
                            <td className="p-2 text-sm border-t flex items-center">
                              {variant.id === simulationResults.winningVariant.id && (
                                <CheckCircleIcon className="h-4 w-4 text-green-600 mr-1" />
                              )}
                              {variant.name}
                            </td>
                            <td className="p-2 text-sm border-t">{variant.impressions.toLocaleString()}</td>
                            <td className="p-2 text-sm border-t">{variant.clicks.toLocaleString()}</td>
                            <td className="p-2 text-sm border-t">{formatPercent(variant.ctr)}</td>
                            <td className="p-2 text-sm border-t">{variant.conversions.toLocaleString()}</td>
                            <td className="p-2 text-sm border-t">{formatPercent(variant.conversionRate)}</td>
                            <td className="p-2 text-sm border-t">{formatCurrency(variant.cpa)}</td>
                            <td className="p-2 text-sm border-t">
                              {variant.isControl ? "Baseline" : `+${variant.improvementPercent}%`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Over Time</CardTitle>
                  <CardDescription>Daily CTR comparison between variants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={simulationResults.dailyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} />
                        <Tooltip 
                          formatter={(value) => [`${(Number(value) * 100).toFixed(2)}%`, 'CTR']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="Control CTR" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Variant A CTR" 
                          stroke="#82ca9d" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Variant B CTR" 
                          stroke="#ffc658" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                  <CardDescription>Recommended actions based on test results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-base font-medium">Implement Winning Variant</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Replace your current {testVariable} with the winning variant value:
                          <span className="block mt-2 p-3 bg-muted/50 rounded-md font-medium">
                            "{simulationResults.variants.find(v => v.id === simulationResults.winningVariant.id)?.value}"
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-base font-medium">Plan Further Tests</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Consider testing these additional elements to further improve performance:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Call-to-action button text and color</li>
                          <li>• Image selection and placement</li>
                          <li>• Offer structure and incentives</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Apply Winning Variant to Campaign</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
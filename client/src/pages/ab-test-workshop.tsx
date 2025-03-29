import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

import {
  AlertCircle,
  Crown,
  Loader2,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Zap
} from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// Component to create a new A/B test
const NewABTestForm = () => {
  const [name, setName] = useState('');
  const [variable, setVariable] = useState('headline');
  const [control, setControl] = useState('');
  const [variants, setVariants] = useState<string[]>(['']);
  const [campaignId, setCampaignId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  
  const createTestMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/ab-tests', { 
      method: 'POST', 
      body: JSON.stringify(data), 
      headers: {'Content-Type': 'application/json'} 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests'] });
      setName('');
      setVariable('headline');
      setControl('');
      setVariants(['']);
      setCampaignId(null);
    }
  });

  const addVariant = () => {
    setVariants([...variants, '']);
  };

  const updateVariant = (index: number, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = value;
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty variants
    const filteredVariants = variants.filter(v => v.trim() !== '');
    
    if (filteredVariants.length === 0) {
      alert('Please add at least one test variant');
      return;
    }
    
    createTestMutation.mutate({
      name,
      testVariable: variable,
      controlVariant: control,
      testVariants: filteredVariants,
      campaignId: campaignId,
      startDate: new Date().toISOString(),
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create New A/B Test</CardTitle>
        <CardDescription>
          Set up a new A/B test to compare different variations of your marketing content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test-name">Test Name</Label>
              <Input 
                id="test-name" 
                placeholder="e.g., Homepage Headline Test Q2 2025" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-variable">What are you testing?</Label>
              <Select value={variable} onValueChange={setVariable}>
                <SelectTrigger id="test-variable">
                  <SelectValue placeholder="Select element to test" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="headline">Headline</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                  <SelectItem value="cta">Call to Action</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="layout">Layout</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="pricing">Pricing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="control-variant">Control Variant (Original Version)</Label>
              <Textarea 
                id="control-variant" 
                placeholder={`Enter your current ${variable}`} 
                value={control} 
                onChange={(e) => setControl(e.target.value)} 
                required 
                rows={3}
              />
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Test Variants</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  Add Variant
                </Button>
              </div>
              
              {variants.map((variant, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Textarea 
                    placeholder={`Enter test variant ${index + 1}`} 
                    value={variant} 
                    onChange={(e) => updateVariant(index, e.target.value)} 
                    required 
                    rows={2}
                    className="flex-1"
                  />
                  {variants.length > 1 && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeVariant(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setName('');
          setVariable('headline');
          setControl('');
          setVariants(['']);
        }}>Reset</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={createTestMutation.isPending || !name || !control || variants.every(v => !v)}
        >
          {createTestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create A/B Test
        </Button>
      </CardFooter>
    </Card>
  );
};

// Component to display A/B test simulation results
const ABTestResults = ({ testId }: { testId: number }) => {
  const queryClient = useQueryClient();
  
  const { data: test, isLoading, isError } = useQuery({
    queryKey: ['/api/ab-tests', testId],
    queryFn: () => apiRequest(`/api/ab-tests/${testId}`, { method: 'GET' }),
  });
  
  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ['/api/ab-tests', testId, 'results'],
    queryFn: () => apiRequest(`/api/ab-tests/${testId}/results`, { method: 'GET' }),
    enabled: !!test && test.status === 'completed',
  });
  
  const runSimulationMutation = useMutation({
    mutationFn: () => apiRequest(`/api/ab-tests/${testId}/simulate`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests', testId] });
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests', testId, 'results'] });
    }
  });
  
  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (isError || !test) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load test data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  const handleRunSimulation = () => {
    runSimulationMutation.mutate();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{test.name}</h2>
          <p className="text-muted-foreground">Testing variable: {test.testVariable}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            test.status === 'active' ? 'bg-green-100 text-green-800' :
            test.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
          </span>
          {test.status !== 'completed' && (
            <Button 
              onClick={handleRunSimulation} 
              disabled={runSimulationMutation.isPending}
              size="sm"
            >
              {runSimulationMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Run Simulation
            </Button>
          )}
        </div>
      </div>
      
      {results && (
        <Tabs defaultValue="performance">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Daily Trends</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4 pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead className="text-right">Conv. Rate</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">CPA</TableHead>
                  <TableHead className="text-right">Improvement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.variants.map((variant: any) => (
                  <TableRow key={variant.id} className={variant.id === results.winningVariant?.id ? "bg-green-50" : ""}>
                    <TableCell className="font-medium">
                      {variant.name} {variant.isControl && "(Control)"}
                      {variant.id === results.winningVariant?.id && (
                        <Crown className="h-4 w-4 text-yellow-500 inline ml-1" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">{variant.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{variant.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{parseFloat(variant.ctr) * 100}%</TableCell>
                    <TableCell className="text-right">{variant.conversions}</TableCell>
                    <TableCell className="text-right">{parseFloat(variant.conversionRate) * 100}%</TableCell>
                    <TableCell className="text-right">${variant.cost}</TableCell>
                    <TableCell className="text-right">${variant.cpa}</TableCell>
                    <TableCell className={`text-right font-semibold ${
                      !variant.isControl && parseFloat(variant.improvementPercent) > 0 ? 'text-green-600' : 
                      !variant.isControl && parseFloat(variant.improvementPercent) < 0 ? 'text-red-600' : ''
                    }`}>
                      {variant.isControl ? '-' : `${parseFloat(variant.improvementPercent) > 0 ? '+' : ''}${variant.improvementPercent}%`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {results.winningVariant && (
              <Alert className="bg-green-50 border-green-100">
                <ThumbsUp className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Winner Found!</AlertTitle>
                <AlertDescription className="text-green-700">
                  {results.winningVariant.name} outperformed the control by {parseFloat(results.winningVariant.improvement)}%,
                  which could save approximately ${results.winningVariant.projectedAnnualSavings.toLocaleString()} annually.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="trends" className="pt-4">
            {results.dailyData && results.dailyData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={results.dailyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {results.variants.map((variant: any, idx: number) => (
                      <Line 
                        key={variant.id} 
                        type="monotone" 
                        dataKey={`${variant.name} CTR`} 
                        stroke={idx === 0 ? '#8884d8' : idx === 1 ? '#82ca9d' : '#ffc658'} 
                        activeDot={{ r: 8 }} 
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Trend Data</AlertTitle>
                <AlertDescription>
                  Daily trend data is not available for this test yet.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="insights" className="pt-4">
            {results.insights && results.insights.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Key Insights
                </h3>
                <ul className="space-y-3">
                  {results.insights.map((insight: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="flex-shrink-0 text-blue-500 mt-1">
                        {idx === 0 ? <TrendingUp className="h-4 w-4" /> : 
                         idx === 1 ? <Zap className="h-4 w-4" /> : 
                         <AlertCircle className="h-4 w-4" />}
                      </span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
                
                <Alert className="bg-blue-50 border-blue-100">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">What's Next?</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Consider implementing the winning variant in your actual campaigns,
                    and set up another test to continue optimizing your marketing performance.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Insights Yet</AlertTitle>
                <AlertDescription>
                  Insights will be available once the test simulation has completed.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      )}
      
      {test.status !== 'completed' && !resultsLoading && !results && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Test Not Completed</AlertTitle>
          <AlertDescription>
            Run the simulation to see the results and insights for this A/B test.
          </AlertDescription>
        </Alert>
      )}
      
      {resultsLoading && (
        <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
      )}
    </div>
  );
};

// Main A/B Test Workshop Page
const ABTestWorkshop = () => {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: tests, isLoading, isError } = useQuery({
    queryKey: ['/api/ab-tests'],
    queryFn: () => apiRequest('/api/ab-tests', { method: 'GET' }),
  });
  
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">A/B Test Workshop</h1>
        <p className="text-muted-foreground mt-2">
          Create and simulate A/B tests to optimize your marketing campaigns
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <NewABTestForm />
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Your A/B Tests</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load test data. Please try again later.
              </AlertDescription>
            </Alert>
          ) : tests && tests.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <RadioGroup 
                  value={selectedTestId ? selectedTestId.toString() : ''} 
                  onValueChange={(value) => setSelectedTestId(parseInt(value))}
                  className="space-y-3"
                >
                  {tests.map((test: any) => (
                    <div key={test.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={test.id.toString()} id={`test-${test.id}`} />
                      <Label 
                        htmlFor={`test-${test.id}`}
                        className="flex-1 flex justify-between cursor-pointer py-2 px-2 rounded hover:bg-gray-50"
                      >
                        <span>{test.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          test.status === 'active' ? 'bg-green-100 text-green-800' :
                          test.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {selectedTestId && (
                <div className="mt-6 border rounded-lg p-6 bg-gray-50">
                  <ABTestResults testId={selectedTestId} />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
              <h3 className="text-lg font-medium mb-2">No A/B Tests Found</h3>
              <p className="text-gray-500 mb-4">Create your first A/B test using the form above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ABTestWorkshop;
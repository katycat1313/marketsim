import FeatureGuideDrawer from '@/components/FeatureGuideDrawer';
import { InstructorToolGuide } from '@/components/InstructorToolGuide';
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
  Zap,
  CheckCircle2,
  Monitor,
  Smartphone,
  Eye,
  Split,
  Target,
  Coffee,
  Globe,
  ArrowRight,
  ShieldCheck,
  Percent,
  Check,
  HelpCircle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useClientAgency } from "@/context/ClientAgencyContext";

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

// Component to create a new A/B test with live Visual QA Side-by-Side Preview
const NewABTestForm = () => {
  const { client } = useClientAgency();
  const [name, setName] = useState("Jenny's Roastery Value Prop & Roast Date Test");
  const [variable, setVariable] = useState('headline');
  const [control, setControl] = useState('Coffee Beans For Sale - Buy Now');
  const [variants, setVariants] = useState<string[]>([
    'Small-Batch Artisan Coffee Roasted Fresh & Shipped to Your Door - 15% Off Your First Batch'
  ]);
  const [ctaText, setCtaText] = useState('Claim 15% Off Roaster\'s Choice');
  const [campaignId, setCampaignId] = useState<number | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const queryClient = useQueryClient();
  
  const createTestMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/ab-tests', { 
      method: 'POST', 
      body: JSON.stringify(data), 
      headers: {'Content-Type': 'application/json'} 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests'] });
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

  const applyPreset = (presetHeadline: string, presetCta: string) => {
    setVariants([presetHeadline]);
    setCtaText(presetCta);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    <Card className="mb-8 border-border shadow-md">
      <CardHeader className="pb-3 border-b border-border/50 bg-secondary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                <Coffee className="h-4 w-4" />
              </div>
              <CardTitle className="text-xl font-bold">
                A/B Testing Lab: Jenny's Artisan Java Homepage
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-1">
              Test challenger headlines and offers against Jenny's current baseline website to maximize checkout conversion rate.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <FeatureGuideDrawer
              toolName="A/B Testing & Conversion Optimization"
              industryEquivalent="Optimizely / VWO / Google Optimize"
              purpose="A/B testing allows marketers to test two versions of a webpage against real visitor traffic to find which headline, value proposition, or call-to-action generates more sales without spending extra money on ads."
              steps={[
                {
                  step: 1,
                  title: 'Audit the Control Baseline',
                  description: "Review the current webpage metrics (e.g. Jenny's 2.1% baseline checkout conversion rate across 3,000 monthly visitors)."
                },
                {
                  step: 2,
                  title: 'Formulate a Challenger Hypothesis',
                  description: 'Use the LIFT model (reducing cognitive friction, boosting value proposition clarity, and adding trust badges) to draft Variant B.'
                },
                {
                  step: 3,
                  title: 'Validate Statistical Significance (p < 0.05)',
                  description: 'Ensure sample size and conversion numbers reach 95% statistical confidence so the result is not random noise.'
                }
              ]}
              benchmarks={[
                {
                  label: 'E-Commerce Baseline CVR',
                  value: '1.8% - 2.5%',
                  context: 'Average Shopify conversion rate for specialty retail and food & beverage.'
                },
                {
                  label: 'Statistical Significance',
                  value: 'p < 0.05 (95%)',
                  context: 'Minimum scientific threshold required before declaring a permanent test winner.'
                },
                {
                  label: 'Healthy MDE (Expected Lift)',
                  value: '+15% to +25%',
                  context: 'Realistic conversion improvement expected from above-the-fold value prop testing.'
                },
                {
                  label: 'Sample Size Needed',
                  value: '1,000+ per variant',
                  context: 'Traffic needed per variant to avoid false-positive testing errors.'
                }
              ]}
            />
            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 shrink-0">
            <Target className="h-3 w-3" />
            <span>Target: Store Purchases (AOV $42.50)</span>
          </Badge>
          </div>
        </div>

        {/* Real-World Experiment Targeting Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs">
          <div className="p-2 rounded bg-background/80 border border-border/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Target URL</span>
            <span className="font-mono text-foreground font-medium truncate block">jennysartisancoffee.com/</span>
          </div>
          <div className="p-2 rounded bg-background/80 border border-border/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Traffic Split</span>
            <span className="text-foreground font-medium">50% A / 50% B (Cookie Split)</span>
          </div>
          <div className="p-2 rounded bg-background/80 border border-border/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Inbound Audience</span>
            <span className="text-foreground font-medium">Google Ads + SEO + Social</span>
          </div>
          <div className="p-2 rounded bg-background/80 border border-border/60">
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Statistical Rigor</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">95% Confidence (p &lt; 0.05)</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Form Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="test-name" className="text-xs font-semibold">Experiment Name</Label>
              <Input 
                id="test-name" 
                placeholder="e.g., Homepage Value Prop & Roast Date Test" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="text-xs"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="test-variable" className="text-xs font-semibold">Testing Element</Label>
              <Select value={variable} onValueChange={setVariable}>
                <SelectTrigger id="test-variable" className="text-xs">
                  <SelectValue placeholder="Select element to test" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="headline">Hero Headline & Value Proposition</SelectItem>
                  <SelectItem value="cta">Call to Action & Button Offer</SelectItem>
                  <SelectItem value="offer">Introductory Discount / Bundle Offer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Angle Presets */}
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/60 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>One-Click Agency Strategy Angles (Tested on Coffee DTC):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-6 text-[11px] px-2.5 bg-background hover:bg-secondary border-border"
                onClick={() => applyPreset(
                  "Small-Batch Organic Coffee Roasted Fresh & Shipped to Your Door - 15% Off Your First Batch",
                  "Claim 15% Off Roaster's Choice"
                )}
              >
                Fresh Roast + 15% Discount Angle
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-6 text-[11px] px-2.5 bg-background hover:bg-secondary border-border"
                onClick={() => applyPreset(
                  "Never Drink Stale Coffee Again: Whole Beans Roasted Within 48 Hours of Delivery",
                  "Taste The 48-Hour Difference"
                )}
              >
                Anti-Stale / Quality Guarantee Angle
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-6 text-[11px] px-2.5 bg-background hover:bg-secondary border-border"
                onClick={() => applyPreset(
                  "Morgantown's Highest-Rated Micro-Roastery: Ethically Sourced Single-Origin Beans",
                  "Explore Fresh Single Origins"
                )}
              >
                Local Social Proof & Single Origin Angle
              </Button>
            </div>
          </div>

          {/* Inputs for Control and Variant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="control-variant" className="text-xs font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                  <span>Version A: Control (Jenny's Live Baseline)</span>
                </Label>
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5">Original (50% Traffic)</Badge>
              </div>
              <Textarea 
                id="control-variant" 
                placeholder="Enter current live headline" 
                value={control} 
                onChange={(e) => setControl(e.target.value)} 
                required 
                rows={3}
                className="text-xs bg-muted/30"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="variant-0" className="text-xs font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>Version B: Challenger (Your Candidate Copy)</span>
                </Label>
                <Badge className="text-[10px] py-0 px-1.5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">Challenger (50% Traffic)</Badge>
              </div>
              <Textarea 
                id="variant-0" 
                placeholder="Enter your new high-converting headline" 
                value={variants[0] || ''} 
                onChange={(e) => updateVariant(0, e.target.value)} 
                required 
                rows={3}
                className="text-xs border-emerald-500/30 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          {/* LIVE SIDE-BY-SIDE VISUAL QA PREVIEW */}
          <div className="pt-2">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Live Visual QA Preview (What Site Visitors See)
                </h4>
              </div>
              <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-secondary/30">
                <Button
                  type="button"
                  variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-6 px-2 text-[11px] gap-1"
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="h-3 w-3" />
                  <span>Desktop</span>
                </Button>
                <Button
                  type="button"
                  variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-6 px-2 text-[11px] gap-1"
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="h-3 w-3" />
                  <span>Mobile</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card A (Control) */}
              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="bg-muted/80 px-3 py-1.5 border-b border-border text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                  <span>Version A (Control) • 50% Traffic</span>
                  <Badge variant="outline" className="text-[10px] py-0">Current Live Site</Badge>
                </div>
                <div className="p-5 space-y-4 bg-gradient-to-br from-amber-950/20 via-background to-background">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Jenny's Artisan Java
                    </span>
                    <span className="text-[11px] text-muted-foreground">• Morgantown, WV</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-3">
                    {control || "Coffee Beans For Sale - Buy Now"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    100% Organic Arabica beans sourced directly from independent farmers. Roasted locally in small batches.
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-sm text-foreground">$19.50 / bag</span>
                    <Button size="sm" variant="outline" className="h-7 text-xs font-medium">
                      Buy Now
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/40 px-3 py-1.5 border-t border-border/40 text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>Baseline Conversion Rate: <strong>2.1%</strong></span>
                  <span>Est. Monthly Sales: ~63 bags</span>
                </div>
              </div>

              {/* Card B (Challenger Variant) */}
              <div className="rounded-xl border-2 border-emerald-500/50 bg-card overflow-hidden shadow-md flex flex-col justify-between">
                <div className="bg-emerald-500/15 px-3 py-1.5 border-b border-emerald-500/30 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Version B (Challenger) • 50% Traffic</span>
                  </span>
                  <Badge className="text-[10px] py-0 bg-emerald-600 text-white">Candidate</Badge>
                </div>
                <div className="p-5 space-y-4 bg-gradient-to-br from-amber-950/25 via-background to-background">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Fresh Batch Guarantee
                    </span>
                    <span className="text-[11px] text-emerald-500 font-medium">• Stamped Roast Date</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-3">
                    {variants[0] || "Small-Batch Artisan Coffee Roasted Fresh & Shipped to Your Door - 15% Off Your First Batch"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Roasted within 48 hours of dispatch. Packed warm in degassing valve bags with ethical direct-trade origins.
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-bold text-sm text-foreground">$16.58</span>
                      <span className="text-xs text-muted-foreground line-through ml-1.5">$19.50</span>
                    </div>
                    <Button size="sm" className="h-7 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
                      {ctaText}
                    </Button>
                  </div>
                </div>
                <div className="bg-emerald-500/10 px-3 py-1.5 border-t border-emerald-500/30 text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center justify-between font-medium">
                  <span>Projected Conversion Rate: <strong>2.7% (+28.6%)</strong></span>
                  <span>Est. Annual Revenue Lift: <strong>+$12,450</strong></span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-border/60 bg-secondary/10 py-3">
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => {
            setName("Jenny's Roastery Value Prop & Roast Date Test");
            setControl("Coffee Beans For Sale - Buy Now");
            setVariants(["Small-Batch Artisan Coffee Roasted Fresh & Shipped to Your Door - 15% Off Your First Batch"]);
            setCtaText("Claim 15% Off Roaster's Choice");
          }}
        >
          Reset to Baseline
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={createTestMutation.isPending || !name || !control || variants.every(v => !v)}
          className="text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 shadow-sm"
          size="sm"
        >
          {createTestMutation.isPending ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              <span>Launching Experiment...</span>
            </>
          ) : (
            <>
              <Split className="h-3.5 w-3.5" />
              <span>Launch A/B Test & Start Traffic Split</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Component to display A/B test simulation results
const ABTestResults = ({ testId }: { testId: number }) => {
  const queryClient = useQueryClient();
  const { client, deployABTestWinner } = useClientAgency();
  
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
                  <TableRow key={variant.id} className={variant.id === results.winningVariant?.id ? "bg-green-500/10 dark:bg-green-500/15" : ""}>
                    <TableCell className="font-medium">
                      {variant.name} {variant.isControl && "(Control)"}
                      {variant.id === results.winningVariant?.id && (
                        <Crown className="h-4 w-4 text-amber-500 inline ml-1" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">{(variant.impressions || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{(variant.clicks || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{(parseFloat(variant.ctr || "0") * 100).toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{variant.conversions || 0}</TableCell>
                    <TableCell className="text-right">{(parseFloat(variant.conversionRate || "0") * 100).toFixed(2)}%</TableCell>
                    <TableCell className="text-right">${parseFloat(variant.cost || "0").toFixed(2)}</TableCell>
                    <TableCell className="text-right">${parseFloat(variant.cpa || "0").toFixed(2)}</TableCell>
                    <TableCell className={`text-right font-semibold ${
                      !variant.isControl && parseFloat(variant.improvementPercent || "0") > 0 ? 'text-emerald-600 dark:text-emerald-400' : 
                      !variant.isControl && parseFloat(variant.improvementPercent || "0") < 0 ? 'text-rose-600 dark:text-rose-400' : ''
                    }`}>
                      {variant.isControl ? '-' : `${parseFloat(variant.improvementPercent || "0") > 0 ? '+' : ''}${parseFloat(variant.improvementPercent || "0").toFixed(1)}%`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {results.winningVariant && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <ThumbsUp className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                          Winner Found: {results.winningVariant.name}
                        </h4>
                        {client?.deployedABTest?.testId === test.id ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Deployed to Live Account
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Ready to Deploy
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Outperformed the control by <strong className="text-foreground">+{parseFloat(results.winningVariant.improvement || "0").toFixed(1)}%</strong>, projecting an estimated <strong className="text-foreground">${(results.winningVariant.projectedAnnualSavings || 0).toLocaleString()}</strong> in annual client revenue lift.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => deployABTestWinner({
                      testId: test.id,
                      testName: test.name,
                      winningVariant: results.winningVariant.name,
                      testVariable: test.testVariable,
                      improvementPercent: parseFloat(results.winningVariant.improvement || "0")
                    })}
                    disabled={client?.deployedABTest?.testId === test.id}
                    className="shrink-0 font-medium text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    size="sm"
                  >
                    {client?.deployedABTest?.testId === test.id ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Active on Account</span>
                      </>
                    ) : (
                      <>
                        <span>Deploy Winner to Client Account</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Direct Simulation Ripple Effect into Google Ads & SEO Simulators */}
                <div className="mt-4 pt-4 border-t border-emerald-500/20 bg-emerald-950/20 p-3.5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Campaign Simulation Ripple Effect</span>
                    </span>
                    <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                      CVR Lift: +28.6%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mb-3">
                    <div className="p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-[10px] text-muted-foreground block">Google Quality Score</span>
                      <span className="font-bold text-emerald-400 text-sm">4/10 ➔ 8/10</span>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-[10px] text-muted-foreground block">Projected Ad CPC</span>
                      <span className="font-bold text-emerald-400 text-sm">$2.85 ➔ $1.42 (-50%)</span>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-white/5">
                      <span className="text-[10px] text-muted-foreground block">Est. Annual Revenue Lift</span>
                      <span className="font-bold text-emerald-400 text-sm">+$12,450 / yr</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-7 shadow"
                    >
                      <a href="/ad-simulation/1">
                        <span>Open in Google Ads Sim</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-border text-xs h-7 hover:bg-secondary"
                    >
                      <a href="/seo-simulation/1">
                        <span>Open in CMS SEO Sim</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
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

  React.useEffect(() => {
    if (tests && Array.isArray(tests) && tests.length > 0 && selectedTestId === null) {
      setSelectedTestId(tests[0].id);
    }
  }, [tests, selectedTestId]);
  
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Instructor Tool Guide with Checklist & Quick Return to Lesson */}
      <InstructorToolGuide toolKey="ab-test-workshop" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">A/B Test Workshop</h1>
        <p className="text-muted-foreground mt-2">
          Create and simulate A/B tests to optimize your marketing campaigns
        </p>
      </div>
      
            {/* Connected Customer Persona Bridge */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/20 border border-amber-500/40 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Coffee className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-foreground">Active Customer Persona: Pour-Over Marcus</span>
              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30">
                Jenny's Artisan Java (Week 1)
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target Buyer Profile: Frustrated by 6-month-old stale grocery beans. Demands 48-hr roast date guarantee, origin transparency, and 15% first-batch incentive.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-8 gap-1.5"
          >
            <a href="/persona-builder-template">
              <Target className="h-3.5 w-3.5" />
              <span>Inspect Full Persona</span>
            </a>
          </Button>
        </div>
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
                        className={`flex-1 flex justify-between cursor-pointer py-2.5 px-3 rounded-lg border transition-all ${
                          selectedTestId === test.id 
                            ? 'bg-muted/80 border-primary/40 shadow-sm' 
                            : 'hover:bg-muted/40 border-border/40'
                        }`}
                      >
                        <span className="font-medium">{test.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          test.status === 'active' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                          test.status === 'completed' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {selectedTestId && (
                <div className="mt-6 border border-border/80 rounded-xl p-6 bg-card shadow-sm">
                  <ABTestResults testId={selectedTestId} />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
              <h3 className="text-lg font-medium mb-2">No A/B Tests Found</h3>
              <p className="text-muted-foreground mb-4">Create your first A/B test using the form above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ABTestWorkshop;
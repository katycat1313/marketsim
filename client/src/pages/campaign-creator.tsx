import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCampaignSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Plus, X, Target, Lightbulb, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Adding preview simulation type
interface PreviewSimulation {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  costPerConversion: number;
  qualityScore: number;
}

export default function CampaignCreator() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [platform, setPlatform] = useState<"google" | "meta">("google");
  const [headlines, setHeadlines] = useState<string[]>([""]);
  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const [selectedMatchType, setSelectedMatchType] = useState("broad");

  // Update the personas query to handle loading and error states
  const { data: personas = [], isLoading: loadingPersonas, error: personasError } = useQuery<any[]>({
    queryKey: ["/api/personas"],
    initialData: [],
  });

  const form = useForm({
    resolver: zodResolver(insertCampaignSchema),
    defaultValues: {
      name: "",
      platform: "google",
      type: "search",
      goal: "",
      dailyBudget: 50,
      targetCpa: 0,
      keywords: [],
      negativeKeywords: [],
      targeting: {
        locations: [],
        languages: ["en"],
        devices: ["desktop", "mobile", "tablet"],
        demographics: {
          ageRanges: [],
          genders: [],
          householdIncomes: []
        }
      },
      adHeadlines: [""],
      adDescriptions: [""],
      finalUrl: "",
      personaId: 0,
      productDescription: "", // Add this field
    },
  });

  const [previewData, setPreviewData] = useState<PreviewSimulation | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addHeadline = () => {
    if (headlines.length < 15) {
      setHeadlines([...headlines, ""]);
    }
  };

  const addDescription = () => {
    if (descriptions.length < 4) {
      setDescriptions([...descriptions, ""]);
    }
  };

  const removeHeadline = (index: number) => {
    setHeadlines(headlines.filter((_, i) => i !== index));
  };

  const removeDescription = (index: number) => {
    setDescriptions(descriptions.filter((_, i) => i !== index));
  };

  const updatePreview = async (formData: any) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/campaigns/preview", formData);
      const preview = await response.json();
      setPreviewData(preview);

      const suggestionsResponse = await apiRequest("POST", "/api/campaigns/suggestions", formData);
      const suggestions = await suggestionsResponse.json();
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Failed to get preview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      const timeoutId = setTimeout(() => {
        updatePreview(value);
      }, 500);
      return () => clearTimeout(timeoutId);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  async function onSubmit(data: any) {
    try {
      const formattedKeywords = data.keywords.split(",").map((keyword: string) => ({
        text: keyword.trim(),
        matchType: selectedMatchType
      }));

      const response = await apiRequest("POST", "/api/campaigns", {
        ...data,
        keywords: formattedKeywords,
        adHeadlines: headlines.filter(h => h.trim()),
        adDescriptions: descriptions.filter(d => d.trim()),
      });

      const campaign = await response.json();

      await apiRequest("POST", "/api/simulation-data", {
        campaignId: campaign.id,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
        qualityScore: 7,
        date: new Date(),
      });

      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create campaign",
      });
    }
  }

  if (loadingPersonas) {
    return <Skeleton className="h-[600px] w-full" />;
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Create Campaign
          </CardTitle>
          <CardDescription>
            Set up your advertising campaign with targeting and creative options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <Tabs defaultValue="campaign" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="campaign">Campaign Settings</TabsTrigger>
                  <TabsTrigger value="targeting">Targeting</TabsTrigger>
                  <TabsTrigger value="ads">Ad Creation</TabsTrigger>
                </TabsList>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <TabsContent value="campaign">
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Campaign Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Summer Sale 2024" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="platform"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Platform</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setPlatform(value as "google" | "meta");
                                  }}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="google">Google Ads</SelectItem>
                                    <SelectItem value="meta">Meta Ads</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Campaign Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {campaignTypes[platform].map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="goal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Campaign Goal</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select goal" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {campaignGoals.map((goal) => (
                                    <SelectItem key={goal} value={goal}>
                                      {goal}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="dailyBudget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Daily Budget ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" min="5" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="targetCpa"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Target CPA ($)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Optional"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="productDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What are you promoting?</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your product or service (e.g., 'A new fitness app that provides personalized workout plans')"
                                  className="h-20"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This helps our AI provide more relevant suggestions for your campaign
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="targeting">
                      <div className="grid gap-6">
                        <FormField
                          control={form.control}
                          name="keywords"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Keywords</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter keywords separated by commas"
                                  className="h-20"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Add your target keywords. For multiple keywords, separate them with commas.
                              </FormDescription>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {matchTypes.map((type) => (
                                  <Badge
                                    key={type.value}
                                    variant={selectedMatchType === type.value ? "default" : "outline"}
                                    className="cursor-pointer hover:bg-primary/10"
                                    onClick={() => setSelectedMatchType(type.value)}
                                  >
                                    {type.label}
                                  </Badge>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="personaId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Persona</FormLabel>
                              {loadingPersonas ? (
                                <Skeleton className="h-10 w-full" />
                              ) : personasError ? (
                                <div className="text-sm text-destructive">Failed to load personas</div>
                              ) : (
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  defaultValue={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select persona" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {personas.map((persona: any) => (
                                      <SelectItem key={persona.id} value={persona.id.toString()}>
                                        {persona.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="ads">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <FormLabel>Headlines</FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addHeadline}
                              disabled={headlines.length >= 15}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add Headline
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {headlines.map((_, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder={`Headline ${index + 1}`}
                                  maxLength={30}
                                  value={headlines[index]}
                                  onChange={(e) => {
                                    const newHeadlines = [...headlines];
                                    newHeadlines[index] = e.target.value;
                                    setHeadlines(newHeadlines);
                                  }}
                                />
                                {headlines.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeHeadline(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <FormLabel>Descriptions</FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addDescription}
                              disabled={descriptions.length >= 4}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add Description
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {descriptions.map((_, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder={`Description ${index + 1}`}
                                  maxLength={90}
                                  value={descriptions[index]}
                                  onChange={(e) => {
                                    const newDescriptions = [...descriptions];
                                    newDescriptions[index] = e.target.value;
                                    setDescriptions(newDescriptions);
                                  }}
                                />
                                {descriptions.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeDescription(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="finalUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Final URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://www.example.com/landing-page"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <div className="flex justify-end pt-4">
                      <Button type="submit">
                        Create Campaign
                      </Button>
                    </div>
                  </form>
                </Form>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card className="bg-muted/5">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Performance Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : previewData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Est. Impressions</p>
                          <p className="text-lg font-semibold">{previewData.impressions.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Est. Clicks</p>
                          <p className="text-lg font-semibold">{previewData.clicks.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Est. CTR</p>
                          <p className="text-lg font-semibold">{(previewData.ctr * 100).toFixed(2)}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Est. CPC</p>
                          <p className="text-lg font-semibold">${previewData.cpc.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Quality Score</p>
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${(previewData.qualityScore / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{previewData.qualityScore}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Complete your campaign setup to see performance estimates
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : !form.getValues("productDescription") ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Start by describing what you're promoting to get personalized AI suggestions
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const tab = document.querySelector('[data-value="campaign"]');
                          if (tab) (tab as HTMLElement).click();
                        }}
                      >
                        Add Product Description
                      </Button>
                    </div>
                  ) : aiSuggestions.length > 0 ? (
                    <ul className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {form.getValues("goal") ?
                        "Add more targeting details to get AI suggestions" :
                        "Select a campaign goal to get AI suggestions"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const campaignTypes = {
  google: ["search", "display", "shopping"],
  meta: ["feed", "stories", "reels"]
};

const campaignGoals = [
  "Brand Awareness",
  "Website Traffic",
  "Lead Generation",
  "Sales",
  "App Promotion",
];

const matchTypes = [
  { value: "broad", label: "Broad Match", description: "Widest reach, includes variations and related searches" },
  { value: "phrase", label: "Phrase Match", description: "Medium reach, maintains word order" },
  { value: "exact", label: "Exact Match", description: "Most specific, exact keyword or close variants" }
];
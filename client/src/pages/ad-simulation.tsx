import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Info, ArrowRight, Plus, Trash2 } from "lucide-react";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { AdPlatformSimulation } from "@shared/schema";

// Define an interface for the simulation data
interface AdSimulation {
  id: number;
  title: string;
  scenarioDescription: string;
  industry: string;
  businessType: string;
  objectives: string[];
  targetAudience: {
    locations: string[];
    demographics: string[];
    interests: string[];
  };
  platform: string;
  difficulty: string;
  successCriteria: string[];
}

// Type definitions for the form states
interface GoogleAdForm {
  campaignName: string;
  campaignObjective: string;
  adGroups: Array<{
    name: string;
    keywords: Array<{ text: string; matchType: string }>;
    negativeKeywords: string[];
  }>;
  adCreatives: Array<{
    headline1: string;
    headline2: string;
    headline3: string;
    description1: string;
    description2: string;
    finalUrl: string;
  }>;
  locations: string[];
  devices: string[];
  bidStrategy: string;
  dailyBudget: number;
  adExtensions: Array<{ type: string; content: string }>;
}

interface MetaAdForm {
  campaignName: string;
  campaignObjective: string;
  adSets: Array<{
    name: string;
    targeting: {
      ageRange: string[];
      genders: string[];
      interests: string[];
      behaviors: string[];
      locations: string[];
    };
  }>;
  adCreatives: Array<{
    headline: string;
    primaryText: string;
    description: string;
    imageUrl: string;
    callToAction: string;
    destinationUrl: string;
  }>;
  placements: string[];
  bidStrategy: string;
  dailyBudget: number;
  pixelEnabled: boolean;
}

interface LinkedInAdForm {
  campaignName: string;
  campaignObjective: string;
  targeting: {
    jobTitles: string[];
    jobFunctions: string[];
    industries: string[];
    companySize: string[];
    seniorityLevel: string[];
    locations: string[];
  };
  adCreatives: Array<{
    headline: string;
    description: string;
    imageUrl: string;
    callToAction: string;
    destinationUrl: string;
  }>;
  bidStrategy: string;
  dailyBudget: number;
  insightTagEnabled: boolean;
  leadGenEnabled: boolean;
  leadGenFields: string[];
}

export default function AdSimulationPage() {
  const [matched, params] = useRoute<{ simulationId: string }>('/ad-simulation/:simulationId');
  const simulationId = matched && params ? parseInt(params.simulationId) : null;
  const [, setLocation] = useLocation();
  
  // State for the forms
  const [googleForm, setGoogleForm] = useState<GoogleAdForm>({
    campaignName: "",
    campaignObjective: "website_traffic",
    adGroups: [{ 
      name: "Ad Group 1", 
      keywords: [{ text: "", matchType: "broad" }],
      negativeKeywords: []
    }],
    adCreatives: [{
      headline1: "",
      headline2: "",
      headline3: "",
      description1: "",
      description2: "",
      finalUrl: ""
    }],
    locations: [],
    devices: ["mobile", "desktop", "tablet"],
    bidStrategy: "manual_cpc",
    dailyBudget: 50,
    adExtensions: []
  });

  const [metaForm, setMetaForm] = useState<MetaAdForm>({
    campaignName: "",
    campaignObjective: "traffic",
    adSets: [{
      name: "Ad Set 1",
      targeting: {
        ageRange: ["18-24", "25-34"],
        genders: ["all"],
        interests: [],
        behaviors: [],
        locations: []
      }
    }],
    adCreatives: [{
      headline: "",
      primaryText: "",
      description: "",
      imageUrl: "",
      callToAction: "Learn More",
      destinationUrl: ""
    }],
    placements: ["facebook", "instagram"],
    bidStrategy: "lowest_cost",
    dailyBudget: 50,
    pixelEnabled: false
  });

  const [linkedinForm, setLinkedinForm] = useState<LinkedInAdForm>({
    campaignName: "",
    campaignObjective: "website_visits",
    targeting: {
      jobTitles: [],
      jobFunctions: [],
      industries: [],
      companySize: [],
      seniorityLevel: [],
      locations: []
    },
    adCreatives: [{
      headline: "",
      description: "",
      imageUrl: "",
      callToAction: "Learn More",
      destinationUrl: ""
    }],
    bidStrategy: "maximum_delivery",
    dailyBudget: 50,
    insightTagEnabled: false,
    leadGenEnabled: false,
    leadGenFields: []
  });

  // State for results after submitting
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [activeStep, setActiveStep] = useState<"setup" | "results">("setup");
  const [activePlatformTab, setActivePlatformTab] = useState<string>("google");
  const [activeSetupTab, setActiveSetupTab] = useState<string>("campaign");

  // Fetch the simulation details
  const { data: simulation, isLoading } = useQuery<AdSimulation>({
    queryKey: [`/api/ad-simulations/${simulationId}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!simulationId
  });

  // Set the active platform tab based on the simulation data
  useEffect(() => {
    if (simulation) {
      if (simulation.platform === "google_ads") {
        setActivePlatformTab("google");
      } else if (simulation.platform === "meta_ads") {
        setActivePlatformTab("meta");
      } else if (simulation.platform === "linkedin_ads") {
        setActivePlatformTab("linkedin");
      }

      // Update form defaults based on simulation requirements
      // This is just a placeholder - we'd need to update this based on the actual schema
      if (simulation.platform === "google_ads") {
        setGoogleForm(prev => ({
          ...prev,
          campaignName: `${simulation.title} Campaign`,
          locations: simulation.targetAudience.locations || []
        }));
      } else if (simulation.platform === "meta_ads") {
        setMetaForm(prev => ({
          ...prev,
          campaignName: `${simulation.title} Campaign`,
          adSets: [{
            ...prev.adSets[0],
            targeting: {
              ...prev.adSets[0].targeting,
              locations: simulation.targetAudience.locations || []
            }
          }]
        }));
      } else if (simulation.platform === "linkedin_ads") {
        setLinkedinForm(prev => ({
          ...prev,
          campaignName: `${simulation.title} Campaign`,
          targeting: {
            ...prev.targeting,
            locations: simulation.targetAudience.locations || []
          }
        }));
      }
    }
  }, [simulation]);

  // Handle form submission
  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/ad-simulations/${simulationId}/attempt`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      setSimulationResults(data);
      setActiveStep("results");
      queryClient.invalidateQueries({ queryKey: [`/api/ad-simulations/${simulationId}/attempts`] });
    }
  });

  const handleSubmitGoogle = () => {
    submitMutation.mutate({
      simulationId: simulationId,
      platform: "google_ads",
      campaignName: googleForm.campaignName,
      campaignObjective: googleForm.campaignObjective,
      adGroupStructure: googleForm.adGroups.map(group => ({
        name: group.name,
        targeting: {
          keywords: group.keywords,
          negativeKeywords: group.negativeKeywords
        }
      })),
      targeting: {
        locations: googleForm.locations,
        devices: googleForm.devices
      },
      creatives: googleForm.adCreatives.map(creative => ({
        type: "text",
        headline: `${creative.headline1} | ${creative.headline2} | ${creative.headline3}`,
        description: `${creative.description1}\n${creative.description2}`,
        callToAction: "Learn More",
        destinationUrl: creative.finalUrl
      })),
      bidStrategy: googleForm.bidStrategy,
      dailyBudget: googleForm.dailyBudget,
      platformSpecificSettings: {
        adExtensions: googleForm.adExtensions
      }
    });
  };

  const handleSubmitMeta = () => {
    submitMutation.mutate({
      simulationId: simulationId,
      platform: "meta_ads",
      campaignName: metaForm.campaignName,
      campaignObjective: metaForm.campaignObjective,
      adGroupStructure: metaForm.adSets.map(set => ({
        name: set.name,
        targeting: set.targeting
      })),
      targeting: metaForm.adSets[0].targeting,
      creatives: metaForm.adCreatives.map(creative => ({
        type: "mixed",
        headline: creative.headline,
        description: `${creative.primaryText}\n${creative.description}`,
        imageUrl: creative.imageUrl,
        callToAction: creative.callToAction,
        destinationUrl: creative.destinationUrl
      })),
      bidStrategy: metaForm.bidStrategy,
      dailyBudget: metaForm.dailyBudget,
      platformSpecificSettings: {
        placements: metaForm.placements,
        pixelEnabled: metaForm.pixelEnabled
      }
    });
  };

  const handleSubmitLinkedIn = () => {
    submitMutation.mutate({
      simulationId: simulationId,
      platform: "linkedin_ads",
      campaignName: linkedinForm.campaignName,
      campaignObjective: linkedinForm.campaignObjective,
      adGroupStructure: [{
        name: "Default Group",
        targeting: linkedinForm.targeting
      }],
      targeting: linkedinForm.targeting,
      creatives: linkedinForm.adCreatives.map(creative => ({
        type: "mixed",
        headline: creative.headline,
        description: creative.description,
        imageUrl: creative.imageUrl,
        callToAction: creative.callToAction,
        destinationUrl: creative.destinationUrl
      })),
      bidStrategy: linkedinForm.bidStrategy,
      dailyBudget: linkedinForm.dailyBudget,
      platformSpecificSettings: {
        insightTagEnabled: linkedinForm.insightTagEnabled,
        leadGenEnabled: linkedinForm.leadGenEnabled,
        leadGenFields: linkedinForm.leadGenFields
      }
    });
  };

  const handleSubmit = () => {
    if (activePlatformTab === "google") {
      handleSubmitGoogle();
    } else if (activePlatformTab === "meta") {
      handleSubmitMeta();
    } else if (activePlatformTab === "linkedin") {
      handleSubmitLinkedIn();
    }
  };

  const renderGoogleAdsForm = () => (
    <>
      <Tabs value={activeSetupTab} onValueChange={setActiveSetupTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaign">Campaign</TabsTrigger>
          <TabsTrigger value="adgroups">Ad Groups</TabsTrigger>
          <TabsTrigger value="ads">Ads</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Setup</CardTitle>
              <CardDescription>Configure the basic campaign settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-campaignName">Campaign Name</Label>
                <Input 
                  id="google-campaignName" 
                  value={googleForm.campaignName} 
                  onChange={(e) => setGoogleForm(prev => ({...prev, campaignName: e.target.value}))}
                  placeholder="Enter a name for your campaign"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaignObjective">Campaign Objective</Label>
                <Select 
                  value={googleForm.campaignObjective} 
                  onValueChange={(value) => setGoogleForm(prev => ({...prev, campaignObjective: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="leads">Lead Generation</SelectItem>
                    <SelectItem value="website_traffic">Website Traffic</SelectItem>
                    <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
                    <SelectItem value="app_promotion">App Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Locations</Label>
                <div className="flex flex-wrap gap-2">
                  {simulation?.targetAudience?.locations?.map((location: string, index: number) => (
                    <Badge key={index} variant="outline" className="py-1">
                      <Checkbox 
                        id={`location-${index}`}
                        checked={googleForm.locations.includes(location)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setGoogleForm(prev => ({
                              ...prev, 
                              locations: [...prev.locations, location]
                            }));
                          } else {
                            setGoogleForm(prev => ({
                              ...prev, 
                              locations: prev.locations.filter(loc => loc !== location)
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Devices</Label>
                <div className="flex flex-wrap gap-4">
                  {["mobile", "desktop", "tablet"].map((device, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`device-${device}`}
                        checked={googleForm.devices.includes(device)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setGoogleForm(prev => ({
                              ...prev, 
                              devices: [...prev.devices, device]
                            }));
                          } else {
                            setGoogleForm(prev => ({
                              ...prev, 
                              devices: prev.devices.filter(d => d !== device)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`device-${device}`} className="capitalize">{device}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="adgroups" className="space-y-4">
          {googleForm.adGroups.map((adGroup, groupIndex) => (
            <Card key={groupIndex}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Ad Group {groupIndex + 1}</CardTitle>
                  <CardDescription>Configure keywords and targeting</CardDescription>
                </div>
                {googleForm.adGroups.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setGoogleForm(prev => ({
                        ...prev,
                        adGroups: prev.adGroups.filter((_, i) => i !== groupIndex)
                      }));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`adgroup-name-${groupIndex}`}>Ad Group Name</Label>
                  <Input 
                    id={`adgroup-name-${groupIndex}`} 
                    value={adGroup.name} 
                    onChange={(e) => {
                      const newAdGroups = [...googleForm.adGroups];
                      newAdGroups[groupIndex].name = e.target.value;
                      setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                    }}
                    placeholder="Enter a name for this ad group"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Keywords</Label>
                  {adGroup.keywords.map((keyword, keywordIndex) => (
                    <div key={keywordIndex} className="flex gap-2 mb-2">
                      <Input 
                        value={keyword.text} 
                        onChange={(e) => {
                          const newAdGroups = [...googleForm.adGroups];
                          newAdGroups[groupIndex].keywords[keywordIndex].text = e.target.value;
                          setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                        }}
                        placeholder="Enter a keyword"
                        className="flex-grow"
                      />
                      <Select 
                        value={keyword.matchType} 
                        onValueChange={(value) => {
                          const newAdGroups = [...googleForm.adGroups];
                          newAdGroups[groupIndex].keywords[keywordIndex].matchType = value;
                          setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Match Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="broad">Broad</SelectItem>
                          <SelectItem value="phrase">Phrase</SelectItem>
                          <SelectItem value="exact">Exact</SelectItem>
                        </SelectContent>
                      </Select>
                      {adGroup.keywords.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            const newAdGroups = [...googleForm.adGroups];
                            newAdGroups[groupIndex].keywords = newAdGroups[groupIndex].keywords.filter((_, i) => i !== keywordIndex);
                            setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newAdGroups = [...googleForm.adGroups];
                      newAdGroups[groupIndex].keywords.push({ text: "", matchType: "broad" });
                      setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Keyword
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Negative Keywords</Label>
                  {adGroup.negativeKeywords.map((keyword, keywordIndex) => (
                    <div key={keywordIndex} className="flex gap-2 mb-2">
                      <Input 
                        value={keyword} 
                        onChange={(e) => {
                          const newAdGroups = [...googleForm.adGroups];
                          newAdGroups[groupIndex].negativeKeywords[keywordIndex] = e.target.value;
                          setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                        }}
                        placeholder="Enter a negative keyword"
                        className="flex-grow"
                      />
                      {adGroup.negativeKeywords.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            const newAdGroups = [...googleForm.adGroups];
                            newAdGroups[groupIndex].negativeKeywords = newAdGroups[groupIndex].negativeKeywords.filter((_, i) => i !== keywordIndex);
                            setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newAdGroups = [...googleForm.adGroups];
                      newAdGroups[groupIndex].negativeKeywords.push("");
                      setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Negative Keyword
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              setGoogleForm(prev => ({
                ...prev,
                adGroups: [
                  ...prev.adGroups,
                  {
                    name: `Ad Group ${prev.adGroups.length + 1}`,
                    keywords: [{ text: "", matchType: "broad" }],
                    negativeKeywords: []
                  }
                ]
              }));
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ad Group
          </Button>
        </TabsContent>
        
        <TabsContent value="ads" className="space-y-4">
          {googleForm.adCreatives.map((ad, adIndex) => (
            <Card key={adIndex}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Ad {adIndex + 1}</CardTitle>
                  <CardDescription>Create your responsive search ad</CardDescription>
                </div>
                {googleForm.adCreatives.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setGoogleForm(prev => ({
                        ...prev,
                        adCreatives: prev.adCreatives.filter((_, i) => i !== adIndex)
                      }));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`headline1-${adIndex}`}>Headline 1 (max 30 characters)</Label>
                  <Input 
                    id={`headline1-${adIndex}`} 
                    value={ad.headline1} 
                    onChange={(e) => {
                      const newAds = [...googleForm.adCreatives];
                      newAds[adIndex].headline1 = e.target.value.slice(0, 30);
                      setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                    }}
                    placeholder="Main headline"
                    maxLength={30}
                  />
                  <div className="text-xs text-gray-500 text-right">{ad.headline1.length}/30</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`headline2-${adIndex}`}>Headline 2 (max 30 characters)</Label>
                  <Input 
                    id={`headline2-${adIndex}`} 
                    value={ad.headline2} 
                    onChange={(e) => {
                      const newAds = [...googleForm.adCreatives];
                      newAds[adIndex].headline2 = e.target.value.slice(0, 30);
                      setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                    }}
                    placeholder="Additional headline"
                    maxLength={30}
                  />
                  <div className="text-xs text-gray-500 text-right">{ad.headline2.length}/30</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`headline3-${adIndex}`}>Headline 3 (max 30 characters)</Label>
                  <Input 
                    id={`headline3-${adIndex}`} 
                    value={ad.headline3} 
                    onChange={(e) => {
                      const newAds = [...googleForm.adCreatives];
                      newAds[adIndex].headline3 = e.target.value.slice(0, 30);
                      setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                    }}
                    placeholder="Additional headline"
                    maxLength={30}
                  />
                  <div className="text-xs text-gray-500 text-right">{ad.headline3.length}/30</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`description1-${adIndex}`}>Description 1 (max 90 characters)</Label>
                  <Textarea 
                    id={`description1-${adIndex}`} 
                    value={ad.description1} 
                    onChange={(e) => {
                      const newAds = [...googleForm.adCreatives];
                      newAds[adIndex].description1 = e.target.value.slice(0, 90);
                      setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                    }}
                    placeholder="Main description"
                    maxLength={90}
                  />
                  <div className="text-xs text-gray-500 text-right">{ad.description1.length}/90</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`description2-${adIndex}`}>Description 2 (max 90 characters)</Label>
                  <Textarea 
                    id={`description2-${adIndex}`} 
                    value={ad.description2} 
                    onChange={(e) => {
                      const newAds = [...googleForm.adCreatives];
                      newAds[adIndex].description2 = e.target.value.slice(0, 90);
                      setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                    }}
                    placeholder="Additional description"
                    maxLength={90}
                  />
                  <div className="text-xs text-gray-500 text-right">{ad.description2.length}/90</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`finalUrl-${adIndex}`}>Final URL</Label>
                  <Input 
                    id={`finalUrl-${adIndex}`} 
                    value={ad.finalUrl} 
                    onChange={(e) => {
                      const newAds = [...googleForm.adCreatives];
                      newAds[adIndex].finalUrl = e.target.value;
                      setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                    }}
                    placeholder="https://www.example.com"
                  />
                </div>
                
                <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Ad Preview</h4>
                  <div className="space-y-1">
                    <div className="text-blue-600 font-medium">
                      {ad.headline1 || "Main Headline"} | {ad.headline2 || "Second Headline"} | {ad.headline3 || "Third Headline"}
                    </div>
                    <div className="text-green-700 text-sm">
                      {ad.finalUrl ? ad.finalUrl.replace(/^https?:\/\//, "") : "www.example.com"}
                    </div>
                    <div className="text-gray-700 text-sm">
                      {ad.description1 || "Main description goes here to explain more about your product or service."} {ad.description2 || "Additional information for your customers."}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              setGoogleForm(prev => ({
                ...prev,
                adCreatives: [
                  ...prev.adCreatives,
                  {
                    headline1: "",
                    headline2: "",
                    headline3: "",
                    description1: "",
                    description2: "",
                    finalUrl: ""
                  }
                ]
              }));
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ad Creative
          </Button>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
              <CardDescription>Set your bidding and budget</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bidStrategy">Bid Strategy</Label>
                <Select 
                  value={googleForm.bidStrategy} 
                  onValueChange={(value) => setGoogleForm(prev => ({...prev, bidStrategy: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bid strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual_cpc">Manual CPC</SelectItem>
                    <SelectItem value="maximize_clicks">Maximize Clicks</SelectItem>
                    <SelectItem value="target_cpa">Target CPA</SelectItem>
                    <SelectItem value="maximize_conversions">Maximize Conversions</SelectItem>
                    <SelectItem value="target_roas">Target ROAS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dailyBudget">Daily Budget (USD)</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[googleForm.dailyBudget]} 
                    min={5} 
                    max={500} 
                    step={5}
                    onValueChange={(value) => setGoogleForm(prev => ({...prev, dailyBudget: value[0]}))}
                    className="flex-grow"
                  />
                  <Input 
                    type="number" 
                    value={googleForm.dailyBudget} 
                    onChange={(e) => setGoogleForm(prev => ({...prev, dailyBudget: parseInt(e.target.value) || 0}))}
                    className="w-20"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Ad Extensions</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setGoogleForm(prev => ({
                      ...prev,
                      adExtensions: [
                        ...prev.adExtensions,
                        { type: "sitelink", content: "" }
                      ]
                    }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Extension
                </Button>
                
                {googleForm.adExtensions.map((extension, extensionIndex) => (
                  <div key={extensionIndex} className="flex gap-2 mt-2">
                    <Select 
                      value={extension.type} 
                      onValueChange={(value) => {
                        const newExtensions = [...googleForm.adExtensions];
                        newExtensions[extensionIndex].type = value;
                        setGoogleForm(prev => ({...prev, adExtensions: newExtensions}));
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Extension Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sitelink">Sitelink</SelectItem>
                        <SelectItem value="callout">Callout</SelectItem>
                        <SelectItem value="structured_snippet">Structured Snippet</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      value={extension.content} 
                      onChange={(e) => {
                        const newExtensions = [...googleForm.adExtensions];
                        newExtensions[extensionIndex].content = e.target.value;
                        setGoogleForm(prev => ({...prev, adExtensions: newExtensions}));
                      }}
                      placeholder="Extension content"
                      className="flex-grow"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setGoogleForm(prev => ({
                          ...prev,
                          adExtensions: prev.adExtensions.filter((_, i) => i !== extensionIndex)
                        }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
  
  const renderMetaAdsForm = () => (
    <>
      <Tabs value={activeSetupTab} onValueChange={setActiveSetupTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaign">Campaign</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Setup</CardTitle>
              <CardDescription>Configure the basic campaign settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-campaignName">Campaign Name</Label>
                <Input 
                  id="meta-campaignName" 
                  value={metaForm.campaignName} 
                  onChange={(e) => setMetaForm(prev => ({...prev, campaignName: e.target.value}))}
                  placeholder="Enter a name for your campaign"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaignObjective">Campaign Objective</Label>
                <Select 
                  value={metaForm.campaignObjective} 
                  onValueChange={(value) => setMetaForm(prev => ({...prev, campaignObjective: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="app_installs">App Installs</SelectItem>
                    <SelectItem value="lead_generation">Lead Generation</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="catalog_sales">Catalog Sales</SelectItem>
                    <SelectItem value="store_traffic">Store Traffic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Placements</Label>
                <div className="flex flex-wrap gap-4">
                  {["facebook", "instagram", "messenger", "audience_network"].map((placement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`placement-${placement}`}
                        checked={metaForm.placements.includes(placement)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setMetaForm(prev => ({
                              ...prev, 
                              placements: [...prev.placements, placement]
                            }));
                          } else {
                            setMetaForm(prev => ({
                              ...prev, 
                              placements: prev.placements.filter(p => p !== placement)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`placement-${placement}`} className="capitalize">
                        {placement.replace("_", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="targeting" className="space-y-4">
          {metaForm.adSets.map((adSet, adSetIndex) => (
            <Card key={adSetIndex}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Ad Set {adSetIndex + 1}</CardTitle>
                  <CardDescription>Configure audience targeting</CardDescription>
                </div>
                {metaForm.adSets.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setMetaForm(prev => ({
                        ...prev,
                        adSets: prev.adSets.filter((_, i) => i !== adSetIndex)
                      }));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`adset-name-${adSetIndex}`}>Ad Set Name</Label>
                  <Input 
                    id={`adset-name-${adSetIndex}`} 
                    value={adSet.name} 
                    onChange={(e) => {
                      const newAdSets = [...metaForm.adSets];
                      newAdSets[adSetIndex].name = e.target.value;
                      setMetaForm(prev => ({...prev, adSets: newAdSets}));
                    }}
                    placeholder="Enter a name for this ad set"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <div className="flex flex-wrap gap-2">
                    {["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"].map((age, index) => (
                      <Badge key={index} variant="outline" className="py-1">
                        <Checkbox 
                          id={`age-${index}`}
                          checked={adSet.targeting.ageRange.includes(age)}
                          onCheckedChange={(checked) => {
                            const newAdSets = [...metaForm.adSets];
                            if (checked) {
                              newAdSets[adSetIndex].targeting.ageRange.push(age);
                            } else {
                              newAdSets[adSetIndex].targeting.ageRange = newAdSets[adSetIndex].targeting.ageRange.filter(a => a !== age);
                            }
                            setMetaForm(prev => ({...prev, adSets: newAdSets}));
                          }}
                          className="mr-2"
                        />
                        {age}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup 
                    value={adSet.targeting.genders[0] || "all"}
                    onValueChange={(value) => {
                      const newAdSets = [...metaForm.adSets];
                      newAdSets[adSetIndex].targeting.genders = [value];
                      setMetaForm(prev => ({...prev, adSets: newAdSets}));
                    }}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id={`gender-all-${adSetIndex}`} />
                      <Label htmlFor={`gender-all-${adSetIndex}`}>All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id={`gender-male-${adSetIndex}`} />
                      <Label htmlFor={`gender-male-${adSetIndex}`}>Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id={`gender-female-${adSetIndex}`} />
                      <Label htmlFor={`gender-female-${adSetIndex}`}>Female</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Locations</Label>
                  <div className="flex flex-wrap gap-2">
                    {simulation?.targetAudience?.locations?.map((location: string, index: number) => (
                      <Badge key={index} variant="outline" className="py-1">
                        <Checkbox 
                          id={`location-meta-${index}`}
                          checked={adSet.targeting.locations.includes(location)}
                          onCheckedChange={(checked) => {
                            const newAdSets = [...metaForm.adSets];
                            if (checked) {
                              newAdSets[adSetIndex].targeting.locations.push(location);
                            } else {
                              newAdSets[adSetIndex].targeting.locations = newAdSets[adSetIndex].targeting.locations.filter(loc => loc !== location);
                            }
                            setMetaForm(prev => ({...prev, adSets: newAdSets}));
                          }}
                          className="mr-2"
                        />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    <Input 
                      placeholder="Add an interest and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          const newAdSets = [...metaForm.adSets];
                          newAdSets[adSetIndex].targeting.interests.push(e.currentTarget.value.trim());
                          setMetaForm(prev => ({...prev, adSets: newAdSets}));
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {adSet.targeting.interests.map((interest, interestIndex) => (
                      <Badge key={interestIndex} variant="secondary" className="py-1">
                        {interest}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 ml-2"
                          onClick={() => {
                            const newAdSets = [...metaForm.adSets];
                            newAdSets[adSetIndex].targeting.interests = newAdSets[adSetIndex].targeting.interests.filter((_, i) => i !== interestIndex);
                            setMetaForm(prev => ({...prev, adSets: newAdSets}));
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              setMetaForm(prev => ({
                ...prev,
                adSets: [
                  ...prev.adSets,
                  {
                    name: `Ad Set ${prev.adSets.length + 1}`,
                    targeting: {
                      ageRange: ["18-24", "25-34"],
                      genders: ["all"],
                      interests: [],
                      behaviors: [],
                      locations: []
                    }
                  }
                ]
              }));
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ad Set
          </Button>
        </TabsContent>
        
        <TabsContent value="creatives" className="space-y-4">
          {metaForm.adCreatives.map((creative, creativeIndex) => (
            <Card key={creativeIndex}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Ad Creative {creativeIndex + 1}</CardTitle>
                  <CardDescription>Design your ad content</CardDescription>
                </div>
                {metaForm.adCreatives.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setMetaForm(prev => ({
                        ...prev,
                        adCreatives: prev.adCreatives.filter((_, i) => i !== creativeIndex)
                      }));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`headline-${creativeIndex}`}>Headline (max 40 characters)</Label>
                  <Input 
                    id={`headline-${creativeIndex}`} 
                    value={creative.headline} 
                    onChange={(e) => {
                      const newCreatives = [...metaForm.adCreatives];
                      newCreatives[creativeIndex].headline = e.target.value.slice(0, 40);
                      setMetaForm(prev => ({...prev, adCreatives: newCreatives}));
                    }}
                    placeholder="Enter an attention-grabbing headline"
                    maxLength={40}
                  />
                  <div className="text-xs text-gray-500 text-right">{creative.headline.length}/40</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`primaryText-${creativeIndex}`}>Primary Text (max 125 characters)</Label>
                  <Textarea 
                    id={`primaryText-${creativeIndex}`} 
                    value={creative.primaryText} 
                    onChange={(e) => {
                      const newCreatives = [...metaForm.adCreatives];
                      newCreatives[creativeIndex].primaryText = e.target.value.slice(0, 125);
                      setMetaForm(prev => ({...prev, adCreatives: newCreatives}));
                    }}
                    placeholder="Enter the main ad copy"
                    maxLength={125}
                  />
                  <div className="text-xs text-gray-500 text-right">{creative.primaryText.length}/125</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`description-${creativeIndex}`}>Description (max 30 characters)</Label>
                  <Input 
                    id={`description-${creativeIndex}`} 
                    value={creative.description} 
                    onChange={(e) => {
                      const newCreatives = [...metaForm.adCreatives];
                      newCreatives[creativeIndex].description = e.target.value.slice(0, 30);
                      setMetaForm(prev => ({...prev, adCreatives: newCreatives}));
                    }}
                    placeholder="Additional description"
                    maxLength={30}
                  />
                  <div className="text-xs text-gray-500 text-right">{creative.description.length}/30</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`imageUrl-${creativeIndex}`}>Image URL</Label>
                  <Input 
                    id={`imageUrl-${creativeIndex}`} 
                    value={creative.imageUrl} 
                    onChange={(e) => {
                      const newCreatives = [...metaForm.adCreatives];
                      newCreatives[creativeIndex].imageUrl = e.target.value;
                      setMetaForm(prev => ({...prev, adCreatives: newCreatives}));
                    }}
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`callToAction-${creativeIndex}`}>Call to Action</Label>
                  <Select 
                    value={creative.callToAction} 
                    onValueChange={(value) => {
                      const newCreatives = [...metaForm.adCreatives];
                      newCreatives[creativeIndex].callToAction = value;
                      setMetaForm(prev => ({...prev, adCreatives: newCreatives}));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a call to action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Learn More">Learn More</SelectItem>
                      <SelectItem value="Shop Now">Shop Now</SelectItem>
                      <SelectItem value="Sign Up">Sign Up</SelectItem>
                      <SelectItem value="Book Now">Book Now</SelectItem>
                      <SelectItem value="Download">Download</SelectItem>
                      <SelectItem value="Apply Now">Apply Now</SelectItem>
                      <SelectItem value="Contact Us">Contact Us</SelectItem>
                      <SelectItem value="Get Offer">Get Offer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`destinationUrl-${creativeIndex}`}>Destination URL</Label>
                  <Input 
                    id={`destinationUrl-${creativeIndex}`} 
                    value={creative.destinationUrl} 
                    onChange={(e) => {
                      const newCreatives = [...metaForm.adCreatives];
                      newCreatives[creativeIndex].destinationUrl = e.target.value;
                      setMetaForm(prev => ({...prev, adCreatives: newCreatives}));
                    }}
                    placeholder="https://www.example.com"
                  />
                </div>
                
                <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Ad Preview</h4>
                  {creative.imageUrl && (
                    <div className="mb-3 bg-gray-200 rounded-lg w-full aspect-[1.91/1] flex items-center justify-center text-gray-500">
                      {creative.imageUrl.startsWith('http') ? (
                        <img src={creative.imageUrl} alt="Ad preview" className="rounded-lg w-full h-full object-cover" />
                      ) : (
                        <div>Image Preview (URL required)</div>
                      )}
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Your Page Name</div>
                    <div className="text-sm">{creative.primaryText || "Your primary text will appear here to engage your audience and explain what you're offering."}</div>
                    <div className="font-medium text-blue-600">{creative.headline || "Your Headline Will Appear Here"}</div>
                    <div className="text-sm text-gray-700">{creative.description || "Additional description"}</div>
                    <div className="mt-2">
                      <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                        {creative.callToAction}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              setMetaForm(prev => ({
                ...prev,
                adCreatives: [
                  ...prev.adCreatives,
                  {
                    headline: "",
                    primaryText: "",
                    description: "",
                    imageUrl: "",
                    callToAction: "Learn More",
                    destinationUrl: ""
                  }
                ]
              }));
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ad Creative
          </Button>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
              <CardDescription>Set your bidding and budget</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bidStrategy">Bid Strategy</Label>
                <Select 
                  value={metaForm.bidStrategy} 
                  onValueChange={(value) => setMetaForm(prev => ({...prev, bidStrategy: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bid strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lowest_cost">Lowest Cost</SelectItem>
                    <SelectItem value="cost_cap">Cost Cap</SelectItem>
                    <SelectItem value="bid_cap">Bid Cap</SelectItem>
                    <SelectItem value="target_cost">Target Cost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dailyBudget">Daily Budget (USD)</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[metaForm.dailyBudget]} 
                    min={1} 
                    max={500} 
                    step={1}
                    onValueChange={(value) => setMetaForm(prev => ({...prev, dailyBudget: value[0]}))}
                    className="flex-grow"
                  />
                  <Input 
                    type="number" 
                    value={metaForm.dailyBudget} 
                    onChange={(e) => setMetaForm(prev => ({...prev, dailyBudget: parseInt(e.target.value) || 0}))}
                    className="w-20"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta-pixel">Meta Pixel</Label>
                  <Switch 
                    id="meta-pixel" 
                    checked={metaForm.pixelEnabled}
                    onCheckedChange={(checked) => setMetaForm(prev => ({...prev, pixelEnabled: checked}))}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Meta Pixel helps you track conversions from Facebook ads, optimize ads based on collected data, build targeted audiences, and remarket to people who have already taken some action on your website.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
  
  const renderLinkedInAdsForm = () => (
    <>
      <Tabs value={activeSetupTab} onValueChange={setActiveSetupTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaign">Campaign</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Setup</CardTitle>
              <CardDescription>Configure the basic campaign settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin-campaignName">Campaign Name</Label>
                <Input 
                  id="linkedin-campaignName" 
                  value={linkedinForm.campaignName} 
                  onChange={(e) => setLinkedinForm(prev => ({...prev, campaignName: e.target.value}))}
                  placeholder="Enter a name for your campaign"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaignObjective">Campaign Objective</Label>
                <Select 
                  value={linkedinForm.campaignObjective} 
                  onValueChange={(value) => setLinkedinForm(prev => ({...prev, campaignObjective: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
                    <SelectItem value="website_visits">Website Visits</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="video_views">Video Views</SelectItem>
                    <SelectItem value="lead_generation">Lead Generation</SelectItem>
                    <SelectItem value="website_conversions">Website Conversions</SelectItem>
                    <SelectItem value="job_applicants">Job Applicants</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="targeting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Targeting</CardTitle>
              <CardDescription>Define your B2B audience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company Size</Label>
                <div className="flex flex-wrap gap-2">
                  {["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10001+"].map((size, index) => (
                    <Badge key={index} variant="outline" className="py-1">
                      <Checkbox 
                        id={`company-size-${index}`}
                        checked={linkedinForm.targeting.companySize.includes(size)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setLinkedinForm(prev => ({
                              ...prev, 
                              targeting: {
                                ...prev.targeting,
                                companySize: [...prev.targeting.companySize, size]
                              }
                            }));
                          } else {
                            setLinkedinForm(prev => ({
                              ...prev, 
                              targeting: {
                                ...prev.targeting,
                                companySize: prev.targeting.companySize.filter(s => s !== size)
                              }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Job Functions</Label>
                <div className="flex flex-wrap gap-2">
                  {["Information Technology", "Marketing", "Sales", "Operations", "Finance", "Human Resources", "Engineering", "Business Development", "Administrative", "Research", "Education", "Consulting", "Media and Communication"].map((func, index) => (
                    <Badge key={index} variant="outline" className="py-1">
                      <Checkbox 
                        id={`job-function-${index}`}
                        checked={linkedinForm.targeting.jobFunctions.includes(func)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setLinkedinForm(prev => ({
                              ...prev, 
                              targeting: {
                                ...prev.targeting,
                                jobFunctions: [...prev.targeting.jobFunctions, func]
                              }
                            }));
                          } else {
                            setLinkedinForm(prev => ({
                              ...prev, 
                              targeting: {
                                ...prev.targeting,
                                jobFunctions: prev.targeting.jobFunctions.filter(f => f !== func)
                              }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      {func}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Seniority Level</Label>
                <div className="flex flex-wrap gap-2">
                  {["Entry", "Senior", "Manager", "Director", "VP", "CXO", "Owner", "Partner", "Training"].map((level, index) => (
                    <Badge key={index} variant="outline" className="py-1">
                      <Checkbox 
                        id={`seniority-${index}`}
                        checked={linkedinForm.targeting.seniorityLevel.includes(level)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setLinkedinForm(prev => ({
                              ...prev, 
                              targeting: {
                                ...prev.targeting,
                                seniorityLevel: [...prev.targeting.seniorityLevel, level]
                              }
                            }));
                          } else {
                            setLinkedinForm(prev => ({
                              ...prev, 
                              targeting: {
                                ...prev.targeting,
                                seniorityLevel: prev.targeting.seniorityLevel.filter(l => l !== level)
                              }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Industries</Label>
                <div className="flex flex-wrap gap-2">
                  <Input 
                    placeholder="Add an industry and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault();
                        setLinkedinForm(prev => ({
                          ...prev, 
                          targeting: {
                            ...prev.targeting,
                            industries: [...prev.targeting.industries, e.currentTarget.value.trim()]
                          }
                        }));
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {linkedinForm.targeting.industries.map((industry, industryIndex) => (
                    <Badge key={industryIndex} variant="secondary" className="py-1">
                      {industry}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-2"
                        onClick={() => {
                          setLinkedinForm(prev => ({
                            ...prev, 
                            targeting: {
                              ...prev.targeting,
                              industries: prev.targeting.industries.filter((_, i) => i !== industryIndex)
                            }
                          }));
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Job Titles</Label>
                <div className="flex flex-wrap gap-2">
                  <Input 
                    placeholder="Add a job title and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault();
                        setLinkedinForm(prev => ({
                          ...prev, 
                          targeting: {
                            ...prev.targeting,
                            jobTitles: [...prev.targeting.jobTitles, e.currentTarget.value.trim()]
                          }
                        }));
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {linkedinForm.targeting.jobTitles.map((title, titleIndex) => (
                    <Badge key={titleIndex} variant="secondary" className="py-1">
                      {title}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-2"
                        onClick={() => {
                          setLinkedinForm(prev => ({
                            ...prev, 
                            targeting: {
                              ...prev.targeting,
                              jobTitles: prev.targeting.jobTitles.filter((_, i) => i !== titleIndex)
                            }
                          }));
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Locations</Label>
                <div className="flex flex-wrap gap-2">
                  {simulation?.targetAudience?.locations?.map((location: string, index: number) => (
                    <Badge key={index} variant="outline" className="py-1">
                      <Checkbox 
                        id={`location-linkedin-${index}`}
                        checked={linkedinForm.targeting.locations.includes(location)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setLinkedinForm(prev => ({
                              ...prev, 
                              targeting: {
                                ...prev.targeting,
                                locations: [...prev.targeting.locations, location]
                              }
                            }));
                          } else {
                            setLinkedinForm(prev => ({
                              ...prev, 
                              targeting: {
                                ...prev.targeting,
                                locations: prev.targeting.locations.filter(loc => loc !== location)
                              }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="creatives" className="space-y-4">
          {linkedinForm.adCreatives.map((creative, creativeIndex) => (
            <Card key={creativeIndex}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Ad Creative {creativeIndex + 1}</CardTitle>
                  <CardDescription>Design your professional ad content</CardDescription>
                </div>
                {linkedinForm.adCreatives.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setLinkedinForm(prev => ({
                        ...prev,
                        adCreatives: prev.adCreatives.filter((_, i) => i !== creativeIndex)
                      }));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`headline-linkedin-${creativeIndex}`}>Headline (max 150 characters)</Label>
                  <Input 
                    id={`headline-linkedin-${creativeIndex}`} 
                    value={creative.headline} 
                    onChange={(e) => {
                      const newCreatives = [...linkedinForm.adCreatives];
                      newCreatives[creativeIndex].headline = e.target.value.slice(0, 150);
                      setLinkedinForm(prev => ({...prev, adCreatives: newCreatives}));
                    }}
                    placeholder="Enter a professional headline"
                    maxLength={150}
                  />
                  <div className="text-xs text-gray-500 text-right">{creative.headline.length}/150</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`description-linkedin-${creativeIndex}`}>Description (max 600 characters)</Label>
                  <Textarea 
                    id={`description-linkedin-${creativeIndex}`} 
                    value={creative.description} 
                    onChange={(e) => {
                      const newCreatives = [...linkedinForm.adCreatives];
                      newCreatives[creativeIndex].description = e.target.value.slice(0, 600);
                      setLinkedinForm(prev => ({...prev, adCreatives: newCreatives}));
                    }}
                    placeholder="Enter a professional description"
                    maxLength={600}
                  />
                  <div className="text-xs text-gray-500 text-right">{creative.description.length}/600</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`imageUrl-linkedin-${creativeIndex}`}>Image URL</Label>
                  <Input 
                    id={`imageUrl-linkedin-${creativeIndex}`} 
                    value={creative.imageUrl} 
                    onChange={(e) => {
                      const newCreatives = [...linkedinForm.adCreatives];
                      newCreatives[creativeIndex].imageUrl = e.target.value;
                      setLinkedinForm(prev => ({...prev, adCreatives: newCreatives}));
                    }}
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`callToAction-linkedin-${creativeIndex}`}>Call to Action</Label>
                  <Select 
                    value={creative.callToAction} 
                    onValueChange={(value) => {
                      const newCreatives = [...linkedinForm.adCreatives];
                      newCreatives[creativeIndex].callToAction = value;
                      setLinkedinForm(prev => ({...prev, adCreatives: newCreatives}));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a call to action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Learn More">Learn More</SelectItem>
                      <SelectItem value="Sign Up">Sign Up</SelectItem>
                      <SelectItem value="Register">Register</SelectItem>
                      <SelectItem value="Subscribe">Subscribe</SelectItem>
                      <SelectItem value="Download">Download</SelectItem>
                      <SelectItem value="Apply Now">Apply Now</SelectItem>
                      <SelectItem value="Request Demo">Request Demo</SelectItem>
                      <SelectItem value="Contact Us">Contact Us</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`destinationUrl-linkedin-${creativeIndex}`}>Destination URL</Label>
                  <Input 
                    id={`destinationUrl-linkedin-${creativeIndex}`} 
                    value={creative.destinationUrl} 
                    onChange={(e) => {
                      const newCreatives = [...linkedinForm.adCreatives];
                      newCreatives[creativeIndex].destinationUrl = e.target.value;
                      setLinkedinForm(prev => ({...prev, adCreatives: newCreatives}));
                    }}
                    placeholder="https://www.example.com"
                  />
                </div>
                
                <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Ad Preview</h4>
                  <div className="text-sm text-gray-500 mb-1">Your Company Name</div>
                  <div className="text-sm text-gray-500 mb-3">Sponsored</div>
                  {creative.imageUrl && (
                    <div className="mb-3 bg-gray-200 rounded-lg w-full aspect-video flex items-center justify-center text-gray-500">
                      {creative.imageUrl.startsWith('http') ? (
                        <img src={creative.imageUrl} alt="Ad preview" className="rounded-lg w-full h-full object-cover" />
                      ) : (
                        <div>Image Preview (URL required)</div>
                      )}
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="font-medium">{creative.headline || "Your Professional Headline Will Appear Here"}</div>
                    <div className="text-sm">{creative.description || "Your professional description will appear here. LinkedIn ads typically feature longer-form content that establishes expertise and credibility with a B2B audience."}</div>
                    <div className="mt-2">
                      <Badge className="bg-blue-700 hover:bg-blue-800 text-white">
                        {creative.callToAction}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              setLinkedinForm(prev => ({
                ...prev,
                adCreatives: [
                  ...prev.adCreatives,
                  {
                    headline: "",
                    description: "",
                    imageUrl: "",
                    callToAction: "Learn More",
                    destinationUrl: ""
                  }
                ]
              }));
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ad Creative
          </Button>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
              <CardDescription>Set your bidding and budget</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bidStrategy">Bid Strategy</Label>
                <Select 
                  value={linkedinForm.bidStrategy} 
                  onValueChange={(value) => setLinkedinForm(prev => ({...prev, bidStrategy: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bid strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maximum_delivery">Maximum Delivery</SelectItem>
                    <SelectItem value="target_cost">Target Cost</SelectItem>
                    <SelectItem value="manual_bidding">Manual Bidding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dailyBudget">Daily Budget (USD)</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[linkedinForm.dailyBudget]} 
                    min={10} 
                    max={500} 
                    step={5}
                    onValueChange={(value) => setLinkedinForm(prev => ({...prev, dailyBudget: value[0]}))}
                    className="flex-grow"
                  />
                  <Input 
                    type="number" 
                    value={linkedinForm.dailyBudget} 
                    onChange={(e) => setLinkedinForm(prev => ({...prev, dailyBudget: parseInt(e.target.value) || 0}))}
                    className="w-20"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="linkedin-insightTag">LinkedIn Insight Tag</Label>
                  <Switch 
                    id="linkedin-insightTag" 
                    checked={linkedinForm.insightTagEnabled}
                    onCheckedChange={(checked) => setLinkedinForm(prev => ({...prev, insightTagEnabled: checked}))}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  The LinkedIn Insight Tag is a lightweight JavaScript tag that powers conversion tracking, retargeting, and web analytics for LinkedIn ad campaigns.
                </p>
              </div>
              
              {linkedinForm.campaignObjective === "lead_generation" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="linkedin-leadGenForms">Lead Gen Forms</Label>
                    <Switch 
                      id="linkedin-leadGenForms" 
                      checked={linkedinForm.leadGenEnabled}
                      onCheckedChange={(checked) => setLinkedinForm(prev => ({...prev, leadGenEnabled: checked}))}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    LinkedIn Lead Gen Forms auto-populate with a LinkedIn member's profile data, making it easy for them to submit their information.
                  </p>
                  
                  {linkedinForm.leadGenEnabled && (
                    <div className="mt-4 space-y-2">
                      <Label>Lead Form Fields</Label>
                      <div className="flex flex-wrap gap-2">
                        {["First Name", "Last Name", "Email", "Phone", "Job Title", "Company", "Industry", "Company Size", "Location", "Work Email"].map((field, index) => (
                          <Badge key={index} variant="outline" className="py-1">
                            <Checkbox 
                              id={`lead-field-${index}`}
                              checked={linkedinForm.leadGenFields.includes(field)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setLinkedinForm(prev => ({
                                    ...prev, 
                                    leadGenFields: [...prev.leadGenFields, field]
                                  }));
                                } else {
                                  setLinkedinForm(prev => ({
                                    ...prev, 
                                    leadGenFields: prev.leadGenFields.filter(f => f !== field)
                                  }));
                                }
                              }}
                              className="mr-2"
                            />
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
  
  const renderAdPlatformForm = () => {
    switch (activePlatformTab) {
      case "google":
        return renderGoogleAdsForm();
      case "meta":
        return renderMetaAdsForm();
      case "linkedin":
        return renderLinkedInAdsForm();
      default:
        return renderGoogleAdsForm();
    }
  };
  
  const renderSimulationResults = () => {
    if (!simulationResults) return null;
    
    const { score, feedback, metrics } = simulationResults;
    
    return (
      <div className="space-y-6">
        <Card className="border-none shadow-none bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full p-4 bg-gray-100 mb-4">
                {score >= 70 ? (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                ) : score >= 40 ? (
                  <Info className="h-12 w-12 text-amber-500" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-red-500" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {score >= 70 ? "Great job!" : score >= 40 ? "Good effort!" : "Needs improvement"}
              </h3>
              <p className="text-gray-600 mb-4">Your score: {score}/100</p>
              <div className="flex justify-center">
                <Badge className={`px-3 py-1 text-sm ${
                  score >= 70 ? "bg-green-100 text-green-800" : 
                  score >= 40 ? "bg-amber-100 text-amber-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {score >= 70 ? "Successful" : score >= 40 ? "Partially Successful" : "Unsuccessful"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>How your campaign would perform based on your settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Impressions</div>
                <div className="text-2xl font-bold">{metrics.impressions?.toLocaleString() || 0}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Clicks</div>
                <div className="text-2xl font-bold">{metrics.clicks?.toLocaleString() || 0}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">CTR</div>
                <div className="text-2xl font-bold">{metrics.ctr?.toFixed(2) || 0}%</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Avg. CPC</div>
                <div className="text-2xl font-bold">${metrics.cpc?.toFixed(2) || 0}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Conversions</div>
                <div className="text-2xl font-bold">{metrics.conversions?.toLocaleString() || 0}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Conv. Rate</div>
                <div className="text-2xl font-bold">{metrics.conversionRate?.toFixed(2) || 0}%</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Cost/Conv.</div>
                <div className="text-2xl font-bold">${metrics.costPerConversion?.toFixed(2) || 0}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Cost</div>
                <div className="text-2xl font-bold">${metrics.cost?.toFixed(2) || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Feedback & Analysis</CardTitle>
            <CardDescription>Learn what worked and what could be improved</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.map((item: string, index: number) => (
              <Alert key={index} variant="default" className="bg-gray-50">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <AlertTitle className="text-sm font-medium text-gray-900">Feedback Point {index + 1}</AlertTitle>
                    <AlertDescription className="text-sm text-gray-700 mt-1">
                      {item}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveStep("setup")}>
              Edit Campaign
            </Button>
            <Button variant="default" onClick={() => setLocation("/ad-simulations")}>
              Try Another Simulation
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Project objectives reference card component
  const ProjectObjectivesCard = () => {
    if (!simulation) return null;
    
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Project Goals & Objectives</CardTitle>
          <CardDescription>Reference these goals while creating your campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="text-sm">
            <p className="font-medium">Objectives:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {simulation.objectives.map((obj: string, index: number) => (
                <li key={index}>{obj}</li>
              ))}
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-medium">Success Criteria:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {simulation.successCriteria && Array.isArray(simulation.successCriteria) ? 
                simulation.successCriteria.map((criteria: any, index: number) => (
                  <li key={index}>
                    {typeof criteria === 'object' && criteria.metric ? 
                      `${criteria.metric}: ${criteria.comparison === "greater" ? ">" : criteria.comparison === "less" ? "<" : "="} ${criteria.target}` : 
                      String(criteria)
                    }
                  </li>
                )) : 
                <li>Please refer to the project objectives above</li>
              }
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{simulation?.title}</h1>
        <p className="text-gray-600 mb-4">{simulation?.scenarioDescription}</p>
        <div className="flex items-center gap-3">
          <Badge variant="outline">{simulation?.industry} Industry</Badge>
          <Badge variant="outline" className={`capitalize ${
            simulation?.difficulty === "beginner" ? "bg-green-100 text-green-800" :
            simulation?.difficulty === "intermediate" ? "bg-blue-100 text-blue-800" :
            simulation?.difficulty === "advanced" ? "bg-purple-100 text-purple-800" :
            "bg-red-100 text-red-800"
          }`}>
            {simulation?.difficulty} Level
          </Badge>
        </div>
      </div>
      
      {activeStep !== "setup" && (
        <div className="mb-6">
          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Business Details</h3>
            <p className="text-gray-600 mb-3">{simulation?.businessType}</p>
            
            <h3 className="text-lg font-medium mb-2">Objectives</h3>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              {simulation?.objectives.map((obj: string, index: number) => (
                <li key={index} className="text-gray-600">{obj}</li>
              ))}
            </ul>
            
            <h3 className="text-lg font-medium mb-2">Success Criteria</h3>
            <ul className="list-disc pl-5 space-y-1">
              {simulation?.successCriteria && Array.isArray(simulation.successCriteria) ? 
                simulation.successCriteria.map((criteria: any, index: number) => (
                  <li key={index} className="text-gray-600">
                    {typeof criteria === 'object' && criteria.metric ? 
                      `${criteria.metric}: ${criteria.comparison === "greater" ? ">" : criteria.comparison === "less" ? "<" : "="} ${criteria.target}` : 
                      String(criteria)
                    }
                  </li>
                )) : 
                <li className="text-gray-600">Please refer to campaign details</li>
              }
            </ul>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <Tabs value={activePlatformTab} onValueChange={setActivePlatformTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="google" disabled={simulation?.platform !== "google_ads" && simulation?.platform !== undefined}>Google Ads</TabsTrigger>
            <TabsTrigger value="meta" disabled={simulation?.platform !== "meta_ads" && simulation?.platform !== undefined}>Meta Ads</TabsTrigger>
            <TabsTrigger value="linkedin" disabled={simulation?.platform !== "linkedin_ads" && simulation?.platform !== undefined}>LinkedIn Ads</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeStep === "setup" ? (
        <>
          <ProjectObjectivesCard />
          {renderAdPlatformForm()}
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={submitMutation.isPending}
              className="min-w-[150px]"
            >
              {submitMutation.isPending ? "Submitting..." : "Launch Campaign"}
            </Button>
          </div>
        </>
      ) : (
        renderSimulationResults()
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { InstructorToolGuide } from "@/components/InstructorToolGuide";
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
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  ArrowRight, 
  ArrowLeft,
  Plus, 
  Trash2,
  Sparkles,
  Brain,
  ShieldAlert,
  ShieldCheck,
  Zap,
  TrendingUp,
  RefreshCw,
  Target,
  Coffee,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  Eye,
  Lightbulb
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { AdPlatformSimulation } from "@shared/schema";
import { EmergencyCrisisModal, CrisisOption } from "@/components/EmergencyCrisisModal";
import { FlightInstructorCopilot } from "@/components/FlightInstructorCopilot";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

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

const bossCrisisOptions: CrisisOption[] = [
  {
    text: "Option A: Immediately pause leaking broad-match keywords, deploy an emergency negative keyword shield (-free, -cheap, -diy, -jobs, -dentures), switch to Phrase & Exact match on high-intent terms like '[emergency dentist near me]', and draft a client credit memo for the wasted spend.",
    isCorrect: true,
    feedback: "✅ Outstanding tactical decision under executive pressure. Pausing broad match stops the bleed instantly. The negative keyword shield eliminates unqualified junk searches, and shifting to exact/phrase match guarantees Dr. Miller only pays for high-intent patients. Offering a credit memo preserves the $10,000 monthly retainer.",
    spokenResolution: "Good. That's the decisive leadership I expect from my account managers. I'm telling Dr. Miller right now that we caught the leak, paused broad match, deployed negative shields, and credited the $380 spend. You just saved the retainer. Now get back in there and finish tightening those ad groups!"
  },
  {
    text: "Option B: Tell Dr. Miller that Google Ads always wastes budget in the first 7 days during the algorithmic learning phase, and ask him to increase the daily budget so the AI can optimize.",
    isCorrect: false,
    feedback: "❌ Lethal mistake. In agency management, telling a furious client to spend MORE money after burning their budget on unqualified junk clicks will get your agency fired on the spot and sued for negligence."
  },
  {
    text: "Option C: Blame Google's automated recommendations and tell Dr. Miller that paid search doesn't work for dental clinics in his market.",
    isCorrect: false,
    feedback: "❌ Never shift blame or claim a proven channel doesn't work. Dental paid search has some of the highest patient lifetime values in local marketing if configured with strict match types and location gating."
  }
];

export default function AdSimulationPage() {
  const [matched, params] = useRoute<{ id?: string; simulationId?: string }>('/ad-simulation/:id');
  const simulationId = params?.id ? parseInt(params.id) : (params?.simulationId ? parseInt(params.simulationId) : null);
  const [, setLocation] = useLocation();
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const [isTeacherCopilotOpen, setIsTeacherCopilotOpen] = useState(false);
  const [showLessonGuide, setShowLessonGuide] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  const handleLoadStarterDraft = () => {
    const isApparel = simulation?.industry?.toLowerCase().includes("cloth") || 
                      simulation?.title?.toLowerCase().includes("cloth") || 
                      simulation?.businessType?.toLowerCase().includes("cloth") ||
                      (simulation?.objectives || []).some((o: string) => o.toLowerCase().includes("clothing"));
    
    const isDental = simulation?.industry?.toLowerCase().includes("dental") || 
                     simulation?.title?.toLowerCase().includes("dental");

    if (isApparel) {
      setGoogleForm({
        campaignName: "EcoThreads - Search - High Intent Apparel",
        campaignObjective: "sales",
        adGroups: [{
          name: "Organic Cotton Hoodies",
          keywords: [
            { text: "organic cotton hoodie", matchType: "phrase" },
            { text: "buy eco friendly clothing", matchType: "phrase" },
            { text: "sustainable streetwear brand", matchType: "exact" },
            { text: "organic casual wear online", matchType: "phrase" }
          ],
          negativeKeywords: ["-free", "-cheap", "-diy", "-jobs", "-wholesale", "-fabric scrap"]
        }],
        adCreatives: [{
          headline1: "Organic Cotton Hoodies",
          headline2: "100% Sustainable & Soft",
          headline3: "Shop 20% Off First Order",
          description1: "Ethically crafted organic streetwear hoodies & tees. Fair-trade verified.",
          description2: "Ultra-soft premium cotton built to last. Free shipping on orders over $50.",
          finalUrl: "https://ecothreads.example.com/hoodies"
        }],
        locations: ["United States", "Canada"],
        devices: ["mobile", "desktop"],
        bidStrategy: "maximize_conversions",
        dailyBudget: 50,
        adExtensions: [
          { type: "sitelink", content: "Shop New Arrivals | Men's & Women's Sustainable Styles" },
          { type: "callout", content: "Free Carbon-Neutral Shipping | 30-Day Returns" }
        ]
      });
    } else if (isDental) {
      setGoogleForm({
        campaignName: "Dr. Miller - Search - Emergency & Cosmetic Dental",
        campaignObjective: "leads",
        adGroups: [{
          name: "Emergency Dental Care",
          keywords: [
            { text: "emergency dentist near me", matchType: "exact" },
            { text: "same day tooth repair", matchType: "phrase" },
            { text: "urgent dental clinic open now", matchType: "phrase" }
          ],
          negativeKeywords: ["-free", "-cheap", "-medicaid", "-diy", "-dental assistant jobs"]
        }],
        adCreatives: [{
          headline1: "Emergency Dentist Near You",
          headline2: "Same-Day Relief & Care",
          headline3: "Book Online in 60 Seconds",
          description1: "Severe tooth pain? Walk-ins and same-day emergency appointments available today.",
          description2: "Top-rated compassionate dental care. Transparent pricing with zero surprise bills.",
          finalUrl: "https://drmillerdental.example.com/emergency"
        }],
        locations: ["United States"],
        devices: ["mobile", "desktop"],
        bidStrategy: "target_cpa",
        dailyBudget: 50,
        adExtensions: [
          { type: "callout", content: "Same-Day Emergency Care | 5-Star Rated" }
        ]
      });
    } else {
      setGoogleForm({
        campaignName: `${simulation?.title || "Growth"} - High Intent Search`,
        campaignObjective: "sales",
        adGroups: [{
          name: "Core High-Intent Search",
          keywords: [
            { text: "buy premium organic apparel", matchType: "phrase" },
            { text: "best sustainable clothing brand", matchType: "exact" },
            { text: "eco friendly hoodies online", matchType: "phrase" }
          ],
          negativeKeywords: ["-free", "-cheap", "-diy", "-jobs", "-used", "-craigslist"]
        }],
        adCreatives: [{
          headline1: "Premium Organic Clothing",
          headline2: "Crafted for Everyday Wear",
          headline3: "Shop New Arrivals Online",
          description1: "Discover ethically made organic apparel designed for comfort and modern style.",
          description2: "Certified organic materials with carbon-neutral shipping on all orders.",
          finalUrl: "https://example.com/store"
        }],
        locations: ["United States", "Canada"],
        devices: ["mobile", "desktop"],
        bidStrategy: "maximize_conversions",
        dailyBudget: 50,
        adExtensions: []
      });
    }

    toast({
      title: "✨ Benchmark Campaign Template Loaded!",
      description: "We've populated recommended best-practice settings so you can inspect, customize, and learn!",
    });
  };

  // Mid-Campaign Surprise Boss Crisis Call State
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [hasTriggeredCrisis, setHasTriggeredCrisis] = useState(false);
  const [crisisResolved, setCrisisResolved] = useState(false);

  // Trigger surprise Boss crisis call after student explores the campaign (catches them off-guard!)
  useEffect(() => {
    if (!hasTriggeredCrisis && !crisisResolved) {
      const timer = setTimeout(() => {
        setIsCrisisOpen(true);
        setHasTriggeredCrisis(true);
      }, 15000); // 15 seconds into the simulation
      return () => clearTimeout(timer);
    }
  }, [hasTriggeredCrisis, crisisResolved]);

  // Extra Client Persona & Channel Campaign Task State
  const [isClientPersonaCallOpen, setIsClientPersonaCallOpen] = useState(false);
  const [hasUnlockedPersonaTask, setHasUnlockedPersonaTask] = useState(false);
  const [isPersonaTaskCompleted, setIsPersonaTaskCompleted] = useState(false);

  const [extraPersonaData, setExtraPersonaData] = useState({
    personaName: "Corporate C-Suite Executive & Managing Partner",
    painPoint: "Severe emergency dental issue during workday; requires immediate same-day private suite with zero waiting room.",
    hookAngle: "Executive Priority Dental Care: Same-Day Private Suite Appointments with Zero Waiting Room.",
    targetChannel: "google_ads",
    dailyBudget: 25,
    headline1: "Executive Emergency Dentist",
    headline2: "Same-Day Private Suite Care",
    description: "Discrete, zero-wait emergency dental care for corporate executives. Book your private suite appointment online.",
    keywords: [
      { text: "executive emergency dentist", matchType: "exact" },
      { text: "same day private dentist", matchType: "phrase" },
      { text: "concierge dental clinic near me", matchType: "phrase" }
    ],
    newKwText: "",
    newKwMatch: "phrase",
    negativeKeywords: ["-free", "-cheap", "-medicaid", "-diy", "-jobs"],
    newNegText: ""
  });

  const handleLaunchRemediation = async (weaknessKey: string, difficulty: string = "Expert") => {
    setIsGeneratingNext(true);
    try {
      const res = await apiRequest("POST", "/api/ad-simulations/generate", {
        targetWeakness: weaknessKey,
        level: difficulty,
        platform: simulation?.platform || "google_ads",
      });
      const created = await res.json();
      toast({
        title: "✨ Targeted Remediation Challenge Generated",
        description: `Starting: ${created.title}`,
      });
      setLocation(`/ad-simulation/${created.id}`);
    } catch (e: any) {
      toast({
        title: "Generation Failed",
        description: e.message || "Could not generate remediation simulation.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingNext(false);
    }
  };

  const [isSavingPortfolio, setIsSavingPortfolio] = useState(false);

  const handleSaveToPortfolio = async () => {
    if (!simulationResults) return;
    setIsSavingPortfolio(true);
    try {
      const payload = {
        id: `cs-sim-${Date.now()}`,
        simulationId: simulationId || 1,
        title: simulation?.title || "Paid Search Campaign Optimization",
        clientName: simulation?.industry ? `${simulation.industry.split(' ')[0]} Partner` : "Agency Client",
        industry: simulation?.industry || "E-Commerce",
        platform: simulation?.platform || "Google Ads Search",
        difficulty: simulation?.difficulty || "Advanced",
        challengeSummary: simulation?.scenarioDescription || "Optimizing paid advertising to reduce CPA and scale revenue.",
        strategySummary: isPersonaTaskCompleted
          ? `Executed keyword match type gating, deployed negative keyword filters, and engineered dedicated C-Suite Executive Persona expansion campaign (+25 Rep).`
          : `Executed keyword match type gating, deployed negative keyword filters, and improved headline relevance.`,
        keyTactics: [
          ...(isPersonaTaskCompleted ? [`Architected dedicated Executive Persona campaign with high-intent exact match keywords & negative shields.`] : []),
          ...(simulationResults.feedback || []).slice(0, 2)
        ],
        metrics: {
          qualityScore: simulationResults.metrics?.qualityScore || 8,
          roas: simulationResults.metrics?.roas || 3.8,
          cpa: simulationResults.metrics?.costPerConversion || 28.5,
          ctr: simulationResults.metrics?.ctr || 3.4,
          conversions: simulationResults.metrics?.conversions || 18,
          spend: simulationResults.metrics?.cost || 500
        },
        score: Math.min(100, (simulationResults.score || 85) + (isPersonaTaskCompleted ? 15 : 0)),
      };

      await apiRequest("POST", "/api/user/portfolio", payload);
      queryClient.invalidateQueries({ queryKey: ["/api/user/portfolio"] });
      toast({
        title: "📌 Case Study Saved to Portfolio",
        description: "Verified case study added to your public portfolio!",
      });
      setLocation("/portfolio");
    } catch (e: any) {
      toast({
        title: "Save Failed",
        description: e.message || "Could not save to portfolio.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPortfolio(false);
    }
  };
  
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

  const [autoSavedTime, setAutoSavedTime] = useState<string | null>(null);

  // Initialize draft from localStorage if available
  useEffect(() => {
    if (simulationId) {
      try {
        const savedDraft = localStorage.getItem(`krechet_ad_draft_${simulationId}`);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.googleForm) setGoogleForm(parsed.googleForm);
          if (parsed.metaForm) setMetaForm(parsed.metaForm);
          if (parsed.linkedinForm) setLinkedinForm(parsed.linkedinForm);
          if (parsed.extraPersonaData) setExtraPersonaData(parsed.extraPersonaData);
          if (parsed.hasUnlockedPersonaTask !== undefined) setHasUnlockedPersonaTask(parsed.hasUnlockedPersonaTask);
          if (parsed.isPersonaTaskCompleted !== undefined) setIsPersonaTaskCompleted(parsed.isPersonaTaskCompleted);
          if (parsed.crisisResolved !== undefined) setCrisisResolved(parsed.crisisResolved);
          setAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (e) {
        console.warn("Could not load ad draft from localStorage", e);
      }
    }
  }, [simulationId]);

  // Auto-save whenever forms change
  useEffect(() => {
    if (simulationId) {
      try {
        const draft = {
          googleForm,
          metaForm,
          linkedinForm,
          extraPersonaData,
          hasUnlockedPersonaTask,
          isPersonaTaskCompleted,
          crisisResolved,
        };
        localStorage.setItem(`krechet_ad_draft_${simulationId}`, JSON.stringify(draft));
        setAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (e) {
        console.warn("Could not save ad draft to localStorage", e);
      }
    }
  }, [simulationId, googleForm, metaForm, linkedinForm, extraPersonaData, hasUnlockedPersonaTask, isPersonaTaskCompleted, crisisResolved]);

  const handleResetToBaseline = () => {
    if (window.confirm("Are you sure you want to reset all campaign draft changes back to baseline?")) {
      try {
        localStorage.removeItem(`krechet_ad_draft_${simulationId}`);
      } catch (e) {}
      window.location.reload();
    }
  };

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

      const locationsList = Array.isArray(simulation?.targetAudience?.locations)
        ? simulation.targetAudience.locations
        : (Array.isArray(simulation?.targetAudience) ? simulation.targetAudience : ["United States", "Canada"]);

      // Update form defaults based on simulation requirements
      if (simulation.platform === "google_ads") {
        setGoogleForm(prev => ({
          ...prev,
          campaignName: `${simulation.title || "Search"} Campaign`,
          locations: locationsList
        }));
      } else if (simulation.platform === "meta_ads") {
        setMetaForm(prev => ({
          ...prev,
          campaignName: `${simulation.title || "Meta"} Campaign`,
          adSets: [{
            ...prev.adSets[0],
            targeting: {
              ...prev.adSets[0]?.targeting,
              locations: locationsList
            }
          }]
        }));
      } else if (simulation.platform === "linkedin_ads") {
        setLinkedinForm(prev => ({
          ...prev,
          campaignName: `${simulation.title || "LinkedIn"} Campaign`,
          targeting: {
            ...prev.targeting,
            locations: locationsList
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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1.5 gap-1.5 bg-muted/60 rounded-xl mb-4">
          <TabsTrigger value="campaign" className="py-2.5 flex flex-col items-center sm:items-start text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <span className="font-bold flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-mono">1</span>
              <span>Campaign Setup</span>
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">Goal & Geo Locations</span>
          </TabsTrigger>
          
          <TabsTrigger value="adgroups" className="py-2.5 flex flex-col items-center sm:items-start text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <span className="font-bold flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-mono">2</span>
              <span>Ad Groups & Keywords</span>
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">Match Types & Negatives</span>
          </TabsTrigger>
          
          <TabsTrigger value="ads" className="py-2.5 flex flex-col items-center sm:items-start text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <span className="font-bold flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-mono">3</span>
              <span>Ad Creatives</span>
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">Headlines (&le;30 chars)</span>
          </TabsTrigger>
          
          <TabsTrigger value="settings" className="py-2.5 flex flex-col items-center sm:items-start text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <span className="font-bold flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-mono">4</span>
              <span>Budget & Bidding</span>
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">Daily Spend & Strategy</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaign" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Step 1: Campaign Foundation & Objective</CardTitle>
                  <CardDescription className="text-xs">Define your high-level goal and where your ads will run</CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Step 1 of 4
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="google-campaignName">Campaign Name</Label>
                  <span className="text-[11px] text-muted-foreground font-mono">Format: [Client] - [Type] - [Intent]</span>
                </div>
                <Input 
                  id="google-campaignName" 
                  value={googleForm.campaignName} 
                  onChange={(e) => setGoogleForm(prev => ({...prev, campaignName: e.target.value}))}
                  placeholder="e.g. EcoThreads - Search - High Intent Apparel"
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
                    <SelectItem value="sales">🛍️ Sales (Direct Purchases & Online Orders)</SelectItem>
                    <SelectItem value="leads">📋 Lead Generation (Phone Calls & Consultation Forms)</SelectItem>
                    <SelectItem value="website_traffic">🌐 Website Traffic (Clicks to Homepage/Blog)</SelectItem>
                    <SelectItem value="brand_awareness">📢 Brand Awareness (Reach & Impressions)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Objective Pro-Tip Callout */}
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-muted-foreground mt-2">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 mb-1 text-blue-300">
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Why Objective Choice Matters:</span>
                  </span>
                  {simulation?.objectives?.some((o: string) => o.toLowerCase().includes("clothing") || o.toLowerCase().includes("sales")) ? (
                    <span>The client wants to <strong>generate clothing sales</strong>. Selecting <strong>Sales</strong> tells Google's Smart Bidding AI to prioritize searchers who have a history of completing online checkouts, rather than casual window-shoppers.</span>
                  ) : (
                    <span>Select <strong>Sales</strong> for physical/digital products, or <strong>Lead Generation</strong> for service businesses and clinics that book appointments.</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Target Locations</Label>
                <p className="text-[11px] text-muted-foreground">Select the countries where your client can ship or service customers.</p>
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
                <Label>Target Devices</Label>
                <p className="text-[11px] text-muted-foreground">E-commerce clothing shoppers browse heavily on mobile and desktop.</p>
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

              <div className="flex justify-end pt-3 border-t border-border/50">
                <Button
                  type="button"
                  onClick={() => setActiveSetupTab("adgroups")}
                  className="text-xs h-9 flex items-center gap-1.5 bg-primary hover:bg-primary/90"
                >
                  <span>Continue to Step 2: Ad Groups & Keywords</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="adgroups" className="space-y-4">
          {/* Step 2 Educational Banner: Match Types & Shields */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-card to-background border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span>Step 2 Agency Guide: Keyword Match Types & Negative Shields</span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-background">
                Step 2 of 4
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paid Search campaigns succeed or fail based on <strong>Match Type selectivity</strong>. Broad match without negative keywords invites casual searchers looking for free items or job postings, rapidly draining client retainers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-card/80 border border-border/60">
                <div className="font-semibold text-emerald-400 flex items-center justify-between mb-1">
                  <span>[Exact Match]</span>
                  <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Highest Intent</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Only triggers when searchers enter the exact query. Highest conversion rate and lowest wasted spend.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-card/80 border border-border/60">
                <div className="font-semibold text-blue-400 flex items-center justify-between mb-1">
                  <span>"Phrase Match"</span>
                  <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-blue-500/10 text-blue-400 border border-blue-500/20">Recommended</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Triggers when the search includes your phrase meaning in order. Great balance of reach and relevance.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-card/80 border border-border/60">
                <div className="font-semibold text-amber-400 flex items-center justify-between mb-1">
                  <span>Broad Match</span>
                  <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-amber-500/10 text-amber-400 border border-amber-500/20">High Risk</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Matches loose synonyms & related topics. High chance of accidental clicks unless guarded by negative keywords.</p>
              </div>
            </div>
          </div>

          {googleForm.adGroups.map((adGroup, groupIndex) => (
            <Card key={groupIndex}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Ad Group {groupIndex + 1}: {adGroup.name || "Untitled"}</CardTitle>
                  <CardDescription className="text-xs">Configure tightly themed keywords and budget protection</CardDescription>
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
                  <Label htmlFor={`adgroup-name-${groupIndex}`}>Ad Group Theme Name</Label>
                  <Input 
                    id={`adgroup-name-${groupIndex}`} 
                    value={adGroup.name} 
                    onChange={(e) => {
                      const newAdGroups = [...googleForm.adGroups];
                      newAdGroups[groupIndex].name = e.target.value;
                      setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                    }}
                    placeholder="e.g. Organic Cotton Hoodies (Keep single-theme)"
                  />
                  <p className="text-[11px] text-muted-foreground">Pro-tip: Group similar products together so your ad copy directly mirrors what the searcher typed.</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Target Keywords & Match Types</Label>
                    <span className="text-[11px] text-muted-foreground font-mono">Use Phrase or Exact for higher ROAS</span>
                  </div>
                  {adGroup.keywords.map((keyword, keywordIndex) => (
                    <div key={keywordIndex} className="flex gap-2 mb-2">
                      <Input 
                        value={keyword.text} 
                        onChange={(e) => {
                          const newAdGroups = [...googleForm.adGroups];
                          newAdGroups[groupIndex].keywords[keywordIndex].text = e.target.value;
                          setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                        }}
                        placeholder="e.g. organic cotton hoodie"
                        className="flex-grow font-mono text-xs"
                      />
                      <Select 
                        value={keyword.matchType} 
                        onValueChange={(value) => {
                          const newAdGroups = [...googleForm.adGroups];
                          newAdGroups[groupIndex].keywords[keywordIndex].matchType = value;
                          setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                        }}
                      >
                        <SelectTrigger className="w-[180px] text-xs">
                          <SelectValue placeholder="Match Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phrase">"Phrase Match"</SelectItem>
                          <SelectItem value="exact">[Exact Match]</SelectItem>
                          <SelectItem value="broad">Broad Match</SelectItem>
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
                      newAdGroups[groupIndex].keywords.push({ text: "", matchType: "phrase" });
                      setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                    }}
                    className="text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Keyword
                  </Button>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <Label className="flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
                        <span>Negative Keywords (Budget Shield)</span>
                      </Label>
                      <p className="text-[11px] text-muted-foreground">Blocks unwanted searches (e.g. free downloads, DIY, employee job applicants) so you don't pay for empty clicks.</p>
                    </div>

                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const newAdGroups = [...googleForm.adGroups];
                        const coreShields = ["-free", "-cheap", "-diy", "-jobs", "-used", "-wholesale", "-craigslist"];
                        const existing = new Set(newAdGroups[groupIndex].negativeKeywords.map(k => k.toLowerCase().trim()));
                        const toAdd = coreShields.filter(s => !existing.has(s.toLowerCase()));
                        if (toAdd.length > 0) {
                          newAdGroups[groupIndex].negativeKeywords = [
                            ...newAdGroups[groupIndex].negativeKeywords.filter(k => k.trim() !== ""), 
                            ...toAdd
                          ];
                          setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                          toast({
                            title: "🛡️ Negative Shield Activated",
                            description: `Added ${toAdd.length} negative keywords to protect against budget bleed.`,
                          });
                        } else {
                          toast({
                            title: "Shield Already In Place",
                            description: "All core negative keywords are already active in this ad group.",
                          });
                        }
                      }}
                      className="h-7 text-xs border-amber-500/40 text-amber-500 dark:text-amber-400 hover:bg-amber-500/10 flex items-center gap-1.5"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>🛡️ Quick Shield: Add Core Bleed Blockers</span>
                    </Button>
                  </div>

                  {adGroup.negativeKeywords.map((keyword, keywordIndex) => (
                    <div key={keywordIndex} className="flex gap-2 mb-2">
                      <Input 
                        value={keyword} 
                        onChange={(e) => {
                          const newAdGroups = [...googleForm.adGroups];
                          newAdGroups[groupIndex].negativeKeywords[keywordIndex] = e.target.value;
                          setGoogleForm(prev => ({...prev, adGroups: newAdGroups}));
                        }}
                        placeholder="e.g. -free, -cheap, -diy, -jobs"
                        className="flex-grow font-mono text-xs text-red-400"
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
                    className="text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Negative Keyword
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setGoogleForm(prev => ({
                  ...prev,
                  adGroups: [
                    ...prev.adGroups,
                    {
                      name: `Ad Group ${prev.adGroups.length + 1}`,
                      keywords: [{ text: "", matchType: "phrase" }],
                      negativeKeywords: ["-free", "-cheap", "-diy", "-jobs"]
                    }
                  ]
                }));
              }}
              className="text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Another Ad Group
            </Button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveSetupTab("campaign")}
              className="text-xs h-9 flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Step 1: Campaign Foundation</span>
            </Button>
            <Button
              type="button"
              onClick={() => setActiveSetupTab("ads")}
              className="text-xs h-9 flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <span>Continue to Step 3: Ad Creatives</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="ads" className="space-y-4">
          {/* Step 3 Educational Banner: 3-Headline Formula */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-card to-background border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Lightbulb className="h-4 w-4 text-blue-400" />
                <span>Step 3 Agency Guide: The 3-Headline Responsive Ad Formula</span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-background">
                Step 3 of 4
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Google displays up to 3 headlines separated by pipes (|) and 2 descriptions. High-performing agency ads follow this proven 3-part psychological formula:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-card/80 border border-border/60">
                <div className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <span className="text-primary font-bold">1.</span>
                  <span>Product / Core Query</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Matches exactly what the user searched (e.g. <em>"Organic Cotton Hoodies"</em>). Confirms they're in the right place.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-card/80 border border-border/60">
                <div className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <span className="text-primary font-bold">2.</span>
                  <span>Value Prop / Benefit</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Answers "Why buy from you?" (e.g. <em>"100% Sustainable & Soft"</em> or <em>"Same-Day Emergency Care"</em>).</p>
              </div>
              <div className="p-2.5 rounded-lg bg-card/80 border border-border/60">
                <div className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <span className="text-primary font-bold">3.</span>
                  <span>Urgent Call to Action</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Tells them the next action and sweetens the offer (e.g. <em>"Shop 20% Off First Order"</em>).</p>
              </div>
            </div>
          </div>

          {googleForm.adCreatives.map((ad, adIndex) => (
            <Card key={adIndex}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Ad Creative {adIndex + 1}</CardTitle>
                  <CardDescription className="text-xs">Create responsive search ad copy that converts searchers into customers</CardDescription>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`headline1-${adIndex}`} className="text-xs">Headline 1 (Product/Query)</Label>
                      <span className={`text-[10px] font-mono ${ad.headline1.length > 30 ? "text-destructive font-bold" : ad.headline1.length > 0 ? "text-emerald-400" : "text-muted-foreground"}`}>
                        {ad.headline1.length}/30
                      </span>
                    </div>
                    <Input 
                      id={`headline1-${adIndex}`} 
                      value={ad.headline1} 
                      onChange={(e) => {
                        const newAds = [...googleForm.adCreatives];
                        newAds[adIndex].headline1 = e.target.value.slice(0, 30);
                        setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                      }}
                      placeholder="e.g. Organic Cotton Hoodies"
                      maxLength={30}
                      className="text-xs"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`headline2-${adIndex}`} className="text-xs">Headline 2 (Benefit)</Label>
                      <span className={`text-[10px] font-mono ${ad.headline2.length > 30 ? "text-destructive font-bold" : ad.headline2.length > 0 ? "text-emerald-400" : "text-muted-foreground"}`}>
                        {ad.headline2.length}/30
                      </span>
                    </div>
                    <Input 
                      id={`headline2-${adIndex}`} 
                      value={ad.headline2} 
                      onChange={(e) => {
                        const newAds = [...googleForm.adCreatives];
                        newAds[adIndex].headline2 = e.target.value.slice(0, 30);
                        setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                      }}
                      placeholder="e.g. 100% Sustainable & Soft"
                      maxLength={30}
                      className="text-xs"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`headline3-${adIndex}`} className="text-xs">Headline 3 (Call-to-Action)</Label>
                      <span className={`text-[10px] font-mono ${ad.headline3.length > 30 ? "text-destructive font-bold" : ad.headline3.length > 0 ? "text-emerald-400" : "text-muted-foreground"}`}>
                        {ad.headline3.length}/30
                      </span>
                    </div>
                    <Input 
                      id={`headline3-${adIndex}`} 
                      value={ad.headline3} 
                      onChange={(e) => {
                        const newAds = [...googleForm.adCreatives];
                        newAds[adIndex].headline3 = e.target.value.slice(0, 30);
                        setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                      }}
                      placeholder="e.g. Shop 20% Off First Order"
                      maxLength={30}
                      className="text-xs"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`description1-${adIndex}`} className="text-xs">Description 1 (Primary Offer)</Label>
                      <span className={`text-[10px] font-mono ${ad.description1.length > 90 ? "text-destructive font-bold" : ad.description1.length > 0 ? "text-emerald-400" : "text-muted-foreground"}`}>
                        {ad.description1.length}/90
                      </span>
                    </div>
                    <Textarea 
                      id={`description1-${adIndex}`} 
                      value={ad.description1} 
                      onChange={(e) => {
                        const newAds = [...googleForm.adCreatives];
                        newAds[adIndex].description1 = e.target.value.slice(0, 90);
                        setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                      }}
                      placeholder="e.g. Ethically crafted organic streetwear hoodies & tees. Fair-trade verified."
                      maxLength={90}
                      rows={2}
                      className="text-xs"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`description2-${adIndex}`} className="text-xs">Description 2 (Proof & CTA)</Label>
                      <span className={`text-[10px] font-mono ${ad.description2.length > 90 ? "text-destructive font-bold" : ad.description2.length > 0 ? "text-emerald-400" : "text-muted-foreground"}`}>
                        {ad.description2.length}/90
                      </span>
                    </div>
                    <Textarea 
                      id={`description2-${adIndex}`} 
                      value={ad.description2} 
                      onChange={(e) => {
                        const newAds = [...googleForm.adCreatives];
                        newAds[adIndex].description2 = e.target.value.slice(0, 90);
                        setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                      }}
                      placeholder="e.g. Ultra-soft premium cotton built to last. Free shipping on orders over $50."
                      maxLength={90}
                      rows={2}
                      className="text-xs"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`finalUrl-${adIndex}`} className="text-xs">Landing Page Final URL</Label>
                  <Input 
                    id={`finalUrl-${adIndex}`} 
                    value={ad.finalUrl} 
                    onChange={(e) => {
                      const newAds = [...googleForm.adCreatives];
                      newAds[adIndex].finalUrl = e.target.value;
                      setGoogleForm(prev => ({...prev, adCreatives: newAds}));
                    }}
                    placeholder="https://clientbrand.example.com/collection"
                    className="text-xs font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">Must direct searchers to the specific relevant product category, NOT an empty homepage.</p>
                </div>
                
                {/* Authentic Google SERP Live Ad Preview */}
                <div className="mt-6 border border-border/80 rounded-xl p-4 bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-primary" />
                      <span>Live Google SERP Search Ad Preview</span>
                    </h4>
                    <Badge variant="outline" className="text-[10px] bg-background">
                      Desktop & Mobile Google Result
                    </Badge>
                  </div>

                  <div className="bg-card p-4 rounded-xl border border-border/80 shadow-sm space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                        Ad
                      </div>
                      <div className="text-xs leading-none">
                        <div className="flex items-center gap-1 font-semibold text-foreground text-[11px]">
                          <span>{simulation?.title?.split(" ")[0] || "ClientBrand"}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="font-bold text-foreground text-[10px]">Sponsored</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-md mt-0.5">
                          {ad.finalUrl || "https://www.example.com/shop"}
                        </div>
                      </div>
                    </div>

                    <div className="text-base text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer leading-snug">
                      {[ad.headline1 || "Headline 1", ad.headline2 || "Headline 2", ad.headline3 || "Headline 3"].filter(Boolean).join(" | ")}
                    </div>

                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {ad.description1 || "Main description goes here explaining key benefits."} {ad.description2 || "Secondary description with reassurance and clear call to action."}
                    </div>

                    {googleForm.adExtensions.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2 border-t border-border/40 mt-2">
                        {googleForm.adExtensions.map((ext, extIdx) => (
                          <span key={extIdx} className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                            {ext.content || `${ext.type} link`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
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
              className="text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Another Ad Variation
            </Button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveSetupTab("adgroups")}
              className="text-xs h-9 flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Step 2: Ad Groups & Keywords</span>
            </Button>
            <Button
              type="button"
              onClick={() => setActiveSetupTab("settings")}
              className="text-xs h-9 flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <span>Continue to Step 4: Budget & Bidding</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          {/* Step 4 Educational Banner: Budget & Bidding */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-card to-background border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Lightbulb className="h-4 w-4 text-emerald-400" />
                <span>Step 4 Agency Guide: Smart Bidding Strategy & Budget Control</span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-background">
                Step 4 of 4
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Smart Bidding uses Google's auction machine learning to optimize bids in real time based on user intent signals. Choosing the right bid strategy ensures you don't overpay for traffic.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-card/80 border border-border/60">
                <div className="font-semibold text-emerald-400 mb-1">Maximize Conversions</div>
                <p className="text-[11px] text-muted-foreground">Recommended for most e-commerce and retail stores. Google bids aggressively on searchers most likely to buy.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-card/80 border border-border/60">
                <div className="font-semibold text-blue-400 mb-1">Target CPA (Cost Per Acquisition)</div>
                <p className="text-[11px] text-muted-foreground">Best for service clinics and lead gen where you have a strict maximum dollar amount you can pay per lead.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-card/80 border border-border/60">
                <div className="font-semibold text-amber-400 mb-1">Manual CPC</div>
                <p className="text-[11px] text-muted-foreground">Full manual control over exact keyword bids. Gives safety for tiny budgets but requires frequent adjustments.</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Step 4: Campaign Settings & Bidding</CardTitle>
              <CardDescription className="text-xs">Set your bidding algorithm, daily spending caps, and SERP ad extensions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bidStrategy">Smart Bidding Strategy</Label>
                <Select 
                  value={googleForm.bidStrategy} 
                  onValueChange={(value) => setGoogleForm(prev => ({...prev, bidStrategy: value}))}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select a bid strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maximize_conversions">🎯 Maximize Conversions (Recommended for Sales)</SelectItem>
                    <SelectItem value="target_cpa">💼 Target CPA (Fixed Cost Per Acquisition)</SelectItem>
                    <SelectItem value="maximize_clicks">📈 Maximize Clicks (Traffic Volume Focus)</SelectItem>
                    <SelectItem value="target_roas">📊 Target ROAS (Revenue Multiple Focus)</SelectItem>
                    <SelectItem value="manual_cpc">🛠️ Manual CPC (Individual Keyword Bids)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dailyBudget">Daily Budget Cap (USD)</Label>
                  <span className="text-xs font-bold text-primary font-mono">${googleForm.dailyBudget} / day</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Recommended: $50/day. Provides sufficient auction data for statistical significance without risking large budget bleed.</p>
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
                    className="w-24 text-xs font-mono"
                  />
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Ad Extensions (SERP Enhancements)</Label>
                    <p className="text-[11px] text-muted-foreground">Extensions make your ad up to 30% larger on Google results, boosting Click-Through Rate (CTR) by 10–15%.</p>
                  </div>
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
                    className="text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Extension
                  </Button>
                </div>
                
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
                      <SelectTrigger className="w-[180px] text-xs">
                        <SelectValue placeholder="Extension Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sitelink">Sitelink</SelectItem>
                        <SelectItem value="callout">Callout</SelectItem>
                        <SelectItem value="structured_snippet">Structured Snippet</SelectItem>
                        <SelectItem value="call">Call Button</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      value={extension.content} 
                      onChange={(e) => {
                        const newExtensions = [...googleForm.adExtensions];
                        newExtensions[extensionIndex].content = e.target.value;
                        setGoogleForm(prev => ({...prev, adExtensions: newExtensions}));
                      }}
                      placeholder="e.g. Free Carbon-Neutral Shipping | 30-Day Returns"
                      className="flex-grow text-xs"
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

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveSetupTab("ads")}
                  className="text-xs h-9 flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Step 3: Ad Creatives</span>
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsTeacherCopilotOpen(true)}
                    className="border-amber-500/40 text-amber-500 dark:text-amber-400 hover:bg-amber-500/10 text-xs h-9 flex items-center gap-1.5"
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Ask Teacher to Audit Setup</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitMutation.isPending}
                    className="text-xs h-9 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                  >
                    <span>{submitMutation.isPending ? "Simulating Auction..." : "🚀 Launch & Grade Campaign"}</span>
                  </Button>
                </div>
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
    
    const { score, feedback = [], metrics = {}, postSimDebrief } = simulationResults;
    const diagnostics = postSimDebrief?.updatedDiagnostics;
    const nextChallenge = postSimDebrief?.nextChallenge;
    
    return (
      <div className="space-y-6">
        {/* Top Summary Card */}
        <Card className="border-primary/20 bg-gradient-to-r from-background via-card to-background shadow-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center rounded-full p-4 bg-primary/10 border border-primary/20 mb-2">
                {score >= 75 ? (
                  <CheckCircle className="h-12 w-12 text-emerald-500" />
                ) : score >= 50 ? (
                  <Info className="h-12 w-12 text-amber-400" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-red-500" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {score >= 80 ? "Outstanding Campaign Execution!" : score >= 60 ? "Solid Attempt with Growth Opportunities" : "Critical Optimization Required"}
              </h3>
              <p className="text-muted-foreground text-sm">
                Overall Performance Score: <strong className="text-primary text-base font-semibold">{score}/100</strong>
              </p>
              <div className="flex justify-center gap-2 pt-1">
                <Badge className={score >= 75 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : score >= 50 ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"}>
                  {score >= 75 ? "Proficient" : score >= 50 ? "Developing" : "Needs Remediation"}
                </Badge>
                {metrics.roas && (
                  <Badge variant="outline" className="text-xs">
                    ROAS: {metrics.roas}x
                  </Badge>
                )}
                {metrics.qualityScore && (
                  <Badge variant="outline" className="text-xs">
                    Quality Score: {metrics.qualityScore}/10
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Coach Post-Simulation Debrief & Skill Weakness Breakdown */}
        {postSimDebrief && (
          <Card className="border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-card to-background shadow-lg">
            <CardHeader className="pb-3 border-b border-amber-500/20">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-amber-400" />
                  <CardTitle className="text-lg text-foreground">Krechet AI Coach Debrief</CardTitle>
                  <Badge variant="outline" className="bg-amber-500/15 text-amber-400 border-amber-500/40 text-xs">
                    Telemetric Analysis
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Updated Live Skill Profile
                </div>
              </div>
              <CardDescription>
                AI analysis of your campaign mechanics, wasted spend detection, and targeted remediation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              {/* Primary Weakness & Wasted Budget Notice */}
              <div className="p-4 rounded-lg bg-background/80 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Identified Growth Area: {postSimDebrief.primaryWeaknessLabel}</span>
                </div>
                
                {postSimDebrief.wastedSpendReasons && postSimDebrief.wastedSpendReasons.length > 0 && (
                  <ul className="space-y-1.5 pl-2 text-xs text-muted-foreground">
                    {postSimDebrief.wastedSpendReasons.map((reason: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="p-2.5 rounded bg-primary/10 border border-primary/20 text-xs text-foreground flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong>AI Coach Recommendation:</strong> {postSimDebrief.actionTip}
                  </div>
                </div>
              </div>

              {/* Updated Live Skill Telemetry Progress Bars */}
              {diagnostics?.skillScores && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Your Updated Skill Telemetry:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded bg-card/60 border border-border/40 space-y-1">
                      <div className="flex justify-between">
                        <span>Quality Score Optimization</span>
                        <span className="font-mono text-primary">{diagnostics.skillScores.qualityScoreOptimization}%</span>
                      </div>
                      <Progress value={diagnostics.skillScores.qualityScoreOptimization} className="h-1.5" />
                    </div>

                    <div className="p-2.5 rounded bg-card/60 border border-border/40 space-y-1">
                      <div className="flex justify-between">
                        <span>Negative Keyword Defense</span>
                        <span className="font-mono text-primary">{diagnostics.skillScores.negativeKeywordDefense}%</span>
                      </div>
                      <Progress value={diagnostics.skillScores.negativeKeywordDefense} className="h-1.5" />
                    </div>

                    <div className="p-2.5 rounded bg-card/60 border border-border/40 space-y-1">
                      <div className="flex justify-between">
                        <span>CPC & Bid Strategy</span>
                        <span className="font-mono text-primary">{diagnostics.skillScores.cpcBidEfficiency}%</span>
                      </div>
                      <Progress value={diagnostics.skillScores.cpcBidEfficiency} className="h-1.5" />
                    </div>

                    <div className="p-2.5 rounded bg-card/60 border border-border/40 space-y-1">
                      <div className="flex justify-between">
                        <span>CPA & Conversion Alignment</span>
                        <span className="font-mono text-primary">{diagnostics.skillScores.conversionOptimization}%</span>
                      </div>
                      <Progress value={diagnostics.skillScores.conversionOptimization} className="h-1.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Next Remediation Challenge Box */}
              {nextChallenge && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/15 via-primary/10 to-card border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                      <Zap className="h-4 w-4" />
                      <span>Next Adaptive Remediation Challenge</span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{nextChallenge.title}</h4>
                    <p className="text-xs text-muted-foreground">{nextChallenge.reason}</p>
                  </div>
                  <Button 
                    onClick={() => handleLaunchRemediation(nextChallenge.targetWeakness, simulation?.difficulty || "Expert")}
                    disabled={isGeneratingNext}
                    className="shrink-0 bg-gradient-to-r from-amber-500 to-primary text-black font-semibold text-xs h-9 px-4 flex items-center gap-2 hover:opacity-90"
                  >
                    {isGeneratingNext ? (
                      <span>Constructing Challenge...</span>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        <span>Launch Remediation Simulation</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Performance Metrics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Auction & Platform Performance Metrics</CardTitle>
            <CardDescription>Deterministic campaign metrics calculated from auction math and platform benchmarks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-lg border border-border/40">
                <div className="text-xs text-muted-foreground">Impressions</div>
                <div className="text-2xl font-bold">{metrics.impressions?.toLocaleString() || 0}</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border/40">
                <div className="text-xs text-muted-foreground">Clicks</div>
                <div className="text-2xl font-bold">{metrics.clicks?.toLocaleString() || 0}</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border/40">
                <div className="text-xs text-muted-foreground">CTR</div>
                <div className="text-2xl font-bold text-primary">{metrics.ctr?.toFixed(2) || 0}%</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border/40">
                <div className="text-xs text-muted-foreground">Avg. CPC</div>
                <div className="text-2xl font-bold">${metrics.cpc?.toFixed(2) || 0}</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border/40">
                <div className="text-xs text-muted-foreground">Conversions</div>
                <div className="text-2xl font-bold text-emerald-400">{metrics.conversions?.toLocaleString() || 0}</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border/40">
                <div className="text-xs text-muted-foreground">Conv. Rate</div>
                <div className="text-2xl font-bold">{metrics.conversionRate?.toFixed(2) || 0}%</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border/40">
                <div className="text-xs text-muted-foreground">Cost/Conv. (CPA)</div>
                <div className="text-2xl font-bold">${metrics.costPerConversion?.toFixed(2) || 0}</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border/40">
                <div className="text-xs text-muted-foreground">Total Spend</div>
                <div className="text-2xl font-bold">${metrics.cost?.toFixed(2) || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Feedback Points */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Strategy Breakdown</CardTitle>
            <CardDescription>Granular analysis of ad rank, match type selectivity, and conversion mechanics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {feedback.map((item: string, index: number) => (
              <Alert key={index} className="bg-card border-border/60">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <AlertTitle className="text-xs font-semibold text-foreground">Analysis Point {index + 1}</AlertTitle>
                    <AlertDescription className="text-xs text-muted-foreground mt-0.5">
                      {item}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
          
          {score >= 70 && (
            <div className="mx-6 mb-4 p-4 rounded-lg bg-gradient-to-r from-emerald-500/15 via-primary/10 to-card border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Eligible for Proof-of-Work Verification</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Score of {score}/100 qualifies this campaign for your verified Agency Portfolio.
                </p>
              </div>
              <Button 
                onClick={handleSaveToPortfolio}
                disabled={isSavingPortfolio}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-8 px-3.5 shrink-0 flex items-center gap-1.5"
              >
                <span>📌 Save to My Portfolio</span>
              </Button>
            </div>
          )}

          <CardFooter className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40">
            <Button variant="outline" onClick={() => setActiveStep("setup")} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refine & Re-run Campaign</span>
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setLocation("/portfolio")}>
                View Portfolio
              </Button>
              <Button variant="default" onClick={() => setLocation("/ad-simulations")}>
                All Simulations Catalog
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="container mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Scenario Not Found</h2>
        <p className="text-muted-foreground text-sm">The selected campaign scenario could not be loaded from the server.</p>
        <Button onClick={() => setLocation("/ad-simulations")}>Back to Simulations Catalog</Button>
      </div>
    );
  }

  // Redesigned Agency Client Brief & Mission Guide
  const ProjectObjectivesCard = () => {
    if (!simulation) return null;

    const isApparel = simulation?.industry?.toLowerCase().includes("cloth") || 
                      simulation?.title?.toLowerCase().includes("cloth") || 
                      simulation?.businessType?.toLowerCase().includes("cloth") ||
                      (simulation?.objectives || []).some((o: string) => o.toLowerCase().includes("clothing"));
    
    const clientName = simulation.title.includes("Google Ads") ? (isApparel ? "EcoThreads Apparel" : "Apex Client") : simulation.title;
    
    return (
      <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-card via-card/95 to-primary/5 shadow-xl overflow-hidden rounded-2xl">
        <CardHeader className="bg-muted/30 pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold uppercase tracking-wider">
                  🏢 Agency Client Dossier
                </Badge>
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  {simulation.industry} • {simulation.businessType || "E-Commerce Direct-to-Consumer"}
                </Badge>
              </div>
              <CardTitle className="text-xl font-black text-foreground mt-1.5 flex items-center gap-2">
                <span>{clientName}</span>
                <span className="text-xs font-normal text-muted-foreground">• Account Onboarding</span>
              </CardTitle>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOnboardingModalOpen(true)}
                className="text-xs h-8 border-primary/40 text-primary hover:bg-primary/10 flex items-center gap-1.5 font-medium shadow-sm"
              >
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                <span>👋 60-Sec Student Guide</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleLoadStarterDraft}
                className="text-xs h-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium flex items-center gap-1.5 shadow-sm"
                title="Populate an exemplary agency campaign setup to learn from"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-200" />
                <span>✨ Load Starter Benchmark Draft</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Situation & Your Agency Role */}
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground flex items-center gap-1.5 mb-1 text-xs">
              <Target className="h-3.5 w-3.5 text-primary" />
              <span>Your Role & Client Mission:</span>
            </strong>
            You are the <strong>Agency Media Buyer</strong> managing this account. {simulation.scenarioDescription || "The client has hired our agency to launch their search advertising campaign. Your goal is to capture high-intent buyers searching on Google without burning client budget on accidental or irrelevant clicks."}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Client Objectives & Success Criteria */}
            <div className="space-y-3 bg-background/60 p-3.5 rounded-xl border border-border/80">
              <div>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Client's Target Objectives</span>
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  {(Array.isArray(simulation?.objectives) ? simulation.objectives : [simulation?.objectives || "Maximize return on ad spend"]).map((obj: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-foreground/90 font-medium">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Success Criteria (Grading Benchmarks):
                </span>
                <ul className="mt-1 space-y-1 text-[11px] text-muted-foreground">
                  {simulation?.successCriteria && Array.isArray(simulation.successCriteria) ? 
                    simulation.successCriteria.map((criteria: any, index: number) => (
                      <li key={index} className="flex items-center gap-1.5 font-mono text-emerald-400/90">
                        <span>✓</span>
                        <span>
                          {typeof criteria === 'object' && criteria.metric ? 
                            `${criteria.metric}: ${criteria.comparison === "greater" ? ">" : criteria.comparison === "less" ? "<" : "="} ${criteria.target}` : 
                            String(criteria)
                          }
                        </span>
                      </li>
                    )) : 
                    <li>Achieve Quality Score &ge; 7/10 and positive ROAS</li>
                  }
                </ul>
              </div>
            </div>

            {/* Right: The 4-Step Student Action Gameplan */}
            <div className="bg-background/60 p-3.5 rounded-xl border border-border/80 space-y-2.5">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Your 4-Step Action Gameplan</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-card/80 border border-border/50 flex items-start gap-2">
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px] shrink-0 font-bold bg-primary/10 text-primary">1</Badge>
                  <div>
                    <span className="font-semibold text-foreground">Campaign Setup:</span>
                    <p className="text-[11px] text-muted-foreground">
                      {isApparel ? "Choose 'Sales' as the objective (since the client sells clothing products, not phone leads)." : "Choose an objective that matches the client's goal (Sales for e-commerce, Leads for service clinics)."}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-card/80 border border-border/50 flex items-start gap-2">
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px] shrink-0 font-bold bg-primary/10 text-primary">2</Badge>
                  <div>
                    <span className="font-semibold text-foreground">Ad Groups & Keywords:</span>
                    <p className="text-[11px] text-muted-foreground">
                      Target searchers with <strong>Phrase Match</strong> (<code className="text-amber-300">"keyword"</code>) and deploy <strong>Negative Shields</strong> (<code className="text-red-400">-free, -cheap</code>) to stop budget bleed.
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-card/80 border border-border/50 flex items-start gap-2">
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px] shrink-0 font-bold bg-primary/10 text-primary">3</Badge>
                  <div>
                    <span className="font-semibold text-foreground">Ad Creatives:</span>
                    <p className="text-[11px] text-muted-foreground">
                      Write 3 headlines (Product &bull; Benefit &bull; CTA). Google strictly enforces a <strong>30-character limit</strong> per headline!
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-card/80 border border-border/50 flex items-start gap-2">
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px] shrink-0 font-bold bg-primary/10 text-primary">4</Badge>
                  <div>
                    <span className="font-semibold text-foreground">Settings & Bidding:</span>
                    <p className="text-[11px] text-muted-foreground">
                      Set a daily budget ($50/day recommended) and select <strong>Maximize Conversions</strong> or <strong>Manual CPC</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8">
      {/* Instructor Tool Guide with Checklist & Quick Return to Lesson */}
      <InstructorToolGuide toolKey="ad-simulation" />

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{simulation?.title}</h1>
        <p className="text-gray-600 mb-4">{simulation?.scenarioDescription}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline">{simulation?.industry} Industry</Badge>
          <Badge variant="outline" className={`capitalize ${
            simulation?.difficulty === "beginner" ? "bg-green-100 text-green-800" :
            simulation?.difficulty === "intermediate" ? "bg-blue-100 text-blue-800" :
            simulation?.difficulty === "advanced" ? "bg-purple-100 text-purple-800" :
            "bg-red-100 text-red-800"
          }`}>
            {simulation?.difficulty} Level
          </Badge>

          {crisisResolved ? (
            <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 text-xs flex items-center gap-1.5 py-1 px-2.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Agency Retainer Saved (+15 Rep)</span>
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCrisisOpen(true)}
              className="h-7 px-3 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10 border-amber-500/40 font-medium animate-pulse"
              title="Incoming executive crisis call from Managing Director Atlas"
            >
              🚨 Incoming Boss Crisis Call
            </Button>
          )}

          {isPersonaTaskCompleted ? (
            <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/40 text-xs flex items-center gap-1.5 py-1 px-2.5">
              <CheckCircle className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Executive Persona Campaign Live (+25 Rep)</span>
            </Badge>
          ) : hasUnlockedPersonaTask ? (
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/40 text-xs flex items-center gap-1.5 py-1 px-2.5 animate-pulse">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>🎯 Extra Task: Executive Persona Active</span>
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsClientPersonaCallOpen(true)}
              className="h-7 px-3 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-500/10 border-purple-500/40 font-medium"
              title="Client calling with new persona and campaign request"
            >
              📞 Client Call: New Persona Request
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTeacherCopilotOpen(true)}
            className="h-7 px-3 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10 border-amber-500/40 font-medium flex items-center gap-1.5"
            title="Ask AI Growth Director to guide or review your ad campaign"
          >
            <GraduationCap className="h-3.5 w-3.5 text-amber-500" />
            <span>🎓 Ask Teacher</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "💾 Campaign Draft Safely Preserved",
                description: "Your campaign changes are auto-saved. Jump back into lessons anytime and resume later!",
              });
              setLocation('/tutorials');
            }}
            className="h-7 px-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 border-blue-500/40 font-medium flex items-center gap-1.5"
          >
            <Coffee className="h-3.5 w-3.5" />
            <span>Take a Break • Lessons</span>
          </Button>
        </div>
      </div>
      
      {/* Living Weekly Sandbox Pacing Reassurance Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/20 border border-blue-500/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.5">
            <Coffee className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-semibold text-xs">
                🛠️ Living Client Sandbox (Open All Week)
              </Badge>
              {autoSavedTime ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 inline" /> Auto-saved at {autoSavedTime}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400/80 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 inline" /> Real-time auto-save active
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">
              <strong className="text-foreground">You are NOT meant to solve this in one sitting!</strong> Real marketing agency campaigns are built and fine-tuned across the entire week alongside your lessons. Spend 30–40 minutes on ad creatives or keywords, test your settings, and take a break or return to lessons whenever you want. Everything is safely auto-saved.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleResetToBaseline}
            className="text-[11px] h-8 text-muted-foreground hover:text-destructive"
          >
            <RotateCcw className="h-3 w-3 mr-1" /> Reset Draft
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "💾 Campaign Draft Safely Preserved",
                description: "Your campaign changes are saved in your browser. Feel free to rest or review tutorial concepts!",
              });
              setLocation('/tutorials');
            }}
            className="border-blue-500/40 text-blue-300 hover:bg-blue-500/10 hover:text-white text-xs h-8 flex items-center gap-1.5 shadow-sm"
          >
            <Coffee className="h-3.5 w-3.5" />
            <span>Take a Break • Return to Lessons</span>
          </Button>
        </div>
      </div>

      {/* Related Curriculum Lessons & Teacher Kick-Off Strip */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-card via-card/95 to-primary/5 border border-border shadow-md overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20 shrink-0 mt-0.5">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Curriculum Connection</span>
                <Badge variant="outline" className="text-[10px] bg-background">
                  Chapter 2 & Chapter 4 Companion Lab
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                You are not expected to know all ad settings from memory! This sandbox applies the exact concepts taught in your tutorials. Review a lesson below or ask your AI Teacher to get you started.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end flex-wrap">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsTeacherCopilotOpen(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-8 flex items-center gap-1.5 shadow-sm"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Teacher Kick-Off & Review</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLessonGuide(!showLessonGuide)}
              className="text-xs h-8 flex items-center gap-1.5"
            >
              <span>{showLessonGuide ? "Hide Companion Lessons" : "📚 View Related Lessons (3)"}</span>
              {showLessonGuide ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {showLessonGuide && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 bg-card/50 text-xs">
            {/* Lesson 3 Card */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-background/80 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                    Chapter 2 • Lesson 1
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">30 min</span>
                </div>
                <h4 className="font-semibold text-foreground text-xs leading-snug">
                  Google Ads Campaign Structure & Account Hierarchy
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                  Learn the 3-tier hierarchy (Campaign &rarr; Ad Groups &rarr; RSAs) and how the Quality Score formula lowers your actual CPC.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/tutorials?tutorialId=3')}
                className="mt-3 w-full text-[11px] h-7 text-primary hover:text-primary flex items-center justify-center gap-1 border-primary/30"
              >
                <span>Study Lesson 3</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            {/* Lesson 4 Card */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-background/80 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                    Chapter 2 • Lesson 2
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">45 min</span>
                </div>
                <h4 className="font-semibold text-foreground text-xs leading-snug">
                  Keyword Match Types & Negative Keyword Shields
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                  Understand Broad vs. Phrase vs. Exact match and how to deploy negative keyword lists (-free, -cheap) to stop budget bleed.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/tutorials?tutorialId=4')}
                className="mt-3 w-full text-[11px] h-7 text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1 border-emerald-500/30"
              >
                <span>Study Lesson 4</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            {/* Lesson 6 Card */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-background/80 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
                    Chapter 4 • Lesson 1
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">40 min</span>
                </div>
                <h4 className="font-semibold text-foreground text-xs leading-snug">
                  Ethical AI Prompting & The Persona Hook Matrix
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                  Formulate 5 psychological ad angles (Pain Point, Myth-Busting, Urgency) and enforce strict 30-character headline limits.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/tutorials?tutorialId=6')}
                className="mt-3 w-full text-[11px] h-7 text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 border-purple-500/30"
              >
                <span>Study Lesson 6</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {activeStep !== "setup" && (
        <div className="mb-6">
          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Business Details</h3>
            <p className="text-gray-600 mb-3">{simulation?.businessType}</p>
            
            <h3 className="text-lg font-medium mb-2 text-foreground">Objectives</h3>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              {(Array.isArray(simulation?.objectives) ? simulation.objectives : [simulation?.objectives || "Maximize return on ad spend"]).map((obj: string, index: number) => (
                <li key={index} className="text-muted-foreground">{obj}</li>
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

          {hasUnlockedPersonaTask && (
            <Card className="mt-8 border-2 border-purple-500/50 bg-purple-950/10 shadow-xl overflow-hidden rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-900/30 to-slate-900/40 border-b border-purple-500/20 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-500/20 rounded-xl text-purple-300 border border-purple-500/30">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                        <span>🎯 Extra Client Task: Target New Executive Persona</span>
                        {isPersonaTaskCompleted ? (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                            ✓ Deployed (+25 Rep)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-purple-500/40 text-purple-300 text-[10px]">
                            In Progress
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-0.5">
                        Client special request: Build dedicated persona messaging, channel selection, and keyword architecture.
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-purple-600 text-white font-mono text-xs">
                    +25 Bonus Rep
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-5 text-xs">
                {/* Section 1: Persona Definition */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-white/10">
                  <div className="font-bold text-foreground flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>Persona Blueprint & Hook</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Target Demographic Name:</Label>
                      <Input
                        value={extraPersonaData.personaName}
                        disabled={isPersonaTaskCompleted}
                        onChange={(e) => setExtraPersonaData(prev => ({ ...prev, personaName: e.target.value }))}
                        className="h-8 text-xs bg-slate-950 border-white/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Primary Pain Point:</Label>
                      <Input
                        value={extraPersonaData.painPoint}
                        disabled={isPersonaTaskCompleted}
                        onChange={(e) => setExtraPersonaData(prev => ({ ...prev, painPoint: e.target.value }))}
                        className="h-8 text-xs bg-slate-950 border-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Core Value Proposition / Hook Angle:</Label>
                    <Input
                      value={extraPersonaData.hookAngle}
                      disabled={isPersonaTaskCompleted}
                      onChange={(e) => setExtraPersonaData(prev => ({ ...prev, hookAngle: e.target.value }))}
                      className="h-8 text-xs bg-slate-950 border-white/10"
                    />
                  </div>
                </div>

                {/* Section 2: Channel & Ad Creatives */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-white/10">
                  <div className="font-bold text-foreground flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>Channel Selection & Ad Creative</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Primary Channel for this Persona:</Label>
                      <Select
                        value={extraPersonaData.targetChannel}
                        disabled={isPersonaTaskCompleted}
                        onValueChange={(val) => setExtraPersonaData(prev => ({ ...prev, targetChannel: val }))}
                      >
                        <SelectTrigger className="h-8 text-xs bg-slate-950 border-white/10">
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google_ads">Google Search (High Intent - Recommended)</SelectItem>
                          <SelectItem value="linkedin_ads">LinkedIn B2B Sponsored Content</SelectItem>
                          <SelectItem value="meta_ads">Meta Retargeting (Website Visitors)</SelectItem>
                          <SelectItem value="tiktok">TikTok Video (High Waste for C-Suite)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label className="text-[11px] text-muted-foreground">Daily Budget Reallocation:</Label>
                        <span className="font-mono text-purple-400 font-bold">${extraPersonaData.dailyBudget}/day</span>
                      </div>
                      <Slider
                        value={[extraPersonaData.dailyBudget]}
                        min={10}
                        max={100}
                        step={5}
                        disabled={isPersonaTaskCompleted}
                        onValueChange={(val) => setExtraPersonaData(prev => ({ ...prev, dailyBudget: val[0] }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Headline 1:</Label>
                      <Input
                        value={extraPersonaData.headline1}
                        disabled={isPersonaTaskCompleted}
                        onChange={(e) => setExtraPersonaData(prev => ({ ...prev, headline1: e.target.value }))}
                        className="h-8 text-xs bg-slate-950 border-white/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Headline 2:</Label>
                      <Input
                        value={extraPersonaData.headline2}
                        disabled={isPersonaTaskCompleted}
                        onChange={(e) => setExtraPersonaData(prev => ({ ...prev, headline2: e.target.value }))}
                        className="h-8 text-xs bg-slate-950 border-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Ad Description:</Label>
                    <Textarea
                      value={extraPersonaData.description}
                      disabled={isPersonaTaskCompleted}
                      onChange={(e) => setExtraPersonaData(prev => ({ ...prev, description: e.target.value }))}
                      className="text-xs bg-slate-950 border-white/10 min-h-[50px]"
                    />
                  </div>
                </div>

                {/* Section 3: Targeted Keywords & Negative Keyword Shield */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-white/10">
                  <div className="font-bold text-foreground flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>High-Intent Keywords & Negative Shield</span>
                  </div>

                  {/* Keywords list */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Persona Target Keywords ({extraPersonaData.keywords.length}):</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {extraPersonaData.keywords.map((kw, i) => (
                        <Badge key={i} variant="outline" className="text-xs py-1 px-2 border-purple-500/30 bg-purple-500/10 text-purple-200 flex items-center gap-1.5">
                          <span>{kw.matchType === "exact" ? `[${kw.text}]` : `"${kw.text}"`}</span>
                          {!isPersonaTaskCompleted && (
                            <button
                              type="button"
                              onClick={() => setExtraPersonaData(prev => ({ ...prev, keywords: prev.keywords.filter((_, idx) => idx !== i) }))}
                              className="text-muted-foreground hover:text-red-400"
                            >
                              ×
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>

                    {!isPersonaTaskCompleted && (
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          placeholder="Add executive keyword..."
                          value={extraPersonaData.newKwText}
                          onChange={(e) => setExtraPersonaData(prev => ({ ...prev, newKwText: e.target.value }))}
                          className="h-8 text-xs bg-slate-950 border-white/10 max-w-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && extraPersonaData.newKwText.trim()) {
                              e.preventDefault();
                              setExtraPersonaData(prev => ({
                                ...prev,
                                keywords: [...prev.keywords, { text: prev.newKwText.trim(), matchType: prev.newKwMatch }],
                                newKwText: ""
                              }));
                            }
                          }}
                        />
                        <Select
                          value={extraPersonaData.newKwMatch}
                          onValueChange={(val) => setExtraPersonaData(prev => ({ ...prev, newKwMatch: val }))}
                        >
                          <SelectTrigger className="h-8 text-xs w-28 bg-slate-950 border-white/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="exact">Exact [ ]</SelectItem>
                            <SelectItem value="phrase">Phrase " "</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            if (extraPersonaData.newKwText.trim()) {
                              setExtraPersonaData(prev => ({
                                ...prev,
                                keywords: [...prev.keywords, { text: prev.newKwText.trim(), matchType: prev.newKwMatch }],
                                newKwText: ""
                              }));
                            }
                          }}
                          className="h-8 px-2.5 text-xs bg-purple-600 hover:bg-purple-500 text-white"
                        >
                          + Add
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Negative Keywords */}
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <Label className="text-[11px] text-muted-foreground">Negative Keyword Shields ({extraPersonaData.negativeKeywords.length}):</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {extraPersonaData.negativeKeywords.map((neg, i) => (
                        <Badge key={i} variant="outline" className="text-xs py-0.5 px-2 border-red-500/30 bg-red-500/10 text-red-300">
                          {neg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-2">
                  {isPersonaTaskCompleted ? (
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-950/30 border border-emerald-500/40 p-2.5 rounded-xl">
                      <CheckCircle className="h-4 w-4" />
                      <span>Executive Persona Campaign Live! +25 Rep Points Added to Final Evaluation</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        if (extraPersonaData.targetChannel === "tiktok") {
                          toast({
                            title: "Channel Risk Detected",
                            description: "TikTok burns thin budgets on non-executives. Switch to Google Search or LinkedIn!",
                            variant: "destructive"
                          });
                          return;
                        }
                        if (extraPersonaData.keywords.length < 2) {
                          toast({
                            title: "More Keywords Needed",
                            description: "Please add at least 2 high-intent keywords for this persona.",
                            variant: "destructive"
                          });
                          return;
                        }
                        setIsPersonaTaskCompleted(true);
                        toast({
                          title: "🎉 Extra Persona Task Deployed!",
                          description: "Client approved the executive campaign! +25 Bonus Reputation Points awarded.",
                        });
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-9 px-4 shadow-lg shadow-purple-900/30 flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Deploy Extra Persona Campaign (+25 Rep)</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsTeacherCopilotOpen(true)}
              className="border-amber-500/40 text-amber-500 dark:text-amber-400 hover:bg-amber-500/10 text-xs h-10 flex items-center gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              <span>🎓 Teacher: Review My Setup Before Launch</span>
            </Button>

            <Button 
              onClick={handleSubmit} 
              disabled={submitMutation.isPending}
              className="min-w-[170px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 shadow-lg"
            >
              {submitMutation.isPending ? "Running Auction Simulation..." : "🚀 Launch & Grade Campaign"}
            </Button>
          </div>
        </>
      ) : (
        renderSimulationResults()
      )}

      {/* Mid-Campaign Surprise Boss Crisis Incoming Call Modal */}
      <EmergencyCrisisModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
        onResolved={() => {
          setCrisisResolved(true);
          toast({
            title: "🎉 Retainer Saved!",
            description: "Director Atlas confirmed Dr. Miller's retainer was saved. +15 Reputation Points added to your agency portfolio!",
          });
        }}
        callerName="Director Marcus Atlas"
        callerRole="Managing Director • Krechet Media Group"
        callerAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
        callerVoice="aura-orion-en"
        clientName={simulation?.title || "Dr. Miller Dental Clinic"}
        urgencyBadge="Executive Red Alert"
        crisisAudioText="Stop what you're doing right now! Dr. Miller just called my direct cell screaming. We launched his search campaign three hours ago, and his entire $600 weekly budget has already burned $380 with zero appointments booked! His front desk is getting flooded with calls from people asking for free government dentures and DIY tooth extraction kits! Did someone leave broad match open with zero negative keywords? We are about to lose a ten-thousand dollar retainer in the next ten minutes. What is your immediate tactical action plan?"
        situationReportTitle="Urgent Budget Bleed Report:"
        tacticalQuestion="Your Strategic Executive Response (Client Retention):"
        options={bossCrisisOptions}
        resolutionSummary="🏆 Retainer Saved • +15 Agency Reputation Logged"
      />

      {/* Mid-Campaign Client Persona Request Incoming Call Modal */}
      <EmergencyCrisisModal
        isOpen={isClientPersonaCallOpen}
        onClose={() => setIsClientPersonaCallOpen(false)}
        onResolved={() => {
          toast({
            title: "Client Call Concluded",
            description: "Extra Persona Campaign Task unlocked in your simulation workbench!",
          });
        }}
        onAcceptExtraTask={() => {
          setHasUnlockedPersonaTask(true);
          toast({
            title: "🎯 Extra Task Unlocked!",
            description: "Scroll down to build the Executive Persona, Channel, and Keywords.",
          });
        }}
        acceptExtraTaskLabel="Accept Extra Task & Build Campaign"
        callerName="Dr. Evelyn Reed"
        callerRole="Practice Partner & Client Lead"
        callerAvatar="https://images.unsplash.com/photo-1594824813511-66d7fe9e0c52?auto=format&fit=crop&q=80&w=400"
        callerVoice="aura-asteria-en"
        clientName={simulation?.title || "Apex Dental Clinic"}
        urgencyBadge="Client Growth Request"
        crisisAudioText="Hey! Our board just met and wants us to target high-net-worth corporate executives and business partners for our private emergency suites. But our weekly budget is already thin! I need you to add an extra campaign task to this simulation: flesh out the executive persona, select the right channel that won't burn cash on scrollers, and build out high-intent keywords and negative shields. Can you take on this extra task?"
        situationReportTitle="Client Persona Expansion Brief:"
        tacticalQuestion="Client Request: Add Executive Persona Campaign Task:"
        options={[
          {
            text: "Option A: Accept the challenge! Build a dedicated executive persona angle, allocate high-intent search & LinkedIn budget, and configure exact-match keywords with negative shields.",
            isCorrect: true,
            feedback: "✅ Outstanding initiative. Taking on client expansion requests with rigorous keyword gating and strict channel focus turns average account managers into indispensible agency growth partners.",
            spokenResolution: "Fantastic! I knew I could count on you. I'm adding the Executive Persona Builder task right into your campaign workbench. Go build it out and let's capture those executive patients!"
          },
          {
            text: "Option B: Tell the client that expanding into a new persona is impossible with a thin budget and refuse the request.",
            isCorrect: false,
            feedback: "❌ Missed opportunity. You can always pilot a new persona with strict exact-match keyword gating and small budget reallocation."
          }
        ]}
        resolutionSummary="🏆 Extra Persona Task Unlocked • Ready to Build"
      />

      {/* 60-Second Student Onboarding Walkthrough Dialog */}
      <Dialog open={isOnboardingModalOpen} onOpenChange={setIsOnboardingModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                👋 New Student Quickstart
              </Badge>
              <Badge variant="outline" className="text-xs">
                60-Second Overview
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">
              How to Ace This Ad Campaign Simulation
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Everything you need to know about your role, what to build across the 4 tabs, and how to get graded.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Mission & Role */}
            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 space-y-1.5">
              <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Your Role: Agency Media Buyer</span>
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                You are managing paid search advertising for <strong>{simulation?.title || "your client"}</strong>. The client hired your agency to acquire high-value customers. Your goal is to maximize Return on Ad Spend (ROAS) and Quality Score while preventing budget bleed.
              </p>
            </div>

            {/* The 4 Configuration Steps */}
            <div className="space-y-2">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>The 4-Step Campaign Gameplan</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg bg-card/80 border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-mono">1</span>
                    <span>Campaign Setup</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Select your Campaign Objective. For physical/online stores selling apparel, select <strong>Sales</strong> (not Leads) to train Google AI on checkout transactions.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-card/80 border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-mono">2</span>
                    <span>Ad Groups & Keywords</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Keep each ad group single-themed. Use <strong>Phrase Match</strong> (<code className="text-blue-400">"keyword"</code>) and click the <strong>Quick Shield</strong> button to block non-buyer terms (<code className="text-red-400">-free, -cheap</code>).
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-card/80 border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-mono">3</span>
                    <span>Ad Creatives</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Write 3 headlines (Product • Benefit • Call-to-Action). Keep each headline under Google's strict <strong>30-character limit</strong>. Watch your live SERP preview update!
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-card/80 border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-mono">4</span>
                    <span>Budget & Bidding</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Set a test budget ($50/day recommended) and select <strong>Maximize Conversions</strong>. Add Sitelink extensions to boost ad real estate and click-through rate.
                  </p>
                </div>
              </div>
            </div>

            {/* Pacing Reassurance */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2.5">
              <Coffee className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground text-xs">Work at Your Own Pace Throughout the Week</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Real media buyers tweak campaigns continuously. You do not have to finish everything right now. Your work is <strong>automatically auto-saved</strong> to your browser. You can take a break or jump into Chapter 2 & Chapter 4 tutorial lessons anytime.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOnboardingModalOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground w-full sm:w-auto"
            >
              I'll Build From Scratch
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                handleLoadStarterDraft();
                setIsOnboardingModalOpen(false);
              }}
              className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold flex items-center gap-1.5 shadow-md w-full sm:w-auto"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Load Starter Benchmark Draft & Guide Me</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Ask Growth Director Mentor Side Drawer */}
      <FlightInstructorCopilot 
        track="ads"
        pageTitle={`${simulation?.title || "Paid Search Campaign"} (${simulation?.platform || "Google Ads"})`}
        isOpenExternal={isTeacherCopilotOpen}
        onOpenChange={setIsTeacherCopilotOpen}
        currentDraft={{
          platform: simulation?.platform || activePlatformTab,
          googleForm,
          metaForm,
          linkedinForm,
          extraPersonaData,
          hasUnlockedPersonaTask,
          isPersonaTaskCompleted
        }}
      />
    </div>
  );
}
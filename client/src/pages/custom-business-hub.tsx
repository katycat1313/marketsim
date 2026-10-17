import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Building2, 
  Sparkles, 
  Brain, 
  TrendingUp, 
  ShieldCheck, 
  Play, 
  Globe, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Sliders,
  Copy,
  Lock,
  ArrowRight,
  Upload,
  FileCode,
  Image as ImageIcon,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Trash2,
  ExternalLink
} from "lucide-react";

export default function CustomBusinessHub() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("intake");

  const [businessName, setBusinessName] = useState("Bella's Italian Trattoria");
  const [niche, setNiche] = useState("Italian Restaurant & Fresh Pasta");
  const [websiteUrl, setWebsiteUrl] = useState("https://bellastrattoria.com");
  const [location, setLocationText] = useState("Morgantown, WV");
  const [monthlyBudget, setMonthlyBudget] = useState(600);
  const [menuServices, setMenuServices] = useState("Handmade Fettuccine Alfredo, Wood-Fired Margherita Pizza, Truffle Risotto, Catering Platters, VIP Wine Tastings, Gluten-Free Pasta");
  const [targetNotes, setTargetNotes] = useState("We are busy on Saturday nights but slow on Tuesday-Thursday lunch. Want more corporate office catering and weekday date night couples.");
  const [mentorName, setMentorName] = useState("Director Atlas");
  const [mentorTone, setMentorTone] = useState("Strategic & Socratic");

  const [analyzedWebsite, setAnalyzedWebsite] = useState<any>(null);
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false);

  // Smart UI & Asset Import State
  const [importMethod, setImportMethod] = useState<"code" | "image" | "url">("code");
  const [rawHtmlInput, setRawHtmlInput] = useState("");
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [showCodeGuide, setShowCodeGuide] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const { data: profile, refetch: refetchProfile } = useQuery<any>({
    queryKey: ["/api/custom-business/profile"],
    queryFn: async () => {
      const res = await fetch("/api/custom-business/profile");
      return res.json();
    }
  });

  useEffect(() => {
    if (profile) {
      if (profile.businessName) setBusinessName(profile.businessName);
      if (profile.niche) setNiche(profile.niche);
      if (profile.websiteUrl) setWebsiteUrl(profile.websiteUrl);
      if (profile.location) setLocationText(profile.location);
      if (profile.monthlyBudget) setMonthlyBudget(profile.monthlyBudget);
      if (profile.uploadedMenu) setMenuServices(profile.uploadedMenu);
      if (profile.mentorName) setMentorName(profile.mentorName);
      if (profile.mentorTone) setMentorTone(profile.mentorTone);
      if (profile.analyzedWebsiteData) setAnalyzedWebsite(profile.analyzedWebsiteData);
      if (profile.uploadedPhotos && profile.uploadedPhotos.length > 0) {
        setUploadedImagePreview(profile.uploadedPhotos[0]);
      }
      if (profile.uploadedHtmlCode) {
        setRawHtmlInput(profile.uploadedHtmlCode);
      }
    }
  }, [profile]);

  const saveProfileMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/custom-business/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return res.json();
    },
    onSuccess: () => {
      refetchProfile();
      toast({
        title: "Digital Twin Saved ✅",
        description: "Your business sandbox and AI Mentor settings have been updated.",
      });
    }
  });

  const handleAnalyzeWebsite = async () => {
    setIsAnalyzingUrl(true);
    try {
      const res = await fetch("/api/custom-business/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: websiteUrl,
          rawText: menuServices,
          businessName,
          niche
        })
      });
      const data = await res.json();
      setAnalyzedWebsite(data);
      toast({
        title: "Website Ingestion Complete 🌐",
        description: `Extracted title, headings, and structure for ${businessName}.`,
      });
    } catch (e: any) {
      toast({
        title: "Analysis Fallback",
        description: "Generated baseline semantic structure for your sandbox.",
      });
    } finally {
      setIsAnalyzingUrl(false);
    }
  };

  const handleAnalyzeHtml = async (codeToAnalyze?: string) => {
    const html = codeToAnalyze || rawHtmlInput;
    if (!html || !html.trim()) {
      toast({
        title: "No Code Detected",
        description: "Please paste your website HTML code or upload an HTML file first.",
        variant: "destructive"
      });
      return;
    }
    setIsAnalyzingUrl(true);
    try {
      const res = await fetch("/api/custom-business/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawHtml: html,
          businessName,
          niche
        })
      });
      const data = await res.json();
      setAnalyzedWebsite(data);
      if (data.services && data.services.length > 0) {
        setMenuServices(data.services.join(", "));
      }
      toast({
        title: "Webpage UI Code Ingested & Analyzed! 💻",
        description: `Extracted title, headings, images, and ${data.services?.length || 0} offerings for ${businessName}.`,
      });
    } catch (e: any) {
      toast({
        title: "Analysis Fallback",
        description: "Processed local HTML structure for your sandbox.",
      });
    } finally {
      setIsAnalyzingUrl(false);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setUploadedImagePreview(dataUrl);
        setUploadedImageName(file.name);
        setIsAnalyzingUrl(true);
        try {
          const res = await fetch("/api/custom-business/analyze-website", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageDataUrl: dataUrl,
              imageName: file.name,
              businessName,
              niche
            })
          });
          const data = await res.json();
          setAnalyzedWebsite(data);
          toast({
            title: "Brand Screenshot / Flyer Ingested! 🖼️",
            description: `Loaded '${file.name}' into your ad creative and landing page simulation sandbox.`,
          });
        } catch (err) {
          toast({
            title: "Image Stored",
            description: `Stored '${file.name}' as your active brand asset.`,
          });
        } finally {
          setIsAnalyzingUrl(false);
        }
      };
      reader.readAsDataURL(file);
    } else if (file.name.endsWith(".html") || file.name.endsWith(".htm") || file.name.endsWith(".txt") || file.type.includes("html") || file.type.includes("text")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setRawHtmlInput(text);
        handleAnalyzeHtml(text);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Unsupported File Format",
        description: "Please upload an HTML file (.html, .htm), text file (.txt), or image (.png, .jpg, .webp).",
        variant: "destructive"
      });
    }
  };

  const generatePersonasMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/custom-business/generate-personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          niche,
          location,
          targetNotes,
          menuServices,
          mentorName
        })
      });
      return res.json();
    },
    onSuccess: () => {
      refetchProfile();
      setActiveTab("personas");
      toast({
        title: "Personas Generated 🎯",
        description: `${mentorName} has constructed 3 hyper-targeted customer personas.`,
      });
    }
  });

  const discoverChannelsMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/custom-business/discover-channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          niche,
          location,
          monthlyBudget
        })
      });
      return res.json();
    },
    onSuccess: () => {
      refetchProfile();
      setActiveTab("channels");
      toast({
        title: "Channels Discovered 🚀",
        description: "Revealed 4 underutilized high-ROI growth channels for your market.",
      });
    }
  });

  const generateMissionsMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/custom-business/generate-missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          niche,
          location,
          monthlyBudget
        })
      });
      return res.json();
    },
    onSuccess: () => {
      refetchProfile();
      setActiveTab("missions");
      toast({
        title: "Custom Missions Live 🕹️",
        description: "Your personalized SEO and Ad simulation sandboxes are ready.",
      });
    }
  });

  const handleSaveAll = () => {
    saveProfileMutation.mutate({
      businessName,
      niche,
      websiteUrl,
      location,
      monthlyBudget,
      uploadedMenu: menuServices,
      mentorName,
      mentorTone
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard 📋",
      description: text,
    });
  };

  const personas = profile?.personas || [];
  const channels = profile?.discoveredChannels || [];
  const missions = profile?.customMissions || [];

  const mentorAvatar = mentorName.toLowerCase().includes("atlas")
    ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400";

  return (
    <div className="min-h-screen bg-transparent text-foreground space-y-8 pb-16">
      
      {/* Top Hero Banner with Glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge className="bg-primary/20 text-primary border-primary/40 px-3 py-1 font-mono uppercase tracking-wider text-xs">
                <Building2 className="h-3.5 w-3.5 mr-1.5 inline text-amber-400" />
                Premium Feature • Custom Business Digital Twin
              </Badge>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs flex items-center gap-1">
                <Lock className="h-3 w-3" /> 100% Private & Ethically Sandboxed
              </Badge>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              My Business Sandbox & Persona Studio
            </h1>
            
            <p className="text-base text-muted-foreground leading-relaxed">
              Clone your real-world business into an interactive simulation sandbox. Customize your dedicated AI Mentor (<span className="text-primary font-semibold">{mentorName}</span>), build precision customer personas, discover hidden high-ROI channels, and test ad spend risk-free.
            </p>
          </div>

          {/* AI Mentor Quick Card with Glass Styling & Correct Avatar */}
          <div className="bg-slate-950/80 backdrop-blur-xl border border-white/15 rounded-xl p-4 shadow-xl min-w-[280px] space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={mentorAvatar} 
                  alt={mentorName}
                  className="h-12 w-12 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] text-black font-bold items-center justify-center">AI</span>
                </span>
              </div>
              <div>
                <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  {mentorName}
                </p>
                <p className="text-xs text-primary font-mono">{mentorTone}</p>
                <p className="text-[10px] text-muted-foreground">Lead Growth Director</p>
              </div>
            </div>

            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setActiveTab("intake")}
              className="w-full text-xs border-primary/30 hover:bg-primary/10 flex items-center justify-center gap-1.5"
            >
              <Sliders className="h-3.5 w-3.5" />
              Customize Mentor & Niche
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-card border border-border/80 p-1 rounded-xl h-auto">
          <TabsTrigger value="intake" className="py-2.5 text-xs md:text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>1. Business & Mentor</span>
          </TabsTrigger>
          <TabsTrigger value="personas" className="py-2.5 text-xs md:text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>2. Persona Studio ({personas.length})</span>
          </TabsTrigger>
          <TabsTrigger value="channels" className="py-2.5 text-xs md:text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>3. Channel Matrix ({channels.length})</span>
          </TabsTrigger>
          <TabsTrigger value="missions" className="py-2.5 text-xs md:text-sm font-semibold flex items-center gap-2">
            <Play className="h-4 w-4" />
            <span>4. Custom Missions ({missions.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INTAKE */}
        <TabsContent value="intake" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/80 bg-card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Business Digital Twin Profile
                  </CardTitle>
                  <CardDescription>
                    Enter your real business details or upload your menu/services. We use this to generate customized simulations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Business Name</label>
                      <Input 
                        value={businessName} 
                        onChange={(e) => setBusinessName(e.target.value)} 
                        placeholder="e.g. Bella's Italian Trattoria"
                        className="bg-background text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Niche / Industry</label>
                      <Input 
                        value={niche} 
                        onChange={(e) => setNiche(e.target.value)} 
                        placeholder="e.g. Italian Restaurant, Cosmetic Dentist, E-Commerce"
                        className="bg-background text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Target Location (City, State / Region)</label>
                      <Input 
                        value={location} 
                        onChange={(e) => setLocationText(e.target.value)} 
                        placeholder="e.g. Morgantown, WV"
                        className="bg-background text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Monthly Ad Budget ($)</label>
                      <Input 
                        type="number"
                        value={monthlyBudget} 
                        onChange={(e) => setMonthlyBudget(Number(e.target.value))} 
                        placeholder="500"
                        className="bg-background text-xs"
                      />
                    </div>
                  </div>

                  {/* Digital Twin Asset & UI Ingestion Center */}
                  <div className="space-y-3 pt-3 border-t border-border/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                          <span>Smart Business Asset & UI Importer</span>
                        </label>
                        <p className="text-[11px] text-muted-foreground">
                          Import your live website, UI HTML code, or brand screenshot to populate your custom sandbox.
                        </p>
                      </div>

                      {/* Ingestion Mode Switcher */}
                      <div className="flex items-center bg-secondary/60 p-0.5 rounded-lg border border-border/60 shrink-0">
                        <button
                          type="button"
                          onClick={() => setImportMethod("code")}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                            importMethod === "code"
                              ? "bg-primary text-primary-foreground shadow"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <FileCode className="h-3 w-3" />
                          <span>UI Code (.html)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImportMethod("image")}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                            importMethod === "image"
                              ? "bg-primary text-primary-foreground shadow"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <ImageIcon className="h-3 w-3" />
                          <span>Screenshot / Flyer</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImportMethod("url")}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                            importMethod === "url"
                              ? "bg-primary text-primary-foreground shadow"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Globe className="h-3 w-3" />
                          <span>Live URL</span>
                        </button>
                      </div>
                    </div>

                    {/* METHOD 1: UI CODE (HTML) */}
                    {importMethod === "code" && (
                      <div className="space-y-3 bg-secondary/20 p-3.5 rounded-xl border border-border/80">
                        {/* Interactive Educational Accordion: How to Grab Code in 10s */}
                        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                          <button
                            type="button"
                            onClick={() => setShowCodeGuide(!showCodeGuide)}
                            className="w-full flex items-center justify-between text-left text-xs font-bold text-primary hover:underline"
                          >
                            <span className="flex items-center gap-1.5">
                              <HelpCircle className="h-3.5 w-3.5" />
                              💡 How to get your website's UI code in 10 seconds (Zero Coding Required)
                            </span>
                            {showCodeGuide ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>

                          {showCodeGuide && (
                            <div className="mt-2.5 pt-2.5 border-t border-primary/20 space-y-2 text-[11px] text-slate-300">
                              <p className="leading-relaxed">
                                You don't need server access or developer tools! Anyone can grab their public website structure in 4 quick clicks:
                              </p>
                              <ol className="list-decimal pl-5 space-y-1.5 text-muted-foreground">
                                <li>
                                  <strong className="text-foreground">Open your website:</strong> Navigate to your homepage in Google Chrome, Edge, Brave, or Safari.
                                </li>
                                <li>
                                  <strong className="text-foreground">View Page Source:</strong> Right-click anywhere blank on the page and select <span className="text-emerald-400 font-semibold">"View Page Source"</span> (or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-foreground font-mono">Ctrl + U</kbd> on Windows / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-foreground font-mono">⌘ + Option + U</kbd> on Mac).
                                </li>
                                <li>
                                  <strong className="text-foreground">Copy All Code:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-foreground font-mono">Ctrl + A</kbd> (Select All), then <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-foreground font-mono">Ctrl + C</kbd> (Copy).
                                </li>
                                <li>
                                  <strong className="text-foreground">Paste Below or Drop File:</strong> Paste the text into the box below, or save it as <code className="text-amber-400">index.html</code> and drag-and-drop it into the box!
                                </li>
                              </ol>
                              <div className="p-2 rounded bg-slate-900/80 border border-white/10 text-[10px] text-emerald-400 flex items-center gap-1.5">
                                <ShieldCheck className="h-3 w-3 shrink-0" />
                                <span>Why this works: Our educational engine parses your exact headings, meta descriptions, image tags, and offerings without exposing any private backend data.</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Drag and Drop Zone for HTML file */}
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                          onDragLeave={() => setIsDraggingFile(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingFile(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleFileUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                            isDraggingFile 
                              ? "border-primary bg-primary/10" 
                              : "border-border hover:border-primary/50 bg-background/50"
                          }`}
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = ".html,.htm,.txt";
                            input.onchange = (e: any) => {
                              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-6 w-6 text-primary mx-auto mb-1" />
                          <p className="text-xs font-semibold text-foreground">
                            Click to upload or drag & drop your <span className="text-primary font-mono">.html</span> file
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Supports .html, .htm, or raw text export from any CMS or website builder
                          </p>
                        </div>

                        {/* Paste raw HTML Area */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                            <span>Or paste raw HTML source code:</span>
                            {rawHtmlInput && (
                              <span className="text-[10px] text-primary font-mono">{rawHtmlInput.length.toLocaleString()} characters</span>
                            )}
                          </label>
                          <Textarea
                            value={rawHtmlInput}
                            onChange={(e) => setRawHtmlInput(e.target.value)}
                            placeholder="<!DOCTYPE html><html><head><title>My Restaurant</title>... Paste your source code here..."
                            className="bg-background text-[11px] font-mono min-h-[90px]"
                          />
                          <div className="flex justify-end gap-2 pt-1">
                            {rawHtmlInput && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setRawHtmlInput("")}
                                className="text-xs h-7 text-muted-foreground"
                              >
                                Clear
                              </Button>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleAnalyzeHtml()}
                              disabled={isAnalyzingUrl || !rawHtmlInput.trim()}
                              className="text-xs h-7 bg-primary text-primary-foreground font-bold flex items-center gap-1.5"
                            >
                              {isAnalyzingUrl ? <RefreshCw className="h-3 w-3 animate-spin" /> : <FileCode className="h-3 w-3" />}
                              <span>Analyze & Ingest Webpage Code</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* METHOD 2: SCREENSHOT / IMAGE ASSET */}
                    {importMethod === "image" && (
                      <div className="space-y-3 bg-secondary/20 p-3.5 rounded-xl border border-border/80">
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                          onDragLeave={() => setIsDraggingFile(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingFile(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleFileUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                            isDraggingFile 
                              ? "border-primary bg-primary/10" 
                              : "border-border hover:border-primary/50 bg-background/50"
                          }`}
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e: any) => {
                              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                            };
                            input.click();
                          }}
                        >
                          <ImageIcon className="h-6 w-6 text-primary mx-auto mb-1" />
                          <p className="text-xs font-semibold text-foreground">
                            Upload website screenshot, menu flyer, or product photo
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            PNG, JPG, or WEBP up to 10MB • Automatically attached to your ad creative simulators
                          </p>
                        </div>

                        {uploadedImagePreview && (
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/60">
                            <div className="flex items-center gap-3">
                              <img
                                src={uploadedImagePreview}
                                alt="Uploaded Brand Asset"
                                className="h-12 w-12 object-cover rounded-md border border-border"
                              />
                              <div>
                                <p className="text-xs font-bold text-foreground">
                                  {uploadedImageName || "Active Brand Visual Asset"}
                                </p>
                                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 inline" /> Loaded into Ad & CRO simulators
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setUploadedImagePreview(null);
                                setUploadedImageName(null);
                              }}
                              className="text-xs h-7 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* METHOD 3: LIVE URL */}
                    {importMethod === "url" && (
                      <div className="space-y-2 bg-secondary/20 p-3.5 rounded-xl border border-border/80">
                        <div className="flex gap-2">
                          <Input 
                            value={websiteUrl} 
                            onChange={(e) => setWebsiteUrl(e.target.value)} 
                            placeholder="https://yourwebsite.com"
                            className="bg-background text-xs"
                          />
                          <Button 
                            type="button" 
                            variant="secondary"
                            onClick={handleAnalyzeWebsite}
                            disabled={isAnalyzingUrl || !websiteUrl}
                            className="text-xs flex items-center gap-1.5 shrink-0"
                          >
                            {isAnalyzingUrl ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Globe className="h-3.5 w-3.5 text-primary" />
                            )}
                            <span>Extract Structure</span>
                          </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Performs a read-only HTTP extraction of your public title, meta description, and headings.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Menu, Product Catalog, or Key Services Offered
                    </label>
                    <Textarea 
                      value={menuServices} 
                      onChange={(e) => setMenuServices(e.target.value)} 
                      placeholder="List your top selling dishes, service packages, pricing, or product descriptions..."
                      className="bg-background text-xs min-h-[90px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Owner's Core Challenge & Target Goals
                    </label>
                    <Textarea 
                      value={targetNotes} 
                      onChange={(e) => setTargetNotes(e.target.value)} 
                      placeholder="What is your biggest bottleneck? (e.g. slow weekday lunch, low ROAS on Meta ads, need more catering leads)..."
                      className="bg-background text-xs min-h-[70px]"
                    />
                  </div>

                </CardContent>
                <CardFooter className="flex justify-between border-t border-border/60 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveAll}
                    disabled={saveProfileMutation.isPending}
                    className="text-xs"
                  >
                    Save Changes
                  </Button>

                  <Button 
                    size="sm"
                    onClick={() => {
                      handleSaveAll();
                      generatePersonasMutation.mutate();
                    }}
                    disabled={generatePersonasMutation.isPending}
                    className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 flex items-center gap-2 text-xs shadow-md"
                  >
                    {generatePersonasMutation.isPending ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Brain className="h-3.5 w-3.5" />
                    )}
                    <span>Save & Build Personas with {mentorName}</span>
                  </Button>
                </CardFooter>
              </Card>

              {analyzedWebsite && (
                <Card className="border-emerald-500/40 bg-slate-950/70 backdrop-blur-md shadow-xl overflow-hidden">
                  <CardHeader className="py-3.5 bg-emerald-950/30 border-b border-emerald-500/20">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        <span>Website Semantic Structure & Assets Ingested</span>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                          {analyzedWebsite.sourceMode === "html_code" ? "💻 HTML UI Code" : analyzedWebsite.sourceMode === "image_upload" ? "🖼️ Brand Visual Asset" : "🌐 Live URL"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                          {analyzedWebsite.url}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3.5 p-4 text-xs">
                    
                    {/* SERP Snippet Preview */}
                    <div className="space-y-1">
                      <span className="font-semibold text-foreground flex items-center justify-between">
                        <span>SERP Snippet (How Google displays your site):</span>
                        <span className={`text-[10px] font-mono ${
                          analyzedWebsite.title?.length >= 20 && analyzedWebsite.title?.length <= 60 
                            ? "text-emerald-400" 
                            : "text-amber-400"
                        }`}>
                          Title: {analyzedWebsite.title?.length || 0} / 60 chars
                        </span>
                      </span>
                      <div className="p-3 rounded-lg bg-background border border-border/80 space-y-1">
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                          <span>{analyzedWebsite.url}</span>
                        </p>
                        <h4 className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer leading-tight">
                          {analyzedWebsite.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {analyzedWebsite.description || "No meta description found. Google will generate an arbitrary snippet from body text."}
                        </p>
                      </div>
                    </div>

                    {/* Extracted Headings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="font-semibold text-foreground block mb-1">Primary Heading (H1):</span>
                        <div className="p-2 rounded bg-background/60 border border-border/60 text-muted-foreground font-mono text-[11px]">
                          {analyzedWebsite.h1List && analyzedWebsite.h1List.length > 0 ? (
                            analyzedWebsite.h1List.map((h1: string, i: number) => (
                              <p key={i} className="truncate">• {h1}</p>
                            ))
                          ) : (
                            <span className="text-amber-400 italic">No H1 tag detected</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold text-foreground block mb-1">Subheadings (H2):</span>
                        <div className="p-2 rounded bg-background/60 border border-border/60 text-muted-foreground font-mono text-[11px] max-h-20 overflow-y-auto space-y-0.5">
                          {analyzedWebsite.h2List && analyzedWebsite.h2List.length > 0 ? (
                            analyzedWebsite.h2List.map((h2: string, i: number) => (
                              <p key={i} className="truncate">• {h2}</p>
                            ))
                          ) : (
                            <span className="text-muted-foreground italic">None found</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Extracted Services & One-Click Apply */}
                    {analyzedWebsite.services && analyzedWebsite.services.length > 0 && (
                      <div className="space-y-1.5 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground flex items-center gap-1 text-[11px]">
                            <Sparkles className="h-3 w-3 text-primary" />
                            <span>Extracted Offerings & Products ({analyzedWebsite.services.length}):</span>
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setMenuServices(analyzedWebsite.services.join(", "));
                              toast({
                                title: "Offerings Applied! 📋",
                                description: "Updated your profile's product/services list.",
                              });
                            }}
                            className="text-[10px] h-6 text-primary hover:bg-primary/20 font-bold"
                          >
                            Apply to Profile Form
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {analyzedWebsite.services.map((srv: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-[10px] font-normal py-0.5 px-2">
                              {srv}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Uploaded Brand Asset Preview */}
                    {(uploadedImagePreview || analyzedWebsite.imageAsset) && (
                      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border/60">
                        <img
                          src={uploadedImagePreview || analyzedWebsite.imageAsset}
                          alt="Brand Asset"
                          className="h-10 w-10 object-cover rounded border border-border"
                        />
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-bold text-foreground">
                            Active Brand Creative Asset Loaded
                          </p>
                          <p className="text-[10px] text-emerald-400">
                            Available in ad split-testing and landing page previews
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Detected SEO & Growth Bottlenecks */}
                    {analyzedWebsite.detectedIssues && analyzedWebsite.detectedIssues.length > 0 && (
                      <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                        <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Detected Growth Bottlenecks to Fix in Simulations ({analyzedWebsite.detectedIssues.length}):</span>
                        </span>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1 text-[11px]">
                          {analyzedWebsite.detectedIssues.map((issue: string, idx: number) => (
                            <li key={idx} className="leading-snug">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => {
                          handleSaveAll();
                          generatePersonasMutation.mutate();
                        }}
                        disabled={generatePersonasMutation.isPending}
                        className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-xs flex items-center gap-1.5"
                      >
                        <Brain className="h-3.5 w-3.5" />
                        <span>Build Precision Personas from Ingested Data <ArrowRight className="h-3 w-3 ml-1" /></span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-border/80 bg-card">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    AI Mentor Customization
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Personalize your dedicated Growth Director and Campaign Mentor.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Mentor Name</label>
                    <Input 
                      value={mentorName} 
                      onChange={(e) => setMentorName(e.target.value)} 
                      placeholder="Director Atlas"
                      className="bg-background text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Coaching Persona / Tone</label>
                    <select 
                      value={mentorTone}
                      onChange={(e) => setMentorTone(e.target.value)}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Strategic & Socratic">Strategic & Socratic (Orchestrator)</option>
                      <option value="Fast-Paced ROI">Fast-Paced ROI & Direct (Agency Executive)</option>
                      <option value="Technical & Diagnostic">Technical & Diagnostic (SEO/CRO Engineer)</option>
                      <option value="Supportive Coach">Supportive & Step-by-Step (Beginner Friendly)</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-lg bg-secondary/40 border border-border/70 space-y-1.5">
                    <span className="font-semibold text-primary block">Mentor Socratic Rule:</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                      “{mentorName} will never just spoon-feed generic answers. She guides you to uncover customer psychology, structure ad hooks, and spot budget leaks on your own.”
                    </p>
                  </div>

                  <Button 
                    size="sm" 
                    onClick={handleSaveAll}
                    className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs"
                  >
                    Save Mentor Preferences
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-secondary/10">
                <CardHeader className="py-3">
                  <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Ethical Sandbox & Data Guarantee
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-[11px] text-muted-foreground leading-relaxed">
                  <p>
                    • <strong>Safe Ingestion:</strong> Cloned assets are sandboxed in private memory and never published to the public web.
                  </p>
                  <p>
                    • <strong>Zero Risk:</strong> Simulate ad spend, keyword bids, and landing page edits without spending real money.
                  </p>
                  <p>
                    • <strong>Private Account:</strong> Your customer notes and menus remain 100% private to your subscriber account.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: PERSONAS */}
        <TabsContent value="personas" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/30 p-4 rounded-xl border border-border/80">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                AI Customer Persona Studio
              </h2>
              <p className="text-xs text-muted-foreground">
                Hyper-specific buyer psychology crafted by {mentorName} for <span className="text-foreground font-semibold">{businessName}</span>.
              </p>
            </div>

            <Button
              onClick={() => generatePersonasMutation.mutate()}
              disabled={generatePersonasMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs flex items-center gap-2 shrink-0"
            >
              {generatePersonasMutation.isPending ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>Regenerate Personas with {mentorName}</span>
            </Button>
          </div>

          {personas.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-xl space-y-4">
              <Brain className="h-12 w-12 text-primary/40 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">No Personas Generated Yet</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Click the button below to have {mentorName} analyze your menu, location, and business goals to generate 3 actionable customer personas.
                </p>
              </div>
              <Button 
                onClick={() => generatePersonasMutation.mutate()}
                disabled={generatePersonasMutation.isPending}
                className="bg-primary text-primary-foreground font-bold text-xs"
              >
                Generate Personas Now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {personas.map((persona: any, index: number) => (
                <Card key={persona.id || index} className="border-border/80 bg-card flex flex-col justify-between shadow-lg hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3 border-b border-border/50 bg-secondary/20">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{persona.avatarEmoji || "🎯"}</span>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                        Persona #{index + 1}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground mt-2">
                      {persona.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {persona.demographics}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3.5 p-4 text-xs">
                    <div>
                      <span className="font-semibold text-rose-400 block mb-0.5">🔥 Core Burning Pain Point:</span>
                      <p className="text-muted-foreground leading-relaxed">{persona.corePainPoint}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-emerald-400 block mb-0.5">⚡ Urgent Buying Trigger:</span>
                      <p className="text-muted-foreground leading-relaxed">{persona.buyingTrigger}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-primary block mb-1">🔍 High-Converting Search Queries:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(persona.highConvertingKeywords || []).map((kw: string, i: number) => (
                          <span 
                            key={i} 
                            onClick={() => copyToClipboard(kw)}
                            className="px-2 py-0.5 rounded bg-secondary text-[11px] text-foreground hover:bg-primary/20 cursor-pointer flex items-center gap-1 border border-border/50"
                            title="Click to copy keyword"
                          >
                            <span>{kw}</span>
                            <Copy className="h-2.5 w-2.5 text-muted-foreground" />
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/60 space-y-1">
                      <span className="font-semibold text-amber-400 block text-[11px]">📢 Viral Ad Hook Angle:</span>
                      <p className="text-foreground italic leading-relaxed">"{persona.adHookAngle}"</p>
                    </div>

                    <div>
                      <span className="font-semibold text-muted-foreground block mb-0.5">🛡️ Primary Objection:</span>
                      <p className="text-muted-foreground text-[11px]">{persona.primaryObjection}</p>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 border-t border-border/40 mt-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setActiveTab("missions");
                        toast({
                          title: "Persona Loaded into Mission",
                          description: `Targeting ${persona.name} in your custom simulation.`,
                        });
                      }}
                      className="w-full text-xs hover:bg-primary/10 border-primary/30"
                    >
                      Target in Simulation Mission <ArrowRight className="h-3 w-3 ml-1.5" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 3: CHANNELS */}
        <TabsContent value="channels" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/30 p-4 rounded-xl border border-border/80">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Hidden Channel Discovery Matrix
              </h2>
              <p className="text-xs text-muted-foreground">
                High-yield, overlooked marketing channels tailored to <span className="text-foreground font-semibold">{niche}</span> in <span className="text-foreground font-semibold">{location}</span>.
              </p>
            </div>

            <Button
              onClick={() => discoverChannelsMutation.mutate()}
              disabled={discoverChannelsMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs flex items-center gap-2 shrink-0"
            >
              {discoverChannelsMutation.isPending ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>Discover More Channels</span>
            </Button>
          </div>

          {channels.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-xl space-y-4">
              <TrendingUp className="h-12 w-12 text-primary/40 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">No Channels Discovered Yet</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Click the button below to analyze your local market and unlock 4 underutilized marketing channels.
                </p>
              </div>
              <Button 
                onClick={() => discoverChannelsMutation.mutate()}
                disabled={discoverChannelsMutation.isPending}
                className="bg-primary text-primary-foreground font-bold text-xs"
              >
                Discover Channels Now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {channels.map((ch: any, idx: number) => (
                <Card key={ch.id || idx} className="border-border/80 bg-card space-y-3 p-5 shadow-md hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-semibold">
                      {ch.category}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs font-mono font-bold">
                        {ch.estimatedROAS} ROAS
                      </Badge>
                      <Badge variant="outline" className="text-muted-foreground text-xs">
                        Effort: {ch.effortLevel}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground">{ch.channelName}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ch.whyItWorks}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <span className="text-xs font-semibold text-foreground">Tactical Action Checklist:</span>
                    <ul className="space-y-1 pl-4 list-disc text-xs text-muted-foreground">
                      {(ch.tacticalActionSteps || []).map((step: string, sIdx: number) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 4: MISSIONS */}
        <TabsContent value="missions" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/30 p-4 rounded-xl border border-border/80">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Custom Campaign Simulation Workbenches
              </h2>
              <p className="text-xs text-muted-foreground">
                Practice high-ROI campaigns loaded with <span className="text-foreground font-semibold">{businessName}</span>'s actual data.
              </p>
            </div>

            <Button
              onClick={() => generateMissionsMutation.mutate()}
              disabled={generateMissionsMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs flex items-center gap-2 shrink-0"
            >
              {generateMissionsMutation.isPending ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>Regenerate Custom Missions</span>
            </Button>
          </div>

          {missions.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-xl space-y-4">
              <Play className="h-12 w-12 text-primary/40 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">No Custom Missions Built Yet</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Click the button below to generate 3 tailored growth simulation campaigns based on your uploaded business profile.
                </p>
              </div>
              <Button 
                onClick={() => generateMissionsMutation.mutate()}
                disabled={generateMissionsMutation.isPending}
                className="bg-primary text-primary-foreground font-bold text-xs"
              >
                Generate Custom Missions Now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {missions.map((mission: any, idx: number) => (
                <Card key={mission.id || idx} className="border-border/80 bg-card flex flex-col justify-between shadow-lg">
                  <CardHeader className="pb-3 bg-secondary/20 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                        {mission.track}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {mission.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground mt-2">
                      {mission.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground line-clamp-3 mt-1">
                      {mission.scenarioBrief}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3 text-xs">
                    <div>
                      <span className="font-semibold text-foreground block mb-1">Mission Objectives:</span>
                      <ul className="space-y-1 pl-4 list-disc text-muted-foreground">
                        {(mission.objectives || []).map((obj: string, oIdx: number) => (
                          <li key={oIdx}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    {mission.initialBudget > 0 && (
                      <div className="flex items-center justify-between p-2 rounded bg-secondary/40 border border-border/50 text-xs">
                        <span className="text-muted-foreground">Simulated Ad Budget:</span>
                        <span className="font-mono font-bold text-emerald-400">${mission.initialBudget}/mo</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 pt-0 border-t border-border/40 mt-auto">
                    <Button 
                      onClick={() => {
                        if (mission.simulationType === "seo") setLocation("/seo-simulation/1");
                        else if (mission.simulationType === "google_ads") setLocation("/ad-simulations");
                        else setLocation("/capstone");
                      }}
                      className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-xs flex items-center justify-center gap-1.5"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Launch Custom Mission Sandbox</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}

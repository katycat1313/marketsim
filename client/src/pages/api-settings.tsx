import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Key, User, CreditCard, Settings, Upload, Bell, Bot, Sparkles, Building2, Mic, Flame, Smile, ShieldAlert, Award } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { getInstructorConfig, saveInstructorConfig, type InstructorConfig } from "@/lib/instructorConfig";

export default function SettingsPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedProvider, setSelectedProvider] = useState("anthropic");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [instructorSettings, setInstructorSettings] = useState<InstructorConfig>(getInstructorConfig);

  const form = useForm({
    defaultValues: {
      // AI Provider settings
      activeProvider: "anthropic",
      anthropicApiKey: "",
      openaiApiKey: "",
      geminiApiKey: "",
      // User Profile settings
      name: "",
      email: "",
      company: "",
      username: "",
      // Application preferences
      theme: "system",
      emailNotifications: true,
    },
  });

  async function onSubmit(data: any) {
    try {
      await apiRequest("POST", "/api/settings", data);
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings",
      });
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement file upload to storage
      // For now, create a temporary URL
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Settings</h1>
          <p className="text-muted-foreground mb-8">Customize your experience and manage your account</p>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-muted/50 p-1">
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="instructor" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">
                <Bot className="h-4 w-4" />
                AI Instructor
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">
                <CreditCard className="h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>
                        Manage your personal information and account details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center space-y-4 mb-6">
                        <Avatar className="h-24 w-24">
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt="Profile" />
                          ) : (
                            <AvatarFallback className="bg-primary/10">
                              <User className="h-12 w-12 text-primary/40" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="avatar-upload"
                            onChange={handleAvatarUpload}
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById("avatar-upload")?.click()}
                            className="flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Photo
                          </Button>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your unique identifier on the platform
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your company name (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* AI Flight Instructor & Small Business Twin Tab */}
                <TabsContent value="instructor" className="space-y-6">
                  <Card className="border border-border/80 bg-card/60 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                            <Bot className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                              <span>AI Flight Instructor & Persona</span>
                              <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/30 text-primary">
                                Deepgram Aura Studio
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              Configure your dedicated AI flight director, teaching style, and studio voice.
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Preferred Instructor */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold flex items-center gap-1.5">
                            <User className="h-4 w-4 text-primary" />
                            <span>Preferred Instructor</span>
                          </label>
                          <Select 
                            value={instructorSettings.preferredInstructor} 
                            onValueChange={(val: any) => setInstructorSettings(prev => ({ ...prev, preferredInstructor: val }))}
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Choose instructor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">
                                🔄 Auto-Switch (Sarah for SEO/CMS, Atlas for Ads/Search)
                              </SelectItem>
                              <SelectItem value="sarah">
                                👩‍💼 Sarah Jenkins (Female — Content & SEO Lead)
                              </SelectItem>
                              <SelectItem value="atlas">
                                👨‍💼 Director Atlas (Male — Performance Flight Director)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            Default instructors carry specialized domain mastery for on-page repair vs. auction bidding.
                          </p>
                        </div>

                        {/* Teaching Style */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold flex items-center gap-1.5">
                            <Flame className="h-4 w-4 text-amber-500" />
                            <span>Teaching Style & Persona</span>
                          </label>
                          <Select 
                            value={instructorSettings.teachingStyle} 
                            onValueChange={(val: any) => setInstructorSettings(prev => ({ ...prev, teachingStyle: val }))}
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Choose teaching style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="drill_sergeant">
                                💥 Agency Drill Sergeant (Tough love, roasts bad copy, demands perfection)
                              </SelectItem>
                              <SelectItem value="supportive">
                                🍯 Supportive Coach (Gentle, patient, warm analogies)
                              </SelectItem>
                              <SelectItem value="executive">
                                📊 High-Stakes CMO (Strict, data-driven, demands CAC & ROAS proof)
                              </SelectItem>
                              <SelectItem value="witty">
                                😂 Witty Mentor (Humorous, sarcastic banter, marketing memes)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            Controls the agent's feedback severity and Socratic coaching tone.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Voice Model Selection */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold flex items-center gap-1.5">
                            <Mic className="h-4 w-4 text-primary" />
                            <span>Studio Voice Model</span>
                          </label>
                          <Select 
                            value={instructorSettings.voiceModel} 
                            onValueChange={(val: any) => setInstructorSettings(prev => ({ ...prev, voiceModel: val }))}
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select voice model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aura-orion-en">Aura Orion (Male — Authoritative, Executive)</SelectItem>
                              <SelectItem value="aura-asteria-en">Aura Asteria (Female — Articulate, Confident)</SelectItem>
                              <SelectItem value="aura-luna-en">Aura Luna (Female — Warm, Editorial)</SelectItem>
                              <SelectItem value="aura-arcas-en">Aura Arcas (Male — Dynamic, Fast-Paced)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Voice Default Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-secondary/30 mt-1">
                          <div className="space-y-0.5">
                            <div className="text-sm font-semibold flex items-center gap-2">
                              <span>Auto-Speak Lessons</span>
                              <Badge variant="outline" className="text-[10px]">Aura TTS</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Automatically speak the instructor's opening dialogue out loud when opening lessons.
                            </p>
                          </div>
                          <Switch 
                            checked={instructorSettings.voiceEnabledByDefault}
                            onCheckedChange={(checked) => setInstructorSettings(prev => ({ ...prev, voiceEnabledByDefault: checked }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Small Business Digital Twin Card */}
                  <Card className="border border-border/80 bg-card/60 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Building2 className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                              <span>Small Business Digital Twin</span>
                              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                                Dynamic Curriculum Customizer
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              Input your real business info. The AI instructor will tailor lesson scenarios and audits to your real company!
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">Activate Twin:</span>
                          <Switch 
                            checked={instructorSettings.hasCustomBusiness}
                            onCheckedChange={(checked) => setInstructorSettings(prev => ({ ...prev, hasCustomBusiness: checked }))}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {instructorSettings.hasCustomBusiness ? (
                        <div className="space-y-4 pt-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold">Business Name</label>
                              <Input 
                                placeholder="e.g. Mile High Solar & Roofing"
                                value={instructorSettings.businessName}
                                onChange={(e) => setInstructorSettings(prev => ({ ...prev, businessName: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold">Industry / Niche</label>
                              <Input 
                                placeholder="e.g. Residential Solar & Roofing Contractor"
                                value={instructorSettings.industry}
                                onChange={(e) => setInstructorSettings(prev => ({ ...prev, industry: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold">Location / Service Area</label>
                              <Input 
                                placeholder="e.g. Denver Metro & Boulder, CO"
                                value={instructorSettings.location}
                                onChange={(e) => setInstructorSettings(prev => ({ ...prev, location: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold">Website URL (Optional)</label>
                              <Input 
                                placeholder="https://milehighroofing.com"
                                value={instructorSettings.websiteUrl}
                                onChange={(e) => setInstructorSettings(prev => ({ ...prev, websiteUrl: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold">Primary Offer / Core Product</label>
                            <Input 
                              placeholder="e.g. Emergency hail damage drone inspections & $0-down solar installs"
                              value={instructorSettings.primaryOffer}
                              onChange={(e) => setInstructorSettings(prev => ({ ...prev, primaryOffer: e.target.value }))}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold">Target Customer & Unique Selling Proposition (USP)</label>
                            <Textarea 
                              rows={2}
                              placeholder="e.g. Single-family homeowners with roofs older than 10 years. We handle all insurance paperwork with a 25-year transferable warranty."
                              value={instructorSettings.targetAudience}
                              onChange={(e) => setInstructorSettings(prev => ({ ...prev, targetAudience: e.target.value }))}
                            />
                          </div>

                          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed flex items-center gap-2">
                            <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
                            <span>
                              <strong>Live Injection Active:</strong> In all lesson briefings, Atlas and Sarah will teach search intent and ad bidding using <strong>{instructorSettings.businessName || "your company"}</strong> as the case study!
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center rounded-xl border border-dashed border-border/80 bg-secondary/20">
                          <Building2 className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
                          <h4 className="text-sm font-semibold text-foreground">Standard Curriculum Active</h4>
                          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                            Lessons currently use calibrated benchmark businesses (Jenny's Artisan Java, Dr. Miller Dental). Toggle the switch above to train on your own real-world company!
                          </p>
                        </div>
                      )}

                      <div className="pt-2">
                        <Button 
                          type="button"
                          onClick={() => {
                            saveInstructorConfig(instructorSettings);
                            toast({
                              title: "Flight Instructor & Digital Twin Saved 🎙️",
                              description: `Instructor preferences and business settings updated successfully.`
                            });
                          }}
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 text-primary-foreground font-semibold shadow-md"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Save Flight Instructor & Digital Twin
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ai">
                  <Card className="border-primary/10">
                    <CardHeader>
                      <CardTitle>AI Provider Settings</CardTitle>
                      <CardDescription>
                        Configure your preferred AI provider for market analysis and insights.
                        Your API key will be securely stored and used to power AI-driven features.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="activeProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Active Provider</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedProvider(value);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select AI provider" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                                <SelectItem value="gemini">Google (Gemini)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {selectedProvider === "anthropic" && (
                        <FormField
                          control={form.control}
                          name="anthropicApiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Anthropic API Key</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your Anthropic API key" {...field} />
                              </FormControl>
                              <FormDescription>
                                Get your API key from the <a href="https://console.anthropic.com/account/keys" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Anthropic Console</a>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {selectedProvider === "openai" && (
                        <FormField
                          control={form.control}
                          name="openaiApiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>OpenAI API Key</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your OpenAI API key" {...field} />
                              </FormControl>
                              <FormDescription>
                                Get your API key from the <a href="https://platform.openai.com/api-keys" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">OpenAI Dashboard</a>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {selectedProvider === "gemini" && (
                        <FormField
                          control={form.control}
                          name="geminiApiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Google API Key</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your Google API key" {...field} />
                              </FormControl>
                              <FormDescription>
                                Get your API key from the <a href="https://makersuite.google.com/app/apikeys" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="billing">
                  <Card className="border-primary/10">
                    <CardHeader>
                      <CardTitle>Subscription & Billing</CardTitle>
                      <CardDescription>
                        Manage your subscription and billing preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-lg border p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                          <h3 className="font-semibold mb-2">Current Plan</h3>
                          <p className="text-muted-foreground mb-4">Free Trial</p>
                          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                            Upgrade Plan
                          </Button>
                        </div>

                        <div className="rounded-lg border p-6">
                          <h3 className="font-semibold mb-2">Payment Method</h3>
                          <p className="text-muted-foreground mb-4">No payment method added</p>
                          <Button variant="outline">
                            Add Payment Method
                          </Button>
                        </div>

                        <div className="rounded-lg border p-6">
                          <h3 className="font-semibold mb-2">Billing History</h3>
                          <p className="text-muted-foreground">No billing history available</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences">
                  <Card className="border-primary/10">
                    <CardHeader>
                      <CardTitle>Application Preferences</CardTitle>
                      <CardDescription>
                        Customize your application experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose your preferred color theme
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
                            <div className="space-y-0.5">
                              <FormLabel>Email Notifications</FormLabel>
                              <FormDescription>
                                Receive updates about your campaigns and insights
                              </FormDescription>
                            </div>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Bell className={`h-4 w-4 ${field.value ? 'text-primary' : 'text-muted-foreground'}`} />
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="toggle"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  Save All Settings
                </Button>
              </form>
            </Form>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
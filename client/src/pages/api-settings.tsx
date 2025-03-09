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
import { ChevronLeft, Key, User, CreditCard, Settings } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedProvider, setSelectedProvider] = useState("anthropic");

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

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <Tabs defaultValue="ai" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              AI Settings
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="ai">
                <Card>
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

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Manage your personal information and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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

              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription & Billing</CardTitle>
                    <CardDescription>
                      Manage your subscription and billing preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="font-semibold mb-2">Current Plan</h3>
                        <p className="text-muted-foreground">Free Trial</p>
                        <Button variant="outline" className="mt-4">
                          Upgrade Plan
                        </Button>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="font-semibold mb-2">Payment Method</h3>
                        <p className="text-muted-foreground">No payment method added</p>
                        <Button variant="outline" className="mt-4">
                          Add Payment Method
                        </Button>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="font-semibold mb-2">Billing History</h3>
                        <p className="text-muted-foreground">No billing history available</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel>Email Notifications</FormLabel>
                            <FormDescription>
                              Receive updates about your campaigns and insights
                            </FormDescription>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="toggle"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <Button type="submit" className="w-full">
                Save All Settings
              </Button>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  );
}
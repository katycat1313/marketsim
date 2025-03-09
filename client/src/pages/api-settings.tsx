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
import { ChevronLeft, Key } from "lucide-react";

export default function ApiSettings() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedProvider, setSelectedProvider] = useState("anthropic");

  const form = useForm({
    defaultValues: {
      activeProvider: "anthropic",
      anthropicApiKey: "",
      openaiApiKey: "",
      geminiApiKey: "",
    },
  });

  async function onSubmit(data: any) {
    try {
      await apiRequest("POST", "/api/settings", data);
      toast({
        title: "Success",
        description: "API settings updated successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update API settings",
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

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            AI Provider Settings
          </CardTitle>
          <CardDescription>
            Configure your preferred AI provider for market analysis and insights. 
            Your API key will be securely stored and used to power AI-driven features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormDescription>
                      Choose your preferred AI provider for marketing insights and recommendations
                    </FormDescription>
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

              <Button type="submit" className="w-full">
                Save Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
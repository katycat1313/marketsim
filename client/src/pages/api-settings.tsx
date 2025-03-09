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
      stripeReadApiKey: "",
      stripeWriteApiKey: "",
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
            API Settings
          </CardTitle>
          <CardDescription>
            Configure your preferred AI provider for market analysis and insights
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
                        <SelectItem value="stripe">Stripe</SelectItem>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedProvider === "stripe" && (
                <>
                  <FormField
                    control={form.control}
                    name="stripeReadApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stripe Read-Only API Key</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your Stripe read-only API key" {...field} />
                        </FormControl>
                        <FormDescription>
                          Used for viewing transaction data and subscription status
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stripeWriteApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stripe Write-Only API Key</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your Stripe write-only API key" {...field} />
                        </FormControl>
                        <FormDescription>
                          Used for processing payments and managing subscriptions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
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
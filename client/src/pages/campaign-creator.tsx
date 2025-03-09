import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCampaignSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const campaignGoals = [
  "Website Traffic",
  "Lead Generation",
  "Sales",
  "Brand Awareness",
];

export default function CampaignCreator() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: personas = [], isLoading: loadingPersonas } = useQuery<any[]>({
    queryKey: ["/api/personas"],
    initialData: [],
  });

  const form = useForm({
    resolver: zodResolver(insertCampaignSchema),
    defaultValues: {
      name: "",
      goal: "",
      dailyBudget: 50,
      keywords: [],
      adHeadline1: "",
      adHeadline2: "",
      adDescription: "",
      personaId: 0,
    },
  });

  async function onSubmit(data: any) {
    try {
      const response = await apiRequest("POST", "/api/campaigns", {
        ...data,
        keywords: data.keywords.split(",").map((k: string) => k.trim()),
      });
      const campaign = await response.json();

      // Generate initial simulation data
      await apiRequest("POST", "/api/simulation-data", {
        campaignId: campaign.id,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
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

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Create Campaign
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <FormField
                control={form.control}
                name="dailyBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Budget ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="marketing, digital ads, google ads" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adHeadline1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Main headline" maxLength={30} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adHeadline2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Secondary headline" maxLength={30} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Your compelling ad copy" maxLength={90} {...field} />
                    </FormControl>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create Campaign
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
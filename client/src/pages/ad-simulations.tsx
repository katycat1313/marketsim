import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getQueryFn } from "@/lib/queryClient";
import { AdPlatformSimulation } from "@shared/schema";

export default function AdSimulationsPage() {
  const [activeTab, setActiveTab] = useState("google");
  
  // Fetch all ad platform simulations
  const { data: simulations, isLoading } = useQuery({
    queryKey: ["/api/ad-simulations"],
    queryFn: getQueryFn(),
  });

  // Filter simulations by platform
  const googleSimulations = simulations?.filter(
    (sim: AdPlatformSimulation) => sim.platform === "google_ads"
  ) || [];
  
  const metaSimulations = simulations?.filter(
    (sim: AdPlatformSimulation) => sim.platform === "meta_ads"
  ) || [];
  
  const linkedinSimulations = simulations?.filter(
    (sim: AdPlatformSimulation) => sim.platform === "linkedin_ads"
  ) || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderSimulationCard = (simulation: AdPlatformSimulation) => (
    <Card key={simulation.id} className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{simulation.title}</CardTitle>
          <Badge className={getDifficultyColor(simulation.difficulty)}>
            {simulation.difficulty}
          </Badge>
        </div>
        <CardDescription>{simulation.industry} Industry</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4">{simulation.scenarioDescription}</p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Objectives:</p>
          <ul className="list-disc pl-5 text-sm">
            {simulation.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/ad-simulation/${simulation.id}`}>
          <Button className="w-full">Start Simulation</Button>
        </Link>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ad Platform Simulations</h1>
        <p className="text-gray-600">
          Practice creating and optimizing ad campaigns on different platforms
          to master digital advertising skills in realistic scenarios.
        </p>
      </div>

      <Tabs defaultValue="google" value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="meta">Meta Ads</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="google" className="mt-0">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Google Ads Simulations</h2>
            <p className="text-gray-600 mb-4">
              Learn how to create and optimize search, display, and video campaigns on Google's advertising platform.
            </p>
            <Separator className="my-4" />
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-[300px] animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : googleSimulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {googleSimulations.map((simulation) => renderSimulationCard(simulation))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No Google Ads simulations available yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="meta" className="mt-0">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Meta Ads Simulations</h2>
            <p className="text-gray-600 mb-4">
              Practice creating campaigns for Facebook, Instagram, and the Meta advertising network.
            </p>
            <Separator className="my-4" />
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-[300px] animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : metaSimulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metaSimulations.map((simulation) => renderSimulationCard(simulation))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No Meta Ads simulations available yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="linkedin" className="mt-0">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">LinkedIn Ads Simulations</h2>
            <p className="text-gray-600 mb-4">
              Master professional B2B advertising with LinkedIn's targeted advertising platform.
            </p>
            <Separator className="my-4" />
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-[300px] animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : linkedinSimulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {linkedinSimulations.map((simulation) => renderSimulationCard(simulation))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No LinkedIn Ads simulations available yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
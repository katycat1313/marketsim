import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Book, Clock, AlertTriangle, GraduationCap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SeoSimulation {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  industry: string;
  targetKeywords: string[];
  seoIssues: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    location: string;
  }[];
  createdAt: string;
}

const DIFFICULTY_ORDER = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
  'Expert': 4,
  'Master': 5
};

export default function SeoSimulationsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/seo-simulations'],
    queryFn: () => apiRequest('/api/seo-simulations', { method: 'GET' })
  });

  // Make sure we're working with an array of simulations
  const simulations = Array.isArray(data) ? data : [];

  // Separate simulations into leveled and practice categories
  const leveledSimulations = simulations.filter(sim => sim.title.startsWith('Level'));
  const practiceSimulations = simulations.filter(sim => !sim.title.startsWith('Level'));

  // Sort leveled simulations by level number
  const sortedLeveledSimulations = [...leveledSimulations].sort((a, b) => {
    const levelA = parseInt(a.title.match(/Level (\d+)/)?.[1] || '0');
    const levelB = parseInt(b.title.match(/Level (\d+)/)?.[1] || '0');
    return levelA - levelB;
  });

  // Sort practice simulations by difficulty
  const sortedPracticeSimulations = [...practiceSimulations].sort((a, b) => {
    return (DIFFICULTY_ORDER[a.difficulty] || 99) - (DIFFICULTY_ORDER[b.difficulty] || 99);
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">SEO Simulations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-6 w-32" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h1 className="text-2xl font-bold text-red-700 flex items-center">
            <AlertTriangle className="mr-2" />
            Error Loading Simulations
          </h1>
          <p className="mt-2">Unable to load SEO simulations. Please try again later.</p>
        </div>
      </div>
    );
  }

  const renderSimulationCard = (simulation: SeoSimulation) => (
    <Card key={simulation.id} className="overflow-hidden border border-gray-200 hover:border-gold-400 transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>{simulation.title}</CardTitle>
        <CardDescription>{simulation.industry} Industry</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{simulation.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            variant={
              simulation.difficulty === 'Beginner' ? 'secondary' : 
              simulation.difficulty === 'Intermediate' ? 'default' : 
              simulation.difficulty === 'Advanced' ? 'outline' :
              simulation.difficulty === 'Expert' ? 'destructive' : 'destructive'
            }
          >
            {simulation.difficulty}
          </Badge>
          <Badge variant="outline">
            <AlertTriangle className="h-3 w-3 mr-1" /> 
            {simulation.seoIssues.length} issues
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" /> 
          <span>Estimated time: 30-45 minutes</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/seo-simulation/${simulation.id}`}>
            Start Simulation <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-gold-600">SEO Simulations</h1>
          <p className="text-gray-400">Practice optimizing web content for search engines</p>
        </div>
      </div>

      <Tabs defaultValue="learning-path" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="learning-path" className="flex items-center">
            <GraduationCap className="mr-2 h-4 w-4" />
            Learning Path (5 Levels)
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Additional Practice
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="learning-path">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">SEO Mastery Path</h2>
            <p className="text-gray-400 mb-4">Progress through five levels from beginner to master SEO practitioner</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLeveledSimulations.map(renderSimulationCard)}
            
            {sortedLeveledSimulations.length === 0 && (
              <div className="col-span-full bg-blue-950 p-6 rounded-lg border border-blue-800">
                <h2 className="text-xl font-semibold text-blue-300 flex items-center">
                  <Book className="mr-2" />
                  No Learning Path Available
                </h2>
                <p className="mt-2 text-blue-200">Check back later for our structured SEO learning path.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="practice">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">Additional Practice Simulations</h2>
            <p className="text-gray-400 mb-4">Standalone simulations for extra practice and skill-building</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPracticeSimulations.map(renderSimulationCard)}
            
            {sortedPracticeSimulations.length === 0 && (
              <div className="col-span-full bg-blue-950 p-6 rounded-lg border border-blue-800">
                <h2 className="text-xl font-semibold text-blue-300 flex items-center">
                  <Book className="mr-2" />
                  No Practice Simulations Available
                </h2>
                <p className="mt-2 text-blue-200">Check back later for additional practice simulations.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Book, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function SeoSimulationsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/seo-simulations'],
    queryFn: () => apiRequest('/api/seo-simulations', { method: 'GET' })
  });

  // Make sure we're working with an array of simulations
  const simulations = Array.isArray(data) ? data : [];

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">SEO Simulations</h1>
          <p className="text-gray-500">Practice optimizing web content for search engines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulations?.map((simulation: SeoSimulation) => (
          <Card key={simulation.id} className="overflow-hidden">
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
                    'destructive'
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
        ))}

        {simulations?.length === 0 && (
          <div className="col-span-full bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center">
              <Book className="mr-2" />
              No Simulations Available
            </h2>
            <p className="mt-2">Check back later for new SEO optimization challenges.</p>
          </div>
        )}
      </div>
    </div>
  );
}
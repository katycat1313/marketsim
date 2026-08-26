import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Book, 
  Clock, 
  AlertTriangle, 
  GraduationCap, 
  BookOpen, 
  Globe, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Building, 
  Coffee, 
  Stethoscope, 
  Home, 
  Laptop, 
  Wrench 
} from 'lucide-react';
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

const clientBusinessMetadata: Record<number, { icon: any; clientName: string; model: string; focus: string }> = {
  1: {
    icon: Coffee,
    clientName: "Artisan Roast Co.",
    model: "D2C E-Commerce & Retail",
    focus: "On-Page Metadata, Title Tags & Search Snippet CTR"
  },
  2: {
    icon: Stethoscope,
    clientName: "Bright Smile Family Dentistry",
    model: "Local Healthcare Clinic",
    focus: "Local Search Intent, Map Pack & Schema Markup"
  },
  3: {
    icon: Home,
    clientName: "Premier Luxury Properties",
    model: "High-Ticket Real Estate",
    focus: "Deceptive Client Brief, Heading Silos & Bounce Reduction"
  },
  4: {
    icon: Laptop,
    clientName: "CloudVault Security",
    model: "B2B SaaS CRM",
    focus: "Bottom-of-Funnel Commercial Intent & Funnel Optimization"
  },
  5: {
    icon: Wrench,
    clientName: "Apex Emergency Home Services",
    model: "24/7 HVAC & Trade Services",
    focus: "Multi-Location SERP Dominance & Conversion Optimization"
  }
};

export default function SeoSimulationsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/seo-simulations'],
    queryFn: () => apiRequest('/api/seo-simulations', { method: 'GET' })
  });

  const simulations: SeoSimulation[] = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
        <h1 className="text-3xl font-bold">SEO Website Simulations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="bg-destructive/15 p-6 rounded-xl border border-destructive/30">
          <h1 className="text-xl font-bold text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error Loading Website Simulations
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Unable to load simulations. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-primary/15 via-card to-background border border-primary/30 shadow-lg space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Interactive Website SEO & Analytics Studio
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
            Live Sandbox Engine
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm max-w-3xl">
          Choose a real-world client website. Open the <strong>Website CMS Sandbox</strong> to diagnose and optimize headings, metadata, copy, and schema, then trigger the <strong>Live Analytics Sandbox</strong> to measure organic traffic lift, SERP ranking improvements, and bounce rate reduction.
        </p>
      </div>

      {/* Client Website Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulations.map((sim, idx) => {
          const clientMeta = clientBusinessMetadata[sim.id] || {
            icon: Globe,
            clientName: sim.title,
            model: `${sim.industry} Business`,
            focus: "On-Page SEO Optimization"
          };
          const IconComp = clientMeta.icon;

          return (
            <Card 
              key={sim.id} 
              className="border-border/60 bg-gradient-to-b from-card to-background shadow-md hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3 border-b border-border/40 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-foreground">
                        {sim.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-primary font-medium">
                        Client: {clientMeta.clientName}
                      </CardDescription>
                    </div>
                  </div>

                  <Badge 
                    variant="outline" 
                    className={`text-xs shrink-0 ${
                      sim.difficulty === 'Beginner' ? 'border-emerald-500/40 text-emerald-400' :
                      sim.difficulty === 'Intermediate' ? 'border-blue-500/40 text-blue-400' :
                      sim.difficulty === 'Advanced' ? 'border-amber-500/40 text-amber-400' :
                      'border-red-500/40 text-red-400'
                    }`}
                  >
                    {sim.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4 text-xs">
                <div className="p-2.5 rounded-lg bg-secondary/30 border border-border/40 space-y-1">
                  <div className="font-semibold text-foreground">Business Model:</div>
                  <div className="text-muted-foreground">{clientMeta.model}</div>
                </div>

                <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                  {sim.description}
                </p>

                <div className="space-y-1.5">
                  <div className="font-semibold text-foreground">Strategic Focus:</div>
                  <div className="text-muted-foreground">{clientMeta.focus}</div>
                </div>

                {/* Target Keywords Strip */}
                <div className="space-y-1">
                  <div className="text-muted-foreground text-[11px]">Target Keywords:</div>
                  <div className="flex flex-wrap gap-1">
                    {sim.targetKeywords.slice(0, 3).map((kw, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t border-border/40 pt-3">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9">
                  <Link to={`/seo-simulation/${sim.id}`}>
                    <span>Enter Website Sandbox</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
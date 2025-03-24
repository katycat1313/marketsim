import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Settings, 
  GraduationCap, 
  BarChart3, 
  Search, 
  BookOpen,
  BarChart
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              MarketSim
            </h1>
            <p className="text-xl text-muted-foreground">
              Master Marketing Without the Risk
            </p>
          </div>
          <Link href="/api-settings">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </Link>
        </div>

        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              <GraduationCap className="inline-block mr-2 h-8 w-8" />
              Tutorials & Learning Resources
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Master essential digital marketing skills with our comprehensive tutorials. 
              Each module provides practical knowledge and hands-on experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-blue-500" />
                  Analytics Fundamentals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Learn key marketing metrics including CTR, Conversion Rate, ROI, and Customer Lifetime Value.
                </p>
                <Link href="/tutorials">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-green-500" />
                  SEO Masterclass
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Master search engine optimization from foundations to advanced techniques.
                </p>
                <Link href="/seo-simulations">
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    Explore SEO
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Campaign Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Learn how to create, optimize and measure effective digital marketing campaigns.
                </p>
                <Link href="/tutorials">
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Learn Digital Marketing Skills
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            MarketSim provides a safe environment to experiment with marketing
            strategies, understand audience targeting, and master campaign
            optimization without spending real money.
          </p>
        </div>
      </div>
    </div>
  );
}
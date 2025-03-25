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
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              MarketSim
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Master Marketing Without the Risk
            </p>
            <p className="text-muted-foreground mb-6">
              Our interactive platform helps you develop practical marketing skills through simulations, 
              real-world scenarios, and expert-guided tutorials. Build your portfolio and advance your career 
              with confidence.
            </p>
            <div className="flex gap-4">
              <Link href="/tutorials">
                <Button className="bg-primary hover:bg-primary/90">
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/api-settings">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/images/group-thinking.jpeg" 
              alt="Marketing team collaborating" 
              className="rounded-lg shadow-xl max-w-full h-auto"
              style={{ maxHeight: '350px' }} 
            />
          </div>
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

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
          <div className="order-2 md:order-1">
            <img 
              src="/images/cart-with-packages.jpeg" 
              alt="E-commerce marketing" 
              className="rounded-lg shadow-xl max-w-full h-auto"
              style={{ maxHeight: '350px' }} 
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-semibold mb-4">
              Learn Digital Marketing Skills
            </h2>
            <p className="text-muted-foreground mb-6">
              MarketSim provides a safe environment to experiment with marketing
              strategies, understand audience targeting, and master campaign
              optimization without spending real money.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <div className="text-primary mt-1">✓</div>
                <div>Build real-world marketing portfolios</div>
              </li>
              <li className="flex items-start gap-2">
                <div className="text-primary mt-1">✓</div>
                <div>Receive AI-powered feedback on your campaigns</div>
              </li>
              <li className="flex items-start gap-2">
                <div className="text-primary mt-1">✓</div>
                <div>Connect with a community of marketing professionals</div>
              </li>
            </ul>
            <Link href="/ad-simulations">
              <Button className="bg-primary hover:bg-primary/90">
                Try Ad Platform Simulations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mt-16 mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Master SEO and Ad Platforms
            </h2>
            <p className="text-muted-foreground mb-6">
              Practice creating optimized content for search engines and learn to build effective
              campaigns across Google Ads, Meta Ads, and LinkedIn Ads platforms.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <div className="text-primary mt-1">✓</div>
                <div>Learn on-page and technical SEO optimization</div>
              </li>
              <li className="flex items-start gap-2">
                <div className="text-primary mt-1">✓</div>
                <div>Create and optimize ad campaigns with real-time feedback</div>
              </li>
              <li className="flex items-start gap-2">
                <div className="text-primary mt-1">✓</div>
                <div>Earn certifications to showcase your expertise</div>
              </li>
            </ul>
            <div className="flex gap-4">
              <Link href="/seo-simulations">
                <Button className="bg-green-500 hover:bg-green-600">
                  SEO Practice
                </Button>
              </Link>
              <Link href="/ad-simulations">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Ad Platforms
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <img 
              src="/images/ad-image.jpeg" 
              alt="Digital advertising" 
              className="rounded-lg shadow-xl max-w-full h-auto"
              style={{ maxHeight: '350px' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
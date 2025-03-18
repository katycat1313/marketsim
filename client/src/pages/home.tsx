import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Target, BarChart3, Presentation, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dummy Market
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

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Create Personas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Define your target audience with detailed demographics and interests.
              </p>
              <Link href="/persona-builder">
                <Button className="w-full">
                  Start Building 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Design Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create and optimize Google Ads campaigns in a risk-free environment.
              </p>
              <Link href="/campaign-creator">
                <Button className="w-full">
                  Create Campaign
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Presentation className="h-5 w-5" />
                Analyze Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track performance metrics and learn from simulated data.
              </p>
              <Link href="/dashboard">
                <Button className="w-full">
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Learn Digital Marketing Skills
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dummy Market provides a safe environment to experiment with marketing
            strategies, understand audience targeting, and master campaign
            optimization without spending real money.
          </p>
        </div>
      </div>
    </div>
  );
}
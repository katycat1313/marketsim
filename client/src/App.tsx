import { Switch, Route, Link, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PersonaBuilder from "@/pages/persona-builder";
import CampaignCreator from "@/pages/campaign-creator";
import Dashboard from "@/pages/dashboard";
import ApiSettings from "@/pages/api-settings";
import NetworkPage from "@/pages/network";
import SeoSimulationsPage from "@/pages/seo-simulations";
import SeoSimulationPage from "@/pages/seo-simulation";
import SeoQuizPage from "@/pages/seo-quiz";
import AdSimulationsPage from "@/pages/ad-simulations";
import AdSimulationPage from "@/pages/ad-simulation";
import TutorialsPage from "@/pages/tutorials";
import SubscriptionPage from "@/pages/subscription";
import SubscriptionSuccessPage from "@/pages/subscription/success";
import SubscriptionCancelPage from "@/pages/subscription/cancel";
import Achievements from "@/components/Achievements";
import Posts from "@/components/Posts";
import { 
  Home as HomeIcon, 
  Users, 
  Award, 
  MessageSquare, 
  BarChart2, 
  Target, 
  Settings,
  Search,
  BookOpen,
  CreditCard,
  GraduationCap,
  MousePointer,
  Monitor
} from "lucide-react";

function NavBar() {
  const [location] = useLocation();

  return (
    <header className="border-b shadow-sm bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col h-24 items-center justify-center">
          <div className="flex items-center gap-2 font-bold text-xl mb-2">
            <span className="text-primary">MarketSim</span>
          </div>
          
          <nav className="flex items-center justify-center gap-6">
            <Link href="/">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </div>
            </Link>
            <Link href="/persona-builder">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/persona-builder' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <Target className="h-4 w-4" />
                <span>Personas</span>
              </div>
            </Link>
            <Link href="/campaign-creator">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/campaign-creator' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <BarChart2 className="h-4 w-4" />
                <span>Campaigns</span>
              </div>
            </Link>
            <Link href="/dashboard">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/dashboard' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <BarChart2 className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link href="/network">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/network' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <Users className="h-4 w-4" />
                <span>Network</span>
              </div>
            </Link>
            <Link href="/community">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/community' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <MessageSquare className="h-4 w-4" />
                <span>Community</span>
              </div>
            </Link>
            <Link href="/achievements">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/achievements' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <Award className="h-4 w-4" />
                <span>Achievements</span>
              </div>
            </Link>
            <Link href="/seo-simulations">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/seo-simulations' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <Search className="h-4 w-4" />
                <span>SEO Practice</span>
              </div>
            </Link>
            <Link href="/ad-simulations">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/ad-simulations' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <MousePointer className="h-4 w-4" />
                <span>Ad Platforms</span>
              </div>
            </Link>
            <Link href="/seo-quiz">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/seo-quiz' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <BookOpen className="h-4 w-4" />
                <span>SEO Quiz</span>
              </div>
            </Link>
            <Link href="/tutorials">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/tutorials' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <GraduationCap className="h-4 w-4" />
                <span>Tutorials</span>
              </div>
            </Link>
            <Link href="/subscription">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/subscription' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <CreditCard className="h-4 w-4" />
                <span>Subscription</span>
              </div>
            </Link>
            <Link href="/api-settings">
              <div className={`flex items-center gap-1 text-sm cursor-pointer ${location === '/api-settings' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/persona-builder" component={PersonaBuilder} />
          <Route path="/campaign-creator" component={CampaignCreator} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/api-settings" component={ApiSettings} />
          <Route path="/network" component={NetworkPage} />
          <Route path="/community" component={Posts} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/seo-simulations" component={SeoSimulationsPage} />
          <Route path="/seo-simulation/:id" component={SeoSimulationPage} />
          <Route path="/ad-simulations" component={AdSimulationsPage} />
          <Route path="/ad-simulation/:id" component={AdSimulationPage} />
          <Route path="/seo-quiz" component={SeoQuizPage} />
          <Route path="/tutorials" component={TutorialsPage} />
          <Route path="/subscription" component={SubscriptionPage} />
          <Route path="/subscription/success" component={SubscriptionSuccessPage} />
          <Route path="/subscription/cancel" component={SubscriptionCancelPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 MarketSim. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
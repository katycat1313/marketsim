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
import Achievements from "@/components/Achievements";
import Posts from "@/components/Posts";
import { 
  Home as HomeIcon, 
  Users, 
  Award, 
  MessageSquare, 
  BarChart2, 
  Target, 
  Settings 
} from "lucide-react";

function NavBar() {
  const [location] = useLocation();

  return (
    <header className="border-b shadow-sm bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">MarketSim</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <a className={`flex items-center gap-1 text-sm ${location === '/' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </a>
            </Link>
            <Link href="/persona-builder">
              <a className={`flex items-center gap-1 text-sm ${location === '/persona-builder' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <Target className="h-4 w-4" />
                <span>Personas</span>
              </a>
            </Link>
            <Link href="/campaign-creator">
              <a className={`flex items-center gap-1 text-sm ${location === '/campaign-creator' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <BarChart2 className="h-4 w-4" />
                <span>Campaigns</span>
              </a>
            </Link>
            <Link href="/dashboard">
              <a className={`flex items-center gap-1 text-sm ${location === '/dashboard' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <BarChart2 className="h-4 w-4" />
                <span>Dashboard</span>
              </a>
            </Link>
            <Link href="/network">
              <a className={`flex items-center gap-1 text-sm ${location === '/network' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <Users className="h-4 w-4" />
                <span>Network</span>
              </a>
            </Link>
            <Link href="/community">
              <a className={`flex items-center gap-1 text-sm ${location === '/community' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <MessageSquare className="h-4 w-4" />
                <span>Community</span>
              </a>
            </Link>
            <Link href="/achievements">
              <a className={`flex items-center gap-1 text-sm ${location === '/achievements' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <Award className="h-4 w-4" />
                <span>Achievements</span>
              </a>
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/api-settings">
              <a className={`flex items-center gap-1 text-sm ${location === '/api-settings' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <Settings className="h-4 w-4" />
                <span className="sr-only md:not-sr-only">Settings</span>
              </a>
            </Link>
          </div>
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
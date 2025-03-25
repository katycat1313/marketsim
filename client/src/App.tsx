import { useState } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PersonaBuilder from "@/pages/persona-builder";
import PersonaBuilderTemplate from "@/pages/persona-builder-template";
import CampaignCreator from "@/pages/campaign-creator";
import Dashboard from "@/pages/dashboard";
import ApiSettings from "@/pages/api-settings";
import NetworkPage from "@/pages/network";
import SeoSimulationsPage from "@/pages/seo-simulations";
import SeoSimulationPage from "@/pages/seo-simulation";
import SeoQuizPage from "@/pages/seo-quiz";
import AdSimulationsPage from "@/pages/ad-simulations";
import AdSimulationPage from "@/pages/ad-simulation";
import DataVisualizationPage from "@/pages/data-visualization";
import TutorialsPage from "@/pages/tutorials";
import SubscriptionPage from "@/pages/subscription";
import SubscriptionSuccessPage from "@/pages/subscription/success";
import SubscriptionCancelPage from "@/pages/subscription/cancel";
import Achievements from "@/components/Achievements";
import Posts from "@/components/Posts";
import AIAssistant from "@/components/AIAssistant";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  Monitor,
  LineChart,
  PieChart,
  ChevronDown,
  Layers,
  Menu,
  User,
  Book,
  Activity,
  ScrollText,
  X
} from "lucide-react";

function SideNav() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/">
            <div className="font-bold text-xl">
              <span className="text-primary">MarketSim</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-secondary"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-0 z-40 bg-background border-r
        transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0 md:w-64 md:shrink-0 md:block
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo and Close button for mobile */}
        <div className="flex items-center justify-between p-4 border-b md:border-0">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="font-bold text-xl">
              <span className="text-primary">MarketSim</span>
            </div>
          </Link>
          <button 
            className="md:hidden p-2 rounded-md hover:bg-secondary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Sidebar content */}
        <div className="p-4 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-6">
            {/* Home */}
            <div>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                  ${isActive('/') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                  <HomeIcon className="h-5 w-5" />
                  <span>Home</span>
                </div>
              </Link>
            </div>

            {/* Dashboard */}
            <div>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                  ${isActive('/dashboard') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                  <BarChart2 className="h-5 w-5" />
                  <span>Dashboard</span>
                </div>
              </Link>
            </div>

            {/* Learn Section */}
            <div className="space-y-2">
              <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider pl-2">
                LEARN
              </div>
              <div className="space-y-1 pl-2">
                <Link href="/tutorials" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/tutorials') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <GraduationCap className="h-5 w-5" />
                    <span>Tutorials</span>
                  </div>
                </Link>
                <Link href="/seo-quiz" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/seo-quiz') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <BookOpen className="h-5 w-5" />
                    <span>SEO Quiz</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Practice Section */}
            <div className="space-y-2">
              <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider pl-2">
                PRACTICE
              </div>
              <div className="space-y-1 pl-2">
                <Link href="/seo-simulations" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/seo-simulation') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Search className="h-5 w-5" />
                    <span>SEO Practice</span>
                  </div>
                </Link>
                <Link href="/ad-simulations" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/ad-simulation') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <MousePointer className="h-5 w-5" />
                    <span>Ad Platforms</span>
                  </div>
                </Link>
                <Link href="/data-visualization" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/data-visualization') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <LineChart className="h-5 w-5" />
                    <span>Data Visualization</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Create Section */}
            <div className="space-y-2">
              <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider pl-2">
                CREATE
              </div>
              <div className="space-y-1 pl-2">
                <Link href="/persona-builder" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/persona-builder') && !isActive('/persona-builder-template') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Target className="h-5 w-5" />
                    <span>Personas</span>
                  </div>
                </Link>
                <Link href="/persona-builder-template" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/persona-builder-template') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Users className="h-5 w-5" />
                    <span>Persona Templates</span>
                  </div>
                </Link>
                <Link href="/campaign-creator" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/campaign-creator') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Activity className="h-5 w-5" />
                    <span>Campaigns</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Community Section */}
            <div className="space-y-2">
              <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider pl-2">
                COMMUNITY
              </div>
              <div className="space-y-1 pl-2">
                <Link href="/network" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/network') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Users className="h-5 w-5" />
                    <span>Network</span>
                  </div>
                </Link>
                <Link href="/community" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/community') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <MessageSquare className="h-5 w-5" />
                    <span>Community</span>
                  </div>
                </Link>
                <Link href="/achievements" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/achievements') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Award className="h-5 w-5" />
                    <span>Achievements</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Account Section */}
            <div className="space-y-2">
              <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider pl-2">
                ACCOUNT
              </div>
              <div className="space-y-1 pl-2">
                <Link href="/subscription" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/subscription') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <CreditCard className="h-5 w-5" />
                    <span>Subscription</span>
                  </div>
                </Link>
                <Link href="/api-settings" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/api-settings') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </div>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}

function Router() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed md:relative transition-all duration-300 ease-in-out h-full z-40 
        ${sidebarVisible ? 'translate-x-0' : '-translate-x-full md:w-0'}`}>
        <SideNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-30">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-2 mr-2 rounded-md hover:bg-secondary">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/">
              <span className="font-bold text-xl text-primary">MarketSim</span>
            </Link>
          </div>
        </div>

        {/* Desktop Top Bar */}
        <div className="hidden md:flex items-center justify-between p-4 border-b bg-background sticky top-0 z-30">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-2 mr-2 rounded-md hover:bg-secondary">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/">
              <span className="font-bold text-xl text-primary">MarketSim</span>
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/persona-builder" component={PersonaBuilder} />
            <Route path="/persona-builder-template" component={PersonaBuilderTemplate} />
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
            <Route path="/data-visualization" component={DataVisualizationPage} />
            <Route path="/tutorials" component={TutorialsPage} />
            <Route path="/subscription" component={SubscriptionPage} />
            <Route path="/subscription/success" component={SubscriptionSuccessPage} />
            <Route path="/subscription/cancel" component={SubscriptionCancelPage} />
            <Route component={NotFound} />
          </Switch>
        </main>

        {/* Footer */}
        <footer className="py-4 border-t">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2025 MarketSim. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  const [isAIAssistantExpanded, setIsAIAssistantExpanded] = useState(false);
  
  const toggleAIAssistant = () => {
    setIsAIAssistantExpanded(prev => !prev);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <AIAssistant 
        isExpanded={isAIAssistantExpanded} 
        onToggleExpand={toggleAIAssistant}
      />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
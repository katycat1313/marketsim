import { useState, useEffect } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import TutorialsPage from "@/pages/tutorials-new";
import SubscriptionPage from "@/pages/subscription";
import SubscriptionSuccessPage from "@/pages/subscription/success";
import SubscriptionCancelPage from "@/pages/subscription/cancel";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import PortfolioViewPage from "@/pages/portfolio-view";
import InterviewSimulatorPage from "@/pages/interview-simulator";
import CapstoneSimulationPage from "@/pages/capstone-simulation";
import Achievements from "@/components/Achievements";
import Posts from "@/components/Posts";
import AIAssistant from "@/components/AIAssistant";
import Logo from "@/components/Logo";

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
  Briefcase,
  Mic,
  Trophy,
  Sparkles,
  X
} from "lucide-react";

import ErrorBoundary from "@/components/ErrorBoundary";

// Protected Route component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? (
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  ) : null;
}

function SideNav() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
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
        <div className="flex items-center justify-between p-4 border-b md:border-b">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Logo className="scale-90" />
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

            {/* Simulations Section */}
            <div className="space-y-2">
              <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider pl-2">
                AGENCY SIMULATIONS
              </div>
              <div className="space-y-1 pl-2">
                <Link href="/ad-simulations" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/ad-simulation') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <MousePointer className="h-5 w-5 text-primary" />
                    <span>Ad Platform Sims</span>
                  </div>
                </Link>

                <Link href="/capstone-simulation" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/capstone-simulation') ? 'bg-amber-500/15 text-amber-400 font-medium border border-amber-500/30' : 'text-amber-400/90 hover:bg-amber-500/10'}`}>
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <span>🏆 Master Capstone</span>
                  </div>
                </Link>

                <Link href="/seo-simulations" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/seo-simulation') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Search className="h-5 w-5" />
                    <span>SEO & SERP Sims</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Career & Proof-of-Work Section */}
            <div className="space-y-2">
              <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider pl-2">
                CAREER PROOF OF WORK
              </div>
              <div className="space-y-1 pl-2">
                <Link href="/portfolio" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/portfolio') ? 'bg-emerald-500/15 text-emerald-400 font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Briefcase className="h-5 w-5 text-emerald-400" />
                    <span>Verified Portfolio</span>
                  </div>
                </Link>

                <Link href="/interview-prep" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/interview-prep') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Mic className="h-5 w-5 text-primary" />
                    <span>AI Interview Prep</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Agency Strategy & Skills Section */}
            <div className="space-y-2">
              <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider pl-2">
                STRATEGY & SKILLS
              </div>
              <div className="space-y-1 pl-2">
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/dashboard') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <BarChart2 className="h-5 w-5" />
                    <span>Skills Radar & Analytics</span>
                  </div>
                </Link>

                <Link href="/persona-builder-template" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/persona-builder-template') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Users className="h-5 w-5" />
                    <span>Customer Personas</span>
                  </div>
                </Link>

                <Link href="/data-visualization" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/data-visualization') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <LineChart className="h-5 w-5" />
                    <span>Performance Reporting</span>
                  </div>
                </Link>

                <Link href="/tutorials-new" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/tutorials-new') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <GraduationCap className="h-5 w-5" />
                    <span>Agency Playbooks</span>
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
  const { isAuthenticated, user, logout } = useAuth();
  const [, navigate] = useLocation();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
        <div className="md:hidden flex items-center justify-between p-2 border-b bg-background sticky top-0 z-30">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-2 mr-2 rounded-md hover:bg-secondary">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/">
              <Logo className="scale-75" />
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="px-3 py-1 text-sm rounded-md border hover:bg-secondary"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-3 py-1 text-sm rounded-md border hover:bg-secondary">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Desktop Top Bar */}
        <div className="hidden md:flex items-center justify-between p-2 border-b bg-background sticky top-0 z-30">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-2 mr-2 rounded-md hover:bg-secondary">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/">
              <Logo className="scale-75" />
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user && (
                  <span className="text-sm font-medium">
                    Welcome, {user.firstName || user.username}
                  </span>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-sm rounded-md border hover:bg-secondary transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-4 py-1.5 text-sm rounded-md border hover:bg-secondary transition">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/persona-builder">
              <ProtectedRoute component={PersonaBuilder} />
            </Route>
            <Route path="/persona-builder-template">
              <ProtectedRoute component={PersonaBuilderTemplate} />
            </Route>
            <Route path="/campaign-creator">
              <ProtectedRoute component={CampaignCreator} />
            </Route>
            <Route path="/dashboard">
              <ProtectedRoute component={Dashboard} />
            </Route>
            <Route path="/api-settings">
              <ProtectedRoute component={ApiSettings} />
            </Route>
            <Route path="/achievements">
              <ProtectedRoute component={Achievements} />
            </Route>
            <Route path="/portfolio">
              <ProtectedRoute component={PortfolioViewPage} />
            </Route>
            <Route path="/interview-prep">
              <ProtectedRoute component={InterviewSimulatorPage} />
            </Route>
            <Route path="/capstone-simulation">
              <ProtectedRoute component={CapstoneSimulationPage} />
            </Route>
            <Route path="/seo-simulations">
              <ProtectedRoute component={SeoSimulationsPage} />
            </Route>
            <Route path="/seo-simulation/:id">
              <ProtectedRoute component={SeoSimulationPage} />
            </Route>
            <Route path="/ad-simulations">
              <ProtectedRoute component={AdSimulationsPage} />
            </Route>
            <Route path="/ad-simulation/:id">
              <ProtectedRoute component={AdSimulationPage} />
            </Route>
            <Route path="/data-visualization">
              <ProtectedRoute component={DataVisualizationPage} />
            </Route>
            <Route path="/tutorials" component={TutorialsPage} />
            <Route path="/tutorials-new" component={TutorialsPage} />
            <Route path="/subscription" component={SubscriptionPage} />
            <Route path="/subscription/success" component={SubscriptionSuccessPage} />
            <Route path="/subscription/cancel" component={SubscriptionCancelPage} />
            <Route component={NotFound} />
          </Switch>
        </main>

        {/* Footer */}
        <footer className="py-4 border-t">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-2">
              <Logo className="scale-75" />
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Digital Zoom Marketing Mastery Platform. All rights reserved.
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Empowering marketers with intelligent simulations and skill development
            </div>
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
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
      
        {/* AI Assistant */}
        <AIAssistant 
          isExpanded={isAIAssistantExpanded} 
          onToggleExpand={toggleAIAssistant}
        />
        
        {/* Floating AI Assistant Button */}
        <button
          className="fixed bottom-6 right-6 h-13 w-13 p-3.5 rounded-full shadow-2xl bg-primary text-primary-foreground z-50 flex items-center justify-center hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 border-2 border-primary-foreground/20 group cursor-pointer"
          onClick={toggleAIAssistant}
          aria-label="Toggle MarketSim AI Coach"
        >
          {isAIAssistantExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
          )}
        </button>
        
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
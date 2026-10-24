import { useState, useEffect } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ClientAgencyProvider } from "./context/ClientAgencyContext";
import { AgencyClientHeader } from "./components/AgencyClientHeader";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PersonaBuilder from "@/pages/persona-builder";
import PersonaBuilderTemplate from "@/pages/persona-builder-template";
import CampaignCreator from "@/pages/campaign-creator";
import Dashboard from "@/pages/dashboard";
import ApiSettings from "@/pages/api-settings";
import NetworkPage from "@/pages/network";
import CommunityPage from "@/pages/community";
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
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import PortfolioViewPage from "@/pages/portfolio-view";
import InterviewSimulatorPage from "@/pages/interview-simulator";
import CapstoneSimulationPage from "@/pages/capstone-simulation";
import CustomBusinessHub from "@/pages/custom-business-hub";
import ABTestWorkshop from "@/pages/ab-test-workshop";
import Achievements from "@/components/Achievements";
import Posts from "@/components/Posts";
import AIAssistant from "@/components/AIAssistant";
import Logo from "@/components/Logo";
import { StudentWeeklyGuide } from "@/components/StudentWeeklyGuide";
import { LegalDisclosuresModal } from "@/components/LegalDisclosuresModal";
import { WelcomeOnboardingModal } from "@/components/WelcomeOnboardingModal";
import { AcademyOrientationTour } from "@/components/AcademyOrientationTour";
import { TrialWelcomeModal } from "@/components/TrialWelcomeModal";
import { TrialCompletedSurveyModal } from "@/components/TrialCompletedSurveyModal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { 
  Lock,
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
  Building2,
  Split,
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

interface SideNavProps {
  onClose?: () => void;
}

function SideNav({ onClose }: SideNavProps) {
  const [location] = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <aside className="w-64 h-full bg-card/95 backdrop-blur-xl border-r border-border/60 flex flex-col shrink-0 shadow-2xl md:shadow-none">
      {/* Logo and Close button */}
      <div className="flex items-center justify-between p-4 border-b border-border/60 shrink-0">
        <Link href="/" onClick={handleLinkClick}>
          <Logo className="scale-90" />
        </Link>
        {onClose && (
          <button 
            className="md:hidden p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Sidebar content */}
      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-6">
          {/* Home */}
          <div>
            <Link href="/" onClick={handleLinkClick}>
              <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                ${isActive('/') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
              </div>
            </Link>
          </div>

          {/* Week 1 Beginner Core Curriculum */}
          <div className="space-y-2">
            <div className="text-xs uppercase text-amber-400 font-bold tracking-wider pl-2 flex items-center justify-between">
              <span>WEEK 1 FOUNDATION</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">100% FREE</span>
            </div>
            <div className="space-y-1 pl-2">
              <Link href="/tutorials" onClick={handleLinkClick}>
                <div className={`flex items-center gap-3 p-2 rounded-md transition-colors border
                  ${isActive('/tutorials') ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-medium' : 'border-amber-500/20 bg-amber-500/5 text-amber-200/90 hover:bg-amber-500/10'}`}>
                  <GraduationCap className="h-5 w-5 text-amber-400 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs truncate">Week 1: Jenny's Artisan Java</span>
                    <span className="text-[10px] text-amber-400/80">15 Lessons (Learn ➔ See ➔ Do)</span>
                  </div>
                </div>
              </Link>

              <Link href="/ab-test-workshop" onClick={handleLinkClick}>
                <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                  ${isActive('/ab-test-workshop') ? 'bg-indigo-500/15 text-indigo-300 font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                  <Split className="h-5 w-5 text-indigo-400 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-xs truncate">A/B Testing Lab</span>
                    <span className="text-[10px] text-muted-foreground">Live Visual Split QA</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

            {/* Simulations Section */}
            <div className="space-y-2">
              <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider pl-2 flex items-center justify-between">
                <span>AGENCY SIMULATIONS</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono font-bold">COURSE 1 ($59)</span>
              </div>
              <div className="space-y-1 pl-2">
                <Link href="/seo-simulations" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/seo-simulation') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Search className="h-5 w-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-medium text-xs flex items-center justify-between"><span>1. SEO & Website Studio</span><span className="text-[9px] text-amber-400 font-mono font-bold flex items-center gap-0.5"><Lock className="h-2.5 w-2.5" />$59</span></span>
                      <span className="text-[10px] text-muted-foreground">Organic Intent & Meta</span>
                    </div>
                  </div>
                </Link>

                <Link href="/ad-simulations" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/ad-simulation') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <MousePointer className="h-5 w-5 text-purple-400" />
                    <div className="flex flex-col">
                      <span className="font-medium text-xs flex items-center justify-between"><span>2. Paid Ad Platform Sims</span><span className="text-[9px] text-amber-400 font-mono font-bold flex items-center gap-0.5"><Lock className="h-2.5 w-2.5" />$59</span></span>
                      <span className="text-[10px] text-muted-foreground">Google & Meta Bidding</span>
                    </div>
                  </div>
                </Link>

                <Link href="/capstone-simulation" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/capstone-simulation') ? 'bg-amber-500/15 text-amber-400 font-medium border border-amber-500/30' : 'text-amber-400/90 hover:bg-amber-500/10'}`}>
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <div className="flex flex-col">
                      <span className="font-medium text-xs flex items-center justify-between"><span>3. 🏆 Agency Capstone</span><span className="text-[9px] text-amber-400 font-mono font-bold flex items-center gap-0.5"><Lock className="h-2.5 w-2.5" />$59</span></span>
                      <span className="text-[10px] text-amber-400/70">Full Client Retainer</span>
                    </div>
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
                <Link href="/portfolio" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/portfolio') ? 'bg-emerald-500/15 text-emerald-400 font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Briefcase className="h-5 w-5 text-emerald-400" />
                    <span>Verified Portfolio</span>
                  </div>
                </Link>

                <Link href="/interview-prep" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/interview-prep') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Mic className="h-5 w-5 text-primary" />
                    <span>AI Interview Prep</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* The Krechet Community Section */}
            <div className="space-y-2">
              <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider pl-2 flex items-center justify-between">
                <span>COMMUNITY</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold mr-2">LIVE</span>
              </div>
              <div className="space-y-1 pl-2">
                <Link href="/community" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/community') ? 'bg-indigo-500/15 text-indigo-400 font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <MessageSquare className="h-5 w-5 text-indigo-400 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-xs truncate">The Krechet Community</span>
                      <span className="text-[10px] text-muted-foreground">Discussions & debriefs</span>
                    </div>
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
                <Link href="/dashboard" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/dashboard') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <BarChart2 className="h-5 w-5" />
                    <span>Skills Radar & Analytics</span>
                  </div>
                </Link>

                <Link href="/custom-sandbox" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/custom-sandbox') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Building2 className="h-5 w-5 text-amber-400" />
                    <span>My Business Sandbox</span>
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">COURSE 1</span>
                  </div>
                </Link>

                <Link href="/persona-builder-template" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/persona-builder-template') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Users className="h-5 w-5" />
                    <span>Customer Personas</span>
                  </div>
                </Link>

                <Link href="/data-visualization" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/data-visualization') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <LineChart className="h-5 w-5" />
                    <span>Performance Reporting</span>
                  </div>
                </Link>

                <Link href="/ab-test-workshop" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/ab-test-workshop') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <Split className="h-5 w-5 text-indigo-400" />
                    <span>A/B Testing Lab</span>
                  </div>
                </Link>

                <Link href="/tutorials-new" onClick={handleLinkClick}>
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
                <Link href="/subscription" onClick={handleLinkClick}>
                  <div className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${isActive('/subscription') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'}`}>
                    <CreditCard className="h-5 w-5" />
                    <span>Subscription</span>
                  </div>
                </Link>
                <Link href="/api-settings" onClick={handleLinkClick}>
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
  );
}

function Router({ onOpenCoach, onOpenTour }: { onOpenCoach?: () => void; onOpenTour?: () => void }) {
  const { isAuthenticated, user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [desktopSidebarVisible, setDesktopSidebarVisible] = useState(true);

  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isTrialWelcomeOpen, setIsTrialWelcomeOpen] = useState(false);
  const [isTrialSurveyOpen, setIsTrialSurveyOpen] = useState(false);

  const trialStart = user?.trialStartDate || (typeof window !== "undefined" ? localStorage.getItem("krechet_trial_start") : null);
  const trialDaysElapsed = trialStart ? Math.floor((Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const trialDaysRemaining = Math.max(0, 7 - trialDaysElapsed);

  useEffect(() => {
    if (isAuthenticated) {
      const justRegistered = localStorage.getItem("krechet_just_registered");
      const trialWelcomeSeen = localStorage.getItem("krechet_trial_welcome_seen");
      if (justRegistered || !trialWelcomeSeen) {
        setIsTrialWelcomeOpen(true);
        localStorage.removeItem("krechet_just_registered");
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      const seen = localStorage.getItem("krechet_welcome_modal_dismissed");
      if (!seen) {
        setIsWelcomeOpen(true);
      }
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Mobile Backdrop Overlay */}
      {mobileDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ease-in-out ${
        mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SideNav onClose={() => setMobileDrawerOpen(false)} />
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className={`hidden md:block transition-all duration-300 ease-in-out h-full shrink-0 ${
        desktopSidebarVisible ? 'w-64' : 'w-0 overflow-hidden'
      }`}>
        <SideNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-2.5 px-4 border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileDrawerOpen(true)} 
              className="p-1.5 -ml-1 rounded-lg hover:bg-secondary text-foreground"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/">
              <Logo className="scale-75" />
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsWelcomeOpen(true)}
              className="px-2 py-1 text-xs font-bold rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 flex items-center gap-1 transition"
              title="Start Guide"
            >
              <span>👋</span>
            </button>
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="px-3 py-1 text-xs font-medium rounded-md border hover:bg-secondary"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-2.5 py-1 text-xs rounded-md border hover:bg-secondary">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-2.5 py-1 text-xs rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Desktop Top Bar */}
        <div className="hidden md:flex items-center justify-between p-2 border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center">
            <button 
              onClick={() => setDesktopSidebarVisible(!desktopSidebarVisible)} 
              className="p-2 mr-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
              title="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/">
              <Logo className="scale-75" />
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onOpenTour ? onOpenTour() : setIsOrientationTourOpen(true)}
              className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25 flex items-center gap-1.5 transition cursor-pointer shadow-sm animate-pulse"
              title="How Everything Works Tour (Course vs Practice vs Fun)"
            >
              <span>🗺️</span>
              <span className="hidden sm:inline">How Everything Works</span>
            </button>
            <button 
              onClick={() => setIsWelcomeOpen(true)}
              className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 flex items-center gap-1.5 transition cursor-pointer"
              title="What to do first & how it works"
            >
              <span>👋</span>
              <span className="hidden lg:inline">Start Guide</span>
            </button>
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

        {/* High-Visibility Welcome & Action Banner */}
        {!isAuthenticated && (
          <div className="krechet-welcome-banner bg-gradient-to-r from-amber-500/20 via-primary/10 to-emerald-500/15 border-b border-amber-500/30 px-3 sm:px-4 py-2 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-bold text-amber-300">Welcome to Krechet Academy!</span>
              <span className="text-muted-foreground hidden md:inline">Week 1 is 100% Free (Zero Credit Card Required). First Client: Jenny's Artisan Java.</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={() => setIsWelcomeOpen(true)}
                className="text-amber-400 hover:text-amber-300 underline font-semibold text-xs cursor-pointer"
              >
                How it works
              </button>
              <Link href="/tutorials">
                <button className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded text-xs transition shadow-sm cursor-pointer">
                  Start Week 1 Free ➔
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-2.5 py-1 rounded text-xs transition shadow-sm cursor-pointer">
                  Sign Up Free
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Connected Agency Client Header */}
        <AgencyClientHeader />

        {/* Step-by-Step Student Action Guide */}
        <StudentWeeklyGuide onOpenCoach={onOpenCoach} onOpenTour={onOpenTour} />

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
            <Route path="/custom-sandbox">
              <ProtectedRoute component={CustomBusinessHub} />
            </Route>
            <Route path="/my-business">
              <ProtectedRoute component={CustomBusinessHub} />
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
            <Route path="/community">
              <ProtectedRoute component={CommunityPage} />
            </Route>
            <Route path="/network">
              <ProtectedRoute component={NetworkPage} />
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
            <Route path="/seo-quiz">
              <ProtectedRoute component={SeoQuizPage} />
            </Route>
            <Route path="/ab-test-workshop">
              <ProtectedRoute component={ABTestWorkshop} />
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
        <footer className="py-6 border-t bg-card/40">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-2">
              <Logo className="scale-90" />
            </div>
            <div className="text-xs text-muted-foreground">
              © 2026 Krechet AI Marketing Academy. All rights reserved.
            </div>
            <div className="text-[11px] text-muted-foreground/80 mt-1">
              The Interactive Campaign Simulator for Digital Marketers & Small Businesses
            </div>
          </div>
        </footer>
      </div>

      <WelcomeOnboardingModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        isAuthenticated={isAuthenticated}
      />
      <TrialWelcomeModal
        isOpen={isTrialWelcomeOpen}
        onClose={() => setIsTrialWelcomeOpen(false)}
        userName={user?.firstName || "Student"}
        daysRemaining={trialDaysRemaining}
      />
      <TrialCompletedSurveyModal
        isOpen={isTrialSurveyOpen}
        onClose={() => setIsTrialSurveyOpen(false)}
        userName={user?.firstName || "Student"}
      />
    </div>
  );
}

function App() {
  const [isAIAssistantExpanded, setIsAIAssistantExpanded] = useState(false);
  const [isOrientationTourOpen, setIsOrientationTourOpen] = useState(false);
  
  const toggleAIAssistant = () => {
    setIsAIAssistantExpanded(prev => !prev);
  };

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ClientAgencyProvider>
          <Router onOpenCoach={() => setIsAIAssistantExpanded(true)} onOpenTour={() => setIsOrientationTourOpen(true)} />
        
          {/* AI Assistant */}
        <AIAssistant 
          isExpanded={isAIAssistantExpanded} 
          onToggleExpand={toggleAIAssistant}
          onOpenTour={() => setIsOrientationTourOpen(true)}
        />

        <AcademyOrientationTour
          isOpen={isOrientationTourOpen}
          onClose={() => setIsOrientationTourOpen(false)}
        />
        
        {/* Floating AI Assistant Button */}
        <button
          className="fixed bottom-6 right-6 h-13 w-13 p-3.5 rounded-full shadow-2xl bg-primary text-primary-foreground z-50 flex items-center justify-center hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 border-2 border-primary-foreground/20 group cursor-pointer"
          onClick={toggleAIAssistant}
          aria-label="Toggle Krechet AI Coach"
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
        </ClientAgencyProvider>
    </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
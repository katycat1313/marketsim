import React from "react";
import { useLocation } from "wouter";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  Coffee, 
  Mic, 
  Lock, 
  ShieldCheck 
} from "lucide-react";
import Logo from "./Logo";

export interface WelcomeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}

export function WelcomeOnboardingModal({
  isOpen,
  onClose,
  isAuthenticated
}: WelcomeOnboardingModalProps) {
  const [, setLocation] = useLocation();

  const handleStartWeek1 = () => {
    try {
      localStorage.setItem("krechet_welcome_modal_dismissed", "true");
    } catch (e) {}
    onClose();
    window.dispatchEvent(new CustomEvent("start-chapter-briefing"));
    sessionStorage.setItem("krechet_auto_start_briefing", "true");
    setLocation("/tutorials?start=1");
  };

  const handleSignUp = () => {
    try {
      localStorage.setItem("krechet_welcome_modal_dismissed", "true");
    } catch (e) {}
    onClose();
    setLocation("/signup");
  };

  const handleLogin = () => {
    try {
      localStorage.setItem("krechet_welcome_modal_dismissed", "true");
    } catch (e) {}
    onClose();
    setLocation("/login");
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem("krechet_welcome_modal_dismissed", "true");
    } catch (e) {}
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDismiss}>
      <DialogContent className="sm:max-w-lg w-[94vw] max-h-[88vh] overflow-y-auto bg-card/95 backdrop-blur-2xl border-primary/30 shadow-2xl p-5 sm:p-6 space-y-2.5">
        <DialogHeader className="space-y-2 text-center sm:text-center items-center">
          <div className="flex justify-center mb-0.5">
            <Logo className="scale-80 origin-center" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-mono uppercase px-2.5 py-0.5">
              Week 1 Free • Zero Credit Card Needed
            </Badge>
            <Badge variant="outline" className="text-muted-foreground border-border text-xs">
              AI Growth Lab
            </Badge>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight text-center">
            Welcome to Krechet Academy!
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed text-center">
            The hands-on marketing simulator where you solve real business challenges, run simulated campaigns, and learn with live AI voice mentors.
          </DialogDescription>
        </DialogHeader>

        {/* 3 Clear Steps on What To Do First */}
        <div className="space-y-2.5 my-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <span>🧭</span>
            <span>Your Quick-Start Guide (What To Do First)</span>
          </h4>

          {/* Step 1: Free Week 1 */}
          <div 
            onClick={handleStartWeek1}
            className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/35 hover:bg-emerald-500/20 transition-all flex items-center justify-between gap-2.5 sm:gap-3 cursor-pointer group shadow-sm hover:shadow-emerald-500/20"
          >
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <Coffee className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-foreground group-hover:text-emerald-300 transition-colors">
                  <span>1. Start Week 1 Free (Jenny's Artisan Java)</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] rounded font-mono font-bold">100% FREE</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px] sm:text-xs">
                  Meet your first client, Jenny Miller. Audit her coffee roastery's website, fix search intent, and launch your first lesson.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={(e) => { e.stopPropagation(); handleStartWeek1(); }}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs h-7 px-2.5 shadow-md shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>START HERE</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>

          {/* Step 2: Account & AI Voice */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-card border border-border/80 flex items-start gap-2.5 sm:gap-3">
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Mic className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <span>2. Create a Free Account to Save Progress</span>
                {isAuthenticated ? (
                  <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-400 text-[10px] rounded font-mono font-bold">LOGGED IN</span>
                ) : (
                  <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-400 text-[10px] rounded font-mono font-bold">RECOMMENDED</span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed text-[11px] sm:text-xs">
                {isAuthenticated 
                  ? "You're signed in! Your XP and simulation campaigns are being automatically tracked."
                  : "Sign up in 10 seconds to save your campaign drafts, accumulate XP, and speak directly with your AI voice mentor."}
              </p>
            </div>
          </div>

          {/* Step 3: Course 1: 6-8 Week Agency Simulator */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-secondary/30 border border-border/60 flex items-start gap-2.5 sm:gap-3">
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <span>3. Course 1: Full 6–8 Week Agency Simulator ($59/mo)</span>
                <span className="px-1.5 py-0.2 bg-muted text-muted-foreground text-[10px] rounded font-mono">AFTER WEEK 1</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[11px] sm:text-xs">
                After your 1-week free trial, continue your training across the full 6–8 week curriculum covering paid ad auctions, SEO studios, GA4 analytics, and real client capstones.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-col sm:space-x-0 gap-2 pt-1 w-full">
          {/* Primary CTA: Start Week 1 Free */}
          <Button 
            onClick={handleStartWeek1}
            size="lg"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer h-10 sm:h-11 text-xs sm:text-sm"
          >
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
            <span>Start Week 1: Jenny's Artisan Java (Free)</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>

          {/* Auth options if not signed in */}
          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-2 w-full pt-0.5">
              <Button 
                variant="outline"
                onClick={handleSignUp}
                className="w-full text-xs font-semibold border-primary/40 hover:bg-primary/10 flex items-center justify-center gap-1.5 h-8 sm:h-9 cursor-pointer"
              >
                <UserPlus className="h-3.5 w-3.5 text-primary" />
                <span>Create Free Account</span>
              </Button>

              <Button 
                variant="outline"
                onClick={handleLogin}
                className="w-full text-xs font-semibold border-border hover:bg-secondary flex items-center justify-center gap-1.5 h-8 sm:h-9 cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Log In</span>
              </Button>
            </div>
          )}

          <Button 
            variant="ghost" 
            onClick={handleDismiss}
            className="w-full text-xs text-muted-foreground hover:text-foreground py-1 h-7 cursor-pointer"
          >
            Explore Platform First ➔
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  Coffee, 
  Clock, 
  ShieldCheck,
  Calendar
} from "lucide-react";
import Logo from "./Logo";

export interface TrialWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  daysRemaining?: number;
}

export function TrialWelcomeModal({
  isOpen,
  onClose,
  userName = "Student",
  daysRemaining = 7
}: TrialWelcomeModalProps) {
  const [, setLocation] = useLocation();

  const handleStartMission = () => {
    try {
      localStorage.setItem("krechet_trial_welcome_seen", "true");
    } catch (e) {}
    onClose();
    window.dispatchEvent(new CustomEvent("start-chapter-briefing"));
    sessionStorage.setItem("krechet_auto_start_briefing", "true");
    setLocation("/tutorials?start=1");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-[94vw] max-h-[88vh] overflow-y-auto bg-card/95 backdrop-blur-2xl border-emerald-500/40 shadow-2xl p-5 sm:p-6 space-y-2.5">
        <DialogHeader className="space-y-3 text-center items-center">
          <div className="flex justify-center mb-1">
            <Logo className="scale-90" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-mono uppercase px-3 py-1 flex items-center gap-1.5 font-bold">
              <Calendar className="h-3.5 w-3.5" />
              <span>7-Day Free Trial Activated</span>
            </Badge>
            <Badge variant="outline" className="text-muted-foreground border-border text-xs">
              Zero Credit Card Billed
            </Badge>
          </div>

          <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight">
            Welcome, {userName}! ☕
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your 1-week free trial has officially started. You have full, unrestricted access to the Week 1 Foundation Curriculum and your first live client simulation.
          </DialogDescription>
        </DialogHeader>

        {/* Trial Overview Box */}
        <div className="space-y-3 my-3">
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-card border border-emerald-500/30 flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Coffee className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="text-sm">Assigned Client: Jenny's Artisan Java</span>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] rounded font-mono font-bold">WEEK 1</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Jenny Miller needs help diagnosing why her artisanal coffee roastery gets clicks but low online sales. You'll audit her website, repair search intent, and run A/B copy tests.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 space-y-1">
              <div className="text-muted-foreground flex items-center gap-1 text-[11px] font-semibold">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Trial Window</span>
              </div>
              <p className="font-extrabold text-foreground text-sm font-mono text-emerald-400">
                {daysRemaining} Days Full Access
              </p>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 space-y-1">
              <div className="text-muted-foreground flex items-center gap-1 text-[11px] font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Card On File</span>
              </div>
              <p className="font-extrabold text-foreground text-sm">
                None Required ($0)
              </p>
            </div>
          </div>

          {/* What happens at the end of the week */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <span>ℹ️</span>
              <span>What happens after your 1 week?</span>
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              When your 7 days conclude, you'll complete a quick 3-question readiness survey and have the option to unlock Course 1 ($59 one-time) or Course 2 ($199/mo). No surprise charges, ever.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-col sm:space-x-0 gap-2 pt-1 w-full">
          <Button 
            onClick={handleStartMission}
            size="lg"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <GraduationCap className="h-5 w-5 fill-current" />
            <span>Launch Day 1: Jenny's Artisan Java ➔</span>
          </Button>

          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full text-xs text-muted-foreground hover:text-foreground py-1 h-7"
          >
            Go to Academy Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

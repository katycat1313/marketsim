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
import { Lock, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, GraduationCap } from "lucide-react";

export interface CourseLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredTier?: "course1" | "course2";
  featureTitle?: string;
  featureDescription?: string;
}

export function CourseLockModal({
  isOpen,
  onClose,
  requiredTier = "course1",
  featureTitle = "Advanced Simulator",
  featureDescription = "This interactive module is part of the paid academy curriculum."
}: CourseLockModalProps) {
  const [, setLocation] = useLocation();

  const isCourse1 = requiredTier === "course1";
  const planName = isCourse1 ? "Course 1: Foundation Agency Simulator" : "Course 2: Creative AI Suite";
  const planPrice = isCourse1 ? "$59 one-time" : "$199/month";

  const handleGoToSubscription = () => {
    onClose();
    setLocation("/subscription");
  };

  const handleGoToFreeWeek = () => {
    onClose();
    setLocation("/tutorials");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-amber-500/30 shadow-2xl p-6">
        <DialogHeader className="space-y-2 text-center items-center">
          <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1">
            <Lock className="h-6 w-6 text-amber-400 animate-pulse" />
          </div>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs font-mono uppercase">
            {planName} Required
          </Badge>
          <DialogTitle className="text-xl font-bold text-foreground">
            {featureTitle} is Locked
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-center">
            {featureDescription}
          </DialogDescription>
        </DialogHeader>

        {/* Free Week 1 Reminder Box */}
        <div className="my-3 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <GraduationCap className="h-4 w-4 shrink-0" />
            <span>Week 1 is 100% Free (No Credit Card Required)</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            You have full access to Week 1: Jenny's Artisan Java (15 Socratic lessons, A/B testing lab, and landing page optimization).
          </p>
        </div>

        {/* Tier Value Summary */}
        <div className="p-3.5 rounded-lg bg-secondary/50 border border-border/80 text-xs space-y-2">
          <div className="flex justify-between items-center font-bold text-foreground">
            <span>Unlock {planName}</span>
            <span className="text-amber-400 font-mono text-sm">{planPrice}</span>
          </div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Full access to live PPC auction math & ad simulations</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Director Atlas mid-week emergency crisis drills</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Audited case study export & career portfolio credentials</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="flex flex-col sm:flex-col gap-2 pt-2">
          <Button 
            onClick={handleGoToSubscription}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4 fill-current" />
            <span>Unlock {planName} ({planPrice})</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button 
            variant="outline" 
            onClick={handleGoToFreeWeek}
            className="w-full border-border/80 hover:bg-secondary text-foreground text-xs flex items-center justify-center gap-1.5"
          >
            <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
            <span>Continue Free with Week 1 (Jenny's Coffee)</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

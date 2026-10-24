import React, { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Star, 
  Briefcase, 
  Building2, 
  GraduationCap 
} from "lucide-react";
import Logo from "./Logo";

export interface TrialCompletedSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export function TrialCompletedSurveyModal({
  isOpen,
  onClose,
  userName = "Student"
}: TrialCompletedSurveyModalProps) {
  const [, setLocation] = useLocation();

  const [q1Feedback, setQ1Feedback] = useState<string>("confident");
  const [q2Goal, setQ2Goal] = useState<string>("freelance");
  const [q3Plan, setQ3Plan] = useState<string>("course1");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmitSurvey = () => {
    setIsSubmitted(true);
    try {
      localStorage.setItem("krechet_survey_completed", JSON.stringify({
        q1Feedback,
        q2Goal,
        q3Plan,
        completedAt: new Date().toISOString()
      }));
    } catch (e) {}
  };

  const handleSelectPlan = (plan: "course1" | "course2") => {
    onClose();
    setLocation("/subscription");
  };

  const handleExportPortfolio = () => {
    onClose();
    setLocation("/portfolio");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-card/95 backdrop-blur-2xl border-amber-500/40 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 text-center items-center">
          <div className="flex justify-center mb-1">
            <Logo className="scale-90" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs font-mono uppercase px-3 py-1 flex items-center gap-1.5 font-bold">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>1-Week Free Trial Complete</span>
            </Badge>
            <Badge variant="outline" className="text-muted-foreground border-border text-xs">
              Week 1: Jenny's Artisan Java
            </Badge>
          </div>

          <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight">
            Your 1-Week Free Trial is Up, {userName}! 🎓
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Congratulations on completing your diagnostic campaign work for Jenny's Artisan Java. Answer 3 quick reflection questions below to review your skills and choose your next path.
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <div className="space-y-5 my-3 text-left">
            {/* Question 1 */}
            <div className="p-4 rounded-xl bg-secondary/40 border border-border/80 space-y-2.5">
              <Label className="text-xs font-bold text-foreground flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px] font-bold">1</span>
                <span>How prepared do you feel diagnosing search intent & fixing landing page leaks?</span>
              </Label>
              <RadioGroup value={q1Feedback} onValueChange={setQ1Feedback} className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/60 cursor-pointer">
                  <RadioGroupItem value="confident" id="q1-1" />
                  <Label htmlFor="q1-1" className="cursor-pointer font-medium text-foreground">
                    Very confident — I know how to spot H1 intent mismatch, unit economics (CAC/AOV), and CTR issues.
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/60 cursor-pointer">
                  <RadioGroupItem value="progress" id="q1-2" />
                  <Label htmlFor="q1-2" className="cursor-pointer font-medium text-muted-foreground">
                    Solid foundation — but I want deeper practice with live PPC auction bidding and negative keywords.
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/60 cursor-pointer">
                  <RadioGroupItem value="mentor" id="q1-3" />
                  <Label htmlFor="q1-3" className="cursor-pointer font-medium text-muted-foreground">
                    Loved the AI Socratic Voice Mentor — it forced me to explain concepts in my own words.
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 2 */}
            <div className="p-4 rounded-xl bg-secondary/40 border border-border/80 space-y-2.5">
              <Label className="text-xs font-bold text-foreground flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px] font-bold">2</span>
                <span>What is your primary marketing goal next?</span>
              </Label>
              <RadioGroup value={q2Goal} onValueChange={setQ2Goal} className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/60 cursor-pointer">
                  <RadioGroupItem value="freelance" id="q2-1" />
                  <Label htmlFor="q2-1" className="cursor-pointer font-medium text-foreground">
                    Freelancing / Taking on high-ticket client retainers ($2k-$5k/mo).
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/60 cursor-pointer">
                  <RadioGroupItem value="business" id="q2-2" />
                  <Label htmlFor="q2-2" className="cursor-pointer font-medium text-foreground">
                    Growing my own business, e-commerce store, or local practice.
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/60 cursor-pointer">
                  <RadioGroupItem value="career" id="q2-3" />
                  <Label htmlFor="q2-3" className="cursor-pointer font-medium text-foreground">
                    Getting hired as a Growth Associate or Paid Media Buyer at an agency.
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question 3 */}
            <div className="p-4 rounded-xl bg-secondary/40 border border-border/80 space-y-2.5">
              <Label className="text-xs font-bold text-foreground flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px] font-bold">3</span>
                <span>Choose your preferred academy progression track:</span>
              </Label>
              <RadioGroup value={q3Plan} onValueChange={setQ3Plan} className="space-y-2 pt-1 text-xs">
                <div className="flex items-start space-x-2 p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer">
                  <RadioGroupItem value="course1" id="q3-1" className="mt-0.5" />
                  <div className="space-y-0.5">
                    <Label htmlFor="q3-1" className="cursor-pointer font-bold text-amber-300 flex items-center gap-2">
                      <span>Course 1: Foundation Agency Simulator</span>
                      <span className="font-mono text-xs bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 font-bold">$59 one-time</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Full access to all 6 agency playbooks, Google & Meta PPC auction sandboxes, crisis calls, and verified portfolio export.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-3 rounded-xl border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 cursor-pointer">
                  <RadioGroupItem value="course2" id="q3-2" className="mt-0.5" />
                  <div className="space-y-0.5">
                    <Label htmlFor="q3-2" className="cursor-pointer font-bold text-purple-300 flex items-center gap-2">
                      <span>Course 2: Creative AI Suite</span>
                      <span className="font-mono text-xs bg-purple-500/20 px-2 py-0.5 rounded text-purple-300 font-bold">$199/month</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Includes Course 1 + Custom Business Digital Twin, Generative AI Ad Video Creator, and 3 weekly client crisis drills.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Button 
              onClick={handleSubmitSurvey}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md cursor-pointer"
            >
              <span>Submit Readiness Review & See Options ➔</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4 my-3 text-left animate-in fade-in">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Readiness Review Submitted!</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Based on your answers, you are qualified to advance into client agency simulations. Pick your option below to continue without interruption.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-card border-2 border-amber-500/50 shadow-md flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <Badge className="bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase font-bold">Recommended</Badge>
                  <h4 className="font-extrabold text-foreground text-sm">Course 1: Foundation Agency</h4>
                  <p className="text-xl font-bold font-mono text-amber-400">$59 <span className="text-xs font-normal text-muted-foreground">one-time</span></p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Lifetime access to Google & Meta PPC auction engines, 6 agency playbooks, and verified portfolio exports.
                  </p>
                </div>
                <Button 
                  onClick={() => handleSelectPlan("course1")}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Unlock Course 1 ($59) ➔
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-card border border-purple-500/40 shadow-md flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <Badge className="bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase font-bold">Agency Continuity</Badge>
                  <h4 className="font-extrabold text-foreground text-sm">Course 2: Creative AI Suite</h4>
                  <p className="text-xl font-bold font-mono text-purple-400">$199 <span className="text-xs font-normal text-muted-foreground">/ month</span></p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Clone your own business into a Digital Twin sandbox, generate AI ad creative, and handle weekly crisis curveballs.
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => handleSelectPlan("course2")}
                  className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10 font-bold text-xs"
                >
                  Join Creative AI ($199/mo) ➔
                </Button>
              </div>
            </div>

            <Button 
              variant="ghost" 
              onClick={handleExportPortfolio}
              className="w-full text-xs text-muted-foreground hover:text-foreground py-2 flex items-center justify-center gap-1.5"
            >
              <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export Week 1 Jenny's Coffee Portfolio Case Study First</span>
            </Button>
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full text-xs text-muted-foreground hover:text-foreground h-7"
          >
            Close Dialog
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

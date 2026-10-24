import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Clock,
  Play,
  RotateCcw
} from "lucide-react";

export interface ActionStep {
  id: number;
  title: string;
  shortDesc: string;
  duration: string;
  path: string;
  actionText: string;
  whyItMatters: string;
}

export const WEEK_1_ACTION_PLAN: ActionStep[] = [
  {
    id: 1,
    title: "Step 1: Chapter 1 Socratic AI Briefing",
    shortDesc: "Understand Impressions ➡️ Clicks ➡️ Conversions & Search Intent mental models.",
    duration: "15–20 mins",
    path: "/tutorials",
    actionText: "Start Chapter 1 Briefing",
    whyItMatters: "Builds your foundational marketing intuition before spending any simulated budget."
  },
  {
    id: 2,
    title: "Step 2: Week 1 Ad Campaign Sandbox",
    shortDesc: "Draft your first Google Search ad group and inspect the live Google SERP preview.",
    duration: "25–30 mins",
    path: "/ad-simulation",
    actionText: "Launch Ad Sandbox",
    whyItMatters: "Experience realistic campaign creation with headlines, descriptions, and bidding."
  },
  {
    id: 3,
    title: "Step 3: Negative Keyword Defense Shield",
    shortDesc: "Review search queries and add negative keywords (free, cheap, jobs) to stop budget bleed.",
    duration: "15–20 mins",
    path: "/ad-simulation",
    actionText: "Block Wasteful Keywords",
    whyItMatters: "Prevents paying for junk clicks—the #1 skill agency directors look for in junior media buyers."
  },
  {
    id: 4,
    title: "Step 4: Director Atlas Mid-Week Crisis Call",
    shortDesc: "Answer the emergency boss call, listen to his tactical hint, and diagnose broad match leak.",
    duration: "15–20 mins",
    path: "/ad-simulation",
    actionText: "Handle Crisis Drill",
    whyItMatters: "Trains you to stay calm and solve real client emergencies under pressure."
  },
  {
    id: 5,
    title: "Step 5: Export Verified Case Study",
    shortDesc: "Review your telemetry score (CTR, Quality Score, ROAS) and download your proof-of-work portfolio.",
    duration: "10–15 mins",
    path: "/portfolio",
    actionText: "Export Verified Portfolio",
    whyItMatters: "Gives you an audited credential you can attach to resumes, Upwork, and client pitches."
  }
];

interface StudentWeeklyGuideProps {
  onOpenCoach?: (prompt?: string) => void;
}

export function StudentWeeklyGuide({ onOpenCoach }: StudentWeeklyGuideProps) {
  const [, setLocation] = useLocation();
  const [currentStepId, setCurrentStepId] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    try {
      const savedStep = localStorage.getItem("krechet_student_action_step");
      if (savedStep) setCurrentStepId(parseInt(savedStep, 10));

      const savedCompleted = localStorage.getItem("krechet_student_completed_steps");
      if (savedCompleted) setCompletedSteps(JSON.parse(savedCompleted));
    } catch (e) {}
  }, []);

  const saveProgress = (newStepId: number, completedList: number[]) => {
    setCurrentStepId(newStepId);
    setCompletedSteps(completedList);
    try {
      localStorage.setItem("krechet_student_action_step", newStepId.toString());
      localStorage.setItem("krechet_student_completed_steps", JSON.stringify(completedList));
    } catch (e) {}
  };

  const handleAdvanceStep = (stepId: number) => {
    const updatedCompleted = Array.from(new Set([...completedSteps, stepId]));
    const nextStep = Math.min(stepId + 1, WEEK_1_ACTION_PLAN.length);
    saveProgress(nextStep, updatedCompleted);
  };

  const handleResetProgress = () => {
    saveProgress(1, []);
  };

  const currentStep = WEEK_1_ACTION_PLAN.find(s => s.id === currentStepId) || WEEK_1_ACTION_PLAN[0];

  return (
    <div className="w-full bg-gradient-to-r from-card via-card/95 to-background border-b border-amber-500/40 px-3 py-2.5 shadow-md sticky top-12 z-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Compact Bar Always Visible */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-[280px]">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0 shadow-sm animate-pulse">
              <Compass className="h-4 w-4 text-amber-400" />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <span>🧭 Week 1 Action Plan</span>
                <Badge variant="outline" className="text-[10px] h-4 bg-amber-500/10 text-amber-400 border-amber-500/40 font-bold">
                  Step {currentStepId} of 5
                </Badge>
              </span>

              {/* Arrow and Active Task */}
              <div className="flex items-center gap-1 text-muted-foreground font-medium">
                <span className="text-amber-400 font-bold flex items-center">
                  ➡️ <span className="ml-1 text-foreground font-semibold underline decoration-amber-500/50 underline-offset-2">{currentStep.title}</span>
                </span>
                <span className="hidden lg:inline text-xs text-muted-foreground/80">({currentStep.duration})</span>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              size="sm"
              onClick={() => setLocation(currentStep.path)}
              className="h-7 sm:h-8 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 shadow-md ring-2 ring-amber-400/40 hover:scale-[1.02] transition-transform animate-pulse"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>{currentStep.actionText}</span>
              <ArrowRight className="h-3 w-3" />
            </Button>

            {onOpenCoach && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenCoach("What should I do right now? Guide me with arrows step-by-step!")}
                className="h-7 sm:h-8 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/15 flex items-center gap-1"
                title="Ask AI Coach for exact step guidance"
              >
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span className="hidden sm:inline">Ask Coach</span>
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 sm:h-8 text-xs text-muted-foreground hover:text-foreground px-2"
              title={isExpanded ? "Collapse Action Plan" : "View All 5 Steps"}
            >
              {isExpanded ? (
                <div className="flex items-center gap-1">
                  <span className="text-[11px] hidden sm:inline">Hide Steps</span>
                  <ChevronUp className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <span className="text-[11px] hidden sm:inline">See All 5 Steps</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Expanded View: All 5 Steps with Directional Arrows */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-border/60 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <span>📍 Complete Week 1 Roadmap (Step-by-Step)</span>
              </span>
              <button 
                onClick={handleResetProgress}
                className="text-[11px] text-muted-foreground hover:text-amber-400 flex items-center gap-1 transition-colors"
                title="Reset steps"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset to Step 1</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
              {WEEK_1_ACTION_PLAN.map((step) => {
                const isCurrent = step.id === currentStepId;
                const isCompleted = completedSteps.includes(step.id);

                return (
                  <div
                    key={step.id}
                    onClick={() => setLocation(step.path)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all duration-200 relative flex flex-col justify-between ${
                      isCurrent
                        ? "bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500/40"
                        : isCompleted
                          ? "bg-secondary/40 border-emerald-500/30 opacity-80 hover:opacity-100"
                          : "bg-secondary/20 border-border/60 hover:border-border hover:bg-secondary/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : isCurrent ? (
                            <ArrowRight className="h-4 w-4 text-amber-400 shrink-0 animate-pulse font-black" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          )}
                          <span className={`text-xs font-bold ${isCurrent ? "text-amber-400" : "text-foreground"}`}>
                            Step {step.id}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[10px] h-3.5 px-1 py-0 border-border/60 text-muted-foreground">
                          {step.duration}
                        </Badge>
                      </div>

                      <h4 className="text-xs font-bold text-foreground mb-1 leading-snug">
                        {step.title.replace(/^Step \d+: /, "")}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                        {step.shortDesc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/40 mt-1 flex items-center justify-between text-[11px]">
                      <span className={`font-semibold flex items-center gap-1 ${isCurrent ? "text-amber-400" : "text-muted-foreground"}`}>
                        {isCurrent ? "👉 DO THIS NOW" : isCompleted ? "✓ Completed" : "Upcoming ➡️"}
                      </span>
                      {isCurrent && !isCompleted && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdvanceStep(step.id);
                          }}
                          className="text-[10px] bg-secondary hover:bg-secondary/80 text-foreground px-1.5 py-0.5 rounded border border-border"
                        >
                          Mark Done ✓
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2.5 text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-amber-400" />
              <span>Paced for <strong>3 to 4 short sessions</strong> this week (30–40 min each). Don't rush all at once!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

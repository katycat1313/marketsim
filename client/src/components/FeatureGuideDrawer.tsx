import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  HelpCircle, 
  ExternalLink, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Briefcase,
  BookOpen
} from "lucide-react";

export interface FeatureGuideStep {
  step: number;
  title: string;
  description: string;
}

export interface FeatureGuideBenchmark {
  label: string;
  value: string;
  context: string;
}

export interface FeatureGuideDrawerProps {
  toolName: string;
  industryEquivalent: string;
  purpose: string;
  steps: FeatureGuideStep[];
  benchmarks: FeatureGuideBenchmark[];
  buttonLabel?: string;
  className?: string;
}

export const FeatureGuideDrawer: React.FC<FeatureGuideDrawerProps> = ({
  toolName,
  industryEquivalent,
  purpose,
  steps,
  benchmarks,
  buttonLabel = "Click for a quick how to use this feature",
  className = ""
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-7 px-3 text-xs font-medium border-primary/30 text-primary hover:bg-primary/10 gap-1.5 rounded-lg transition-colors ${className}`}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>{buttonLabel}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-border/80 bg-card p-6 shadow-2xl">
        <DialogHeader className="space-y-1.5 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[11px] font-mono border-primary/40 text-primary">
              Industry Standard Tool
            </Badge>
            <span className="text-xs text-muted-foreground">
              Mimics: <strong>{industryEquivalent}</strong>
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            How to Use: {toolName}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {purpose}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          {/* 3-Step Agency Workflow */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>Step-by-Step Practical Workflow</span>
            </h4>
            <div className="space-y-2">
              {steps.map((s) => (
                <div key={s.step} className="p-3 rounded-lg border border-border/60 bg-background/60 flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {s.step}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-semibold text-foreground">{s.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{s.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Benchmarks */}
          {benchmarks && benchmarks.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>Realistic Industry Benchmarks & Averages</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {benchmarks.map((b, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border/60 bg-background/60 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">{b.label}</span>
                      <span className="font-mono font-bold text-emerald-400">{b.value}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/80 leading-normal">
                      {b.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button size="sm" onClick={() => setOpen(false)} className="text-xs h-8">
              Got it, let's start
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureGuideDrawer;

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
import { 
  BookOpen, 
  Wrench, 
  Flame, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Compass, 
  GraduationCap, 
  Layers, 
  Target, 
  Search, 
  DollarSign, 
  BarChart3,
  Play,
  Lightbulb,
  Palette
} from "lucide-react";
import Logo from "./Logo";

export interface AcademyOrientationTourProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLesson1?: () => void;
}

export function AcademyOrientationTour({
  isOpen,
  onClose,
  onStartLesson1
}: AcademyOrientationTourProps) {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const totalSlides = 3;

  const handleLaunchLesson1 = () => {
    onClose();
    if (onStartLesson1) {
      onStartLesson1();
    } else {
      window.dispatchEvent(new CustomEvent("start-chapter-briefing"));
      sessionStorage.setItem("krechet_auto_start_briefing", "true");
      setLocation("/tutorials?start=1");
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleLaunchLesson1();
    }
  };

  const handleBack = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-2xl border-amber-500/40 shadow-2xl p-5 sm:p-7 space-y-4">
        {/* Header with Slide Indicator */}
        <DialogHeader className="space-y-2 text-center sm:text-center items-center">
          <div className="flex items-center justify-between w-full pb-1 border-b border-border/40">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Compass className="h-4 w-4 text-amber-400" />
              <span>ACADEMY ORIENTATION GUIDE</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentSlide ? "w-6 bg-amber-400" : "w-2 bg-secondary hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to slide ${i}`}
                />
              ))}
              <span className="text-[11px] font-mono font-bold text-amber-400 ml-1.5">
                {currentSlide}/{totalSlides}
              </span>
            </div>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-black text-foreground tracking-tight text-center pt-1">
            {currentSlide === 1 && "🎓 What We Teach: The 4 Marketing Subjects"}
            {currentSlide === 2 && "🧭 Course Material vs. Practice Labs vs. Fun Sandboxes"}
            {currentSlide === 3 && "➡️ How Everything Works Together (Week 1 Roadmap)"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed text-center">
            {currentSlide === 1 && "Krechet Academy teaches 4 interconnected marketing subjects so you master the full agency client lifecycle."}
            {currentSlide === 2 && "Here is how to tell the difference between actual core lessons, hands-on simulators, and creative sandboxes."}
            {currentSlide === 3 && "Follow the golden 5-step workflow to move from theory to live simulated campaign execution."}
          </DialogDescription>
        </DialogHeader>

        {/* SLIDE 1: The 4 Subjects */}
        {currentSlide === 1 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Subject 1: Funnels & CRO */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">1. Funnels & CRO</h4>
                    <span className="text-[10px] text-amber-300 font-mono">Customer Journey (Week 1)</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Understand <strong>Awareness ➡️ Consideration ➡️ Decision</strong>. Diagnose why Jenny's coffee gets clicks but low sales, and fix conversion bottlenecks.
                </p>
              </div>

              {/* Subject 2: SEO & Search Intent */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Search className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">2. Search Intent & SEO</h4>
                    <span className="text-[10px] text-emerald-300 font-mono">Organic Intent Matching</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Master Informational vs Commercial search intent. Audit title tags, meta descriptions, and page headlines to rank organically on Google.
                </p>
              </div>

              {/* Subject 3: PPC Ad Auctions */}
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">3. Paid Search & Google Ads</h4>
                    <span className="text-[10px] text-blue-300 font-mono">PPC Bidding & Negative Keywords</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Learn how auctions work: <strong>Impressions ➡️ Clicks ➡️ Conversions</strong>. Use Negative Keywords to stop wasting client money on junk clicks.
                </p>
              </div>

              {/* Subject 4: Analytics & Unit Economics */}
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">4. Analytics & Unit Economics</h4>
                    <span className="text-[10px] text-purple-300 font-mono">CAC, AOV & ROAS</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Calculate Cost Per Acquisition (CPA), Average Order Value (AOV), and Return on Ad Spend (ROAS). Learn to prove client ROI with real numbers.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/40 border border-border/80 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-base shrink-0">💡</span>
              <span><strong>All 4 subjects work together:</strong> You learn Funnel Theory in the lessons, apply Paid Ads in the simulator, and track your telemetry in Analytics!</span>
            </div>
          </div>
        )}

        {/* SLIDE 2: What is Course vs Practice vs Fun */}
        {currentSlide === 2 && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            {/* Category 1: Core Course Material */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-mono font-bold">
                    📚 CORE COURSE MATERIAL
                  </Badge>
                  <span className="font-bold text-foreground">The 15 Structured Socratic Lessons</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  <strong>Where:</strong> On the <span className="text-foreground underline">Tutorials</span> page (/tutorials).<br/>
                  <strong>What:</strong> Step-by-step curriculum starting with <strong>Chapter 1.1: Customer Journey</strong>. Read, listen to AI audio, and answer Socratic comprehension questions.
                </p>
              </div>
            </div>

            {/* Category 2: Practice Simulators */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Wrench className="h-4 w-4" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono font-bold">
                    🛠️ HANDS-ON PRACTICE LABS
                  </Badge>
                  <span className="font-bold text-foreground">Interactive Client Simulators</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  <strong>Where:</strong> In the <span className="text-foreground underline">Ad Simulation</span> & <span className="text-foreground underline">A/B Testing Lab</span>.<br/>
                  <strong>What:</strong> Apply what you learned on Jenny's Artisan Java with $10,000 simulated budget. Write headlines, pick keywords, and block wasteful search terms.
                </p>
              </div>
            </div>

            {/* Category 3: Crisis Drills */}
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="h-4 w-4" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/40 text-[10px] font-mono font-bold">
                    🚨 EMERGENCY CRISIS DRILLS
                  </Badge>
                  <span className="font-bold text-foreground">Agency Fire Drills (Pressure Training)</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  <strong>Where:</strong> In the <span className="text-foreground underline">Crisis Dispatch Room</span>.<br/>
                  <strong>What:</strong> Director Atlas calls with urgent client emergencies (broken landing pages, broad match budget leaks). Train yourself to stay calm and execute.
                </p>
              </div>
            </div>

            {/* Category 4: Sandboxes for Fun */}
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <Palette className="h-4 w-4" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px] font-mono font-bold">
                    🎨 CREATIVE SANDBOX (FOR FUN)
                  </Badge>
                  <span className="font-bold text-foreground">My Business Sandbox & Personas</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  <strong>Where:</strong> Under <span className="text-foreground underline">My Business Sandbox</span> in the sidebar.<br/>
                  <strong>What:</strong> Want to practice with your own bakery, clothing brand, or consulting idea? Build freely without client constraints or grading pressure.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: How Everything Works Together */}
        {currentSlide === 3 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span>🧭</span>
                <span>The Golden 5-Step Weekly Workflow (Follow the Arrows)</span>
              </h4>

              {/* Step 1 */}
              <div 
                onClick={handleLaunchLesson1}
                className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-sm hover:shadow-amber-500/20"
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="h-6 w-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 group-hover:scale-110 transition-transform">1</span>
                  <div>
                    <span className="font-bold text-foreground group-hover:text-amber-300 transition-colors">Day 1: Customer Journey & Funnel Leak Audit</span>
                    <p className="text-[11px] text-muted-foreground">Study 3-stage funnel, AOV, and diagnose Jenny's 84% bounce rate leak</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); handleLaunchLesson1(); }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-7 px-3 shadow-md shrink-0 flex items-center gap-1 cursor-pointer animate-pulse"
                >
                  <span>START HERE</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex justify-center -my-1 text-amber-400 font-bold text-xs">⬇️</div>

              {/* Step 2 */}
              <div 
                onClick={handleLaunchLesson1}
                className="p-2.5 rounded-xl bg-card border border-border/80 hover:border-amber-500/40 hover:bg-secondary/40 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="h-6 w-6 rounded-full bg-secondary text-foreground font-black flex items-center justify-center text-xs shrink-0">2</span>
                  <div>
                    <span className="font-bold text-foreground">Day 2: Unit Economics & Break-Even CPA</span>
                    <p className="text-[11px] text-muted-foreground">Model Jenny's $18.50 coffee, $7 COGS, and calculate max allowable ad spend</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">
                  UNIT ECONOMICS
                </Badge>
              </div>

              <div className="flex justify-center -my-1 text-muted-foreground font-bold text-xs">⬇️</div>

              {/* Step 3 */}
              <div 
                onClick={() => { onClose(); setLocation('/persona-builder-template'); }}
                className="p-2.5 rounded-xl bg-card border border-border/80 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="h-6 w-6 rounded-full bg-secondary text-foreground font-black flex items-center justify-center text-xs shrink-0">3</span>
                  <div>
                    <span className="font-bold text-foreground">Day 3: Customer Persona & Client Discovery</span>
                    <p className="text-[11px] text-muted-foreground">Build Morning Ritual & Executive buyer personas in the Persona Builder</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] text-indigo-400 border-indigo-500/30">
                  PERSONA LAB
                </Badge>
              </div>

              <div className="flex justify-center -my-1 text-muted-foreground font-bold text-xs">⬇️</div>

              {/* Step 4 */}
              <div 
                onClick={() => { onClose(); setLocation('/ab-test-workshop'); }}
                className="p-2.5 rounded-xl bg-card border border-border/80 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="h-6 w-6 rounded-full bg-secondary text-foreground font-black flex items-center justify-center text-xs shrink-0">4</span>
                  <div>
                    <span className="font-bold text-foreground">Day 4: Headline Clarity & Live A/B Testing Lab</span>
                    <p className="text-[11px] text-muted-foreground">QA challenger copy vs 'Coffee Beans For Sale' in the A/B Testing Lab</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">
                  A/B SPLIT LAB
                </Badge>
              </div>

              <div className="flex justify-center -my-1 text-muted-foreground font-bold text-xs">⬇️</div>

              {/* Step 5 */}
              <div 
                onClick={() => { onClose(); setLocation('/portfolio'); }}
                className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="h-6 w-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">5</span>
                  <div>
                    <span className="font-bold text-foreground">Day 5: Deploy Winner & Level 1 Certification</span>
                    <p className="text-[11px] text-muted-foreground">Deploy the winning variant to Jenny's account & earn verified credential</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono shrink-0">
                  CREDENTIAL
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <DialogFooter className="flex flex-col sm:flex-col sm:space-x-0 gap-2 pt-2 border-t border-border/40 w-full">
          {currentSlide === totalSlides ? (
            <Button
              onClick={handleLaunchLesson1}
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer h-11"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Launch Step 1: Customer Journey (Lesson 1.1) ➔</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2 w-full">
              {currentSlide > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 text-xs border-border hover:bg-secondary flex items-center justify-center gap-1.5 h-10 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs h-10 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Next: {currentSlide === 1 ? "See What is Course vs Practice" : "See Step-by-Step Roadmap"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between w-full pt-1 text-[11px] text-muted-foreground">
            <button
              type="button"
              onClick={handleLaunchLesson1}
              className="text-amber-400 hover:underline font-semibold"
            >
              Skip tour & jump directly to Lesson 1.1 ➔
            </button>
            <button
              type="button"
              onClick={onClose}
              className="hover:text-foreground"
            >
              Close Guide
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
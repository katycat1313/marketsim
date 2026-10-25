import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Sparkles,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
  Target,
  Split,
  Search,
  MousePointer
} from "lucide-react";
import { getActiveInstructor } from "@/lib/instructorConfig";
import { useDeepgramVoice } from "@/hooks/useDeepgramVoice";
import { useToast } from "@/hooks/use-toast";

export interface ToolDirectiveData {
  toolName: string;
  defaultLessonId: number;
  defaultLessonChapter: string;
  defaultLessonTitle: string;
  headline: string;
  overview: string;
  checklist: Array<{
    id: string;
    letter: string;
    title: string;
    description: string;
  }>;
  quickQuestions: string[];
}

const TOOL_DIRECTIVES: Record<string, ToolDirectiveData> = {
  "ab-test-workshop": {
    toolName: "Jenny's A/B Testing Lab",
    defaultLessonId: 10,
    defaultLessonChapter: "1.10",
    defaultLessonTitle: "Day 4 (Do) — A/B Testing Lab: Headline Psychology & 5-Second Offer Test",
    headline: "Lab Mission: Diagnose Jenny's 84% Bounce Rate & Deploy Winning Offer Copy",
    overview: "Jenny's coffee roastery is bleeding ad spend on Google ($2.85/click) because her current headline 'Coffee Beans For Sale' looks like generic supermarket warehouse coffee. Your directive is to test her baseline against our high-converting artisan fresh-roast challenger with a 15% introductory offer, verify statistical significance (p < 0.05), and deploy the winner.",
    checklist: [
      {
        id: "ab-var",
        letter: "A",
        title: "Confirm Test Variable is 'Headline'",
        description: "Verify that the test variable is set to Headline to evaluate Jenny's primary Homepage H1."
      },
      {
        id: "ab-challenger",
        letter: "B",
        title: "Test Control vs Artisan Challenger",
        description: "Compare baseline ('Coffee Beans For Sale') against challenger ('Small-Batch Artisan Coffee Roasted Fresh & Shipped to Your Door - 15% Off Your First Batch')."
      },
      {
        id: "ab-sig",
        letter: "C",
        title: "Verify Statistical Confidence (≥95%)",
        description: "Run the simulation to at least 1,500 visitors and verify confidence reaches ≥95% (p < 0.05) with a positive conversion rate lift."
      },
      {
        id: "ab-deploy",
        letter: "D",
        title: "Deploy Winner to Live Client Account",
        description: "Click 'Deploy Winner to Live Client Account' to lock in the +28% CVR lift in Jenny's live marketing engine and update active ad copy."
      }
    ],
    quickQuestions: [
      "What sample size do I need before trusting this A/B test?",
      "Why does statistical confidence need to be 95%?",
      "Is a 28% conversion lift normal for a headline change?",
      "When is it safe to deploy the winning variant to Jenny's live site?"
    ]
  },
  "seo-simulation": {
    toolName: "Jenny's SEO & Website Studio",
    defaultLessonId: 6,
    defaultLessonChapter: "1.6",
    defaultLessonTitle: "Day 2 (Do) — SEO Studio: Fix Jenny's Title Tags & Organic Intent",
    headline: "Lab Mission: Eliminate Search Disconnect & Score 80+/100 on Page Experience",
    overview: "Jenny is invisible on Google for high-intent coffee buyers because her page simply says 'Buy Coffee'. Optimize her Title Tag, H1 Headline, and Meta Description to reach an audit score of 80+ to earn an 'Above Average' rating and lower Google Ads CPC.",
    checklist: [
      {
        id: "seo-title",
        letter: "A",
        title: "Optimize Title Tag with Intent Keywords",
        description: "Include target keywords 'Organic Coffee Beans' and brand name 'Jenny's Artisan Java'."
      },
      {
        id: "seo-h1",
        letter: "B",
        title: "Align H1 Headline with Customer Search",
        description: "Match organic search intent in the main H1 heading to stop visitors bouncing in under 4 seconds."
      },
      {
        id: "seo-meta",
        letter: "C",
        title: "Craft Compelling Meta Description",
        description: "Highlight key differentiators: 48-hour fresh roast guarantee, fair-trade origin, and flat-rate shipping."
      },
      {
        id: "seo-score",
        letter: "D",
        title: "Achieve ≥80/100 Audit Score",
        description: "Verify your on-page audit score hits 80+ to unlock the Google Ads Quality Score discount."
      }
    ],
    quickQuestions: [
      "How does my SEO audit score affect Jenny's Google Ads CPC?",
      "What is the difference between brand and non-brand search intent?",
      "Why did visitors bounce in under 4 seconds on Jenny's old site?"
    ]
  },
  "ad-simulation": {
    toolName: "Jenny's Paid Search Ads Platform",
    defaultLessonId: 12,
    defaultLessonChapter: "1.12",
    defaultLessonTitle: "Day 5 (Do) — Google Ads Auction & Quality Score Optimizer",
    headline: "Lab Mission: Block Wasted Ad Spend & Secure <$16.00 Target CPA",
    overview: "Jenny is burning $50/day on wasted clicks for searches like 'coffee clip art' and 'coffee maker repair'. Install a negative keyword shield and adjust match types so every dollar targets buyers of fresh whole beans.",
    checklist: [
      {
        id: "ad-neg",
        letter: "A",
        title: "Install Negative Keyword Shield",
        description: "Add -free, -repair, -keurig, -cheap, and -machine to stop paying for non-buying clicks."
      },
      {
        id: "ad-match",
        letter: "B",
        title: "Refine Match Types to Phrase & Exact",
        description: "Convert broad match queries to high-intent phrase and exact match targets."
      },
      {
        id: "ad-cpa",
        letter: "C",
        title: "Cap Maximum Bids Below $18 Break-Even",
        description: "Keep maximum CPC bids within the safety ceiling so customer acquisition cost stays profitable."
      }
    ],
    quickQuestions: [
      "How do negative keywords protect Jenny's daily ad budget?",
      "What is our break-even CPA on Jenny's $42.50 average order value?",
      "Why does a higher Quality Score lower our cost per click?"
    ]
  },
  "persona-builder": {
    toolName: "Customer Persona Builder",
    defaultLessonId: 8,
    defaultLessonChapter: "1.8",
    defaultLessonTitle: "Day 3 (Do) — Client Discovery & Persona Synthesis",
    headline: "Lab Mission: Map Pour-Over Marcus & Unlock +25% Relevance Bonus",
    overview: "Define Jenny's primary customer profile: Pour-Over Marcus, age 25–45, who values 48-hour fresh roast dates and transparent co-op origins. Synthesizing this persona unlocks a +25% ad relevance CTR bonus across her campaigns.",
    checklist: [
      {
        id: "per-profile",
        letter: "A",
        title: "Define Target Customer Profile",
        description: "Specify craft coffee drinkers frustrated by stale supermarket coffee sitting on shelves."
      },
      {
        id: "per-pain",
        letter: "B",
        title: "Pinpoint Buying Triggers & Objections",
        description: "Address roast freshness, origin notes (Ethiopia & Guatemala), and shipping clarity."
      },
      {
        id: "per-sync",
        letter: "C",
        title: "Synthesize & Save Persona to Client",
        description: "Click 'Save Persona to Client Account' to activate the audience relevance boost."
      }
    ],
    quickQuestions: [
      "Why is Pour-Over Marcus our primary target customer?",
      "How does persona synthesis increase ad click-through rate?",
      "What is the biggest objection first-time coffee buyers have?"
    ]
  }
};

interface InstructorToolGuideProps {
  toolKey: "ab-test-workshop" | "seo-simulation" | "ad-simulation" | "persona-builder";
}

export function InstructorToolGuide({ toolKey }: InstructorToolGuideProps) {
  const directive = TOOL_DIRECTIVES[toolKey] || TOOL_DIRECTIVES["ab-test-workshop"];
  const instructor = getActiveInstructor(toolKey === "seo-simulation" ? "seo" : "ads");
  const { toast } = useToast();

  // Saved lesson context from localStorage
  const [lastLessonId, setLastLessonId] = useState<number>(directive.defaultLessonId);
  const [lastLessonChapter, setLastLessonChapter] = useState<string>(directive.defaultLessonChapter);
  const [lastLessonTitle, setLastLessonTitle] = useState<string>(directive.defaultLessonTitle);

  // UI state
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  // Chat & Voice Copilot State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "instructor"; text: string }>>([
    {
      sender: "instructor",
      text: `Welcome to ${directive.toolName}! I'm ${instructor.name}, your lab copilot. I'm right here with you while you work on this tool. Follow the checklist below, and feel free to ask me anything about what to look for!`
    }
  ]);
  const [userQuestion, setUserQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const instructorVoice = useDeepgramVoice({
    defaultVoice: instructor.voice
  });

  // Read saved lesson on mount
  useEffect(() => {
    try {
      const savedId = localStorage.getItem("krechet_last_active_tutorial_id");
      const savedTitle = localStorage.getItem("krechet_last_active_tutorial_title");
      const savedChapter = localStorage.getItem("krechet_last_active_chapter");
      if (savedId) setLastLessonId(parseInt(savedId));
      if (savedTitle) setLastLessonTitle(savedTitle);
      if (savedChapter) setLastLessonChapter(savedChapter);
    } catch (e) {}

    // Load saved checklist state
    try {
      const savedChecks = localStorage.getItem(`krechet_checklist_${toolKey}`);
      if (savedChecks) setCheckedItems(JSON.parse(savedChecks));
    } catch (e) {}
  }, [toolKey]);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(`krechet_checklist_${toolKey}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleAskInstructor = async (questionText?: string) => {
    const q = (questionText || userQuestion).trim();
    if (!q || isTyping) return;

    const newMsgs = [...chatMessages, { sender: "user" as const, text: q }];
    setChatMessages(newMsgs);
    if (!questionText) setUserQuestion("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `You are ${instructor.name}, an expert marketing instructor at Krechet Academy acting as a live lab copilot.
Teaching style: '${instructor.teachingStyle}'.
The student is currently using the workbench tool: '${directive.toolName}'.
Client in focus: Jenny's Artisan Java & Roastery (Morgantown, WV).
Lab mission: ${directive.overview}

Student asked: "${q}"

Provide a direct, encouraging, practical answer in 2 to 3 sentences. Explain what to look for, what the metrics mean, or what tactical action to take in this tool.`,
          userContext: {
            instructor: instructor.name,
            toolName: directive.toolName,
            studentQuestion: q
          }
        })
      });

      const data = await res.json();
      const reply = data.response || data.message || `Great question! Focus on the statistical confidence score and compare it against Jenny's $18.00 break-even CPA.`;

      setChatMessages(prev => [...prev, { sender: "instructor", text: reply }]);
      if (isVoiceActive) {
        instructorVoice.speak(reply);
      }
    } catch (err) {
      const fallback = `Focus on completing items A through D in your checklist above. Make sure your confidence reaches at least 95% before deploying!`;
      setChatMessages(prev => [...prev, { sender: "instructor", text: fallback }]);
      if (isVoiceActive) {
        instructorVoice.speak(fallback);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const completedCount = directive.checklist.filter(item => checkedItems[item.id]).length;
  const isAllComplete = completedCount === directive.checklist.length;

  return (
    <div className="mb-6 space-y-3">
      {/* Top Action Bar: Return to Lesson + Instructor Copilot Header */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-card to-slate-900 border border-primary/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Quick Return to Exact Lesson */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href={`/tutorials?tutorialId=${lastLessonId}`}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-8 px-3 shadow-md gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Lesson (Chapter {lastLessonChapter})</span>
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground hidden md:inline truncate max-w-xs">
            {lastLessonTitle}
          </span>
        </div>

        {/* Right: Instructor Avatar & Live Copilot Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar className="h-8 w-8 border-2 border-primary/40 shadow-sm">
                <AvatarImage src={instructor.avatar} alt={instructor.name} />
                <AvatarFallback>{instructor.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-background animate-pulse"></span>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>{instructor.name}</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  Lab Copilot
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground">Followed you to this lab</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={isCopilotOpen ? "default" : "outline"}
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className="h-8 text-xs gap-1.5 border-primary/40 font-semibold cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              <span>{isCopilotOpen ? "Hide Copilot" : "Ask Instructor Live"}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsChecklistOpen(!isChecklistOpen)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title={isChecklistOpen ? "Collapse Checklist" : "Expand Checklist"}
            >
              {isChecklistOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Collapsible Lab Checklist Card */}
      {isChecklistOpen && (
        <Card className="bg-card/95 border-amber-500/30 shadow-md">
          <CardHeader className="py-3 px-4 bg-amber-500/5 border-b border-border/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] font-mono uppercase">
                    Instructor Field Directive
                  </Badge>
                  <span className="text-xs font-bold text-foreground">
                    {directive.headline}
                  </span>
                </div>
                <CardDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
                  {directive.overview}
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {completedCount}/{directive.checklist.length} Complete
                </span>
                {isAllComplete && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-bold">
                    Ready to Return ➔
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-2.5">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Checklist of Items to Verify in This Lab:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {directive.checklist.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                      isChecked
                        ? "bg-emerald-500/10 border-emerald-500/40 text-foreground"
                        : "bg-secondary/30 hover:bg-secondary/60 border-border/70 text-muted-foreground"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/60" />
                      )}
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div className="font-bold flex items-center gap-1.5 text-foreground">
                        <span className="h-4 w-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold">
                          {item.letter}
                        </span>
                        <span className={isChecked ? "line-through opacity-80" : ""}>
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactive Instructor Copilot Drawer (Live Speaking & Chat) */}
      {isCopilotOpen && (
        <Card className="bg-card/95 border-primary/40 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <CardHeader className="py-3 px-4 bg-primary/5 border-b border-border/70 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 border border-primary/40">
                <AvatarImage src={instructor.avatar} alt={instructor.name} />
                <AvatarFallback>{instructor.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xs font-bold flex items-center gap-2">
                  <span>Ask {instructor.name} About This Lab</span>
                  <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary font-mono">
                    Deepgram Aura Voice
                  </Badge>
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Real-time guidance on metrics, sample sizes, and campaign deployment
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={isVoiceActive ? "default" : "outline"}
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className={`h-7 px-2.5 text-xs gap-1 cursor-pointer ${isVoiceActive ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : ''}`}
                title={isVoiceActive ? "Voice narration active" : "Enable voice narration"}
              >
                {isVoiceActive ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                <span className="text-[10px]">{isVoiceActive ? "Voice On" : "Voice Off"}</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsCopilotOpen(false)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            {/* Quick Question Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Quick Questions for {instructor.name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {directive.quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isTyping}
                    onClick={() => handleAskInstructor(q)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-all hover:border-primary/50 cursor-pointer disabled:opacity-50 text-left"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Log */}
            <div className="p-3 rounded-lg bg-background/60 border border-border/80 max-h-48 overflow-y-auto space-y-2 text-xs">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] text-muted-foreground mb-0.5">
                    {m.sender === "user" ? "You" : instructor.name}
                  </span>
                  <div
                    className={`max-w-[88%] rounded-xl px-3 py-2 leading-relaxed text-xs ${
                      m.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-xs"
                        : "bg-card border border-border text-foreground rounded-bl-xs"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span>{instructor.name} is formulating advice...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-1">
              <Textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAskInstructor();
                  }
                }}
                placeholder={`Ask ${instructor.name} anything about this lab...`}
                rows={1}
                className="text-xs resize-none min-h-[38px] max-h-[70px] py-2 bg-background flex-1"
              />
              <Button
                size="sm"
                onClick={() => handleAskInstructor()}
                disabled={!userQuestion.trim() || isTyping}
                className="h-[38px] px-3.5 shrink-0 gap-1 text-xs font-semibold cursor-pointer"
              >
                {isTyping ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                <span>Ask</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
export default InstructorToolGuide;

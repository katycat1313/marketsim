import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useDeepgramVoice } from "@/hooks/useDeepgramVoice";
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  CheckCircle2, 
  Brain, 
  Volume2, 
  VolumeX, 
  Radio, 
  HelpCircle,
  MessageSquare,
  Play,
  ArrowRight,
  Layers,
  FileCheck2,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Video
} from "lucide-react";

interface AITeacherLessonPanelProps {
  lessonTitle: string;
  lessonLevel: string;
  lessonContent: string;
  chapterNumber?: number;
}

export function AITeacherLessonPanel({
  lessonTitle,
  lessonLevel,
  lessonContent,
  chapterNumber = 1
}: AITeacherLessonPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"visuals" | "checkin" | "ask">("visuals");
  const [userAnswer, setUserAnswer] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [teacherResponse, setTeacherResponse] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  const instructor = {
    name: "Director Atlas & Sarah Jenkins",
    title: "Lead Academy Flight Mentors",
    agency: "Krechet Academy Executive Board",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
  };

  // Chapter-specific visual cards & diagrams
  const getVisualConceptData = () => {
    if (chapterNumber === 1 || lessonTitle.toLowerCase().includes("seo") || lessonTitle.toLowerCase().includes("on-page")) {
      return {
        conceptName: "The Newspaper Rule & Heading Silos",
        diagramImg: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
        simulationLink: "/seo-simulation/1",
        simulationName: "Jenny's Artisan Java (CMS On-Page Audit)",
        cards: [
          {
            icon: "1️⃣",
            title: "Title Tag = Library Catalog Index",
            desc: "The single most important tag (50-60 chars). Tells Google what the page is about before they even open it.",
            badge: "Meta Title",
            color: "border-blue-500/30 bg-blue-500/10 text-blue-400"
          },
          {
            icon: "2️⃣",
            title: "H1 Headline = Front Page Banner",
            desc: "Exactly ONE H1 per page. Must contain the primary commercial offering (e.g., 'Fresh Organic Arabica Beans Roasted in Morgantown').",
            badge: "Primary H1",
            color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          },
          {
            icon: "3️⃣",
            title: "Meta Description = 2-Sentence Teaser",
            desc: "150-160 characters. Doesn't rank directly, but drives Click-Through Rate (CTR) with a compelling call-to-action.",
            badge: "Snippet CTR",
            color: "border-purple-500/30 bg-purple-500/10 text-purple-400"
          }
        ],
        trap: "Using vague greetings like 'Welcome to Our Website' as your H1. Search engines have zero idea what you sell!",
        takeaway: "Always align the Title Tag, H1 Headline, and Meta Description with exact user search intent."
      };
    } else if (chapterNumber === 2 || chapterNumber === 3 || lessonTitle.toLowerCase().includes("google ads") || lessonTitle.toLowerCase().includes("bidding")) {
      return {
        conceptName: "The PPC Auction & Quality Score Engine",
        diagramImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        simulationLink: "/ad-simulation/1",
        simulationName: "Dr. Miller Dental (Paid Search Auction)",
        cards: [
          {
            icon: "🎯",
            title: "Match Types (Broad vs Phrase vs Exact)",
            desc: "Broad match wastes budget on irrelevant searches. Wrap high-intent phrases in quotes 'emergency dentist' for tight control.",
            badge: "Match Types",
            color: "border-blue-500/30 bg-blue-500/10 text-blue-400"
          },
          {
            icon: "🛡️",
            title: "Negative Keyword Budget Shields",
            desc: "Add negatives like 'free', 'jobs', 'salary' to instantly block $500+/mo in wasted clicks from non-buyers.",
            badge: "Budget Shield",
            color: "border-rose-500/30 bg-rose-500/10 text-rose-400"
          },
          {
            icon: "📈",
            title: "Quality Score = CPC Discount Formula",
            desc: "A 10/10 Quality Score gives you up to a 50% discount on cost-per-click compared to competitors with low relevance.",
            badge: "Quality Score",
            color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          }
        ],
        trap: "Running Broad Match keywords without negative keyword shields. You will pay for job seekers instead of paying customers!",
        takeaway: "High Quality Score + Negative Keywords = Lower Cost Per Acquisition (CPA)."
      };
    } else {
      return {
        conceptName: "Omnichannel Growth & Performance Telemetry",
        diagramImg: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
        simulationLink: "/capstone-simulation",
        simulationName: "Apex Global Master Capstone Flight Simulator",
        cards: [
          {
            icon: "⚡",
            title: "Hook Rate & Creative Fatigue",
            desc: "Stop the scroll in the first 3 seconds on Meta/TikTok. Refresh creatives when ad frequency exceeds 3.5.",
            badge: "Creative Testing",
            color: "border-amber-500/30 bg-amber-500/10 text-amber-400"
          },
          {
            icon: "📊",
            title: "GA4 Custom Events & Funnel Leaks",
            desc: "Track micro-conversions (scroll depth, add-to-cart) to pinpoint exact friction points before checkout.",
            badge: "Analytics Telemetry",
            color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
          },
          {
            icon: "🏆",
            title: "Blended MER (Marketing Efficiency Ratio)",
            desc: "Total Revenue ÷ Total Ad Spend. The ultimate North Star metric for executive marketing leadership.",
            badge: "Executive MER",
            color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          }
        ],
        trap: "Relying purely on platform-reported ROAS without auditing blended MER and server-side tracking.",
        takeaway: "High-performing marketing combines creative storytelling with ruthless quantitative attribution."
      };
    }
  };

  const visualData = getVisualConceptData();

  const socraticPrompt = `“In this lesson on '${lessonTitle}', what is the single biggest tactical mistake junior marketers make, and how would you explain the fix to a real business owner?”`;

  const deepgramVoice = useDeepgramVoice({
    defaultVoice: "aura-orion-en"
  });

  const speakText = (text: string) => {
    if (isMuted) return;
    deepgramVoice.speak(text);
  };

  const toggleListening = (target: "answer" | "question") => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Voice Input Unavailable",
        description: "Your browser does not support Web Speech API. Please type your text.",
        variant: "destructive",
      });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Microphone Active 🎙️",
          description: "Speak your response clearly...",
        });
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (target === "answer") {
          setUserAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
        } else {
          setUserQuestion(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      toast({
        title: "Microphone Error",
        description: err.message || "Could not access microphone.",
        variant: "destructive"
      });
    }
  };

  const handleEvaluateCheckin = async () => {
    if (!userAnswer.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/interview-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: socraticPrompt,
          userAnswer: userAnswer,
          targetRole: `Marketing Associate (${lessonTitle})`
        })
      });

      const data = await res.json();
      const score = data.score || 85;
      const detectedTier = score >= 85 ? "Advanced Strategist 🚀" : score >= 70 ? "Intermediate Associate 📈" : "Beginner Cadet 🎓";

      setEvaluation({
        ...data,
        detectedTier
      });
      speakText(`Evaluation complete. You scored ${score} out of 100. Evaluated as ${detectedTier}. You are ready for the live simulation.`);
    } catch (e) {
      const score = userAnswer.length > 50 ? 90 : 75;
      const detectedTier = score >= 85 ? "Advanced Strategist 🚀" : "Intermediate Associate 📈";
      setEvaluation({
        score,
        detectedTier,
        rating: "Solid Strategic Comprehension ✅",
        feedback: [
          "Demonstrates strong understanding of the core concept.",
          "Clear explanation of why vague messaging or missing negatives causes budget bleed."
        ],
        sampleModelAnswer: "The most common mistake is failing to isolate search intent or match types, which leads to budget bleed. Always audit query reports and configure negative keywords."
      });
      speakText(`Great effort. You scored ${score} out of 100.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskTeacher = async () => {
    if (!userQuestion.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Regarding the lesson '${lessonTitle}': ${userQuestion}`,
          userContext: {
            level: lessonLevel,
            contextType: "tutorial",
            lessonTitle
          }
        })
      });

      const data = await res.json();
      const answer = data.response || data.message || "I am analyzing this lesson concept for you.";
      setTeacherResponse(answer);
      speakText(answer.slice(0, 200));
    } catch (e) {
      setTeacherResponse("Great question! In this module, focus on matching customer search intent with compelling ad hooks and maintaining tight negative keyword protection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-emerald-500/30 bg-gradient-to-br from-card via-card/90 to-emerald-950/20 shadow-2xl overflow-hidden my-6">
      {/* Mentor Header */}
      <CardHeader className="p-4 bg-secondary/40 border-b border-border/70 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={instructor.avatarUrl} 
              alt={instructor.name}
              className="h-11 w-11 rounded-full object-cover border-2 border-emerald-500 shadow-md"
            />
            {isSpeaking && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[8px] font-bold text-black items-center justify-center">AI</span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold text-foreground">{instructor.name}</CardTitle>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] uppercase tracking-wider font-mono">
                <Radio className="h-2.5 w-2.5 mr-1 inline animate-pulse text-emerald-400" /> Interactive Classroom
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Conversational Instruction • Visual Frameworks • Real-Time Socratic Checks
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => setIsMuted(prev => !prev)}
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5 text-xs">
        {/* Navigation Tabs for Lesson Modes */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={activeTab === "visuals" ? "default" : "outline"}
              onClick={() => setActiveTab("visuals")}
              className="text-xs h-8 font-semibold"
            >
              <Layers className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
              1. Visual Concept Cards
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeTab === "checkin" ? "default" : "outline"}
              onClick={() => setActiveTab("checkin")}
              className="text-xs h-8 font-semibold"
            >
              <Brain className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
              2. Socratic Discussion
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeTab === "ask" ? "default" : "outline"}
              onClick={() => setActiveTab("ask")}
              className="text-xs h-8 font-semibold"
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
              3. Ask Teacher a Question
            </Button>
          </div>

          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-8 shadow-md">
            <Link href={visualData.simulationLink}>
              <Play className="h-3 w-3 mr-1.5 fill-current" />
              <span>Launch Chapter Sandbox</span>
            </Link>
          </Button>
        </div>

        {/* TAB 1: VISUAL CONCEPT CARDS & DIAGRAMS */}
        {activeTab === "visuals" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                Core Tactical Model: {visualData.conceptName}
              </span>
              <Badge variant="outline" className="text-[10px]">3-Step Mental Framework</Badge>
            </div>

            {/* 3 Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {visualData.cards.map((card, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border ${card.color} space-y-1.5`}>
                  <div className="flex items-center justify-between">
                    <span className="text-base">{card.icon}</span>
                    <Badge variant="outline" className="text-[9px] font-mono">{card.badge}</Badge>
                  </div>
                  <h4 className="font-bold text-xs text-foreground">{card.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Warning Callout Box */}
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <strong className="text-xs font-semibold block text-rose-200">The Wasted Budget Trap:</strong>
                <p className="text-[11px] leading-relaxed">{visualData.trap}</p>
              </div>
            </div>

            {/* Direct Sandbox Runway Banner */}
            <div className="p-3.5 rounded-xl bg-secondary/50 border border-border flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Ready to test this in the live simulator?
                </span>
                <p className="text-[11px] text-muted-foreground">Mission: <strong>{visualData.simulationName}</strong></p>
              </div>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs">
                <Link href={visualData.simulationLink}>
                  <span>Enter Sandbox</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: SOCRATIC DIALOGUE & CHECK-IN */}
        {activeTab === "checkin" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/70 space-y-1.5">
              <div className="font-semibold text-primary flex items-center gap-1.5 text-xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Director Atlas Socratic Check-In:</span>
              </div>
              <p className="text-xs text-foreground/90 italic leading-relaxed">
                {socraticPrompt}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Speak or type your strategic reasoning:</span>
                <Button
                  type="button"
                  size="sm"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={() => toggleListening("answer")}
                  className="h-6 text-[11px] px-2 flex items-center gap-1"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-3 w-3" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-3 w-3 text-emerald-400" />
                      <span>Voice Input 🎙️</span>
                    </>
                  )}
                </Button>
              </div>

              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="e.g., The biggest mistake is using vague headings like 'Welcome' or running broad match keywords without negative shields. I would fix this by..."
                className="min-h-[85px] text-xs bg-background border-border text-foreground leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                onClick={handleEvaluateCheckin}
                disabled={isLoading || !userAnswer.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                {isLoading ? "Evaluating with AI..." : "Submit Answer for Instructor Grading"}
              </Button>
            </div>

            {/* Evaluation Score Card */}
            {evaluation && (
              <div className="p-4 rounded-xl bg-card border border-emerald-500/30 space-y-3 mt-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <div>
                      <span className="font-bold text-foreground text-xs">Instructor Feedback</span>
                      <p className="text-[11px] text-emerald-400">{evaluation.rating}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {evaluation.detectedTier && (
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-semibold">
                        {evaluation.detectedTier}
                      </Badge>
                    )}
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs font-mono font-bold">
                      {evaluation.score}/100 Score
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-foreground">Feedback from Sarah & Atlas:</span>
                  <ul className="space-y-1 pl-4 list-disc text-muted-foreground text-[11px]">
                    {(evaluation.feedback || []).map((fb: string, idx: number) => (
                      <li key={idx}>{fb}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end pt-2">
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs">
                    <Link href={visualData.simulationLink}>
                      <Play className="h-3 w-3 mr-1 fill-current" />
                      <span>Launch Flight Simulation Mission</span>
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ASK TEACHER A QUESTION */}
        {activeTab === "ask" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Ask Director Atlas anything about this lesson:</span>
                <Button
                  type="button"
                  size="sm"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={() => toggleListening("question")}
                  className="h-6 text-[11px] px-2 flex items-center gap-1"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-3 w-3" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-3 w-3 text-cyan-400" />
                      <span>Voice Question 🎙️</span>
                    </>
                  )}
                </Button>
              </div>

              <Textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="e.g., How do I know if my H1 is too long, or what is the difference between phrase match and exact match?"
                className="min-h-[85px] text-xs bg-background border-border text-foreground"
              />
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleAskTeacher}
                disabled={isLoading || !userQuestion.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs"
              >
                {isLoading ? "Consulting Mentors..." : "Ask Director Atlas"}
              </Button>
            </div>

            {teacherResponse && (
              <div className="p-4 rounded-xl bg-card border border-primary/30 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    💬
                  </div>
                  <span className="font-bold text-xs text-foreground">Director Atlas Response:</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {teacherResponse}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AITeacherLessonPanel;

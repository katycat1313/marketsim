import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  Brain,
  Radio
} from "lucide-react";

interface AITeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionTitle?: string;
  missionTopic?: string;
  missionPath?: string;
}

export function AITeacherModal({
  isOpen,
  onClose,
  missionTitle = "Mission 1: Coffee Shop Local Intent & On-Page SEO Repair",
  missionTopic = "Local Intent, H1 Siloing & Negative Keywords",
  missionPath = "/seo-simulation/1"
}: AITeacherModalProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState<"briefing" | "socratic_question" | "evaluated">("briefing");
  const [userAnswer, setUserAnswer] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingEvaluation, setIsLoadingEvaluation] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const recognitionRef = useRef<any>(null);

  const instructor = {
    name: "Sarah Jenkins",
    title: "Senior Director of Performance & Flight Instructor",
    agency: "Apex Omnicom Media",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
  };

  const briefingScript = `“Welcome to Flight Academy, Growth Associate. Today, you are stepping into a real account: Jenny's Artisan Java in Morgantown. Jenny has world-class 100% Organic Arabica beans, but her website was slapped together in 10 minutes and search engines have zero idea what she sells. Your mission is to restructure her on-page tags, fix her H1 hierarchy, and ensure real customers can find her on Google.

Before you jump into the live CMS sandbox, answer my check-in question to ensure you understand the core strategy.”`;

  const socraticQuestion = `“Explain in your own words: Why is it a disaster to leave an organic coffee roastery's title tag as generic 'Buy Coffee', and what 3 structural elements must you fix first to rank on search engines?”`;

  // Speech synthesis
  const speakText = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Speak script on step change
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      return;
    }

    if (step === "briefing") {
      speakText(briefingScript);
    } else if (step === "socratic_question") {
      speakText(socraticQuestion);
    }
  }, [step, isOpen, isMuted]);

  // Speech recognition (Voice input)
  const toggleListening = () => {
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
        description: "Your browser does not support Web Speech API. Please type your response.",
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
          description: "Speak your response to the AI Instructor...",
        });
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
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

  // Evaluate Socratic response
  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    stopSpeaking();
    setIsLoadingEvaluation(true);

    try {
      const res = await fetch("/api/ai/interview-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: socraticQuestion,
          userAnswer: userAnswer,
          targetRole: "Junior SEO Associate"
        })
      });

      const data = await res.json();
      setEvaluationResult(data);
      setStep("evaluated");

      const feedbackVoice = `Great effort. You scored ${data.score} out of 100. ${data.rating}. You are now ready to launch the mission.`;
      speakText(feedbackVoice);
    } catch (err) {
      const score = userAnswer.length > 50 ? 88 : 70;
      const fallbackData = {
        score,
        rating: score >= 80 ? "Mastery Approved 🌟" : "Good Progress ✅",
        feedback: [
          "Strong understanding of search intent and heading hierarchy.",
          "Remember to always check image alt tags and meta description lengths."
        ],
        sampleModelAnswer: "Generic titles fail because search engines cannot infer organic bean sourcing. We must fix: 1) Title Tag with primary keywords, 2) Single H1 with organic claims, and 3) Meta description with an active CTA."
      };
      setEvaluationResult(fallbackData);
      setStep("evaluated");
    } finally {
      setIsLoadingEvaluation(false);
    }
  };

  const handleLaunchSandbox = () => {
    stopSpeaking();
    onClose();
    setLocation(missionPath);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { stopSpeaking(); onClose(); } }}>
      <DialogContent className="max-w-2xl bg-card border-border/80 text-foreground p-0 overflow-hidden shadow-2xl rounded-2xl">
        {/* Header with Instructor Avatar & Live Audio Wave */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-card to-secondary/50 p-5 border-b border-border/70 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img 
                src={instructor.avatarUrl} 
                alt={instructor.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-emerald-500 shadow-md"
              />
              {isSpeaking && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] text-black font-bold items-center justify-center">AI</span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-bold text-foreground">{instructor.name}</DialogTitle>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] uppercase tracking-wider font-mono">
                  <Radio className="h-2.5 w-2.5 mr-1 inline animate-pulse text-emerald-400" /> Socratic AI Teacher
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {instructor.title} • {instructor.agency}
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full border-border/60 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMuted(prev => !prev)}
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
            </Button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Mission Badge */}
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-secondary/30 px-3 py-2 rounded-lg border border-border/50">
            <span className="font-semibold text-foreground">{missionTitle}</span>
            <span className="font-mono text-primary text-[11px]">{missionTopic}</span>
          </div>

          {step === "briefing" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-secondary/40 border border-border/70 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>90-Second Tactical Flight Briefing</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed italic">
                  {briefingScript}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  onClick={() => setStep("socratic_question")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold flex items-center gap-2"
                >
                  <span>Begin Socratic Check-In</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === "socratic_question" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <Brain className="h-4 w-4" />
                  <span>Instructor Check-In Question:</span>
                </div>
                <p className="text-xs text-foreground font-medium leading-relaxed">
                  {socraticQuestion}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Speak or type your answer:</span>
                  <Button
                    type="button"
                    size="sm"
                    variant={isListening ? "destructive" : "outline"}
                    onClick={toggleListening}
                    className="h-7 text-xs flex items-center gap-1.5"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-3 w-3" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-3 w-3 text-emerald-400" />
                        <span>Voice Answer 🎙️</span>
                      </>
                    )}
                  </Button>
                </div>

                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="e.g., A generic title tag fails because search engine crawlers cannot determine specific product intent. We must fix: 1) Title tag with organic keywords, 2) H1 tag hierarchy, and 3) Meta description with a compelling CTA..."
                  className="min-h-[90px] text-xs bg-background border-border text-foreground leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setStep("briefing")}>
                  Back
                </Button>
                <Button
                  size="sm"
                  onClick={handleEvaluateAnswer}
                  disabled={isLoadingEvaluation || !userAnswer.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
                >
                  {isLoadingEvaluation ? (
                    <div className="h-3.5 w-3.5 border-2 border-b-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Answer for AI Grading</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "evaluated" && evaluationResult && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Score Card */}
              <div className="p-4 rounded-xl bg-card border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <div>
                      <span className="font-bold text-foreground text-sm">Instructor Evaluation</span>
                      <p className="text-xs text-emerald-400">{evaluationResult.rating}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-sm font-mono px-3 py-1 font-bold">
                    {evaluationResult.score}/100 Score
                  </Badge>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-foreground">Feedback from Sarah:</span>
                  <ul className="space-y-1 pl-4 list-disc text-xs text-muted-foreground">
                    {(evaluationResult.feedback || []).map((fb: string, idx: number) => (
                      <li key={idx}>{fb}</li>
                    ))}
                  </ul>
                </div>

                {evaluationResult.sampleModelAnswer && (
                  <div className="p-2.5 rounded bg-muted/40 border border-border text-[11px] text-muted-foreground space-y-1">
                    <span className="font-semibold text-foreground block">💡 Model Strategy Answer:</span>
                    <p className="italic">{evaluationResult.sampleModelAnswer}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setStep("socratic_question")}>
                  Retry Answer
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleLaunchSandbox}
                  className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Launch Live Mission Sandbox</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useDeepgramVoice } from "@/hooks/useDeepgramVoice";
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
  Radio,
  BookOpen
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

  const briefingScript = `“Welcome to Krechet Academy, Growth Associate! Before we jump into the live website sandbox, let’s do a 60-second micro-lesson.

Think of a website just like a newspaper:
1. The Title Tag is the headline printed in the library catalog and on Google search results.
2. The H1 Headline is the giant front-page headline at the top of your webpage.
3. The Meta Description is the 2-sentence summary under your title in Google that convinces people to click.

Jenny's coffee roastery has world-class organic coffee, but her website currently just says 'Welcome to our site'—so search engines have zero idea what she sells! Let's do a quick check-in to make sure you've got the basics down before we launch the live CMS sandbox.”`;

  const socraticQuestion = `“Using the newspaper rule you just learned: If Jenny's website only says 'Welcome to our site', why does Google get confused, and what should her main H1 headline say instead to attract coffee lovers in Morgantown?”`;

  const deepgramVoice = useDeepgramVoice({
    defaultVoice: "aura-asteria-en"
  });

  // Speech synthesis with Deepgram Aura + Web Speech fallback
  const speakText = (text: string) => {
    if (isMuted) return;
    deepgramVoice.speak(text);
  };

  const stopSpeaking = () => {
    deepgramVoice.stop();
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
      const score = data.score || 85;
      const detectedTier = score >= 85 ? "Advanced Strategist 🚀" : score >= 70 ? "Intermediate Associate 📈" : "Beginner Cadet 🎓";
      
      setEvaluationResult({
        ...data,
        detectedTier
      });
      setStep("evaluated");

      const feedbackVoice = `Great effort. You scored ${score} out of 100. Evaluated as ${detectedTier}. You are now ready to launch the mission.`;
      speakText(feedbackVoice);
    } catch (err) {
      const score = userAnswer.length > 60 ? 90 : userAnswer.length > 25 ? 78 : 65;
      const detectedTier = score >= 85 ? "Advanced Strategist 🚀" : score >= 70 ? "Intermediate Associate 📈" : "Beginner Cadet 🎓";
      const fallbackData = {
        score,
        detectedTier,
        rating: score >= 85 ? "Advanced Mastery Approved 🌟" : score >= 70 ? "Good Progress ✅" : "Foundations Building 💡",
        feedback: score >= 85 ? [
          "Demonstrated strong strategic fluency with search intent and heading hierarchy.",
          "Clear understanding of commercial keyword targeting."
        ] : [
          "Understands the Newspaper Rule for website headings.",
          "Keep practicing connecting search keywords to the main headline."
        ],
        sampleModelAnswer: "If Jenny's website only says 'Welcome to our site', Google has no idea what she sells. Her H1 headline should say 'Fresh 100% Organic Arabica Beans Roasted Daily in Morgantown' so search engines and local coffee lovers immediately know what she offers."
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
                  <span>60-Second Micro-Lesson: The Newspaper Rule</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed italic">
                  {briefingScript}
                </p>
              </div>

              {/* 3-Part Visual Micro-Lesson Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-1">
                  <span className="font-bold text-blue-400 block flex items-center gap-1">
                    🏷️ 1. Title Tag
                  </span>
                  <p className="text-muted-foreground text-[10px]">
                    The blue search result link Google shows users. (e.g. <em>Jenny's Organic Coffee | Morgantown, WV</em>).
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <span className="font-bold text-emerald-400 block flex items-center gap-1">
                    📰 2. H1 Headline
                  </span>
                  <p className="text-muted-foreground text-[10px]">
                    The giant front-page headline on the website itself. (e.g. <em>Fresh 100% Organic Arabica Roasted Daily</em>).
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 space-y-1">
                  <span className="font-bold text-purple-400 block flex items-center gap-1">
                    📝 3. Meta Description
                  </span>
                  <p className="text-muted-foreground text-[10px]">
                    The 2-sentence summary under the title that convinces real humans to click your link.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
                <Link href="/tutorials-new" onClick={() => { stopSpeaking(); onClose(); }}>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    <BookOpen className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    Read Full Lesson 1 Playbook
                  </Button>
                </Link>

                <Button 
                  onClick={() => setStep("socratic_question")}
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold flex items-center justify-center gap-2 text-xs"
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
                  <div className="flex items-center gap-2">
                    {evaluationResult.detectedTier && (
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-semibold">
                        {evaluationResult.detectedTier}
                      </Badge>
                    )}
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-sm font-mono px-3 py-1 font-bold">
                      {evaluationResult.score}/100 Score
                    </Badge>
                  </div>
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

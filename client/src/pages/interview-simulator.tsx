import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  MicOff,
  Sparkles, 
  Brain, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  BookOpen, 
  Send,
  HelpCircle,
  Briefcase,
  Layers,
  FileText,
  Volume2,
  VolumeX,
  Video,
  Radio,
  UserCheck,
  Zap,
  Play,
  Square
} from "lucide-react";

interface InterviewQuestion {
  id: string;
  level: "junior" | "mid" | "senior";
  levelLabel: string;
  role: string;
  topic: string;
  question: string;
  context: string;
  targetTerms: string[];
}

const interviewers = [
  {
    id: "sarah",
    name: "Sarah Jenkins",
    title: "Senior Director of Performance Media",
    agency: "Apex Omnicom Media",
    avatarBg: "from-emerald-600 to-teal-900",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    initials: "SJ",
    style: "Structured & Strategic",
    specialty: "Search Ads, ROAS & Quality Score",
    gender: "female"
  },
  {
    id: "marcus",
    name: "Marcus Vance",
    title: "VP of Growth & Paid Acquisition",
    agency: "Horizon Growth Partners",
    avatarBg: "from-purple-600 to-indigo-900",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    initials: "MV",
    style: "Fast-Paced & ROI Driven",
    specialty: "Meta Reels, Lookalikes & Scaling",
    gender: "male"
  },
  {
    id: "elena",
    name: "Elena Rostova",
    title: "Head of Technical SEO & Search",
    agency: "Nexus Search Consultants",
    avatarBg: "from-blue-600 to-cyan-900",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    initials: "ER",
    style: "Technical & Diagnostic",
    specialty: "SERP Crawl, Intent & Schema",
    gender: "female"
  }
];

const structuredQuestions: InterviewQuestion[] = [
  // Level 1: Junior Screener (Foundations & Vocabulary)
  {
    id: "q-j1",
    level: "junior",
    levelLabel: "🟢 Level 1: Junior Screener",
    role: "PPC Associate",
    topic: "ROAS vs CPA & Negative Keywords",
    question: "Explain the difference between ROAS and CPA in plain English. Why is it dangerous to run a Broad Match campaign in Google Ads without a negative keyword list?",
    context: "Warmup question testing your basic agency vocabulary and understanding of ad spend leakage.",
    targetTerms: ["ROAS", "CPA", "Broad Match", "Negative Keywords", "Wasted Spend", "Search Intent"]
  },
  {
    id: "q-j2",
    level: "junior",
    levelLabel: "🟢 Level 1: Junior Screener",
    role: "SEO Associate",
    topic: "Title Tags & SERP CTR",
    question: "Why is the Title Tag one of the most important elements of an on-page SEO audit, and how does your title influence your organic click-through rate on Google?",
    context: "Testing fundamental on-page ranking factors and search snippet appeal.",
    targetTerms: ["Title Tag", "Primary Keyword", "CTR", "Character Length", "Search Snippet"]
  },

  // Level 2: Mid-Level Technical Round (Diagnostic & AI Ethics Scenarios)
  {
    id: "q-ai-ethics",
    level: "mid",
    levelLabel: "🟡 Level 2: Technical & AI Ethics Round",
    role: "AI-Augmented Growth Marketer",
    topic: "Ethical AI Leverage & Mandatory Fact-Checking",
    question: "Generative AI is transforming modern marketing. How do you leverage AI tools to 10x your campaign speed (ad copy, hooks, keyword clustering) while rigorously fact-checking client claims, preventing hallucinations, and ensuring ethical compliance?",
    context: "Testing your ability to co-pilot with AI as a multiplier while enforcing strict human editorial judgment, data validation, and brand safety.",
    targetTerms: ["AI Prompting", "Fact-Checking", "Editorial Verification", "Compliance", "Hallucinations", "Brand Safety", "Human-in-the-Loop"]
  },
  {
    id: "q-m1",
    level: "mid",
    levelLabel: "🟡 Level 2: Technical Diagnostic Round",
    role: "PPC Specialist",
    topic: "Quality Score & Auction Surcharges",
    question: "A client comes to you complaining that their Google Search CPC jumped by 60% in the last 30 days while conversions fell. Walk me through your step-by-step diagnostic process to find the root cause and fix it.",
    context: "Testing your ability to analyze search query reports, ad copy relevance, and expected CTR.",
    targetTerms: ["Search Query Report", "Quality Score", "Negative Keywords", "Expected CTR", "Match Types", "Target CPA"]
  },
  {
    id: "q-m2",
    level: "mid",
    levelLabel: "🟡 Level 2: Technical Diagnostic Round",
    role: "Paid Social Media Buyer",
    topic: "Ad Frequency & Creative Fatigue",
    question: "You are running a Meta Ads conversion campaign for a D2C e-commerce brand. Over the past 2 weeks, ad frequency rose to 4.8 and CPA doubled. What specific changes would you make to restructure the account and recover performance?",
    context: "Testing creative refreshing, audience lookalikes vs broad targeting, and campaign budget optimization (CBO).",
    targetTerms: ["Creative Fatigue", "Lookalike Audience", "Frequency", "Reels/Stories", "CPA", "ROAS", "Attribution"]
  },

  // Level 3: Senior Director Executive Defense (Omnichannel & Portfolio)
  {
    id: "q-s1",
    level: "senior",
    levelLabel: "🔴 Level 3: Senior Executive Defense",
    role: "Growth Marketing Director",
    topic: "Omnichannel Attribution & Budget Allocation",
    question: "If you are given a $30,000/month marketing budget for a growing startup, how do you decide the percentage split between Top-of-Funnel Brand awareness (Meta/YouTube) and Bottom-of-Funnel Capture (Google Search)? How do you measure blended ROAS?",
    context: "Testing executive strategic thinking, multi-touch attribution, and CAC-to-LTV payback windows.",
    targetTerms: ["Blended ROAS", "CAC", "Top-of-Funnel", "Bottom-of-Funnel", "Attribution Window", "Conversion Rate"]
  }
];

export default function InterviewSimulatorPage() {
  const [selectedInterviewer, setSelectedInterviewer] = useState(interviewers[0]);
  const [selectedLevel, setSelectedLevel] = useState<"all" | "junior" | "mid" | "senior" | "portfolio">("all");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const { data: caseStudies = [] } = useQuery<any[]>({
    queryKey: ["/api/user/portfolio"],
  });

  const portfolioQuestions: InterviewQuestion[] = caseStudies.map((cs, idx) => ({
    id: `cs-${cs.id || idx}`,
    level: "senior",
    levelLabel: "🔴 Level 3: Portfolio Defense",
    role: "Portfolio Case Study Defense",
    topic: `${cs.clientName} Defense`,
    question: `I see on your verified portfolio that you managed the ${cs.clientName} project (${cs.platform}). You achieved a Quality Score of ${cs.metrics?.qualityScore || 9}/10 and a ${cs.metrics?.roas || 4.6}x ROAS. Walk me through the exact root causes you diagnosed and the key tactics you used to turn this account around.`,
    context: `Testing how confidently you can speak about your verified ${cs.clientName} simulation results.`,
    targetTerms: ["Quality Score", "ROAS", "CPA", "Negative Keywords", "Match Types", "Landing Page", "Attribution"]
  }));

  const allAvailableQuestions = [...structuredQuestions, ...portfolioQuestions];
  
  const filteredQuestions = allAvailableQuestions.filter(q => {
    if (selectedLevel === "all") return true;
    if (selectedLevel === "portfolio") return q.role.includes("Portfolio");
    return q.level === selectedLevel;
  });

  const currentQ = filteredQuestions[currentIdx] || filteredQuestions[0] || allAvailableQuestions[0];

  // Call timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Text-To-Speech function
  const speakQuestion = (text: string) => {
    if (isMuted) return;
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech Synthesis Unavailable",
        description: "Your browser does not support Web Speech API audio.",
        variant: "destructive"
      });
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = selectedInterviewer.gender === "female" ? 1.05 : 0.95;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => 
        (selectedInterviewer.gender === "female" ? (v.name.includes("Samantha") || v.name.includes("Zira") || v.name.includes("Female")) : (v.name.includes("Daniel") || v.name.includes("David") || v.name.includes("Male")))
      ) || voices[0];
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop TTS
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech-To-Text Dictation
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Please use Google Chrome, Edge, or Safari for voice microphone input.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
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
          description: "Speak your answer naturally. It will transcribe in real-time.",
        });
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

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

  const evaluateMutation = useMutation({
    mutationFn: async (payload: { question: string; userAnswer: string; targetRole: string }) => {
      const res = await apiRequest("/api/ai/interview-evaluate", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      return res;
    },
    onSuccess: (data) => {
      setEvaluationResult(data);
      toast({
        title: "Director Evaluation Complete",
        description: `Your answer scored ${data.score}/100 with ${data.rating}`,
      });
      stopSpeaking();
    },
    onError: (err: any) => {
      toast({
        title: "Evaluation Failed",
        description: err.message || "Failed to evaluate response",
        variant: "destructive",
      });
    }
  });

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Empty Response",
        description: "Please type or dictate your answer before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    evaluateMutation.mutate({
      question: currentQ.question,
      userAnswer,
      targetRole: currentQ.role
    });
  };

  const handleNextQuestion = () => {
    stopSpeaking();
    setUserAnswer("");
    setEvaluationResult(null);
    const nextIdx = (currentIdx + 1) % filteredQuestions.length;
    setCurrentIdx(nextIdx);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-primary/15 via-card to-background border border-primary/30 shadow-lg space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Live AI Video Interview Studio
            </h1>
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs flex items-center gap-1">
              <Radio className="h-3 w-3 animate-pulse" />
              <span>Interactive Speech & Video</span>
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/80 px-3 py-1.5 rounded-full border border-border/50">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            <span>Live Session: <strong>{formatTimer(callDuration)}</strong></span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm max-w-3xl">
          Experience real-world marketing hiring interviews. Choose your AI Hiring Director, hear the question spoken aloud, and dictate or type your response to receive live scoring on your **agency vocabulary, strategic problem-solving, and verified portfolio casework**.
        </p>
      </div>

      {/* Choose Interviewer & Difficulty Filter Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Interviewer Avatars Selector */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="p-4 pb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Select Hiring Director</span>
              <UserCheck className="h-3.5 w-3.5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1 flex gap-2 overflow-x-auto">
            {interviewers.map((inv) => (
              <button
                key={inv.id}
                onClick={() => {
                  setSelectedInterviewer(inv);
                  stopSpeaking();
                }}
                className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2.5 shrink-0 ${
                  selectedInterviewer.id === inv.id 
                    ? "border-primary bg-primary/10 ring-1 ring-primary" 
                    : "border-border/60 bg-background/50 hover:bg-card"
                }`}
              >
                <img 
                  src={inv.avatarUrl} 
                  alt={inv.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-border shadow" 
                />
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-foreground">{inv.name}</div>
                  <div className="text-[10px] text-muted-foreground line-clamp-1">{inv.title}</div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Difficulty Level Selector */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="p-4 pb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Progressive Difficulty Level</span>
              <Zap className="h-3.5 w-3.5 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1 grid grid-cols-2 gap-2">
            <Button
              variant={selectedLevel === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedLevel("all");
                setCurrentIdx(0);
                stopSpeaking();
              }}
              className="text-xs h-8"
            >
              All Tiers ({allAvailableQuestions.length})
            </Button>
            <Button
              variant={selectedLevel === "junior" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedLevel("junior");
                setCurrentIdx(0);
                stopSpeaking();
              }}
              className="text-xs h-8 border-emerald-500/30 text-emerald-400"
            >
              🟢 Level 1: Junior Screener
            </Button>
            <Button
              variant={selectedLevel === "mid" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedLevel("mid");
                setCurrentIdx(0);
                stopSpeaking();
              }}
              className="text-xs h-8 border-amber-500/30 text-amber-400"
            >
              🟡 Level 2: Tech Diagnosis
            </Button>
            <Button
              variant={selectedLevel === "portfolio" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedLevel("portfolio");
                setCurrentIdx(0);
                stopSpeaking();
              }}
              className="text-xs h-8 border-purple-500/30 text-purple-400"
            >
              🔴 Level 3: Portfolio Defense
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Video Call Screen Card */}
      <Card className="border-border/60 bg-gradient-to-b from-card to-background shadow-xl overflow-hidden">
        {/* Video Call Window Header */}
        <div className="bg-card/90 px-4 py-2.5 border-b border-border/50 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-foreground">
              Google Meet Call with {selectedInterviewer.name} ({selectedInterviewer.agency})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(prev => !prev)}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 text-red-400 mr-1" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400 mr-1" />}
              <span>{isMuted ? "Unmute TTS" : "Mute TTS"}</span>
            </Button>

            <Badge variant="outline" className="text-[11px]">
              Question {currentIdx + 1} of {filteredQuestions.length}
            </Badge>
          </div>
        </div>

        {/* Video Screen Layout */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: AI Interviewer Video Feed Box */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-background border border-slate-800 text-center space-y-4 shadow-inner relative overflow-hidden">
            {/* Live Indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>LIVE VIDEO FEED</span>
            </div>

            {/* Human Avatar Video Frame with Animated Waveform */}
            <div className={`relative mt-3 w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-300 ${
              isSpeaking ? "border-emerald-400 ring-4 ring-emerald-500/30 scale-105" : "border-slate-700"
            }`}>
              <img 
                src={selectedInterviewer.avatarUrl} 
                alt={selectedInterviewer.name} 
                className="w-full h-full object-cover object-top"
              />
              
              {/* HD Camera Badge */}
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-[9px] text-emerald-400 font-mono px-1.5 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>1080p HD</span>
              </div>

              {/* Sound Wave Animation if Speaking */}
              {isSpeaking && (
                <div className="absolute bottom-1.5 inset-x-2 flex items-center justify-center gap-1 bg-black/80 backdrop-blur-md px-2 py-1 rounded-full border border-emerald-500/50 shadow-lg">
                  <span className="w-1 h-3 bg-emerald-400 animate-bounce"></span>
                  <span className="w-1 h-5 bg-emerald-400 animate-bounce delay-75"></span>
                  <span className="w-1 h-2 bg-emerald-400 animate-bounce delay-150"></span>
                  <span className="w-1 h-4 bg-emerald-400 animate-bounce delay-100"></span>
                  <span className="text-[10px] text-emerald-400 font-bold ml-1">Speaking</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="font-bold text-sm text-foreground">{selectedInterviewer.name}</div>
              <div className="text-xs text-primary font-medium">{selectedInterviewer.title}</div>
              <div className="text-[11px] text-muted-foreground">{selectedInterviewer.agency}</div>
            </div>

            <div className="pt-2 w-full flex flex-col gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => isSpeaking ? stopSpeaking() : speakQuestion(currentQ.question)}
                className="text-xs h-8 w-full flex items-center justify-center gap-1.5 bg-card/60"
              >
                {isSpeaking ? (
                  <>
                    <Square className="h-3.5 w-3.5 text-red-400 fill-current" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-emerald-400 fill-current" />
                    <span>🔊 Speak Question Aloud</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right: Question & Interactive Candidate Response Box */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  {currentQ.levelLabel}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentQ.topic}
                </Badge>
              </div>

              <div className="text-base font-semibold text-foreground leading-snug">
                "{currentQ.question}"
              </div>

              <div className="text-xs text-muted-foreground flex items-start gap-1.5 pt-1">
                <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{currentQ.context}</span>
              </div>
            </div>

            {/* Target Agency Terms helper */}
            <div className="p-3 rounded-lg bg-card/60 border border-border/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Recommended Agency Vocabulary to Use:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentQ.targetTerms.map((term, i) => (
                  <Badge key={i} variant="secondary" className="text-[11px]">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Answer Text Area & Dictation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Your Response to {selectedInterviewer.name}:</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSpeechRecognition}
                  className={`text-xs h-7 px-2.5 flex items-center gap-1.5 ${
                    isListening ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse" : "bg-card hover:bg-secondary"
                  }`}
                >
                  {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3 text-primary" />}
                  <span>{isListening ? "Stop Recording" : "🎤 Dictate with Mic"}</span>
                </Button>
              </div>

              <Textarea
                rows={5}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Structure your answer clearly: 1) What root-cause data you audit first, 2) The exact adjustments you execute, 3) How you measure recovery in CPA/ROAS..."
                className="bg-background text-sm font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextQuestion}
                className="text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Next Question</span>
              </Button>

              <Button
                onClick={handleSubmitAnswer}
                disabled={evaluateMutation.isPending || !userAnswer.trim()}
                className="bg-primary text-primary-foreground font-semibold text-xs h-9 px-5 flex items-center gap-2"
              >
                {evaluateMutation.isPending ? (
                  <span>Director is Evaluating...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Answer to {selectedInterviewer.name}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Evaluation Debrief Card */}
      {evaluationResult && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background shadow-xl space-y-4">
          <CardHeader className="border-b border-primary/20 pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg text-foreground">Director Evaluation: {selectedInterviewer.name}</CardTitle>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-semibold">
                {evaluationResult.rating}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Score Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-card/80 border border-border/50 text-center">
                <div className="text-xs text-muted-foreground">Overall Readiness Score</div>
                <div className="text-2xl font-bold text-primary mt-1">{evaluationResult.score}/100</div>
              </div>

              <div className="p-3 rounded-lg bg-card/80 border border-border/50 text-center">
                <div className="text-xs text-muted-foreground">Agency Vocabulary Score</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{evaluationResult.vocabularyScore}/100</div>
              </div>

              <div className="p-3 rounded-lg bg-card/80 border border-border/50 text-center">
                <div className="text-xs text-muted-foreground">Strategic Rationale Score</div>
                <div className="text-2xl font-bold text-foreground mt-1">{evaluationResult.strategicScore}/100</div>
              </div>
            </div>

            {/* Terms Used vs Missed */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-foreground">Agency Vocabulary Detected:</div>
              <div className="flex flex-wrap gap-1.5">
                {evaluationResult.usedTerminology && evaluationResult.usedTerminology.length > 0 ? (
                  evaluationResult.usedTerminology.map((term: string, i: number) => (
                    <Badge key={i} className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                      {term}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No specific agency terms detected.</span>
                )}
              </div>
            </div>

            {/* AI Tactical Feedback */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-foreground">Director's Tactical Feedback:</div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {evaluationResult.feedback?.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exemplary Model Answer */}
            <div className="p-4 rounded-lg bg-card/90 border border-primary/20 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <BookOpen className="h-4 w-4" />
                <span>How a Senior Agency Director Would Answer:</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "{evaluationResult.sampleModelAnswer}"
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

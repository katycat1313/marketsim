import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cleanTextForSpeech } from "@/lib/utils";
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
  Square,
  Target,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Clock,
  Flame,
  MessageSquare,
  Check
} from "lucide-react";

interface InterviewQuestion {
  id: string;
  track: "miller" | "jenny" | "apex" | "social" | "analytics" | "general" | "senior";
  level: "junior" | "mid" | "senior";
  levelLabel: string;
  role: string;
  clientName: string;
  topic: string;
  question: string;
  context: string;
  targetTerms: string[];
  keyMetricsToDrop: string[];
  misconceptionToAvoid: string;
  executiveKeyPoints: string[];
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
  // Track 1: Dr. Miller Dental (Paid Search Google Ads)
  {
    id: "q-miller",
    track: "miller",
    level: "mid",
    levelLabel: "🦷 Client Track: Dr. Miller Dental",
    role: "PPC Specialist",
    clientName: "Dr. Miller Dental",
    topic: "Quality Score 10/10 & 35-Keyword Negative Shield",
    question: "On the Dr. Miller Dental campaign, you inherited an account with a 4/10 Quality Score that was bleeding budget. Walk me through the second-price auction mechanics and how your negative keyword shield and RSA matrix recovered performance.",
    context: "Defend your Week 3 paid search casework: Quality Score math, negative shields, and second-price auction cost reductions.",
    targetTerms: ["Quality Score 9/10", "35-Keyword Negative Shield", "STAG Architecture", "Second-Price Auction", "Expected CTR", "Emergency Dental", "ROAS 4.2x"],
    keyMetricsToDrop: ["Quality Score 9/10", "38% CPC discount via auction formula", "$24.50 Target CPA ceiling", "4.2x ROAS"],
    misconceptionToAvoid: "Don't say 'I just picked some keywords.' Say: 'I isolated high-intent emergency dental search terms with STAG ad groups and deployed a 35-term negative keyword shield.'",
    executiveKeyPoints: [
      "Explain the baseline crisis: budget bleeding on 'free dental' and high bounce rates.",
      "Detail your tactical action: 35 negative keywords, Single Theme Ad Groups, 15-headline RSA matrix.",
      "Conclude with the math: second-price auction formula cut actual CPC by 38% and drove a 4.2x ROAS."
    ]
  },

  // Track 2: Jenny's Artisan Java (Local & Technical SEO)
  {
    id: "q-jenny",
    track: "jenny",
    level: "junior",
    levelLabel: "☕ Client Track: Jenny's Artisan Java",
    role: "SEO Associate",
    clientName: "Jenny's Artisan Java",
    topic: "Local SEO, Google Business Profile & JSON-LD Schema",
    question: "Walk me through the local search turnaround you executed for Jenny's Artisan Java. How did you diagnose their ranking drop and what technical fixes did you prioritize to get them into the Google Map Pack?",
    context: "Defend your Weeks 1 & 2 organic casework: NAP consistency, JSON-LD LocalBusiness schema, and strict pixel-constrained title tags.",
    targetTerms: ["JSON-LD Schema", "LocalBusiness", "Google Business Profile", "NAP Consistency", "Map Pack 3-Pack", "H1 Tag", "60-Char Title Constraints"],
    keyMetricsToDrop: ["Top-3 Google Map Pack ranking", "44% lift in phone calls and directions", "Strict 60-character title constraint", "100% NAP consistency score"],
    misconceptionToAvoid: "Don't say 'I wrote blog posts.' Say: 'I resolved NAP citation conflicts, structured an injected JSON-LD LocalBusiness schema payload, and optimized on-page H1 hierarchy.'",
    executiveKeyPoints: [
      "Identify the audit findings: citation discrepancy and missing structured data.",
      "Explain the technical intervention: schema injection, Google Business Profile primary category update.",
      "Highlight the business outcome: 44% lift in organic customer directions and calls."
    ]
  },

  // Track 3: Apex Athletics (Conversion Rate Optimization)
  {
    id: "q-apex",
    track: "apex",
    level: "mid",
    levelLabel: "👟 Client Track: Apex Athletics CRO",
    role: "CRO Specialist",
    clientName: "Apex Athletics",
    topic: "The LIFT Model & A/B Statistical Significance (p < 0.05)",
    question: "Describe the landing page A/B test you designed for Apex Athletics. What was your hypothesis using the LIFT model, and how did you verify that your conversion lift was statistically significant at p < 0.05?",
    context: "Defend your Week 4 CRO casework: value proposition, 3-layer trust stack, mobile thumb zone, and statistical confidence.",
    targetTerms: ["LIFT Model", "Statistical Significance (p < 0.05)", "Hypothesis", "Value Proposition", "3-Layer Trust Stack", "Mobile Thumb Zone", "Sample Size"],
    keyMetricsToDrop: ["+24.6% conversion lift", "97% statistical confidence (p < 0.05)", "4,200 unique visitors sample size", "Mobile thumb zone placement"],
    misconceptionToAvoid: "Don't say 'I changed the button color.' Say: 'I formulated a hypothesis using the LIFT model to reduce cognitive friction and engineered an above-the-fold 3-layer trust stack.'",
    executiveKeyPoints: [
      "State the hypothesis: cognitive friction above the fold was suppressing checkout intent.",
      "Describe the challenger design: single clear value proposition, 3-layer trust badges, mobile thumb-zone CTA.",
      "Prove statistical rigor: two-tailed t-test with 4,200 visitors yielding p < 0.05."
    ]
  },

  // Track 4: Paid Social Media (Meta & TikTok Scaling)
  {
    id: "q-social",
    track: "social",
    level: "mid",
    levelLabel: "📱 Client Track: Paid Social Scaling",
    role: "Paid Social Media Buyer",
    clientName: "Apex Athletics D2C",
    topic: "Creative Fatigue (Freq > 3.5), 4-Part UGC & Blended MER",
    question: "When scaling paid social for an e-commerce brand, ad frequency rose to 4.2 and CPA spiked by 50%. How do you diagnose creative fatigue, structure a 4-part UGC creative sprint, and verify performance using blended MER rather than in-app ROAS?",
    context: "Defend your Week 5 social casework: 3-second hook rates, UGC scripting, Meta CAPI server-side tracking, and blended MER.",
    targetTerms: ["3-Second Hook Rate", "4-Part UGC Script", "Creative Fatigue (Freq > 3.5)", "Meta CAPI", "Blended MER", "Attribution Windows"],
    keyMetricsToDrop: ["Creative fatigue threshold: Frequency > 3.5", "3-second hook rate > 35%", "Blended MER of 3.8x", "CAPI event match quality > 8.5/10"],
    misconceptionToAvoid: "Don't say 'I changed audiences.' Say: 'In modern paid social, creative is the targeting. I launched a creative refresh with three distinct 3-second visual hooks.'",
    executiveKeyPoints: [
      "Diagnose ad frequency and creative fatigue as root causes of rising CPA.",
      "Explain the creative iteration framework: 4-part UGC script (Hook, Agitation, Solution, CTA).",
      "Defend attribution: why platform-reported ROAS is distorted and blended MER proves true incremental profit."
    ]
  },

  // Track 5: Growth Analytics & Automation (GA4 & Webhooks)
  {
    id: "q-analytics",
    track: "analytics",
    level: "senior",
    levelLabel: "📊 Client Track: Growth Analytics & Automation",
    role: "Marketing Operations Lead",
    clientName: "Enterprise Agency",
    topic: "GA4 Event Schema, GTM DataLayers & 60s Speed-to-Lead",
    question: "How did you architect an event-driven tracking schema in GA4 using GTM DataLayers, and how did your 60-second speed-to-lead automation pipeline improve demo conversion rates?",
    context: "Defend your Week 6 analytics casework: custom event funnels, DataLayer pushes, and automated webhook pipelines.",
    targetTerms: ["GA4 Event Schema", "GTM DataLayer", "Speed-to-Lead (<60s)", "Webhook Automation", "Micro-Conversions", "Attribution Modeling"],
    keyMetricsToDrop: ["Lead response latency: under 60 seconds", "+34% demo completion lift", "Event-driven GA4 schema", "Zero-lead-loss webhook pipeline"],
    misconceptionToAvoid: "Don't say 'I set up Google Analytics.' Say: 'I architected an event-driven data model with GTM DataLayers and connected an automated CRM webhook pipeline to achieve sub-60-second speed-to-lead.'",
    executiveKeyPoints: [
      "Detail GA4 event-driven measurement: tracking micro-conversions at every funnel stage.",
      "Explain the speed-to-lead pipeline: instant webhook triggering CRM sales notifications in under 60s.",
      "Show commercial impact: 34% lift in qualified sales conversions."
    ]
  },

  // Track 6: AI Augmented Marketing & Ethics
  {
    id: "q-ai-ethics",
    track: "general",
    level: "mid",
    levelLabel: "🧠 Track: AI Ethics & Speed Multiplier",
    role: "AI-Augmented Growth Marketer",
    clientName: "Agency Agency Suite",
    topic: "Ethical AI Co-Piloting & Editorial Fact-Checking",
    question: "Generative AI is transforming performance marketing. How do you leverage AI tools to 10x your campaign speed (ad copy, hooks, keyword clustering) while rigorously fact-checking client claims, preventing hallucinations, and ensuring ethical compliance?",
    context: "Testing your ability to co-pilot with AI as a multiplier while enforcing strict human editorial judgment, data validation, and brand safety.",
    targetTerms: ["AI Prompting", "Fact-Checking", "Editorial Verification", "Compliance", "Hallucinations", "Brand Safety", "Human-in-the-Loop"],
    keyMetricsToDrop: ["10x production velocity", "100% human-in-the-loop review", "Zero compliance violations", "Brand safety guardrails"],
    misconceptionToAvoid: "Don't say 'I let AI write everything.' Say: 'AI serves as a high-velocity drafting engine, but all ad copy, metric claims, and compliance tokens undergo mandatory human editorial verification.'",
    executiveKeyPoints: [
      "Acknowledge AI's speed advantage for ideation and token generation.",
      "Establish strict human-in-the-loop validation: verifying claims, pricing, and compliance.",
      "Protect client brand safety against hallucinations and ad account bans."
    ]
  },

  // Track 7: Senior Director Executive Defense
  {
    id: "q-s1",
    track: "senior",
    level: "senior",
    levelLabel: "🔴 Track: Senior Director Executive Defense",
    role: "Growth Marketing Director",
    clientName: "Multi-Brand Portfolio",
    topic: "Omnichannel Attribution & Budget Allocation",
    question: "If you are given a $30,000/month marketing budget for a growing startup, how do you decide the percentage split between Top-of-Funnel Brand awareness (Meta/YouTube) and Bottom-of-Funnel Capture (Google Search)? How do you measure blended ROAS?",
    context: "Testing executive strategic thinking, multi-touch attribution, and CAC-to-LTV payback windows.",
    targetTerms: ["Blended ROAS", "CAC", "Top-of-Funnel", "Bottom-of-Funnel", "Attribution Window", "Conversion Rate"],
    keyMetricsToDrop: ["60/40 or 70/30 Brand vs Capture split", "Blended MER of 3.5x+", "CAC-to-LTV ratio 3:1+", "60-day payback window"],
    misconceptionToAvoid: "Don't say 'I'll put it all in Google Ads because it converts fastest.' Explain that without top-of-funnel demand generation, search capture quickly hits diminishing returns.",
    executiveKeyPoints: [
      "Define the budget framework: balance demand generation (Meta/YouTube) with demand capture (Google Search).",
      "Defend the attribution methodology: why last-click attribution under-credits top-of-funnel ads.",
      "Tie marketing spend directly to unit economics: CAC-to-LTV ratios and cash payback velocity."
    ]
  }
];

export default function InterviewSimulatorPage() {
  const [selectedInterviewer, setSelectedInterviewer] = useState(interviewers[0]);
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showBattleCard, setShowBattleCard] = useState(true);
  const [interviewMode, setInterviewMode] = useState<"video" | "hirevue">("video");
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const { data: caseStudies = [] } = useQuery<any[]>({
    queryKey: ["/api/user/portfolio"],
  });

  const portfolioQuestions: InterviewQuestion[] = caseStudies.map((cs, idx) => ({
    id: `cs-${cs.id || idx}`,
    track: "senior",
    level: "senior",
    levelLabel: "🔴 Verified Portfolio Defense",
    role: "Portfolio Case Study Defense",
    clientName: cs.clientName || "Client Project",
    topic: `${cs.clientName} Capstone Defense`,
    question: `I see on your verified portfolio that you managed the ${cs.clientName} project (${cs.platform}). You achieved a Quality Score of ${cs.metrics?.qualityScore || 9}/10 and a ${cs.metrics?.roas || 4.6}x ROAS. Walk me through the exact root causes you diagnosed and the key tactics you used to turn this account around.`,
    context: `Testing how confidently you can defend your verified ${cs.clientName} simulation results.`,
    targetTerms: ["Quality Score", "ROAS", "CPA", "Negative Keywords", "Match Types", "Landing Page", "Attribution"],
    keyMetricsToDrop: [`Quality Score ${cs.metrics?.qualityScore || 9}/10`, `${cs.metrics?.roas || 4.6}x ROAS`, "CPA Reduction"],
    misconceptionToAvoid: "Avoid vague generalizations. Quote the exact numbers and tactical interventions from your case study.",
    executiveKeyPoints: [
      `Review starting challenge for ${cs.clientName}.`,
      "Explain the tactical adjustments you executed.",
      `Highlight final outcome: ${cs.metrics?.roas || 4.6}x ROAS.`
    ]
  }));

  const allAvailableQuestions = [...structuredQuestions, ...portfolioQuestions];
  
  const filteredQuestions = allAvailableQuestions.filter(q => {
    if (selectedTrack === "all") return true;
    return q.track === selectedTrack;
  });

  const currentQ = filteredQuestions[currentIdx] || filteredQuestions[0] || allAvailableQuestions[0];

  // Call timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-Time STAR Detector (Checks answer as user types/speaks)
  const answerLower = userAnswer.toLowerCase();
  const situationDetected = ['baseline', 'inherited', 'suffering', 'initial', 'problem', 'challenge', 'drop', 'churn', 'crisis', 'spending', 'burning', 'bleeding', 'jenny', 'miller', 'apex', 'dr. miller'].some(t => answerLower.includes(t));
  const taskDetected = ['objective', 'goal', 'target', 'ceiling', 'kpi', 'aim', 'benchmark', 'cpa of', 'roas of', 'quality score of', 'recover', 'turn around'].some(t => answerLower.includes(t));
  const actionDetected = ['deployed', 'implemented', 'engineered', 'structured', 'restructured', 'audited', 'isolated', 'pinned', 'optimized', 'tested', 'built', 'created', 'configured', 'injected', 'negative', 'stag', 'schema', 'lift', 'rsa'].some(t => answerLower.includes(t));
  const resultDetected = ['lift', 'lifted', 'cut', 'slashed', 'reduced', 'dropped', 'achieved', 'drove', 'increased', 'improved', 'saved', '%', 'x roas', 'roas', 'cpc discount', 'quality score to', 'outperformed'].some(t => answerLower.includes(t));

  // Native Browser Text-To-Speech (0ms Latency)
  const speakText = (text: string) => {
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
    const clean = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(clean);
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

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech-To-Text Dictation (Zero-lag transcription)
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
          description: "Speak naturally. Your answer is transcribing live.",
        });
      };

      // Preserve any text existing before mic was clicked
      const initialText = userAnswer ? userAnswer.trim() + " " : "";

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript + " ";
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const fullText = (initialText + finalTranscript + interimTranscript).trim();
        setUserAnswer(fullText);
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

  // Ultra-Fast Evaluation Mutation (< 50ms response)
  const evaluateMutation = useMutation({
    mutationFn: async (payload: { question: string; userAnswer: string; targetRole: string; clientTrack: string; questionId: string }) => {
      const res = await apiRequest("POST", "/api/ai/interview-evaluate", payload);
      return res.json();
    },
    onSuccess: (data) => {
      setEvaluationResult(data);
      toast({
        title: `Evaluation Ready in ${data.speedMs || 15}ms ⚡`,
        description: `Readiness Score: ${data.score}/100 • ${data.rating}`,
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
      targetRole: currentQ.role,
      clientTrack: currentQ.track,
      questionId: currentQ.id
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
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/15 via-card to-background border border-primary/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-inner">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                  Krechet AI Interview Prep Studio
                </h1>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[11px] flex items-center gap-1 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Zero-Lag Engine (&lt;50ms)</span>
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs md:text-sm">
                Practice defending your real coursework (Jenny's Java, Dr. Miller Dental, Apex CRO). Learn what words to use, what traps to avoid, and how to pitch like a $120k/yr Agency Director.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <div className="flex items-center bg-card/90 p-1 rounded-lg border border-border/60 text-xs">
              <button
                onClick={() => setInterviewMode("video")}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  interviewMode === "video" 
                    ? "bg-primary text-primary-foreground shadow" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🎙️ Agency Director
              </button>
              <button
                onClick={() => setInterviewMode("hirevue")}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  interviewMode === "hirevue" 
                    ? "bg-purple-600 text-white shadow" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🤖 HireVue AI Screener
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/80 px-3 py-1.5 rounded-full border border-border/50">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Session: <strong className="font-mono text-foreground">{formatTimer(callDuration)}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Casework Tracks Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-semibold text-muted-foreground shrink-0 uppercase tracking-wider text-[11px] mr-1">
          Casework Track:
        </span>
        <Button
          variant={selectedTrack === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedTrack("all"); setCurrentIdx(0); stopSpeaking(); }}
          className="text-xs h-7 shrink-0"
        >
          All Tracks ({allAvailableQuestions.length})
        </Button>
        <Button
          variant={selectedTrack === "miller" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedTrack("miller"); setCurrentIdx(0); stopSpeaking(); }}
          className="text-xs h-7 shrink-0 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
        >
          🦷 Dr. Miller Dental (Google Ads)
        </Button>
        <Button
          variant={selectedTrack === "jenny" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedTrack("jenny"); setCurrentIdx(0); stopSpeaking(); }}
          className="text-xs h-7 shrink-0 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
        >
          ☕ Jenny's Java (Local SEO)
        </Button>
        <Button
          variant={selectedTrack === "apex" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedTrack("apex"); setCurrentIdx(0); stopSpeaking(); }}
          className="text-xs h-7 shrink-0 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
        >
          👟 Apex Athletics (CRO LIFT)
        </Button>
        <Button
          variant={selectedTrack === "social" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedTrack("social"); setCurrentIdx(0); stopSpeaking(); }}
          className="text-xs h-7 shrink-0 border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
        >
          📱 Paid Social & UGC (Meta/TikTok)
        </Button>
        <Button
          variant={selectedTrack === "analytics" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedTrack("analytics"); setCurrentIdx(0); stopSpeaking(); }}
          className="text-xs h-7 shrink-0 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
        >
          📊 GA4 & Speed-to-Lead
        </Button>
        <Button
          variant={selectedTrack === "senior" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedTrack("senior"); setCurrentIdx(0); stopSpeaking(); }}
          className="text-xs h-7 shrink-0 border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          💼 Senior Director Defense
        </Button>
      </div>

      {/* Main Video Call Screen Card */}
      <Card className="border-border/60 bg-gradient-to-b from-card to-background shadow-2xl overflow-hidden">
        {/* Top Call Bar */}
        <div className="bg-card/90 px-4 py-2.5 border-b border-border/50 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-foreground">
              {interviewMode === "video" 
                ? `Executive Interview with ${selectedInterviewer.name} (${selectedInterviewer.agency})`
                : "Automated Enterprise AI Candidate Screener (HireVue Assessment)"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(prev => !prev)}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 text-red-400 mr-1" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400 mr-1" />}
              <span>{isMuted ? "Unmute Audio" : "Mute Audio"}</span>
            </Button>

            <Badge variant="outline" className="text-[11px] font-mono">
              Drill {currentIdx + 1} of {filteredQuestions.length}
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
              <span>LIVE INTERVIEW FEED</span>
            </div>

            {/* Video Frame */}
            <div className={`relative mt-3 w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-300 ${
              isSpeaking ? "border-emerald-400 ring-4 ring-emerald-500/30 scale-105" : "border-slate-700"
            }`}>
              <img 
                src={selectedInterviewer.avatarUrl} 
                alt={selectedInterviewer.name} 
                className="w-full h-full object-cover object-top"
              />
              
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-[9px] text-emerald-400 font-mono px-1.5 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>1080p HD</span>
              </div>

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

            {/* Change Director Buttons */}
            <div className="pt-1 flex gap-1.5 justify-center">
              {interviewers.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => { setSelectedInterviewer(inv); stopSpeaking(); }}
                  className={`w-7 h-7 rounded-full overflow-hidden border transition ${
                    selectedInterviewer.id === inv.id ? "border-primary ring-2 ring-primary" : "border-border/60 opacity-60 hover:opacity-100"
                  }`}
                  title={`${inv.name} - ${inv.specialty}`}
                >
                  <img src={inv.avatarUrl} alt={inv.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="pt-2 w-full flex flex-col gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => isSpeaking ? stopSpeaking() : speakText(currentQ.question)}
                className="text-xs h-8 w-full flex items-center justify-center gap-1.5 bg-card/60"
              >
                {isSpeaking ? (
                  <>
                    <Square className="h-3.5 w-3.5 text-red-400 fill-current" />
                    <span>Stop Spoken Audio</span>
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

          {/* Right: Question Box, Battle Card & Response Engine */}
          <div className="lg:col-span-2 space-y-4">
            {/* The Question Box */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  {currentQ.levelLabel}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentQ.topic}
                </Badge>
              </div>

              <div className="text-base md:text-lg font-semibold text-foreground leading-snug">
                "{currentQ.question}"
              </div>

              <div className="text-xs text-muted-foreground flex items-start gap-1.5 pt-1">
                <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{currentQ.context}</span>
              </div>
            </div>

            {/* The Executive Agency Battle Card (Cheat Sheet) */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Flame className="h-4 w-4" />
                  <span>Recommended Response Strategy & Key Metrics</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBattleCard(prev => !prev)}
                  className="h-6 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                >
                  {showBattleCard ? <ChevronUp className="h-3.5 w-3.5 mr-1" /> : <ChevronDown className="h-3.5 w-3.5 mr-1" />}
                  <span>{showBattleCard ? "Hide Strategy Guide" : "Show Strategy Guide"}</span>
                </Button>
              </div>

              {showBattleCard && (
                <div className="space-y-3 pt-1 text-xs text-muted-foreground border-t border-amber-500/20">
                  {/* STAR Method Blueprint */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    <div className={`p-2 rounded border transition ${situationDetected ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold" : "border-border/50 bg-background/50"}`}>
                      <div className="text-primary font-bold">1. Situation (S)</div>
                      <div className="text-[10px] font-normal mt-0.5">Starting client baseline or crisis</div>
                      {situationDetected && <span className="text-[9px] text-emerald-400 font-bold block mt-1">✓ Detected in Answer</span>}
                    </div>
                    <div className={`p-2 rounded border transition ${taskDetected ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold" : "border-border/50 bg-background/50"}`}>
                      <div className="text-primary font-bold">2. Task (T)</div>
                      <div className="text-[10px] font-normal mt-0.5">Target metric or CPA ceiling</div>
                      {taskDetected && <span className="text-[9px] text-emerald-400 font-bold block mt-1">✓ Detected in Answer</span>}
                    </div>
                    <div className={`p-2 rounded border transition ${actionDetected ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold" : "border-border/50 bg-background/50"}`}>
                      <div className="text-primary font-bold">3. Action (A)</div>
                      <div className="text-[10px] font-normal mt-0.5">Exact agency tools deployed</div>
                      {actionDetected && <span className="text-[9px] text-emerald-400 font-bold block mt-1">✓ Detected in Answer</span>}
                    </div>
                    <div className={`p-2 rounded border transition ${resultDetected ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold" : "border-border/50 bg-background/50"}`}>
                      <div className="text-primary font-bold">4. Result (R)</div>
                      <div className="text-[10px] font-normal mt-0.5">Quantified ROI & % discount</div>
                      {resultDetected && <span className="text-[9px] text-emerald-400 font-bold block mt-1">✓ Detected in Answer</span>}
                    </div>
                  </div>

                  {/* Key Metrics to Drop */}
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground text-[11px]">Key Metrics to Drop in Your Answer:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentQ.keyMetricsToDrop?.map((metric, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-300">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Rookie Trap to Avoid */}
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-[11px] text-red-300 flex items-start gap-2">
                    <ShieldAlert className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-red-400">Common Misconception to Avoid:</strong> {currentQ.misconceptionToAvoid}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Answer Text Area & Dictation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  <span>Your Verbal or Written Response:</span>
                </label>
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
                placeholder="Structure your answer using the STAR method: 1) What baseline crisis you inherited, 2) The exact target metric, 3) The tactical tools/negatives you deployed, 4) The quantified ROI outcome..."
                className="bg-background text-sm font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-1">
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
                className="bg-primary text-primary-foreground font-semibold text-xs h-9 px-5 flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform"
              >
                {evaluateMutation.isPending ? (
                  <span>Evaluating in &lt;50ms...</span>
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

      {/* AI Evaluation Debrief Card with The Executive Translator */}
      {evaluationResult && (
        <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-card to-background shadow-2xl space-y-6">
          <CardHeader className="border-b border-primary/20 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-lg text-foreground">Director Evaluation: {selectedInterviewer.name}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Instant sub-50ms agency diagnostic and executive script translation.
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-semibold px-3 py-1">
                  {evaluationResult.rating}
                </Badge>
                <Badge variant="outline" className="text-xs font-mono text-emerald-400">
                  ⚡ {evaluationResult.speedMs || 15}ms
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-1">
            {/* Score Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-card/80 border border-border/50 text-center">
                <div className="text-[11px] text-muted-foreground uppercase font-semibold">Readiness Score</div>
                <div className="text-3xl font-extrabold text-primary mt-1">{evaluationResult.score}/100</div>
              </div>

              <div className="p-3 rounded-xl bg-card/80 border border-border/50 text-center">
                <div className="text-[11px] text-muted-foreground uppercase font-semibold">STAR Methodology</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{evaluationResult.starScore}/100</div>
              </div>

              <div className="p-3 rounded-xl bg-card/80 border border-border/50 text-center">
                <div className="text-[11px] text-muted-foreground uppercase font-semibold">Agency Vocabulary</div>
                <div className="text-3xl font-extrabold text-blue-400 mt-1">{evaluationResult.vocabularyScore}/100</div>
              </div>

              <div className="p-3 rounded-xl bg-card/80 border border-border/50 text-center">
                <div className="text-[11px] text-muted-foreground uppercase font-semibold">Quantified Proof</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">{evaluationResult.metricScore}/100</div>
              </div>
            </div>

            {/* Director's Secret Internal Thought */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Brain className="h-4 w-4 text-primary" />
                <span>The Hiring Director's Unfiltered Thought:</span>
              </div>
              <p className="text-muted-foreground italic">
                "{evaluationResult.directorImpression}"
              </p>
            </div>

            {/* THE EXECUTIVE TRANSLATOR: Word-for-Word Model Script */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-card to-primary/10 border-2 border-amber-500/40 shadow-lg space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <span className="font-bold text-sm text-foreground">
                    The Executive Translator: How a $120k/yr Agency Director Says It
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakText(evaluationResult.executiveTranslation)}
                  className="h-7 px-3 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/15 flex items-center gap-1.5"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Listen to Director Read Pitch</span>
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-background/80 border border-border/60 text-sm font-sans text-foreground leading-relaxed">
                {evaluationResult.executiveTranslation}
              </div>

              <div className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                <span>Notice how this pitch connects the client crisis, specific agency tools, and exact second-price auction math. Read it aloud to build muscle memory!</span>
              </div>
            </div>

            {/* Follow-Up Curveball Drill */}
            {evaluationResult.curveballFollowUp && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    <Zap className="h-4 w-4" />
                    <span>Director's Rapid-Fire Follow-Up Curveball:</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUserAnswer("");
                      speakText(evaluationResult.curveballFollowUp);
                    }}
                    className="h-6 px-2 text-[10px] text-red-400 hover:bg-red-500/20"
                  >
                    Drill This Curveball
                  </Button>
                </div>
                <p className="text-xs text-foreground font-medium italic">
                  "{evaluationResult.curveballFollowUp}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

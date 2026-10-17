import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useDeepgramVoice } from "@/hooks/useDeepgramVoice";
import { getActiveInstructor, type InstructorConfig } from "@/lib/instructorConfig";
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Sparkles, 
  Flame, 
  Smile, 
  ShieldAlert, 
  Award, 
  Lightbulb,
  Maximize2,
  Minimize2,
  ChevronRight,
  Radio,
  Building2,
  RotateCcw
} from "lucide-react";

interface CopilotMessage {
  id: string;
  sender: "instructor" | "student";
  text: string;
  timestamp: string;
}

interface FlightInstructorCopilotProps {
  track?: "seo" | "ads" | "general";
  pageTitle?: string;
  sectionContext?: string;
  currentDraft?: {
    title?: string;
    metaDescription?: string;
    h1?: string;
    bodyContent?: string;
    headlines?: string[];
    descriptions?: string[];
    keywords?: string[];
    [key: string]: any;
  };
}

export function FlightInstructorCopilot({
  track = "general",
  pageTitle = "Simulation Workbench",
  sectionContext,
  currentDraft
}: FlightInstructorCopilotProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const instructor = getActiveInstructor(track);
  const instructorVoice = useDeepgramVoice({
    defaultVoice: instructor.voice
  });

  // Initial greeting when opened
  useEffect(() => {
    if (messages.length === 0) {
      const biz = instructor.config.hasCustomBusiness && instructor.config.businessName 
        ? ` (keeping your company ${instructor.config.businessName} in mind)`
        : "";

      let intro = `Growth Director ${instructor.name} here. I'm reviewing your live campaign work on ${pageTitle}${biz}.`;

      if (instructor.teachingStyle === "drill_sergeant") {
        intro += " Don't expect me to write your copy for you. If a tag is weak or leaking intent, I will call it out. What section are we fixing first?";
      } else if (instructor.teachingStyle === "witty") {
        intro += " Remember: Google has the attention span of a goldfish. Keep it punchy! What do you want me to look over?";
      } else if (instructor.teachingStyle === "executive") {
        intro += " Keep every tag tied to commercial intent and conversion economics. What's your strategic focus right now?";
      } else {
        intro += " I'm here to guide you step-by-step through search principles. What section are you working on?";
      }

      setMessages([
        {
          id: "copilot-intro",
          sender: "instructor",
          text: intro,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, track]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Speech Recognition (Nova-2 / Web Speech)
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Microphone Not Supported",
        description: "Your browser does not support voice input. Type your question below.",
        variant: "destructive"
      });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({ title: "Comms Active 🎙️", description: `Speak to ${instructor.name}...` });
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    if (!textToSend) setInputValue("");

    const newStudentMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: "student",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, newStudentMsg];
    setMessages(updated);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `You are ${instructor.name}, a master Growth & Marketing Director at Krechet Academy.
Your teaching persona is: '${instructor.teachingStyle}'.
The user is currently inside the simulation workbench: '${pageTitle}'.
The current draft elements they have entered on their screen are:
${JSON.stringify(currentDraft || {}, null, 2)}

User's Small Business Digital Twin context (if active):
${instructor.config.hasCustomBusiness ? JSON.stringify({
  businessName: instructor.config.businessName,
  industry: instructor.config.industry,
  location: instructor.config.location,
  primaryOffer: instructor.config.primaryOffer,
  targetAudience: instructor.config.targetAudience
}) : "Standard benchmark simulation active (Jenny's Coffee / Dr. Miller Dental)"}

Conversation History:
${updated.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join("\n")}

STRICT PEDAGOGICAL POLICY:
1. NEVER write the finished copy or give the exact answer away. You are a mentor, not a copy-paste generator.
2. If they ask "is my title good?", inspect the draft title and give an honest, Socratic critique (e.g. character count, search intent, lack of CTA or modifiers).
3. Keep responses punchy and actionable (2-3 sentences max).
4. Match your selected persona ('${instructor.teachingStyle}'):
   - drill_sergeant: Tough love, calls out weak points directly, pushes for excellence.
   - supportive: Warm, patient, breaks down fear with gentle analogies.
   - executive: C-Suite focus, reminds them of customer acquisition economics.
   - witty: Sarcastic, funny, drops memorable analogies.`,
          userContext: {
            instructor: instructor.name,
            style: instructor.teachingStyle,
            track,
            pageTitle
          }
        })
      });

      const data = await res.json();
      const replyText = data.response || data.message || "Good observation. Let's make sure your headline directly answers the user's commercial search query.";

      const instructorMsg: CopilotMessage = {
        id: `msg-resp-${Date.now()}`,
        sender: "instructor",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, instructorMsg]);

      if (isVoiceActive) {
        instructorVoice.speak(replyText);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: "instructor",
          text: "Connection briefly paused. Review your target keywords and character counts, then ask again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    { label: "🔍 Audit My Title Tag", query: "Can you critique my current Page Title Tag based on length and search intent?" },
    { label: "⚠️ Why is a Badge Amber?", query: "Why am I seeing 'Needs Adjustment' on my current draft? What search principle is missing?" },
    { label: "🎯 Check Search Intent", query: "Does my headline match commercial search intent or is it too generic?" }
  ];

  return (
    <>
      {/* Floating Trigger Button (Positioned safely above global AI coach) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-22 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary to-amber-600 text-primary-foreground font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-primary-foreground/20 group"
          title={`Ask Growth Director (${instructor.name})`}
        >
          <div className="relative">
            <Avatar className="h-6 w-6 border border-white/40">
              <AvatarImage src={instructor.avatar} alt={instructor.name} />
              <AvatarFallback className="bg-primary text-[10px]">
                {instructor.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <span>Director: {instructor.name}</span>
          <Sparkles className="h-3.5 w-3.5 text-amber-200 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Slide-Out Growth Director Copilot Drawer */}
      {isOpen && (
        <div 
          className={`fixed bottom-0 right-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl border-l border-t md:border-t-0 border-border/80 shadow-2xl transition-all duration-300 ${
            isExpanded ? "w-full md:w-[560px] h-full" : "w-full md:w-[410px] h-[85vh] md:h-[620px] md:bottom-4 md:right-4 md:rounded-2xl md:border"
          }`}
        >
          {/* Drawer Header */}
          <div className="p-3.5 border-b border-border/80 flex items-center justify-between bg-card/80">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Avatar className="h-9 w-9 border border-primary/40 shadow-sm">
                  <AvatarImage src={instructor.avatar} alt={instructor.name} />
                  <AvatarFallback className="bg-primary/20 text-xs font-bold text-primary">
                    {instructor.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>{instructor.name}</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 capitalize bg-primary/10 border-primary/20 text-primary">
                    {instructor.teachingStyle.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                  {instructor.role}
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              {/* Voice Output Toggle */}
              <Button
                variant={isVoiceActive ? "default" : "ghost"}
                size="icon"
                onClick={() => {
                  if (isVoiceActive) {
                    instructorVoice.stop();
                    setIsVoiceActive(false);
                    toast({ title: "Voice Off 🔇", description: "Text-only chat active." });
                  } else {
                    setIsVoiceActive(true);
                    toast({ title: "Voice Active 🎙️", description: `${instructor.name} will speak using Deepgram Aura.` });
                    const lastMsg = [...messages].reverse().find(m => m.sender === "instructor");
                    if (lastMsg) instructorVoice.speak(lastMsg.text);
                  }
                }}
                className={`h-7 w-7 ${isVoiceActive ? "bg-amber-500 hover:bg-amber-600 text-white" : "text-muted-foreground"}`}
                title={isVoiceActive ? "Turn Voice OFF" : "Turn Voice ON (Aura)"}
              >
                <Radio className={`h-3.5 w-3.5 ${isVoiceActive ? "animate-pulse" : ""}`} />
              </Button>

              {/* Expand / Minimize */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-7 w-7 text-muted-foreground hover:text-foreground hidden md:flex"
                title={isExpanded ? "Collapse width" : "Expand width"}
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>

              {/* Close Drawer */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  instructorVoice.stop();
                  setIsOpen(false);
                }}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Close Mentor"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Context Pill */}
          <div className="px-3 py-1.5 bg-secondary/40 border-b border-border/50 text-[10px] text-muted-foreground flex items-center justify-between">
            <span className="truncate">Monitoring: <strong>{pageTitle}</strong></span>
            {instructor.config.hasCustomBusiness && instructor.config.businessName && (
              <span className="text-emerald-400 font-medium flex items-center gap-1 shrink-0">
                <Building2 className="h-2.5 w-2.5" />
                <span>{instructor.config.businessName}</span>
              </span>
            )}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs leading-relaxed">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === "student" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-[88%] p-3 rounded-2xl shadow-sm ${
                    msg.sender === "student" 
                      ? "bg-primary text-primary-foreground rounded-br-xs" 
                      : "bg-card border border-border/70 text-foreground rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[9px] text-muted-foreground/70 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card border border-border/60 text-xs text-muted-foreground w-fit">
                <span className="animate-pulse">Thinking</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Tactical Prompt Chips */}
          <div className="px-3 pt-2 pb-1 border-t border-border/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                disabled={isTyping}
                className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/60 transition-colors disabled:opacity-50"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-border/80 bg-card/60">
            <div className="flex items-center gap-2">
              <Textarea
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Ask ${instructor.name} for tactical guidance...`}
                className="min-h-[38px] max-h-[90px] resize-none text-xs bg-background py-2"
                disabled={isTyping}
              />

              {/* Mic STT Button */}
              <Button
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleListening}
                className="h-9 w-9 shrink-0 border-border"
                title={isListening ? "Listening... click to stop" : "Speak question"}
              >
                {isListening ? <MicOff className="h-4 w-4 animate-pulse text-white" /> : <Mic className="h-4 w-4 text-muted-foreground" />}
              </Button>

              {/* Send Button */}
              <Button
                size="icon"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="h-9 w-9 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

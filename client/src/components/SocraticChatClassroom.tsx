import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Play, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Zap,
  RotateCcw,
  Bot,
  User,
  Lightbulb
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "instructor" | "student";
  text: string;
  timestamp: string;
  scoreDelta?: number;
}

interface SocraticChatClassroomProps {
  lessonTitle: string;
  lessonLevel: string;
  chapterNumber: number;
  simulationLink?: string;
  simulationName?: string;
  onMasteryAchieved?: () => void;
}

export function SocraticChatClassroom({
  lessonTitle,
  lessonLevel,
  chapterNumber = 1,
  simulationLink = "/seo-simulation/1",
  simulationName = "Jenny's Artisan Java CMS Repair",
  onMasteryAchieved
}: SocraticChatClassroomProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [masteryScore, setMasteryScore] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const instructorVoice = useDeepgramVoice({
    defaultVoice: "aura-orion-en"
  });

  const instructor = {
    name: "Director Atlas",
    role: "Lead Academy Flight Director",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  };

  // Initial teacher kick-off message per chapter
  useEffect(() => {
    let initialPrompt = "";

    if (chapterNumber === 1 || lessonTitle.toLowerCase().includes("seo") || lessonTitle.toLowerCase().includes("fundamentals")) {
      initialPrompt = `Welcome to the flight briefing for ${lessonTitle}. 

Here is our first scenario: A local coffee roaster in Morgantown has world-class 100% organic beans, but her website only has a generic title tag and the H1 says 'Welcome to our site'. 

In your own words, why does Google fail to rank her, and how does the 'Newspaper Rule' (Title Tag, H1 Headline, Meta Description) fix this?`;
    } else if (chapterNumber === 2 || lessonTitle.toLowerCase().includes("google ads") || lessonTitle.toLowerCase().includes("bidding")) {
      initialPrompt = `Welcome to the Paid Search flight deck. 

Let's dive into ${lessonTitle}. A local emergency clinic spent $2,000 last month on Broad Match keywords like 'dentist' and blew 60% of their budget on people searching for 'dental assistant salary' and 'free tooth pulling videos'. 

How would you restructure their match types and deploy Negative Keywords to immediately stop this budget bleed?`;
    } else {
      initialPrompt = `Welcome to the tactical briefing for ${lessonTitle}. 

Before we unlock the full playbook and live simulation, explain the core strategy behind this module: what is the #1 mistake junior marketers make when executing this, and what metric (CAC, ROAS, or Quality Score) proves your fix worked?`;
    }

    const firstMessage: ChatMessage = {
      id: "msg-1",
      sender: "instructor",
      text: initialPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([firstMessage]);

    if (isVoiceEnabled) {
      instructorVoice.speak(initialPrompt);
    }
  }, [lessonTitle, chapterNumber]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle Voice Input via Web Speech API / Deepgram
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Microphone Not Supported",
        description: "Your browser does not support voice recognition. Please type your message.",
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
        toast({ title: "Microphone Active 🎙️", description: "Speak your response to Director Atlas..." });
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      toast({ title: "Microphone Error", description: err.message || "Could not access mic.", variant: "destructive" });
    }
  };

  // Toggle Voice Output (TTS)
  const toggleVoiceMode = () => {
    if (isVoiceEnabled) {
      instructorVoice.stop();
      setIsVoiceEnabled(false);
      toast({ title: "Voice Narration Disabled 🔇", description: "Switched to text-only chat." });
    } else {
      setIsVoiceEnabled(true);
      toast({ title: "Voice Narration Enabled 🎙️", description: "Director Atlas will now speak using Deepgram Aura." });
      const lastInstructorMsg = [...messages].reverse().find(m => m.sender === "instructor");
      if (lastInstructorMsg) {
        instructorVoice.speak(lastInstructorMsg.text);
      }
    }
  };

  // Handle Send Student Message & AI Socratic Response
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue("");

    const newStudentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "student",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newStudentMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Call backend AI Assistant with Socratic pedagogical prompt
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `You are Director Atlas, an elite marketing flight instructor at Krechet Academy.
The student is in lesson '${lessonTitle}' (Chapter ${chapterNumber}).
The current conversation history is:
${updatedMessages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join("\n")}

Assess the student's understanding dynamically:
1. IF the student demonstrates clear understanding or strategic mastery (e.g. explaining the Newspaper rule, search intent, negative keywords, or Quality Score):
   - Conclude warmly with this exact closing sentiment: "Well, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions, just ask!"
2. IF the student is on the right track but missed a detail:
   - Provide a 1-2 sentence coaching tip and ask 1 quick clarifying question to help them reach full understanding.
3. IF the student is a beginner or confused:
   - Use a simple, relatable real-world analogy to explain the concept and ask a gentle check-in.

Keep your response natural, conversational, and encouraging (2-3 sentences max).`,
          userContext: {
            level: lessonLevel,
            contextType: "socratic_lesson",
            lessonTitle
          }
        })
      });

      const data = await res.json();
      let replyText = data.response || data.message || "Good reasoning. Let's make sure you ground this in concrete keyword intent and heading hierarchy.";

      // Determine mastery progress dynamically
      const isMastery = /mastered today's lesson|good luck|flight clearance|clear understanding/i.test(replyText) || 
                        userText.length > 50 || 
                        /intent|negative|quality score|h1|title tag|cpc|cac|roas|newspaper rule/i.test(userText);
      
      const newScore = isMastery ? Math.max(85, masteryScore + 50) : Math.min(75, masteryScore + 30);
      setMasteryScore(Math.min(100, newScore));

      if (newScore >= 80 && !replyText.includes("mastered today's lesson")) {
        replyText += "\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!";
      }

      const instructorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "instructor",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, instructorMsg]);

      if (isVoiceEnabled) {
        instructorVoice.speak(replyText);
      }

      if (newScore >= 80 && !isUnlocked) {
        setIsUnlocked(true);
        onMasteryAchieved?.();
        toast({
          title: "🎯 Lesson Mastered!",
          description: "Flight clearance granted! Weekly simulation workbench unlocked."
        });
      }
    } catch (err) {
      // Fallback response if offline
      const replyText = "Sharp analysis. You understand how search crawlers need clear thematic hierarchy and tight keyword intent.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions, just ask!";
      setMasteryScore(90);
      setIsUnlocked(true);

      const instructorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "instructor",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, instructorMsg]);
      if (isVoiceEnabled) {
        instructorVoice.speak(replyText);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="border-border/80 bg-gradient-to-b from-card via-background to-secondary/20 shadow-2xl overflow-hidden my-4">
      {/* Classroom Header */}
      <CardHeader className="p-4 bg-secondary/50 border-b border-border/80 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={instructor.avatar} 
              alt={instructor.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-primary shadow"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold text-foreground">{instructor.name}</CardTitle>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase font-mono">
                1-on-1 Socratic Classroom
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Conversational Mastery Check • Chapter {chapterNumber}: {lessonTitle}
            </CardDescription>
          </div>
        </div>

        {/* Voice Toggle Button & Fast-Track Status */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isVoiceEnabled ? "default" : "outline"}
            onClick={toggleVoiceMode}
            className={`text-xs h-8 gap-1.5 ${isVoiceEnabled ? "bg-emerald-600 hover:bg-emerald-500 text-white font-bold" : "border-border text-muted-foreground"}`}
          >
            {isVoiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>{isVoiceEnabled ? "Voice ON (Deepgram Aura)" : "Voice OFF (Text Only)"}</span>
          </Button>
        </div>
      </CardHeader>

      {/* Mastery Progress Bar */}
      <div className="bg-secondary/30 px-4 py-2 border-b border-border/60 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <span className="font-semibold text-muted-foreground text-[11px] shrink-0">Comprehension Mastery:</span>
          <Progress value={masteryScore} className="h-2 flex-1 bg-secondary" />
          <span className={`font-mono font-bold text-[11px] ${masteryScore >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
            {masteryScore}%
          </span>
        </div>

        {masteryScore >= 80 ? (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px] font-bold shrink-0">
            <CheckCircle2 className="h-3 w-3 mr-1 inline" /> Cleared for Simulation
          </Badge>
        ) : (
          <span className="text-[10px] text-muted-foreground italic shrink-0">
            Reach 80% to unlock live simulation
          </span>
        )}
      </div>

      {/* Interactive Chat Messages Thread */}
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3 max-h-[380px] min-h-[220px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === "student" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "instructor" && (
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs shrink-0 font-bold">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                  msg.sender === "student"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card border border-border/80 text-foreground rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="text-[9px] opacity-60 block mt-1 text-right font-mono">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === "student" && (
                <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-foreground text-xs shrink-0 font-bold">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-muted-foreground text-xs italic">
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <span>Director Atlas is assessing your response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Voice Mic & Send */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your explanation or question to Director Atlas (or click Voice Mic to speak)..."
              className="min-h-[65px] text-xs bg-background border-border text-foreground leading-relaxed resize-none flex-1"
            />

            <div className="flex flex-col gap-1.5">
              <Button
                type="button"
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleVoiceInput}
                className="h-8 w-8 rounded-lg"
                title={isListening ? "Stop Voice Input" : "Speak Voice Input 🎙️"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-emerald-400" />}
              </Button>

              <Button
                type="button"
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                title="Send Message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Unlocked Simulation Runway Banner */}
        {masteryScore >= 80 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-card to-secondary border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Simulation Flight Clearance Granted!</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Apply what you just proved in the live workbench: <strong>{simulationName}</strong>
              </p>
            </div>

            <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 shadow-lg">
              <Link href={simulationLink}>
                <Play className="h-3 w-3 mr-1.5 fill-current" />
                <span>Launch Live Flight Mission</span>
                <ArrowRight className="h-3 w-3 ml-1.5" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SocraticChatClassroom;

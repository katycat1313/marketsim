import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useDeepgramVoice } from "@/hooks/useDeepgramVoice";
import { useGeminiLive } from "@/hooks/useGeminiLive";
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
  Lightbulb,
  Building2,
  PhoneCall,
  PhoneOff
} from "lucide-react";
import { getActiveInstructor } from "@/lib/instructorConfig";

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
  playbookContent?: string;
  isSplitView?: boolean;
  onMasteryAchieved?: () => void;
}

/**
 * Builds an in-depth lesson briefing from the Tactical Playbook,
 * actively teaching the student and pointing out sections, formulas, and warnings
 * before posing the Socratic challenge.
 */
function buildLessonBriefing({
  lessonTitle,
  chapterNumber,
  playbookContent,
  isSplitView,
  instructor
}: {
  lessonTitle: string;
  chapterNumber: number;
  playbookContent?: string;
  isSplitView?: boolean;
  instructor: any;
}): string {
  const lookDirective = isSplitView
    ? "Take a look at the guide on your right side."
    : "Take a look at the lesson guide below:";

  const titleLower = lessonTitle.toLowerCase();
  const hasBiz = instructor.config.hasCustomBusiness && instructor.config.businessName;
  const bizName = instructor.config.businessName;
  const bizIndustry = instructor.config.industry || "local business";
  const bizOffer = instructor.config.primaryOffer || "core services";

  // Lesson 1: Fundamentals & Funnel
  if (chapterNumber === 1 && (titleLower.includes("fundamental") || titleLower.includes("flywheel") || !titleLower.includes("goal"))) {
    return `Welcome future marketers! Today we will be doing a deep dive into understanding marketing fundamentals. I'm your instructor ${instructor.name}, and I am so glad you're here today. Let's get started.

${lookDirective} Think of the marketing funnel like building a relationship: you don't ask someone to marry you on the first date, and you don't ask someone who just discovered your brand to buy your most expensive offer immediately. You build trust step by step:

Section 1: The Growth Funnel — Notice the 3 stages:
• TOFU (Top of Funnel - Awareness): Introducing your brand to people who don't know you yet through organic search, short videos, or helpful articles.
• MOFU (Middle of Funnel - Consideration): Building trust with reviews, case studies, and email guides.
• BOFU (Bottom of Funnel - Conversion): High-intent searches where people are ready to buy today.

Section 2: Key Financial Metrics & The Golden Rule —
• CAC (Customer Acquisition Cost): Total marketing spend ÷ new customers acquired.
• LTV (Lifetime Value): What a customer spends with you over their entire relationship.
• The Golden Rule: Your customer lifetime value must be at least 3x your acquisition cost ($LTV / CAC > 3.0$) so your business has healthy profit after overhead and payroll.

Common Mistake to Avoid:
Spending $1,000 on ads that point to a slow, confusing homepage with no clear phone number or call-to-action. Always make sure your landing page works before you spend money on traffic!

${hasBiz ? `For your business, **${bizName}** (${bizIndustry}), this means knowing what a new customer for ${bizOffer} is worth before spending ad dollars.\n\n` : ""}Now, looking at the guide on your right:
Imagine an agency spends $1,000 on ads and gets 20 new customers. But each customer only spends $35 one time and never comes back. What is their CAC, what is their LTV-to-CAC ratio, and what mistake did they make?`;
  }

  // Lesson 2: Marketing Goals & KPIs
  if (chapterNumber === 1 || titleLower.includes("goal") || titleLower.includes("kpi")) {
    return `Welcome future marketers! Today we're doing a deep dive into setting marketing goals and measurable KPIs. I'm your instructor ${instructor.name}, and I'm really glad you're here today. Let's get started.

${lookDirective} In marketing, hope is not a strategy. We never invest time or money without clear, measurable targets:

Section 1: The SMART Goal Framework —
Notice how every solid goal is Specific, Measurable, Achievable, Relevant, and Time-Bound. For example: "Generate 25 qualified consultations in the next 30 days" instead of just "I want more sales."

Section 2: Channel-Specific KPIs —
• SEO: Organic search clicks and qualified website inquiries.
• Google Search Ads: Cost Per Click (CPC), Quality Score, and conversion rate.
• Paid Social: Hook rate, Cost Per Lead (CPL), and Return on Ad Spend (ROAS).

Common Mistake to Avoid:
Getting distracted by vanity metrics like Instagram likes or views. Likes don't pay business rent or team salaries—revenue and qualified leads do!

${hasBiz ? `For **${bizName}**, our primary focus is generating real paying customers for ${bizOffer}.\n\n` : ""}Looking at the SMART framework and KPI guide on your right:
If a business owner tells you, "My marketing goal this month is just to get 10,000 followers and go viral," how would you guide them toward a real SMART goal and a revenue-tied KPI instead?`;
  }

  // Lesson 3: Google Ads Hierarchy & Quality Score
  if (chapterNumber === 2 && (titleLower.includes("structure") || titleLower.includes("hierarchy") || !titleLower.includes("match"))) {
    return `Welcome future marketers! Today we're diving into Google Search Ads and how the auction actually works. I'm your instructor ${instructor.name}, and I'm excited to walk you through this. Let's get started.

${lookDirective} Google Ads isn't a lottery or a guessing game—it's a mathematical auction where relevance wins discounts:

Section 1: The 3-Tier Hierarchy —
• Campaign Level: Sets your daily budget, location targeting, and bidding strategy.
• Ad Group Level: Groups keywords into one tight theme (for example, "Emergency Plumber" separate from "Bathroom Remodeling").
• Ad & Asset Level: Headlines and descriptions that directly match what the searcher typed.

Section 2: The Quality Score Formula —
Take a look at the auction formula in Section 2:
$$CPC = \\frac{AdRank_{competitor}}{Your\\,Quality\\,Score} + \\$0.01$$
Because Quality Score is in the denominator, having a high score (8 to 10 out of 10) gives you up to a 50% discount on every single click! Google grades your score on click-through rate, ad relevance, and landing page experience.

Common Mistake to Avoid:
Dumping 50 unrelated keywords into a single ad group. When someone searches for "coffee subscription" and your ad headline says "espresso machine repair," they bounce, your Quality Score drops, and Google charges you double for every click.

${hasBiz ? `For **${bizName}**, keeping your ad groups tightly focused on ${bizOffer} ensures you get the lowest possible cost per click.\n\n` : ""}Looking at Sections 1 and 2 on your right:
If a local business puts three completely different services into one single ad group, what happens to their Ad Relevance and Quality Score, and how does that affect their Cost Per Click?`;
  }

  // Lesson 4: Match Types & Negative Keyword Shields
  if (chapterNumber === 2 || titleLower.includes("match") || titleLower.includes("negative")) {
    return `Welcome future marketers! Today we're diving into Google Ads keyword match types and budget protection. I'm your instructor ${instructor.name}, and I'm glad you're here. Let's get started.

${lookDirective} The number one reason small businesses lose money on Google Ads is using the wrong keyword match types:

Section 1: The 3 Match Types —
• Broad Match (e.g., coffee beans): Shows your ad on anything Google thinks is related—including free images, job openings, or YouTube tutorials. High risk of wasted spend!
• Phrase Match (e.g., "organic coffee beans"): Shows your ad when the search contains your core phrase in that order.
• Exact Match (e.g., [morgantown coffee roaster]): Shows your ad ONLY when the search matches your exact intent.

Section 2: Negative Keyword Shields —
Notice the negative keyword list: words like -free, -cheap, -jobs, -salary, -diy, -youtube. Adding these prevents you from paying for clicks from people who are just looking for free advice or a job instead of hiring you.

Common Mistake to Avoid:
Letting ads run for weeks without checking the Search Terms report. You should review what people actually typed at least once a week to add new negative keywords.

${hasBiz ? `For **${bizName}**, negative keywords make sure you never pay for people looking for free DIY tutorials.\n\n` : ""}Looking at the guide on your right:
If a local business with a $1,500 monthly budget runs all their keywords on Broad Match, why does that waste their budget so quickly, and what match types and negative keywords would you recommend they use instead?`;
  }

  // Lesson 5: SEO Newspaper Rule
  if (chapterNumber === 3 || titleLower.includes("seo") || titleLower.includes("newspaper") || titleLower.includes("on-page")) {
    return `Welcome future marketers! Today we're doing a deep dive into on-page SEO and how search engines read web pages. I'm your instructor ${instructor.name}, and I'm so glad you're here today. Let's get started.

${lookDirective} Search engine crawlers can't see colors or pretty layouts. They read your webpage structure just like a reader skims a printed newspaper:

Section 1: The Newspaper Rule for On-Page Tags —
• Title Tag (The Newspaper Front Header): 50-60 characters. Must put your primary service and city right at the front (e.g., 'Organic Coffee Roaster Morgantown | Jenny\\'s Artisan Java').
• H1 Headline (The Front-Page Banner): Exactly ONE per page. Clearly states what you do and where you do it.
• H2 & H3 Subheadings (Section Topics): Organizes your page so crawlers and visitors can scan topics easily.
• Meta Description (The Short Preview): 150-160 characters that acts like your search ad copy to convince people to click.

Section 2: Image Alt Text —
Helps search engines understand what is in your photos, while also helping visually impaired visitors using screen readers.

Common Mistake to Avoid:
Leaving your H1 headline as "Welcome to Our Website" or "Home". A search crawler has no idea what you sell or what city you're in, so your website stays invisible in search results!

${hasBiz ? `For **${bizName}**, your Title Tag and H1 must clearly announce ${bizOffer} in ${instructor.config.location || 'your city'}.\n\n` : ""}Looking at the Newspaper Rule on your right:
A local coffee roaster named Jenny has amazing organic coffee beans, but her website Title Tag says "Home - Welcome" and her H1 says "Welcome to Our Site". Why is Google ignoring her, and how would you rewrite her Title Tag and H1 right now?`;
  }

  // Lesson 6: Ethical AI Prompting
  if (chapterNumber === 4 || titleLower.includes("prompt") || titleLower.includes("ai")) {
    return `Welcome future marketers! Today we're diving into ethical AI prompt engineering for marketing. I'm your instructor ${instructor.name}, and I'm excited to show you this. Let's get started.

${lookDirective} Think of AI like a fast, eager intern: if you give it vague instructions, it will give you generic fluff. But if you give it clear constraints, it can save you hours of work every week:

Section 1: The 4-Part Prompt Formula (Works with Free ChatGPT or Gemini) —
1. Role: Tell AI who it is ("Act as a direct-response copywriter for local businesses").
2. Context: Provide specific business details, target audience, and your unique selling points.
3. Strict Constraints: Set exact rules ("Write 5 Google Ads headlines under 30 characters each. Do not use exclamation marks").
4. Desired Emotion & Goal: Focus on customer trust, convenience, or urgency.

Section 2: Reusable Prompt Templates —
Notice the prompt templates for generating negative keyword ideas and creating 30-second social video hooks.

Common Mistake to Avoid:
Publishing robotic, unedited AI text that sounds generic. Search engines reward genuine, helpful content, and customers can spot lazy AI writing instantly. Always review and edit AI output before using it!

${hasBiz ? `For **${bizName}**, you can use this 4-part formula with free tools like Gemini to draft ad headlines for ${bizOffer}.\n\n` : ""}Looking at the 4-part formula on your right:
Why do most marketers get boring, robotic answers from AI, and how would you structure a prompt using the 4 parts to get 5 punchy Google Ads headlines under 30 characters for a local business?`;
  }

  // Lesson 7: Speed-to-Lead Automation with Make.com
  if (chapterNumber === 5 || titleLower.includes("make") || titleLower.includes("speed") || titleLower.includes("automation")) {
    return `Welcome future marketers! Today we're exploring speed-to-lead automation using Make.com. I'm your instructor ${instructor.name}, and I'm really glad you're here. Let's get started.

${lookDirective} Getting website leads is great, but letting them sit in an unread inbox for hours wastes your marketing budget:

Section 1: The Power of Speed-to-Lead —
Look at the research data in Section 1: contacting a new lead within 5 minutes makes you 21 times more likely to close them compared to waiting 30 minutes! When people submit a form, they are actively looking for help right now.

Section 2: The 3-Step Automation Blueprint (Free on Make.com) —
1. Webhook Module: Instantly catches new form submissions from your website.
2. AI Intent Filter: Reads the inquiry to categorize what the customer needs.
3. Instant Notification: Sends an immediate text alert to the business owner and an instant personalized email to the customer in under 60 seconds.

Section 3: The Real-World Value —
Business owners will happily pay $500 to $1,500 for someone to set this up because it stops lost leads and pays for itself with the very first saved customer.

${hasBiz ? `For **${bizName}**, this automation guarantees that anyone inquiring about ${bizOffer} gets an instant, helpful response.\n\n` : ""}Looking at the guide on your right:
Why does responding in under 60 seconds make marketing campaigns so much more profitable, and what are the 3 simple steps in our automation blueprint that handle this automatically?`;
  }

  // Lesson 8: Capstone & SLA
  return `Welcome future marketers! Today is our comprehensive marketing audit capstone. I'm your instructor ${instructor.name}, and congratulations on making it this far. Let's get started.

${lookDirective} This is where everything you've learned comes together into a professional marketing audit:

Section 1: The 4-Pillar Audit Framework —
1. On-Page SEO: Title tags, H1 structure, and the Newspaper Rule.
2. Paid Search Defense: Single-theme ad groups, match types, and negative keywords.
3. Lead Conversion & Speed: Sub-60 second response automations.
4. Marketing Economics: CAC, LTV, and ensuring healthy profit margins.

Section 2: Clear Client Agreements (SLA) —
How to set realistic expectations with clients regarding response times, monthly reporting, and performance goals so everyone is aligned.

Section 3: Your Practical Audit —
Putting these steps into action to audit a real website and deliver clear, actionable recommendations.

Looking at the 4 pillars on your right:
When you're auditing a new client or business website for the first time, which pillar do you inspect first, and how do you explain the value of fixing it to the business owner?`;
}

export function SocraticChatClassroom({
  lessonTitle,
  lessonLevel,
  chapterNumber = 1,
  simulationLink = "/seo-simulation/1",
  simulationName = "Jenny's Artisan Java CMS Repair",
  playbookContent,
  isSplitView = true,
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

  const track = (chapterNumber === 1 || lessonTitle.toLowerCase().includes("seo") || lessonTitle.toLowerCase().includes("fundamentals"))
    ? "seo"
    : (chapterNumber === 2 || lessonTitle.toLowerCase().includes("google ads") || lessonTitle.toLowerCase().includes("bidding"))
    ? "ads"
    : "general";

  const instructor = getActiveInstructor(track);

  const instructorVoice = useDeepgramVoice({
    defaultVoice: instructor.voice
  });

  const geminiLive = useGeminiLive();

  // Voice name for Gemini Live (Aoede for female / Charon or Puck for male)
  const geminiVoice = instructor.gender === "female" ? "Aoede" : "Charon";

  // Toggle Gemini Live bidirectional voice call
  const handleToggleGeminiLive = async () => {
    if (geminiLive.isConnected) {
      geminiLive.endSession();
      toast({
        title: "Live Voice Call Ended 📞",
        description: "Returned to standard chat mode."
      });
      return;
    }

    // Stop Deepgram voice if active
    instructorVoice.stop();

    try {
      toast({
        title: "Connecting to Gemini Live... 🎙️",
        description: `Starting real-time bidirectional call with ${instructor.name}.`
      });

      const systemInstruction = `You are ${instructor.name}, an encouraging, expert digital marketing instructor at Krechet Academy.
Your teaching style: '${instructor.teachingStyle}'.
The student is working through lesson '${lessonTitle}' (Chapter ${chapterNumber}).
Split View Guide: ${isSplitView ? "ACTIVE (The lesson guide is visible on the student's right side)" : "INACTIVE"}

LESSON REFERENCE NOTES:
${playbookContent || "Standard curriculum guide"}

${instructor.config.hasCustomBusiness && instructor.config.businessName ? `The student is training for their real business: ${instructor.config.businessName} (${instructor.config.industry} in ${instructor.config.location}). Primary offer: ${instructor.config.primaryOffer}. Target customer: ${instructor.config.targetAudience}.` : ""}

CRITICAL LIVE VOICE TEACHING GUIDELINES:
1. Speak warmly, concisely, and naturally like an encouraging senior mentor on a real audio call. Keep every voice turn to 1-3 spoken sentences. Avoid monologues.
2. Direct the student to look at specific sections, formulas, and warnings in their guide on the right side (e.g., 'Look at Section 2 on your right...', 'Notice the formula for CAC...').
3. No aviation terminology (never say cockpit, copilot, runway, checkride, comms).
4. Do not use the phrase "master class" or "master" as a level label.
5. If the student answers well, enthusiastically praise them and let them know they are ready for the weekly hands-on simulation!
6. If the student interrupts you or asks a question, immediately pivot and answer their question directly.`;

      await geminiLive.startSession({
        voiceName: geminiVoice,
        systemInstruction,
        onAssistantTranscript: (text, isFinal) => {
          if (!text) return;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.sender === "instructor" && last.id.startsWith("gemini-live-ai-")) {
              return prev.map(m => m.id === last.id ? { ...m, text } : m);
            } else {
              return [...prev, {
                id: `gemini-live-ai-${Date.now()}`,
                sender: "instructor",
                text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }];
            }
          });

          if (isFinal) {
            const isMastery = /mastered today's lesson|good luck|simulation clearance|clear understanding/i.test(text);
            if (isMastery) {
              setMasteryScore(100);
              setIsUnlocked(true);
              onMasteryAchieved?.();
            } else {
              setMasteryScore(prev => Math.min(100, Math.max(prev, 60) + 20));
            }
          }
        },
        onUserTranscript: (text, isFinal) => {
          if (!text) return;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.sender === "student" && last.id.startsWith("gemini-live-user-")) {
              return prev.map(m => m.id === last.id ? { ...m, text } : m);
            } else {
              return [...prev, {
                id: `gemini-live-user-${Date.now()}`,
                sender: "student",
                text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }];
            }
          });
        },
        onInterrupted: () => {
          toast({
            title: "Interrupted",
            description: "Instructor paused to listen to you."
          });
        },
        onError: (err) => {
          toast({
            title: "Live Call Error",
            description: err.message || "Failed to maintain Gemini Live session.",
            variant: "destructive"
          });
        }
      });

      toast({
        title: "Live Voice Call Connected! 🟢",
        description: `You are now talking live with ${instructor.name}. Speak into your microphone anytime.`
      });
    } catch (err: any) {
      toast({
        title: "Could Not Connect",
        description: err.message || "Please check your microphone permissions.",
        variant: "destructive"
      });
    }
  };

  // Initial teacher kick-off message per chapter using the Tactical Playbook
  useEffect(() => {
    setMasteryScore(0);
    setIsUnlocked(false);

    const initialBriefing = buildLessonBriefing({
      lessonTitle,
      chapterNumber,
      playbookContent,
      isSplitView,
      instructor
    });

    const firstMessage: ChatMessage = {
      id: "msg-1",
      sender: "instructor",
      text: initialBriefing,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([firstMessage]);

    if (isVoiceEnabled) {
      instructorVoice.speak(initialBriefing);
    }
  }, [lessonTitle, chapterNumber, track, isSplitView, playbookContent]);

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

    if (geminiLive.isConnected) {
      const userText = inputValue.trim();
      setInputValue("");

      const newStudentMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "student",
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newStudentMsg]);
      geminiLive.sendClientText(userText);
      return;
    }

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
          question: `You are ${instructor.name}, a friendly, experienced digital marketing instructor at Krechet Academy.
Your teaching style is: '${instructor.teachingStyle}'.
The student is in lesson '${lessonTitle}' (Chapter ${chapterNumber}).
Split View Guide: ${isSplitView ? "ACTIVE (The lesson guide is visible on the student's right side)" : "INACTIVE"}

LESSON GUIDE REFERENCE:
${playbookContent || "Standard curriculum guide"}

The current conversation history is:
${updatedMessages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join("\n")}

${instructor.config.hasCustomBusiness && instructor.config.businessName ? `The student is training for their real business: ${instructor.config.businessName} (${instructor.config.industry} in ${instructor.config.location}). Primary offer: ${instructor.config.primaryOffer}. Target customer: ${instructor.config.targetAudience}.` : ""}

STUDENT: ${userText}

Respond to the student naturally and respectfully:
1. Speak directly and warmly like a real mentor teaching an ambitious adult student. No corporate roleplay, no military jargon, and no condescension.
2. Actively reference the guide on their right side (e.g., 'As shown in Section 2 on your right...', 'Notice the formula in Section 2...', 'Remember the common mistake in Section 3...').
3. IF the student demonstrates clear understanding or good reasoning (e.g. explaining the Newspaper rule, search intent, negative keywords, Quality Score, LTV/CAC, or speed-to-lead automation):
   - Conclude warmly with this exact closing sentiment: "Well, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!"
4. IF the student is on the right track but missed a detail:
   - Point them specifically to the exact section in the guide on their right, provide a clear, supportive 1-2 sentence coaching tip, and ask 1 quick follow-up question.
5. IF the student is confused or asks a question:
   - Answer their question directly with a simple real-world analogy, point them to the relevant section on the right, and check in with them.

Keep your response natural, conversational, and punchy (2-3 sentences max).`,
          userContext: {
            instructor: instructor.name,
            style: instructor.teachingStyle,
            level: lessonLevel,
            contextType: "socratic_lesson",
            lessonTitle,
            chapterNumber,
            isSplitView: !!isSplitView,
            playbookContent: playbookContent || "",
            studentMessage: userText,
            businessName: instructor.config.businessName,
            industry: instructor.config.industry
          }
        })
      });

      const data = await res.json();
      let replyText = data.response || data.message || "Good reasoning. Let's make sure you ground this in concrete keyword intent and heading hierarchy.";

      // Determine mastery progress dynamically
      const isMastery = /mastered today's lesson|good luck|simulation clearance|workbench unlocked|clear understanding/i.test(replyText) || 
                        userText.length > 50 || 
                        /intent|negative|quality score|h1|title tag|cpc|cac|roas|newspaper rule|smart|webhook|speed-to-lead/i.test(userText);
      
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
          description: "Simulation clearance granted! Weekly client workbench unlocked."
        });
      }
    } catch (err) {
      // Fallback response if offline
      const replyText = "Sharp analysis. You understand how the Tactical Playbook sections work together to protect budget and scale conversions.\n\nWell, I think you have mastered today's lesson! Go apply what you learned today to the weekly simulation. Good luck, and if you have any questions along the way, just ask!";
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

  const handleResetClassroom = () => {
    setMasteryScore(0);
    setIsUnlocked(false);

    const initialBriefing = buildLessonBriefing({
      lessonTitle,
      chapterNumber,
      playbookContent,
      isSplitView,
      instructor
    });

    const firstMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "instructor",
      text: initialBriefing,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([firstMessage]);

    if (isVoiceEnabled) {
      instructorVoice.speak(initialBriefing);
    }

    toast({
      title: "Lesson Reset",
      description: `${instructor.name} has restarted today's lesson.`
    });
  };

  return (
    <Card className="border-border/80 bg-gradient-to-b from-card via-background to-secondary/20 shadow-2xl overflow-hidden my-4">
      {/* Classroom Header */}
      <CardHeader className="p-3 sm:p-4 bg-secondary/50 border-b border-border/80 flex flex-row items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative shrink-0">
            <img 
              src={instructor.avatar} 
              alt={instructor.name}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-primary shadow"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <CardTitle className="text-xs sm:text-sm font-bold text-foreground truncate">{instructor.name}</CardTitle>
              <Badge variant="outline" className="text-[9px] sm:text-[10px] capitalize bg-primary/10 border-primary/20 text-primary">
                {instructor.teachingStyle.replace('_', ' ')}
              </Badge>
              {instructor.config.hasCustomBusiness && instructor.config.businessName && (
                <Badge variant="secondary" className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center gap-1 truncate max-w-[120px]">
                  <Building2 className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate">{instructor.config.businessName}</span>
                </Badge>
              )}
            </div>
            <CardDescription className="text-[11px] sm:text-xs text-muted-foreground truncate">
              {instructor.role} • Chapter {chapterNumber}: {lessonTitle}
            </CardDescription>
          </div>
        </div>

        {/* Actions: Live Voice Call, Voice Toggle, Restart Briefing */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto flex-wrap sm:flex-nowrap justify-end">
          <Button
            size="sm"
            variant={geminiLive.isConnected ? "destructive" : "default"}
            onClick={handleToggleGeminiLive}
            disabled={geminiLive.isConnecting}
            className={`text-xs h-8 px-2 sm:px-3 gap-1.5 font-bold shadow-sm ${
              geminiLive.isConnected
                ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
            title="Real-time zero-latency bidirectional voice call with instructor"
          >
            {geminiLive.isConnecting ? (
              <>
                <Radio className="h-3.5 w-3.5 shrink-0 animate-spin" />
                <span className="hidden sm:inline">Connecting...</span>
                <span className="sm:hidden">Calling</span>
              </>
            ) : geminiLive.isConnected ? (
              <>
                <PhoneOff className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">End Live Call</span>
                <span className="sm:hidden">End</span>
              </>
            ) : (
              <>
                <PhoneCall className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Talk Live (Gemini Live)</span>
                <span className="sm:hidden">Talk Live</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant={isVoiceEnabled ? "default" : "outline"}
            onClick={toggleVoiceMode}
            className={`text-xs h-8 px-2 sm:px-3 gap-1.5 ${isVoiceEnabled ? "bg-primary text-primary-foreground font-bold" : "border-border text-muted-foreground"}`}
            title="Turn Deepgram Aura voice narration on/off for text replies"
          >
            {isVoiceEnabled ? <Volume2 className="h-3.5 w-3.5 shrink-0" /> : <VolumeX className="h-3.5 w-3.5 shrink-0" />}
            <span className="hidden sm:inline">{isVoiceEnabled ? "Narration ON" : "Narration OFF"}</span>
            <span className="sm:hidden">{isVoiceEnabled ? "Narrate" : "Mute"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleResetClassroom}
            className="text-xs h-8 px-2 sm:px-2.5 gap-1 border-border text-muted-foreground hover:text-foreground"
            title="Restart Lesson Briefing"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Restart</span>
          </Button>
        </div>
      </CardHeader>

      {/* Mastery Progress Bar */}
      <div className="bg-secondary/30 px-3 sm:px-4 py-2 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 text-xs">
        <div className="flex items-center gap-2 w-full sm:flex-1">
          <span className="font-semibold text-muted-foreground text-[10px] sm:text-[11px] shrink-0">Comprehension Mastery:</span>
          <Progress value={masteryScore} className="h-2 flex-1 bg-secondary" />
          <span className={`font-mono font-bold text-[10px] sm:text-[11px] shrink-0 ${masteryScore >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
            {masteryScore}%
          </span>
        </div>

        {masteryScore >= 80 ? (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[9px] sm:text-[10px] font-bold shrink-0 self-start sm:self-auto">
            <CheckCircle2 className="h-3 w-3 mr-1 inline" /> Lesson Mastered (80%+)
          </Badge>
        ) : (
          <span className="text-[10px] text-muted-foreground italic shrink-0 self-start sm:self-auto">
            Simulation open all week • Aim for 80%+ comprehension
          </span>
        )}
      </div>

      {/* Interactive Chat Messages Thread */}
      <CardContent className="p-4 space-y-4">
        {/* Active Gemini Live Bidirectional Call Status Banner */}
        {geminiLive.isConnected && (
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/50 p-3 rounded-xl flex items-center justify-between gap-3 text-xs shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-emerald-400 text-xs flex items-center gap-1.5 flex-wrap">
                  <span>● LIVE CALL ACTIVE — {instructor.name}</span>
                  {geminiLive.isAiSpeaking && (
                    <Badge variant="outline" className="text-[9px] bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse">
                      Speaking...
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  Zero-latency bidirectional voice • Speak freely into mic or interrupt anytime
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={geminiLive.toggleMicMute}
                className={`h-7 px-2 text-[11px] border-border ${geminiLive.isMicMuted ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "text-muted-foreground hover:text-foreground"}`}
              >
                {geminiLive.isMicMuted ? <MicOff className="h-3 w-3 mr-1 text-amber-400" /> : <Mic className="h-3 w-3 mr-1 text-emerald-400" />}
                <span>{geminiLive.isMicMuted ? "Unmute" : "Mute"}</span>
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={geminiLive.endSession}
                className="h-7 px-2 text-[11px] bg-rose-600 hover:bg-rose-500 text-white font-medium shadow"
              >
                <PhoneOff className="h-3 w-3 mr-1" />
                <span>End Call</span>
              </Button>
            </div>
          </div>
        )}
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
              <span>{instructor.name} is assessing your response...</span>
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
              placeholder={`Ask a question or explain to ${instructor.name} (or tap Mic to speak)...`}
              className="min-h-[58px] sm:min-h-[65px] text-xs bg-background border-border text-foreground leading-relaxed resize-none flex-1"
            />

            <div className="flex flex-col gap-1.5 shrink-0">
              <Button
                type="button"
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleVoiceInput}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg"
                title={isListening ? "Stop Voice Input" : "Speak Voice Input 🎙️"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-emerald-400" />}
              </Button>

              <Button
                type="button"
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                title="Send Message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Weekly Simulation Workbench Banner - Available throughout the week */}
        <div className={`p-3.5 sm:p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition-all duration-300 ${
          masteryScore >= 80 
            ? "bg-gradient-to-r from-emerald-950/60 via-card to-secondary border-emerald-500/50 shadow-lg" 
            : "bg-gradient-to-r from-secondary/40 via-card to-background border-border/70"
        }`}>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>
                {masteryScore >= 80 
                  ? "🎯 Lesson Mastered — Ready for the Workbench!" 
                  : "🛠️ Weekly Client Simulation Workbench (Open All Week)"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Practice applying what you learn in the live interactive client workbench: <strong>{simulationName}</strong>
            </p>
          </div>

          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 shadow-md">
            <Link href={simulationLink}>
              <Play className="h-3 w-3 mr-1.5 fill-current" />
              <span>Open Simulation Workbench</span>
              <ArrowRight className="h-3 w-3 ml-1.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SocraticChatClassroom;

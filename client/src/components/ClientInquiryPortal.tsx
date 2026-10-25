import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Send,
  Coffee,
  Sparkles,
  Loader2,
  Edit3
} from "lucide-react";
import { useClientAgency } from "@/context/ClientAgencyContext";

interface Message {
  id: string;
  sender: "client" | "marketer";
  text: string;
  timestamp: string;
  qualityBadge?: string;
}

export function ClientInquiryPortal() {
  const { client } = useClientAgency();
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [rapportScore, setRapportScore] = useState(90);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "client",
      text: "Hi! Welcome to the roastery account. Our walk-in cafe in Morgantown has lines out the door every weekend, but our online store is bleeding cash on Google Ads—we're paying $2.85 a click and 84% of visitors bounce off our homepage in under 4 seconds.\n\nBefore you change anything, I have a question for you: Looking at our current headline 'Coffee Beans For Sale', why do you think visitors are bouncing without buying?",
      timestamp: "Today, 9:00 AM",
      qualityBadge: "Client Question for You"
    }
  ]);

  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([
    "Your headline is too generic—it sounds like cheap supermarket coffee and hides your 48-hour fresh roast guarantee.",
    "What is your gross margin and break-even CPA so we can calculate a safe ad budget?",
    "We need a low-friction welcome offer like 15% off to give first-time buyers a reason to try a bag."
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        scrollToBottom();
        textareaRef.current?.focus();
      }, 150);
    }
  }, [open, messages]);

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || inputText).trim();
    if (!question || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "marketer",
      text: question,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/client/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question })
      });

      if (!res.ok) throw new Error("Inquiry request failed");
      const data = await res.json();

      let fullText = data.reply;
      if (data.followUpQuestion) {
        fullText += `\n\n💬 Jenny's Follow-up Question:\n"${data.followUpQuestion}"`;
      }

      const clientReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "client",
        text: fullText,
        timestamp: "Just now",
        qualityBadge: data.qualityBadge || undefined
      };

      if (data.rapportChange) {
        setRapportScore(prev => Math.max(50, Math.min(100, prev + data.rapportChange)));
      }

      if (Array.isArray(data.suggestedReplies) && data.suggestedReplies.length > 0) {
        setSuggestedReplies(data.suggestedReplies);
      }

      setMessages(prev => [...prev, clientReply]);
    } catch (err) {
      // Graceful fallback
      const fallbackReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "client",
        text: "Thanks for that thoughtful input! Our 48-hour roast freshness is our pride and joy. Let's make sure our headline test in the A/B Lab reflects that.\n\n💬 Jenny's Follow-up Question:\n\"What target CPA should we set on our Google Search campaign?\"",
        timestamp: "Just now"
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1.5 px-2.5 border-border bg-card hover:bg-secondary ml-1"
        >
          <MessageSquare className="h-3.5 w-3.5 text-primary" />
          <span>Message Client</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl w-[95vw] sm:w-full h-[90vh] sm:h-[82vh] max-h-[700px] flex flex-col p-0 overflow-hidden bg-card border-border shadow-2xl">
        {/* Header with Client Info (Pinned Top) */}
        <DialogHeader className="p-3.5 sm:p-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center font-bold">
                  <Coffee className="h-5 w-5" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background"></span>
              </div>
              <div>
                <DialogTitle className="text-sm font-bold flex items-center gap-2">
                  <span>Jenny Miller</span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                    Founder & Master Roaster
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Jenny's Artisan Java & Roastery • Morgantown, WV • Online Store: Active
                </DialogDescription>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Client Rapport</span>
              <span className={`text-xs font-bold ${rapportScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {rapportScore}% (Excellent)
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Message Thread Area (Scrollable Middle) */}
        <div className="flex-1 min-h-0 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-background/50 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "marketer" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-muted-foreground">
                <span>{m.sender === "marketer" ? "You (Account Executive)" : "Jenny Miller"}</span>
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed text-xs shadow-sm ${
                  m.sender === "marketer"
                    ? "bg-primary text-primary-foreground rounded-br-xs"
                    : "bg-card border border-border text-foreground rounded-bl-xs"
                }`}
              >
                {m.text}
              </div>

              {m.qualityBadge && (
                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-500 font-medium">
                  <Sparkles className="h-3 w-3" />
                  <span>{m.qualityBadge}</span>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Jenny is reviewing your response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Presets */}
        <div className="p-2.5 sm:p-3 bg-secondary/30 border-t border-border space-y-1.5 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Suggested Strategic Replies:</span>
            </div>
            <span className="text-[10px] text-muted-foreground/80 font-normal">Click reply to send directly, or edit below</span>
          </div>
          <div className="flex flex-col gap-1 max-h-[105px] overflow-y-auto pr-1">
            {suggestedReplies.map((replyText, idx) => (
              <div key={idx} className="flex items-center gap-1.5 w-full">
                <button
                  type="button"
                  disabled={isTyping}
                  className="flex-1 text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-card hover:bg-secondary/80 border border-border/80 text-foreground transition-all hover:border-primary/40 disabled:opacity-50 cursor-pointer truncate"
                  onClick={() => handleSend(replyText)}
                  title={replyText}
                >
                  👉 {replyText}
                </button>
                <button
                  type="button"
                  disabled={isTyping}
                  className="shrink-0 text-[10px] px-2 py-1.5 rounded-lg bg-secondary hover:bg-secondary/90 border border-border/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer font-medium flex items-center gap-1"
                  onClick={() => {
                    setInputText(replyText);
                    textareaRef.current?.focus();
                  }}
                  title="Copy into message box to edit"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area (Pinned Bottom) */}
        <div className="p-3 border-t border-border bg-card flex items-center gap-2 shrink-0">
          <Textarea
            ref={textareaRef}
            id="client-inquiry-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your strategic reply or question for Jenny..."
            rows={1}
            className="text-xs resize-none min-h-[40px] max-h-[80px] py-2 bg-background border-input focus-visible:ring-1 focus-visible:ring-primary flex-1"
            autoFocus
          />
          <Button
            size="sm"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
            className="h-[40px] px-3.5 shrink-0 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm cursor-pointer"
          >
            {isTyping ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            <span>Send</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

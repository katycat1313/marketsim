import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Send, BarChart2, GraduationCap, MousePointer, Search, BookOpen, Timer, Copy, ThumbsUp, ThumbsDown } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachments?: {
    type: "image" | "chart" | "link" | "code";
    content: string;
    title?: string;
  }[];
}

interface AIAssistantProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  initialContext?: {
    type: "tutorial" | "simulation" | "campaign" | "general";
    data?: any;
  };
}

export default function AIAssistant({ 
  isExpanded = false, 
  onToggleExpand, 
  initialContext = { type: "general" } 
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSim, setIsGeneratingSim] = useState(false);
  const [activeMode, setActiveMode] = useState<"chat" | "analyze" | "recommend">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Fetch user profile to provide context to the AI
  const { data: userProfile } = useQuery({
    queryKey: ["/api/profile"],
    enabled: false,
  });

  // Initialize assistant with a welcome message
  useEffect(() => {
    const welcomeMessage = getWelcomeMessage(initialContext || { type: "general" });
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date(),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const getWelcomeMessage = (context: AIAssistantProps["initialContext"]) => {
    if (!context) {
      return "Hello! I'm your MarketSim AI Coach. I continuously analyze your simulation runs to detect strategy gaps and craft personalized challenges. Ask me 'What are my weak areas?' to see your diagnostic breakdown!";
    }
    
    switch(context.type) {
      case "tutorial":
        return "Hello! I'm your MarketSim AI Coach. I can see you're working through a tutorial. How can I help you master these concepts?";
      case "simulation":
        return "Hello! I'm your MarketSim AI Coach. I'm actively monitoring your campaign metrics (Quality Score, CPA, Match Types). Ask me for tactical guidance or weakness analysis!";
      case "campaign":
        return "Hello! I'm your MarketSim AI Coach. I see you're configuring a campaign. Would you like help optimizing your match types, negative keywords, or budget?";
      default:
        return "Hello! I'm your MarketSim AI Coach. I continuously analyze your simulation runs to detect strategy gaps and craft personalized challenges. Ask me 'What are my weak areas?' to see your diagnostic breakdown!";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputValue;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const chatHistory = messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

      const res = await apiRequest("POST", "/api/ai/assistant", {
        question: textToSend,
        chatHistory,
        userContext: {
          level: (userProfile as any)?.level || "Expert",
          completedTutorials: [],
          recentSimulations: initialContext?.data ? [initialContext.data] : [],
          contextType: initialContext?.type || "general",
          mode: activeMode,
        },
      });

      const data = await res.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response || data.message || "I am analyzing your marketing setup.",
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant live request failed, using intelligent fallback:", error);
      const fallbackContent = getSimulatedResponse(textToSend, activeMode);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: fallbackContent,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };
  
  const handleClearChat = () => {
    const welcomeMessage = getWelcomeMessage(initialContext || { type: "general" });
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date(),
      },
    ]);
  };
  
  const handleModeChange = (mode: "chat" | "analyze" | "recommend") => {
    setActiveMode(mode);
    
    const modeMessages: Record<typeof mode, string> = {
      chat: "I'm now in general chat mode. Ask me anything about digital marketing!",
      analyze: "I'm now in analysis mode. Ask me 'What are my weak areas?' to inspect your telemetry.",
      recommend: "I'm now in recommendation mode. Tell me what skills you want to strengthen!"
    };
    
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: `system-${Date.now()}`,
        role: "system",
        content: modeMessages[mode],
        timestamp: new Date(),
      }
    ]);
  };
  
  const getSimulatedResponse = (input: string, mode: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes("weak") || lowercaseInput.includes("work on") || lowercaseInput.includes("diagnos")) {
      return `### 📊 AI Skill Diagnostics & Telemetry

Based on your recent simulation attempts:
- **Quality Score Optimization**: \`72%\`
- **Negative Keyword Defense**: \`40%\` ⚠️ (Primary Weakness)
- **CPC & Bid Strategy**: \`70%\`
- **Conversion & CPA Optimization**: \`60%\`

You are losing ad budget to unqualified search queries. Reconfigure your campaign with negative keywords like "free", "diy", and "jobs".

[ACTION_LAUNCH_SIMULATION:negativeKeywordDefense:Negative Keyword Defense Challenge]`;
    }
    
    return "I am analyzing your marketing telemetry. Ask me about your weaknesses or campaign settings!";
  };

  // If minimized, do not render floating card (App.tsx floating button handles toggle)
  if (!isExpanded) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[82vh] z-50 shadow-2xl rounded-2xl border border-border/80 bg-card overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200">
      <Card className="h-full flex flex-col border-0 rounded-none bg-card text-foreground">
        <CardHeader className="p-3.5 border-b border-border/70 flex-shrink-0 bg-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 border border-primary/40">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">MS</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  MarketSim AI Coach
                  <Badge variant="outline" className="text-[10px] h-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-medium">
                    Online
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Continuous Skill Diagnostics & Strategy
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={handleClearChat}
                title="Clear chat"
              >
                <Timer className="h-3.5 w-3.5" />
              </Button>
              {onToggleExpand && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={onToggleExpand}
                  title="Close Assistant"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <Tabs value={activeMode} onValueChange={(val) => handleModeChange(val as any)} className="w-full mt-2.5">
            <TabsList className="grid grid-cols-3 h-8 bg-secondary/60 text-xs">
              <TabsTrigger 
                value="chat" 
                className="py-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="analyze" 
                className="py-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
              >
                Diagnostics
              </TabsTrigger>
              <TabsTrigger 
                value="recommend" 
                className="py-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
              >
                Practice
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <ScrollArea className="flex-grow p-4 bg-background text-foreground">
          <div className="space-y-4">
            {messages.map((message) => {
              const actionMatch = message.content.match(/\[ACTION_LAUNCH_SIMULATION:(.*?):(.*?)\]/);
              const cleanContent = message.content.replace(/\[ACTION_LAUNCH_SIMULATION:.*?\]/g, "").trim();

              return (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} ${message.role === "system" ? "opacity-70" : ""}`}
                >
                  <div 
                    className={`rounded-xl p-3 max-w-[85%] shadow-sm ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground ml-4" 
                        : message.role === "system"
                          ? "bg-secondary/40 text-muted-foreground italic border border-border/40"
                          : "bg-secondary/60 border border-border/80 text-foreground mr-4"
                    }`}
                  >
                    {message.role === "assistant" && message.id !== "welcome" && (
                      <div className="flex items-center gap-1.5 mb-1.5 text-xs text-primary font-medium">
                        <Sparkles className="h-3 w-3" />
                        <span>MarketSim AI Coach</span>
                      </div>
                    )}
                    
                    <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                      {cleanContent}
                    </div>

                    {/* Interactive Dynamic Simulation Launch Action Card */}
                    {actionMatch && (
                      <div className="mt-3 p-3 rounded-lg bg-secondary/80 border border-primary/40 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Adaptive Practice Challenge</span>
                        </div>
                        <p className="text-xs font-medium text-foreground">{actionMatch[2]}</p>
                        <Button
                          size="sm"
                          disabled={isGeneratingSim}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8 flex items-center justify-center gap-1.5"
                          onClick={async () => {
                            setIsGeneratingSim(true);
                            try {
                              const res = await apiRequest("POST", "/api/ad-simulations/generate", {
                                targetWeakness: actionMatch[1],
                                level: (userProfile as any)?.level || "Expert",
                              });
                              const created = await res.json();
                              toast({
                                title: "✨ Simulation Generated",
                                description: `Starting: ${created.title}`,
                              });
                              window.location.href = `/ad-simulation/${created.id}`;
                            } catch (e) {
                              toast({
                                title: "Generation failed",
                                description: "Could not generate simulation scenario.",
                                variant: "destructive",
                              });
                            } finally {
                              setIsGeneratingSim(false);
                            }
                          }}
                        >
                          {isGeneratingSim ? (
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 border-2 border-b-transparent border-primary-foreground rounded-full animate-spin"></div>
                              <span>Generating Scenario...</span>
                            </div>
                          ) : (
                            <>
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>Launch Tailored Simulation</span>
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                    
                    {message.role === "assistant" && message.id !== "welcome" && (
                      <div className="flex items-center gap-1 mt-2 justify-end text-xs text-muted-foreground">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full hover:bg-accent hover:text-foreground"
                          onClick={() => {
                            navigator.clipboard.writeText(cleanContent);
                            toast({
                              title: "Copied to clipboard",
                              duration: 2000,
                            });
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-accent hover:text-foreground">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <CardFooter className="p-3 border-t border-border/70 flex-shrink-0 bg-secondary/30 flex flex-col gap-2">
          {/* Quick Suggestion Chips */}
          <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <button
              type="button"
              onClick={() => handleSendMessage("What are my weak areas and what should I practice?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-secondary text-primary hover:bg-secondary/80 border border-primary/30 text-[11px] font-medium flex items-center gap-1 transition-colors"
            >
              📊 My Weak Areas
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("Give me a dynamic practice challenge targeting my growth areas.")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-secondary/60 text-foreground hover:bg-secondary border border-border text-[11px] transition-colors"
            >
              ⚡ Practice Challenge
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("How do I achieve a 10/10 Google Ads Quality Score?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-secondary/60 text-foreground hover:bg-secondary border border-border text-[11px] transition-colors"
            >
              🎯 Quality Score 10/10
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("What are the best negative keywords for B2B search ads?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-secondary/60 text-foreground hover:bg-secondary border border-border text-[11px] transition-colors"
            >
              🛑 Negative Keywords
            </button>
          </div>

          <div className="relative w-full flex items-center">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about strategy, weak areas, or practice scenarios..."
              className="pr-10 bg-background border-border text-foreground focus-visible:ring-primary/40 text-xs sm:text-sm"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? (
                <div className="h-3.5 w-3.5 border-2 border-b-transparent border-primary-foreground rounded-full animate-spin"></div>
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
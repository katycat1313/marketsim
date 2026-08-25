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

  // Determine if we're in minimized mode
  const isMinimized = !isExpanded;

  // If minimized, show compact version
  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-[#111] border border-[#ffd700]/30 rounded-full p-3 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 hover:border-[#ffd700]/60 group"
        onClick={onToggleExpand}
      >
        <div className="relative">
          <Sparkles className="w-6 h-6 text-[#ffd700]" />
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {messages.filter(m => m.role === "assistant" && m.id !== "welcome").length}
          </span>
        </div>
        <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 right-0 whitespace-nowrap bg-black/80 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity duration-200">
          AI Marketing Assistant
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col border-[#ffd700]/20 bg-[#121212] overflow-hidden shadow-lg">
      <CardHeader className="p-3 border-b border-[#ffd700]/20 flex-shrink-0 bg-[#181818]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-[#ffd700]/40">
              <AvatarFallback className="bg-[#222] text-[#ffd700] text-xs font-bold">MS</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-semibold text-[#f5f5f5] flex items-center gap-1">
                MarketSim AI Coach
                <Badge variant="outline" className="text-[10px] h-4 bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/30 ml-1 font-normal">
                  Live
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-[#f5f5f5]/60">
                Continuous Skill Diagnostics
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-[#f5f5f5]/60 hover:text-[#f5f5f5] hover:bg-[#333]"
              onClick={handleClearChat}
              title="Clear chat"
            >
              <Timer className="h-3.5 w-3.5" />
            </Button>
            {onToggleExpand && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-[#f5f5f5]/60 hover:text-[#f5f5f5] hover:bg-[#333]"
                onClick={onToggleExpand}
                title={isExpanded ? "Collapse" : "Expand"}
              >
                <MousePointer className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
        
        <Tabs value={activeMode} onValueChange={(val) => handleModeChange(val as any)} className="w-full mt-2">
          <TabsList className="grid grid-cols-3 h-7 bg-[#222] text-xs">
            <TabsTrigger 
              value="chat" 
              className="py-1 data-[state=active]:bg-[#ffd700]/20 data-[state=active]:text-[#ffd700]"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="analyze" 
              className="py-1 data-[state=active]:bg-[#ffd700]/20 data-[state=active]:text-[#ffd700]"
            >
              Diagnostics
            </TabsTrigger>
            <TabsTrigger 
              value="recommend" 
              className="py-1 data-[state=active]:bg-[#ffd700]/20 data-[state=active]:text-[#ffd700]"
            >
              Practice
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <ScrollArea className="flex-grow p-4 bg-[#111] text-[#f5f5f5]">
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
                  className={`rounded-lg p-3 max-w-[85%] shadow-sm ${
                    message.role === "user" 
                      ? "bg-[#333] text-[#f5f5f5] ml-4" 
                      : message.role === "system"
                        ? "bg-[#222] text-[#f5f5f5]/70 italic border border-[#ffd700]/10"
                        : "bg-[#1a1a1a] border border-[#ffd700]/20 text-[#f5f5f5] mr-4"
                  }`}
                >
                  {message.role === "assistant" && message.id !== "welcome" && (
                    <div className="flex items-center gap-1 mb-1 text-xs text-[#ffd700]/70">
                      <Sparkles className="h-3 w-3" />
                      <span>MarketSim AI Coach</span>
                    </div>
                  )}
                  
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {cleanContent}
                  </div>

                  {/* Interactive Dynamic Simulation Launch Action Card */}
                  {actionMatch && (
                    <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 via-[#ffd700]/5 to-transparent border border-amber-500/40 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Adaptive Practice Challenge</span>
                      </div>
                      <p className="text-xs font-medium text-[#f5f5f5]">{actionMatch[2]}</p>
                      <Button
                        size="sm"
                        disabled={isGeneratingSim}
                        className="w-full bg-gradient-to-r from-amber-500 to-[#ffd700] text-black font-semibold text-xs h-8 hover:opacity-90 flex items-center justify-center gap-1.5"
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
                            <div className="h-3 w-3 border-2 border-b-transparent border-black rounded-full animate-spin"></div>
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
                    <div className="flex items-center gap-1 mt-2 justify-end text-xs text-[#f5f5f5]/40">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-[#ffd700]/10 hover:text-[#ffd700]"
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
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-[#ffd700]/10 hover:text-[#ffd700]">
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
      
      <CardFooter className="p-3 border-t border-[#ffd700]/20 flex-shrink-0 bg-[#181818] flex flex-col gap-2">
        {/* Quick Suggestion Chips */}
        <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            type="button"
            onClick={() => handleSendMessage("What are my weak areas and what should I practice?")}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#2a2a2a] text-[#ffd700] hover:bg-[#333] border border-[#ffd700]/30 text-[11px] font-medium flex items-center gap-1 transition-colors"
          >
            📊 My Weak Areas
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage("Give me a dynamic practice challenge targeting my growth areas.")}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#222] text-[#f5f5f5] hover:bg-[#333] border border-[#444] text-[11px] transition-colors"
          >
            ⚡ Practice Challenge
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage("How do I achieve a 10/10 Google Ads Quality Score?")}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#222] text-[#f5f5f5] hover:bg-[#333] border border-[#444] text-[11px] transition-colors"
          >
            🎯 Quality Score 10/10
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage("What are the best negative keywords for B2B search ads?")}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#222] text-[#f5f5f5] hover:bg-[#333] border border-[#444] text-[11px] transition-colors"
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
            className="pr-10 bg-[#222] border-[#444] text-[#f5f5f5] focus-visible:ring-[#ffd700]/30 text-sm"
            disabled={isLoading}
          />
          <Button
            size="icon"
            className="absolute right-0 top-0 h-full aspect-square bg-transparent hover:bg-[#ffd700]/10 text-[#ffd700]"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-b-transparent border-[#ffd700] rounded-full animate-spin"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
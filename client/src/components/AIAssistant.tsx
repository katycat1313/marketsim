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
  const [activeMode, setActiveMode] = useState<"chat" | "analyze" | "recommend">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Fetch user profile to provide context to the AI
  const { data: userProfile } = useQuery({
    queryKey: ["/api/profile"],
    enabled: false, // Disable auto-fetching until we're ready to implement this
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
  }, [initialContext]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const getWelcomeMessage = (context: AIAssistantProps["initialContext"]) => {
    if (!context) {
      return "Hello! I'm your Marketing AI Assistant. I can help you with marketing strategy, data analysis, learning resources, and more. What would you like to know?";
    }
    
    switch(context.type) {
      case "tutorial":
        return "Hello! I'm your Marketing AI Assistant. I can see you're working through a tutorial. How can I help you understand these concepts better?";
      case "simulation":
        return "Hello! I'm your Marketing AI Assistant. I notice you're working on a simulation. Would you like tips on optimizing your strategy or help interpreting your results?";
      case "campaign":
        return "Hello! I'm your Marketing AI Assistant. I see you're working on a campaign. Would you like help optimizing your targeting, creative, or budget allocation?";
      default:
        return "Hello! I'm your Marketing AI Assistant. I can help you with marketing strategy, data analysis, learning resources, and more. What would you like to know?";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // In a real implementation, we would call the AI API here
      // For now, let's simulate a response
      
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: getSimulatedResponse(inputValue, activeMode),
          timestamp: new Date(),
        };
        
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
        setIsLoading(false);
      }, 1500);
      
      // Example of how we would call the API in production:
      /*
      const response = await apiRequest({
        url: "/api/assistant",
        method: "POST",
        body: {
          message: inputValue,
          context: initialContext,
          mode: activeMode,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }
      });
      
      if (response) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.content,
          timestamp: new Date(),
          attachments: response.attachments,
        };
        
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      }
      */
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response from the assistant. Please try again.",
        variant: "destructive",
      });
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
    // Reset to just the welcome message
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
    
    // Add a system message indicating the mode change
    const modeMessages: Record<typeof mode, string> = {
      chat: "I'm now in general chat mode. Ask me anything about digital marketing!",
      analyze: "I'm now in analysis mode. Share your data or campaign metrics, and I'll help you interpret them.",
      recommend: "I'm now in recommendation mode. Tell me about your marketing goals, and I'll suggest strategies."
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
  
  // This function simulates AI responses for demo purposes
  // In production, this would be replaced with actual AI API calls
  const getSimulatedResponse = (input: string, mode: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    // Generic responses based on detected keywords
    if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi ")) {
      return "Hello! How can I help with your marketing efforts today?";
    }
    
    if (lowercaseInput.includes("thank")) {
      return "You're welcome! Is there anything else you'd like to know?";
    }
    
    // Mode-specific responses
    if (mode === "analyze") {
      if (lowercaseInput.includes("conversion") || lowercaseInput.includes("rate")) {
        return "Looking at conversion data is crucial. A good approach is to segment your conversion rates by traffic source, device type, and user demographics. This helps identify where optimization will have the biggest impact. Would you like me to explain how to improve conversion rates for a specific channel?";
      }
      
      if (lowercaseInput.includes("roi") || lowercaseInput.includes("return on investment")) {
        return "ROI analysis should consider both short-term returns and long-term customer value. Make sure you're accounting for customer acquisition costs, lifetime value, and attribution across multiple touchpoints. What specific aspect of ROI calculation are you struggling with?";
      }
      
      return "To properly analyze your data, I'd need some specific metrics or KPIs you're tracking. Could you share some numbers like conversion rates, traffic sources, engagement rates, or ROI figures?";
    }
    
    if (mode === "recommend") {
      if (lowercaseInput.includes("social media") || lowercaseInput.includes("facebook") || lowercaseInput.includes("instagram")) {
        return "For social media strategy, I recommend focusing on these key elements:\n\n1. Content pillars: Develop 3-5 consistent themes\n2. Platform selection: Focus on platforms where your audience is most active\n3. Engagement strategy: Create a mix of promotional (20%) and value-adding content (80%)\n4. Posting schedule: Maintain consistent frequency based on platform best practices\n5. Community management: Respond to comments within 24 hours\n\nWould you like more specific recommendations for a particular platform?";
      }
      
      if (lowercaseInput.includes("email") || lowercaseInput.includes("newsletter")) {
        return "For email marketing optimization, consider these recommendations:\n\n1. Segmentation: Break your list into interest-based and behavior-based segments\n2. Personalization: Use dynamic content based on user behavior\n3. Testing: A/B test subject lines, call-to-action placement, and send times\n4. Automation: Set up welcome sequences, abandoned cart emails, and re-engagement campaigns\n5. Mobile optimization: Ensure emails display properly on all devices\n\nWhat specific aspect of email marketing are you focusing on?";
      }
      
      return "I'd be happy to provide recommendations. To give you the most relevant advice, could you tell me more about your specific marketing goals, target audience, and which channels you're currently using?";
    }
    
    // Default chat mode responses
    if (lowercaseInput.includes("seo") || lowercaseInput.includes("search engine")) {
      return "SEO best practices are constantly evolving, but the fundamentals remain: high-quality content that satisfies user intent, technical optimization for crawlability, and authoritative backlinks. What specific aspect of SEO are you interested in learning more about?";
    }
    
    if (lowercaseInput.includes("ppc") || lowercaseInput.includes("ads") || lowercaseInput.includes("google ads")) {
      return "Successful PPC campaigns require careful keyword selection, compelling ad copy, optimized landing pages, and continuous testing. Are you looking for help with campaign structure, bidding strategies, or creative optimization?";
    }
    
    if (lowercaseInput.includes("content") || lowercaseInput.includes("blog")) {
      return "Content marketing should focus on providing value at each stage of the customer journey. Start by mapping content to specific funnel stages, from awareness (educational content) to consideration (comparison content) to decision (promotional content). What type of content are you currently creating?";
    }
    
    // Generic fallback response
    return "That's an interesting question about marketing. To give you the most helpful response, could you provide a bit more context or detail about what you're trying to accomplish?";
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
    <Card className="fixed bottom-4 right-4 w-96 h-[520px] shadow-lg bg-[#111] border border-[#ffd700]/30 flex flex-col overflow-hidden">
      <CardHeader className="p-4 border-b border-[#ffd700]/20 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-gradient-to-br from-[#ffd700] to-amber-600">
              <AvatarFallback>AI</AvatarFallback>
              <AvatarImage src="/ai-assistant-avatar.png" />
            </Avatar>
            <div>
              <CardTitle className="text-md text-[#ffd700]">Marketing AI</CardTitle>
              <CardDescription className="text-xs text-[#f5f5f5]/60">Powered by Digital Zoom</CardDescription>
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:bg-[#ffd700]/10 text-[#f5f5f5]/60"
              onClick={handleClearChat}
            >
              <Timer className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:bg-[#ffd700]/10 text-[#f5f5f5]/60"
              onClick={onToggleExpand}
            >
              <span className="sr-only">Minimize</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="chat" className="mt-2" onValueChange={(value) => handleModeChange(value as any)}>
          <TabsList className="w-full grid grid-cols-3 h-8 bg-[#222] p-0.5">
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
              Analyze
            </TabsTrigger>
            <TabsTrigger 
              value="recommend" 
              className="py-1 data-[state=active]:bg-[#ffd700]/20 data-[state=active]:text-[#ffd700]"
            >
              Recommend
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <ScrollArea className="flex-grow p-4 bg-[#111] text-[#f5f5f5]">
        <div className="space-y-4">
          {messages.map((message) => (
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
                    <span>AI Assistant</span>
                  </div>
                )}
                
                <div className="whitespace-pre-line">
                  {message.content}
                </div>
                
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div 
                        key={`${message.id}-attachment-${index}`}
                        className="p-2 bg-[#222] rounded border border-[#444] text-sm"
                      >
                        {attachment.type === "image" && (
                          <img 
                            src={attachment.content} 
                            alt={attachment.title || "Attachment"} 
                            className="max-w-full rounded"
                          />
                        )}
                        
                        {attachment.type === "link" && (
                          <a 
                            href={attachment.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                            {attachment.title || attachment.content}
                          </a>
                        )}
                        
                        {attachment.type === "code" && (
                          <div className="relative">
                            <pre className="text-xs p-2 bg-[#333] rounded overflow-x-auto">
                              {attachment.content}
                            </pre>
                            <Button 
                              size="icon"
                              variant="ghost"
                              className="absolute top-1 right-1 h-6 w-6 opacity-70 hover:opacity-100"
                              onClick={() => {
                                navigator.clipboard.writeText(attachment.content);
                                toast({
                                  title: "Copied to clipboard",
                                  duration: 2000,
                                });
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {message.role === "assistant" && message.id !== "welcome" && (
                  <div className="flex items-center gap-1 mt-2 justify-end text-xs text-[#f5f5f5]/40">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full hover:bg-[#ffd700]/10 hover:text-[#ffd700]"
                      onClick={() => {
                        navigator.clipboard.writeText(message.content);
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
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-[#ffd700]/10 hover:text-red-500">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <CardFooter className="p-3 border-t border-[#ffd700]/20 flex-shrink-0 bg-[#181818]">
        <div className="relative w-full flex items-center">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about marketing strategies..."
            className="pr-10 bg-[#222] border-[#444] text-[#f5f5f5] focus-visible:ring-[#ffd700]/30"
            disabled={isLoading}
          />
          <Button
            size="icon"
            className="absolute right-0 top-0 h-full aspect-square bg-transparent hover:bg-[#ffd700]/10 text-[#ffd700]"
            onClick={handleSendMessage}
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
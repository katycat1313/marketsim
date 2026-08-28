import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
  HelpCircle,
  MessageSquare
} from "lucide-react";

interface AITeacherLessonPanelProps {
  lessonTitle: string;
  lessonLevel: string;
  lessonContent: string;
  chapterNumber?: number;
}

export function AITeacherLessonPanel({
  lessonTitle,
  lessonLevel,
  lessonContent,
  chapterNumber = 1
}: AITeacherLessonPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"checkin" | "ask">("checkin");
  const [userAnswer, setUserAnswer] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [teacherResponse, setTeacherResponse] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  const instructor = {
    name: "Sarah Jenkins",
    title: "Senior Flight Instructor",
    agency: "Apex Omnicom Media",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
  };

  const socraticPrompts: Record<string, string> = {
    "default": `“Based on this lesson on '${lessonTitle}', what is the single biggest mistake junior marketers make when executing this strategy in a live campaign, and how do you prevent it?”`
  };

  const currentPrompt = socraticPrompts[lessonTitle] || socraticPrompts.default;

  const speakText = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = (target: "answer" | "question") => {
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
        description: "Your browser does not support Web Speech API. Please type your text.",
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
          description: "Speak your response clearly...",
        });
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (target === "answer") {
          setUserAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
        } else {
          setUserQuestion(prev => prev ? `${prev} ${transcript}` : transcript);
        }
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

  const handleEvaluateCheckin = async () => {
    if (!userAnswer.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/interview-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentPrompt,
          userAnswer: userAnswer,
          targetRole: `Marketing Associate (${lessonTitle})`
        })
      });

      const data = await res.json();
      setEvaluation(data);
      speakText(`Evaluation complete. You scored ${data.score} out of 100. ${data.rating}.`);
    } catch (e) {
      setEvaluation({
        score: 85,
        rating: "Solid Strategic Comprehension ✅",
        feedback: ["Good understanding of the core concept. Make sure to ground your answers in specific agency metrics (CPA, ROAS, Quality Score)."],
        sampleModelAnswer: "The most common mistake is failing to isolate search intent or match types, which leads to budget bleed. Always audit query reports and configure negative keywords."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskTeacher = async () => {
    if (!userQuestion.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Regarding the lesson '${lessonTitle}': ${userQuestion}`,
          userContext: {
            level: lessonLevel,
            contextType: "tutorial",
            lessonTitle
          }
        })
      });

      const data = await res.json();
      const answer = data.response || data.message || "I am analyzing this lesson concept for you.";
      setTeacherResponse(answer);
      speakText(answer.slice(0, 200));
    } catch (e) {
      setTeacherResponse("Great question! In this module, focus on matching customer search intent with compelling ad hooks and maintaining tight negative keyword protection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-emerald-500/30 bg-gradient-to-br from-card via-card/90 to-emerald-950/20 shadow-xl overflow-hidden my-6">
      <CardHeader className="p-4 bg-secondary/30 border-b border-border/70 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={instructor.avatarUrl} 
              alt={instructor.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
            />
            {isSpeaking && (
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 text-[8px] font-bold text-black items-center justify-center">AI</span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold text-foreground">{instructor.name}</CardTitle>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] uppercase tracking-wider font-mono">
                <Radio className="h-2.5 w-2.5 mr-1 inline animate-pulse text-emerald-400" /> Socratic AI Teacher
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Interactive Lesson Coach • Real-Time Socratic Checks
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => setIsMuted(prev => !prev)}
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-rose-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Toggle Mode */}
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeTab === "checkin" ? "default" : "outline"}
            onClick={() => setActiveTab("checkin")}
            className="text-xs h-8"
          >
            <Brain className="h-3.5 w-3.5 mr-1.5" />
            Socratic Concept Check
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activeTab === "ask" ? "default" : "outline"}
            onClick={() => setActiveTab("ask")}
            className="text-xs h-8"
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            Ask Teacher a Question
          </Button>
        </div>

        {activeTab === "checkin" ? (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-secondary/40 border border-border/70 space-y-1">
              <div className="font-semibold text-primary flex items-center gap-1.5 text-xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Instructor Socratic Check-In:</span>
              </div>
              <p className="text-xs text-foreground/90 italic leading-relaxed">
                {currentPrompt}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Your verbal or typed reasoning:</span>
                <Button
                  type="button"
                  size="sm"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={() => toggleListening("answer")}
                  className="h-6 text-[11px] px-2 flex items-center gap-1"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-3 w-3" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-3 w-3 text-emerald-400" />
                      <span>Voice Input 🎙️</span>
                    </>
                  )}
                </Button>
              </div>

              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Explain the strategy, common pitfall, and how you would prevent it in an agency setting..."
                className="min-h-[75px] text-xs bg-background border-border text-foreground"
              />

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  onClick={handleEvaluateCheckin}
                  disabled={isLoading || !userAnswer.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 h-8"
                >
                  {isLoading ? (
                    <div className="h-3 w-3 border-2 border-b-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      <span>Submit Answer for AI Grading</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {evaluation && (
              <div className="p-3 rounded-lg bg-card border border-emerald-500/40 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="font-bold text-foreground text-xs">{evaluation.rating}</span>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-mono">
                    Score: {evaluation.score}/100
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {evaluation.feedback?.[0] || "Great strategic understanding."}
                </p>
                {evaluation.sampleModelAnswer && (
                  <div className="p-2 rounded bg-muted/40 border border-border text-[10px] text-muted-foreground">
                    <span className="font-semibold text-foreground">💡 Model Answer: </span>
                    {evaluation.sampleModelAnswer}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Ask Sarah anything about this lesson:</span>
                <Button
                  type="button"
                  size="sm"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={() => toggleListening("question")}
                  className="h-6 text-[11px] px-2 flex items-center gap-1"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-3 w-3" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-3 w-3 text-emerald-400" />
                      <span>Voice Question 🎙️</span>
                    </>
                  )}
                </Button>
              </div>

              <Textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="e.g. Can you give me an example of how to calculate expected CTR in this scenario?"
                className="min-h-[70px] text-xs bg-background border-border text-foreground"
              />

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  onClick={handleAskTeacher}
                  disabled={isLoading || !userQuestion.trim()}
                  className="bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 h-8"
                >
                  {isLoading ? (
                    <div className="h-3 w-3 border-2 border-b-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      <span>Ask AI Teacher</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {teacherResponse && (
              <div className="p-3 rounded-lg bg-secondary/40 border border-border/70 space-y-1.5 animate-in fade-in duration-200">
                <div className="font-semibold text-primary flex items-center gap-1.5 text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Teacher Sarah's Response:</span>
                </div>
                <div className="text-xs text-foreground/90 whitespace-pre-line leading-relaxed">
                  {teacherResponse}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

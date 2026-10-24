import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  MessageSquare,
  ShieldCheck,
  Check
} from "lucide-react";
import { getQuizForTutorial, LessonQuestion } from "@/data/lessonQuizzes";

interface StudyGuideQuizProps {
  tutorial: {
    id: number;
    title: string;
    skillsLearned?: string[];
  };
  onPass: () => void;
  isCompleted?: boolean;
  isDev?: boolean;
}

export function StudyGuideQuiz({ tutorial, onPass, isCompleted = false, isDev = false }: StudyGuideQuizProps) {
  const questions = getQuizForTutorial(tutorial.id, tutorial.title, tutorial.skillsLearned);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Reflection state
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);

  // Score tracking
  const [correctCount, setCorrectCount] = useState(0);
  const [recoveryCount, setRecoveryCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOption(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || !currentQ) return;

    const opt = currentQ.options.find(o => o.id === selectedOption);
    const correct = Boolean(opt?.isCorrect);

    setIsSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleSubmitReflection = () => {
    if (!reflectionText.trim()) return;
    setReflectionSubmitted(true);
    // Award 1 recovery credit for thoughtful self-correction
    setRecoveryCount(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(null);
      setReflectionText("");
      setReflectionSubmitted(false);
    } else {
      // Finished all questions
      setQuizFinished(true);
      const totalPoints = correctCount + recoveryCount + (isCorrect ? 1 : 0);
      const finalScore = Math.min(questions.length, totalPoints);
      const passRatio = finalScore / questions.length;
      if (passRatio >= 0.8 || isDev) {
        onPass();
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setReflectionText("");
    setReflectionSubmitted(false);
    setCorrectCount(0);
    setRecoveryCount(0);
    setQuizFinished(false);
  };

  const handleDevAutoPass = () => {
    setCorrectCount(questions.length);
    setQuizFinished(true);
    onPass();
  };

  const effectiveScore = Math.min(questions.length, correctCount + recoveryCount);
  const scorePercent = Math.round((effectiveScore / questions.length) * 100);
  const hasPassed = scorePercent >= 80 || isCompleted;

  // --- FINISHED STATE ---
  if (quizFinished) {
    return (
      <Card className="mt-8 border-2 border-emerald-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl overflow-hidden rounded-2xl">
        <CardHeader className="text-center p-6 pb-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/20">
            <Award className="h-8 w-8 animate-pulse" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            {hasPassed ? "🎉 Lesson Checkpoint Passed!" : "Checkpoint Review Needed"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            {hasPassed
              ? `Outstanding work! You demonstrated mastery with ${scorePercent}% on this lesson's key principles.`
              : `You scored ${scorePercent}%. Review your reflection notes and retry to reach the 80% passing threshold.`}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-2 text-center space-y-4">
          <div className="inline-flex items-center gap-3 p-3 px-5 rounded-xl bg-secondary/30 border border-border/60">
            <div className="text-left">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Final Score</span>
              <span className="text-2xl font-black text-emerald-400">{scorePercent}%</span>
            </div>
            <div className="h-8 w-px bg-border/60" />
            <div className="text-left text-xs space-y-0.5">
              <p className="text-foreground font-semibold">{correctCount} of {questions.length} Correct on 1st Attempt</p>
              {recoveryCount > 0 && (
                <p className="text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> +{recoveryCount} Recovery Credits Earned via Reflection
                </p>
              )}
            </div>
          </div>

          {hasPassed && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium max-w-md mx-auto flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Progress saved to your agency profile. The next lesson is now unlocked!</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 bg-slate-900/50 border-t border-white/5 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetQuiz}
            className="text-xs h-9 border-border hover:bg-secondary flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Checkpoint</span>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // --- ACTIVE QUIZ STATE ---
  return (
    <Card className="mt-8 border border-primary/30 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 shadow-2xl rounded-2xl overflow-hidden">
      <CardHeader className="p-5 sm:p-6 pb-3 border-b border-white/5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/20 text-primary text-xs font-extrabold">
              Q
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Lesson Knowledge Check & Active Reflection
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isDev && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDevAutoPass}
                className="text-[11px] h-6 px-2 font-bold border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                title="Developer Shortcut: Auto-Pass Quiz instantly"
              >
                ⚡ Auto-Pass (Dev QA)
              </Button>
            )}
            <Badge variant="outline" className="text-xs font-mono text-primary border-primary/30 bg-primary/10">
              Question {currentIndex + 1} of {questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-1.5 bg-secondary/50" />

        <h3 className="text-base sm:text-lg font-bold text-foreground mt-4 leading-snug">
          {currentQ.question}
        </h3>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-3">
        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt) => {
            const isChosen = selectedOption === opt.id;
            let optionStyles = "bg-card/40 border-border/70 hover:bg-card/80 text-foreground";

            if (isSubmitted) {
              if (opt.isCorrect) {
                optionStyles = "bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50";
              } else if (isChosen && !opt.isCorrect) {
                optionStyles = "bg-red-500/20 border-red-500 text-red-300 ring-1 ring-red-500/50";
              } else {
                optionStyles = "opacity-50 border-border/40 text-muted-foreground";
              }
            } else if (isChosen) {
              optionStyles = "bg-primary/20 border-primary text-foreground ring-1 ring-primary/60 shadow-md";
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isSubmitted}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${optionStyles}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                  isChosen ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground bg-secondary/40'
                }`}>
                  {opt.id.toUpperCase()}
                </span>
                <span className="flex-1 leading-relaxed">{opt.text}</span>
                {isSubmitted && opt.isCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {isSubmitted && isChosen && !opt.isCorrect && (
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* FEEDBACK & REFLECTION SECTION */}
        {isSubmitted && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3.5 animate-in fade-in duration-300">
            {/* Answer Explanation */}
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Correct Strategic Insight!</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-4 w-4 text-amber-400" />
                    <span>Agency Correction Principle:</span>
                  </>
                )}
              </div>
              <p>{currentQ.explanation}</p>
            </div>

            {/* If Wrong: Active Reflection Prompt */}
            {!isCorrect && (
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <MessageSquare className="h-4 w-4" />
                    <span>Active Reflection (Earn Recovery Credit)</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">
                    +1 Recovery Pt
                  </Badge>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  {currentQ.reflectionPrompt}
                </p>

                {!reflectionSubmitted ? (
                  <div className="space-y-2">
                    <Textarea
                      rows={2}
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder="Write 1–2 sentences explaining what was overlooked or why that approach fails in practice..."
                      className="text-xs bg-slate-950/80 border-border/80 text-foreground placeholder:text-muted-foreground/60"
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        disabled={!reflectionText.trim()}
                        onClick={handleSubmitReflection}
                        className="text-xs h-7 px-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      >
                        Submit Reflection & Claim Credit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span><strong>AI Coach Verified:</strong> Great self-diagnosis. Real marketers analyze why assumptions fail. +1 recovery credit awarded!</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 sm:p-5 bg-slate-900/60 border-t border-white/5 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {!isSubmitted
            ? "Pick the most accurate agency answer above."
            : !isCorrect && !reflectionSubmitted
            ? "Complete the reflection note above to claim recovery credit."
            : "Review the explanation, then advance."}
        </span>

        {!isSubmitted ? (
          <Button
            size="sm"
            disabled={!selectedOption}
            onClick={handleCheckAnswer}
            className="text-xs h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md"
          >
            Check Answer
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleNextQuestion}
            className="text-xs h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md flex items-center gap-1.5"
          >
            <span>{currentIndex + 1 < questions.length ? "Next Question" : "Complete Checkpoint"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

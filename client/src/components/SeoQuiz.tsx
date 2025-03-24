import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, X, Check, HelpCircle, Code, Database, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { seoQuizQuestions } from '../../../server/data/quizzes/seoQuiz';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface QuizQuestion {
  id: number;
  type: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect?: boolean;
    isRelevant?: boolean;
    isNegative?: boolean;
  }[];
  contentSample?: string;
  dataSample?: string;
  matchingItems?: {
    query: string;
    intent: string;
    isCorrect: boolean;
  }[];
  correctMatches?: Record<string, string>;
  explanation: string;
}

export const SeoQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const question = seoQuizQuestions[currentQuestion] as QuizQuestion;
  
  const handleSingleChoice = (optionId: string) => {
    setAnswers({
      ...answers,
      [question.id]: optionId
    });
  };
  
  const handleMultipleChoice = (optionId: string, checked: boolean) => {
    const currentAnswers = answers[question.id] || [];
    let newAnswers;
    
    if (checked) {
      newAnswers = [...currentAnswers, optionId];
    } else {
      newAnswers = currentAnswers.filter((id: string) => id !== optionId);
    }
    
    setAnswers({
      ...answers,
      [question.id]: newAnswers
    });
  };
  
  const handleNext = () => {
    if (currentQuestion < seoQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };
  
  const calculateScore = () => {
    let correctAnswers = 0;
    
    seoQuizQuestions.forEach((q: QuizQuestion) => {
      const userAnswer = answers[q.id];
      
      if (q.type === 'multiple-choice' || q.type === 'content-analysis' || q.type === 'data-analysis') {
        const correctOption = q.options.find(opt => opt.isCorrect)?.id;
        if (userAnswer === correctOption) correctAnswers++;
      } else if (q.type === 'keyword-selection') {
        const relevantOptions = q.options.filter(opt => opt.isRelevant).map(opt => opt.id);
        const correctCount = userAnswer?.filter((id: string) => relevantOptions.includes(id)).length || 0;
        const incorrectCount = userAnswer?.filter((id: string) => !relevantOptions.includes(id)).length || 0;
        
        // Award partial credit for keyword selection
        if (correctCount === relevantOptions.length && incorrectCount === 0) {
          correctAnswers++;
        } else if (correctCount > 0 && incorrectCount === 0) {
          correctAnswers += 0.5;
        }
      } else if (q.type === 'negative-keywords') {
        const negativeOptions = q.options.filter(opt => opt.isNegative).map(opt => opt.id);
        const correctCount = userAnswer?.filter((id: string) => negativeOptions.includes(id)).length || 0;
        const incorrectCount = userAnswer?.filter((id: string) => !negativeOptions.includes(id)).length || 0;
        
        // Award partial credit for negative keywords
        if (correctCount === negativeOptions.length && incorrectCount === 0) {
          correctAnswers++;
        } else if (correctCount > 0 && incorrectCount === 0) {
          correctAnswers += 0.5;
        }
      } else if (q.type === 'keyword-matching') {
        // Not implementing complex matching UI for this example
        // Would require drag-and-drop or selection interface
        correctAnswers += 0.5; // Placeholder
      }
    });
    
    return Math.round((correctAnswers / seoQuizQuestions.length) * 100);
  };
  
  const isAnswered = () => {
    return !!answers[question.id];
  };
  
  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'content-analysis':
        return <Code className="h-5 w-5" />;
      case 'data-analysis':
        return <Database className="h-5 w-5" />;
      case 'keyword-selection':
      case 'negative-keywords':
        return <Search className="h-5 w-5" />;
      default:
        return <HelpCircle className="h-5 w-5" />;
    }
  };
  
  const submitQuizResults = async (score: number) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Submit quiz results to the backend
      await apiRequest('POST', '/api/quiz/complete', {
        quizId: 'seo-fundamentals', // Quiz identifier
        score
      });
      
      toast({
        title: "Quiz results saved",
        description: "Your progress has been updated successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to save quiz results:', error);
      toast({
        title: "Failed to save results",
        description: "There was a problem saving your quiz results. You can still continue.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults) {
    const score = calculateScore();
    
    // Submit quiz results when showing results
    React.useEffect(() => {
      submitQuizResults(score);
    // We only want this to run once when results are shown
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Quiz Results</CardTitle>
          <CardDescription className="text-center">
            You scored {score}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={score} className="h-3" />
            
            <Alert variant={score >= 70 ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {score >= 70 ? "Congratulations!" : "Keep Learning"}
              </AlertTitle>
              <AlertDescription>
                {score >= 70 
                  ? "You've demonstrated a good understanding of SEO concepts."
                  : "Review the material and try again to improve your score."
                }
              </AlertDescription>
            </Alert>
            
            <div className="pt-4">
              <Button 
                onClick={() => { 
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResults(false);
                  setShowExplanation(false);
                }} 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving results..." : "Restart Quiz"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="mb-2">
            {getQuestionIcon(question.type)}
            <span className="ml-1 capitalize">{question.type.replace(/-/g, ' ')}</span>
          </Badge>
          <Badge variant="outline">
            Question {currentQuestion + 1} of {seoQuizQuestions.length}
          </Badge>
        </div>
        <CardTitle>{question.text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Sample Display */}
        {question.contentSample && (
          <div className="bg-muted p-4 rounded-md overflow-x-auto">
            <pre className="text-sm whitespace-pre-wrap">{question.contentSample}</pre>
          </div>
        )}
        
        {/* Data Sample Display */}
        {question.dataSample && (
          <div className="bg-muted p-4 rounded-md overflow-x-auto">
            <pre className="text-sm whitespace-pre-wrap">{question.dataSample}</pre>
          </div>
        )}
        
        <div className="space-y-4">
          {/* Multiple Choice Questions */}
          {['multiple-choice', 'content-analysis', 'data-analysis', 'content-improvement'].includes(question.type) && (
            <RadioGroup 
              value={answers[question.id] || ''} 
              onValueChange={handleSingleChoice}
            >
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 p-3 rounded-md border hover:bg-muted/50">
                  <RadioGroupItem 
                    value={option.id} 
                    id={`option-${option.id}`} 
                  />
                  <Label 
                    htmlFor={`option-${option.id}`}
                    className="flex-grow cursor-pointer"
                  >
                    {option.text}
                  </Label>
                  {showExplanation && option.isCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              ))}
            </RadioGroup>
          )}
          
          {/* Keyword Selection */}
          {['keyword-selection', 'negative-keywords'].includes(question.type) && (
            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = (answers[question.id] || []).includes(option.id);
                const isCorrect = 
                  question.type === 'keyword-selection' ? option.isRelevant : option.isNegative;
                  
                return (
                  <div 
                    key={option.id} 
                    className={`flex items-center space-x-2 p-3 rounded-md border ${
                      isSelected ? 'bg-primary/10 border-primary/30' : 'hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox 
                      id={`option-${option.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        handleMultipleChoice(option.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`option-${option.id}`}
                      className="flex-grow cursor-pointer"
                    >
                      {option.text}
                    </Label>
                    {showExplanation && (
                      isCorrect ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="h-3 w-3 mr-1" />
                          {question.type === 'keyword-selection' ? 'Relevant' : 'Good Negative'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <X className="h-3 w-3 mr-1" />
                          {question.type === 'keyword-selection' ? 'Not Relevant' : 'Not Negative'}
                        </Badge>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Keyword Matching - This would need a more complex UI in a real implementation */}
          {question.type === 'keyword-matching' && (
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <p className="text-yellow-800 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                This question type requires drag-and-drop functionality which is simplified in this demo.
              </p>
              <div className="mt-3 space-y-3">
                {question.matchingItems?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="font-medium">{item.query}</span>
                    <Badge>{item.intent}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Explanation Section */}
        {showExplanation && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Explanation:</h3>
            <p className="text-gray-700">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <div className="flex space-x-2">
          {!showExplanation && (
            <Button 
              variant="secondary"
              onClick={() => setShowExplanation(true)}
              disabled={!isAnswered()}
            >
              Show Explanation
            </Button>
          )}
          <Button 
            onClick={handleNext}
            disabled={!isAnswered()}
          >
            {currentQuestion < seoQuizQuestions.length - 1 ? 'Next' : 'Finish Quiz'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SeoQuiz;
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export interface MicroFeedbackProps {
  contentType: string;
  contentId: number;
  context?: string;
  className?: string;
  onFeedbackSubmitted?: (sentiment: string) => void;
}

export function MicroFeedback({
  contentType,
  contentId,
  context = '',
  className = '',
  onFeedbackSubmitted
}: MicroFeedbackProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFeedback = async (sentiment: 'positive' | 'neutral' | 'negative') => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to provide feedback',
        variant: 'destructive'
      });
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await apiRequest('/api/micro-feedback', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          contentType,
          contentId,
          sentiment,
          context,
          additionalNotes: null
        })
      });

      setSubmitted(sentiment);
      setIsSubmitting(false);
      
      toast({
        title: 'Thank you!',
        description: 'Your feedback has been recorded.',
      });

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(sentiment);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground mr-2">Was this helpful?</span>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={submitted === 'positive' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFeedback('positive')}
              disabled={isSubmitting || submitted !== null}
              className={`p-1 h-8 w-8 ${submitted === 'positive' ? 'bg-green-600 hover:bg-green-700' : ''}`}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Yes, it was helpful</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={submitted === 'neutral' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFeedback('neutral')}
              disabled={isSubmitting || submitted !== null}
              className={`p-1 h-8 w-8 ${submitted === 'neutral' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
            >
              <Meh className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>It was somewhat helpful</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={submitted === 'negative' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFeedback('negative')}
              disabled={isSubmitting || submitted !== null}
              className={`p-1 h-8 w-8 ${submitted === 'negative' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No, it wasn't helpful</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {submitted && (
        <span className="text-xs text-muted-foreground ml-2">
          Thanks for your feedback!
        </span>
      )}
    </div>
  );
}
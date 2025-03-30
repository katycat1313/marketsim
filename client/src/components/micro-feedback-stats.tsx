import React from 'react';
import { useMicroFeedbackStats } from '@/hooks/use-micro-feedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ThumbsUp, ThumbsDown, Meh } from 'lucide-react';

interface MicroFeedbackStatsProps {
  contentType: string;
  contentId?: number;
  title?: string;
}

export function MicroFeedbackStats({ 
  contentType, 
  contentId, 
  title = 'User Feedback' 
}: MicroFeedbackStatsProps) {
  const { data: stats, isLoading, error } = useMicroFeedbackStats(contentType, contentId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>Loading feedback data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>Failed to load feedback data.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Calculate percentages
  const positivePercent = stats.total ? (stats.positive / stats.total) * 100 : 0;
  const neutralPercent = stats.total ? (stats.neutral / stats.total) * 100 : 0;
  const negativePercent = stats.total ? (stats.negative / stats.total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          {stats.total} {stats.total === 1 ? 'response' : 'responses'} collected
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.total > 0 ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                  <span>Positive</span>
                </div>
                <span className="text-sm">
                  {stats.positive} ({Math.round(positivePercent)}%)
                </span>
              </div>
              <Progress value={positivePercent} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Meh className="h-4 w-4 mr-2 text-yellow-500" />
                  <span>Neutral</span>
                </div>
                <span className="text-sm">
                  {stats.neutral} ({Math.round(neutralPercent)}%)
                </span>
              </div>
              <Progress value={neutralPercent} className="h-2 bg-muted" indicatorClassName="bg-yellow-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                  <span>Negative</span>
                </div>
                <span className="text-sm">
                  {stats.negative} ({Math.round(negativePercent)}%)
                </span>
              </div>
              <Progress value={negativePercent} className="h-2 bg-muted" indicatorClassName="bg-red-500" />
            </div>
          </>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            No feedback has been collected yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
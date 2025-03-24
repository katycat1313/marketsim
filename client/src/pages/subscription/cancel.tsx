import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SubscriptionCancelPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Show toast notification
    toast({
      title: 'Checkout Canceled',
      description: 'Your subscription checkout has been canceled.',
      variant: 'destructive',
    });
  }, [toast]);

  const handleTryAgain = () => {
    setLocation('/subscription');
  };

  const handleContinue = () => {
    setLocation('/dashboard');
  };

  return (
    <div className="container mx-auto max-w-md py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Subscription Canceled</CardTitle>
          <CardDescription className="text-center">
            You've canceled the subscription process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-full bg-amber-100 p-3 w-16 h-16 mx-auto flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 text-amber-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <p>
            You've canceled the subscription checkout process. No changes have been made to your account
            and you haven't been charged.
          </p>
          <p className="text-sm text-muted-foreground">
            You can try again anytime or continue using our free features.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={handleTryAgain} className="w-full">
            Try Again
          </Button>
          <Button onClick={handleContinue} variant="outline" className="w-full">
            Continue with Free Plan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
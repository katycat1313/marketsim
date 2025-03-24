import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SubscriptionSuccessPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Show toast notification
    toast({
      title: 'Subscription Active',
      description: 'Your subscription has been activated successfully!',
    });
  }, [toast]);

  const handleContinue = () => {
    setLocation('/dashboard');
  };

  return (
    <div className="container mx-auto max-w-md py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Subscription Successful!</CardTitle>
          <CardDescription className="text-center">
            Your premium features are now active
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p>
            Thank you for subscribing to our premium plan! Your account has been upgraded and you now
            have access to all premium features.
          </p>
          <p className="text-sm text-muted-foreground">
            Your subscription will automatically renew at the end of your billing period. You can
            manage your subscription at any time from your account settings.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleContinue} className="w-full">
            Continue to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
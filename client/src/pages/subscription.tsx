import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import SubscriptionManager from '@/components/SubscriptionManager';

export default function SubscriptionPage() {
  // For the purpose of this demo, we'll use a mock user ID and email
  // In a real application, this would come from auth context or user session
  const mockUserId = 1;
  const mockUserEmail = 'user@example.com';
  
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  
  // Fetch current user subscription info
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['/api/user/subscription'],
    queryFn: async () => {
      return await apiRequest('/api/user/subscription');
    }
  });
  
  useEffect(() => {
    if (subscription) {
      setCurrentSubscription(subscription);
    }
  }, [subscription]);
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Subscription Plans</h1>
          <p className="text-xl text-muted-foreground">
            Choose the right plan to enhance your marketing skills
          </p>
        </div>
        
        <div className="mb-8 bg-muted p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Plan Benefits</h2>
          <ul className="grid gap-2 md:grid-cols-2">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Access to AI-powered marketing simulations</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Detailed performance analytics and feedback</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Connect with marketing professionals</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Learn from comprehensive marketing tutorials</span>
            </li>
          </ul>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4">Loading subscription options...</p>
          </div>
        ) : (
          <SubscriptionManager userId={mockUserId} userEmail={mockUserEmail} />
        )}
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All plans include a 14-day money-back guarantee. No contracts or hidden fees.</p>
          <p className="mt-2">Questions about our plans? <a href="#" className="text-primary underline">Contact our sales team</a></p>
        </div>
      </div>
    </div>
  );
}
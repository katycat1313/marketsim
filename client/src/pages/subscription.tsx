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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Enrollment & Training Plans</h1>
          <p className="text-xl text-muted-foreground">
            Master real-world digital marketing with AI simulation campaigns, crisis drills, and verified portfolio credentials
          </p>
        </div>
        
        <div className="mb-8 bg-muted/50 border border-border/80 p-6 rounded-lg">
          <h2 className="text-lg font-bold mb-3 text-foreground">Why Krechet Academy Works</h2>
          <ul className="grid gap-3 md:grid-cols-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">✓</span>
              <span><strong>Living Campaign Simulations</strong>: Manage realistic Google and Meta ad accounts without risking real client capital.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">✓</span>
              <span><strong>Mid-Week Boss & Client Crisis Calls</strong>: Handle surprise curveballs, broad-match leakage, and sudden persona expansions.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">✓</span>
              <span><strong>Adaptive Weakness Engine</strong>: Telemetry detects where you bleed spend and injects targeted drills to build mastery.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-2">✓</span>
              <span><strong>Verified Proof-of-Work Portfolio</strong>: Export audited campaign case studies with real CTR and ROAS lift to prove your skills.</span>
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
          <p className="mt-2">Questions about our plans? <a href="mailto:support@krechet.academy?subject=Krechet%20Academy%20Plan%20Inquiry" className="text-primary underline hover:text-primary/80">Contact our team</a></p>
        </div>
      </div>
    </div>
  );
}
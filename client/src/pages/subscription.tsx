import { useQuery } from '@tanstack/react-query';
import SubscriptionManager from '@/components/SubscriptionManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';

export default function SubscriptionPage() {
  // Mock user data - in a real app, this would come from auth context
  const userId = 1;
  const userEmail = 'user@example.com';

  // Query user profile if needed
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['/api/user-profiles', userId],
    queryFn: () => apiRequest(`/api/user-profiles/${userId}`),
  });

  if (isLoading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">Subscription Plans</CardTitle>
          <CardDescription>
            Choose the right subscription plan for your marketing needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-medium">Current Plan</h3>
              <p className="text-sm text-muted-foreground">
                {userProfile?.subscription?.tier || 'Free'}
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="/billing-history">View Billing History</a>
            </Button>
          </div>

          <SubscriptionManager userId={userId} userEmail={userEmail} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Benefits</CardTitle>
          <CardDescription>
            Unlock powerful features with our premium plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Advanced AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized AI feedback on your marketing campaigns
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Unlimited Simulations</h3>
              <p className="text-sm text-muted-foreground">
                Run as many campaign simulations as you need
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Invite team members to collaborate on campaigns
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Expert-Led Tutorials</h3>
              <p className="text-sm text-muted-foreground">
                Access premium tutorials from marketing experts
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Priority Support</h3>
              <p className="text-sm text-muted-foreground">
                Get faster responses from our support team
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Deeper insights into your marketing performance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
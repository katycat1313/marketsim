import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  createCustomer, 
  createCheckoutSession, 
  getCustomerSubscriptions, 
  cancelSubscription 
} from '@/lib/stripe';

interface SubscriptionManagerProps {
  userId: number;
  userEmail: string;
}

type SubscriptionTier = 'free' | 'premium' | 'enterprise';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceId: string;
  features: string[];
  tier: SubscriptionTier;
  mode?: 'payment' | 'subscription';
  badge?: string;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Audit Preview',
    description: 'Explore simulated ad accounts and baseline marketing concepts',
    price: '$0',
    priceId: 'price_free',
    mode: 'payment',
    features: [
      'Chapter 1 & 2 Socratic AI Lessons',
      'Read-only Google & Meta Ad account inspection',
      'Community discussion hub access'
    ],
    tier: 'free'
  },
  {
    id: 'course1',
    name: 'Course 1: Foundation Agency Simulator',
    description: 'Complete hands-on simulation training with verified case study export',
    price: '$59 one-time',
    priceId: 'course1',
    mode: 'payment',
    badge: 'Most Popular',
    features: [
      'All 10 Socratic AI Strategy Chapters',
      'Living Weekly Campaign Sandbox (Google & Meta Ads)',
      'The Boss Crisis Call (Director Atlas Drills)',
      'The Client Persona & Budget Allocation Challenge',
      'Adaptive Weakness Detection & Remediation Engine',
      'Verified Agency Work Portfolio & Case Study Export'
    ],
    tier: 'premium'
  },
  {
    id: 'course2',
    name: 'Course 2: Creative AI Suite',
    description: 'Advanced track for Small Business Owners & Agency Teams',
    price: '$199/month',
    priceId: 'course2',
    mode: 'subscription',
    badge: 'Agency Pro',
    features: [
      'Everything in Course 1 Foundation',
      'Generative AI Image & Video Ad Creation Engine',
      'Canva Workflow & Creative Asset Automation',
      'Ethical AI Governance & Ad Policy Compliance',
      'Small Business Growth Track & Agency Multi-Seat Hub',
      '3 Weekly Mid-Week Crisis Client Curveballs'
    ],
    tier: 'enterprise'
  }
];

export default function SubscriptionManager({ userId, userEmail }: SubscriptionManagerProps) {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's subscriptions
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['/api/stripe/subscriptions', customerId],
    queryFn: () => customerId ? getCustomerSubscriptions(customerId) : null,
    enabled: !!customerId
  });

  // Determine current subscription tier
  const currentSubscription = subscriptions?.data?.[0];
  const currentTier: SubscriptionTier = (currentSubscription?.status === 'active') 
    ? (currentSubscription?.plan?.nickname?.toLowerCase() as SubscriptionTier || 'free')
    : 'free';

  // Create a customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async () => {
      return createCustomer(userEmail);
    },
    onSuccess: (data) => {
      setCustomerId(data.id);
      toast({
        title: 'Account created',
        description: 'Your customer account has been created with Stripe',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create customer account',
        variant: 'destructive',
      });
    },
  });

  // Create checkout session mutation
  const checkoutMutation = useMutation({
    mutationFn: async ({ priceId, mode }: { priceId: string; mode?: 'payment' | 'subscription' }) => {
      let stripeCustomerId = customerId;
      try {
        if (!stripeCustomerId) {
          const customer = await createCustomer(userEmail);
          stripeCustomerId = customer.id;
          setCustomerId(stripeCustomerId);
        }
      } catch (e) {
        console.warn('Customer lookup fallback to email');
      }

      return createCheckoutSession(
        stripeCustomerId || '',
        priceId,
        `${window.location.origin}/subscription/success`,
        `${window.location.origin}/subscription/cancel`,
        { mode, customerEmail: userEmail }
      );
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Checkout Error',
        description: error?.message || 'Failed to create checkout session',
        variant: 'destructive',
      });
    },
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      return cancelSubscription(subscriptionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscriptions'] });
      toast({
        title: 'Subscription canceled',
        description: 'Your subscription has been canceled',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: 'destructive',
      });
    },
  });

  // Handle subscription checkout
  const handleSubscribe = (plan: SubscriptionPlan) => {
    // Skip checkout for free plan
    if (plan.tier === 'free') {
      toast({
        title: 'Free Plan',
        description: 'You are now exploring on the free preview tier',
      });
      return;
    }

    checkoutMutation.mutate({ priceId: plan.priceId, mode: plan.mode });
  };

  // Handle subscription cancellation
  const handleCancelSubscription = () => {
    if (currentSubscription?.id) {
      cancelSubscriptionMutation.mutate(currentSubscription.id);
    }
  };

  if (isLoading) {
    return <div>Loading subscription information...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {SUBSCRIPTION_PLANS.map((plan) => (
        <Card key={plan.id} className={`flex flex-col relative ${plan.badge ? 'border-primary/60 shadow-md' : ''} ${plan.tier === currentTier ? 'ring-2 ring-primary' : ''}`}>
          {plan.badge && (
            <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              {plan.badge}
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold mb-4 text-foreground">{plan.price}</div>
            <Separator className="my-2" />
            <ul className="space-y-2 my-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm">
                  <span className="text-primary font-bold mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant={plan.tier === currentTier ? "outline" : "default"}
              className="w-full"
              onClick={() => handleSubscribe(plan)}
              disabled={checkoutMutation.isPending || (plan.tier === currentTier && currentTier !== 'free')}
            >
              {checkoutMutation.isPending 
                ? 'Connecting to Checkout...'
                : plan.tier === currentTier
                  ? 'Current Plan'
                  : plan.mode === 'payment'
                    ? `Enroll in ${plan.name} ($59)`
                    : `Subscribe to ${plan.name} ($199/mo)`}
            </Button>
            
            {plan.tier === currentTier && currentTier !== 'free' && (
              <Button 
                variant="destructive"
                className="w-full mt-2"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
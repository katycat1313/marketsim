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
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic access to marketing simulations',
    price: '$0/month',
    priceId: 'price_free', // This would be your actual Stripe price ID
    features: [
      'Access to basic tutorials',
      'Limited simulations',
      'Community support'
    ],
    tier: 'free'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Enhanced features for marketing professionals',
    price: '$19.99/month',
    priceId: 'price_premium', // This would be your actual Stripe price ID
    features: [
      'All Free features',
      'Advanced simulations',
      'Personalized AI feedback',
      'Priority support'
    ],
    tier: 'premium'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full access for marketing teams and agencies',
    price: '$49.99/month',
    priceId: 'price_enterprise', // This would be your actual Stripe price ID
    features: [
      'All Premium features',
      'Team collaboration',
      'Advanced analytics',
      'Custom simulations',
      'Dedicated account manager'
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
    mutationFn: async (priceId: string) => {
      // Create customer if one doesn't exist
      let stripeCustomerId = customerId;
      if (!stripeCustomerId) {
        const customer = await createCustomer(userEmail);
        stripeCustomerId = customer.id;
        setCustomerId(stripeCustomerId);
      }

      // Create checkout session - ensure stripeCustomerId is never null
      if (!stripeCustomerId) {
        throw new Error('Failed to create customer');
      }
      
      // Type guard to ensure stripeCustomerId is definitely string
      const customerId: string = stripeCustomerId;
      
      return createCheckoutSession(
        customerId,
        priceId,
        `${window.location.origin}/subscription/success`,
        `${window.location.origin}/subscription/cancel`
      );
    },
    onSuccess: (data) => {
      // Redirect to checkout
      window.location.href = data.url;
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create checkout session',
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
        description: 'You are now on the free plan',
      });
      return;
    }

    checkoutMutation.mutate(plan.priceId);
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
        <Card key={plan.id} className={`flex flex-col ${plan.tier === currentTier ? 'border-primary' : ''}`}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold mb-4">{plan.price}</div>
            <Separator className="my-2" />
            <ul className="space-y-2 my-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant={plan.tier === currentTier ? "outline" : "default"}
              className="w-full"
              onClick={() => handleSubscribe(plan)}
              disabled={plan.tier === currentTier && currentTier !== 'free'}
            >
              {plan.tier === currentTier
                ? 'Current Plan'
                : `Upgrade to ${plan.name}`}
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
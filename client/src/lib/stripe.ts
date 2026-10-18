
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from './queryClient';

// Stripe client configuration
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || (import.meta.env as any).STRIPE_ANON_API_KEY || (import.meta.env as any).VITE_STRIPE_ANON_API_KEY;
    if (!key) {
      console.error('Stripe publishable key is missing');
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

// Stripe API helper functions
export const createCustomer = async (email: string, name?: string) => {
  const res = await apiRequest('POST', '/api/stripe/customers', { email, name });
  return res.json();
};

export const createSubscription = async (customerId: string, priceId: string) => {
  const res = await apiRequest('POST', '/api/stripe/subscriptions', { customerId, priceId });
  return res.json();
};

export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  options?: { mode?: 'payment' | 'subscription'; customerEmail?: string }
) => {
  const res = await apiRequest('POST', '/api/stripe/checkout', { 
    customerId, 
    customerEmail: options?.customerEmail, 
    priceId, 
    successUrl, 
    cancelUrl,
    mode: options?.mode,
  });
  return res.json();
};

export const getCustomerSubscriptions = async (customerId: string) => {
  const res = await apiRequest('GET', `/api/stripe/customers/${customerId}/subscriptions`);
  return res.json();
};

export const cancelSubscription = async (subscriptionId: string) => {
  const res = await apiRequest('DELETE', `/api/stripe/subscriptions/${subscriptionId}`);
  return res.json();
};

export const getCustomerPaymentMethods = async (customerId: string) => {
  const res = await apiRequest('GET', `/api/stripe/customers/${customerId}/payment-methods`);
  return res.json();
};

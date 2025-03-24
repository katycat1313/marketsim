
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from './queryClient';

// Stripe client configuration
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
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
  return apiRequest('/api/stripe/customers', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  });
};

export const createSubscription = async (customerId: string, priceId: string) => {
  return apiRequest('/api/stripe/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ customerId, priceId }),
  });
};

export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) => {
  return apiRequest('/api/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify({ customerId, priceId, successUrl, cancelUrl }),
  });
};

export const getCustomerSubscriptions = async (customerId: string) => {
  return apiRequest(`/api/stripe/customers/${customerId}/subscriptions`);
};

export const cancelSubscription = async (subscriptionId: string) => {
  return apiRequest(`/api/stripe/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
  });
};

export const getCustomerPaymentMethods = async (customerId: string) => {
  return apiRequest(`/api/stripe/customers/${customerId}/payment-methods`);
};

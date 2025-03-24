import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia', // Using the latest API version
});

export class StripeService {
  /**
   * Create a new Stripe customer
   */
  async createCustomer(email: string, name?: string) {
    return stripe.customers.create({
      email,
      name,
    });
  }

  /**
   * Create a subscription for a customer
   */
  async createSubscription(customerId: string, priceId: string) {
    return stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
  }

  /**
   * Create a checkout session for a customer
   */
  async createCheckoutSession(customerId: string, priceId: string, successUrl: string, cancelUrl: string) {
    return stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  /**
   * Get a customer's subscriptions
   */
  async getCustomerSubscriptions(customerId: string) {
    return stripe.subscriptions.list({
      customer: customerId,
    });
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string) {
    return stripe.subscriptions.cancel(subscriptionId);
  }

  /**
   * Create a payment method
   */
  async createPaymentMethod(customerId: string, paymentMethodId: string) {
    return stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  /**
   * Get customer payment methods
   */
  async getCustomerPaymentMethods(customerId: string) {
    return stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
  }

  /**
   * Verify Stripe webhook signature
   */
  constructEvent(body: string, signature: string, endpointSecret: string) {
    return stripe.webhooks.constructEvent(body, signature, endpointSecret);
  }
}

export const stripeService = new StripeService();
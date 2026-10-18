import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY || 'sk_test_placeholder_key_for_development';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
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
  async createCheckoutSession(
    customerId: string, 
    priceId: string, 
    successUrl: string, 
    cancelUrl: string,
    options?: { mode?: 'payment' | 'subscription'; customerEmail?: string }
  ) {
    const isOneTime = options?.mode === 'payment' || priceId === 'course1' || priceId === 'price_course1' || (priceId && priceId.includes('one_time'));
    const sessionMode = isOneTime ? 'payment' : 'subscription';

    // If a custom real Stripe Price ID (starts with price_ or plan_) is passed and is not our placeholder
    const isRealStripePrice = priceId && (priceId.startsWith('price_') || priceId.startsWith('plan_')) && !['price_course1', 'price_course2', 'price_premium', 'price_enterprise', 'price_free'].includes(priceId);

    let lineItems: any[];

    if (isRealStripePrice) {
      lineItems = [{ price: priceId, quantity: 1 }];
    } else if (priceId === 'course1' || priceId === 'price_course1' || priceId === 'price_premium') {
      // Course 1 ($59 one-time payment)
      lineItems = [{
        price_data: {
          currency: 'usd',
          unit_amount: 5900,
          product_data: {
            name: 'Course 1: Foundation Agency Simulator',
            description: 'Lifetime access to Course 1, AI simulation campaigns, and verified portfolio exports',
          },
        },
        quantity: 1,
      }];
    } else if (priceId === 'course2' || priceId === 'price_course2' || priceId === 'price_enterprise') {
      // Course 2 ($199/month continuity)
      lineItems = [{
        price_data: {
          currency: 'usd',
          unit_amount: 19900,
          recurring: { interval: 'month' },
          product_data: {
            name: 'Course 2: Creative AI Suite (SMB & Agency)',
            description: 'Generative AI Image & Video creation, Canva workflow integration, and weekly crisis drills',
          },
        },
        quantity: 1,
      }];
    } else {
      lineItems = [{
        price_data: {
          currency: 'usd',
          unit_amount: isOneTime ? 5900 : 19900,
          ...(isOneTime ? {} : { recurring: { interval: 'month' } }),
          product_data: {
            name: 'Krechet Academy Access',
            description: 'Full access to AI marketing simulations and training curriculum',
          },
        },
        quantity: 1,
      }];
    }

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: sessionMode,
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    if (customerId) {
      sessionParams.customer = customerId;
    } else if (options?.customerEmail) {
      sessionParams.customer_email = options.customerEmail;
    }

    return stripe.checkout.sessions.create(sessionParams);
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
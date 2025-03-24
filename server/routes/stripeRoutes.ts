import { Router } from 'express';
import { stripeService } from '../services/stripeService';
import { z } from 'zod';

const router = Router();

// Schema for customer creation
const createCustomerSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

// Schema for subscription creation
const createSubscriptionSchema = z.object({
  customerId: z.string(),
  priceId: z.string(),
});

// Schema for checkout session
const createCheckoutSessionSchema = z.object({
  customerId: z.string(),
  priceId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

/**
 * Create a customer
 */
router.post('/customers', async (req, res) => {
  try {
    const { email, name } = createCustomerSchema.parse(req.body);
    const customer = await stripeService.createCustomer(email, name);
    res.json(customer);
  } catch (error: any) {
    console.error('Error in create customer route:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Create a subscription
 */
router.post('/subscriptions', async (req, res) => {
  try {
    const { customerId, priceId } = createSubscriptionSchema.parse(req.body);
    const subscription = await stripeService.createSubscription(customerId, priceId);
    res.json(subscription);
  } catch (error: any) {
    console.error('Error in create subscription route:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Create a checkout session
 */
router.post('/checkout', async (req, res) => {
  try {
    const { customerId, priceId, successUrl, cancelUrl } = createCheckoutSessionSchema.parse(req.body);
    const session = await stripeService.createCheckoutSession(customerId, priceId, successUrl, cancelUrl);
    res.json(session);
  } catch (error: any) {
    console.error('Error in create checkout session route:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get customer subscriptions
 */
router.get('/customers/:customerId/subscriptions', async (req, res) => {
  try {
    const { customerId } = req.params;
    const subscriptions = await stripeService.getCustomerSubscriptions(customerId);
    res.json(subscriptions);
  } catch (error: any) {
    console.error('Error in get customer subscriptions route:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Cancel a subscription
 */
router.delete('/subscriptions/:subscriptionId', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await stripeService.cancelSubscription(subscriptionId);
    res.json(subscription);
  } catch (error: any) {
    console.error('Error in cancel subscription route:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get customer payment methods
 */
router.get('/customers/:customerId/payment-methods', async (req, res) => {
  try {
    const { customerId } = req.params;
    const paymentMethods = await stripeService.getCustomerPaymentMethods(customerId);
    res.json(paymentMethods);
  } catch (error: any) {
    console.error('Error in get customer payment methods route:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Webhook handler for Stripe events
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!endpointSecret) {
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  try {
    // Raw body is needed for signature verification
    const rawBody = JSON.stringify(req.body);
    const event = stripeService.constructEvent(rawBody, sig, endpointSecret);

    // Handle the event based on its type
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful:', paymentIntent.id);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('PaymentMethod was attached:', paymentMethod.id);
        break;
      // Handle other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Error in webhook route:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
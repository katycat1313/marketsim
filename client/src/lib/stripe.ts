
// Stripe client configuration
// Note: This is just a template - you may need to adjust based on your Stripe SDK usage

export const getStripeConfig = () => {
  return {
    readKey: import.meta.env.VITE_STRIPE_READ_KEY,
    writeKey: import.meta.env.VITE_STRIPE_WRITE_KEY,
  };
};

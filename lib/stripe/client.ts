import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is required in environment variables");
}

// Initialize Stripe with the latest API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
  typescript: true,
  // Optional: Configure app info for better debugging in Stripe Dashboard
  appInfo: {
    name: "AI Made This",
    version: "1.0.0",
    url: "https://aimademethis.com",
  },
});

// Helper function to format amount for Stripe (cents)
export function formatAmountForStripe(amount: number, currency: string): number {
  // Zero decimal currencies (like JPY) don't need multiplication
  const zeroDecimalCurrencies = [
    "BIF",
    "CLP",
    "DJF",
    "GNF",
    "JPY",
    "KMF",
    "KRW",
    "MGA",
    "PYG",
    "RWF",
    "UGX",
    "VND",
    "VUV",
    "XAF",
    "XOF",
    "XPF",
  ];

  return zeroDecimalCurrencies.includes(currency.toUpperCase())
    ? amount
    : Math.round(amount * 100);
}

// Helper function to format amount from Stripe (cents to dollars)
export function formatAmountFromStripe(amount: number, currency: string): number {
  const zeroDecimalCurrencies = [
    "BIF",
    "CLP",
    "DJF",
    "GNF",
    "JPY",
    "KMF",
    "KRW",
    "MGA",
    "PYG",
    "RWF",
    "UGX",
    "VND",
    "VUV",
    "XAF",
    "XOF",
    "XPF",
  ];

  return zeroDecimalCurrencies.includes(currency.toUpperCase())
    ? amount
    : amount / 100;
}

// Helper function to format currency for display
export function formatCurrency(amount: number, currency: string = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

// Stripe publishable key for client-side (public)
export function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required in environment variables"
    );
  }
  return key;
}

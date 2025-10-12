import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// IMPORTANT: Disable body parsing for webhooks
export const runtime = "nodejs";

// Create Supabase admin client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  console.log(`✅ Received event: ${event.type}`);

  try {
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// ============================================================================
// WEBHOOK HANDLERS
// ============================================================================

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("📝 Processing subscription.created");

  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error("No user_id in subscription metadata");
    return;
  }

  // Get plan from metadata
  const planName = subscription.metadata?.plan_name;
  if (!planName) {
    console.error("No plan_name in subscription metadata");
    return;
  }

  // Fetch the plan from database
  const { data: plan } = await supabaseAdmin
    .from("subscription_plans")
    .select("id")
    .eq("name", planName)
    .single();

  if (!plan) {
    console.error(`Plan not found: ${planName}`);
    return;
  }

  // Create subscription record
  // Type assertion needed because Stripe types are complex
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = subscription as any;

  // Helper function to safely convert Unix timestamp to ISO string
  const toISOString = (timestamp: number | null | undefined): string | null => {
    if (!timestamp || timestamp <= 0) return null;
    try {
      return new Date(timestamp * 1000).toISOString();
    } catch (error) {
      console.error("Error converting timestamp:", timestamp, error);
      return null;
    }
  };

  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_id: plan.id,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      billing_cycle: subscription.metadata?.billing_cycle || "monthly",
      current_period_start: toISOString(sub.current_period_start) || new Date().toISOString(),
      current_period_end: toISOString(sub.current_period_end) || new Date().toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      trial_start: toISOString(sub.trial_start),
      trial_end: toISOString(sub.trial_end),
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }

  console.log("✅ Subscription created successfully");
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("📝 Processing subscription.updated");

  // Find subscription by Stripe ID
  const { data: existingSubscription } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id, plan_id")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (!existingSubscription) {
    console.error("Subscription not found in database");
    return;
  }

  // Check if plan changed
  let planId = existingSubscription.plan_id;
  if (subscription.metadata?.plan_name) {
    const { data: plan } = await supabaseAdmin
      .from("subscription_plans")
      .select("id")
      .eq("name", subscription.metadata.plan_name)
      .single();

    if (plan) {
      planId = plan.id;
    }
  }

  // Update subscription
  // Type assertion needed because Stripe types are complex
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = subscription as any;

  // Helper function to safely convert Unix timestamp to ISO string
  const toISOString = (timestamp: number | null | undefined): string | null => {
    if (!timestamp || timestamp <= 0) return null;
    try {
      return new Date(timestamp * 1000).toISOString();
    } catch (error) {
      console.error("Error converting timestamp:", timestamp, error);
      return null;
    }
  };

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      plan_id: planId,
      status: subscription.status,
      current_period_start: toISOString(sub.current_period_start) || new Date().toISOString(),
      current_period_end: toISOString(sub.current_period_end) || new Date().toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: toISOString(sub.canceled_at),
      trial_end: toISOString(sub.trial_end),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }

  console.log("✅ Subscription updated successfully");
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("📝 Processing subscription.deleted");

  // Update subscription status to canceled
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("Error deleting subscription:", error);
    throw error;
  }

  console.log("✅ Subscription deleted successfully");
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("📝 Processing invoice.payment_succeeded");

  // Type assertion needed because Stripe types are complex
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inv = invoice as any;

  if (!inv.subscription) {
    console.log("Invoice not associated with subscription, skipping");
    return;
  }

  // Find subscription
  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", inv.subscription)
    .single();

  if (!subscription) {
    console.error("Subscription not found");
    return;
  }

  // Record transaction
  const { error } = await supabaseAdmin.from("subscription_transactions").insert({
    subscription_id: subscription.id,
    user_id: subscription.user_id,
    type: "payment",
    status: "succeeded",
    amount: invoice.amount_paid / 100, // Convert from cents
    currency: invoice.currency,
    description: invoice.description || "Subscription payment",
    stripe_invoice_id: invoice.id,
    stripe_charge_id: inv.charge as string,
    stripe_payment_intent_id: inv.payment_intent as string,
    metadata: {
      period_start: invoice.period_start,
      period_end: invoice.period_end,
    },
  });

  if (error) {
    console.error("Error recording transaction:", error);
    throw error;
  }

  console.log("✅ Payment recorded successfully");
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("📝 Processing invoice.payment_failed");

  // Type assertion needed because Stripe types are complex
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inv = invoice as any;

  if (!inv.subscription) {
    console.log("Invoice not associated with subscription, skipping");
    return;
  }

  // Find subscription
  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", inv.subscription)
    .single();

  if (!subscription) {
    console.error("Subscription not found");
    return;
  }

  // Update subscription status to past_due
  await supabaseAdmin
    .from("subscriptions")
    .update({ status: "past_due" })
    .eq("id", subscription.id);

  // Record failed transaction
  const { error } = await supabaseAdmin.from("subscription_transactions").insert({
    subscription_id: subscription.id,
    user_id: subscription.user_id,
    type: "payment",
    status: "failed",
    amount: invoice.amount_due / 100,
    currency: invoice.currency,
    description: "Failed payment attempt",
    stripe_invoice_id: invoice.id,
    metadata: {
      failure_message: invoice.last_finalization_error?.message,
    },
  });

  if (error) {
    console.error("Error recording failed payment:", error);
    throw error;
  }

  console.log("✅ Failed payment recorded");
}

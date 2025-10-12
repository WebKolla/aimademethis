# Stripe Production Webhooks - Detailed Guide

**Last Updated:** January 12, 2025

---

## What Are Webhooks?

Webhooks are HTTP callbacks that Stripe sends to your application when specific events occur. Instead of constantly polling Stripe's API asking "did anything happen?", Stripe proactively notifies you.

**Why you need them:**
- Know instantly when a customer completes checkout
- Automatically update your database when subscriptions change
- Handle payment failures and retry logic
- Keep subscription status synchronized

---

## Your Current Implementation

Location: `/app/api/webhooks/stripe/route.ts`

**Events your app listens for:**
1. `checkout.session.completed` - Checkout complete
2. `customer.subscription.created` - New subscription
3. `customer.subscription.updated` - Subscription changed
4. `customer.subscription.deleted` - Subscription canceled
5. `invoice.payment_succeeded` - Payment successful
6. `invoice.payment_failed` - Payment failed

**What it does:**
- Verifies webhook signature (security)
- Updates Supabase `subscriptions` table
- Updates Supabase `stripe_customers` table
- Updates user's subscription tier in `profiles` table

---

## Production Setup Steps

### Step 1: Activate Stripe Account

Before you can use Live mode:
1. Complete business verification
2. Add bank account
3. Verify identity
4. Accept Stripe's terms

### Step 2: Switch to Live Mode

In Stripe Dashboard:
- Click toggle in top-right: "Test mode" → "Live mode"
- All your test data stays in test mode
- Live mode starts fresh

### Step 3: Create Webhook Endpoint

1. **Navigate:** Developers → Webhooks
2. **Click:** "Add endpoint" button
3. **Endpoint URL:** `https://www.aimademethis.com/api/webhooks/stripe`
4. **Description:** (optional) "AIMMT Production Webhook"
5. **Select events:** Click "Select events" button, then choose:
   - Under "Checkout": `checkout.session.completed`
   - Under "Customer":
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Under "Invoice":
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
6. **API Version:** Use latest
7. **Click:** "Add endpoint"

### Step 4: Get Signing Secret

After creating the endpoint:
1. Click on your new endpoint in the list
2. Find "Signing secret" section
3. Click "Reveal" button
4. Copy the secret (format: `whsec_` followed by random characters)
5. Store it securely - you'll add it to Vercel

### Step 5: Update Vercel Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

**Add/Update these three variables:**

Variable name: `STRIPE_WEBHOOK_SECRET`
Value: Paste the signing secret from Step 4
Environment: Production only

Variable name: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
Value: Your live publishable key (starts with `pk_live_`)
Environment: Production only

Variable name: `STRIPE_SECRET_KEY`
Value: Your live secret key (starts with `sk_live_`)
Environment: Production only

**Where to find live keys:**
- Stripe Dashboard → Developers → API keys
- Scroll to "Standard keys" section
- Click "Reveal live key" for each

### Step 6: Deploy with New Variables

```bash
vercel --prod
```

Or trigger redeploy from Vercel dashboard (Deployments → Redeploy)

**Important:** New environment variables only take effect after redeployment.

### Step 7: Test the Webhook

In Stripe Dashboard:
1. Go to Developers → Webhooks
2. Click your endpoint
3. Click "Send test webhook" button
4. Select `checkout.session.completed`
5. Click "Send test webhook"
6. Check response - should be **200 OK**

If you see errors:
- Check Vercel function logs
- Verify webhook secret is correct
- Ensure app is deployed

### Step 8: Test with Real Payment

**Critical:** Test the full flow

1. Go to https://www.aimademethis.com
2. Sign up for account (or log in)
3. Click "Upgrade to Pro"
4. Complete checkout with **real credit card**
5. After checkout:
   - Check Supabase `subscriptions` table
   - Verify row exists with status "active"
   - Check `stripe_customers` table has entry
   - Verify user's subscription_tier updated
6. **Immediately refund:**
   - Stripe Dashboard → Payments
   - Find your test payment
   - Click "Refund" button

---

## Webhook Security

### How Signature Verification Works

Every webhook includes a signature in the HTTP header:
```
Stripe-Signature: t=1234567890,v1=abc123def456...
```

Your app verifies this signature using the webhook secret. This ensures:
1. Request actually came from Stripe
2. Payload wasn't tampered with
3. Not a replay attack (old webhook resent)

Your code already handles this:
```typescript
const sig = headers().get("stripe-signature");
const event = stripe.webhooks.constructEvent(
  body,
  sig!,
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

If verification fails, webhook is rejected with 400 error.

### Security Best Practices

✅ Do:
- Keep webhook secret in environment variables
- Verify signature on every request
- Use HTTPS endpoint only
- Log webhook events for debugging
- Handle failures gracefully (Stripe retries automatically)

❌ Don't:
- Expose webhook secret in code
- Skip signature verification
- Trust webhook data without verification
- Commit secrets to git

---

## Monitoring & Debugging

### View Webhook Logs in Stripe

1. Developers → Webhooks
2. Click your endpoint
3. See "Recent deliveries" section
4. Click any delivery to see:
   - Request sent by Stripe
   - Response from your app
   - Retry attempts if failed

### View Logs in Vercel

1. Vercel Dashboard → Your Project
2. Click "Logs" or "Functions"
3. Filter by `/api/webhooks/stripe`
4. See console.log output and errors

### Set Up Alerts

In Stripe Dashboard (webhook settings):
- Enable "Email me when this endpoint fails"
- Add your email address
- Get notified of webhook failures immediately

---

## What Each Event Does

### 1. checkout.session.completed

**When:** User completes Stripe checkout page

**Your app does:**
- Retrieves full subscription details from Stripe
- Creates entry in `stripe_customers` table
- Creates entry in `subscriptions` table
- Links subscription to user profile

**Database changes:**
- INSERT into `stripe_customers`
- INSERT into `subscriptions`
- UPDATE `profiles.subscription_tier`

---

### 2. customer.subscription.created

**When:** Subscription is created (may fire after checkout)

**Your app does:**
- Upserts subscription data into database
- Updates user's subscription tier

**Database changes:**
- UPSERT into `subscriptions`
- UPDATE `profiles.subscription_tier`

---

### 3. customer.subscription.updated

**When:**
- User upgrades/downgrades plan
- Subscription renews
- Payment method updated
- Status changes (active → past_due)

**Your app does:**
- Updates subscription status, dates, plan
- Updates user's subscription tier if changed

**Database changes:**
- UPDATE `subscriptions` (status, plan, dates)
- UPDATE `profiles.subscription_tier` (if plan changed)

---

### 4. customer.subscription.deleted

**When:** Subscription canceled or expires

**Your app does:**
- Sets subscription status to "canceled"
- Downgrades user to free tier
- Records cancellation date

**Database changes:**
- UPDATE `subscriptions.status` → 'canceled'
- UPDATE `profiles.subscription_tier` → 'free'

---

### 5. invoice.payment_succeeded

**When:**
- First payment succeeds (after trial)
- Monthly recurring payment succeeds

**Your app does:**
- Updates subscription dates (current_period_end)
- Ensures subscription marked as active

**Database changes:**
- UPDATE `subscriptions.current_period_end`
- UPDATE `subscriptions.status` → 'active'

---

### 6. invoice.payment_failed

**When:**
- Card declined
- Insufficient funds
- Expired card

**Your app does:**
- Updates subscription status to "past_due"
- User may lose access to Pro features

**Database changes:**
- UPDATE `subscriptions.status` → 'past_due'

**Stripe's automatic behavior:**
- Retries payment 3 times over several days
- If all retries fail, subscription is canceled
- You'll receive `customer.subscription.deleted` event

---

## Webhook Permissions

Your webhook handler has these permissions:

**Stripe API access:**
- Read subscription data
- Read customer data

**Supabase database access:**
- Uses service role key (admin access)
- Bypasses Row Level Security
- Can insert/update any table

**Why service role key is safe:**
- Webhook runs server-side only
- Not exposed to users
- Stripe signature verification ensures legitimacy
- Only Stripe can trigger the webhook

---

## Troubleshooting

### Issue: "No signatures found matching the expected signature"

**Cause:** Webhook secret mismatch

**Fix:**
1. Verify you copied correct secret from Live mode webhook
2. Check variable name is exactly `STRIPE_WEBHOOK_SECRET`
3. Redeploy after updating environment variables
4. Verify not using test mode secret in production

---

### Issue: Webhook returns 500 error

**Cause:** Server error in your code or database

**Fix:**
1. Check Vercel logs for error message
2. Verify database connection working
3. Check Supabase tables exist
4. Verify RLS policies allow service role writes

---

### Issue: Subscription created in Stripe but not in database

**Cause:** Webhook failed to update database

**Fix:**
1. Check webhook delivery status in Stripe (should be 200 OK)
2. Check Vercel logs for errors
3. Manually retry webhook from Stripe dashboard
4. Verify database credentials are correct

---

### Issue: Webhook works in test mode but not production

**Cause:** Using test webhook secret in production

**Fix:**
1. Create separate webhooks for test vs. production
2. Use correct secret for each environment
3. Verify production webhook uses live keys

---

## FAQ

**Q: Do I need separate webhooks for test and production?**
A: Yes, highly recommended. Create one in Test mode for development, one in Live mode for production. Different secrets for each.

**Q: What if my webhook endpoint goes down?**
A: Stripe automatically retries failed webhooks for up to 3 days. Fix your endpoint and webhooks resume automatically.

**Q: Can I replay old webhooks?**
A: Yes, in Stripe dashboard, go to webhook endpoint and click "Send test webhook" or retry a specific failed webhook.

**Q: How do I know if webhooks are working?**
A: Check "Recent deliveries" in webhook settings. All should show 200 OK. Also monitor your database for subscription updates.

**Q: What if webhook takes too long?**
A: Vercel functions timeout after 10 seconds (Hobby) or 60 seconds (Pro). Your webhook should respond in <2 seconds. If you need longer processing, return 200 OK immediately and process asynchronously.

---

## Checklist: Production Webhook Setup

- [ ] Stripe account activated (live mode accessible)
- [ ] Webhook created in Live mode dashboard
- [ ] Webhook URL: `https://www.aimademethis.com/api/webhooks/stripe`
- [ ] All 6 events selected
- [ ] Signing secret copied from Stripe
- [ ] `STRIPE_WEBHOOK_SECRET` set in Vercel (production)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` updated (pk_live_...)
- [ ] `STRIPE_SECRET_KEY` updated (sk_live_...)
- [ ] Application redeployed
- [ ] Test webhook sent (200 OK response)
- [ ] Real payment tested and verified in database
- [ ] Test payment refunded
- [ ] Email alerts enabled for failures

---

**When all checkboxes are ✅, your production webhooks are ready!**

For more details, see:
- Stripe Webhooks Docs: https://stripe.com/docs/webhooks
- Stripe API Reference: https://stripe.com/docs/api
- Vercel Functions: https://vercel.com/docs/functions

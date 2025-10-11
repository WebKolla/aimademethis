# Stripe Setup Guide

Complete guide for configuring Stripe with your subscription system.

## Prerequisites

- Stripe account (sign up at https://stripe.com)
- Development environment ready
- Supabase database with subscription tables

---

## Part 1: Stripe Dashboard Setup

### Step 1: Create a Stripe Account

1. Go to https://stripe.com
2. Click "Start now" or "Sign in"
3. Complete registration
4. **Important**: Start in **Test Mode** (toggle in top right)

### Step 2: Get Your API Keys

1. Go to **Developers** → **API keys** (https://dashboard.stripe.com/test/apikeys)
2. You'll see:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"
3. Copy both keys (we'll use them later)

### Step 3: Create Products

#### Product 1: Pro Plan

1. Go to **Product catalog** → Click **"Add product"**
2. Fill in:
   - **Name**: `Pro Plan`
   - **Description**: `For creators who want to showcase unlimited products with analytics`
   - **Image**: Upload a logo/icon (optional)
3. **Pricing**:
   - Click **"Add pricing"**
   - **Monthly Price**:
     - Price: `$9.00`
     - Billing period: `Monthly`
     - Currency: `USD`
     - Click **"Add pricing"**
   - Click **"Add pricing"** again for yearly
   - **Yearly Price**:
     - Price: `$90.00`
     - Billing period: `Yearly`
     - Currency: `USD`
     - Click **"Add pricing"**
4. Click **"Save product"**
5. **Copy the Price IDs**:
   - Click on the monthly price → Copy the Price ID (starts with `price_`)
   - Click on the yearly price → Copy the Price ID

#### Product 2: Pro Plus Plan

1. Click **"Add product"** again
2. Fill in:
   - **Name**: `Pro Plus Plan`
   - **Description**: `Premium features for power users and teams`
   - **Image**: Upload a logo/icon (optional)
3. **Pricing**:
   - **Monthly Price**: `$29.00` / Monthly
   - **Yearly Price**: `$290.00` / Yearly
4. Click **"Save product"**
5. **Copy both Price IDs**

### Step 4: Update Database with Stripe IDs

You need to add the Stripe Product IDs and Price IDs to your database.

Run this SQL in your Supabase SQL Editor:

```sql
-- Update Pro plan with Stripe IDs
UPDATE subscription_plans
SET
  stripe_product_id = 'prod_YOUR_PRO_PRODUCT_ID',  -- Replace with actual Product ID
  stripe_price_id_monthly = 'price_YOUR_PRO_MONTHLY_PRICE_ID',  -- Replace
  stripe_price_id_yearly = 'price_YOUR_PRO_YEARLY_PRICE_ID'     -- Replace
WHERE name = 'pro';

-- Update Pro Plus plan with Stripe IDs
UPDATE subscription_plans
SET
  stripe_product_id = 'prod_YOUR_PRO_PLUS_PRODUCT_ID',  -- Replace
  stripe_price_id_monthly = 'price_YOUR_PRO_PLUS_MONTHLY_PRICE_ID',  -- Replace
  stripe_price_id_yearly = 'price_YOUR_PRO_PLUS_YEARLY_PRICE_ID'     -- Replace
WHERE name = 'pro_plus';

-- Verify the update
SELECT name, stripe_product_id, stripe_price_id_monthly, stripe_price_id_yearly
FROM subscription_plans
WHERE name IN ('pro', 'pro_plus');
```

### Step 5: Configure Webhooks

#### A. Install Stripe CLI (For Local Testing)

**macOS (Homebrew)**:
```bash
brew install stripe/stripe-cli/stripe
```

Tip (macOS Sequoia CLT error): If you see “Error: Xcode alone is not sufficient on Sequoia. Install the Command Line Tools: xcode-select --install”, do this:

1) Install Command Line Tools

```bash
xcode-select --install
```

If the installer says it’s not available:

```bash
sudo rm -rf /Library/Developer/CommandLineTools
sudo xcode-select --reset
softwareupdate -l | grep -i "command line tools" || true
# Replace the title below with the exact one shown by softwareupdate -l
sudo softwareupdate -i "Command Line Tools for Xcode-<version>"
```

2) Point to CLT and accept tools

```bash
sudo xcode-select -s /Library/Developer/CommandLineTools
sudo xcodebuild -runFirstLaunch
```

3) Verify, then retry Homebrew

```bash
xcode-select -p
clang --version
brew update
brew doctor
brew install stripe/stripe-cli/stripe
```

If it still fails, download “Command Line Tools for Xcode” for your OS/Xcode from Apple’s developer downloads: https://developer.apple.com/download/all/?q=Command%20Line%20Tools

**Windows (Scoop)**:
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Linux**:
```bash
# Download from https://github.com/stripe/stripe-cli/releases/latest
wget https://github.com/stripe/stripe-cli/releases/download/vX.X.X/stripe_X.X.X_linux_x86_64.tar.gz
tar -xvf stripe_X.X.X_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

#### B. Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authorize the CLI.

#### C. Forward Webhooks to Local Server

In a new terminal, run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Copy the webhook secret** (starts with `whsec_`)

#### D. For Production (After Deployment)

1. Go to **Developers** → **Webhooks** (https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
4. **Description**: `Production webhook`
5. **Events to send**:
   - Select these events:
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.payment_succeeded`
     - ✅ `invoice.payment_failed`
6. Click **"Add endpoint"**
7. Click on the webhook → **"Signing secret"** → **"Reveal"**
8. Copy the signing secret

---

## Part 2: Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Keys (from Step 2)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Stripe Webhook Secret (from Step 5)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Supabase Service Role Key (for webhook handler)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_supabase_settings
```

**Important**:
- The `SUPABASE_SERVICE_ROLE_KEY` is found in your Supabase project settings under **API** → **Service role key**
- ⚠️ Keep this secret! It bypasses Row Level Security

---

## Part 3: Testing the Integration

### Test 1: Pricing Page

1. Start your dev server: `npm run dev`
2. Go to http://localhost:3000/pricing
3. You should see three pricing tiers
4. Try toggling Monthly/Yearly

### Test 2: Checkout Flow (Local)

1. Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Click "Upgrade to Pro" on the pricing page
3. You should be redirected to Stripe Checkout
4. Use a test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)
5. Complete the checkout
6. Check the Stripe CLI terminal - you should see webhook events
7. Check your database - a subscription record should be created

### Test 3: Verify Subscription in Database

Run this SQL in Supabase:

```sql
SELECT
  s.*,
  sp.display_name as plan_name,
  sp.price_monthly
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
ORDER BY s.created_at DESC
LIMIT 5;
```

You should see your test subscription!

---

## Part 4: Trial Period Logic

The system implements smart trial eligibility to prevent abuse:

### Trial Eligibility Rules

**14-day free trial is automatically offered when:**
1. ✅ User subscribes to **Pro plan** (not Pro Plus or Free)
2. ✅ User has **never had a trial before** (tracked in database)
3. ✅ User has **no existing subscription**

**Trial is NOT offered when:**
- ❌ User subscribes to Pro Plus plan (premium tier, no trial)
- ❌ User has had a trial before (prevents abuse)
- ❌ User already has an active subscription (upgrade scenario)

### How It Works

The checkout session creation (`lib/subscription/actions.ts:129-138`) checks:

```typescript
// Check subscription history including trial usage
const { data: existingSubscription } = await supabase
  .from("subscriptions")
  .select("stripe_customer_id, trial_start, trial_end")
  .eq("user_id", user.id)
  .single();

// Determine eligibility
const hasHadTrial = existingSubscription?.trial_start != null;
const isEligibleForTrial =
  input.planName === "pro" &&
  !hasHadTrial &&
  !existingSubscription;
```

This prevents:
- Multiple trial abuse (user cancels and re-subscribes for another trial)
- Trial on premium plans (Pro Plus should convert immediately)
- Trial conflicts with existing subscriptions

### Testing Trials

1. **Test eligible user** (should get trial):
   - New user
   - No subscription history
   - Subscribes to Pro plan
   - Should see "Start 14-day trial" in Stripe Checkout

2. **Test ineligible user** (should NOT get trial):
   - Create a subscription with trial
   - Cancel it
   - Try to subscribe again
   - Should go straight to paid subscription

---

## Part 5: Testing Scenarios

### Test Card Numbers

Stripe provides special test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Authentication Required**: `4000 0027 6000 3184`
- **Insufficient Funds**: `4000 0000 0000 9995`

Full list: https://stripe.com/docs/testing

### Test Webhooks Manually

```bash
# Test subscription created
stripe trigger customer.subscription.created

# Test payment succeeded
stripe trigger invoice.payment_succeeded

# Test payment failed
stripe trigger invoice.payment_failed
```

---

## Part 5: Go Live Checklist

Before switching to production:

### 1. Stripe Account Verification
- Complete business verification in Stripe Dashboard
- Add banking details for payouts
- Set up tax settings

### 2. Switch to Live Mode
- Toggle to **Live mode** in Stripe Dashboard (top right)
- Get new API keys (Developers → API keys)
- Create products and prices in Live mode (same as test)
- Set up production webhook endpoint

### 3. Environment Variables
- Update `.env.production` or Vercel env vars with **live keys**:
  ```bash
  STRIPE_SECRET_KEY=sk_live_...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_... (from live webhook)
  ```

### 4. Test in Production
- Make a real $0.50 purchase to test
- Verify webhook delivery
- Refund the test purchase

### 5. Enable Customer Portal
- Go to **Settings** → **Billing** → **Customer portal**
- Enable portal
- Customize branding, cancellation policies, etc.

---

## Troubleshooting

### Issue: "No signature" error

**Cause**: Webhook secret not set or incorrect

**Fix**:
```bash
# Check your .env.local
cat .env.local | grep STRIPE_WEBHOOK_SECRET

# Should see: STRIPE_WEBHOOK_SECRET=whsec_...
```

### Issue: "Webhook signature verification failed"

**Cause**: Request body was parsed before reaching webhook handler

**Fix**: The route handler already has `export const runtime = "nodejs"` which should prevent this. If still failing, check middleware isn't parsing the body.

### Issue: Subscription created but not in database

**Cause**: Webhook didn't fire or failed

**Fix**:
1. Check Stripe CLI is running
2. Check server logs for errors
3. Check webhook was triggered in Stripe Dashboard → Developers → Events

### Issue: "Plan not found" in webhook

**Cause**: Database not updated with Stripe IDs

**Fix**: Run the SQL from Step 4 to add Product/Price IDs to database

---

## Support Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe API Reference**: https://stripe.com/docs/api
- **Test Cards**: https://stripe.com/docs/testing
- **Webhook Events**: https://stripe.com/docs/webhooks
- **Support**: https://support.stripe.com

---

## Quick Commands Reference

```bash
# Start local webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test webhook
stripe trigger customer.subscription.created

# View webhook events
stripe logs tail

# Test checkout flow
stripe checkout sessions list --limit 3

# View subscriptions
stripe subscriptions list --limit 3
```

---

## Next Steps

After setup is complete:

1. ✅ Test checkout flow with test cards
2. ✅ Verify webhooks are working
3. ✅ Test subscription cancellation
4. ✅ Build subscription management page
5. ✅ Implement feature gates
6. ✅ Add subscription badges to UI

Good luck! 🚀

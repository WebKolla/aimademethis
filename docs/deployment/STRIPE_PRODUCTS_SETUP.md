# Stripe Products & Prices Setup for Production

**Issue:** Can't see products in live Stripe account

**Solution:** Create products and prices in Stripe Live mode, then update your database with the live price IDs.

---

## Understanding the Setup

Your app has **3 subscription plans:**
1. **Free** - $0/month (no Stripe product needed)
2. **Pro** - $9/month or $90/year
3. **Pro Plus** - $29/month or $290/year

Currently, your test mode has these set up, but **Live mode is empty**.

---

## Step 1: Switch to Live Mode

1. Go to Stripe Dashboard: https://dashboard.stripe.com
2. Toggle from "Test mode" to "Live mode" (top right corner)
3. If you see a message to activate your account:
   - Complete business verification
   - Add bank account details
   - Verify your identity

---

## Step 2: Create Pro Product

### 2.1: Navigate to Products

1. In Live mode, click **"Products"** in left sidebar
2. Click **"+ Add product"** button (top right)

### 2.2: Fill in Pro Product Details

**Product information:**
- **Name:** `Pro Plan`
- **Description:** `Professional plan with advanced features and analytics`
- **Statement descriptor:** `AIMMT Pro` (appears on customer's card statement)
- **Unit label:** Leave empty

**Pricing:**
- Click **"Add another price"** to create both monthly and yearly prices

**Monthly Price:**
- **Price:** `9.00`
- **Currency:** `USD` (or your currency)
- **Billing period:** `Monthly` (Recurring)
- **Price description:** `Pro Plan - Monthly` (optional but helpful)
- **Price lookup key:** `pro_monthly` (optional, for easy reference)

**Yearly Price:**
- Click **"+ Add another price"**
- **Price:** `90.00`
- **Currency:** `USD`
- **Billing period:** `Yearly` (Recurring)
- **Price description:** `Pro Plan - Yearly`
- **Price lookup key:** `pro_yearly`

**Additional settings** (optional):
- **Metadata:** Add any custom key-value pairs if needed
  - `plan_name`: `pro`
  - `features`: `analytics,priority_support,featured_placement`

**Trial period:**
- Don't set trial period here - it's handled in your code (14 days for Pro only)

### 2.3: Save Product

- Click **"Save product"** at top right

### 2.4: Copy Price IDs

After saving, you'll see both prices listed. For each price:
1. Click on the price
2. Copy the **Price ID** (starts with `price_`)
3. Note which one is monthly vs. yearly

**Example:**
- Pro Monthly: `price_1Abc123XYZ...`
- Pro Yearly: `price_1Def456XYZ...`

---

## Step 3: Create Pro Plus Product

### 3.1: Add Product

1. Back on Products page, click **"+ Add product"** again

### 3.2: Fill in Pro Plus Product Details

**Product information:**
- **Name:** `Pro Plus Plan`
- **Description:** `Premium plan with unlimited features and white-label options`
- **Statement descriptor:** `AIMMT ProPlus`

**Pricing:**

**Monthly Price:**
- **Price:** `29.00`
- **Currency:** `USD`
- **Billing period:** `Monthly`
- **Price description:** `Pro Plus Plan - Monthly`
- **Price lookup key:** `pro_plus_monthly`

**Yearly Price:**
- Click **"+ Add another price"**
- **Price:** `290.00`
- **Currency:** `USD`
- **Billing period:** `Yearly`
- **Price description:** `Pro Plus Plan - Yearly`
- **Price lookup key:** `pro_plus_yearly`

**Metadata** (optional):
- `plan_name`: `pro_plus`
- `features`: `all_pro_features,unlimited_products,white_label,api_access,dedicated_support`

### 3.3: Save and Copy Price IDs

1. Click **"Save product"**
2. Copy both price IDs (monthly and yearly)

**Example:**
- Pro Plus Monthly: `price_1Ghi789XYZ...`
- Pro Plus Yearly: `price_1Jkl012XYZ...`

---

## Step 4: Update Your Database

Now you need to update your Supabase database with the **live** Stripe price IDs.

### 4.1: Connect to Supabase

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your AIMMT project
3. Click **"SQL Editor"** in left sidebar

### 4.2: Run Update Query

Execute this SQL query, replacing the price IDs with your actual live price IDs:

```sql
-- Update Pro plan with live Stripe price IDs
UPDATE subscription_plans
SET
  stripe_price_id_monthly = 'price_1Abc123XYZ...',  -- Replace with your Pro monthly price ID
  stripe_price_id_yearly = 'price_1Def456XYZ...'    -- Replace with your Pro yearly price ID
WHERE name = 'pro';

-- Update Pro Plus plan with live Stripe price IDs
UPDATE subscription_plans
SET
  stripe_price_id_monthly = 'price_1Ghi789XYZ...',  -- Replace with your Pro Plus monthly price ID
  stripe_price_id_yearly = 'price_1Jkl012XYZ...'    -- Replace with your Pro Plus yearly price ID
WHERE name = 'pro_plus';

-- Verify the updates
SELECT name, stripe_price_id_monthly, stripe_price_id_yearly
FROM subscription_plans
WHERE name IN ('pro', 'pro_plus');
```

### 4.3: Verify Results

The last SELECT query should show:
```
name      | stripe_price_id_monthly | stripe_price_id_yearly
----------|-------------------------|------------------------
pro       | price_1Abc123XYZ...     | price_1Def456XYZ...
pro_plus  | price_1Ghi789XYZ...     | price_1Jkl012XYZ...
```

---

## Step 5: Verify in Stripe Dashboard

### 5.1: Check Products List

1. In Stripe Dashboard (Live mode)
2. Go to **Products**
3. You should see:
   - ✅ Pro Plan (with 2 prices)
   - ✅ Pro Plus Plan (with 2 prices)

### 5.2: Check Each Product

Click on each product and verify:
- **Status:** Active
- **Prices:** Both monthly and yearly listed
- **Pricing model:** Recurring (not one-time)
- **Currency:** Correct
- **Amounts:** Correct

---

## Step 6: Test Checkout Flow

**Important:** Test with a real card, then refund immediately.

### 6.1: Test Pro Monthly

1. Go to your site (production or test deployment)
2. Log in
3. Navigate to pricing page
4. Click "Upgrade to Pro" (monthly)
5. Complete Stripe checkout with **real credit card**
6. Verify:
   - Redirected back to your site
   - Subscription created in Stripe
   - Database updated with subscription

### 6.2: Refund Test Payment

1. Stripe Dashboard → Payments
2. Find your test payment
3. Click on it
4. Click "Refund" button
5. Confirm refund

### 6.3: Clean Up Test Subscription

1. Stripe Dashboard → Customers
2. Find your test customer
3. Click on customer
4. Find subscription under "Subscriptions"
5. Cancel subscription

---

## Common Issues & Solutions

### Issue: "No such price: price_xxx"

**Cause:** Price ID doesn't exist in live mode

**Fix:**
1. Verify you're in Live mode in Stripe dashboard
2. Check price ID is copied correctly (no extra spaces)
3. Ensure price ID starts with `price_` not `prod_`
4. Verify database was updated with live IDs (not test IDs)

---

### Issue: Products exist but checkout fails

**Cause:** Database still has test mode price IDs

**Fix:**
1. Check your database `subscription_plans` table
2. If price IDs start with `price_test_`, they're test IDs
3. Update with live price IDs from Step 4

---

### Issue: Can't activate live mode

**Cause:** Stripe account not fully verified

**Fix:**
1. Complete business verification in Stripe
2. Add bank account for payouts
3. Verify business address
4. Upload required documents if requested
5. Contact Stripe support if stuck

---

### Issue: "This payment method is not available"

**Cause:** Payment method not enabled for live mode

**Fix:**
1. Stripe Dashboard → Settings → Payment methods
2. Enable "Cards" if not already enabled
3. Save changes

---

## Quick Reference: Your Current Plans

Based on your database schema, here's what you need to create:

| Plan | Monthly Price | Yearly Price | Features |
|------|--------------|--------------|----------|
| Free | $0 | $0 | Basic features (no Stripe product needed) |
| Pro | $9/month | $90/year | Analytics, Featured placement, Priority support |
| Pro Plus | $29/month | $290/year | All Pro features + Unlimited products, White-label, API access |

---

## Checklist: Stripe Products Setup

### In Stripe Dashboard (Live Mode):
- [ ] Switched to Live mode
- [ ] Created "Pro Plan" product
  - [ ] Added $9/month price
  - [ ] Added $90/year price
  - [ ] Copied both price IDs
- [ ] Created "Pro Plus Plan" product
  - [ ] Added $29/month price
  - [ ] Added $290/year price
  - [ ] Copied both price IDs

### In Supabase Database:
- [ ] Updated `subscription_plans` table with Pro monthly price ID
- [ ] Updated `subscription_plans` table with Pro yearly price ID
- [ ] Updated `subscription_plans` table with Pro Plus monthly price ID
- [ ] Updated `subscription_plans` table with Pro Plus yearly price ID
- [ ] Verified all 4 price IDs start with `price_` (not `price_test_`)
- [ ] Ran SELECT query to confirm updates

### Testing:
- [ ] Tested Pro monthly checkout with real card
- [ ] Verified subscription created in database
- [ ] Refunded test payment
- [ ] Canceled test subscription
- [ ] (Optional) Tested Pro yearly checkout
- [ ] (Optional) Tested Pro Plus checkouts

---

## Database Query Reference

If you need to check what's currently in your database:

```sql
-- View all subscription plans and their Stripe price IDs
SELECT
  name,
  display_name,
  stripe_price_id_monthly,
  stripe_price_id_yearly,
  is_active
FROM subscription_plans
ORDER BY
  CASE name
    WHEN 'free' THEN 1
    WHEN 'pro' THEN 2
    WHEN 'pro_plus' THEN 3
  END;
```

Expected output (after updating with live IDs):
```
name      | display_name | stripe_price_id_monthly | stripe_price_id_yearly | is_active
----------|--------------|-------------------------|------------------------|----------
free      | Free         | NULL                    | NULL                   | true
pro       | Pro          | price_1Abc...           | price_1Def...          | true
pro_plus  | Pro Plus     | price_1Ghi...           | price_1Jkl...          | true
```

---

## Next Steps

After completing products setup:
1. ✅ Products created in Stripe Live mode
2. ✅ Database updated with live price IDs
3. ⏭️ Next: Set up production webhook (see STRIPE_WEBHOOKS_DETAILED.md)
4. ⏭️ Next: Test full checkout flow in production
5. ⏭️ Next: Set up billing portal for customers

---

**Need help?** If you encounter any issues:
1. Check Stripe Dashboard logs (Developers → Events)
2. Check Vercel function logs for errors
3. Verify environment variables are set correctly
4. Ensure you're in Live mode (not Test mode)

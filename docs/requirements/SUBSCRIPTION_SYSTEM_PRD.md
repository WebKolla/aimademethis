# Subscription System Requirements Document (PRD)

**Project:** AIMadeThis Three-Tier Subscription System
**Version:** 1.0
**Date:** October 10, 2025
**Status:** Draft
**Owner:** Product Team

---

## Executive Summary

This document outlines the requirements for implementing a three-tier subscription system (Basic/Pro/Pro Plus) with Stripe payment processing for AIMadeThis. The system will monetize the platform while maintaining user growth through a generous free tier and clear value proposition for paid tiers.

**Goals:**
- Generate sustainable recurring revenue (MRR)
- Maintain 80%+ of current free features in Basic tier
- Achieve 5-10% free-to-paid conversion rate within 6 months
- Provide seamless payment experience with Stripe
- Enable easy subscription management for users

---

## Table of Contents

1. [Functional Requirements](#functional-requirements)
2. [Non-Functional Requirements](#non-functional-requirements)
3. [Business Rules](#business-rules)
4. [User Stories](#user-stories)
5. [Acceptance Criteria](#acceptance-criteria)
6. [Technical Architecture](#technical-architecture)
7. [Risk Assessment](#risk-assessment)
8. [Success Metrics](#success-metrics)
9. [Implementation Phases](#implementation-phases)
10. [Dependencies](#dependencies)

---

## Functional Requirements

### REQ-SUB-001: Pricing Tier Display
**Priority:** Critical
**Type:** Functional
**Status:** Not Started

**Description:**
Users can view all three pricing tiers (Basic, Pro, Pro Plus) with clear feature comparisons and pricing.

**Acceptance Criteria:**
- [ ] Pricing page displays all three tiers in responsive card layout
- [ ] Each tier shows monthly and annual pricing (annual = 20% discount)
- [ ] Feature comparison table with checkmarks/x marks for each tier
- [ ] Clear CTA buttons ("Get Started", "Upgrade to Pro", "Go Pro Plus")
- [ ] FAQ section addresses common pricing questions
- [ ] Pricing displays in USD (future: multi-currency support)
- [ ] Current user's tier is highlighted if logged in
- [ ] Dark mode compatible design

**Dependencies:** Design system, UI components
**Estimated Effort:** 8 hours

---

### REQ-SUB-002: Stripe Checkout Flow
**Priority:** Critical
**Type:** Functional
**Status:** Not Started

**Description:**
Users can subscribe to Pro or Pro Plus tiers through Stripe Checkout.

**Acceptance Criteria:**
- [ ] "Upgrade" button redirects to Stripe Checkout session
- [ ] Checkout pre-fills user email from profile
- [ ] User can choose monthly or annual billing
- [ ] User can apply promo codes in checkout
- [ ] Payment methods: Credit/Debit cards, Apple Pay, Google Pay
- [ ] Checkout supports 3D Secure (SCA compliance)
- [ ] Success redirect to `/subscription/success` with session_id
- [ ] Cancel redirect to `/pricing` page
- [ ] Checkout session expires after 24 hours
- [ ] Mobile-optimized checkout experience

**Dependencies:** Stripe account, API keys, webhook endpoint
**Estimated Effort:** 16 hours

---

### REQ-SUB-003: Subscription Management Portal
**Priority:** Critical
**Type:** Functional
**Status:** Not Started

**Description:**
Users can manage their subscription through a self-service portal.

**Acceptance Criteria:**
- [ ] `/dashboard/subscription` page shows current tier, billing cycle, next payment date
- [ ] Users can upgrade from Basic → Pro → Pro Plus (immediate)
- [ ] Users can downgrade Pro Plus → Pro → Basic (at period end)
- [ ] Users can cancel subscription (cancels at period end)
- [ ] Users can update payment method (redirects to Stripe Customer Portal)
- [ ] Users can view billing history (invoices, payments)
- [ ] Users can download invoices as PDF
- [ ] Users can re-activate cancelled subscriptions before period end
- [ ] Clear warnings before downgrade/cancel actions
- [ ] Confirmation emails sent for all subscription changes

**Dependencies:** Stripe Customer Portal, email system
**Estimated Effort:** 20 hours

---

### REQ-SUB-004: Feature Gating System
**Priority:** Critical
**Type:** Functional
**Status:** Not Started

**Description:**
Features are gated based on user's subscription tier, with clear upgrade prompts.

**Acceptance Criteria:**
- [ ] `checkSubscription()` utility function checks user tier from database
- [ ] Gated features show "Upgrade to Pro" modal when accessed by Basic users
- [ ] Dashboard shows tier-specific limitations (e.g., "3/10 products used")
- [ ] Server-side validation prevents API abuse of gated features
- [ ] Client-side UI disables/hides gated features for non-subscribers
- [ ] Upgrade modal shows feature benefits and pricing
- [ ] "Learn More" links to pricing comparison page
- [ ] Grace period (7 days) allows access after failed payment
- [ ] Feature gates work in both SSR and CSR contexts

**Dependencies:** Database schema, middleware
**Estimated Effort:** 24 hours

---

### REQ-SUB-005: Stripe Webhook Processing
**Priority:** Critical
**Type:** Functional
**Status:** Not Started

**Description:**
System processes Stripe webhook events to sync subscription status in real-time.

**Acceptance Criteria:**
- [ ] Webhook endpoint at `/api/webhooks/stripe` with signature verification
- [ ] Processes `checkout.session.completed` → creates subscription
- [ ] Processes `customer.subscription.updated` → updates tier/status
- [ ] Processes `customer.subscription.deleted` → cancels subscription
- [ ] Processes `invoice.payment_succeeded` → records payment
- [ ] Processes `invoice.payment_failed` → triggers retry + email notification
- [ ] Idempotency keys prevent duplicate processing
- [ ] Failed webhooks logged to error tracking (Sentry)
- [ ] Webhook processing completes within 5 seconds (Stripe timeout)
- [ ] Database transactions ensure atomic updates

**Dependencies:** Stripe webhook secret, error tracking
**Estimated Effort:** 20 hours

---

### REQ-SUB-006: Admin Subscription Analytics
**Priority:** High
**Type:** Functional
**Status:** Not Started

**Description:**
Admins can view subscription metrics and analytics in admin dashboard.

**Acceptance Criteria:**
- [ ] `/admin/subscriptions` page (admin-only, protected)
- [ ] Dashboard shows MRR (Monthly Recurring Revenue)
- [ ] Dashboard shows total subscribers by tier (Basic/Pro/Pro Plus)
- [ ] Dashboard shows conversion rate (Free → Paid)
- [ ] Dashboard shows churn rate (monthly)
- [ ] Dashboard shows ARPU (Average Revenue Per User)
- [ ] Dashboard shows LTV (Customer Lifetime Value estimate)
- [ ] Chart shows MRR growth over time (last 12 months)
- [ ] Table lists recent subscriptions (user, tier, date, amount)
- [ ] Export data to CSV for external analysis

**Dependencies:** Admin role system, charting library
**Estimated Effort:** 16 hours

---

### REQ-SUB-007: Email Notifications
**Priority:** High
**Type:** Functional
**Status:** Not Started

**Description:**
Users receive email notifications for all subscription-related events.

**Acceptance Criteria:**
- [ ] Subscription created: Welcome email with receipt
- [ ] Payment succeeded: Receipt with invoice link
- [ ] Payment failed: Retry notification with update payment link
- [ ] Subscription upgraded: Confirmation with new features unlocked
- [ ] Subscription downgraded: Confirmation with effective date
- [ ] Subscription cancelled: Confirmation with access end date
- [ ] Subscription reactivated: Confirmation email
- [ ] Trial ending soon (if applicable): Reminder 3 days before
- [ ] All emails branded with AIMadeThis logo and colors
- [ ] All emails mobile-responsive

**Dependencies:** Email service (Resend/SendGrid), email templates
**Estimated Effort:** 12 hours

---

### REQ-SUB-008: Promo Code System
**Priority:** Medium
**Type:** Functional
**Status:** Not Started

**Description:**
Admins can create promo codes, users can apply them during checkout.

**Acceptance Criteria:**
- [ ] Admin can create promo codes in Stripe dashboard
- [ ] Promo codes support percentage discount (e.g., 20% off)
- [ ] Promo codes support fixed amount discount (e.g., $10 off)
- [ ] Promo codes can be one-time or recurring (e.g., 3 months)
- [ ] Promo codes have expiration dates
- [ ] Promo codes have usage limits (e.g., first 100 users)
- [ ] Checkout displays applied discount clearly
- [ ] Users can remove promo code and re-apply different one
- [ ] Landing pages can pre-fill promo code via URL parameter

**Dependencies:** Stripe Promotion Codes API
**Estimated Effort:** 8 hours

---

### REQ-SUB-009: Annual Subscription Discount
**Priority:** Medium
**Type:** Functional
**Status:** Not Started

**Description:**
Users who choose annual billing receive 20% discount (2 months free).

**Acceptance Criteria:**
- [ ] Pricing page shows monthly and annual pricing side-by-side
- [ ] Annual pricing calculated as (monthly × 10) for 20% discount
- [ ] "Save 20%" badge displayed on annual option
- [ ] Checkout allows toggle between monthly/annual billing
- [ ] Annual subscriptions billed once per year (not monthly)
- [ ] Invoices clearly state annual billing cycle
- [ ] Refund policy states no pro-rated refunds for annual plans

**Dependencies:** Stripe price objects for annual plans
**Estimated Effort:** 4 hours

---

### REQ-SUB-010: Failed Payment Retry Logic
**Priority:** High
**Type:** Functional
**Status:** Not Started

**Description:**
System automatically retries failed payments using Stripe Smart Retries.

**Acceptance Criteria:**
- [ ] Stripe Smart Retries enabled (automatic retry schedule)
- [ ] First retry: 3 days after failure
- [ ] Second retry: 5 days after failure
- [ ] Third retry: 7 days after failure
- [ ] Email sent after each failed attempt
- [ ] Grace period: Users retain access for 7 days after final failure
- [ ] After grace period: Subscription status changes to `past_due`
- [ ] After 14 days past_due: Subscription cancelled automatically
- [ ] Users can manually update payment method to retry immediately

**Dependencies:** Stripe subscription settings, email notifications
**Estimated Effort:** 8 hours

---

## Non-Functional Requirements

### REQ-SUB-NFR-001: Performance
**Priority:** Critical
**Type:** Non-Functional
**Status:** Not Started

**Description:**
Subscription checks must be fast and not degrade user experience.

**Acceptance Criteria:**
- [ ] `checkSubscription()` query completes in <50ms (p95)
- [ ] Subscription data cached in session/JWT for 5 minutes
- [ ] Feature gate checks do not block page rendering (SSR)
- [ ] Pricing page loads in <2 seconds (LCP)
- [ ] Checkout redirect happens in <500ms
- [ ] Webhook processing completes in <3 seconds (p95)

**Dependencies:** Database indexing, caching strategy
**Estimated Effort:** Included in implementation

---

### REQ-SUB-NFR-002: Security & Compliance
**Priority:** Critical
**Type:** Non-Functional
**Status:** Not Started

**Description:**
Payment processing must be PCI compliant and secure.

**Acceptance Criteria:**
- [ ] All payment data handled by Stripe (no card details stored)
- [ ] Webhook signature verification prevents spoofing
- [ ] API keys stored in environment variables (never in code)
- [ ] Stripe API calls made from server-side only
- [ ] Customer Portal uses secure session tokens
- [ ] Subscription status checks enforce server-side validation
- [ ] HTTPS enforced on all payment-related pages
- [ ] GDPR compliant: Users can export/delete subscription data

**Dependencies:** Environment configuration, server actions
**Estimated Effort:** Included in implementation

---

### REQ-SUB-NFR-003: Reliability
**Priority:** High
**Type:** Non-Functional
**Status:** Not Started

**Description:**
Subscription system must be highly reliable with minimal downtime.

**Acceptance Criteria:**
- [ ] Webhook endpoint has 99.9% uptime
- [ ] Failed webhooks logged and alerting configured
- [ ] Database transactions prevent partial updates
- [ ] Stripe API failures handled gracefully with retries
- [ ] Users see friendly error messages (never stack traces)
- [ ] Subscription status synced even if webhook delayed
- [ ] Manual sync tool for admins to fix inconsistencies

**Dependencies:** Error tracking (Sentry), monitoring (Vercel Analytics)
**Estimated Effort:** 8 hours

---

### REQ-SUB-NFR-004: Scalability
**Priority:** Medium
**Type:** Non-Functional
**Status:** Not Started

**Description:**
System must scale to 10,000+ paid subscribers without performance degradation.

**Acceptance Criteria:**
- [ ] Database queries use proper indexes on `subscription_tier`, `user_id`
- [ ] Webhook processing uses job queue for high volume (future: Inngest)
- [ ] Subscription checks cached at CDN edge (Vercel Edge Config)
- [ ] Stripe rate limits handled gracefully (max 100 req/sec)
- [ ] Admin analytics queries optimized with materialized views

**Dependencies:** Database optimization, edge caching
**Estimated Effort:** 12 hours

---

## Business Rules

### REQ-SUB-BR-001: Tier Definitions
**Priority:** Critical
**Type:** Business Rule
**Status:** Not Started

**Tier Structure:**

| Feature | Basic (Free) | Pro ($19/mo) | Pro Plus ($49/mo) |
|---------|--------------|--------------|-------------------|
| **Product Submissions** | 10 products | Unlimited | Unlimited |
| **Analytics** | Basic stats | Advanced analytics | Advanced + API access |
| **Priority Support** | Community | Email (48hr) | Priority (24hr) |
| **Badges** | Standard | "Pro" badge | "Pro Plus" badge |
| **Ad-Free Experience** | ❌ | ✅ | ✅ |
| **Product Promotion** | Standard | Featured (1/mo) | Featured (4/mo) + Homepage |
| **API Access** | ❌ | Read-only | Full CRUD |
| **Custom Branding** | ❌ | ❌ | ✅ Profile page |
| **Early Access** | ❌ | ✅ | ✅ + Beta features |

**Rationale:**
- Basic tier retains 80% of current features to drive signups
- Pro tier targets indie makers and small teams ($19/mo sweet spot)
- Pro Plus tier targets agencies and power users (10x value for 2.5x price)

---

### REQ-SUB-BR-002: Free Trial Period
**Priority:** High
**Type:** Business Rule
**Status:** Not Started

**Rule:** **14-day free trial for Pro tier only** (not Pro Plus)

**Details:**
- New users can trial Pro tier for 14 days (no credit card required)
- Trial starts when user clicks "Start Free Trial" button
- Trial includes all Pro features
- Trial expires automatically after 14 days → reverts to Basic
- Users prompted to enter payment 3 days before trial ends
- Users can only trial once per account (prevent abuse)
- Pro Plus does not offer trial (premium tier, immediate payment)

**Rationale:** Lower friction for Pro conversions, Pro Plus is for committed users.

---

### REQ-SUB-BR-003: Refund Policy
**Priority:** High
**Type:** Business Rule
**Status:** Not Started

**Rule:** **7-day full refund, no pro-rated refunds**

**Details:**
- Full refund available within 7 days of first payment
- After 7 days: No refunds, but can cancel anytime (access until period end)
- Annual plans: 7-day full refund, no pro-rated refunds for mid-year cancellation
- Refunds processed within 5-10 business days to original payment method
- Users must contact support for refund (prevents accidental cancellations)
- Abuse prevention: Max 2 refunds per user lifetime

**Rationale:** Balance customer satisfaction with revenue protection.

---

### REQ-SUB-BR-004: Grace Period for Failed Payments
**Priority:** High
**Type:** Business Rule
**Status:** Not Started

**Rule:** **7-day grace period with full access**

**Details:**
- After payment failure: User retains full Pro/Pro Plus access for 7 days
- Email notifications sent on days 1, 3, 5, 7 after failure
- After 7 days: Features downgrade to Basic tier
- Subscription status: `active` (grace period) → `past_due` (after 7 days)
- After 14 days `past_due`: Subscription cancelled automatically
- Re-activating subscription before cancellation restores access immediately

**Rationale:** Reduce involuntary churn from expired cards, gives users time to fix payment.

---

### REQ-SUB-BR-005: Upgrade/Downgrade Rules
**Priority:** Critical
**Type:** Business Rule
**Status:** Not Started

**Upgrade Rules:**
- Upgrades are **immediate** (Basic → Pro, Pro → Pro Plus)
- User charged pro-rated amount for remaining billing period
- Example: User on $19/mo Pro for 15 days → upgrades to $49/mo Pro Plus → charged $15 for remaining 15 days

**Downgrade Rules:**
- Downgrades happen **at period end** (no immediate downgrade)
- User retains current tier access until next billing date
- Example: Pro Plus user downgrades on Jan 5 → retains Pro Plus until Feb 1
- After period end: Subscription changes to lower tier, invoice adjusts

**Cancellation Rules:**
- Cancellations happen **at period end** (no immediate cancellation)
- User retains paid tier access until next billing date
- No refunds for unused time (except within 7-day refund window)
- Users can re-activate before period end to prevent cancellation

**Rationale:** Industry standard practice, fair to both users and business.

---

### REQ-SUB-BR-006: Grandfathering Rules
**Priority:** Medium
**Type:** Business Rule
**Status:** Not Started

**Rule:** **Existing power users grandfathered into Pro tier (free for 1 year)**

**Details:**
- Users who meet criteria get free Pro access for 12 months:
  - Account created before launch (Phase 1-3 beta testers)
  - Submitted 5+ products to platform
  - 100+ total votes received across products
- Grandfathered users get "Founding Member" badge
- After 12 months: Auto-downgrade to Basic (not charged, must opt-in to continue Pro)
- Email notifications sent 30 days, 7 days before expiration

**Rationale:** Reward early adopters, build goodwill, seed Pro tier with engaged users.

---

### REQ-SUB-BR-007: Discount & Promo Code Rules
**Priority:** Medium
**Type:** Business Rule
**Status:** Not Started

**Standard Promo Codes:**
- `LAUNCH50`: 50% off first month (Pro or Pro Plus) - Limited to first 500 users
- `ANNUAL20`: 20% off annual plans (automatic, always available)
- `PRODUCTHUNT`: 30% off first 3 months (Product Hunt launch)
- `FRIEND20`: 20% off first month (referral code for existing users)

**Promo Code Rules:**
- Only one promo code per subscription
- Promo codes apply to first payment only (unless specified as recurring)
- Annual discount (20%) can stack with promo codes (e.g., LAUNCH50 + annual = 60% off first year)
- Promo codes expire after set date or usage limit
- Invalid promo codes show friendly error message

**Rationale:** Drive conversions during key moments (launch, Product Hunt), reward referrals.

---

### REQ-SUB-BR-008: Annual vs Monthly Pricing
**Priority:** High
**Type:** Business Rule
**Status:** Not Started

**Pricing Structure:**

| Tier | Monthly | Annual (20% off) | Annual Savings |
|------|---------|------------------|----------------|
| **Pro** | $19/mo | $190/year ($15.83/mo) | $38/year |
| **Pro Plus** | $49/mo | $490/year ($40.83/mo) | $98/year |

**Rules:**
- Annual plans billed once per year (not monthly)
- Annual plans cannot be refunded pro-rated (7-day full refund only)
- Annual plans can be cancelled anytime (access until year end)
- Annual plans renew automatically unless cancelled
- Users can switch monthly ↔ annual at period end (not immediate)

**Rationale:** 20% discount incentivizes annual commitment, reduces churn, improves cash flow.

---

### REQ-SUB-BR-009: Usage Limits & Enforcement
**Priority:** High
**Type:** Business Rule
**Status:** Not Started

**Hard Limits (Cannot Exceed):**
- Basic: 10 products max
  - Attempting to create 11th product → "Upgrade to Pro" modal
  - Cannot publish draft if at limit
- Pro: Unlimited products, 1 featured product/month
  - Attempting to feature 2nd product → "Already used this month"
- Pro Plus: Unlimited products, 4 featured products/month

**Soft Limits (Warnings):**
- Basic: 9/10 products → Warning banner "Approaching limit, upgrade to Pro for unlimited"
- All tiers: Email storage approaching quota → "Your images are using 90% of storage"

**Enforcement:**
- Server-side validation on all product creation/update APIs
- Client-side UI disables "Create Product" button at limit
- Graceful degradation: If user somehow exceeds limit, oldest draft becomes read-only

**Rationale:** Clear limits prevent abuse, drive upgrades, maintain fair usage.

---

### REQ-SUB-BR-010: Payment Failure & Retry Strategy
**Priority:** High
**Type:** Business Rule
**Status:** Not Started

**Stripe Smart Retries Schedule:**
1. **Day 0:** Payment fails → Email notification #1 → Grace period starts
2. **Day 3:** Automatic retry #1 → If fails: Email notification #2
3. **Day 5:** Automatic retry #2 → If fails: Email notification #3
4. **Day 7:** Automatic retry #3 → If fails: Email notification #4 → Grace period ends → Features downgrade
5. **Day 14:** Subscription status `past_due` → Auto-cancel → Email notification #5

**Dunning Management:**
- Email subject lines get progressively urgent:
  - Day 0: "Payment failed - please update your card"
  - Day 7: "Your Pro access will end today - update payment now"
  - Day 14: "Your subscription has been cancelled"
- Each email includes direct link to update payment method (Stripe Customer Portal)
- Admin dashboard shows list of `past_due` subscriptions for manual follow-up

**Rationale:** Industry best practice, balances automatic recovery with user communication.

---

## User Stories

### Epic 1: Discovery & Conversion

#### US-SUB-001: View Pricing Options
**As a** free user
**I want to** see all pricing tiers and their features
**So that** I can decide if upgrading is worth it for me

**Acceptance Criteria:**
- [ ] Pricing page accessible from navbar "Pricing" link
- [ ] All three tiers displayed side-by-side
- [ ] Feature comparison table shows checkmarks/x marks
- [ ] Monthly and annual pricing toggle
- [ ] Clear CTA buttons for each tier
- [ ] FAQ section answers common questions

**Priority:** Critical
**Estimated Effort:** 6 hours

---

#### US-SUB-002: Start Free Pro Trial
**As a** free user
**I want to** start a 14-day Pro trial without entering payment info
**So that** I can test Pro features before committing

**Acceptance Criteria:**
- [ ] "Start Free Trial" button on pricing page
- [ ] Trial starts immediately (no credit card required)
- [ ] Dashboard banner shows "Pro Trial - X days remaining"
- [ ] Email confirmation sent with trial details
- [ ] All Pro features unlocked during trial
- [ ] Trial expires automatically after 14 days

**Priority:** High
**Estimated Effort:** 8 hours

---

#### US-SUB-003: Upgrade with Stripe Checkout
**As a** free user
**I want to** upgrade to Pro or Pro Plus
**So that** I can unlock advanced features

**Acceptance Criteria:**
- [ ] "Upgrade to Pro" button redirects to Stripe Checkout
- [ ] Checkout pre-fills my email
- [ ] I can choose monthly or annual billing
- [ ] I can apply a promo code
- [ ] Checkout supports Apple Pay / Google Pay
- [ ] After payment: Redirected to success page
- [ ] Email receipt sent immediately

**Priority:** Critical
**Estimated Effort:** 12 hours

---

### Epic 2: Subscription Management

#### US-SUB-004: View Subscription Status
**As a** Pro user
**I want to** see my current subscription details
**So that** I know when my next payment is and what I'm paying

**Acceptance Criteria:**
- [ ] Dashboard shows "Subscription: Pro - $19/month"
- [ ] Next billing date displayed
- [ ] Link to view billing history
- [ ] Link to manage subscription (upgrade/downgrade/cancel)
- [ ] Badge on profile shows "Pro Member"

**Priority:** High
**Estimated Effort:** 6 hours

---

#### US-SUB-005: Upgrade Tier
**As a** Pro user
**I want to** upgrade to Pro Plus
**So that** I can access premium features

**Acceptance Criteria:**
- [ ] "Upgrade to Pro Plus" button in subscription settings
- [ ] Upgrade happens immediately
- [ ] Charged pro-rated amount for remaining billing period
- [ ] Confirmation email sent
- [ ] Dashboard updates to show Pro Plus tier
- [ ] All Pro Plus features unlocked immediately

**Priority:** High
**Estimated Effort:** 8 hours

---

#### US-SUB-006: Downgrade Tier
**As a** Pro Plus user
**I want to** downgrade to Pro or Basic
**So that** I can save money if I don't need premium features

**Acceptance Criteria:**
- [ ] "Downgrade" button in subscription settings
- [ ] Warning modal: "Downgrade takes effect on [date]"
- [ ] Confirmation required (checkbox + "Confirm Downgrade")
- [ ] Confirmation email sent
- [ ] Dashboard shows "Downgrading to Pro on [date]"
- [ ] After period end: Tier changes, invoice adjusts

**Priority:** High
**Estimated Effort:** 8 hours

---

#### US-SUB-007: Cancel Subscription
**As a** Pro user
**I want to** cancel my subscription
**So that** I'm not charged again next month

**Acceptance Criteria:**
- [ ] "Cancel Subscription" button in subscription settings
- [ ] Warning modal: "Access continues until [date]"
- [ ] Required to select cancellation reason (survey)
- [ ] Confirmation required (checkbox + "Confirm Cancellation")
- [ ] Confirmation email sent
- [ ] Dashboard shows "Cancelled - Access until [date]"
- [ ] Can re-activate before period end

**Priority:** Critical
**Estimated Effort:** 8 hours

---

#### US-SUB-008: Update Payment Method
**As a** Pro user
**I want to** update my credit card
**So that** my payments don't fail when my card expires

**Acceptance Criteria:**
- [ ] "Update Payment Method" button in subscription settings
- [ ] Redirects to Stripe Customer Portal
- [ ] Can add new card, remove old card, set default
- [ ] Changes saved immediately
- [ ] Confirmation email sent
- [ ] Next payment uses new card

**Priority:** High
**Estimated Effort:** 4 hours

---

### Epic 3: Feature Access

#### US-SUB-009: Access Gated Feature
**As a** Pro user
**I want to** access advanced analytics for my products
**So that** I can understand how users engage with my submissions

**Acceptance Criteria:**
- [ ] Analytics page shows detailed metrics (views, clicks, conversions)
- [ ] Charts visualize data over time (last 30 days)
- [ ] Export data to CSV
- [ ] Basic users see "Upgrade to Pro" modal when accessing
- [ ] Pro badge displayed on analytics page

**Priority:** High
**Estimated Effort:** 16 hours

---

#### US-SUB-010: Hit Usage Limit
**As a** Basic user
**I want to** be warned when approaching my product limit
**So that** I can upgrade before hitting the limit

**Acceptance Criteria:**
- [ ] Dashboard shows "8/10 products used"
- [ ] Warning banner at 9/10: "Approaching limit - Upgrade to Pro"
- [ ] At 10/10: "Create Product" button disabled
- [ ] Modal explains: "You've reached the 10-product limit for Basic"
- [ ] "Upgrade to Pro" CTA in modal
- [ ] After upgrade: Button re-enabled immediately

**Priority:** High
**Estimated Effort:** 6 hours

---

#### US-SUB-011: Feature Product
**As a** Pro user
**I want to** feature one of my products per month
**So that** it gets more visibility on the homepage

**Acceptance Criteria:**
- [ ] "Feature This Product" button on product edit page (Pro/Pro Plus only)
- [ ] Pro: Can feature 1 product/month
- [ ] Pro Plus: Can feature 4 products/month
- [ ] Featured products shown in "Featured" section on homepage
- [ ] Dashboard shows "Featured products used: 1/1 this month"
- [ ] Basic users see "Upgrade to Pro to feature products" tooltip

**Priority:** Medium
**Estimated Effort:** 12 hours

---

### Epic 4: Admin & Analytics

#### US-SUB-012: View Subscription Analytics
**As an** admin
**I want to** see subscription revenue and metrics
**So that** I can track business growth

**Acceptance Criteria:**
- [ ] Admin dashboard shows MRR (Monthly Recurring Revenue)
- [ ] Shows total subscribers: Basic, Pro, Pro Plus
- [ ] Shows conversion rate: Free → Paid
- [ ] Shows churn rate: % cancelled last month
- [ ] Shows ARPU: Average Revenue Per User
- [ ] Chart: MRR growth over last 12 months
- [ ] Table: Recent subscriptions (user, tier, date, amount)
- [ ] Export to CSV

**Priority:** Medium
**Estimated Effort:** 16 hours

---

#### US-SUB-013: Manually Sync Subscription
**As an** admin
**I want to** manually sync a user's subscription from Stripe
**So that** I can fix inconsistencies caused by webhook failures

**Acceptance Criteria:**
- [ ] Admin page: "User Management"
- [ ] Search for user by email or ID
- [ ] "Sync Subscription from Stripe" button
- [ ] Fetches latest subscription status from Stripe API
- [ ] Updates database with correct tier, status, billing date
- [ ] Logs sync action for audit trail
- [ ] Confirmation message: "Subscription synced successfully"

**Priority:** Low
**Estimated Effort:** 8 hours

---

### Epic 5: Communication

#### US-SUB-014: Receive Payment Confirmation
**As a** user
**I want to** receive an email after successful payment
**So that** I have a record for my accounting

**Acceptance Criteria:**
- [ ] Email sent immediately after payment succeeds
- [ ] Email includes: Amount, date, invoice number, tier, billing period
- [ ] Email includes link to download PDF invoice
- [ ] Email branded with AIMadeThis logo
- [ ] Email mobile-responsive

**Priority:** High
**Estimated Effort:** 4 hours

---

#### US-SUB-015: Receive Failed Payment Notification
**As a** user
**I want to** be notified if my payment fails
**So that** I can update my payment method and avoid losing access

**Acceptance Criteria:**
- [ ] Email sent immediately after payment fails
- [ ] Email subject: "Payment failed - please update your card"
- [ ] Email includes: Failure reason, next retry date, link to update payment
- [ ] Email friendly tone, not alarming
- [ ] Follow-up emails on Day 3, 5, 7 if not resolved

**Priority:** High
**Estimated Effort:** 4 hours

---

#### US-SUB-016: Receive Trial Ending Reminder
**As a** trial user
**I want to** be reminded before my trial ends
**So that** I can decide to subscribe or let it expire

**Acceptance Criteria:**
- [ ] Email sent 3 days before trial ends
- [ ] Email subject: "Your Pro trial ends in 3 days"
- [ ] Email includes: Trial end date, Pro pricing, CTA to subscribe
- [ ] Email explains what happens after trial (reverts to Basic)
- [ ] One-click subscribe link in email

**Priority:** Medium
**Estimated Effort:** 4 hours

---

## Acceptance Criteria

### Overall System Acceptance

**The subscription system is considered complete when:**

✅ **Functional Completeness**
- [ ] All three tiers (Basic, Pro, Pro Plus) defined and documented
- [ ] Pricing page displays all tiers with accurate pricing
- [ ] Stripe Checkout flow works for Pro and Pro Plus
- [ ] Users can manage subscriptions (upgrade/downgrade/cancel)
- [ ] Feature gating correctly restricts Basic users from Pro/Pro Plus features
- [ ] Webhook processing syncs subscription status within 30 seconds
- [ ] Admin dashboard displays subscription analytics
- [ ] Email notifications sent for all subscription events

✅ **Quality & Performance**
- [ ] All feature gates enforce server-side validation (no client-side bypass)
- [ ] Subscription checks complete in <100ms (p95)
- [ ] Pricing page loads in <2 seconds (LCP)
- [ ] Checkout flow works on mobile and desktop (iOS, Android, Chrome, Safari)
- [ ] Webhook endpoint has 99.9% uptime (monitored)
- [ ] Failed webhooks logged and alerted within 5 minutes
- [ ] No card details stored in database (PCI compliance)

✅ **Business Logic**
- [ ] Free trial (14 days, no credit card) works for Pro tier
- [ ] Annual discount (20%) applied correctly
- [ ] Promo codes can be applied during checkout
- [ ] Upgrades are immediate, downgrades at period end
- [ ] Cancellations retain access until period end
- [ ] Grace period (7 days) enforced for failed payments
- [ ] Refund policy (7-day full refund) enforced
- [ ] Grandfathered users (beta testers) get free Pro for 12 months

✅ **User Experience**
- [ ] Upgrade modals explain benefits clearly
- [ ] Usage limits show progress (e.g., "8/10 products")
- [ ] Confirmation required for destructive actions (cancel, downgrade)
- [ ] Error messages are user-friendly (no stack traces)
- [ ] Emails are branded, mobile-responsive, and actionable
- [ ] Customer support can help users resolve payment issues

✅ **Testing & Validation**
- [ ] End-to-end test: Free user → Start trial → Upgrade to Pro → Cancel
- [ ] End-to-end test: Pro user → Upgrade to Pro Plus → Downgrade to Basic
- [ ] Webhook test: All 6 critical events processed correctly
- [ ] Load test: Webhook endpoint handles 100 events/minute
- [ ] Security test: Cannot bypass feature gates via API manipulation
- [ ] Browser test: Checkout works on Chrome, Safari, Firefox, Edge (mobile + desktop)

---

## Technical Architecture

### Database Schema

```sql
-- New table: subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,

  -- Subscription details
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'pro', 'pro_plus')),
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),

  -- Pricing (in cents, USD)
  price_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',

  -- Dates
  trial_start_at TIMESTAMPTZ,
  trial_end_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes
  UNIQUE(user_id)
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only backend can insert/update subscriptions (via service role)
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- New table: invoices (for billing history)
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT UNIQUE NOT NULL,

  -- Invoice details
  amount_paid INTEGER NOT NULL, -- in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),

  -- Dates
  invoice_date TIMESTAMPTZ NOT NULL,
  paid_at TIMESTAMPTZ,

  -- Links
  invoice_pdf_url TEXT,
  hosted_invoice_url TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);

-- RLS Policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage invoices"
  ON invoices FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Add subscription_tier to profiles table (denormalized for faster checks)
ALTER TABLE profiles ADD COLUMN subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'pro', 'pro_plus'));
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);
```

---

### Stripe Integration Architecture

```typescript
// lib/stripe/config.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
  typescript: true,
});

export const STRIPE_PRICE_IDS = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
  pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL!,
  pro_plus_monthly: process.env.STRIPE_PRICE_PRO_PLUS_MONTHLY!,
  pro_plus_annual: process.env.STRIPE_PRICE_PRO_PLUS_ANNUAL!,
} as const;

export const TIER_LIMITS = {
  basic: {
    products: 10,
    featured_per_month: 0,
    api_access: false,
  },
  pro: {
    products: Infinity,
    featured_per_month: 1,
    api_access: 'read_only',
  },
  pro_plus: {
    products: Infinity,
    featured_per_month: 4,
    api_access: 'full',
  },
} as const;
```

```typescript
// lib/stripe/checkout.ts
import { stripe, STRIPE_PRICE_IDS } from './config';
import { createClient } from '@/lib/supabase/server';

export async function createCheckoutSession(
  userId: string,
  tier: 'pro' | 'pro_plus',
  billingCycle: 'monthly' | 'annual'
) {
  const supabase = await createClient();

  // Get user email
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single();

  if (!profile) throw new Error('Profile not found');

  // Determine price ID
  const priceId =
    tier === 'pro'
      ? billingCycle === 'monthly'
        ? STRIPE_PRICE_IDS.pro_monthly
        : STRIPE_PRICE_IDS.pro_annual
      : billingCycle === 'monthly'
      ? STRIPE_PRICE_IDS.pro_plus_monthly
      : STRIPE_PRICE_IDS.pro_plus_annual;

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    customer_email: profile.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: {
      user_id: userId,
      tier,
      billing_cycle: billingCycle,
    },
  });

  return session.url;
}
```

```typescript
// lib/stripe/webhooks.ts
import { stripe } from './config';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

export async function handleWebhookEvent(event: Stripe.Event) {
  const supabase = await createClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Create subscription record
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await supabase.from('subscriptions').insert({
        user_id: session.metadata!.user_id,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        tier: session.metadata!.tier,
        status: subscription.status,
        billing_cycle: session.metadata!.billing_cycle,
        price_amount: subscription.items.data[0].price.unit_amount!,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
      });

      // Update profile tier
      await supabase
        .from('profiles')
        .update({ subscription_tier: session.metadata!.tier })
        .eq('id', session.metadata!.user_id);

      // Send welcome email
      await sendEmail({
        to: session.customer_email!,
        subject: 'Welcome to AIMadeThis Pro!',
        template: 'subscription-created',
        data: { tier: session.metadata!.tier },
      });

      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date(),
        })
        .eq('stripe_subscription_id', subscription.id);

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date(),
          updated_at: new Date(),
        })
        .eq('stripe_subscription_id', subscription.id);

      // Downgrade profile tier to Basic
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscription.id)
        .single();

      if (sub) {
        await supabase
          .from('profiles')
          .update({ subscription_tier: 'basic' })
          .eq('id', sub.user_id);
      }

      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;

      // Record invoice
      await supabase.from('invoices').insert({
        user_id: invoice.metadata!.user_id,
        stripe_invoice_id: invoice.id,
        amount_paid: invoice.amount_paid,
        status: 'paid',
        invoice_date: new Date(invoice.created * 1000),
        paid_at: new Date(),
        invoice_pdf_url: invoice.invoice_pdf,
        hosted_invoice_url: invoice.hosted_invoice_url,
      });

      // Send receipt email
      await sendEmail({
        to: invoice.customer_email!,
        subject: 'Payment Receipt - AIMadeThis',
        template: 'payment-succeeded',
        data: {
          amount: invoice.amount_paid / 100,
          invoice_url: invoice.hosted_invoice_url,
        },
      });

      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;

      // Send failed payment email
      await sendEmail({
        to: invoice.customer_email!,
        subject: 'Payment Failed - Please Update Your Card',
        template: 'payment-failed',
        data: {
          next_retry_date: invoice.next_payment_attempt
            ? new Date(invoice.next_payment_attempt * 1000)
            : null,
          update_payment_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/subscription`,
        },
      });

      break;
    }
  }
}
```

---

### Feature Gating Utilities

```typescript
// lib/subscription/check.ts
import { createClient } from '@/lib/supabase/server';

export type SubscriptionTier = 'basic' | 'pro' | 'pro_plus';

export async function getSubscriptionTier(userId: string): Promise<SubscriptionTier> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  return (profile?.subscription_tier || 'basic') as SubscriptionTier;
}

export async function checkFeatureAccess(
  userId: string,
  requiredTier: SubscriptionTier
): Promise<boolean> {
  const currentTier = await getSubscriptionTier(userId);

  const tierHierarchy = ['basic', 'pro', 'pro_plus'];
  const currentTierIndex = tierHierarchy.indexOf(currentTier);
  const requiredTierIndex = tierHierarchy.indexOf(requiredTier);

  return currentTierIndex >= requiredTierIndex;
}

export async function checkProductLimit(userId: string): Promise<{
  current: number;
  limit: number;
  canCreate: boolean;
}> {
  const tier = await getSubscriptionTier(userId);
  const supabase = await createClient();

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const limit = tier === 'basic' ? 10 : Infinity;

  return {
    current: count || 0,
    limit,
    canCreate: (count || 0) < limit,
  };
}
```

```typescript
// middleware.ts (add subscription checks)
import { checkFeatureAccess } from '@/lib/subscription/check';

export async function middleware(request: NextRequest) {
  // ... existing auth checks ...

  // Check if route requires Pro tier
  const proRoutes = ['/dashboard/analytics', '/api/v1/products'];
  const isProRoute = proRoutes.some(route => pathname.startsWith(route));

  if (isProRoute && user) {
    const hasAccess = await checkFeatureAccess(user.id, 'pro');
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }

  return response;
}
```

---

### API Routes

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { handleWebhookEvent } from '@/lib/stripe/webhooks';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    await handleWebhookEvent(event);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook processing failed:', err);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
```

```typescript
// app/api/subscription/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/stripe/checkout';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier, billing_cycle } = await req.json();

  if (!tier || !billing_cycle) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const checkoutUrl = await createCheckoutSession(user.id, tier, billing_cycle);
    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error('Checkout session creation failed:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
```

---

## Risk Assessment

### REQ-SUB-RISK-001: User Churn Due to Aggressive Paywalls
**Severity:** High
**Likelihood:** Medium
**Impact:** High (revenue loss, negative sentiment)

**Description:**
If too many features are gated behind Pro/Pro Plus, users may churn before experiencing value.

**Mitigation Strategies:**
- [ ] 80% of current features remain free in Basic tier
- [ ] Pro trial (14 days, no credit card) lets users test value
- [ ] Upgrade modals explain benefits, not just "blocked" messages
- [ ] Analytics track "upgrade modal abandonment rate" to identify friction
- [ ] A/B test: Aggressive gates vs. soft nudges (tooltips, banners)
- [ ] Grandfather beta users into Pro for 1 year (build goodwill)

**Contingency Plan:**
If conversion rate <2% after 3 months → Reduce gates, move some Pro features to Basic.

---

### REQ-SUB-RISK-002: Stripe Integration Bugs Cause Payment Failures
**Severity:** Critical
**Likelihood:** Low
**Impact:** Critical (revenue loss, user frustration)

**Description:**
Bugs in Stripe Checkout or webhook processing could cause failed payments or incorrect tier assignments.

**Mitigation Strategies:**
- [ ] Thorough testing in Stripe test mode before production
- [ ] Webhook signature verification prevents spoofing
- [ ] Database transactions ensure atomic updates (no partial state)
- [ ] Idempotency keys prevent duplicate processing
- [ ] Error tracking (Sentry) logs all webhook failures
- [ ] Manual sync tool for admins to fix inconsistencies
- [ ] Stripe dashboard monitored daily for failed webhooks

**Contingency Plan:**
If critical bug discovered → Pause new subscriptions, manual sync affected users, deploy hotfix within 24 hours.

---

### REQ-SUB-RISK-003: Feature Gates Have Loopholes
**Severity:** High
**Likelihood:** Medium
**Impact:** High (revenue loss, unfair access)

**Description:**
Users could bypass feature gates via API manipulation, direct URL access, or client-side hacks.

**Mitigation Strategies:**
- [ ] Server-side validation on ALL feature-gated endpoints
- [ ] Feature checks use `checkFeatureAccess()` utility (server-only)
- [ ] Middleware enforces tier checks before rendering protected routes
- [ ] API endpoints return 403 Forbidden for unauthorized tier access
- [ ] Client-side gates are cosmetic only (UI disabled, not security)
- [ ] Penetration testing by security team before launch
- [ ] Rate limiting on API endpoints to prevent brute force

**Contingency Plan:**
If loophole discovered → Deploy hotfix within 4 hours, identify exploiters (manual review), offer paid tier or ban (case-by-case).

---

### REQ-SUB-RISK-004: Webhook Failures Cause Data Inconsistency
**Severity:** High
**Likelihood:** Medium
**Impact:** High (incorrect tier, billing issues)

**Description:**
If webhooks fail or are delayed, subscription status in database may not match Stripe.

**Mitigation Strategies:**
- [ ] Webhook processing is idempotent (safe to retry)
- [ ] Failed webhooks logged to Sentry with alert to Slack
- [ ] Stripe retries failed webhooks automatically (up to 3 days)
- [ ] Daily cron job syncs subscription status from Stripe API (reconciliation)
- [ ] Admin dashboard shows "Last synced" timestamp for each subscription
- [ ] Manual sync tool for admins to force re-sync from Stripe
- [ ] Database has `updated_at` timestamp to detect stale data

**Contingency Plan:**
If widespread inconsistency (>5% of users) → Run manual reconciliation script, notify affected users, investigate webhook failure root cause.

---

### REQ-SUB-RISK-005: Complex Upgrade/Downgrade Logic Causes Billing Errors
**Severity:** High
**Likelihood:** Medium
**Impact:** High (user complaints, refunds, bad reviews)

**Description:**
Pro-rating, immediate upgrades, period-end downgrades could have edge cases causing incorrect charges.

**Mitigation Strategies:**
- [ ] Stripe handles all pro-rating calculations (don't implement custom logic)
- [ ] Thorough testing of upgrade/downgrade flows in test mode
- [ ] User confirmation modals clearly explain charges/credits
- [ ] Invoices show line-item breakdown of pro-rating
- [ ] Refund policy clearly stated (7-day full refund, no pro-rating)
- [ ] Customer support trained to handle billing disputes
- [ ] Analytics track "refund requests" to identify common issues

**Contingency Plan:**
If billing error affects multiple users → Issue refunds immediately, fix bug within 24 hours, send apology email to affected users.

---

### REQ-SUB-RISK-006: Failed Payments Lead to Involuntary Churn
**Severity:** High
**Likelihood:** High (industry avg: 10-15% failed payments)
**Impact:** High (revenue loss, user frustration)

**Description:**
Expired cards, insufficient funds, or bank declines cause payment failures, leading to subscription cancellations.

**Mitigation Strategies:**
- [ ] Stripe Smart Retries enabled (automatic retry schedule: Day 3, 5, 7)
- [ ] Grace period (7 days) retains access during retries
- [ ] Email notifications after each failed attempt (actionable links)
- [ ] Stripe Billing Portal allows easy card updates
- [ ] Dunning emails progressively urgent (Day 0 → Day 14)
- [ ] Admin dashboard tracks `past_due` subscriptions for manual follow-up
- [ ] Analytics track "payment success rate" to monitor health

**Contingency Plan:**
If payment failure rate >20% → Investigate Stripe integration, extend grace period to 14 days, offer alternative payment methods (PayPal).

---

### REQ-SUB-RISK-007: Annual Plan Users Request Mid-Year Refunds
**Severity:** Medium
**Likelihood:** Medium
**Impact:** Medium (customer service overhead, refund costs)

**Description:**
Users on annual plans may request pro-rated refunds after using the service for several months.

**Mitigation Strategies:**
- [ ] Refund policy clearly stated: "7-day full refund, no pro-rated refunds"
- [ ] Policy displayed during checkout, in ToS, and on subscription page
- [ ] Confirmation modal before annual purchase: "By subscribing annually, you agree to no pro-rated refunds"
- [ ] Customer support trained to enforce policy consistently
- [ ] Exception process for extenuating circumstances (case-by-case)
- [ ] Analytics track "refund request rate" to identify policy issues

**Contingency Plan:**
If refund requests >5% of annual plans → Re-evaluate policy, consider pro-rated refunds for first 30 days, update ToS.

---

### REQ-SUB-RISK-008: Security Breach Exposes Stripe Keys or Customer Data
**Severity:** Critical
**Likelihood:** Low
**Impact:** Critical (legal liability, revenue loss, reputation damage)

**Description:**
Leaked Stripe API keys or database breach could expose customer payment data.

**Mitigation Strategies:**
- [ ] Stripe keys stored in environment variables (never in code)
- [ ] Publishable key used on client-side (secret key server-only)
- [ ] No card details stored in database (Stripe handles PCI compliance)
- [ ] Webhook signature verification prevents spoofing
- [ ] Database RLS prevents unauthorized access to subscription data
- [ ] Regular security audits and penetration testing
- [ ] Secrets rotation every 90 days
- [ ] Access logs for Stripe API calls (audit trail)

**Contingency Plan:**
If breach suspected → Rotate Stripe keys immediately, audit access logs, notify affected users within 72 hours (GDPR), engage security firm for forensic analysis.

---

## Success Metrics

### Primary Metrics (KPIs)

#### MRR (Monthly Recurring Revenue)
**Target:** $10,000 MRR within 6 months of launch
**Formula:** Sum of all active subscriptions' monthly value
**Tracking:** Stripe Dashboard + Admin Analytics Page
**Acceptance Criteria:**
- [ ] MRR tracked daily and displayed on admin dashboard
- [ ] Chart shows MRR growth over last 12 months
- [ ] MRR broken down by tier (Pro vs. Pro Plus)
- [ ] MRR growth rate calculated (% change month-over-month)

---

#### Free-to-Paid Conversion Rate
**Target:** 5-10% of active users convert to Pro/Pro Plus within 6 months
**Formula:** (Paid subscribers / Total active users) × 100%
**Tracking:** Custom analytics query
**Acceptance Criteria:**
- [ ] Conversion rate tracked weekly
- [ ] Conversion funnel tracked: Pricing page view → Checkout → Subscription created
- [ ] A/B tests measure impact of pricing changes on conversion
- [ ] Trial-to-paid conversion rate tracked separately (target: 25%)

---

#### Churn Rate
**Target:** <5% monthly churn (industry avg: 5-7%)
**Formula:** (Cancelled subscriptions / Total active subscriptions) × 100%
**Tracking:** Stripe Dashboard + Admin Analytics
**Acceptance Criteria:**
- [ ] Churn rate calculated monthly
- [ ] Churn reason survey completed by 80% of churned users
- [ ] Involuntary churn (failed payments) tracked separately from voluntary
- [ ] Reactivation rate tracked (% of cancelled users who re-subscribe)

---

#### ARPU (Average Revenue Per User)
**Target:** $15/user/month (across all paid tiers)
**Formula:** Total MRR / Total paid subscribers
**Tracking:** Admin Analytics Page
**Acceptance Criteria:**
- [ ] ARPU tracked monthly
- [ ] ARPU compared to industry benchmarks (SaaS: $10-$50)
- [ ] ARPU growth rate tracked (% change month-over-month)
- [ ] ARPU broken down by tier to identify highest-value segment

---

#### LTV (Customer Lifetime Value)
**Target:** $360 (24 months × $15 ARPU)
**Formula:** ARPU × Average customer lifespan (months) × Gross margin
**Tracking:** Admin Analytics + Manual Calculation
**Acceptance Criteria:**
- [ ] LTV estimated quarterly (requires churn data over time)
- [ ] LTV compared to CAC (Customer Acquisition Cost) → Target: LTV/CAC ratio ≥ 3:1
- [ ] LTV broken down by acquisition channel (organic, paid ads, referral)

---

### Secondary Metrics

#### Payment Success Rate
**Target:** >95% (industry avg: 85-90%)
**Formula:** (Successful payments / Total payment attempts) × 100%
**Tracking:** Stripe Dashboard
**Acceptance Criteria:**
- [ ] Payment success rate monitored daily
- [ ] Failed payments trigger alert if rate drops below 90%
- [ ] Decline reasons tracked (expired card, insufficient funds, etc.)

---

#### Trial-to-Paid Conversion Rate
**Target:** 25% (industry avg: 15-25%)
**Formula:** (Trial users who subscribe / Total trial users) × 100%
**Tracking:** Custom analytics query
**Acceptance Criteria:**
- [ ] Trial conversion rate tracked weekly
- [ ] Trial abandonment reasons collected via exit survey
- [ ] Email reminder effectiveness tracked (open rate, click rate)

---

#### Upgrade Rate (Basic → Pro, Pro → Pro Plus)
**Target:** 10% of Basic users upgrade within 6 months
**Formula:** (Users who upgraded / Total users in lower tier) × 100%
**Tracking:** Admin Analytics
**Acceptance Criteria:**
- [ ] Upgrade rate tracked monthly
- [ ] Upgrade triggers tracked (hit product limit, accessed gated feature)
- [ ] Time to upgrade tracked (days from signup to upgrade)

---

#### Downgrade Rate
**Target:** <2% monthly (downgrades should be rare)
**Formula:** (Users who downgraded / Total paid users) × 100%
**Tracking:** Admin Analytics
**Acceptance Criteria:**
- [ ] Downgrade rate tracked monthly
- [ ] Downgrade reasons collected via survey
- [ ] Downgrade-to-cancel rate tracked (users who downgrade then cancel)

---

#### Customer Support Ticket Volume (Subscription-Related)
**Target:** <5% of paid users require support per month
**Formula:** (Subscription support tickets / Total paid users) × 100%
**Tracking:** Support ticket system (Zendesk/Intercom)
**Acceptance Criteria:**
- [ ] Support tickets tagged by category (billing, cancellation, payment failed, etc.)
- [ ] Ticket resolution time tracked (target: <24 hours for billing issues)
- [ ] Common issues identified and self-service documentation created

---

#### Refund Rate
**Target:** <3% of subscriptions request refund
**Formula:** (Refunds issued / Total subscriptions) × 100%
**Tracking:** Stripe Dashboard + Admin Analytics
**Acceptance Criteria:**
- [ ] Refund rate tracked monthly
- [ ] Refund reasons collected (billing error, feature not as expected, etc.)
- [ ] Refund policy violations tracked (requests outside 7-day window)

---

#### Granular Conversion Funnel Metrics

**Pricing Page Engagement:**
- [ ] Pricing page views (unique users)
- [ ] Time on pricing page (target: >30 seconds)
- [ ] Clicks on "Upgrade to Pro" button (CTR)
- [ ] Clicks on "Start Free Trial" button (CTR)

**Checkout Funnel:**
- [ ] Checkout page views
- [ ] Checkout completion rate (target: >80%)
- [ ] Checkout abandonment rate (target: <20%)
- [ ] Payment method usage (credit card vs. Apple Pay vs. Google Pay)

**Feature Gate Engagement:**
- [ ] "Upgrade to Pro" modal impressions
- [ ] Modal close rate (dismissed without upgrading)
- [ ] Modal conversion rate (clicked "Upgrade" and completed checkout)

---

### Analytics Dashboard Requirements

**Admin Dashboard Must Display:**
- [ ] Real-time MRR (updated daily)
- [ ] Total subscribers by tier (Basic/Pro/Pro Plus)
- [ ] Conversion rate (Free → Paid)
- [ ] Churn rate (monthly)
- [ ] ARPU (Average Revenue Per User)
- [ ] LTV estimate
- [ ] Payment success rate
- [ ] Chart: MRR growth over last 12 months
- [ ] Chart: Subscriber growth by tier over time
- [ ] Table: Recent subscriptions (last 20)
- [ ] Table: Recent cancellations (last 20)
- [ ] Table: Past-due subscriptions (action required)
- [ ] Export to CSV functionality

---

## Implementation Phases

### Phase 1: Foundation & Infrastructure (Week 1-2)
**Goal:** Set up Stripe account, database schema, and basic integration.

**Tasks:**
1. [ ] Create Stripe account (production + test mode)
2. [ ] Create Stripe products and prices (Pro monthly, Pro annual, Pro Plus monthly, Pro Plus annual)
3. [ ] Generate API keys (secret, publishable, webhook secret)
4. [ ] Store keys in environment variables (.env.local, Vercel)
5. [ ] Apply database migration: `subscriptions` and `invoices` tables
6. [ ] Add `subscription_tier` column to `profiles` table
7. [ ] Create indexes on subscription-related columns
8. [ ] Set up RLS policies for new tables
9. [ ] Install Stripe Node.js SDK: `npm install stripe`
10. [ ] Create `lib/stripe/config.ts` with Stripe client
11. [ ] Create `lib/subscription/check.ts` utilities
12. [ ] Write unit tests for subscription utilities

**Estimated Effort:** 16 hours
**Dependencies:** None
**Acceptance Criteria:**
- [ ] Stripe account created and configured
- [ ] Database schema deployed to production
- [ ] Stripe client initializes successfully in code
- [ ] All tests pass

---

### Phase 2: Pricing Page & UI (Week 2-3)
**Goal:** Build public-facing pricing page and upgrade modals.

**Tasks:**
1. [ ] Design pricing page wireframe (Figma)
2. [ ] Create `app/pricing/page.tsx`
3. [ ] Build pricing tier cards component (responsive grid)
4. [ ] Add feature comparison table
5. [ ] Add monthly/annual toggle switch
6. [ ] Add CTA buttons ("Get Started", "Upgrade to Pro")
7. [ ] Build FAQ section component
8. [ ] Create "Upgrade to Pro" modal component (reusable)
9. [ ] Add modal to feature gates (e.g., analytics page)
10. [ ] Style components with Tailwind (dark mode compatible)
11. [ ] Add animations (Framer Motion)
12. [ ] Test on mobile and desktop (iOS, Android, Chrome, Safari)

**Estimated Effort:** 20 hours
**Dependencies:** Phase 1 (database schema, subscription utilities)
**Acceptance Criteria:**
- [ ] Pricing page accessible at `/pricing`
- [ ] All three tiers displayed with correct pricing
- [ ] Monthly/annual toggle works
- [ ] Upgrade modal appears when Basic user accesses gated feature
- [ ] Mobile-responsive design

---

### Phase 3: Stripe Checkout Integration (Week 3-4)
**Goal:** Implement Stripe Checkout flow for subscriptions.

**Tasks:**
1. [ ] Create `lib/stripe/checkout.ts` with `createCheckoutSession()`
2. [ ] Create API route: `app/api/subscription/create-checkout-session/route.ts`
3. [ ] Add "Upgrade" button click handler (calls API, redirects to Stripe)
4. [ ] Handle monthly vs. annual billing selection
5. [ ] Pre-fill user email in Checkout
6. [ ] Enable promo codes in Checkout
7. [ ] Enable Apple Pay / Google Pay
8. [ ] Configure success URL: `/subscription/success?session_id={CHECKOUT_SESSION_ID}`
9. [ ] Configure cancel URL: `/pricing`
10. [ ] Create success page: `app/subscription/success/page.tsx`
11. [ ] Success page displays confirmation message, next steps
12. [ ] Test Checkout flow end-to-end in test mode
13. [ ] Test 3D Secure (SCA) authentication flow
14. [ ] Test on mobile browsers

**Estimated Effort:** 16 hours
**Dependencies:** Phase 2 (pricing page)
**Acceptance Criteria:**
- [ ] Clicking "Upgrade to Pro" redirects to Stripe Checkout
- [ ] Checkout pre-fills user email
- [ ] User can toggle monthly/annual billing
- [ ] After payment: Redirected to success page
- [ ] Checkout works on all devices and browsers

---

### Phase 4: Webhook Processing (Week 4-5)
**Goal:** Sync subscription status from Stripe webhooks.

**Tasks:**
1. [ ] Create `lib/stripe/webhooks.ts` with event handlers
2. [ ] Create webhook endpoint: `app/api/webhooks/stripe/route.ts`
3. [ ] Implement webhook signature verification
4. [ ] Handle `checkout.session.completed` event
5. [ ] Handle `customer.subscription.updated` event
6. [ ] Handle `customer.subscription.deleted` event
7. [ ] Handle `invoice.payment_succeeded` event
8. [ ] Handle `invoice.payment_failed` event
9. [ ] Implement idempotency using Stripe event IDs
10. [ ] Log all webhook events to database (audit trail)
11. [ ] Configure Stripe webhook endpoint in dashboard
12. [ ] Test webhooks using Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
13. [ ] Simulate all webhook events in test mode
14. [ ] Deploy webhook endpoint to production
15. [ ] Configure production webhook in Stripe dashboard

**Estimated Effort:** 20 hours
**Dependencies:** Phase 3 (Stripe Checkout)
**Acceptance Criteria:**
- [ ] Webhook endpoint processes all 5 critical events
- [ ] Subscription status syncs within 30 seconds of Stripe event
- [ ] Profile `subscription_tier` updates correctly
- [ ] Duplicate events handled gracefully (idempotency)
- [ ] Failed webhooks logged to Sentry

---

### Phase 5: Subscription Management Portal (Week 5-6)
**Goal:** Allow users to manage subscriptions (upgrade/downgrade/cancel).

**Tasks:**
1. [ ] Create `app/dashboard/subscription/page.tsx`
2. [ ] Display current subscription details (tier, billing cycle, next payment)
3. [ ] Display billing history (invoices table)
4. [ ] Add "Download Invoice" links (Stripe hosted invoice URL)
5. [ ] Add "Upgrade to Pro Plus" button (calls Checkout API)
6. [ ] Add "Downgrade to Pro" button (updates subscription, period-end)
7. [ ] Add "Downgrade to Basic" button (cancels subscription, period-end)
8. [ ] Add "Cancel Subscription" button (cancels at period end)
9. [ ] Build confirmation modals for destructive actions
10. [ ] Add cancellation reason survey (multi-select: "Too expensive", "Not enough features", etc.)
11. [ ] Add "Update Payment Method" button (redirects to Stripe Customer Portal)
12. [ ] Create server action: `upgradeSubscription()`
13. [ ] Create server action: `downgradeSubscription()`
14. [ ] Create server action: `cancelSubscription()`
15. [ ] Test all flows end-to-end in test mode

**Estimated Effort:** 24 hours
**Dependencies:** Phase 4 (webhook processing)
**Acceptance Criteria:**
- [ ] Users can view subscription details at `/dashboard/subscription`
- [ ] Users can upgrade/downgrade/cancel
- [ ] Confirmation modals prevent accidental actions
- [ ] Subscription changes reflect in Stripe dashboard
- [ ] Email confirmations sent for all actions

---

### Phase 6: Feature Gating (Week 6-7)
**Goal:** Gate features based on subscription tier.

**Tasks:**
1. [ ] Identify features to gate (from tier definition in Business Rules)
2. [ ] Update middleware: Add tier checks for protected routes
3. [ ] Create `checkFeatureAccess()` utility
4. [ ] Gate feature: Advanced Analytics (Pro+)
   - [ ] Add server-side check in analytics page
   - [ ] Show "Upgrade to Pro" modal for Basic users
5. [ ] Gate feature: Product limit (Basic: 10, Pro: Unlimited)
   - [ ] Add check in product creation server action
   - [ ] Show usage progress on dashboard ("8/10 products")
   - [ ] Disable "Create Product" button at limit
6. [ ] Gate feature: Featured products (Pro: 1/month, Pro Plus: 4/month)
   - [ ] Add "Feature This Product" button on product edit page
   - [ ] Check monthly usage before allowing feature
7. [ ] Gate feature: API access (Pro: Read-only, Pro Plus: Full CRUD)
   - [ ] Add tier checks to API routes
   - [ ] Return 403 Forbidden for unauthorized tiers
8. [ ] Test all feature gates with different user tiers
9. [ ] Penetration testing: Attempt to bypass gates via API

**Estimated Effort:** 24 hours
**Dependencies:** Phase 5 (subscription management)
**Acceptance Criteria:**
- [ ] All gated features enforce server-side validation
- [ ] Basic users see upgrade prompts for Pro features
- [ ] Product limit enforced (Basic: 10, Pro: Unlimited)
- [ ] Featured products limited by tier
- [ ] API access restricted by tier
- [ ] No loopholes or bypasses

---

### Phase 7: Email Notifications (Week 7-8)
**Goal:** Send transactional emails for subscription events.

**Tasks:**
1. [ ] Choose email service (Resend or SendGrid)
2. [ ] Create email templates:
   - [ ] `subscription-created.html` (Welcome email)
   - [ ] `payment-succeeded.html` (Receipt)
   - [ ] `payment-failed.html` (Failed payment)
   - [ ] `subscription-upgraded.html` (Upgrade confirmation)
   - [ ] `subscription-downgraded.html` (Downgrade confirmation)
   - [ ] `subscription-cancelled.html` (Cancellation confirmation)
   - [ ] `trial-ending-soon.html` (Trial ending reminder)
3. [ ] Design email templates with AIMadeThis branding
4. [ ] Make templates mobile-responsive
5. [ ] Create `lib/email/send.ts` utility
6. [ ] Integrate email sending into webhook handlers
7. [ ] Test all email templates in dev environment
8. [ ] Configure email service API keys in production
9. [ ] Test emails in production (use test user)
10. [ ] Monitor email delivery rates (Resend/SendGrid dashboard)

**Estimated Effort:** 12 hours
**Dependencies:** Phase 4 (webhook processing)
**Acceptance Criteria:**
- [ ] 7 email templates created and branded
- [ ] Emails sent for all subscription events
- [ ] Emails mobile-responsive
- [ ] Email delivery rate >95%
- [ ] Unsubscribe link included in all emails

---

### Phase 8: Admin Analytics Dashboard (Week 8-9)
**Goal:** Build admin dashboard for subscription metrics.

**Tasks:**
1. [ ] Create `app/admin/subscriptions/page.tsx` (admin-only route)
2. [ ] Add middleware check: User must have `role = 'admin'` in profiles
3. [ ] Fetch MRR data from database
4. [ ] Calculate total subscribers by tier
5. [ ] Calculate conversion rate (custom SQL query)
6. [ ] Calculate churn rate (custom SQL query)
7. [ ] Calculate ARPU
8. [ ] Estimate LTV (ARPU × avg lifespan)
9. [ ] Build MRR growth chart (Recharts library)
10. [ ] Build subscriber growth chart by tier
11. [ ] Build recent subscriptions table
12. [ ] Build recent cancellations table
13. [ ] Build past-due subscriptions table (action required)
14. [ ] Add "Export to CSV" button
15. [ ] Test dashboard with real subscription data

**Estimated Effort:** 16 hours
**Dependencies:** Phase 4 (webhook processing), Phase 6 (feature gating)
**Acceptance Criteria:**
- [ ] Admin dashboard displays all key metrics
- [ ] Charts show MRR and subscriber growth
- [ ] Tables show recent activity
- [ ] Export to CSV works
- [ ] Only admins can access dashboard

---

### Phase 9: Testing & QA (Week 9-10)
**Goal:** Comprehensive testing before production launch.

**Tasks:**
1. [ ] End-to-end test: Free user → View pricing → Start trial → Upgrade to Pro → Cancel
2. [ ] End-to-end test: Pro user → Upgrade to Pro Plus → Downgrade to Basic
3. [ ] Webhook test: Simulate all 5 critical events in test mode
4. [ ] Load test: Webhook endpoint with 100 events/minute
5. [ ] Security test: Attempt to bypass feature gates via API
6. [ ] Browser test: Checkout on Chrome, Safari, Firefox, Edge (mobile + desktop)
7. [ ] Payment test: Test credit card, Apple Pay, Google Pay
8. [ ] Failed payment test: Use Stripe test card `4000000000000341` (declined)
9. [ ] Promo code test: Apply `LAUNCH50` code during checkout
10. [ ] Refund test: Request refund within 7-day window
11. [ ] Email test: Verify all 7 email templates send correctly
12. [ ] Performance test: Subscription checks complete in <100ms
13. [ ] Accessibility test: WCAG 2.1 AA compliance for pricing page
14. [ ] User acceptance testing: 5-10 beta users test full flow

**Estimated Effort:** 20 hours
**Dependencies:** Phase 1-8 (all phases)
**Acceptance Criteria:**
- [ ] All end-to-end tests pass
- [ ] All webhook events process correctly
- [ ] No security vulnerabilities found
- [ ] Checkout works on all browsers and devices
- [ ] All emails send and display correctly
- [ ] Performance benchmarks met
- [ ] Beta users report no critical issues

---

### Phase 10: Production Launch (Week 10-11)
**Goal:** Deploy subscription system to production.

**Tasks:**
1. [ ] Switch Stripe to production mode (disable test mode)
2. [ ] Update environment variables with production Stripe keys
3. [ ] Configure production webhook endpoint in Stripe dashboard
4. [ ] Deploy all code changes to production (Vercel)
5. [ ] Run smoke tests on production environment
6. [ ] Monitor webhook endpoint for first 24 hours
7. [ ] Monitor email delivery rates
8. [ ] Monitor Sentry for errors
9. [ ] Announce subscription system to users (blog post, email, social media)
10. [ ] Apply `LAUNCH50` promo code (50% off first month)
11. [ ] Monitor conversion rate daily (target: 5-10%)
12. [ ] Monitor MRR growth weekly
13. [ ] Collect user feedback (NPS survey)
14. [ ] Iterate based on feedback (Phase 11: Optimization)

**Estimated Effort:** 12 hours
**Dependencies:** Phase 9 (testing)
**Acceptance Criteria:**
- [ ] Subscription system live in production
- [ ] No critical bugs or outages
- [ ] First 10 subscriptions processed successfully
- [ ] MRR tracked and growing
- [ ] User feedback positive (NPS >50)

---

### Phase 11: Optimization & Iteration (Ongoing)
**Goal:** Continuously improve conversion and reduce churn.

**Tasks:**
1. [ ] A/B test pricing: $19/mo vs. $29/mo for Pro
2. [ ] A/B test trial duration: 14 days vs. 30 days
3. [ ] A/B test upgrade modals: Aggressive vs. soft nudges
4. [ ] Analyze churn reasons (exit survey data)
5. [ ] Implement win-back campaigns (re-activate cancelled users)
6. [ ] Add annual plan incentive: "Save 20% + Get 1 month free" (total 25% off)
7. [ ] Add referral program: "Refer a friend, get 1 month free"
8. [ ] Add usage-based upsells: "Upgrade to Pro Plus for 4 featured products/month"
9. [ ] Optimize email open rates (subject line A/B tests)
10. [ ] Optimize email click rates (CTA button tests)
11. [ ] Build predictive churn model (ML): Identify at-risk users
12. [ ] Build retention campaigns: Offer discount to at-risk users before they churn

**Estimated Effort:** Ongoing (8-12 hours/week)
**Dependencies:** Phase 10 (production launch)
**Acceptance Criteria:**
- [ ] Conversion rate improves by 10% (e.g., 5% → 5.5%)
- [ ] Churn rate decreases by 1% (e.g., 5% → 4%)
- [ ] MRR growth rate >10% month-over-month
- [ ] User feedback positive (NPS >60)

---

## Dependencies

### External Dependencies

1. **Stripe Account**
   - Required for payment processing
   - Timeline: Week 1 (Phase 1)
   - Owner: Product/Finance team
   - Risk: Stripe account approval can take 1-3 days

2. **Email Service (Resend or SendGrid)**
   - Required for transactional emails
   - Timeline: Week 7 (Phase 7)
   - Owner: Engineering team
   - Risk: Email deliverability issues if not configured correctly

3. **Error Tracking (Sentry)**
   - Required for monitoring webhook failures
   - Timeline: Week 4 (Phase 4)
   - Owner: Engineering team
   - Risk: Low (already integrated in project)

4. **Design Assets**
   - Pricing page wireframes
   - Email templates
   - Upgrade modal designs
   - Timeline: Week 2 (Phase 2)
   - Owner: Design team
   - Risk: Design delays could push back implementation

5. **Legal Review**
   - Refund policy
   - Terms of Service updates
   - Privacy Policy updates (payment data handling)
   - Timeline: Week 1 (before launch)
   - Owner: Legal team
   - Risk: Legal review can take 1-2 weeks

---

### Internal Dependencies

1. **Database Migration**
   - Add `subscriptions` and `invoices` tables
   - Add `subscription_tier` to `profiles`
   - Timeline: Week 1 (Phase 1)
   - Risk: Migration must be tested thoroughly in staging

2. **Admin Role System**
   - Admin dashboard requires `role = 'admin'` in profiles
   - Timeline: Week 8 (Phase 8)
   - Risk: Low (can use service role for initial admin)

3. **Email System Integration**
   - Existing email infrastructure must support transactional emails
   - Timeline: Week 7 (Phase 7)
   - Risk: Medium (may need to refactor existing email code)

4. **Feature Implementation**
   - Advanced Analytics page (to be gated for Pro users)
   - Featured Products system (to be gated for Pro/Pro Plus)
   - API endpoints (to be gated by tier)
   - Timeline: Varies (some features may not exist yet)
   - Risk: High (requires coordination with feature development roadmap)

5. **Testing Infrastructure**
   - Need test credit cards (Stripe provides)
   - Need test email accounts
   - Need test users with different tiers
   - Timeline: Week 9 (Phase 9)
   - Risk: Low (straightforward to set up)

---

## Appendix

### Glossary

- **MRR (Monthly Recurring Revenue):** Total revenue from subscriptions per month
- **ARPU (Average Revenue Per User):** MRR divided by number of paid users
- **LTV (Customer Lifetime Value):** Total revenue expected from a customer over their lifetime
- **CAC (Customer Acquisition Cost):** Cost to acquire one paying customer
- **Churn Rate:** Percentage of subscribers who cancel per month
- **Grace Period:** Time allowed after failed payment before access is revoked
- **Pro-rating:** Adjusting charges based on partial billing periods
- **Dunning:** Process of retrying failed payments and communicating with customers
- **SCA (Strong Customer Authentication):** EU regulation requiring 3D Secure for payments
- **PCI Compliance:** Security standard for handling credit card data
- **Idempotency:** Ensuring duplicate requests don't cause duplicate effects

---

### Reference Links

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Checkout:** https://stripe.com/docs/payments/checkout
- **Stripe Webhooks:** https://stripe.com/docs/webhooks
- **Stripe Testing:** https://stripe.com/docs/testing
- **Stripe Customer Portal:** https://stripe.com/docs/billing/subscriptions/integrating-customer-portal
- **SaaS Metrics Guide:** https://stripe.com/guides/saas-metrics
- **Subscription Billing Best Practices:** https://stripe.com/guides/subscription-billing
- **PCI Compliance:** https://stripe.com/docs/security/guide

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-10 | Requirements Tracking Specialist | Initial draft - Complete PRD with all requirements, business rules, user stories, acceptance criteria, technical architecture, risks, metrics, and implementation phases |

---

**Next Steps:**
1. Review this PRD with stakeholders (Product, Engineering, Design, Finance, Legal)
2. Prioritize requirements and adjust timeline if needed
3. Assign owners to each implementation phase
4. Create tickets in project management system (Jira, Linear, etc.)
5. Begin Phase 1: Foundation & Infrastructure
6. Schedule weekly sync meetings to track progress
7. Use requirements-tracker agent to monitor implementation vs. requirements

---

**Questions for Stakeholders:**
1. Is the pricing ($19/mo Pro, $49/mo Pro Plus) validated with market research?
2. Is the tier feature breakdown aligned with user needs?
3. Do we have legal approval for the refund policy?
4. Do we have budget for Stripe fees (2.9% + $0.30 per transaction)?
5. Do we have customer support capacity for billing inquiries?
6. Do we have design resources available for Phase 2 (pricing page)?
7. Should we launch with trial (Pro only) or no trial initially?
8. Should we offer monthly-only first, then add annual later?

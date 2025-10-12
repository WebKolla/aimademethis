# Production Launch Guide for AIMMT

**Production URL:** https://www.aimademethis.com
**Last Updated:** January 12, 2025

---

## Quick Start: Critical Steps Before Launch

### 1. Environment Variables (Vercel Dashboard)

Update all environment variables for **Production**:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.aimademethis.com

# Supabase (same as current)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Google Services
NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG=<get-from-GA4>
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<get-from-search-console>

# Stripe LIVE Mode (switch from test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<starts-with-pk_live>
STRIPE_SECRET_KEY=<starts-with-sk_live>
STRIPE_WEBHOOK_SECRET=<get-after-creating-webhook>

# Remove or set to false
NEXT_PUBLIC_BYPASS_AUTH=false
```

### 2. Domain Setup in Vercel

1. Go to Vercel project settings → Domains
2. Add: `www.aimademethis.com`
3. Add: `aimademethis.com` (will redirect to www)
4. Configure DNS at your registrar:
   - CNAME: `www` → `cname.vercel-dns.com`
   - A or ALIAS: `@` → Vercel IP (check docs)
5. Wait for DNS propagation (24-48 hours)
6. SSL will be automatic

### 3. Stripe Live Mode Setup

**Switch to Live Mode:**
1. Activate Stripe account (complete business verification)
2. Switch dashboard to "Live mode"
3. Get new keys: Settings → API keys → Reveal live keys

**Create Production Webhook:**
1. Developers → Webhooks → Add endpoint
2. URL: `https://www.aimademethis.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy signing secret (starts with `whsec_`)
5. Add to Vercel env vars as `STRIPE_WEBHOOK_SECRET`

**Test:**
- Send test webhook from Stripe dashboard
- Do real checkout, verify in database, refund immediately

### 4. Google Search Console

1. Go to https://search.google.com/search-console
2. Add property: www.aimademethis.com
3. Choose HTML tag verification
4. Copy verification code
5. Add to `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
6. Deploy, then verify in GSC
7. Submit sitemaps:
   - https://www.aimademethis.com/sitemap.xml
   - https://www.aimademethis.com/image-sitemap.xml

### 5. Google Analytics

1. Create GA4 property
2. Get measurement ID (G-XXXXXXXXXX)
3. Add to `NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG`
4. Deploy and verify tracking in Real-Time report

### 6. Fix OAuth Redirects ⚠️ CRITICAL

**Issue:** Google/GitHub OAuth currently redirects to test URL after login.

**Fix:** Update redirect URIs in all OAuth providers:

1. **Supabase:** Add production URLs to Redirect URLs
2. **Google OAuth:** Add production redirect URIs and origins
3. **GitHub OAuth:** Update callback URL to Supabase URL

**Detailed instructions:** See `/docs/deployment/OAUTH_REDIRECT_FIX.md`

Quick checklist:
- [ ] Update Supabase Redirect URLs (add www.aimademethis.com/auth/callback)
- [ ] Update Google OAuth authorized redirect URIs
- [ ] Update GitHub OAuth callback URL
- [ ] Set NEXT_PUBLIC_SITE_URL=https://www.aimademethis.com in Vercel
- [ ] Test Google login redirects to production URL
- [ ] Test GitHub login redirects to production URL

### 7. Security Checklist

- [ ] Test RLS policies (try editing others' products)
- [ ] Verify auth redirects work correctly after OAuth fix
- [ ] Test Pro features require subscription
- [ ] Check Supabase using `anon` key (not service_role) in client
- [ ] Remove `NEXT_PUBLIC_BYPASS_AUTH` or set to false
- [ ] Enable email confirmations in Supabase Auth settings

### 8. Testing Checklist

**Authentication:**
- [ ] Email/password signup → email confirmation → login
- [ ] Google OAuth signup and login
- [ ] GitHub OAuth signup and login
- [ ] Password reset flow
- [ ] Logout

**Critical User Flows:**
- [ ] Browse products (anonymous)
- [ ] Sign up → create profile → submit product → publish
- [ ] Search, filter, sort products
- [ ] Upvote, bookmark, review, comment
- [ ] Upgrade to Pro → checkout → verify subscription in DB
- [ ] Dashboard: edit product, delete product, settings

**Mobile:**
- [ ] Test all above on real iOS device
- [ ] Test all above on real Android device
- [ ] Verify hamburger menu works
- [ ] Test image uploads from camera

### 9. Error Pages

Create if missing:
- `app/not-found.tsx` (404 page)
- `app/error.tsx` (500 page)

### 10. Legal Pages

Required before launch:
- [ ] Privacy Policy (`/privacy`)
- [ ] Terms of Service (`/terms`)
- [ ] Link from footer and signup form

### 11. Final Build & Deploy

```bash
# Run locally first
npm run lint  # Fix all errors
npx tsc --noEmit  # Fix all type errors
npm run build  # Must succeed

# Deploy to production
vercel --prod

# Or push to main branch for automatic deploy
git push origin main
```

---

## Post-Launch Monitoring

### First 24 Hours

- [ ] Monitor Vercel logs for errors
- [ ] Check Google Analytics Real-Time
- [ ] Watch for Stripe webhook failures
- [ ] Monitor sign-up rate
- [ ] Check social media mentions
- [ ] Respond to user feedback quickly

### First Week

- [ ] Review Google Search Console
- [ ] Check Core Web Vitals
- [ ] Monitor subscription conversion rate
- [ ] Check for 404 errors
- [ ] Review user feedback
- [ ] Fix any reported bugs

---

## Rollback Plan

If critical issues occur:

1. Go to Vercel dashboard → Deployments
2. Find last working deployment
3. Click "Promote to Production"
4. Site rolls back within seconds

---

## Support Resources

- **Vercel Status:** https://www.vercel-status.com
- **Supabase Status:** https://status.supabase.com
- **Stripe Status:** https://status.stripe.com
- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Stripe Support:** https://support.stripe.com

---

## Estimated Timeline

- **Environment setup:** 1 hour
- **Domain configuration:** 30 minutes (+ 24-48h DNS wait)
- **Stripe live mode:** 1-2 hours
- **Google services:** 30 minutes
- **Security testing:** 2-3 hours
- **End-to-end testing:** 3-4 hours
- **Mobile testing:** 1-2 hours
- **Total:** 9-13 hours active work

**Recommendation:** Start domain setup first (long DNS wait), then work on other items while waiting.

---

## What You'll Need

1. **Domain registrar access** (to configure DNS)
2. **Stripe account activated** (business verification complete)
3. **Google Analytics account**
4. **Google Search Console account**
5. **Test credit card** (for live Stripe testing, will refund)
6. **Real mobile devices** (iOS and Android)

---

## Checklist: Ready to Launch?

- [ ] All environment variables set for production
- [ ] Domain configured and SSL active
- [ ] Stripe in live mode with webhook configured
- [ ] Google Analytics tracking verified
- [ ] Google Search Console set up with sitemaps
- [ ] All authentication flows tested
- [ ] All critical user journeys work
- [ ] Mobile experience tested on real devices
- [ ] Security audit completed (RLS, auth, etc.)
- [ ] Error pages created
- [ ] Legal pages published
- [ ] Final build successful with no errors
- [ ] Post-launch monitoring plan in place

---

**When all checkboxes are ✅, you're ready to launch!** 🚀

For detailed guides on specific topics, see:
- Full pre-launch checklist in separate doc (if needed)
- Stripe webhook detailed guide (in this directory)
- SEO monitoring checklist (in /docs/seo/)

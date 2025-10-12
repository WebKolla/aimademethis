-- ============================================================================
-- MIGRATION: Update Subscription Plans with Correct Features and Pricing
-- Date: 2025-10-12
-- Description: Update subscription plans to reflect accurate feature lists
--              and correct pricing for Pro and Pro Plus tiers
-- ============================================================================

-- Update Pro Plan
-- - Correct pricing: $6.99/month, $70/year
-- - Features: 10 products (not unlimited), analytics, priority ranking, verified badge, early access
UPDATE public.subscription_plans
SET
  price_monthly = 6.99,
  price_yearly = 70,
  description = 'For creators who want to showcase more products with advanced features',
  features = '["analytics", "priority_ranking", "verified_badge", "early_access"]'::jsonb,
  limits = '{"products": 10, "product_highlights": 5}'::jsonb,
  updated_at = now()
WHERE name = 'pro';

-- Update Pro Plus Plan
-- - Correct pricing: $16.99/month, $170/year
-- - Features: Unlimited products, featured placement, priority support, advanced SEO, custom badges, newsletter featured
-- - Remove: API access, team collaboration, white-label, custom URL
UPDATE public.subscription_plans
SET
  price_monthly = 16.99,
  price_yearly = 170,
  description = 'Premium features for serious creators and power users',
  features = '["featured_placement", "priority_support", "advanced_seo", "custom_badges", "newsletter_featured"]'::jsonb,
  limits = '{"products": 999, "product_highlights": 999, "featured_products_monthly": 1}'::jsonb,
  updated_at = now()
WHERE name = 'pro_plus';

-- Verify changes
SELECT
  name,
  display_name,
  price_monthly,
  price_yearly,
  description,
  features,
  limits
FROM public.subscription_plans
ORDER BY sort_order;

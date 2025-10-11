-- ============================================================================
-- SUBSCRIPTION SYSTEM MIGRATION
-- ============================================================================
-- This migration adds a complete subscription system with Stripe integration
--
-- Tables:
-- - subscription_plans: Defines available subscription tiers
-- - subscriptions: User subscription records
-- - subscription_transactions: Payment and billing history
-- - usage_tracking: Track usage limits for rate-limited features
--
-- Functions:
-- - get_user_subscription(): Get current user's subscription details
-- - check_usage_limit(): Check if user can perform an action
-- - increment_usage(): Increment usage counter for a feature
-- ============================================================================

-- ============================================================================
-- TABLE: subscription_plans
-- ============================================================================
-- Stores the available subscription tiers and their features
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 'free', 'pro', 'pro_plus'
  display_name TEXT NOT NULL,
  description TEXT,
  stripe_product_id TEXT UNIQUE, -- Stripe product ID
  stripe_price_id_monthly TEXT UNIQUE, -- Stripe price ID for monthly billing
  stripe_price_id_yearly TEXT UNIQUE, -- Stripe price ID for yearly billing
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2),
  features JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of feature names
  limits JSONB NOT NULL DEFAULT '{}'::jsonb, -- Usage limits: {"products": 3, "analytics_days": 30}
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0, -- Display order
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_subscription_plans_name ON public.subscription_plans(name);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON public.subscription_plans(is_active);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Anyone can read active plans
CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans
  FOR SELECT
  USING (is_active = true);

-- ============================================================================
-- TABLE: subscriptions
-- ============================================================================
-- Stores user subscription records
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),

  -- Stripe fields
  stripe_customer_id TEXT, -- Stripe customer ID
  stripe_subscription_id TEXT UNIQUE, -- Stripe subscription ID

  -- Status
  status TEXT NOT NULL DEFAULT 'active', -- active, canceled, past_due, trialing, incomplete

  -- Billing
  billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMPTZ,

  -- Trial
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  UNIQUE(user_id) -- One active subscription per user
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON public.subscriptions(current_period_end);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON public.subscriptions
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- TABLE: subscription_transactions
-- ============================================================================
-- Stores payment and billing transaction history
CREATE TABLE IF NOT EXISTS public.subscription_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Transaction details
  type TEXT NOT NULL, -- payment, refund, credit, adjustment
  status TEXT NOT NULL, -- succeeded, failed, pending, refunded
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  description TEXT,

  -- Stripe fields
  stripe_invoice_id TEXT,
  stripe_charge_id TEXT,
  stripe_payment_intent_id TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_transactions_subscription ON public.subscription_transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.subscription_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.subscription_transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.subscription_transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON public.subscription_transactions(created_at DESC);

-- Enable RLS
ALTER TABLE public.subscription_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own transactions"
  ON public.subscription_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: usage_tracking
-- ============================================================================
-- Tracks usage for rate-limited features
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL, -- e.g., 'products', 'api_calls', 'analytics_access'
  usage_count INTEGER NOT NULL DEFAULT 0,
  limit_count INTEGER, -- NULL = unlimited
  period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  period_end TIMESTAMPTZ NOT NULL, -- When usage resets
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  UNIQUE(user_id, feature_name, period_start)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_feature ON public.usage_tracking(user_id, feature_name);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON public.usage_tracking(period_end);

-- Enable RLS
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own usage"
  ON public.usage_tracking
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTION: get_user_subscription
-- ============================================================================
-- Returns the current user's active subscription with plan details
CREATE OR REPLACE FUNCTION public.get_user_subscription(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  subscription_id UUID,
  user_id UUID,
  plan_id UUID,
  plan_name TEXT,
  plan_display_name TEXT,
  plan_features JSONB,
  plan_limits JSONB,
  status TEXT,
  billing_cycle TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN,
  trial_end TIMESTAMPTZ,
  is_trial BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Use provided user_id or default to current auth user
  v_user_id := COALESCE(p_user_id, auth.uid());

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID is required';
  END IF;

  RETURN QUERY
  SELECT
    s.id AS subscription_id,
    s.user_id,
    s.plan_id,
    sp.name AS plan_name,
    sp.display_name AS plan_display_name,
    sp.features AS plan_features,
    sp.limits AS plan_limits,
    s.status,
    s.billing_cycle,
    s.current_period_end,
    s.cancel_at_period_end,
    s.trial_end,
    (s.trial_end IS NOT NULL AND s.trial_end > now()) AS is_trial
  FROM public.subscriptions s
  INNER JOIN public.subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = v_user_id
    AND s.status IN ('active', 'trialing', 'past_due')
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- If no subscription found, return free plan
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT
      NULL::UUID AS subscription_id,
      v_user_id AS user_id,
      sp.id AS plan_id,
      sp.name AS plan_name,
      sp.display_name AS plan_display_name,
      sp.features AS plan_features,
      sp.limits AS plan_limits,
      'active'::TEXT AS status,
      'monthly'::TEXT AS billing_cycle,
      NULL::TIMESTAMPTZ AS current_period_end,
      false AS cancel_at_period_end,
      NULL::TIMESTAMPTZ AS trial_end,
      false AS is_trial
    FROM public.subscription_plans sp
    WHERE sp.name = 'free'
    LIMIT 1;
  END IF;
END;
$$;

-- ============================================================================
-- FUNCTION: check_usage_limit
-- ============================================================================
-- Checks if user has remaining usage for a feature
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  p_user_id UUID,
  p_feature_name TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_usage_count INTEGER;
  v_limit_count INTEGER;
  v_plan_limits JSONB;
BEGIN
  -- Get user's plan limits
  SELECT plan_limits INTO v_plan_limits
  FROM public.get_user_subscription(p_user_id)
  LIMIT 1;

  -- If no limit defined, feature is unlimited
  IF v_plan_limits IS NULL OR NOT (v_plan_limits ? p_feature_name) THEN
    RETURN true;
  END IF;

  v_limit_count := (v_plan_limits ->> p_feature_name)::INTEGER;

  -- NULL limit means unlimited
  IF v_limit_count IS NULL THEN
    RETURN true;
  END IF;

  -- Get current usage for this period
  SELECT COALESCE(usage_count, 0) INTO v_usage_count
  FROM public.usage_tracking
  WHERE user_id = p_user_id
    AND feature_name = p_feature_name
    AND period_end > now()
  ORDER BY period_end DESC
  LIMIT 1;

  -- Check if under limit
  RETURN v_usage_count < v_limit_count;
END;
$$;

-- ============================================================================
-- FUNCTION: increment_usage
-- ============================================================================
-- Increments usage counter for a feature
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_feature_name TEXT,
  p_increment INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_period_start TIMESTAMPTZ;
  v_period_end TIMESTAMPTZ;
  v_limit_count INTEGER;
  v_plan_limits JSONB;
BEGIN
  -- Calculate current period (monthly)
  v_period_start := date_trunc('month', now());
  v_period_end := v_period_start + INTERVAL '1 month';

  -- Get user's plan limits
  SELECT plan_limits INTO v_plan_limits
  FROM public.get_user_subscription(p_user_id)
  LIMIT 1;

  -- Get limit for this feature (NULL = unlimited)
  IF v_plan_limits IS NOT NULL AND (v_plan_limits ? p_feature_name) THEN
    v_limit_count := (v_plan_limits ->> p_feature_name)::INTEGER;
  ELSE
    v_limit_count := NULL;
  END IF;

  -- Insert or update usage
  INSERT INTO public.usage_tracking (
    user_id,
    feature_name,
    usage_count,
    limit_count,
    period_start,
    period_end
  )
  VALUES (
    p_user_id,
    p_feature_name,
    p_increment,
    v_limit_count,
    v_period_start,
    v_period_end
  )
  ON CONFLICT (user_id, feature_name, period_start)
  DO UPDATE SET
    usage_count = usage_tracking.usage_count + p_increment,
    updated_at = now();

  RETURN true;
END;
$$;

-- ============================================================================
-- SEED DATA: Default subscription plans
-- ============================================================================
INSERT INTO public.subscription_plans (
  name,
  display_name,
  description,
  price_monthly,
  price_yearly,
  features,
  limits,
  sort_order
)
VALUES
  -- Free Plan
  (
    'free',
    'Basic',
    'Perfect for getting started with AI product discovery',
    0,
    0,
    '["product_submissions", "discovery", "search", "voting", "bookmarks", "comments", "basic_profile", "community_features"]'::jsonb,
    '{"products": 3, "product_highlights": 1}'::jsonb,
    1
  ),
  -- Pro Plan
  (
    'pro',
    'Pro',
    'For creators who want to showcase unlimited products with analytics',
    9,
    90,
    '["unlimited_products", "analytics", "priority_ranking", "verified_badge", "early_access", "email_support", "remove_branding"]'::jsonb,
    '{"product_highlights": 5}'::jsonb,
    2
  ),
  -- Pro Plus Plan
  (
    'pro_plus',
    'Pro Plus',
    'Premium features for power users and teams',
    29,
    290,
    '["featured_placement", "custom_url", "api_access", "team_collaboration", "white_label", "priority_support", "advanced_seo", "custom_badges"]'::jsonb,
    '{"product_highlights": 999, "api_calls_daily": 1000, "team_members": 5, "featured_products_monthly": 1}'::jsonb,
    3
  )
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- TRIGGER: Update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON public.usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE public.subscription_plans IS 'Available subscription tiers and their features';
COMMENT ON TABLE public.subscriptions IS 'User subscription records with Stripe integration';
COMMENT ON TABLE public.subscription_transactions IS 'Payment and billing transaction history';
COMMENT ON TABLE public.usage_tracking IS 'Track usage limits for rate-limited features';

COMMENT ON FUNCTION public.get_user_subscription IS 'Get current user subscription with plan details (returns free plan if none)';
COMMENT ON FUNCTION public.check_usage_limit IS 'Check if user has remaining usage for a feature';
COMMENT ON FUNCTION public.increment_usage IS 'Increment usage counter for a feature';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

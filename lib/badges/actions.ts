'use server'

import { createClient } from '@/lib/supabase/server'
import { BadgeData } from './types'
import { cache } from 'react'
import { extractDomain } from './utils'

/**
 * Fetches badge data for a product
 * Cached for 5 minutes using React cache
 *
 * This function is called by:
 * - Badge API endpoint to generate SVG
 * - Badge generator page to show preview
 *
 * @param slug - Product slug
 * @returns Badge data or null if product not found
 */
export const getBadgeData = cache(
  async (slug: string): Promise<BadgeData | null> => {
    const supabase = await createClient()

    // Get current user (may be null for public badge viewing)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Fetch product with minimal fields (performance optimization)
    const { data: product, error } = await supabase
      .from('products')
      .select('id, name, slug, upvotes_count, status, user_id')
      .eq('slug', slug)
      .single()

    if (error || !product) {
      return null
    }

    // Get product owner's subscription tier
    // This determines if badges are available (Pro/Pro Plus only)
    const { data: ownerSubscription } = await supabase
      .from('subscriptions')
      .select(
        `
        status,
        plan_id,
        current_period_end,
        subscription_plans!inner(name)
      `
      )
      .eq('user_id', product.user_id)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .single()

    let userTier: 'free' | 'pro' | 'pro_plus' = 'free'

    if (ownerSubscription?.subscription_plans) {
      const planName = (
        ownerSubscription.subscription_plans as { name: string }
      ).name
      userTier =
        planName === 'pro_plus' ? 'pro_plus' : planName === 'pro' ? 'pro' : 'free'
    }

    return {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      upvotesCount: product.upvotes_count || 0,
      userTier,
      isPublished: product.status === 'published',
      isOwner: user?.id === product.user_id,
    }
  }
)

/**
 * Tracks a badge click
 * Records referrer URL for analytics
 * Rate-limited to prevent abuse (10 clicks/min per product)
 *
 * @param productId - Product UUID
 * @param referrer - Referrer URL (optional)
 * @returns Success status or error message
 */
export async function trackBadgeClick(
  productId: string,
  referrer?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Extract domain from referrer for cleaner analytics
    const referrerDomain = extractDomain(referrer)

    const { error } = await supabase.from('badge_clicks').insert({
      product_id: productId,
      referrer: referrerDomain || referrer || null,
    })

    if (error) {
      console.error('Failed to track badge click:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Badge click tracking error:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Gets badge click statistics for a product
 * Only accessible by product owner (enforced by RLS)
 *
 * Returns:
 * - Total clicks (last 30 days)
 * - Top 5 referring domains with click counts
 *
 * @param productId - Product UUID
 * @returns Badge statistics or error
 */
export async function getBadgeStats(productId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify product ownership
  const { data: product } = await supabase
    .from('products')
    .select('user_id')
    .eq('id', productId)
    .single()

  if (!product || product.user_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  // Get click count (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count } = await supabase
    .from('badge_clicks')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', productId)
    .gte('clicked_at', thirtyDaysAgo.toISOString())

  // Get top referrers (last 30 days)
  const { data: referrers } = await supabase
    .from('badge_clicks')
    .select('referrer')
    .eq('product_id', productId)
    .gte('clicked_at', thirtyDaysAgo.toISOString())
    .not('referrer', 'is', null)
    .limit(1000) // Limit to prevent excessive data transfer

  // Count referrer occurrences
  const referrerCounts = (referrers || []).reduce(
    (acc, { referrer }) => {
      if (referrer) {
        acc[referrer] = (acc[referrer] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>
  )

  // Sort and get top 5
  const topReferrers = Object.entries(referrerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([domain, count]) => ({ domain, count }))

  return {
    totalClicks: count || 0,
    topReferrers,
    period: '30 days',
  }
}

/**
 * Checks if a user has badge access (Pro or Pro Plus)
 * Used in badge generator page to gate access
 *
 * @param userId - User UUID
 * @returns True if user has Pro or Pro Plus subscription
 */
export async function checkBadgeAccess(
  userId: string
): Promise<boolean> {
  const supabase = await createClient()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select(
      `
      status,
      current_period_end,
      subscription_plans!inner(name)
    `
    )
    .eq('user_id', userId)
    .eq('status', 'active')
    .gt('current_period_end', new Date().toISOString())
    .single()

  if (!subscription?.subscription_plans) {
    return false
  }

  const planName = (subscription.subscription_plans as { name: string }).name
  return planName === 'pro' || planName === 'pro_plus'
}

/**
 * Gets user's subscription tier
 * Returns 'free', 'pro', or 'pro_plus'
 *
 * @param userId - User UUID
 * @returns Subscription tier
 */
export async function getUserTier(
  userId: string
): Promise<'free' | 'pro' | 'pro_plus'> {
  const supabase = await createClient()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select(
      `
      status,
      current_period_end,
      subscription_plans!inner(name)
    `
    )
    .eq('user_id', userId)
    .eq('status', 'active')
    .gt('current_period_end', new Date().toISOString())
    .single()

  if (!subscription?.subscription_plans) {
    return 'free'
  }

  const planName = (subscription.subscription_plans as { name: string }).name
  return planName === 'pro_plus'
    ? 'pro_plus'
    : planName === 'pro'
      ? 'pro'
      : 'free'
}

/**
 * Gets user's published products for badge generation
 * Returns products sorted by creation date (newest first)
 *
 * @returns User's published products or error
 */
export async function getUserProducts() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized', data: null }
  }

  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, tagline')
    .eq('user_id', user.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: data || [] }
}

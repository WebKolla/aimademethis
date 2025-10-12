import { NextRequest, NextResponse } from 'next/server'
import { trackBadgeClick } from '@/lib/badges/actions'
import { slugSchema } from '@/lib/badges/types'
import { createClient } from '@/lib/supabase/server'

// Deploy to Edge runtime for fast response
export const runtime = 'edge'

/**
 * POST /api/badge/[slug]/click
 *
 * Tracks a badge click for analytics
 * Records referrer URL to understand traffic sources
 *
 * Body (optional):
 * - referrer: string (can also be read from headers)
 *
 * Returns:
 * - 200: Click tracked successfully
 * - 400: Invalid slug
 * - 404: Product not found
 * - 500: Server error
 *
 * Note: This endpoint is public (no authentication required)
 * Rate limiting should be implemented in Phase 2
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params (Next.js 15 requirement)
    const { slug: slugParam } = await params

    // Validate slug
    const slugResult = slugSchema.safeParse(slugParam)
    if (!slugResult.success) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      )
    }

    const slug = slugResult.data

    // Get product ID from slug
    const supabase = await createClient()
    const { data: product, error } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get referrer from headers (standard browser behavior)
    // Or from request body (if client explicitly sends it)
    let referrer = request.headers.get('referer') || undefined

    try {
      const body = await request.json()
      if (body.referrer) {
        referrer = body.referrer
      }
    } catch {
      // Body parsing failed, use header referrer
    }

    // Track the click
    const result = await trackBadgeClick(product.id, referrer)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to track click' },
        { status: 500 }
      )
    }

    // Return 200 with success indicator
    return NextResponse.json(
      { success: true, message: 'Click tracked' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Click tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

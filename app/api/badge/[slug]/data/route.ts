import { NextRequest, NextResponse } from 'next/server'
import { getBadgeData } from '@/lib/badges/actions'
import { slugSchema } from '@/lib/badges/types'
import { BADGE_CACHE_TTL, BADGE_CACHE_SWR } from '@/lib/badges/constants'

// Deploy to Edge runtime
export const runtime = 'edge'

/**
 * GET /api/badge/[slug]/data
 *
 * Returns badge data as JSON (for preview/debugging)
 * Used by badge generator UI to show live preview
 *
 * Returns:
 * - 200: Badge data object
 * - 400: Invalid slug
 * - 404: Product not found
 * - 500: Server error
 *
 * Response format:
 * {
 *   productId: string
 *   productName: string
 *   productSlug: string
 *   upvotesCount: number
 *   userTier: 'free' | 'pro' | 'pro_plus'
 *   isPublished: boolean
 *   isOwner: boolean
 * }
 */
export async function GET(
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

    // Fetch badge data (cached)
    const badgeData = await getBadgeData(slug)

    if (!badgeData) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Return badge data with cache headers
    return NextResponse.json(badgeData, {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${BADGE_CACHE_TTL}, stale-while-revalidate=${BADGE_CACHE_SWR}`,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Badge data fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

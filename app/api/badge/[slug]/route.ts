import { NextRequest, NextResponse } from 'next/server'
import { generateBadgeSVG, generateErrorBadge } from '@/lib/badges/generator'
import { badgeParamsSchema, slugSchema } from '@/lib/badges/types'
import { getBadgeData } from '@/lib/badges/actions'
import {
  BADGE_CACHE_TTL,
  BADGE_CACHE_SWR,
} from '@/lib/badges/constants'

// Deploy to Edge runtime for global low-latency (<100ms target)
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

/**
 * GET /api/badge/[slug]
 *
 * Returns an SVG badge for a product
 *
 * Query parameters:
 * - variant: 'pro' | 'pro-plus' (default: 'pro')
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - theme: 'light' | 'dark' | 'auto' (default: 'auto')
 * - live: 'true' | 'false' (default: 'false') - bypasses cache
 *
 * Returns:
 * - 200: SVG badge image
 * - 400: Invalid slug format
 * - 403: Product not published or free tier user
 * - 404: Product not found
 * - 500: Server error
 *
 * All errors return error badge SVG with appropriate message
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params (Next.js 15 requirement)
    const { slug: slugParam } = await params

    // Validate slug format (alphanumeric + hyphens only, max 100 chars)
    const slugResult = slugSchema.safeParse(slugParam)
    if (!slugResult.success) {
      return new NextResponse(
        generateErrorBadge('INVALID_SLUG', 'medium'),
        {
          status: 400,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=60',
          },
        }
      )
    }

    const slug = slugResult.data

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams
    const paramsResult = badgeParamsSchema.safeParse({
      variant: searchParams.get('variant') || 'pro',
      size: searchParams.get('size') || 'medium',
      theme: searchParams.get('theme') || 'auto',
      live: searchParams.get('live') || 'false',
    })

    if (!paramsResult.success) {
      return new NextResponse(
        generateErrorBadge('INVALID_SLUG', 'medium'),
        {
          status: 400,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=60',
          },
        }
      )
    }

    const badgeParams = paramsResult.data

    // Fetch badge data (cached for 5 minutes via React cache)
    const badgeData = await getBadgeData(slug)

    if (!badgeData) {
      return new NextResponse(
        generateErrorBadge('PRODUCT_NOT_FOUND', badgeParams.size),
        {
          status: 404,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=300',
          },
        }
      )
    }

    // Check if product is published
    if (!badgeData.isPublished) {
      return new NextResponse(
        generateErrorBadge('PRODUCT_NOT_PUBLISHED', badgeParams.size),
        {
          status: 403,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-store',
          },
        }
      )
    }

    // Check if product owner has badge access (Pro or Pro Plus)
    if (badgeData.userTier === 'free') {
      return new NextResponse(
        generateErrorBadge('UPGRADE_REQUIRED', badgeParams.size),
        {
          status: 403,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=60',
          },
        }
      )
    }

    // Determine badge variant based on user tier
    // Pro Plus users can choose variant, Pro users always get 'pro'
    const variant =
      badgeData.userTier === 'pro_plus'
        ? badgeParams.variant
        : 'pro'

    // Generate SVG badge
    const svg = generateBadgeSVG({
      variant,
      size: badgeParams.size,
      theme: badgeParams.theme,
      upvotesCount: badgeData.upvotesCount,
      productName: badgeData.productName,
      productSlug: badgeData.productSlug,
    })

    // Set cache headers
    // - 5-minute cache with stale-while-revalidate (reduces DB load by ~95%)
    // - live=true bypasses cache for real-time data
    const cacheControl = badgeParams.live
      ? 'no-store'
      : `public, s-maxage=${BADGE_CACHE_TTL}, stale-while-revalidate=${BADGE_CACHE_SWR}`

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': cacheControl,
        'X-Badge-Version': '1.0',
        'X-Badge-Variant': variant,
        'X-Badge-Size': badgeParams.size,
      },
    })
  } catch (error) {
    console.error('Badge generation error:', error)
    return new NextResponse(
      generateErrorBadge('SERVER_ERROR', 'medium'),
      {
        status: 500,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-store',
        },
      }
    )
  }
}

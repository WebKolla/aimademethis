import { BadgeSize, BadgeVariant } from './types'

/**
 * Badge dimensions (width x height in pixels)
 * Small: 180x40 - For tight spaces, mobile sidebars
 * Medium: 220x48 - Default, balances visibility and space
 * Large: 260x56 - For hero sections, prominent placements
 */
export const BADGE_DIMENSIONS: Record<
  BadgeSize,
  { width: number; height: number }
> = {
  small: { width: 180, height: 40 },
  medium: { width: 220, height: 48 },
  large: { width: 260, height: 56 },
}

/**
 * Pro badge colors (Emerald/Teal gradient)
 * Matches AiMadeMeThis brand colors
 */
export const PRO_BADGE_COLORS = {
  light: {
    gradient: {
      start: 'hsl(160, 84%, 39%)', // Emerald-600
      end: 'hsl(173, 58%, 39%)', // Teal-600
    },
    text: 'hsl(0, 0%, 100%)', // White
    shadow: 'hsla(160, 84%, 39%, 0.25)',
    shadowBlur: 8,
  },
  dark: {
    gradient: {
      start: 'hsl(160, 84%, 45%)', // Lighter emerald for dark mode
      end: 'hsl(173, 58%, 45%)', // Lighter teal for dark mode
    },
    text: 'hsl(0, 0%, 100%)', // White
    shadow: 'hsla(160, 84%, 45%, 0.35)',
    shadowBlur: 10,
  },
}

/**
 * Pro Plus badge colors (Gold/Amber gradient)
 * Premium, exclusive feel with high contrast
 */
export const PRO_PLUS_BADGE_COLORS = {
  light: {
    gradient: {
      start: 'hsl(45, 93%, 58%)', // Warm gold
      end: 'hsl(32, 95%, 55%)', // Rich amber
    },
    text: 'hsl(20, 14%, 15%)', // Dark brown (AAA contrast)
    shadow: 'hsla(45, 93%, 58%, 0.4)',
    shadowBlur: 12,
  },
  dark: {
    gradient: {
      start: 'hsl(45, 93%, 58%)', // Same gradient works on dark
      end: 'hsl(32, 95%, 55%)',
    },
    text: 'hsl(20, 14%, 15%)', // Dark brown
    shadow: 'hsla(45, 93%, 58%, 0.5)',
    shadowBlur: 14,
  },
}

/**
 * Badge label text
 * Pro: "FEATURED ON AIMMT"
 * Pro Plus: "PRO PLUS • AIMMT" (with bullet separator)
 */
export const BADGE_LABELS: Record<BadgeVariant, string> = {
  pro: 'FEATURED ON AIMMT',
  'pro-plus': 'PRO PLUS • AIMMT',
}

/**
 * Typography settings for different badge sizes
 */
export const BADGE_TYPOGRAPHY = {
  small: {
    labelSize: 10,
    upvoteSize: 12,
    iconSize: 14,
    upvoteIconSize: 12,
    labelWeight: 700,
    upvoteWeight: 800,
    letterSpacing: 0.5,
  },
  medium: {
    labelSize: 11,
    upvoteSize: 14,
    iconSize: 16,
    upvoteIconSize: 14,
    labelWeight: 700,
    upvoteWeight: 800,
    letterSpacing: 0.5,
  },
  large: {
    labelSize: 12,
    upvoteSize: 16,
    iconSize: 18,
    upvoteIconSize: 16,
    labelWeight: 700,
    upvoteWeight: 800,
    letterSpacing: 0.5,
  },
}

/**
 * Pro Plus badge uses heavier weights for premium feel
 */
export const PRO_PLUS_TYPOGRAPHY = {
  small: {
    ...BADGE_TYPOGRAPHY.small,
    labelWeight: 800,
    upvoteWeight: 900,
    letterSpacing: 0.6,
  },
  medium: {
    ...BADGE_TYPOGRAPHY.medium,
    labelWeight: 800,
    upvoteWeight: 900,
    letterSpacing: 0.6,
  },
  large: {
    ...BADGE_TYPOGRAPHY.large,
    labelWeight: 800,
    upvoteWeight: 900,
    letterSpacing: 0.6,
  },
}

/**
 * Badge padding and spacing
 */
export const BADGE_SPACING = {
  small: {
    paddingX: 12,
    paddingY: 8,
    iconToText: 6,
    sectionGap: 10,
    borderRadius: 8,
  },
  medium: {
    paddingX: 14,
    paddingY: 10,
    iconToText: 8,
    sectionGap: 12,
    borderRadius: 10,
  },
  large: {
    paddingX: 16,
    paddingY: 12,
    iconToText: 10,
    sectionGap: 14,
    borderRadius: 12,
  },
}

/**
 * Cache configuration
 * 5-minute cache reduces database load by ~95%
 */
export const BADGE_CACHE_TTL = 300 // 5 minutes in seconds
export const BADGE_CACHE_SWR = 60 // stale-while-revalidate in seconds

/**
 * Rate limiting (to be implemented in Phase 2)
 * For now, documented for future reference
 */
export const BADGE_RATE_LIMIT = 1000 // requests per minute per IP
export const CLICK_RATE_LIMIT = 10 // clicks per minute per product

/**
 * Error messages for badge generation failures
 */
export const BADGE_ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: 'Product Not Found',
  PRODUCT_NOT_PUBLISHED: 'Product Not Published',
  UPGRADE_REQUIRED: 'Upgrade to Pro',
  INVALID_SLUG: 'Invalid Product',
  SERVER_ERROR: 'Badge Unavailable',
  RATE_LIMITED: 'Too Many Requests',
} as const

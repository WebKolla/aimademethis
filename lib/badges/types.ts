import { z } from 'zod'

// Badge variants
export type BadgeVariant = 'pro' | 'pro-plus'

// Badge sizes
export type BadgeSize = 'small' | 'medium' | 'large'

// Badge themes
export type BadgeTheme = 'light' | 'dark' | 'auto'

// Badge data structure
export interface BadgeData {
  productId: string
  productName: string
  productSlug: string
  upvotesCount: number
  userTier: 'free' | 'pro' | 'pro_plus'
  isPublished: boolean
  isOwner: boolean
}

// Badge configuration for SVG generation
export interface BadgeConfig {
  variant: BadgeVariant
  size: BadgeSize
  theme: BadgeTheme
  upvotesCount: number
  productName: string
  productSlug: string
}

// Zod schemas for validation

/**
 * Schema for badge query parameters
 * Used in API routes to validate incoming requests
 */
export const badgeParamsSchema = z.object({
  variant: z.enum(['pro', 'pro-plus']).default('pro'),
  size: z.enum(['small', 'medium', 'large']).default('medium'),
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  live: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true'),
})

/**
 * Schema for product slug validation
 * Ensures slug is alphanumeric + hyphens only, max 100 chars
 */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Invalid slug format')
  .max(100, 'Slug too long')

/**
 * Schema for click tracking data
 * Used when recording badge clicks
 */
export const clickTrackingSchema = z.object({
  productId: z.string().uuid(),
  referrer: z.string().optional(),
})

// Inferred types from Zod schemas
export type BadgeParams = z.infer<typeof badgeParamsSchema>
export type ClickTrackingData = z.infer<typeof clickTrackingSchema>

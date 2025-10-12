import { BadgeVariant, BadgeSize } from './types'
import { BADGE_DIMENSIONS } from './constants'

/**
 * Escapes XML special characters to prevent XSS attacks
 * Critical security function - all dynamic content must be escaped
 * before being inserted into SVG
 *
 * @param unsafe - Untrusted string (e.g., product name, upvote count)
 * @returns Safely escaped string for use in XML/SVG
 */
export function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Formats badge alt text for accessibility
 * Provides descriptive text for screen readers
 *
 * @param productName - Name of the product
 * @param variant - Badge variant (pro or pro-plus)
 * @param upvotesCount - Number of upvotes
 * @returns Accessible alt text for the badge
 */
export function getBadgeAltText(
  productName: string,
  variant: BadgeVariant,
  upvotesCount: number
): string {
  const variantLabel = variant === 'pro' ? 'Pro Badge' : 'Pro Plus Badge'
  return `${productName} - Featured on AiMadeMeThis (${variantLabel}) - ${upvotesCount} upvotes`
}

/**
 * Generates full badge URL with query parameters
 * Used for generating embeddable badge URLs
 *
 * @param baseUrl - Site base URL (e.g., https://aimademethis.com)
 * @param slug - Product slug
 * @param params - Optional badge parameters (variant, size, theme)
 * @returns Complete badge URL with query parameters
 */
export function getBadgeUrl(
  baseUrl: string,
  slug: string,
  params: {
    variant?: BadgeVariant
    size?: BadgeSize
    theme?: 'light' | 'dark' | 'auto'
  } = {}
): string {
  const url = new URL(`/api/badge/${slug}`, baseUrl)

  if (params.variant) url.searchParams.set('variant', params.variant)
  if (params.size) url.searchParams.set('size', params.size)
  if (params.theme) url.searchParams.set('theme', params.theme)

  return url.toString()
}

/**
 * Generates HTML embed code for badge
 * Standard <a> + <img> tags for maximum compatibility
 *
 * @param productUrl - Full URL to product page
 * @param badgeUrl - Full URL to badge image
 * @param productName - Product name for alt text
 * @param size - Badge size (affects width/height attributes)
 * @returns HTML string ready to copy-paste
 */
export function getHtmlEmbedCode(
  productUrl: string,
  badgeUrl: string,
  productName: string,
  size: BadgeSize
): string {
  const dimensions = BADGE_DIMENSIONS[size]
  const altText = `${productName} - Featured on AiMadeMeThis`

  return `<a href="${productUrl}" target="_blank" rel="noopener noreferrer" title="View ${productName} on AiMadeMeThis">
  <img src="${badgeUrl}" alt="${altText}" width="${dimensions.width}" height="${dimensions.height}" loading="lazy" decoding="async" />
</a>`
}

/**
 * Generates Markdown embed code for badge
 * Perfect for GitHub README files
 *
 * @param productUrl - Full URL to product page
 * @param badgeUrl - Full URL to badge image
 * @param productName - Product name for alt text
 * @returns Markdown string ready to copy-paste
 */
export function getMarkdownEmbedCode(
  productUrl: string,
  badgeUrl: string,
  productName: string
): string {
  const altText = `${productName} - Featured on AiMadeMeThis`
  return `[![${altText}](${badgeUrl})](${productUrl})`
}

/**
 * Generates React/Next.js embed code for badge
 * Uses Next.js Image component for optimal loading
 *
 * @param productUrl - Full URL to product page
 * @param badgeUrl - Full URL to badge image
 * @param productName - Product name for alt text
 * @param size - Badge size (affects width/height props)
 * @returns React/JSX string ready to copy-paste
 */
export function getReactEmbedCode(
  productUrl: string,
  badgeUrl: string,
  productName: string,
  size: BadgeSize
): string {
  const dimensions = BADGE_DIMENSIONS[size]
  const altText = `${productName} - Featured on AiMadeMeThis`

  return `<a href="${productUrl}" target="_blank" rel="noopener noreferrer">
  <Image
    src="${badgeUrl}"
    alt="${altText}"
    width={${dimensions.width}}
    height={${dimensions.height}}
  />
</a>`
}

/**
 * Formats upvote count for display
 * Handles large numbers with abbreviations (e.g., 1.2K, 10K+)
 *
 * @param count - Raw upvote count
 * @returns Formatted string (e.g., "127", "1.2K", "10K+")
 */
export function formatUpvoteCount(count: number): string {
  if (count < 1000) {
    return count.toString()
  }

  if (count < 10000) {
    return (count / 1000).toFixed(1) + 'K'
  }

  return '10K+'
}

/**
 * Validates product slug format
 * Returns true if slug is valid (alphanumeric + hyphens only)
 *
 * @param slug - Product slug to validate
 * @returns True if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0 && slug.length <= 100
}

/**
 * Gets badge dimensions for a given size
 *
 * @param size - Badge size
 * @returns Width and height in pixels
 */
export function getBadgeDimensions(size: BadgeSize) {
  return BADGE_DIMENSIONS[size]
}

/**
 * Extracts domain from referrer URL
 * Used for analytics to track top referring domains
 *
 * @param referrer - Full referrer URL
 * @returns Domain name (e.g., "example.com") or null if invalid
 */
export function extractDomain(referrer: string | null | undefined): string | null {
  if (!referrer) return null

  try {
    const url = new URL(referrer)
    return url.hostname
  } catch {
    return null
  }
}

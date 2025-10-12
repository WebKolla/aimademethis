import { BadgeConfig, BadgeSize, BadgeTheme, BadgeVariant } from './types'
import {
  BADGE_DIMENSIONS,
  BADGE_SPACING,
  BADGE_TYPOGRAPHY,
  PRO_BADGE_COLORS,
  PRO_PLUS_BADGE_COLORS,
  PRO_PLUS_TYPOGRAPHY,
  BADGE_LABELS,
  BADGE_ERROR_MESSAGES,
} from './constants'
import { escapeXml, formatUpvoteCount } from './utils'

/**
 * Generates an SVG badge for a product
 * Pure function with no side effects - core badge generation logic
 *
 * @param config - Badge configuration (variant, size, theme, data)
 * @returns Complete SVG string (< 3KB target)
 */
export function generateBadgeSVG(config: BadgeConfig): string {
  const { variant, size, theme, upvotesCount, productName } = config

  // Get dimensions and colors
  const dimensions = BADGE_DIMENSIONS[size]
  const spacing = BADGE_SPACING[size]
  const typography =
    variant === 'pro-plus'
      ? PRO_PLUS_TYPOGRAPHY[size]
      : BADGE_TYPOGRAPHY[size]
  const colors =
    variant === 'pro' ? PRO_BADGE_COLORS : PRO_PLUS_BADGE_COLORS
  const themeColors = colors[theme === 'dark' ? 'dark' : 'light']
  const label = BADGE_LABELS[variant]

  // Sanitize dynamic content (XSS prevention)
  const safeName = escapeXml(productName)
  const safeUpvotes = escapeXml(formatUpvoteCount(upvotesCount))
  const safeLabel = escapeXml(label)

  // Generate unique gradient ID to avoid conflicts
  const gradientId = `gradient-${variant}-${size}-${Date.now()}`
  const shadowId = `shadow-${variant}-${size}-${Date.now()}`

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${safeName} - Featured on AiMadeMeThis">
  <title>Featured on AiMadeMeThis</title>
  <desc>${safeName} is featured on AiMadeMeThis with ${safeUpvotes} upvotes</desc>

  <defs>
    <!-- Gradient definition -->
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${themeColors.gradient.start};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${themeColors.gradient.end};stop-opacity:1" />
    </linearGradient>

    <!-- Shadow filter -->
    <filter id="${shadowId}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${themeColors.shadowBlur / 4}"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feFlood flood-color="${themeColors.shadow}"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background with gradient and shadow -->
  <rect
    width="${dimensions.width}"
    height="${dimensions.height}"
    rx="${spacing.borderRadius}"
    fill="url(#${gradientId})"
    filter="url(#${shadowId})"
  />

  <!-- Left section: Icon + Label -->
  <g transform="translate(${spacing.paddingX}, ${dimensions.height / 2})">
    <!-- Icon (Sparkles for Pro, Crown for Pro Plus) -->
    ${variant === 'pro' ? renderSparklesIcon(typography.iconSize, themeColors.text) : renderCrownIcon(typography.iconSize, themeColors.text)}

    <!-- Label text -->
    <text
      x="${typography.iconSize + spacing.iconToText}"
      y="0"
      font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
      font-size="${typography.labelSize}"
      font-weight="${typography.labelWeight}"
      letter-spacing="${typography.letterSpacing}"
      fill="${themeColors.text}"
      dominant-baseline="middle"
      text-anchor="start"
    >
      ${safeLabel}
    </text>
  </g>

  <!-- Right section: Upvote icon + Count -->
  <g transform="translate(${dimensions.width - spacing.paddingX}, ${dimensions.height / 2})">
    <!-- Upvote count -->
    <text
      x="0"
      y="0"
      font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
      font-size="${typography.upvoteSize}"
      font-weight="${typography.upvoteWeight}"
      fill="${themeColors.text}"
      dominant-baseline="middle"
      text-anchor="end"
    >
      ↑ ${safeUpvotes}
    </text>
  </g>
</svg>`
}

/**
 * Renders Sparkles icon (for Pro badge)
 * Simplified version - actual icon from Lucide React would be more detailed
 *
 * @param size - Icon size in pixels
 * @param color - Fill color (HSL string)
 * @returns SVG path string
 */
function renderSparklesIcon(size: number, color: string): string {
  // Scale factor to fit icon within size
  const scale = size / 24

  return `<g transform="scale(${scale})">
    <path
      d="M12 0L14.5 7.5L22 10L14.5 12.5L12 20L9.5 12.5L2 10L9.5 7.5L12 0Z M18 2L19 5L22 6L19 7L18 10L17 7L14 6L17 5L18 2Z"
      fill="${color}"
      transform="translate(-12, -10)"
    />
  </g>`
}

/**
 * Renders Crown icon (for Pro Plus badge)
 * Simplified version - actual icon from Lucide React would be more detailed
 *
 * @param size - Icon size in pixels
 * @param color - Fill color (HSL string)
 * @returns SVG path string
 */
function renderCrownIcon(size: number, color: string): string {
  // Scale factor to fit icon within size
  const scale = size / 24

  return `<g transform="scale(${scale})">
    <path
      d="M2 6L6 2L10 6L14 2L18 6L18 18L2 18L2 6Z M4 8L4 16L16 16L16 8L14 10L10 6L6 10L4 8Z"
      fill="${color}"
      transform="translate(-10, -10)"
    />
  </g>`
}

/**
 * Generates error badge for invalid requests
 * Returns a simple gray badge with error message
 *
 * @param message - Error message to display (from BADGE_ERROR_MESSAGES)
 * @param size - Badge size
 * @returns SVG error badge string
 */
export function generateErrorBadge(
  message: keyof typeof BADGE_ERROR_MESSAGES,
  size: BadgeSize = 'medium'
): string {
  const dimensions = BADGE_DIMENSIONS[size]
  const spacing = BADGE_SPACING[size]
  const typography = BADGE_TYPOGRAPHY[size]
  const errorMessage = BADGE_ERROR_MESSAGES[message]
  const safeMessage = escapeXml(errorMessage)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Badge Error: ${safeMessage}">
  <title>Badge Error</title>
  <desc>${safeMessage}</desc>

  <!-- Dark gray background -->
  <rect
    width="${dimensions.width}"
    height="${dimensions.height}"
    rx="${spacing.borderRadius}"
    fill="hsl(217, 19%, 27%)"
  />

  <!-- Error message -->
  <text
    x="${dimensions.width / 2}"
    y="${dimensions.height / 2}"
    font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    font-size="${typography.labelSize}"
    font-weight="${typography.labelWeight}"
    fill="hsl(217, 19%, 69%)"
    text-anchor="middle"
    dominant-baseline="middle"
  >
    ${safeMessage}
  </text>
</svg>`
}

/**
 * Validates badge configuration
 * Returns true if config is valid, false otherwise
 *
 * @param config - Badge configuration to validate
 * @returns True if valid
 */
export function isValidBadgeConfig(config: Partial<BadgeConfig>): boolean {
  if (!config.variant || !config.size || !config.theme) {
    return false
  }

  if (!config.productName || !config.productSlug) {
    return false
  }

  if (
    typeof config.upvotesCount !== 'number' ||
    config.upvotesCount < 0
  ) {
    return false
  }

  return true
}

/**
 * Calculates approximate SVG file size
 * Used for performance monitoring (target: < 3KB)
 *
 * @param svg - SVG string
 * @returns File size in bytes
 */
export function calculateSVGSize(svg: string): number {
  return new Blob([svg]).size
}

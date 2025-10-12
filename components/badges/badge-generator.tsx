'use client'

import { useState, useMemo } from 'react'
import { BadgeVariant, BadgeSize, BadgeTheme } from '@/lib/badges/types'
import { getDefaultBadgeConfig } from '@/lib/badges/utils'
import { ProductSelector } from './product-selector'
import { BadgePreview } from './badge-preview'
import { BadgeControls } from './badge-controls'
import { EmbedCodeGenerator } from './embed-code-generator'
import { BadgeStats } from './badge-stats'

interface Product {
  id: string
  slug: string
  name: string
  tagline: string | null
}

interface BadgeGeneratorProps {
  products: Product[]
  userTier: 'pro' | 'pro_plus'
  initialProductSlug?: string
}

/**
 * Badge Generator Component
 *
 * Main orchestrator for badge generation UI
 * Manages state and coordinates between child components
 * Supports pre-selection via initialProductSlug prop
 */
export function BadgeGenerator({ products, userTier, initialProductSlug }: BadgeGeneratorProps) {
  // Select product from query param or default to first product
  const initialProduct = initialProductSlug
    ? products.find((p) => p.slug === initialProductSlug) || products[0]
    : products[0]
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProduct)

  // Badge customization state
  const defaults = getDefaultBadgeConfig()
  const [variant, setVariant] = useState<BadgeVariant>(defaults.variant)
  const [size, setSize] = useState<BadgeSize>(defaults.size)
  const [theme, setTheme] = useState<BadgeTheme>(defaults.theme)

  // Compute badge URL based on current settings
  const badgeUrl = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'
    const params = new URLSearchParams({
      variant,
      size,
      theme,
    })
    return `${baseUrl}/api/badge/${selectedProduct.slug}?${params.toString()}`
  }, [selectedProduct.slug, variant, size, theme])

  // Compute product URL
  const productUrl = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'
    return `${baseUrl}/products/${selectedProduct.slug}`
  }, [selectedProduct.slug])

  // Reset to defaults
  const handleReset = () => {
    setVariant(defaults.variant)
    setSize(defaults.size)
    setTheme(defaults.theme)
  }

  // Handle product change
  const handleProductChange = (slug: string) => {
    const product = products.find((p) => p.slug === slug)
    if (product) {
      setSelectedProduct(product)
      // Reset customization when product changes
      handleReset()
    }
  }

  return (
    <div className="space-y-8">
      {/* Product Selector */}
      <ProductSelector
        products={products}
        selectedSlug={selectedProduct.slug}
        onSelect={handleProductChange}
      />

      {/* Two-column layout: Controls + Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 lg:gap-8">
        {/* Left Column: Customization */}
        <div className="space-y-6 min-w-0">
          <BadgeControls
            variant={variant}
            size={size}
            theme={theme}
            userTier={userTier}
            onVariantChange={setVariant}
            onSizeChange={setSize}
            onThemeChange={setTheme}
            onReset={handleReset}
          />

          <BadgeStats productId={selectedProduct.id} />
        </div>

        {/* Right Column: Preview + Embed Codes */}
        <div className="space-y-6 min-w-0">
          <BadgePreview
            productName={selectedProduct.name}
            badgeUrl={badgeUrl}
            productUrl={productUrl}
          />

          <EmbedCodeGenerator
            productName={selectedProduct.name}
            productUrl={productUrl}
            badgeUrl={badgeUrl}
            size={size}
          />
        </div>
      </div>
    </div>
  )
}

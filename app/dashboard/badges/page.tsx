import { redirect } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getUserTier, getUserProducts } from '@/lib/badges/actions'
import { Badge } from '@/components/ui/badge'
import { BadgeGenerator } from '@/components/badges/badge-generator'
import { UpgradePrompt } from '@/components/badges/upgrade-prompt'
import { EmptyState } from '@/components/badges/empty-state'

/**
 * Badge Generator Page
 *
 * Pro/Pro Plus exclusive feature
 * Allows users to generate embeddable badges for their products
 * Supports pre-selection via query parameter: ?product={slug}
 */
export default async function BadgesPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's subscription tier
  const userTier = await getUserTier(user.id)

  // Check if user has Pro or Pro Plus access
  if (userTier === 'free') {
    return <UpgradePrompt />
  }

  // Fetch user's published products
  const { data: products, error } = await getUserProducts()

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive">Failed to load products: {error}</p>
      </div>
    )
  }

  // Check if user has any published products
  if (!products || products.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Badge Generator
          </h1>
          {userTier === 'pro_plus' && (
            <Badge variant="outline" className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-3 w-3 mr-1" />
              Pro Plus
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-base max-w-2xl">
          Generate beautiful, embeddable badges for your products. Share them on your website, README files, or anywhere you want to showcase your AI creations.
        </p>
      </div>

      {/* Badge Generator */}
      <BadgeGenerator
        products={products}
        userTier={userTier}
        initialProductSlug={params.product}
      />
    </div>
  )
}

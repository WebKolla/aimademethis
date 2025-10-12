import { redirect } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getUserTier, getUserProducts } from '@/lib/badges/actions'
import { Badge } from '@/components/ui/badge'
import { BadgeGenerator } from '@/components/badges/badge-generator'
import { UpgradePrompt } from '@/components/badges/upgrade-prompt'
import { EmptyState } from '@/components/badges/empty-state'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

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
    return (
      <DashboardLayout>
        <UpgradePrompt />
      </DashboardLayout>
    )
  }

  // Fetch user's published products
  const { data: products, error } = await getUserProducts()

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <p className="text-destructive">Failed to load products: {error}</p>
        </div>
      </DashboardLayout>
    )
  }

  // Check if user has any published products
  if (!products || products.length === 0) {
    return (
      <DashboardLayout>
        <EmptyState />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
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
    </DashboardLayout>
  )
}

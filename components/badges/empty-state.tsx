'use client'

import Link from 'next/link'
import { Package, Plus, CheckCircle2, TrendingUp, Share2 } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Empty State Component
 *
 * Shown when user has no published products
 * Provides clear CTAs, tutorial steps, and benefits
 */
export function EmptyState() {
  const exampleBadgeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'}/api/badge/example?variant=pro&size=medium&theme=light`

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl w-full space-y-6">
        {/* Main Empty State Card */}
        <Card className="text-center border-dashed">
          <CardContent className="pt-12 pb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2 mb-6">
              <h3 className="text-2xl font-semibold">No Published Products Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You need at least one published product to generate badges. Create and publish your first product to unlock badge generation.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 justify-center pb-12">
            <Button asChild variant="outline">
              <Link href="/dashboard/products">View Products</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              <Link href="/dashboard/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Product
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Getting Started Tutorial */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">How Badge Generation Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Steps */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-600">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Create & Publish Product</h4>
                  <p className="text-sm text-muted-foreground">
                    Add your AI-generated product with details, images, and publish it to make it visible.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-600">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Generate Your Badge</h4>
                  <p className="text-sm text-muted-foreground">
                    Return to this page to customize and generate your embeddable badge with multiple themes and sizes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-600">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Embed Anywhere</h4>
                  <p className="text-sm text-muted-foreground">
                    Copy the HTML, Markdown, or React code and embed your badge on websites, README files, or social media.
                  </p>
                </div>
              </div>
            </div>

            {/* Example Badge Preview */}
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-6">
              <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
                Example Badge Preview
              </p>
              <div className="flex justify-center">
                <img
                  src={exampleBadgeUrl}
                  alt="Example badge"
                  className="max-w-full h-auto"
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Track Click Analytics</p>
                  <p className="text-xs text-muted-foreground">Monitor badge performance and see where your traffic comes from</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Increase Visibility</p>
                  <p className="text-xs text-muted-foreground">Showcase your products everywhere and drive more traffic to your listings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Share2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Build Credibility</p>
                  <p className="text-xs text-muted-foreground">Professional badges show you&apos;re featured on AIMadeThis</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Package, Plus } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Empty State Component
 *
 * Shown when user has no published products
 * Provides clear CTAs to resolve the issue
 */
export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md text-center border-dashed">
        <CardContent className="pt-12 pb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2 mb-6">
            <h3 className="text-xl font-semibold">No Published Products</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You need at least one published product to generate badges. Create a product and publish it to get started.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3 justify-center pb-12">
          <Button asChild variant="outline">
            <Link href="/dashboard/products">View Products</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Product
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

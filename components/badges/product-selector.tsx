'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Product {
  id: string
  slug: string
  name: string
}

interface ProductSelectorProps {
  products: Product[]
  selectedSlug: string
  onSelect: (slug: string) => void
}

/**
 * Product Selector Component
 *
 * Dropdown to select which product to generate a badge for
 */
export function ProductSelector({ products, selectedSlug, onSelect }: ProductSelectorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <Label htmlFor="product-select" className="text-sm font-medium">
            Select Product
          </Label>
          <Select value={selectedSlug} onValueChange={onSelect}>
            <SelectTrigger id="product-select" className="w-full">
              <SelectValue placeholder="Choose a product to generate badge..." />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.slug}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground">/{product.slug}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

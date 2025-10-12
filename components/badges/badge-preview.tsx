'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface BadgePreviewProps {
  productName: string
  badgeUrl: string
  productUrl: string
}

/**
 * Badge Preview Component
 *
 * Shows live preview of the badge with clickable link
 * Displays badge URL with copy-to-clipboard functionality
 */
export function BadgePreview({ productName, badgeUrl, productUrl }: BadgePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(badgeUrl)
      setCopied(true)
      toast.success('Badge URL copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy URL')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Live Preview</CardTitle>
        <CardDescription>
          Click the badge to test the link behavior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Preview Area */}
          <div className="relative flex items-center justify-center min-h-[200px] rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-8">
            {isLoading && (
              <div className="space-y-3 w-full max-w-sm">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            )}
            <a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-transform hover:scale-105 active:scale-95 ${isLoading ? 'hidden' : 'inline-block'}`}
            >
              <img
                src={badgeUrl}
                alt={`Badge for ${productName}`}
                onLoad={() => setIsLoading(false)}
                className="max-w-full h-auto"
              />
            </a>
          </div>

          {/* Badge URL */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Badge URL
            </Label>
            <div className="relative min-w-0">
              <Input
                value={badgeUrl}
                readOnly
                className="font-mono text-xs sm:text-sm break-all pr-14 min-w-0"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={handleCopy}
                aria-label="Copy badge URL to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

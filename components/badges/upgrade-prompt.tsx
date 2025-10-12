'use client'

import Link from 'next/link'
import { Sparkles, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Upgrade Prompt Component
 *
 * Shown to Free tier users when they access the badge generator
 * Explains Pro/Pro Plus benefits and encourages upgrade
 */
export function UpgradePrompt() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md text-center">
        <CardHeader>
          <Sparkles className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl mt-4">Unlock Badge Generator</CardTitle>
          <CardDescription>
            Create professional badges for your AI products with Pro or Pro Plus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-left space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Customizable badge variants and themes</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Click tracking and referrer analytics</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Embed codes for HTML, Markdown, and React</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Increase product visibility and SEO</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

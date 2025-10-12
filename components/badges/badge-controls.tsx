'use client'

import { Sun, Moon, Laptop, Lock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BadgeVariant, BadgeSize, BadgeTheme } from '@/lib/badges/types'

interface BadgeControlsProps {
  variant: BadgeVariant
  size: BadgeSize
  theme: BadgeTheme
  userTier: 'pro' | 'pro_plus'
  onVariantChange: (variant: BadgeVariant) => void
  onSizeChange: (size: BadgeSize) => void
  onThemeChange: (theme: BadgeTheme) => void
  onReset: () => void
}

/**
 * Badge Controls Component
 *
 * Customization controls for badge appearance
 * Radio groups for variant, size, and theme selection
 */
export function BadgeControls({
  variant,
  size,
  theme,
  userTier,
  onVariantChange,
  onSizeChange,
  onThemeChange,
  onReset,
}: BadgeControlsProps) {
  const isPro = userTier === 'pro'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Customize Badge</CardTitle>
        <CardDescription>
          Choose the style and size for your badge
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Variant Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Variant</Label>
          <RadioGroup value={variant} onValueChange={(v) => onVariantChange(v as BadgeVariant)} className="space-y-3">
            <div className="flex items-center space-x-3 rounded-lg border border-input p-4 cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="pro" id="variant-pro" />
              <Label htmlFor="variant-pro" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Pro</span>
                  <div className="h-3 w-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Emerald-to-teal gradient
                </p>
              </Label>
            </div>

            <div className={`flex items-center space-x-3 rounded-lg border border-input p-4 cursor-pointer transition-colors ${isPro ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5'}`}>
              <RadioGroupItem value="pro-plus" id="variant-pro-plus" disabled={isPro} />
              <Label htmlFor="variant-pro-plus" className={`flex-1 ${isPro ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Pro Plus</span>
                  <div className="h-3 w-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500" />
                  {isPro && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      Pro Plus
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Gold-to-amber gradient
                </p>
              </Label>
            </div>
          </RadioGroup>
          {isPro && (
            <p className="text-xs text-muted-foreground">
              Upgrade to Pro Plus to unlock the gold badge variant
            </p>
          )}
        </div>

        {/* Size Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Size</Label>
          <RadioGroup value={size} onValueChange={(s) => onSizeChange(s as BadgeSize)} className="grid grid-cols-3 gap-3">
            <div className="relative">
              <RadioGroupItem value="small" id="size-small" className="peer sr-only" />
              <Label
                htmlFor="size-small"
                className="flex flex-col items-center justify-center rounded-lg border-2 border-input p-4 cursor-pointer hover:border-primary/50 transition-colors peer-checked:border-primary peer-checked:bg-primary/5"
              >
                <span className="text-sm font-medium">Small</span>
                <span className="text-xs text-muted-foreground mt-1">180×40</span>
              </Label>
            </div>
            <div className="relative">
              <RadioGroupItem value="medium" id="size-medium" className="peer sr-only" />
              <Label
                htmlFor="size-medium"
                className="flex flex-col items-center justify-center rounded-lg border-2 border-input p-4 cursor-pointer hover:border-primary/50 transition-colors peer-checked:border-primary peer-checked:bg-primary/5"
              >
                <span className="text-sm font-medium">Medium</span>
                <span className="text-xs text-muted-foreground mt-1">220×48</span>
              </Label>
            </div>
            <div className="relative">
              <RadioGroupItem value="large" id="size-large" className="peer sr-only" />
              <Label
                htmlFor="size-large"
                className="flex flex-col items-center justify-center rounded-lg border-2 border-input p-4 cursor-pointer hover:border-primary/50 transition-colors peer-checked:border-primary peer-checked:bg-primary/5"
              >
                <span className="text-sm font-medium">Large</span>
                <span className="text-xs text-muted-foreground mt-1">260×56</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Theme</Label>
          <RadioGroup value={theme} onValueChange={(t) => onThemeChange(t as BadgeTheme)} className="grid grid-cols-3 gap-3">
            <div className="relative">
              <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-center rounded-lg border-2 border-input p-4 cursor-pointer hover:border-primary/50 transition-colors peer-checked:border-primary peer-checked:bg-primary/5"
              >
                <Sun className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">Light</span>
              </Label>
            </div>
            <div className="relative">
              <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-center rounded-lg border-2 border-input p-4 cursor-pointer hover:border-primary/50 transition-colors peer-checked:border-primary peer-checked:bg-primary/5"
              >
                <Moon className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </Label>
            </div>
            <div className="relative">
              <RadioGroupItem value="auto" id="theme-auto" className="peer sr-only" />
              <Label
                htmlFor="theme-auto"
                className="flex flex-col items-center justify-center rounded-lg border-2 border-input p-4 cursor-pointer hover:border-primary/50 transition-colors peer-checked:border-primary peer-checked:bg-primary/5"
              >
                <Laptop className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">Auto</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={onReset} className="w-full">
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  )
}

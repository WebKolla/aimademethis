'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { BadgeSize } from '@/lib/badges/types'
import { getHtmlEmbedCode, getMarkdownEmbedCode, getReactEmbedCode } from '@/lib/badges/utils'
import { toast } from 'sonner'

interface EmbedCodeGeneratorProps {
  productName: string
  productUrl: string
  badgeUrl: string
  size: BadgeSize
}

type CodeTab = 'html' | 'markdown' | 'react'

/**
 * Embed Code Generator Component
 *
 * Tabbed interface showing HTML, Markdown, and React embed codes
 * One-click copy-to-clipboard functionality
 */
export function EmbedCodeGenerator({
  productName,
  productUrl,
  badgeUrl,
  size,
}: EmbedCodeGeneratorProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>('html')
  const [copiedTab, setCopiedTab] = useState<CodeTab | null>(null)

  // Generate embed codes
  const htmlCode = getHtmlEmbedCode(productUrl, badgeUrl, productName, size)
  const markdownCode = getMarkdownEmbedCode(productUrl, badgeUrl, productName)
  const reactCode = getReactEmbedCode(productUrl, badgeUrl, productName, size)

  const handleCopy = async (tab: CodeTab) => {
    const code = tab === 'html' ? htmlCode : tab === 'markdown' ? markdownCode : reactCode

    try {
      await navigator.clipboard.writeText(code)
      setCopiedTab(tab)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopiedTab(null), 2000)
    } catch {
      toast.error('Failed to copy code')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Embed Code</CardTitle>
        <CardDescription>
          Copy and paste this code to embed your badge
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CodeTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="mt-4">
            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopy('html')}
              >
                {copiedTab === 'html' ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <pre className="rounded-lg bg-muted p-4 pr-24 overflow-x-auto">
                <code className="font-mono text-sm text-foreground">{htmlCode}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="markdown" className="mt-4">
            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopy('markdown')}
              >
                {copiedTab === 'markdown' ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <pre className="rounded-lg bg-muted p-4 pr-24 overflow-x-auto">
                <code className="font-mono text-sm text-foreground">{markdownCode}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="react" className="mt-4">
            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopy('react')}
              >
                {copiedTab === 'react' ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <pre className="rounded-lg bg-muted p-4 pr-24 overflow-x-auto">
                <code className="font-mono text-sm text-foreground">{reactCode}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

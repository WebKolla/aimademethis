'use client'

import { useEffect, useState, useCallback } from 'react'
import { BarChart3, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getBadgeStats } from '@/lib/badges/actions'
import { toast } from 'sonner'

interface BadgeStatsProps {
  productId: string
}

interface Stats {
  totalClicks: number
  topReferrers: Array<{ domain: string; count: number }>
  period: string
}

/**
 * Badge Stats Component
 *
 * Displays badge click statistics and top referrers
 * Fetches data on mount and when product changes
 */
export function BadgeStats({ productId }: BadgeStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (showToast = false) => {
    setIsLoading(true)
    setError(null)

    const result = await getBadgeStats(productId)

    if ('error' in result) {
      setError(result.error || 'Failed to load statistics')
      setStats(null)
      if (showToast) {
        toast.error('Failed to refresh statistics')
      }
    } else {
      setStats({
        totalClicks: result.totalClicks,
        topReferrers: result.topReferrers,
        period: result.period,
      })
      if (showToast) {
        toast.success('Statistics refreshed successfully')
      }
    }

    setIsLoading(false)
  }, [productId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleRefresh = () => {
    fetchStats(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Badge Performance</CardTitle>
            <CardDescription>
              Track how your badge is being used
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : stats && (stats.totalClicks > 0 || stats.topReferrers.length > 0) ? (
          <div className="space-y-6">
            {/* Total Clicks */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stats.totalClicks.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">
                  clicks in last {stats.period}
                </span>
              </div>
            </div>

            {/* Top Referrers */}
            {stats.topReferrers.length > 0 && (
              <>
                <hr className="border-muted" />
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Top Referring Domains</h4>
                  <div className="space-y-2">
                    {stats.topReferrers.map((referrer, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-xs font-medium text-muted-foreground w-5 flex-shrink-0">
                            #{index + 1}
                          </span>
                          <span className="text-sm font-mono truncate">
                            {referrer.domain || 'Direct'}
                          </span>
                        </div>
                        <span className="text-sm font-semibold flex-shrink-0 ml-2">
                          {referrer.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">No clicks yet</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Share your badge on your website, README, or social media to start tracking engagement
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

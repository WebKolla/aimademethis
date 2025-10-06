export function ProductCardSkeleton() {
  return (
    <div className="h-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
      {/* Image skeleton */}
      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />

      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

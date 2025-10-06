# Task 004: Product Listing & Discovery

**Priority:** 🔴 Critical
**Estimated Time:** 5-7 hours
**Dependencies:** Task 001 (Database Setup), Task 003 (Product Submission)
**Status:** 📋 Not Started

---

## Overview

Create a comprehensive product listing page that displays all published AI products with sorting, filtering, and pagination. This is the main discovery page where users browse and explore products.

---

## Objectives

- [ ] Create product card component
- [ ] Build product grid/list layout
- [ ] Implement server-side pagination
- [ ] Add sorting options (newest, popular, trending)
- [ ] Display product metadata (votes, views, category)
- [ ] Add loading states and skeletons
- [ ] Create empty states
- [ ] Implement responsive design
- [ ] Add "Load More" or pagination controls
- [ ] Optimize database queries with indexes

---

## Prerequisites

- Task 001 (Database Setup) completed
- Task 003 (Product Submission) completed
- Products table has data
- TypeScript types generated

---

## Implementation Steps

### Step 1: Create Product Card Component

**File:** `components/products/product-card.tsx` (new file)

```typescript
import Link from "next/link";
import Image from "next/image";
import { ArrowUpIcon, MessageCircleIcon, BookmarkIcon, ExternalLinkIcon } from "lucide-react";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null } | null;
  votes_count?: number;
  comments_count?: number;
};

interface ProductCardProps {
  product: Product;
  showVotes?: boolean;
}

export function ProductCard({ product, showVotes = true }: ProductCardProps) {
  const {
    slug,
    name,
    tagline,
    image_url,
    pricing_type,
    view_count,
    categories,
    profiles,
    votes_count = 0,
    comments_count = 0,
  } = product;

  return (
    <Link href={`/products/${slug}`}>
      <div className="group h-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 transition-all hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg">
        {/* Product Image */}
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
          {image_url ? (
            <Image
              src={image_url}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <span className="text-4xl">🤖</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          {/* Title & Pricing */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-1">
              {name}
            </h3>
            {pricing_type && (
              <span className="inline-flex shrink-0 items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                {pricing_type === "free"
                  ? "Free"
                  : pricing_type === "freemium"
                  ? "Freemium"
                  : pricing_type === "paid"
                  ? "Paid"
                  : "Subscription"}
              </span>
            )}
          </div>

          {/* Tagline */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{tagline}</p>

          {/* Metadata */}
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 text-sm text-gray-500 dark:text-gray-500">
            {/* Category */}
            {categories && (
              <span className="inline-flex items-center gap-1">
                <span className="text-xs">📁</span>
                {categories.name}
              </span>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3">
              {showVotes && (
                <span className="inline-flex items-center gap-1">
                  <ArrowUpIcon className="h-4 w-4" />
                  {votes_count}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <MessageCircleIcon className="h-4 w-4" />
                {comments_count}
              </span>
            </div>
          </div>

          {/* Creator */}
          {profiles && (
            <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
              {profiles.avatar_url ? (
                <Image
                  src={profiles.avatar_url}
                  alt={profiles.username}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                by {profiles.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
```

### Step 2: Create Product List Component

**File:** `components/products/product-list.tsx` (new file)

```typescript
import { ProductCard } from "./product-card";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null } | null;
  votes_count?: number;
  comments_count?: number;
};

interface ProductListProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductList({ products, emptyMessage }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">
          {emptyMessage || "No products found"}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Check back later or adjust your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Step 3: Create Loading Skeleton Component

**File:** `components/products/product-card-skeleton.tsx` (new file)

```typescript
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
```

### Step 4: Create Sort and Filter Controls

**File:** `components/products/product-controls.tsx` (new file)

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "trending", label: "Trending" },
  { value: "most-viewed", label: "Most Viewed" },
];

export function ProductControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold">Discover AI Products</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Browse the latest AI-powered tools and applications
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
        <div className="flex gap-1">
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={currentSort === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Create Products Listing Page

**File:** `app/products/page.tsx` (new file)

```typescript
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProductList } from "@/components/products/product-list";
import { ProductListSkeleton } from "@/components/products/product-card-skeleton";
import { ProductControls } from "@/components/products/product-controls";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Discover AI Products | AIMadeThis",
  description: "Browse and discover the latest AI-powered tools and applications",
};

const PRODUCTS_PER_PAGE = 18;

interface ProductsPageProps {
  searchParams: {
    sort?: string;
    page?: string;
  };
}

async function ProductListWrapper({ sort, page }: { sort?: string; page?: string }) {
  const supabase = await createClient();
  const currentPage = parseInt(page || "1", 10);
  const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;

  // Build query based on sort parameter
  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories (name, slug),
      profiles (username, avatar_url)
    `,
      { count: "exact" }
    )
    .eq("status", "published");

  // Apply sorting
  switch (sort) {
    case "popular":
      // Sort by vote count (we'll calculate this with a separate query)
      query = query.order("created_at", { ascending: false }); // Fallback for now
      break;
    case "trending":
      // Sort by trending score (to be implemented in Task 012)
      query = query.order("created_at", { ascending: false }); // Fallback for now
      break;
    case "most-viewed":
      query = query.order("view_count", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // Apply pagination
  query = query.range(offset, offset + PRODUCTS_PER_PAGE - 1);

  const { data: products, error, count } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load products. Please try again.</p>
      </div>
    );
  }

  // For each product, get vote and comment counts
  const productsWithCounts = await Promise.all(
    (products || []).map(async (product) => {
      const [votesResult, commentsResult] = await Promise.all([
        supabase
          .from("votes")
          .select("id", { count: "exact", head: true })
          .eq("product_id", product.id),
        supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .eq("product_id", product.id),
      ]);

      return {
        ...product,
        votes_count: votesResult.count || 0,
        comments_count: commentsResult.count || 0,
      };
    })
  );

  const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <>
      <ProductList products={productsWithCounts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          {hasPrevPage && (
            <Link href={`/products?sort=${sort || "newest"}&page=${currentPage - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}

          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>

          {hasNextPage && (
            <Link href={`/products?sort=${sort || "newest"}&page=${currentPage + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <ProductControls />

      <Suspense fallback={<ProductListSkeleton />}>
        <ProductListWrapper sort={searchParams.sort} page={searchParams.page} />
      </Suspense>
    </div>
  );
}
```

### Step 6: Install Lucide React Icons

```bash
npm install lucide-react
```

### Step 7: Update Navbar with Products Link

**File:** `components/layout/navbar.tsx`

Add a "Products" link to the main navigation:

```typescript
// In the main nav section, add:
<Link
  href="/products"
  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
>
  Discover
</Link>
```

### Step 8: Optimize Database Queries

**In Supabase SQL Editor, run:**

```sql
-- Create index on products for faster sorting and filtering
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_view_count ON products(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_creator_id ON products(creator_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Create index on votes for faster counting
CREATE INDEX IF NOT EXISTS idx_votes_product_id ON votes(product_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- Create index on comments for faster counting
CREATE INDEX IF NOT EXISTS idx_comments_product_id ON comments(product_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
```

### Step 9: Add Vote Count View (Optional - Better Performance)

**For better performance, create a materialized view:**

```sql
-- Create a view that pre-calculates vote counts
CREATE MATERIALIZED VIEW IF NOT EXISTS product_stats AS
SELECT
  p.id AS product_id,
  COUNT(DISTINCT v.id) AS votes_count,
  COUNT(DISTINCT c.id) AS comments_count,
  COUNT(DISTINCT b.id) AS bookmarks_count
FROM products p
LEFT JOIN votes v ON p.id = v.product_id
LEFT JOIN comments c ON p.id = c.product_id
LEFT JOIN bookmarks b ON p.id = b.product_id
GROUP BY p.id;

-- Create index on the view
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_stats_product_id ON product_stats(product_id);

-- Refresh the view (you'll need to do this periodically or trigger it)
REFRESH MATERIALIZED VIEW product_stats;

-- Create a function to refresh the view
CREATE OR REPLACE FUNCTION refresh_product_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_stats;
END;
$$ LANGUAGE plpgsql;
```

Then update the query in `app/products/page.tsx`:

```typescript
// Instead of separate count queries, join with the view:
const { data: products, error, count } = await supabase
  .from("products")
  .select(
    `
    *,
    categories (name, slug),
    profiles (username, avatar_url),
    product_stats (votes_count, comments_count)
  `,
    { count: "exact" }
  )
  .eq("status", "published")
  .order("created_at", { ascending: false })
  .range(offset, offset + PRODUCTS_PER_PAGE - 1);
```

### Step 10: Test the Implementation

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Test product listing:**
   - Navigate to `/products`
   - Verify products display correctly
   - Check all metadata (votes, comments, category)
   - Verify creator information displays

3. **Test sorting:**
   - Click each sort option
   - Verify products reorder correctly
   - Check URL updates with sort parameter

4. **Test pagination:**
   - Submit more than 18 products
   - Verify pagination controls appear
   - Test Previous/Next buttons
   - Verify page number display

5. **Test responsive design:**
   - Check mobile layout (1 column)
   - Check tablet layout (2 columns)
   - Check desktop layout (3 columns)

6. **Test loading states:**
   - Observe skeleton loaders on page load
   - Check smooth transition to content

7. **Test empty state:**
   - Filter by a category with no products
   - Verify empty state message displays

---

## Testing Checklist

- [ ] Product cards display correctly
- [ ] Product images load or show placeholder
- [ ] Product metadata displays (votes, comments, views)
- [ ] Category displays correctly
- [ ] Creator info displays with avatar
- [ ] Pricing badge shows correct type
- [ ] Sorting works for all options
- [ ] Pagination works correctly
- [ ] Loading skeletons display
- [ ] Empty state displays when no products
- [ ] Responsive design works on all screen sizes
- [ ] Links to product detail pages work
- [ ] Database indexes improve query performance
- [ ] No console errors or warnings

---

## Performance Considerations

1. **Image Optimization:**
   - Use Next.js Image component for automatic optimization
   - Set appropriate image sizes
   - Use placeholder while loading

2. **Database Queries:**
   - Create indexes on frequently queried columns
   - Use materialized views for complex aggregations
   - Limit query results with pagination

3. **Server Components:**
   - Use Server Components for data fetching
   - Minimize client-side JavaScript
   - Use Suspense boundaries for progressive loading

4. **Caching:**
   - Consider implementing ISR (Incremental Static Regeneration)
   - Cache product stats separately
   - Revalidate on product updates

---

## Common Issues & Solutions

### Issue 1: Products not displaying
**Solution:**
- Check that products exist with status='published'
- Verify RLS policies allow public read
- Check console for query errors

### Issue 2: Vote/comment counts wrong
**Solution:**
- Verify votes and comments tables have data
- Check foreign key relationships
- Consider using materialized view for accuracy

### Issue 3: Images not loading
**Solution:**
- Verify image URLs are correct
- Check storage bucket is public
- Ensure CORS is configured correctly

### Issue 4: Slow page loads
**Solution:**
- Create database indexes
- Use materialized view for stats
- Implement proper pagination
- Optimize images

### Issue 5: Sort not working
**Solution:**
- Check search params are being read correctly
- Verify query order clause is correct
- Check URL updates on sort change

---

## Files Created/Modified

### Created:
- `components/products/product-card.tsx` - Individual product card
- `components/products/product-list.tsx` - Grid of product cards
- `components/products/product-card-skeleton.tsx` - Loading skeletons
- `components/products/product-controls.tsx` - Sort/filter controls
- `app/products/page.tsx` - Main products listing page

### Modified:
- `components/layout/navbar.tsx` - Add Products link

### Database:
- Created indexes for performance
- Created materialized view for stats (optional)

---

## Next Steps

After completing this task:
1. **Test with real data** - Add multiple products and test all features
2. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: implement product listing with sorting and pagination"
   ```
3. **Proceed to Task 005:** Product Detail Page

---

## Success Criteria

✅ Task is complete when:
1. Products display in a responsive grid
2. All product metadata is visible
3. Sorting works for all options
4. Pagination works correctly
5. Loading states work properly
6. Empty states display when needed
7. Performance is optimized with indexes
8. Mobile responsive design works
9. No TypeScript or build errors
10. All images load or show placeholders

---

**Estimated Time:** 5-7 hours
**Actual Time:** ___ hours
**Completed By:** ___________
**Completion Date:** ___________

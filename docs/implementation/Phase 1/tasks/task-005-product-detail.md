# Task 005: Product Detail Page

**Priority:** 🔴 Critical
**Estimated Time:** 6-8 hours
**Dependencies:** Task 001 (Database Setup), Task 003 (Product Submission)
**Status:** 📋 Not Started

---

## Overview

Create a comprehensive product detail page that displays complete information about an AI product, including images, description, creator information, metadata, and related products. This is where users land when they click on a product.

---

## Objectives

- [ ] Create dynamic route for product detail pages
- [ ] Display product header with image and basic info
- [ ] Show full description with markdown support
- [ ] Display creator profile card
- [ ] Show product statistics (views, votes, bookmarks)
- [ ] Add external links (website, demo, GitHub)
- [ ] Display product tags
- [ ] Show related products section
- [ ] Implement view count tracking
- [ ] Add share buttons
- [ ] Optimize for SEO with metadata

---

## Prerequisites

- Task 001 (Database Setup) completed
- Task 003 (Product Submission) completed
- Products exist in database
- TypeScript types generated

---

## Implementation Steps

### Step 1: Install Required Packages

```bash
# For markdown rendering
npm install react-markdown

# For syntax highlighting in markdown
npm install rehype-highlight rehype-raw remark-gfm
```

### Step 2: Create Product Actions for View Tracking

**File:** `lib/products/view-actions.ts` (new file)

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function incrementProductView(productId: string) {
  const supabase = await createClient();

  // Check if user has already viewed this product (using cookie)
  const cookieStore = cookies();
  const viewedProducts = cookieStore.get(`viewed_${productId}`);

  // Only increment if not viewed in this session
  if (!viewedProducts) {
    const { error } = await supabase.rpc("increment_product_views", {
      product_id: productId,
    });

    if (!error) {
      // Set cookie to prevent duplicate counting (expires in 24 hours)
      cookieStore.set(`viewed_${productId}`, "1", {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
      });
    }
  }
}
```

### Step 3: Create Database Function for View Increment

**In Supabase SQL Editor:**

```sql
-- Create function to safely increment view count
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET view_count = view_count + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 4: Create Product Detail Components

**File:** `components/products/product-header.tsx` (new file)

```typescript
import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon, GithubIcon, PlayCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductHeaderProps {
  product: Product;
  voteCount: number;
  bookmarkCount: number;
}

export function ProductHeader({ product, voteCount, bookmarkCount }: ProductHeaderProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 pb-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <span className="text-8xl">🤖</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          {/* Title & Tagline */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {product.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">{product.tagline}</p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-3">
            {/* Pricing Badge */}
            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-300">
              {product.pricing_type === "free"
                ? "Free"
                : product.pricing_type === "freemium"
                ? "Freemium"
                : product.pricing_type === "paid"
                ? "Paid"
                : "Subscription"}
            </span>

            {/* Stats */}
            <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-2 text-sm font-medium text-purple-800 dark:text-purple-300">
              ⬆️ {voteCount} {voteCount === 1 ? "vote" : "votes"}
            </span>

            <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-800 dark:text-blue-300">
              👁️ {product.view_count} {product.view_count === 1 ? "view" : "views"}
            </span>

            <span className="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/30 px-4 py-2 text-sm font-medium text-orange-800 dark:text-orange-300">
              🔖 {bookmarkCount} {bookmarkCount === 1 ? "bookmark" : "bookmarks"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={product.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full" size="lg">
                <ExternalLinkIcon className="mr-2 h-5 w-5" />
                Visit Website
              </Button>
            </a>

            <div className="grid gap-2 grid-cols-2">
              {product.demo_url && (
                <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <PlayCircleIcon className="mr-2 h-4 w-4" />
                    Try Demo
                  </Button>
                </a>
              )}

              {product.github_url && (
                <a href={product.github_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <GithubIcon className="mr-2 h-4 w-4" />
                    View Code
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Pricing Details */}
          {product.pricing_details && (
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                💰 {product.pricing_details}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**File:** `components/products/product-description.tsx` (new file)

```typescript
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      >
        {description}
      </ReactMarkdown>
    </div>
  );
}
```

**File:** `components/products/product-creator-card.tsx` (new file)

```typescript
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProductCreatorCardProps {
  creator: Profile;
  productCount?: number;
}

export function ProductCreatorCard({ creator, productCount = 0 }: ProductCreatorCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
      <h3 className="text-lg font-semibold mb-4">About the Creator</h3>

      <div className="space-y-4">
        {/* Creator Avatar & Info */}
        <div className="flex items-start gap-4">
          {creator.avatar_url ? (
            <Image
              src={creator.avatar_url}
              alt={creator.username}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl">
              👤
            </div>
          )}

          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {creator.full_name || creator.username}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">@{creator.username}</p>
          </div>
        </div>

        {/* Bio */}
        {creator.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{creator.bio}</p>
        )}

        {/* Stats */}
        <div className="flex gap-4 text-sm border-t border-gray-100 dark:border-gray-800 pt-4">
          <div>
            <span className="font-semibold text-gray-900 dark:text-white">{productCount}</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">
              {productCount === 1 ? "Product" : "Products"}
            </span>
          </div>
        </div>

        {/* Social Links */}
        {(creator.twitter_handle || creator.website_url) && (
          <div className="flex gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
            {creator.website_url && (
              <a href={creator.website_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  🌐 Website
                </Button>
              </a>
            )}
            {creator.twitter_handle && (
              <a
                href={`https://twitter.com/${creator.twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  🐦 Twitter
                </Button>
              </a>
            )}
          </div>
        )}

        {/* View Profile Button */}
        <Link href={`/profile/${creator.username}`} className="block">
          <Button variant="outline" className="w-full">
            View Full Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
```

**File:** `components/products/product-tags.tsx` (new file)

```typescript
import Link from "next/link";

interface ProductTagsProps {
  tags: Array<{ id: string; name: string; slug: string }>;
}

export function ProductTags({ tags }: ProductTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
      <h3 className="text-lg font-semibold mb-4">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/tags/${tag.slug}`}>
            <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-2 text-sm font-medium text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer">
              #{tag.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

**File:** `components/products/related-products.tsx` (new file)

```typescript
import { ProductCard } from "./product-card";
import type { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  categories: { name: string; slug: string } | null;
  profiles: { username: string; avatar_url: string | null } | null;
  votes_count?: number;
  comments_count?: number;
};

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-12 mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Step 5: Create Product Detail Page

**File:** `app/products/[slug]/page.tsx` (new file)

```typescript
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductHeader } from "@/components/products/product-header";
import { ProductDescription } from "@/components/products/product-description";
import { ProductCreatorCard } from "@/components/products/product-creator-card";
import { ProductTags } from "@/components/products/product-tags";
import { RelatedProducts } from "@/components/products/related-products";
import { incrementProductView } from "@/lib/products/view-actions";
import type { Metadata } from "next";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("name, tagline, image_url, description")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | AIMadeThis`,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: product.image_url ? [product.image_url] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.tagline,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient();

  // Fetch product with relations
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (id, name, slug),
      profiles (*)
    `
    )
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (error || !product) {
    notFound();
  }

  // Fetch product tags
  const { data: productTags } = await supabase
    .from("product_tags")
    .select("tags (id, name, slug)")
    .eq("product_id", product.id);

  const tags =
    productTags?.map((pt) => (pt.tags as { id: string; name: string; slug: string })) || [];

  // Fetch product stats
  const [votesResult, bookmarksResult, commentsResult] = await Promise.all([
    supabase
      .from("votes")
      .select("id", { count: "exact", head: true })
      .eq("product_id", product.id),
    supabase
      .from("bookmarks")
      .select("id", { count: "exact", head: true })
      .eq("product_id", product.id),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("product_id", product.id),
  ]);

  const voteCount = votesResult.count || 0;
  const bookmarkCount = bookmarksResult.count || 0;
  const commentCount = commentsResult.count || 0;

  // Fetch creator's product count
  const { count: creatorProductCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("creator_id", product.creator_id)
    .eq("status", "published");

  // Fetch related products (same category, exclude current)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (name, slug),
      profiles (username, avatar_url)
    `
    )
    .eq("category_id", product.category_id)
    .eq("status", "published")
    .neq("id", product.id)
    .limit(3);

  // Get vote/comment counts for related products
  const relatedWithCounts = await Promise.all(
    (relatedProducts || []).map(async (rp) => {
      const [votes, comments] = await Promise.all([
        supabase
          .from("votes")
          .select("id", { count: "exact", head: true })
          .eq("product_id", rp.id),
        supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .eq("product_id", rp.id),
      ]);

      return {
        ...rp,
        votes_count: votes.count || 0,
        comments_count: comments.count || 0,
      };
    })
  );

  // Increment view count (async, don't await)
  incrementProductView(product.id);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <ProductHeader product={product} voteCount={voteCount} bookmarkCount={bookmarkCount} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Description & Tags */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">About {product.name}</h2>
              <ProductDescription description={product.description} />
            </div>

            <ProductTags tags={tags} />
          </div>

          {/* Right Column - Creator Card */}
          <div className="lg:col-span-1">
            {product.profiles && (
              <ProductCreatorCard
                creator={product.profiles as never}
                productCount={creatorProductCount || 0}
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts products={relatedWithCounts} />
      </div>
    </div>
  );
}

// Generate static params for static site generation (optional)
export async function generateStaticParams() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "published")
    .limit(100);

  return (products || []).map((product) => ({
    slug: product.slug,
  }));
}
```

### Step 6: Create 404 Not Found Page for Products

**File:** `app/products/[slug]/not-found.tsx` (new file)

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="mx-auto max-w-md">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products">
            <Button>Browse All Products</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Step 7: Add Highlight.js Styles to Global CSS

**File:** `app/globals.css`

Add at the bottom:

```css
/* Markdown code block styling */
.prose pre {
  @apply bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto;
}

.prose code {
  @apply text-sm;
}

.prose p {
  @apply mb-4;
}

.prose h2 {
  @apply text-2xl font-bold mt-8 mb-4;
}

.prose h3 {
  @apply text-xl font-semibold mt-6 mb-3;
}

.prose ul,
.prose ol {
  @apply mb-4 ml-6;
}

.prose li {
  @apply mb-2;
}

.prose a {
  @apply text-purple-600 dark:text-purple-400 hover:underline;
}
```

### Step 8: Test the Implementation

1. **Create test product:**
   - Go to `/products/new`
   - Create a product with detailed description
   - Use markdown in description (headings, lists, links, code blocks)
   - Add multiple tags

2. **Test product detail page:**
   - Navigate to the product's detail page
   - Verify all sections display correctly
   - Check image loads
   - Verify external links work
   - Check creator card displays
   - Verify tags are clickable

3. **Test view tracking:**
   - Visit product page
   - Check view count increments
   - Refresh page - view count should NOT increment again (cookie)
   - Wait 24 hours or clear cookies - should increment again

4. **Test SEO metadata:**
   - View page source
   - Check meta tags are present
   - Test Open Graph preview
   - Test Twitter Card preview

5. **Test related products:**
   - Create multiple products in same category
   - Verify related products section appears
   - Check correct products are shown

---

## Testing Checklist

- [ ] Product detail page displays correctly
- [ ] Product image loads or shows placeholder
- [ ] All metadata displays (pricing, votes, views, bookmarks)
- [ ] External links work (website, demo, GitHub)
- [ ] Description renders with markdown
- [ ] Code blocks in description have syntax highlighting
- [ ] Tags display and are clickable
- [ ] Creator card shows correct information
- [ ] Creator card links to profile page
- [ ] Related products section appears
- [ ] View count increments correctly
- [ ] View tracking respects 24-hour cookie
- [ ] SEO metadata is correct
- [ ] Open Graph tags work
- [ ] Twitter Card tags work
- [ ] 404 page displays for invalid slugs
- [ ] Responsive design works on all screen sizes

---

## Common Issues & Solutions

### Issue 1: Markdown not rendering
**Solution:**
- Verify react-markdown is installed
- Check rehype/remark plugins are imported
- Ensure description content is valid markdown

### Issue 2: Code blocks not highlighted
**Solution:**
- Import highlight.js CSS
- Verify rehype-highlight plugin is added
- Check that code blocks use proper markdown syntax

### Issue 3: View count not incrementing
**Solution:**
- Verify database function exists
- Check cookie is being set correctly
- Ensure RPC call is successful

### Issue 4: Related products not showing
**Solution:**
- Verify products exist in same category
- Check limit and filters in query
- Ensure status is 'published'

### Issue 5: SEO metadata not showing
**Solution:**
- Check generateMetadata function is exported
- Verify product data is fetched correctly
- Check meta tags in page source

---

## Files Created/Modified

### Created:
- `lib/products/view-actions.ts` - View tracking server action
- `components/products/product-header.tsx` - Product header component
- `components/products/product-description.tsx` - Markdown description
- `components/products/product-creator-card.tsx` - Creator info card
- `components/products/product-tags.tsx` - Tag display
- `components/products/related-products.tsx` - Related products section
- `app/products/[slug]/page.tsx` - Product detail page
- `app/products/[slug]/not-found.tsx` - 404 page

### Modified:
- `app/globals.css` - Added markdown/code styling

### Database:
- Created `increment_product_views` function

---

## Next Steps

After completing this task:
1. **Test thoroughly** - Try various products, markdown content, edge cases
2. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: implement product detail page with view tracking and SEO"
   ```
3. **Proceed to Task 006:** Search & Filtering

---

## Success Criteria

✅ Task is complete when:
1. Product detail pages display all information correctly
2. Markdown rendering works with syntax highlighting
3. View tracking increments correctly
4. SEO metadata is optimized
5. Related products section works
6. Creator card displays correctly
7. All external links work
8. 404 page handles invalid products
9. Responsive design works on all devices
10. No TypeScript or build errors

---

**Estimated Time:** 6-8 hours
**Actual Time:** ___ hours
**Completed By:** ___________
**Completion Date:** ___________

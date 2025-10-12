# AIMMT - Comprehensive SEO Action Plan

**Last Updated:** January 12, 2025
**Status:** Ready for Implementation
**Expected Impact:** High - Will improve search rankings for AI product discovery keywords

---

## Executive Summary

This document outlines a complete SEO strategy for AIMMT (AI Made Me This) to achieve prominent rankings for AI product discovery keywords. The plan covers technical SEO, on-page optimization, structured data, content strategy, and modern SEO techniques.

### Current State Assessment

✅ **What's Already Good:**
- Google Analytics integrated (G-W3SCH7MBQG)
- Dynamic sitemap.ts with hourly revalidation
- robots.txt properly configured
- Basic JSON-LD schemas (Website, Organization) in root layout
- Individual product pages have generateMetadata
- Open Graph and Twitter Card tags on root layout
- Next.js App Router with SSR/SSG capabilities

⚠️ **Critical Gaps:**
- Client-side pages lack metadata (homepage, products listing, trending, about)
- Missing Product, Review, Rating, BreadcrumbList schemas
- No FAQ schema despite FAQ content existing
- Insufficient keyword optimization in content
- No internal linking strategy
- Product pages missing review/rating aggregation schema

### Target Keywords

**Primary Keywords:**
- "AI product directory"
- "AI tools discovery"
- "best AI products"
- "AI product showcase"
- "discover AI tools"
- "AI product reviews"
- "trending AI products"
- "SAAS product directory"
- "Product hunt"

**Long-tail Keywords:**
- "submit AI product free"
- "find best AI tools 2025"
- "AI product comparison platform"
- "review AI products"
- "AI tool recommendations"
- "Submit SAAS product to directory" 

---

## Priority 1: Critical SEO Fixes (Impact: High, Effort: Low)

### Task 1.1: Add Metadata to Client-Side Pages

**Priority:** CRITICAL
**Estimated Time:** 30 minutes
**Impact:** High - These are major landing pages

#### Files to Update:

**1. Homepage (`app/page.tsx`)**

Currently a server component with no metadata export. Convert to export metadata:

```typescript
// Add at the top of app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIMMT - AI Made Me This | Discover the Best AI Products & Tools",
  description: "Explore, share, and discover innovative AI products created by developers worldwide. Find trending AI tools, read reviews, and connect with the AI community.",
  keywords: [
    "AI products",
    "AI tools",
    "AI directory",
    "discover AI",
    "AI product discovery",
    "trending AI tools",
    "AI product reviews",
    "best AI products 2025",
    "AI tool marketplace",
    "AI innovation",
    "SAAS product directory",
    "Product hunt",
  ],
  openGraph: {
    title: "AIMMT - Discover the Best AI Products & Tools",
    description: "Explore trending AI products, read authentic reviews, and connect with innovators building the future of AI.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AIMMT - AI Product Discovery Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIMMT - Discover the Best AI Products & Tools",
    description: "Explore trending AI products, read authentic reviews, and connect with innovators.",
    images: ["/og-image.png"],
  },
};
```

**2. Products Listing (`app/products/page.tsx`)**

Client component - needs to be split or converted to server wrapper. Create a server wrapper:

```typescript
// Create app/products/page.tsx (server component)
import type { Metadata } from "next";
import { ProductsPageClient } from "./products-page-client";

export const metadata: Metadata = {
  title: "Browse AI Products | AIMMT - AI Product Directory",
  description: "Discover hundreds of AI products and tools. Filter by category, pricing, AI models, and more. Find the perfect AI solution for your needs.",
  keywords: [
    "AI products",
    "AI tools directory",
    "browse AI products",
    "AI tool finder",
    "search AI tools",
    "AI product catalog",
    "filter AI products",
    "Submit SAAS product to directory" 
  ],
  openGraph: {
    title: "Browse AI Products | AIMMT",
    description: "Discover hundreds of innovative AI products. Advanced filtering and search.",
    type: "website",
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}

// Rename current app/products/page.tsx to products-page-client.tsx
```

**3. Trending Page (`app/trending/page.tsx`)**

Already has Suspense wrapper - add metadata export:

```typescript
// Add to app/trending/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending AI Products | AIMMT - What's Hot in AI",
  description: "Discover trending AI products based on community engagement, recent launches, and popularity. See what's hot in the AI world right now.",
  keywords: [
    "trending AI products",
    "popular AI tools",
    "hot AI products",
    "AI trends",
    "latest AI tools",
    "most popular AI",
    "trending SaaS products",
    "popular SaaS tools",
  ],
  openGraph: {
    title: "Trending AI Products | AIMMT",
    description: "See what's trending in AI - based on community votes, engagement, and recency.",
    type: "website",
  },
};
```

**4. Categories Page (`app/categories/page.tsx`)**

Already has metadata but it's basic. Enhance it:

```typescript
// Update app/categories/page.tsx metadata
export const metadata = {
  title: "AI Product Categories | AIMMT - Browse by Category",
  description: "Explore AI products organized by categories including Productivity, Creative Tools, Development, Marketing, Data Analysis, and more. Find AI tools by use case.",
  keywords: [
    "AI categories",
    "AI tools by category",
    "productivity AI",
    "creative AI tools",
    "AI for developers",
    "marketing AI tools",
    "SaaS categories",
    "SaaS tools by category",
  ],
  openGraph: {
    title: "Browse AI Products by Category | AIMMT",
    description: "Explore AI products organized by categories. Find the perfect AI tool for your use case.",
    type: "website",
  },
};
```

---

### Task 1.2: Add Product Schema to Product Detail Pages

**Priority:** CRITICAL
**Estimated Time:** 1 hour
**Impact:** High - Rich snippets in Google search results

#### Implementation:

**File:** `app/products/[slug]/page.tsx`

Add Product schema with aggregated ratings and reviews to each product page:

```typescript
// Add after the existing metadata generation (around line 56)

// Generate Product JSON-LD Schema
function generateProductSchema(product: Product, aggregateRating?: { ratingValue: number; reviewCount: number }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.tagline,
    image: product.image_url || undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: product.profiles?.username || "Unknown",
    },
    offers: {
      "@type": "Offer",
      price: product.pricing_type === "free" ? "0" : undefined,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: product.website_url || undefined,
    },
  };

  // Add aggregate rating if available
  if (aggregateRating && aggregateRating.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

// In the component, fetch aggregate rating data
async function getAggregateRating(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("status", "published");

  if (error || !data || data.length === 0) {
    return null;
  }

  const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / data.length;

  return {
    ratingValue: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount: data.length,
  };
}

// Then in the JSX, add the schema script tag
// Inside the main component, after fetching product:
const aggregateRating = await getAggregateRating(product.id);
const productSchema = generateProductSchema(product, aggregateRating || undefined);

// In the return JSX (before closing </div>):
<Script
  id="product-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(productSchema),
  }}
/>
```

**Required Import:**
```typescript
import Script from "next/script";
```

---

### Task 1.3: Add BreadcrumbList Schema

**Priority:** HIGH
**Estimated Time:** 45 minutes
**Impact:** Medium - Better navigation in search results

#### Implementation:

**File:** `app/products/[slug]/page.tsx`

Add breadcrumb schema for product pages:

```typescript
// Add breadcrumb schema generator
function generateBreadcrumbSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.categories?.name || "Category",
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'}/products?category=${product.categories?.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com'}/products/${product.slug}`,
      },
    ],
  };
}

// Add to JSX along with product schema
<Script
  id="breadcrumb-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(generateBreadcrumbSchema(product)),
  }}
/>
```

Also add **visual breadcrumbs** to the UI for better UX:

```typescript
// Add breadcrumb component in the JSX (near the top of product page)
<nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
  <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
    <li>
      <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">
        Home
      </Link>
    </li>
    <li>/</li>
    <li>
      <Link href="/products" className="hover:text-emerald-600 dark:hover:text-emerald-400">
        Products
      </Link>
    </li>
    <li>/</li>
    {product.categories && (
      <>
        <li>
          <Link
            href={`/products?category=${product.categories.slug}`}
            className="hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            {product.categories.name}
          </Link>
        </li>
        <li>/</li>
      </>
    )}
    <li className="font-medium text-slate-900 dark:text-slate-100 truncate">
      {product.name}
    </li>
  </ol>
</nav>
```

---

### Task 1.4: Add Review Schema to Product Pages

**Priority:** HIGH
**Estimated Time:** 1 hour
**Impact:** High - Shows star ratings in search results

#### Implementation:

**File:** `app/products/[slug]/page.tsx`

Add individual review schemas for each published review:

```typescript
// Generate review schemas
async function getReviewSchemas(productId: string, productSlug: string) {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      profiles:user_id (
        username,
        full_name
      )
    `)
    .eq("product_id", productId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(10); // Limit to 10 most recent reviews

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: productSlug,
    },
    author: {
      "@type": "Person",
      name: review.profiles?.full_name || review.profiles?.username || "Anonymous",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.comment,
    datePublished: review.created_at,
  }));
}

// In component:
const reviewSchemas = await getReviewSchemas(product.id, product.name);

// In JSX:
{reviewSchemas && reviewSchemas.map((schema, index) => (
  <Script
    key={`review-schema-${index}`}
    id={`review-schema-${index}`}
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(schema),
    }}
  />
))}
```

---

### Task 1.5: Add FAQ Schema to Contact Page

**Priority:** MEDIUM
**Estimated Time:** 30 minutes
**Impact:** Medium - Rich snippets with dropdown FAQs

#### Implementation:

**File:** `app/contact/page.tsx`

The contact page already has FAQs. Add schema:

```typescript
// Add to the contact page component (it's client-side, so we need a different approach)
// Create a server component wrapper

// Create app/contact/page.tsx (new server wrapper)
import type { Metadata } from "next";
import Script from "next/script";
import { ContactPageClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Us | AIMMT - Get in Touch",
  description: "Have questions, feedback, or ideas? Contact the AIMMT team. We typically respond within 24-48 hours.",
  openGraph: {
    title: "Contact AIMMT | Get Support",
    description: "Send us a message and we'll get back to you within 24-48 hours.",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does it take to get a response?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We typically respond to all inquiries within 24-48 hours during business days.",
      },
    },
    {
      "@type": "Question",
      name: "Can I suggest a new feature?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! We love hearing ideas from our community. Use the contact form to share your suggestions.",
      },
    },
    {
      "@type": "Question",
      name: "How do I report a bug?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Please use the contact form and select 'Bug Report' as the subject. Include as much detail as possible.",
      },
    },
    {
      "@type": "Question",
      name: "Can I advertise on AIMMT?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AIMMT offers a generous free tier with premium plans for advanced features. We remain ad-free and focus on organic, community-driven discovery.",
      },
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <ContactPageClient />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}

// Rename current contact/page.tsx to contact-client.tsx and mark with "use client"
```

---

## Priority 2: Content Optimization (Impact: High, Effort: Medium)

### Task 2.1: Homepage Content Enhancement

**Priority:** HIGH
**Estimated Time:** 1 hour
**Impact:** High - Better keyword targeting

#### Current Issue:
Homepage is primarily visual with minimal SEO-rich content.

#### Solution:
Add an SEO-optimized content section below the hero:

```typescript
// Add to app/_components/home-page-client.tsx (after hero section, before features)

<section className="py-16 bg-white dark:bg-slate-900">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
      <h2 className="text-3xl font-bold text-center mb-8">
        The Ultimate AI Product Discovery Platform
      </h2>

      <div className="space-y-6 text-lg text-slate-700 dark:text-slate-300">
        <p>
          <strong>AIMMT (AI Made Me This)</strong> is the premier platform for discovering,
          sharing, and reviewing <strong>AI products and SaaS tools</strong>. Whether you're searching for
          <strong> AI productivity tools</strong>, <strong>creative AI applications</strong>,
          or <strong>developer AI solutions</strong>, our community-driven <strong>SaaS product directory</strong> helps
          you find exactly what you need.
        </p>

        <p>
          Explore thousands of <strong>AI and SaaS products</strong> curated by developers and innovators
          worldwide. Our transparent <strong>trending algorithm</strong> surfaces the best AI tools
          based on real community engagement—no paid promotions, just genuine user feedback.
          <strong> Submit your SaaS product to our directory</strong> for free and reach thousands of potential users.
        </p>

        <div className="grid md:grid-cols-3 gap-6 my-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Discover AI & SaaS Tools
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Search and filter through hundreds of AI and SaaS products by category, pricing,
              and technology stack. Browse our comprehensive SaaS product directory.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Read Authentic Reviews
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Make informed decisions with genuine user reviews and 5-star ratings
              from the AI community.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Showcase Your Product
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Submit your AI or SaaS product to our directory for free and reach thousands of potential users
              actively searching for solutions. Easy SaaS product submission process.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-12 mb-4">
          Why Choose AIMMT for AI & SaaS Product Discovery?
        </h3>

        <ul className="space-y-3">
          <li>
            ✅ <strong>Free to start</strong> - Submit unlimited AI and SaaS products on our free tier
          </li>
          <li>
            ✅ <strong>Fair rankings</strong> - Algorithm-based trending, not pay-to-win, just like Product Hunt
          </li>
          <li>
            ✅ <strong>Active community</strong> - Thousands of AI enthusiasts and SaaS builders
          </li>
          <li>
            ✅ <strong>Advanced filtering</strong> - Find AI and SaaS tools by use case, pricing, and tech stack
          </li>
          <li>
            ✅ <strong>Detailed insights</strong> - See what AI models and technologies products use
          </li>
          <li>
            ✅ <strong>Alternative to Product Hunt</strong> - Focused specifically on AI and SaaS products
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

---

### Task 2.2: Category Page Descriptions

**Priority:** MEDIUM
**Estimated Time:** 2 hours
**Impact:** Medium - Better category page rankings

#### Implementation:

Add rich descriptions to each category page. Update the database:

```sql
-- Update categories table to add SEO descriptions
UPDATE categories
SET description = CASE slug
  WHEN 'productivity' THEN 'Discover AI-powered productivity tools that help you work smarter and faster. From task management to automation, find AI solutions that boost efficiency.'
  WHEN 'creative-tools' THEN 'Explore creative AI tools for design, video editing, content creation, and more. Unleash your creativity with AI-powered creative applications.'
  WHEN 'development' THEN 'Browse AI tools for developers including code assistants, debugging tools, API platforms, and development automation solutions.'
  WHEN 'marketing' THEN 'Find AI marketing tools for SEO, content marketing, social media, analytics, and campaign automation. Grow your business with AI-powered marketing.'
  WHEN 'data-analysis' THEN 'Discover AI data analysis tools for business intelligence, data visualization, predictive analytics, and automated reporting.'
  -- Add more categories as needed
END
WHERE slug IN ('productivity', 'creative-tools', 'development', 'marketing', 'data-analysis');
```

Then display these descriptions on the categories page and individual category filtered views.

---

### Task 2.3: Add Category-Specific Landing Pages (Optional)

**Priority:** LOW
**Estimated Time:** 4 hours
**Impact:** Medium-High - Capture long-tail category searches

#### Implementation:

Create dedicated landing pages for each major category:

```
app/categories/[slug]/page.tsx
```

Each page would have:
- Category-specific hero section
- SEO-optimized content about that category
- Product grid filtered to that category
- Related categories
- FAQ specific to that category

Example metadata for productivity category:

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;

  const categoryMeta = {
    'productivity': {
      title: 'AI Productivity Tools | AIMMT - Boost Efficiency with AI',
      description: 'Discover the best AI productivity tools and apps. Task automation, scheduling assistants, note-taking AI, and more to supercharge your workflow.',
      keywords: ['AI productivity tools', 'AI task management', 'productivity AI apps', 'work automation AI'],
    },
    // Add more categories...
  };

  return categoryMeta[slug] || {};
}
```

---

## Priority 3: Technical SEO (Impact: Medium, Effort: Medium)

### Task 3.1: Optimize Core Web Vitals

**Priority:** MEDIUM
**Estimated Time:** 2-3 hours
**Impact:** Medium - Better rankings, better UX

#### Actions:

1. **Optimize Images:**
   - All images already use Next.js Image component ✅
   - Add `priority` prop to above-the-fold images
   - Consider converting to WebP format in Supabase Storage

2. **Reduce JavaScript Bundle Size:**
   - Analyze bundle with: `npm run build` and check output
   - Consider lazy loading Framer Motion animations
   - Review if all dependencies are necessary

3. **Improve Largest Contentful Paint (LCP):**
   - Add `priority` to hero images:
   ```typescript
   <Image
     src={heroImage}
     alt="Hero"
     priority  // Add this
     // ... other props
   />
   ```

4. **Optimize Fonts:**
   - Already using `next/font/google` with `display: swap` ✅
   - No action needed

5. **Add loading states:**
   - Use React Suspense for async components ✅ (already done for most pages)
   - Add skeleton loaders for product grids

---

### Task 3.2: Implement Internal Linking Strategy

**Priority:** HIGH
**Estimated Time:** 2 hours
**Impact:** High - Better crawlability and page authority distribution

#### Strategy:

1. **Footer Links:**
   - Add "Popular Categories" section in footer with top 5 categories
   - Add "Trending Products" section with top 3 trending products (updated daily)

2. **Related Products:**
   - On product pages, add "Similar Products" section (same category)
   - Add "You May Also Like" (based on tags)

3. **Contextual Links:**
   - In category pages, link to related categories
   - In product descriptions, auto-link to category/tag pages when mentioned

4. **Breadcrumbs:**
   - Already planned in Task 1.3 ✅

#### Implementation Example:

**Footer Enhancement (`components/layout/footer.tsx`):**

```typescript
// Fetch popular categories and trending products
async function getFooterData() {
  const supabase = await createClient();

  // Get top 5 categories by product count
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name, products(count)")
    .order("products.count", { ascending: false })
    .limit(5);

  // Get top 3 trending products
  const { data: products } = await supabase
    .from("products")
    .select("slug, name")
    .order("trending_score", { ascending: false })
    .limit(3);

  return { categories, products };
}

// Add to footer JSX
<div className="space-y-4">
  <h3 className="text-lg font-semibold">Popular Categories</h3>
  <ul className="space-y-2">
    {categories.map((cat) => (
      <li key={cat.slug}>
        <Link href={`/products?category=${cat.slug}`} className="text-slate-400 hover:text-emerald-400">
          {cat.name}
        </Link>
      </li>
    ))}
  </ul>
</div>
```

---

### Task 3.3: Add Canonical URLs to All Pages

**Priority:** MEDIUM
**Estimated Time:** 30 minutes
**Impact:** Medium - Prevent duplicate content issues

#### Implementation:

Root layout already has canonical URL setup via `metadataBase` ✅. Verify it's working correctly and add explicit canonical tags where needed.

For pages with query parameters (like filtered product listings), add canonical to the base URL:

```typescript
// In metadata for products page
export const metadata: Metadata = {
  // ... other metadata
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products`,
  },
};
```

---

### Task 3.4: Implement Pagination with rel="next/prev"

**Priority:** LOW
**Estimated Time:** 1 hour
**Impact:** Low-Medium - Better handling of paginated content

#### Implementation (if/when pagination is added):

```typescript
// Add to metadata for paginated pages
export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }): Promise<Metadata> {
  const page = parseInt(searchParams.page || '1');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aimademethis.com';

  return {
    // ... other metadata
    alternates: {
      canonical: `${baseUrl}/products?page=${page}`,
    },
    // Note: Next.js doesn't have built-in prev/next support in App Router yet
    // Consider using Link headers instead
  };
}
```

---

## Priority 4: Advanced SEO (Impact: Medium, Effort: High)

### Task 4.1: Add ItemList Schema for Product Listings

**Priority:** LOW
**Estimated Time:** 1 hour
**Impact:** Medium - Better representation in search

#### Implementation:

**File:** `app/products/page.tsx` (server wrapper)

```typescript
// Generate ItemList schema for products page
function generateItemListSchema(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.tagline,
        image: product.image_url,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      },
    })),
  };
}
```

---

### Task 4.2: Implement Local SEO (if applicable)

**Priority:** LOW
**Estimated Time:** 30 minutes
**Impact:** Low - Only if targeting local searches

#### Implementation:

If AIMMT has a physical presence or targets specific regions, add LocalBusiness schema:

```typescript
// Add to root layout.tsx
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://aimademethis.com/#organization",
  name: "AIMMT (AI Made Me This)",
  description: "AI Product Discovery Platform",
  url: "https://aimademethis.com",
  // Only if you have a physical location:
  // address: {
  //   "@type": "PostalAddress",
  //   addressCountry: "US",
  // },
}
```

For now, **skip this** unless there's a physical presence or specific geo-targeting need.

---

### Task 4.3: Add Article Schema for Blog Posts (Future)

**Priority:** LOW (Not applicable yet)
**Estimated Time:** 1 hour when blog is added
**Impact:** Medium - Rich snippets for blog content

#### Implementation:

When/if a blog is added (`app/blog/[slug]/page.tsx`):

```typescript
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: {
    "@type": "Person",
    name: post.author.name,
  },
  publisher: {
    "@type": "Organization",
    name: "AIMMT",
    logo: {
      "@type": "ImageObject",
      url: "https://aimademethis.com/logo.png",
    },
  },
};
```

---

## Priority 5: Monitoring & Maintenance

### Task 5.1: Set Up Google Search Console

**Priority:** HIGH
**Estimated Time:** 30 minutes
**Impact:** High - Required for monitoring

#### Steps:

1. User needs to provide the verification code
2. Add to environment variables:
   ```bash
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-code-here
   ```
3. Deploy to Vercel
4. Verify in Google Search Console
5. Submit sitemap: `https://aimademethis.com/sitemap.xml`

**Already documented in:** `docs/GOOGLE_ANALYTICS_SEARCH_CONSOLE.md`

---

### Task 5.2: Monitor SEO Performance

**Priority:** MEDIUM
**Estimated Time:** Ongoing
**Impact:** High - Continuous improvement

#### Weekly Checklist:

- [ ] Check Google Search Console for:
  - New keywords ranking
  - Click-through rates
  - Crawl errors
  - Coverage issues
- [ ] Monitor Google Analytics:
  - Organic traffic trends
  - Top landing pages
  - Bounce rates
  - Conversion rates
- [ ] Review Core Web Vitals in Search Console
- [ ] Check for broken links (use Screaming Frog or similar)

---

### Task 5.3: Create XML Sitemap for Images (Optional)

**Priority:** LOW
**Estimated Time:** 1 hour
**Impact:** Low - Better image SEO

#### Implementation:

**File:** Create `app/image-sitemap.xml/route.ts`

```typescript
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("slug, name, image_url, updated_at")
    .eq("status", "published")
    .not("image_url", "is", null);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${products
  ?.map(
    (product) => `
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}</loc>
    <image:image>
      <image:loc>${product.image_url}</image:loc>
      <image:title>${product.name}</image:title>
    </image:image>
  </url>`
  )
  .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
```

Reference this in robots.txt:
```
Sitemap: https://aimademethis.com/image-sitemap.xml
```

---

## Implementation Timeline

### Week 1: Critical Fixes
- ✅ Task 1.1: Add metadata to client pages (30 min)
- ✅ Task 1.2: Product schema (1 hour)
- ✅ Task 1.3: Breadcrumb schema (45 min)
- ✅ Task 1.4: Review schema (1 hour)
- ✅ Task 1.5: FAQ schema (30 min)
- ✅ Task 5.1: Set up Google Search Console (30 min)

**Total Week 1:** ~4.5 hours

### Week 2: Content & Technical
- ✅ Task 2.1: Homepage content (1 hour)
- ✅ Task 2.2: Category descriptions (2 hours)
- ✅ Task 3.1: Core Web Vitals (2-3 hours)
- ✅ Task 3.2: Internal linking (2 hours)
- ✅ Task 3.3: Canonical URLs (30 min)

**Total Week 2:** ~7.5 hours

### Week 3: Advanced & Monitoring
- ✅ Task 4.1: ItemList schema (1 hour)
- ✅ Task 5.2: Set up monitoring routines (1 hour)
- ✅ Review and test all implementations

**Total Week 3:** ~2 hours

### Week 4: Optional Enhancements
- ⏳ Task 2.3: Category landing pages (4 hours) - Optional
- ⏳ Task 4.3: Article schema (when blog is added)
- ⏳ Task 5.3: Image sitemap (1 hour) - Optional

---

## Success Metrics

### Short-term (1-2 months):
- Google Search Console shows 0 crawl errors
- All major pages indexed
- Average position for target keywords improves by 20%
- Organic click-through rate increases by 15%

### Medium-term (3-6 months):
- Rank on first page for 5+ primary keywords
- 50% increase in organic traffic
- Featured snippets appear for FAQ content
- Product pages show rich snippets with ratings

### Long-term (6-12 months):
- Rank in top 3 for "AI product directory" and similar terms
- 200%+ increase in organic traffic
- Establish as authority site for AI product discovery
- 10,000+ monthly organic visitors

---

## Tools & Resources

### Required Tools:
- ✅ Google Analytics (already set up)
- ✅ Google Search Console (pending verification)
- ✅ Chrome DevTools (Lighthouse)
- 🔧 PageSpeed Insights (https://pagespeed.web.dev/)
- 🔧 Schema Markup Validator (https://validator.schema.org/)

### Recommended Tools:
- Screaming Frog SEO Spider (crawl analysis)
- Ahrefs or SEMrush (keyword research, competitor analysis)
- GTmetrix (performance monitoring)
- Google Rich Results Test

### Learning Resources:
- Google Search Central Documentation
- Next.js SEO Best Practices
- Schema.org Structured Data Guide

---

## Notes & Considerations

### Development Priorities:
1. Focus on Priority 1 tasks first (critical SEO fixes)
2. Deploy and test each change incrementally
3. Monitor Google Search Console after each major change
4. Don't over-optimize - maintain natural, user-friendly content

### Content Strategy:
- Write for humans first, search engines second
- Maintain authentic voice and brand
- Focus on genuinely helpful content
- Avoid keyword stuffing

### Technical Considerations:
- All changes preserve existing functionality
- Schemas are valid JSON-LD
- No duplicate content issues
- Mobile-first approach maintained

### Future Enhancements:
- Consider adding a blog for content marketing
- Build backlinks through guest posts and partnerships
- Create downloadable resources (guides, checklists)
- Implement social proof signals

---

## Conclusion

This comprehensive SEO action plan covers all modern SEO techniques needed to make AIMMT prominent in search results for AI product discovery keywords. The plan is prioritized for maximum impact with minimal effort upfront, with optional advanced features that can be added over time.

**Next Steps:**
1. Review and approve this plan
2. Begin with Priority 1 tasks (Week 1)
3. Set up Google Search Console verification
4. Implement changes incrementally
5. Monitor results and adjust strategy

**Estimated Total Implementation Time:** 14-18 hours for critical and high-priority tasks

**Expected Timeline to Results:**
- Initial indexing improvements: 1-2 weeks
- Ranking improvements: 4-8 weeks
- Significant traffic increase: 3-6 months

---

**Document Version:** 1.0
**Last Updated:** January 12, 2025
**Maintained By:** Development Team
**Status:** Ready for Implementation

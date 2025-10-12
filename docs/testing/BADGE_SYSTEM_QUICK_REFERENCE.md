# Badge System - Quick Reference Card

## API Endpoints

### 1. Get Badge SVG
```bash
GET /api/badge/[slug]?variant=pro&size=medium&theme=auto&live=false
```

**Parameters:**
- `variant`: `pro` | `pro-plus` (default: `pro`)
- `size`: `small` | `medium` | `large` (default: `medium`)
- `theme`: `light` | `dark` | `auto` (default: `auto`)
- `live`: `true` | `false` (default: `false`) - bypass cache

**Response:** SVG image (`image/svg+xml`)

**Status Codes:**
- `200`: Success
- `400`: Invalid slug
- `403`: Not published or free tier
- `404`: Product not found

---

### 2. Track Badge Click
```bash
POST /api/badge/[slug]/click
Content-Type: application/json

{
  "referrer": "https://example.com/page"
}
```

**Response:** JSON
```json
{
  "success": true,
  "message": "Click tracked"
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid slug
- `404`: Product not found

---

### 3. Get Badge Data
```bash
GET /api/badge/[slug]/data
```

**Response:** JSON
```json
{
  "productId": "uuid",
  "productName": "Product Name",
  "productSlug": "product-slug",
  "upvotesCount": 123,
  "userTier": "pro",
  "isPublished": true,
  "isOwner": false
}
```

---

## Server Actions

### getBadgeData(slug: string)
```typescript
import { getBadgeData } from '@/lib/badges/actions'

const data = await getBadgeData('product-slug')
// Cached for 5 minutes via React cache
```

### trackBadgeClick(productId: string, referrer?: string)
```typescript
import { trackBadgeClick } from '@/lib/badges/actions'

const result = await trackBadgeClick(productId, 'https://example.com')
// Returns { success: boolean, error?: string }
```

### checkBadgeAccess(userId: string)
```typescript
import { checkBadgeAccess } from '@/lib/badges/actions'

const hasAccess = await checkBadgeAccess(userId)
// Returns boolean (true for Pro/Pro Plus)
```

---

## Utility Functions

### escapeXml(unsafe: string)
```typescript
import { escapeXml } from '@/lib/badges/utils'

const safe = escapeXml('<script>alert("XSS")</script>')
// Returns: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

### formatUpvoteCount(count: number)
```typescript
import { formatUpvoteCount } from '@/lib/badges/utils'

formatUpvoteCount(127)    // "127"
formatUpvoteCount(1234)   // "1.2K"
formatUpvoteCount(12345)  // "10K+"
```

### getBadgeUrl(baseUrl, slug, params)
```typescript
import { getBadgeUrl } from '@/lib/badges/utils'

const url = getBadgeUrl(
  'https://aimademethis.com',
  'product-slug',
  { variant: 'pro', size: 'large', theme: 'dark' }
)
// Returns: https://aimademethis.com/api/badge/product-slug?variant=pro&size=large&theme=dark
```

### getHtmlEmbedCode(productUrl, badgeUrl, productName, size)
```typescript
import { getHtmlEmbedCode } from '@/lib/badges/utils'

const html = getHtmlEmbedCode(
  'https://aimademethis.com/products/my-product',
  'https://aimademethis.com/api/badge/my-product',
  'My Product',
  'medium'
)
// Returns HTML embed code
```

---

## SVG Generation

### generateBadgeSVG(config: BadgeConfig)
```typescript
import { generateBadgeSVG } from '@/lib/badges/generator'

const svg = generateBadgeSVG({
  variant: 'pro',
  size: 'medium',
  theme: 'light',
  upvotesCount: 123,
  productName: 'My Product',
  productSlug: 'my-product'
})
// Returns SVG string (< 3KB)
```

### generateErrorBadge(message, size)
```typescript
import { generateErrorBadge } from '@/lib/badges/generator'

const svg = generateErrorBadge('PRODUCT_NOT_FOUND', 'medium')
// Returns error badge SVG
```

---

## Constants

### Badge Dimensions
```typescript
import { BADGE_DIMENSIONS } from '@/lib/badges/constants'

BADGE_DIMENSIONS.small   // { width: 180, height: 40 }
BADGE_DIMENSIONS.medium  // { width: 220, height: 48 }
BADGE_DIMENSIONS.large   // { width: 260, height: 56 }
```

### Badge Colors
```typescript
import { PRO_BADGE_COLORS, PRO_PLUS_BADGE_COLORS } from '@/lib/badges/constants'

// Pro badge: Emerald/Teal gradient
PRO_BADGE_COLORS.light.gradient.start  // hsl(160, 84%, 39%)
PRO_BADGE_COLORS.light.gradient.end    // hsl(173, 58%, 39%)

// Pro Plus badge: Gold/Amber gradient
PRO_PLUS_BADGE_COLORS.light.gradient.start  // hsl(45, 93%, 58%)
PRO_PLUS_BADGE_COLORS.light.gradient.end    // hsl(32, 95%, 55%)
```

### Error Messages
```typescript
import { BADGE_ERROR_MESSAGES } from '@/lib/badges/constants'

BADGE_ERROR_MESSAGES.PRODUCT_NOT_FOUND       // "Product Not Found"
BADGE_ERROR_MESSAGES.PRODUCT_NOT_PUBLISHED   // "Product Not Published"
BADGE_ERROR_MESSAGES.UPGRADE_REQUIRED        // "Upgrade to Pro"
BADGE_ERROR_MESSAGES.INVALID_SLUG            // "Invalid Product"
BADGE_ERROR_MESSAGES.SERVER_ERROR            // "Badge Unavailable"
```

---

## Database Schema

### badge_clicks table
```sql
CREATE TABLE badge_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  referrer TEXT,
  clicked_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_badge_clicks_product_id ON badge_clicks(product_id);
CREATE INDEX idx_badge_clicks_clicked_at ON badge_clicks(clicked_at);
```

---

## RLS Policies

### subscriptions table
```sql
-- Allow public read for badge generation
CREATE POLICY "Public can view subscriptions for badge generation"
ON subscriptions FOR SELECT TO public
USING (true);
```

**⚠️ Important:** This policy is required for badges to work. Without it, badge generation will fail with "Upgrade Required" error.

---

## Testing Badge System

### Manual Testing
```bash
# Test valid badge
curl "http://localhost:3000/api/badge/product-slug"

# Test with parameters
curl "http://localhost:3000/api/badge/product-slug?variant=pro&size=large&theme=dark"

# Test click tracking
curl -X POST "http://localhost:3000/api/badge/product-slug/click" \
  -H "Content-Type: application/json" \
  -d '{"referrer":"https://example.com"}'

# Test badge data
curl "http://localhost:3000/api/badge/product-slug/data"
```

### Expected Response Times
- **Development:** 120-200ms (average 161ms)
- **Production (Edge):** 50-100ms (target: <100ms)
- **Cached:** <50ms

---

## Troubleshooting

### Badge returns "Upgrade Required"
**Cause:** RLS policy blocking subscription access
**Fix:** Run migration `fix_badge_rls_policy.sql`

### Badge returns "Product Not Found"
**Causes:**
1. Invalid slug format (must be lowercase, alphanumeric + hyphens)
2. Product doesn't exist
3. RLS blocking product access

**Debug:**
```typescript
const data = await getBadgeData('product-slug')
console.log(data) // Check what's returned
```

### Badge shows wrong subscription tier
**Cause:** Subscription not active or RLS policy issue
**Fix:** Check subscription status in database:
```sql
SELECT s.*, sp.name
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE s.user_id = 'user-id' AND s.status = 'active';
```

### Performance issues
**Causes:**
1. React cache not working (check imports)
2. HTTP cache not set (check headers)
3. Database query slow (check indexes)

**Debug:**
```bash
# Check response time
curl -w "\nTime: %{time_total}s\n" "http://localhost:3000/api/badge/slug"

# Check cache headers
curl -I "http://localhost:3000/api/badge/slug"
```

---

## Security Checklist

- ✅ All dynamic content escaped with `escapeXml()`
- ✅ Slug validation with Zod (`slugSchema`)
- ✅ No external resources in SVG
- ✅ RLS policies enforced on all tables
- ✅ Rate limiting (TODO: Phase 2)
- ✅ CORS headers (handled by Next.js)

---

## Performance Optimization

### Caching Strategy
1. **React cache()** - Server-side, 5-minute TTL
2. **HTTP Cache-Control** - CDN/browser, 5-minute TTL with 1-min SWR
3. **Edge Runtime** - Deploy to Vercel Edge for <100ms response

### Best Practices
- Use `live=false` (default) for caching
- Only use `live=true` when real-time data needed
- Badge clicks don't invalidate cache (by design)
- Cache is shared across all requests (public cache)

---

## Common Patterns

### Embed Badge in HTML
```html
<a href="https://aimademethis.com/products/my-product" target="_blank">
  <img src="https://aimademethis.com/api/badge/my-product"
       alt="Featured on AiMadeMeThis"
       width="220" height="48" />
</a>
```

### Embed Badge in Markdown
```markdown
[![Featured on AiMadeMeThis](https://aimademethis.com/api/badge/my-product)](https://aimademethis.com/products/my-product)
```

### Embed Badge in React
```tsx
import Image from 'next/image'

<a href="https://aimademethis.com/products/my-product" target="_blank">
  <Image
    src="https://aimademethis.com/api/badge/my-product"
    alt="Featured on AiMadeMeThis"
    width={220}
    height={48}
  />
</a>
```

---

## Resources

- **Full Documentation:** `/docs/implementation/BADGE_SYSTEM_SESSION_1.md`
- **Test Report:** `/docs/testing/BADGE_SYSTEM_TEST_REPORT.md`
- **Test Summary:** `/docs/testing/BADGE_SYSTEM_TEST_SUMMARY.md`
- **Type Definitions:** `/lib/badges/types.ts`
- **Constants:** `/lib/badges/constants.ts`

---

**Last Updated:** October 12, 2025
**Version:** 1.0 (Session 1 Complete)

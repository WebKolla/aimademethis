# Embeddable Badge System - Architecture Document

**Feature Status**: Foundation Complete - Ready for Implementation
**Priority**: 1.5 (High Priority, Post-Launch)
**Estimated Implementation**: 8-12 hours (2-3 sessions)
**Created**: 2025-10-12

---

## Executive Summary

Product Hunt-style embeddable badge system allowing Pro and Pro Plus users to display badges on their external websites. Badges link back to product pages on AiMadeMeThis (AIMMT), driving referral traffic and providing backlinks for SEO.

### Key Benefits:
- **Viral Growth**: Every badge = free advertisement + backlink
- **Monetization**: Exclusive Pro/Pro Plus feature drives upgrades
- **SEO**: Backlinks improve domain authority
- **Social Proof**: Badges signal quality and credibility

---

## 1. Strategic Decisions (Project Manager)

### 1.1 Priority & Timeline
- **Priority Level**: 1.5 (implement immediately after launch readiness)
- **Launch Blocker**: NO - this is a growth feature, not required for launch
- **Timeline**:
  - Foundation (Complete): Database schema, planning, architecture
  - Implementation: 8-12 hours over 2-3 sessions
  - Testing: 2-3 hours with dedicated testing agent

### 1.2 Business Justification
- **High ROI**: 8-12 hours work for viral growth mechanism
- **Low Risk**: Isolated feature, no impact on core functionality
- **Competitive Advantage**: Product Hunt has this, we should too
- **Revenue Impact**: Drives Pro/Pro Plus upgrades (badge access = exclusive benefit)

### 1.3 Success Metrics
| Metric | Target | Timeline |
|--------|--------|----------|
| Badge Adoption Rate | 40% of Pro/Pro+ users | 30 days |
| Badge CTR | 2-5% | 3 months |
| Backlink Acquisition | 50+ backlinks | 3 months |
| Referral Traffic | 5-10% of total traffic | 3 months |
| Conversion (Free→Pro) | 5% from badge page views | 3 months |

---

## 2. Architectural Decisions (Frontend Architect)

### 2.1 Badge Rendering Approach ✅ **APPROVED**

**Decision**: Dynamic SVG generation via Next.js API routes
**Rationale**:
- ✅ Lightweight (~2-5KB per badge)
- ✅ Cacheable at CDN edge
- ✅ No JavaScript required (works in GitHub README)
- ✅ Dynamic upvote counts
- ✅ Edge-optimized (Vercel Edge)

**Rejected Alternatives**:
- ❌ Static SVG: Can't update upvote counts dynamically
- ❌ React to HTML: Unnecessary complexity

### 2.2 Badge Generator Location ✅ **APPROVED**

**Decision**: `/dashboard/products/[id]/badge` (per-product page)
**Rationale**:
- ✅ Context-aware (user already viewing specific product)
- ✅ No dropdown needed
- ✅ Matches Product Hunt's pattern
- ✅ Scalable (each product gets own badge settings)

**Implementation**:
```
Dashboard → My Products → [Product Card] → "Get Badge" button → /dashboard/products/[id]/badge
```

### 2.3 API Endpoint Structure ✅ **APPROVED**

**Primary Endpoint**:
```
/api/badge/[slug]?variant=pro|pro-plus&size=small|medium|large&theme=light|dark|auto
```

**Supporting Endpoints**:
```
/api/badge/[slug]/click  (POST) - Track clicks
/api/badge/[slug]/data   (GET)  - Badge preview data
```

**Example**:
```
https://aimademethis.com/api/badge/chatgpt-wrapper?variant=pro-plus&size=large&theme=dark
```

### 2.4 Caching Strategy ✅ **APPROVED**

**Decision**: 5-minute cache with stale-while-revalidate
**Headers**:
```typescript
'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
```

**Rationale**:
- ✅ Reduces database load by ~95%
- ✅ Upvote counts don't need real-time precision
- ✅ CDN-friendly (Vercel Edge caching)
- ✅ Optional `?live=true` param for real-time data

### 2.5 File Structure ✅ **APPROVED**

```
lib/badges/
├── generator.ts              # SVG generation logic (pure functions)
├── actions.ts                # Server actions (getBadgeData, trackClick)
├── types.ts                  # TypeScript types
├── constants.ts              # Badge sizes, colors, variants
└── utils.ts                  # Helper functions

components/badges/
├── badge-generator.tsx       # Main badge generator UI (Client Component)
├── badge-preview.tsx         # Live preview (Client Component)
├── badge-code-block.tsx      # Code snippets with copy button
└── badge-analytics.tsx       # Click analytics (future)

app/dashboard/products/[id]/badge/
└── page.tsx                  # Badge generator page (Server Component)

app/api/badge/
├── [slug]/
│   ├── route.ts              # Main badge endpoint (GET)
│   ├── click/
│   │   └── route.ts          # Click tracking (POST)
│   └── data/
│       └── route.ts          # Badge data endpoint (GET)
```

### 2.6 Embeddable Code Formats ✅ **APPROVED**

Badge generator will provide:

1. **HTML** (Primary):
```html
<a href="https://aimademethis.com/products/my-product" target="_blank" rel="noopener">
  <img src="https://aimademethis.com/api/badge/my-product?variant=pro&size=medium"
       alt="Featured on AiMadeMeThis" width="220" height="48" />
</a>
```

2. **Markdown** (For GitHub README):
```markdown
[![Featured on AiMadeMeThis](https://aimademethis.com/api/badge/my-product?variant=pro)](https://aimademethis.com/products/my-product)
```

3. **React Component** (For Next.js/React sites):
```tsx
<a href="https://aimademethis.com/products/my-product">
  <Image src="https://aimademethis.com/api/badge/my-product?variant=pro"
         alt="Featured on AiMadeMeThis" width={220} height={48} />
</a>
```

---

## 3. Design Decisions (UI Design Expert)

### 3.1 Badge Name ✅ **APPROVED**

**Decision**: Use "AIMMT" (not "AiMadeMeThis")
**Rationale**:
- ✅ Shorter, more compact
- ✅ More memorable abbreviation
- ✅ Fits better at small sizes
- ✅ Full name in hover tooltip for accessibility

### 3.2 Pro Badge Design ✅ **APPROVED**

**Visual Identity**:
- **Colors**: Emerald/Teal gradient (brand colors)
- **Icon**: Sparkles ✨ (Lucide React)
- **Text Color**: White
- **Label**: "FEATURED ON AIMMT"
- **Style**: Clean, professional

**Sizes**:
- Small: 180×40px
- Medium: 220×48px (default)
- Large: 260×56px

**Color Palette (Light Mode)**:
```css
background: linear-gradient(135deg,
  hsl(158, 64%, 52%) 0%,    /* Emerald-500 */
  hsl(173, 58%, 39%) 100%   /* Teal-600 */
);
text: hsl(0, 0%, 100%);     /* White */
shadow: 0 2px 8px hsla(158, 64%, 52%, 0.25);
```

### 3.3 Pro Plus Badge Design ✅ **APPROVED**

**Visual Identity**:
- **Colors**: Gold/Amber gradient (premium feel)
- **Icon**: Crown 👑 (Lucide React)
- **Text Color**: Dark Brown (better contrast)
- **Label**: "PRO PLUS • AIMMT"
- **Style**: More prominent, premium look

**Sizes**: Same as Pro badge (180×40, 220×48, 260×56px)

**Color Palette (Light Mode)**:
```css
background: linear-gradient(135deg,
  hsl(45, 93%, 58%) 0%,     /* Warm gold */
  hsl(32, 95%, 55%) 100%    /* Rich amber */
);
text: hsl(20, 14%, 15%);    /* Dark brown */
shadow: 0 2px 12px hsla(45, 93%, 58%, 0.4);
```

### 3.4 Dynamic Upvote Count ✅ **APPROVED**

**Decision**: Include upvote count on badge (like Product Hunt's "186")
**Rationale**:
- ✅ Social proof (shows product popularity)
- ✅ Encourages engagement
- ✅ Updates every 5 minutes via cache

**Display**:
```
┌────────────────────────────────────┐
│ [✨] FEATURED ON AIMMT    [↑ 127] │
└────────────────────────────────────┘
```

### 3.5 Accessibility ✅ **APPROVED**

**WCAG 2.1 AA Compliance**:
- ✅ Color contrast ratios meet AA standards
- ✅ Semantic HTML with proper ARIA labels
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Alt text for images

**Example**:
```html
<a href="..." aria-label="Featured on AiMadeMeThis - View product with 127 upvotes">
  <img alt="Featured on AiMadeMeThis - Pro Badge" />
</a>
```

---

## 4. Database Schema (Implemented)

### 4.1 badge_clicks Table ✅ **CREATED**

**Purpose**: Track badge clicks for analytics

```sql
CREATE TABLE badge_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  referrer text,
  clicked_at timestamptz DEFAULT now()
);

CREATE INDEX idx_badge_clicks_product_id ON badge_clicks(product_id);
CREATE INDEX idx_badge_clicks_clicked_at ON badge_clicks(clicked_at DESC);
```

**RLS Policies**:
- ✅ Anyone can INSERT (public endpoint)
- ✅ Only product owner can SELECT (view their analytics)

### 4.2 Helper Functions ✅ **CREATED**

**has_badge_access(p_user_id UUID) → boolean**
Returns true if user has Pro or Pro Plus subscription

**get_user_tier(p_user_id UUID) → TEXT**
Returns user's subscription tier: 'free', 'pro', or 'pro_plus'

---

## 5. Security Decisions

### 5.1 Access Control ✅ **APPROVED**

**Badge Display (Public)**:
- ✅ Anyone can view badges (no auth required)
- ✅ Only published products with Pro/Pro+ tier show badges
- ❌ Free tier products return 403 Forbidden

**Badge Generator (Protected)**:
- ✅ Only authenticated users can access
- ✅ Only product owner can generate badges
- ✅ Server-side ownership check: `product.user_id === auth.uid()`

### 5.2 Rate Limiting ✅ **APPROVED**

**Badge Endpoint**:
- Limit: 1000 requests/minute per IP
- Action: Return 429 Too Many Requests when exceeded
- Implementation: Vercel Edge Middleware or Upstash Redis

**Click Tracking**:
- Limit: 10 clicks/minute per product
- Protection: Prevent spam/bot abuse
- Detection: IP + User-Agent fingerprinting

### 5.3 Input Validation ✅ **APPROVED**

**Query Parameters**:
```typescript
const badgeParamsSchema = z.object({
  variant: z.enum(['pro', 'pro-plus']).default('pro'),
  size: z.enum(['small', 'medium', 'large']).default('medium'),
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  live: z.enum(['true', 'false']).default('false'),
});
```

**Slug Sanitization**:
```typescript
const slugSchema = z.string().regex(/^[a-z0-9-]+$/).max(100);
```

**SVG Output Sanitization**:
- ✅ Escape all dynamic text (product name, upvote count)
- ✅ Never inject user-controlled content directly
- ✅ Use XML entity encoding

---

## 6. Performance Decisions

### 6.1 Edge Deployment ✅ **APPROVED**

**Decision**: Deploy badge API to Vercel Edge
**Configuration**:
```typescript
export const runtime = 'edge'
export const dynamic = 'force-dynamic'
```

**Benefits**:
- ✅ 50-200ms global latency (vs 200-500ms serverless)
- ✅ Lower cost (Edge cheaper than serverless)
- ✅ Higher concurrency

### 6.2 Database Query Optimization ✅ **APPROVED**

**Optimized Query**:
```typescript
const { data: product } = await supabase
  .from('products')
  .select('id, slug, name, upvotes_count') // Only needed fields
  .eq('slug', slug)
  .single()
```

**Optimizations**:
- ✅ Use indexed columns (`slug`)
- ✅ Select only needed fields
- ✅ Use `.single()` for single-row queries
- ✅ Consider Redis cache for high-traffic products

### 6.3 SVG Optimization ✅ **APPROVED**

**Requirements**:
- ✅ Inline SVG (no external dependencies)
- ✅ Minify output (remove whitespace)
- ✅ Use `viewBox` for responsive scaling
- ✅ Target size: < 3KB per badge

---

## 7. SEO Decisions

### 7.1 Badge SEO Benefits ✅ **APPROVED**

**For AIMMT**:
- ✅ Backlinks from every embedded badge
- ✅ Brand visibility across the web
- ✅ Trust signals (verified products)
- ✅ Direct referral traffic

**For Product Owners**:
- ✅ Social proof on their sites
- ✅ Authority via AIMMT association
- ✅ Link building for SEO

### 7.2 Badge HTML Metadata ✅ **APPROVED**

**Optimal Structure**:
```html
<a href="https://aimademethis.com/products/my-product"
   title="View My Product on AiMadeMeThis"
   target="_blank"
   rel="noopener">
  <img src="..."
       alt="My Product - Featured on AiMadeMeThis (Pro Badge)"
       width="220"
       height="48"
       loading="lazy"
       decoding="async" />
</a>
```

**SEO Best Practices**:
- ✅ Descriptive alt text (product name + badge type)
- ✅ Title attribute (accessibility + SEO)
- ✅ Width/height attributes (prevents layout shift, improves Core Web Vitals)
- ✅ loading="lazy" (improves page load)

---

## 8. Implementation Phases

### Phase 1: MVP Badge System ✅ **FOUNDATION COMPLETE**
**Status**: Database schema created, planning complete
**Remaining**: 8-12 hours

**Tasks**:
1. SVG generation logic (`lib/badges/generator.ts`)
2. Badge API endpoint (`/api/badge/[slug]/route.ts`)
3. Badge generator UI (`/dashboard/products/[id]/badge/page.tsx`)
4. Badge preview component
5. Code snippet generator with copy button
6. Dashboard integration ("Get Badge" button)

### Phase 2: Analytics & Enhancements (Post-MVP)
**Priority**: Medium (implement if adoption >40%)
**Estimated**: 4-6 hours

**Features**:
- Click analytics dashboard
- Badge impression tracking
- Top referring domains
- Badge A/B testing
- Additional badge variants

### Phase 3: Advanced Features (Future)
**Priority**: Low (only if badges become core growth driver)
**Estimated**: 6-8 hours

**Features**:
- Custom badge API for Pro Plus
- Badge customization (colors, text)
- Badge "Hall of Fame" leaderboard
- Badge widgets (JavaScript embeds)

---

## 9. Testing Requirements

### 9.1 Functional Testing (New Testing Agent)

**Test Coverage**:
- ✅ Badge generation for Pro users
- ✅ Badge generation for Pro Plus users
- ✅ Access control (Free tier blocked)
- ✅ Badge display on external sites (HTML)
- ✅ Badge display on GitHub (Markdown)
- ✅ All sizes (small, medium, large)
- ✅ All themes (light, dark, auto)
- ✅ Upvote count accuracy
- ✅ Click tracking functionality
- ✅ Copy-to-clipboard functionality
- ✅ Cache behavior (5-minute cache)
- ✅ Real-time mode (`?live=true`)

### 9.2 Performance Testing

**Benchmarks**:
- ✅ Badge API response time < 100ms (p95)
- ✅ SVG file size < 3KB
- ✅ Cache hit rate > 90%
- ✅ No memory leaks (Edge runtime)

### 9.3 Accessibility Testing

**Requirements**:
- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation works
- ✅ Screen reader announces properly
- ✅ Color contrast ratios meet standards
- ✅ Focus indicators visible

### 9.4 Security Testing

**Test Cases**:
- ✅ Rate limiting works (429 response)
- ✅ SQL injection blocked (slug validation)
- ✅ XSS blocked (SVG sanitization)
- ✅ Unauthorized access blocked (RLS)
- ✅ Free tier badge access blocked (403 response)

---

## 10. Behavioral Decisions

### 10.1 User Flows

**Badge Generation Flow**:
```
1. User navigates to "My Products"
2. Clicks "Get Badge" button on product card
3. Lands on /dashboard/products/[id]/badge
4. System checks: Is user Pro/Pro+? Does user own product?
5. If YES: Show badge generator
6. If NO: Show upgrade CTA
7. User customizes badge (size, theme)
8. User copies HTML or Markdown code
9. User pastes code on their website
10. Badge displays with link back to AIMMT
```

**Badge Click Flow**:
```
1. External visitor sees badge on product website
2. Clicks badge
3. Browser navigates to https://aimademethis.com/products/[slug]
4. (Optional) Click tracked via POST to /api/badge/[slug]/click
5. Visitor lands on product page
6. Visitor can upvote, comment, bookmark product
```

### 10.2 Error Handling

**Badge API Errors**:
- 404: Product not found → Return "Product Not Found" SVG
- 403: Free tier user → Return "Upgrade to Pro" SVG
- 500: Server error → Return fallback SVG with "Badge Unavailable"
- 429: Rate limit exceeded → Return cached version if available

**Badge Generator Errors**:
- User not Pro/Pro+: Show upgrade modal with pricing
- Product not published: Show "Publish product first" message
- User doesn't own product: Redirect to dashboard

### 10.3 Analytics Display

**Badge Stats (on generator page)**:
- Total badge clicks (last 30 days)
- Top 5 referring domains
- Click-through rate (CTR)
- Badge impressions (if available from CDN logs)
- Link to full analytics page

---

## 11. Integration Points

### 11.1 Subscription System Integration

**Badge Eligibility Check**:
```typescript
// Uses existing RPC function
const tier = await supabase.rpc('get_user_tier', { p_user_id: userId });
const hasAccess = ['pro', 'pro_plus'].includes(tier);
```

**Subscription Status Display**:
- Show current tier on badge generator page
- Show upgrade CTA if Free tier
- Show "Pro Plus exclusive" badge for Pro users

### 11.2 Dashboard Integration

**Product Cards**:
- Add "Get Badge" button (only for Pro/Pro+)
- Show badge status indicator ("Badge Active" ✓)
- Link to badge generator page

**Dashboard Navigation**:
- Add "Badge" tab to product sidebar
- Show badge icon (Sparkles or Crown) based on tier

### 11.3 Analytics Integration

**Track Badge Events**:
- Badge generated (analytics.track('badge_generated'))
- Badge copied (analytics.track('badge_copied'))
- Badge clicked (analytics.track('badge_clicked'))
- Badge viewed (analytics.track('badge_viewed'))

---

## 12. Future Enhancements

### 12.1 Badge Variants (Phase 2)
- Compact badge (horizontal, minimal)
- Vertical badge (for sidebars)
- Animated badge (subtle pulse on Pro Plus)
- Custom color badge (Pro Plus exclusive)

### 12.2 Badge Customization (Phase 2)
- Custom text (e.g., "Featured on AIMMT" → "Loved by 1000+ users")
- Custom colors (Pro Plus only)
- Hide upvote count (privacy option)
- Show additional stats (views, comments)

### 12.3 Badge Analytics Dashboard (Phase 2)
- Detailed click analytics
- Geographic distribution
- Referrer analysis
- Conversion tracking (badge click → signup)

### 12.4 Badge API v2 (Phase 3)
- GraphQL API for advanced queries
- Webhook notifications on badge clicks
- Real-time WebSocket updates for upvote counts
- Batch badge generation

---

## 13. Risk Mitigation

### 13.1 Risk: Badge Abuse/Spam

**Severity**: Medium
**Likelihood**: Low
**Mitigation**:
- Rate limit badge API (1000 req/min per IP)
- Monitor for suspicious referrers
- Add "Report Abuse" link on badge generator
- Terms of Service: Prohibit badges on NSFW/illegal sites
- Admin dashboard: Flag products with suspicious badge traffic

### 13.2 Risk: SVG Injection/XSS

**Severity**: High
**Likelihood**: Low
**Mitigation**:
- Sanitize all user input before SVG generation
- Use XML entity encoding for dynamic text
- Never use `dangerouslySetInnerHTML`
- CSP headers: `Content-Security-Policy: default-src 'self'`
- Regular security audits

### 13.3 Risk: Performance/Database Load

**Severity**: Medium
**Likelihood**: Medium
**Mitigation**:
- 5-minute cache reduces DB load by 95%
- Use CDN (Vercel Edge) for badge delivery
- Database query optimization (indexed columns)
- Monitor badge API response time (<100ms p95)
- Consider Redis cache for high-traffic products

### 13.4 Risk: Low Adoption

**Severity**: Low
**Likelihood**: Low
**Mitigation**:
- Marketing: Showcase badges on homepage
- Incentive: "Get 10% more traffic with badges" messaging
- Tutorial: Video guide on badge installation
- Examples: Show successful badge implementations
- Support: Proactive outreach to Pro/Pro+ users

---

## 14. Success Criteria

### 14.1 Technical Success
- ✅ Badge API response time < 100ms (p95)
- ✅ Badge SVG size < 3KB
- ✅ Cache hit rate > 90%
- ✅ Zero XSS/security vulnerabilities
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Build passes with no errors
- ✅ All tests pass (functional, performance, security)

### 14.2 Business Success
- ✅ 40% badge adoption rate (Pro/Pro+ users)
- ✅ 2-5% badge CTR
- ✅ 50+ backlinks within 3 months
- ✅ 5-10% referral traffic within 3 months
- ✅ 5% conversion rate (Free→Pro from badge page)

### 14.3 User Success
- ✅ Badge generation takes < 2 minutes
- ✅ Copy-paste code works on first try
- ✅ Badge displays correctly on all platforms
- ✅ Support tickets < 2% (low confusion rate)
- ✅ Positive user feedback (NPS > 8)

---

## 15. Next Steps

### Immediate (This Session):
1. ✅ Commit foundation work
2. ✅ Create testing agent
3. ✅ Document architectural decisions (this file)
4. ⏳ Review with all agents
5. ⏳ Begin implementation (Phase 1)

### Session 2:
1. Implement SVG generation logic
2. Create badge API endpoints
3. Build badge generator UI
4. Test with new testing agent

### Session 3:
1. Dashboard integration
2. Polish & bug fixes
3. Final testing & deployment
4. Documentation & user guide

---

## 16. References

### Agent Reports:
- **Project Manager**: Priority 1.5 feature, 8-12 hour estimate, post-launch timing
- **UI Design Expert**: Complete visual specifications (colors, typography, sizes)
- **Frontend Architect**: Technical architecture (API routes, caching, file structure)

### Related Documentation:
- `/docs/PRD.md` - Product Requirements Document
- `/docs/DESIGN_GUIDELINES.md` - Design system guidelines
- `/CLAUDE.md` - Development guidelines

### Database Migrations:
- `add_badge_system_v3` - Creates badge_clicks table and helper functions

### Key Technologies:
- Next.js 15 (App Router, Server Components)
- Supabase (PostgreSQL, RLS, RPC functions)
- Vercel Edge (CDN, Edge runtime)
- SVG (Scalable Vector Graphics)
- TypeScript (Type safety)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-12
**Status**: Foundation Complete - Ready for Implementation
**Next Review**: After Phase 1 implementation

---

## Appendix A: Decision Log

| Date | Decision | Rationale | Impact |
|------|----------|-----------|---------|
| 2025-10-12 | Use "AIMMT" instead of "AiMadeMeThis" | Shorter, fits better at small sizes | All badge designs |
| 2025-10-12 | Per-product badge generator | Better UX, matches Product Hunt | API structure, UI flow |
| 2025-10-12 | 5-minute cache with stale-while-revalidate | Balance between performance and freshness | API performance |
| 2025-10-12 | Dynamic SVG via API routes | Best performance, embeddability | Technical architecture |
| 2025-10-12 | Emerald/Teal for Pro, Gold/Amber for Pro Plus | Brand consistency, premium differentiation | Badge designs |

---

**End of Architecture Document**

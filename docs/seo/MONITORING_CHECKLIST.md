# SEO Monitoring & Maintenance Checklist

This document outlines the ongoing monitoring tasks for maintaining and improving SEO performance for AIMMT (AI Made Me This).

**Last Updated:** January 12, 2025
**Monitoring Frequency:** Weekly (Monday recommended)
**Owner:** Product Team

---

## Weekly Checklist (Priority 5 Task 5.2)

### 1. Google Search Console Review (15 minutes)

**Actions:**
- [ ] Check Search Performance report (impressions, clicks, CTR, position)
- [ ] Review Coverage report for indexing errors
- [ ] Check Core Web Vitals report (mobile and desktop)
- [ ] Review Mobile Usability issues
- [ ] Check for new manual actions or security issues
- [ ] Verify both sitemaps are being processed:
  - `/sitemap.xml` (main sitemap)
  - `/image-sitemap.xml` (image sitemap)

**Key Metrics to Track:**
- Total impressions (target: week-over-week growth)
- Total clicks (target: week-over-week growth)
- Average CTR (target: >2% for product pages, >5% for brand queries)
- Average position (target: <20 for target keywords)
- Indexed pages (should match published products count)

**Red Flags:**
- 🚨 Drop in indexed pages (check for crawl errors)
- 🚨 Manual actions or security issues
- 🚨 Core Web Vitals degradation
- 🚨 Significant drop in impressions/clicks (>20%)

---

### 2. Google Analytics Review (15 minutes)

**Actions:**
- [ ] Review Organic Search traffic (users, sessions, bounce rate)
- [ ] Check top landing pages from organic search
- [ ] Review user engagement metrics (session duration, pages per session)
- [ ] Check conversion metrics (signups, product submissions)
- [ ] Identify top-performing content
- [ ] Identify underperforming pages for optimization

**Key Metrics to Track:**
- Organic traffic (target: month-over-month growth of 10-20%)
- Bounce rate (target: <60% for product pages)
- Average session duration (target: >2 minutes)
- Pages per session (target: >2.5)
- Conversion rate (target: defined by business goals)

**Red Flags:**
- 🚨 Organic traffic drop >15%
- 🚨 Bounce rate spike >70%
- 🚨 Session duration drop <1 minute
- 🚨 Conversion rate decline

---

### 3. Core Web Vitals Check (10 minutes)

**Tools:**
- PageSpeed Insights (https://pagespeed.web.dev/)
- Chrome DevTools Lighthouse
- Google Search Console Core Web Vitals report

**Actions:**
- [ ] Test homepage (/) on mobile and desktop
- [ ] Test products listing page (/products)
- [ ] Test 2-3 top product detail pages
- [ ] Review LCP (Largest Contentful Paint - target: <2.5s)
- [ ] Review FID (First Input Delay - target: <100ms)
- [ ] Review CLS (Cumulative Layout Shift - target: <0.1)

**Current Optimizations:**
- ✅ Next.js Image component with priority flags
- ✅ Font optimization (Inter, Poppins with display: swap)
- ✅ Suspense boundaries for data fetching
- ✅ Route-level code splitting (App Router)

**Red Flags:**
- 🚨 LCP > 4s (poor)
- 🚨 FID > 300ms (poor)
- 🚨 CLS > 0.25 (poor)

---

### 4. Broken Links Check (10 minutes)

**Tools:**
- Google Search Console (Coverage report - crawl errors)
- Manual spot checks

**Actions:**
- [ ] Review 404 errors in Google Search Console
- [ ] Check for broken internal links on key pages
- [ ] Verify external links on About/Contact pages
- [ ] Test navigation (header, footer, breadcrumbs)

**Red Flags:**
- 🚨 404 errors for product pages (indicates deleted products without redirects)
- 🚨 Broken footer links (affects site-wide SEO)
- 🚨 Broken navigation links

---

### 5. Content & Schema Validation (15 minutes)

**Tools:**
- Google Rich Results Test (https://search.google.com/test/rich-results)
- Schema.org Validator (https://validator.schema.org/)

**Actions:**
- [ ] Test 2-3 product pages for valid Product schema
- [ ] Verify ItemList schema on /products page
- [ ] Check Organization and WebSite schema on homepage
- [ ] Verify image sitemap is serving properly (/image-sitemap.xml)
- [ ] Spot-check meta descriptions and titles for 3-5 pages

**Current Schemas Implemented:**
- ✅ Product schema (product detail pages)
- ✅ ItemList schema (/products page)
- ✅ Organization schema (root layout)
- ✅ WebSite schema with SearchAction (root layout)
- ✅ Image sitemap (all products with images)

**Red Flags:**
- 🚨 Schema validation errors
- 🚨 Missing meta descriptions or titles
- 🚨 Duplicate meta descriptions across pages

---

### 6. Keyword Rankings Spot Check (10 minutes)

**Manual Google Searches (Incognito):**
- [ ] "AI product directory"
- [ ] "discover AI tools"
- [ ] "AI made me this"
- [ ] "submit AI product"
- [ ] "[specific product name] review"

**Actions:**
- Track current positions for target keywords
- Note any significant changes (+/- 5 positions)
- Identify new ranking opportunities

**Target Keywords (Priority):**
1. "AI product directory" (high priority)
2. "AI tools discovery" (high priority)
3. "submit AI product" (medium priority)
4. Brand: "AI made me this" / "AIMMT" (monitor)

---

## Monthly Deep Dive (Additional Tasks)

### Content Performance Audit (60 minutes)
- Review top 20 organic landing pages
- Identify optimization opportunities (update meta, add internal links)
- Check for thin content or duplicate content issues
- Update outdated information

### Competitor Analysis (30 minutes)
- Check competitors' rankings for target keywords
- Analyze their content strategies
- Identify backlink opportunities
- Review their structured data implementation

### Backlink Profile Review (30 minutes)
- Use Google Search Console Links report
- Identify top linking domains
- Check for spammy or toxic backlinks (use Google Disavow if needed)
- Identify backlink opportunities

### Technical SEO Audit (45 minutes)
- Review robots.txt and sitemaps
- Check for redirect chains
- Verify canonical URLs are working correctly
- Review page load times across device types
- Check for HTTPS issues

---

## Quarterly Review (Strategic Planning)

### Performance Summary (90 minutes)
- Compile 3-month data: traffic, rankings, conversions
- Identify top-performing content and channels
- Calculate ROI of SEO efforts
- Present findings to stakeholders

### Strategy Adjustment (60 minutes)
- Review and update target keywords based on performance
- Adjust content calendar for next quarter
- Prioritize technical improvements
- Set new SEO goals and KPIs

---

## Key Performance Indicators (KPIs)

### Traffic Metrics
- **Organic Sessions**: Target 10-20% month-over-month growth
- **Organic Users**: Track unique visitors from organic search
- **Organic Traffic %**: Target >40% of total traffic from organic search

### Engagement Metrics
- **Bounce Rate**: Target <60% for product pages
- **Average Session Duration**: Target >2 minutes
- **Pages per Session**: Target >2.5

### Conversion Metrics
- **Signups from Organic**: Track conversion rate
- **Product Submissions from Organic**: Track conversion rate
- **Email Newsletter Signups**: Track from organic traffic

### Search Metrics
- **Impressions**: Track total and top pages
- **Clicks**: Track total and CTR by page
- **Average Position**: Target <20 for primary keywords
- **Indexed Pages**: Should match published content count

### Technical Metrics
- **Core Web Vitals**: All "Good" ratings (green)
- **Mobile Usability Issues**: Target 0 issues
- **Coverage Errors**: Target 0 errors
- **Crawl Budget**: Monitor pages crawled per day

---

## Tools & Resources

### Required Tools
- **Google Search Console**: https://search.google.com/search-console
- **Google Analytics 4**: https://analytics.google.com
- **PageSpeed Insights**: https://pagespeed.web.dev/

### Helpful Tools
- **Schema Validator**: https://validator.schema.org/
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **Lighthouse**: Built into Chrome DevTools

---

## Escalation Process

**When to Escalate:**
- 🚨 **Critical**: >30% drop in organic traffic or indexed pages
- ⚠️ **High**: Manual action or security issue in GSC
- ⚠️ **High**: Core Web Vitals moving from "Good" to "Poor"
- ⚠️ **Medium**: Persistent coverage errors or 404s

**Who to Notify:**
- Technical Lead (for Core Web Vitals and technical issues)
- Product Manager (for traffic drops and strategic issues)
- Development Team (for broken links or schema errors)

---

## Notes & Action Items

### Current Status
- ✅ Priority 1: Technical Foundation (Complete)
- ✅ Priority 2: Content Optimization (Complete)
- ✅ Priority 3: Technical SEO (Complete)
- ✅ Priority 4: Advanced SEO (Complete)
- 🟡 Priority 5: Monitoring & Maintenance (In Progress)
  - ⏳ Task 5.1: Awaiting Google Search Console verification
  - ✅ Task 5.2: Monitoring checklist created
  - ✅ Task 5.3: Image sitemap implemented

### Pending Actions
1. User must provide Google Search Console verification code
2. Deploy image sitemap to production
3. Submit image-sitemap.xml to Google Search Console
4. Begin weekly monitoring routine

---

**Document Version:** 1.0
**Last Review:** January 12, 2025
**Next Review:** February 12, 2025

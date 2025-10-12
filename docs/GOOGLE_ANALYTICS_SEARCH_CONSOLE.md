# Google Analytics & Search Console Setup

This guide explains how Google Analytics and Google Search Console are configured for AIMMT (AI Made Me This).

## ✅ Google Analytics (Already Configured)

### Current Setup
- **Tracking ID**: `G-W3SCH7MBQG`
- **Status**: ✅ Integrated and tracking
- **Location**: `app/layout.tsx` (lines 150-168)

### Environment Variable
```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG=G-W3SCH7MBQG
```

### Features Enabled
- ✅ Page view tracking
- ✅ User behavior analytics
- ✅ Traffic sources
- ✅ Real-time visitors
- ✅ Event tracking ready

### Verifying It Works
1. Visit https://analytics.google.com/
2. Select your property (G-W3SCH7MBQG)
3. Check the "Realtime" report
4. Open your website in a new tab
5. You should see your visit appear in realtime!

---

## 🔄 Google Search Console Setup

### Step 1: Add Your Property
1. Go to https://search.google.com/search-console
2. Click "Add Property"
3. Enter your domain: `aimademethis.vercel.app` (or your custom domain)
4. Choose **"URL prefix"** method

### Step 2: Verify Ownership

**Method 1: HTML Meta Tag (Recommended)**

Google will provide you with a verification code like:
```html
<meta name="google-site-verification" content="your-verification-code-here" />
```

Add it to your environment variables:
```bash
# In .env.local (for local testing)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code-here

# In Vercel (for production)
# Go to: Project Settings → Environment Variables
# Add: NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = your-verification-code-here
```

The code is already integrated in `app/layout.tsx` (line 27-29) and will automatically add the meta tag.

**Method 2: HTML File Upload**
1. Download the verification file from Google
2. Place it in `public/` folder (e.g., `public/google1234567890.html`)
3. Deploy to Vercel
4. Click "Verify" in Google Search Console

### Step 3: Submit Your Sitemap

Once verified:
1. In Google Search Console, go to "Sitemaps" (left sidebar)
2. Enter: `sitemap.xml`
3. Click "Submit"

Your sitemap URL will be: `https://aimademethis.vercel.app/sitemap.xml`

### What's Already Configured

✅ **Sitemap** (`app/sitemap.ts`)
- Auto-generates from database
- Includes all published products
- Includes all categories
- Includes static pages
- Revalidates every hour

✅ **Robots.txt** (`app/robots.ts`)
- Allows all crawlers
- Blocks `/api/`, `/_next/`, `/admin/`
- References sitemap automatically

✅ **SEO Meta Tags**
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URLs
- Structured data (JSON-LD)

---

## 📊 Monitoring & Analytics

### Google Analytics Dashboard
- **Traffic Overview**: See visitors, sessions, bounce rate
- **Acquisition**: Understand where users come from
- **Behavior**: See which pages are most popular
- **Conversions**: Track goals (signups, product submissions)

### Google Search Console Dashboard
- **Performance**: See search queries, clicks, impressions
- **Coverage**: Monitor indexed pages
- **Enhancements**: Check mobile usability, Core Web Vitals
- **Links**: See who's linking to your site

---

## 🚀 Next Steps

### 1. Set Up Custom Events (Optional)
Track specific actions like:
- Product submissions
- Upvotes
- Bookmarks
- User signups

Example code to add to your components:
```typescript
// Track custom event
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'product_submission', {
    product_name: productName,
    category: categoryName,
  });
}
```

### 2. Set Up Goals in Google Analytics
1. Go to Google Analytics
2. Navigate to Admin → Goals
3. Create goals for key actions:
   - User signup
   - Product submission
   - Profile completion

### 3. Monitor Search Performance
- Check Google Search Console weekly
- Fix any crawl errors
- Monitor which keywords bring traffic
- Optimize meta descriptions for top-performing pages

### 4. Enable Enhanced Measurement
In Google Analytics:
1. Go to Admin → Data Streams
2. Click your web stream
3. Enable Enhanced Measurement
4. Turn on:
   - Scrolls
   - Outbound clicks
   - Site search
   - Video engagement
   - File downloads

---

## 🔒 Privacy & GDPR Compliance

### Current Setup
- ✅ Google Analytics runs in production only
- ✅ No tracking in development mode
- ✅ IP anonymization can be enabled

### To Enable IP Anonymization
Edit `app/layout.tsx` and update the gtag config:
```javascript
gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG}', {
  page_path: window.location.pathname,
  anonymize_ip: true, // Add this line
});
```

### Cookie Consent (Future Enhancement)
Consider adding a cookie consent banner for GDPR compliance:
- Use a library like `react-cookie-consent`
- Only load analytics after user consent
- Provide opt-out options

---

## 🐛 Troubleshooting

### Analytics Not Tracking
1. Check environment variable is set correctly
2. Verify it starts with `NEXT_PUBLIC_`
3. Restart dev server after .env changes
4. Check browser console for errors
5. Verify in Network tab that gtag.js loads

### Search Console Not Verifying
1. Ensure meta tag is in `<head>` section
2. Check it's deployed to production
3. Try the HTML file method instead
4. Clear CDN cache on Vercel
5. Wait 24-48 hours for DNS propagation

### Sitemap Not Updating
1. Sitemap revalidates every hour (see `sitemap.ts:97`)
2. Force refresh: https://aimademethis.vercel.app/sitemap.xml
3. Check Supabase connection
4. Verify products table has data

---

## 📚 Resources

- [Google Analytics Documentation](https://developers.google.com/analytics)
- [Google Search Console Help](https://support.google.com/webmasters)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

---

**Last Updated**: January 12, 2025
**Status**: ✅ Google Analytics Configured | ⏳ Google Search Console Pending Verification

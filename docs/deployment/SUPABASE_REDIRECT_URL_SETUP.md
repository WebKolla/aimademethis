# Supabase Redirect URL Configuration

**Quick Guide:** Where to add production redirect URLs in Supabase

---

## Step-by-Step Instructions

### 1. Access Supabase Dashboard

1. Go to: https://app.supabase.com
2. Log in to your account
3. Select your project (the one used for AIMMT)

### 2. Navigate to Authentication Settings

**Path:** Authentication → URL Configuration

**How to get there:**
1. In the left sidebar, click **"Authentication"** (shield icon)
2. Click **"URL Configuration"** tab at the top
3. You should see a page with several URL settings

### 3. Find "Redirect URLs" Section

On the URL Configuration page, scroll down to find:

**Section name:** "Redirect URLs"
**Description:** "URLs that auth providers are permitted to redirect to after authentication"

This section controls which URLs are allowed as OAuth redirect destinations.

### 4. Add Production Redirect URLs

In the **"Redirect URLs"** text area, add these URLs (one per line):

```
https://www.aimademethis.com/auth/callback
https://aimademethis.com/auth/callback
http://localhost:3000/auth/callback
```

**Important:**
- Add **both** www and non-www versions
- Keep `http://localhost:3000/auth/callback` for local development
- One URL per line
- No trailing slashes
- Must start with http:// or https://

**Example of what it should look like:**
```
┌─────────────────────────────────────────────────────┐
│ Redirect URLs                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ https://www.aimademethis.com/auth/callback      │ │
│ │ https://aimademethis.com/auth/callback          │ │
│ │ http://localhost:3000/auth/callback             │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 5. Update Site URL

On the same page, find:

**Section name:** "Site URL"
**Description:** "The default URL your site redirects to after authentication"

Change this to:
```
https://www.aimademethis.com
```

**Important:**
- Use www version (matches your primary domain)
- No trailing slash
- Must start with https://

### 6. Save Changes

1. Scroll to the bottom of the page
2. Click **"Save"** button (green button)
3. Wait for confirmation message: "Successfully updated settings"

### 7. Verify Configuration

After saving, verify:
- [ ] All three redirect URLs are listed (www, non-www, localhost)
- [ ] Site URL is set to production URL
- [ ] No typos in URLs
- [ ] All URLs start with http:// or https://

---

## Visual Guide

Here's what you're looking for on the page:

```
┌────────────────────────────────────────────────────────┐
│ Authentication → URL Configuration                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Site URL                                               │
│ ┌────────────────────────────────────────────────┐   │
│ │ https://www.aimademethis.com                   │   │
│ └────────────────────────────────────────────────┘   │
│                                                        │
│ Redirect URLs                                          │
│ ┌────────────────────────────────────────────────┐   │
│ │ https://www.aimademethis.com/auth/callback     │   │
│ │ https://aimademethis.com/auth/callback         │   │
│ │ http://localhost:3000/auth/callback            │   │
│ └────────────────────────────────────────────────┘   │
│                                                        │
│ [ Save ]                                              │
└────────────────────────────────────────────────────────┘
```

---

## Additional Settings (Optional)

While on the URL Configuration page, you may also see:

### Additional Redirect URLs
**What it is:** Extra redirect URLs for advanced use cases
**Action:** Leave empty unless you have specific needs

### JWT Expiry
**What it is:** How long auth tokens last before requiring re-login
**Default:** Usually 3600 seconds (1 hour)
**Action:** Leave as default for now

---

## Common Issues

### Issue: "Invalid URL" error

**Cause:** URL format is incorrect

**Fix:**
- Ensure URL starts with `http://` or `https://`
- Remove trailing slashes
- Check for typos
- Ensure no spaces

### Issue: Can't find "URL Configuration" tab

**Path:**
1. Left sidebar → Authentication (not Settings)
2. Top tabs → URL Configuration (not Providers, Policies, etc.)

**If still not visible:**
- Verify you're logged into the correct project
- Try refreshing the page
- Check if you have admin access to the project

### Issue: Save button is disabled/grayed out

**Causes:**
- No changes made
- Invalid URL format
- Missing required field

**Fix:**
- Make sure URLs are valid
- Check all required fields are filled
- Try refreshing the page

---

## Testing After Configuration

After saving, test immediately:

1. **Go to your app** (deployed version or localhost)
2. **Click "Sign in with Google"**
3. **Complete OAuth flow**
4. **Verify:** You're redirected back to your site (not an error page)

If you get "redirect_uri_mismatch" error:
- Double-check the URLs you entered
- Ensure no typos
- Make sure you saved changes
- Try adding the exact URL shown in the error message

---

## Quick Reference

**Where:** Supabase Dashboard → Authentication → URL Configuration

**What to update:**
- Site URL: `https://www.aimademethis.com`
- Redirect URLs:
  - `https://www.aimademethis.com/auth/callback`
  - `https://aimademethis.com/auth/callback`
  - `http://localhost:3000/auth/callback`

**After saving:**
- Verify URLs are correct
- Test OAuth login immediately
- Check both Google and GitHub providers

---

## Screenshot Locations (for reference)

If you need visual guidance:

1. **Dashboard home:** https://app.supabase.com/projects
2. **Your project dashboard:** Click your project name
3. **Authentication section:** Left sidebar (shield icon)
4. **URL Configuration:** Top tab bar

---

## Next Steps

After configuring Supabase redirect URLs:

1. ✅ Supabase redirect URLs configured
2. ⏭️ Next: Configure Google OAuth redirect URIs
3. ⏭️ Next: Configure GitHub OAuth callback URL
4. ⏭️ Next: Update Vercel environment variable
5. ⏭️ Next: Deploy and test

See full guide: `/docs/deployment/OAUTH_REDIRECT_FIX.md`

---

**Need help?** If you can't find the settings or encounter issues, send a screenshot of your Supabase dashboard and I can guide you further!

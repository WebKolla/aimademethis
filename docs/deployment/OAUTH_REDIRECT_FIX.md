# Fix OAuth Redirects for Production

**Issue:** GitHub and Google OAuth redirects are pointing to test/development URL instead of production URL.

**Impact:** After users log in with Google or GitHub, they get redirected to the wrong URL.

---

## Root Cause

OAuth providers (Google, GitHub) have **hardcoded redirect URIs** that must match exactly what your app sends. Currently, these are configured for your development/test environment.

When you deploy to production (`www.aimademethis.com`), you need to:
1. Update `NEXT_PUBLIC_SITE_URL` environment variable
2. Add production redirect URIs to Supabase
3. Add production redirect URIs to Google OAuth
4. Add production redirect URIs to GitHub OAuth

---

## Step 1: Update Supabase Redirect URLs

### 1.1: Add Production URL to Supabase Auth

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to: **Authentication → URL Configuration**
4. Find **"Redirect URLs"** section
5. Add production URLs (keep existing ones for local dev):
   ```
   https://www.aimademethis.com/auth/callback
   https://aimademethis.com/auth/callback
   http://localhost:3000/auth/callback  (keep for local dev)
   ```
6. Find **"Site URL"** setting
7. Update to: `https://www.aimademethis.com`
8. Click **"Save"**

### 1.2: Update Vercel Environment Variable

In Vercel Dashboard → Your Project → Settings → Environment Variables:

**Update:**
```
NEXT_PUBLIC_SITE_URL=https://www.aimademethis.com
```

**Important:** Set this for **Production** environment, keep localhost for Development/Preview if needed.

---

## Step 2: Update Google OAuth Configuration

### 2.1: Find Your Google OAuth Client

1. Go to: https://console.cloud.google.com
2. Select your project (or the project where you created OAuth credentials)
3. Navigate to: **APIs & Services → Credentials**
4. Find your OAuth 2.0 Client ID (created for Supabase)
5. Click on it to edit

### 2.2: Add Production Redirect URIs

In **"Authorized redirect URIs"** section, add:

```
https://www.aimademethis.com/auth/callback
https://aimademethis.com/auth/callback
```

**Also add your Supabase auth redirect** (if not already there):
```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

**Keep existing URIs** for local development:
```
http://localhost:3000/auth/callback
```

### 2.3: Add Authorized Origins

In **"Authorized JavaScript origins"** section, add:

```
https://www.aimademethis.com
https://aimademethis.com
```

Keep:
```
http://localhost:3000
```

### 2.4: Save Changes

Click **"Save"** at the bottom.

**Note:** Google OAuth changes take effect immediately (no approval needed for existing verified domains).

---

## Step 3: Update GitHub OAuth Configuration

### 3.1: Find Your GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **"OAuth Apps"** in left sidebar
3. Find your app (created for Supabase auth)
4. Click on it to edit

### 3.2: Update Redirect URIs

**Important:** GitHub OAuth allows only **ONE** Authorization callback URL.

**For Production:**
- **Authorization callback URL:** `https://<your-project-ref>.supabase.co/auth/v1/callback`

This is your **Supabase auth URL**, not your site URL. Supabase handles the final redirect to your site.

**For Local Development:**
You may need to create a **separate GitHub OAuth App** for development:
- Create a new OAuth App
- Set callback URL to: `http://<your-supabase-project>.supabase.co/auth/v1/callback`
- Use different Client ID/Secret in local environment

### 3.3: Update Homepage URL

- **Homepage URL:** `https://www.aimademethis.com`

### 3.4: Save Changes

Click **"Update application"**.

---

## Step 4: Verify Configuration in Supabase

### 4.1: Check Google OAuth Settings

In Supabase Dashboard:
1. Go to: **Authentication → Providers**
2. Find **"Google"** provider
3. Verify:
   - **Enabled:** ✅ Yes
   - **Client ID:** Correct Google OAuth Client ID
   - **Client Secret:** Correct Google OAuth Client Secret
   - **Redirect URL:** Shows your Supabase callback URL (copy this for Google Console)

### 4.2: Check GitHub OAuth Settings

1. Go to: **Authentication → Providers**
2. Find **"GitHub"** provider
3. Verify:
   - **Enabled:** ✅ Yes
   - **Client ID:** Correct GitHub OAuth App Client ID
   - **Client Secret:** Correct GitHub OAuth App Client Secret
   - **Redirect URL:** Shows your Supabase callback URL (copy this for GitHub App)

---

## Step 5: Update Your Code (if needed)

Check `lib/auth/actions.ts` line 17:

```typescript
redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
```

This should be correct already. It uses the environment variable which you'll set to production URL.

---

## Step 6: Deploy with Updated Environment Variable

After updating `NEXT_PUBLIC_SITE_URL` in Vercel:

```bash
vercel --prod
```

Or trigger redeploy from Vercel dashboard.

---

## Step 7: Test OAuth Flows

### Test Google Login:

1. Open incognito/private browser window
2. Go to: `https://www.aimademethis.com`
3. Click **"Sign Up"** or **"Log In"**
4. Click **"Continue with Google"**
5. Complete Google OAuth flow
6. **Verify:** You're redirected back to `https://www.aimademethis.com` (not localhost or test URL)
7. **Verify:** You're logged in (see dashboard/profile)

### Test GitHub Login:

1. Open incognito/private browser window
2. Go to: `https://www.aimademethis.com`
3. Click **"Sign Up"** or **"Log In"**
4. Click **"Continue with GitHub"**
5. Complete GitHub OAuth flow
6. **Verify:** You're redirected back to `https://www.aimademethis.com`
7. **Verify:** You're logged in

### Test Email/Password:

1. Sign up with email/password
2. Verify email confirmation works
3. Log out and log back in
4. **Verify:** All redirects go to production URL

---

## Troubleshooting

### Issue: "Redirect URI mismatch" error

**Cause:** The redirect URI sent by your app doesn't match any URI configured in OAuth provider.

**Fix:**
1. Check the exact error message - it shows what URI your app sent
2. Add that exact URI to Google/GitHub OAuth settings
3. Ensure no trailing slashes (use either with or without, but be consistent)
4. Ensure protocol matches (https vs http)

---

### Issue: Redirects to localhost after OAuth

**Cause:** `NEXT_PUBLIC_SITE_URL` is still set to localhost in production.

**Fix:**
1. Verify environment variable in Vercel is set to production URL
2. Verify variable is set for "Production" environment (not just Preview)
3. Redeploy application
4. Clear browser cache and try again

---

### Issue: GitHub OAuth works locally but not in production

**Cause:** GitHub only allows one callback URL per OAuth App.

**Fix:**
1. Create separate GitHub OAuth Apps:
   - One for production (callback to Supabase production URL)
   - One for development (callback to Supabase development URL)
2. Use different Client ID/Secret in each environment
3. Set up environment-specific secrets in Vercel

---

### Issue: Google OAuth works but user data is wrong

**Cause:** Different OAuth clients for different environments sharing same database.

**Fix:**
1. Use same Google OAuth Client ID for all environments
2. Add all redirect URIs to that single client
3. Or use separate Supabase projects for dev vs. prod

---

## Summary Checklist

### Supabase Configuration:
- [ ] Added `https://www.aimademethis.com/auth/callback` to Redirect URLs
- [ ] Added `https://aimademethis.com/auth/callback` to Redirect URLs
- [ ] Updated Site URL to `https://www.aimademethis.com`
- [ ] Verified Google provider is enabled with correct credentials
- [ ] Verified GitHub provider is enabled with correct credentials

### Google OAuth Configuration:
- [ ] Added production redirect URIs to authorized redirect URIs
- [ ] Added production origins to authorized JavaScript origins
- [ ] Saved changes in Google Cloud Console

### GitHub OAuth Configuration:
- [ ] Updated Authorization callback URL to Supabase callback
- [ ] Updated Homepage URL to production URL
- [ ] Saved changes in GitHub settings

### Vercel Configuration:
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://www.aimademethis.com` for Production
- [ ] Redeployed application with new environment variable

### Testing:
- [ ] Tested Google OAuth login in production
- [ ] Tested GitHub OAuth login in production
- [ ] Tested email/password signup in production
- [ ] Verified all redirects go to production URL
- [ ] Tested logout and login again

---

## Additional Notes

### Multiple Environments Strategy

If you want to maintain both test and production environments:

**Option A: Single OAuth Client (Recommended)**
- Use same OAuth credentials in all environments
- Add all redirect URIs (localhost, test, production) to single OAuth client
- Simpler to manage, single source of truth

**Option B: Separate OAuth Clients**
- Create separate OAuth clients for dev/test/prod
- Use environment variables to switch between them
- More complex but isolated environments

For most cases, **Option A is recommended** for simplicity.

---

## Environment Variable Summary

**Production (Vercel):**
```bash
NEXT_PUBLIC_SITE_URL=https://www.aimademethis.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# ... other variables
```

**Local Development (.env.local):**
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# ... other variables
```

---

**After completing all steps, OAuth redirects will work correctly in production!** ✅

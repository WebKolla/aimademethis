# OAuth Setup Guide

Google and GitHub OAuth buttons have been added to both the login and signup pages.

## What's Been Implemented

✅ OAuth buttons for Google and GitHub on login page
✅ OAuth buttons for Google and GitHub on signup page
✅ OAuth callback handler at `/auth/callback`
✅ Automatic profile creation for OAuth users
✅ Username generation from OAuth metadata

## Supabase Configuration Required

To enable OAuth, you need to configure the providers in your Supabase dashboard:

### 1. Go to Supabase Dashboard
1. Navigate to **Authentication > Providers**
2. Enable the OAuth providers you want to use

### 2. Configure Google OAuth

1. **Create Google OAuth credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Add Authorized redirect URIs:
     ```
     https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
     ```

2. **In Supabase Dashboard:**
   - Go to **Authentication > Providers > Google**
   - Toggle **Enable**
   - Enter your Google **Client ID**
   - Enter your Google **Client Secret**
   - Save changes

### 3. Configure GitHub OAuth

1. **Create GitHub OAuth App:**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click **New OAuth App**
   - Fill in the details:
     - Application name: `AIMadeThis`
     - Homepage URL: `https://yourdomain.com` or `http://localhost:3001`
     - Authorization callback URL:
       ```
       https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
       ```
   - Click **Register application**
   - Generate a new client secret

2. **In Supabase Dashboard:**
   - Go to **Authentication > Providers > GitHub**
   - Toggle **Enable**
   - Enter your GitHub **Client ID**
   - Enter your GitHub **Client Secret**
   - Save changes

### 4. Configure Redirect URLs (Important!)

In your Supabase dashboard:
1. Go to **Authentication > URL Configuration**
2. Add your site URLs to **Redirect URLs**:
   ```
   http://localhost:3001/auth/callback
   https://yourdomain.com/auth/callback
   ```

## How It Works

1. User clicks "Google" or "GitHub" button
2. They're redirected to the OAuth provider (Google/GitHub)
3. After authentication, they're redirected to `/auth/callback`
4. The callback handler:
   - Exchanges the code for a session
   - Checks if user has a profile
   - Creates a profile automatically if needed
   - Redirects to homepage

## Profile Creation for OAuth Users

When a user signs in with OAuth for the first time, a profile is automatically created using:
- **Username**: From OAuth metadata (`user_name`, `preferred_username`, or email prefix)
- **Full Name**: From OAuth metadata (`full_name` or `name`)
- **Avatar**: From OAuth metadata (`avatar_url` or `picture`)

## Testing

1. Make sure your environment variables are set:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3001
   ```

2. Visit http://localhost:3001/login or http://localhost:3001/signup
3. Click on "Google" or "GitHub" button
4. Complete the OAuth flow
5. You should be redirected back and logged in

## Troubleshooting

**OAuth redirect fails:**
- Check that redirect URLs are configured in Supabase
- Verify OAuth credentials are correct
- Check browser console for errors

**Profile not created:**
- Check Supabase logs in Dashboard
- Verify RLS policies allow profile insertion
- Check that the profiles table exists

**Username conflicts:**
- The system generates unique usernames from OAuth metadata
- If username exists, you may need to add conflict handling logic

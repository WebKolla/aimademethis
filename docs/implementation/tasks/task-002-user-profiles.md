# Task 002: User Profile Pages

**Priority:** 🟡 High
**Estimated Time:** 4-6 hours
**Dependencies:** Task 001 (Database Setup)
**Status:** ✅ Complete

---

## Overview

Implement user profile functionality including profile viewing, editing, and displaying user's submitted products. Users should be able to view their own profile and other users' public profiles.

---

## Objectives

- [ ] Create profile view page (`/profile/[username]`)
- [ ] Create profile edit page (`/profile/settings`)
- [ ] Implement avatar upload to Supabase Storage
- [ ] Display user's submitted products
- [ ] Show profile statistics (products, upvotes received)
- [ ] Add social links display
- [ ] Handle profile not found (404)

---

## Prerequisites

- Task 001 completed (Database Setup)
- profiles table exists in Supabase
- Supabase Storage bucket created for avatars
- User authentication working

---

## Implementation Steps

### Step 1: Create Supabase Storage Bucket

1. Go to Supabase Dashboard → **Storage**
2. Click **New bucket**
3. Name: `avatars`
4. **Public bucket:** Yes (for public profile pictures)
5. Click **Create bucket**

6. Set up storage policies:

Go to **Storage → Policies** and create these policies for the `avatars` bucket:

**Policy 1: Public read access**
```sql
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

**Policy 2: Authenticated users can upload avatars**
```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3: Users can update their own avatar**
```sql
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 4: Users can delete their own avatar**
```sql
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 2: Create Profile Page Component

Create `app/profile/[username]/page.tsx`:

```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileTabs } from '@/components/profile/profile-tabs';

interface PageProps {
  params: { username: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, bio')
    .eq('username', params.username)
    .single();

  if (!profile) {
    return {
      title: 'Profile Not Found',
    };
  }

  return {
    title: `${profile.full_name || profile.username} - AIMadeThis`,
    description: profile.bio || `View ${profile.username}'s profile and AI products`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const supabase = await createClient();

  // Fetch profile data
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      products:products(count)
    `)
    .eq('username', params.username)
    .single();

  if (error || !profile) {
    notFound();
  }

  // Get current user to check if viewing own profile
  const { data: { user } } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
      <ProfileTabs username={params.username} />
    </div>
  );
}
```

### Step 3: Create Profile Header Component

Create `components/profile/profile-header.tsx`:

```typescript
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Settings, Globe, Twitter, Github } from 'lucide-react';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  products: { count: number }[];
};

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const productCount = profile.products?.[0]?.count ?? 0;

  return (
    <div className="mb-8">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.username}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              {profile.username[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold">{profile.full_name || profile.username}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>

            {isOwnProfile && (
              <Button asChild variant="outline">
                <Link href="/profile/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-muted-foreground mb-4">{profile.bio}</p>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-4 mb-4">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
            {profile.twitter && (
              <a
                href={`https://twitter.com/${profile.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </a>
            )}
            {profile.github && (
              <a
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div>
              <span className="text-2xl font-bold">{productCount}</span>
              <span className="text-sm text-muted-foreground ml-1">Products</span>
            </div>
            {/* Add more stats as features are implemented */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Create Profile Tabs Component

Create `components/profile/profile-tabs.tsx`:

```typescript
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProducts } from './user-products';

interface ProfileTabsProps {
  username: string;
}

export function ProfileTabs({ username }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <UserProducts username={username} />
      </TabsContent>

      <TabsContent value="bookmarks">
        <div className="text-center py-12 text-muted-foreground">
          Bookmarks feature coming soon
        </div>
      </TabsContent>

      <TabsContent value="activity">
        <div className="text-center py-12 text-muted-foreground">
          Activity feed coming soon
        </div>
      </TabsContent>
    </Tabs>
  );
}
```

### Step 5: Add Tabs Component from shadcn/ui

```bash
npx shadcn@latest add tabs
```

### Step 6: Create User Products Component

Create `components/profile/user-products.tsx`:

```typescript
"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProductCard } from '@/components/products/product-card';
import type { Database } from '@/types/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface UserProductsProps {
  username: string;
}

export function UserProducts({ username }: UserProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient();

      // Get user ID from username
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!profile) return;

      // Fetch user's products
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', profile.id)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (data) {
        setProducts(data);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [username]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No products submitted yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Note:** ProductCard component will be created in Task 004 (Product Listing). For now, use a placeholder.

### Step 7: Create Profile Edit Page

Create `app/profile/settings/page.tsx`:

```typescript
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProfileEditForm } from '@/components/profile/profile-edit-form';

export const metadata = {
  title: 'Edit Profile - AIMadeThis',
  description: 'Edit your profile settings',
};

export default async function ProfileSettingsPage() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/profile/settings');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // This shouldn't happen, but handle it gracefully
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      <ProfileEditForm profile={profile} />
    </div>
  );
}
```

### Step 8: Create Profile Edit Form Component

Create `components/profile/profile-edit-form.tsx`:

```typescript
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const profileSchema = z.object({
  full_name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal('')),
  twitter: z.string().max(50).optional(),
  github: z.string().max(50).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  profile: Profile;
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name || '',
      bio: profile.bio || '',
      website: profile.website || '',
      twitter: profile.twitter || '',
      github: profile.github || '',
    },
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file
      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        return;
      }

      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name || null,
          bio: data.bio || null,
          website: data.website || null,
          twitter: data.twitter || null,
          github: data.github || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Redirect to profile page
      router.push(`/profile/${profile.username}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-md">
          {error}
        </div>
      )}

      {/* Avatar Upload */}
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                {profile.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('avatar')?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Max 2MB. JPG, PNG, or GIF.
            </p>
          </div>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          placeholder="Your full name"
          {...register('full_name')}
        />
        {errors.full_name && (
          <p className="text-sm text-red-500">{errors.full_name.message}</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          rows={4}
          {...register('bio')}
        />
        {errors.bio && (
          <p className="text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://example.com"
          {...register('website')}
        />
        {errors.website && (
          <p className="text-sm text-red-500">{errors.website.message}</p>
        )}
      </div>

      {/* Twitter */}
      <div className="space-y-2">
        <Label htmlFor="twitter">Twitter Username</Label>
        <Input
          id="twitter"
          placeholder="username (without @)"
          {...register('twitter')}
        />
        {errors.twitter && (
          <p className="text-sm text-red-500">{errors.twitter.message}</p>
        )}
      </div>

      {/* GitHub */}
      <div className="space-y-2">
        <Label htmlFor="github">GitHub Username</Label>
        <Input
          id="github"
          placeholder="username"
          {...register('github')}
        />
        {errors.github && (
          <p className="text-sm text-red-500">{errors.github.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/profile/${profile.username}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

### Step 9: Add Textarea Component from shadcn/ui

```bash
npx shadcn@latest add textarea
```

### Step 10: Update Protected Routes

Update `lib/supabase/middleware.ts` to include profile settings:

```typescript
// Protected routes
const protectedRoutes = [
  '/products/new',
  '/profile/settings', // Add this line
];
```

---

## Testing Checklist

- [ ] Profile page loads for existing users
- [ ] Profile page shows 404 for non-existent users
- [ ] Avatar displays correctly (with fallback)
- [ ] Social links work correctly
- [ ] Product count shows correctly
- [ ] Edit profile button only shows for own profile
- [ ] Profile settings page requires authentication
- [ ] Avatar upload works (< 2MB images)
- [ ] Profile form validation works
- [ ] Profile updates save correctly
- [ ] Profile redirects after save
- [ ] Bio supports line breaks
- [ ] URLs are validated

---

## Files Created/Modified

### Created:
- `app/profile/[username]/page.tsx`
- `app/profile/settings/page.tsx`
- `components/profile/profile-header.tsx`
- `components/profile/profile-tabs.tsx`
- `components/profile/user-products.tsx`
- `components/profile/profile-edit-form.tsx`

### Modified:
- `lib/supabase/middleware.ts` (add /profile/settings to protected routes)

---

## Next Steps

- Proceed to **Task 003:** Product Submission
- After products are implemented, come back and enhance the profile page with actual product listings

---

**Success Criteria:**

✅ Task is complete when:
1. Users can view their own profile
2. Users can view other users' profiles
3. Users can edit their profile information
4. Avatar upload works correctly
5. Profile statistics display correctly
6. 404 page shows for non-existent profiles
7. Protected routes work correctly

---

**Estimated Time:** 4-6 hours
**Actual Time:** ___ hours
**Completed By:** ___________
**Completion Date:** ___________

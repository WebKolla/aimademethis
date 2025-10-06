import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileHeader } from "@/components/profile/profile-header";
import { UserProducts } from "@/components/profile/user-products";
import type { Metadata } from "next";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, bio")
    .eq("username", params.username)
    .single();

  if (!profile) {
    return {
      title: "Profile Not Found",
    };
  }

  return {
    title: `${profile.full_name || profile.username} | AIMadeThis`,
    description: profile.bio || `View ${profile.username}'s AI products and profile`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single();

  if (error || !profile) {
    notFound();
  }

  const isOwnProfile = user?.id === profile.id;

  // Fetch user's products (show drafts only if it's their own profile)
  const productsQuery = supabase
    .from("products")
    .select(
      `
      *,
      categories (name, slug)
    `
    )
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  // Only show published products if viewing someone else's profile
  if (!isOwnProfile) {
    productsQuery.eq("status", "published");
  }

  const { data: products } = await productsQuery;

  // Get product count
  const productCount = products?.length || 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <ProfileHeader
            profile={profile}
            productCount={productCount}
            isOwnProfile={isOwnProfile}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Products</h2>
          {isOwnProfile && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Your submitted products (including drafts)
            </p>
          )}
        </div>

        <UserProducts products={products || []} />
      </div>
    </div>
  );
}

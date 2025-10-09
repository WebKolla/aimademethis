import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFollowing, isFollowing } from "@/lib/follows/actions";
import { UserCard } from "@/components/follows/user-card";
import { ProfileNav } from "@/components/profile/profile-nav";
import type { Metadata } from "next";
import type { Database } from "@/types/database.types";

interface FollowingPageProps {
  params: Promise<{
    username: string;
  }>;
}

type Follow = {
  following_id: string;
  created_at: string;
  following: Database["public"]["Tables"]["profiles"]["Row"] | null;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: FollowingPageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { username } = await params;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("username", username)
    .single();

  if (!profile) {
    return {
      title: "Profile Not Found",
    };
  }

  return {
    title: `${profile.full_name || profile.username} is Following | AIMadeThis`,
    description: `See who ${profile.username} follows on AIMadeThis`,
  };
}

export default async function FollowingPage({ params }: FollowingPageProps) {
  const supabase = await createClient();
  const { username } = await params;

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !profile) {
    notFound();
  }

  const isOwnProfile = user?.id === profile.id;

  // Fetch following
  const { following } = await getFollowing(profile.id);

  // Get follow status for each user if current user is logged in
  const followingWithStatus = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (following as any[]).map(async (follow: any) => {
      if (!follow.following) return null;

      const followStatus = user ? await isFollowing(follow.following.id) : { isFollowing: false };

      return {
        profile: follow.following,
        isFollowing: followStatus.isFollowing,
        isOwnProfile: user?.id === follow.following.id,
      };
    })
  );

  const validFollowing = followingWithStatus.filter((f) => f !== null);

  return (
    <div className="min-h-screen">
      {/* Profile Navigation */}
      <ProfileNav username={username} isOwnProfile={isOwnProfile} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Following
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {validFollowing.length} {validFollowing.length === 1 ? "user" : "users"}
            </p>
          </div>

          {validFollowing.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Not following anyone yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isOwnProfile
                  ? "Start following makers to see their products"
                  : `${profile.username} isn't following anyone yet`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {validFollowing.map((follow) => (
                <UserCard
                  key={follow!.profile.id}
                  profile={follow!.profile}
                  isFollowing={follow!.isFollowing}
                  showFollowButton={!!user}
                  isOwnProfile={follow!.isOwnProfile}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

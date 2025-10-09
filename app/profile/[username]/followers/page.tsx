import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFollowers, isFollowing } from "@/lib/follows/actions";
import { UserCard } from "@/components/follows/user-card";
import { ProfileNav } from "@/components/profile/profile-nav";
import type { Metadata } from "next";
import type { Database } from "@/types/database.types";

interface FollowersPageProps {
  params: Promise<{
    username: string;
  }>;
}

type Follow = {
  follower_id: string;
  created_at: string;
  follower: Database["public"]["Tables"]["profiles"]["Row"] | null;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: FollowersPageProps): Promise<Metadata> {
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
    title: `${profile.full_name || profile.username}'s Followers | AIMadeThis`,
    description: `View who follows ${profile.username} on AIMadeThis`,
  };
}

export default async function FollowersPage({ params }: FollowersPageProps) {
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

  // Fetch followers
  const { followers } = await getFollowers(profile.id);

  // Get follow status for each follower if user is logged in
  const followersWithStatus = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (followers as any[]).map(async (follow: any) => {
      if (!follow.follower) return null;

      const followStatus = user ? await isFollowing(follow.follower.id) : { isFollowing: false };

      return {
        profile: follow.follower,
        isFollowing: followStatus.isFollowing,
        isOwnProfile: user?.id === follow.follower.id,
      };
    })
  );

  const validFollowers = followersWithStatus.filter((f) => f !== null);

  return (
    <div className="min-h-screen">
      {/* Profile Navigation */}
      <ProfileNav username={username} isOwnProfile={isOwnProfile} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Followers
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {validFollowers.length} {validFollowers.length === 1 ? "follower" : "followers"}
            </p>
          </div>

          {validFollowers.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No followers yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isOwnProfile
                  ? "When people follow you, they'll appear here"
                  : `${profile.username} doesn't have any followers yet`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {validFollowers.map((follower) => (
                <UserCard
                  key={follower!.profile.id}
                  profile={follower!.profile}
                  isFollowing={follower!.isFollowing}
                  showFollowButton={!!user}
                  isOwnProfile={follower!.isOwnProfile}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

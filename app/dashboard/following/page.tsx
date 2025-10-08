import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getFollowingFeed } from "@/lib/follows/actions";
import { FollowingFeed } from "@/components/following/following-feed";
import { Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FollowingPage({
  searchParams,
}: {
  searchParams: { sort?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const sortBy = (searchParams.sort === "trending" ? "trending" : "newest") as
    | "newest"
    | "trending";
  const { products, error } = await getFollowingFeed(sortBy);

  // Get following count
  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", user.id)
    .not("following_id", "is", null);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Following Feed</h1>
              <p className="text-gray-400 text-sm mt-1">
                Discover products from creators you follow
              </p>
            </div>
          </div>

          {followingCount !== null && followingCount > 0 && (
            <p className="text-gray-500 text-sm">
              You&apos;re following {followingCount}{" "}
              {followingCount === 1 ? "creator" : "creators"}
            </p>
          )}
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No products yet
              </h3>
              <p className="text-gray-400 mb-6">
                {followingCount === 0
                  ? "Start following creators to see their products here"
                  : "The creators you follow haven't posted any products yet"}
              </p>
              {followingCount === 0 && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Link href="/products">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Explore Products
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/profile">View Profile</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <FollowingFeed products={products} initialSort={sortBy} />
        )}
      </div>
    </DashboardLayout>
  );
}

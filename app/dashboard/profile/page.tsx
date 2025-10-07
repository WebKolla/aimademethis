import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { Package, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "My Profile | AIMadeThis",
  description: "Manage your profile and view your products",
};

export default async function DashboardProfilePage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  // Fetch user's products
  const { data: products, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">
            Manage your profile information and view your products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Update your profile details and avatar
                </p>
              </div>
              <ProfileEditForm profile={profile} />
            </div>
          </div>

          {/* Right Column - Stats & Quick Links */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Products</span>
                  <span className="text-2xl font-bold text-white">
                    {count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Profile Views</span>
                  <span className="text-2xl font-bold text-white">-</span>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Recent Products
                </h3>
                <Link
                  href="/dashboard/products"
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  View All
                </Link>
              </div>

              {!products || products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-4">
                    You haven&apos;t added any products yet
                  </p>
                  <Link
                    href="/dashboard/products/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Add Your First Product
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                    >
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name || "Product"}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate group-hover:text-purple-400 transition-colors">
                          {product.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {product.status === "published"
                            ? "Published"
                            : "Draft"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Public Profile Link */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Public Profile
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                View your profile as others see it
              </p>
              <Link
                href={`/profile/${profile.username}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm w-full justify-center"
              >
                View Public Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

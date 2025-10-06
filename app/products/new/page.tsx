import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/products/actions";
import { ProductSubmissionForm } from "@/components/products/product-submission-form";
import { ProfileNav } from "@/components/profile/profile-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Product | AIMadeThis",
  description: "Submit your AI-powered product to AIMadeThis",
};

export default async function NewProductPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/products/new");
  }

  // Fetch user's profile for username
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  // Fetch categories
  const { categories } = await getCategories();

  return (
    <div className="min-h-screen">
      {/* Profile Navigation */}
      {profile && <ProfileNav username={profile.username} isOwnProfile={true} />}

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Submit a Product</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your AI-powered product with the community. Fields marked with * are
            required.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <ProductSubmissionForm categories={categories} />
        </div>
      </div>
    </div>
  );
}

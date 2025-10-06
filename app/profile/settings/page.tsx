import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { ProfileNav } from "@/components/profile/profile-nav";

export const metadata = {
  title: "Profile Settings | AIMadeThis",
  description: "Edit your profile settings",
};

export default async function ProfileSettingsPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile/settings");
  }

  // Fetch user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-red-600">Failed to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Profile Navigation */}
      <ProfileNav username={profile.username} isOwnProfile={true} />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Profile Settings</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your profile information and preferences
            </p>
          </div>

          <div className="rounded-lg border bg-white dark:bg-gray-950 p-8">
            <ProfileEditForm profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}

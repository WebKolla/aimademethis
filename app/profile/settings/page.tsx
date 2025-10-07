import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

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
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">
            Manage your profile information and preferences
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <ProfileEditForm profile={profile} />
        </div>
      </div>
    </DashboardLayout>
  );
}

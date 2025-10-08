import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { User } from "lucide-react";

export const metadata = {
  title: "Settings | AIMadeThis Dashboard",
  description: "Manage your account settings and profile information",
};

export default async function DashboardSettingsPage() {
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

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your account settings and profile information
          </p>
        </div>

        {/* Settings Content */}
        <div className="max-w-3xl">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8">
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
      </div>
    </DashboardLayout>
  );
}

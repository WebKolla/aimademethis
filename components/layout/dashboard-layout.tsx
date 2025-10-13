import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayoutClient } from "./dashboard-layout-client";

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  // Use full name if available, fallback to username
  const displayName = profile.full_name || profile.username;

  return (
    <DashboardLayoutClient
      displayName={displayName}
      avatarUrl={profile.avatar_url}
    >
      {children}
    </DashboardLayoutClient>
  );
}

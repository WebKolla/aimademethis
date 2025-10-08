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
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  return (
    <DashboardLayoutClient
      username={profile.username}
      avatarUrl={profile.avatar_url}
    >
      {children}
    </DashboardLayoutClient>
  );
}

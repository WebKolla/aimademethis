import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { redirect } from "next/navigation";

export default async function DashboardSettingsPage() {
  // Redirect to existing settings page
  redirect("/profile/settings");
}

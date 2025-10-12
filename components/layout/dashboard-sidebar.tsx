"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  User,
  Settings,
  LogOut,
  Home,
  Bookmark,
  Users,
  Bell,
  Crown,
  Sparkles,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth/actions";
import { useSubscription } from "@/components/providers/subscription-provider";

interface DashboardSidebarProps {
  username: string;
  _avatarUrl?: string | null; // Reserved for future avatar display (prefixed with _ to suppress unused warning)
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Following",
    href: "/dashboard/following",
    icon: Users,
  },
  {
    title: "My Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Add Product",
    href: "/dashboard/products/new",
    icon: Plus,
  },
  {
    title: "Badges",
    href: "/dashboard/badges",
    icon: Award,
  },
  {
    title: "Bookmarks",
    href: "/dashboard/bookmarks",
    icon: Bookmark,
  },
  {
    title: "Followed Products",
    href: "/dashboard/followed",
    icon: Bell,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar({ username, _avatarUrl }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { subscription } = useSubscription();

  const handleSignOut = async () => {
    await signOut();
  };

  const isFree = !subscription || subscription.planName === "free";
  const isPro = subscription?.planName === "pro";
  const isProPlus = subscription?.planName === "pro_plus";

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-900">
      {/* Logo/Brand */}
      <div className="border-b border-gray-800 p-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            aimademethis
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {username}
            </p>
            <div className="flex items-center gap-1">
              {isProPlus && (
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Pro Plus
                </span>
              )}
              {isPro && (
                <span className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Pro
                </span>
              )}
              {isFree && (
                <span className="text-xs text-gray-400">Free Plan</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          // Exact match for dashboard home, otherwise check if path starts with the href
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-800 p-4 space-y-2">
        {/* Upgrade Button - Always visible */}
        <Button
          className="w-full justify-start bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg"
          asChild
        >
          <Link href="/pricing">
            <Crown className="h-5 w-5 mr-3" />
            {isFree ? "Upgrade to Pro" : "Manage Plan"}
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          asChild
        >
          <Link href="/">
            <Home className="h-5 w-5 mr-3" />
            Back to Home
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

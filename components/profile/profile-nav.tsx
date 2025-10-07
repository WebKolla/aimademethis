"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Settings, Package, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileNavProps {
  username: string;
  isOwnProfile?: boolean;
}

export function ProfileNav({ username, isOwnProfile }: ProfileNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      show: true,
    },
    {
      href: `/profile/${username}`,
      label: "Profile",
      icon: User,
      show: true,
    },
    {
      href: "/profile/settings",
      label: "Settings",
      icon: Settings,
      show: isOwnProfile,
    },
    {
      href: "/products/new",
      label: "Submit Product",
      icon: Package,
      show: isOwnProfile,
    },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur">
      <div className="container mx-auto px-4">
        <nav className="flex gap-1 overflow-x-auto py-2">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-teal-100 dark:bg-teal-900/30 text-teal-900 dark:text-teal-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
        </nav>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardLayoutClientProps {
  displayName: string;
  avatarUrl: string | null;
  children: React.ReactNode;
}

export function DashboardLayoutClient({
  displayName,
  avatarUrl,
  children,
}: DashboardLayoutClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <DashboardSidebar displayName={displayName} _avatarUrl={avatarUrl} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile/Tablet Header with Hamburger */}
        <div className="lg:hidden flex items-center gap-4 border-b border-gray-800 bg-gray-900 p-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-gray-900 border-gray-800">
              <DashboardSidebar displayName={displayName} _avatarUrl={avatarUrl} />
            </SheetContent>
          </Sheet>
          <Logo textClassName="text-xl" variant="default" />
        </div>

        {/* Content Area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

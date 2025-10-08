"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardLayoutClientProps {
  username: string;
  avatarUrl: string | null;
  children: React.ReactNode;
}

export function DashboardLayoutClient({
  username,
  avatarUrl,
  children,
}: DashboardLayoutClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <DashboardSidebar username={username} _avatarUrl={avatarUrl} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header with Hamburger */}
        <div className="md:hidden flex items-center gap-4 border-b border-gray-800 bg-gray-900 p-4">
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
              <DashboardSidebar username={username} _avatarUrl={avatarUrl} />
            </SheetContent>
          </Sheet>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            aimademethis
          </span>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
